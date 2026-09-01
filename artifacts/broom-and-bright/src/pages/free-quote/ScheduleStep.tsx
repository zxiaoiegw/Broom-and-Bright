import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { API_URL } from '@/lib/api';

interface ScheduleStepProps {
  durationMinutes: number;
  value: string; // ISO datetime of the picked slot, or '' if none yet
  onChange: (iso: string) => void;
  heading?: string;
}

// The calendar's selected Date is a local-midnight JS Date for the day the
// customer clicked — read it with local getters (not toISOString(), which
// would shift across a UTC day boundary) to get the "YYYY-MM-DD" to query.
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function ScheduleStep({ durationMinutes, value, onChange, heading }: ScheduleStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => startOfMonth(selectedDate ?? new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // null while the visible month's availability hasn't loaded yet — days
  // stay clickable in the meantime rather than flashing "unavailable".
  const [availableDates, setAvailableDates] = useState<Set<string> | null>(null);

  // On iOS Safari specifically, the calendar card's own auto-height can come
  // up short of its actual day-grid content — a 5- or 6-week month's last
  // row(s) render past the card's bottom border instead of the card growing
  // to enclose them (a WebKit quirk we could reproduce on-device but not in
  // Chromium at any width/month we tried, which made guessing a fixed CSS
  // height unreliable — an earlier attempt undershot, the next overshot).
  // So: measure it. Compare the card's actual rendered bottom edge to its
  // day-grid table's actual rendered bottom edge, and if the table hangs
  // past the card, pad the card by exactly that much — correct on whatever
  // device/month this turns out to affect, with zero guessing and zero
  // effect on browsers where the two already match.
  const calendarWrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = calendarWrapRef.current;
    if (!wrap) return;

    const measure = () => {
      const card = wrap.querySelector<HTMLElement>('[data-slot="calendar"]');
      const table = wrap.querySelector('table');
      if (!card || !table) return;

      const deficit = table.getBoundingClientRect().bottom - card.getBoundingClientRect().bottom;
      if (deficit > 0) {
        const needed = card.offsetHeight + deficit + 16; // +16 to match the card's own bottom padding
        if (needed > parseFloat(card.style.minHeight || '0')) {
          card.style.minHeight = `${Math.ceil(needed)}px`;
        }
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [visibleMonth]);

  useEffect(() => {
    let cancelled = false;
    setAvailableDates(null);

    const from = toDateKey(visibleMonth);
    const to = toDateKey(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0));
    fetch(`${API_URL}/api/available-dates?from=${from}&to=${to}&durationMinutes=${durationMinutes}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAvailableDates(new Set<string>(data.dates ?? []));
      })
      .catch(() => {
        // Leave it null on failure — days fall back to clickable rather than
        // all appearing disabled from a network hiccup.
      });

    return () => {
      cancelled = true;
    };
  }, [visibleMonth, durationMinutes]);

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSlots([]);

    const dateKey = toDateKey(selectedDate);
    fetch(`${API_URL}/api/slots?date=${dateKey}&durationMinutes=${durationMinutes}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load available times. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, durationMinutes]);

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">{heading ?? 'Pick a date & time'}</h2>
        <p className="text-sm text-slate-600">Choose a day, then an available start time.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-6 items-start transform-gpu">
        <div ref={calendarWrapRef} className="w-full lg:w-auto lg:shrink-0 lg:min-w-[420px]">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              onChange(''); // picking a new day clears any previously chosen time
            }}
            month={visibleMonth}
            onMonthChange={setVisibleMonth}
            disabled={(date) =>
              date < startOfToday() || (availableDates !== null && !availableDates.has(toDateKey(date)))
            }
            className="rounded-2xl border border-slate-200 w-full p-4 sm:p-6 [--cell-size:3rem] lg:[--cell-size:4rem]"
            classNames={{ root: 'w-full' }}
          />
        </div>

        <div className="flex-1 min-w-0 w-full">
          {!selectedDate ? (
            <p className="text-sm text-slate-500">Pick a date to see available times.</p>
          ) : loading ? (
            <p className="text-sm text-slate-500">Loading available times...</p>
          ) : error ? (
            <p className="text-sm font-medium text-destructive">{error}</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-slate-500">
              No openings that day — please pick another date, or{' '}
              <a href="tel:+17858291574" className="font-semibold text-[#3fae74] underline underline-offset-2">
                call us
              </a>{' '}
              for help finding a time.
            </p>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-2 gap-1.5">
              {slots.map((iso) => {
                const selected = value === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => onChange(iso)}
                    className={cn(
                      'h-8 rounded-lg border text-xs font-semibold',
                      selected
                        ? 'border-[#3fae74] bg-[#3fae74]/10 text-[#3fae74]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-[#3fae74]/50',
                    )}
                  >
                    {new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {value && (
        <p className="text-sm text-slate-600 pt-2 border-t border-slate-100">
          Selected:{' '}
          <span className="font-semibold text-slate-900">
            {new Date(value).toLocaleString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        </p>
      )}
    </>
  );
}
