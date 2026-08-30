import { CheckCircle, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Hero() {
  const contentRef = useScrollReveal();
  const imageRef = useScrollReveal();

  const instantQuoteButton = (
    <Button
      asChild
      className="h-13 px-6 text-base font-semibold lg:h-14 lg:px-6 lg:text-base text-black border-transparent shadow-lg hover:shadow-xl transition-all"
    >
      <Link href="/free-quote">FREE INSTANT QUOTE</Link>
    </Button>
  );

  const phonePill = (
    <a
      href="tel:+17858291574"
      className="flex items-center justify-center gap-2 h-11 lg:h-14 px-4 text-white/90 hover:text-white transition-colors"
    >
      <Phone className="w-4 h-4" />
      <span className="text-base lg:text-xl font-semibold underline underline-offset-4 decoration-white/40">(785) 829-1574</span>
    </a>
  );

  return (
    <section className="overflow-hidden">
      {/* Full-bleed hero image with heading/CTA overlaid */}
      <div ref={imageRef} className="relative w-full pt-20 md:pt-24">
        <img
          src="/hero-cleaning.png"
          alt="TrueClean KC team member cleaning a kitchen countertop"
          className="w-full h-[65vh] md:h-[70vh] lg:h-[85vh] max-h-[800px] min-h-[480px] object-cover"
        />
        <div className="absolute left-0 right-0 bottom-0 top-20 md:top-24 bg-linear-to-t from-black/80 via-black/45 to-black/10" />

        <div
          ref={contentRef}
          className="absolute left-0 right-0 bottom-0 top-20 md:top-24 flex flex-col items-center justify-end text-center px-4 md:px-6 pb-10 md:pb-16"
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-md">
              Professional House <span>Cleaning Services in</span> <br className="hidden md:block" />
              <span className="text-[#8fc3d4] relative inline-block">
                Overland Park.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#8fc3d4]-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="hidden md:block text-lg md:text-xl text-white/90 mb-8 leading-relaxed drop-shadow-md">
              Professional, reliable, and detail-oriented cleaning services for homes, apartments, and businesses across greater Kansas City.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6">
              {instantQuoteButton}
              {phonePill}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/90 font-medium drop-shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#8fc3d4]" />
                <span>Background-Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-[#8fc3d4]" />
                <span>Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
