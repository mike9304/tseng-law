import { expect, test } from '@playwright/test';
import { z } from 'zod';
import type { BuilderCmsCollection } from '@/lib/builder/cms-types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';

const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
});

function makeTrashRestoreCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-25T00:00:00.000Z';
  return {
    collectionId: `recipes-trash-${token}`,
    name: `Recipe Trash ${token}`,
    slug: `recipes-trash-${token}`,
    description: 'Custom recipes used for deleted-record restore proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `recipe-live-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Live Trash ${token}`,
          slug: `live-trash-${token}`,
          content: `Live trash item body ${token}`,
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-trash-${token}`,
        status: 'archived',
        locale: 'ko',
        fields: {
          title: `Trash Restore ${token}`,
          slug: `trash-restore-${token}`,
          content: `Trash restore item body ${token}`,
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

test('/ko linked custom CMS dynamic item page restores deleted archived records from trash', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const collection = makeTrashRestoreCollection(token);
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
    if (!created.pageId) throw new Error('Dynamic item page creation did not return pageId.');

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const linkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${created.pageId}"]`);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${created.pageId}"]`))
      .toContainText('1 archived item records');

    const trashButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-delete-archived="${created.pageId}"]`);
    await expect(trashButton).toContainText('Trash archived (1)');
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Move 1 archived records to trash');
      await dialog.accept();
    });
    const trashResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await trashButton.click();
    expect((await trashResponsePromise).status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${created.pageId}"]`))
      .toContainText('0 archived item records');

    const restoreDeletedButton = linkedItemPageCard.locator(`[data-cms-dynamic-item-restore-deleted="${created.pageId}"]`);
    await expect(restoreDeletedButton).toContainText('Restore deleted (1)');
    if (process.env.CMS_TRASH_RESTORE_DESKTOP_SCREENSHOT_PATH) {
      await linkedItemPageCard.screenshot({ path: process.env.CMS_TRASH_RESTORE_DESKTOP_SCREENSHOT_PATH });
    }
    if (process.env.CMS_TRASH_RESTORE_MOBILE_SCREENSHOT_PATH) {
      await page.setViewportSize({ width: 390, height: 844 });
      await expect(restoreDeletedButton).toBeVisible();
      await linkedItemPageCard.screenshot({ path: process.env.CMS_TRASH_RESTORE_MOBILE_SCREENSHOT_PATH });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Restore 1 deleted records as archived records');
      await dialog.accept();
    });
    const restoreDeletedResponsePromise = page.waitForResponse((response) =>
      response.url().includes(`/collections/${collection.collectionId}/records/bulk`)
      && response.request().method() === 'POST'
      && response.status() === 200,
    );
    await restoreDeletedButton.click();
    expect((await restoreDeletedResponsePromise).status()).toBe(200);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${created.pageId}"]`))
      .toContainText('1 archived item records');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-restore-archived="${created.pageId}"]`))
      .toContainText('Restore (1)');
  } finally {
    await writeSiteDocument(originalSite);
  }
});
