import type { UseFormReturn } from 'react-hook-form';
import type { FreeQuoteFormValues } from './schema';
import { SERVICE_TYPES, ADD_ONS, FREQUENCIES, getPricingTier, getQuoteBreakdown, totalBathrooms } from './pricing';
import { PriceDisclaimer } from './PriceDisclaimer';

export function OrderSummary({ form }: { form: UseFormReturn<FreeQuoteFormValues> }) {
  const values = form.watch();
  const pricingTier = getPricingTier(values.bedrooms);
  const service = SERVICE_TYPES.find((s) => s.key === values.serviceType);
  const frequency = FREQUENCIES.find((f) => f.key === values.frequency);
  const selectedAddons = ADD_ONS.filter((a) => values.addons?.includes(a.key));

  const { basePrice, subtotal, discountPercent, discountAmount, total } = getQuoteBreakdown({
    bedrooms: values.bedrooms,
    bathrooms: totalBathrooms(values.bathrooms, values.halfBaths),
    squareFeet: values.squareFeet,
    serviceType: values.serviceType,
    addons: values.addons ?? [],
    frequency: values.frequency,
  });

  const isCustomQuote = pricingTier === null;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 space-y-4">
      <div className="text-sm font-bold text-slate-900 uppercase tracking-wide">Quote Summary</div>

      {isCustomQuote ? (
        <p className="text-sm text-slate-600">
          5+ bedroom homes get a custom quote — we'll follow up with a number after you submit.
        </p>
      ) : !service ? (
        <p className="text-sm text-slate-500">Choose a cleaning type to see your price.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-start text-sm">
            <span className="text-slate-600">{service.label}</span>
            <span className="font-semibold text-slate-900 shrink-0">${basePrice}</span>
          </div>

          {selectedAddons.map((addon) => (
            <div key={addon.key} className="flex justify-between items-start text-sm">
              <span className="text-slate-600">{addon.label}</span>
              <span className="font-semibold text-slate-900 shrink-0">+${addon.price}</span>
            </div>
          ))}

          <div className="h-px bg-slate-100" />

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className={discountPercent > 0 ? 'text-slate-400 line-through' : 'font-semibold text-slate-900'}>
              ${subtotal}
            </span>
          </div>

          {discountPercent > 0 && frequency && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#3fae74] font-medium">
                {Math.round(discountPercent * 100)}% Off Applied
              </span>
              <span className="text-[#3fae74] font-semibold">-${discountAmount}</span>
            </div>
          )}

          <div className="h-px bg-slate-100" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">
              {frequency && frequency.key !== 'oneTime' ? 'Total per visit' : 'Estimated total'}
            </span>
            <span className="text-xl font-extrabold text-[#3fae74]">from ${total}</span>
          </div>

          <PriceDisclaimer />

          {!values.frequency && (
            <p className="text-xs text-slate-400">Pick how often for recurring discounts up to 30% off.</p>
          )}
        </div>
      )}
    </div>
  );
}
