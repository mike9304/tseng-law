/**
 * F119 — GET /api/builder/translations/publish-warnings
 *
 * Returns the publish warnings list for the configured source locale.
 * Read-only; requires translation-management permission (no CSRF / rate limit).
 *
 * Query:
 *   ?sourceLocale=ko (default ko)
 *   ?siteId=tseng-law-main-site (default DEFAULT_BUILDER_SITE_ID)
 */

import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { buildTranslationPublishWarningsPayload } from '@/lib/builder/translations/publish-warnings';
import { getBuilderTranslationsApiErrorPayload } from '@/lib/builder/translations/translations-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveRequestLocale(request: NextRequest): Locale {
  return normalizeLocale(
    request.nextUrl.searchParams.get('locale') ||
      request.nextUrl.searchParams.get('sourceLocale') ||
      undefined,
  );
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'manage-translations');
  if (auth instanceof NextResponse) return auth;

  const sourceLocale = normalizeLocale(
    request.nextUrl.searchParams.get('sourceLocale') || undefined,
  );
  const siteId =
    request.nextUrl.searchParams.get('siteId') || DEFAULT_BUILDER_SITE_ID;

  try {
    const payload = await buildTranslationPublishWarningsPayload(siteId, sourceLocale);
    return NextResponse.json(payload);
  } catch (err) {
    console.error('[builder/translations/publish-warnings] load failed:', err);
    return NextResponse.json(
      {
        ok: false,
        ...getBuilderTranslationsApiErrorPayload(resolveRequestLocale(request), 'translation_publish_warnings_failed'),
      },
      { status: 500 },
    );
  }
}
