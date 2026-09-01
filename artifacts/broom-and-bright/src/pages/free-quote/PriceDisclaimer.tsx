import { Info } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { PRICE_FACTORS } from './pricing';

export function PriceDisclaimer() {
  return (
    <p className="text-xs text-slate-400 flex items-start gap-1">
      <span>This is an estimate, not a final price — your actual cost may vary based on your home's condition.</span>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="shrink-0 text-slate-400 hover:text-[#3fae74] transition-colors mt-0.5"
            aria-label="Why might my price change?"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 text-xs" align="end">
          <p className="font-semibold text-slate-900 mb-2">Why might my price change?</p>
          <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
            {PRICE_FACTORS.map((factor) => (
              <li key={factor}>{factor}</li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </p>
  );
}
