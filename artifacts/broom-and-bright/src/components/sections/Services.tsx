import { Sparkles, Droplets, Home, CalendarSync } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const services = [
  {
    id: 'standard-clean',
    title: 'Standard Clean',
    icon: Sparkles,
    description: 'Regular top-to-bottom cleaning to maintain a beautiful, fresh home.',
    includes: [
      'Dusting all surfaces',
      'Vacuuming & mopping floors',
      'Kitchen surfaces & appliances',
      'Bathrooms cleaned & sanitized',
      'Trash removal',
    ],
    link: 'https://cal.com/{{CALCOM_USERNAME}}/standard-clean',
  },
  {
    id: 'deep-clean',
    title: 'Deep Clean',
    icon: Droplets,
    description: 'A full intensive scrub for homes that need a detailed reset.',
    includes: [
      'Everything in Standard',
      'Inside oven & fridge',
      'Baseboards & window sills',
      'Inside cabinets',
      'Grout scrubbing',
    ],
    link: 'https://cal.com/{{CALCOM_USERNAME}}/deep-clean',
  },
  {
    id: 'move-clean',
    title: 'Move-In / Move-Out',
    icon: Home,
    description: 'Spotless preparation for a seamless transition into or out of a home.',
    includes: [
      'Full deep clean',
      'Inside all appliances',
      'All closets & storage',
      'Garage sweep',
      'Final walkthrough',
    ],
    link: 'https://cal.com/{{CALCOM_USERNAME}}/move-clean',
  },
  {
    id: 'recurring',
    title: 'Recurring / Subscription',
    icon: CalendarSync,
    description: 'Save with a regular schedule and keep your home perpetually pristine.',
    includes: [
      'Weekly, bi-weekly, or monthly',
      'Priority booking',
      'Discounted rates (10–20% off)',
      'Same trusted cleaner each visit',
    ],
    link: 'https://cal.com/{{CALCOM_USERNAME}}/recurring',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useScrollReveal();
  
  return (
    <div 
      ref={ref} 
      className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <service.icon className="w-7 h-7 text-primary" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
      <p className="text-slate-600 mb-6 flex-grow">{service.description}</p>
      
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">What's Included</h4>
        <ul className="space-y-3">
          {service.includes.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <Button asChild className="w-full rounded-xl h-12 mt-auto group-hover:bg-primary/90">
        <Link href="/booking">Book This</Link>
      </Button>
    </div>
  );
}

export function Services() {
  const headerRef = useScrollReveal();

  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tailored to your home</h2>
          <p className="text-lg text-slate-600">
            From routine maintenance to rigorous deep cleans, we offer flexible services designed for the way you live.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
