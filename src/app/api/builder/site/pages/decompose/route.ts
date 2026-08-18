import { NextRequest, NextResponse } from 'next/server';
import { USER_DRAFT_UPDATED_BY } from '@/lib/builder/canvas/home-draft-reseed';
import { STANDARD_PAGE_DECOMPOSERS } from '@/lib/builder/canvas/seed-pages';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';
import { matchesStandardPageSlugForLocale } from '@/lib/builder/site/standard-pages';
import { readSiteDocument, writePageCanvas } from '@/lib/builder/site/persistence';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';
import {
  builderJsonResponse,
  builderSiteErrorResponse,
  type BuilderSiteApiErrorCode,
} from '@/app/api/builder/site/_shared/route-responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// "Decompose to edit": standard pages are seeded as live-reflecting `composite`
// nodes that render the real tseng-law.com component exactly, but a composite is
// opaque (not granularly editable). This action swaps a standard page's draft
// for its editable decomposed node tree (STANDARD_PAGE_DECOMPOSERS), so a
// designer can edit it element-by-element and then publish.

type DecomposeBody = { siteId?: unknown; slug?: unknown; locale?: unknown };

function errorResponse(
  locale: Locale,
  code: BuilderSiteApiErrorCode,
  status: number,
  cause?: unknown,
): NextResponse {
  return builderSiteErrorResponse(locale, code, status, cause);
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const rawQueryLocale = request.nextUrl.searchParams.get('locale');
  const requestLocale = normalizeLocale(rawQueryLocale || undefined);

  let body: DecomposeBody | null;
  try {
    const text = await request.text();
    body = text.trim() ? (JSON.parse(text) as DecomposeBody) : {};
  } catch (error) {
    return errorResponse(requestLocale, 'invalid_json', 400, error);
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse(requestLocale, 'seed_body_invalid', 400);
  }

  const rawLocale = typeof body.locale === 'string' ? body.locale : rawQueryLocale;
  if (rawLocale && !isLocale(rawLocale)) {
    // Public /ja is not a builder authoring locale. Falling back to KO would
    // overwrite the Korean home when a caller passes locale=ja.
    return errorResponse(requestLocale, 'seed_body_invalid', 400);
  }
  const locale = normalizeLocale(rawLocale || undefined);
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';

  const decomposer = STANDARD_PAGE_DECOMPOSERS[slug];
  if (!decomposer) {
    // Unknown / non-standard slug. Note: home ('') IS decomposable — it maps
    // to createHomePageCanvasDocumentDecomposed.
    return errorResponse(locale, 'seed_body_invalid', 400);
  }

  let pageId: string | undefined;
  try {
    const site = await readSiteDocument(siteId, locale);
    pageId = site.pages.find((page) => matchesStandardPageSlugForLocale(page, locale, slug))?.pageId;
  } catch (error) {
    return errorResponse(locale, 'seed_failed', 500, error);
  }
  if (!pageId) {
    return errorResponse(locale, 'seed_body_invalid', 400);
  }

  try {
    // Decompose-to-edit is an explicit editor action: stamp the record as user
    // work so the builder entry point never factory-reseeds the result
    // (pristine-decomposed-seed requires a seed-marked record).
    await writePageCanvas(siteId, pageId, 'draft', decomposer(locale), {
      updatedBy: USER_DRAFT_UPDATED_BY,
    });
  } catch (error) {
    return errorResponse(locale, 'seed_failed', 500, error);
  }

  return builderJsonResponse({ ok: true, siteId, locale, slug, pageId });
}
