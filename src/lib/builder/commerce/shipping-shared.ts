import type { Locale } from '@/lib/locales';
import type { CommerceCurrency } from './products-shared';

export const COMMERCE_SHIPPING_RULES_VERSION = 1;

export type CommerceShippingMethod = 'digital' | 'standard' | 'express' | 'pickup' | 'local-delivery';

export interface CommerceShippingAddress {
  country?: string;
  region?: string;
}

export interface CommerceShippingRule {
  ruleId: string;
  method: CommerceShippingMethod;
  label: string;
  currency: CommerceCurrency;
  country?: string;
  region?: string;
  amountCents: number;
  freeShippingMinSubtotalCents?: number;
  active: boolean;
  locale?: Locale | 'all';
  priority: number;
  estimatedDays: string;
  pickupLocation?: string;
  updatedAt?: string;
}

export interface CommerceShippingQuote {
  method: CommerceShippingMethod;
  label: string;
  amountCents: number;
  currency: CommerceCurrency;
  estimatedDays: string;
  ruleId?: string;
  freeShippingApplied?: boolean;
  pickupLocation?: string;
}

export const DEFAULT_COMMERCE_SHIPPING_RULES: CommerceShippingRule[] = [
  {
    ruleId: 'ship-digital-twd',
    method: 'digital',
    label: 'Digital delivery',
    currency: 'TWD',
    amountCents: 0,
    active: true,
    locale: 'all',
    priority: 100,
    estimatedDays: '0',
  },
  {
    ruleId: 'ship-standard-twd',
    method: 'standard',
    label: 'Standard shipping',
    currency: 'TWD',
    country: 'TW',
    amountCents: 12000,
    freeShippingMinSubtotalCents: 150000,
    active: true,
    locale: 'all',
    priority: 90,
    estimatedDays: '3-5',
  },
  {
    ruleId: 'ship-express-twd',
    method: 'express',
    label: 'Express shipping',
    currency: 'TWD',
    country: 'TW',
    amountCents: 28000,
    active: true,
    locale: 'all',
    priority: 80,
    estimatedDays: '1-2',
  },
  {
    ruleId: 'ship-pickup-twd',
    method: 'pickup',
    label: 'Office pickup',
    currency: 'TWD',
    country: 'TW',
    amountCents: 0,
    active: true,
    locale: 'all',
    priority: 70,
    estimatedDays: '1',
    pickupLocation: 'Taipei office',
  },
  {
    ruleId: 'ship-standard-krw',
    method: 'standard',
    label: 'Standard shipping',
    currency: 'KRW',
    amountCents: 600000,
    active: true,
    locale: 'all',
    priority: 60,
    estimatedDays: '3-5',
  },
  {
    ruleId: 'ship-express-krw',
    method: 'express',
    label: 'Express shipping',
    currency: 'KRW',
    amountCents: 1200000,
    active: true,
    locale: 'all',
    priority: 50,
    estimatedDays: '1-2',
  },
  {
    ruleId: 'ship-standard-usd',
    method: 'standard',
    label: 'Standard shipping',
    currency: 'USD',
    amountCents: 1200,
    active: true,
    locale: 'all',
    priority: 40,
    estimatedDays: '3-5',
  },
  {
    ruleId: 'ship-express-usd',
    method: 'express',
    label: 'Express shipping',
    currency: 'USD',
    amountCents: 2800,
    active: true,
    locale: 'all',
    priority: 30,
    estimatedDays: '1-2',
  },
];

function stableId(value: unknown): string {
  const text = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return text.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 80) || 'shipping-rule';
}

export function normalizeShippingMethod(value: unknown): CommerceShippingMethod {
  return value === 'digital'
    || value === 'express'
    || value === 'standard'
    || value === 'pickup'
    || value === 'local-delivery'
    ? value
    : 'standard';
}

export function normalizeShippingCountry(value: unknown): string | undefined {
  const country = typeof value === 'string' ? value.trim().toUpperCase().slice(0, 2) : '';
  return /^[A-Z]{2}$/.test(country) ? country : undefined;
}

export function normalizeShippingRegion(value: unknown): string | undefined {
  const region = typeof value === 'string' ? value.trim().slice(0, 80) : '';
  return region || undefined;
}

export function normalizeShippingRule(input: unknown, index = 0): CommerceShippingRule | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceShippingRule>;
  const method = normalizeShippingMethod(source.method);
  const currency = source.currency === 'KRW' || source.currency === 'USD' || source.currency === 'TWD' ? source.currency : 'TWD';
  const amountCents = Number(source.amountCents);
  if (!Number.isFinite(amountCents) || amountCents < 0 || amountCents > 1000000000) return null;
  const freeShippingMinSubtotalCents = Number(source.freeShippingMinSubtotalCents);
  const country = normalizeShippingCountry(source.country);
  const ruleId = stableId(source.ruleId || `${method}-${currency}-${country || 'all'}-${index}`);
  const label = typeof source.label === 'string' && source.label.trim()
    ? source.label.trim().slice(0, 120)
    : method.replace(/-/g, ' ');
  return {
    ruleId,
    method,
    label,
    currency,
    country,
    region: normalizeShippingRegion(source.region),
    amountCents: Math.floor(amountCents),
    freeShippingMinSubtotalCents: Number.isFinite(freeShippingMinSubtotalCents)
      ? Math.max(0, Math.floor(freeShippingMinSubtotalCents))
      : undefined,
    active: source.active !== false,
    locale: source.locale === 'ko' || source.locale === 'zh-hant' || source.locale === 'en' ? source.locale : 'all',
    priority: Number.isFinite(source.priority) ? Math.floor(Number(source.priority)) : 0,
    estimatedDays: typeof source.estimatedDays === 'string' && source.estimatedDays.trim()
      ? source.estimatedDays.trim().slice(0, 40)
      : method === 'digital' ? '0' : method === 'express' ? '1-2' : '3-5',
    pickupLocation: typeof source.pickupLocation === 'string' && source.pickupLocation.trim()
      ? source.pickupLocation.trim().slice(0, 180)
      : undefined,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : undefined,
  };
}

export function normalizeShippingRules(
  input: unknown,
  fallback: CommerceShippingRule[] = DEFAULT_COMMERCE_SHIPPING_RULES,
): CommerceShippingRule[] {
  if (!Array.isArray(input)) return fallback;
  const rules = input
    .map((rule, index) => normalizeShippingRule(rule, index))
    .filter((rule): rule is CommerceShippingRule => Boolean(rule));
  return rules.length > 0 ? rules : fallback;
}

export function publicShippingRules(
  rules: CommerceShippingRule[],
  locale: Locale,
  currency: CommerceCurrency,
): CommerceShippingRule[] {
  return normalizeShippingRules(rules)
    .filter((rule) => rule.active)
    .filter((rule) => rule.currency === currency)
    .filter((rule) => !rule.locale || rule.locale === 'all' || rule.locale === locale);
}

export function availableShippingMethods(input: {
  address: CommerceShippingAddress;
  locale: Locale;
  currency: CommerceCurrency;
  rules?: CommerceShippingRule[];
}): CommerceShippingRule[] {
  const country = normalizeShippingCountry(input.address.country);
  const region = normalizeShippingRegion(input.address.region);
  const rules = publicShippingRules(input.rules ?? DEFAULT_COMMERCE_SHIPPING_RULES, input.locale, input.currency);
  const matched = rules
    .filter((rule) => !rule.country || !country || rule.country === country)
    .filter((rule) => !rule.region || rule.region.toLowerCase() === region?.toLowerCase())
    .sort((left, right) => right.priority - left.priority || left.label.localeCompare(right.label));
  const byMethod = new Map<CommerceShippingMethod, CommerceShippingRule>();
  for (const rule of matched) {
    if (!byMethod.has(rule.method)) byMethod.set(rule.method, rule);
  }
  return Array.from(byMethod.values());
}

export function calculateCommerceShippingQuote(input: {
  method: CommerceShippingMethod;
  address: CommerceShippingAddress;
  locale: Locale;
  currency: CommerceCurrency;
  discountedSubtotalCents: number;
  rules?: CommerceShippingRule[];
}): CommerceShippingQuote {
  const method = normalizeShippingMethod(input.method);
  const rules = availableShippingMethods({
    address: input.address,
    locale: input.locale,
    currency: input.currency,
    rules: input.rules,
  });
  const selected = rules.find((rule) => rule.method === method)
    ?? rules.find((rule) => rule.method === 'standard')
    ?? rules[0]
    ?? normalizeShippingRule({ method, currency: input.currency, amountCents: 0, active: true, label: method })!;
  const freeShippingApplied = Boolean(
    selected.freeShippingMinSubtotalCents
    && input.discountedSubtotalCents >= selected.freeShippingMinSubtotalCents,
  );
  return {
    method: selected.method,
    label: selected.label,
    amountCents: freeShippingApplied ? 0 : selected.amountCents,
    currency: selected.currency,
    estimatedDays: selected.estimatedDays,
    ruleId: selected.ruleId,
    freeShippingApplied,
    pickupLocation: selected.pickupLocation,
  };
}
