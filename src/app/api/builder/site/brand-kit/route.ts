import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createBrandKitFromTheme,
  createThemeFromBrandKit,
  normalizeBrandKit,
} from '@/lib/builder/site/theme';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);

    return NextResponse.json({
      ok: true,
      brandKit: createBrandKitFromTheme(site.theme, site.settings, site.settings?.firmName || site.name),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const body = (await request.json()) as unknown;
    const source = body && typeof body === 'object' && 'brandKit' in body
      ? (body as { brandKit?: unknown }).brandKit
      : body;
    const assetIssues = validateBrandAssetIds(source);
    if (assetIssues.length > 0) {
      return NextResponse.json({
        ok: false,
        error: 'invalid_brand_asset_id',
        issues: assetIssues,
      }, { status: 400 });
    }
    const fallback = createBrandKitFromTheme(site.theme, site.settings, site.settings?.firmName || site.name);
    const brandKit = normalizeBrandKit(source, fallback);

    site.theme = createThemeFromBrandKit(brandKit, site.theme);
    site.settings = {
      ...(site.settings ?? {}),
      logo: brandKit.logoLight,
      logoDark: brandKit.logoDark,
      favicon: brandKit.favicon,
      ogImage: brandKit.ogImage,
      assets: brandKit.assets,
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
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
