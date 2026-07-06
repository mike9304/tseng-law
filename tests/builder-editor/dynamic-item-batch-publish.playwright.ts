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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-batch';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeRecipeCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: `recipes-batch-${token}`,
    name: `Recipe Batch ${token}`,
    slug: `recipes-batch-${token}`,
    description: 'Custom recipes used for linked dynamic item batch publish proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `recipe-alpha-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Alpha Batch ${token}`,
          slug: `alpha-batch-${token}`,
          content: `Alpha batch item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-draft-${token}`,
        status: 'draft',
        locale: 'ko',
        fields: {
          title: `Draft Batch ${token}`,
          slug: `draft-batch-${token}`,
          content: `Draft batch item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-missing-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Missing Batch ${token}`,
          slug: '',
          content: `Missing batch item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-duplicate-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Duplicate Batch ${token}`,
          slug: `alpha-batch-${token}`,
          content: `Duplicate batch item body ${token}`,
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

test('/ko linked custom CMS dynamic item page repairs and publishes held-back records', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collection = makeRecipeCollection(token);
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
    const createResponse = await createResponsePromise;
    const created = createPageResponseSchema.parse(await createResponse.json());
    expect(created.success, created.error).toBe(true);
    const pageId = created.pageId;
    const publicSlug = created.page?.slug;
    if (!pageId || !publicSlug) throw new Error('Dynamic item page creation did not return pageId and slug.');

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const linkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 draft held back');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 missing slug values');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 duplicate slug conflicts');
    const generateSlugButton = linkedItemPageCard
      .locator(`[data-cms-dynamic-item-generate-missing-slugs="${pageId}"]`);
    await expect(generateSlugButton).toContainText('Generate missing slugs (1)');

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
    const slugRepairResponse = await slugRepairResponsePromise;
    expect(slugRepairResponse.status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('2 published record routes ready');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 missing slug values');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 duplicate slug conflicts');
    await expect(
      linkedItemPageCard.locator(`[data-cms-dynamic-item-record-route="recipe-missing-${token}"]`),
    ).toHaveAttribute('href', `/ko/${publicSlug}/missing-batch-${token}`);

    const conflictRepairButton = linkedItemPageCard
      .locator(`[data-cms-dynamic-item-repair-slug-conflicts="${pageId}"]`);
    await expect(conflictRepairButton).toContainText('Repair slug conflicts (1)');
    await linkedItemPageCard
      .locator(`[data-cms-dynamic-item-slug-conflict-rule="${pageId}"]`)
      .selectOption('record-id-suffix');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Generate unique slug values for 1 records');
      await dialog.accept();
    });
    const conflictRepairResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await conflictRepairButton.click();
    const conflictRepairResponse = await conflictRepairResponsePromise;
    expect(conflictRepairResponse.status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('3 published record routes ready');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 duplicate slug conflicts');
    const repairedDuplicateSlug = `duplicate-batch-${token}-recipe-duplicate-${token}`;
    await expect(
      linkedItemPageCard.locator(`[data-cms-dynamic-item-record-route="recipe-duplicate-${token}"]`),
    ).toHaveAttribute('href', `/ko/${publicSlug}/${repairedDuplicateSlug}`);

    const publishButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-publish-held-back="${pageId}"]`);
    await expect(publishButton).toContainText('Publish held-back routes (1)');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Publish 1 held-back records');
      await dialog.accept();
    });
    const bulkResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await publishButton.click();
    const bulkResponse = await bulkResponsePromise;
    expect(bulkResponse.status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('4 published record routes ready');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 draft held back');
    await expect(
      linkedItemPageCard.locator(`[data-cms-dynamic-item-record-route="recipe-draft-${token}"]`),
    ).toHaveAttribute('href', `/ko/${publicSlug}/draft-batch-${token}`);

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

    await page.goto(`/ko/${publicSlug}/draft-batch-${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Draft Batch ${token}`);
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first())
      .toContainText(`Draft batch item body ${token}`);

    await page.goto(`/ko/${publicSlug}/missing-batch-${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Missing Batch ${token}`);
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first())
      .toContainText(`Missing batch item body ${token}`);

    await page.goto(`/ko/${publicSlug}/${repairedDuplicateSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Duplicate Batch ${token}`);
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first())
      .toContainText(`Duplicate batch item body ${token}`);
  } finally {
    await writeSiteDocument(originalSite);
  }
});
