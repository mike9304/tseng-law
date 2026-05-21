import { describe, expect, it } from 'vitest';
import {
  checkoutCurrenciesForSettings,
  currencyRateStatus,
  normalizeCurrencySettings,
} from '../currency-shared';

describe('commerce currency settings', () => {
  it('normalizes supported currencies, base currency, and preview rates', () => {
    const settings = normalizeCurrencySettings({
      baseCurrency: 'USD',
      supportedCurrencies: ['USD', 'BAD', 'TWD'],
      conversionMode: 'manual-preview',
      rates: [
        { currency: 'USD', rateToBase: 99 },
        { currency: 'TWD', rateToBase: '0.03125' },
        { currency: 'KRW', rateToBase: -1 },
      ],
    }, '2026-05-20T00:00:00.000Z');

    expect(settings).toMatchObject({
      baseCurrency: 'USD',
      supportedCurrencies: ['TWD', 'USD'],
      conversionMode: 'manual-preview',
      updatedAt: '2026-05-20T00:00:00.000Z',
    });
    expect(settings.rates.find((rate) => rate.currency === 'USD')).toMatchObject({ enabled: true, rateToBase: 1 });
    expect(settings.rates.find((rate) => rate.currency === 'TWD')).toMatchObject({ enabled: true, rateToBase: 0.03125 });
    expect(settings.rates.find((rate) => rate.currency === 'KRW')).toMatchObject({ enabled: false });
    expect(currencyRateStatus(settings, 'USD')).toBe('base');
    expect(currencyRateStatus(settings, 'TWD')).toBe('ready');
    expect(currencyRateStatus(settings, 'KRW')).toBe('disabled');
    expect(checkoutCurrenciesForSettings(settings)).toEqual(['TWD', 'USD']);
  });

  it('keeps the base currency enabled when all submitted currencies are invalid', () => {
    const settings = normalizeCurrencySettings({
      baseCurrency: 'BAD',
      supportedCurrencies: ['BAD'],
      conversionMode: 'unknown',
      rates: [{ currency: 'KRW', rateToBase: 'not-a-number' }],
    });

    expect(settings.baseCurrency).toBe('TWD');
    expect(settings.supportedCurrencies).toEqual(['TWD']);
    expect(settings.conversionMode).toBe('disabled');
    expect(currencyRateStatus(settings, 'TWD')).toBe('base');
    expect(currencyRateStatus(settings, 'KRW')).toBe('disabled');
  });
});
