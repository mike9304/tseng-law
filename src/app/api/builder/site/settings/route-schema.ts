import { z } from 'zod';
import { MOBILE_HAMBURGER_MODES } from '@/lib/builder/site/mobile-schema';
import { THEME_COLOR_TOKENS } from '@/lib/builder/site/theme';

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

const builderAssetIdSchema = z.string()
  .trim()
  .regex(/^(?:builder\/assets|\/api\/builder\/assets)\/(?:ko|en|zh-hant)\/[^/?#\\]+$/)
  .max(2000);

const brandKitAssetsSchema = z.object({
  logoLightAssetId: builderAssetIdSchema.optional(),
  logoDarkAssetId: builderAssetIdSchema.optional(),
  faviconAssetId: builderAssetIdSchema.optional(),
  ogImageAssetId: builderAssetIdSchema.optional(),
}).strict();

const brandCustomColorSchema = z.object({
  name: z.string().trim().min(1).max(40),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).max(7),
}).strict();

const brandSettingsSchema = z.object({
  customColors: z.array(brandCustomColorSchema).max(16).optional(),
}).strict();

const darkModeSchema = z.object({
  defaultMode: z.enum(['light', 'dark', 'auto']).optional(),
  allowVisitorToggle: z.boolean().optional(),
}).strict();

const headerFooterMobileSchema = z.object({
  mobileSticky: z.boolean().optional(),
  mobileHamburger: z.enum(MOBILE_HAMBURGER_MODES).optional(),
}).strict();

const mobileBottomBarActionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  label: z.string().trim().min(1).max(40),
  href: z.string().trim().min(1).max(500),
  kind: z.enum(['phone', 'booking', 'custom']),
}).strict();

const mobileBottomBarSchema = z.object({
  enabled: z.boolean().optional(),
  actions: z.array(mobileBottomBarActionSchema).max(3).optional(),
}).strict();

const siteSettingsSchema = z.object({
  firmName: optionalTrimmedString(200),
  phone: optionalTrimmedString(80),
  email: optionalTrimmedString(200),
  address: optionalTrimmedString(400),
  businessHours: optionalTrimmedString(200),
  businessRegNumber: optionalTrimmedString(120),
  logo: optionalTrimmedString(2000),
  logoDark: optionalTrimmedString(2000),
  favicon: optionalTrimmedString(2000),
  ogImage: optionalTrimmedString(2000),
  pageTransition: z.enum(['none', 'fade', 'slide-up', 'slide-left', 'scale']).optional(),
  pageTransitionDurationMs: z.number().int().min(80).max(3000).optional(),
  assets: brandKitAssetsSchema.optional(),
  brand: brandSettingsSchema.optional(),
  seoChecklist: z.object({
    businessName: optionalTrimmedString(200),
    keywords: z.array(z.string().trim().min(1).max(80)).max(5).optional(),
    serviceMode: z.enum(['physical', 'online', 'both']).optional(),
  }).strict().optional(),
}).passthrough();

const themeColorValueSchema = z.union([
  z.string().trim().min(1).max(2000),
  z.object({
    kind: z.literal('token').optional(),
    token: z.enum(THEME_COLOR_TOKENS),
  }).strict(),
]);

const themeTextPresetSchema = z.object({
  label: z.string().trim().min(1).max(80),
  fontFamily: z.string().trim().min(1).max(200),
  fontSize: z.number().int().min(12).max(160),
  fontWeight: z.enum(['regular', 'medium', 'bold']),
  lineHeight: z.number().min(0.5).max(4),
  letterSpacing: z.number().min(-2).max(10),
  color: themeColorValueSchema,
}).strict();

const themeTextPresetsSchema = z.object({
  title1: themeTextPresetSchema,
  title2: themeTextPresetSchema,
  title3: themeTextPresetSchema,
  body: themeTextPresetSchema,
  quote: themeTextPresetSchema,
}).strict();

const themeColorsSchema = z.object({
  primary: z.string().trim().min(1).max(64),
  secondary: z.string().trim().min(1).max(64),
  accent: z.string().trim().min(1).max(64),
  text: z.string().trim().min(1).max(64),
  background: z.string().trim().min(1).max(64),
  muted: z.string().trim().min(1).max(64),
}).strict();

const typographyScaleSchema = z.object({
  baseSize: z.number().int().min(10).max(28),
  ratio: z.union([
    z.literal(1.125),
    z.literal(1.2),
    z.literal(1.25),
    z.literal(1.333),
    z.literal(1.414),
    z.literal(1.5),
  ]),
}).strict();

const themeEffectsSchema = z.object({
  radiusPreset: z.enum(['sharp', 'medium', 'soft']).optional(),
  shadowPreset: z.enum(['none', 'soft', 'medium', 'strong']).optional(),
}).strict();

const siteThemeSchema = z.object({
  colors: themeColorsSchema,
  darkColors: themeColorsSchema.optional(),
  fonts: z.object({
    heading: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(200),
  }).strict(),
  radii: z.object({
    sm: z.number().int().min(0).max(64),
    md: z.number().int().min(0).max(64),
    lg: z.number().int().min(0).max(128),
  }).strict(),
  themeTextPresets: themeTextPresetsSchema.optional(),
  typographyScale: typographyScaleSchema.optional(),
  effects: themeEffectsSchema.optional(),
}).strict();

export const settingsPayloadSchema = z.object({
  settings: siteSettingsSchema.optional(),
  theme: siteThemeSchema.optional(),
  darkMode: darkModeSchema.optional(),
  headerFooter: headerFooterMobileSchema.optional(),
  mobileBottomBar: mobileBottomBarSchema.optional(),
}).strict();
