import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_LABELS } from './schema';

export function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-2 w-20 sm:w-24">
            <div
              className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2',
                i < step
                  ? 'bg-[#6ba4b8] border-[#6ba4b8] text-white'
                  : i === step
                    ? 'bg-[#6ba4b8] border-[#6ba4b8] text-white ring-4 ring-[#6ba4b8]/20'
                    : 'bg-white border-slate-200 text-slate-400',
              )}
            >
              {i < step ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
            </div>
            <span
              className={cn(
                'text-xs font-semibold text-center',
                i <= step ? 'text-[#6ba4b8]' : 'text-slate-400',
              )}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={cn('h-0.5 w-8 sm:w-14 mb-6', i < step ? 'bg-[#6ba4b8]' : 'bg-slate-200')} />
          )}
        </div>
      ))}
    </div>
  );
}
