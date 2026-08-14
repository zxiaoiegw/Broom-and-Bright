import { Link } from "wouter";
import aboutImage from "@assets/generated_images/about-spa.jpg";

export default function About() {
  const therapists = [
    {
      name: "Maya Lin",
      title: "Lead Therapist, LMT",
      bio: "With over 12 years of experience in restorative bodywork, Maya specializes in blending Deep Tissue techniques with subtle energy work. She believes that true healing happens when the nervous system feels completely safe. Her touch is grounding, slow, and deeply attentive.",
      initials: "ML"
    },
    {
      name: "David Chen",
      title: "Sports & Structural LMT",
      bio: "David comes to Serenity with a background in physical therapy support. He excels at unraveling chronic tension patterns and helping clients regain mobility. While his work is highly technical, his approach is always warm, unhurried, and communicative.",
      initials: "DC"
    },
    {
      name: "Sarah Jenkins",
      title: "Holistic Therapist, LMT",
      bio: "Sarah's passion is creating a sanctuary for busy minds. Her signature style incorporates gentle Swedish strokes, aromatherapy, and hot stones to melt away the stress of daily life. Clients love her calming presence and meticulous attention to detail.",
      initials: "SJ"
    }
  ];

  return (
    <div className="pt-24 pb-24 min-h-screen bg-background">
      {/* Story Section */}
      <div className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center fade-in-up">
          <div className="order-2 lg:order-1 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl relative z-10">
              <img 
                src={aboutImage} 
                alt="Serenity Spa Lobby" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-3/4 h-3/4 bg-primary/10 rounded-2xl -z-10 hidden md:block"></div>
          </div>
          
          <div className="order-1 lg:order-2">
            <span className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 block">Our Story</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-8 leading-tight">
              A space created for genuine unwinding.
            </h1>
            <div className="space-y-6 text-foreground/70 text-lg leading-relaxed font-light">
              <p>
                Serenity began with a simple observation: most spas feel either too clinical and cold, or too corporate and impersonal. We wanted to build something different.
              </p>
              <p>
                We envisioned a neighborhood sanctuary. A place where the lighting is soft, the linens are heavy and warm, and the therapists genuinely care about your wellbeing. We stripped away the pretension and focused purely on the craft of restorative bodywork.
              </p>
              <p>
                Every detail here is intentional—from the muted colors on our walls to the organic oils we use. We don't rush you in and out. This is your time to disconnect, to breathe, and to heal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Therapists Section */}
      <div className="bg-muted/30 py-24 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto fade-in-up delay-100">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Meet Our Therapists</h2>
            <p className="text-foreground/70">
              Licensed, experienced, and deeply passionate about their craft. 
              <br/>
              <span className="text-xs bg-foreground/5 px-2 py-1 rounded-md mt-4 inline-block text-foreground/50 uppercase tracking-widest">
                Fictional bios for demonstration
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {therapists.map((therapist, i) => (
              <div key={i} className="flex flex-col fade-in-up" style={{ animationDelay: `${(i + 2) * 100}ms` }}>
                <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-2xl font-serif mb-6 border border-primary/30 shadow-inner">
                  {therapist.initials}
                </div>
                <h3 className="text-2xl font-serif text-foreground mb-1">{therapist.name}</h3>
                <p className="text-secondary text-sm font-medium mb-6 uppercase tracking-wider">{therapist.title}</p>
                <p className="text-foreground/70 leading-relaxed text-sm flex-grow">
                  {therapist.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="container mx-auto px-6 pt-24 text-center">
        <h2 className="text-3xl font-serif mb-6">Ready to find your calm?</h2>
        <Link 
          href="/book" 
          className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-medium hover:bg-secondary transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
        >
          Book an Appointment
        </Link>
      </div>
    </div>
  );
}
