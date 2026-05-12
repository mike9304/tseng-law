import { describe, expect, test } from 'vitest';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { resolveCardVariantStyle } from '@/lib/builder/site/component-variants';
import {
  THEME_SHADOW_PRESETS,
  applyThemeRadiusPreset,
  applyThemeShadowPreset,
  resolveThemeShadow,
} from '@/lib/builder/site/theme';

describe('M33 theme effect presets', () => {
  test('applies global radius presets to theme radii and metadata', () => {
    const theme = applyThemeRadiusPreset(DEFAULT_THEME, 'soft');

    expect(theme.radii).toEqual({ sm: 8, md: 14, lg: 24 });
    expect(theme.effects?.radiusPreset).toBe('soft');
    expect(theme.effects?.shadowPreset).toBe('soft');
  });

  test('resolves card variant elevation from the active shadow preset', () => {
    const theme = applyThemeShadowPreset(DEFAULT_THEME, 'strong');
    const strongShadow = THEME_SHADOW_PRESETS.find((preset) => preset.key === 'strong');

    expect(strongShadow).toBeDefined();
    expect(resolveThemeShadow(theme, 'md', 'fallback')).toBe(strongShadow?.shadows.md);
    expect(resolveCardVariantStyle('elevated', theme).boxShadow).toBe(strongShadow?.shadows.md);
    expect(resolveCardVariantStyle('flat', theme).boxShadow).toBe('none');
  });
});
