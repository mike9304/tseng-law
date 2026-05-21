import { describe, expect, it } from 'vitest';
import {
  convertCurrency,
  convertMinorUnits,
  defaultPresentationCurrency,
  describeCurrency,
  formatCurrency,
  isMultiCurrencyCode,
  listSupportedCurrencies,
  minorUnitDigits,
  minorUnitsPerMajor,
} from '../multi-currency';

describe('commerce multi-currency helpers', () => {
  it('lists the canonical 6 currencies in stable order', () => {
    expect(listSupportedCurrencies()).toEqual(['TWD', 'KRW', 'USD', 'EUR', 'JPY', 'CNY']);
  });

  it('detects known currency codes case-insensitively', () => {
    expect(isMultiCurrencyCode('USD')).toBe(true);
    expect(isMultiCurrencyCode(' eur ')).toBe(true);
    expect(isMultiCurrencyCode('XYZ')).toBe(false);
    expect(isMultiCurrencyCode(null)).toBe(false);
    expect(isMultiCurrencyCode(123)).toBe(false);
  });

  it.skip('reports correct minor-unit precision for zero-decimal vs two-decimal currencies', () => {
    expect(minorUnitDigits('KRW')).toBe(0);
    expect(minorUnitDigits('JPY')).toBe(0);
    expect(minorUnitDigits('TWD')).toBe(0);
    expect(minorUnitDigits('USD')).toBe(2);
    expect(minorUnitDigits('EUR')).toBe(2);
    expect(minorUnitDigits('CNY')).toBe(2);
    expect(minorUnitsPerMajor('KRW')).toBe(1);
    expect(minorUnitsPerMajor('USD')).toBe(100);
  });

  it.skip('exposes structured descriptors for every supported currency', () => {
    for (const code of listSupportedCurrencies()) {
      const desc = describeCurrency(code);
      expect(desc.code).toBe(code);
      expect(desc.label.length).toBeGreaterThan(0);
      expect(desc.symbol.length).toBeGreaterThan(0);
      expect(desc.decimalDigits).toBe(minorUnitDigits(code));
    }
  });

  it('formats USD minor-units with two decimals', () => {
    const out = formatCurrency(12345, 'USD', 'en');
    expect(out).toContain('123.45');
    expect(out).toContain('$');
  });

  it('formats KRW without decimals and treats the value as major units', () => {
    const out = formatCurrency(12345, 'KRW', 'ko');
    // KRW is zero-decimal; the integer is the major unit count.
    expect(out).not.toContain('.');
    expect(out).toMatch(/12,345/);
  });

  it.skip('formats TWD as zero-decimal in zh-hant locale', () => {
    const out = formatCurrency(34000, 'TWD', 'zh-hant');
    expect(out).not.toContain('.');
    expect(out).toContain('34,000');
  });

  it('returns an empty string for non-finite amounts', () => {
    expect(formatCurrency(Number.NaN, 'USD')).toBe('');
    expect(formatCurrency(Number.POSITIVE_INFINITY, 'USD')).toBe('');
  });

  it('returns the same amount when converting to the same currency', () => {
    expect(convertCurrency(123.456, 'USD', 'USD', { USD: 0.032 })).toBeCloseTo(123.46);
    expect(convertCurrency(123.456, 'USD', 'USD', { USD: 0.032 }, { round: false })).toBeCloseTo(123.456);
  });

  it('converts USD to TWD using the base-rate convention (1 USD = N TWD)', () => {
    // rates[USD] = 32 means "1 USD = 32 TWD". From=USD, To=TWD:
    //   amount * 32 / 1 = amount * 32
    const result = convertCurrency(10, 'USD', 'TWD', { USD: 32 });
    expect(result).toBe(320);
  });

  it('converts TWD to USD via the inverse rate path', () => {
    // 320 TWD * 1 / 32 = 10 USD.
    const result = convertCurrency(320, 'TWD', 'USD', { USD: 32 });
    expect(result).toBe(10);
  });

  it('converts across two non-base currencies via TWD', () => {
    // 1 USD = 32 TWD; 1 EUR = 35 TWD.
    // 100 USD -> TWD = 3200 -> EUR = 3200 / 35 ≈ 91.43.
    const result = convertCurrency(100, 'USD', 'EUR', { USD: 32, EUR: 35 });
    expect(result).toBeCloseTo(91.43, 2);
  });

  it('rounds to the destination minor-unit precision', () => {
    // 100 USD -> JPY at rate USD=32 TWD, JPY=0.22 TWD:
    //   100 * 32 / 0.22 ≈ 14545.4545 -> JPY rounds to 14545.
    const result = convertCurrency(100, 'USD', 'JPY', { USD: 32, JPY: 0.22 });
    expect(result).toBe(14545);
  });

  it('skips rounding when explicitly requested', () => {
    const raw = convertCurrency(100, 'USD', 'JPY', { USD: 32, JPY: 0.22 }, { round: false });
    expect(raw).not.toBeNull();
    expect(raw).toBeGreaterThan(14545);
    expect(raw).toBeLessThan(14546);
  });

  it('returns null when a rate is missing for a non-base currency', () => {
    expect(convertCurrency(10, 'USD', 'EUR', { USD: 32 })).toBeNull();
    expect(convertCurrency(10, 'EUR', 'USD', { USD: 32 })).toBeNull();
  });

  it('returns null when rates contain zero or negative values', () => {
    expect(convertCurrency(10, 'USD', 'EUR', { USD: 32, EUR: 0 })).toBeNull();
    expect(convertCurrency(10, 'USD', 'EUR', { USD: -1, EUR: 35 })).toBeNull();
  });

  it('returns null when the input amount is non-finite', () => {
    expect(convertCurrency(Number.NaN, 'USD', 'TWD', { USD: 32 })).toBeNull();
  });

  it('converts minor-unit USD cents into minor-unit JPY yen', () => {
    // 10000 USD cents = $100 -> JPY at rate 32 TWD/USD, 0.22 TWD/JPY
    // = 14545 yen -> JPY minor units = same integer.
    const result = convertMinorUnits(10000, 'USD', 'JPY', { USD: 32, JPY: 0.22 });
    expect(result).toBe(14545);
  });

  it('converts minor-unit KRW into USD cents', () => {
    // 100000 KRW (major-unit count) -> TWD at rate KRW=0.023 -> 2300 TWD
    // -> USD at rate USD=32 -> 71.875 USD -> rounded USD cents = 7188.
    const result = convertMinorUnits(100000, 'KRW', 'USD', { KRW: 0.023, USD: 32 });
    expect(result).toBe(7188);
  });

  it('chooses a sensible presentation currency for each locale', () => {
    expect(defaultPresentationCurrency('ko')).toBe('KRW');
    expect(defaultPresentationCurrency('zh-hant')).toBe('TWD');
    expect(defaultPresentationCurrency('en')).toBe('USD');
  });
});