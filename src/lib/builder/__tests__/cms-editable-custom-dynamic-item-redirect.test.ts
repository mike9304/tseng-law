import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_THEME,
  type BuilderPageMeta,
  type BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  createEditableBuilderCmsCollection,
  createEditableBuilderCmsRecord,
  updateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('editable CMS custom dynamic item slug redirects', () => {
  let siteDoc: BuilderSiteDocument;

  beforeEach(() => {
    const now = '2026-06-21T00:00:00.000Z';
    siteDoc = {
      version: 1,
      siteId: 'test-site',
      name: 'Test site',
      locale: 'ko',
      navigation: [],
      theme: DEFAULT_THEME,
      pages: [
        {
          pageId: 'page-recipes-detail',
          slug: 'recipes-detail',
          title: { ko: 'Recipes detail', en: 'Recipes detail', 'zh-hant': 'Recipes detail' },
          locale: 'ko',
          dynamicItem: {
            kind: 'collection-item-v1',
            collectionId: 'columns',
            targetId: 'home.insights.feed',
            cmsCollectionId: 'recipes-redirects',
            slugField: 'slug',
            defaultRecordSlug: 'original-recipe',
            createdAt: now,
          },
          createdAt: now,
          updatedAt: now,
        } satisfies BuilderPageMeta,
      ],
      createdAt: now,
      updatedAt: now,
    };
    mockedReadSiteDocument.mockReset();
    mockedReadSiteDocument.mockImplementation(async () => siteDoc);
    mockedWriteSiteDocument.mockReset();
    mockedWriteSiteDocument.mockImplementation(async (nextDoc) => {
      siteDoc = nextDoc;
    });
  });

  it('creates redirects for linked custom dynamic item pages when the record slug changes', async () => {
    await createEditableBuilderCmsCollection('test-site', 'ko', {
      collectionId: 'recipes-redirects',
      name: 'Recipes redirects',
      slug: 'recipes',
    });
    const created = await createEditableBuilderCmsRecord('test-site', 'ko', 'recipes-redirects', {
      fields: { title: 'Original recipe', slug: 'original-recipe' },
    });
    if (!created) throw new Error('Expected the recipe record to be created.');

    const updated = await updateEditableBuilderCmsRecord(
      'test-site',
      'ko',
      'recipes-redirects',
      created.recordId,
      { fields: { title: 'Original recipe', slug: 'updated-recipe' } },
    );

    expect(updated?.redirectCreated).toBe(true);
    expect(updated?.redirectWarnings ?? []).toHaveLength(0);
    expect(siteDoc.redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: '/ko/recipes/original-recipe',
        to: '/ko/recipes/updated-recipe',
      }),
      expect.objectContaining({
        from: '/ko/recipes-detail/original-recipe',
        to: '/ko/recipes-detail/updated-recipe',
      }),
    ]));
  });
});
