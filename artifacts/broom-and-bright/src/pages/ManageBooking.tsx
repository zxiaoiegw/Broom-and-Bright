import { useEffect, useState } from 'react';
import { useParams, useSearch } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { ScheduleStep } from './free-quote/ScheduleStep';
import { SERVICE_TYPE_LABELS, type Booking } from './staff/types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
  return data as T;
}

function formatWhen(startAt: string, endAt: string): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const date = start.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  const from = start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const to = end.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${from} – ${to}`;
}

export default function ManageBooking() {
  const { id } = useParams<{ id: string }>();
  const email = new URLSearchParams(useSearch()).get('email') ?? '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'view' | 'reschedule'>('view');
  const [newStartAt, setNewStartAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if (!id || !email) {
      setError('This link is missing information — please use the link from your confirmation email.');
      setLoading(false);
      return;
    }
    request<{ booking: Booking }>(`/bookings/${id}?email=${encodeURIComponent(email)}`)
      .then((data) => setBooking(data.booking))
      .catch((err) => setError(err instanceof Error ? err.message : 'Booking not found.'))
      .finally(() => setLoading(false));
  }, [id, email]);

  const durationMinutes = booking
    ? Math.round((new Date(booking.endAt).getTime() - new Date(booking.startAt).getTime()) / 60_000)
    : 120;

  const submitReschedule = async () => {
    if (!booking || !newStartAt) return;
    setSaving(true);
    setActionError(null);
    try {
      const { booking: updated } = await request<{ booking: Booking }>(`/bookings/${booking.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ customerEmail: email, startAt: newStartAt }),
      });
      setBooking(updated);
      setMode('view');
      setNewStartAt('');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reschedule.');
    } finally {
      setSaving(false);
    }
  };

  const submitCancel = async () => {
    if (!booking) return;
    if (!confirm('Cancel this booking? This cannot be undone.')) return;
    setSaving(true);
    setActionError(null);
    try {
      const { booking: updated } = await request<{ booking: Booking }>(`/bookings/${booking.id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ customerEmail: email }),
      });
      setBooking(updated);
      setCancelled(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to cancel.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 py-16 px-4">
      <Card className={`w-full transition-[max-width] ${mode === 'reschedule' ? 'max-w-3xl' : 'max-w-lg'}`}>
        <CardContent className="pt-6 space-y-5">
          {loading ? (
            <p className="text-sm text-slate-500">Loading your booking...</p>
          ) : error ? (
            <div className="flex gap-2">
              <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
              <div>
                <h1 className="text-lg font-bold text-slate-900">We couldn't find that booking</h1>
                <p className="text-sm text-slate-600 mt-1">{error}</p>
              </div>
            </div>
          ) : booking ? (
            <>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Your booking</h1>
                <p className="text-sm text-slate-500">{SERVICE_TYPE_LABELS[booking.serviceType]}</p>
              </div>

              {booking.status === 'cancelled' ? (
                <div className="flex gap-2 rounded-xl bg-slate-50 p-4">
                  <AlertCircle className="h-5 w-5 text-slate-400 shrink-0" />
                  <p className="text-sm text-slate-600">This booking has been cancelled.</p>
                </div>
              ) : (
                <>
                  {cancelled && (
                    <div className="flex gap-2 rounded-xl bg-emerald-50 p-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <p className="text-sm text-emerald-700">Your booking has been cancelled.</p>
                    </div>
                  )}

                  <div className="rounded-xl border border-slate-200 p-4 space-y-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {formatWhen(booking.startAt, booking.endAt)}
                    </div>
                    <div className="text-sm text-slate-500">{booking.address}</div>
                  </div>

                  {actionError && <p className="text-sm font-medium text-destructive">{actionError}</p>}

                  {mode === 'view' && !cancelled && (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setMode('reschedule')}>
                        Reschedule
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={submitCancel} disabled={saving}>
                        {saving ? 'Cancelling...' : 'Cancel booking'}
                      </Button>
                    </div>
                  )}

                  {mode === 'reschedule' && (
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <ScheduleStep
                        durationMinutes={durationMinutes}
                        value={newStartAt}
                        onChange={setNewStartAt}
                        heading="Pick a new date & time"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={submitReschedule} disabled={!newStartAt || saving}>
                          {saving ? 'Saving...' : 'Confirm new time'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setMode('view');
                            setNewStartAt('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
