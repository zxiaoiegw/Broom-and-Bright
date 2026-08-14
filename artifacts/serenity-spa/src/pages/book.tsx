export default function Book() {
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
          
          {/* This is the required embed container */}
          <div 
            id="booking-embed" 
            className="w-full min-h-[500px] flex items-center justify-center bg-background/50 p-8"
          >
            <div className="text-center max-w-sm border-2 border-dashed border-border p-12 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Booking widget will appear here</h3>
              <p className="text-sm text-foreground/50">
                The external booking system (e.g. Cal.com) will be injected into this container.
              </p>
            </div>
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
