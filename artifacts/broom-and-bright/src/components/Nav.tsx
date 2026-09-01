import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Link, useLocation } from "wouter";

const SECTIONS = [
  { label: "Services", hash: "services" },
  { label: "How It Works", hash: "how-it-works" },
  { label: "Contact Us", hash: "contact" },
];

const PLEX = { fontFamily: "'IBM Plex Sans', system-ui, sans-serif" } as const;

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // When on a sub-page (e.g. /free-quote), section links must navigate back to
  // the home page first. We use the Vite BASE_URL so it works in both dev
  // (/broom-and-bright/) and any future deploy path.
  const isHome = location === "/";
  const sectionHref = (hash: string) =>
    isHome ? `#${hash}` : `${import.meta.env.BASE_URL}#${hash}`;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={PLEX}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-wide mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Logo className="group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-7">
              {SECTIONS.map(({ label, hash }) => (
                <a
                  key={label}
                  href={sectionHref(hash)}
                  className="text-[0.92rem] font-medium text-[#22343f]/80 hover:text-[#22343f] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
            <Link
              href="/free-quote"
              className="inline-flex items-center justify-center rounded-full bg-[#3fae74] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#359a65] hover:shadow-md"
            >
              Book a clean
            </Link>
          </div>

          {/* Mobile: menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              className="p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
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
          <Link
            href="/free-quote"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-[#3fae74] px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-[#359a65] hover:shadow-md"
          >
            Book a clean
          </Link>
        </div>
      )}
    </nav>
  );
}
