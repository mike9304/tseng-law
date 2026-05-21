import { describe, expect, it } from 'vitest';
import {
  buildRecurringEventRrule,
  formatRruleUntil,
  parseRecurringEventConfig,
} from '@/lib/builder/bookings/calendar-sync/recurring-event-rrule';

describe('formatRruleUntil', () => {
  it('formats an ISO timestamp as RFC 5545 UTC basic form', () => {
    expect(formatRruleUntil('2026-08-15T09:30:00.000Z')).toBe('20260815T093000Z');
  });

  it('throws for invalid input so callers can surface an error', () => {
    expect(() => formatRruleUntil('not-a-date')).toThrow();
  });
});

describe('buildRecurringEventRrule — weekly', () => {
  it('builds a basic weekly RRULE for two weekdays', () => {
    const result = buildRecurringEventRrule({
      frequency: 'weekly',
      weekdays: ['monday', 'wednesday'],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE');
    }
  });

  it('uses interval 2 for biweekly and sorts BYDAY in calendar order', () => {
    const result = buildRecurringEventRrule({
      frequency: 'biweekly',
      weekdays: ['friday', 'tuesday', 'monday'],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU,FR');
    }
  });

  it('appends UNTIL in RFC 5545 UTC form', () => {
    const result = buildRecurringEventRrule({
      frequency: 'weekly',
      weekdays: ['thursday'],
      until: '2026-09-01T00:00:00.000Z',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=TH;UNTIL=20260901T000000Z');
    }
  });

  it('appends COUNT when provided instead of UNTIL', () => {
    const result = buildRecurringEventRrule({
      frequency: 'weekly',
      weekdays: ['saturday'],
      count: 12,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=SA;COUNT=12');
    }
  });

  it('rejects weekly with no weekdays', () => {
    const result = buildRecurringEventRrule({ frequency: 'weekly', weekdays: [] });
    expect(result.ok).toBe(false);
  });

  it('rejects when both UNTIL and COUNT are supplied', () => {
    const result = buildRecurringEventRrule({
      frequency: 'weekly',
      weekdays: ['monday'],
      until: '2026-08-15T09:30:00.000Z',
      count: 5,
    });
    expect(result.ok).toBe(false);
  });

  it('rejects a non-integer count', () => {
    const result = buildRecurringEventRrule({
      frequency: 'weekly',
      weekdays: ['monday'],
      count: 1.5,
    });
    expect(result.ok).toBe(false);
  });

  it('emits WKST when provided', () => {
    const result = buildRecurringEventRrule({
      frequency: 'weekly',
      weekdays: ['monday'],
      weekStart: 'sunday',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO;WKST=SU');
    }
  });
});

describe('buildRecurringEventRrule — monthly', () => {
  it('builds a BYMONTHDAY pattern', () => {
    const result = buildRecurringEventRrule({
      frequency: 'monthly',
      monthly: { kind: 'byDayOfMonth', dayOfMonth: 15 },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=MONTHLY;INTERVAL=1;BYMONTHDAY=15');
    }
  });

  it('builds an ordinal weekday pattern (e.g. 2nd Monday)', () => {
    const result = buildRecurringEventRrule({
      frequency: 'monthly',
      monthly: { kind: 'byOrdinalWeekday', ordinal: 2, weekday: 'monday' },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=2MO');
    }
  });

  it('handles last-weekday ordinal (-1)', () => {
    const result = buildRecurringEventRrule({
      frequency: 'monthly',
      monthly: { kind: 'byOrdinalWeekday', ordinal: -1, weekday: 'friday' },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.rrule).toBe('RRULE:FREQ=MONTHLY;INTERVAL=1;BYDAY=-1FR');
    }
  });

  it('rejects bad day-of-month values', () => {
    const result = buildRecurringEventRrule({
      frequency: 'monthly',
      monthly: { kind: 'byDayOfMonth', dayOfMonth: 32 },
    });
    expect(result.ok).toBe(false);
  });

  it('rejects bad ordinal values', () => {
    const result = buildRecurringEventRrule({
      frequency: 'monthly',
      monthly: { kind: 'byOrdinalWeekday', ordinal: 7, weekday: 'monday' },
    });
    expect(result.ok).toBe(false);
  });

  it('rejects monthly when no monthly pattern is provided', () => {
    const result = buildRecurringEventRrule({ frequency: 'monthly' });
    expect(result.ok).toBe(false);
  });
});

describe('parseRecurringEventConfig', () => {
  it('parses a weekly payload', () => {
    const config = parseRecurringEventConfig({
      frequency: 'weekly',
      weekdays: ['monday', 'wednesday'],
    });
    expect(config).toEqual({
      frequency: 'weekly',
      weekdays: ['monday', 'wednesday'],
    });
  });

  it('drops unknown weekday strings silently', () => {
    const config = parseRecurringEventConfig({
      frequency: 'weekly',
      weekdays: ['monday', 'funday'],
    });
    expect(config?.weekdays).toEqual(['monday']);
  });

  it('returns null for an unknown frequency', () => {
    expect(parseRecurringEventConfig({ frequency: 'yearly' })).toBeNull();
  });

  it('parses a monthly ordinal payload', () => {
    const config = parseRecurringEventConfig({
      frequency: 'monthly',
      monthly: { kind: 'byOrdinalWeekday', ordinal: 1, weekday: 'tuesday' },
    });
    expect(config?.monthly).toEqual({ kind: 'byOrdinalWeekday', ordinal: 1, weekday: 'tuesday' });
  });

  it('round-trips through buildRecurringEventRrule', () => {
    const config = parseRecurringEventConfig({
      frequency: 'biweekly',
      weekdays: ['tuesday', 'thursday'],
      count: 6,
    });
    expect(config).not.toBeNull();
    const built = config && buildRecurringEventRrule(config);
    expect(built?.ok).toBe(true);
    if (built?.ok) {
      expect(built.rrule).toBe('RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=TU,TH;COUNT=6');
    }
  });
});