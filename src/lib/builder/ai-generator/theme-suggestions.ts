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

import type { BuilderTheme, BuilderThemeColors } from '@/lib/builder/site/types';

export type ThemeVibe =
  | 'modern'
  | 'warm'
  | 'professional'
  | 'playful'
  | 'luxury'
  | 'minimal';

export interface ThemeSuggestion {
  vibe: ThemeVibe;
  rationale: string;
  colors: BuilderThemeColors;
  fonts: { heading: string; body: string };
}

export interface ThemeHarmonyIssue {
  severity: 'warning' | 'error';
  kind:
    | 'text-on-background-contrast'
    | 'primary-on-background-contrast'
    | 'muted-too-close-to-background';
  message: string;
  affected: string[];
}

const PRESETS: Record<ThemeVibe, { rationale: string; colors: BuilderThemeColors; fonts: { heading: string; body: string } }> = {
  modern: {
    rationale: 'Sharp blue primary with neutral grays for a contemporary tech feel.',
    colors: {
      primary: '#2563eb',
      secondary: '#0f172a',
      accent: '#7c3aed',
      background: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
    },
    fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
  },
  warm: {
    rationale: 'Earthy ochre and terracotta tones for an approachable, human feel.',
    colors: {
      primary: '#c2410c',
      secondary: '#7c2d12',
      accent: '#f59e0b',
      background: '#fffbeb',
      text: '#1c1917',
      muted: '#78716c',
    },
    fonts: { heading: 'Merriweather, Georgia, serif', body: 'Source Sans Pro, system-ui, sans-serif' },
  },
  professional: {
    rationale: 'Conservative navy primary with refined grays — suits legal/finance brands.',
    colors: {
      primary: '#1e3a8a',
      secondary: '#1e293b',
      accent: '#0891b2',
      background: '#f8fafc',
      text: '#0f172a',
      muted: '#475569',
    },
    fonts: { heading: 'Playfair Display, Georgia, serif', body: 'Source Sans Pro, system-ui, sans-serif' },
  },
  playful: {
    rationale: 'Vibrant pink + violet with sunny accent — friendly and energetic.',
    colors: {
      primary: '#db2777',
      secondary: '#7c3aed',
      accent: '#facc15',
      background: '#fdf4ff',
      text: '#1e1b4b',
      muted: '#a855f7',
    },
    fonts: { heading: 'Poppins, system-ui, sans-serif', body: 'Poppins, system-ui, sans-serif' },
  },
  luxury: {
    rationale: 'Deep charcoal background with gold accent for premium positioning.',
    colors: {
      primary: '#a16207',
      secondary: '#78350f',
      accent: '#fbbf24',
      background: '#18181b',
      text: '#fafafa',
      muted: '#a1a1aa',
    },
    fonts: { heading: 'Playfair Display, serif', body: 'Lato, system-ui, sans-serif' },
  },
  minimal: {
    rationale: 'Strict monochrome with single accent — content-first design.',
    colors: {
      primary: '#0a0a0a',
      secondary: '#404040',
      accent: '#16a34a',
      background: '#ffffff',
      text: '#0a0a0a',
      muted: '#737373',
    },
    fonts: { heading: 'IBM Plex Sans, system-ui, sans-serif', body: 'IBM Plex Sans, system-ui, sans-serif' },
  },
};

const VIBE_KEYWORDS: Record<ThemeVibe, string[]> = {
  modern: ['modern', 'tech', 'startup', 'sleek', 'minimalist tech', 'saas'],
  warm: ['warm', 'cozy', 'rustic', 'earthy', 'natural', 'organic'],
  professional: ['professional', 'law', 'legal', 'finance', 'corporate', 'conservative', 'trustworthy', 'enterprise'],
  playful: ['playful', 'fun', 'kids', 'creative', 'vibrant', 'energetic'],
  luxury: ['luxury', 'premium', 'high-end', 'exclusive', 'elegant', 'sophisticated'],
  minimal: ['minimal', 'simple', 'clean', 'plain', 'content-first'],
};

export function detectVibe(prompt: string): ThemeVibe {
  const lower = prompt.toLowerCase();
  let best: { vibe: ThemeVibe; score: number } = { vibe: 'professional', score: 0 };
  for (const [vibe, keywords] of Object.entries(VIBE_KEYWORDS) as Array<[ThemeVibe, string[]]>) {
    let score = 0;
    for (const keyword of keywords) {
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
    return {
      vibe: 'professional',
      rationale: PRESETS.professional.rationale,
      colors: PRESETS.professional.colors,
      fonts: PRESETS.professional.fonts,
    };
  }
  const vibe = detectVibe(trimmed);
  return {
    vibe,
    rationale: PRESETS[vibe].rationale,
    colors: PRESETS[vibe].colors,
    fonts: PRESETS[vibe].fonts,
  };
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = match[1];
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const channel = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  if (!fgRgb || !bgRgb) return 0;
  const l1 = relativeLuminance(fgRgb);
  const l2 = relativeLuminance(bgRgb);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
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

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      default:
        h = (rNorm - gNorm) / d + 4;
    }
    h *= 60;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hPrime = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hPrime % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hPrime < 1) [r1, g1, b1] = [c, x, 0];
  else if (hPrime < 2) [r1, g1, b1] = [x, c, 0];
  else if (hPrime < 3) [r1, g1, b1] = [0, c, x];
  else if (hPrime < 4) [r1, g1, b1] = [0, x, c];
  else if (hPrime < 5) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  const m = l - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Rotate the primary color's hue by 150° (complementary-adjacent) to
 * derive an accent that contrasts but stays in the same lightness band.
 */
export function deriveAccentFromPrimary(primary: string): string {
  const rgb = parseHex(primary);
  if (!rgb) return '#7c3aed';
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rotated = hslToRgb(hsl.h + 150, hsl.s, hsl.l);
  return rgbToHex(rotated);
}
