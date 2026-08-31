import { Router, type IRouter } from "express";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, staffTable, bookingsTable } from "@workspace/db";
import { requireStaffAuth } from "../lib/auth";
import { buildIcsCalendar } from "../lib/ics";

const router: IRouter = Router();

// Generates (or regenerates, invalidating any previous link) a personal
// calendar-feed token for the signed-in staff member — always their own,
// never someone else's, so there's no owner/cleaner distinction needed here.
router.post("/staff/calendar-feed-token", requireStaffAuth, async (req, res) => {
  const token = randomBytes(24).toString("hex");
  await db.update(staffTable).set({ calendarFeedToken: token }).where(eq(staffTable.id, req.staff!.id));
  res.json({ token });
});

router.get("/staff/calendar-feed-token", requireStaffAuth, async (req, res) => {
  const [staff] = await db.select().from(staffTable).where(eq(staffTable.id, req.staff!.id)).limit(1);
  res.json({ token: staff?.calendarFeedToken ?? null });
});

router.delete("/staff/calendar-feed-token", requireStaffAuth, async (req, res) => {
  await db.update(staffTable).set({ calendarFeedToken: null }).where(eq(staffTable.id, req.staff!.id));
  res.json({ success: true });
});

// Public (no login) — the token itself is the credential, same model as a
// Google/Apple "secret address" calendar subscription link. Anyone who has
// it can read that one staff member's schedule; nothing else.
router.get("/calendar-feed/:token", async (req, res) => {
  const [staff] = await db
    .select()
    .from(staffTable)
    .where(eq(staffTable.calendarFeedToken, req.params.token))
    .limit(1);

  if (!staff) {
    res.status(404).send("Not found");
    return;
  }

  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.staffId, staff.id));
  const ics = buildIcsCalendar(staff.name, bookings);

  res.set("Content-Type", "text/calendar; charset=utf-8");
  res.set("Content-Disposition", `inline; filename="truecleankc-${staff.id}.ics"`);
  res.send(ics);
});

export default router;
