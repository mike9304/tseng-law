import { NextRequest, NextResponse } from 'next/server';
import { PublishError, publishPage } from '@/lib/builder/site/publish';
import {
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
  recordTranslationPublishPolicyReview,
} from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getBuilderSiteApiErrorPayload } from '@/lib/builder/site/site-api-copy';
import { parseOptionalTranslationSiteReview } from '@/lib/builder/publish-gate/translation-policy-review';
import {
  buildTranslationReleasePolicyBlockedPayload,
  evaluateTranslationReleasePolicyForPublish,
} from '@/lib/builder/publish-gate/translation-release-policy';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';

const publishErrorMessages: Record<Locale, Record<string, string>> = {
  ko: {
    draft_not_found: '게시할 초안을 찾을 수 없습니다.',
    draft_stale: '초안이 최신 상태가 아닙니다.',
    publish_blocked: '게시 전 점검에서 차단 항목이 발견되었습니다.',
    revision_write_failed: '게시 리비전을 저장하지 못했습니다.',
    published_write_failed: '게시본을 저장하지 못했습니다.',
    page_not_in_site: '사이트 문서에서 페이지를 찾을 수 없습니다.',
  },
  'zh-hant': {
    draft_not_found: '找不到要發布的草稿。',
    draft_stale: '草稿不是最新版本。',
    publish_blocked: '發布前檢查發現封鎖項目。',
    revision_write_failed: '無法儲存發布修訂。',
    published_write_failed: '無法儲存已發布頁面。',
    page_not_in_site: '在網站文件中找不到頁面。',
  },
  en: {
    draft_not_found: 'The draft to publish was not found.',
    draft_stale: 'The draft is not current.',
    publish_blocked: 'Publish checks found blocking items.',
    revision_write_failed: 'Unable to save the publish revision.',
    published_write_failed: 'Unable to save the published page.',
    page_not_in_site: 'The page was not found in the site document.',
  },
};

function getPublishErrorMessage(locale: Locale, code: string): string {
  return publishErrorMessages[locale][code] ?? getBuilderSiteApiErrorPayload(locale, 'page_publish_failed').error;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const expectedDraftRevision =
    typeof body.expectedDraftRevision === 'number' && Number.isFinite(body.expectedDraftRevision)
      ? Math.trunc(body.expectedDraftRevision)
      : undefined;
  const translationSiteReview = parseOptionalTranslationSiteReview(body.translationSiteReview);
  if (translationSiteReview.status === 'invalid') {
    return NextResponse.json(
      { ok: false, ...getBuilderSiteApiErrorPayload(locale, 'page_publish_failed') },
      { status: 400 },
    );
  }

  const releasePolicyDecision = await evaluateTranslationReleasePolicyForPublish({
    siteId,
    pageId: params.pageId,
    locale,
    actorUsername: auth.username,
    review: translationSiteReview.status === 'valid' ? translationSiteReview.review : undefined,
  });
  if (releasePolicyDecision.status === 'blocked') {
    return NextResponse.json(
      buildTranslationReleasePolicyBlockedPayload(releasePolicyDecision.result),
      { status: 409 },
    );
  }

  try {
    const result = await publishPage(siteId, params.pageId, {
      expectedDraftRevision,
    });

    if (translationSiteReview.status === 'valid') {
      await recordTranslationPublishPolicyReview({
        request,
        siteId,
        pageId: params.pageId,
        action: 'publish',
        review: translationSiteReview.review,
      });
    }

    await recordPublishSuccess({
      request,
      siteId,
      pageId: params.pageId,
      revision: result.publishedRevision,
      revisionId: result.publishedRevisionId,
    });

    return NextResponse.json({
      ok: true,
      slug: result.slug,
      publishedRevisionId: result.publishedRevisionId,
      publishedRevision: result.publishedRevision,
      publishedSavedAt: result.publishedSavedAt,
      cacheInvalidatedAt: result.cacheInvalidatedAt,
      revalidatedPaths: result.revalidatedPaths,
      warnings: result.warnings,
    });
  } catch (error) {
    if (error instanceof PublishError) {
      if (error.code === 'publish_blocked') {
        const blockers = Array.isArray(error.body.blockers) ? error.body.blockers : [];
        await recordPublishBlocked({
          request,
          siteId,
          pageId: params.pageId,
          blockerCount: blockers.length,
        });
      } else {
        await recordPublishFailure({
          request,
          siteId,
          pageId: params.pageId,
          reason: error.code,
        });
      }

      return NextResponse.json(
        {
          ok: false,
          error: error.code,
          errorCode: error.code,
          errorMessage: getPublishErrorMessage(locale, error.code),
          ...error.body,
        },
        { status: error.status },
      );
    }

    await recordPublishFailure({
      request,
      siteId,
      pageId: params.pageId,
      reason: 'internal',
    });
    return NextResponse.json(
      { ok: false, ...getBuilderSiteApiErrorPayload(locale, 'page_publish_failed') },
      { status: 500 },
    );
  }
}
