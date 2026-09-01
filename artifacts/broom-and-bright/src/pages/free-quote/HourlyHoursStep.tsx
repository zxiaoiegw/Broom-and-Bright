import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { MAX_HOURLY_HOURS } from './pricing';
import type { HourlyQuoteFormValues } from './schema';

const PHONE_DISPLAY = '(785) 829-1574';
const PHONE_HREF = 'tel:+17858291574';

const HOUR_OPTIONS = Array.from({ length: MAX_HOURLY_HOURS }, (_, i) => i + 1);

export function HourlyHoursStep({ form }: { form: UseFormReturn<HourlyQuoteFormValues> }) {
  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">How many man hours of cleaning do you need?</h2>
        <p className="text-sm text-slate-600 mt-1">
          Each hour booked is for one person working for one hour. For larger homes or if you're
          unsure of the hours needed, please{' '}
          <a href={PHONE_HREF} className="font-semibold text-[#3fae74] underline underline-offset-2">
            contact us
          </a>{' '}
          at {PHONE_DISPLAY} and we can help guide you!
        </p>
      </div>

      <FormField
        control={form.control}
        name="hours"
        render={({ field }) => (
          <FormItem className="max-w-xs">
            <FormLabel>Hours</FormLabel>
            <Select
              value={field.value ? String(field.value) : undefined}
              onValueChange={(v) => field.onChange(Number(v))}
            >
              <FormControl>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select hours" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {HOUR_OPTIONS.map((h) => (
                  <SelectItem key={h} value={String(h)}>
                    {h} {h === 1 ? 'hour' : 'hours'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 leading-relaxed">
        Our cleanings are billed hourly based on the actual time spent. The estimate provided is a
        range&mdash;not a flat rate. If more time is needed due to the home's condition, we'll check
        in with you before proceeding. If we finish early, we'll adjust the cost down.
      </p>
    </>
  );
}
