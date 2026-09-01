import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { staffApi } from './staffApi';
import { SERVICE_TYPE_LABELS, PREFERRED_CONTACT_LABELS, type Booking, type StaffMember } from './types';

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// The estimate customers never see — this is start/end, i.e. exactly what
// was booked, so extending it (running long on-site) is just editing End.
function formatDuration(startAt: string, endAt: string): string {
  const minutes = Math.round((new Date(endAt).getTime() - new Date(startAt).getTime()) / 60_000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

const STATUS_STYLES: Record<Booking['status'], string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-slate-200 text-slate-600',
};

interface EditForm {
  startAt: string;
  endAt: string;
  address: string;
  notes: string;
}

export function BookingsPanel({ me, allStaff }: { me: StaffMember; allStaff: StaffMember[] }) {
  const isOwner = me.role === 'owner';
  const [staffFilter, setStaffFilter] = useState<number | 'all'>(isOwner ? 'all' : me.id);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);

  const staffNameById = useMemo(() => new Map(allStaff.map((s) => [s.id, s.name])), [allStaff]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { bookings } = await staffApi.listBookings(staffFilter === 'all' ? undefined : staffFilter);
      setBookings([...bookings].sort((a, b) => a.startAt.localeCompare(b.startAt)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffFilter]);

  const startEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditForm({
      startAt: toDatetimeLocalValue(booking.startAt),
      endAt: toDatetimeLocalValue(booking.endAt),
      address: booking.address,
      notes: booking.notes ?? '',
    });
  };

  const saveEdit = async (id: number) => {
    if (!editForm) return;
    setSavingId(id);
    setError(null);
    try {
      await staffApi.updateBooking(id, {
        startAt: new Date(editForm.startAt).toISOString(),
        endAt: new Date(editForm.endAt).toISOString(),
        address: editForm.address,
        notes: editForm.notes,
      });
      setEditingId(null);
      setEditForm(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setSavingId(null);
    }
  };

  const cancelBooking = async (id: number) => {
    if (!confirm('Cancel this booking? The customer is not automatically notified.')) return;
    setSavingId(id);
    try {
      await staffApi.cancelBooking(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Viewing:</span>
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="h-9 rounded-md border border-input px-2 text-sm"
          >
            <option value="all">All staff</option>
            {allStaff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-slate-500">No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const isEditing = editingId === b.id;
            return (
              <div key={b.id} className="rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {new Date(b.startAt).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                      {' – '}
                      {new Date(b.endAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      <span className="ml-2 text-xs font-semibold text-[#3fae74] bg-[#3fae74]/10 px-1.5 py-0.5 rounded-full align-middle">
                        {formatDuration(b.startAt, b.endAt)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {SERVICE_TYPE_LABELS[b.serviceType]} · Assigned to {staffNameById.get(b.staffId) ?? 'Unassigned'}
                    </div>
                  </div>
                  <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', STATUS_STYLES[b.status])}>
                    {b.status}
                  </span>
                </div>

                <div className="text-sm text-slate-700">
                  <div className="font-semibold">{b.customerName}</div>
                  <div className="text-slate-500">
                    {b.customerEmail} · {b.customerPhone}
                  </div>
                </div>

                {(b.bedrooms || b.addons || b.frequency || b.preferredContact || b.estimatedTotal) && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs bg-slate-50 rounded-xl p-3">
                    {b.bedrooms && (
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide font-semibold">Property</div>
                        <div className="text-slate-700">
                          {b.bedrooms} bed · {b.bathrooms} bath{b.squareFeet ? ` · ~${b.squareFeet} sqft` : ''}
                        </div>
                      </div>
                    )}
                    {b.addons && (
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide font-semibold">Add-ons</div>
                        <div className="text-slate-700">{b.addons}</div>
                      </div>
                    )}
                    {b.frequency && (
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide font-semibold">Frequency</div>
                        <div className="text-slate-700">{b.frequency}</div>
                      </div>
                    )}
                    {b.preferredContact && (
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide font-semibold">Prefers</div>
                        <div className="text-slate-700">
                          {PREFERRED_CONTACT_LABELS[b.preferredContact] ?? b.preferredContact}
                        </div>
                      </div>
                    )}
                    {b.estimatedTotal && (
                      <div>
                        <div className="text-slate-400 uppercase tracking-wide font-semibold">Est. Total</div>
                        <div className="text-slate-700 font-semibold">{b.estimatedTotal}</div>
                      </div>
                    )}
                  </div>
                )}

                {isEditing && editForm ? (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="text-xs text-slate-500 space-y-1 block">
                        Start
                        <Input
                          type="datetime-local"
                          value={editForm.startAt}
                          onChange={(e) => setEditForm({ ...editForm, startAt: e.target.value })}
                        />
                      </label>
                      <label className="text-xs text-slate-500 space-y-1 block">
                        End
                        <Input
                          type="datetime-local"
                          value={editForm.endAt}
                          onChange={(e) => setEditForm({ ...editForm, endAt: e.target.value })}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400">
                      Running long on-site? Push End out — it frees or blocks that time on the
                      customer calendar as soon as you save.
                    </p>
                    <label className="text-xs text-slate-500 space-y-1 block">
                      Address
                      <Input
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </label>
                    <label className="text-xs text-slate-500 space-y-1 block">
                      Notes
                      <Textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="min-h-16 resize-none"
                      />
                    </label>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={() => saveEdit(b.id)} disabled={savingId === b.id}>
                        {savingId === b.id ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditForm(null);
                        }}
                      >
                        Cancel edit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-slate-500">{b.address}</div>
                    {b.notes && <div className="text-xs text-slate-400 italic">"{b.notes}"</div>}
                    {b.status === 'confirmed' && (
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" variant="outline" onClick={() => startEdit(b)}>
                          Edit / Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => cancelBooking(b.id)}
                          disabled={savingId === b.id}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
