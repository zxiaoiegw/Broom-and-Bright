// Business operates in one timezone; staff enter hours in their own local
// wall-clock time and customers see slots converted to their browser's zone
// on the frontend. All the "is this staff working right now" math below
// happens in this fixed zone, computed via Intl so it's DST-correct without
// pulling in a date library.
export const BUSINESS_TIMEZONE = "America/Chicago";

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getLocalWeekdayAndMinutes(
  instant: Date,
  timeZone: string = BUSINESS_TIMEZONE,
): { weekday: number; minutesSinceMidnight: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(instant);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value])) as Record<string, string>;
  const weekday = WEEKDAY_INDEX[map.weekday] ?? 0;
  // Some environments render midnight as "24" with hour12:false — normalize.
  const hour = Number(map.hour) % 24;
  return { weekday, minutesSinceMidnight: hour * 60 + Number(map.minute) };
}

export function getLocalDateString(instant: Date, timeZone: string = BUSINESS_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    instant,
  );
}

export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Converts a wall-clock date + time in `timeZone` to the UTC instant it
 * represents — the inverse of getLocalWeekdayAndMinutes. DST-correct without
 * a date library: guess the instant by treating the wall time as UTC, then
 * measure how far that guess actually lands from the target zone and correct
 * by the difference (the guess is always within a day of the real answer, so
 * this converges in one step even across a DST boundary).
 */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string = BUSINESS_TIMEZONE): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));

  const partsInZone = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(guess);
  const map = Object.fromEntries(partsInZone.map((p) => [p.type, p.value])) as Record<string, string>;
  const asIfUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second),
  );

  return new Date(guess.getTime() + (guess.getTime() - asIfUtc));
}

interface RuleWindow {
  weekday: number;
  startTime: string;
  endTime: string;
}

interface OverrideWindow {
  isAvailable: boolean;
  startTime: string | null;
  endTime: string | null;
}

interface BusyInterval {
  startAt: Date;
  endAt: Date;
}

/**
 * True if a staff member — given their recurring weekly rules, an optional
 * date-specific override, and their already-booked jobs — is free for
 * [startAt, endAt). Does not touch the database; callers load the rows.
 */
export function isStaffAvailable({
  startAt,
  endAt,
  rules,
  override,
  busy,
}: {
  startAt: Date;
  endAt: Date;
  rules: RuleWindow[];
  override?: OverrideWindow;
  busy: BusyInterval[];
}): boolean {
  const { weekday, minutesSinceMidnight: startMin } = getLocalWeekdayAndMinutes(startAt);
  const { minutesSinceMidnight: endMin } = getLocalWeekdayAndMinutes(endAt);
  // Jobs crossing midnight aren't supported — keep the model simple.
  if (endMin <= startMin) return false;

  const windows: { startTime: string; endTime: string }[] = override
    ? override.isAvailable && override.startTime && override.endTime
      ? [{ startTime: override.startTime, endTime: override.endTime }]
      : [] // explicit day off (or a malformed override) → no working windows
    : rules.filter((r) => r.weekday === weekday);

  const withinWorkingHours = windows.some((w) => {
    const wStart = timeStringToMinutes(w.startTime);
    const wEnd = timeStringToMinutes(w.endTime);
    return startMin >= wStart && endMin <= wEnd;
  });
  if (!withinWorkingHours) return false;

  return !busy.some((b) => startAt < b.endAt && endAt > b.startAt);
}

/**
 * Every start time on `date` (a business-local calendar date, "YYYY-MM-DD")
 * where at least one staff member is free for a `durationMinutes` job.
 * Scans the whole day in `stepMinutes` increments — cheap enough at this
 * scale (48 candidates/day × a handful of staff) that there's no need to
 * derive tighter bounds from the rules first.
 */
export function computeAvailableSlots({
  date,
  durationMinutes,
  staffAvailability,
  stepMinutes = 30,
  now = new Date(),
  minLeadMinutes = 120,
}: {
  date: string;
  durationMinutes: number;
  staffAvailability: { rules: RuleWindow[]; override?: OverrideWindow; busy: BusyInterval[] }[];
  stepMinutes?: number;
  now?: Date;
  minLeadMinutes?: number;
}): string[] {
  const slots: string[] = [];
  const earliestAllowed = new Date(now.getTime() + minLeadMinutes * 60_000);

  for (let minutes = 0; minutes + durationMinutes <= 24 * 60; minutes += stepMinutes) {
    const startAt = zonedTimeToUtc(date, minutesToTimeString(minutes));
    if (startAt < earliestAllowed) continue;
    const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);

    const hasAvailableStaff = staffAvailability.some((staff) =>
      isStaffAvailable({ startAt, endAt, rules: staff.rules, override: staff.override, busy: staff.busy }),
    );
    if (hasAvailableStaff) slots.push(startAt.toISOString());
  }

  return slots;
}
