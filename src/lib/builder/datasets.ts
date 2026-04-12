import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import type {
  BuilderDatasetCollectionId,
  BuilderDatasetMode,
  BuilderDatasetTargetId,
  BuilderPageDatasetBinding,
  BuilderPageDocument,
  BuilderPageKey,
  BuilderSectionKey,
} from '@/lib/builder/types';

export interface BuilderBindableTargetDefinition {
  targetId: BuilderDatasetTargetId;
  pageKey: BuilderPageKey;
  sectionKey: BuilderSectionKey;
  title: string;
  description: string;
  collectionIds: BuilderDatasetCollectionId[];
  mode: BuilderDatasetMode;
  defaultCollectionId: BuilderDatasetCollectionId;
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
  sampleRecords: {
    recordId: string;
    primaryLabel: string;
    secondaryLabel: string;
    routePath: string;
  }[];
  notes: string[];
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
    defaultCollectionId: 'columns',
    defaultLimit: 4,
    limitOptions: [4, 7, 10],
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

    return {
      targetId: definition.targetId,
      pageKey: definition.pageKey,
      sectionKey: definition.sectionKey,
      title: definition.title,
      description: definition.description,
      collectionIds: [...definition.collectionIds],
      currentBinding: cloneBuilderPageDatasetBinding(binding),
      sampleRecords,
      notes: [
        'This seam is document-level and runtime-applied.',
        'The current batch exposes collection detail and binding visibility before broader dataset editing.',
      ],
    };
  });
}

export function replaceBuilderPageDatasetLimit(
  datasets: BuilderPageDatasetBinding[],
  pageKey: BuilderPageKey,
  targetId: BuilderDatasetTargetId,
  limit: number
) {
  return normalizeBuilderPageDatasets(
    pageKey,
    datasets.map((binding) =>
      binding.targetId === targetId ? { ...binding, limit } : cloneBuilderPageDatasetBinding(binding)
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
  return posts.slice(0, limit);
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
      }));
    default:
      return assertNever(targetId);
  }
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
    mode: definition.mode,
    limit:
      typeof definition.defaultLimit === 'number'
        ? normalizeLimit(candidate?.limit, definition.defaultLimit)
        : undefined,
  };
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
