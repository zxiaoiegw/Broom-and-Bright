import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/sections/Footer';
import { Shield, CheckCircle, Star } from 'lucide-react';
import { useDocumentHead } from '@/hooks/useDocumentHead';

export default function Booking() {
  useDocumentHead(
    'Book a Cleaning | TrueClean KC Kansas City',
    'Schedule your residential cleaning in Kansas City, Overland Park, Leawood, and surrounding areas. Secure online booking.',
    '/booking',
  );

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'all-services' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      <Nav />

      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">

          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Book Your Cleaning
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Pick a time that works for you. Payment is collected securely at booking via Stripe.
            </p>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 font-medium mb-10">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-primary" /> Insured & Bonded</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> Background-Checked Staff</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-primary" /> Satisfaction Guarantee</span>
          </div>

          {/* Cal.com inline embed */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <Cal
              namespace="all-services"
              calLink="kittyiegw-ge70jr"
              style={{ width: '100%', height: '100%', overflow: 'scroll' }}
              config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
            />
          </div>

          {/* Fine print */}
          <p className="text-center text-xs text-slate-400 mt-6">
            Secure checkout powered by Stripe · Cancellation policy: 24-hour notice required
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
