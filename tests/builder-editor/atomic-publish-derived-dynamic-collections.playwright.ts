import { expect, test } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';

const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
  page: z.object({
    slug: z.string().optional(),
    dynamicList: z.object({
      collectionId: z.string(),
      cmsCollectionId: z.string().optional(),
    }).optional(),
  }).optional(),
});

const atomicPublishResponseSchema = z.object({
  ok: z.boolean().optional(),
  status: z.string().optional(),
  transactionId: z.string().optional(),
  referencedCollectionIds: z.array(z.string()).optional(),
  resolvedPages: z.array(z.object({
    pageId: z.string(),
    status: z.string(),
    collectionId: z.string().optional(),
  })).optional(),
  results: z.array(z.object({
    kind: z.string().optional(),
    id: z.string().optional(),
    status: z.string().optional(),
    error: z.string().optional(),
  })).optional(),
  error: z.string().optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'atomic-derived';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeDerivedCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: `derived-recipes-${token}`,
    name: `Derived Recipes ${token}`,
    slug: `derived-recipes-${token}`,
    description: 'Draft-only collection used for derived atomic publish proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'f-category', key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `record-${token}`,
        status: 'draft',
        locale: 'ko',
        fields: {
          title: `Derived Atomic Soup ${token}`,
          slug: `derived-atomic-soup-${token}`,
          summary: `Derived atomic summary ${token}`,
          category: 'soup',
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
    permissions: { read: ['public'], create: ['admin'], update: ['admin'], delete: ['admin'] },
    createdAt: now,
    updatedAt: now,
  };
}

test('atomic publish derives custom CMS collection ids from dynamic list pages', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const headers = mutationHeaders(token);
  const collection = makeDerivedCollection(token);
  const originalSite = await readSiteDocument('default', 'ko');
  let pageId: string | null = null;

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((item) => item.collectionId !== collection.collectionId),
        collection,
      ],
      updatedAt: new Date().toISOString(),
    });

    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers,
      data: {
        locale: 'ko',
        slug: `atomic-derived-${token}`,
        title: `Atomic derived ${token}`,
        addToNavigation: false,
        dynamicListCmsCollectionId: collection.collectionId,
        dynamicListLimit: 6,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = createPageResponseSchema.parse(await createResponse.json());
    expect(created.success, created.error).toBe(true);
    const createdPageId = created.pageId;
    const publicSlug = created.page?.slug;
    expect(createdPageId).toBeTruthy();
    expect(publicSlug).toBeTruthy();
    if (!createdPageId || !publicSlug) throw new Error('dynamic_page_create_missing_fields');
    pageId = createdPageId;
    expect(created.page?.dynamicList).toMatchObject({
      collectionId: 'columns',
      cmsCollectionId: collection.collectionId,
    });

    const atomicResponse = await page.request.post('/api/builder/publish/atomic', {
      headers,
      data: {
        pageIds: [createdPageId],
        cmsCollectionIds: [],
        deriveDynamicCollections: true,
        locale: 'ko',
      },
    });
    expect(atomicResponse.status()).toBe(200);
    const atomic = atomicPublishResponseSchema.parse(await atomicResponse.json());
    expect(atomic.ok, atomic.error).toBe(true);
    expect(atomic.status).toBe('committed');
    expect(atomic.referencedCollectionIds).toEqual([collection.collectionId]);
    expect(atomic.resolvedPages).toEqual([
      {
        pageId: createdPageId,
        status: 'dynamic-list',
        collectionId: collection.collectionId,
      },
    ]);
    expect(atomic.results).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'page', id: createdPageId, status: 'succeeded' }),
      expect.objectContaining({ kind: 'cms', id: collection.collectionId, status: 'succeeded' }),
    ]));

    const publishedSite = await readSiteDocument('default', 'ko');
    const publishedCollection = publishedSite.cmsCollections?.find(
      (item) => item.collectionId === collection.collectionId,
    );
    expect(publishedCollection?.records[0]?.status).toBe('published');

    await page.goto(`/ko/${publicSlug}`, { waitUntil: 'domcontentloaded' });
    const repeater = page.locator(`[data-node-id="dynamic-list-repeater-${collection.collectionId}"]`).first();
    await expect(repeater).toBeVisible();
    await expect(repeater).toContainText(`Derived Atomic Soup ${token}`);
    await expect(repeater).toContainText(`Derived atomic summary ${token}`);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers,
        failOnStatusCode: false,
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});
