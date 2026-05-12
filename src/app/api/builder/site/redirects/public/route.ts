/**
 * Public read-only redirect rules for local middleware fallback.
 *
 * Edge middleware cannot import the Node persistence layer in next dev, so it
 * reads this endpoint on local origins to exercise the same redirect response
 * path that production uses with Vercel Blob.
 */

import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { listRedirects } from '@/lib/builder/site/redirects';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isLocalRequest(request: NextRequest): boolean {
  const hostname = request.nextUrl.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
}

export async function GET(request: NextRequest) {
  if (!isLocalRequest(request)) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const redirects = (await listRedirects('default', locale))
    .filter((redirect) => redirect.isActive)
    .map((redirect) => ({
      redirectId: redirect.redirectId,
      from: redirect.from,
      to: redirect.to,
      type: redirect.type,
      isActive: redirect.isActive,
      updatedAt: redirect.updatedAt,
    }));

  return NextResponse.json(
    { ok: true, redirects },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  );
}
