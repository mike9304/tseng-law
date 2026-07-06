import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import {
  createBuilderCmsDynamicItemCanvasDocument,
  createBuilderCmsDynamicItemPageMeta,
  createBuilderDynamicItemCanvasDocument,
  createBuilderDynamicItemPageMeta,
  getDynamicItemDefaultTitle,
  type SupportedDynamicItemCollectionId,
} from '@/lib/builder/dynamic-item-pages';
import {
  createBuilderCmsDynamicListCanvasDocument,
  createBuilderCmsDynamicListPageMeta,
  createBuilderDynamicListCanvasDocument,
  createBuilderDynamicListPageMeta,
  getDynamicListDefaultTitle,
  type SupportedDynamicListCollectionId,
} from '@/lib/builder/dynamic-list-pages';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import type { CreatePageRequestBody } from './create-page-request';

export interface CreatePageDynamicSelection {
  readonly dynamicListCollectionId: SupportedDynamicListCollectionId | null;
  readonly cmsDynamicListCollection: BuilderCmsCollection | null;
  readonly dynamicItemCollectionId: SupportedDynamicItemCollectionId | null;
  readonly cmsDynamicItemCollection: BuilderCmsCollection | null;
}

export function resolveCreatePageTitle({
  bodyTitle,
  locale,
  selection,
}: {
  readonly bodyTitle: string | undefined;
  readonly locale: Locale;
  readonly selection: CreatePageDynamicSelection;
}): string {
  const explicitTitle = bodyTitle?.trim();
  if (explicitTitle) return explicitTitle;
  if (selection.cmsDynamicListCollection) return `${selection.cmsDynamicListCollection.name} 동적 리스트`;
  if (selection.dynamicListCollectionId) return getDynamicListDefaultTitle(selection.dynamicListCollectionId, locale);
  if (selection.cmsDynamicItemCollection) return `${selection.cmsDynamicItemCollection.name} 동적 상세`;
  if (selection.dynamicItemCollectionId) return getDynamicItemDefaultTitle(selection.dynamicItemCollectionId, locale);
  return 'New Page';
}

export async function writeCreatePageDynamicMeta({
  siteId,
  locale,
  pageId,
  body,
  selection,
}: {
  readonly siteId: string;
  readonly locale: Locale;
  readonly pageId: string;
  readonly body: CreatePageRequestBody;
  readonly selection: CreatePageDynamicSelection;
}): Promise<BuilderPageMeta | null> {
  if (!hasDynamicSelection(selection)) return null;

  const nextSite = await readSiteDocument(siteId, locale);
  const dynamicPage = nextSite.pages.find((entry) => entry.pageId === pageId);
  if (!dynamicPage) return null;

  if (selection.cmsDynamicListCollection) {
    dynamicPage.dynamicList = createBuilderCmsDynamicListPageMeta({
      collection: selection.cmsDynamicListCollection,
      filters: body.dynamicListFilters,
      sort: body.dynamicListSort,
      limit: body.dynamicListLimit,
    });
  } else if (selection.dynamicListCollectionId) {
    dynamicPage.dynamicList = createBuilderDynamicListPageMeta({
      collectionId: selection.dynamicListCollectionId,
      filters: body.dynamicListFilters,
      sort: body.dynamicListSort,
      limit: body.dynamicListLimit,
    });
  } else if (selection.cmsDynamicItemCollection) {
    dynamicPage.dynamicItem = createBuilderCmsDynamicItemPageMeta({
      collection: selection.cmsDynamicItemCollection,
      recordSlug: body.dynamicItemRecordSlug,
    });
  } else if (selection.dynamicItemCollectionId) {
    dynamicPage.dynamicItem = createBuilderDynamicItemPageMeta({
      collectionId: selection.dynamicItemCollectionId,
      locale,
      recordSlug: body.dynamicItemRecordSlug,
    });
  }

  dynamicPage.updatedAt = new Date().toISOString();
  nextSite.updatedAt = dynamicPage.updatedAt;
  await writeSiteDocument(nextSite);
  return dynamicPage;
}

export function createCreatePageDynamicCanvas({
  locale,
  selection,
}: {
  readonly locale: Locale;
  readonly selection: CreatePageDynamicSelection;
}): BuilderCanvasDocument | null {
  if (selection.cmsDynamicListCollection) {
    return createBuilderCmsDynamicListCanvasDocument({ collection: selection.cmsDynamicListCollection, locale });
  }
  if (selection.dynamicListCollectionId) {
    return createBuilderDynamicListCanvasDocument({ collectionId: selection.dynamicListCollectionId, locale });
  }
  if (selection.cmsDynamicItemCollection) {
    return createBuilderCmsDynamicItemCanvasDocument({ collection: selection.cmsDynamicItemCollection, locale });
  }
  if (selection.dynamicItemCollectionId) {
    return createBuilderDynamicItemCanvasDocument({ collectionId: selection.dynamicItemCollectionId, locale });
  }
  return null;
}

function hasDynamicSelection(selection: CreatePageDynamicSelection): boolean {
  return Boolean(
    selection.dynamicListCollectionId
    || selection.cmsDynamicListCollection
    || selection.dynamicItemCollectionId
    || selection.cmsDynamicItemCollection,
  );
}
