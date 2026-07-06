import { NextRequest, NextResponse } from 'next/server';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SeedRequestBody = {
  locale?: unknown;
  siteId?: unknown;
};

async function readJsonBody(request: NextRequest): Promise<SeedRequestBody | null> {
  const text = await request.text();
  if (!text.trim()) return {};
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
  return parsed as SeedRequestBody;
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

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const requestLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  let body: SeedRequestBody | null;
  try {
    body = await readJsonBody(request);
  } catch {
    return errorResponse(requestLocale, 'invalid_json', 400);
  }

  if (!body) {
    return errorResponse(requestLocale, 'seed_body_invalid', 400);
  }

  const locale = normalizeLocale(
    typeof body.locale === 'string'
      ? body.locale
      : request.nextUrl.searchParams.get('locale') || undefined,
  );
  const siteId = normalizeBuilderSiteId(
    typeof body.siteId === 'string'
      ? body.siteId
      : request.nextUrl.searchParams.get('siteId'),
  );

  try {
    await seedSitePages(siteId, locale);
  } catch {
    return errorResponse(locale, 'seed_failed', 500);
  }

  return NextResponse.json({ ok: true, siteId, locale });
}
