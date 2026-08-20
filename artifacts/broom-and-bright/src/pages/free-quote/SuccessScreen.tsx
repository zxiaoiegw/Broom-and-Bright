import { Check } from 'lucide-react';

export function SuccessScreen({ firstName }: { firstName: string }) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-6 h-6 text-white" strokeWidth={3} />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Request sent!</h2>
      <p className="text-slate-600">
        Thanks, {firstName} — we'll follow up with your request soon.
      </p>
    </div>
  );
}
