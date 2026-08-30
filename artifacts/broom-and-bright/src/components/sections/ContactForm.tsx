import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Mail, CheckCircle } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { API_URL } from '@/lib/api';

interface FormFields {
  name: string;
  phone: string;
  email: string;
  size: string;
  service: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim()) errors.name = 'Name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_RE.test(fields.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  return errors;
}

export function ContactForm() {
  const ref = useScrollReveal();
  const [fields, setFields] = useState<FormFields>({
    name: '', phone: '', email: '',
    size: 'Studio / 1BR', service: 'Standard Clean', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const set = (key: keyof FormFields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFields(f => ({ ...f, [key]: e.target.value }));
    if (submitted) setErrors(validate({ ...fields, [key]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`${API_URL}/api/contact-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error('Request failed');
      setIsSent(true);
    } catch {
      setSubmitError("We couldn't send your message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full h-11 px-4 rounded-lg border transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
    }`;

  return (
    <section id="contact" className="py-24 bg-slate-900 text-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div ref={ref} className="max-w-4xl mx-auto bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700 grid md:grid-cols-5 gap-12 items-center">
          
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4">Have questions?</h2>
            <p className="text-slate-300 mb-8">
              Request a custom quote for a 5BR+ home or ask us anything. We typically reply within 2 hours.
            </p>
            <div className="space-y-4 text-sm text-slate-300">
              <p><strong>Email:</strong><br/>info@truecleankc.com</p>
              <p><strong>Phone:</strong><br/>(785) 829-1574</p>
              <p><strong>Hours:</strong><br/>Mon–Sat, 8AM–6PM</p>
            </div>
          </div>
          
          <div className="md:col-span-3 bg-white text-slate-900 rounded-2xl p-6 md:p-8">
            {isSent ? (
              <div className="flex flex-col items-center text-center py-10">
                <CheckCircle className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Message sent</h3>
                <p className="text-slate-600 text-sm max-w-xs">
                  Thanks, {fields.name.split(' ')[0] || 'there'} — we've got your message and
                  typically reply within 2 hours.
                </p>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Name <span className="text-red-500" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="name" type="text" autoComplete="name"
                    value={fields.name} onChange={set('name')}
                    aria-required="true" aria-describedby={errors.name ? 'name-error' : undefined}
                    className={fieldClass(!!errors.name)} placeholder=""
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="text-xs text-red-500 mt-0.5">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone</label>
                  <input
                    id="phone" type="tel" autoComplete="tel"
                    value={fields.phone} onChange={set('phone')}
                    className={fieldClass(false)} placeholder=""
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-500" aria-hidden="true">*</span>
                </label>
                <input
                  id="email" type="email" autoComplete="email"
                  value={fields.email} onChange={set('email')}
                  aria-required="true" aria-describedby={errors.email ? 'email-error' : undefined}
                  className={fieldClass(!!errors.email)} placeholder=""
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="text-xs text-red-500 mt-0.5">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="size" className="text-sm font-medium text-slate-700">Home Size</label>
                  <select id="size" value={fields.size} onChange={set('size')}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white">
                    <option>Studio / 1BR</option>
                    <option>2BR / 1-2BA</option>
                    <option>3BR / 2BA</option>
                    <option>4BR / 3-4BA</option>
                    <option>5BR+</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label htmlFor="service" className="text-sm font-medium text-slate-700">Service Type</label>
                  <select id="service" value={fields.service} onChange={set('service')}
                    className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white">
                    <option>Standard Clean</option>
                    <option>Deep Clean</option>
                    <option>Move-In/Out</option>
                    <option>Recurring</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                <textarea id="message" rows={3} value={fields.message} onChange={set('message')}
                  className="w-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Any special requests or details we should know?" />
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                We'll send your message to our team and reply by email, usually within 2 hours.
              </p>

              {submitError && (
                <p role="alert" className="text-sm font-medium text-red-500 text-center">{submitError}</p>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 mt-auto text-black font-bold border-2 border-primary bg-transparent">
                <Send className="w-5 h-5 mr-2" /> {isSubmitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
