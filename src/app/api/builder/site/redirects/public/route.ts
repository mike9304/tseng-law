/**
 * Public read-only redirect rules for local middleware fallback.
 *
 * Edge middleware cannot import the Node persistence layer in next dev, so it
 * reads this endpoint on local origins to exercise the same redirect response
 * path that production uses with Vercel Blob.
 */

import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { listRedirects } from '@/lib/builder/site/redirects';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isLocalRequest(request: NextRequest): boolean {
  const hostname = request.nextUrl.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  if (!isLocalRequest(request)) {
    return errorResponse(locale, 'redirects_public_unavailable', 404);
  }

  let redirects;
  try {
    redirects = (await listRedirects('default', locale))
      .filter((redirect) => redirect.isActive)
      .map((redirect) => ({
        redirectId: redirect.redirectId,
        from: redirect.from,
        to: redirect.to,
        type: redirect.type,
        isActive: redirect.isActive,
        updatedAt: redirect.updatedAt,
      }));
  } catch {
    return errorResponse(locale, 'redirects_load_failed', 500);
  }

  return NextResponse.json(
    { ok: true, redirects },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
