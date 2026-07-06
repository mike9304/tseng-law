import type {
  BuilderDatasetCollectionId,
  BuilderDatasetTargetId,
  BuilderPageDatasetFilter,
  BuilderPageDatasetSort,
} from '@/lib/builder/types';

export interface BuilderDynamicListPageMeta {
  readonly kind: 'collection-list-v1';
  readonly collectionId: BuilderDatasetCollectionId;
  readonly targetId: BuilderDatasetTargetId;
  readonly cmsCollectionId?: string;
  readonly filters: readonly BuilderPageDatasetFilter[];
  readonly sort: readonly BuilderPageDatasetSort[];
  readonly limit?: number;
  readonly createdAt: string;
}

export interface BuilderDynamicItemPageMeta {
  readonly kind: 'collection-item-v1';
  readonly collectionId: BuilderDatasetCollectionId;
  readonly targetId: BuilderDatasetTargetId;
  readonly cmsCollectionId?: string;
  readonly slugField: string;
  readonly defaultRecordSlug: string;
  readonly createdAt: string;
}
