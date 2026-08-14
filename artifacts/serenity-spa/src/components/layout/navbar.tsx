import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Leaf } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Leaf className="h-6 w-6 text-primary group-hover:text-secondary transition-colors duration-300" />
          <span className="font-serif text-2xl font-medium tracking-wide text-foreground">
            Serenity
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-secondary ${
                location === link.href
                  ? "text-secondary"
                  : "text-foreground/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-secondary transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-t border-border shadow-lg md:hidden py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-lg py-2 transition-colors ${
                location === link.href ? "text-secondary font-medium" : "text-foreground/80"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-center font-medium mt-4"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}
