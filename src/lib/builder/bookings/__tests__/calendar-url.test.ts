import { describe, expect, it } from 'vitest';
import { normalizeBookingCalendarMonth, normalizeBookingCalendarViewMode } from '@/lib/builder/bookings/calendar-url';

describe('booking calendar url helpers', () => {
  it('normalizes valid and invalid calendar months', () => {
    const fallback = new Date('2026-05-30T00:00:00.000Z');
    expect(normalizeBookingCalendarMonth('2026-07', fallback)).toBe('2026-07');
    expect(normalizeBookingCalendarMonth('2026-7', fallback)).toBe('2026-05');
    expect(normalizeBookingCalendarMonth(undefined, fallback)).toBe('2026-05');
  });

  it('normalizes calendar view modes', () => {
    expect(normalizeBookingCalendarViewMode('week')).toBe('week');
    expect(normalizeBookingCalendarViewMode('list')).toBe('list');
    expect(normalizeBookingCalendarViewMode('month')).toBe('month');
    expect(normalizeBookingCalendarViewMode('invalid')).toBe('month');
  });
});
