import { Star } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const reviews = [
  {
    quote: "I've tried three other services and Broom & Bright is in a completely different league. My apartment looked brand new after the first visit. I've had a recurring booking ever since.",
    name: "Sarah M.",
    location: "Riverside Heights",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "Booking was effortless and the team showed up exactly on time. They cleaned things I didn't even think to ask about. Absolutely worth every penny.",
    name: "James T.",
    location: "Maplewood District",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    quote: "As a landlord, I use them between every tenant. The move-out clean is so thorough my realtor commented on it. Would not use anyone else.",
    name: "Linda K.",
    location: "Downtown",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  }
];

export function Testimonials() {
  const ref = useScrollReveal();

  return (
    <section id="reviews" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by the neighborhood</h2>
          <p className="text-lg text-slate-300">
            Don't just take our word for it. Here's what your neighbors have to say.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-3xl"
            >
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                "{review.quote}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                />
                <div>
                  <h4 className="font-bold text-white">{review.name}</h4>
                  <p className="text-sm text-slate-400">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
