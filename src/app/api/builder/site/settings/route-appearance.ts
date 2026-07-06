import {
  normalizeHeaderFooterMobileConfig,
  normalizeMobileBottomBar,
} from '@/lib/builder/site/mobile-schema';
import {
  applyTypographyScaleToTheme,
  normalizeDarkColors,
  normalizeThemeEffects,
  normalizeThemeTextPresets,
  normalizeThemeTypographyScale,
} from '@/lib/builder/site/theme';
import {
  DEFAULT_THEME,
  type BuilderHeaderFooterConfig,
  type BuilderMobileBottomBar,
  type BuilderSiteSettings,
  type BuilderTheme,
  type DarkModeConfig,
} from '@/lib/builder/site/types';

export function normalizeDarkModeConfig(value?: DarkModeConfig): Required<DarkModeConfig> {
  const defaultMode = value?.defaultMode === 'dark' || value?.defaultMode === 'auto'
    ? value.defaultMode
    : 'light';
  return {
    defaultMode,
    allowVisitorToggle: value?.allowVisitorToggle !== false,
  };
}

export function mergeHeaderFooterMobileConfig(
  current: BuilderHeaderFooterConfig | undefined,
  patch: Partial<BuilderHeaderFooterConfig> | undefined,
): BuilderHeaderFooterConfig {
  return normalizeHeaderFooterMobileConfig({
    ...(current ?? {}),
    ...(patch ?? {}),
  });
}

export function mergeMobileBottomBarConfig(
  current: BuilderMobileBottomBar | undefined,
  patch: Partial<BuilderMobileBottomBar> | undefined,
  settings?: BuilderSiteSettings,
): BuilderMobileBottomBar {
  return normalizeMobileBottomBar({
    enabled: patch?.enabled ?? current?.enabled ?? false,
    actions: patch?.actions ?? current?.actions ?? [],
  }, settings);
}

export function mergeTheme(theme?: Partial<BuilderTheme>): BuilderTheme {
  const colors = { ...DEFAULT_THEME.colors, ...theme?.colors };
  return applyTypographyScaleToTheme({
    colors,
    darkColors: normalizeDarkColors(colors, theme?.darkColors),
    fonts: { ...DEFAULT_THEME.fonts, ...theme?.fonts },
    radii: { ...DEFAULT_THEME.radii, ...theme?.radii },
    themeTextPresets: normalizeThemeTextPresets(theme?.themeTextPresets),
    typographyScale: normalizeThemeTypographyScale(theme),
    effects: normalizeThemeEffects(theme),
  });
}
