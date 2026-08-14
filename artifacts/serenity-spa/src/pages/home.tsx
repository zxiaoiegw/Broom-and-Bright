import { Link } from "wouter";
import { ArrowRight, Star, Clock } from "lucide-react";
import heroImage from "@assets/generated_images/hero-spa.jpg";

export default function Home() {
  const services = [
    { title: "Swedish Massage", duration: "60 min", price: "$80", desc: "Gentle, flowing strokes for total body relaxation." },
    { title: "Deep Tissue", duration: "90 min", price: "$120", desc: "Targeted pressure to relieve chronic muscle tension." },
    { title: "Hot Stone", duration: "75 min", price: "$100", desc: "Warm stones melt away stress and ease tight muscles." },
    { title: "Couples Massage", duration: "60 min", price: "$150", desc: "Share the relaxation experience in our private suite." },
  ];

  const testimonials = [
    { name: "Sarah M.", quote: "The most grounding experience I've had in years. The space is beautiful and the attention to detail is remarkable." },
    { name: "James T.", quote: "Finally, a place that doesn't feel clinical. Serenity truly lives up to its name. I'll be coming back monthly." },
    { name: "Elena R.", quote: "From the warm towels to the perfect pressure, everything was flawless. A true neighborhood gem." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Serene spa room" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl fade-in-up">
            <span className="text-primary font-medium tracking-widest uppercase text-sm mb-4 block">Welcome to Serenity</span>
            <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight mb-6">
              Step into a <span className="text-secondary italic">calmer</span> state of mind.
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 leading-relaxed font-light max-w-lg">
              A serene neighborhood spa where you can genuinely unwind. Warm candlelight, linen sheets, and hands that know what they're doing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/book" 
                className="bg-foreground text-background px-8 py-4 rounded-full text-lg font-medium hover:bg-secondary transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 inline-flex items-center gap-2"
              >
                Book Your Visit
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link 
                href="/services" 
                className="bg-white/50 backdrop-blur-sm border border-border text-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-white transition-all duration-300"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <LeafIcon className="h-8 w-8 mx-auto text-primary mb-8 opacity-50" />
          <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 leading-snug">
            Not clinical. Not corporate.<br/> Just real, restorative bodywork.
          </h2>
          <p className="text-foreground/70 text-lg leading-relaxed mb-8">
            We built Serenity because we wanted a place that felt like stepping into a calm room after a long day. 
            No rushing, no bright fluorescent lights. Just experienced therapists, warm oils, and a space designed 
            to help you disconnect from the noise outside.
          </p>
          <Link href="/about" className="text-secondary font-medium hover:text-foreground transition-colors inline-flex items-center gap-1">
            Meet our therapists <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Services Teaser */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-serif text-foreground mb-4">Our Services</h2>
              <p className="text-foreground/70 max-w-md">Tailored treatments to release tension and restore balance to your body and mind.</p>
            </div>
            <Link href="/services" className="text-primary hover:text-secondary font-medium transition-colors whitespace-nowrap">
              View Full Menu &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <div key={i} className="bg-card border border-border p-8 rounded-2xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
                <h3 className="text-xl font-serif text-foreground mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
                <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6 pb-6 border-b border-border/50">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {service.duration}</span>
                  <span>{service.price}</span>
                </div>
                <p className="text-foreground/70 text-sm leading-relaxed mb-8">
                  {service.desc}
                </p>
                <Link href="/book" className="text-sm font-medium text-foreground hover:text-secondary inline-flex items-center gap-1 transition-colors">
                  Book this <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">Kind Words</h2>
            <div className="inline-block bg-background/10 border border-background/20 px-4 py-1 rounded-full text-xs text-background/60 tracking-wider">
              SAMPLE TESTIMONIALS — NOT REAL CUSTOMER REVIEWS
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-background/5 border border-background/10 p-8 rounded-2xl">
                <div className="flex text-secondary mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-background/80 text-lg italic mb-6 leading-relaxed">"{t.quote}"</p>
                <p className="text-background font-medium font-serif">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function LeafIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}