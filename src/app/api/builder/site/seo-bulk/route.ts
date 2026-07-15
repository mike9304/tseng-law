import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderSeoMetadata } from '@/lib/builder/site/types';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resetFieldSchema = z.enum([
  'title',
  'description',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'canonical',
  'robots',
  'structuredData',
  'additionalMetaTags',
]);

const bulkSchema = z.object({
  pageIds: z.array(z.string().trim().min(1)).min(1).max(100),
  setIndexable: z.boolean().optional(),
  resetFields: z.array(resetFieldSchema).optional(),
}).strict();

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function validationErrorResponse(locale: ReturnType<typeof normalizeLocale>, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resetSeoFields(seo: BuilderSeoMetadata | undefined, fields: z.infer<typeof resetFieldSchema>[]): BuilderSeoMetadata | undefined {
  const next: BuilderSeoMetadata = { ...(seo ?? {}) };
  for (const field of fields) {
    if (field === 'robots') {
      delete next.noIndex;
      delete next.noFollow;
      continue;
    }
    if (field === 'structuredData') {
      delete next.structuredData;
      delete next.structuredDataBlocks;
      continue;
    }
    delete next[field];
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-seo' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  try {
    const payload = bulkSchema.parse(await request.json());
    const site = await readSiteDocument(siteId, locale);
    const selected = new Set(payload.pageIds);
    const now = new Date().toISOString();
    let updated = 0;

    for (const page of site.pages) {
      if (!selected.has(page.pageId) || page.locale !== locale) continue;
      let seo = page.seo;
      if (payload.resetFields?.length) {
        seo = resetSeoFields(seo, payload.resetFields);
      }
      if (payload.setIndexable !== undefined) {
        seo = { ...(seo ?? {}) };
        if (payload.setIndexable) {
          delete seo.noIndex;
          page.noIndex = false;
        } else {
          seo.noIndex = true;
        }
        if (Object.keys(seo).length === 0) seo = undefined;
      }
      page.seo = seo;
      page.updatedAt = now;
      updated += 1;
    }

    if (updated > 0) {
      site.updatedAt = now;
      await writeSiteDocument(site);
    }

    const canvasesByPageId = new Map<string, BuilderCanvasDocument | null>();
    await Promise.all(site.pages.map(async (page) => {
      canvasesByPageId.set(page.pageId, await readPageCanvas(siteId, page.pageId, 'draft'));
    }));

    return NextResponse.json({
      ok: true,
      updated,
      overview: buildBuilderSeoOverview({ site, canvasesByPageId }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    return errorResponse(locale, 'seo_bulk_update_failed', 500);
  }
}
