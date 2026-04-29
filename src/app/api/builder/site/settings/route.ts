import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { DEFAULT_THEME, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';
import {
  THEME_COLOR_TOKENS,
  THEME_TEXT_PRESET_KEYS,
  normalizeDarkColors,
  normalizeThemeTextPresets,
} from '@/lib/builder/site/theme';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

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
}).strict();

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

const themeColorsSchema = z.object({
  primary: z.string().trim().min(1).max(64),
  secondary: z.string().trim().min(1).max(64),
  accent: z.string().trim().min(1).max(64),
  text: z.string().trim().min(1).max(64),
  background: z.string().trim().min(1).max(64),
  muted: z.string().trim().min(1).max(64),
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
  themeTextPresets: z.object(
    Object.fromEntries(
      THEME_TEXT_PRESET_KEYS.map((key) => [key, themeTextPresetSchema]),
    ) as Record<(typeof THEME_TEXT_PRESET_KEYS)[number], typeof themeTextPresetSchema>,
  ).strict().optional(),
}).strict();

const settingsPayloadSchema = z.object({
  settings: siteSettingsSchema.optional(),
  theme: siteThemeSchema.optional(),
}).strict();

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: 'validation_error',
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function sanitizeSettings(settings?: BuilderSiteSettings): BuilderSiteSettings | undefined {
  if (!settings) return undefined;

  const nextSettings = Object.fromEntries(
    Object.entries(settings).filter(([, value]) => typeof value === 'string' && value.trim().length > 0),
  ) as BuilderSiteSettings;

  return Object.keys(nextSettings).length > 0 ? nextSettings : undefined;
}

function mergeTheme(theme?: Partial<BuilderTheme>): BuilderTheme {
  const colors = { ...DEFAULT_THEME.colors, ...theme?.colors };
  return {
    colors,
    darkColors: normalizeDarkColors(colors, theme?.darkColors),
    fonts: { ...DEFAULT_THEME.fonts, ...theme?.fonts },
    radii: { ...DEFAULT_THEME.radii, ...theme?.radii },
    themeTextPresets: normalizeThemeTextPresets(theme?.themeTextPresets),
  };
}

export async function GET(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);

    return NextResponse.json({
      ok: true,
      settings: site.settings ?? {},
      theme: mergeTheme(site.theme),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = settingsPayloadSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const now = new Date().toISOString();

    site.settings = payload.settings ? sanitizeSettings(payload.settings) : site.settings;
    site.theme = mergeTheme(payload.theme ?? site.theme);
    site.updatedAt = now;

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      settings: site.settings ?? {},
      theme: site.theme,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
