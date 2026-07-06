import { expect, test } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { expectDynamicItemLifecycleAuditEvents } from './helpers/dynamic-item-lifecycle-audit';

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
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-archive';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeArchiveCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-archive-${token}`,
    name: `Recipe Archive ${token}`,
    slug: `recipes-archive-${token}`,
    description: 'Custom recipes used for held-back archive proof.',
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
          title: `Alpha Archive ${token}`,
          slug: `alpha-archive-${token}`,
          content: `Alpha archive item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-draft-${token}`,
        status: 'draft',
        locale: 'ko',
        fields: {
          title: `Draft Archive ${token}`,
          slug: `draft-archive-${token}`,
          content: `Draft archive item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-delete-${token}`,
        status: 'archived',
        locale: 'ko',
        fields: {
          title: `Delete Archive ${token}`,
          slug: `delete-archive-${token}`,
          content: `Delete archive item body ${token}`,
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

test('/ko linked custom CMS dynamic item page archives, restores, and deletes route lifecycle records', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collection = makeArchiveCollection(token);
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
      .toContainText('1 draft held back');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 archived item records');

    const deleteArchivedButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-delete-archived="${pageId}"]`);
    await expect(deleteArchivedButton).toContainText('Trash archived (1)');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Move 1 archived records to trash');
      await dialog.accept();
    });
    const deleteResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await deleteArchivedButton.click();
    expect((await deleteResponsePromise).status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 archived item records');

    const archiveButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-archive-held-back="${pageId}"]`);
    await expect(archiveButton).toContainText('Archive held-back routes (1)');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Archive 1 held-back records');
      await dialog.accept();
    });
    const archiveResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await archiveButton.click();
    expect((await archiveResponsePromise).status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 draft held back');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 archived item records');

    const restoreButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-restore-archived="${pageId}"]`);
    await expect(restoreButton).toContainText('Restore (1)');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Restore 1 archived records as drafts');
      await dialog.accept();
    });
    const restoreResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await restoreButton.click();
    expect((await restoreResponsePromise).status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('1 draft held back');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 archived item records');

    const publishButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-publish-held-back="${pageId}"]`);
    await expect(publishButton).toContainText('Publish held-back routes (1)');

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Publish 1 held-back records');
      await dialog.accept();
    });
    const publishHeldBackResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await publishButton.click();
    expect((await publishHeldBackResponsePromise).status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('2 published record routes ready');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`))
      .toContainText('0 draft held back');

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

    await expectDynamicItemLifecycleAuditEvents(page, { collectionId: collection.collectionId, token });

    const deletedRouteResponse = await page.goto(`/ko/${publicSlug}/delete-archive-${token}`, {
      waitUntil: 'domcontentloaded',
    });
    expect(deletedRouteResponse?.status()).toBe(404);

    await page.goto(`/ko/${publicSlug}/draft-archive-${token}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first())
      .toContainText(`Draft Archive ${token}`);
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first())
      .toContainText(`Draft archive item body ${token}`);
  } finally {
    await writeSiteDocument(originalSite);
  }
});
