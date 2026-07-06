import type { BuilderCollectionRecordSeoPreview } from '@/lib/builder/cms';
import {
  findBuilderCollectionRecordSeo,
  isBuilderCollectionId,
} from '@/lib/builder/cms';
import type { BuilderCmsCollection, BuilderCmsRecord } from '@/lib/builder/cms-types';
import { buildBuilderRecordJsonLd } from '@/lib/builder/seo/record-jsonld';
import { generateArticleSchema } from '@/lib/builder/seo/schema-org';
import type { BuilderDynamicItemPageMeta } from '@/lib/builder/site/dynamic-page-types';
import { findPublishedCmsCollectionRecordSeo } from '@/lib/builder/site/cms-runtime';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const titleKeyPreferences = ['title', 'name', 'headline', 'heading', 'label'] as const;
const descriptionKeyPreferences = [
  'seoDescription',
  'metaDescription',
  'description',
  'summary',
  'excerpt',
  'subtitle',
  'content',
  'body',
] as const;
const imageKeyPreferences = ['ogImage', 'featuredImage', 'heroImage', 'image', 'thumbnail', 'cover'] as const;
const dateKeyPreferences = ['publishedAt', 'publishDate', 'date', 'createdAt', 'updatedAt'] as const;
const authorKeyPreferences = ['author', 'authorName', 'writer', 'byline'] as const;
const noIndexKeyPreferences = ['noIndex', 'noindex', 'robotsNoindex'] as const;
const keywordKeyPreferences = ['keywords', 'tags', 'category'] as const;

interface DynamicItemRecordInput {
  readonly dynamicItem: BuilderDynamicItemPageMeta;
  readonly locale: Locale;
  readonly recordSlug: string | null | undefined;
  readonly site: Pick<BuilderSiteDocument, 'cmsCollections'>;
  readonly slugPath: string;
}

interface DynamicItemJsonLdInput extends DynamicItemRecordInput {
  readonly siteUrl: string;
}

interface ResolvedCustomRecord {
  readonly collection: BuilderCmsCollection;
  readonly record: BuilderCmsRecord;
}

export function resolvePublishedDynamicItemRecordSeo({
  dynamicItem,
  locale,
  recordSlug,
  site,
  slugPath,
}: DynamicItemRecordInput): BuilderCollectionRecordSeoPreview | null {
  const builtInCollectionId = dynamicItem.cmsCollectionId ?? dynamicItem.collectionId;
  if (isBuilderCollectionId(builtInCollectionId)) {
    return findPublishedCmsCollectionRecordSeo(site, builtInCollectionId, locale, recordSlug)
      ?? findBuilderCollectionRecordSeo(builtInCollectionId, locale, recordSlug);
  }

  const resolved = resolveCustomDynamicItemRecord({
    dynamicItem,
    locale,
    recordSlug,
    site,
  });
  if (!resolved) return null;

  const title = readRecordTitle(resolved.collection, resolved.record);
  const description = readRecordDescription(resolved.collection, resolved.record, title);
  const image = readRecordImage(resolved.collection, resolved.record);
  const keywords = readRecordKeywords(resolved.collection, resolved.record, title);

  return {
    title,
    description,
    canonicalPath: buildCanonicalPath(locale, slugPath),
    keywords,
    image,
    noIndex: readRecordNoIndex(resolved.record),
  };
}

export function isPublishedDynamicItemRecordRoutable({
  dynamicItem,
  locale,
  recordSlug,
  site,
}: Omit<DynamicItemRecordInput, 'slugPath'>): boolean {
  const slug = recordSlug?.trim();
  if (!slug) return false;

  const builtInCollectionId = dynamicItem.cmsCollectionId ?? dynamicItem.collectionId;
  if (isBuilderCollectionId(builtInCollectionId)) {
    return Boolean(
      findPublishedCmsCollectionRecordSeo(site, builtInCollectionId, locale, slug)
      ?? findBuilderCollectionRecordSeo(builtInCollectionId, locale, slug),
    );
  }

  return Boolean(resolveCustomDynamicItemRecord({
    dynamicItem,
    locale,
    recordSlug: slug,
    site,
  }));
}

export function resolvePublishedDynamicItemRecordJsonLd({
  dynamicItem,
  locale,
  recordSlug,
  site,
  siteUrl,
  slugPath,
}: DynamicItemJsonLdInput): Record<string, unknown> | null {
  const builtInCollectionId = dynamicItem.cmsCollectionId ?? dynamicItem.collectionId;
  if (isBuilderCollectionId(builtInCollectionId)) {
    return buildBuilderRecordJsonLd({
      collectionId: builtInCollectionId,
      locale,
      recordSlug: recordSlug?.trim() ?? '',
      siteUrl,
    });
  }

  const resolved = resolveCustomDynamicItemRecord({
    dynamicItem,
    locale,
    recordSlug,
    site,
  });
  if (!resolved) return null;

  const title = readRecordTitle(resolved.collection, resolved.record);
  const canonicalUrl = buildAbsoluteUrl(siteUrl, buildCanonicalPath(locale, slugPath));
  return generateArticleSchema({
    title,
    description: readRecordDescription(resolved.collection, resolved.record, title),
    datePublished: readRecordDate(resolved.record) ?? resolved.record.createdAt,
    author: readFirstRecordText(resolved.record, authorKeyPreferences) ?? undefined,
    image: readRecordImage(resolved.collection, resolved.record),
    url: canonicalUrl,
  });
}

function resolveCustomDynamicItemRecord({
  dynamicItem,
  locale,
  recordSlug,
  site,
}: Omit<DynamicItemRecordInput, 'slugPath'>): ResolvedCustomRecord | null {
  const cmsCollectionId = dynamicItem.cmsCollectionId?.trim();
  const slug = recordSlug?.trim();
  if (!cmsCollectionId || !slug) return null;
  const collection = site.cmsCollections?.find((candidate) => candidate.collectionId === cmsCollectionId);
  if (!collection) return null;
  const record = collection.records.find((candidate) => (
    candidate.status === 'published'
    && (!collection.localized || candidate.locale === locale || !candidate.locale)
    && readRecordSlug(candidate, dynamicItem.slugField) === slug
  ));
  return record ? { collection, record } : null;
}

function readRecordSlug(record: BuilderCmsRecord, slugField: string): string {
  const value = readTextValue(record.fields[slugField])
    ?? readTextValue(record.fields.slug)
    ?? readTextValue(record.fields.slugPath)
    ?? readTextValue(record.fields.path)
    ?? record.recordId;
  return normalizeRecordId(value);
}

function readRecordTitle(collection: BuilderCmsCollection, record: BuilderCmsRecord): string {
  return readFirstRecordText(record, [
    ...titleKeyPreferences,
    ...fieldKeysByType(collection, ['text']),
  ]) ?? readRecordSlug(record, 'slug');
}

function readRecordDescription(
  collection: BuilderCmsCollection,
  record: BuilderCmsRecord,
  fallback: string,
): string {
  const value = readFirstRecordText(record, [
    ...descriptionKeyPreferences,
    ...fieldKeysByType(collection, ['rich-text', 'text']),
  ]);
  return value ? stripHtml(value) : fallback;
}

function readRecordImage(collection: BuilderCmsCollection, record: BuilderCmsRecord): string | undefined {
  return readFirstRecordImage(record, [
    ...imageKeyPreferences,
    ...fieldKeysByType(collection, ['image']),
  ]);
}

function readRecordDate(record: BuilderCmsRecord): string | null {
  return readFirstRecordText(record, dateKeyPreferences);
}

function readRecordNoIndex(record: BuilderCmsRecord): boolean {
  return noIndexKeyPreferences.some((key) => record.fields[key] === true);
}

function readRecordKeywords(
  collection: BuilderCmsCollection,
  record: BuilderCmsRecord,
  title: string,
): string[] {
  const values = [
    title,
    collection.name,
    ...keywordKeyPreferences.flatMap((key) => readStringListValue(record.fields[key])),
  ];
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function fieldKeysByType(
  collection: BuilderCmsCollection,
  types: readonly BuilderCmsCollection['fields'][number]['type'][],
): string[] {
  return collection.fields
    .filter((field) => types.includes(field.type) && field.key !== 'slug')
    .map((field) => field.key);
}

function readFirstRecordText(record: BuilderCmsRecord, keys: readonly string[]): string | null {
  for (const key of keys) {
    const value = readTextValue(record.fields[key]);
    if (value) return value;
  }
  return null;
}

function readFirstRecordImage(record: BuilderCmsRecord, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = record.fields[key];
    const image = readImageValue(value);
    if (image) return image;
  }
  return undefined;
}

function readTextValue(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function readImageValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (!isRecordObject(value)) return undefined;
  const url = value.url;
  return typeof url === 'string' && url.trim() ? url.trim() : undefined;
}

function readStringListValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((entry) => String(entry).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((entry) => entry.trim()).filter(Boolean);
  return [];
}

function isRecordObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function buildCanonicalPath(locale: Locale, slugPath: string): string {
  const path = slugPath.trim().replace(/^\/+|\/+$/g, '');
  return path ? `/${locale}/${path}` : `/${locale}`;
}

function buildAbsoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleaned}`;
}

function normalizeRecordId(value: string): string {
  const segments = value.trim().replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return segments[segments.length - 1] ?? value.trim();
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
