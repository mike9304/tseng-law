import type { ColumnPost } from '@/lib/columns';
import { serviceAreas } from '@/data/service-details';
import type { Locale } from '@/lib/locales';
import type {
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
  posts: ColumnPost[]
): BuilderPageDatasetOverview[] {
  return getBuilderBindableTargets(pageKey).map((definition) => {
    const binding = getBuilderPageDatasetBinding(document, definition.targetId);
    const sampleRecords = readBuilderDatasetSampleRecords(definition.targetId, binding, locale, posts);
    const repeaterItems = sampleRecords.map(toRepeaterPreviewItem);

    return {
      targetId: definition.targetId,
      pageKey: definition.pageKey,
      sectionKey: definition.sectionKey,
      title: definition.title,
      description: definition.description,
      collectionIds: [...definition.collectionIds],
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
  posts: ColumnPost[]
): BuilderDatasetRepeaterPreviewItem[] {
  return readBuilderDatasetSampleRecords(targetId, binding, locale, posts).map(toRepeaterPreviewItem);
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

function readBuilderDatasetSampleRecords(
  targetId: BuilderDatasetTargetId,
  binding: BuilderPageDatasetBinding,
  locale: Locale,
  posts: ColumnPost[]
) {
  switch (targetId) {
    case 'home.insights.feed':
      return resolveInsightsDatasetPosts({ pageKey: 'home', datasets: [binding] }, posts).map((post) => ({
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
    filters: normalizeDatasetFilters(definition, candidate?.filters),
    sort: normalizeDatasetSort(definition, candidate?.sort ?? definition.defaultSort),
    limit:
      typeof definition.defaultLimit === 'number'
        ? normalizeLimit(candidate?.limit, definition.defaultLimit)
        : undefined,
  };
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

function readColumnDatasetField(post: ColumnPost, fieldId: string): string {
  switch (fieldId) {
    case 'slug':
      return post.slug;
    case 'title':
      return post.title;
    case 'category':
      return post.category;
    case 'categoryLabel':
      return post.categoryLabel;
    case 'date':
      return post.date;
    default:
      return '';
  }
}

function readServiceItemDatasetField(item: BuilderServiceItem, fieldId: string): string {
  switch (fieldId) {
    case 'title':
      return item.title;
    case 'description':
      return item.description;
    case 'href':
      return item.href;
    default:
      return '';
  }
}

function readServiceAreaDatasetField(
  service: (typeof serviceAreas)[number],
  fieldId: string,
  locale: Locale
): string {
  switch (fieldId) {
    case 'title':
      return service.title[locale];
    case 'description':
      return service.subtitle[locale];
    case 'href':
      return service.slug;
    default:
      return '';
  }
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
