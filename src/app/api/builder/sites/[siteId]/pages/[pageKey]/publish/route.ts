import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotResponse,
  BuilderSnapshotConflictError,
  publishBuilderPageSnapshot,
  readBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import {
  getBuilderPageConfig,
  isBuilderPageKey,
  isDefaultBuilderSiteId,
} from '@/lib/builder/site';
import {
  recordPublishBlocked,
  recordPublishFailure,
  recordPublishSuccess,
} from '@/lib/builder/audit/record';
import { BuilderPublishValidationError } from '@/lib/builder/validation';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder page.' }, { status: 404 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const updatedBy =
    body &&
    typeof body === 'object' &&
    !Array.isArray(body) &&
    typeof (body as Record<string, unknown>).updatedBy === 'string'
      ? ((body as Record<string, unknown>).updatedBy as string)
      : undefined;

  const record = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  const expectedDraft = record
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
  const expectedPublished = record
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
    const draft = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
    const published = await readBuilderPageSnapshot(params.pageKey, 'published', locale);
    if (!draft.persisted) {
      await recordPublishFailure({
        request,
        siteId: params.siteId,
        pageId: params.pageKey,
        reason: 'draft_not_found',
      });

      return NextResponse.json({ ok: false, error: 'No draft snapshot exists for this locale.' }, { status: 404 });
    }

    const draftExpectation = expectedDraft ?? {
      revision: draft.snapshot.revision,
      savedAt: draft.snapshot.savedAt,
    };
    const publishedExpectation = expectedPublished ?? {
      revision: published.snapshot.revision,
      savedAt: published.snapshot.savedAt,
    };

    const result = await publishBuilderPageSnapshot(params.pageKey, locale, {
      updatedBy,
      expectedDraft: draftExpectation,
      expectedPublished: publishedExpectation,
    });
    if (!result) {
      await recordPublishFailure({
        request,
        siteId: params.siteId,
        pageId: params.pageKey,
        reason: 'draft_not_found',
      });

      return NextResponse.json({ ok: false, error: 'No draft snapshot exists for this locale.' }, { status: 404 });
    }

    const config = getBuilderPageConfig(params.pageKey);
    revalidatePath(`/${locale}${config.publicPath === '/' ? '' : config.publicPath}`);
    await recordPublishSuccess({
      request,
      siteId: params.siteId,
      pageId: params.pageKey,
      revision: result.snapshot.revision,
      revisionId: `${params.pageKey}:${locale}:published:${result.snapshot.revision}`,
    });

    return NextResponse.json({
      ...buildBuilderSnapshotResponse(result),
      action: 'publish',
    });
  } catch (error) {
    if (error instanceof BuilderPublishValidationError) {
      await recordPublishBlocked({
        request,
        siteId: params.siteId,
        pageId: params.pageKey,
        blockerCount: error.issues.length,
      });

      return NextResponse.json(
        {
          ok: false,
          error: 'Builder publish validation failed before publish.',
          issues: error.issues,
        },
        { status: 422 }
      );
    }

    if (error instanceof BuilderSnapshotConflictError) {
      await recordPublishFailure({
        request,
        siteId: params.siteId,
        pageId: params.pageKey,
        reason: 'snapshot_conflict',
      });

      return NextResponse.json(
        {
          ok: false,
          error: 'Snapshot conflict. Reload the latest version before publishing again.',
          conflict: error.conflict,
        },
        { status: 409 }
      );
    }

    await recordPublishFailure({
      request,
      siteId: params.siteId,
      pageId: params.pageKey,
      reason: 'unexpected_error',
    });

    throw error;
  }
}
