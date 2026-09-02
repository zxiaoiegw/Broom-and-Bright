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

/**
 * Customer-facing "your booking is confirmed" email, sent after a booking is
 * created. Throws on send failure — callers should catch it themselves so a
 * flaky email provider never fails the booking that's already saved.
 */
export async function sendCustomerBookingConfirmation(booking: Booking): Promise<void> {
  const base = process.env.SITE_URL ?? "https://truecleankc.com";
  const manageUrl = `${base}/booking/${booking.id}?email=${encodeURIComponent(booking.customerEmail)}`;

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
