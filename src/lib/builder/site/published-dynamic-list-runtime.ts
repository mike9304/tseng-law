import { getAllColumnPosts } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import {
  getBuilderPageDatasetBinding,
  readBuilderDatasetSampleRecords,
  replaceBuilderPageDatasetBinding,
} from '@/lib/builder/datasets';
import {
  composeVisitorDatasetPatch,
  parseVisitorDatasetQuery,
  sliceVisitorRecords,
  type VisitorPagination,
} from '@/lib/builder/datasets-visitor-filters';
import type { BuilderDatasetFieldBindingContext } from '@/lib/builder/dataset-field-binding';
import {
  resolvePublishedCmsColumnPosts,
} from '@/lib/builder/site/cms-runtime';
import {
  resolvePublishedAttorneyRuntimeItems,
  resolvePublishedServiceRuntimeItems,
} from '@/lib/builder/site/runtime-items';
import {
  extractDynamicListRecordId,
  filterAttorneyItemsByRecordIds,
  filterColumnPostsByRecordIds,
  filterServiceItemsByRecordIds,
  resolveDynamicListRecords,
  type DynamicListPublicRecord,
} from '@/lib/builder/site/dynamic-list-records';
import {
  filterAndSortDynamicListRecords,
  filterDynamicListRecordsBySearch,
  normalizeVisitorSearchTerm,
} from '@/lib/builder/site/dynamic-list-record-query';
import {
  resolveDynamicListVisitorFieldState,
  type DynamicListVisitorSortOption,
} from '@/lib/builder/site/dynamic-list-visitor-fields';
import {
  summarizeVisitorQueryItems,
  type PublishedDynamicListVisitorSummaryItem,
} from '@/lib/builder/site/published-dynamic-list-query-summary';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import type { BuilderDynamicListPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import type {
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
  BuilderPageDocument,
} from '@/lib/builder/types';

type SearchParams = Record<string, string | string[] | undefined>;
type DynamicListSlice = ReturnType<typeof sliceVisitorRecords<DynamicListPublicRecord>>;

export interface PublishedDynamicListRuntime {
  readonly config: BuilderDynamicListPageMeta | null;
  readonly datasetDocument: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>;
  readonly bindingContext: BuilderDatasetFieldBindingContext;
  readonly filters: readonly BuilderPageDatasetFilter[];
  readonly filterSummary: readonly PublishedDynamicListVisitorSummaryItem[];
  readonly hasFilteredEmptyState: boolean;
  readonly pagePath: string;
  readonly pagination: VisitorPagination | null;
  readonly searchTerm: string;
  readonly slice: DynamicListSlice | null;
  readonly sortOptions: readonly DynamicListVisitorSortOption[];
  readonly sortQuery: readonly BuilderPageDatasetSort[];
  readonly totalRecordCount: number;
}

export function resolvePublishedDynamicListRuntime({
  datasetDocument,
  dynamicList,
  locale,
  searchParams,
  site,
  slugPath,
}: {
  readonly datasetDocument: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>;
  readonly dynamicList: BuilderDynamicListPageMeta | undefined;
  readonly locale: Locale;
  readonly searchParams: SearchParams | undefined;
  readonly site: BuilderSiteDocument;
  readonly slugPath: string;
}): PublishedDynamicListRuntime {
  const visitorQuery = parseVisitorDatasetQuery(searchParams);
  const runtimePosts = resolvePublishedCmsColumnPosts(site, locale) ?? getAllColumnPosts(locale);
  const runtimeServiceItems = resolvePublishedServiceRuntimeItems(site, locale, runtimePosts) ?? undefined;
  const runtimeAttorneyItems = resolvePublishedAttorneyRuntimeItems(site, locale) ?? undefined;
  const cmsRuntimeRecordsByTarget = resolveCmsRuntimeRecordsByTarget({
    datasetDocument,
    locale,
    posts: runtimePosts,
    site,
  });

  if (!dynamicList) {
    return {
      config: null,
      datasetDocument,
      bindingContext: {
        locale,
        posts: runtimePosts,
        document: datasetDocument,
        serviceItems: runtimeServiceItems,
        attorneyItems: runtimeAttorneyItems,
        runtimeRecordsByTarget: cmsRuntimeRecordsByTarget,
      },
      filters: [],
      filterSummary: [],
      hasFilteredEmptyState: false,
      pagePath: '',
      pagination: null,
      searchTerm: '',
      slice: null,
      sortOptions: [],
      sortQuery: [],
      totalRecordCount: 0,
    };
  }

  const visitorSearchTerm = normalizeVisitorSearchTerm(visitorQuery.q);
  const binding = getBuilderPageDatasetBinding(datasetDocument, dynamicList.targetId);
  const visitorFields = resolveDynamicListVisitorFieldState({ dynamicList, site });
  const visitorPatch = binding
    ? composeVisitorDatasetPatch({
        targetId: dynamicList.targetId,
        binding,
        query: visitorQuery,
        fieldAccess: visitorFields.fieldAccess,
      })
    : null;
  const visitorDatasetDocument = visitorPatch
    ? {
        ...datasetDocument,
        datasets: replaceBuilderPageDatasetBinding(
          datasetDocument.datasets,
          datasetDocument.pageKey,
          dynamicList.targetId,
          {
            filters: visitorPatch.patch.filters,
            sort: visitorPatch.patch.sort,
          },
        ),
      }
    : datasetDocument;
  const pagination = visitorPatch?.pagination ?? null;
  const records = resolveDynamicListRecords({
    datasetDocument: visitorDatasetDocument,
    dynamicList,
    locale,
    posts: runtimePosts,
    site,
  });
  const queryRecords = visitorPatch
    ? filterAndSortDynamicListRecords(
        records,
        visitorPatch.patch.filters ?? [],
        visitorPatch.patch.sort ?? [],
      )
    : records;
  const searchRecords = filterDynamicListRecordsBySearch(queryRecords, visitorSearchTerm);
  const searchRecordIds = new Set(searchRecords.map(extractDynamicListRecordId));
  const runtimeRecordsByTarget: BuilderDatasetFieldBindingContext['runtimeRecordsByTarget'] = {
    ...cmsRuntimeRecordsByTarget,
    [dynamicList.targetId]: searchRecords,
  };
  const pagePath = buildSitePagePath(locale, slugPath);
  const slice = pagination ? sliceVisitorRecords(searchRecords, pagination) : null;
  const filterSummary = summarizeVisitorQueryItems({
    basePath: pagePath,
    currentPerPage: pagination?.perPage,
    query: visitorQuery,
    searchParams,
  });

  return {
    config: dynamicList,
    datasetDocument: visitorDatasetDocument,
    bindingContext: {
      locale,
      posts: dynamicList.collectionId === 'columns'
        ? filterColumnPostsByRecordIds(runtimePosts, searchRecordIds)
        : runtimePosts,
      document: visitorDatasetDocument,
      serviceItems: filterServiceItemsByRecordIds(runtimeServiceItems, searchRecordIds),
      attorneyItems: filterAttorneyItemsByRecordIds(runtimeAttorneyItems, searchRecordIds),
      runtimeRecordsByTarget,
    },
    filters: visitorPatch?.appliedFilters ?? [],
    filterSummary,
    hasFilteredEmptyState: (slice?.items.length ?? 0) === 0 && filterSummary.length > 0,
    pagePath,
    pagination,
    searchTerm: visitorSearchTerm,
    slice,
    sortOptions: visitorFields.sortOptions,
    sortQuery: visitorPatch?.appliedSort ?? [],
    totalRecordCount: searchRecords.length,
  };
}

function resolveCmsRuntimeRecordsByTarget({
  datasetDocument,
  locale,
  posts,
  site,
}: {
  readonly datasetDocument: Pick<BuilderPageDocument, 'pageKey' | 'datasets'>;
  readonly locale: Locale;
  readonly posts: ReturnType<typeof getAllColumnPosts>;
  readonly site: BuilderSiteDocument;
}): BuilderDatasetFieldBindingContext['runtimeRecordsByTarget'] {
  const runtimeRecordsByTarget: NonNullable<BuilderDatasetFieldBindingContext['runtimeRecordsByTarget']> = {};
  for (const binding of datasetDocument.datasets) {
    if (!binding.cmsCollectionId) continue;
    runtimeRecordsByTarget[binding.targetId] = readBuilderDatasetSampleRecords(
      binding.targetId,
      binding,
      locale,
      posts,
      site,
    );
  }
  return Object.keys(runtimeRecordsByTarget).length > 0 ? runtimeRecordsByTarget : undefined;
}
