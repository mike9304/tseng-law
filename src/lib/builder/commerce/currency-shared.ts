import type { CommerceCurrency } from './products-shared';

export const COMMERCE_CURRENCY_SETTINGS_VERSION = 1;

export const COMMERCE_SUPPORTED_CURRENCIES: readonly CommerceCurrency[] = ['TWD', 'KRW', 'USD'] as const;

export type CommerceCurrencyConversionMode = 'disabled' | 'manual-preview';

export interface CommerceCurrencyRate {
  currency: CommerceCurrency;
  enabled: boolean;
  rateToBase?: number;
  updatedAt: string;
}

export interface CommerceCurrencySettings {
  version: typeof COMMERCE_CURRENCY_SETTINGS_VERSION;
  baseCurrency: CommerceCurrency;
  supportedCurrencies: CommerceCurrency[];
  conversionMode: CommerceCurrencyConversionMode;
  rates: CommerceCurrencyRate[];
  updatedAt: string;
}

export const DEFAULT_COMMERCE_CURRENCY_SETTINGS: CommerceCurrencySettings = {
  version: COMMERCE_CURRENCY_SETTINGS_VERSION,
  baseCurrency: 'TWD',
  supportedCurrencies: [...COMMERCE_SUPPORTED_CURRENCIES],
  conversionMode: 'disabled',
  rates: COMMERCE_SUPPORTED_CURRENCIES.map((currency) => ({
    currency,
    enabled: true,
    ...(currency === 'TWD' ? { rateToBase: 1 } : {}),
    updatedAt: '1970-01-01T00:00:00.000Z',
  })),
  updatedAt: '1970-01-01T00:00:00.000Z',
};

export function isCommerceCurrency(value: unknown): value is CommerceCurrency {
  return COMMERCE_SUPPORTED_CURRENCIES.includes(value as CommerceCurrency);
}

export function normalizeCommerceCurrency(
  value: unknown,
  fallback: CommerceCurrency = 'TWD',
  supportedCurrencies: readonly CommerceCurrency[] = COMMERCE_SUPPORTED_CURRENCIES,
): CommerceCurrency {
  const normalized = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return isCommerceCurrency(normalized) && supportedCurrencies.includes(normalized)
    ? normalized
    : fallback;
}

function normalizeConversionMode(value: unknown): CommerceCurrencyConversionMode {
  return value === 'manual-preview' ? 'manual-preview' : 'disabled';
}

function normalizeRate(value: unknown): number | undefined {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : NaN;
  if (!Number.isFinite(numeric) || numeric <= 0) return undefined;
  return Math.min(1000000000, Math.round(numeric * 1000000) / 1000000);
}

export function normalizeCurrencySettings(input: unknown, now = new Date().toISOString()): CommerceCurrencySettings {
  const source = input && typeof input === 'object' ? input as Partial<CommerceCurrencySettings> : {};
  const requestedBase = normalizeCommerceCurrency(source.baseCurrency, DEFAULT_COMMERCE_CURRENCY_SETTINGS.baseCurrency);
  const supportedSet = new Set<CommerceCurrency>();
  const requestedSupported = Array.isArray(source.supportedCurrencies)
    ? source.supportedCurrencies
    : DEFAULT_COMMERCE_CURRENCY_SETTINGS.supportedCurrencies;
  for (const currency of requestedSupported) {
    if (isCommerceCurrency(currency)) supportedSet.add(currency);
  }
  supportedSet.add(requestedBase);
  const supportedCurrencies = COMMERCE_SUPPORTED_CURRENCIES.filter((currency) => supportedSet.has(currency));
  const baseCurrency = supportedCurrencies.includes(requestedBase) ? requestedBase : 'TWD';
  const rateInputs = new Map<CommerceCurrency, Partial<CommerceCurrencyRate>>();
  if (Array.isArray(source.rates)) {
    for (const rate of source.rates) {
      if (rate && typeof rate === 'object' && isCommerceCurrency(rate.currency)) {
        rateInputs.set(rate.currency, rate);
      }
    }
  }
  const rates = COMMERCE_SUPPORTED_CURRENCIES.map((currency) => {
    const inputRate = rateInputs.get(currency);
    const enabled = supportedCurrencies.includes(currency);
    return {
      currency,
      enabled,
      ...(currency === baseCurrency
        ? { rateToBase: 1 }
        : normalizeRate(inputRate?.rateToBase) !== undefined
          ? { rateToBase: normalizeRate(inputRate?.rateToBase) }
          : {}),
      updatedAt: now,
    } satisfies CommerceCurrencyRate;
  });

  return {
    version: COMMERCE_CURRENCY_SETTINGS_VERSION,
    baseCurrency,
    supportedCurrencies,
    conversionMode: normalizeConversionMode(source.conversionMode),
    rates,
    updatedAt: now,
  };
}

export function checkoutCurrenciesForSettings(settings: CommerceCurrencySettings): readonly CommerceCurrency[] {
  return settings.supportedCurrencies.length ? settings.supportedCurrencies : COMMERCE_SUPPORTED_CURRENCIES;
}

export function currencyRateStatus(settings: CommerceCurrencySettings, currency: CommerceCurrency): 'base' | 'ready' | 'missing' | 'disabled' {
  if (!settings.supportedCurrencies.includes(currency)) return 'disabled';
  if (currency === settings.baseCurrency) return 'base';
  const rate = settings.rates.find((entry) => entry.currency === currency);
  return typeof rate?.rateToBase === 'number' && rate.rateToBase > 0 ? 'ready' : 'missing';
}
