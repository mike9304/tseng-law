import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import {
  createBrandKitFromTheme,
  createThemeFromBrandKit,
  normalizeBrandKit,
  sanitizeBrandSettings,
} from '@/lib/builder/site/theme';
import { normalizeLocale } from '@/lib/locales';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationErrorResponse(locale: ReturnType<typeof normalizeLocale>, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, 'validation_error'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

const BRAND_ASSET_ID_KEYS = [
  'logoLightAssetId',
  'logoDarkAssetId',
  'faviconAssetId',
  'ogImageAssetId',
] as const;

function validateBrandAssetIds(source: unknown): string[] {
  if (!source || typeof source !== 'object') return [];
  const assets = (source as { assets?: unknown }).assets;
  if (!assets || typeof assets !== 'object') return [];

  const issues: string[] = [];
  for (const key of BRAND_ASSET_ID_KEYS) {
    const value = (assets as Record<string, unknown>)[key];
    if (value === undefined || value === null || value === '') continue;
    if (
      typeof value !== 'string'
      || !/^(?:builder\/assets|\/api\/builder\/assets)\/(?:ko|en|zh-hant)\/[^/?#\\]+$/i.test(value.trim())
    ) {
      issues.push(`assets.${key}`);
    }
  }
  return issues;
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const site = await readSiteDocument('default', locale);
    const settings = resolveBuilderSiteSettings(site.settings, locale);

    return NextResponse.json({
      ok: true,
      brandKit: createBrandKitFromTheme(site.theme, settings, settings?.firmName || site.name),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    return errorResponse(locale, 'brand_kit_load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const site = await readSiteDocument('default', locale);
    const settings = resolveBuilderSiteSettings(site.settings, locale);
    const body = (await request.json()) as unknown;
    const source = body && typeof body === 'object' && 'brandKit' in body
      ? (body as { brandKit?: unknown }).brandKit
      : body;
    const assetIssues = validateBrandAssetIds(source);
    if (assetIssues.length > 0) {
      return errorResponse(locale, 'invalid_brand_asset_id', 400, { issues: assetIssues });
    }
    const fallback = createBrandKitFromTheme(site.theme, settings, settings?.firmName || site.name);
    const brandKit = normalizeBrandKit(source, fallback);

    site.theme = createThemeFromBrandKit(brandKit, site.theme);
    // Assign `brand` directly (may be undefined) so clearing the custom palette
    // removes it, mirroring how `assets` is handled above.
    const brand = sanitizeBrandSettings({ customColors: brandKit.customColors });
    site.settings = {
      ...(site.settings ?? {}),
      logo: brandKit.logoLight,
      logoDark: brandKit.logoDark,
      favicon: brandKit.favicon,
      ogImage: brandKit.ogImage,
      assets: brandKit.assets,
      brand,
    };
    site.updatedAt = new Date().toISOString();

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      brandKit,
      settings: site.settings ?? {},
      theme: site.theme,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'brand_kit_save_failed', 500);
  }
}
