import type { Locale } from '@/lib/locales';
import type { CommerceCartState } from './cart-shared';

export type CommerceDiscountType = 'percent' | 'fixed';

export interface CommerceDiscountRule {
  code: string;
  type: CommerceDiscountType;
  value: number;
  active: boolean;
  locale?: Locale | 'all';
  minSubtotalCents?: number;
  maxDiscountCents?: number;
  startsAt?: string;
  endsAt?: string;
}

export interface CommerceDiscountResult {
  code?: string;
  applied: boolean;
  discountCents: number;
  reason?: 'missing' | 'not_found' | 'inactive' | 'locale_mismatch' | 'below_minimum' | 'not_started' | 'expired';
  rule?: CommerceDiscountRule;
}

export const DEFAULT_COMMERCE_DISCOUNTS: CommerceDiscountRule[] = [
  {
    code: 'SAVE10',
    type: 'percent',
    value: 10,
    active: true,
    locale: 'all',
    minSubtotalCents: 10000,
    maxDiscountCents: 50000,
  },
  {
    code: 'WELCOME',
    type: 'fixed',
    value: 5000,
    active: true,
    locale: 'all',
    minSubtotalCents: 20000,
  },
];

export function normalizeDiscountCode(code: unknown): string | undefined {
  const normalized = typeof code === 'string' ? code.trim().toUpperCase().slice(0, 32) : '';
  return normalized || undefined;
}

export function normalizeDiscountRule(input: unknown): CommerceDiscountRule | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceDiscountRule>;
  const code = normalizeDiscountCode(source.code);
  if (!code) return null;
  const type = source.type === 'fixed' || source.type === 'percent' ? source.type : 'percent';
  const value = Number(source.value);
  if (!Number.isFinite(value) || value <= 0) return null;
  return {
    code,
    type,
    value: Math.floor(value),
    active: source.active !== false,
    locale: source.locale === 'ko' || source.locale === 'zh-hant' || source.locale === 'en' ? source.locale : 'all',
    minSubtotalCents: Number.isFinite(source.minSubtotalCents) ? Math.max(0, Math.floor(Number(source.minSubtotalCents))) : undefined,
    maxDiscountCents: Number.isFinite(source.maxDiscountCents) ? Math.max(0, Math.floor(Number(source.maxDiscountCents))) : undefined,
    startsAt: typeof source.startsAt === 'string' ? source.startsAt : undefined,
    endsAt: typeof source.endsAt === 'string' ? source.endsAt : undefined,
  };
}

export function normalizeDiscountRules(input: unknown): CommerceDiscountRule[] {
  if (!Array.isArray(input)) return DEFAULT_COMMERCE_DISCOUNTS;
  const rules = input
    .map((rule) => normalizeDiscountRule(rule))
    .filter((rule): rule is CommerceDiscountRule => Boolean(rule));
  return rules.length > 0 ? rules : DEFAULT_COMMERCE_DISCOUNTS;
}

function validDate(value: string | undefined): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

export function calculateCartDiscount(
  cart: CommerceCartState,
  subtotalCents: number,
  rules: CommerceDiscountRule[] = DEFAULT_COMMERCE_DISCOUNTS,
  now: Date = new Date(),
): CommerceDiscountResult {
  const code = normalizeDiscountCode(cart.couponCode);
  if (!code) return { applied: false, discountCents: 0, reason: 'missing' };
  const rule = rules.find((entry) => entry.code === code);
  if (!rule) return { code, applied: false, discountCents: 0, reason: 'not_found' };
  if (!rule.active) return { code, applied: false, discountCents: 0, reason: 'inactive', rule };
  if (rule.locale && rule.locale !== 'all' && rule.locale !== cart.locale) {
    return { code, applied: false, discountCents: 0, reason: 'locale_mismatch', rule };
  }
  if (rule.minSubtotalCents && subtotalCents < rule.minSubtotalCents) {
    return { code, applied: false, discountCents: 0, reason: 'below_minimum', rule };
  }
  const nowTime = now.getTime();
  const startTime = validDate(rule.startsAt);
  if (startTime && nowTime < startTime) return { code, applied: false, discountCents: 0, reason: 'not_started', rule };
  const endTime = validDate(rule.endsAt);
  if (endTime && nowTime > endTime) return { code, applied: false, discountCents: 0, reason: 'expired', rule };

  const rawDiscount = rule.type === 'percent'
    ? Math.round((subtotalCents * rule.value) / 100)
    : rule.value;
  const capped = rule.maxDiscountCents ? Math.min(rawDiscount, rule.maxDiscountCents) : rawDiscount;
  const discountCents = Math.min(Math.max(0, capped), Math.max(0, subtotalCents));
  return {
    code,
    applied: discountCents > 0,
    discountCents,
    reason: discountCents > 0 ? undefined : 'below_minimum',
    rule,
  };
}
