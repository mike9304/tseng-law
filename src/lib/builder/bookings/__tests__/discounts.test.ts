import { describe, expect, it } from 'vitest';
import {
  calculateBookingDiscount,
  normalizeBookingDiscountCode,
  normalizeBookingDiscountRule,
  normalizeBookingDiscountRules,
} from '@/lib/builder/bookings/discounts';
import type { BookingDiscountRule } from '@/lib/builder/bookings/types';

const now = new Date('2026-07-03T00:00:00.000Z');

function rule(overrides: Partial<BookingDiscountRule> = {}): BookingDiscountRule {
  return {
    code: 'LEGAL20',
    type: 'percent',
    value: 20,
    active: true,
    locale: 'all',
    ...overrides,
  };
}

describe('booking discounts', () => {
  it('normalizes customer-entered codes', () => {
    expect(normalizeBookingDiscountCode(' legal20 ')).toBe('LEGAL20');
    expect(normalizeBookingDiscountCode('')).toBeUndefined();
    expect(normalizeBookingDiscountCode(null)).toBeUndefined();
    expect(normalizeBookingDiscountCode('x'.repeat(40))).toHaveLength(32);
  });

  it('normalizes rule payloads and drops invalid rows', () => {
    expect(normalizeBookingDiscountRules([
      { code: ' legal20 ', type: 'percent', value: 20, active: true },
      { code: 'bad-percent', type: 'percent', value: 120 },
      { code: '', type: 'fixed', value: 500 },
    ])).toEqual([
      expect.objectContaining({
        code: 'LEGAL20',
        type: 'percent',
        value: 20,
        active: true,
        locale: 'all',
      }),
    ]);
    expect(normalizeBookingDiscountRule({ code: 'fixed500', type: 'fixed', value: 500 })).toMatchObject({
      code: 'FIXED500',
      type: 'fixed',
      value: 500,
    });
  });

  it('applies percent and fixed discounts against subtotal', () => {
    expect(calculateBookingDiscount(
      { code: 'legal20', subtotalAmount: 5000, locale: 'ko' },
      [rule()],
      now,
    )).toMatchObject({
      applied: true,
      code: 'LEGAL20',
      discountAmount: 1000,
    });
    expect(calculateBookingDiscount(
      { code: 'fixed500', subtotalAmount: 5000 },
      [rule({ code: 'FIXED500', type: 'fixed', value: 500 })],
      now,
    )).toMatchObject({
      applied: true,
      code: 'FIXED500',
      discountAmount: 500,
    });
  });

  it('caps discounts at max amount and subtotal', () => {
    expect(calculateBookingDiscount(
      { code: 'LEGAL20', subtotalAmount: 5000 },
      [rule({ maxDiscountAmount: 600 })],
      now,
    ).discountAmount).toBe(600);
    expect(calculateBookingDiscount(
      { code: 'BIGFIXED', subtotalAmount: 5000 },
      [rule({ code: 'BIGFIXED', type: 'fixed', value: 9000 })],
      now,
    ).discountAmount).toBe(5000);
  });

  it('returns stable reasons when a code cannot apply', () => {
    expect(calculateBookingDiscount({ code: '', subtotalAmount: 5000 }, [rule()], now).reason).toBe('missing');
    expect(calculateBookingDiscount({ code: 'NONE', subtotalAmount: 5000 }, [rule()], now).reason).toBe('not_found');
    expect(calculateBookingDiscount({ code: 'LEGAL20', subtotalAmount: 5000 }, [rule({ active: false })], now).reason).toBe('inactive');
    expect(calculateBookingDiscount({ code: 'LEGAL20', subtotalAmount: 5000, locale: 'en' }, [rule({ locale: 'ko' })], now).reason).toBe('locale_mismatch');
    expect(calculateBookingDiscount({ code: 'LEGAL20', subtotalAmount: 4000 }, [rule({ minSubtotalAmount: 5000 })], now).reason).toBe('below_minimum');
    expect(calculateBookingDiscount({ code: 'LEGAL20', subtotalAmount: 5000 }, [rule({ startsAt: '2026-07-04T00:00:00.000Z' })], now).reason).toBe('not_started');
    expect(calculateBookingDiscount({ code: 'LEGAL20', subtotalAmount: 5000 }, [rule({ endsAt: '2026-07-02T00:00:00.000Z' })], now).reason).toBe('expired');
  });
});
