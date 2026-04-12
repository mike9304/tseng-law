import {
  attorneyProfiles,
  getAttorneyProfileSlugs,
} from '@/data/attorney-profiles';
import { serviceAreas } from '@/data/service-details';
import { getBuilderBindableTargetsForCollection } from '@/lib/builder/datasets';
import { getAllColumnPosts } from '@/lib/columns';
import { normalizeLocale } from '@/lib/locales';

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
}

export interface BuilderCollectionRecordPreview {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
}

export interface BuilderCollectionBindableTargetSummary {
  targetId: string;
  pageKey: string;
  sectionKey: string;
  title: string;
  description: string;
  runtimeStatus: string;
}

export interface BuilderCollectionDetail extends BuilderCollectionSummary {
  sampleRecords: BuilderCollectionRecordPreview[];
  bindableTargets: BuilderCollectionBindableTargetSummary[];
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
    },
  ];
}

export function readBuilderCollectionDetail(
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined
): BuilderCollectionDetail {
  const locale = normalizeLocale(localeInput ?? undefined);
  const summaries = readBuilderCollectionSummaries(locale);
  const summary = summaries.find((candidate) => candidate.id === collectionId);

  if (!summary) {
    throw new Error(`Unknown builder collection detail: ${collectionId}`);
  }

  const bindableTargets = getBuilderBindableTargetsForCollection(collectionId).map((target) => ({
    targetId: target.targetId,
    pageKey: target.pageKey,
    sectionKey: target.sectionKey,
    title: target.title,
    description: target.description,
    runtimeStatus: target.runtimeStatus,
  }));

  const allRecordPreviews = readBuilderCollectionRecordPreviews(collectionId, locale);

  switch (collectionId) {
    case 'columns': {
      return {
        ...summary,
        sampleRecords: allRecordPreviews.slice(0, 4),
        bindableTargets,
      };
    }
    case 'service-areas': {
      return {
        ...summary,
        sampleRecords: allRecordPreviews.slice(0, 4),
        bindableTargets,
      };
    }
    case 'attorney-profiles': {
      return {
        ...summary,
        sampleRecords: allRecordPreviews,
        bindableTargets,
      };
    }
    default:
      return assertNever(collectionId);
  }
}

export function readBuilderCollectionRecordPreviews(
  collectionId: BuilderCollectionId,
  localeInput: string | null | undefined
): BuilderCollectionRecordPreview[] {
  const locale = normalizeLocale(localeInput ?? undefined);

  switch (collectionId) {
    case 'columns':
      return getAllColumnPosts(locale).map((post) => ({
        recordId: post.slug,
        primaryLabel: post.title,
        secondaryLabel: `${post.categoryLabel} · ${post.dateDisplay || post.date}`,
        routePath: `/${locale}/columns/${post.slug}`,
      }));
    case 'service-areas':
      return serviceAreas.map((area) => ({
        recordId: area.slug,
        primaryLabel: area.title[locale],
        secondaryLabel: `${area.subtitle[locale]} · ${area.columnSlugs.length} linked columns`,
        routePath: `/${locale}/services/${area.slug}`,
      }));
    case 'attorney-profiles': {
      const localizedAttorneyProfiles = attorneyProfiles[locale];
      return getAttorneyProfileSlugs().map((slug) => {
        const profile = localizedAttorneyProfiles[slug];

        return {
          recordId: profile.slug,
          primaryLabel: profile.name,
          secondaryLabel: `${profile.role} · ${profile.email}`,
          routePath: `/${locale}/lawyers/${profile.slug}`,
        };
      });
    }
    default:
      return assertNever(collectionId);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled collection branch: ${String(value)}`);
}
