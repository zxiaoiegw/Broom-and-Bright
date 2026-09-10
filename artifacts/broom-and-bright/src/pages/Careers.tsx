import { useState, useRef, type FormEvent } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/sections/Footer';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { API_URL } from '@/lib/api';
import { Link } from 'wouter';
import {
  DollarSign,
  Clock,
  SprayCan,
  Users,
  Upload,
  CheckCircle,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: DollarSign,
    title: '$18–$24 / hour',
    body: 'Base pay by experience, plus tips passed through in full.',
  },
  {
    icon: Clock,
    title: 'Flexible work hours',
    body: "Tell us the days and times you're open and we build your route around them.",
  },
  {
    icon: SprayCan,
    title: 'Supplies & equipment provided',
    body: 'Vacuums, products, and PPE are ours. You bring yourself and closed-toe shoes.',
  },
  {
    icon: Users,
    title: 'Friendly, supportive team',
    body: 'Small crews who back each other up, a lead you can reach, and no drama.',
  },
];

const STEPS = [
  {
    n: 'Step 01',
    title: 'Apply',
    body: "Two minutes. Name, phone, and whether you have reliable transportation.",
  },
  {
    n: 'Step 02',
    title: 'Phone screen',
    body: "A 15-minute call about your availability and what you're looking for.",
  },
  {
    n: 'Step 03',
    title: 'Ride-along trial',
    body: "A half-day working alongside a team lead on real jobs so we both know it's a fit.",
  },
  {
    n: 'Step 04',
    title: 'Offer',
    body: 'Written offer with your rate and schedule. Start as soon as your background check clears.',
  },
];

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const RESUME_ACCEPT = '.pdf,.doc,.docx';

interface Fields {
  fullName: string;
  phone: string;
  hasVehicle: '' | 'yes' | 'no';
  experience: string;
  notes: string;
}

interface Errors {
  fullName?: string;
  phone?: string;
  hasVehicle?: string;
}

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (!f.fullName.trim()) e.fullName = 'Please enter your name.';
  if (!f.phone.trim()) e.phone = 'Please enter a phone number.';
  if (!f.hasVehicle) e.hasVehicle = 'Please choose one.';
  return e;
}

function Hero() {
  return (
    <header className="bg-gradient-to-b from-[#e3f2fb] to-[#eaf4fb]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl py-20 md:py-28">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#2f8f5f] mb-4">
            Careers · Kansas City metro
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-[1.08] text-slate-900">
            Get paid to make homes feel brand new.
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            We're the cleaning service that earns a spare key — and that only works
            when our cleaners are treated as well as our clients. Flexible hours you
            help set, weekly pay, and the same neighborhoods every week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-full bg-[#3fae74] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#359a65] hover:shadow-md"
            >
              Apply now
            </a>
            <a
              href="#roles"
              className="inline-flex items-center justify-center rounded-full border-[1.5px] border-slate-900/25 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900"
            >
              See open roles
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Benefits() {
  const ref = useScrollReveal();
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mb-11">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Why cleaners stay with us
          </h2>
          <p className="text-lg text-slate-600">
            Most of our team has been here more than two years. Here's the setup
            that keeps them.
          </p>
        </div>

        <div
          ref={ref}
          className="grid gap-x-14 gap-y-9 sm:grid-cols-2 max-w-3xl"
        >
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-3.5 border-t border-slate-200 pt-4"
            >
              <Icon className="h-[22px] w-[22px] flex-shrink-0 text-primary mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OpenRoles() {
  const ref = useScrollReveal();
  return (
    <section id="roles" className="bg-[#eaf4fb] py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mb-11">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Open roles
          </h2>
          <p className="text-lg text-slate-600">
            All positions are W-2 employment in the Kansas City metro. We're hiring
            on a rolling basis.
          </p>
        </div>

        <div
          ref={ref}
          className="rounded-3xl border border-[#d2e7f6] bg-white overflow-hidden"
        >
          <div className="grid items-center gap-6 p-7 sm:grid-cols-[1.6fr_1fr_1fr_auto]">
            <h3 className="text-lg font-bold text-slate-900">Residential Cleaner</h3>
            <div className="text-sm text-slate-500">
              <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-600 mb-1">
                Type
              </span>
              Full-time &amp; part-time
            </div>
            <div className="text-sm text-slate-500">
              <span className="block text-[11px] font-medium uppercase tracking-[0.08em] text-slate-600 mb-1">
                Area
              </span>
              Overland Park · KCMO
            </div>
            <a
              href="#apply"
              className="text-sm font-semibold text-[#2f8f5f] hover:underline whitespace-nowrap"
            >
              Apply →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HiringSteps() {
  const ref = useScrollReveal();
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-xl mb-11">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            How hiring works
          </h2>
          <p className="text-lg text-slate-600">
            About a week from application to first shift. Every step gets a real
            answer, even if it's a no.
          </p>
        </div>

        <div ref={ref} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="font-mono text-[13px] font-medium tracking-[0.1em] text-[#2f8f5f]">
                {s.n}
              </div>
              <h3 className="mt-3 border-t-2 border-primary pt-3 text-[17px] font-bold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApplicationForm() {
  const ref = useScrollReveal();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState<Fields>({
    fullName: '',
    phone: '',
    hasVehicle: '',
    experience: '',
    notes: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const set =
    <K extends keyof Fields>(key: K) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const next = { ...fields, [key]: e.target.value as Fields[K] };
      setFields(next);
      if (submitted) setErrors(validate(next));
    };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RESUME_BYTES) {
      setResume(null);
      setFileError('That file is over the 5MB limit.');
      e.target.value = '';
      return;
    }
    setFileError(null);
    setResume(file);
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
      const body = new FormData();
      body.append('fullName', fields.fullName);
      body.append('phone', fields.phone);
      body.append('hasVehicle', fields.hasVehicle);
      body.append('experience', fields.experience);
      body.append('notes', fields.notes);
      if (resume) body.append('resume', resume);

      const res = await fetch(`${API_URL}/api/careers-applications`, {
        method: 'POST',
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data.error ?? "We couldn't send your application. Please try again.",
        );
      }
      setIsSent(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "We couldn't send your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = (hasError: boolean) =>
    `w-full h-11 px-3.5 rounded-[10px] border bg-white text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
    }`;

  return (
    <section id="apply" className="bg-[#111a27] text-white py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div
          ref={ref}
          className="mx-auto grid max-w-4xl gap-10 rounded-3xl border border-slate-700/50 bg-slate-800 p-8 md:p-12 md:grid-cols-[0.85fr_1.6fr]"
        >
          <div>
            <h2 className="text-2xl font-bold">Apply in two minutes</h2>
            <p className="mt-3.5 text-sm text-slate-300">
              Tell us how to reach you for the Residential Cleaner role. A resume
              is optional. We reply to every applicant within two business days.
            </p>
            <div className="mt-6 space-y-3 text-[13.5px] text-slate-300">
              <p>
                <strong className="text-white">Email:</strong>
                <br />
                info@truecleankc.com
              </p>
              <p>
                <strong className="text-white">Phone:</strong>
                <br />
                (785) 829-1574
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 text-slate-900 md:p-7">
            {isSent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 text-xl font-bold">Application received</h3>
                <p className="max-w-xs text-sm text-slate-600">
                  Thanks, {fields.fullName.split(' ')[0] || 'there'} — we've got
                  it and reply to every applicant within two business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1">
                  <label
                    htmlFor="fullName"
                    className="text-[13.5px] font-medium text-slate-700"
                  >
                    Full name{' '}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={fields.fullName}
                    onChange={set('fullName')}
                    aria-required="true"
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={fieldClass(!!errors.fullName)}
                  />
                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      role="alert"
                      className="mt-0.5 text-xs text-red-500"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="phone"
                    className="text-[13.5px] font-medium text-slate-700"
                  >
                    Phone{' '}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={fields.phone}
                    onChange={set('phone')}
                    aria-required="true"
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={fieldClass(!!errors.phone)}
                  />
                  {errors.phone && (
                    <p
                      id="phone-error"
                      role="alert"
                      className="mt-0.5 text-xs text-red-500"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="block text-[13.5px] font-medium text-slate-700">
                    Do you have a reliable vehicle to get to jobs?{' '}
                    <span className="text-red-500" aria-hidden="true">
                      *
                    </span>
                  </span>
                  <div className="flex gap-2.5">
                    {(['yes', 'no'] as const).map((opt) => (
                      <label
                        key={opt}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-3 py-2.5 text-sm font-medium capitalize transition-colors ${
                          fields.hasVehicle === opt
                            ? 'border-primary text-[#2f8f5f]'
                            : 'border-slate-200 text-slate-900 hover:border-primary'
                        }`}
                      >
                        <input
                          type="radio"
                          name="hasVehicle"
                          value={opt}
                          checked={fields.hasVehicle === opt}
                          onChange={set('hasVehicle')}
                          className="h-4 w-4 accent-primary"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {errors.hasVehicle && (
                    <p role="alert" className="mt-0.5 text-xs text-red-500">
                      {errors.hasVehicle}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="experience"
                    className="text-[13.5px] font-medium text-slate-700"
                  >
                    Cleaning experience{' '}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="experience"
                    rows={3}
                    value={fields.experience}
                    onChange={set('experience')}
                    className="w-full resize-y rounded-[10px] border border-slate-200 p-3.5 text-sm text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Where you've worked, how long, what kind of cleaning…"
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-[13.5px] font-medium text-slate-700">
                    Resume{' '}
                    <span className="font-normal text-slate-400">
                      (optional · PDF or Word, max 5MB)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-3 rounded-[10px] border-[1.5px] border-dashed border-slate-300 bg-slate-50 p-3.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
                  >
                    <Upload className="h-[22px] w-[22px] flex-shrink-0 text-slate-500" />
                    <span className="text-[13px] text-slate-500">
                      <span className="block text-[13.5px] font-medium text-slate-900">
                        {resume ? resume.name : 'Attach your resume'}
                      </span>
                      {resume
                        ? 'Click to replace this file.'
                        : "Click to choose a file — no resume? Skip this."}
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={RESUME_ACCEPT}
                    onChange={handleFile}
                    className="hidden"
                  />
                  {fileError && (
                    <p role="alert" className="mt-0.5 text-xs text-red-500">
                      {fileError}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="notes"
                    className="text-[13.5px] font-medium text-slate-700"
                  >
                    Anything else we should know?{' '}
                    <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows={2}
                    value={fields.notes}
                    onChange={set('notes')}
                    className="w-full resize-y rounded-[10px] border border-slate-200 p-3.5 text-sm text-slate-900 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Availability, questions…"
                  />
                </div>

                {submitError && (
                  <p
                    role="alert"
                    className="text-center text-sm font-medium text-red-500"
                  >
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#3fae74] text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#359a65] hover:shadow-md disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending…' : 'Send application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Careers() {
  useDocumentHead(
    'Careers | TrueClean KC',
    'Join the TrueClean KC cleaning team in the Kansas City metro. Flexible hours, competitive pay, supplies provided. Apply online in two minutes.',
    '/careers',
  );

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden font-sans">
      <Nav />
      <main className="flex-grow">
        <Hero />
        <Benefits />
        <OpenRoles />
        <HiringSteps />
        <ApplicationForm />
      </main>
      <Footer />
    </div>
  );
}
