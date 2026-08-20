import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FreeQuoteFormValues } from './schema';
import { SERVICE_TYPES, ADD_ONS, getServicePrice } from './pricing';

interface ReviewStepProps {
  form: UseFormReturn<FreeQuoteFormValues>;
  photos: File[];
  onEditStep: (step: number) => void;
}

export function ReviewStep({ form, photos, onEditStep }: ReviewStepProps) {
  const values = form.watch();
  const basePrice = values.serviceType ? getServicePrice(values.bedrooms, values.serviceType) : null;
  const addonsTotal = ADD_ONS.filter((a) => values.addons?.includes(a.key)).reduce((sum, a) => sum + a.price, 0);
  const estimatedTotal = basePrice !== null ? basePrice + addonsTotal : null;

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Review your request</h2>
        <p className="text-sm text-slate-600">Take a look, then send it our way.</p>
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
          <button type="button" onClick={() => onEditStep(0)} className="text-xs font-semibold text-primary shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Address</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.street}, {values.city}, {values.state} {values.zip}
            </div>
          </div>
          <button type="button" onClick={() => onEditStep(0)} className="text-xs font-semibold text-primary shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Home Details</div>
            <div className="text-sm font-semibold text-slate-900">
              {values.bedrooms} bed &nbsp;·&nbsp; {values.bathrooms} bath &nbsp;·&nbsp; ~
              {values.squareFeet} sqft &nbsp;·&nbsp; {values.pets === 'yes' ? 'Has pets' : 'No pets'}
            </div>
            {photos.length > 0 && <div className="text-xs text-slate-600">{photos.length} photo(s) attached</div>}
          </div>
          <button type="button" onClick={() => onEditStep(1)} className="text-xs font-semibold text-primary shrink-0">
            Edit
          </button>
        </div>

        <div className="flex justify-between items-start p-4">
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Service</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {SERVICE_TYPES.find((s) => s.key === values.serviceType)?.label}
              </span>
              <span className="text-xs font-semibold text-primary bg-teal-50 px-2 py-0.5 rounded-full">
                {basePrice !== null ? `from $${basePrice}` : 'Custom Quote'}
              </span>
            </div>
            {values.addons.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {values.addons.map((key) => {
                  const addon = ADD_ONS.find((a) => a.key === key);
                  if (!addon) return null;
                  return (
                    <span
                      key={key}
                      className="text-[11px] font-semibold text-primary bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full"
                    >
                      {addon.label} +${addon.price}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <button type="button" onClick={() => onEditStep(2)} className="text-xs font-semibold text-primary shrink-0">
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-1.5 p-4 bg-teal-50">
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
          <div className="h-px bg-teal-200 my-0.5" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">Estimated total</span>
            <span className="text-lg font-extrabold text-primary">
              {estimatedTotal !== null ? `from $${estimatedTotal}` : 'Custom Quote'}
            </span>
          </div>
          {basePrice === null && (
            <p className="text-xs text-slate-500">
              Homes with 5+ bedrooms are priced individually — we'll follow up with a number.
            </p>
          )}
        </div>
      </div>

      <FormField
        control={form.control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Additional Notes <span className="font-normal text-slate-400">(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Anything we should know — gate codes, areas to focus on..."
                className="min-h-20 resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
