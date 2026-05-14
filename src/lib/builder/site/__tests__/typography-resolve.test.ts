import { describe, expect, test } from 'vitest';
import {
  resolveFontWeightCss,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';

describe('typography fontWeight resolution', () => {
  test('legacy enum maps to numeric CSS weights without override', () => {
    expect(resolveFontWeightCss({ fontWeight: 'regular' })).toBe(400);
    expect(resolveFontWeightCss({ fontWeight: 'medium' })).toBe(600);
    expect(resolveFontWeightCss({ fontWeight: 'bold' })).toBe(700);
    expect(resolveFontWeightCss({})).toBe(400);
  });

  test('numeric override wins over the legacy enum', () => {
    expect(
      resolveFontWeightCss({ fontWeight: 'regular', fontWeightNumeric: 800 }),
    ).toBe(800);
    expect(
      resolveFontWeightCss({ fontWeight: 'bold', fontWeightNumeric: 300 }),
    ).toBe(300);
  });

  test('ignores non-finite numeric override and falls back to enum', () => {
    expect(
      resolveFontWeightCss({
        fontWeight: 'medium',
        fontWeightNumeric: Number.NaN as unknown as number,
      }),
    ).toBe(600);
  });

  test('resolveThemeTextTypography passes through new optional fields', () => {
    const typography = resolveThemeTextTypography({
      fontWeight: 'bold',
      fontWeightNumeric: 500,
      fontStyle: 'italic',
      textDecoration: 'underline',
    });
    expect(typography.fontWeight).toBe('bold');
    expect(typography.fontWeightNumeric).toBe(500);
    expect(typography.fontStyle).toBe('italic');
    expect(typography.textDecoration).toBe('underline');
  });

  test('typography fields stay undefined when content omits them — backward compat', () => {
    const typography = resolveThemeTextTypography({ fontWeight: 'regular' });
    expect(typography.fontWeightNumeric).toBeUndefined();
    expect(typography.fontStyle).toBeUndefined();
    expect(typography.textDecoration).toBeUndefined();
  });
});
