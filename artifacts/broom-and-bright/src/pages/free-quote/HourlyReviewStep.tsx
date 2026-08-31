import type { UseFormReturn } from 'react-hook-form';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { HOURLY_RATE, getHourlyTotal } from './pricing';
import type { HourlyQuoteFormValues } from './schema';
import { getCancellationDeadlineLabel } from './cancellationPolicy';

const CONTACT_METHODS = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'message', label: 'Text Message', icon: MessageSquare },
  { key: 'phoneCall', label: 'Phone Call', icon: Phone },
] as const;

interface HourlyReviewStepProps {
  form: UseFormReturn<HourlyQuoteFormValues>;
  onEditStep: (step: number) => void;
}

export function HourlyReviewStep({ form, onEditStep }: HourlyReviewStepProps) {
  const values = form.watch();
  const total = getHourlyTotal(values.hours || 0);
  const cancellationLabel = getCancellationDeadlineLabel(values.scheduledStartAt);

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Review your request</h2>
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
        <div className="flex justify-between items-start p-4 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Service</div>
            <div className="text-sm font-semibold text-slate-900">
              Hourly service &nbsp;·&nbsp; {values.hours} {values.hours === 1 ? 'hour' : 'hours'}
            </div>
          </div>
          <button type="button" onClick={() => onEditStep(0)} className="text-xs font-semibold text-[#6ba4b8] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Scheduled Time</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.scheduledStartAt
                ? new Date(values.scheduledStartAt).toLocaleString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                : 'Not picked yet'}
            </div>
          </div>
          <button type="button" onClick={() => onEditStep(1)} className="text-xs font-semibold text-[#6ba4b8] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Contact</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.firstName} {values.lastName}
            </div>
            <div className="text-xs text-slate-600">
              {values.email} &nbsp;·&nbsp; {values.phone}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">{values.address}</div>
          </div>
          <button type="button" onClick={() => onEditStep(2)} className="text-xs font-semibold text-[#6ba4b8] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-1.5 p-4 bg-[#6ba4b8]/10">
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>
              {values.hours} {values.hours === 1 ? 'hour' : 'hours'} &times; ${HOURLY_RATE}/hr
            </span>
            <span>${values.hours * HOURLY_RATE}</span>
          </div>
          <div className="h-px bg-[#6ba4b8]/25 my-0.5" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Estimated total</span>
            <span className="text-lg font-extrabold text-[#6ba4b8]">${total}</span>
          </div>
          <p className="text-xs text-slate-500">
            Flat ${HOURLY_RATE}/hour, one cleaner per hour — final time may vary based on your home's
            condition and task list.
          </p>
        </div>
      </div>

      <FormField
        control={form.control}
        name="preferredContact"
        render={({ field }) => (
          <FormItem>
            <div>
              <div className="text-sm font-bold text-slate-900">
                How should we reach you? <span className="font-normal text-slate-400">(optional)</span>
              </div>
              <p className="text-xs text-slate-600">Pick how you'd like us to confirm your booking.</p>
            </div>
            <FormControl>
              <div className="grid grid-cols-3 gap-3">
                {CONTACT_METHODS.map((method) => {
                  const selected = field.value === method.key;
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.key}
                      type="button"
                      onClick={() => field.onChange(method.key)}
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-2xl px-3 py-4 border-[1.5px] text-sm font-semibold text-center',
                        selected ? 'border-[#6ba4b8] bg-[#6ba4b8]/10 text-[#6ba4b8]' : 'border-slate-200 bg-white text-slate-600',
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {method.label}
                    </button>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cancellationPolicyAck"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 cursor-pointer">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
                <span className="text-sm text-slate-700">
                  {cancellationLabel ?? 'Please cancel or reschedule at least 24 hours before your appointment.'}
                </span>
              </label>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
