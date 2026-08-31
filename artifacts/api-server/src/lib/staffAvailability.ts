import { eq, and, ne, inArray, gte, lte } from "drizzle-orm";
import {
  db,
  staffTable,
  availabilityRulesTable,
  availabilityOverridesTable,
  bookingsTable,
  type Staff,
  type AvailabilityRule,
  type AvailabilityOverride,
} from "@workspace/db";

export interface StaffAvailabilityContext {
  staff: Staff;
  rules: AvailabilityRule[];
  override?: AvailabilityOverride;
  busy: { startAt: Date; endAt: Date }[];
}

/**
 * Loads every staff member's weekly rules, their override (if any) for
 * `date`, and their non-cancelled bookings — everything `isStaffAvailable`
 * and `computeAvailableSlots` need. Shared by the public slot search and the
 * auto-assign booking creator so the two can never disagree about who's free.
 */
export async function loadStaffAvailabilityForDate(date: string): Promise<StaffAvailabilityContext[]> {
  const allStaff = await db.select().from(staffTable);
  if (allStaff.length === 0) return [];
  const staffIds = allStaff.map((s) => s.id);

  const [allRules, allOverrides, allBusy] = await Promise.all([
    db.select().from(availabilityRulesTable).where(inArray(availabilityRulesTable.staffId, staffIds)),
    db
      .select()
      .from(availabilityOverridesTable)
      .where(and(inArray(availabilityOverridesTable.staffId, staffIds), eq(availabilityOverridesTable.date, date))),
    db
      .select()
      .from(bookingsTable)
      .where(and(inArray(bookingsTable.staffId, staffIds), ne(bookingsTable.status, "cancelled"))),
  ]);

  return allStaff.map((staff) => ({
    staff,
    rules: allRules.filter((r) => r.staffId === staff.id),
    override: allOverrides.find((o) => o.staffId === staff.id),
    busy: allBusy.filter((b) => b.staffId === staff.id).map((b) => ({ startAt: b.startAt, endAt: b.endAt })),
  }));
}

/**
 * Loads the same shape as loadStaffAvailabilityForDate, but for every date
 * in [from, to] at once (one set of queries instead of one per day) — used
 * to grey out whole dates on the customer-facing calendar before they pick
 * one, e.g. so a staff member's days off don't even look clickable.
 */
export async function loadStaffAvailabilityForRange(
  from: string,
  to: string,
): Promise<Map<string, StaffAvailabilityContext[]>> {
  const allStaff = await db.select().from(staffTable);
  const byDate = new Map<string, StaffAvailabilityContext[]>();
  if (allStaff.length === 0) return byDate;
  const staffIds = allStaff.map((s) => s.id);

  const [allRules, allOverrides, allBusy] = await Promise.all([
    db.select().from(availabilityRulesTable).where(inArray(availabilityRulesTable.staffId, staffIds)),
    db
      .select()
      .from(availabilityOverridesTable)
      .where(
        and(
          inArray(availabilityOverridesTable.staffId, staffIds),
          gte(availabilityOverridesTable.date, from),
          lte(availabilityOverridesTable.date, to),
        ),
      ),
    db
      .select()
      .from(bookingsTable)
      .where(and(inArray(bookingsTable.staffId, staffIds), ne(bookingsTable.status, "cancelled"))),
  ]);

  for (let d = new Date(`${from}T00:00:00Z`); d <= new Date(`${to}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10);
    byDate.set(
      dateStr,
      allStaff.map((staff) => ({
        staff,
        rules: allRules.filter((r) => r.staffId === staff.id),
        override: allOverrides.find((o) => o.staffId === staff.id && o.date === dateStr),
        busy: allBusy.filter((b) => b.staffId === staff.id).map((b) => ({ startAt: b.startAt, endAt: b.endAt })),
      })),
    );
  }

  return byDate;
}
