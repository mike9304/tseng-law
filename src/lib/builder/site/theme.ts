import type {
  BrandKitAssets,
  BuilderSiteSettings,
  BuilderTheme,
  BuilderThemeColors,
} from '@/lib/builder/site/types';

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

export type BackgroundImagePosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export interface BuilderGradientBackground {
  kind: 'gradient';
  type: 'linear' | 'radial';
  angle: number;
  stops: Array<{
    color: BuilderColorValue;
    position: number;
  }>;
}

export interface BuilderImageBackground {
  kind: 'image';
  src: string;
  size: 'cover' | 'contain' | 'auto';
  position: BackgroundImagePosition;
  repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  overlayColor?: BuilderColorValue;
  overlayOpacity?: number;
}

export type BuilderBackgroundValue =
  | BuilderColorValue
  | BuilderGradientBackground
  | BuilderImageBackground;

export interface ResolvedBackgroundStyle {
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
}

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

export const DEFAULT_DARK_THEME_COLORS: BuilderThemeColors = {
  primary: '#7dd3fc',
  secondary: '#93c5fd',
  accent: '#fbbf24',
  background: '#0f172a',
  text: '#f8fafc',
  muted: '#1e293b',
};

export type ThemeColorMode = 'light' | 'dark' | 'css-var';

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

export interface SiteThemePreset {
  key: 'modern' | 'classic' | 'bold' | 'minimal' | 'editorial';
  name: string;
  description: string;
  colors: BuilderTheme['colors'];
  fonts: { title: string; body: string };
  radiusScale: number;
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  textPresets: ThemeTextPresets;
}

function createPresetTextPresets(
  titleFont: string,
  bodyFont: string,
  color: BuilderColorValue = { kind: 'token', token: 'text' },
  accentColor: BuilderColorValue = { kind: 'token', token: 'secondary' },
): ThemeTextPresets {
  return {
    title1: {
      ...DEFAULT_THEME_TEXT_PRESETS.title1,
      fontFamily: titleFont,
      fontSize: 54,
      color,
    },
    title2: {
      ...DEFAULT_THEME_TEXT_PRESETS.title2,
      fontFamily: titleFont,
      fontSize: 40,
      color,
    },
    title3: {
      ...DEFAULT_THEME_TEXT_PRESETS.title3,
      fontFamily: titleFont,
      fontSize: 29,
      color,
    },
    body: {
      ...DEFAULT_THEME_TEXT_PRESETS.body,
      fontFamily: bodyFont,
      color,
    },
    quote: {
      ...DEFAULT_THEME_TEXT_PRESETS.quote,
      fontFamily: titleFont,
      color: accentColor,
    },
  };
}

export const SITE_THEME_PRESETS: SiteThemePreset[] = [
  {
    key: 'modern',
    name: 'Modern',
    description: 'Clean UI palette with a blue accent and medium radius.',
    colors: {
      primary: '#2563eb',
      secondary: '#0f766e',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#111827',
      muted: '#eef2ff',
    },
    fonts: { title: 'Inter', body: 'Inter' },
    radiusScale: 12,
    shadowIntensity: 'medium',
    textPresets: createPresetTextPresets('Inter', 'Inter'),
  },
  {
    key: 'classic',
    name: 'Classic',
    description: 'Serif-led legal tone with restrained beige and dark green.',
    colors: {
      primary: '#214236',
      secondary: '#6b5f4a',
      accent: '#b88a44',
      background: '#fbf7ef',
      text: '#1f2933',
      muted: '#efe6d8',
    },
    fonts: { title: 'Playfair Display', body: 'Source Serif 4' },
    radiusScale: 4,
    shadowIntensity: 'subtle',
    textPresets: createPresetTextPresets('Playfair Display', 'Source Serif 4'),
  },
  {
    key: 'bold',
    name: 'Bold',
    description: 'High contrast black, white, and red with sharp geometry.',
    colors: {
      primary: '#0b0b0f',
      secondary: '#27272a',
      accent: '#dc2626',
      background: '#ffffff',
      text: '#09090b',
      muted: '#f4f4f5',
    },
    fonts: { title: 'Bebas Neue', body: 'Inter' },
    radiusScale: 0,
    shadowIntensity: 'strong',
    textPresets: createPresetTextPresets(
      'Bebas Neue',
      'Inter',
      { kind: 'token', token: 'text' },
      { kind: 'token', token: 'accent' },
    ),
  },
  {
    key: 'minimal',
    name: 'Minimal',
    description: 'Neutral grayscale system with no visual noise.',
    colors: {
      primary: '#18181b',
      secondary: '#52525b',
      accent: '#71717a',
      background: '#ffffff',
      text: '#18181b',
      muted: '#f4f4f5',
    },
    fonts: { title: 'Inter', body: 'Inter' },
    radiusScale: 6,
    shadowIntensity: 'none',
    textPresets: createPresetTextPresets('Inter', 'Inter'),
  },
  {
    key: 'editorial',
    name: 'Editorial',
    description: 'Magazine-like serif titles with charcoal and warm paper tones.',
    colors: {
      primary: '#292524',
      secondary: '#57534e',
      accent: '#a16207',
      background: '#faf7f0',
      text: '#1c1917',
      muted: '#ede7da',
    },
    fonts: { title: 'Cormorant Garamond', body: 'Inter' },
    radiusScale: 2,
    shadowIntensity: 'subtle',
    textPresets: createPresetTextPresets('Cormorant Garamond', 'Inter'),
  },
];

export function isThemeColorReference(value: unknown): value is ThemeColorReference {
  if (!value || typeof value !== 'object') return false;
  const token = (value as { token?: unknown }).token;
  return typeof token === 'string' && THEME_COLOR_TOKENS.includes(token as ThemeColorToken);
}

export function isGradientBackgroundValue(value: unknown): value is BuilderGradientBackground {
  return Boolean(value && typeof value === 'object' && (value as { kind?: unknown }).kind === 'gradient');
}

export function isImageBackgroundValue(value: unknown): value is BuilderImageBackground {
  return Boolean(value && typeof value === 'object' && (value as { kind?: unknown }).kind === 'image');
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseHexColor(value: string): [number, number, number] | null {
  const normalized = value.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return [
    Number.parseInt(normalized.slice(0, 2), 16),
    Number.parseInt(normalized.slice(2, 4), 16),
    Number.parseInt(normalized.slice(4, 6), 16),
  ];
}

function toHexColor(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, '0'))
    .join('')}`;
}

function mixHexColor(left: string, right: string, leftWeight: number): string {
  const leftRgb = parseHexColor(left);
  const rightRgb = parseHexColor(right);
  if (!leftRgb || !rightRgb) return left;
  const weight = Math.max(0, Math.min(1, leftWeight));
  return toHexColor(
    leftRgb[0] * weight + rightRgb[0] * (1 - weight),
    leftRgb[1] * weight + rightRgb[1] * (1 - weight),
    leftRgb[2] * weight + rightRgb[2] * (1 - weight),
  );
}

export function createDarkColorsFromLight(colors: Partial<BuilderThemeColors> = {}): BuilderThemeColors {
  const light = { ...FALLBACK_THEME_COLORS, ...colors };
  return {
    primary: mixHexColor(light.primary, '#ffffff', 0.38),
    secondary: mixHexColor(light.secondary, '#ffffff', 0.34),
    accent: mixHexColor(light.accent, '#ffffff', 0.48),
    background: mixHexColor(light.text, '#020617', 0.18),
    text: mixHexColor(light.background, '#ffffff', 0.22),
    muted: mixHexColor(light.text, '#111827', 0.24),
  };
}

export function normalizeDarkColors(
  colors: BuilderThemeColors,
  darkColors?: Partial<BuilderThemeColors>,
): BuilderThemeColors {
  return {
    ...createDarkColorsFromLight(colors),
    ...darkColors,
  };
}

export function resolveThemeColor(
  value: BuilderColorValue | undefined,
  theme?: BuilderTheme,
  mode: ThemeColorMode = 'light',
): string {
  if (!value) return 'transparent';
  if (isThemeColorReference(value)) {
    if (mode === 'css-var') {
      const fallback = theme?.colors[value.token] ?? FALLBACK_THEME_COLORS[value.token];
      return `var(--builder-color-${value.token}, ${fallback})`;
    }
    if (mode === 'dark') {
      return theme?.darkColors?.[value.token]
        ?? createDarkColorsFromLight(theme?.colors)[value.token]
        ?? DEFAULT_DARK_THEME_COLORS[value.token];
    }
    return theme?.colors[value.token] ?? FALLBACK_THEME_COLORS[value.token];
  }
  return value;
}

function positionToCss(position: BackgroundImagePosition): string {
  switch (position) {
    case 'top-left':
      return 'top left';
    case 'top-right':
      return 'top right';
    case 'bottom-left':
      return 'bottom left';
    case 'bottom-right':
      return 'bottom right';
    default:
      return position;
  }
}

function gradientToCss(
  value: BuilderGradientBackground,
  theme?: BuilderTheme,
  mode: ThemeColorMode = 'light',
): string {
  const stops = [...value.stops]
    .sort((left, right) => left.position - right.position)
    .map((stop) => `${resolveThemeColor(stop.color, theme, mode)} ${stop.position}%`)
    .join(', ');
  if (value.type === 'radial') return `radial-gradient(circle, ${stops})`;
  return `linear-gradient(${value.angle}deg, ${stops})`;
}

function cssUrl(src: string): string {
  return `url("${src.replace(/"/g, '%22')}")`;
}

export function resolveBackgroundStyle(
  value: BuilderBackgroundValue | undefined,
  theme?: BuilderTheme,
  mode: ThemeColorMode = 'light',
): ResolvedBackgroundStyle {
  if (!value) return { background: 'transparent' };
  if (isGradientBackgroundValue(value)) {
    return { background: gradientToCss(value, theme, mode) };
  }
  if (isImageBackgroundValue(value)) {
    const image = cssUrl(value.src);
    if (!value.overlayColor || !value.overlayOpacity) {
      return {
        backgroundImage: image,
        backgroundSize: value.size,
        backgroundPosition: positionToCss(value.position),
        backgroundRepeat: value.repeat,
      };
    }

    const overlayOpacity = Math.max(0, Math.min(100, value.overlayOpacity));
    const overlayColor = resolveThemeColor(value.overlayColor, theme, mode);
    const overlay = `linear-gradient(color-mix(in srgb, ${overlayColor} ${overlayOpacity}%, transparent), color-mix(in srgb, ${overlayColor} ${overlayOpacity}%, transparent))`;
    return {
      backgroundImage: `${overlay}, ${image}`,
      backgroundSize: `100% 100%, ${value.size}`,
      backgroundPosition: `center, ${positionToCss(value.position)}`,
      backgroundRepeat: `no-repeat, ${value.repeat}`,
    };
  }
  return { background: resolveThemeColor(value, theme, mode) };
}

export function buildHoverTransform(
  hover: { scale?: number; translateY?: number } | undefined,
  baseTransform = '',
): string | undefined {
  if (!hover) return undefined;
  const transforms = [baseTransform].filter(Boolean);
  if (hover.scale && hover.scale !== 1) transforms.push(`scale(${hover.scale})`);
  if (hover.translateY) transforms.push(`translateY(${hover.translateY}px)`);
  return transforms.length > 0 ? transforms.join(' ') : undefined;
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

export interface BrandKit {
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
  ogImage?: string;
  assets?: BrandKitAssets;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: { title: string; body: string };
  radiusScale: number;
  metadata?: { exportedAt: string; siteName?: string };
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeBrandKitAssets(value: unknown, fallback?: BrandKitAssets): BrandKitAssets | undefined {
  if (!value || typeof value !== 'object') return fallback;
  const source = value as Record<string, unknown>;
  const assets: BrandKitAssets = {
    logoLightAssetId: optionalString(source.logoLightAssetId),
    logoDarkAssetId: optionalString(source.logoDarkAssetId),
    faviconAssetId: optionalString(source.faviconAssetId),
    ogImageAssetId: optionalString(source.ogImageAssetId),
  };
  return Object.values(assets).some(Boolean) ? assets : undefined;
}

function normalizeRadiusScale(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.min(64, Math.round(value)));
}

export function createBrandKitFromTheme(
  theme?: BuilderTheme,
  settings?: Partial<BuilderSiteSettings>,
  siteName?: string,
): BrandKit {
  const colors = { ...FALLBACK_THEME_COLORS, ...theme?.colors };
  const radiusScale = theme?.radii?.md ?? 8;
  return {
    logoLight: settings?.logo,
    logoDark: settings?.logoDark,
    favicon: settings?.favicon,
    ogImage: settings?.ogImage,
    assets: settings?.assets,
    colors: {
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      background: colors.background,
      text: colors.text,
    },
    fonts: {
      title: theme?.fonts.heading ?? 'system-ui, sans-serif',
      body: theme?.fonts.body ?? 'system-ui, sans-serif',
    },
    radiusScale,
    metadata: {
      exportedAt: new Date().toISOString(),
      siteName,
    },
  };
}

export function normalizeBrandKit(value: unknown, fallback?: BrandKit): BrandKit {
  const source = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const colors = source.colors && typeof source.colors === 'object'
    ? source.colors as Record<string, unknown>
    : {};
  const fonts = source.fonts && typeof source.fonts === 'object'
    ? source.fonts as Record<string, unknown>
    : {};
  const fallbackKit = fallback ?? createBrandKitFromTheme();

  return {
    logoLight: optionalString(source.logoLight) ?? fallbackKit.logoLight,
    logoDark: optionalString(source.logoDark) ?? fallbackKit.logoDark,
    favicon: optionalString(source.favicon) ?? fallbackKit.favicon,
    ogImage: optionalString(source.ogImage) ?? fallbackKit.ogImage,
    assets: normalizeBrandKitAssets(source.assets, fallbackKit.assets),
    colors: {
      primary: safeString(colors.primary, fallbackKit.colors.primary),
      secondary: safeString(colors.secondary, fallbackKit.colors.secondary),
      accent: safeString(colors.accent, fallbackKit.colors.accent),
      background: safeString(colors.background, fallbackKit.colors.background),
      text: safeString(colors.text, fallbackKit.colors.text),
    },
    fonts: {
      title: safeString(fonts.title, fallbackKit.fonts.title),
      body: safeString(fonts.body, fallbackKit.fonts.body),
    },
    radiusScale: normalizeRadiusScale(source.radiusScale, fallbackKit.radiusScale),
    metadata: {
      exportedAt: new Date().toISOString(),
      siteName: typeof (source.metadata as { siteName?: unknown } | undefined)?.siteName === 'string'
        ? (source.metadata as { siteName: string }).siteName
        : fallbackKit.metadata?.siteName,
    },
  };
}

export function resolveBuilderBrandAssetUrl(assetId: string | null | undefined): string | null {
  if (!assetId) return null;
  const trimmed = assetId.trim();
  if (!trimmed) return null;
  if (/^\/api\/builder\/assets\/(?:ko|en|zh-hant)\/[^/?#\\]+$/i.test(trimmed)) {
    return trimmed;
  }
  const match = /^builder\/assets\/(ko|en|zh-hant)\/([^/?#\\]+)$/i.exec(trimmed);
  if (match) {
    return `/api/builder/assets/${match[1]}/${match[2]}`;
  }
  return null;
}

export function resolveBrandLogo(
  brand: Pick<BrandKit, 'logoLight' | 'logoDark' | 'assets'> | null | undefined,
  mode: 'light' | 'dark',
  getAssetUrl: (id: string) => string | null = resolveBuilderBrandAssetUrl,
): string | null {
  if (!brand) return null;
  const id = mode === 'dark' ? brand.assets?.logoDarkAssetId : brand.assets?.logoLightAssetId;
  if (id) {
    const url = getAssetUrl(id);
    if (url) return url;
  }
  return mode === 'dark' ? (brand.logoDark ?? null) : (brand.logoLight ?? null);
}

export function createThemeFromBrandKit(
  kit: BrandKit,
  baseTheme?: BuilderTheme,
): BuilderTheme {
  const radius = normalizeRadiusScale(kit.radiusScale, baseTheme?.radii.md ?? 8);
  const colors: BuilderThemeColors = {
    primary: kit.colors.primary,
    secondary: kit.colors.secondary,
    accent: kit.colors.accent,
    background: kit.colors.background,
    text: kit.colors.text,
    muted: baseTheme?.colors.muted ?? mixHexColor(kit.colors.background, kit.colors.text, 0.92),
  };
  const titleFont = kit.fonts.title;
  const bodyFont = kit.fonts.body;

  return {
    colors,
    darkColors: normalizeDarkColors(colors, baseTheme?.darkColors),
    fonts: {
      heading: titleFont,
      body: bodyFont,
    },
    radii: {
      sm: Math.max(0, Math.round(radius * 0.5)),
      md: radius,
      lg: Math.max(radius, Math.round(radius * 1.5)),
    },
    themeTextPresets: normalizeThemeTextPresets({
      ...baseTheme?.themeTextPresets,
      title1: { fontFamily: titleFont, color: { kind: 'token', token: 'text' } },
      title2: { fontFamily: titleFont, color: { kind: 'token', token: 'text' } },
      title3: { fontFamily: titleFont, color: { kind: 'token', token: 'text' } },
      body: { fontFamily: bodyFont, color: { kind: 'token', token: 'text' } },
      quote: { fontFamily: titleFont, color: { kind: 'token', token: 'secondary' } },
    }),
  };
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
