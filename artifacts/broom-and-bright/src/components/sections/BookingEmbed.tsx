import { useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function BookingEmbed() {
  const ref = useScrollReveal();

  useEffect(() => {
    // Only load the script once
    if (document.getElementById('cal-script')) return;

    const script = document.createElement('script');
    script.id = 'cal-script';
    script.innerHTML = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
        let d = C.document;
        C.Cal = C.Cal || function () { 
          let cal = C.Cal; let ar = arguments; 
          if (!cal.loaded) { 
            cal.ns = {}; cal.q = cal.q || []; 
            d.head.appendChild(d.createElement("script")).src = A; 
            cal.loaded = true; 
          } 
          if (ar[0] === L) { 
            const api = function () { p(api, arguments); }; 
            const namespace = ar[1]; 
            api.q = api.q || []; 
            if (typeof namespace === "string") { 
              cal.ns[namespace] = cal.ns[namespace] || api; 
              p(cal.ns[namespace], ar); 
              p(cal, [L, namespace, ar[2]]); 
            } else p(cal, ar); 
            return; 
          } 
          p(cal, ar); 
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");
      Cal("init", {origin:"https://app.cal.com"});
      Cal("inline", {
        elementOrSelector:"#cal-booking-placeholder",
        calLink: "{{CALCOM_USERNAME}}/book",
        layout: "month_view"
      });
      Cal("ui", {
        styles: { branding: { brandColor: "#14b8a6" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    `;
    document.body.appendChild(script);

    return () => {
      // Clean up could go here, but Cal.com embed is tricky to fully unload.
    };
  }, []);

  return (
    <section id="book-now" className="py-24 bg-teal-50/30 border-y border-teal-100/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Book Your Cleaning</h2>
          <p className="text-lg text-slate-600">
            Select your preferred time below. No payment is required until the day of your cleaning.
          </p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-2 md:p-6 min-h-[750px]">
          <div 
            id="cal-booking-placeholder" 
            className="w-full h-full min-h-[700px] overflow-hidden rounded-2xl"
          >
            {/* Cal.com widget injects here */}
            <div className="flex items-center justify-center h-full text-slate-400 animate-pulse">
              Loading booking calendar...
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
