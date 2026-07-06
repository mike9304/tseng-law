import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderHomeSnapshotResponse,
  BuilderSnapshotConflictError,
  normalizeBuilderHomeLocale,
  rollbackBuilderHomeDraftToPublishedRevision,
} from '@/lib/builder/persistence';
import { recordPageRollback } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';

function errorResponse(
  locale: ReturnType<typeof normalizeBuilderHomeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse(locale, 'home_rollback_revision_required', 400);
  }

  const record = body as Record<string, unknown>;
  const revisionId =
    typeof record.revisionId === 'string' && record.revisionId.trim()
      ? record.revisionId.trim()
      : null;

  if (!revisionId) {
    return errorResponse(locale, 'home_rollback_revision_required', 400);
  }

  const updatedBy =
    typeof record.updatedBy === 'string' && record.updatedBy.trim()
      ? record.updatedBy.trim()
      : undefined;
  const expectedDraft = {
    revision:
      typeof record.expectedDraftRevision === 'number' &&
      Number.isFinite(record.expectedDraftRevision)
        ? Math.trunc(record.expectedDraftRevision)
        : undefined,
    savedAt:
      typeof record.expectedDraftSavedAt === 'string' && record.expectedDraftSavedAt.trim()
        ? record.expectedDraftSavedAt.trim()
        : undefined,
  };

  try {
    const result = await rollbackBuilderHomeDraftToPublishedRevision(locale, {
      revisionId,
      updatedBy,
      expectedDraft,
    });

    if (!result) {
      return errorResponse(locale, 'home_rollback_revision_not_found', 404);
    }

    await recordPageRollback({
      request,
      siteId: 'default',
      pageId: 'home',
      revisionId,
    });

    return NextResponse.json({
      ...buildBuilderHomeSnapshotResponse(result),
      action: 'rollback-draft',
      sourceRevisionId: result.sourceRevisionId,
      sourceRevision: result.sourceRevision,
      sourceSavedAt: result.sourceSavedAt,
      sourceUpdatedBy: result.sourceUpdatedBy,
    });
  } catch (error) {
    if (error instanceof BuilderSnapshotConflictError) {
      return errorResponse(locale, 'home_rollback_conflict', 409, {
        conflict: error.conflict,
      });
    }

    return errorResponse(locale, 'home_rollback_failed', 500);
  }
}
