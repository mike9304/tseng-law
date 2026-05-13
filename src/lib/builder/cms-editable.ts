import { isBuilderCollectionId } from '@/lib/builder/cms';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  builderCmsFieldTypes,
  builderCmsPermissionActors,
  type BuilderCmsCollection,
  type BuilderCmsCollectionDetail,
  type BuilderCmsCollectionSummary,
  type BuilderCmsFieldDefinition,
  type BuilderCmsFieldType,
  type BuilderCmsPermissions,
  type BuilderCmsRecord,
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

type CollectionInput = {
  collectionId?: unknown;
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  localized?: unknown;
  fields?: unknown;
  permissions?: unknown;
};

type CollectionPatchInput = Partial<CollectionInput>;

type RecordInput = {
  recordId?: unknown;
  status?: unknown;
  locale?: unknown;
  fields?: unknown;
};

export type BuilderCmsRecordSortDirection = 'asc' | 'desc';

export interface BuilderCmsRecordListOptions {
  query?: string;
  sortBy?: string;
  sortDirection?: BuilderCmsRecordSortDirection;
}

export type BuilderCmsCsvImportMode = 'append' | 'replace';

export interface BuilderCmsCsvImportOptions {
  mode?: BuilderCmsCsvImportMode;
}

export interface BuilderCmsCsvExportResult {
  filename: string;
  csv: string;
}

export interface BuilderCmsCsvImportResult {
  imported: number;
  mode: BuilderCmsCsvImportMode;
  records: BuilderCmsRecord[];
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
): Promise<BuilderCmsCollectionDetail | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = normalizeCmsCollections(site.cmsCollections).find(
    (candidate) => candidate.collectionId === collectionId,
  );
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
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const index = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  const recordId = normalizeOptionalId(input.recordId, 'recordId') ?? generateEntityId('record');
  const collection = collections[index];
  ensureUniqueRecordId(collection, recordId);
  const record: BuilderCmsRecord = {
    recordId,
    status: normalizeRecordStatus(input.status),
    locale: input.locale ? normalizeLocale(String(input.locale)) : undefined,
    fields: validateRecordFields(collection, input.fields, { recordId }),
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
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  const recordIndex = collection.records.findIndex((candidate) => candidate.recordId === recordId);
  if (recordIndex === -1) return null;

  const now = new Date().toISOString();
  const previous = collection.records[recordIndex];
  const nextRecord: BuilderCmsRecord = {
    ...previous,
    status: input.status ? normalizeRecordStatus(input.status) : previous.status,
    locale: input.locale ? normalizeLocale(String(input.locale)) : previous.locale,
    fields: validateRecordFields(collection, input.fields ?? previous.fields, { recordId }),
    revisions: appendRecordRevision(previous, 'update'),
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
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  const recordIndex = collection.records.findIndex((candidate) => candidate.recordId === recordId);
  if (recordIndex === -1) return null;

  const current = collection.records[recordIndex];
  const revision = normalizeRecordRevisions(current.revisions).find(
    (candidate) => candidate.revisionId === revisionId,
  );
  if (!revision) return null;

  const now = new Date().toISOString();
  const nextRecord: BuilderCmsRecord = {
    ...current,
    status: revision.status,
    locale: revision.locale,
    fields: validateRecordFields(collection, revision.fields, { recordId }),
    revisions: appendRecordRevision(current, 'restore'),
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
): Promise<BuilderCmsRecord | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  const source = collection.records.find((candidate) => candidate.recordId === recordId);
  if (!source) return null;

  const now = new Date().toISOString();
  const nextRecordId = generateUniqueRecordId(collection);
  const fields = buildDuplicateRecordFields(collection, source, nextRecordId);
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
): Promise<boolean> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return false;

  const collection = collections[collectionIndex];
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

export function filterAndSortBuilderCmsRecords(
  records: BuilderCmsRecord[],
  fields: BuilderCmsFieldDefinition[],
  options: BuilderCmsRecordListOptions = {},
): BuilderCmsRecord[] {
  const query = options.query?.trim().toLowerCase() ?? '';
  const sortBy = options.sortBy?.trim() || 'updatedAt';
  const sortDirection = options.sortDirection === 'asc' ? 1 : -1;

  const filtered = query
    ? records.filter((record) => {
        const searchable = [
          record.recordId,
          record.status,
          record.locale ?? '',
          ...fields.map((field) => stringifyRecordValue(record.fields[field.key])),
        ].join(' ').toLowerCase();
        return searchable.includes(query);
      })
    : records;

  return [...filtered].sort((left, right) => {
    const leftValue = sortRecordValue(left, sortBy);
    const rightValue = sortRecordValue(right, sortBy);
    return compareRecordValues(leftValue, rightValue) * sortDirection;
  });
}

export async function exportEditableBuilderCmsRecordsCsv(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
): Promise<BuilderCmsCsvExportResult | null> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collection = normalizeCmsCollections(site.cmsCollections).find(
    (candidate) => candidate.collectionId === collectionId,
  );
  if (!collection) return null;

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
  const mode: BuilderCmsCsvImportMode = options.mode === 'replace' ? 'replace' : 'append';
  const importedRecords = buildImportedCsvRecords(collection, csvText, mode);
  const now = new Date().toISOString();
  const nextCollection: BuilderCmsCollection = {
    ...collection,
    records: mode === 'replace' ? importedRecords : [...collection.records, ...importedRecords],
    updatedAt: now,
  };
  site.cmsCollections = collections.map((candidate, candidateIndex) => (
    candidateIndex === collectionIndex ? nextCollection : candidate
  ));
  site.updatedAt = now;
  await writeSiteDocument(site);
  return {
    imported: importedRecords.length,
    mode,
    records: importedRecords,
  };
}

export function normalizeCmsCollections(input: unknown): BuilderCmsCollection[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Partial<BuilderCmsCollection> => !!item && typeof item === 'object')
    .map((collection) => ({
      collectionId: normalizeRequiredId(collection.collectionId, 'collectionId'),
      name: normalizeRequiredString(collection.name, 'name'),
      slug: normalizeSlug(collection.slug ?? collection.name ?? collection.collectionId),
      description: typeof collection.description === 'string' ? collection.description : '',
      localized: Boolean(collection.localized),
      fields: normalizeFieldDefinitions(collection.fields),
      records: normalizeRecords(collection.records),
      permissions: normalizePermissions(collection.permissions),
      createdAt: normalizeTimestamp(collection.createdAt),
      updatedAt: normalizeTimestamp(collection.updatedAt),
    }));
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

  return {
    collectionId,
    name,
    slug: normalizeSlug(input.slug ?? collectionId),
    description: typeof input.description === 'string' ? input.description : '',
    localized: Boolean(input.localized),
    fields: normalizeFieldDefinitions(input.fields, { useDefaults: true }),
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

  const next: BuilderCmsCollection = {
    ...current,
    collectionId,
    name,
    slug: input.slug === undefined ? current.slug : normalizeSlug(input.slug),
    description: input.description === undefined
      ? current.description
      : String(input.description ?? ''),
    localized: input.localized === undefined ? current.localized : Boolean(input.localized),
    fields: input.fields === undefined
      ? current.fields
      : normalizeFieldDefinitions(input.fields, { useDefaults: false }),
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
    return {
      fieldId: normalizeOptionalId(source.fieldId, `fields[${index}].fieldId`) ?? generateEntityId('field'),
      key,
      label: normalizeRequiredString(source.label ?? key, `fields[${index}].label`),
      type: normalizeFieldType(source.type),
      localized: Boolean(source.localized),
      repeated: Boolean(source.repeated),
      required: Boolean(source.required),
      unique: Boolean(source.unique),
      defaultValue: source.defaultValue,
      validation: source.validation && typeof source.validation === 'object'
        ? source.validation
        : undefined,
      relationCollectionId: typeof source.relationCollectionId === 'string'
        ? normalizeRequiredId(source.relationCollectionId, `fields[${index}].relationCollectionId`)
        : undefined,
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
    .map((revision) => ({
      revisionId: normalizeRequiredId(revision.revisionId, 'revisionId'),
      status: normalizeRecordStatus(revision.status),
      locale: revision.locale ? normalizeLocale(String(revision.locale)) : undefined,
      fields: isRecordObject(revision.fields) ? revision.fields : {},
      createdAt: normalizeTimestamp(revision.createdAt),
      authorLabel: typeof revision.authorLabel === 'string' && revision.authorLabel.trim()
        ? revision.authorLabel.trim()
        : 'Admin',
      action: normalizeRevisionAction(revision.action),
    }));
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

function normalizePermissionActors(
  input: unknown,
  fallback: BuilderCmsPermissions['read'],
): BuilderCmsPermissions['read'] {
  if (!Array.isArray(input)) return fallback;
  const actors = input.filter((actor): actor is BuilderCmsPermissions['read'][number] => (
    typeof actor === 'string' &&
    builderCmsPermissionActors.includes(actor as BuilderCmsPermissions['read'][number])
  ));
  return actors.length > 0 ? Array.from(new Set(actors)) : fallback;
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

function coerceFieldValue(field: BuilderCmsFieldDefinition, value: unknown): unknown {
  if (field.repeated || field.type === 'string-list') {
    if (Array.isArray(value)) return value.map((item) => String(item));
    if (typeof value === 'string') {
      return value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
    throw new Error(`${field.label} must be a list.`);
  }

  switch (field.type) {
    case 'number': {
      const numberValue = typeof value === 'number' ? value : Number(value);
      if (!Number.isFinite(numberValue)) throw new Error(`${field.label} must be a number.`);
      if (typeof field.validation?.min === 'number' && numberValue < field.validation.min) {
        throw new Error(`${field.label} must be at least ${field.validation.min}.`);
      }
      if (typeof field.validation?.max === 'number' && numberValue > field.validation.max) {
        throw new Error(`${field.label} must be at most ${field.validation.max}.`);
      }
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
      return email;
    }
    case 'url': {
      const url = String(value).trim();
      if (!/^https?:\/\//.test(url) && !url.startsWith('/')) throw new Error(`${field.label} must be a URL.`);
      return url;
    }
    case 'slug':
      return normalizeSlug(value);
    case 'reference':
    case 'text':
    case 'rich-text':
    case 'image':
    default: {
      const text = String(value);
      if (field.validation?.pattern) {
        const pattern = new RegExp(field.validation.pattern);
        if (!pattern.test(text)) throw new Error(`${field.label} does not match its pattern.`);
      }
      return text;
    }
  }
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

function appendRecordRevision(
  record: BuilderCmsRecord,
  action: BuilderCmsRecordRevisionAction,
): BuilderCmsRecordRevision[] {
  return [
    ...normalizeRecordRevisions(record.revisions),
    {
      revisionId: generateEntityId('revision'),
      status: record.status,
      locale: record.locale,
      fields: { ...record.fields },
      createdAt: new Date().toISOString(),
      authorLabel: 'Admin',
      action,
    },
  ].slice(-50);
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

function stringifyRecordValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(stringifyRecordValue).join(' ');
  if (value === null || value === undefined) return '';
  return String(value);
}

function sortRecordValue(record: BuilderCmsRecord, sortBy: string): unknown {
  if (sortBy === 'recordId') return record.recordId;
  if (sortBy === 'status') return record.status;
  if (sortBy === 'createdAt') return record.createdAt;
  if (sortBy === 'updatedAt') return record.updatedAt;
  return record.fields[sortBy];
}

function compareRecordValues(left: unknown, right: unknown): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return stringifyRecordValue(left).localeCompare(stringifyRecordValue(right), 'en', {
    numeric: true,
    sensitivity: 'base',
  });
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
  if (Array.isArray(value)) return value.map(stringifyRecordValue).join('\n');
  return stringifyRecordValue(value);
}

function stringifyCsv(rows: string[][]): string {
  return `${rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')}\n`;
}

function escapeCsvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function buildImportedCsvRecords(
  collection: BuilderCmsCollection,
  csvText: string,
  mode: BuilderCmsCsvImportMode,
): BuilderCmsRecord[] {
  const table = parseCsvTable(csvText);
  if (table.length === 0) {
    throw new BuilderCmsValidationError('CSV import requires a header row.');
  }

  const headers = table[0].map((header) => header.trim());
  const requiredHeaders = new Set(csvHeadersForCollection(collection));
  const unknownHeaders = headers.filter((header) => header && !requiredHeaders.has(header));
  if (unknownHeaders.length > 0) {
    throw new BuilderCmsValidationError(
      'CSV import has unknown columns.',
      unknownHeaders.map((header) => `Unknown column: ${header}`),
    );
  }

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
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']));
    try {
      const recordId = normalizeOptionalId(row.recordId, `row ${rowNumber} recordId`)
        ?? generateUniqueRecordId(validationCollection);
      ensureUniqueRecordId(validationCollection, recordId);
      const fields = Object.fromEntries(
        collection.fields.map((field) => [field.key, fieldKeys.has(field.key) ? row[field.key] : undefined]),
      );
      const record: BuilderCmsRecord = {
        recordId,
        status: normalizeRecordStatus(row.status),
        locale: row.locale ? normalizeLocale(String(row.locale)) : undefined,
        fields: validateRecordFields(validationCollection, fields, { recordId }),
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
  return importedRecords;
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

function normalizeRevisionAction(input: unknown): BuilderCmsRecordRevisionAction {
  return input === 'restore' ? 'restore' : 'update';
}

function normalizeRequiredString(input: unknown, label: string): string {
  if (typeof input !== 'string' || !input.trim()) {
    throw new BuilderCmsValidationError(`${label} is required.`);
  }
  return input.trim();
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

function generateEntityId(prefix: 'collection' | 'field' | 'record' | 'revision'): string {
  generatedIdCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${generatedIdCounter.toString(36)}`;
}
