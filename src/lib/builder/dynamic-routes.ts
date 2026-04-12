import {
  isBuilderCollectionId,
  readBuilderCollectionRecordPreviews,
  readBuilderCollectionSummaries,
  type BuilderCollectionId,
  type BuilderCollectionRecordPreview,
} from '@/lib/builder/cms';
import {
  buildBuilderDynamicTemplateId,
  type BuilderDynamicTemplateId,
  type BuilderDynamicTemplateOwnerType,
} from '@/lib/builder/dynamic-templates';
import { normalizeLocale } from '@/lib/locales';

export const builderDynamicRouteIds = [
  'columns.list',
  'columns.item',
  'service-areas.list',
  'service-areas.item',
  'attorney-profiles.list',
  'attorney-profiles.item',
] as const;

export type BuilderDynamicRouteId = (typeof builderDynamicRouteIds)[number];
export type BuilderDynamicRouteKind = 'list' | 'item';

export interface BuilderDynamicRouteSummary {
  routeId: BuilderDynamicRouteId;
  templateId: BuilderDynamicTemplateId;
  collectionId: BuilderCollectionId;
  collectionTitle: string;
  kind: BuilderDynamicRouteKind;
  title: string;
  notes: string;
  pathPattern: string;
  localized: boolean;
  recordCount: number;
  previewContextMode: 'collection-only' | 'record-required';
  templateOwnerType: BuilderDynamicTemplateOwnerType;
  templateStatus: 'code-owned-read-only';
  sourceStatus: 'live-static-source';
}

export interface BuilderDynamicRoutePreviewContext {
  status: 'collection-only' | 'selection-required' | 'record-selected' | 'record-missing';
  selectedRecordId: string | null;
  resolvedPath: string | null;
  summary: string;
  note: string;
}

export interface BuilderDynamicRouteDetail extends BuilderDynamicRouteSummary {
  sampleRecords: BuilderCollectionRecordPreview[];
  previewContext: BuilderDynamicRoutePreviewContext;
}

export interface BuilderSiteDynamicRouteEntry {
  routeId: BuilderDynamicRouteId;
  templateId: BuilderDynamicTemplateId;
  collectionId: BuilderCollectionId;
  kind: BuilderDynamicRouteKind;
  pathPattern: string;
  previewContextMode: 'collection-only' | 'record-required';
  templateOwnerType: BuilderDynamicTemplateOwnerType;
  templateStatus: 'code-owned-read-only';
}

type BuilderDynamicRouteDefinition = {
  routeId: BuilderDynamicRouteId;
  collectionId: BuilderCollectionId;
  kind: BuilderDynamicRouteKind;
};

const builderDynamicRouteDefinitions: readonly BuilderDynamicRouteDefinition[] =
  builderDynamicRouteIds.map((routeId) => {
    const [collectionId, kind] = routeId.split('.') as [BuilderCollectionId, BuilderDynamicRouteKind];
    return {
      routeId,
      collectionId,
      kind,
    };
  });

export function isBuilderDynamicRouteId(
  value: string | null | undefined
): value is BuilderDynamicRouteId {
  return builderDynamicRouteIds.includes(value as BuilderDynamicRouteId);
}

export function decodeBuilderDynamicRouteParam(value: string): BuilderDynamicRouteId | null {
  try {
    const decoded = decodeURIComponent(value);
    return isBuilderDynamicRouteId(decoded) ? decoded : null;
  } catch {
    return null;
  }
}

export function buildBuilderDynamicRouteId(
  collectionId: BuilderCollectionId,
  kind: BuilderDynamicRouteKind
) {
  const routeId = `${collectionId}.${kind}`;
  if (!isBuilderDynamicRouteId(routeId)) {
    throw new Error(`Unknown builder dynamic route id: ${routeId}`);
  }

  return routeId;
}

export function readBuilderDynamicRouteSummaries(
  localeInput: string | null | undefined
): BuilderDynamicRouteSummary[] {
  const locale = normalizeLocale(localeInput ?? undefined);
  const collectionSummaries = new Map(
    readBuilderCollectionSummaries(locale).map((summary) => [summary.id, summary] as const)
  );

  return builderDynamicRouteDefinitions.map((definition) => {
    const collection = collectionSummaries.get(definition.collectionId);
    if (!collection) {
      throw new Error(`Missing collection summary for dynamic route ${definition.routeId}`);
    }

    const routeBinding = collection.routeBindings.find((binding) => binding.kind === definition.kind);
    if (!routeBinding) {
      throw new Error(`Missing route binding for dynamic route ${definition.routeId}`);
    }

    return {
      routeId: definition.routeId,
      templateId: buildBuilderDynamicTemplateId(definition.collectionId, definition.kind),
      collectionId: definition.collectionId,
      collectionTitle: collection.title,
      kind: definition.kind,
      title: `${collection.title} ${definition.kind === 'list' ? 'list route' : 'item route'}`,
      notes: routeBinding.notes,
      pathPattern: routeBinding.pathPattern,
      localized: collection.localized,
      recordCount: collection.recordCount,
      previewContextMode: definition.kind === 'list' ? 'collection-only' : 'record-required',
      templateOwnerType: 'code-route',
      templateStatus: 'code-owned-read-only',
      sourceStatus: 'live-static-source',
    };
  });
}

export function readBuilderDynamicRouteDetail(
  routeId: BuilderDynamicRouteId,
  localeInput: string | null | undefined,
  previewRecordId?: string | null
): BuilderDynamicRouteDetail {
  const locale = normalizeLocale(localeInput ?? undefined);
  const summary = readBuilderDynamicRouteSummaries(locale).find((route) => route.routeId === routeId);

  if (!summary) {
    throw new Error(`Unknown builder dynamic route detail: ${routeId}`);
  }

  const allRecords = readBuilderCollectionRecordPreviews(summary.collectionId, locale);
  const normalizedPreviewRecordId = parseBuilderDynamicRoutePreviewRecordId(
    routeId,
    previewRecordId
  );
  const selectedRecord =
    normalizedPreviewRecordId
      ? allRecords.find((record) => record.recordId === normalizedPreviewRecordId) ?? null
      : null;
  const sampleRecordsBase = summary.kind === 'item' ? allRecords.slice(0, 8) : allRecords.slice(0, 4);
  const sampleRecords =
    selectedRecord && !sampleRecordsBase.some((record) => record.recordId === selectedRecord.recordId)
      ? [selectedRecord, ...sampleRecordsBase].slice(0, summary.kind === 'item' ? 8 : 4)
      : sampleRecordsBase;

  return {
    ...summary,
    sampleRecords,
    previewContext: resolveBuilderDynamicRoutePreviewContext(
      summary,
      allRecords,
      normalizedPreviewRecordId
    ),
  };
}

export function readBuilderDynamicRouteEntries(
  localeInput: string | null | undefined
): BuilderSiteDynamicRouteEntry[] {
  return readBuilderDynamicRouteSummaries(localeInput).map((route) => ({
    routeId: route.routeId,
    templateId: route.templateId,
    collectionId: route.collectionId,
    kind: route.kind,
    pathPattern: route.pathPattern,
    previewContextMode: route.previewContextMode,
    templateOwnerType: route.templateOwnerType,
    templateStatus: route.templateStatus,
  }));
}

export function readBuilderDynamicRoutesForCollection(
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined
) {
  return readBuilderDynamicRouteSummaries(localeInput).filter((route) => route.collectionId === collectionId);
}

export function parseBuilderDynamicRoutePreviewRecordId(
  routeId: BuilderDynamicRouteId,
  previewRecordId: string | null | undefined
) {
  if (!previewRecordId || !previewRecordId.trim()) {
    return null;
  }

  const normalized = previewRecordId.trim();
  const [collectionId] = routeId.split('.') as [BuilderCollectionId, BuilderDynamicRouteKind];
  if (!isBuilderCollectionId(collectionId)) {
    return null;
  }

  return normalized;
}

function resolveBuilderDynamicRoutePreviewContext(
  route: BuilderDynamicRouteSummary,
  allRecords: BuilderCollectionRecordPreview[],
  previewRecordId: string | null
): BuilderDynamicRoutePreviewContext {
  if (route.kind === 'list') {
    return {
      status: 'collection-only',
      selectedRecordId: null,
      resolvedPath: route.pathPattern,
      summary: 'Collection route preview',
      note: 'List routes do not require a concrete record context in this batch.',
    };
  }

  if (!previewRecordId) {
    return {
      status: 'selection-required',
      selectedRecordId: null,
      resolvedPath: null,
      summary: 'Preview record required',
      note: 'Choose one of the sample records below to resolve an item-route preview context.',
    };
  }

  const selectedRecord = allRecords.find((record) => record.recordId === previewRecordId) ?? null;
  if (!selectedRecord) {
    return {
      status: 'record-missing',
      selectedRecordId: previewRecordId,
      resolvedPath: null,
      summary: 'Preview record not found',
      note: 'The selected preview record is not available in the current sample set.',
    };
  }

  return {
    status: 'record-selected',
    selectedRecordId: selectedRecord.recordId,
    resolvedPath: selectedRecord.routePath,
    summary: selectedRecord.primaryLabel,
    note: selectedRecord.secondaryLabel,
  };
}
