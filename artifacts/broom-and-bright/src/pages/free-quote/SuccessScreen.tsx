import { useState } from 'react';
import { Check, Home, CalendarPlus, Clock, XCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { API_URL } from '@/lib/api';
import { ScheduleStep } from './ScheduleStep';

export interface BookingConfirmation {
  bookingId: number;
  customerEmail: string;
  durationMinutes: number;
  serviceLabel: string;
  address: string;
}

interface SuccessScreenProps {
  firstName: string;
  scheduledStartAt?: string;
  booking?: BookingConfirmation;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Google Calendar wants "YYYYMMDDTHHMMSSZ" in UTC.
function toGoogleCalendarStamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function buildGoogleCalendarUrl({
  startAt,
  durationMinutes,
  serviceLabel,
  address,
}: {
  startAt: string;
  durationMinutes: number;
  serviceLabel: string;
  address: string;
}): string {
  const start = new Date(startAt);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `TrueClean KC — ${serviceLabel}`,
    dates: `${toGoogleCalendarStamp(start)}/${toGoogleCalendarStamp(end)}`,
    details: `Your ${serviceLabel} cleaning with TrueClean KC.`,
    location: address,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function SuccessScreen({ firstName, scheduledStartAt, booking }: SuccessScreenProps) {
  const [mode, setMode] = useState<'view' | 'reschedule' | 'cancelled'>('view');
  const [currentStartAt, setCurrentStartAt] = useState(scheduledStartAt);
  const [pendingStartAt, setPendingStartAt] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const submitReschedule = async () => {
    if (!booking || !pendingStartAt) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${booking.bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail: booking.customerEmail, startAt: pendingStartAt }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Could not reschedule.');
      setCurrentStartAt(pendingStartAt);
      setMode('view');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reschedule.');
    } finally {
      setIsSaving(false);
    }
  };

  const submitCancel = async () => {
    if (!booking) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/bookings/${booking.bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerEmail: booking.customerEmail }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? 'Could not cancel.');
      setMode('cancelled');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel.');
    } finally {
      setIsSaving(false);
    }
  };

  if (mode === 'cancelled') {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking cancelled</h2>
        <p className="text-slate-600 mb-8">Sorry to see it go, {firstName} — reach out anytime to rebook.</p>
        <Button asChild size="lg" className="text-black">
          <Link href="/">
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  if (mode === 'reschedule' && booking) {
    return (
      <div className="py-8 space-y-6">
        <ScheduleStep
          heading="Pick a new time"
          durationMinutes={booking.durationMinutes}
          value={pendingStartAt}
          onChange={setPendingStartAt}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <div className="flex justify-center gap-3">
          <Button variant="outline" size="lg" onClick={() => setMode('view')} disabled={isSaving}>
            Cancel
          </Button>
          <Button size="lg" onClick={submitReschedule} disabled={!pendingStartAt || isSaving}>
            {isSaving ? 'Saving...' : 'Confirm new time'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#3fae74]/15 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#3fae74] flex items-center justify-center">
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">You're booked!</h2>
      <p className="text-slate-600 mb-2">Thanks, {firstName} — we'll see you</p>
      {currentStartAt && (
        <p className="text-lg font-bold text-[#3fae74] mb-6">
          {new Date(currentStartAt).toLocaleString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      )}
      <p className="text-sm text-slate-500 mb-8">We've got your details — reach out anytime if you need to change or cancel.</p>

      {error && <p className="text-sm font-medium text-destructive mb-4">{error}</p>}

      <div className="max-w-xs mx-auto space-y-3">
        {currentStartAt && booking && (
          <Button asChild size="lg" className="w-full text-black">
            <a
              href={buildGoogleCalendarUrl({
                startAt: currentStartAt,
                durationMinutes: booking.durationMinutes,
                serviceLabel: booking.serviceLabel,
                address: booking.address,
              })}
              target="_blank"
              rel="noreferrer"
            >
              <CalendarPlus className="w-4 h-4" />
              Add to Calendar
            </a>
          </Button>
        )}

        {booking ? (
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setPendingStartAt('');
                setError(null);
                setMode('reschedule');
              }}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors py-3 text-xs font-semibold text-slate-700"
            >
              <Clock className="w-4 h-4" />
              Reschedule
            </button>
            <button
              type="button"
              onClick={() => setShowCancelDialog(true)}
              disabled={isSaving}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors py-3 text-xs font-semibold text-destructive disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
            <Link
              href="/"
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors py-3 text-xs font-semibold text-slate-700"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        ) : (
          <Button asChild size="lg" className="w-full text-black">
            <Link href="/">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        )}
      </div>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel your booking?</AlertDialogTitle>
            <AlertDialogDescription>
              TrueClean KC will be notified. You'll need to submit a new request to rebook.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-col sm:gap-2 sm:space-x-0">
            <AlertDialogAction
              onClick={submitCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Booking
            </AlertDialogAction>
            <AlertDialogCancel className="sm:mt-0">Keep Booking</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
