import { Sparkles, Home as HomeIcon, Truck } from 'lucide-react';

// Hourly service: one cleaner for one hour. Flat rate, no recurring discount.
export const HOURLY_RATE = 60;
export const MAX_HOURLY_HOURS = 8;

export function getHourlyTotal(hours: number): number {
  return Math.max(0, Math.round(hours)) * HOURLY_RATE;
}

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

// Full spec (base prices, surcharge rates, worked examples) lives in PRICING.md
// in this folder — keep the two in sync. Tiered by bedroom count, since a 4BR
// deep clean takes meaningfully longer than a studio. Each tier's base price
// already includes the bathrooms and square footage in `baseBathrooms` /
// `baseSquareFeet`; anything above that is surcharged (see SURCHARGES).
export const PRICING_TIERS = [
  { maxBedrooms: 1, sizeLabel: 'Studio / 1BR', baseBathrooms: 1.5, baseSquareFeet: 1500, standard: 149, deep: 239, moveInOut: 339, standardMinutes: 120, deepMinutes: 180, moveInOutMinutes: 240 },
  { maxBedrooms: 2, sizeLabel: '2BR', baseBathrooms: 2, baseSquareFeet: 2000, standard: 179, deep: 269, moveInOut: 369, standardMinutes: 150, deepMinutes: 210, moveInOutMinutes: 270 },
  { maxBedrooms: 3, sizeLabel: '3BR', baseBathrooms: 2.5, baseSquareFeet: 2500, standard: 209, deep: 299, moveInOut: 399, standardMinutes: 180, deepMinutes: 240, moveInOutMinutes: 300 },
  { maxBedrooms: 4, sizeLabel: '4BR', baseBathrooms: 3, baseSquareFeet: 3000, standard: 239, deep: 329, moveInOut: 429, standardMinutes: 210, deepMinutes: 270, moveInOutMinutes: 360 },
] as const;

// Per-increment surcharges for a home that exceeds its tier's included baths /
// square footage. Same rates for every tier; only the baseline differs.
export const SURCHARGES = {
  fullBath: { standard: 30, deep: 40, moveInOut: 50 },
  halfBath: { standard: 15, deep: 20, moveInOut: 25 },
  per100SqFt: { standard: 5, deep: 8, moveInOut: 10 },
} as const;

// Same idea, but in minutes — how much longer a job runs per bath/sqft over
// the tier baseline. Full spec + worked examples: DURATION_ESTIMATES.md.
export const DURATION_SURCHARGES = {
  fullBath: { standard: 15, deep: 20, moveInOut: 25 },
  halfBath: { standard: 10, deep: 10, moveInOut: 10 },
  per100SqFt: { standard: 10, deep: 15, moveInOut: 20 },
} as const;

// 5BR+ falls outside every tier — those get a custom quote, not a number.
export function getPricingTier(bedrooms: number) {
  return PRICING_TIERS.find((tier) => bedrooms <= tier.maxBedrooms) ?? null;
}

// The form tracks full baths and half baths separately; pricing works off the
// combined decimal (2 full + 1 half = 2.5).
export function totalBathrooms(bathrooms: number, halfBaths: number): number {
  return bathrooms + 0.5 * halfBaths;
}

// squareFeet comes off the form as a free-text string ("1,800", "~2000 sq ft").
export function parseSquareFeet(squareFeet: string | number): number {
  if (typeof squareFeet === 'number') return Number.isFinite(squareFeet) ? squareFeet : 0;
  const digits = squareFeet.replace(/[^0-9]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

export function getServicePrice(
  bedrooms: number,
  bathrooms: number,
  squareFeet: string | number,
  serviceKey: (typeof SERVICE_TYPES)[number]['key'],
) {
  const tier = getPricingTier(bedrooms);
  if (!tier) return null;

  let price: number = tier[serviceKey];

  // Bathroom overage, measured from the tier baseline in half-bath steps.
  const extraBath = Math.max(0, bathrooms - tier.baseBathrooms);
  const fullBaths = Math.floor(extraBath);
  const halfBaths = extraBath - fullBaths >= 0.5 ? 1 : 0;
  price += fullBaths * SURCHARGES.fullBath[serviceKey];
  price += halfBaths * SURCHARGES.halfBath[serviceKey];

  // Square-foot overage, charged per full 100 sq ft over the baseline — a
  // partial block doesn't count (floored, not rounded up).
  const extraSqFt = Math.max(0, parseSquareFeet(squareFeet) - tier.baseSquareFeet);
  const sqFtBlocks = Math.floor(extraSqFt / 100);
  price += sqFtBlocks * SURCHARGES.per100SqFt[serviceKey];

  return price;
}

// Size-aware job length, replacing the old flat 2h/3h/4h-per-service-type
// estimate — see DURATION_ESTIMATES.md for the full table and rationale.
// Unlike getServicePrice, this never returns null: 5BR+ homes fall back to
// the 4BR tier's baseline and keep scaling with the same per-bath/per-100sqft
// rates, since scheduling still needs *a* number even when pricing hands
// those off to a custom quote.
export function getEstimatedDurationMinutes(
  bedrooms: number,
  bathrooms: number,
  squareFeet: string | number,
  serviceKey: (typeof SERVICE_TYPES)[number]['key'],
  addons: string[] = [],
): number {
  const tier = getPricingTier(bedrooms) ?? PRICING_TIERS[PRICING_TIERS.length - 1];
  const minutesKey = `${serviceKey}Minutes` as const;
  let minutes: number = tier[minutesKey];

  const extraBath = Math.max(0, bathrooms - tier.baseBathrooms);
  const fullBaths = Math.floor(extraBath);
  const halfBaths = extraBath - fullBaths >= 0.5 ? 1 : 0;
  minutes += fullBaths * DURATION_SURCHARGES.fullBath[serviceKey];
  minutes += halfBaths * DURATION_SURCHARGES.halfBath[serviceKey];

  const extraSqFt = Math.max(0, parseSquareFeet(squareFeet) - tier.baseSquareFeet);
  const sqFtBlocks = Math.ceil(extraSqFt / 100);
  minutes += sqFtBlocks * DURATION_SURCHARGES.per100SqFt[serviceKey];

  minutes += ADD_ONS.filter((a) => addons.includes(a.key)).reduce((sum, a) => sum + a.durationMinutes, 0);

  return minutes;
}

export const ADD_ONS = [
  { key: 'basement', label: 'Basement', price: 70, durationMinutes: 30 },
  { key: 'insideFridge', label: 'Inside Fridge', price: 50, durationMinutes: 20 },
  { key: 'insideOven', label: 'Inside Oven', price: 50, durationMinutes: 20 },
  { key: 'interiorWindows', label: 'Interior Windows', price: 25, durationMinutes: 20 },
  { key: 'dishes', label: 'Dishes', price: 15, durationMinutes: 15 },
  { key: 'laundry', label: 'Laundry', price: 15, durationMinutes: 20 },
  { key: 'interiorWallsSpotCleaning', label: 'Wall Spots', price: 20, durationMinutes: 15 },
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
  bathrooms,
  squareFeet,
  serviceType,
  addons,
  frequency,
}: {
  bedrooms: number;
  bathrooms: number;
  squareFeet: string | number;
  serviceType?: (typeof SERVICE_TYPES)[number]['key'];
  addons: string[];
  frequency?: (typeof FREQUENCIES)[number]['key'];
}): QuoteBreakdown {
  const basePrice = serviceType ? getServicePrice(bedrooms, bathrooms, squareFeet, serviceType) : null;
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
