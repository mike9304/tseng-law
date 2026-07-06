import type { BuilderPageDatasetFilter, BuilderPageDatasetSort } from '@/lib/builder/types';

export type CreatePageRequestBody = {
  readonly siteId?: string;
  readonly slug?: string;
  readonly title?: string;
  readonly locale?: string;
  readonly document?: unknown;
  readonly linkedFromPageId?: string;
  readonly blank?: boolean;
  readonly addToNavigation?: boolean;
  readonly dynamicListCollectionId?: string;
  readonly dynamicListCmsCollectionId?: string;
  readonly dynamicListFilters?: BuilderPageDatasetFilter[];
  readonly dynamicListSort?: BuilderPageDatasetSort[];
  readonly dynamicListLimit?: number;
  readonly dynamicItemCollectionId?: string;
  readonly dynamicItemCmsCollectionId?: string;
  readonly dynamicItemRecordSlug?: string;
  readonly memberAccess?: unknown;
};
