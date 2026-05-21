import type { Locale } from '@/lib/locales';
import type { CommerceCurrency } from './products-shared';

export const COMMERCE_TAX_RULES_VERSION = 1;

export interface CommerceTaxAddress {
  country?: string;
  region?: string;
}

export interface CommerceTaxRule {
  ruleId: string;
  label: string;
  country: string;
  region?: string;
  rateBps: number;
  active: boolean;
  locale?: Locale | 'all';
  priority: number;
  includedInPrice?: boolean;
  updatedAt?: string;
}

export interface CommerceTaxQuote {
  country: string;
  region?: string;
  rateBps: number;
  amountCents: number;
  label: string;
  ruleId?: string;
  includedInPrice?: boolean;
}

export const DEFAULT_COMMERCE_TAX_RULES: CommerceTaxRule[] = [
  {
    ruleId: 'tax-tw',
    label: 'Taiwan VAT',
    country: 'TW',
    rateBps: 500,
    active: true,
    locale: 'all',
    priority: 100,
  },
  {
    ruleId: 'tax-kr',
    label: 'Korea VAT',
    country: 'KR',
    rateBps: 1000,
    active: true,
    locale: 'all',
    priority: 90,
  },
  {
    ruleId: 'tax-us',
    label: 'US no automatic tax',
    country: 'US',
    rateBps: 0,
    active: true,
    locale: 'all',
    priority: 80,
  },
];

function stableId(value: unknown): string {
  const text = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return text.replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 80) || 'tax-rule';
}

export function normalizeTaxCountry(value: unknown): string {
  const country = typeof value === 'string' ? value.trim().toUpperCase().slice(0, 2) : '';
  return /^[A-Z]{2}$/.test(country) ? country : 'TW';
}

export function normalizeTaxRegion(value: unknown): string | undefined {
  const region = typeof value === 'string' ? value.trim().slice(0, 80) : '';
  return region || undefined;
}

export function normalizeTaxRule(input: unknown, index = 0): CommerceTaxRule | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceTaxRule>;
  const country = normalizeTaxCountry(source.country);
  const rateBps = Number(source.rateBps);
  if (!Number.isFinite(rateBps) || rateBps < 0 || rateBps > 10000) return null;
  const ruleId = stableId(source.ruleId || `${country}-${source.region || index}`);
  const label = typeof source.label === 'string' && source.label.trim()
    ? source.label.trim().slice(0, 120)
    : `${country} tax ${(Math.floor(rateBps) / 100).toFixed(2)}%`;
  return {
    ruleId,
    label,
    country,
    region: normalizeTaxRegion(source.region),
    rateBps: Math.floor(rateBps),
    active: source.active !== false,
    locale: source.locale === 'ko' || source.locale === 'zh-hant' || source.locale === 'en' ? source.locale : 'all',
    priority: Number.isFinite(source.priority) ? Math.floor(Number(source.priority)) : 0,
    includedInPrice: Boolean(source.includedInPrice),
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : undefined,
  };
}

export function normalizeTaxRules(input: unknown, fallback: CommerceTaxRule[] = DEFAULT_COMMERCE_TAX_RULES): CommerceTaxRule[] {
  if (!Array.isArray(input)) return fallback;
  const rules = input
    .map((rule, index) => normalizeTaxRule(rule, index))
    .filter((rule): rule is CommerceTaxRule => Boolean(rule));
  return rules.length > 0 ? rules : fallback;
}

export function publicTaxRules(rules: CommerceTaxRule[], locale: Locale): CommerceTaxRule[] {
  return normalizeTaxRules(rules)
    .filter((rule) => rule.active)
    .filter((rule) => !rule.locale || rule.locale === 'all' || rule.locale === locale);
}

export function findCommerceTaxRule(
  address: CommerceTaxAddress,
  locale: Locale,
  rules: CommerceTaxRule[] = DEFAULT_COMMERCE_TAX_RULES,
): CommerceTaxRule | null {
  const country = normalizeTaxCountry(address.country);
  const region = normalizeTaxRegion(address.region);
  const candidates = publicTaxRules(rules, locale)
    .filter((rule) => rule.country === country)
    .filter((rule) => !rule.region || rule.region.toLowerCase() === region?.toLowerCase())
    .sort((left, right) => {
      const priority = right.priority - left.priority;
      if (priority !== 0) return priority;
      const regionSpecificity = Number(Boolean(right.region)) - Number(Boolean(left.region));
      if (regionSpecificity !== 0) return regionSpecificity;
      return left.label.localeCompare(right.label);
    });
  return candidates[0] ?? null;
}

export function calculateCommerceTaxQuote(input: {
  address: CommerceTaxAddress;
  locale: Locale;
  currency: CommerceCurrency;
  taxableCents: number;
  rules?: CommerceTaxRule[];
}): CommerceTaxQuote {
  const country = normalizeTaxCountry(input.address.country);
  const region = normalizeTaxRegion(input.address.region);
  const rule = findCommerceTaxRule(input.address, input.locale, input.rules);
  const rateBps = rule?.rateBps ?? 0;
  const taxableCents = Math.max(0, Math.floor(input.taxableCents));
  const amountCents = rule?.includedInPrice ? 0 : Math.round((taxableCents * rateBps) / 10000);
  return {
    country,
    region,
    rateBps,
    amountCents,
    label: rule?.label ?? `${country} tax`,
    ruleId: rule?.ruleId,
    includedInPrice: rule?.includedInPrice,
  };
}
