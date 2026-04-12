import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotResponse,
  BuilderSnapshotConflictError,
  rollbackBuilderPageDraftToPublishedRevision,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
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
    return badRequest('Invalid JSON body.');
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return badRequest('revisionId is required.');
  }

  const record = body as Record<string, unknown>;
  const revisionId =
    typeof record.revisionId === 'string' && record.revisionId.trim()
      ? record.revisionId.trim()
      : null;

  if (!revisionId) {
    return badRequest('revisionId is required.');
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
      return NextResponse.json({ ok: false, error: 'Published revision record not found.' }, { status: 404 });
    }

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
      return NextResponse.json(
        {
          ok: false,
          error: 'Snapshot conflict. Reload the latest shared draft before rollback.',
          conflict: error.conflict,
        },
        { status: 409 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    throw error;
  }
}
