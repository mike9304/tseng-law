/**
 * POST /api/builder/site/publish-checks
 *
 * Runs the publish gate against a `BuilderCanvasDocument` (canvas-scene-vnext
 * world). Accepts the document either inline (request body) or falls back to
 * the persisted draft for the supplied pageId.
 *
 * Body shape (all optional except siteId/pageId/locale):
 *   {
 *     siteId: string;          // defaults to 'default'
 *     pageId: string;
 *     locale?: 'ko' | 'zh-hant' | 'en';
 *     document?: BuilderCanvasDocument;  // inline; otherwise read from disk
 *   }
 *
 * Response:
 *   { ok: true, suite: PublishCheckSuite, translationSiteWarnings?: TranslationSiteWarningSummary, translationReleasePolicy?: TranslationReleasePolicy, translationReleaseApproval?: TranslationReleaseApprovalRequirement }
 *   { ok: false, error: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { runAllChecks } from '@/lib/builder/publish-gate/gate-runner';
import { buildTranslationSiteWarningSummary } from '@/lib/builder/publish-gate/translation-site-summary';
import {
  applyTranslationReleasePolicyToSuite,
  readTranslationReleasePolicy,
} from '@/lib/builder/publish-gate/translation-release-policy';
import {
  applyTranslationReleaseApprovalToSuite,
  evaluateTranslationReleaseApprovalRequirement,
} from '@/lib/builder/publish-gate/translation-release-approval';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';

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
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const explicitSiteId = typeof body.siteId === 'string' ? body.siteId : null;
  const siteId = resolveBuilderSiteIdFromRequest(request, explicitSiteId);
  const pageId = typeof body.pageId === 'string' && body.pageId.trim() ? body.pageId.trim() : null;
  const locale = normalizeLocale(
    typeof body.locale === 'string' ? body.locale : request.nextUrl.searchParams.get('locale') ?? undefined,
  );

  if (!pageId) return errorResponse(locale, 'page_id_required', 400);

  // Resolve canvas document
  let canvas: BuilderCanvasDocument | null = null;
  if (body.document && typeof body.document === 'object') {
    canvas = body.document as BuilderCanvasDocument;
  } else {
    try {
      canvas = await readPageCanvas(siteId, pageId, 'draft');
    } catch {
      return errorResponse(locale, 'publish_checks_failed', 500);
    }
  }
  if (!canvas) {
    return errorResponse(locale, 'draft_canvas_not_found', 404);
  }

  // Resolve page + site for SEO + slug-based link checks
  const site = await readSiteDocument(siteId, locale).catch(() => null);
  const page = site?.pages.find((p) => p.pageId === pageId) ?? null;

  try {
    const suite = await runAllChecks(canvas, page, site);
    const translationReleasePolicy = await readTranslationReleasePolicy(siteId);
    const translationSiteWarnings = site
      ? buildTranslationSiteWarningSummary(site, pageId)
      : undefined;
    const checkedSuite = translationSiteWarnings
      ? applyTranslationReleasePolicyToSuite(
        suite,
        translationReleasePolicy,
        translationSiteWarnings,
        locale,
      )
      : suite;
    const translationReleaseApproval = translationSiteWarnings
      ? await evaluateTranslationReleaseApprovalRequirement({
        siteId,
        pageId,
        locale,
        actorUsername: auth.username,
        policy: translationReleasePolicy,
        summary: translationSiteWarnings,
      })
      : undefined;
    const suiteWithApproval = translationReleaseApproval
      ? applyTranslationReleaseApprovalToSuite(checkedSuite, translationReleaseApproval)
      : checkedSuite;
    return NextResponse.json({
      ok: true,
      suite: suiteWithApproval,
      translationSiteWarnings,
      translationReleasePolicy,
      translationReleaseApproval,
    });
  } catch {
    return errorResponse(locale, 'publish_checks_failed', 500);
  }
}
