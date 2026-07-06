import {
  BuilderCmsPermissionError,
  canAccessBuilderCmsCollection,
  normalizeCmsCollections,
  type BuilderCmsAccessOptions,
} from '@/lib/builder/cms-editable';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  appendSlugRepairRevision,
  findSlugField,
  normalizeRepairRecordIds,
  normalizeSlugFieldKey,
  nextUniqueSlug,
  readSlugValue,
  resolveSlugBase,
  type BuilderCmsBulkSlugRepairResult,
} from '@/lib/builder/cms-slug-repair';
import {
  normalizeOptionalSlugConflictRule,
  resolveSlugConflictRepairBase,
} from '@/lib/builder/cms-slug-conflict-rule';
import { normalizeOptionalSlugSourceFieldKey } from '@/lib/builder/cms-slug-source-fields';
import { normalizeOptionalSlugPattern } from '@/lib/builder/cms-slug-pattern';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';

export async function bulkRepairEditableBuilderCmsRecordSlugConflicts(
  siteId: string,
  localeInput: string | null | undefined,
  collectionId: string,
  recordIdsInput: unknown,
  slugFieldInput: unknown,
  options: BuilderCmsAccessOptions = {},
  sourceFieldInput?: unknown,
  slugPatternInput?: unknown,
  slugConflictRuleInput?: unknown,
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
  const slugConflictRule = normalizeOptionalSlugConflictRule(slugConflictRuleInput);
  const requestedRecordIds = new Set(recordIds);
  const conflictRecordIds = selectDuplicateSlugRepairRecordIds(collection, slugField.key);
  const repairTargetRecordIds = new Set(recordIds.filter((recordId) => conflictRecordIds.has(recordId)));
  const foundRecordIds = new Set<string>();
  const skippedRecordIds: string[] = [];
  const usedSlugs = collectStableSlugs(collection, slugField.key, repairTargetRecordIds);
  const now = new Date().toISOString();
  let updated = 0;

  const records = collection.records.map((record) => {
    if (!requestedRecordIds.has(record.recordId)) return record;
    foundRecordIds.add(record.recordId);
    const currentSlug = readSlugValue(record.fields[slugField.key]);
    if (!currentSlug || !repairTargetRecordIds.has(record.recordId)) {
      skippedRecordIds.push(record.recordId);
      return record;
    }
    const base = resolveSlugBase(record, collection.fields, sourceFieldKey, slugPattern);
    const repairBase = resolveSlugConflictRepairBase(base, record.recordId, slugConflictRule);
    const nextSlug = nextUniqueSlug(repairBase, usedSlugs);
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
    ...(slugConflictRule === undefined ? {} : { slugConflictRule }),
  };
}

function selectDuplicateSlugRepairRecordIds(
  collection: BuilderCmsCollection,
  slugFieldKey: string,
): Set<string> {
  const seenSlugs = new Set<string>();
  const duplicateRecordIds = new Set<string>();
  for (const record of collection.records) {
    const slug = readSlugValue(record.fields[slugFieldKey]);
    if (!slug) continue;
    if (seenSlugs.has(slug)) {
      duplicateRecordIds.add(record.recordId);
      continue;
    }
    seenSlugs.add(slug);
  }
  return duplicateRecordIds;
}

function collectStableSlugs(
  collection: BuilderCmsCollection,
  slugFieldKey: string,
  repairTargetRecordIds: ReadonlySet<string>,
): Set<string> {
  const slugs = new Set<string>();
  for (const record of collection.records) {
    if (repairTargetRecordIds.has(record.recordId)) continue;
    const slug = readSlugValue(record.fields[slugFieldKey]);
    if (slug) slugs.add(slug);
  }
  return slugs;
}
