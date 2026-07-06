export type BookingCalendarViewMode = 'month' | 'week' | 'list';

export function normalizeBookingCalendarMonth(value?: string | null, fallback = new Date()): string {
  if (value && /^\d{4}-\d{2}$/.test(value)) return value;
  return `${fallback.getFullYear()}-${String(fallback.getMonth() + 1).padStart(2, '0')}`;
}

export function normalizeBookingCalendarViewMode(value?: string | null): BookingCalendarViewMode {
  if (value === 'week' || value === 'list') return value;
  return 'month';
}
