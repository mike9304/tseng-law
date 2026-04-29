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

export async function GET(request: NextRequest) {
  const auth = guardMutation(request);
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
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const body = (await request.json()) as unknown;
    const source = body && typeof body === 'object' && 'brandKit' in body
      ? (body as { brandKit?: unknown }).brandKit
      : body;
    const fallback = createBrandKitFromTheme(site.theme, site.settings, site.settings?.firmName || site.name);
    const brandKit = normalizeBrandKit(source, fallback);

    site.theme = createThemeFromBrandKit(brandKit, site.theme);
    site.settings = {
      ...(site.settings ?? {}),
      logo: brandKit.logoLight,
      logoDark: brandKit.logoDark,
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
