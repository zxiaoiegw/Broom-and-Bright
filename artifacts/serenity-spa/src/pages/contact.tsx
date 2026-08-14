import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset after 3 seconds for demo purposes
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Get in Touch</h1>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Whether you have a question about our services or need help booking, we're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-12 fade-in-up delay-100">
            <div>
              <h2 className="text-2xl font-serif text-foreground mb-8">Location & Hours</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Address</h3>
                    <p className="text-foreground/70">123 Serenity Lane<br/>Austin, TX 78701</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Phone</h3>
                    <p className="text-foreground/70">512-555-0192</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Email</h3>
                    <p className="text-foreground/70">hello@serenityspa.com</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Hours</h3>
                    <div className="text-foreground/70 space-y-1">
                      <p className="flex justify-between w-48"><span>Mon – Sat:</span> <span>9am – 7pm</span></p>
                      <p className="flex justify-between w-48"><span>Sunday:</span> <span>10am – 5pm</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted p-8 rounded-2xl border border-border">
              <h3 className="font-serif text-xl text-foreground mb-3">Parking</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">
                Complimentary parking is available in the private lot directly behind our building. Please use the alleyway entrance off 2nd Street.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="fade-in-up delay-200">
            <div className="bg-card p-8 md:p-10 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-serif text-foreground mb-6">Send a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-primary/10 text-primary border border-primary/20 rounded-xl p-8 text-center h-[350px] flex flex-col items-center justify-center animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Message Sent</h3>
                  <p className="text-sm opacity-80">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground block">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground block">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground block">Message</label>
                    <textarea 
                      id="message" 
                      required
                      rows={5}
                      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-foreground text-background py-3.5 rounded-lg font-medium hover:bg-secondary transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
