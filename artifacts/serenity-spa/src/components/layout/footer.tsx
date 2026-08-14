import { Link } from "wouter";
import { Leaf, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <Leaf className="h-6 w-6 text-primary group-hover:text-secondary transition-colors duration-300" />
              <span className="font-serif text-2xl font-medium tracking-wide">
                Serenity
              </span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              A serene neighborhood spa where you can genuinely unwind. Warm candlelight, 
              linen sheets, and hands that know what they're doing.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-background/90">Navigation</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/book" className="hover:text-primary transition-colors">Book Now</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-background/90">Contact</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li>123 Serenity Lane</li>
              <li>Austin, TX 78701</li>
              <li className="pt-2">512-555-0192</li>
              <li>hello@serenityspa.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6 text-background/90">Hours</h4>
            <ul className="space-y-4 text-sm text-background/70">
              <li className="flex justify-between">
                <span>Mon - Sat</span>
                <span>9am - 7pm</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>10am - 5pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-16 pt-8 text-center text-sm text-background/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Serenity Massage & Spa. All rights reserved.</p>
          <p>Created for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}
