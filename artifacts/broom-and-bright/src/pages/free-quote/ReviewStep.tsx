import type { UseFormReturn } from 'react-hook-form';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { FreeQuoteFormValues } from './schema';
import { SERVICE_TYPES, ADD_ONS, FREQUENCIES, getQuoteBreakdown, totalBathrooms } from './pricing';
import { PriceDisclaimer } from './PriceDisclaimer';
import { getCancellationDeadlineLabel } from './cancellationPolicy';

const CONTACT_METHODS = [
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'message', label: 'Text Message', icon: MessageSquare },
  { key: 'phoneCall', label: 'Phone Call', icon: Phone },
] as const;

interface ReviewStepProps {
  form: UseFormReturn<FreeQuoteFormValues>;
  photos: File[];
  onEditStep: (step: number) => void;
}

export function ReviewStep({ form, photos, onEditStep }: ReviewStepProps) {
  const values = form.watch();
  const frequency = FREQUENCIES.find((f) => f.key === values.frequency);
  const { basePrice, addonsTotal, discountPercent, discountAmount, total } = getQuoteBreakdown({
    bedrooms: values.bedrooms,
    bathrooms: totalBathrooms(values.bathrooms, values.halfBaths),
    squareFeet: values.squareFeet,
    serviceType: values.serviceType,
    addons: values.addons ?? [],
    frequency: values.frequency,
  });
  const cancellationLabel = getCancellationDeadlineLabel(values.scheduledStartAt);

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Review your request</h2>
        {/* <p className="text-sm text-slate-600">Take a look, then send it our way.</p> */}
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
        <div className="flex justify-between items-start p-4 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Contact</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.firstName} {values.lastName}
            </div>
            <div className="text-xs text-slate-600">
              {values.email} &nbsp;·&nbsp; {values.phone}
            </div>
          </div>
          <button type="button" onClick={() => onEditStep(2)} className="text-xs font-semibold text-[#3fae74] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Address</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.address}
            </div>
          </div>
          <button type="button" onClick={() => onEditStep(2)} className="text-xs font-semibold text-[#3fae74] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Property Details</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.bedrooms} bed &nbsp;·&nbsp; {values.bathrooms} bath
              {values.halfBaths > 0 && (
                <>
                  {' '}
                  &nbsp;·&nbsp; {values.halfBaths} half bath
                </>
              )}{' '}
              &nbsp;·&nbsp; ~{values.squareFeet} sqft
            </div>
            {photos.length > 0 && <div className="text-xs text-slate-600">{photos.length} photo(s) attached</div>}
          </div>
          <button type="button" onClick={() => onEditStep(0)} className="text-xs font-semibold text-[#3fae74] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Service</div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-slate-900">
                {SERVICE_TYPES.find((s) => s.key === values.serviceType)?.label}
              </span>
              <span className="text-xs font-semibold text-[#3fae74] bg-[#3fae74]/10 px-2 py-0.5 rounded-full">
                {basePrice !== null ? `from $${basePrice}` : 'Custom Quote'}
              </span>
              {values.frequency && (
                <span className="text-xs text-slate-500">
                  {FREQUENCIES.find((f) => f.key === values.frequency)?.label}
                </span>
              )}
            </div>
            {values.addons.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {values.addons.map((key) => {
                  const addon = ADD_ONS.find((a) => a.key === key);
                  if (!addon) return null;
                  return (
                    <span
                      key={key}
                      className="text-[11px] font-semibold text-[#3fae74] bg-[#3fae74]/10 border border-[#3fae74]/40 px-2 py-0.5 rounded-full"
                    >
                      {addon.label} +${addon.price}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <button type="button" onClick={() => onEditStep(0)} className="text-xs font-semibold text-[#3fae74] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4 bg-slate-50">
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
          <button type="button" onClick={() => onEditStep(1)} className="text-xs font-semibold text-[#3fae74] shrink-0">
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-1.5 p-4 bg-[#3fae74]/10">
          <div className="flex justify-between items-center text-xs text-slate-600">
            <span>{SERVICE_TYPES.find((s) => s.key === values.serviceType)?.label}</span>
            <span>{basePrice !== null ? `from $${basePrice}` : 'Custom Quote'}</span>
          </div>
          {values.addons.length > 0 && basePrice !== null && (
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>Add-ons ({values.addons.length})</span>
              <span>+${addonsTotal}</span>
            </div>
          )}
          {discountPercent > 0 && frequency && basePrice !== null && (
            <div className="flex justify-between items-center text-xs font-semibold text-[#3fae74]">
              <span>{Math.round(discountPercent * 100)}% Off Applied</span>
              <span>-${discountAmount}</span>
            </div>
          )}
          <div className="h-px bg-[#3fae74]/25 my-0.5" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Estimated total</span>
            <span className="text-lg font-extrabold text-[#3fae74]">
              {total !== null ? `from $${total}` : 'Custom Quote'}
            </span>
          </div>
          {basePrice === null ? (
            <p className="text-xs text-slate-500">
              Homes with 5+ bedrooms are priced individually — we'll follow up with a number.
            </p>
          ) : (
            <PriceDisclaimer />
          )}
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
                        selected ? 'border-[#3fae74] bg-[#3fae74]/10 text-[#3fae74]' : 'border-slate-200 bg-white text-slate-600',
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
