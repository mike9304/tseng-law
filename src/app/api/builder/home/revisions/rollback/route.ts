import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderHomeSnapshotResponse,
  BuilderSnapshotConflictError,
  normalizeBuilderHomeLocale,
  rollbackBuilderHomeDraftToPublishedRevision,
} from '@/lib/builder/persistence';
import { recordPageRollback } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));

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
    const result = await rollbackBuilderHomeDraftToPublishedRevision(locale, {
      revisionId,
      updatedBy,
      expectedDraft,
    });

    if (!result) {
      return NextResponse.json({ ok: false, error: 'Published revision record not found.' }, { status: 404 });
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
