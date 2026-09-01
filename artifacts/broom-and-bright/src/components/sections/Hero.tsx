import { CheckCircle, Star, Phone } from 'lucide-react';
import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { HeroIllustration } from '@/components/HeroIllustration';

// "Option A" pale-blue hero wash: a simple vertical gradient — cyan at the top,
// whitest through the middle, a cooler blue settling at the bottom.
const HERO_GRADIENT: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(180deg, #DAF4FE 0%, #E3F7FF 20%, #F4FFFF 50%, #EDFEFF 72%, #DDEFFF 100%)',
  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
};

export function Hero() {
  const contentRef = useScrollReveal();
  const artRef = useScrollReveal();

  return (
    <section className="relative overflow-hidden" style={HERO_GRADIENT}>
      <div className="container-wide mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-14 md:pb-24">
        <div className="grid items-center gap-8 lg:gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          {/* Copy */}
          <div ref={contentRef} className="text-center lg:text-left">
            <p
              className="mb-4 text-xs font-medium uppercase tracking-[0.16em] text-[#0f6f9e]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Trusted cleaners for home &amp; work
            </p>

            <h1
              className="mb-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.02em] leading-[1.04] text-[#22343f] text-balance"
              style={{ fontFamily: "'Bricolage Grotesque', 'Segoe UI', sans-serif" }}
            >
              Come back to a place that{' '}
              <span className="text-[#3fae74]">sparkles</span>.
            </h1>

            <p className="mb-8 max-w-xl mx-auto lg:mx-0 text-base md:text-lg leading-relaxed text-[#4c5c68]">
              True Clean matches you with vetted local cleaners, handles the
              scheduling, and backs every visit with a spotless-or-we-return
              promise.
            </p>

            <div className="mb-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="/free-quote"
                className="inline-flex items-center justify-center rounded-full bg-[#3fae74] px-7 py-3.5 text-base font-semibold text-white shadow-[0_14px_26px_-12px_rgba(63,174,116,0.6)] transition-all hover:-translate-y-0.5 hover:bg-[#359a65]"
              >
                Free Quote
              </Link>

              <a
                href="tel:+17858291574"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#3fae74] bg-white/40 px-6 py-3.5 text-base font-semibold text-[#2f8f5f] transition-all hover:-translate-y-0.5 hover:bg-[#3fae74]/10"
              >
                <Phone className="h-4 w-4" />
                (785) 829-1574
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-medium text-[#59707d]">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#fbbf24]" />
                Background-checked cleaners
              </span>
              <span className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#fbbf24]" />
                Satisfaction guarantee
              </span>
            </div>
          </div>

          {/* Frameless layered illustration with cursor parallax */}
          <div ref={artRef} className="w-full mt-6 lg:mt-16 lg:-mr-4 xl:-mr-14 2xl:-mr-24">
            <HeroIllustration className="w-full [&_#hero-illustration]:block [&_#hero-illustration]:h-auto [&_#hero-illustration]:w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
