import { describe, expect, test } from 'vitest';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { resolveCardVariantStyle } from '@/lib/builder/site/component-variants';
import {
  THEME_SHADOW_PRESETS,
  applyThemeRadiusPreset,
  applyThemeShadowPreset,
  buildCustomColorCssVars,
  createBrandKitFromTheme,
  createDesignTokenBundle,
  normalizeBrandCustomColors,
  normalizeBrandKit,
  normalizeDesignTokenTheme,
  resolveThemeShadow,
  sanitizeBrandSettings,
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

  test('normalizes brand kit custom palette colors', () => {
    const kit = normalizeBrandKit({
      palette: ['#FF0000', 'not-a-color', '#00ff00', '#ff0000'],
    });

    expect(kit.palette).toEqual(['#ff0000', '#00ff00']);
  });
});

describe('brand kit custom (named) colors', () => {
  test('normalizeBrandCustomColors drops invalid entries, lowercases, dedupes, caps at 16', () => {
    const raw = [
      { name: 'Accent Red', color: '#FF0000' },
      { name: 'Accent Red', color: '#ff0000' }, // duplicate of above after lowercase
      { name: '  Trimmed  ', color: '#00ff00' },
      { name: '', color: '#0000ff' }, // empty name -> falls back to hex
      { name: 'Bad', color: 'not-a-color' }, // invalid hex dropped
      { name: 'NoColor' }, // missing color dropped
    ];

    expect(normalizeBrandCustomColors(raw)).toEqual([
      { name: 'Accent Red', color: '#ff0000' },
      { name: 'Trimmed', color: '#00ff00' },
      { name: '#0000ff', color: '#0000ff' },
    ]);
  });

  test('normalizeBrandCustomColors returns undefined when empty/invalid', () => {
    expect(normalizeBrandCustomColors(undefined)).toBeUndefined();
    expect(normalizeBrandCustomColors([])).toBeUndefined();
    expect(normalizeBrandCustomColors([{ name: 'x', color: 'bad' }])).toBeUndefined();
  });

  test('normalizeBrandCustomColors caps the list at 16 entries', () => {
    const raw = Array.from({ length: 20 }, (_, index) => ({
      name: `Color ${index}`,
      color: `#${index.toString(16).padStart(6, '0')}`,
    }));

    const result = normalizeBrandCustomColors(raw);
    expect(result).toHaveLength(16);
  });

  test('buildCustomColorCssVars emits deterministic 0-indexed CSS variables', () => {
    const vars = buildCustomColorCssVars([
      { name: 'Red', color: '#ff0000' },
      { name: 'Green', color: '#00ff00' },
    ]);

    expect(vars).toContain('--builder-custom-color-0: #ff0000;');
    expect(vars).toContain('--builder-custom-color-1: #00ff00;');
    // Names are NOT injected into CSS (deterministic index-based vars only).
    expect(vars).not.toContain('Red');
  });

  test('buildCustomColorCssVars returns empty string for no colors', () => {
    expect(buildCustomColorCssVars(undefined)).toBe('');
    expect(buildCustomColorCssVars([])).toBe('');
  });

  test('sanitizeBrandSettings returns undefined for empty/invalid input', () => {
    expect(sanitizeBrandSettings(undefined)).toBeUndefined();
    expect(sanitizeBrandSettings({})).toBeUndefined();
    expect(sanitizeBrandSettings({ customColors: [{ name: 'x', color: 'bad' }] })).toBeUndefined();
  });

  test('sanitizeBrandSettings normalizes valid custom colors', () => {
    expect(sanitizeBrandSettings({ customColors: [{ name: 'Red', color: '#FF0000' }] })).toEqual({
      customColors: [{ name: 'Red', color: '#ff0000' }],
    });
  });

  test('createBrandKitFromTheme carries persisted brand custom colors into the kit', () => {
    const kit = createBrandKitFromTheme(DEFAULT_THEME, {
      brand: { customColors: [{ name: 'Brand Blue', color: '#1d4ed8' }] },
    });

    expect(kit.customColors).toEqual([{ name: 'Brand Blue', color: '#1d4ed8' }]);
  });

  test('createBrandKitFromTheme omits customColors when settings have none', () => {
    const kit = createBrandKitFromTheme(DEFAULT_THEME, {});

    expect(kit.customColors).toBeUndefined();
  });

  test('normalizeBrandKit round-trips custom colors through export/import', () => {
    const original = normalizeBrandKit({
      customColors: [{ name: 'Accent Red', color: '#ff0000' }],
    });

    const reImported = normalizeBrandKit(original);

    expect(reImported.customColors).toEqual([{ name: 'Accent Red', color: '#ff0000' }]);
  });
});
