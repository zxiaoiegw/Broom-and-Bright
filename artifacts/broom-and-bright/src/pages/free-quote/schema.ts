import { z } from 'zod';

export const STEP_LABELS = ['Contact', 'Home Details', 'Service', 'Review'];

export const freeQuoteFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z.string().trim().email('Invalid email address.'),
  phone: z.string().trim().min(1, 'Phone number is required.'),
  street: z.string().trim().min(1, 'Street address is required.'),
  city: z.string().trim().min(1, 'City is required.'),
  state: z.string().trim().min(1, 'State is required.'),
  zip: z.string().trim().min(1, 'ZIP code is required.'),
  bedrooms: z.number().int().min(1).max(10),
  bathrooms: z.number().int().min(1).max(10),
  pets: z.enum(['yes', 'no']),
  squareFeet: z.string().trim().min(1, 'Estimated square feet is required.'),
  serviceType: z.enum(['standard', 'deep', 'moveInOut'], {
    errorMap: () => ({ message: 'Please choose a cleaning type.' }),
  }),
  addons: z.array(z.string()).default([]),
  additionalNotes: z.string().optional(),
});

export type FreeQuoteFormValues = z.infer<typeof freeQuoteFormSchema>;

export const STEP_FIELDS: (keyof FreeQuoteFormValues)[][] = [
  ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zip'],
  ['bedrooms', 'bathrooms', 'pets', 'squareFeet'],
  ['serviceType'],
  [],
];
