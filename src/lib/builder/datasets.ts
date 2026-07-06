import type { ColumnPost } from '@/lib/columns';
import {
  attorneyProfiles,
  getAttorneyProfileSlugs,
} from '@/data/attorney-profiles';
import { serviceAreas } from '@/data/service-details';
import {
  readAttorneyProfileDatasetField,
  readColumnDatasetField,
  readServiceAreaDatasetField,
  readServiceItemDatasetField,
} from '@/lib/builder/dataset-record-fields';
import {
  resolvePublishedCmsColumnPosts,
} from '@/lib/builder/site/cms-runtime';
import {
  resolvePublishedAttorneyRuntimeItems,
  resolvePublishedServiceRuntimeItems,
} from '@/lib/builder/site/runtime-items';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  findCmsCollection,
  resolveCmsCollectionDataset,
} from '@/lib/builder/cms-collection-datasets';
import type { Locale } from '@/lib/locales';
import type {
  BuilderAttorneyProfileItem,
  BuilderDatasetCollectionId,
  BuilderDatasetFilterOperator,
  BuilderDatasetMode,
  BuilderDatasetSortDirection,
  BuilderDatasetTargetId,
  BuilderServiceItem,
  BuilderPageDatasetBinding,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
  BuilderPageDocument,
  BuilderPageKey,
  BuilderSectionKey,
} from '@/lib/builder/types';

type BuilderDatasetPublishedSite = Pick<BuilderSiteDocument, 'cmsCollections' | 'sourceCollectionOverrides'>;

export interface BuilderDatasetFieldDefinition {
  fieldId: string;
  label: string;
  valueKind?: 'text' | 'image' | 'url';
}

export interface BuilderBindableTargetDefinition {
  targetId: BuilderDatasetTargetId;
  pageKey: BuilderPageKey;
  sectionKey: BuilderSectionKey;
  title: string;
  description: string;
  collectionIds: BuilderDatasetCollectionId[];
  mode: BuilderDatasetMode;
  modeOptions: BuilderDatasetMode[];
  defaultCollectionId: BuilderDatasetCollectionId;
  bindableFields: BuilderDatasetFieldDefinition[];
  filterFields: BuilderDatasetFieldDefinition[];
  sortFields: BuilderDatasetFieldDefinition[];
  defaultSort?: BuilderPageDatasetSort[];
  defaultLimit?: number;
  limitOptions?: number[];
  runtimeStatus: 'runtime-applied';
}

export interface BuilderPageDatasetOverview {
  targetId: BuilderDatasetTargetId;
  pageKey: BuilderPageKey;
  sectionKey: BuilderSectionKey;
  title: string;
  description: string;
  collectionIds: BuilderDatasetCollectionId[];
  defaultCollectionId: BuilderDatasetCollectionId;
  modeOptions: BuilderDatasetMode[];
  defaultLimit?: number;
  limitOptions?: number[];
  defaultSort?: BuilderPageDatasetSort[];
  filterFields: BuilderDatasetFieldDefinition[];
  sortFields: BuilderDatasetFieldDefinition[];
  currentBinding: BuilderPageDatasetBinding;
  sampleRecords: BuilderDatasetSampleRecord[];
  repeaterItems: BuilderDatasetRepeaterPreviewItem[];
  notes: string[];
}

export interface BuilderDatasetSampleRecord {
  recordId: string;
  primaryLabel: string;
  secondaryLabel: string;
  routePath: string;
  fieldValues: Record<string, string>;
}

export interface BuilderDataBindingPreviewTarget {
  targetId: BuilderDatasetTargetId;
  title: string;
  collectionId: BuilderDatasetCollectionId;
  mode: BuilderDatasetMode;
  filters: BuilderPageDatasetFilter[];
  sort: BuilderPageDatasetSort[];
  limit?: number;
  records: BuilderDatasetSampleRecord[];
}

export interface BuilderPageDatasetBindingPatch {
  collectionId?: BuilderDatasetCollectionId;
  mode?: BuilderDatasetMode;
  filters?: BuilderPageDatasetFilter[];
  sort?: BuilderPageDatasetSort[];
  limit?: number;
  /** WIX-PERFECT #6 Slice 3: bind to a user CMS collection (additive). */
  cmsCollectionId?: string;
}

export interface BuilderDatasetRepeaterPreviewItem {
  itemId: string;
  title: string;
  description: string;
  href: string;
}

export interface BuilderResolvedBindableTarget {
  definition: BuilderBindableTargetDefinition;
  binding: BuilderPageDatasetBinding;
}

const builderBindableTargetDefinitions: readonly BuilderBindableTargetDefinition[] = [
  {
    targetId: 'home.insights.feed',
    pageKey: 'home',
    sectionKey: 'home.insights',
    title: 'Insights feed',
    description:
      'Column archive cards on the home page. This binding is real and controls how many column records the section receives.',
    collectionIds: ['columns'],
    mode: 'list',
    modeOptions: ['list'],
    defaultCollectionId: 'columns',
    bindableFields: [
      { fieldId: 'title', label: 'Title', valueKind: 'text' },
      { fieldId: 'slug', label: 'Slug', valueKind: 'text' },
      { fieldId: 'category', label: 'Category', valueKind: 'text' },
      { fieldId: 'categoryLabel', label: 'Category label', valueKind: 'text' },
      { fieldId: 'date', label: 'Date', valueKind: 'text' },
      { fieldId: 'dateDisplay', label: 'Display date', valueKind: 'text' },
      { fieldId: 'readTime', label: 'Read time', valueKind: 'text' },
      { fieldId: 'summary', label: 'Summary', valueKind: 'text' },
      { fieldId: 'featuredImage', label: 'Featured image', valueKind: 'image' },
      { fieldId: 'href', label: 'Column link', valueKind: 'url' },
    ],
    filterFields: [
      { fieldId: 'title', label: 'Title' },
      { fieldId: 'slug', label: 'Slug' },
      { fieldId: 'category', label: 'Category' },
      { fieldId: 'categoryLabel', label: 'Category label' },
    ],
    sortFields: [
      { fieldId: 'date', label: 'Date' },
      { fieldId: 'title', label: 'Title' },
      { fieldId: 'category', label: 'Category' },
      { fieldId: 'slug', label: 'Slug' },
    ],
    defaultLimit: 4,
    limitOptions: [4, 7, 10],
    runtimeStatus: 'runtime-applied',
  },
  {
    targetId: 'home.services.list',
    pageKey: 'home',
    sectionKey: 'home.services',
    title: 'Services list',
    description:
      'Service cards on the home page. This binding is real and controls how many service-area records the section receives.',
    collectionIds: ['service-areas'],
    mode: 'list',
    modeOptions: ['list'],
    defaultCollectionId: 'service-areas',
    bindableFields: [
      { fieldId: 'title', label: 'Title', valueKind: 'text' },
      { fieldId: 'description', label: 'Description', valueKind: 'text' },
      { fieldId: 'details', label: 'Details', valueKind: 'text' },
      { fieldId: 'href', label: 'Service link', valueKind: 'url' },
    ],
    filterFields: [
      { fieldId: 'title', label: 'Title' },
      { fieldId: 'description', label: 'Description' },
      { fieldId: 'href', label: 'Link' },
    ],
    sortFields: [
      { fieldId: 'title', label: 'Title' },
      { fieldId: 'href', label: 'Link' },
    ],
    defaultLimit: 6,
    limitOptions: [3, 6],
    runtimeStatus: 'runtime-applied',
  },
  {
    targetId: 'home.attorney.profile',
    pageKey: 'home',
    sectionKey: 'home.attorney',
    title: 'Attorney profile',
    description:
      'Attorney profile records for dynamic lawyer pages and profile cards. This binding resolves profile slug, text, image, email, and link fields.',
    collectionIds: ['attorney-profiles'],
    mode: 'list',
    modeOptions: ['list'],
    defaultCollectionId: 'attorney-profiles',
    bindableFields: [
      { fieldId: 'slug', label: 'Slug', valueKind: 'text' },
      { fieldId: 'name', label: 'Name', valueKind: 'text' },
      { fieldId: 'role', label: 'Role', valueKind: 'text' },
      { fieldId: 'title', label: 'SEO title', valueKind: 'text' },
      { fieldId: 'description', label: 'Description', valueKind: 'text' },
      { fieldId: 'summary', label: 'Summary', valueKind: 'text' },
      { fieldId: 'email', label: 'Email', valueKind: 'text' },
      { fieldId: 'image', label: 'Profile image', valueKind: 'image' },
      { fieldId: 'href', label: 'Lawyer link', valueKind: 'url' },
    ],
    filterFields: [
      { fieldId: 'slug', label: 'Slug' },
      { fieldId: 'name', label: 'Name' },
      { fieldId: 'role', label: 'Role' },
      { fieldId: 'email', label: 'Email' },
    ],
    sortFields: [
      { fieldId: 'name', label: 'Name' },
      { fieldId: 'role', label: 'Role' },
      { fieldId: 'slug', label: 'Slug' },
    ],
    defaultLimit: 1,
    limitOptions: [1, 3],
    runtimeStatus: 'runtime-applied',
  },
] as const;

export function isBuilderDatasetTargetId(value: string | null | undefined): value is BuilderDatasetTargetId {
  return builderBindableTargetDefinitions.some((definition) => definition.targetId === value);
}

export function getBuilderBindableTargets(pageKey: BuilderPageKey) {
  return builderBindableTargetDefinitions.filter((definition) => definition.pageKey === pageKey);
}

export function getBuilderBindableTarget(targetId: BuilderDatasetTargetId) {
  const match = builderBindableTargetDefinitions.find((definition) => definition.targetId === targetId);
  if (!match) {
    throw new Error(`Unknown builder dataset target: ${targetId}`);
  }

  return match;
}

export function getBuilderBindableTargetsForCollection(collectionId: BuilderDatasetCollectionId) {
  return builderBindableTargetDefinitions.filter((definition) =>
    definition.collectionIds.includes(collectionId)
  );
}

export function resolveBuilderPageBindableTargets(
  document: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>
) {
  const bindings = normalizeBuilderPageDatasets(
    document.pageKey,
    document.datasets,
    createDefaultBuilderPageDatasets(document.pageKey)
  );
  const bindingsByTarget = new Map(bindings.map((binding) => [binding.targetId, binding] as const));

  return getBuilderBindableTargets(document.pageKey).map((definition) => ({
    definition,
    binding:
      bindingsByTarget.get(definition.targetId) ??
      createDefaultBuilderPageDatasets(document.pageKey).find(
        (candidate) => candidate.targetId === definition.targetId
      )!,
  })) satisfies BuilderResolvedBindableTarget[];
}

export function createDefaultBuilderPageDatasets(pageKey: BuilderPageKey): BuilderPageDatasetBinding[] {
  return getBuilderBindableTargets(pageKey).map((definition) => ({
    version: 1,
    datasetId: definition.targetId,
    targetId: definition.targetId,
    sectionKey: definition.sectionKey,
    collectionId: definition.defaultCollectionId,
    mode: definition.mode,
    filters: [],
    sort: cloneDatasetSort(definition.defaultSort ?? []),
    limit: definition.defaultLimit,
  }));
}

export function cloneBuilderPageDatasetBinding(
  binding: BuilderPageDatasetBinding
): BuilderPageDatasetBinding {
  return {
    version: 1,
    datasetId: binding.datasetId,
    targetId: binding.targetId,
    sectionKey: binding.sectionKey,
    collectionId: binding.collectionId,
    mode: binding.mode,
    filters: cloneDatasetFilters(binding.filters ?? []),
    sort: cloneDatasetSort(binding.sort ?? []),
    limit: typeof binding.limit === 'number' ? binding.limit : undefined,
    // WIX-PERFECT #6 Slice 2: preserve the user-collection source across clone/normalize/save.
    ...(binding.cmsCollectionId ? { cmsCollectionId: binding.cmsCollectionId } : {}),
  };
}

export function normalizeBuilderPageDatasets(
  pageKey: BuilderPageKey,
  nextDatasets: BuilderPageDatasetBinding[] | null | undefined,
  fallbackDatasets: BuilderPageDatasetBinding[]
): BuilderPageDatasetBinding[] {
  const targetDefinitions = getBuilderBindableTargets(pageKey);
  const fallbackByTarget = new Map(
    fallbackDatasets.map((binding) => [binding.targetId, cloneBuilderPageDatasetBinding(binding)])
  );

  return targetDefinitions.map((definition) => {
    const candidate =
      nextDatasets?.find((binding) => binding?.targetId === definition.targetId) ??
      fallbackByTarget.get(definition.targetId) ??
      createDefaultBuilderPageDatasets(pageKey).find((binding) => binding.targetId === definition.targetId);

    return normalizeBuilderDatasetBinding(definition, candidate);
  });
}

export function getBuilderPageDatasetBinding(
  document: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>,
  targetId: BuilderDatasetTargetId
) {
  const fallback = createDefaultBuilderPageDatasets(document.pageKey);
  return normalizeBuilderPageDatasets(document.pageKey, document.datasets, fallback).find(
    (binding) => binding.targetId === targetId
  )!;
}

export function readBuilderPageDatasetOverviews(
  pageKey: BuilderPageKey,
  document: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>,
  locale: Locale,
  posts: ColumnPost[],
  publishedSite?: BuilderDatasetPublishedSite,
): BuilderPageDatasetOverview[] {
  return getBuilderBindableTargets(pageKey).map((definition) => {
    const binding = getBuilderPageDatasetBinding(document, definition.targetId);
    const sampleRecords = readBuilderDatasetSampleRecordsInternal(
      definition.targetId,
      binding,
      locale,
      posts,
      publishedSite,
    );
    const repeaterItems = sampleRecords.map(toRepeaterPreviewItem);

    return {
      targetId: definition.targetId,
      pageKey: definition.pageKey,
      sectionKey: definition.sectionKey,
      title: definition.title,
      description: definition.description,
      collectionIds: [...definition.collectionIds],
      defaultCollectionId: definition.defaultCollectionId,
      modeOptions: [...definition.modeOptions],
      defaultLimit: definition.defaultLimit,
      limitOptions: definition.limitOptions ? [...definition.limitOptions] : undefined,
      defaultSort: definition.defaultSort ? cloneDatasetSort(definition.defaultSort) : undefined,
      filterFields: definition.filterFields.map((field) => ({ ...field })),
      sortFields: definition.sortFields.map((field) => ({ ...field })),
      currentBinding: cloneBuilderPageDatasetBinding(binding),
      sampleRecords,
      repeaterItems,
      notes: [
        'This seam is document-level and runtime-applied.',
        'The current batch exposes a generic repeater item contract before full visual repeater editing.',
      ],
    };
  });
}

export function readBuilderDatasetRepeaterItems(
  targetId: BuilderDatasetTargetId,
  binding: BuilderPageDatasetBinding,
  locale: Locale,
  posts: ColumnPost[],
  publishedSite?: BuilderDatasetPublishedSite,
): BuilderDatasetRepeaterPreviewItem[] {
  return readBuilderDatasetSampleRecords(targetId, binding, locale, posts, publishedSite).map(
    toRepeaterPreviewItem,
  );
}

export function readBuilderDatasetSampleRecords(
  targetId: BuilderDatasetTargetId,
  binding: BuilderPageDatasetBinding,
  locale: Locale,
  posts: ColumnPost[],
  publishedSite?: BuilderDatasetPublishedSite,
): BuilderDatasetSampleRecord[] {
  return readBuilderDatasetSampleRecordsInternal(targetId, binding, locale, posts, publishedSite);
}

export function replaceBuilderPageDatasetLimit(
  datasets: BuilderPageDatasetBinding[],
  pageKey: BuilderPageKey,
  targetId: BuilderDatasetTargetId,
  limit: number
) {
  return replaceBuilderPageDatasetBinding(datasets, pageKey, targetId, { limit });
}

export function replaceBuilderPageDatasetBinding(
  datasets: BuilderPageDatasetBinding[],
  pageKey: BuilderPageKey,
  targetId: BuilderDatasetTargetId,
  patch: BuilderPageDatasetBindingPatch
) {
  return normalizeBuilderPageDatasets(
    pageKey,
    datasets.map((binding) =>
      binding.targetId === targetId ? { ...binding, ...patch } : cloneBuilderPageDatasetBinding(binding)
    ),
    createDefaultBuilderPageDatasets(pageKey)
  );
}

export function resetBuilderPageDatasetBinding(
  datasets: BuilderPageDatasetBinding[],
  pageKey: BuilderPageKey,
  targetId: BuilderDatasetTargetId
) {
  const fallback = createDefaultBuilderPageDatasets(pageKey);
  return normalizeBuilderPageDatasets(
    pageKey,
    datasets.map((binding) =>
      binding.targetId === targetId
        ? fallback.find((candidate) => candidate.targetId === targetId) ??
          cloneBuilderPageDatasetBinding(binding)
        : cloneBuilderPageDatasetBinding(binding)
    ),
    fallback
  );
}

export function resolveInsightsDatasetPosts(
  document: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>,
  posts: ColumnPost[]
) {
  const binding = getBuilderPageDatasetBinding(document, 'home.insights.feed');
  const limit = normalizeLimit(binding.limit, getBuilderBindableTarget('home.insights.feed').defaultLimit);
  return applyDatasetLimit(
    sortDatasetRecords(
      filterDatasetRecords(posts, binding, readColumnDatasetField),
      binding,
      readColumnDatasetField
    ),
    limit
  );
}

export function resolveServicesDatasetItems(
  document: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>,
  locale: Locale,
  posts: ColumnPost[],
  sourceItems?: BuilderServiceItem[]
): BuilderServiceItem[] {
  const binding = getBuilderPageDatasetBinding(document, 'home.services.list');
  const limit = normalizeLimit(binding.limit, getBuilderBindableTarget('home.services.list').defaultLimit);
  if (sourceItems && sourceItems.length > 0) {
    return applyDatasetLimit(
      sortDatasetRecords(
        filterDatasetRecords(sourceItems, binding, readServiceItemDatasetField),
        binding,
        readServiceItemDatasetField
      ),
      limit
    );
  }

  const postsBySlug = new Map(posts.map((post) => [post.slug, post] as const));

  return applyDatasetLimit(
    sortDatasetRecords(
      filterDatasetRecords(serviceAreas, binding, (service, fieldId) =>
        readServiceAreaDatasetField(service, fieldId, locale)
      ),
      binding,
      (service, fieldId) => readServiceAreaDatasetField(service, fieldId, locale)
    ),
    limit
  ).map((service) => ({
    title: service.title[locale],
    description: service.subtitle[locale],
    href: `/${locale}/services/${service.slug}`,
    details: service.keyPoints[locale].slice(0, 5),
    relatedColumns: service.columnSlugs.map((slug) => ({
      slug,
      title: postsBySlug.get(slug)?.title ?? slug,
    })),
  }));
}

export function resolveAttorneyProfileDatasetItems(
  document: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>,
  locale: Locale,
  sourceItems?: BuilderAttorneyProfileItem[]
): BuilderAttorneyProfileItem[] {
  const binding = getBuilderPageDatasetBinding(document, 'home.attorney.profile');
  const limit = normalizeLimit(binding.limit, getBuilderBindableTarget('home.attorney.profile').defaultLimit);
  const records = sourceItems && sourceItems.length > 0
    ? sourceItems
    : getAttorneyProfileSlugs().map((slug) => {
        const profile = attorneyProfiles[locale][slug];
        return {
          slug: profile.slug,
          name: profile.name,
          role: profile.role,
          title: profile.title,
          description: profile.description,
          email: profile.email,
          image: profile.image,
          imageAltText: `${profile.name} ${profile.role}`,
          imageFocalPoint: { x: 0.5, y: 0.5 },
          summary: profile.summary,
          href: `/${locale}/lawyers/${profile.slug}`,
        };
      });

  return applyDatasetLimit(
    sortDatasetRecords(
      filterDatasetRecords(records, binding, readAttorneyProfileDatasetField),
      binding,
      readAttorneyProfileDatasetField
    ),
    limit
  );
}

function readBuilderDatasetSampleRecordsInternal(
  targetId: BuilderDatasetTargetId,
  binding: BuilderPageDatasetBinding,
  locale: Locale,
  posts: ColumnPost[],
  publishedSite?: BuilderDatasetPublishedSite,
) {
  // WIX-PERFECT #6 Slice 2: a binding may source from a USER-created CMS collection.
  // Branch FIRST (additive) — when cmsCollectionId is set and the collection exists on the
  // site, resolve its records through the same filter→sort→limit contract and return the
  // shared row shape. Built-in targets fall through to the untouched switch below.
  if (binding.cmsCollectionId) {
    const collection = findCmsCollection(publishedSite, binding.cmsCollectionId);
    if (collection) {
      return resolveCmsCollectionDataset(collection, {
        filters: binding.filters,
        sort: binding.sort,
        limit: binding.limit,
        routeBase: `/${locale}/${collection.slug}`,
      });
    }
    // bound but collection missing (deleted/unpublished) → empty, like the built-in safe path
    return [];
  }

  switch (targetId) {
    case 'home.insights.feed':
      return resolveInsightsDatasetPosts(
        { pageKey: 'home', datasets: [binding] },
        publishedSite ? resolvePublishedCmsColumnPosts(publishedSite, locale) ?? posts : posts,
      ).map((post) => ({
        recordId: post.slug,
        primaryLabel: post.title,
        secondaryLabel: `${post.categoryLabel} · ${post.dateDisplay || post.date}`,
        routePath: `/${locale}/columns/${post.slug}`,
        fieldValues: {
          slug: post.slug,
          title: post.title,
          label: post.title,
          category: post.category,
          categoryLabel: post.categoryLabel,
          date: post.date,
          dateDisplay: post.dateDisplay,
          readTime: post.readTime,
          summary: post.summary,
          content: post.content,
          featuredImage: post.featuredImage,
          image: post.featuredImage,
          src: post.featuredImage,
          href: `/${locale}/columns/${post.slug}`,
          url: `/${locale}/columns/${post.slug}`,
        },
      }));
    case 'home.services.list':
      {
        const publishedServices = publishedSite
          ? resolvePublishedServiceRuntimeItems(
              publishedSite,
              locale,
              resolvePublishedCmsColumnPosts(publishedSite, locale) ?? posts
            )
          : null;

        if (publishedServices) {
          return publishedServices.map((service) => ({
            recordId: service.href.split('/').filter(Boolean).pop() ?? service.title,
            primaryLabel: service.title,
            secondaryLabel: service.description,
            routePath: service.href,
            fieldValues: {
              slug: service.href.split('/').filter(Boolean).pop() ?? service.title,
              title: service.title,
              label: service.title,
              description: service.description,
              summary: service.description,
              details: (service.details ?? []).join('\n'),
              href: service.href,
              url: service.href,
            },
          }));
        }

        return applyDatasetLimit(
          sortDatasetRecords(
            filterDatasetRecords(serviceAreas, binding, (service, fieldId) =>
              readServiceAreaDatasetField(service, fieldId, locale)
            ),
            binding,
            (service, fieldId) => readServiceAreaDatasetField(service, fieldId, locale)
          ),
          normalizeLimit(binding.limit, getBuilderBindableTarget(targetId).defaultLimit)
        )
          .map((service) => ({
            recordId: service.slug,
            primaryLabel: service.title[locale],
            secondaryLabel: service.subtitle[locale],
            routePath: `/${locale}/services/${service.slug}`,
            fieldValues: {
              slug: service.slug,
              title: service.title[locale],
              label: service.title[locale],
              description: service.subtitle[locale],
              summary: service.subtitle[locale],
              details: service.keyPoints[locale].join('\n'),
              href: `/${locale}/services/${service.slug}`,
              url: `/${locale}/services/${service.slug}`,
            },
          }));
      }
    case 'home.attorney.profile':
      {
        const publishedProfiles = publishedSite
          ? resolvePublishedAttorneyRuntimeItems(publishedSite, locale)
          : null;

        if (publishedProfiles) {
          return publishedProfiles.map((profile) => ({
            recordId: profile.slug,
            primaryLabel: profile.name,
            secondaryLabel: `${profile.role} · ${profile.email}`,
            routePath: profile.href,
            fieldValues: {
              slug: profile.slug,
              name: profile.name,
              title: profile.title,
              label: profile.name,
              role: profile.role,
              description: profile.description,
              summary: profile.summary.join('\n'),
              email: profile.email,
              image: profile.image,
              src: profile.image,
              href: profile.href,
              url: profile.href,
            },
          }));
        }

        return resolveAttorneyProfileDatasetItems({ pageKey: 'home', datasets: [binding] }, locale)
          .map((profile) => ({
            recordId: profile.slug,
            primaryLabel: profile.name,
            secondaryLabel: `${profile.role} · ${profile.email}`,
            routePath: profile.href,
            fieldValues: {
              slug: profile.slug,
              name: profile.name,
              title: profile.title,
              label: profile.name,
              role: profile.role,
              description: profile.description,
              summary: profile.summary.join('\n'),
              email: profile.email,
              image: profile.image,
              src: profile.image,
              href: profile.href,
              url: profile.href,
            },
          }));
      }
    default:
      return assertNever(targetId);
  }
}

function toRepeaterPreviewItem(record: BuilderDatasetSampleRecord): BuilderDatasetRepeaterPreviewItem {
  return {
    itemId: record.recordId,
    title: record.primaryLabel,
    description: record.secondaryLabel,
    href: record.routePath,
  };
}

function normalizeBuilderDatasetBinding(
  definition: BuilderBindableTargetDefinition,
  candidate: BuilderPageDatasetBinding | null | undefined
): BuilderPageDatasetBinding {
  return {
    version: 1,
    datasetId:
      typeof candidate?.datasetId === 'string' && candidate.datasetId.trim()
        ? candidate.datasetId.trim()
        : definition.targetId,
    targetId: definition.targetId,
    sectionKey: definition.sectionKey,
    collectionId: definition.collectionIds.includes(candidate?.collectionId as BuilderDatasetCollectionId)
      ? (candidate?.collectionId as BuilderDatasetCollectionId)
      : definition.defaultCollectionId,
    mode: definition.modeOptions.includes(candidate?.mode as BuilderDatasetMode)
      ? (candidate?.mode as BuilderDatasetMode)
      : definition.mode,
    // WIX-PERFECT #6 Slice 2: a user-collection binding's filters/sort reference the
    // collection's OWN field keys, not the built-in target's filterFields — so when
    // cmsCollectionId is set, pass them through (lightly sanitized) instead of validating
    // against the built-in definition. Built-in bindings keep their strict normalization.
    filters: candidate?.cmsCollectionId
      ? sanitizeCmsBindingFilters(candidate?.filters)
      : normalizeDatasetFilters(definition, candidate?.filters),
    sort: candidate?.cmsCollectionId
      ? sanitizeCmsBindingSort(candidate?.sort)
      : normalizeDatasetSort(definition, candidate?.sort ?? definition.defaultSort),
    limit:
      typeof definition.defaultLimit === 'number'
        ? normalizeLimit(candidate?.limit, definition.defaultLimit)
        : normalizeLimit(candidate?.limit, candidate?.cmsCollectionId ? 12 : undefined),
    ...(candidate?.cmsCollectionId ? { cmsCollectionId: candidate.cmsCollectionId } : {}),
  };
}

/** Sanitize filters for a user-collection binding (field keys are the collection's own). */
function sanitizeCmsBindingFilters(input: unknown): BuilderPageDatasetFilter[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Partial<BuilderPageDatasetFilter> => !!item && typeof item === 'object')
    .map((filter) => ({
      fieldId: typeof filter.fieldId === 'string' ? filter.fieldId.trim().slice(0, 80) : '',
      operator: normalizeFilterOperator(filter.operator),
      value: typeof filter.value === 'string' ? filter.value.trim().slice(0, 120) : '',
    }))
    .filter((filter) => filter.fieldId && filter.value)
    .slice(0, 6);
}

/** Sanitize sort rules for a user-collection binding. */
function sanitizeCmsBindingSort(input: unknown): BuilderPageDatasetSort[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is Partial<BuilderPageDatasetSort> => !!item && typeof item === 'object')
    .map((rule): BuilderPageDatasetSort => ({
      fieldId: typeof rule.fieldId === 'string' ? rule.fieldId.trim().slice(0, 80) : '',
      direction: rule.direction === 'desc' ? 'desc' : 'asc',
    }))
    .filter((rule) => rule.fieldId)
    .slice(0, 4);
}

function normalizeDatasetFilters(
  definition: BuilderBindableTargetDefinition,
  input: unknown
): BuilderPageDatasetFilter[] {
  if (!Array.isArray(input)) return [];
  const allowedFields = new Set(definition.filterFields.map((field) => field.fieldId));
  return input
    .filter((item): item is Partial<BuilderPageDatasetFilter> => !!item && typeof item === 'object')
    .map((filter) => ({
      fieldId: typeof filter.fieldId === 'string' && allowedFields.has(filter.fieldId) ? filter.fieldId : '',
      operator: normalizeFilterOperator(filter.operator),
      value: typeof filter.value === 'string' ? filter.value.trim().slice(0, 120) : '',
    }))
    .filter((filter) => filter.fieldId && filter.value)
    .slice(0, 6);
}

function normalizeDatasetSort(
  definition: BuilderBindableTargetDefinition,
  input: unknown
): BuilderPageDatasetSort[] {
  if (!Array.isArray(input)) return [];
  const allowedFields = new Set(definition.sortFields.map((field) => field.fieldId));
  const seen = new Set<string>();
  return input
    .filter((item): item is Partial<BuilderPageDatasetSort> => !!item && typeof item === 'object')
    .map((sort) => ({
      fieldId: typeof sort.fieldId === 'string' && allowedFields.has(sort.fieldId) ? sort.fieldId : '',
      direction: normalizeSortDirection(sort.direction),
    }))
    .filter((sort) => {
      if (!sort.fieldId || seen.has(sort.fieldId)) return false;
      seen.add(sort.fieldId);
      return true;
    })
    .slice(0, 3);
}

function cloneDatasetFilters(filters: BuilderPageDatasetFilter[]): BuilderPageDatasetFilter[] {
  return filters.map((filter) => ({ ...filter }));
}

function cloneDatasetSort(sort: BuilderPageDatasetSort[]): BuilderPageDatasetSort[] {
  return sort.map((item) => ({ ...item }));
}

function normalizeFilterOperator(input: unknown): BuilderDatasetFilterOperator {
  return input === 'equals' ? 'equals' : 'contains';
}

function normalizeSortDirection(input: unknown): BuilderDatasetSortDirection {
  return input === 'desc' ? 'desc' : 'asc';
}

function filterDatasetRecords<TRecord>(
  records: TRecord[],
  binding: BuilderPageDatasetBinding,
  readField: (record: TRecord, fieldId: string) => string
): TRecord[] {
  const filters = binding.filters ?? [];
  if (!filters.length) return records;
  return records.filter((record) =>
    filters.every((filter) => {
      const value = readField(record, filter.fieldId).trim().toLocaleLowerCase();
      const needle = filter.value.trim().toLocaleLowerCase();
      return filter.operator === 'equals' ? value === needle : value.includes(needle);
    })
  );
}

function sortDatasetRecords<TRecord>(
  records: TRecord[],
  binding: BuilderPageDatasetBinding,
  readField: (record: TRecord, fieldId: string) => string
): TRecord[] {
  const sort = binding.sort ?? [];
  if (!sort.length) return records;
  return [...records].sort((left, right) => {
    for (const sortItem of sort) {
      const leftValue = readField(left, sortItem.fieldId);
      const rightValue = readField(right, sortItem.fieldId);
      const compared = leftValue.localeCompare(rightValue, 'ko', { numeric: true, sensitivity: 'base' });
      if (compared !== 0) return sortItem.direction === 'desc' ? -compared : compared;
    }
    return 0;
  });
}

function applyDatasetLimit<TRecord>(records: TRecord[], limit: number | undefined): TRecord[] {
  return typeof limit === 'number' ? records.slice(0, limit) : records;
}

function normalizeLimit(value: number | undefined, fallback: number | undefined) {
  if (typeof fallback !== 'number') {
    return undefined;
  }

  const normalized = typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : fallback;
  return Math.max(1, Math.min(12, normalized));
}

function assertNever(value: never): never {
  throw new Error(`Unhandled dataset target: ${String(value)}`);
}
