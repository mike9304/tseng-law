import {
  attorneyProfiles,
  getAttorneyProfileSlugs,
} from '@/data/attorney-profiles';
import { serviceAreas } from '@/data/service-details';
import { getBuilderBindableTargetsForCollection } from '@/lib/builder/datasets';
import { getAllColumnPosts } from '@/lib/columns';
import { readAttorneyProfileSourceRecords, type AttorneyProfileSourceRecord } from '@/lib/builder/lawyers/source';
import { readServiceAreaSourceRecords, type ServiceAreaSourceRecord } from '@/lib/builder/services/source';
import { normalizeLocale } from '@/lib/locales';
import type { BuilderDatasetTargetId, BuilderPageKey } from '@/lib/builder/types';

export const builderCollectionIds = [
  'columns',
  'service-areas',
  'attorney-profiles',
] as const;

export type BuilderCollectionId = (typeof builderCollectionIds)[number];

export type BuilderCollectionFieldType =
  | 'text'
  | 'rich-text'
  | 'slug'
  | 'date'
  | 'image'
  | 'email'
  | 'string-list'
  | 'url-list'
  | 'reference-list';

export interface BuilderCollectionFieldSummary {
  key: string;
  label: string;
  type: BuilderCollectionFieldType;
  localized: boolean;
  repeated: boolean;
  required: boolean;
  relationCollectionId?: BuilderCollectionId;
}

export interface BuilderCollectionRouteBindingSummary {
  kind: 'list' | 'item';
  pathPattern: string;
  notes: string;
}

export interface BuilderCollectionSummary {
  id: BuilderCollectionId;
  title: string;
  description: string;
  sourceLabel: string;
  localized: boolean;
  recordCount: number;
  fieldCount: number;
  supportsRelations: boolean;
  fields: BuilderCollectionFieldSummary[];
  routeBindings: BuilderCollectionRouteBindingSummary[];
  bindableTargets: BuilderCollectionBindableTargetSummary[];
}

export interface BuilderCollectionRecordPreview {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
  seo: BuilderCollectionRecordSeoPreview;
  sourceFields?: BuilderCollectionRecordSourceFields;
}

export interface BuilderCollectionRecordSeoPreview {
  title: string;
  description: string;
  canonicalPath: string;
  keywords: string[];
  image?: string;
  imageAltText?: string;
  imageFocalPoint?: {
    x: number;
    y: number;
  };
  noIndex: boolean;
}

export interface BuilderCollectionRecordSourceFields {
  intro?: string;
  keyPoints?: readonly string[];
  columnSlugs?: readonly string[];
  columnOptions?: readonly BuilderCollectionRecordRelationOption[];
  summary?: readonly string[];
  languages?: readonly string[];
  practiceAreas?: readonly string[];
  internalLinks?: readonly BuilderCollectionRecordLink[];
}

export interface BuilderCollectionRecordRelationOption {
  slug: string;
  title: string;
}

export interface BuilderCollectionRecordLink {
  label: string;
  href: string;
}

export interface BuilderCollectionBindableTargetSummary {
  targetId: BuilderDatasetTargetId;
  pageKey: BuilderPageKey;
  sectionKey: string;
  title: string;
  description: string;
  runtimeStatus: string;
}

export interface BuilderCollectionDetail extends BuilderCollectionSummary {
  sampleRecords: BuilderCollectionRecordPreview[];
}

interface BuilderCollectionRecordPreviewSources {
  attorneyProfileRecords?: readonly AttorneyProfileSourceRecord[];
  serviceAreaRecords?: readonly ServiceAreaSourceRecord[];
}

function readBindableTargets(collectionId: BuilderCollectionId): BuilderCollectionBindableTargetSummary[] {
  return getBuilderBindableTargetsForCollection(collectionId).map((target) => ({
    targetId: target.targetId,
    pageKey: target.pageKey,
    sectionKey: target.sectionKey,
    title: target.title,
    description: target.description,
    runtimeStatus: target.runtimeStatus,
  }));
}

export function isBuilderCollectionId(
  value: string | null | undefined
): value is BuilderCollectionId {
  return builderCollectionIds.includes(value as BuilderCollectionId);
}

export function readBuilderCollectionSummaries(
  localeInput: string | null | undefined
): BuilderCollectionSummary[] {
  const locale = normalizeLocale(localeInput ?? undefined);
  const columnPosts = getAllColumnPosts(locale);
  const attorneyCount = getAttorneyProfileSlugs().length;
  const localizedAttorneyProfiles = attorneyProfiles[locale];

  const columnsFields: BuilderCollectionFieldSummary[] = [
    { key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    { key: 'title', label: 'Title', type: 'text', localized: true, repeated: false, required: true },
    { key: 'summary', label: 'Summary', type: 'rich-text', localized: true, repeated: false, required: true },
    { key: 'content', label: 'Content', type: 'rich-text', localized: true, repeated: false, required: true },
    { key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: true },
    { key: 'date', label: 'Date', type: 'date', localized: false, repeated: false, required: true },
    { key: 'featuredImage', label: 'Featured image', type: 'image', localized: false, repeated: false, required: true },
  ];

  const serviceAreaFields: BuilderCollectionFieldSummary[] = [
    { key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    { key: 'title', label: 'Title', type: 'text', localized: true, repeated: false, required: true },
    { key: 'subtitle', label: 'Subtitle', type: 'text', localized: true, repeated: false, required: true },
    { key: 'intro', label: 'Intro', type: 'rich-text', localized: true, repeated: false, required: true },
    { key: 'keyPoints', label: 'Key points', type: 'string-list', localized: true, repeated: true, required: true },
    {
      key: 'columnSlugs',
      label: 'Related columns',
      type: 'reference-list',
      localized: false,
      repeated: true,
      required: false,
      relationCollectionId: 'columns',
    },
  ];

  const attorneyFields: BuilderCollectionFieldSummary[] = [
    { key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
    { key: 'name', label: 'Name', type: 'text', localized: true, repeated: false, required: true },
    { key: 'role', label: 'Role', type: 'text', localized: true, repeated: false, required: true },
    { key: 'description', label: 'Description', type: 'rich-text', localized: true, repeated: false, required: true },
    { key: 'summary', label: 'Summary', type: 'string-list', localized: true, repeated: true, required: true },
    { key: 'email', label: 'Email', type: 'email', localized: false, repeated: false, required: true },
    { key: 'image', label: 'Profile image', type: 'image', localized: false, repeated: false, required: true },
    { key: 'languages', label: 'Languages', type: 'string-list', localized: true, repeated: true, required: true },
    { key: 'practiceAreas', label: 'Practice areas', type: 'string-list', localized: true, repeated: true, required: true },
    { key: 'internalLinks', label: 'Internal links', type: 'url-list', localized: true, repeated: true, required: false },
  ];

  return [
    {
      id: 'columns',
      title: 'Insights columns',
      description:
        'Real article inventory sourced from markdown content and localized archive transforms.',
      sourceLabel: 'src/lib/columns.ts + src/content/columns*',
      localized: true,
      recordCount: columnPosts.length,
      fieldCount: columnsFields.length,
      supportsRelations: false,
      fields: columnsFields,
      routeBindings: [
        {
          kind: 'list',
          pathPattern: `/${locale}/columns`,
          notes: 'Live static feed page today. Candidate list template for CMS-backed parity later.',
        },
        {
          kind: 'item',
          pathPattern: `/${locale}/columns/[slug]`,
          notes: 'Live static article route today. Candidate dynamic item page once dataset binding is real.',
        },
      ],
      bindableTargets: readBindableTargets('columns'),
    },
    {
      id: 'service-areas',
      title: 'Service areas',
      description:
        'Localized service vertical definitions with explicit references to related column content.',
      sourceLabel: 'src/data/service-details.ts',
      localized: true,
      recordCount: serviceAreas.length,
      fieldCount: serviceAreaFields.length,
      supportsRelations: true,
      fields: serviceAreaFields,
      routeBindings: [
        {
          kind: 'list',
          pathPattern: `/${locale}/services`,
          notes: 'Live static list route today. Candidate CMS list template later.',
        },
        {
          kind: 'item',
          pathPattern: `/${locale}/services/[slug]`,
          notes: 'Live static service detail route today. Candidate dynamic item template later.',
        },
      ],
      bindableTargets: readBindableTargets('service-areas'),
    },
    {
      id: 'attorney-profiles',
      title: 'Attorney profiles',
      description:
        'Localized attorney profile records used by lawyer detail pages and profile proofs.',
      sourceLabel: 'src/data/attorney-profiles.ts',
      localized: true,
      recordCount: attorneyCount,
      fieldCount: attorneyFields.length,
      supportsRelations: false,
      fields: attorneyFields,
      routeBindings: [
        {
          kind: 'list',
          pathPattern: `/${locale}/lawyers`,
          notes: 'Live list route today. Candidate CMS list template later.',
        },
        {
          kind: 'item',
          pathPattern: `/${locale}/lawyers/[slug]`,
          notes: `Live static profile route today. Current record count: ${Object.keys(localizedAttorneyProfiles).length}.`,
        },
      ],
      bindableTargets: readBindableTargets('attorney-profiles'),
    },
  ];
}

export function readBuilderCollectionDetails(
  localeInput: string | null | undefined
): BuilderCollectionDetail[] {
  return builderCollectionIds.map((collectionId) => readBuilderCollectionDetail(collectionId, localeInput));
}

export async function readBuilderCollectionDetailsForSite(
  siteId: string,
  localeInput: string | null | undefined,
): Promise<BuilderCollectionDetail[]> {
  const locale = normalizeLocale(localeInput ?? undefined);
  const [serviceAreaRecords, attorneyProfileRecords] = await Promise.all([
    readServiceAreaSourceRecords(siteId, locale),
    readAttorneyProfileSourceRecords(siteId, locale),
  ]);

  return builderCollectionIds.map((collectionId) => readBuilderCollectionDetail(collectionId, locale, {
    attorneyProfileRecords,
    serviceAreaRecords,
  }));
}

export async function readBuilderCollectionDetailForSite(
  siteId: string,
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined,
): Promise<BuilderCollectionDetail> {
  const locale = normalizeLocale(localeInput ?? undefined);
  if (collectionId === 'service-areas') {
    return readBuilderCollectionDetail(collectionId, locale, {
      serviceAreaRecords: await readServiceAreaSourceRecords(siteId, locale),
    });
  }
  if (collectionId === 'attorney-profiles') {
    return readBuilderCollectionDetail(collectionId, locale, {
      attorneyProfileRecords: await readAttorneyProfileSourceRecords(siteId, locale),
    });
  }
  return readBuilderCollectionDetail(collectionId, locale);
}

export function readBuilderCollectionDetail(
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined,
  sources: BuilderCollectionRecordPreviewSources = {},
): BuilderCollectionDetail {
  const locale = normalizeLocale(localeInput ?? undefined);
  const summaries = readBuilderCollectionSummaries(locale);
  const summary = summaries.find((candidate) => candidate.id === collectionId);

  if (!summary) {
    throw new Error(`Unknown builder collection detail: ${collectionId}`);
  }

  const allRecordPreviews = readBuilderCollectionRecordPreviews(collectionId, locale, sources);

  switch (collectionId) {
    case 'columns': {
      return {
        ...summary,
        sampleRecords: allRecordPreviews.slice(0, 4),
      };
    }
    case 'service-areas': {
      return {
        ...summary,
        sampleRecords: allRecordPreviews.slice(0, 4),
      };
    }
    case 'attorney-profiles': {
      return {
        ...summary,
        sampleRecords: allRecordPreviews,
      };
    }
    default:
      return assertNever(collectionId);
  }
}

export function readBuilderCollectionRecordPreviews(
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined,
  sources: BuilderCollectionRecordPreviewSources = {},
): BuilderCollectionRecordPreview[] {
  const locale = normalizeLocale(localeInput ?? undefined);
  const columnOptions = getAllColumnPosts(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
  }));

  switch (collectionId) {
    case 'columns':
      return getAllColumnPosts(locale).map((post) => ({
        recordId: post.slug,
        primaryLabel: post.title,
        secondaryLabel: `${post.categoryLabel} · ${post.dateDisplay || post.date}`,
        routePath: `/${locale}/columns/${post.slug}`,
        seo: {
          title: post.title,
          description: post.summary,
          canonicalPath: `/${locale}/columns/${post.slug}`,
          keywords: [
            post.title,
            post.categoryLabel,
            locale === 'ko' ? '대만 법률' : locale === 'zh-hant' ? '台灣法律' : 'Taiwan law',
          ],
          image: post.featuredImage,
          noIndex: locale === 'en',
        },
      }));
    case 'service-areas':
      return (sources.serviceAreaRecords ?? serviceAreas.map((area) => ({
        ...area,
        sourceSlug: area.slug,
      }))).map((area) => ({
        recordId: area.sourceSlug,
        primaryLabel: area.title[locale],
        secondaryLabel: `${area.subtitle[locale]} · ${area.columnSlugs.length} linked columns`,
        routePath: `/${locale}/services/${area.slug}`,
        seo: {
          title: area.title[locale],
          description: summarizeForSeo(area.intro[locale]),
          canonicalPath: `/${locale}/services/${area.slug}`,
          keywords: [
            area.title[locale],
            area.subtitle[locale],
            locale === 'ko' ? '대만 변호사' : locale === 'zh-hant' ? '台灣律師' : 'Taiwan lawyer',
          ],
          noIndex: false,
        },
        sourceFields: {
          intro: area.intro[locale],
          keyPoints: area.keyPoints[locale],
          columnSlugs: area.columnSlugs,
          columnOptions,
        },
      }));
    case 'attorney-profiles': {
      if (sources.attorneyProfileRecords) {
        return sources.attorneyProfileRecords.map((profile) => ({
          recordId: profile.sourceSlug,
          primaryLabel: profile.name,
          secondaryLabel: `${profile.role} · ${profile.email}`,
          routePath: `/${locale}/lawyers/${profile.slug}`,
          seo: {
            title: profile.title,
            description: profile.description,
            canonicalPath: `/${locale}/lawyers/${profile.slug}`,
            keywords: profile.keywords,
            image: profile.image,
            imageAltText: profile.imageAltText,
            imageFocalPoint: profile.imageFocalPoint,
            noIndex: false,
          },
          sourceFields: {
            summary: profile.summary,
            languages: profile.languages,
            practiceAreas: profile.practiceAreas,
            internalLinks: profile.internalLinks,
          },
        }));
      }

      const localizedAttorneyProfiles = attorneyProfiles[locale];
      return getAttorneyProfileSlugs().map((slug) => {
        const profile = localizedAttorneyProfiles[slug];

        return {
          recordId: profile.slug,
          primaryLabel: profile.name,
          secondaryLabel: `${profile.role} · ${profile.email}`,
          routePath: `/${locale}/lawyers/${profile.slug}`,
          seo: {
            title: profile.title,
            description: profile.description,
            canonicalPath: `/${locale}/lawyers/${profile.slug}`,
            keywords: profile.keywords,
            image: profile.image,
            imageAltText: `${profile.name.trim()} ${profile.role.trim()}`.trim(),
            imageFocalPoint: { x: 0.5, y: 0.5 },
            noIndex: false,
          },
          sourceFields: {
            summary: profile.summary,
            languages: profile.languages,
            practiceAreas: profile.practiceAreas,
            internalLinks: profile.internalLinks,
          },
        };
      });
    }
    default:
      return assertNever(collectionId);
  }
}

/**
 * Look up the SEO preview for a single CMS record. Returns null when the
 * collection/locale/slug combination doesn't resolve a record. Used by the
 * public dynamic item page to override page-template SEO with the matched
 * record's title/description/canonical/image fields.
 */
export function findBuilderCollectionRecordSeo(
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined,
  recordSlug: string | null | undefined,
): BuilderCollectionRecordSeoPreview | null {
  const slug = recordSlug?.trim();
  if (!slug) return null;
  const previews = readBuilderCollectionRecordPreviews(collectionId, localeInput);
  const match = previews.find((preview) => preview.recordId === slug);
  return match?.seo ?? null;
}

function summarizeForSeo(text: string, maxLength = 160) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}...` : text;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled collection branch: ${String(value)}`);
}
