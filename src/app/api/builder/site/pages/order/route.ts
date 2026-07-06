import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  projectPagesForLocale,
  readSiteDocument,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const reorderPagesSchema = z.object({
  siteId: z.string().trim().min(1).max(120).optional(),
  orderedPageIds: z.array(z.string().trim().min(1)).min(1).max(500),
}).strict();

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, 'validation_error'), issues: error.flatten() },
    { status: 400 },
  );
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    const payload = reorderPagesSchema.parse(await request.json());
    const siteId = resolveBuilderSiteIdFromRequest(request, payload.siteId);
    const site = await readSiteDocument(siteId, locale);
    const visiblePages = projectPagesForLocale(site.pages, locale);
    const visiblePageIds = visiblePages.map((page) => page.pageId);
    const visiblePageIdSet = new Set(visiblePageIds);
    const seenPageIds = new Set<string>();
    const orderedPageIds: string[] = [];

    for (const pageId of payload.orderedPageIds) {
      if (!visiblePageIdSet.has(pageId)) {
        return errorResponse(locale, 'page_order_unknown_page', 400, { pageId });
      }
      if (seenPageIds.has(pageId)) {
        return errorResponse(locale, 'page_order_duplicate_page', 400, { pageId });
      }
      seenPageIds.add(pageId);
      orderedPageIds.push(pageId);
    }

    for (const pageId of visiblePageIds) {
      if (!seenPageIds.has(pageId)) orderedPageIds.push(pageId);
    }

    const orderedPages = new Map(site.pages.map((page) => [page.pageId, page]));
    const reorderedVisiblePages = orderedPageIds
      .map((pageId) => orderedPages.get(pageId))
      .filter((page): page is NonNullable<typeof page> => Boolean(page));
    let cursor = 0;
    const targetPageIdSet = new Set(reorderedVisiblePages.map((page) => page.pageId));
    site.pages = site.pages.map((page) => {
      if (!targetPageIdSet.has(page.pageId)) return page;
      const nextPage = reorderedVisiblePages[cursor] ?? page;
      cursor += 1;
      return nextPage;
    });
    site.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      pages: projectPagesForLocale(site.pages, locale),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'page_order_save_failed', 500);
  }
}
