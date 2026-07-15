import { NextRequest, NextResponse } from 'next/server';
import { seedSitePages } from '@/lib/builder/canvas/seed-pages';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  builderJsonResponse,
  builderSiteErrorResponse,
  type BuilderSiteApiErrorCode,
} from '@/app/api/builder/site/_shared/route-responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

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
  cause?: unknown,
): NextResponse {
  return builderSiteErrorResponse(locale, errorCode, status, cause);
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const requestLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  let body: SeedRequestBody | null;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    return errorResponse(requestLocale, 'invalid_json', 400, error);
  }

  if (!body) {
    return errorResponse(requestLocale, 'seed_body_invalid', 400);
  }

  const locale = normalizeLocale(
    typeof body.locale === 'string'
      ? body.locale
      : request.nextUrl.searchParams.get('locale') || undefined,
  );
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;

  try {
    await seedSitePages(siteId, locale);
  } catch (error) {
    return errorResponse(locale, 'seed_failed', 500, error);
  }

  return builderJsonResponse({ ok: true, siteId, locale });
}
