import { Nav } from '@/components/Nav';
import { Footer } from '@/components/sections/Footer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useDocumentHead } from '@/hooks/useDocumentHead';
import { API_URL } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

import { freeQuoteFormSchema, STEP_FIELDS, STEP_LABELS, type FreeQuoteFormValues } from './free-quote/schema';
import { getQuoteBreakdown } from './free-quote/pricing';
import { usePhotoUpload } from './free-quote/usePhotoUpload';
import { StepIndicator } from './free-quote/StepIndicator';
import { SuccessScreen } from './free-quote/SuccessScreen';
import { ContactStep } from './free-quote/ContactStep';
import { HomeDetailsStep } from './free-quote/HomeDetailsStep';
import { ServiceStep } from './free-quote/ServiceStep';
import { ReviewStep } from './free-quote/ReviewStep';
import { OrderSummary } from './free-quote/OrderSummary';

export default function FreeQuote() {
  useDocumentHead(
    'Free Quote | TrueClean KC Kansas City',
    'Get a free quote for your residential cleaning in Kansas City, Overland Park, Leawood, and surrounding areas. Contact us today to schedule your cleaning service and receive a personalized quote tailored to your needs.',
    '/free-quote',
  );

  const form = useForm<FreeQuoteFormValues>({
    resolver: zodResolver(freeQuoteFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      bedrooms: 1,
      bathrooms: 1,
      pets: 'no',
      squareFeet: '',
      frequency: undefined,
      serviceType: undefined,
      addons: [],
      additionalNotes: '',
      preferredContact: undefined,
    },
  });

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { photos, photoErrors, handlePhotoChange, handlePhotoDrop, handleDragOver, removePhoto } = usePhotoUpload();

  const values = form.watch();
  const errors = form.formState.errors;

  const isStepComplete = (stepIndex: number) => {
    return STEP_FIELDS[stepIndex].every((fieldName) => {
      if (errors[fieldName]) return false;
      const value = values[fieldName];
      if (Array.isArray(value)) return true;
      return value !== undefined && value !== null && String(value).trim() !== '';
    });
  };

  const canGoNext = isStepComplete(step);
  const canSubmit = STEP_FIELDS.every((_, i) => isStepComplete(i)) && !isSubmitting;

  const goNext = async () => {
    const valid = await form.trigger(STEP_FIELDS[step] as (keyof FreeQuoteFormValues)[]);
    if (valid) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FreeQuoteFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // null means the home is 5BR+ and falls outside every priced tier — a custom quote, not a number.
      const { total: estimatedTotal } = getQuoteBreakdown({
        bedrooms: data.bedrooms,
        serviceType: data.serviceType,
        addons: data.addons,
        frequency: data.frequency,
      });

      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('address', data.address);
      formData.append('bedrooms', String(data.bedrooms));
      formData.append('bathrooms', String(data.bathrooms));
      formData.append('pets', data.pets);
      formData.append('squareFeet', data.squareFeet);
      formData.append('frequency', data.frequency);
      formData.append('serviceType', data.serviceType);
      formData.append('addons', data.addons.join(', '));
      formData.append('additionalNotes', data.additionalNotes ?? '');
      formData.append('preferredContact', data.preferredContact);
      formData.append('estimatedTotal', estimatedTotal !== null ? String(estimatedTotal) : 'Custom Quote (5BR+)');
      photos.forEach((file) => formData.append('photos', file));

      const response = await fetch(`${API_URL}/api/quote-requests`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("We couldn't send your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Nav />
      <main className="flex-grow pt-32 pb-20">
        <div className={cn('container mx-auto px-4 md:px-6', step >= 2 && !isSubmitted ? 'max-w-6xl' : 'max-w-4xl')}>
          {!isSubmitted && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                  Get Your Instant Quote
                </h1>
                <p className="text-base text-slate-600">Get a personalized cleaning estimate in under 1 minute.</p>
              </div>

              <StepIndicator step={step} />
            </div>
          )}

          {isSubmitted ? (
            <div className="max-w-3xl mx-auto">
              <SuccessScreen firstName={form.getValues('firstName')} />
            </div>
          ) : (
            <>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className={cn(step >= 2 ? 'grid lg:grid-cols-[1fr_340px] gap-6 items-start' : 'max-w-4xl mx-auto')}>
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-6 sm:p-10 space-y-6">
                      {step === 0 && <ContactStep form={form} />}
                      {step === 1 && (
                        <HomeDetailsStep
                          form={form}
                          photos={photos}
                          photoErrors={photoErrors}
                          onPhotoChange={handlePhotoChange}
                          onPhotoDrop={handlePhotoDrop}
                          onPhotoDragOver={handleDragOver}
                          onRemovePhoto={removePhoto}
                        />
                      )}
                      {step === 2 && <ServiceStep form={form} />}
                      {step === 3 && <ReviewStep form={form} photos={photos} onEditStep={setStep} />}

                      {submitError && (
                        <p className="text-sm font-medium text-destructive text-center">{submitError}</p>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between items-center pt-2">
                        {step > 0 ? (
                          <Button type="button" variant="outline" size="lg" onClick={goBack}>
                            <ChevronLeft className="w-4 h-4" />
                            Back
                          </Button>
                        ) : (
                          <span />
                        )}

                        {step < STEP_LABELS.length - 1 ? (
                          <Button
                            key="next"
                            type="button"
                            size="lg"
                            disabled={!canGoNext}
                            onClick={goNext}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button key="submit" type="submit" size="lg" disabled={!canSubmit}>
                            {isSubmitting ? 'Sending...' : 'Submit Your Request'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {step >= 2 && (
                      <div className="lg:sticky lg:top-24">
                        <OrderSummary form={form} />
                      </div>
                    )}
                  </div>
                </form>
              </Form>

              <p className="text-center text-sm text-slate-400 mt-6">
                Step {step + 1} of {STEP_LABELS.length}
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
