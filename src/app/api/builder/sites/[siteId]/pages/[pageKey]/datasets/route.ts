import { NextRequest, NextResponse } from 'next/server';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  getBuilderBindableTarget,
  getBuilderBindableTargets,
  isBuilderDatasetTargetId,
  readBuilderPageDatasetOverviews,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import {
  BuilderSnapshotConflictError,
  readBuilderPageSnapshot,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { buildDatasetBindingPatch } from '@/lib/builder/cms-binding-request';
import { findCmsCollection } from '@/lib/builder/cms-collection-datasets';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type {
  BuilderDatasetCollectionId,
  BuilderDatasetMode,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
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

function datasetPatchErrorCode(message: string): BuilderSiteApiErrorCode {
  if (message.includes('limit')) return 'page_dataset_limit_invalid';
  if (message.includes('CMS collection id')) return 'page_dataset_collection_required';
  if (message.includes('collection')) return 'page_dataset_collection_unapproved';
  if (message.includes('mode')) return 'page_dataset_mode_unapproved';
  return 'page_dataset_body_invalid';
}

function parseExpectedRevision(record: Record<string, unknown>): number | null {
  const value = record.expectedRevision;
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function currentRevisionPayload(snapshot: Pick<BuilderSnapshotConflictError['conflict']['currentSnapshot'], 'revision' | 'savedAt'>) {
  return {
    current: {
      revision: snapshot.revision,
      savedAt: snapshot.savedAt,
    },
  };
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; pageKey: string }> }
) {
  const params = await props.params;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return errorResponse(locale, 'builder_site_not_found', 404);
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return errorResponse(locale, 'builder_page_not_found', 404);
  }

  try {
    const snapshot = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
    const posts = params.pageKey === 'home' ? await getAllColumnPostsIncludingBlob(locale) : [];
    const site = await readSiteDocument('default', locale);

    return NextResponse.json({
      ok: true,
      revision: snapshot.snapshot.revision,
      targets: readBuilderPageDatasetOverviews(
        params.pageKey,
        snapshot.snapshot.document,
        locale,
        posts,
        { cmsCollections: site.cmsCollections },
      ),
    });
  } catch (error) {
    console.error('[builder-page-datasets:get] failed', error);
    return errorResponse(locale, 'page_dataset_load_failed', 500);
  }
}

export async function PUT(
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
  const limit =
    typeof record.limit === 'number' && Number.isFinite(record.limit)
      ? Math.trunc(record.limit)
      : undefined;
  const collectionId = typeof record.collectionId === 'string' ? record.collectionId : undefined;
  const cmsCollectionId = typeof record.cmsCollectionId === 'string' ? record.cmsCollectionId.trim() : undefined;
  const mode = typeof record.mode === 'string' ? record.mode : undefined;
  const filters = Array.isArray(record.filters) ? record.filters : undefined;
  const sort = Array.isArray(record.sort) ? record.sort : undefined;
  const expectedRevision = parseExpectedRevision(record);

  if (!targetId) {
    return errorResponse(locale, 'page_dataset_target_invalid', 400);
  }

  const bindableTargets = getBuilderBindableTargets(params.pageKey);
  if (!bindableTargets.some((target) => target.targetId === targetId)) {
    return errorResponse(locale, 'page_dataset_target_unapproved', 400);
  }

  const targetDefinition = getBuilderBindableTarget(targetId);

  // WIX-PERFECT #6 Slice 3: validate built-in vs user-CMS-collection bindings through the
  // shared pure helper. Built-in bindings keep their strict collection/mode checks; CMS
  // bindings carry cmsCollectionId (the user collection must exist on the site).
  const patchResult = buildDatasetBindingPatch(
    { targetId, collectionId, cmsCollectionId, mode, limit, filters, sort },
    { collectionIds: targetDefinition.collectionIds, modeOptions: targetDefinition.modeOptions },
  );
  if (!patchResult.ok) {
    return errorResponse(locale, datasetPatchErrorCode(patchResult.error), 400);
  }

  if (patchResult.isCmsCollection) {
    let site: Awaited<ReturnType<typeof readSiteDocument>>;
    try {
      site = await readSiteDocument('default', locale);
    } catch (error) {
      console.error('[builder-page-datasets:put] cms collection lookup failed', error);
      return errorResponse(locale, 'page_dataset_load_failed', 500);
    }
    if (!findCmsCollection(site, patchResult.patch.cmsCollectionId ?? '')) {
      return errorResponse(locale, 'page_dataset_cms_collection_not_found', 400);
    }
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

    const nextDocument = {
      ...draft.snapshot.document,
      datasets: replaceBuilderPageDatasetBinding(
        draft.snapshot.document.datasets,
        params.pageKey,
        targetId,
        {
          collectionId: patchResult.patch.collectionId as BuilderDatasetCollectionId,
          mode: patchResult.patch.mode as BuilderDatasetMode | undefined,
          filters: patchResult.patch.filters as BuilderPageDatasetFilter[] | undefined,
          sort: patchResult.patch.sort as BuilderPageDatasetSort[] | undefined,
          limit,
          ...(patchResult.patch.cmsCollectionId ? { cmsCollectionId: patchResult.patch.cmsCollectionId } : {}),
        }
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
    const site = await readSiteDocument('default', locale);

    return NextResponse.json({
      ok: true,
      revision: result.snapshot.revision,
      snapshot: result.snapshot,
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
        'page_dataset_save_conflict',
        409,
        currentRevisionPayload(error.conflict.currentSnapshot),
      );
    }

    console.error('[builder-page-datasets:put] failed', error);
    return errorResponse(locale, 'page_dataset_save_failed', 500);
  }
}
