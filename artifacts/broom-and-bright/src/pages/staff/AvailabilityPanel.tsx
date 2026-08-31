import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { staffApi } from './staffApi';
import { WEEKDAY_LABELS, type AvailabilityOverride, type StaffMember } from './types';

interface WeekdayRow {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const DEFAULT_ROW: WeekdayRow = { enabled: false, startTime: '09:00', endTime: '17:00' };

export function AvailabilityPanel({ me, allStaff }: { me: StaffMember; allStaff: StaffMember[] }) {
  const isOwner = me.role === 'owner';
  const [targetStaffId, setTargetStaffId] = useState<number>(me.id);
  const [week, setWeek] = useState<WeekdayRow[]>(Array.from({ length: 7 }, () => ({ ...DEFAULT_ROW })));
  const [overrides, setOverrides] = useState<AvailabilityOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newOverride, setNewOverride] = useState({ date: '', dayOff: true, startTime: '09:00', endTime: '17:00' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { rules, overrides } = await staffApi.getAvailability(isOwner ? targetStaffId : undefined);
      const nextWeek = Array.from({ length: 7 }, () => ({ ...DEFAULT_ROW }));
      for (const rule of rules) {
        nextWeek[rule.weekday] = { enabled: true, startTime: rule.startTime, endTime: rule.endTime };
      }
      setWeek(nextWeek);
      setOverrides(overrides);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availability.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetStaffId]);

  const saveWeek = async () => {
    setSaving(true);
    setError(null);
    try {
      const rules = week
        .map((row, weekday) => ({ ...row, weekday }))
        .filter((row) => row.enabled)
        .map(({ weekday, startTime, endTime }) => ({ weekday, startTime, endTime }));
      await staffApi.setRules(rules, isOwner ? targetStaffId : undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const addOverride = async () => {
    if (!newOverride.date) return;
    setError(null);
    try {
      await staffApi.addOverride(
        {
          date: newOverride.date,
          isAvailable: !newOverride.dayOff,
          startTime: newOverride.dayOff ? undefined : newOverride.startTime,
          endTime: newOverride.dayOff ? undefined : newOverride.endTime,
        },
        isOwner ? targetStaffId : undefined,
      );
      setNewOverride({ date: '', dayOff: true, startTime: '09:00', endTime: '17:00' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add.');
    }
  };

  const removeOverride = async (id: number) => {
    try {
      await staffApi.deleteOverride(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove.');
    }
  };

  return (
    <div className="space-y-6">
      {isOwner && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Editing schedule for:</span>
          <select
            value={targetStaffId}
            onChange={(e) => setTargetStaffId(Number(e.target.value))}
            className="h-9 rounded-md border border-input px-2 text-sm"
          >
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
      ) : (
        <>
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Weekly hours</h3>
            <div className="space-y-2">
              {WEEKDAY_LABELS.map((label, i) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2 w-32 shrink-0">
                    <input
                      type="checkbox"
                      checked={week[i].enabled}
                      onChange={(e) => {
                        const next = [...week];
                        next[i] = { ...next[i], enabled: e.target.checked };
                        setWeek(next);
                      }}
                    />
                    {label}
                  </label>
                  <Input
                    type="time"
                    value={week[i].startTime}
                    disabled={!week[i].enabled}
                    onChange={(e) => {
                      const next = [...week];
                      next[i] = { ...next[i], startTime: e.target.value };
                      setWeek(next);
                    }}
                    className="w-32"
                  />
                  <span className="text-slate-400">to</span>
                  <Input
                    type="time"
                    value={week[i].endTime}
                    disabled={!week[i].enabled}
                    onChange={(e) => {
                      const next = [...week];
                      next[i] = { ...next[i], endTime: e.target.value };
                      setWeek(next);
                    }}
                    className="w-32"
                  />
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-3" onClick={saveWeek} disabled={saving}>
              {saving ? 'Saving...' : 'Save weekly hours'}
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Days off / custom hours</h3>

            {overrides.length > 0 && (
              <div className="space-y-2 mb-4">
                {overrides
                  .slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((o) => (
                    <div
                      key={o.id}
                      className="flex items-center justify-between text-sm rounded-lg border border-slate-200 px-3 py-2"
                    >
                      <span>
                        <strong>{o.date}</strong>{' '}
                        {o.isAvailable ? `— ${o.startTime}–${o.endTime}` : '— Day off'}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => removeOverride(o.id)}>
                        Remove
                      </Button>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs text-slate-500 space-y-1 block">
                Date
                <Input
                  type="date"
                  value={newOverride.date}
                  onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
                  className="w-40"
                />
              </label>
              <label className="flex items-center gap-1.5 text-sm h-9">
                <input
                  type="checkbox"
                  checked={newOverride.dayOff}
                  onChange={(e) => setNewOverride({ ...newOverride, dayOff: e.target.checked })}
                />
                Day off
              </label>
              {!newOverride.dayOff && (
                <>
                  <Input
                    type="time"
                    value={newOverride.startTime}
                    onChange={(e) => setNewOverride({ ...newOverride, startTime: e.target.value })}
                    className="w-28"
                  />
                  <span className="text-slate-400 text-sm">to</span>
                  <Input
                    type="time"
                    value={newOverride.endTime}
                    onChange={(e) => setNewOverride({ ...newOverride, endTime: e.target.value })}
                    className="w-28"
                  />
                </>
              )}
              <Button size="sm" onClick={addOverride} disabled={!newOverride.date}>
                Add
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
