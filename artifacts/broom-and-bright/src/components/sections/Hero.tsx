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
      className="rounded-full h-8 px-6 text-sm lg:h-14 lg:px-6 lg:text-base lg:rounded-full text-black border-transparent shadow-lg hover:shadow-xl transition-all"
    >
      <Link href="/free-quote">FREE INSTANT QUOTE</Link>
    </Button>
  );

  const phonePill = (
    <a
      href="tel:+15558675309"
      className="flex items-center gap-3 h-14 px-6 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-primary shrink-0">
        <Phone className="w-4 h-4" />
      </span>
      <span className="text-base font-semibold text-slate-900">(555) 867-5309</span>
    </a>
  );

  return (
    <section className="pt-24 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="container-wide mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          {/* Compact image banner — shows first on mobile, second on desktop */}
          <div ref={imageRef} className="relative order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="absolute inset-0 bg-teal-100 rounded-3xl transform translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4 -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400"
              alt="Sparkling clean bright kitchen"
              className="rounded-3xl shadow-xl w-full object-cover aspect-[3/2] lg:aspect-[4/3]"
            />

            {/* Floating review badge — desktop only */}
            <div className="hidden lg:block absolute lg:bottom-8 lg:-left-12 bg-white p-3 lg:p-4 rounded-2xl shadow-xl max-w-[200px] lg:max-w-[220px] animate-in fade-in zoom-in duration-700 delay-300">
              <div className="flex gap-1 mb-1.5 lg:mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3.5 h-3.5 lg:w-4 lg:h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 font-medium leading-tight">
                "It feels like a brand new house. Incredibly thorough!"
              </p>
            </div>

            {/* Mobile-only: tagline + CTA overlaid near the bottom of the image. Phone number lives in the mobile nav bar instead. */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden lg:hidden">
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
              <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-20 gap-3">
                <p className="text-white font-serif font-bold text-2xl md:text-3xl lg:text-4xl leading-snug drop-shadow-md">
                  Trusted Home Cleaners in Kansas City
                </p>
                {instantQuoteButton}
              </div>
            </div>
          </div>

          <div ref={contentRef} className="max-w-2xl order-3 lg:order-1 pt-4 lg:pt-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              Come home to <br className="hidden md:block" />
              <span className="text-[#6ba4b8] relative inline-block">
                bright, clean spaces.
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#6ba4b8]-200/60 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              We’re the cleaning service that earns a spare key. Trustworthy, meticulous, and dedicated to making your home feel like a breath of fresh air.
            </p>

            <div className="hidden lg:flex gap-4 mb-10">
              {instantQuoteButton}
              {phonePill}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>Insured & Bonded</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Background-Checked</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span>Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>500+ Homes Cleaned</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
