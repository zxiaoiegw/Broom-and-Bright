import { Sparkles, Home as HomeIcon, Truck } from 'lucide-react';

export const FREQUENCIES = [
  { key: 'weekly', label: 'Weekly', sub: '-30% off' },
  { key: 'biweekly', label: 'Every 2 Weeks', sub: '-20% off'},
  { key: 'every4weeks', label: 'Every 4 Weeks', sub: '-10% off' },
  { key: 'oneTime', label: 'One-Time', sub: 'Non-recurring' },
] as const;

export const SERVICE_TYPES = [
  {
    key: 'standard',
    label: 'Standard Cleaning',
    icon: HomeIcon,
    items: [
      'Kitchen wipe-down, sink & counters',
      'Bathrooms cleaned & mirrors',
      'Dusting & surfaces',
      'Floors vacuumed & mopped',
      'Trash emptied',
    ],
  },
  {
    key: 'deep',
    label: 'Deep Cleaning',
    icon: Sparkles,
    items: [
      'All Standard items',
      'Baseboards (as needed)',
      'Detail dusting (vents, blinds)',
      'Extra attention to buildup/grime',
      'Great for first-time clients',
    ],
  },
  {
    key: 'moveInOut',
    label: 'Move-In / Move-Out',
    icon: Truck,
    items: [
      'Inside cabinets & drawers',
      'Inside fridge & oven (if requested)',
      'Walls spot-clean (where possible)',
      'Fixtures, doors & trim detailed',
      'Best for empty homes',
    ],
  },
] as const;

// Mirrors the pricing table on the Pricing section — tiered by home size,
// since a 4BR deep clean takes meaningfully longer than a studio.
export const PRICING_TIERS = [
  { maxBedrooms: 1, sizeLabel: 'Studio / 1BR', standard: 149, deep: 239, moveInOut: 339 },
  { maxBedrooms: 2, sizeLabel: '2BR', standard: 179, deep: 269, moveInOut: 369 },
  { maxBedrooms: 3, sizeLabel: '3BR', standard: 209, deep: 299, moveInOut: 399 },
  { maxBedrooms: 4, sizeLabel: '4BR', standard: 239, deep: 329, moveInOut: 429 },
] as const;

// 5BR+ falls outside every tier — those get a custom quote, not a number.
export function getPricingTier(bedrooms: number) {
  return PRICING_TIERS.find((tier) => bedrooms <= tier.maxBedrooms) ?? null;
}

export function getServicePrice(bedrooms: number, serviceKey: (typeof SERVICE_TYPES)[number]['key']) {
  const tier = getPricingTier(bedrooms);
  return tier ? tier[serviceKey] : null;
}

export const ADD_ONS = [
  { key: 'basement', label: 'Basement', price: 70 },
  { key: 'insideFridge', label: 'Inside Fridge', price: 50 },
  { key: 'insideOven', label: 'Inside Oven', price: 50 },
  { key: 'interiorWindows', label: 'Interior Windows', price: 25 },
  { key: 'dishes', label: 'Dishes', price: 15 },
  { key: 'laundry', label: 'Laundry', price: 15 },
  { key: 'interiorWallsSpotCleaning', label: 'Wall Spots', price: 20 },
] as const;

// Recurring plans get a discount off the one-time price; one-time gets none.
export const FREQUENCY_DISCOUNTS: Record<(typeof FREQUENCIES)[number]['key'], number> = {
  weekly: 0.3,
  biweekly: 0.2,
  every4weeks: 0.1,
  oneTime: 0,
};

export function getFrequencyDiscount(frequency?: (typeof FREQUENCIES)[number]['key']) {
  return frequency ? (FREQUENCY_DISCOUNTS[frequency] ?? 0) : 0;
}

export interface QuoteBreakdown {
  basePrice: number | null;
  addonsTotal: number;
  subtotal: number | null;
  discountPercent: number;
  discountAmount: number | null;
  total: number | null;
}

// Single source of truth for "what does this quote cost right now" — used by
// the live order summary, the review step, and the final submitted total, so
// all three can never drift out of sync with each other.
export function getQuoteBreakdown({
  bedrooms,
  serviceType,
  addons,
  frequency,
}: {
  bedrooms: number;
  serviceType?: (typeof SERVICE_TYPES)[number]['key'];
  addons: string[];
  frequency?: (typeof FREQUENCIES)[number]['key'];
}): QuoteBreakdown {
  const basePrice = serviceType ? getServicePrice(bedrooms, serviceType) : null;
  const addonsTotal = ADD_ONS.filter((a) => addons.includes(a.key)).reduce((sum, a) => sum + a.price, 0);
  const subtotal = basePrice !== null ? basePrice + addonsTotal : null;
  const discountPercent = getFrequencyDiscount(frequency);
  const discountAmount = subtotal !== null ? Math.round(subtotal * discountPercent) : null;
  const total = subtotal !== null && discountAmount !== null ? subtotal - discountAmount : null;
  return { basePrice, addonsTotal, subtotal, discountPercent, discountAmount, total };
}

// Shown in the "why might my price change?" popover next to the estimate disclaimer.
export const PRICE_FACTORS = [
  'Heavier buildup than a standard clean — grease, soap scum, or grime',
  "Home hasn't been professionally cleaned recently",
  'Excessive clutter that needs extra time to work around',
  'Pet hair, dander, or odor beyond normal',
  'Bedrooms, bathrooms, or square footage larger than entered',
  'Extra rooms not included in the quote (basement, office, etc.)',
  'Stairs or difficult access from parking',
  'Additional requests made on the day of service',
  'Post-construction or renovation dust',
  'Same-day or rush scheduling',
];
