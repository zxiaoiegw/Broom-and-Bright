import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Calculator, MousePointerClick, CalendarCheck, Sparkles, Star } from 'lucide-react';

const steps = [
  {
    icon: Calculator,
    title: 'Get Your Quote',
    description: 'Answer a few quick questions and get an instant price — no phone calls needed.',
  },
  {
    icon: MousePointerClick,
    title: 'Book Online',
    description: 'Pick a time that works for you, and book in under 1 minute.',
  },
  {
    icon: CalendarCheck,
    title: 'We Confirm',
    description: 'We review and confirm your appointment within 1 hour.',
  },
  {
    icon: Sparkles,
    title: 'We Clean',
    description: 'Our vetted professionals clean your home exactly to our high standards.',
  },
  {
    icon: Star,
    title: 'You Relax',
    description: 'Enjoy your spotless space. Satisfaction guaranteed or we come back free.',
  },
];

export function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Effortlessly simple</h2>
          <p className="text-lg text-slate-600">
            We've removed the friction from hiring a cleaner. Get an instant quote and book online — no phone calls, no waiting for callbacks.
          </p>
        </div>

        <div ref={ref} className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-6 relative border-4 border-slate-50">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#6ba4b8] text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-slate-50 shadow-sm">
                    {index + 1}
                  </div>
                  <step.icon className="w-10 h-10 text-[#6ba4b8]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed px-4">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
