import { NextRequest, NextResponse } from 'next/server';
import { getAllColumnPostsIncludingBlob } from '@/lib/consultation/columns-blob-reader';
import {
  getBuilderBindableTarget,
  getBuilderBindableTargets,
  isBuilderDatasetTargetId,
  readBuilderDatasetRepeaterItems,
  readBuilderDatasetSampleRecords,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import { readSiteDocument } from '@/lib/builder/site/persistence';
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
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
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
  const mode = typeof record.mode === 'string' ? record.mode : undefined;
  const filters = Array.isArray(record.filters) ? record.filters : undefined;
  const sort = Array.isArray(record.sort) ? record.sort : undefined;

  if (!targetId) {
    return errorResponse(locale, 'page_dataset_target_invalid', 400);
  }

  const bindableTargets = getBuilderBindableTargets(params.pageKey);
  if (!bindableTargets.some((target) => target.targetId === targetId)) {
    return errorResponse(locale, 'page_dataset_target_unapproved', 400);
  }

  const targetDefinition = getBuilderBindableTarget(targetId);
  const collectionIdValue = collectionId as BuilderDatasetCollectionId | undefined;
  const modeValue = mode as BuilderDatasetMode | undefined;

  if (typeof collectionIdValue !== 'string' || !targetDefinition.collectionIds.includes(collectionIdValue)) {
    return errorResponse(locale, 'page_dataset_collection_unapproved', 400);
  }

  if (typeof modeValue !== 'string' || !targetDefinition.modeOptions.includes(modeValue)) {
    return errorResponse(locale, 'page_dataset_mode_unapproved', 400);
  }

  if (typeof limit === 'number' && limit < 0) {
    return errorResponse(locale, 'page_dataset_limit_invalid', 400);
  }

  try {
    const draft = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
    const nextDatasets = replaceBuilderPageDatasetBinding(
      draft.snapshot.document.datasets,
      params.pageKey,
      targetId,
      {
        collectionId: collectionIdValue,
        mode: modeValue,
        filters: filters as BuilderPageDatasetFilter[] | undefined,
        sort: sort as BuilderPageDatasetSort[] | undefined,
        limit,
      }
    );
    const binding = nextDatasets.find((entry) => entry.targetId === targetId);
    if (!binding) {
      return errorResponse(locale, 'page_dataset_preview_binding_failed', 500);
    }

    const posts = params.pageKey === 'home' ? await getAllColumnPostsIncludingBlob(locale) : [];
    const site = await readSiteDocument('default', locale);
    const sampleRecords = readBuilderDatasetSampleRecords(
      targetId,
      binding,
      locale,
      posts,
      { cmsCollections: site.cmsCollections },
    );
    const repeaterItems = readBuilderDatasetRepeaterItems(
      targetId,
      binding,
      locale,
      posts,
      { cmsCollections: site.cmsCollections },
    );

    return NextResponse.json({
      ok: true,
      targetId,
      binding,
      sampleRecords,
      repeaterItems,
    });
  } catch (error) {
    console.error('[builder-page-datasets-preview:post] failed', error);
    return errorResponse(locale, 'page_dataset_preview_failed', 500);
  }
}
