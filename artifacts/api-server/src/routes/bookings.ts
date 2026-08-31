import { Router, type IRouter } from "express";
import multer from "multer";
import { z } from "zod/v4";
import { eq, and, ne } from "drizzle-orm";
import { Resend } from "resend";
import { db, bookingsTable, availabilityRulesTable, availabilityOverridesTable } from "@workspace/db";
import { requireStaffAuth } from "../lib/auth";
import { isStaffAvailable, getLocalDateString } from "../lib/slots";
import { loadStaffAvailabilityForDate } from "../lib/staffAvailability";

const router: IRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
const resend = new Resend(process.env.RESEND_API_KEY);

const SERVICE_TYPES = ["standard", "deep", "moveInOut", "hourly"] as const;

// Matches the estimator in free-quote/pricing.ts — used only when the client
// doesn't send an explicit durationMinutes.
const DEFAULT_DURATION_MINUTES: Record<(typeof SERVICE_TYPES)[number], number> = {
  standard: 120,
  deep: 180,
  moveInOut: 240,
  hourly: 120,
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/* ------------------------------------------------------------------ *
 * Staff-facing: list / reschedule / cancel bookings
 * ------------------------------------------------------------------ */

router.get("/staff/bookings", requireStaffAuth, async (req, res) => {
  const isOwner = req.staff!.role === "owner";
  const queryStaffId = req.query.staffId ? Number(req.query.staffId) : undefined;
  const staffId = isOwner ? queryStaffId : req.staff!.id;

  const conditions = [staffId ? eq(bookingsTable.staffId, staffId) : undefined];
  if (req.query.status) conditions.push(eq(bookingsTable.status, req.query.status as never));

  const rows = await db
    .select()
    .from(bookingsTable)
    .where(and(...conditions.filter(Boolean)))
    .orderBy(bookingsTable.startAt);

  res.json({ bookings: rows });
});

const updateBookingSchema = z.object({
  customerName: z.string().trim().min(1).optional(),
  customerEmail: z.string().trim().email().optional(),
  customerPhone: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  notes: z.string().optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
});

async function loadBookingForStaff(req: import("express").Request, id: number) {
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
  if (!booking) return { booking: null, forbidden: false };
  const forbidden = req.staff!.role !== "owner" && booking.staffId !== req.staff!.id;
  return { booking, forbidden };
}

// Shared by the staff reschedule route and the customer-facing one below —
// true if `staffId`'s existing booking `excludeBookingId` could move to
// [nextStartAt, nextEndAt) without colliding with their own hours/other jobs.
async function isStaffFreeForReschedule(staffId: number, excludeBookingId: number, nextStartAt: Date, nextEndAt: Date) {
  const dateStr = getLocalDateString(nextStartAt);
  const [rules, [override], busyRows] = await Promise.all([
    db.select().from(availabilityRulesTable).where(eq(availabilityRulesTable.staffId, staffId)),
    db
      .select()
      .from(availabilityOverridesTable)
      .where(and(eq(availabilityOverridesTable.staffId, staffId), eq(availabilityOverridesTable.date, dateStr))),
    db
      .select()
      .from(bookingsTable)
      .where(and(eq(bookingsTable.staffId, staffId), ne(bookingsTable.id, excludeBookingId), ne(bookingsTable.status, "cancelled"))),
  ]);

  return isStaffAvailable({
    startAt: nextStartAt,
    endAt: nextEndAt,
    rules,
    override,
    busy: busyRows.map((b) => ({ startAt: b.startAt, endAt: b.endAt })),
  });
}

// Edit details and/or reschedule. When start/end change, re-checks that the
// assigned staff member is actually free for the new window.
router.patch("/staff/bookings/:id", requireStaffAuth, async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const { booking, forbidden } = await loadBookingForStaff(req, id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }
  if (forbidden) {
    res.status(403).json({ error: "Not your booking." });
    return;
  }

  const nextStartAt = parsed.data.startAt ? new Date(parsed.data.startAt) : booking.startAt;
  const nextEndAt = parsed.data.endAt ? new Date(parsed.data.endAt) : booking.endAt;
  const isReschedule = parsed.data.startAt || parsed.data.endAt;

  if (isReschedule && !(await isStaffFreeForReschedule(booking.staffId, booking.id, nextStartAt, nextEndAt))) {
    res.status(409).json({ error: "That staff member isn't available for the new time." });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ ...parsed.data, startAt: nextStartAt, endAt: nextEndAt, updatedAt: new Date() })
    .where(eq(bookingsTable.id, id))
    .returning();

  res.json({ booking: updated });
});

router.post("/staff/bookings/:id/cancel", requireStaffAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { booking, forbidden } = await loadBookingForStaff(req, id);
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }
  if (forbidden) {
    res.status(403).json({ error: "Not your booking." });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookingsTable.id, id))
    .returning();

  res.json({ booking: updated });
});

/* ------------------------------------------------------------------ *
 * Customer-facing: reschedule / cancel their own booking from the
 * confirmation screen. There's no customer login, so the booking's own
 * email is the (lightweight) proof of ownership — good enough for a small
 * local business; not meant to withstand a determined attacker who already
 * knows both the booking id and the customer's email.
 * ------------------------------------------------------------------ */

async function loadBookingForCustomer(id: number, customerEmail: string) {
  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id)).limit(1);
  if (!booking || booking.status === "cancelled") return null;
  if (booking.customerEmail.toLowerCase() !== customerEmail.trim().toLowerCase()) return null;
  return booking;
}

const publicRescheduleSchema = z.object({
  customerEmail: z.string().trim().email(),
  startAt: z.string().datetime(),
});

router.patch("/bookings/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = publicRescheduleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const booking = await loadBookingForCustomer(id, parsed.data.customerEmail);
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  const durationMinutes = (booking.endAt.getTime() - booking.startAt.getTime()) / 60_000;
  const nextStartAt = new Date(parsed.data.startAt);
  const nextEndAt = new Date(nextStartAt.getTime() + durationMinutes * 60_000);

  if (!(await isStaffFreeForReschedule(booking.staffId, booking.id, nextStartAt, nextEndAt))) {
    res.status(409).json({ error: "That time is no longer available. Please pick another." });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ startAt: nextStartAt, endAt: nextEndAt, updatedAt: new Date() })
    .where(eq(bookingsTable.id, id))
    .returning();

  res.json({ booking: updated });
});

const publicCancelSchema = z.object({ customerEmail: z.string().trim().email() });

router.post("/bookings/:id/cancel", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = publicCancelSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const booking = await loadBookingForCustomer(id, parsed.data.customerEmail);
  if (!booking) {
    res.status(404).json({ error: "Booking not found." });
    return;
  }

  const [updated] = await db
    .update(bookingsTable)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(bookingsTable.id, id))
    .returning();

  res.json({ booking: updated });
});

/* ------------------------------------------------------------------ *
 * Public: create a booking (auto-assigns whichever staff member is free)
 * ------------------------------------------------------------------ */

const createBookingSchema = z.object({
  customerName: z.string().trim().min(1),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(1),
  address: z.string().trim().min(1),
  serviceType: z.enum(SERVICE_TYPES),
  notes: z.string().optional(),
  startAt: z.string().datetime(),
  durationMinutes: z.coerce.number().int().min(30).max(8 * 60).optional(),
  // Extra context from the free-quote flow, folded into the notification
  // email only — the bookings table doesn't have dedicated columns for
  // per-service pricing detail, so this mirrors what the old quote-request
  // email used to show without expanding the schema for it.
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareFeet: z.string().optional(),
  addons: z.string().optional(),
  frequency: z.string().optional(),
  estimatedTotal: z.string().optional(),
  preferredContact: z.string().optional(),
});

// Multipart (not JSON) so the standard flow's optional photos can ride along,
// same pattern as /quote-requests.
router.post("/bookings", upload.array("photos"), async (req, res) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const {
    customerName,
    customerEmail,
    customerPhone,
    address,
    serviceType,
    notes,
    startAt,
    bedrooms,
    bathrooms,
    squareFeet,
    addons,
    frequency,
    estimatedTotal,
    preferredContact,
  } = parsed.data;
  const durationMinutes = parsed.data.durationMinutes ?? DEFAULT_DURATION_MINUTES[serviceType];
  const startDate = new Date(startAt);
  const endDate = new Date(startDate.getTime() + durationMinutes * 60_000);
  const dateStr = getLocalDateString(startDate);
  const files = (req.files as Express.Multer.File[]) ?? [];

  const staffAvailability = await loadStaffAvailabilityForDate(dateStr);
  if (staffAvailability.length === 0) {
    res.status(503).json({ error: "No staff configured yet. Please contact us directly." });
    return;
  }

  const assigned = staffAvailability.find((ctx) =>
    isStaffAvailable({ startAt: startDate, endAt: endDate, rules: ctx.rules, override: ctx.override, busy: ctx.busy }),
  );

  if (!assigned) {
    res.status(409).json({ error: "That time is no longer available. Please pick another." });
    return;
  }

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      staffId: assigned.staff.id,
      customerName,
      customerEmail,
      customerPhone,
      address,
      serviceType,
      notes,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ?? null,
      squareFeet: squareFeet ?? null,
      addons: addons ?? null,
      frequency: frequency ?? null,
      estimatedTotal: estimatedTotal ?? null,
      preferredContact: preferredContact ?? null,
      startAt: startDate,
      endAt: endDate,
      status: "confirmed",
    })
    .returning();

  try {
    // Owner + whichever staff member got assigned — deduped in case the
    // owner is also the assigned staff (e.g. a solo operation).
    const recipients = [...new Set([process.env.QUOTE_NOTIFICATION_EMAIL!, assigned.staff.email])];

    await resend.emails.send({
      from: "TrueClean KC Website <onboarding@resend.dev>",
      to: recipients,
      subject: `New booking: ${customerName} — ${startDate.toLocaleString("en-US", { timeZone: "America/Chicago" })}`,
      html: `<p><strong>Customer:</strong> ${customerName} (${customerEmail}, ${customerPhone})</p>
             ${preferredContact ? `<p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>` : ""}
             <p><strong>Address:</strong> ${address}</p>
             <p><strong>Service:</strong> ${serviceType}</p>
             ${bedrooms ? `<p><strong>Bedrooms/Bathrooms/SqFt:</strong> ${bedrooms} / ${bathrooms} / ${squareFeet}</p>` : ""}
             ${addons ? `<p><strong>Add-ons:</strong> ${addons}</p>` : ""}
             ${frequency ? `<p><strong>Frequency:</strong> ${frequency}</p>` : ""}
             ${estimatedTotal ? `<p><strong>Estimated Total:</strong> ${estimatedTotal}</p>` : ""}
             <p><strong>Assigned to:</strong> ${assigned.staff.name}</p>
             <p><strong>Time:</strong> ${startDate.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "full", timeStyle: "short" })}</p>
             <p><strong>Estimated Duration:</strong> ${formatDuration(durationMinutes)} (ends ${endDate.toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" })}) — if the job runs long, edit the end time from the staff dashboard so the calendar stays accurate for other bookings.</p>
             <p><strong>Notes:</strong> ${notes ?? ""}</p>`,
      attachments: files.map((file) => ({ filename: file.originalname, content: file.buffer })),
    });
  } catch {
    // Booking is already saved — don't fail the request over a notification email.
  }

  res.status(201).json({ booking });
});

export default router;
