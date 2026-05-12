import { describe, expect, test } from 'vitest';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { resolveCardVariantStyle } from '@/lib/builder/site/component-variants';
import {
  THEME_SHADOW_PRESETS,
  applyThemeRadiusPreset,
  applyThemeShadowPreset,
  createDesignTokenBundle,
  normalizeDesignTokenTheme,
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

  test('exports and imports a full design token bundle', () => {
    const sourceTheme = applyThemeShadowPreset(
      applyThemeRadiusPreset({
        ...DEFAULT_THEME,
        colors: { ...DEFAULT_THEME.colors, primary: '#0f766e' },
        fonts: { heading: 'Inter', body: 'Noto Sans KR' },
        typographyScale: { baseSize: 18, ratio: 1.25 },
      }, 'sharp'),
      'strong',
    );
    const bundle = createDesignTokenBundle(sourceTheme, 'Hojeong');
    const imported = normalizeDesignTokenTheme(bundle, DEFAULT_THEME);

    expect(bundle.schemaVersion).toBe(1);
    expect(bundle.siteName).toBe('Hojeong');
    expect(imported.colors.primary).toBe('#0f766e');
    expect(imported.fonts.heading).toBe('Inter');
    expect(imported.radii).toEqual({ sm: 0, md: 2, lg: 4 });
    expect(imported.effects).toEqual({ radiusPreset: 'sharp', shadowPreset: 'strong' });
    expect(imported.typographyScale).toEqual({ baseSize: 18, ratio: 1.25 });
    expect(imported.themeTextPresets?.body.fontSize).toBe(18);
  });
});
