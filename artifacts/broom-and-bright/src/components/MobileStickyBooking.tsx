import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function MobileStickyBooking() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-40">
      <Button asChild size="lg" className="w-full shadow-sm text-black font-bold border-2 border-primary bg-transparent  h-12">
        <Link href="/free-quote">Schedule a Cleaning Now</Link>
      </Button>
    </div>
  );
}
