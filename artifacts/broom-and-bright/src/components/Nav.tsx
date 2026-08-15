import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoUrl from '@assets/logo_1786815264958.png';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

const SECTIONS = [
  { label: 'Services', hash: 'services' },
  { label: 'Pricing', hash: 'pricing' },
  { label: 'How It Works', hash: 'how-it-works' },
  { label: 'Reviews', hash: 'reviews' },
  { label: 'FAQ', hash: 'faq' },
];

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // When on a sub-page (e.g. /booking), section links must navigate back to
  // the home page first. We use the Vite BASE_URL so it works in both dev
  // (/broom-and-bright/) and any future deploy path.
  const isHome = location === '/';
  const sectionHref = (hash: string) =>
    isHome ? `#${hash}` : `${import.meta.env.BASE_URL}#${hash}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3'
          : 'bg-white py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <img
              src={logoUrl}
              alt="Broom & Bright"
              className="h-14 md:h-16 w-auto group-hover:opacity-80 transition-opacity"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {SECTIONS.map(({ label, hash }) => (
                <a
                  key={label}
                  href={sectionHref(hash)}
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <Button asChild size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all">
              <Link href="/booking">Book a Cleaning</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg py-4 px-4 flex flex-col gap-4">
          {SECTIONS.map(({ label, hash }) => (
            <a
              key={label}
              href={sectionHref(hash)}
              className="text-base font-medium text-slate-700 py-2 border-b border-slate-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <Button asChild size="lg" className="w-full mt-2 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
            <Link href="/booking">Book a Cleaning</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
