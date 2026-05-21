/**
 * F119 — GET /api/builder/translations/publish-warnings
 *
 * Returns the publish warnings list for the configured source locale.
 * Read-only; uses `guardBuilderRead` (no CSRF / rate limit).
 *
 * Query:
 *   ?sourceLocale=ko (default ko)
 *   ?siteId=tseng-law-main-site (default DEFAULT_BUILDER_SITE_ID)
 */

import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { buildTranslationPublishWarningsPayload } from '@/lib/builder/translations/publish-warnings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
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
    const message = err instanceof Error ? err.message : 'internal';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}