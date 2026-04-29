import type { BuilderTheme } from '@/lib/builder/site/types';

export const THEME_COLOR_TOKENS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
  'muted',
] as const;

export type ThemeColorToken = (typeof THEME_COLOR_TOKENS)[number];

export interface ThemeColorReference {
  kind?: 'token';
  token: ThemeColorToken;
}

export type BuilderColorValue = string | ThemeColorReference;

export const THEME_COLOR_LABELS: Record<ThemeColorToken, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  accent: 'Accent',
  background: 'Background',
  text: 'Text',
  muted: 'Muted',
};

const FALLBACK_THEME_COLORS: Record<ThemeColorToken, string> = {
  primary: '#123b63',
  secondary: '#1e5a96',
  accent: '#e8a838',
  background: '#ffffff',
  text: '#1f2937',
  muted: '#f3f4f6',
};

export const THEME_TEXT_PRESET_KEYS = [
  'title1',
  'title2',
  'title3',
  'body',
  'quote',
] as const;

export type ThemeTextPresetKey = (typeof THEME_TEXT_PRESET_KEYS)[number];
export type BuilderFontWeight = 'regular' | 'medium' | 'bold';

export interface ThemeTextPreset {
  label: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: BuilderFontWeight;
  lineHeight: number;
  letterSpacing: number;
  color: BuilderColorValue;
}

export type ThemeTextPresets = Record<ThemeTextPresetKey, ThemeTextPreset>;

export const DEFAULT_THEME_TEXT_PRESETS: ThemeTextPresets = {
  title1: {
    label: 'Title 1',
    fontFamily: 'system-ui',
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 1.05,
    letterSpacing: -0.5,
    color: { kind: 'token', token: 'text' },
  },
  title2: {
    label: 'Title 2',
    fontFamily: 'system-ui',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 1.12,
    letterSpacing: -0.2,
    color: { kind: 'token', token: 'text' },
  },
  title3: {
    label: 'Title 3',
    fontFamily: 'system-ui',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 1.18,
    letterSpacing: 0,
    color: { kind: 'token', token: 'text' },
  },
  body: {
    label: 'Body',
    fontFamily: 'system-ui',
    fontSize: 16,
    fontWeight: 'regular',
    lineHeight: 1.55,
    letterSpacing: 0,
    color: { kind: 'token', token: 'text' },
  },
  quote: {
    label: 'Quote',
    fontFamily: 'system-ui',
    fontSize: 22,
    fontWeight: 'medium',
    lineHeight: 1.45,
    letterSpacing: 0,
    color: { kind: 'token', token: 'secondary' },
  },
};

export function isThemeColorReference(value: unknown): value is ThemeColorReference {
  if (!value || typeof value !== 'object') return false;
  const token = (value as { token?: unknown }).token;
  return typeof token === 'string' && THEME_COLOR_TOKENS.includes(token as ThemeColorToken);
}

export function resolveThemeColor(
  value: BuilderColorValue | undefined,
  theme?: BuilderTheme,
): string {
  if (!value) return 'transparent';
  if (isThemeColorReference(value)) {
    return theme?.colors[value.token] ?? FALLBACK_THEME_COLORS[value.token];
  }
  return value;
}

export function normalizeThemeTextPresets(
  presets?: Partial<Record<ThemeTextPresetKey, Partial<ThemeTextPreset>>>,
): ThemeTextPresets {
  const next = { ...DEFAULT_THEME_TEXT_PRESETS };
  for (const key of THEME_TEXT_PRESET_KEYS) {
    next[key] = {
      ...DEFAULT_THEME_TEXT_PRESETS[key],
      ...(presets?.[key] ?? {}),
    };
  }
  return next;
}

export function getThemeTextPresets(theme?: BuilderTheme): ThemeTextPresets {
  return normalizeThemeTextPresets(theme?.themeTextPresets);
}

export function getThemeTextPreset(
  theme: BuilderTheme | undefined,
  key: ThemeTextPresetKey | undefined,
): ThemeTextPreset | null {
  if (!key) return null;
  return getThemeTextPresets(theme)[key] ?? null;
}

export function createThemeTextPresetPatch(
  key: ThemeTextPresetKey,
  theme: BuilderTheme,
): Record<string, unknown> {
  const preset = getThemeTextPresets(theme)[key];
  return {
    themePreset: key,
    fontFamily: preset.fontFamily,
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    lineHeight: preset.lineHeight,
    letterSpacing: preset.letterSpacing,
    color: preset.color,
  };
}

export function resolveThemeTextTypography(
  content: {
    themePreset?: ThemeTextPresetKey;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: BuilderFontWeight;
    lineHeight?: number;
    letterSpacing?: number;
    color?: BuilderColorValue;
  },
  theme?: BuilderTheme,
) {
  const preset = getThemeTextPreset(theme, content.themePreset);
  return {
    fontFamily: preset?.fontFamily ?? content.fontFamily ?? 'system-ui',
    fontSize: preset?.fontSize ?? content.fontSize ?? 16,
    fontWeight: preset?.fontWeight ?? content.fontWeight ?? 'regular',
    lineHeight: preset?.lineHeight ?? content.lineHeight ?? 1.25,
    letterSpacing: preset?.letterSpacing ?? content.letterSpacing ?? 0,
    color: preset?.color ?? content.color ?? '#0f172a',
  };
}

export function collectThemeFontFamilies(theme: BuilderTheme): string[] {
  const presets = getThemeTextPresets(theme);
  return [
    theme.fonts.heading,
    theme.fonts.body,
    ...THEME_TEXT_PRESET_KEYS.map((key) => presets[key].fontFamily),
  ].filter((family): family is string => typeof family === 'string' && family.trim().length > 0);
}
