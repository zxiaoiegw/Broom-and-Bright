import { Home as HomeIcon, Clock, Phone, ChevronRight } from 'lucide-react';
import { HOURLY_RATE } from './pricing';

const PHONE_DISPLAY = '(785) 829-1574';
const PHONE_HREF = 'tel:+17858291574';

export function StartScreen({ onSelect }: { onSelect: (mode: 'standard' | 'hourly') => void }) {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Let's get started! What type of cleaning are you looking for?
        </h2>
      </div>

      <button
        type="button"
        onClick={() => onSelect('standard')}
        className="w-full text-left rounded-2xl border-[1.5px] border-slate-200 bg-white p-5 flex items-start gap-4 hover:border-[#6ba4b8] hover:bg-[#6ba4b8]/5 transition-colors group"
      >
        <div className="w-11 h-11 rounded-xl bg-[#6ba4b8]/10 flex items-center justify-center shrink-0">
          <HomeIcon className="w-5 h-5 text-[#6ba4b8]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900">
            Standard cleaning package based on the size of your home
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Priced from your bedrooms, bathrooms, and square footage. Best for regular upkeep,
            one-time deep cleans, and move-in / move-out.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#6ba4b8] shrink-0 mt-1" />
      </button>

      <div className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">or</div>

      <button
        type="button"
        onClick={() => onSelect('hourly')}
        className="w-full text-left rounded-2xl border-[1.5px] border-slate-200 bg-white p-5 flex items-start gap-4 hover:border-[#6ba4b8] hover:bg-[#6ba4b8]/5 transition-colors group"
      >
        <div className="w-11 h-11 rounded-xl bg-[#6ba4b8]/10 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-[#6ba4b8]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900">Hourly service</div>
          <p className="text-xs text-slate-600 mt-1">
            Tell us how many hours you need and we'll send a cleaner. Each hour booked is one
            person working for one hour. Great when you have a
            specific task list, a set budget, or only part of the home to cover.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#6ba4b8] shrink-0 mt-1" />
      </button>

      <div className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">or</div>

      <a
        href={PHONE_HREF}
        className="w-full text-left rounded-2xl border-[1.5px] border-slate-200 bg-white p-5 flex items-start gap-4 hover:border-[#6ba4b8] hover:bg-[#6ba4b8]/5 transition-colors group"
      >
        <div className="w-11 h-11 rounded-xl bg-[#6ba4b8]/10 flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-[#6ba4b8]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-900">Contact us</div>
          <p className="text-xs text-slate-600 mt-1">
            Not sure which fits? Call{' '}
            <span className="font-semibold text-[#6ba4b8]">{PHONE_DISPLAY}</span> and we'll help you
            figure out the right option.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#6ba4b8] shrink-0 mt-1" />
      </a>
    </div>
  );
}
