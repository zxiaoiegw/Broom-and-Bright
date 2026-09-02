import { Router, type IRouter } from "express";
import { and, eq, gt, lte, isNull } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import { sendCustomerBookingReminder } from "../lib/bookingEmails";

const router: IRouter = Router();

// Vercel adds `Authorization: Bearer ${CRON_SECRET}` to requests it makes to
// this endpoint on schedule — this rejects anyone else who finds the URL.
function isAuthorizedCronRequest(authHeader: string | undefined): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && authHeader === `Bearer ${secret}`;
}

/**
 * Sends a "your cleaning is tomorrow" reminder for every confirmed booking
 * starting within the next 24 hours that hasn't been reminded yet, then
 * stamps reminderSentAt so a re-run (or a job that overlaps this one) never
 * double-sends. Meant to be hit once a day by Vercel Cron (see vercel.json) —
 * the 24h window matches that cadence so nothing falls between runs.
 */
router.post("/cron/send-reminders", async (req, res) => {
  if (!isAuthorizedCronRequest(req.headers.authorization)) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const now = new Date();
  const cutoff = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const due = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.status, "confirmed"),
        isNull(bookingsTable.reminderSentAt),
        gt(bookingsTable.startAt, now),
        lte(bookingsTable.startAt, cutoff),
      ),
    );

  let sent = 0;
  const failures: { id: number; error: string }[] = [];

  for (const booking of due) {
    try {
      await sendCustomerBookingReminder(booking);
      await db.update(bookingsTable).set({ reminderSentAt: new Date() }).where(eq(bookingsTable.id, booking.id));
      sent++;
    } catch (err) {
      // Leave reminderSentAt null so tomorrow's run retries it.
      failures.push({ id: booking.id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  res.json({ checked: due.length, sent, failures });
});

export default router;
