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
      targetId: z.string(),
      cmsCollectionId: z.string().optional(),
      limit: z.number().optional(),
    }).optional(),
  }).optional(),
});

const publishPageResponseSchema = z.object({
  ok: z.boolean().optional(),
  slug: z.string().optional(),
  error: z.string().optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-list-custom';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function makeRecipeCollection(token: string): BuilderCmsCollection {
  const now = '2026-06-21T00:00:00.000Z';
  return {
    collectionId: `recipes-${token}`,
    name: `Recipes ${token}`,
    slug: `recipes-${token}`,
    description: 'Custom recipes used for dynamic list runtime proof.',
    localized: false,
    fields: [
      { fieldId: 'f-title', key: 'title', label: 'Title', type: 'text', localized: false, repeated: false, required: true },
      { fieldId: 'f-slug', key: 'slug', label: 'Slug', type: 'slug', localized: false, repeated: false, required: true },
      { fieldId: 'f-summary', key: 'summary', label: 'Summary', type: 'rich-text', localized: false, repeated: false, required: false },
      { fieldId: 'f-category', key: 'category', label: 'Category', type: 'text', localized: false, repeated: false, required: false },
      { fieldId: 'f-difficulty', key: 'difficulty', label: 'Difficulty', type: 'text', localized: false, repeated: false, required: false },
    ],
    indexes: [],
    records: [
      {
        recordId: `recipe-a-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Alpha Soup ${token}`,
          slug: `alpha-soup-${token}`,
          summary: `Alpha custom collection soup ${token}`,
          category: 'soup',
          difficulty: 'beginner',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-b-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Beta Main ${token}`,
          slug: `beta-main-${token}`,
          summary: `Beta custom collection main ${token}`,
          category: 'main',
          difficulty: 'intermediate',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-c-${token}`,
        status: 'published',
        locale: 'ko',
        fields: {
          title: `Charlie Soup ${token}`,
          slug: `charlie-soup-${token}`,
          summary: `Charlie custom collection soup ${token}`,
          category: 'soup',
          difficulty: 'advanced',
        },
        createdAt: now,
        updatedAt: now,
      },
      {
        recordId: `recipe-draft-${token}`,
        status: 'draft',
        locale: 'ko',
        fields: {
          title: `Draft Soup ${token}`,
          slug: `draft-soup-${token}`,
          summary: `Draft custom collection soup ${token}`,
          category: 'soup',
          difficulty: 'advanced',
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

test('/ko custom CMS collection dynamic list publishes visitor query controls', async ({ page }) => {
  test.setTimeout(120_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-custom-${token}`;
  const collection = makeRecipeCollection(token);
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

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const createButton = page.locator(`[data-cms-create-dynamic-list-page="${collection.collectionId}"]`);
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
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    expect(created.page?.dynamicList).toMatchObject({
      collectionId: 'columns',
      targetId: 'home.insights.feed',
      cmsCollectionId: collection.collectionId,
      limit: 6,
    });
    const createdSlug = created.page?.slug;
    expect(createdSlug).toBeTruthy();
    await expect(page).toHaveURL(new RegExp(`/ko/admin-builder\\?pageId=${encodeURIComponent(pageId ?? '')}`));
    await expect(page.locator(`[data-node-id="dynamic-list-repeater-${collection.collectionId}"]`).first()).toBeVisible();

    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    const linkedPageCard = page.locator(`[data-cms-dynamic-list-linked-page="${pageId}"]`);
    await expect(linkedPageCard).toBeVisible();
    await expect(linkedPageCard).toContainText(createdSlug ?? '');
    await expect(linkedPageCard.locator(`[data-cms-dynamic-list-editor-link="${pageId}"]`)).toHaveAttribute(
      'href',
      `/ko/admin-builder?pageId=${encodeURIComponent(pageId ?? '')}`,
    );
    await linkedPageCard.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-list-linked-page-desktop.png',
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/ko/admin-builder/cms?collectionId=${encodeURIComponent(collection.collectionId)}`, {
      waitUntil: 'domcontentloaded',
    });
    await expect(linkedPageCard).toBeVisible();
    await linkedPageCard.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: '/private/tmp/tseng-law-cms-dynamic-list-linked-page-mobile.png',
      fullPage: true,
    });
    await linkedPageCard.locator(`[data-cms-dynamic-list-editor-link="${pageId}"]`).click();
    await expect(page).toHaveURL(new RegExp(`/ko/admin-builder\\?pageId=${encodeURIComponent(pageId ?? '')}`));
    await page.setViewportSize({ width: 1280, height: 1600 });

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = publishPageResponseSchema.parse(await publishResponse.json());
    expect(published.ok, published.error).toBe(true);
    const publicSlug = published.slug ?? slug;

    await page.goto(`/ko/${publicSlug}?filter[category]=soup&sort=difficulty:asc&perPage=1`, {
      waitUntil: 'domcontentloaded',
    });
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toBeVisible();
    await expect(visitorFilters).toContainText('category contains soup');
    await expect(visitorFilters).toContainText('sort difficulty:asc');
    await expect(visitorFilters.getByRole('link', { name: 'Clear filters' })).toHaveAttribute('href', `/ko/${publicSlug}`);
    const sortControls = page.getByLabel('Dynamic list sort');
    await expect(sortControls.getByRole('link', { name: 'Difficulty ascending' })).toBeVisible();
    await expect(sortControls.getByRole('link', { name: 'Difficulty descending' })).toBeVisible();

    const repeater = page.locator(`[data-node-id="dynamic-list-repeater-${collection.collectionId}"]`).first();
    await expect(repeater).toBeVisible();
    await expect(repeater.locator('[data-builder-repeater-item="true"]')).toHaveCount(1);
    await expect(repeater).toContainText(`Charlie Soup ${token}`);
    await expect(repeater).not.toContainText(`Draft Soup ${token}`);

    const pagination = page.getByLabel('Dynamic list pagination');
    await expect(pagination).toContainText('1 / 2');
    const nextLink = pagination.getByRole('link', { name: 'Next' });
    await expect(nextLink).toHaveAttribute('href', /filter%5Bcategory%5D=soup.*sort=difficulty%3Aasc.*perPage=1.*page=2|page=2.*perPage=1.*sort=difficulty%3Aasc.*filter%5Bcategory%5D=soup/);
    await Promise.all([
      page.waitForURL((url) => (
        url.pathname.endsWith(`/${publicSlug}`)
        && url.searchParams.get('filter[category]') === 'soup'
        && url.searchParams.get('sort') === 'difficulty:asc'
        && url.searchParams.get('page') === '2'
      )),
      nextLink.click(),
    ]);
    await expect(pagination).toContainText('2 / 2');
    await expect(repeater).toContainText(`Alpha Soup ${token}`);

    await page.getByLabel('Search records').fill('Charlie');
    await Promise.all([
      page.waitForURL((url) => url.searchParams.get('q') === 'Charlie' && !url.searchParams.has('page')),
      page.getByRole('button', { name: 'Search' }).click(),
    ]);
    await expect(visitorFilters).toContainText('search Charlie');
    await expect(repeater).toContainText(`Charlie Soup ${token}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.screenshot({
      path: '/private/tmp/tseng-law-dynamic-list-custom-collection-desktop.png',
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('search Charlie');
    await expect(repeater).toContainText(`Charlie Soup ${token}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    await page.screenshot({
      path: '/private/tmp/tseng-law-dynamic-list-custom-collection-mobile.png',
      fullPage: true,
    });
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
    await writeSiteDocument(originalSite).catch(() => undefined);
  }
});
