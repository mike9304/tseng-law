import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { PublishError, publishPage } from '@/lib/builder/site/publish';
import {
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
} from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const expectedDraftRevision =
    typeof body.expectedDraftRevision === 'number' && Number.isFinite(body.expectedDraftRevision)
      ? Math.trunc(body.expectedDraftRevision)
      : undefined;

  try {
    const result = await publishPage(DEFAULT_BUILDER_SITE_ID, params.pageId, {
      expectedDraftRevision,
    });

    await recordPublishSuccess({
      request,
      siteId: DEFAULT_BUILDER_SITE_ID,
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
      warnings: result.warnings,
    });
  } catch (error) {
    if (error instanceof PublishError) {
      if (error.code === 'publish_blocked') {
        const blockers = Array.isArray(error.body.blockers) ? error.body.blockers : [];
        await recordPublishBlocked({
          request,
          siteId: DEFAULT_BUILDER_SITE_ID,
          pageId: params.pageId,
          blockerCount: blockers.length,
        });
      } else {
        await recordPublishFailure({
          request,
          siteId: DEFAULT_BUILDER_SITE_ID,
          pageId: params.pageId,
          reason: error.code,
        });
      }

      return NextResponse.json(
        { ok: false, error: error.code, ...error.body },
        { status: error.status },
      );
    }

    await recordPublishFailure({
      request,
      siteId: DEFAULT_BUILDER_SITE_ID,
      pageId: params.pageId,
      reason: 'internal',
    });
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
