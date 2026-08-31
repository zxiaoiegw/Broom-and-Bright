import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import { eq, and } from "drizzle-orm";
import { db, availabilityRulesTable, availabilityOverridesTable } from "@workspace/db";
import { requireStaffAuth } from "../lib/auth";
import { computeAvailableSlots } from "../lib/slots";
import { loadStaffAvailabilityForDate, loadStaffAvailabilityForRange } from "../lib/staffAvailability";

const router: IRouter = Router();

const slotsQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  durationMinutes: z.coerce.number().int().min(30).max(8 * 60),
});

// Public — powers the customer-facing calendar on the free-quote/booking flow.
router.get("/slots", async (req, res) => {
  const parsed = slotsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const { date, durationMinutes } = parsed.data;
  const staffAvailability = await loadStaffAvailabilityForDate(date);
  const slots = computeAvailableSlots({ date, durationMinutes, staffAvailability });
  res.json({ slots });
});

const availableDatesQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  durationMinutes: z.coerce.number().int().min(30).max(8 * 60),
});

// Public — which dates in a range have at least one open slot, so the
// calendar can grey out days off (e.g. weekends nobody works) before the
// customer even clicks one, instead of only finding out after.
router.get("/available-dates", async (req, res) => {
  const parsed = availableDatesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const { from, to, durationMinutes } = parsed.data;
  if (new Date(to).getTime() - new Date(from).getTime() > 93 * 24 * 60 * 60 * 1000) {
    res.status(400).json({ error: "Range too large (max ~93 days)." });
    return;
  }

  const byDate = await loadStaffAvailabilityForRange(from, to);
  const dates = [...byDate.entries()]
    .filter(([date, staffAvailability]) => computeAvailableSlots({ date, durationMinutes, staffAvailability }).length > 0)
    .map(([date]) => date);

  res.json({ dates });
});

/** Owners can manage any staff member's calendar; cleaners only their own. */
function resolveTargetStaffId(req: import("express").Request, queryStaffId?: string): number | null {
  const requested = queryStaffId ? Number(queryStaffId) : undefined;
  if (req.staff!.role === "owner" && requested) return requested;
  return req.staff!.id;
}

router.get("/staff/availability", requireStaffAuth, async (req, res) => {
  const staffId = resolveTargetStaffId(req, req.query.staffId as string | undefined);
  if (!staffId) {
    res.status(400).json({ error: "staffId is required." });
    return;
  }

  const [rules, overrides] = await Promise.all([
    db.select().from(availabilityRulesTable).where(eq(availabilityRulesTable.staffId, staffId)),
    db.select().from(availabilityOverridesTable).where(eq(availabilityOverridesTable.staffId, staffId)),
  ]);

  res.json({ rules, overrides });
});

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const setRulesSchema = z.object({
  staffId: z.number().int().optional(),
  rules: z.array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      startTime: z.string().regex(timeRegex, "Use 24h HH:MM"),
      endTime: z.string().regex(timeRegex, "Use 24h HH:MM"),
    }),
  ),
});

// Replaces the target staff member's entire weekly schedule with the given
// list — simplest mental model for a "set your hours" form (no diffing).
router.put("/staff/availability/rules", requireStaffAuth, async (req, res) => {
  const parsed = setRulesSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const staffId = resolveTargetStaffId(req, parsed.data.staffId?.toString());
  if (!staffId) {
    res.status(400).json({ error: "staffId is required." });
    return;
  }

  await db.transaction(async (tx) => {
    await tx.delete(availabilityRulesTable).where(eq(availabilityRulesTable.staffId, staffId));
    if (parsed.data.rules.length > 0) {
      await tx.insert(availabilityRulesTable).values(parsed.data.rules.map((r) => ({ ...r, staffId })));
    }
  });

  const rules = await db.select().from(availabilityRulesTable).where(eq(availabilityRulesTable.staffId, staffId));
  res.json({ rules });
});

const addOverrideSchema = z.object({
  staffId: z.number().int().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  isAvailable: z.boolean(),
  startTime: z.string().regex(timeRegex).optional(),
  endTime: z.string().regex(timeRegex).optional(),
});

// One-off exception for a single date: a day off, or custom hours that day.
router.post("/staff/availability/overrides", requireStaffAuth, async (req, res) => {
  const parsed = addOverrideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }

  const staffId = resolveTargetStaffId(req, parsed.data.staffId?.toString());
  if (!staffId) {
    res.status(400).json({ error: "staffId is required." });
    return;
  }

  const { date, isAvailable, startTime, endTime } = parsed.data;

  // One override per staff per date — replace if it already exists.
  await db
    .delete(availabilityOverridesTable)
    .where(and(eq(availabilityOverridesTable.staffId, staffId), eq(availabilityOverridesTable.date, date)));

  const [created] = await db
    .insert(availabilityOverridesTable)
    .values({
      staffId,
      date,
      isAvailable,
      startTime: isAvailable ? (startTime ?? null) : null,
      endTime: isAvailable ? (endTime ?? null) : null,
    })
    .returning();

  res.status(201).json({ override: created });
});

router.delete("/staff/availability/overrides/:id", requireStaffAuth, async (req, res) => {
  const id = Number(req.params.id);
  const [existing] = await db
    .select()
    .from(availabilityOverridesTable)
    .where(eq(availabilityOverridesTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Not found." });
    return;
  }
  if (req.staff!.role !== "owner" && existing.staffId !== req.staff!.id) {
    res.status(403).json({ error: "Not your calendar." });
    return;
  }

  await db.delete(availabilityOverridesTable).where(eq(availabilityOverridesTable.id, id));
  res.json({ success: true });
});

export default router;
