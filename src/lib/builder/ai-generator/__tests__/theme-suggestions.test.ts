import { describe, expect, it } from 'vitest';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { DEFAULT_THEME_TEXT_PRESETS } from '@/lib/builder/site/theme';
import {
  applyThemeSuggestionToTheme,
  analyzeThemeHarmony,
  contrastRatio,
  deriveAccentFromPrimary,
  detectVibe,
  suggestThemeFromPrompt,
} from '@/lib/builder/ai-generator/theme-suggestions';

describe('detectVibe', () => {
  it('matches "law firm" to professional', () => {
    expect(detectVibe('Korean law firm in Taiwan')).toBe('professional');
  });

  it('matches "playful kids" to playful', () => {
    expect(detectVibe('playful kids book store')).toBe('playful');
  });

  it('matches "luxury watch" to luxury', () => {
    expect(detectVibe('luxury watch brand')).toBe('luxury');
  });

  it('matches "modern saas" to modern', () => {
    expect(detectVibe('modern saas dashboard')).toBe('modern');
  });

  it('falls back to professional for ambiguous prompts', () => {
    expect(detectVibe('something generic')).toBe('professional');
  });

  it('respects multi-word keyword scores', () => {
    expect(detectVibe('a content-first site')).toBe('minimal');
  });
});

describe('suggestThemeFromPrompt', () => {
  it('returns the professional preset for empty input', () => {
    const result = suggestThemeFromPrompt('');
    expect(result.vibe).toBe('professional');
    expect(result.colors.primary).toBe('#1e3a8a');
  });

  it('returns warm preset for "warm rustic cafe"', () => {
    const result = suggestThemeFromPrompt('warm rustic cafe');
    expect(result.vibe).toBe('warm');
    expect(result.colors.primary).toBe('#c2410c');
    expect(result.fonts.heading).toContain('Merriweather');
  });

  it('returns rationale text', () => {
    const result = suggestThemeFromPrompt('luxury hotel');
    expect(result.rationale).toContain('gold');
  });

  it('suggests component style tokens with the palette', () => {
    const result = suggestThemeFromPrompt('luxury hotel');
    expect(result.radii).toEqual({ sm: 2, md: 6, lg: 12 });
    expect(result.effects).toEqual({ radiusPreset: 'medium', shadowPreset: 'strong' });
    expect(result.typographyScale).toEqual({ baseSize: 17, ratio: 1.333 });
  });

  it('applies a suggestion without dropping existing non-suggestion theme fields', () => {
    const current: BuilderTheme = {
      colors: {
        primary: '#111111',
        secondary: '#222222',
        accent: '#333333',
        background: '#ffffff',
        text: '#101010',
        muted: '#555555',
      },
      darkColors: {
        primary: '#dddddd',
        secondary: '#cccccc',
        accent: '#bbbbbb',
        background: '#000000',
        text: '#ffffff',
        muted: '#999999',
      },
      fonts: { heading: 'Old Heading', body: 'Old Body' },
      radii: { sm: 4, md: 8, lg: 16 },
      themeTextPresets: DEFAULT_THEME_TEXT_PRESETS,
    };
    const suggestion = suggestThemeFromPrompt('modern saas');
    const next = applyThemeSuggestionToTheme(current, suggestion);

    expect(next.colors).toEqual(suggestion.colors);
    expect(next.fonts).toEqual(suggestion.fonts);
    expect(next.radii).toEqual(suggestion.radii);
    expect(next.effects).toEqual(suggestion.effects);
    expect(next.typographyScale).toEqual(suggestion.typographyScale);
    expect(next.darkColors).toBe(current.darkColors);
    expect(next.themeTextPresets).toBe(current.themeTextPresets);
    expect(applyThemeSuggestionToTheme(next, suggestion)).toEqual(next);
  });
});

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('returns 1 for identical colors', () => {
    expect(contrastRatio('#888888', '#888888')).toBeCloseTo(1, 1);
  });

  it('returns 0 for invalid hex', () => {
    expect(contrastRatio('not-a-color', '#ffffff')).toBe(0);
  });
});

describe('analyzeThemeHarmony', () => {
  function theme(colors: Partial<BuilderTheme['colors']>): Pick<BuilderTheme, 'colors'> {
    return {
      colors: {
        primary: '#1e3a8a',
        secondary: '#1e293b',
        accent: '#0891b2',
        background: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
        ...colors,
      },
    };
  }

  it('reports no issues for the professional preset', () => {
    const issues = analyzeThemeHarmony(theme({}));
    expect(issues).toHaveLength(0);
  });

  it('flags low text-on-background contrast', () => {
    const issues = analyzeThemeHarmony(theme({ text: '#cccccc', background: '#ffffff' }));
    const contrastIssue = issues.find((i) => i.kind === 'text-on-background-contrast');
    expect(contrastIssue).toBeDefined();
    expect(contrastIssue?.severity).toBe('error');
  });

  it('flags primary blending into background', () => {
    const issues = analyzeThemeHarmony(theme({ primary: '#f0f0f0', background: '#ffffff' }));
    expect(issues.some((i) => i.kind === 'primary-on-background-contrast')).toBe(true);
  });

  it('flags muted too close to background', () => {
    const issues = analyzeThemeHarmony(theme({ muted: '#f5f5f5', background: '#ffffff' }));
    expect(issues.some((i) => i.kind === 'muted-too-close-to-background')).toBe(true);
  });
});

describe('deriveAccentFromPrimary', () => {
  it('returns a hex color', () => {
    const accent = deriveAccentFromPrimary('#1e3a8a');
    expect(accent).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('rotates the hue (different from primary)', () => {
    const primary = '#1e3a8a';
    expect(deriveAccentFromPrimary(primary)).not.toBe(primary);
  });

  it('falls back to a default accent for invalid primary', () => {
    expect(deriveAccentFromPrimary('not-a-color')).toBe('#7c3aed');
  });
});
