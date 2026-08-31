export interface StaffMember {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'cleaner';
  createdAt: string;
}

export interface AvailabilityRule {
  id: number;
  staffId: number;
  weekday: number; // 0 = Sunday .. 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface AvailabilityOverride {
  id: number;
  staffId: number;
  date: string; // "2026-12-25"
  isAvailable: boolean;
  startTime: string | null;
  endTime: string | null;
}

export type ServiceType = 'standard' | 'deep' | 'moveInOut' | 'hourly';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: number;
  staffId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  serviceType: ServiceType;
  notes: string | null;
  // Quote-time context — read-only, not editable from the dashboard.
  bedrooms: number | null;
  bathrooms: string | null; // e.g. "2.5" (full + half baths combined)
  squareFeet: string | null;
  addons: string | null; // comma-joined labels
  frequency: string | null;
  estimatedTotal: string | null; // pre-formatted, e.g. "from $209"
  preferredContact: string | null;
  startAt: string; // ISO
  endAt: string; // ISO
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export const PREFERRED_CONTACT_LABELS: Record<string, string> = {
  email: 'Email',
  message: 'Text Message',
  phoneCall: 'Phone Call',
};

export const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  standard: 'Standard Clean',
  deep: 'Deep Clean',
  moveInOut: 'Move-In / Move-Out',
  hourly: 'Hourly Service',
};
