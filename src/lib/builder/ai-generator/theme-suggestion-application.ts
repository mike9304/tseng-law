import type { BuilderTheme } from '@/lib/builder/site/types';
import type { ThemeSuggestion } from '@/lib/builder/ai-generator/theme-suggestion-types';

export function applyThemeSuggestionToTheme(
  current: BuilderTheme,
  suggestion: ThemeSuggestion,
): BuilderTheme {
  return {
    ...current,
    colors: suggestion.colors,
    fonts: suggestion.fonts,
    radii: suggestion.radii,
    effects: suggestion.effects,
    typographyScale: suggestion.typographyScale,
  };
}
