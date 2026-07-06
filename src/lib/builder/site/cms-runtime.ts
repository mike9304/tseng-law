import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import type { BuilderCollectionRecordSeoPreview as BuilderCmsCollectionRecordSeoPreview } from '@/lib/builder/cms';
import type { ColumnPost } from '@/lib/columns';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import type { BuilderAttorneyProfileItem, BuilderServiceItem } from '@/lib/builder/types';

export interface PublishedCmsCollectionRecordPreview {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
  fieldValues: Record<string, string>;
}

type SupportedCmsRuntimeCollectionId = 'columns' | 'service-areas' | 'attorney-profiles';

interface CmsRuntimeCollectionConfig {
  collectionId: SupportedCmsRuntimeCollectionId;
  routeBase: (locale: Locale) => string;
  titleKeys: string[];
  descriptionKeys: string[];
  imageKeys?: string[];
  secondaryLabel: (collection: BuilderCmsCollection, record: Record<string, unknown>, locale: Locale) => string;
  keywords: (collection: BuilderCmsCollection, record: Record<string, unknown>, locale: Locale, title: string) => string[];
}

const cmsRuntimeCollectionConfigs: Record<SupportedCmsRuntimeCollectionId, CmsRuntimeCollectionConfig> = {
  columns: {
    collectionId: 'columns',
    routeBase: (locale) => `/${locale}/columns`,
    titleKeys: ['title', 'name'],
    descriptionKeys: ['summary', 'description', 'content'],
    imageKeys: ['featuredImage', 'image'],
    secondaryLabel: (_collection, record, locale) => {
      const category = readTextValue(record, 'category');
      const date = readTextValue(record, 'date');
      const labelParts = [category, date].filter(Boolean);
      const localeLabel = locale === 'en'
        ? 'Taiwan law'
        : locale === 'zh-hant'
          ? '台灣法律'
          : '대만 법률';
      labelParts.push(localeLabel);
      return labelParts.join(' · ');
    },
    keywords: (_collection, record, locale, title) => {
      const category = readTextValue(record, 'category');
      const keywords = [title, category];
      keywords.push(
        locale === 'en'
          ? 'Taiwan law'
          : locale === 'zh-hant'
            ? '台灣法律'
            : '대만 법률',
      );
      return keywords.filter((value): value is string => Boolean(value));
    },
  },
  'service-areas': {
    collectionId: 'service-areas',
    routeBase: (locale) => `/${locale}/services`,
    titleKeys: ['title', 'name'],
    descriptionKeys: ['subtitle', 'description', 'intro'],
    imageKeys: ['featuredImage', 'image'],
    secondaryLabel: (collection, record, locale) => {
      const subtitle = readTextValue(record, 'subtitle');
      const linkedColumns = readListValue(record, 'columnSlugs').length;
      const localeLabel = locale === 'en'
        ? 'Taiwan lawyer'
        : locale === 'zh-hant'
          ? '台灣律師'
          : '대만 변호사';
      return [subtitle, `${linkedColumns} linked columns`, localeLabel].filter(Boolean).join(' · ');
    },
    keywords: (_collection, record, locale, title) => {
      const subtitle = readTextValue(record, 'subtitle');
      return [
        title,
        subtitle,
        locale === 'en'
          ? 'Taiwan lawyer'
          : locale === 'zh-hant'
            ? '台灣律師'
            : '대만 변호사',
      ].filter((value): value is string => Boolean(value));
    },
  },
  'attorney-profiles': {
    collectionId: 'attorney-profiles',
    routeBase: (locale) => `/${locale}/lawyers`,
    titleKeys: ['name', 'title'],
    descriptionKeys: ['description', 'summary', 'role'],
    imageKeys: ['image', 'featuredImage'],
    secondaryLabel: (_collection, record) => {
      const role = readTextValue(record, 'role');
      const email = readTextValue(record, 'email');
      return [role, email].filter(Boolean).join(' · ');
    },
    keywords: (_collection, record, _locale, title) => {
      const role = readTextValue(record, 'role');
      const email = readTextValue(record, 'email');
      return [title, role, email].filter((value): value is string => Boolean(value));
    },
  },
};

export function resolvePublishedCmsCollectionRecordPreviews(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  collectionId: string,
  locale: Locale,
): PublishedCmsCollectionRecordPreview[] | null {
  const config = cmsRuntimeCollectionConfigs[collectionId as SupportedCmsRuntimeCollectionId];
  if (!config) return null;
  const collection = findCmsCollection(site, config.collectionId);
  if (!collection) return null;

  return collection.records
    .filter((record) => record.status === 'published')
    .filter((record) => !collection.localized || record.locale === locale || !record.locale)
    .map((record) => buildCmsCollectionRecordPreview(collection, record.fields, record.recordId, locale, config))
    .filter((preview): preview is PublishedCmsCollectionRecordPreview => Boolean(preview));
}

export function resolvePublishedCmsColumnPosts(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  locale: Locale,
): ColumnPost[] | null {
  const collection = findCmsCollection(site, 'columns');
  if (!collection) return null;

  const mapped = collection.records
    .filter((record) => record.status === 'published')
    .filter((record) => !collection.localized || record.locale === locale || !record.locale)
    .map((record) => {
      const slug = readSlugValue(record.recordId, record.fields);
      const title = readFirstTextValue(record.fields, ['title', 'name']) ?? slug;
      const summary = readDescriptionValue(record.fields, ['summary', 'description', 'content'], title);
      const category = resolveColumnCategory(readFirstTextValue(record.fields, ['category']));
      const categoryLabel = readFirstTextValue(record.fields, ['categoryLabel'])
        ?? resolveColumnCategoryLabel(category, locale);
      const featuredImage = readImageValue(record.fields, ['featuredImage', 'image']) ?? '';
      const date = readFirstTextValue(record.fields, ['date']) ?? '';
      const dateDisplay = readFirstTextValue(record.fields, ['dateDisplay']) ?? date;
      const readTime = readFirstTextValue(record.fields, ['readTime']) ?? '';
      const content = readDescriptionValue(record.fields, ['content', 'summary', 'description'], summary);

      return {
        slug,
        title,
        date,
        dateDisplay,
        readTime,
        category,
        categoryLabel,
        blogCategory: category === 'formation' ? 'company-formation' : 'general',
        tags: [],
        featuredImage,
        content,
        summary,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return mapped.length > 0 ? mapped : null;
}

export function resolvePublishedCmsServiceItems(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  locale: Locale,
  posts: ColumnPost[],
): BuilderServiceItem[] | null {
  const collection = findCmsCollection(site, 'service-areas');
  if (!collection) return null;
  const postsBySlug = new Map(posts.map((post) => [post.slug, post] as const));

  return collection.records
    .filter((record) => record.status === 'published')
    .filter((record) => !collection.localized || record.locale === locale || !record.locale)
    .map((record) => {
      const slug = readSlugValue(record.recordId, record.fields);
      const title = readFirstTextValue(record.fields, ['title', 'name']) ?? slug;
      const description = readFirstTextValue(record.fields, ['description', 'subtitle', 'summary', 'intro']) ?? '';
      const details = readListValue(record.fields, 'keyPoints');
      const relatedColumns = readListValue(record.fields, 'columnSlugs')
        .map((columnSlug) => ({
          slug: columnSlug,
          title: postsBySlug.get(columnSlug)?.title ?? columnSlug,
        }));

      return {
        title,
        description,
        href: `/${locale}/services/${slug}`,
        details: details.length > 0 ? details : undefined,
        relatedColumns: relatedColumns.length > 0 ? relatedColumns : undefined,
      };
    });
}

export function resolvePublishedCmsAttorneyItems(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  locale: Locale,
): BuilderAttorneyProfileItem[] | null {
  const collection = findCmsCollection(site, 'attorney-profiles');
  if (!collection) return null;

  return collection.records
    .filter((record) => record.status === 'published')
    .filter((record) => !collection.localized || record.locale === locale || !record.locale)
    .map((record) => {
      const slug = readSlugValue(record.recordId, record.fields);
      const name = readFirstTextValue(record.fields, ['name', 'title']) ?? slug;
      const role = readFirstTextValue(record.fields, ['role', 'subtitle']) ?? '';
      const title = readFirstTextValue(record.fields, ['title']) ?? name;
      const description = readDescriptionValue(record.fields, ['description', 'summary'], title);
      const email = readFirstTextValue(record.fields, ['email']) ?? '';
      const image = readImageValue(record.fields, ['image', 'featuredImage']) ?? '';
      const imageAltText = readImageAltText(record.fields, ['image', 'featuredImage']) ?? `${name} ${role}`;
      const imageFocalPoint = readImageFocalPoint(record.fields, ['image', 'featuredImage']);
      const summary = readListValue(record.fields, 'summary');

      return {
        slug,
        name,
        role,
        title,
        description,
        email,
        image,
        imageAltText,
        imageFocalPoint,
        summary: summary.length > 0 ? summary : [description],
        href: `/${locale}/lawyers/${slug}`,
      };
    });
}

export function findPublishedCmsCollectionRecordSeo(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  collectionId: string,
  locale: Locale,
  recordSlug: string | null | undefined,
): BuilderCmsCollectionRecordSeoPreview | null {
  const slug = recordSlug?.trim();
  if (!slug) return null;
  const config = cmsRuntimeCollectionConfigs[collectionId as SupportedCmsRuntimeCollectionId];
  if (!config) return null;
  const collection = findCmsCollection(site, config.collectionId);
  if (!collection) return null;

  const match = collection.records.find((record) => (
    record.status === 'published'
    && (!collection.localized || record.locale === locale || !record.locale)
    && slugMatchesRecord(record.recordId, record.fields, slug)
  ));
  if (!match) return null;

  const title = readFirstTextValue(match.fields, config.titleKeys) ?? match.recordId;
  const description = readDescriptionValue(match.fields, config.descriptionKeys, title);
  const canonicalPath = `${config.routeBase(locale)}/${readSlugValue(match.recordId, match.fields)}`;
  const image = readImageValue(match.fields, config.imageKeys);

  return {
    title,
    description,
    canonicalPath,
    keywords: config.keywords(collection, match.fields, locale, title),
    image,
    noIndex: false,
  };
}

function buildCmsCollectionRecordPreview(
  collection: BuilderCmsCollection,
  record: Record<string, unknown>,
  recordId: string,
  locale: Locale,
  config: CmsRuntimeCollectionConfig,
): PublishedCmsCollectionRecordPreview | null {
  const slug = readSlugValue(recordId, record);
  const title = readFirstTextValue(record, config.titleKeys) ?? slug;
  const secondaryLabel = config.secondaryLabel(collection, record, locale);
  const description = readDescriptionValue(record, config.descriptionKeys, secondaryLabel || title);
  const routePath = `${config.routeBase(locale)}/${slug}`;
  const fieldValues = buildCmsCollectionRecordFieldValues({
    description,
    record,
    routePath,
    slug,
    title,
  });
  return {
    recordId: slug,
    primaryLabel: title,
    secondaryLabel,
    routePath,
    fieldValues,
  };
}

function buildCmsCollectionRecordFieldValues({
  description,
  record,
  routePath,
  slug,
  title,
}: {
  description: string;
  record: Record<string, unknown>;
  routePath: string;
  slug: string;
  title: string;
}): Record<string, string> {
  const fieldValues: Record<string, string> = {
    href: routePath,
    recordId: slug,
    slug,
    url: routePath,
  };
  for (const [key, value] of Object.entries(record)) {
    const textValue = readFieldValueText(value);
    if (textValue) fieldValues[key] = textValue;
  }
  fieldValues.title = fieldValues.title || fieldValues.name || title;
  fieldValues.name = fieldValues.name || fieldValues.title || title;
  fieldValues.description = fieldValues.description || fieldValues.summary || fieldValues.subtitle || description;
  fieldValues.summary = fieldValues.summary || fieldValues.description || description;
  return fieldValues;
}

function findCmsCollection(
  site: Pick<BuilderSiteDocument, 'cmsCollections'>,
  collectionId: string,
): BuilderCmsCollection | null {
  return site.cmsCollections?.find((collection) => collection.collectionId === collectionId) ?? null;
}

function slugMatchesRecord(recordId: string, record: Record<string, unknown>, slug: string): boolean {
  return readSlugValue(recordId, record) === slug;
}

function readSlugValue(recordId: string, record: Record<string, unknown>): string {
  const fieldValue = readTextValue(record, 'slug') ?? readTextValue(record, 'slugPath') ?? readTextValue(record, 'path');
  return normalizeRecordId(fieldValue ?? recordId);
}

function readFirstTextValue(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = readTextValue(record, key);
    if (value) return value;
  }
  return null;
}

function readDescriptionValue(record: Record<string, unknown>, keys: string[], fallback: string): string {
  const value = readFirstTextValue(record, keys);
  if (!value) return fallback;
  return stripHtml(value).trim() || fallback;
}

function readImageValue(record: Record<string, unknown>, keys?: string[]): string | undefined {
  for (const key of keys ?? []) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const maybeUrl = (value as { url?: unknown }).url;
      if (typeof maybeUrl === 'string' && maybeUrl.trim()) return maybeUrl.trim();
    }
  }
  return undefined;
}

function readImageAltText(record: Record<string, unknown>, keys?: string[]): string | undefined {
  for (const key of keys ?? []) {
    const value = record[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const maybeAlt = (value as { altText?: unknown }).altText;
      if (typeof maybeAlt === 'string' && maybeAlt.trim()) return maybeAlt.trim();
    }
  }
  return undefined;
}

function readImageFocalPoint(record: Record<string, unknown>, keys?: string[]): { x: number; y: number } {
  for (const key of keys ?? []) {
    const value = record[key];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const maybeFocalPoint = (value as { focalPoint?: unknown }).focalPoint;
      if (maybeFocalPoint && typeof maybeFocalPoint === 'object' && !Array.isArray(maybeFocalPoint)) {
        const source = maybeFocalPoint as { x?: unknown; y?: unknown };
        return {
          x: readImageFocalCoordinate(source.x),
          y: readImageFocalCoordinate(source.y),
        };
      }
    }
  }
  return { x: 0.5, y: 0.5 };
}

function readImageFocalCoordinate(input: unknown): number {
  const value = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(value)) return 0.5;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(3));
}

function readListValue(record: Record<string, unknown>, key: string): string[] {
  const value = record[key];
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split('\n').map((entry) => entry.trim()).filter(Boolean);
  }
  return [];
}

function readTextValue(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function readFieldValueText(value: unknown): string {
  if (typeof value === 'string') return stripHtml(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    return value.map(readFieldValueText).filter(Boolean).join(' ');
  }
  if (value && typeof value === 'object') {
    const maybeUrl = (value as { url?: unknown }).url;
    if (typeof maybeUrl === 'string') return maybeUrl.trim();
  }
  return '';
}

function resolveColumnCategory(value: string | null): ColumnPost['category'] {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'formation' || normalized === 'legal' || normalized === 'case') {
    return normalized;
  }
  return 'legal';
}

function resolveColumnCategoryLabel(category: ColumnPost['category'], locale: Locale): string {
  if (locale === 'en') {
    const map: Record<ColumnPost['category'], string> = {
      formation: 'Company Setup',
      legal: 'Legal Information',
      case: 'Case Study',
    };
    return map[category];
  }
  if (locale === 'zh-hant') {
    const map: Record<ColumnPost['category'], string> = {
      formation: '公司設立',
      legal: '法律資訊',
      case: '訴訟案例',
    };
    return map[category];
  }
  const map: Record<ColumnPost['category'], string> = {
    formation: '법인설립',
    legal: '법률정보',
    case: '소송사례',
  };
  return map[category];
}

function normalizeRecordId(value: string): string {
  const segments = value.trim().replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  return segments[segments.length - 1] ?? value.trim();
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
