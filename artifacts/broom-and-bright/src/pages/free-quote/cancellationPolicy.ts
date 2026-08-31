// Shared by the standard and hourly Review steps: turns the booked slot into
// the "cancel or reschedule by" deadline — the same time as the appointment,
// on the day before it.
export function getCancellationDeadlineLabel(scheduledStartAt: string | undefined): string | null {
  if (!scheduledStartAt) return null;
  const start = new Date(scheduledStartAt);
  if (Number.isNaN(start.getTime())) return null;

  const deadlineDate = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const time = start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const date = deadlineDate.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return `Please cancel or reschedule before ${time} on ${date}.`;
}
