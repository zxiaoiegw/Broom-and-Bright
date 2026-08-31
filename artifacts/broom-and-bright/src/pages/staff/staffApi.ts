import { API_URL } from '@/lib/api';
import type { StaffMember, AvailabilityRule, AvailabilityOverride, Booking } from './types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    credentials: 'include', // send/receive the httpOnly session cookie cross-origin
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
  return data as T;
}

export const staffApi = {
  login: (email: string, password: string) =>
    request<{ staff: StaffMember }>('/staff/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  logout: () => request<{ success: true }>('/staff/logout', { method: 'POST' }),

  me: () => request<{ staff: StaffMember | null }>('/staff/me'),

  listStaff: () => request<{ staff: StaffMember[] }>('/staff'),

  addStaff: (input: { name: string; email: string; password: string; role: 'owner' | 'cleaner' }) =>
    request<{ staff: StaffMember }>('/staff', { method: 'POST', body: JSON.stringify(input) }),

  listBookings: (staffId?: number) =>
    request<{ bookings: Booking[] }>(`/staff/bookings${staffId ? `?staffId=${staffId}` : ''}`),

  updateBooking: (id: number, patch: Partial<Pick<Booking, 'address' | 'notes' | 'startAt' | 'endAt'>>) =>
    request<{ booking: Booking }>(`/staff/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),

  cancelBooking: (id: number) => request<{ booking: Booking }>(`/staff/bookings/${id}/cancel`, { method: 'POST' }),

  getAvailability: (staffId?: number) =>
    request<{ rules: AvailabilityRule[]; overrides: AvailabilityOverride[] }>(
      `/staff/availability${staffId ? `?staffId=${staffId}` : ''}`,
    ),

  setRules: (rules: { weekday: number; startTime: string; endTime: string }[], staffId?: number) =>
    request<{ rules: AvailabilityRule[] }>('/staff/availability/rules', {
      method: 'PUT',
      body: JSON.stringify({ rules, staffId }),
    }),

  addOverride: (
    override: { date: string; isAvailable: boolean; startTime?: string; endTime?: string },
    staffId?: number,
  ) =>
    request<{ override: AvailabilityOverride }>('/staff/availability/overrides', {
      method: 'POST',
      body: JSON.stringify({ ...override, staffId }),
    }),

  deleteOverride: (id: number) =>
    request<{ success: true }>(`/staff/availability/overrides/${id}`, { method: 'DELETE' }),

  getCalendarFeedToken: () => request<{ token: string | null }>('/staff/calendar-feed-token'),

  generateCalendarFeedToken: () =>
    request<{ token: string }>('/staff/calendar-feed-token', { method: 'POST' }),

  revokeCalendarFeedToken: () =>
    request<{ success: true }>('/staff/calendar-feed-token', { method: 'DELETE' }),
};
