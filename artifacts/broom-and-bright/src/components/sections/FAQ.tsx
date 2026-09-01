import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'What should I expect on my first cleaning?',
    a: 'Our team will do a full walkthrough before starting. First cleans typically take a bit longer as we get to know your space. We\'ll discuss any special requests and make sure you\'re comfortable before we begin.',
  },
  {
    q: 'Do you bring your own supplies and equipment?',
    a: 'Yes! We bring all cleaning supplies, equipment, and eco-friendly products. If you have a specific product you prefer, just let us know and we can use yours instead.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'We ask for at least 24 hours notice to cancel or reschedule. Cancellations with less than 24 hours notice may be subject to a $50 short-notice fee. Just reach out to us directly by phone or email to make a change.',
  },
  {
    q: 'Will my pets be okay during the cleaning?',
    a: 'Absolutely. Our team loves animals and is comfortable around pets. If your pet is anxious around strangers, we recommend keeping them in a separate room for their comfort.',
  },
  {
    q: 'Should I tip my cleaning team?',
    a: 'Tipping is never expected but always appreciated. 15–20% is customary if you\'re happy with the service. You can tip in cash at the time of service.',
  },
  {
    q: 'What if something is damaged during the cleaning?',
    a: 'We are fully insured and bonded. If anything is damaged during a cleaning, please contact us within 24 hours and we will make it right. We take every incident seriously and carry liability insurance for exactly this reason.',
  },
  {
    q: 'Do I need to be home during the cleaning?',
    a: 'Not at all. Many clients provide a key or door code and go about their day. We\'re background-checked and trusted to work in your home while you\'re away.',
  },
  {
    q: 'How do I pay?',
    a: 'Payment is collected at the time of service. No payment is required to submit a quote or confirm your booking.',
  },
];

export function FAQ() {
  const ref = useScrollReveal();

  return (
    <section id="faq" className="pt4 pb-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about the TrueClean KC experience.
          </p>
        </div>

        <div ref={ref} className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <details 
              key={i} 
              className="group bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between p-6 text-lg font-semibold text-slate-900 cursor-pointer list-none hover:bg-slate-100/50 transition-colors">
                {faq.q}
                <span className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-slate-200 group-open:-rotate-45 transition-transform duration-300">
                  <Plus className="w-5 h-5 text-[#2f7fb8]" />
                </span>
              </summary>
              <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
