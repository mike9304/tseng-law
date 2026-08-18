import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotResponse,
  BuilderSnapshotConflictError,
  rollbackBuilderPageDraftToPublishedRevision,
} from '@/lib/builder/persistence';
import { recordPageRollback } from '@/lib/builder/audit/record';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; pageKey: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return errorResponse(locale, 'builder_site_not_found', 404);
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return errorResponse(locale, 'builder_page_not_found', 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse(locale, 'rollback_revision_required', 400);
  }

  const record = body as Record<string, unknown>;
  const revisionId =
    typeof record.revisionId === 'string' && record.revisionId.trim()
      ? record.revisionId.trim()
      : null;

  if (!revisionId) {
    return errorResponse(locale, 'rollback_revision_required', 400);
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
    const result = await rollbackBuilderPageDraftToPublishedRevision(params.pageKey, locale, {
      revisionId,
      updatedBy,
      expectedDraft,
    });

    if (!result) {
      return errorResponse(locale, 'revision_not_found', 404);
    }

    await recordPageRollback({
      request,
      siteId: params.siteId,
      pageId: params.pageKey,
      revisionId,
    });

    return NextResponse.json({
      ...buildBuilderSnapshotResponse(result),
      action: 'rollback-draft',
      sourceRevisionId: result.sourceRevisionId,
      sourceRevision: result.sourceRevision,
      sourceSavedAt: result.sourceSavedAt,
      sourceUpdatedBy: result.sourceUpdatedBy,
    });
  } catch (error) {
    if (error instanceof BuilderSnapshotConflictError) {
      return errorResponse(locale, 'draft_conflict', 409, { conflict: error.conflict });
    }

    if (error instanceof Error) {
      return errorResponse(locale, 'rollback_failed', 500);
    }

    return errorResponse(locale, 'rollback_failed', 500);
  }
}
