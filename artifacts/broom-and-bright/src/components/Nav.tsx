import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

const SECTIONS = [
  { label: "Services", hash: "services" },
  { label: "How It Works", hash: "how-it-works" },
  { label: "Service Areas", hash: "service-area" },
  { label: "FAQ", hash: "faq" },
  { label: "Contact Us", hash: "contact" },
];

export function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // When on a sub-page (e.g. /booking), section links must navigate back to
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-white py-5"
      }`}
    >
      <div className="container-wide mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Logo className="group-hover:opacity-80 transition-opacity" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {SECTIONS.map(({ label, hash }) => (
                <a
                  key={label}
                  href={sectionHref(hash)}
                  className="text-base font-bold text-slate-600 hover:text-primary transition-colors"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/free-quote"
                className="text-base font-bold text-slate-600 hover:text-primary transition-colors"
              >
                Free Quote
              </Link>
            </div>
            <Button
              asChild
              size="lg"
              className="h-10 px-5 text-base font-medium text-black border-primary bg-primary/80 shadow-sm hover:shadow-md transition-all"
            >
              <Link href="/booking">Schedule Now</Link>
            </Button>
          </div>

          {/* Mobile: phone number + menu toggle */}
          <div className="md:hidden flex items-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-10 px-5 text-base font-medium text-black border-primary bg-primary/80 shadow-sm hover:shadow-md transition-all"
            >
              <Link href="/booking">Schedule Now</Link>
            </Button>
            {/* <a
              href="tel:+17858291574"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 whitespace-nowrap"
            >
              <Phone className="h-4 w-4 text-primary shrink-0" />
              (785) 829-1574
            </a> */}
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
            className="text-base font-medium text-slate-700 py-2 border-b border-slate-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Free Quote
          </Link>
          {/* <Button
            asChild
            size="lg"
            className="w-full mt-2 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Link href="/booking">Book a Cleaning</Link>
          </Button> */}
        </div>
      )}
    </nav>
  );
}
