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
  }).optional(),
});

const atomicPublishResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  referencedCollectionIds: z.array(z.string()).optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-source';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeSourceCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: `recipes-source-${token}`,
    name: `Recipe Source ${token}`,
    slug: `recipes-source-${token}`,
    description: 'Custom recipes used for slug source field proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-code', key: 'code', label: 'Code', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `source-alpha-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Alpha Source ${token}`,
          slug: `alpha-source-${token}`,
          code: `alpha-code-${token}`,
          content: `Alpha source item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `source-missing-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Title Source ${token}`,
          slug: '',
          code: `External Code ${token}`,
          content: `Source field item body ${token}`,
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

test('/ko linked custom CMS dynamic item page generates missing slugs from selected source field', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collection = makeSourceCollection(token);
  const originalSite = await readSiteDocument('default', 'ko');

  try {
    await writeSiteDocument({
      ...originalSite,
      cmsCollections: [
        ...(originalSite.cmsCollections ?? []).filter((item) => item.collectionId !== collection.collectionId),
        collection,
      ],
      updatedAt: new Date().toISOString(),
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const createButton = page.locator(`[data-cms-create-dynamic-item-page="${collection.collectionId}"]`);
    await expect(createButton).toBeVisible();
    const createResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/builder/site/pages')
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await createButton.click();
    const created = createPageResponseSchema.parse(await (await createResponsePromise).json());
    const pageId = created.pageId;
    const publicSlug = created.page?.slug;
    if (!pageId || !publicSlug) throw new Error('Dynamic item page creation did not return pageId and slug.');

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const linkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 missing slug values');

    await linkedItemPageCard
      .locator(`[data-cms-dynamic-item-slug-source-field="${pageId}"]`)
      .selectOption('code');
    const generateSlugButton = linkedItemPageCard
      .locator(`[data-cms-dynamic-item-generate-missing-slugs="${pageId}"]`);
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Generate slug values for 1 records');
      await dialog.accept();
    });
    const slugRepairResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await generateSlugButton.click();
    expect((await slugRepairResponsePromise).status()).toBe(200);
    await expect(
      linkedItemPageCard.locator(`[data-cms-dynamic-item-record-route="source-missing-${token}"]`),
    ).toHaveAttribute('href', `/ko/${publicSlug}/external-code-${token}`);

    const publishResponse = await page.request.post('/api/builder/publish/atomic', {
      headers: mutationHeaders(publicSlug),
      data: {
        pageIds: [pageId],
        cmsCollectionIds: [],
        deriveDynamicCollections: true,
        locale: 'ko',
      },
    });
    const published = atomicPublishResponseSchema.parse(await publishResponse.json());
    expect(publishResponse.status()).toBe(200);
    expect(published.ok, published.error).toBe(true);
    expect(published.referencedCollectionIds).toEqual([collection.collectionId]);

    await page.goto(`/ko/${publicSlug}/external-code-${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Title Source ${token}`);
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first())
      .toContainText(`Source field item body ${token}`);
  } finally {
    await writeSiteDocument(originalSite);
  }
});
