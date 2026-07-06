/**
 * F89 — Style/theme suggestions (pure heuristic engine).
 *
 * Given a brand prompt (or the current theme), returns suggested theme
 * tokens (primary/secondary/accent/background/text/muted) that respect
 * legibility heuristics and a small palette library. No LLM call needed
 * for the first slice — pure rule engine matching a brand vibe to a
 * preset palette plus deterministic accent derivation.
 *
 * Three operation modes:
 * 1. `suggestThemeFromPrompt(prompt)`: matches brand keywords (modern,
 *    warm, professional, playful, luxury, minimal) to a preset palette.
 * 2. `analyzeThemeHarmony(theme)`: scans the current theme and reports
 *    contrast issues (WCAG AA failures for text on background).
 * 3. `deriveAccentFromPrimary(primary)`: HSL rotation helper used as a
 *    fallback when only a primary color is supplied.
 */

import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  contrastRatio as calculateContrastRatio,
  hslToRgb,
  parseHexColor,
  rgbToHex,
  rgbToHsl,
} from '@/lib/builder/ai-generator/theme-color-utils';
import {
  THEME_SUGGESTION_PRESETS,
  VIBE_KEYWORDS,
} from '@/lib/builder/ai-generator/theme-suggestion-presets';
import type {
  ThemeHarmonyIssue,
  ThemeSuggestion,
  ThemeVibe,
} from '@/lib/builder/ai-generator/theme-suggestion-types';

export type {
  ThemeHarmonyIssue,
  ThemeSuggestion,
  ThemeSuggestionRadiusPreset,
  ThemeSuggestionShadowPreset,
  ThemeVibe,
} from '@/lib/builder/ai-generator/theme-suggestion-types';
export { applyThemeSuggestionToTheme } from '@/lib/builder/ai-generator/theme-suggestion-application';

const THEME_VIBES: readonly ThemeVibe[] = [
  'modern',
  'warm',
  'professional',
  'playful',
  'luxury',
  'minimal',
];

export function detectVibe(prompt: string): ThemeVibe {
  const lower = prompt.toLowerCase();
  let best: { vibe: ThemeVibe; score: number } = { vibe: 'professional', score: 0 };
  for (const vibe of THEME_VIBES) {
    let score = 0;
    for (const keyword of VIBE_KEYWORDS[vibe]) {
      if (lower.includes(keyword)) score += keyword.split(' ').length;
    }
    if (score > best.score) {
      best = { vibe, score };
    }
  }
  return best.vibe;
}

export function suggestThemeFromPrompt(prompt: string): ThemeSuggestion {
  const trimmed = (prompt ?? '').trim();
  if (!trimmed) {
    const preset = THEME_SUGGESTION_PRESETS.professional;
    return {
      vibe: 'professional',
      ...preset,
    };
  }
  const vibe = detectVibe(trimmed);
  const preset = THEME_SUGGESTION_PRESETS[vibe];
  return {
    vibe,
    ...preset,
  };
}

export function contrastRatio(fg: string, bg: string): number {
  return calculateContrastRatio(fg, bg);
}

export function analyzeThemeHarmony(theme: Pick<BuilderTheme, 'colors'>): ThemeHarmonyIssue[] {
  const issues: ThemeHarmonyIssue[] = [];
  const colors = theme.colors;
  const textVsBg = contrastRatio(colors.text, colors.background);
  if (textVsBg < 4.5) {
    issues.push({
      severity: textVsBg < 3 ? 'error' : 'warning',
      kind: 'text-on-background-contrast',
      message: `Text color (${colors.text}) on background (${colors.background}) has contrast ratio ${textVsBg.toFixed(2)}:1, below WCAG AA 4.5:1.`,
      affected: ['text', 'background'],
    });
  }
  const primaryVsBg = contrastRatio(colors.primary, colors.background);
  if (primaryVsBg < 3) {
    issues.push({
      severity: 'warning',
      kind: 'primary-on-background-contrast',
      message: `Primary color (${colors.primary}) blends into background (${colors.background}) — contrast ${primaryVsBg.toFixed(2)}:1 is below the 3:1 UI element threshold.`,
      affected: ['primary', 'background'],
    });
  }
  const mutedVsBg = contrastRatio(colors.muted, colors.background);
  if (mutedVsBg < 2) {
    issues.push({
      severity: 'warning',
      kind: 'muted-too-close-to-background',
      message: `Muted color (${colors.muted}) is too close to background (${colors.background}) — secondary text will be hard to read.`,
      affected: ['muted', 'background'],
    });
  }
  return issues;
}

/**
 * Rotate the primary color's hue by 150° (complementary-adjacent) to
 * derive an accent that contrasts but stays in the same lightness band.
 */
export function deriveAccentFromPrimary(primary: string): string {
  const rgb = parseHexColor(primary);
  if (!rgb) return '#7c3aed';
  const hsl = rgbToHsl(rgb);
  const rotated = hslToRgb(hsl.h + 150, hsl.s, hsl.l);
  return rgbToHex(rotated);
}
