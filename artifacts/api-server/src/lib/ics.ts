import type { Booking } from "@workspace/db";

const SERVICE_LABELS: Record<Booking["serviceType"], string> = {
  standard: "Standard Clean",
  deep: "Deep Clean",
  moveInOut: "Move-In / Move-Out",
  hourly: "Hourly Service",
};

function formatIcsDate(date: Date): string {
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
}

// Escapes the handful of characters iCalendar text values treat specially.
function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/**
 * Renders one staff member's bookings as an RFC 5545 .ics feed, for
 * "subscribe by URL" in Google Calendar / Apple Calendar. Read-only — this
 * is generated fresh on every request from live data, so a calendar app
 * re-polling the URL always sees the current schedule (subject to however
 * often that app checks, typically every few hours).
 */
export function buildIcsCalendar(staffName: string, bookings: Booking[]): string {
  const now = formatIcsDate(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TrueClean KC//Staff Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:TrueClean KC \u2014 ${escapeIcsText(staffName)}`,
  ];

  for (const booking of bookings) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:truecleankc-booking-${booking.id}@truecleankc`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatIcsDate(booking.startAt)}`,
      `DTEND:${formatIcsDate(booking.endAt)}`,
      `SUMMARY:${escapeIcsText(`${SERVICE_LABELS[booking.serviceType]} \u2014 ${booking.customerName}`)}`,
      `LOCATION:${escapeIcsText(booking.address)}`,
      // Escape each field first, then join with the literal "\n" line-break
      // escape — escaping the whole string afterward would double the
      // backslash in that separator (\n -> \\n) and break the line break.
      `DESCRIPTION:${[booking.customerPhone, booking.customerEmail, booking.notes]
        .filter((v): v is string => Boolean(v))
        .map(escapeIcsText)
        .join("\\n")}`,
      `STATUS:${booking.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  // iCalendar requires CRLF line endings.
  return lines.join("\r\n");
}
