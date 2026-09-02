import { Resend } from "resend";
import type { Booking } from "@workspace/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const TIME_ZONE = "America/Chicago";

const SERVICE_LABELS: Record<Booking["serviceType"], string> = {
  standard: "Standard Clean",
  deep: "Deep Clean",
  moveInOut: "Move-In / Move-Out",
  hourly: "Hourly Service",
};

function formatWhen(start: Date, end: Date): string {
  const date = start.toLocaleDateString("en-US", { timeZone: TIME_ZONE, dateStyle: "full" });
  const opts = { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" } as const;
  return `${date}, ${start.toLocaleTimeString("en-US", opts)} – ${end.toLocaleTimeString("en-US", opts)}`;
}

function manageBookingUrl(booking: Booking): string {
  const base = process.env.SITE_URL ?? "https://www.truecleankc.com";
  return `${base}/booking/${booking.id}?email=${encodeURIComponent(booking.customerEmail)}`;
}

/**
 * Customer-facing "your booking is confirmed" email, sent after a booking is
 * created. Throws on send failure — callers should catch it themselves so a
 * flaky email provider never fails the booking that's already saved.
 */
export async function sendCustomerBookingConfirmation(booking: Booking): Promise<void> {
  const manageUrl = manageBookingUrl(booking);

  const { error } = await resend.emails.send({
    from: "TrueClean KC <bookings@mail.truecleankc.com>",
    to: booking.customerEmail,
    replyTo: process.env.QUOTE_NOTIFICATION_EMAIL,
    subject: `You're booked — ${SERVICE_LABELS[booking.serviceType]} on ${booking.startAt.toLocaleDateString("en-US", { timeZone: TIME_ZONE })}`,
    html: `<h2>Thanks, ${booking.customerName}! Your cleaning is confirmed.</h2>
           <p><strong>Service:</strong> ${SERVICE_LABELS[booking.serviceType]}</p>
           <p><strong>When:</strong> ${formatWhen(booking.startAt, booking.endAt)}</p>
           <p><strong>Address:</strong> ${booking.address}</p>
           ${booking.estimatedTotal ? `<p><strong>Estimated total:</strong> ${booking.estimatedTotal}</p>` : ""}
           ${booking.notes ? `<p><strong>Your notes:</strong> ${booking.notes}</p>` : ""}
           <p>Need to reschedule or cancel? <a href="${manageUrl}">Manage your booking</a>.</p>
           <p>Questions? Just reply to this email.</p>`,
  });

  if (error) throw error;
}

/**
 * "Your cleaning is tomorrow" reminder, sent by the reminder cron for
 * bookings starting within the next day. Throws on send failure — the cron
 * only marks a booking as reminded after this resolves, so a failed send is
 * naturally retried on the next run instead of being silently lost.
 */
export async function sendCustomerBookingReminder(booking: Booking): Promise<void> {
  const manageUrl = manageBookingUrl(booking);

  const { error } = await resend.emails.send({
    from: "TrueClean KC <bookings@mail.truecleankc.com>",
    to: booking.customerEmail,
    replyTo: process.env.QUOTE_NOTIFICATION_EMAIL,
    subject: `Reminder: ${SERVICE_LABELS[booking.serviceType]} tomorrow`,
    html: `<h2>Hi ${booking.customerName}, just a reminder!</h2>
           <p>Your ${SERVICE_LABELS[booking.serviceType]} is coming up:</p>
           <p><strong>When:</strong> ${formatWhen(booking.startAt, booking.endAt)}</p>
           <p><strong>Address:</strong> ${booking.address}</p>
           <p>Need to reschedule or cancel? <a href="${manageUrl}">Manage your booking</a>.</p>
           <p>See you soon!</p>`,
  });

  if (error) throw error;
}
