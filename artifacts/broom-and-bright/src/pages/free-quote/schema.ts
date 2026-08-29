import { z } from 'zod';

export const STEP_LABELS = ['Contact', 'Property Details', 'Service', 'Review'];

export const freeQuoteFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().email('Invalid email address.'),
  phone: z.string().trim().min(1, 'Phone number is required.'),
  address: z.string().trim().min(1, 'Property address is required.'),
  bedrooms: z.number().int().min(1).max(10),
  bathrooms: z.number().int().min(1).max(10),
  pets: z.enum(['yes', 'no']),
  squareFeet: z.string().trim().min(1, 'Estimated square feet is required.'),
  frequency: z.enum(['weekly', 'biweekly', 'every4weeks', 'oneTime'], {
    errorMap: () => ({ message: 'Please choose how often.' }),
  }),
  serviceType: z.enum(['standard', 'deep', 'moveInOut'], {
    errorMap: () => ({ message: 'Please choose a cleaning type.' }),
  }),
  addons: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
  preferredContact: z.enum(['email', 'message', 'phoneCall'], {
    errorMap: () => ({ message: 'Please choose how we should reach you.' }),
  }),
});

export type FreeQuoteFormValues = z.infer<typeof freeQuoteFormSchema>;

export const STEP_FIELDS: (keyof FreeQuoteFormValues)[][] = [
  ['firstName', 'lastName', 'email', 'phone', 'address'],
  ['bedrooms', 'bathrooms', 'pets', 'squareFeet'],
  ['serviceType', 'frequency'],
  ['preferredContact'],
];
