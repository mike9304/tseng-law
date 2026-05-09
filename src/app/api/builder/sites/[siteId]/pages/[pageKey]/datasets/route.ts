import { NextRequest, NextResponse } from 'next/server';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  getBuilderBindableTargets,
  isBuilderDatasetTargetId,
  readBuilderPageDatasetOverviews,
  replaceBuilderPageDatasetLimit,
} from '@/lib/builder/datasets';
import {
  BuilderSnapshotConflictError,
  readBuilderPageSnapshot,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder page.' }, { status: 404 });
  }

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
    const snapshot = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
    const posts = params.pageKey === 'home' ? await getAllColumnPostsIncludingBlob(locale) : [];

    return NextResponse.json({
      ok: true,
      revision: snapshot.snapshot.revision,
      targets: readBuilderPageDatasetOverviews(
        params.pageKey,
        snapshot.snapshot.document,
        locale,
        posts
      ),
    });
  } catch (error) {
    console.error('[builder-page-datasets:get] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read page datasets.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder page.' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return badRequest('Invalid dataset body.');
  }

  const record = body as Record<string, unknown>;
  const locale = normalizeLocale(
    typeof record.locale === 'string' ? record.locale : request.nextUrl.searchParams.get('locale') ?? undefined
  );
  const targetId =
    typeof record.targetId === 'string' && isBuilderDatasetTargetId(record.targetId)
      ? record.targetId
      : null;
  const limit =
    typeof record.limit === 'number' && Number.isFinite(record.limit)
      ? Math.trunc(record.limit)
      : null;
  const expectedRevision =
    typeof record.expectedRevision === 'number' && Number.isFinite(record.expectedRevision)
      ? Math.trunc(record.expectedRevision)
      : undefined;

  if (!targetId) {
    return badRequest('Unknown dataset target.');
  }

  if (limit === null) {
    return badRequest('Dataset limit is required.');
  }

  const bindableTargets = getBuilderBindableTargets(params.pageKey);
  if (!bindableTargets.some((target) => target.targetId === targetId)) {
    return badRequest('Dataset target is not approved for this page.');
  }

  try {
    const draft = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
    const nextDocument = {
      ...draft.snapshot.document,
      datasets: replaceBuilderPageDatasetLimit(
        draft.snapshot.document.datasets,
        params.pageKey,
        targetId,
        limit
      ),
    };

    const result = await writeBuilderPageSnapshot({
      pageKey: params.pageKey,
      kind: 'draft',
      locale,
      document: nextDocument,
      state: draft.snapshot.state,
      expectedRevision,
      expectedSavedAt: draft.persisted ? draft.snapshot.savedAt : undefined,
    });

    const posts = params.pageKey === 'home' ? await getAllColumnPostsIncludingBlob(locale) : [];

    return NextResponse.json({
      ok: true,
      revision: result.snapshot.revision,
      snapshot: result.snapshot,
      targets: readBuilderPageDatasetOverviews(
        params.pageKey,
        result.snapshot.document,
        locale,
        posts
      ),
    });
  } catch (error) {
    if (error instanceof BuilderSnapshotConflictError) {
      return NextResponse.json(
        { ok: false, error: 'Dataset save conflict. Refresh the page and retry.' },
        { status: 409 }
      );
    }

    console.error('[builder-page-datasets:put] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to save dataset limit.' },
      { status: 500 }
    );
  }
}
