import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { createBuilderDynamicListCanvasDocumentFromConfig } from '@/lib/builder/dynamic-list-page-canvas';
import {
  createCmsDynamicListCollectionConfig,
  getDynamicListCollectionConfig,
  getDynamicListDefaultSlug,
  getDynamicListDefaultTitle,
  isSupportedDynamicListCollectionId,
  type BuiltInDynamicListCollectionId,
  type DynamicListCollectionConfig,
} from '@/lib/builder/dynamic-list-page-config';
import {
  createDefaultBuilderPageDatasets,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import type { BuilderDynamicListPageMeta } from '@/lib/builder/site/types';
import type {
  BuilderDatasetTargetId,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

export {
  getDynamicListDefaultSlug,
  getDynamicListDefaultTitle,
  isSupportedDynamicListCollectionId,
  type BuiltInDynamicListCollectionId as SupportedDynamicListCollectionId,
};

export function createBuilderDynamicListPageMeta({
  collectionId,
  filters = [],
  sort = [],
  limit,
}: {
  collectionId: BuiltInDynamicListCollectionId;
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
}): BuilderDynamicListPageMeta {
  const config = getDynamicListCollectionConfig(collectionId);
  return createDynamicListMetaFromConfig({ config, filters, sort, limit });
}

export function createBuilderCmsDynamicListPageMeta({
  collection,
  filters = [],
  sort = [],
  limit,
}: {
  collection: BuilderCmsCollection;
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
}): BuilderDynamicListPageMeta {
  const config = createCmsDynamicListCollectionConfig(collection);
  return createDynamicListMetaFromConfig({ config, filters, sort, limit });
}

export function buildBuilderDynamicListDatasetDocument(
  dynamicList: BuilderDynamicListPageMeta,
) {
  const binding = resolveBuilderDynamicListDatasetBinding({
    collectionId: dynamicList.collectionId,
    targetId: dynamicList.targetId,
    cmsCollectionId: dynamicList.cmsCollectionId,
    filters: [...dynamicList.filters],
    sort: [...dynamicList.sort],
    limit: dynamicList.limit,
  });

  return {
    pageKey: 'home' as const,
    datasets: replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      binding.targetId,
      binding,
    ),
  };
}

export function createBuilderDynamicListCanvasDocument({
  collectionId,
  locale,
}: {
  collectionId: BuiltInDynamicListCollectionId;
  locale: Locale;
}) {
  return createBuilderDynamicListCanvasDocumentFromConfig({
    config: getDynamicListCollectionConfig(collectionId),
    locale,
  });
}

export function createBuilderCmsDynamicListCanvasDocument({
  collection,
  locale,
}: {
  collection: BuilderCmsCollection;
  locale: Locale;
}) {
  return createBuilderDynamicListCanvasDocumentFromConfig({
    config: createCmsDynamicListCollectionConfig(collection),
    locale,
  });
}

function createDynamicListMetaFromConfig({
  config,
  filters,
  sort,
  limit,
}: {
  config: DynamicListCollectionConfig;
  filters: BuilderPageDatasetFilter[];
  sort: BuilderPageDatasetSort[];
  limit?: number;
}): BuilderDynamicListPageMeta {
  const binding = resolveBuilderDynamicListDatasetBinding({
    collectionId: config.datasetCollectionId,
    targetId: config.targetId,
    cmsCollectionId: config.cmsCollectionId,
    filters,
    sort,
    limit: limit ?? config.defaultLimit,
  });

  return {
    kind: 'collection-list-v1',
    collectionId: config.datasetCollectionId,
    targetId: config.targetId,
    ...(config.cmsCollectionId ? { cmsCollectionId: config.cmsCollectionId } : {}),
    filters: binding.filters ?? [],
    sort: binding.sort ?? [],
    limit: binding.limit,
    createdAt: new Date().toISOString(),
  };
}

function resolveBuilderDynamicListDatasetBinding({
  collectionId,
  targetId,
  cmsCollectionId,
  filters,
  sort,
  limit,
}: {
  collectionId: BuiltInDynamicListCollectionId;
  targetId: BuilderDatasetTargetId;
  cmsCollectionId?: string;
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
}) {
  const datasets = replaceBuilderPageDatasetBinding(
    createDefaultBuilderPageDatasets('home'),
    'home',
    targetId,
    {
      collectionId,
      ...(cmsCollectionId ? { cmsCollectionId } : {}),
      filters,
      sort,
      limit,
    },
  );
  const binding = datasets.find((dataset) => dataset.targetId === targetId);
  if (!binding) {
    throw new Error(`Missing dynamic list dataset binding for ${targetId}`);
  }
  return binding;
}
