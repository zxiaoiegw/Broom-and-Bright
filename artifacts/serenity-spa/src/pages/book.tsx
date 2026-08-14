import { useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';

export default function Book() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: 'serenity-booking' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Book Your Visit</h1>
          <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
            Select your preferred treatment and time below. If you have any specific requests or need to modify an existing appointment, please contact us directly.
          </p>
        </div>

        {/* Booking Embed Container */}
        <div className="fade-in-up delay-100 bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="bg-muted/50 border-b border-border px-6 py-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground/60 uppercase tracking-widest">Secure Booking</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
            </div>
          </div>

          {/* Cal.com booking embed — shows all services for selection */}
          <div id="booking-embed" className="w-full bg-background/50">
            <Cal
              namespace="serenity-booking"
              calLink="zhen-xiao-5ewpz2"
              style={{ width: '100%', height: '100%', minHeight: '650px', overflow: 'scroll' }}
              config={{ layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }}
            />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-foreground/50 fade-in-up delay-200">
          <p>Having trouble booking? Call us at (512) 555-0192</p>
          <p className="mt-2">Cancellation Policy: Please provide 24 hours notice to avoid a 50% cancellation fee.</p>
        </div>
      </div>
    </div>
  );
}
