import { useState, type FormEvent } from 'react';
import { MapPin, Search, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { SERVICE_AREA_ZIPS, SERVICE_AREA_CITIES } from '@/data/serviceAreaZips';

type LookupResult = 'idle' | 'found' | 'notfound' | 'invalid';

export function ServiceArea() {
  const ref = useScrollReveal();
  const [zip, setZip] = useState('');
  const [result, setResult] = useState<LookupResult>('idle');
  const [match, setMatch] = useState<{ city: string; state: string } | null>(null);

  const handleCheck = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = zip.trim();

    if (!/^\d{5}$/.test(trimmed)) {
      setResult('invalid');
      setMatch(null);
      return;
    }

    const found = SERVICE_AREA_ZIPS[trimmed];
    if (found) {
      setResult('found');
      setMatch(found);
    } else {
      setResult('notfound');
      setMatch(null);
    }
  };

  return (
    <section id="service-area" className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="md:w-1/2 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Proudly serving your neighborhood</h2>
            <p className="text-lg text-slate-600 mb-6">
              TrueClean KC provides top-tier residential and commercial cleaning services across the Kansas City region and surrounding suburbs.
            </p>

            <form onSubmit={handleCheck} className="flex gap-2 mb-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, ''));
                  setResult('idle');
                }}
                placeholder="Enter your ZIP code"
                aria-label="ZIP code"
                className="flex-1 h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6ba4b8]/20 focus:border-[#6ba4b8] transition-all"
              />
              <Button type="submit" className="h-12 rounded-xl px-6 shrink-0 text-black border-transparent">
                <Search className="w-4 h-4" />
                Check
              </Button>
            </form>

            {result === 'found' && match && (
              <div className="flex items-start gap-2.5 text-slate-700 p-4 text-sm font-medium mb-4">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  Good news — we serve {match.city}, {match.state} ({zip})!{' '}
                  <Link href="/free-quote" className="underline font-semibold">
                    Get your free quote
                  </Link>
                  .
                </span>
              </div>
            )}

            {result === 'notfound' && (
              <div className="flex items-start gap-2.5 text-amber-900 p-4 text-sm font-medium mb-4">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>
                  We don't currently service {zip} — but contact us, we regularly expand our routes and may still
                  be able to help.
                </span>
              </div>
            )}

            {result === 'invalid' && (
              <p className="text-sm text-red-500 mb-4">Please enter a valid 5-digit ZIP code.</p>
            )}

            {result === 'idle' && (
              <p className="text-sm text-slate-400 mb-4">Enter your ZIP code to check availability instantly.</p>
            )}
          </div>

          <div ref={ref} className="md:w-1/2 w-full">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                {SERVICE_AREA_CITIES.map(({ city, state }) => (
                  <div key={`${city}-${state}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-4 h-4 text-[#6ba4b8]" />
                    </div>
                    <span className="text-slate-700 font-medium">
                      {city}, {state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
