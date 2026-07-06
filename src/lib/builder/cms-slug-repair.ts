import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  canAccessBuilderCmsCollection,
  normalizeCmsCollections,
  type BuilderCmsAccessOptions,
} from '@/lib/builder/cms-editable';
import type {
  BuilderCmsCollection,
  BuilderCmsFieldDefinition,
  BuilderCmsRecord,
  BuilderCmsRecordRevision,
} from '@/lib/builder/cms-types';
import { normalizeOptionalSlugSourceFieldKey } from '@/lib/builder/cms-slug-source-fields';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import {
  isValidCmsRouteSlug,
  normalizeOptionalSlugPattern,
  resolveSlugPatternBase,
  slugifyCmsSlugBase,
} from '@/lib/builder/cms-slug-pattern';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';

export type BuilderCmsBulkSlugRepairResult = {
  readonly requested: number;
  readonly updated: number;
  readonly records: readonly BuilderCmsRecord[];
  readonly missingRecordIds: readonly string[];
  readonly skippedRecordIds: readonly string[];
  readonly slugField: string;
  readonly sourceFieldKey?: string;
  readonly slugPattern?: string;
  readonly slugConflictRule?: BuilderCmsSlugConflictRule;
};

export async function bulkGenerateEditableBuilderCmsRecordSlugs(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordIdsInput: unknown,
  slugFieldInput: unknown,
  options: BuilderCmsAccessOptions = {},
  sourceFieldInput?: unknown,
  slugPatternInput?: unknown,
): Promise<BuilderCmsBulkSlugRepairResult | null> {
  const recordIds = normalizeRepairRecordIds(recordIdsInput);
  const slugFieldKey = normalizeSlugFieldKey(slugFieldInput);
  const locale = normalizeLocale(localeInput ?? undefined);
  const site = await readSiteDocument(siteId, locale);
  const collections = normalizeCmsCollections(site.cmsCollections);
  const collectionIndex = collections.findIndex((candidate) => candidate.collectionId === collectionId);
  if (collectionIndex === -1) return null;

  const collection = collections[collectionIndex];
  const actor = options.actor ?? 'admin';
  if (!canAccessBuilderCmsCollection(collection, 'update', actor)) {
    throw new BuilderCmsPermissionError('update', actor);
  }
  const slugField = findSlugField(collection, slugFieldKey);
  const sourceFieldKey = normalizeOptionalSlugSourceFieldKey(sourceFieldInput, collection, slugField.key);
  const slugPattern = normalizeOptionalSlugPattern(slugPatternInput, collection, slugField.key);
  const requestedRecordIds = new Set(recordIds);
  const foundRecordIds = new Set<string>();
  const skippedRecordIds: string[] = [];
  const usedSlugs = collectUsedSlugs(collection, slugField.key);
  const now = new Date().toISOString();
  let updated = 0;

  const records = collection.records.map((record) => {
    if (!requestedRecordIds.has(record.recordId)) return record;
    foundRecordIds.add(record.recordId);
    const currentSlug = readSlugValue(record.fields[slugField.key]);
    if (currentSlug) {
      skippedRecordIds.push(record.recordId);
      return record;
    }
    const nextSlug = nextUniqueSlug(resolveSlugBase(record, collection.fields, sourceFieldKey, slugPattern), usedSlugs);
    updated += 1;
    const fields = { ...record.fields, [slugField.key]: nextSlug };
    return {
      ...record,
      fields,
      revisions: appendSlugRepairRevision(record, slugField.key, nextSlug, now, options),
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
    skippedRecordIds,
    slugField: slugField.key,
    ...(sourceFieldKey === undefined ? {} : { sourceFieldKey }),
    ...(slugPattern === undefined ? {} : { slugPattern }),
  };
}

export function findSlugField(
  collection: BuilderCmsCollection,
  slugFieldKey: string,
): BuilderCmsFieldDefinition {
  const field = collection.fields.find((candidate) => candidate.key === slugFieldKey);
  if (!field || field.type !== 'slug') {
    throw new BuilderCmsValidationError(`Unknown slug field: ${slugFieldKey}`);
  }
  return field;
}

export function normalizeRepairRecordIds(input: unknown): string[] {
  if (!Array.isArray(input)) {
    throw new BuilderCmsValidationError('recordIds must be an array.');
  }
  const recordIds = input.map((value, index) => normalizeRecordId(value, `recordIds[${index}]`));
  const uniqueRecordIds = [...new Set(recordIds)];
  if (uniqueRecordIds.length === 0) {
    throw new BuilderCmsValidationError('At least one record ID is required.');
  }
  return uniqueRecordIds;
}

function normalizeRecordId(input: unknown, label: string): string {
  if (typeof input !== 'string' || !/^[a-z][a-z0-9-]{1,62}$/.test(input.trim())) {
    throw new BuilderCmsValidationError(`${label} must use lowercase letters, numbers, and hyphens.`);
  }
  return input.trim();
}

export function normalizeSlugFieldKey(input: unknown): string {
  if (typeof input !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,62}$/.test(input.trim())) {
    throw new BuilderCmsValidationError('slugField must be an identifier.');
  }
  return input.trim();
}

export function collectUsedSlugs(
  collection: BuilderCmsCollection,
  slugFieldKey: string,
): Set<string> {
  return new Set(
    collection.records
      .map((record) => readSlugValue(record.fields[slugFieldKey]))
      .filter((slug) => slug.length > 0),
  );
}

export function readSlugValue(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function resolveSlugBase(
  record: BuilderCmsRecord,
  fields: readonly BuilderCmsFieldDefinition[],
  sourceFieldKey?: string,
  slugPattern?: string,
): string {
  if (slugPattern) {
    const candidate = resolveSlugPatternBase(record, slugPattern);
    if (candidate) return candidate;
  }
  if (sourceFieldKey) {
    const candidate = slugifyCmsSlugBase(record.fields[sourceFieldKey]);
    if (candidate) return candidate;
  }
  const preferredKeys = ['title', 'name', 'heading', 'question', 'label'] as const;
  for (const key of preferredKeys) {
    const candidate = slugifyCmsSlugBase(record.fields[key]);
    if (candidate) return candidate;
  }
  for (const field of fields) {
    if (field.type !== 'text' && field.type !== 'rich-text') continue;
    const candidate = slugifyCmsSlugBase(record.fields[field.key]);
    if (candidate) return candidate;
  }
  return slugifyCmsSlugBase(record.recordId) || 'record';
}

export function nextUniqueSlug(baseInput: string, usedSlugs: Set<string>): string {
  const base = isValidCmsRouteSlug(baseInput) ? baseInput : 'record';
  for (let index = 1; index < 200; index += 1) {
    const suffix = index === 1 ? '' : `-${index}`;
    const candidateBase = base.slice(0, 63 - suffix.length).replace(/-+$/g, '');
    const candidate = `${candidateBase}${suffix}`;
    if (isValidCmsRouteSlug(candidate) && !usedSlugs.has(candidate)) {
      usedSlugs.add(candidate);
      return candidate;
    }
  }
  throw new BuilderCmsValidationError(`Could not generate a unique slug for ${base}.`);
}

export function appendSlugRepairRevision(
  record: BuilderCmsRecord,
  slugFieldKey: string,
  nextSlug: string,
  now: string,
  options: BuilderCmsAccessOptions,
): BuilderCmsRecordRevision[] {
  const revision: BuilderCmsRecordRevision = {
    revisionId: `revision-${Date.now().toString(36)}-${record.recordId}`,
    status: record.status,
    ...(record.locale === undefined ? {} : { locale: record.locale }),
    fields: { ...record.fields },
    createdAt: now,
    authorLabel: options.actorLabel ?? 'Admin',
    action: 'update',
    name: `Update ${slugFieldKey}`,
    diff: {
      fields: [{ fieldKey: slugFieldKey, before: record.fields[slugFieldKey] ?? null, after: nextSlug }],
    },
  };
  return [
    ...(record.revisions ?? []),
    revision,
  ].slice(-50);
}
