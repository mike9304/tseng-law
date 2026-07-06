import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getSiteUrl } from '@/lib/seo';
import { buildSeoAssistantTasks } from '@/lib/builder/seo/assistant';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import { getSeoRouteErrorCopy } from '@/lib/builder/seo/route-copy';
import type { BuilderSeoMetadata } from '@/lib/builder/site/types';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const assistantPatchSchema = z.object({
  focusKeyword: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(80).optional(),
  ),
}).strict();

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
  errorOverride?: string,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, errorCode),
      ...(errorOverride ? { error: errorOverride } : {}),
      ...extra,
    },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function notFound(pageId: string, locale: Locale): NextResponse {
  const copy = getSeoRouteErrorCopy(locale, 'seo-assistant');
  return errorResponse(locale, 'page_not_found', 404, { pageId }, copy.pageNotFound(pageId));
}

function invalidJsonPayloadResponse(locale: Locale): NextResponse {
  const copy = getSeoRouteErrorCopy(locale, 'seo-assistant');
  return errorResponse(locale, 'invalid_json', 400, {}, copy.invalidJsonPayload);
}

function unknownErrorResponse(locale: Locale): NextResponse {
  return errorResponse(locale, 'seo_assistant_request_failed', 500);
}

function applyLocalizedFocusKeyword(
  existingSeo: BuilderSeoMetadata | undefined,
  pageLocale: string,
  locale: string,
  focusKeyword: string | undefined,
): BuilderSeoMetadata | undefined {
  const nextSeo: BuilderSeoMetadata = { ...(existingSeo ?? {}) };
  if (pageLocale === locale) {
    if (focusKeyword) nextSeo.focusKeyword = focusKeyword;
    else delete nextSeo.focusKeyword;
    return Object.keys(nextSeo).length > 0 ? nextSeo : undefined;
  }

  const overrides = { ...(nextSeo.localizedOverrides ?? {}) };
  const currentOverride = { ...(overrides[locale as keyof NonNullable<BuilderSeoMetadata['localizedOverrides']>] ?? {}) };
  if (focusKeyword) currentOverride.focusKeyword = focusKeyword;
  else delete currentOverride.focusKeyword;

  if (Object.keys(currentOverride).length > 0) {
    overrides[locale as keyof NonNullable<BuilderSeoMetadata['localizedOverrides']>] = currentOverride;
  } else {
    delete overrides[locale as keyof NonNullable<BuilderSeoMetadata['localizedOverrides']>];
  }

  if (Object.keys(overrides).length > 0) nextSeo.localizedOverrides = overrides;
  else delete nextSeo.localizedOverrides;
  return Object.keys(nextSeo).length > 0 ? nextSeo : undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);

  try {
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);
    if (!page) return notFound(params.pageId, locale);
    const canvas = await readPageCanvas(siteId, page.pageId, 'draft');
    const effectiveSeo = resolveLocaleSeo(page, locale);
    const effectivePage = { ...page, seo: { ...(page.seo ?? {}), ...effectiveSeo } };

    return NextResponse.json({
      ok: true,
      focusKeyword: effectiveSeo.focusKeyword ?? page.seo?.focusKeyword ?? '',
      tasks: buildSeoAssistantTasks({
        page: effectivePage,
        site,
        canvas,
        siteUrl: getSiteUrl(),
      }),
    });
  } catch {
    return unknownErrorResponse(locale);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);

  try {
    const payload = assistantPatchSchema.parse(await request.json());
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);
    if (!page) return notFound(params.pageId, locale);

    page.seo = applyLocalizedFocusKeyword(page.seo, page.locale, locale, payload.focusKeyword);
    page.updatedAt = new Date().toISOString();
    site.updatedAt = page.updatedAt;
    await writeSiteDocument(site);

    const canvas = await readPageCanvas(siteId, page.pageId, 'draft');
    const effectiveSeo = resolveLocaleSeo(page, locale);
    const effectivePage = { ...page, seo: { ...(page.seo ?? {}), ...effectiveSeo } };
    return NextResponse.json({
      ok: true,
      focusKeyword: effectiveSeo.focusKeyword ?? page.seo?.focusKeyword ?? '',
      tasks: buildSeoAssistantTasks({
        page: effectivePage,
        site,
        canvas,
        siteUrl: getSiteUrl(),
      }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return invalidJsonPayloadResponse(locale);
    }
    return unknownErrorResponse(locale);
  }
}
