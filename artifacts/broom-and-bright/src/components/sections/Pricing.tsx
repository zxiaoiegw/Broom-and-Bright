import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Info } from 'lucide-react';

export function Pricing() {
  const ref = useScrollReveal();

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Transparent Pricing</h2>
          <p className="text-lg text-slate-600">
            No hidden fees. Just clear, honest pricing based on the size of your home and the depth of the clean.
          </p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="py-5 px-6 font-semibold text-slate-900">Home Size</th>
                    <th className="py-5 px-6 font-semibold text-slate-900">Standard Clean</th>
                    <th className="py-5 px-6 font-semibold text-slate-900">Deep Clean</th>
                    <th className="py-5 px-6 font-semibold text-slate-900">Move-In/Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">Studio / 1BR</td>
                    <td className="py-4 px-6 text-slate-600">from $89</td>
                    <td className="py-4 px-6 text-slate-600">from $149</td>
                    <td className="py-4 px-6 text-slate-600">from $199</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">2BR / 1–2BA</td>
                    <td className="py-4 px-6 text-slate-600">from $119</td>
                    <td className="py-4 px-6 text-slate-600">from $189</td>
                    <td className="py-4 px-6 text-slate-600">from $249</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors bg-teal-50/30">
                    <td className="py-4 px-6 font-medium text-slate-900">3BR / 2BA</td>
                    <td className="py-4 px-6 text-primary font-medium">from $149</td>
                    <td className="py-4 px-6 text-slate-600">from $229</td>
                    <td className="py-4 px-6 text-slate-600">from $299</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">4BR+</td>
                    <td className="py-4 px-6 text-slate-500 italic">Custom Quote</td>
                    <td className="py-4 px-6 text-slate-500 italic">Custom Quote</td>
                    <td className="py-4 px-6 text-slate-500 italic">Custom Quote</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50 p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm border-t border-slate-100">
              <div className="flex items-center gap-2 text-primary font-medium bg-teal-100/50 px-3 py-1.5 rounded-full">
                <Info className="w-4 h-4" />
                Recurring subscriptions save 10–20% on all standard cleans.
              </div>
              <p className="text-slate-500 text-center md:text-right">
                Final pricing and payment confirmed securely at booking via Cal.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
