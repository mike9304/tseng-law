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
    dynamicItem: z.object({
      collectionId: z.string(),
      targetId: z.string(),
      cmsCollectionId: z.string().optional(),
      slugField: z.string(),
      defaultRecordSlug: z.string(),
    }).optional(),
  }).optional(),
});

const atomicPublishResponseSchema = z.object({
  ok: z.boolean().optional(),
  status: z.string().optional(),
  error: z.string().optional(),
  referencedCollectionIds: z.array(z.string()).optional(),
  resolvedPages: z.array(z.object({
    pageId: z.string(),
    status: z.string(),
    collectionId: z.string().optional(),
  })).optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-item-custom';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeRecipeCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: `recipes-item-${token}`,
    name: `Recipe Items ${token}`,
    slug: `recipes-item-${token}`,
    description: 'Custom recipes used for dynamic item runtime proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-content', key: 'content', label: 'Content', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'f-category', key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `recipe-alpha-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Alpha Detail ${token}`,
          slug: `alpha-detail-${token}`,
          content: `Alpha custom dynamic item body ${token}`,
          category: 'soup',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-draft-${token}`,
        status: 'draft',
        locale: 'ko',
        fields: {
          title: `Draft Detail ${token}`,
          slug: `draft-detail-${token}`,
          content: `Draft custom dynamic item body ${token}`,
          category: 'draft',
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

test('/ko custom CMS collection dynamic item creates, publishes, and renders by record slug', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const collection = makeRecipeCollection(token);
  const recordSlug = `alpha-detail-${token}`;
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
    const createResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/builder/site/pages')
        && response.request().method() === 'POST'
        && response.status() === 200,
      { timeout: 30_000 },
    );
    await createButton.click();
    const createResponse = await createResponsePromise;
    const created = createPageResponseSchema.parse(await createResponse.json());
    expect(created.success, created.error).toBe(true);
    const pageId = created.pageId;
    const publicSlug = created.page?.slug;
    if (!pageId || !publicSlug) throw new Error('Dynamic item page creation did not return pageId and slug.');
    expect(created.page?.dynamicItem).toMatchObject({
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      cmsCollectionId: collection.collectionId,
      slugField: 'slug',
      defaultRecordSlug: recordSlug,
    });

    await expect(page).toHaveURL(new RegExp(`/ko/admin-builder\\?pageId=${encodeURIComponent(pageId)}`));
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first()).toContainText(
      `Alpha Detail ${token}`,
    );
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-item-editor.png',
      fullPage: true,
    });

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const linkedItemPageCard = page.locator(`[data-cms-dynamic-item-linked-page="${pageId}"]`);
    await expect(linkedItemPageCard).toBeVisible();
    await expect(linkedItemPageCard).toContainText(publicSlug);
    await expect(linkedItemPageCard).toContainText(recordSlug);
    const routeCoverage = linkedItemPageCard.locator(`[data-cms-dynamic-item-route-coverage="${pageId}"]`);
    await expect(routeCoverage).toContainText('1 published record routes ready');
    await expect(routeCoverage).toContainText('1 draft held back');
    await expect(routeCoverage).toContainText('0 missing slug values');
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-draft-review="${pageId}"]`)).toHaveAttribute(
      'href',
      `/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}&recordId=recipe-draft-${token}`,
    );
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-missing-slug-review="${pageId}"]`)).toHaveCount(0);
    await expect(
      linkedItemPageCard.locator(`[data-cms-dynamic-item-record-route="recipe-alpha-${token}"]`),
    ).toHaveAttribute('href', `/ko/${publicSlug}/${recordSlug}`);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-record-route="recipe-draft-${token}"]`)).toHaveCount(0);
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-editor-link="${pageId}"]`)).toHaveAttribute(
      'href',
      `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}`,
    );
    await expect(linkedItemPageCard.locator(`[data-cms-dynamic-item-public-link="${pageId}"]`)).toHaveAttribute(
      'href',
      `/ko/${publicSlug}/${recordSlug}`,
    );
    await linkedItemPageCard.scrollIntoViewIfNeeded();
    await linkedItemPageCard.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-item-linked-card.png',
    });
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-item-linked-page.png',
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(linkedItemPageCard).toBeVisible();
    await linkedItemPageCard.scrollIntoViewIfNeeded();
    const mobileBounds = await linkedItemPageCard.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      };
    });
    expect(mobileBounds.left).toBeGreaterThanOrEqual(0);
    expect(mobileBounds.right).toBeLessThanOrEqual(mobileBounds.viewportWidth + 1);
    expect(mobileBounds.scrollWidth).toBeLessThanOrEqual(mobileBounds.viewportWidth + 1);
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-item-linked-page-mobile.png',
      fullPage: true,
    });
    await linkedItemPageCard.locator(`[data-cms-dynamic-item-editor-link="${pageId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/ko/admin-builder\\?pageId=${encodeURIComponent(pageId)}`));
    await page.setViewportSize({ width: 1280, height: 720 });

    const publishResponse = await page.request.post('/api/builder/publish/atomic', {
      headers: mutationHeaders(publicSlug),
      data: {
        pageIds: [pageId],
        cmsCollectionIds: [],
        deriveDynamicCollections: true,
        locale: 'ko',
      },
    });
    expect(publishResponse.status()).toBe(200);
    const published = atomicPublishResponseSchema.parse(await publishResponse.json());
    expect(published.ok, published.error).toBe(true);
    expect(published.referencedCollectionIds).toEqual([collection.collectionId]);
    expect(published.resolvedPages).toContainEqual({
      pageId,
      status: 'dynamic-item',
      collectionId: collection.collectionId,
    });

    await page.goto(`/ko/${publicSlug}/${recordSlug}`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator(`[data-node-id="dynamic-item-title-${collection.collectionId}"]`).first()).toContainText(
      `Alpha Detail ${token}`,
    );
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first()).toContainText(
      `Alpha custom dynamic item body ${token}`,
    );
    await expect(page.locator(`[data-node-id="dynamic-item-summary-${collection.collectionId}"]`).first()).not.toContainText(
      `Draft custom dynamic item body ${token}`,
    );
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-item-public.png',
      fullPage: true,
    });
  } finally {
    await writeSiteDocument(originalSite);
  }
});
