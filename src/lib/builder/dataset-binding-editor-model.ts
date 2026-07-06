import type {
  BuilderPageDatasetOverview,
} from '@/lib/builder/datasets';
import type {
  BuilderPageDatasetBinding,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';

export interface BuilderDatasetBindingEditorState {
  collectionId: string;
  mode: string;
  limit: number | '';
  filters: BuilderPageDatasetFilter[];
  sort: BuilderPageDatasetSort[];
}

export function buildDatasetBindingEditorState(
  overview: BuilderPageDatasetOverview,
  binding: BuilderPageDatasetBinding = overview.currentBinding
): BuilderDatasetBindingEditorState {
  return {
    collectionId: binding.collectionId,
    mode: binding.mode,
    limit: typeof binding.limit === 'number' ? binding.limit : '',
    filters: cloneFilters(binding.filters ?? []),
    sort: cloneSort(binding.sort ?? []),
  };
}

export function buildDatasetBindingDefaultState(
  overview: BuilderPageDatasetOverview
): BuilderDatasetBindingEditorState {
  return {
    collectionId: overview.defaultCollectionId,
    mode: overview.modeOptions[0] ?? 'list',
    limit: typeof overview.defaultLimit === 'number' ? overview.defaultLimit : '',
    filters: [],
    sort: cloneSort(overview.defaultSort ?? []),
  };
}

export function cloneFilters(filters: BuilderPageDatasetFilter[]): BuilderPageDatasetFilter[] {
  return filters.map((filter) => ({ ...filter }));
}

export function cloneSort(sort: BuilderPageDatasetSort[]): BuilderPageDatasetSort[] {
  return sort.map((entry) => ({ ...entry }));
}
