import { Check } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { FreeQuoteFormValues } from './schema';
import { SERVICE_TYPES, ADD_ONS, FREQUENCIES, getPricingTier, getServicePrice } from './pricing';

export function ServiceStep({ form }: { form: UseFormReturn<FreeQuoteFormValues> }) {
  const values = form.watch();
  const pricingTier = getPricingTier(values.bedrooms);

  return (
    <>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Choose your cleaning</h2>
        <p className="text-sm text-slate-600">
          Pricing shown for {values.bedrooms} bed,{' '}
          {values.bathrooms} bath, ~{values.squareFeet} sqft{values.pets === 'yes' ? ', with pets' : ''} home
          {pricingTier ? '' : ' — 5+ bedroom homes get a custom quote'}.
        </p>
      </div>

      <FormField
        control={form.control}
        name="serviceType"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SERVICE_TYPES.map((service) => {
                  const selected = field.value === service.key;
                  const Icon = service.icon;
                  const price = getServicePrice(values.bedrooms, service.key);
                  return (
                    <div
                      key={service.key}
                      role="button"
                      tabIndex={0}
                      onClick={() => field.onChange(service.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') field.onChange(service.key);
                      }}
                      className={cn(
                        'relative rounded-2xl p-5 flex flex-col gap-3 cursor-pointer border-[1.5px]',
                        selected
                          ? 'border-[#6ba4b8] bg-[#6ba4b8]/10 shadow-lg shadow-[#6ba4b8]/20'
                          : 'border-slate-200 bg-white',
                      )}
                    >
                      {selected && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#6ba4b8] flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" strokeWidth={4} />
                        </div>
                      )}
                      <div
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center',
                          selected ? 'bg-white' : 'bg-[#6ba4b8]/10',
                        )}
                      >
                        <Icon className="w-[18px] h-[18px] text-[#6ba4b8]" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{service.label}</div>
                        <div
                          className={cn(
                            'text-xs font-semibold',
                            selected ? 'text-[#6ba4b8]' : 'text-slate-400',
                          )}
                        >
                          {price !== null ? `from $${price}` : 'Custom Quote'}
                        </div>
                      </div>
                      <ul className="space-y-1.5">
                        {service.items.map((item) => (
                          <li key={item} className="flex gap-2 items-start text-xs text-slate-600 leading-snug">
                            <span
                              className={cn(
                                'w-1 h-1 rounded-full mt-1.5 shrink-0',
                                selected ? 'bg-[#6ba4b8]' : 'bg-slate-400',
                              )}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div>
          <div className="text-sm font-bold text-slate-900">
            Add-ons <span className="font-normal text-slate-400 text-xs">(optional)</span>
          </div>
          <p className="text-xs text-slate-600">Anything extra you'd like included.</p>
        </div>
        <FormField
          control={form.control}
          name="addons"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ADD_ONS.map((addon) => {
                    const selected = field.value?.includes(addon.key);
                    return (
                      <button
                        key={addon.key}
                        type="button"
                        onClick={() =>
                          field.onChange(
                            selected
                              ? field.value.filter((k: string) => k !== addon.key)
                              : [...field.value, addon.key],
                          )
                        }
                        className={cn(
                          'flex items-center justify-between gap-2 h-12 rounded-xl px-3 border-[1.5px] text-left',
                          selected ? 'border-[#6ba4b8] bg-[#6ba4b8]/10' : 'border-slate-200 bg-white',
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={cn(
                              'w-[18px] h-[18px] rounded flex items-center justify-center shrink-0',
                              selected ? 'bg-[#6ba4b8]' : 'border-[1.5px] border-slate-200',
                            )}
                          >
                            {selected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                          </div>
                          <span
                            className={cn(
                              'text-xs font-semibold leading-tight',
                              selected ? 'text-[#6ba4b8]' : 'text-slate-600',
                            )}
                          >
                            {addon.label}
                          </span>
                        </div>
                        <span
                          className={cn('text-xs font-bold shrink-0', selected ? 'text-[#6ba4b8]' : 'text-slate-400')}
                        >
                          +${addon.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">How often?</h2>
        <p className="text-sm text-slate-600">Discounts offered with recurring services.</p>
      </div>

      <FormField
        control={form.control}
        name="frequency"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FREQUENCIES.map((freq) => {
                  const selected = field.value === freq.key;
                  return (
                    <div
                      key={freq.key}
                      role="button"
                      tabIndex={0}
                      onClick={() => field.onChange(freq.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') field.onChange(freq.key);
                      }}
                      className={cn(
                        'relative rounded-2xl px-4 py-5 flex flex-col items-center text-center gap-1 cursor-pointer border-[1.5px]',
                        selected ? 'border-[#6ba4b8] bg-[#6ba4b8]/10' : 'border-slate-200 bg-white',
                      )}
                    >
                      <div className={cn('text-sm font-bold', selected ? 'text-[#6ba4b8]' : 'text-slate-900')}>
                        {freq.label}
                      </div>
                      <div className="text-xs text-slate-500">{freq.sub}</div>
                    </div>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
