import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readBuilderCollectionRecordPreviews } from '@/lib/builder/cms';
import { createBuilderDynamicItemCanvasDocumentFromConfig } from '@/lib/builder/dynamic-item-page-canvas';
import {
  createCmsDynamicItemCollectionConfig,
  getCmsDynamicItemDefaultRecordSlug,
  getDynamicItemCollectionConfig,
  getDynamicItemDefaultSlug,
  getDynamicItemDefaultTitle,
  isSupportedDynamicItemCollectionId,
  type BuiltInDynamicItemCollectionId,
  type DynamicItemCollectionConfig,
} from '@/lib/builder/dynamic-item-page-config';
import {
  createDefaultBuilderPageDatasets,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import type { BuilderDynamicItemPageMeta } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

export {
  getDynamicItemDefaultSlug,
  getDynamicItemDefaultTitle,
  isSupportedDynamicItemCollectionId,
  type BuiltInDynamicItemCollectionId as SupportedDynamicItemCollectionId,
};

export function createBuilderDynamicItemPageMeta({
  collectionId,
  locale,
  recordSlug,
}: {
  collectionId: BuiltInDynamicItemCollectionId;
  locale: Locale;
  recordSlug?: string;
}): BuilderDynamicItemPageMeta {
  const config = getDynamicItemCollectionConfig(collectionId);
  const fallbackRecordSlug = readBuilderCollectionRecordPreviews(collectionId, locale)[0]?.recordId ?? 'sample';
  return createDynamicItemMetaFromConfig({ config, recordSlug, fallbackRecordSlug });
}

export function createBuilderCmsDynamicItemPageMeta({
  collection,
  recordSlug,
}: {
  collection: BuilderCmsCollection;
  recordSlug?: string;
}): BuilderDynamicItemPageMeta {
  const config = createCmsDynamicItemCollectionConfig(collection);
  const fallbackRecordSlug = getCmsDynamicItemDefaultRecordSlug(collection);
  return createDynamicItemMetaFromConfig({ config, recordSlug, fallbackRecordSlug });
}

function createDynamicItemMetaFromConfig({
  config,
  recordSlug,
  fallbackRecordSlug,
}: {
  config: DynamicItemCollectionConfig;
  recordSlug?: string;
  fallbackRecordSlug: string;
}): BuilderDynamicItemPageMeta {
  return {
    kind: 'collection-item-v1',
    collectionId: config.datasetCollectionId,
    targetId: config.targetId,
    ...(config.cmsCollectionId ? { cmsCollectionId: config.cmsCollectionId } : {}),
    slugField: config.slugField,
    defaultRecordSlug: normalizeDynamicItemRecordSlug(recordSlug) ?? fallbackRecordSlug,
    createdAt: new Date().toISOString(),
  };
}

export function buildBuilderDynamicItemDatasetDocument(
  dynamicItem: BuilderDynamicItemPageMeta,
  recordSlug?: string | null,
) {
  if (!isSupportedDynamicItemCollectionId(dynamicItem.collectionId)) {
    throw new Error(`Unsupported dynamic item collection: ${dynamicItem.collectionId}`);
  }
  const resolvedRecordSlug = normalizeDynamicItemRecordSlug(recordSlug) ?? dynamicItem.defaultRecordSlug;

  return {
    pageKey: 'home' as const,
    datasets: replaceBuilderPageDatasetBinding(
      createDefaultBuilderPageDatasets('home'),
      'home',
      dynamicItem.targetId,
      {
        collectionId: dynamicItem.collectionId,
        ...(dynamicItem.cmsCollectionId ? { cmsCollectionId: dynamicItem.cmsCollectionId } : {}),
        filters: [{ fieldId: dynamicItem.slugField, operator: 'equals', value: resolvedRecordSlug }],
        sort: [],
        limit: 1,
      },
    ),
  };
}

export function createBuilderDynamicItemCanvasDocument({
  collectionId,
  locale,
}: {
  collectionId: BuiltInDynamicItemCollectionId;
  locale: Locale;
}) {
  return createBuilderDynamicItemCanvasDocumentFromConfig({
    config: getDynamicItemCollectionConfig(collectionId),
    locale,
  });
}

export function createBuilderCmsDynamicItemCanvasDocument({
  collection,
  locale,
}: {
  collection: BuilderCmsCollection;
  locale: Locale;
}) {
  return createBuilderDynamicItemCanvasDocumentFromConfig({
    config: createCmsDynamicItemCollectionConfig(collection),
    locale,
  });
}

function normalizeDynamicItemRecordSlug(value: string | null | undefined): string | null {
  const normalized = value?.trim().replace(/^\/+|\/+$/g, '');
  if (!normalized || normalized.includes('/')) return null;
  return normalized.slice(0, 160);
}
