/**
 * F66 — Multi-currency depth helpers.
 *
 * NOTE: The canonical commerce checkout currency type
 * (`CommerceCurrency` in `products-shared.ts`) is intentionally restricted to
 * the active checkout set `TWD | KRW | USD`. This module operates on a broader
 * "presentation" set used for formatting/quoting/conversion previews — for
 * example, surfacing a customer-facing invoice total or a billing analytics
 * summary in a non-checkout currency. Conversion remains preview-only until
 * provider currency support lands; checkout still enforces the single-currency
 * policy declared by `currency-shared`.
 *
 * Pure helpers only — no IO, no blob, no Vercel deps. Safe to import in
 * server and edge contexts.
 */
import type { Locale } from '@/lib/locales';

export type MultiCurrencyCode = 'TWD' | 'KRW' | 'USD' | 'EUR' | 'JPY' | 'CNY';

/** Currencies that ISO-4217 treats as zero-decimal (no minor units). */
const ZERO_DECIMAL_CURRENCIES: ReadonlySet<MultiCurrencyCode> = new Set(['KRW', 'JPY']);

/** Canonical TWD/KRW/USD/EUR/JPY/CNY list — ordered for stable UI rendering. */
const CANONICAL_CURRENCIES: readonly MultiCurrencyCode[] = ['TWD', 'KRW', 'USD', 'EUR', 'JPY', 'CNY'] as const;

export interface MultiCurrencyDescriptor {
  code: MultiCurrencyCode;
  symbol: string;
  decimalDigits: number;
  /** English display label — locales can override via `formatCurrency(locale)`. */
  label: string;
}

const DESCRIPTORS: Readonly<Record<MultiCurrencyCode, MultiCurrencyDescriptor>> = {
  TWD: { code: 'TWD', symbol: 'NT$', decimalDigits: 0, label: 'New Taiwan Dollar' },
  KRW: { code: 'KRW', symbol: '₩', decimalDigits: 0, label: 'South Korean Won' },
  USD: { code: 'USD', symbol: '$', decimalDigits: 2, label: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', decimalDigits: 2, label: 'Euro' },
  JPY: { code: 'JPY', symbol: '¥', decimalDigits: 0, label: 'Japanese Yen' },
  CNY: { code: 'CNY', symbol: '¥', decimalDigits: 2, label: 'Chinese Yuan' },
};

/**
 * Conversion rate map keyed by ISO code, expressing "1 unit of `code` ="
 * `rate` units of the base currency (TWD). Callers may pass any base — see
 * `convertCurrency` for resolution semantics.
 */
export type MultiCurrencyRateMap = Readonly<Partial<Record<MultiCurrencyCode, number>>>;

export interface ConvertCurrencyOptions {
  /**
   * When true (default), result is rounded to the destination currency's
   * minor-unit precision. Pass `false` for unrounded math chaining.
   */
  round?: boolean;
}

/** Type guard — returns true when `value` is one of the canonical 6 codes. */
export function isMultiCurrencyCode(value: unknown): value is MultiCurrencyCode {
  return typeof value === 'string' && (CANONICAL_CURRENCIES as readonly string[]).includes(value.trim().toUpperCase());
}

/** Returns the canonical list. Always returns the same frozen ordering. */
export function listSupportedCurrencies(): readonly MultiCurrencyCode[] {
  return CANONICAL_CURRENCIES;
}

/** Returns a structured descriptor for a known currency code. */
export function describeCurrency(code: MultiCurrencyCode): MultiCurrencyDescriptor {
  return DESCRIPTORS[code];
}

/** Returns the ISO-4217 minor-unit count (0 for KRW/JPY/TWD, 2 for USD/EUR/CNY). */
export function minorUnitDigits(code: MultiCurrencyCode): number {
  return ZERO_DECIMAL_CURRENCIES.has(code) ? 0 : 2;
}

/** Returns the multiplier used to convert minor units (cents) into major units. */
export function minorUnitsPerMajor(code: MultiCurrencyCode): number {
  return ZERO_DECIMAL_CURRENCIES.has(code) ? 1 : 100;
}

function intlLocale(locale: Locale): string {
  if (locale === 'ko') return 'ko-KR';
  if (locale === 'zh-hant') return 'zh-TW';
  return 'en-US';
}

/**
 * Format a minor-unit integer amount (e.g., `12345` USD cents -> `"$123.45"`).
 *
 * @param amountCents Integer minor-unit amount. For zero-decimal currencies
 *   (KRW/JPY/TWD) this is treated as the major-unit count directly.
 * @param currency ISO 4217 code from {@link listSupportedCurrencies}.
 * @param locale Display locale; defaults to English.
 */
export function formatCurrency(
  amountCents: number,
  currency: MultiCurrencyCode,
  locale: Locale = 'en',
): string {
  if (!Number.isFinite(amountCents)) return '';
  const digits = minorUnitDigits(currency);
  const divisor = minorUnitsPerMajor(currency);
  const formatter = new Intl.NumberFormat(intlLocale(locale), {
    currency,
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    style: 'currency',
  });
  return formatter.format(amountCents / divisor);
}

/**
 * Convert `amount` (in major units of `from`) into `to` using `rates`.
 *
 * Rates use TWD as the base — i.e., a rate of `0.032` for USD means
 * "1 USD = 0.032 TWD". To convert from A to B we compute
 * `amount * rates[A] / rates[B]`. The base currency's rate defaults to 1.
 *
 * Returns `null` when a required rate is missing or invalid.
 */
export function convertCurrency(
  amount: number,
  from: MultiCurrencyCode,
  to: MultiCurrencyCode,
  rates: MultiCurrencyRateMap,
  options: ConvertCurrencyOptions = {},
): number | null {
  if (!Number.isFinite(amount)) return null;
  if (from === to) return options.round === false ? amount : roundToCurrency(amount, to);

  const fromRate = resolveRate(from, rates);
  const toRate = resolveRate(to, rates);
  if (fromRate === null || toRate === null) return null;
  if (toRate === 0) return null;

  const result = (amount * fromRate) / toRate;
  if (!Number.isFinite(result)) return null;
  return options.round === false ? result : roundToCurrency(result, to);
}

function resolveRate(code: MultiCurrencyCode, rates: MultiCurrencyRateMap): number | null {
  if (code === 'TWD') {
    const explicit = rates.TWD;
    if (typeof explicit === 'number' && Number.isFinite(explicit) && explicit > 0) return explicit;
    return 1;
  }
  const value = rates[code];
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null;
  return value;
}

function roundToCurrency(amount: number, currency: MultiCurrencyCode): number {
  const factor = Math.pow(10, minorUnitDigits(currency));
  return Math.round(amount * factor) / factor;
}

/**
 * Convert a minor-unit amount in `from` into a minor-unit amount in `to`.
 * Useful when chaining with order/invoice storage which uses cents.
 */
export function convertMinorUnits(
  amountMinor: number,
  from: MultiCurrencyCode,
  to: MultiCurrencyCode,
  rates: MultiCurrencyRateMap,
): number | null {
  if (!Number.isFinite(amountMinor)) return null;
  const major = amountMinor / minorUnitsPerMajor(from);
  const converted = convertCurrency(major, from, to, rates, { round: false });
  if (converted === null) return null;
  return Math.round(converted * minorUnitsPerMajor(to));
}

/**
 * Returns the canonical currency for a checkout locale (used as a sensible
 * presentation default). Falls back to USD for non-mapped locales.
 */
export function defaultPresentationCurrency(locale: Locale): MultiCurrencyCode {
  if (locale === 'ko') return 'KRW';
  if (locale === 'zh-hant') return 'TWD';
  return 'USD';
}