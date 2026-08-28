import { Shield, CheckCircle, Star, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Hero() {
  const contentRef = useScrollReveal();
  const imageRef = useScrollReveal();

  const instantQuoteButton = (
    <Button
      asChild
      className="rounded-full h-11 px-6 text-sm lg:h-14 lg:px-6 lg:text-base lg:rounded-full text-black border-transparent shadow-lg hover:shadow-xl transition-all"
    >
      <Link href="/free-quote">FREE INSTANT QUOTE</Link>
    </Button>
  );

  const phonePill = (
    <a
      href="tel:+17858291574"
      className="flex items-center justify-center gap-3 h-11 lg:h-14 px-6 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-primary shrink-0">
        <Phone className="w-4 h-4" />
      </span>
      <span className="text-base font-semibold text-slate-900">(785) 829-1574</span>
    </a>
  );

  return (
    <section className="pb-16 md:pb-24 overflow-hidden">
      {/* Full-bleed hero image with heading/CTA overlaid */}
      <div ref={imageRef} className="relative w-full pt-20 md:pt-24">
        <img
          src="/hero-cleaning.png"
          alt="TrueClean KC team member cleaning a kitchen countertop"
          className="w-full h-[65vh] md:h-[70vh] lg:h-[85vh] max-h-[800px] min-h-[480px] object-cover"
        />
        <div className="absolute left-0 right-0 bottom-0 top-20 md:top-24 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

        <div
          ref={contentRef}
          className="absolute left-0 right-0 bottom-0 top-20 md:top-24 flex flex-col items-center justify-end text-center px-4 md:px-6 pb-10 md:pb-16"
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-md">
              Come home to <br className="hidden md:block" />
              <span className="text-[#8fc3d4] relative inline-block">
                bright, clean spaces.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#8fc3d4]-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
              We're the cleaning service that earns a spare key. Trustworthy, meticulous, and dedicated to making your home feel like a breath of fresh air.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {instantQuoteButton}
              {phonePill}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-700 font-medium max-w-xl mx-auto pt-10 md:pt-14">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span>Insured & Bonded</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Background-Checked</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>500+ Homes Cleaned</span>
          </div>
        </div>
      </div>
    </section>
  );
}
