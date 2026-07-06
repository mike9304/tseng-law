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
  fonts: BuilderTheme['fonts'];
  radii: BuilderTheme['radii'];
  effects: ThemeSuggestionEffects;
  typographyScale: NonNullable<BuilderTheme['typographyScale']>;
}

export type ThemeSuggestionPreset = Omit<ThemeSuggestion, 'vibe'>;

export type ThemeSuggestionRadiusPreset = 'sharp' | 'medium' | 'soft';
export type ThemeSuggestionShadowPreset = 'none' | 'soft' | 'medium' | 'strong';

export interface ThemeSuggestionEffects {
  radiusPreset: ThemeSuggestionRadiusPreset;
  shadowPreset: ThemeSuggestionShadowPreset;
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
