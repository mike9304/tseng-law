import type { BuilderCmsAccessOptions } from '@/lib/builder/cms-editable';
import { normalizeBuilderCmsTrashedRecords } from '@/lib/builder/cms-record-trash-normalize';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  assertCmsRecordTrashAccess,
  findCmsRecordTrashCollectionState,
  normalizeTrashRecordIdList,
  resolveCmsRecordTrashActor,
  resolveCmsRecordTrashActorLabel,
  writeCmsRecordTrashCollection,
} from '@/lib/builder/cms-record-trash-support';
import {
  type BuilderCmsRecord,
  type BuilderCmsTrashedRecord,
} from '@/lib/builder/cms-types';
import { normalizeLocale } from '@/lib/locales';

export type BuilderCmsRecordTrashResult = {
  readonly requested: number;
  readonly trashed: number;
  readonly deleted: number;
  readonly records: readonly BuilderCmsRecord[];
  readonly trashedRecords: readonly BuilderCmsTrashedRecord[];
  readonly missingRecordIds: readonly string[];
};

export type BuilderCmsRecordTrashRestoreResult = {
  readonly requested: number;
  readonly restored: number;
  readonly records: readonly BuilderCmsRecord[];
  readonly trashedRecords: readonly BuilderCmsTrashedRecord[];
  readonly missingRecordIds: readonly string[];
  readonly skippedRecordIds: readonly string[];
};

export async function readEditableBuilderCmsCollectionTrash(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
): Promise<readonly BuilderCmsTrashedRecord[] | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = (site.cmsCollections ?? []).find((candidate) => candidate.collectionId === collectionId);
  return collection ? normalizeBuilderCmsTrashedRecords(collection.trashedRecords) : null;
}

export async function bulkTrashEditableBuilderCmsRecords(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordIdsInput: unknown,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsRecordTrashResult | null> {
  const recordIds = normalizeTrashRecordIdList(recordIdsInput);
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const rawCollections = site.cmsCollections ?? [];
  const collectionState = findCmsRecordTrashCollectionState(rawCollections, collectionId);
  if (!collectionState) return null;

  assertCmsRecordTrashAccess(collectionState.collection, 'delete', resolveCmsRecordTrashActor(options));
  const requestedRecordIds = new Set(recordIds);
  const foundRecordIds = new Set<string>();
  const trashedNow: BuilderCmsTrashedRecord[] = [];
  const now = new Date().toISOString();
  const records = collectionState.collection.records.filter((record) => {
    if (!requestedRecordIds.has(record.recordId)) return true;
    foundRecordIds.add(record.recordId);
    trashedNow.push({
      record,
      deletedAt: now,
      deletedBy: resolveCmsRecordTrashActorLabel(options),
    });
    return false;
  });
  const retainedTrash = collectionState.trashedRecords.filter(
    (entry) => !requestedRecordIds.has(entry.record.recordId),
  );
  const trashedRecords = [...retainedTrash, ...trashedNow];

  if (trashedNow.length > 0) {
    writeCmsRecordTrashCollection(site, rawCollections, collectionState.rawIndex, {
      ...collectionState.collection,
      records,
      trashedRecords,
      updatedAt: now,
    }, now);
    await writeSiteDocument(site);
  }

  return {
    requested: recordIds.length,
    trashed: trashedNow.length,
    deleted: trashedNow.length,
    records,
    trashedRecords: trashedNow,
    missingRecordIds: recordIds.filter((recordId) => !foundRecordIds.has(recordId)),
  };
}

export async function bulkRestoreTrashedEditableBuilderCmsRecords(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordIdsInput: unknown,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsRecordTrashRestoreResult | null> {
  const recordIds = normalizeTrashRecordIdList(recordIdsInput);
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const rawCollections = site.cmsCollections ?? [];
  const collectionState = findCmsRecordTrashCollectionState(rawCollections, collectionId);
  if (!collectionState) return null;

  assertCmsRecordTrashAccess(collectionState.collection, 'create', resolveCmsRecordTrashActor(options));
  const requestedRecordIds = new Set(recordIds);
  const activeRecordIds = new Set(collectionState.collection.records.map((record) => record.recordId));
  const foundTrashRecordIds = new Set<string>();
  const restoredRecords: BuilderCmsRecord[] = [];
  const skippedRecordIds: string[] = [];
  const now = new Date().toISOString();
  const trashedRecords = collectionState.trashedRecords.filter((entry) => {
    if (!requestedRecordIds.has(entry.record.recordId)) return true;
    foundTrashRecordIds.add(entry.record.recordId);
    if (activeRecordIds.has(entry.record.recordId)) {
      skippedRecordIds.push(entry.record.recordId);
      return true;
    }
    restoredRecords.push({
      ...entry.record,
      status: 'archived',
      updatedAt: now,
    });
    return false;
  });

  if (restoredRecords.length > 0) {
    writeCmsRecordTrashCollection(site, rawCollections, collectionState.rawIndex, {
      ...collectionState.collection,
      records: [...collectionState.collection.records, ...restoredRecords],
      trashedRecords,
      updatedAt: now,
    }, now);
    await writeSiteDocument(site);
  }

  return {
    requested: recordIds.length,
    restored: restoredRecords.length,
    records: restoredRecords,
    trashedRecords,
    missingRecordIds: recordIds.filter((recordId) => !foundTrashRecordIds.has(recordId)),
    skippedRecordIds,
  };
}
