import { describe, expect, it } from 'vitest';
import { applyRecurringAvailabilityTemplate, isHolidayDate, recurringAvailabilityTemplates } from '@/lib/builder/bookings/availability-templates';
import type { StaffAvailability } from '@/lib/builder/bookings/types';
import { dayOfWeeks } from '@/lib/builder/bookings/types';

function emptyAvailability(): StaffAvailability {
  return {
    staffId: 'staff-template',
    weekly: dayOfWeeks.reduce((weekly, day) => {
      weekly[day] = [];
      return weekly;
    }, {} as StaffAvailability['weekly']),
    blockedDates: [],
    timezone: 'Asia/Seoul',
    holidayCalendar: 'none',
  };
}

describe('booking recurring availability templates', () => {
  it('applies the weekdays 10-18 template without mutating the original availability', () => {
    const original = emptyAvailability();
    const next = applyRecurringAvailabilityTemplate(original, 'weekdays-10-18');

    expect(recurringAvailabilityTemplates.some((template) => template.templateId === 'weekdays-10-18')).toBe(true);
    expect(next.recurringTemplateId).toBe('weekdays-10-18');
    expect(next.weekly.monday).toEqual([{ start: '10:00', end: '18:00' }]);
    expect(next.weekly.friday).toEqual([{ start: '10:00', end: '18:00' }]);
    expect(next.weekly.saturday).toEqual([]);
    expect(original.weekly.monday).toEqual([]);
  });

  it('matches Korea, Taiwan, and combined public holiday calendars by date', () => {
    expect(isHolidayDate('2026-10-09', 'kr')).toBe(true);
    expect(isHolidayDate('2026-10-09', 'tw')).toBe(false);
    expect(isHolidayDate('2026-10-10', 'tw')).toBe(true);
    expect(isHolidayDate('2026-10-10', 'kr-tw')).toBe(true);
    expect(isHolidayDate('2026-10-08', 'kr-tw')).toBe(false);
  });
});
