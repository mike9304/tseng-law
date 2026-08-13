import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderHomeSnapshotResponse,
  BuilderSnapshotConflictError,
  normalizeBuilderHomeLocale,
  publishBuilderHomeSnapshot,
  readBuilderHomeSnapshot,
} from '@/lib/builder/persistence';
import {
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
} from '@/lib/builder/audit/record';
import { BuilderPublishValidationError } from '@/lib/builder/validation';
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
  const auth = await guardMutation(request, { bucket: 'publish', permission: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const updatedBy =
    body && typeof body === 'object' && !Array.isArray(body) && typeof (body as Record<string, unknown>).updatedBy === 'string'
      ? ((body as Record<string, unknown>).updatedBy as string)
      : undefined;
  const record = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  const expectedDraft =
    record
      ? {
          revision:
            typeof record.expectedDraftRevision === 'number' && Number.isFinite(record.expectedDraftRevision)
              ? Math.trunc(record.expectedDraftRevision)
              : undefined,
          savedAt:
            typeof record.expectedDraftSavedAt === 'string' && record.expectedDraftSavedAt.trim()
              ? record.expectedDraftSavedAt.trim()
              : undefined,
        }
      : undefined;
  const expectedPublished =
    record
      ? {
          revision:
            typeof record.expectedPublishedRevision === 'number' &&
            Number.isFinite(record.expectedPublishedRevision)
              ? Math.trunc(record.expectedPublishedRevision)
              : undefined,
          savedAt:
            typeof record.expectedPublishedSavedAt === 'string' && record.expectedPublishedSavedAt.trim()
              ? record.expectedPublishedSavedAt.trim()
              : undefined,
        }
      : undefined;
  try {
    const draft = await readBuilderHomeSnapshot('draft', locale);
    const published = await readBuilderHomeSnapshot('published', locale);
    if (!draft.persisted) {
      await recordPublishFailure({
        request,
        siteId: 'default',
        pageId: 'home',
        reason: 'draft_not_found',
      });

      return errorResponse(locale, 'home_publish_draft_not_found', 404);
    }

    const draftExpectation = expectedDraft ?? {
      revision: draft.snapshot.revision,
      savedAt: draft.snapshot.savedAt,
    };
    const publishedExpectation = expectedPublished ?? {
      revision: published.snapshot.revision,
      savedAt: published.snapshot.savedAt,
    };

    const result = await publishBuilderHomeSnapshot(locale, {
      updatedBy,
      expectedDraft: draftExpectation,
      expectedPublished: publishedExpectation,
    });
    if (!result) {
      await recordPublishFailure({
        request,
        siteId: 'default',
        pageId: 'home',
        reason: 'draft_not_found',
      });

      return errorResponse(locale, 'home_publish_draft_not_found', 404);
    }

    revalidatePath(`/${locale}`);
    await recordPublishSuccess({
      request,
      siteId: 'default',
      pageId: 'home',
      revision: result.snapshot.revision,
      revisionId: `home:${locale}:published:${result.snapshot.revision}`,
    });

    return NextResponse.json({
      ...buildBuilderHomeSnapshotResponse(result),
      action: 'publish',
    });
  } catch (error) {
    if (error instanceof BuilderPublishValidationError) {
      await recordPublishBlocked({
        request,
        siteId: 'default',
        pageId: 'home',
        blockerCount: error.issues.length,
      });

      return errorResponse(locale, 'home_publish_validation_failed', 422, {
        issues: error.issues,
      });
    }

    if (error instanceof BuilderSnapshotConflictError) {
      await recordPublishFailure({
        request,
        siteId: 'default',
        pageId: 'home',
        reason: 'snapshot_conflict',
      });

      return errorResponse(locale, 'home_publish_conflict', 409, {
        conflict: error.conflict,
      });
    }

    await recordPublishFailure({
      request,
      siteId: 'default',
      pageId: 'home',
      reason: 'unexpected_error',
    });

    return errorResponse(locale, 'home_publish_failed', 500);
  }
}
