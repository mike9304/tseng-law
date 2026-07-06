import type { Locale } from '@/lib/locales';
import type { BookingDiscountRule, BookingDiscountType } from './types';

export type { BookingDiscountRule, BookingDiscountType };

export type BookingDiscountReason =
  | 'missing'
  | 'not_found'
  | 'inactive'
  | 'locale_mismatch'
  | 'below_minimum'
  | 'not_started'
  | 'expired';

export interface BookingDiscountResult {
  code?: string;
  applied: boolean;
  discountAmount: number;
  reason?: BookingDiscountReason;
  rule?: BookingDiscountRule;
}

export interface BookingDiscountInput {
  code?: string;
  locale?: Locale;
  subtotalAmount: number;
}

/**
 * Normalize a user-supplied discount code: uppercase, trim, cap length.
 * Returns undefined for blank/invalid input.
 */
export function normalizeBookingDiscountCode(code: unknown): string | undefined {
  const normalized = typeof code === 'string' ? code.trim().toUpperCase().slice(0, 32) : '';
  return normalized || undefined;
}

/**
 * Coerce an unknown payload into a BookingDiscountRule, or null when invalid.
 */
export function normalizeBookingDiscountRule(input: unknown): BookingDiscountRule | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<BookingDiscountRule>;
  const code = normalizeBookingDiscountCode(source.code);
  if (!code) return null;
  const type: BookingDiscountType = source.type === 'fixed' || source.type === 'percent' ? source.type : 'percent';
  const value = Number(source.value);
  if (!Number.isFinite(value) || value <= 0) return null;
  if (type === 'percent' && value > 100) return null;
  return {
    code,
    type,
    value: Math.floor(value),
    active: source.active !== false,
    locale: source.locale === 'ko' || source.locale === 'zh-hant' || source.locale === 'en'
      ? source.locale
      : 'all',
    minSubtotalAmount: Number.isFinite(source.minSubtotalAmount)
      ? Math.max(0, Math.floor(Number(source.minSubtotalAmount)))
      : undefined,
    maxDiscountAmount: Number.isFinite(source.maxDiscountAmount)
      ? Math.max(0, Math.floor(Number(source.maxDiscountAmount)))
      : undefined,
    startsAt: typeof source.startsAt === 'string' && source.startsAt.trim() ? source.startsAt.trim() : undefined,
    endsAt: typeof source.endsAt === 'string' && source.endsAt.trim() ? source.endsAt.trim() : undefined,
  };
}

/**
 * Normalize an array-ish payload into BookingDiscountRule[].
 * Unlike commerce defaults, booking services have no built-in discount codes;
 * an empty/invalid payload yields an empty rule set.
 */
export function normalizeBookingDiscountRules(input: unknown): BookingDiscountRule[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((rule) => normalizeBookingDiscountRule(rule))
    .filter((rule): rule is BookingDiscountRule => Boolean(rule));
}

function parseDate(value: string | undefined): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

/**
 * Pure discount calculation. Reuses the math shape from
 * `src/lib/builder/commerce/discounts-shared.ts` but operates on booking
 * smallest-currency-unit amounts and never imports commerce cart state.
 *
 * Returns the discount amount (0 when not applicable) plus the reason so
 * callers can surface a localized "invalid code" message.
 */
export function calculateBookingDiscount(
  input: BookingDiscountInput,
  rules: readonly BookingDiscountRule[] = [],
  now: Date = new Date(),
): BookingDiscountResult {
  const code = normalizeBookingDiscountCode(input.code);
  if (!code) return { applied: false, discountAmount: 0, reason: 'missing' };

  const rule = rules.find((entry) => entry.code === code);
  if (!rule) return { code, applied: false, discountAmount: 0, reason: 'not_found' };
  if (!rule.active) return { code, applied: false, discountAmount: 0, reason: 'inactive', rule };

  if (rule.locale && rule.locale !== 'all' && rule.locale !== input.locale) {
    return { code, applied: false, discountAmount: 0, reason: 'locale_mismatch', rule };
  }

  const subtotal = Math.max(0, Math.floor(Number(input.subtotalAmount) || 0));
  if (rule.minSubtotalAmount && subtotal < rule.minSubtotalAmount) {
    return { code, applied: false, discountAmount: 0, reason: 'below_minimum', rule };
  }

  const nowTime = now.getTime();
  const startTime = parseDate(rule.startsAt);
  if (startTime !== null && nowTime < startTime) {
    return { code, applied: false, discountAmount: 0, reason: 'not_started', rule };
  }
  const endTime = parseDate(rule.endsAt);
  if (endTime !== null && nowTime > endTime) {
    return { code, applied: false, discountAmount: 0, reason: 'expired', rule };
  }

  const rawDiscount = rule.type === 'percent'
    ? Math.round((subtotal * rule.value) / 100)
    : rule.value;
  const capped = rule.maxDiscountAmount ? Math.min(rawDiscount, rule.maxDiscountAmount) : rawDiscount;
  const discountAmount = Math.min(Math.max(0, capped), subtotal);
  return {
    code,
    applied: discountAmount > 0,
    discountAmount,
    reason: discountAmount > 0 ? undefined : 'below_minimum',
    rule,
  };
}
