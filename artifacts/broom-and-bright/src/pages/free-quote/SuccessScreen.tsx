import { Check, CalendarCheck } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export function SuccessScreen({ firstName }: { firstName: string }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#6ba4b8]/15 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#6ba4b8] flex items-center justify-center">
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Request sent!</h2>
      <p className="text-slate-600 mb-8">
        Thanks, {firstName} — we'll follow up with your request soon.
      </p>
      <Button asChild size="lg" className="text-black">
        <Link href="/booking">
          <CalendarCheck className="w-4 h-4" />
          Schedule your cleaning
        </Link>
      </Button>
    </div>
  );
}
