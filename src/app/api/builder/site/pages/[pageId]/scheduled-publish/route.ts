import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  cancelScheduledPublishes,
  getActiveScheduledPublish,
  schedulePagePublish,
} from '@/lib/builder/site/scheduled-publish';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { recordTranslationPublishPolicyReview } from '@/lib/builder/audit/record';
import { parseOptionalTranslationSiteReview } from '@/lib/builder/publish-gate/translation-policy-review';
import {
  buildTranslationReleasePolicyBlockedPayload,
  evaluateTranslationReleasePolicyForPublish,
} from '@/lib/builder/publish-gate/translation-release-policy';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const siteId = resolveBuilderSiteIdFromRequest(request);
  try {
    const job = await getActiveScheduledPublish(siteId, params.pageId);
    return NextResponse.json({ ok: true, job });
  } catch {
    return errorResponse(locale, 'scheduled_publish_load_failed', 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'publish', permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const parsedBody = await request.json().catch(() => ({}));
  const body = isRecord(parsedBody) ? parsedBody : {};
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const locale = normalizeLocale(
    typeof body.locale === 'string'
      ? body.locale
      : request.nextUrl.searchParams.get('locale') ?? undefined,
  );
  const scheduledAt = typeof body.scheduledAt === 'string' ? body.scheduledAt : '';
  const scheduledMs = Date.parse(scheduledAt);
  if (!Number.isFinite(scheduledMs)) {
    return errorResponse(locale, 'scheduled_publish_invalid_timestamp', 400);
  }
  if (scheduledMs <= Date.now()) {
    return errorResponse(locale, 'scheduled_publish_past', 400);
  }

  const expectedDraftRevision =
    typeof body.expectedDraftRevision === 'number' && Number.isFinite(body.expectedDraftRevision)
      ? Math.trunc(body.expectedDraftRevision)
      : undefined;
  const translationSiteReview = parseOptionalTranslationSiteReview(body.translationSiteReview);
  if (translationSiteReview.status === 'invalid') {
    return errorResponse(locale, 'scheduled_publish_save_failed', 400);
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
    const job = await schedulePagePublish({
      siteId,
      pageId: params.pageId,
      locale,
      scheduledAt: new Date(scheduledMs).toISOString(),
      expectedDraftRevision,
      requestedBy: auth.username,
    });

    if (translationSiteReview.status === 'valid') {
      await recordTranslationPublishPolicyReview({
        request,
        siteId,
        pageId: params.pageId,
        action: 'schedule',
        review: translationSiteReview.review,
        scheduledAt: job.scheduledAt,
        jobId: job.jobId,
      });
    }

    return NextResponse.json({ ok: true, job });
  } catch {
    return errorResponse(locale, 'scheduled_publish_save_failed', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { bucket: 'publish', permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  try {
    const cancelled = await cancelScheduledPublishes(
      siteId,
      params.pageId,
      `cancelled by ${auth.username}`,
    );
    return NextResponse.json({ ok: true, cancelled });
  } catch {
    return errorResponse(locale, 'scheduled_publish_cancel_failed', 500);
  }
}
