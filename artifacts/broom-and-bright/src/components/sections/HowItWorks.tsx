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
    description: 'Our vetted professionals clean your space exactly to our high standards.',
  },
  {
    icon: Star,
    title: 'You Relax',
    description: 'Enjoy your spotless space. Satisfaction guaranteed or we come back free.',
  },
];

// Per-step vertical offset (lg+ only) so the badges ride the wave.
const LG_OFFSET = ['lg:mt-24', 'lg:mt-8', 'lg:mt-20', 'lg:mt-0', 'lg:mt-16'];

function Wave() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden lg:block" aria-hidden="true">
      <svg
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
        className="h-115 w-full"
      >
        <path
          d="M0,150 C170,60 330,60 480,130 C630,200 770,200 920,110 C1040,40 1130,70 1200,95 L1200,260 L0,260 Z"
          fill="#e2f0fa"
        />
        <path
          d="M0,180 C170,100 330,100 480,165 C630,225 770,225 920,140 C1040,75 1130,100 1200,120 L1200,260 L0,260 Z"
          fill="#d2e7f6"
        />
      </svg>
    </div>
  );
}

export function HowItWorks() {
  const ref = useScrollReveal();

  return (
    <section id="how-it-works" className="relative overflow-hidden pt-4 pb-28 bg-[#eaf4fb]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Effortlessly simple</h2>
          <p className="text-lg text-slate-600">
            We've removed the friction from hiring a cleaner. Get an instant quote and book online — no phone calls, no waiting for callbacks.
          </p>
        </div>

        <div ref={ref} className="relative">
          <Wave />

          <div className="relative z-10 grid gap-14 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-5 lg:items-start lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center ${LG_OFFSET[index]}`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-[#54b6e6] to-[#2f7fb8] shadow-lg shadow-[#3fa0c7]/25 ring-[6px] ring-[#3fa0c7]/10">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-60">
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
