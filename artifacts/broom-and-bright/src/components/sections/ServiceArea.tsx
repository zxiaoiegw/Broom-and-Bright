import { MapPin } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const neighborhoods = [
  'Kansas City 64152',
  'Overland Park 66223',
  'Leawood 66211',
  'Lenexa 66215',
  'Olathe 66061',
  'Shawnee 66226',
  'Prairie Village 66208',
];

export function ServiceArea() {
  const ref = useScrollReveal();

  return (
    <section id="service-area" className="py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="md:w-1/2 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Proudly serving your neighborhood</h2>
            <p className="text-lg text-slate-600 mb-6">
              TrueClean KC provides top-tier residential and commercial cleaning services across the Kansas City region and surrounding suburbs.
            </p>
            <div className="bg-amber-50 text-amber-900 p-4 rounded-2xl text-sm font-medium border border-amber-100">
              Don't see your neighborhood? Contact us — we regularly expand our routes and may still be able to help.
            </div>
          </div>

          <div ref={ref} className="md:w-1/2 w-full">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
              <div className="grid sm:grid-cols-2 gap-4">
                {neighborhoods.map((area, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin className="w-4 h-4 text-[#6ba4b8]" />
                    </div>
                    <span className="text-slate-700 font-medium">{area}</span>
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
