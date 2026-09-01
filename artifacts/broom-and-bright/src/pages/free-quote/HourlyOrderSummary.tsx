import type { UseFormReturn } from 'react-hook-form';
import { HOURLY_RATE, getHourlyTotal } from './pricing';
import type { HourlyQuoteFormValues } from './schema';

export function HourlyOrderSummary({ form }: { form: UseFormReturn<HourlyQuoteFormValues> }) {
  const hours = form.watch('hours') || 0;
  const total = getHourlyTotal(hours);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 space-y-4">
      <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">Quote Summary</div>

      {hours < 1 ? (
        <p className="text-sm text-slate-500">Choose how many hours to see your price.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">
              {hours} {hours === 1 ? 'hour' : 'hours'} &times; ${HOURLY_RATE}/hr
            </span>
            <span className="font-semibold text-slate-900 shrink-0">${hours * HOURLY_RATE}</span>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Estimated total</span>
            <span className="text-xl font-extrabold text-[#3fae74]">${total}</span>
          </div>

          <p className="text-xs text-slate-400">
            Flat ${HOURLY_RATE}/hour, one cleaner per hour. Final time may vary based on your home's
            condition and task list.
          </p>
        </div>
      )}
    </div>
  );
}
