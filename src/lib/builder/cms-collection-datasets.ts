/**
 * cms-collection-datasets.ts — data-driven dataset binding for USER-created CMS collections.
 *
 * WIX-PERFECT backlog #6: the core Wix "create collection → bind a repeater/dynamic page →
 * publish your own data" loop was closed to 3 hardcoded static collections
 * (builderDatasetCollectionIds in types.ts). User-created `site.cmsCollections` could be made
 * in the Content Manager but were never bindable.
 *
 * This module is an ADDITIVE parallel path — it does NOT widen the closed built-in unions
 * (which would ripple through every exhaustive switch). Instead it provides:
 *   - a stable target id scheme for user collections:  `cms.<collectionId>.list`
 *   - generic bindable-target descriptors derived from a collection's own fields
 *   - a generic resolver that applies the SAME filter → sort → limit binding contract to a
 *     collection's published records, returning the same record-row shape the built-in
 *     resolvers/repeaters already consume.
 *
 * The built-in 3 targets remain untouched; callers check `isCmsCollectionTargetId(targetId)`
 * to route to this path, otherwise fall through to the existing built-in resolvers.
 */
import type {
  BuilderCmsCollection,
  BuilderCmsFieldDefinition,
  BuilderCmsRecord,
} from '@/lib/builder/cms-types';
import type {
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';

const CMS_TARGET_PREFIX = 'cms.';
const CMS_TARGET_SUFFIX = '.list';

/** A bindable dataset row, matching the generic shape built-in resolvers emit. */
export interface CmsDatasetRow {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
  fieldValues: Record<string, string>;
}

/** Describes one bindable target sourced from a user CMS collection. */
export interface CmsCollectionBindableTarget {
  targetId: string;
  collectionId: string;
  label: string;
  /** field keys that can be bound to canvas elements */
  bindableFields: Array<{ key: string; label: string; type: string }>;
  recordCount: number;
}

/** Build the dataset target id for a user collection (stable, reversible). */
export function cmsCollectionTargetId(collectionId: string): string {
  return `${CMS_TARGET_PREFIX}${collectionId}${CMS_TARGET_SUFFIX}`;
}

/** True when a targetId addresses a user CMS collection (vs a built-in target). */
export function isCmsCollectionTargetId(value: string | null | undefined): boolean {
  return (
    typeof value === 'string'
    && value.startsWith(CMS_TARGET_PREFIX)
    && value.endsWith(CMS_TARGET_SUFFIX)
    && value.length > CMS_TARGET_PREFIX.length + CMS_TARGET_SUFFIX.length
  );
}

/** Extract the collectionId from a cms target id, or null if not a cms target. */
export function collectionIdFromCmsTargetId(value: string | null | undefined): string | null {
  if (!isCmsCollectionTargetId(value)) return null;
  return (value as string).slice(CMS_TARGET_PREFIX.length, -CMS_TARGET_SUFFIX.length);
}

function fieldKeys(collection: BuilderCmsCollection): BuilderCmsFieldDefinition[] {
  return Array.isArray(collection.fields) ? collection.fields : [];
}

/** Pick the best "title-ish" field key for primary labels (slug-aware, title-first). */
function pickTitleKey(fields: BuilderCmsFieldDefinition[]): string | null {
  const byKey = (k: string) => fields.find((f) => f.key === k);
  return (
    byKey('title')?.key
    ?? byKey('name')?.key
    ?? fields.find((f) => f.type === 'text' && f.key !== 'slug')?.key
    ?? fields[0]?.key
    ?? null
  );
}

function pickSlugKey(fields: BuilderCmsFieldDefinition[]): string | null {
  return fields.find((f) => f.type === 'slug')?.key ?? fields.find((f) => f.key === 'slug')?.key ?? null;
}

function pickSecondaryKey(fields: BuilderCmsFieldDefinition[], titleKey: string | null): string | null {
  return (
    fields.find((f) => (f.key === 'summary' || f.key === 'description' || f.key === 'subtitle') && f.key !== titleKey)?.key
    ?? fields.find((f) => (f.type === 'text' || f.type === 'rich-text') && f.key !== titleKey)?.key
    ?? null
  );
}

function stringifyFieldValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(stringifyFieldValue).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // image value or relation-ish object → prefer url/src/id
    return stringifyFieldValue(obj.url ?? obj.src ?? obj.value ?? obj.id ?? '');
  }
  return '';
}

/** Find a user collection by id from a site document (published or draft). */
export function findCmsCollection(
  site: { cmsCollections?: BuilderCmsCollection[] } | undefined,
  collectionId: string,
): BuilderCmsCollection | null {
  if (!site?.cmsCollections) return null;
  return site.cmsCollections.find((c) => c.collectionId === collectionId) ?? null;
}

/** Enumerate bindable targets for every user collection on the site. */
export function listCmsCollectionBindableTargets(
  site: { cmsCollections?: BuilderCmsCollection[] } | undefined,
): CmsCollectionBindableTarget[] {
  if (!site?.cmsCollections) return [];
  return site.cmsCollections.map((collection) => {
    const fields = fieldKeys(collection);
    return {
      targetId: cmsCollectionTargetId(collection.collectionId),
      collectionId: collection.collectionId,
      label: collection.name || collection.collectionId,
      bindableFields: fields.map((f) => ({ key: f.key, label: f.label, type: f.type })),
      recordCount: Array.isArray(collection.records) ? collection.records.length : 0,
    };
  });
}

function recordFieldValue(record: BuilderCmsRecord, key: string): string {
  return stringifyFieldValue(record.fields?.[key]);
}

function applyFilters(
  records: BuilderCmsRecord[],
  filters: BuilderPageDatasetFilter[] | undefined,
): BuilderCmsRecord[] {
  if (!filters || filters.length === 0) return records;
  return records.filter((record) =>
    filters.every((filter) => {
      const value = recordFieldValue(record, filter.fieldId).toLowerCase();
      const target = String(filter.value ?? '').toLowerCase();
      if (filter.operator === 'contains') return value.includes(target);
      return value === target; // 'equals'
    }),
  );
}

function applySort(
  records: BuilderCmsRecord[],
  sort: BuilderPageDatasetSort[] | undefined,
): BuilderCmsRecord[] {
  if (!sort || sort.length === 0) return records;
  const sorted = [...records];
  sorted.sort((a, b) => {
    for (const rule of sort) {
      const av = recordFieldValue(a, rule.fieldId);
      const bv = recordFieldValue(b, rule.fieldId);
      const cmp = av.localeCompare(bv, undefined, { numeric: true });
      if (cmp !== 0) return rule.direction === 'desc' ? -cmp : cmp;
    }
    return 0;
  });
  return sorted;
}

export interface ResolveCmsCollectionDatasetOptions {
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
  /** only published records are returned for public render; default true */
  publishedOnly?: boolean;
  /** base route for record detail links, e.g. `/ko/<collectionSlug>` */
  routeBase?: string;
}

/**
 * Resolve a user collection's records into bindable dataset rows, applying the same
 * filter → sort → limit contract the built-in resolvers use.
 */
export function resolveCmsCollectionDataset(
  collection: BuilderCmsCollection,
  options: ResolveCmsCollectionDatasetOptions = {},
): CmsDatasetRow[] {
  const fields = fieldKeys(collection);
  const titleKey = pickTitleKey(fields);
  const slugKey = pickSlugKey(fields);
  const secondaryKey = pickSecondaryKey(fields, titleKey);
  const publishedOnly = options.publishedOnly !== false;
  const routeBase = options.routeBase ?? `/${collection.slug}`;

  let records = Array.isArray(collection.records) ? collection.records : [];
  if (publishedOnly) records = records.filter((r) => r.status === 'published');
  records = applyFilters(records, options.filters);
  records = applySort(records, options.sort);
  if (typeof options.limit === 'number' && options.limit >= 0) records = records.slice(0, options.limit);

  return records.map((record) => {
    const slug = slugKey ? recordFieldValue(record, slugKey) : record.recordId;
    const routePath = `${routeBase.replace(/\/$/, '')}/${slug}`;
    const fieldValues: Record<string, string> = { recordId: record.recordId, slug, href: routePath, url: routePath };
    for (const f of fields) fieldValues[f.key] = recordFieldValue(record, f.key);
    return {
      recordId: record.recordId,
      primaryLabel: titleKey ? recordFieldValue(record, titleKey) : record.recordId,
      secondaryLabel: secondaryKey ? recordFieldValue(record, secondaryKey) : '',
      routePath,
      fieldValues,
    };
  });
}

/** Convenience: resolve directly from a site doc + cms target id. Returns [] if not found. */
export function resolveCmsCollectionDatasetByTarget(
  site: { cmsCollections?: BuilderCmsCollection[] } | undefined,
  targetId: string,
  options: ResolveCmsCollectionDatasetOptions = {},
): CmsDatasetRow[] {
  const collectionId = collectionIdFromCmsTargetId(targetId);
  if (!collectionId) return [];
  const collection = findCmsCollection(site, collectionId);
  if (!collection) return [];
  return resolveCmsCollectionDataset(collection, options);
}
