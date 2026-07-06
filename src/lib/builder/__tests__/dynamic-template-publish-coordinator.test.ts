import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  collectDynamicCollectionsForPages,
  publishDynamicTemplate,
} from '@/lib/builder/dynamic-template-publish-coordinator';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderPageMeta } from '@/lib/builder/site/types';
import {
  publishAtomic,
  type AtomicPublishOutcome,
} from '@/lib/builder/publish-gate/atomic-publish-orchestrator';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/publish-gate/atomic-publish-orchestrator', () => ({
  publishAtomic: vi.fn(),
}));

const now = '2026-06-21T00:00:00.000Z';

const customDynamicListPage: BuilderPageMeta = {
  pageId: 'custom-list',
  slug: 'recipes',
  title: { ko: 'Recipes', 'zh-hant': 'Recipes', en: 'Recipes' },
  locale: 'ko',
  createdAt: now,
  updatedAt: now,
  dynamicList: {
    kind: 'collection-list-v1',
    collectionId: 'columns',
    cmsCollectionId: 'recipes-alpha',
    targetId: 'home.insights.feed',
    filters: [],
    sort: [],
    limit: 6,
    createdAt: now,
  },
};

const serviceDynamicItemPage: BuilderPageMeta = {
  pageId: 'service-item',
  slug: 'service',
  title: { ko: 'Service', 'zh-hant': 'Service', en: 'Service' },
  locale: 'ko',
  createdAt: now,
  updatedAt: now,
  dynamicItem: {
    kind: 'collection-item-v1',
    collectionId: 'service-areas',
    targetId: 'home.services.list',
    slugField: 'slug',
    defaultRecordSlug: 'family',
    createdAt: now,
  },
};

const customDynamicItemPage: BuilderPageMeta = {
  pageId: 'custom-item',
  slug: 'recipes/item',
  title: { ko: 'Recipe Item', 'zh-hant': 'Recipe Item', en: 'Recipe Item' },
  locale: 'ko',
  createdAt: now,
  updatedAt: now,
  dynamicItem: {
    kind: 'collection-item-v1',
    collectionId: 'columns',
    cmsCollectionId: 'recipes-item-alpha',
    targetId: 'home.insights.feed',
    slugField: 'slug',
    defaultRecordSlug: 'alpha',
    createdAt: now,
  },
};

const staticPage: BuilderPageMeta = {
  pageId: 'static-page',
  slug: 'static',
  title: { ko: 'Static', 'zh-hant': 'Static', en: 'Static' },
  locale: 'ko',
  createdAt: now,
  updatedAt: now,
};

describe('dynamic template publish coordinator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('collects user CMS collection ids before built-in dynamic list targets', () => {
    const collectionIds = collectDynamicCollectionsForPages([
      customDynamicListPage,
      serviceDynamicItemPage,
      customDynamicItemPage,
      customDynamicListPage,
      staticPage,
      undefined,
    ]);

    expect(collectionIds).toEqual(['recipes-alpha', 'service-areas', 'recipes-item-alpha']);
  });

  it('publishes dynamic pages with their referenced collections and caller extras', async () => {
    const committed: AtomicPublishOutcome = {
      ok: true,
      transactionId: 'tx-dynamic',
      status: 'committed',
      results: [],
    };
    vi.mocked(readSiteDocument).mockResolvedValue({
      ...createDefaultSiteDocument('ko', 'default'),
      pages: [customDynamicListPage, serviceDynamicItemPage, staticPage],
    });
    vi.mocked(publishAtomic).mockResolvedValue(committed);

    const result = await publishDynamicTemplate({
      siteId: 'default',
      locale: 'ko',
      pageIds: ['custom-list', 'service-item', 'static-page', 'missing-page'],
      extraCollectionIds: ['service-areas', 'attorney-profiles'],
    });

    expect(result.outcome).toBe(committed);
    expect(result.referencedCollectionIds).toEqual([
      'recipes-alpha',
      'service-areas',
      'attorney-profiles',
    ]);
    expect(result.resolvedPages).toEqual([
      { pageId: 'custom-list', status: 'dynamic-list', collectionId: 'recipes-alpha' },
      { pageId: 'service-item', status: 'dynamic-item', collectionId: 'service-areas' },
      { pageId: 'static-page', status: 'static' },
      { pageId: 'missing-page', status: 'missing' },
    ]);
    expect(publishAtomic).toHaveBeenCalledWith({
      siteId: 'default',
      locale: 'ko',
      pageIds: ['custom-list', 'service-item', 'static-page', 'missing-page'],
      cmsCollectionIds: ['recipes-alpha', 'service-areas', 'attorney-profiles'],
    });
  });
});
