import { Sparkles, Home as HomeIcon, Truck } from 'lucide-react';

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
  { maxBedrooms: 1, sizeLabel: 'Studio / 1BR', standard: 89, deep: 149, moveInOut: 199 },
  { maxBedrooms: 2, sizeLabel: '2BR', standard: 119, deep: 189, moveInOut: 249 },
  { maxBedrooms: 3, sizeLabel: '3BR', standard: 149, deep: 229, moveInOut: 299 },
  { maxBedrooms: 4, sizeLabel: '4BR', standard: 179, deep: 269, moveInOut: 349 },
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
  { key: 'insideFridge', label: 'Inside Fridge', price: 20 },
  { key: 'insideOven', label: 'Inside Oven', price: 20 },
  { key: 'interiorWindows', label: 'Interior Windows', price: 25 },
  { key: 'laundry', label: 'Laundry', price: 15 },
  { key: 'dishes', label: 'Dishes', price: 15 },
  { key: 'petHairRemoval', label: 'Pet Hair Removal', price: 25 },
  { key: 'interiorWallsSpotCleaning', label: 'Wall Spots', price: 20 },
] as const;
