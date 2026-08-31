import { z } from 'zod';

// Accepts the common US/Canada formats — "402 679 4776", "(402) 679-4776",
// "402-679-4776", "+1 402 679 4776" — by checking the digit count once
// punctuation is stripped: 10 digits, or 11 with a leading country code 1.
const phoneField = z
  .string()
  .trim()
  .min(1, 'Phone number is required.')
  .refine(
    (value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
    },
    { message: 'Enter a valid 10-digit phone number.' },
  );

// The Review step's cancellation-policy checkbox — must be explicitly
// checked before the customer can submit.
const cancellationPolicyAckField = z.boolean().refine((value) => value === true, {
  message: 'Please confirm the cancellation policy to continue.',
});

/* ------------------------------------------------------------------ *
 * Standard package flow — sized by the home (bedrooms / baths / sqft)
 * Step order: Estimate (property details + service) → Schedule → Contact → Review
 * ------------------------------------------------------------------ */

export const STANDARD_STEP_LABELS = ['Estimate', 'Schedule', 'Contact', 'Review'];

export const freeQuoteFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Invalid email address.'),
  phone: phoneField,
  address: z.string().trim().min(1, 'Property address is required.'),
  bedrooms: z.number().int().min(1).max(10),
  bathrooms: z.number().int().min(1).max(10),
  // Half-baths are counted separately and priced at half the full-bath surcharge.
  halfBaths: z.number().int().min(0).max(10),
  squareFeet: z.string().trim().min(1, 'Estimated square feet is required.'),
  frequency: z.enum(['weekly', 'biweekly', 'every4weeks', 'oneTime'], {
    errorMap: () => ({ message: 'Please choose how often.' }),
  }),
  serviceType: z.enum(['standard', 'deep', 'moveInOut'], {
    errorMap: () => ({ message: 'Please choose a cleaning type.' }),
  }),
  addons: z.array(z.string()).default([]),
  // ISO datetime of the picked slot — set by the Schedule step's calendar.
  scheduledStartAt: z.string().min(1, 'Please pick a date and time.'),
  additionalNotes: z.string().optional(),
  preferredContact: z.enum(['email', 'message', 'phoneCall']).optional(),
  cancellationPolicyAck: cancellationPolicyAckField,
});

export type FreeQuoteFormValues = z.infer<typeof freeQuoteFormSchema>;

// Fields validated when leaving each standard step, in the new step order.
export const STEP_FIELDS: (keyof FreeQuoteFormValues)[][] = [
  ['bedrooms', 'bathrooms', 'halfBaths', 'squareFeet', 'serviceType', 'frequency'],
  ['scheduledStartAt'],
  ['firstName', 'lastName', 'email', 'phone', 'address'],
  ['cancellationPolicyAck'],
];

// Back-compat alias — some older imports still reference STEP_LABELS.
export const STEP_LABELS = STANDARD_STEP_LABELS;

/* ------------------------------------------------------------------ *
 * Hourly service flow — billed per man-hour, flat rate
 * Step order: Estimate (hours) → Schedule → Contact → Review
 * ------------------------------------------------------------------ */

export const HOURLY_STEP_LABELS = ['Estimate', 'Schedule', 'Contact', 'Review'];

export const hourlyQuoteFormSchema = z.object({
  hours: z.number().int().min(1, 'Please choose how many hours.').max(8),
  scheduledStartAt: z.string().min(1, 'Please pick a date and time.'),
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().min(1, 'Email is required.').email('Invalid email address.'),
  phone: phoneField,
  address: z.string().trim().min(1, 'Property address is required.'),
  additionalNotes: z.string().optional(),
  preferredContact: z.enum(['email', 'message', 'phoneCall']).optional(),
  cancellationPolicyAck: cancellationPolicyAckField,
});

export type HourlyQuoteFormValues = z.infer<typeof hourlyQuoteFormSchema>;

export const HOURLY_STEP_FIELDS: (keyof HourlyQuoteFormValues)[][] = [
  ['hours'],
  ['scheduledStartAt'],
  ['firstName', 'lastName', 'email', 'phone', 'address'],
  ['cancellationPolicyAck'],
];
