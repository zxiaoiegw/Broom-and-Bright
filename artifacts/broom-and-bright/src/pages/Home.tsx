import { Nav } from '@/components/Nav';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ServiceArea } from '@/components/sections/ServiceArea';
import { FAQ } from '@/components/sections/FAQ';
import { ContactForm } from '@/components/sections/ContactForm';
import { Footer } from '@/components/sections/Footer';
import { useDocumentHead } from '@/hooks/useDocumentHead';

export default function Home() {
  useDocumentHead(
    'TrueClean KC | Professional Cleaning Services in Kansas City',
    'Professional, trusted, and thorough residential cleaning services in the Kansas City area.',
    '/',
  );

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      <Nav />
      
      <main className="flex-grow">
        <Hero />
        <Services />
        <HowItWorks />
        <ServiceArea />
        <FAQ />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}
