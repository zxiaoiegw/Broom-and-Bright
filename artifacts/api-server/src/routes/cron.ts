import { Router, type IRouter } from "express";
import { and, eq, gte, lt, isNull } from "drizzle-orm";
import { db, bookingsTable } from "@workspace/db";
import { sendCustomerBookingReminder } from "../lib/bookingEmails";
import { getLocalDateString, zonedTimeToUtc, BUSINESS_TIMEZONE } from "../lib/slots";

const router: IRouter = Router();

// Vercel adds `Authorization: Bearer ${CRON_SECRET}` to requests it makes to
// this endpoint on schedule — this rejects anyone else who finds the URL.
function isAuthorizedCronRequest(authHeader: string | undefined): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && authHeader === `Bearer ${secret}`;
}

// Pure calendar-string arithmetic (no timezone conversion involved) — adds
// `days` to a "YYYY-MM-DD" string.
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

/**
 * Sends a "your cleaning is tomorrow" reminder for every confirmed booking
 * whose start falls on tomorrow's business-local calendar date and hasn't
 * been reminded yet, then stamps reminderSentAt so a re-run never
 * double-sends. Meant to be hit once a day by Vercel Cron (see vercel.json).
 *
 * Deliberately keyed off calendar date rather than "starts within the next
 * 24 hours" — that rolling window would send most reminders only a few hours
 * before an afternoon appointment (whenever they happen to fall after this
 * cron's run time), instead of reliably the day before regardless of what
 * time the appointment starts.
 */
router.post("/cron/send-reminders", async (req, res) => {
  if (!isAuthorizedCronRequest(req.headers.authorization)) {
    res.status(401).json({ error: "Unauthorized." });
    return;
  }

  const today = getLocalDateString(new Date(), BUSINESS_TIMEZONE);
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);
  const windowStart = zonedTimeToUtc(tomorrow, "00:00", BUSINESS_TIMEZONE);
  const windowEnd = zonedTimeToUtc(dayAfter, "00:00", BUSINESS_TIMEZONE);

  const due = await db
    .select()
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.status, "confirmed"),
        isNull(bookingsTable.reminderSentAt),
        gte(bookingsTable.startAt, windowStart),
        lt(bookingsTable.startAt, windowEnd),
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
