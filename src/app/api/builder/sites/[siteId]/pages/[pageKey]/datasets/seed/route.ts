import { NextRequest, NextResponse } from 'next/server';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  getBuilderBindableTargets,
  isBuilderDatasetTargetId,
  readBuilderPageDatasetOverviews,
  resetBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import {
  BuilderSnapshotConflictError,
  readBuilderPageSnapshot,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale } from '@/lib/locales';

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

function parseExpectedRevision(record: Record<string, unknown>): number | null {
  const value = record.expectedRevision;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function currentRevisionPayload(snapshot: BuilderSnapshotConflictError['conflict']['currentSnapshot']) {
  return {
    current: {
      revision: snapshot.revision,
      savedAt: snapshot.savedAt,
    },
  };
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; pageKey: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const requestLocale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return errorResponse(requestLocale, 'builder_site_not_found', 404);
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return errorResponse(requestLocale, 'builder_page_not_found', 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(requestLocale, 'invalid_json', 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return errorResponse(requestLocale, 'page_dataset_body_invalid', 400);
  }

  const record = body as Record<string, unknown>;
  const locale = normalizeLocale(
    typeof record.locale === 'string' ? record.locale : request.nextUrl.searchParams.get('locale') ?? undefined
  );
  const targetId =
    typeof record.targetId === 'string' && isBuilderDatasetTargetId(record.targetId)
      ? record.targetId
      : null;
  const expectedRevision = parseExpectedRevision(record);

  if (!targetId) {
    return errorResponse(locale, 'page_dataset_target_invalid', 400);
  }

  const bindableTargets = getBuilderBindableTargets(params.pageKey);
  if (!bindableTargets.some((target) => target.targetId === targetId)) {
    return errorResponse(locale, 'page_dataset_target_unapproved', 400);
  }

  try {
    const draft = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
    if (expectedRevision === null) {
      return errorResponse(
        locale,
        'page_dataset_expected_revision_required',
        428,
        currentRevisionPayload(draft.snapshot),
      );
    }

    const nextDatasets = resetBuilderPageDatasetBinding(
      draft.snapshot.document.datasets,
      params.pageKey,
      targetId
    );
    const nextDocument = {
      ...draft.snapshot.document,
      datasets: nextDatasets,
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
    const site = await readSiteDocument('default', locale);

    return NextResponse.json({
      ok: true,
      revision: result.snapshot.revision,
      targets: readBuilderPageDatasetOverviews(
        params.pageKey,
        result.snapshot.document,
        locale,
        posts,
        { cmsCollections: site.cmsCollections },
      ),
    });
  } catch (error) {
    if (error instanceof BuilderSnapshotConflictError) {
      return errorResponse(
        locale,
        'page_dataset_seed_conflict',
        409,
        currentRevisionPayload(error.conflict.currentSnapshot),
      );
    }

    console.error('[builder-page-datasets:seed] failed', error);
    return errorResponse(locale, 'page_dataset_seed_failed', 500);
  }
}
