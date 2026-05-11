import { describe, expect, test } from 'vitest';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import {
  applyTypographyScaleToTheme,
  normalizeThemeTextPresets,
} from '@/lib/builder/site/theme';
import {
  headingFontSizeFromTheme,
  normalizeTypographyScale,
  resolveTypographyScale,
} from '@/lib/builder/site/typography-scale';

describe('M23 typography scale', () => {
  test('normalizes modular scale values before resolving headings', () => {
    const normalized = normalizeTypographyScale({ baseSize: 99, ratio: 1.333 });

    expect(normalized).toEqual({ baseSize: 28, ratio: 1.333 });
    expect(resolveTypographyScale({
      ...DEFAULT_THEME,
      typographyScale: normalized,
    }).body).toBe(28);
  });

  test('derives heading defaults from the active modular scale', () => {
    const theme = {
      ...DEFAULT_THEME,
      typographyScale: { baseSize: 16, ratio: 1.25 as const },
    };

    expect(headingFontSizeFromTheme(theme, 6)).toBe(20);
    expect(headingFontSizeFromTheme(theme, 1)).toBe(61.04);
  });

  test('updates theme text preset sizes while preserving non-size choices', () => {
    const theme = applyTypographyScaleToTheme({
      ...DEFAULT_THEME,
      typographyScale: { baseSize: 18, ratio: 1.2 as const },
      themeTextPresets: normalizeThemeTextPresets({
        title1: {
          fontFamily: 'Inter',
          fontWeight: 'medium',
        },
      }),
    });

    expect(theme.typographyScale).toEqual({ baseSize: 18, ratio: 1.2 });
    expect(theme.themeTextPresets?.title1.fontFamily).toBe('Inter');
    expect(theme.themeTextPresets?.title1.fontWeight).toBe('medium');
    expect(theme.themeTextPresets?.body.fontSize).toBe(18);
    expect(theme.themeTextPresets?.title3.fontSize).toBe(37);
    expect(theme.themeTextPresets?.title1.fontSize).toBe(54);
  });
});
