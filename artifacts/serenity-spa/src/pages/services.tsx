import { Link } from "wouter";
import { Clock } from "lucide-react";
import servicesImage from "@assets/generated_images/services-stones.jpg";

export default function Services() {
  const categories = [
    {
      title: "Massage Therapy",
      items: [
        { title: "Swedish Massage", duration: "60 min", price: "$80", desc: "Gentle, flowing strokes for total body relaxation. Improves circulation and relieves mild tension." },
        { title: "Swedish Massage (Extended)", duration: "90 min", price: "$115", desc: "Our classic Swedish massage, extended for deeper relaxation and extra focus on problem areas." },
        { title: "Deep Tissue Massage", duration: "60 min", price: "$90", desc: "Targeted pressure to relieve chronic muscle tension. Ideal for athletes and chronic pain." },
        { title: "Deep Tissue Massage", duration: "90 min", price: "$120", desc: "A full 90 minutes of deep, restorative bodywork to thoroughly work out stubborn knots." },
      ]
    },
    {
      title: "Signature Treatments",
      items: [
        { title: "Hot Stone Massage", duration: "75 min", price: "$100", desc: "Smooth, heated stones are used as an extension of our therapists' hands to melt away deep stress." },
        { title: "Couples Massage", duration: "60 min", price: "$150", desc: "Share the relaxation experience in our private couples suite. Price is for two people." },
        { title: "Aromatherapy Journey", duration: "75 min", price: "$105", desc: "A full body massage incorporating your choice of custom-blended therapeutic essential oils." },
        { title: "Prenatal Massage", duration: "60 min", price: "$85", desc: "Gentle and supportive massage designed specifically for the needs of mothers-to-be (past first trimester)." },
      ]
    }
  ];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-6 mb-20 fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-serif text-foreground mb-6">Services & Pricing</h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-md">
              Simple, transparent pricing. Every session includes complementary warm towels, 
              your choice of organic unscented oil or lotion, and a moment to breathe before we begin.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-64 lg:h-80">
            <img 
              src={servicesImage} 
              alt="Hot massage stones" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto space-y-24">
          {categories.map((category, idx) => (
            <div key={idx} className="fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
              <h2 className="text-3xl font-serif text-foreground mb-10 pb-4 border-b border-border">{category.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12">
                {category.items.map((service, i) => (
                  <div key={i} className="group relative">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-xl font-serif text-foreground">{service.title}</h3>
                      <span className="text-lg text-secondary font-medium">{service.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/50 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                    <p className="text-foreground/70 text-sm leading-relaxed mb-6">
                      {service.desc}
                    </p>
                    <Link 
                      href="/book" 
                      className="text-sm font-medium text-primary hover:text-foreground transition-colors border-b border-primary/30 hover:border-foreground pb-0.5"
                    >
                      Book Session
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Enhancements Add-on note */}
        <div className="max-w-4xl mx-auto mt-24 bg-muted/50 p-8 rounded-2xl text-center border border-border">
          <h3 className="font-serif text-xl mb-4">Looking for something specific?</h3>
          <p className="text-foreground/70 mb-6 max-w-lg mx-auto">
            We can customize any treatment. Ask about adding CBD oil, targeted foot reflexology, or extra scalp massage when you book.
          </p>
          <Link href="/contact" className="inline-block border border-foreground/20 px-6 py-2 rounded-full hover:bg-foreground hover:text-background transition-colors text-sm">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
