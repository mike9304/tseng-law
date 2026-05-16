import { isBuilderCollectionId } from '@/lib/builder/cms';
import {
  queryBuilderCmsRecords,
  stringifyBuilderCmsRecordValue,
} from '@/lib/builder/cms-record-query';
import { parseBuilderAssetUrl, readBuilderImageAsset } from '@/lib/builder/assets';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  builderCmsFieldTypes,
  builderCmsPermissionActors,
  type BuilderCmsCollection,
  type BuilderCmsCollectionDetail,
  type BuilderCmsCollectionSummary,
  type BuilderCmsFieldDefinition,
  type BuilderCmsFieldValidation,
  type BuilderCmsFieldType,
  type BuilderCmsImageValue,
  type BuilderCmsIndexDefinition,
  type BuilderCmsIndexField,
  type BuilderCmsPermissionActor,
  type BuilderCmsPermissions,
  type BuilderCmsRecord,
  type BuilderCmsRecordRevisionDiff,
  type BuilderCmsRecordRevision,
  type BuilderCmsRecordRevisionAction,
  type BuilderCmsRecordStatus,
} from '@/lib/builder/cms-types';
import { normalizeLocale } from '@/lib/locales';

export class BuilderCmsValidationError extends Error {
  constructor(message: string, public readonly issues: string[] = [message]) {
    super(message);
    this.name = 'BuilderCmsValidationError';
  }
}

export class BuilderCmsPermissionError extends Error {
  constructor(
    public readonly action: BuilderCmsPermissionAction,
    public readonly actor: BuilderCmsPermissionActor,
  ) {
    super(`CMS permission denied for ${actor} to ${action} records.`);
    this.name = 'BuilderCmsPermissionError';
  }
}

type CollectionInput = {
  collectionId?: unknown;
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  localized?: unknown;
  fields?: unknown;
  indexes?: unknown;
  permissions?: unknown;
};

type CollectionPatchInput = Partial<CollectionInput>;

type RecordInput = {
  recordId?: unknown;
  status?: unknown;
  locale?: unknown;
  fields?: unknown;
};

export type BuilderCmsPermissionAction = keyof BuilderCmsPermissions;
export type BuilderCmsRecordSortDirection = 'asc' | 'desc';

export interface BuilderCmsAccessOptions {
  actor?: BuilderCmsPermissionActor;
  actorLabel?: string;
}

export interface BuilderCmsRecordListOptions {
  query?: string;
  sortBy?: string;
  sortDirection?: BuilderCmsRecordSortDirection;
}

export type BuilderCmsCsvImportMode = 'append' | 'replace';
export type BuilderCmsCsvColumnMap = Record<string, string>;

export interface BuilderCmsCsvImportOptions {
  mode?: BuilderCmsCsvImportMode;
  actor?: BuilderCmsPermissionActor;
  columnMap?: BuilderCmsCsvColumnMap;
}

export interface BuilderCmsCsvExportResult {
  filename: string;
  csv: string;
}

export interface BuilderCmsCsvImportResult {
  imported: number;
  mode: BuilderCmsCsvImportMode;
  records: BuilderCmsRecord[];
  summary: BuilderCmsCsvImportSummary;
}

export interface BuilderCmsCsvImportSummary {
  headers: string[];
  mappedColumns: { target: string; source: string }[];
  skippedColumns: string[];
}

export interface BuilderCmsBulkStatusResult {
  requested: number;
  updated: number;
  records: BuilderCmsRecord[];
  missingRecordIds: string[];
}

export interface BuilderCmsBulkDeleteResult {
  requested: number;
  deleted: number;
  records: BuilderCmsRecord[];
  missingRecordIds: string[];
}

let generatedIdCounter = 0;

export function defaultBuilderCmsPermissions(): BuilderCmsPermissions {
  return {
    read: ['admin'],
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
  };
}

export function canAccessBuilderCmsCollection(
  collection: Pick<BuilderCmsCollection, 'permissions'>,
  action: BuilderCmsPermissionAction,
  actor: BuilderCmsPermissionActor,
): boolean {
  return normalizePermissions(collection.permissions)[action].includes(actor);
}

export async function listEditableBuilderCmsCollections(
  siteId: string,
  localeInput: string | null | undefined,
): Promise<BuilderCmsCollectionSummary[]> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  return normalizeCmsCollections(site.cmsCollections).map(toCollectionSummary);
}

export async function readEditableBuilderCmsCollection(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsCollectionDetail | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = normalizeCmsCollections(site.cmsCollections).find(
    (candidate) => candidate.collectionId === collectionId,
  );
  if (collection) assertCmsPermission(collection, 'read', resolveCmsActor(options));
  return collection ? toCollectionDetail(collection) : null;
}

export async function createEditableBuilderCmsCollection(
  siteId: string,
  localeInput: string | null | undefined,
  input: CollectionInput,
): Promise<BuilderCmsCollectionDetail> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collection = createCollectionFromInput(input, collections);
  site.cmsCollections = [...collections, collection];
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return toCollectionDetail(collection);
}

export async function updateEditableBuilderCmsCollection(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  input: CollectionPatchInput,
): Promise<BuilderCmsCollectionDetail | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const index = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (index === -1) return null;

  const next = updateCollectionFromInput(collections[index], input, collections);
  await assertCollectionMediaAssetsExist(next);
  site.cmsCollections = collections.map((collection, candidateIndex) => (
    candidateIndex === index ? next : collection
  ));
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return toCollectionDetail(next);
}

export async function deleteEditableBuilderCmsCollection(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
): Promise<boolean> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const nextCollections = collections.filter((collection) => collection.collectionId !== collectionId);
  if (nextCollections.length === collections.length) return false;
  site.cmsCollections = nextCollections;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  return true;
}

export async function createEditableBuilderCmsRecord(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  input: RecordInput,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const index = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const recordId = normalizeOptionalId(input.recordId, 'recordId') ?? generateEntityId('record');
  const collection = collections[index];
  assertCmsPermission(collection, 'create', resolveCmsActor(options));
  ensureUniqueRecordId(collection, recordId);
  const fields = validateRecordFields(collection, input.fields, { recordId });
  await assertRecordMediaAssetsExist(collection, fields);
  const record: BuilderCmsRecord = {
    recordId,
    status: normalizeRecordStatus(input.status),
    locale: input.locale ? normalizeLocale(String(input.locale)) : undefined,
    fields,
    createdAt: now,
    updatedAt: now,
  };
  const nextCollection = {
    ...collection,
    records: [...collection.records, record],
    updatedAt: now,
  };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === index ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return record;
}

export async function updateEditableBuilderCmsRecord(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordId: string,
  input: RecordInput,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  assertCmsPermission(collection, 'update', resolveCmsActor(options));
  const recordIndex = collection.records.findIndex((candidate) => candidate.recordId === recordId);
  if (recordIndex === -1) return null;

  const now = new Date().toISOString();
  const previous = collection.records[recordIndex];
  const fields = validateRecordFields(collection, input.fields ?? previous.fields, { recordId });
  await assertRecordMediaAssetsExist(collection, fields);
  const status = input.status ? normalizeRecordStatus(input.status) : previous.status;
  const nextLocale = input.locale ? normalizeLocale(String(input.locale)) : previous.locale;
  const nextRecord: BuilderCmsRecord = {
    ...previous,
    status,
    locale: nextLocale,
    fields,
    revisions: appendRecordRevision(previous, 'update', { status, locale: nextLocale, fields }, options),
    updatedAt: now,
  };
  const nextCollection = {
    ...collection,
    records: collection.records.map((candidate, candidateIndex) => (
      candidateIndex === recordIndex ? nextRecord : candidate
    )),
    updatedAt: now,
  };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return nextRecord;
}

export async function restoreEditableBuilderCmsRecordRevision(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordId: string,
  revisionId: string,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  assertCmsPermission(collection, 'update', resolveCmsActor(options));
  const recordIndex = collection.records.findIndex((candidate) => candidate.recordId === recordId);
  if (recordIndex === -1) return null;

  const current = collection.records[recordIndex];
  const revision = normalizeRecordRevisions(current.revisions).find(
    (candidate) => candidate.revisionId === revisionId,
  );
  if (!revision) return null;

  const now = new Date().toISOString();
  const fields = validateRecordFields(collection, revision.fields, { recordId });
  await assertRecordMediaAssetsExist(collection, fields);
  const nextRecord: BuilderCmsRecord = {
    ...current,
    status: revision.status,
    locale: revision.locale,
    fields,
    revisions: appendRecordRevision(current, 'restore', {
      status: revision.status,
      locale: revision.locale,
      fields,
    }, options),
    updatedAt: now,
  };
  const nextCollection = {
    ...collection,
    records: collection.records.map((candidate, candidateIndex) => (
      candidateIndex === recordIndex ? nextRecord : candidate
    )),
    updatedAt: now,
  };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return nextRecord;
}

export async function duplicateEditableBuilderCmsRecord(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordId: string,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  const actor = resolveCmsActor(options);
  assertCmsPermission(collection, 'read', actor);
  assertCmsPermission(collection, 'create', actor);
  const source = collection.records.find((candidate) => candidate.recordId === recordId);
  if (!source) return null;

  const now = new Date().toISOString();
  const nextRecordId = generateUniqueRecordId(collection);
  const fields = buildDuplicateRecordFields(collection, source, nextRecordId);
  await assertRecordMediaAssetsExist(collection, fields);
  const record: BuilderCmsRecord = {
    recordId: nextRecordId,
    status: 'draft',
    locale: source.locale,
    fields,
    createdAt: now,
    updatedAt: now,
  };
  const nextCollection = {
    ...collection,
    records: [...collection.records, record],
    updatedAt: now,
  };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return record;
}

export async function deleteEditableBuilderCmsRecord(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordId: string,
  options: BuilderCmsAccessOptions = {},
): Promise<boolean> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return false;

  const collection = collections[collectionIndex];
  assertCmsPermission(collection, 'delete', resolveCmsActor(options));
  const records = collection.records.filter((record) => record.recordId !== recordId);
  if (records.length === collection.records.length) return false;
  const now = new Date().toISOString();
  const nextCollection = { ...collection, records, updatedAt: now };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return true;
}

export async function bulkUpdateEditableBuilderCmsRecordStatus(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordIdsInput: unknown,
  statusInput: unknown,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsBulkStatusResult | null> {
  const recordIds = normalizeRecordIdList(recordIdsInput);
  const status = normalizeRecordStatusStrict(statusInput);
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  assertCmsPermission(collection, 'update', resolveCmsActor(options));
  const requestedRecordIds = new Set(recordIds);
  const foundRecordIds = new Set<string>();
  const validatedFields = new Map<string, Record<string, unknown>>();

  for (const record of collection.records) {
    if (!requestedRecordIds.has(record.recordId)) continue;
    foundRecordIds.add(record.recordId);
    const fields = validateRecordFields(collection, record.fields, { recordId: record.recordId });
    await assertRecordMediaAssetsExist(collection, fields);
    validatedFields.set(record.recordId, fields);
  }

  const now = new Date().toISOString();
  let updated = 0;
  const records = collection.records.map((record) => {
    if (!requestedRecordIds.has(record.recordId)) return record;
    const fields = validatedFields.get(record.recordId) ?? record.fields;
    if (record.status === status) return { ...record, fields };
    updated += 1;
    return {
      ...record,
      status,
      fields,
      revisions: appendRecordRevision(record, 'update', { status, locale: record.locale, fields }, options),
      updatedAt: now,
    };
  });

  if (updated > 0) {
    const nextCollection = { ...collection, records, updatedAt: now };
    site.cmsCollections = collections.map((candidate, candidateIndex) => (
      candidateIndex === collectionIndex ? nextCollection : candidate
    ));
    site.updatedAt = now;
    await writeSiteDocument(site);
  }

  return {
    requested: recordIds.length,
    updated,
    records: records.filter((record) => requestedRecordIds.has(record.recordId)),
    missingRecordIds: recordIds.filter((recordId) => !foundRecordIds.has(recordId)),
  };
}

export async function bulkDeleteEditableBuilderCmsRecords(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordIdsInput: unknown,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsBulkDeleteResult | null> {
  const recordIds = normalizeRecordIdList(recordIdsInput);
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  assertCmsPermission(collection, 'delete', resolveCmsActor(options));
  const requestedRecordIds = new Set(recordIds);
  const foundRecordIds = new Set<string>();
  const records = collection.records.filter((record) => {
    if (!requestedRecordIds.has(record.recordId)) return true;
    foundRecordIds.add(record.recordId);
    return false;
  });
  const deleted = collection.records.length - records.length;

  if (deleted > 0) {
    const now = new Date().toISOString();
    const nextCollection = { ...collection, records, updatedAt: now };
    site.cmsCollections = collections.map((candidate, candidateIndex) => (
      candidateIndex === collectionIndex ? nextCollection : candidate
    ));
    site.updatedAt = now;
    await writeSiteDocument(site);
  }

  return {
    requested: recordIds.length,
    deleted,
    records,
    missingRecordIds: recordIds.filter((recordId) => !foundRecordIds.has(recordId)),
  };
}

export function filterAndSortBuilderCmsRecords(
  records: BuilderCmsRecord[],
  fields: BuilderCmsFieldDefinition[],
  options: BuilderCmsRecordListOptions = {},
): BuilderCmsRecord[] {
  return queryBuilderCmsRecords(records, fields, {
    ...options,
    pageSize: Math.max(1, records.length),
  }).records;
}

export async function exportEditableBuilderCmsRecordsCsv(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  options: BuilderCmsAccessOptions = {},
): Promise<BuilderCmsCsvExportResult | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = normalizeCmsCollections(site.cmsCollections).find(
    (candidate) => candidate.collectionId === collectionId,
  );
  if (!collection) return null;
  assertCmsPermission(collection, 'read', resolveCmsActor(options));

  const headers = csvHeadersForCollection(collection);
  const rows = collection.records.map((record) => headers.map((header) => csvRecordCell(collection, record, header)));
  return {
    filename: `${collection.slug || collection.collectionId}-records.csv`,
    csv: stringifyCsv([headers, ...rows]),
  };
}

export async function importEditableBuilderCmsRecordsCsv(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  csvText: string,
  options: BuilderCmsCsvImportOptions = {},
): Promise<BuilderCmsCsvImportResult | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  const actor = resolveCmsActor(options);
  assertCmsPermission(collection, 'create', actor);
  const mode: BuilderCmsCsvImportMode = options.mode === 'replace' ? 'replace' : 'append';
  if (mode === 'replace') assertCmsPermission(collection, 'delete', actor);
  const importResult = await buildImportedCsvRecords(collection, csvText, mode, options.columnMap);
  const now = new Date().toISOString();
  const nextCollection: BuilderCmsCollection = {
    ...collection,
    records: mode === 'replace' ? importResult.records : [...collection.records, ...importResult.records],
    updatedAt: now,
  };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return {
    imported: importResult.records.length,
    mode,
    records: importResult.records,
    summary: importResult.summary,
  };
}

export function normalizeCmsCollections(input: unknown): BuilderCmsCollection[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Partial<BuilderCmsCollection> => !!item && typeof item === 'object')
    .map((collection) => {
      const fields = normalizeFieldDefinitions(collection.fields);
      return {
        collectionId: normalizeRequiredId(collection.collectionId, 'collectionId'),
        name: normalizeRequiredString(collection.name, 'name'),
        slug: normalizeSlug(collection.slug ?? collection.name ?? collection.collectionId),
        description: typeof collection.description === 'string' ? collection.description : '',
        localized: Boolean(collection.localized),
        fields,
        indexes: normalizeIndexDefinitions(collection.indexes, fields, { useDefaults: true }),
        records: normalizeRecords(collection.records),
        permissions: normalizePermissions(collection.permissions),
        createdAt: normalizeTimestamp(collection.createdAt),
        updatedAt: normalizeTimestamp(collection.updatedAt),
      };
    });
}

function createCollectionFromInput(
  input: CollectionInput,
  existingCollections: BuilderCmsCollection[],
): BuilderCmsCollection {
  const now = new Date().toISOString();
  const name = normalizeRequiredString(input.name, 'name');
  const collectionId = normalizeOptionalId(input.collectionId, 'collectionId') ?? normalizeSlug(name);
  if (isBuilderCollectionId(collectionId)) {
    throw new BuilderCmsValidationError('Static source collection IDs are reserved.');
  }
  ensureUniqueCollectionId(existingCollections, collectionId);
  const fields = normalizeFieldDefinitions(input.fields, { useDefaults: true });

  return {
    collectionId,
    name,
    slug: normalizeSlug(input.slug ?? collectionId),
    description: typeof input.description === 'string' ? input.description : '',
    localized: Boolean(input.localized),
    fields,
    indexes: normalizeIndexDefinitions(input.indexes, fields, { useDefaults: true }),
    records: [],
    permissions: normalizePermissions(input.permissions),
    createdAt: now,
    updatedAt: now,
  };
}

function updateCollectionFromInput(
  current: BuilderCmsCollection,
  input: CollectionPatchInput,
  allCollections: BuilderCmsCollection[],
): BuilderCmsCollection {
  const name = input.name === undefined ? current.name : normalizeRequiredString(input.name, 'name');
  const collectionId = input.collectionId === undefined
    ? current.collectionId
    : normalizeRequiredId(input.collectionId, 'collectionId');
  if (collectionId !== current.collectionId) {
    if (isBuilderCollectionId(collectionId)) {
      throw new BuilderCmsValidationError('Static source collection IDs are reserved.');
    }
    ensureUniqueCollectionId(
      allCollections.filter((collection) => collection.collectionId !== current.collectionId),
      collectionId,
    );
  }

  const fields = input.fields === undefined
    ? current.fields
    : normalizeFieldDefinitions(input.fields, { useDefaults: false });
  const next: BuilderCmsCollection = {
    ...current,
    collectionId,
    name,
    slug: input.slug === undefined ? current.slug : normalizeSlug(input.slug),
    description: input.description === undefined
      ? current.description
      : String(input.description ?? ''),
    localized: input.localized === undefined ? current.localized : Boolean(input.localized),
    fields,
    indexes: input.indexes === undefined
      ? normalizeIndexDefinitions(current.indexes, fields, { useDefaults: true })
      : normalizeIndexDefinitions(input.indexes, fields, { useDefaults: false }),
    permissions: input.permissions === undefined
      ? current.permissions
      : normalizePermissions(input.permissions),
    updatedAt: new Date().toISOString(),
  };

  for (const record of next.records) {
    validateRecordFields(next, record.fields, { recordId: record.recordId });
  }

  return next;
}

function toCollectionSummary(collection: BuilderCmsCollection): BuilderCmsCollectionSummary {
  return {
    collectionId: collection.collectionId,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    localized: collection.localized,
    fieldCount: collection.fields.length,
    indexCount: collection.indexes.length,
    recordCount: collection.records.length,
    permissions: collection.permissions,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

function toCollectionDetail(collection: BuilderCmsCollection): BuilderCmsCollectionDetail {
  return {
    ...toCollectionSummary(collection),
    fields: collection.fields,
    indexes: collection.indexes,
    records: collection.records,
  };
}

function defaultFields(): BuilderCmsFieldDefinition[] {
  return [
    {
      fieldId: 'field-title',
      key: 'title',
      label: 'Title',
      type: 'text',
      localized: true,
      repeated: false,
      required: true,
      unique: false,
    },
    {
      fieldId: 'field-slug',
      key: 'slug',
      label: 'Slug',
      type: 'slug',
      localized: false,
      repeated: false,
      required: true,
      unique: true,
    },
  ];
}

function normalizeFieldDefinitions(
  input: unknown,
  options: { useDefaults?: boolean } = {},
): BuilderCmsFieldDefinition[] {
  if (!Array.isArray(input) || input.length === 0) {
    if (options.useDefaults) return defaultFields();
    throw new BuilderCmsValidationError('At least one field is required.');
  }

  const seenKeys = new Set<string>();
  return input.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new BuilderCmsValidationError(`Field ${index + 1} must be an object.`);
    }
    const source = item as Partial<BuilderCmsFieldDefinition>;
    const key = normalizeFieldKey(source.key, `fields[${index}].key`);
    if (seenKeys.has(key)) {
      throw new BuilderCmsValidationError(`Duplicate field key: ${key}`);
    }
    seenKeys.add(key);
    const field: BuilderCmsFieldDefinition = {
      fieldId: normalizeOptionalId(source.fieldId, `fields[${index}].fieldId`) ?? generateEntityId('field'),
      key,
      label: normalizeRequiredString(source.label ?? key, `fields[${index}].label`),
      type: normalizeFieldType(source.type),
      localized: Boolean(source.localized),
      repeated: Boolean(source.repeated),
      required: Boolean(source.required),
      unique: Boolean(source.unique),
      helpText: normalizeOptionalFieldText(source.helpText, 240),
      validation: normalizeFieldValidation(source.validation, index),
      relationCollectionId: typeof source.relationCollectionId === 'string'
        ? normalizeRequiredId(source.relationCollectionId, `fields[${index}].relationCollectionId`)
        : undefined,
    };
    return {
      ...field,
      defaultValue: normalizeFieldDefaultValue(field, source.defaultValue, index),
    };
  });
}

function normalizeFieldValidation(input: unknown, fieldIndex: number): BuilderCmsFieldValidation | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const source = input as Partial<BuilderCmsFieldValidation>;
  const validation: BuilderCmsFieldValidation = {};
  const min = normalizeOptionalNumber(source.min, `fields[${fieldIndex}].validation.min`);
  const max = normalizeOptionalNumber(source.max, `fields[${fieldIndex}].validation.max`);
  if (min !== undefined) validation.min = min;
  if (max !== undefined) validation.max = max;
  if (min !== undefined && max !== undefined && min > max) {
    throw new BuilderCmsValidationError(`fields[${fieldIndex}].validation.min must be less than or equal to max.`);
  }
  if (typeof source.pattern === 'string' && source.pattern.trim()) {
    try {
      new RegExp(source.pattern.trim());
    } catch {
      throw new BuilderCmsValidationError(`fields[${fieldIndex}].validation.pattern must be a valid regex.`);
    }
    validation.pattern = source.pattern.trim();
  }
  const options = normalizeValidationOptions(source.options);
  if (options.length > 0) validation.options = options;
  return Object.keys(validation).length > 0 ? validation : undefined;
}

function normalizeFieldDefaultValue(
  field: BuilderCmsFieldDefinition,
  input: unknown,
  fieldIndex: number,
): unknown {
  if (input === undefined || input === null || input === '') return undefined;
  try {
    return coerceFieldValue(field, input);
  } catch (error) {
    throw new BuilderCmsValidationError(
      `fields[${fieldIndex}].defaultValue is invalid.`,
      [error instanceof Error ? error.message : `fields[${fieldIndex}].defaultValue is invalid.`],
    );
  }
}

function defaultIndexDefinitions(fields: BuilderCmsFieldDefinition[]): BuilderCmsIndexDefinition[] {
  return fields
    .filter((field) => field.unique)
    .map((field) => ({
      indexId: `idx-${field.key}`,
      name: `${field.label} unique`,
      fields: [{ fieldKey: field.key, direction: 'asc' as const }],
      unique: true,
      createdAt: new Date(0).toISOString(),
    }));
}

function normalizeIndexDefinitions(
  input: unknown,
  fields: BuilderCmsFieldDefinition[],
  options: { useDefaults?: boolean } = {},
): BuilderCmsIndexDefinition[] {
  if (!Array.isArray(input) || input.length === 0) {
    return options.useDefaults ? defaultIndexDefinitions(fields) : [];
  }

  const fieldKeys = new Set(fields.map((field) => field.key));
  const seenIndexIds = new Set<string>();
  return input.map((item, index) => {
    if (!item || typeof item !== 'object') {
      throw new BuilderCmsValidationError(`Index ${index + 1} must be an object.`);
    }
    const source = item as Partial<BuilderCmsIndexDefinition>;
    const indexId = normalizeOptionalId(source.indexId, `indexes[${index}].indexId`)
      ?? generateEntityId('index');
    if (seenIndexIds.has(indexId)) {
      throw new BuilderCmsValidationError(`Duplicate index ID: ${indexId}`);
    }
    seenIndexIds.add(indexId);
    const indexFields = normalizeIndexFields(source.fields, fieldKeys, index);
    return {
      indexId,
      name: normalizeRequiredString(source.name ?? indexId, `indexes[${index}].name`),
      fields: indexFields,
      unique: Boolean(source.unique),
      createdAt: normalizeTimestamp(source.createdAt),
    };
  });
}

function normalizeIndexFields(
  input: unknown,
  fieldKeys: Set<string>,
  index: number,
): BuilderCmsIndexField[] {
  if (!Array.isArray(input) || input.length === 0) {
    throw new BuilderCmsValidationError(`Index ${index + 1} must include at least one field.`);
  }

  const seenFieldKeys = new Set<string>();
  return input.map((item, fieldIndex) => {
    if (!item || typeof item !== 'object') {
      throw new BuilderCmsValidationError(`Index ${index + 1} field ${fieldIndex + 1} must be an object.`);
    }
    const source = item as Partial<BuilderCmsIndexField>;
    const fieldKey = normalizeFieldKey(source.fieldKey, `indexes[${index}].fields[${fieldIndex}].fieldKey`);
    if (!fieldKeys.has(fieldKey)) {
      throw new BuilderCmsValidationError(`Index ${index + 1} references an unknown field: ${fieldKey}`);
    }
    if (seenFieldKeys.has(fieldKey)) {
      throw new BuilderCmsValidationError(`Index ${index + 1} repeats field: ${fieldKey}`);
    }
    seenFieldKeys.add(fieldKey);
    return {
      fieldKey,
      direction: source.direction === 'desc' ? 'desc' : 'asc',
    };
  });
}

function normalizeRecords(input: unknown): BuilderCmsRecord[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Partial<BuilderCmsRecord> => !!item && typeof item === 'object')
    .map((record) => ({
      recordId: normalizeRequiredId(record.recordId, 'recordId'),
    status: normalizeRecordStatus(record.status),
    locale: record.locale ? normalizeLocale(String(record.locale)) : undefined,
    fields: isRecordObject(record.fields) ? record.fields : {},
    revisions: normalizeRecordRevisions(record.revisions),
    createdAt: normalizeTimestamp(record.createdAt),
    updatedAt: normalizeTimestamp(record.updatedAt),
  }));
}

function normalizeRecordRevisions(input: unknown): BuilderCmsRecordRevision[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Partial<BuilderCmsRecordRevision> => !!item && typeof item === 'object')
    .map((revision) => {
      const action = normalizeRevisionAction(revision.action);
      return {
        revisionId: normalizeRequiredId(revision.revisionId, 'revisionId'),
        status: normalizeRecordStatus(revision.status),
        locale: revision.locale ? normalizeLocale(String(revision.locale)) : undefined,
        fields: isRecordObject(revision.fields) ? revision.fields : {},
        createdAt: normalizeTimestamp(revision.createdAt),
        authorLabel: typeof revision.authorLabel === 'string' && revision.authorLabel.trim()
          ? revision.authorLabel.trim()
          : 'Admin',
        action,
        name: normalizeRevisionName(revision.name, action),
        diff: normalizeRecordRevisionDiff(revision.diff),
      };
    });
}

function normalizePermissions(input: unknown): BuilderCmsPermissions {
  if (!input || typeof input !== 'object') return defaultBuilderCmsPermissions();
  const source = input as Partial<BuilderCmsPermissions>;
  return {
    read: normalizePermissionActors(source.read, ['admin']),
    create: normalizePermissionActors(source.create, ['admin']),
    update: normalizePermissionActors(source.update, ['admin']),
    delete: normalizePermissionActors(source.delete, ['admin']),
  };
}

function assertCmsPermission(
  collection: BuilderCmsCollection,
  action: BuilderCmsPermissionAction,
  actor: BuilderCmsPermissionActor,
): void {
  if (!canAccessBuilderCmsCollection(collection, action, actor)) {
    throw new BuilderCmsPermissionError(action, actor);
  }
}

function resolveCmsActor(options: BuilderCmsAccessOptions): BuilderCmsPermissionActor {
  return options.actor ?? 'admin';
}

function resolveCmsActorLabel(options: BuilderCmsAccessOptions): string {
  if (typeof options.actorLabel === 'string' && options.actorLabel.trim()) {
    return options.actorLabel.trim().slice(0, 120);
  }
  return options.actor === 'staff'
    ? 'Staff'
    : options.actor === 'member'
      ? 'Member'
      : options.actor === 'public'
        ? 'Public'
        : 'Admin';
}

function normalizePermissionActors(
  input: unknown,
  fallback: BuilderCmsPermissions['read'],
): BuilderCmsPermissions['read'] {
  if (!Array.isArray(input)) return orderPermissionActors(fallback);
  const actors = input.filter((actor): actor is BuilderCmsPermissions['read'][number] => (
    typeof actor === 'string' &&
    builderCmsPermissionActors.includes(actor as BuilderCmsPermissions['read'][number])
  ));
  return orderPermissionActors(actors.length > 0 ? actors : fallback);
}

function orderPermissionActors(
  actors: Iterable<BuilderCmsPermissionActor>,
): BuilderCmsPermissions['read'] {
  const actorSet = new Set<BuilderCmsPermissionActor>(actors);
  actorSet.add('admin');
  return builderCmsPermissionActors.filter((actor) => actorSet.has(actor));
}

function validateRecordFields(
  collection: BuilderCmsCollection,
  input: unknown,
  options: { recordId: string },
): Record<string, unknown> {
  if (!isRecordObject(input)) {
    throw new BuilderCmsValidationError('Record fields must be an object.');
  }

  const fields: Record<string, unknown> = {};
  const issues: string[] = [];

  for (const field of collection.fields) {
    const rawValue = input[field.key];
    const value = rawValue === undefined ? field.defaultValue : rawValue;
    if (value === undefined || value === null || value === '') {
      if (field.required) issues.push(`${field.label} is required.`);
      continue;
    }

    try {
      fields[field.key] = coerceFieldValue(field, value);
    } catch (error) {
      issues.push(error instanceof Error ? error.message : `${field.label} is invalid.`);
      continue;
    }

    if (field.unique && !isUniqueFieldValue(collection, field, fields[field.key], options.recordId)) {
      issues.push(`${field.label} must be unique.`);
    }
  }

  if (issues.length > 0) {
    throw new BuilderCmsValidationError('CMS record validation failed.', issues);
  }
  return fields;
}

async function assertRecordMediaAssetsExist(
  collection: BuilderCmsCollection,
  fields: Record<string, unknown>,
): Promise<void> {
  const issues: string[] = [];

  for (const field of collection.fields) {
    if (field.type !== 'image') continue;
    const value = fields[field.key];
    if (!isRecordObject(value) || typeof value.url !== 'string') continue;
    const reference = parseBuilderAssetUrl(value.url);
    if (!reference) continue;
    const asset = await readBuilderImageAsset({
      locale: reference.locale,
      assetPath: [reference.filename],
    });
    if (!asset) {
      issues.push(`${field.label} points to a missing builder asset.`);
    }
  }

  if (issues.length > 0) {
    throw new BuilderCmsValidationError('CMS media asset validation failed.', issues);
  }
}

async function assertCollectionMediaAssetsExist(collection: BuilderCmsCollection): Promise<void> {
  for (const record of collection.records) {
    await assertRecordMediaAssetsExist(collection, record.fields);
  }
}

function coerceFieldValue(field: BuilderCmsFieldDefinition, value: unknown): unknown {
  if (field.repeated || field.type === 'string-list') {
    const list = Array.isArray(value)
      ? value.map((item) => String(item))
      : typeof value === 'string'
        ? value
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean)
        : null;
    if (!list) throw new Error(`${field.label} must be a list.`);
    validateFieldMinMax(field, list.length);
    if (field.validation?.options?.length) {
      const invalid = list.find((item) => !field.validation?.options?.includes(item));
      if (invalid) throw new Error(`${field.label} includes an unsupported option: ${invalid}.`);
    }
    return list;
  }

  switch (field.type) {
    case 'number': {
      const numberValue = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(numberValue)) throw new Error(`${field.label} must be a number.`);
      validateFieldMinMax(field, numberValue);
      return numberValue;
    }
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      throw new Error(`${field.label} must be true or false.`);
    case 'date': {
      const dateValue = String(value);
      if (!Number.isFinite(Date.parse(dateValue))) throw new Error(`${field.label} must be a date.`);
      return dateValue;
    }
    case 'email': {
      const email = String(value).trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`${field.label} must be an email.`);
      validateTextFieldValue(field, email);
      return email;
    }
    case 'url': {
      const url = String(value).trim();
      if (!/^https?:\/\//.test(url) && !url.startsWith('/')) throw new Error(`${field.label} must be a URL.`);
      validateTextFieldValue(field, url);
      return url;
    }
    case 'slug': {
      const slug = normalizeSlug(value);
      validateTextFieldValue(field, slug);
      return slug;
    }
    case 'image':
      return normalizeImageValue(field, value);
    case 'reference':
    case 'text':
    case 'rich-text':
    default: {
      const text = String(value);
      validateTextFieldValue(field, text);
      return text;
    }
  }
}

function validateTextFieldValue(field: BuilderCmsFieldDefinition, value: string): void {
  validateFieldMinMax(field, value.length);
  if (field.validation?.pattern) {
    const pattern = new RegExp(field.validation.pattern);
    if (!pattern.test(value)) throw new Error(`${field.label} does not match its pattern.`);
  }
  if (field.validation?.options?.length && !field.validation.options.includes(value)) {
    throw new Error(`${field.label} must be one of: ${field.validation.options.join(', ')}.`);
  }
}

function validateFieldMinMax(field: BuilderCmsFieldDefinition, value: number): void {
  if (typeof field.validation?.min === 'number' && value < field.validation.min) {
    throw new Error(`${field.label} must be at least ${field.validation.min}.`);
  }
  if (typeof field.validation?.max === 'number' && value > field.validation.max) {
    throw new Error(`${field.label} must be at most ${field.validation.max}.`);
  }
}

function normalizeImageValue(field: BuilderCmsFieldDefinition, value: unknown): BuilderCmsImageValue {
  const source = isRecordObject(value) ? value : { url: value };
  const url = String(source.url ?? '').trim();
  if (!/^https?:\/\//.test(url) && !url.startsWith('/')) {
    throw new Error(`${field.label} must be an image URL.`);
  }

  const builderAsset = parseBuilderAssetUrl(url);
  if (url.startsWith('/api/builder/assets/') && !builderAsset) {
    throw new Error(`${field.label} must be a valid builder asset URL.`);
  }

  const assetId = normalizeBuilderCmsImageAssetId(source.assetId);
  if (assetId && !builderAsset) {
    throw new Error(`${field.label} asset ID requires a builder asset URL.`);
  }

  const expectedAssetId = builderAsset ? builderCmsAssetIdFromUrlReference(builderAsset) : undefined;
  if (assetId && expectedAssetId && assetId !== expectedAssetId) {
    throw new Error(`${field.label} asset ID must match its URL.`);
  }

  return {
    url,
    assetId: expectedAssetId,
    filename: builderAsset?.filename
      ?? (typeof source.filename === 'string' && source.filename.trim() ? source.filename.trim() : undefined),
    altText: typeof source.altText === 'string' ? source.altText.trim().slice(0, 180) : undefined,
    focalPoint: normalizeFocalPoint(source.focalPoint),
  };
}

function normalizeBuilderCmsImageAssetId(input: unknown): string | undefined {
  if (typeof input !== 'string') return undefined;
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split('/');
  if (parts.length !== 4 || parts[0] !== 'builder' || parts[1] !== 'assets') return trimmed;
  const reference = parseBuilderAssetUrl(`/api/builder/assets/${parts[2]}/${parts[3]}`);
  return reference ? builderCmsAssetIdFromUrlReference(reference) : trimmed;
}

function builderCmsAssetIdFromUrlReference(reference: { locale: string; filename: string }): string {
  return `builder/assets/${reference.locale}/${reference.filename}`;
}

function normalizeFocalPoint(input: unknown): BuilderCmsImageValue['focalPoint'] {
  if (!isRecordObject(input)) return undefined;
  const x = Number(input.x);
  const y = Number(input.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
  return {
    x: Math.min(1, Math.max(0, x)),
    y: Math.min(1, Math.max(0, y)),
  };
}

function isUniqueFieldValue(
  collection: BuilderCmsCollection,
  field: BuilderCmsFieldDefinition,
  value: unknown,
  recordId: string,
): boolean {
  return !collection.records.some((record) => (
    record.recordId !== recordId &&
    record.fields[field.key] === value
  ));
}

type RecordRevisionSnapshot = Pick<BuilderCmsRecord, 'status' | 'locale' | 'fields'>;

function appendRecordRevision(
  record: BuilderCmsRecord,
  action: BuilderCmsRecordRevisionAction,
  nextSnapshot: RecordRevisionSnapshot = record,
  options: BuilderCmsAccessOptions = {},
): BuilderCmsRecordRevision[] {
  const diff = buildRecordRevisionDiff(record, nextSnapshot);
  return [
    ...normalizeRecordRevisions(record.revisions),
    {
      revisionId: generateEntityId('revision'),
      status: record.status,
      locale: record.locale,
      fields: { ...record.fields },
      createdAt: new Date().toISOString(),
      authorLabel: resolveCmsActorLabel(options),
      action,
      name: buildRecordRevisionName(action, diff),
      diff,
    },
  ].slice(-50);
}

function buildRecordRevisionDiff(
  before: RecordRevisionSnapshot,
  after: RecordRevisionSnapshot,
): BuilderCmsRecordRevisionDiff {
  const fields = [...new Set([
    ...Object.keys(before.fields),
    ...Object.keys(after.fields),
  ])]
    .sort((left, right) => left.localeCompare(right))
    .filter((fieldKey) => !sameRevisionValue(before.fields[fieldKey], after.fields[fieldKey]))
    .map((fieldKey) => ({
      fieldKey,
      before: normalizeRevisionDiffValue(before.fields[fieldKey]),
      after: normalizeRevisionDiffValue(after.fields[fieldKey]),
    }));

  const diff: BuilderCmsRecordRevisionDiff = { fields };
  if (before.status !== after.status) {
    diff.status = { before: before.status, after: after.status };
  }
  if ((before.locale ?? null) !== (after.locale ?? null)) {
    diff.locale = { before: before.locale, after: after.locale };
  }
  return diff;
}

function buildRecordRevisionName(
  action: BuilderCmsRecordRevisionAction,
  diff: BuilderCmsRecordRevisionDiff,
): string {
  const labels = [
    ...(diff.status ? ['status'] : []),
    ...(diff.locale ? ['locale'] : []),
    ...diff.fields.map((field) => field.fieldKey),
  ];
  if (!labels.length) return action === 'restore' ? 'Restore snapshot' : 'Update snapshot';
  const visibleLabels = labels.slice(0, 3).join(', ');
  const suffix = labels.length > 3 ? ` +${labels.length - 3}` : '';
  return `${action === 'restore' ? 'Restore' : 'Update'} ${visibleLabels}${suffix}`;
}

function normalizeRecordRevisionDiff(input: unknown): BuilderCmsRecordRevisionDiff {
  if (!input || typeof input !== 'object') return { fields: [] };
  const source = input as { fields?: unknown; status?: unknown; locale?: unknown };
  const diff: BuilderCmsRecordRevisionDiff = {
    fields: Array.isArray(source.fields)
      ? source.fields
        .filter((item): item is { fieldKey?: unknown; before?: unknown; after?: unknown } => (
          !!item && typeof item === 'object'
        ))
        .map((item) => ({
          fieldKey: typeof item.fieldKey === 'string' && item.fieldKey.trim()
            ? item.fieldKey.trim()
            : '',
          before: normalizeRevisionDiffValue(item.before),
          after: normalizeRevisionDiffValue(item.after),
        }))
        .filter((item) => item.fieldKey)
      : [],
  };

  if (source.status && typeof source.status === 'object') {
    const status = source.status as { before?: unknown; after?: unknown };
    diff.status = {
      before: normalizeRecordStatus(status.before),
      after: normalizeRecordStatus(status.after),
    };
  }
  if (source.locale && typeof source.locale === 'object') {
    const locale = source.locale as { before?: unknown; after?: unknown };
    const before = typeof locale.before === 'string' && locale.before.trim()
      ? normalizeLocale(locale.before)
      : undefined;
    const after = typeof locale.after === 'string' && locale.after.trim()
      ? normalizeLocale(locale.after)
      : undefined;
    diff.locale = { before, after };
  }
  return diff;
}

function normalizeRevisionName(input: unknown, action: BuilderCmsRecordRevisionAction): string {
  if (typeof input === 'string' && input.trim()) return input.trim().slice(0, 120);
  return action === 'restore' ? 'Restore snapshot' : 'Update snapshot';
}

function sameRevisionValue(left: unknown, right: unknown): boolean {
  return stableRevisionStringify(left) === stableRevisionStringify(right);
}

function stableRevisionStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableRevisionStringify(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value as Record<string, unknown>)
      .sort((left, right) => left.localeCompare(right))
      .map((key) => `${JSON.stringify(key)}:${stableRevisionStringify((value as Record<string, unknown>)[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value) ?? 'undefined';
}

function normalizeRevisionDiffValue(value: unknown): unknown {
  if (value === undefined) return null;
  if (!value || typeof value !== 'object') return value;
  return JSON.parse(JSON.stringify(value)) as unknown;
}

function buildDuplicateRecordFields(
  collection: BuilderCmsCollection,
  source: BuilderCmsRecord,
  nextRecordId: string,
): Record<string, unknown> {
  const fields = { ...source.fields };
  for (const field of collection.fields) {
    if (!field.unique) continue;
    fields[field.key] = nextUniqueFieldValue(collection, field, fields[field.key], nextRecordId);
  }
  return validateRecordFields(collection, fields, { recordId: nextRecordId });
}

function nextUniqueFieldValue(
  collection: BuilderCmsCollection,
  field: BuilderCmsFieldDefinition,
  value: unknown,
  nextRecordId: string,
): unknown {
  if (field.type === 'slug') {
    const base = normalizeSlug(value);
    for (let index = 1; index < 100; index += 1) {
      const candidate = index === 1 ? `${base}-copy` : `${base}-copy-${index}`;
      if (isUniqueFieldValue(collection, field, candidate, nextRecordId)) return candidate;
    }
  }

  if (
    field.type === 'text' ||
    field.type === 'rich-text' ||
    field.type === 'reference' ||
    field.type === 'image' ||
    field.type === 'url'
  ) {
    const base = String(value ?? field.key).trim() || field.key;
    for (let index = 1; index < 100; index += 1) {
      const candidate = index === 1 ? `${base} Copy` : `${base} Copy ${index}`;
      if (isUniqueFieldValue(collection, field, candidate, nextRecordId)) return candidate;
    }
  }

  throw new BuilderCmsValidationError(`Cannot duplicate unique field: ${field.label}`);
}

function csvHeadersForCollection(collection: BuilderCmsCollection): string[] {
  return ['recordId', 'status', 'locale', ...collection.fields.map((field) => field.key)];
}

function csvRecordCell(
  collection: BuilderCmsCollection,
  record: BuilderCmsRecord,
  header: string,
): string {
  if (header === 'recordId') return record.recordId;
  if (header === 'status') return record.status;
  if (header === 'locale') return record.locale ?? '';
  const field = collection.fields.find((candidate) => candidate.key === header);
  if (!field) return '';
  const value = record.fields[field.key];
  if (Array.isArray(value)) return value.map(stringifyBuilderCmsRecordValue).join('\n');
  return stringifyBuilderCmsRecordValue(value);
}

function stringifyCsv(rows: string[][]): string {
  return `${rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')}\n`;
}

function escapeCsvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

async function buildImportedCsvRecords(
  collection: BuilderCmsCollection,
  csvText: string,
  mode: BuilderCmsCsvImportMode,
  columnMapInput?: BuilderCmsCsvColumnMap,
): Promise<{ records: BuilderCmsRecord[]; summary: BuilderCmsCsvImportSummary }> {
  const table = parseCsvTable(csvText);
  if (table.length === 0) {
    throw new BuilderCmsValidationError('CSV import requires a header row.');
  }

  const headers = table[0].map((header) => header.trim());
  const expectedHeaders = csvHeadersForCollection(collection);
  const requiredHeaders = new Set(csvHeadersForCollection(collection));
  const hasColumnMap = !!columnMapInput && Object.keys(columnMapInput).length > 0;
  const unknownHeaders = headers.filter((header) => header && !requiredHeaders.has(header));
  if (!hasColumnMap && unknownHeaders.length > 0) {
    throw new BuilderCmsValidationError(
      'CSV import has unknown columns.',
      unknownHeaders.map((header) => `Unknown column: ${header}`),
    );
  }
  const columnMapping = normalizeCsvColumnMapping(expectedHeaders, headers, columnMapInput);
  const mappedSourceHeaders = new Set(columnMapping.mappedColumns.map((mapping) => mapping.source));

  const fieldKeys = new Set(collection.fields.map((field) => field.key));
  const issues: string[] = [];
  const now = new Date().toISOString();
  const validationCollection: BuilderCmsCollection = {
    ...collection,
    records: mode === 'replace' ? [] : [...collection.records],
  };
  const importedRecords: BuilderCmsRecord[] = [];

  for (const [rowOffset, cells] of table.slice(1).entries()) {
    const rowNumber = rowOffset + 2;
    if (cells.every((cell) => cell.trim() === '')) continue;
    const sourceRow = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
    const row = Object.fromEntries(expectedHeaders.map((target) => {
      const sourceHeader = columnMapping.targetToSource[target];
      return [target, sourceHeader ? sourceRow[sourceHeader] ?? '' : ''];
    }));
    try {
      const recordId = normalizeOptionalId(row.recordId, `row ${rowNumber} recordId`)
        ?? generateUniqueRecordId(validationCollection);
      ensureUniqueRecordId(validationCollection, recordId);
      const fields = Object.fromEntries(
        collection.fields.map((field) => [field.key, fieldKeys.has(field.key) ? row[field.key] : undefined]),
      );
      const recordFields = validateRecordFields(validationCollection, fields, { recordId });
      await assertRecordMediaAssetsExist(validationCollection, recordFields);
      const record: BuilderCmsRecord = {
        recordId,
        status: normalizeRecordStatus(row.status),
        locale: row.locale ? normalizeLocale(String(row.locale)) : undefined,
        fields: recordFields,
        createdAt: now,
        updatedAt: now,
      };
      validationCollection.records.push(record);
      importedRecords.push(record);
    } catch (error) {
      if (error instanceof BuilderCmsValidationError) {
        issues.push(...error.issues.map((issue) => `Row ${rowNumber}: ${issue}`));
      } else {
        issues.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Invalid row.'}`);
      }
    }
  }

  if (issues.length > 0) {
    throw new BuilderCmsValidationError('CMS CSV import failed.', issues);
  }
  return {
    records: importedRecords,
    summary: {
      headers,
      mappedColumns: columnMapping.mappedColumns,
      skippedColumns: headers.filter((header) => header && !mappedSourceHeaders.has(header)),
    },
  };
}

function normalizeCsvColumnMapping(
  expectedHeaders: string[],
  sourceHeaders: string[],
  columnMapInput?: BuilderCmsCsvColumnMap,
): { targetToSource: Record<string, string | undefined>; mappedColumns: { target: string; source: string }[] } {
  const sourceHeaderSet = new Set(sourceHeaders);
  const targetToSource: Record<string, string | undefined> = {};
  const mappedColumns: { target: string; source: string }[] = [];

  for (const target of expectedHeaders) {
    const isExplicitMapping = typeof columnMapInput?.[target] === 'string';
    const mappedSource = isExplicitMapping ? columnMapInput[target].trim() : target;
    if (!mappedSource) {
      targetToSource[target] = undefined;
      continue;
    }
    if (!sourceHeaderSet.has(mappedSource)) {
      if (!isExplicitMapping) {
        targetToSource[target] = undefined;
        continue;
      }
      throw new BuilderCmsValidationError(
        'CSV import mapping references unknown columns.',
        [`${target} maps to missing column: ${mappedSource}`],
      );
    }
    targetToSource[target] = mappedSource;
    mappedColumns.push({ target, source: mappedSource });
  }

  return { targetToSource, mappedColumns };
}

function parseCsvTable(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (inQuotes) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (char !== '\r') {
      cell += char;
    }
  }

  if (inQuotes) {
    throw new BuilderCmsValidationError('CSV import has an unterminated quoted field.');
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((candidate) => candidate.some((value) => value.trim() !== ''));
}

function ensureUniqueCollectionId(collections: BuilderCmsCollection[], collectionId: string): void {
  if (collections.some((collection) => collection.collectionId === collectionId)) {
    throw new BuilderCmsValidationError(`Collection already exists: ${collectionId}`);
  }
}

function ensureUniqueRecordId(collection: BuilderCmsCollection, recordId: string): void {
  if (collection.records.some((record) => record.recordId === recordId)) {
    throw new BuilderCmsValidationError(`Record already exists: ${recordId}`);
  }
}

function generateUniqueRecordId(collection: BuilderCmsCollection): string {
  let recordId = generateEntityId('record');
  while (collection.records.some((record) => record.recordId === recordId)) {
    recordId = generateEntityId('record');
  }
  return recordId;
}

function normalizeFieldType(input: unknown): BuilderCmsFieldType {
  if (typeof input === 'string' && builderCmsFieldTypes.includes(input as BuilderCmsFieldType)) {
    return input as BuilderCmsFieldType;
  }
  throw new BuilderCmsValidationError(`Unsupported CMS field type: ${String(input)}`);
}

function normalizeRecordStatus(input: unknown): BuilderCmsRecordStatus {
  return input === 'published' || input === 'archived' ? input : 'draft';
}

function normalizeRecordStatusStrict(input: unknown): BuilderCmsRecordStatus {
  if (input === 'draft' || input === 'published' || input === 'archived') return input;
  throw new BuilderCmsValidationError('Record status must be draft, published, or archived.');
}

function normalizeRevisionAction(input: unknown): BuilderCmsRecordRevisionAction {
  return input === 'restore' ? 'restore' : 'update';
}

function normalizeRequiredString(input: unknown, label: string): string {
  if (typeof input !== 'string' || !input.trim()) {
    throw new BuilderCmsValidationError(`${label} is required.`);
  }
  return input.trim();
}

function normalizeOptionalFieldText(input: unknown, maxLength: number): string | undefined {
  if (typeof input !== 'string') return undefined;
  const trimmed = input.trim();
  return trimmed ? trimmed.slice(0, maxLength) : undefined;
}

function normalizeOptionalNumber(input: unknown, label: string): number | undefined {
  if (input === undefined || input === null || input === '') return undefined;
  const value = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(value)) {
    throw new BuilderCmsValidationError(`${label} must be a number.`);
  }
  return value;
}

function normalizeValidationOptions(input: unknown): string[] {
  const options = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split('\n')
      : [];
  return [...new Set(options.map((option) => String(option).trim()).filter(Boolean))].slice(0, 200);
}

function normalizeRequiredId(input: unknown, label: string): string {
  const normalized = normalizeOptionalId(input, label);
  if (!normalized) throw new BuilderCmsValidationError(`${label} is required.`);
  return normalized;
}

function normalizeOptionalId(input: unknown, label: string): string | null {
  if (input === undefined || input === null || input === '') return null;
  const value = String(input).trim();
  if (!/^[a-z][a-z0-9-]{1,62}$/.test(value)) {
    throw new BuilderCmsValidationError(`${label} must use lowercase letters, numbers, and hyphens.`);
  }
  return value;
}

function normalizeRecordIdList(input: unknown): string[] {
  if (!Array.isArray(input)) {
    throw new BuilderCmsValidationError('recordIds must be an array.');
  }
  const recordIds = input.map((value, index) => normalizeRequiredId(value, `recordIds[${index}]`));
  const uniqueRecordIds = [...new Set(recordIds)];
  if (uniqueRecordIds.length === 0) {
    throw new BuilderCmsValidationError('At least one record ID is required.');
  }
  return uniqueRecordIds;
}

function normalizeFieldKey(input: unknown, label: string): string {
  if (typeof input !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,62}$/.test(input.trim())) {
    throw new BuilderCmsValidationError(`${label} must be an identifier.`);
  }
  return input.trim();
}

function normalizeSlug(input: unknown): string {
  const slug = String(input ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug || !/^[a-z][a-z0-9-]{1,62}$/.test(slug)) {
    throw new BuilderCmsValidationError('Slug must use lowercase letters, numbers, and hyphens.');
  }
  return slug;
}

function normalizeTimestamp(input: unknown): string {
  if (typeof input === 'string' && Number.isFinite(Date.parse(input))) return input;
  return new Date().toISOString();
}

function isRecordObject(input: unknown): input is Record<string, unknown> {
  return !!input && typeof input === 'object' && !Array.isArray(input);
}

function generateEntityId(prefix: 'collection' | 'field' | 'index' | 'record' | 'revision'): string {
  generatedIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${generatedIdCounter.toString(36)}`;
}
