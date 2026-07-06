import { expect, test } from '@playwright/test';
import { z } from 'zod';

const createPageResponseSchema = z.object({
  success: z.boolean().optional(),
  pageId: z.string().optional(),
  error: z.string().optional(),
});

const publishPageResponseSchema = z.object({
  ok: z.boolean().optional(),
  slug: z.string().optional(),
  error: z.string().optional(),
});

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'dynamic-list-sort';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('/ko dynamic list sort links do not expose authored filters as visitor filters', async ({ page }) => {
  test.setTimeout(90_000);

  const token = Date.now().toString(36);
  const slug = `dynamic-list-authored-filter-sort-${token}`;
  let pageId: string | null = null;

  try {
    const createResponse = await page.request.post('/api/builder/site/pages', {
      headers: mutationHeaders(slug),
      data: {
        locale: 'ko',
        slug,
        title: `Dynamic list authored filter sort ${token}`,
        addToNavigation: false,
        dynamicListCollectionId: 'columns',
        dynamicListFilters: [{ fieldId: 'title', operator: 'contains', value: '대만' }],
        dynamicListLimit: 6,
      },
    });
    expect(createResponse.status()).toBe(200);
    const created = createPageResponseSchema.parse(await createResponse.json());
    expect(created.success, created.error).toBe(true);
    pageId = created.pageId ?? null;
    expect(pageId).toBeTruthy();
    if (!pageId) throw new Error('dynamic list test page was not created');

    const publishResponse = await page.request.post(`/api/builder/site/pages/${pageId}/publish?locale=ko`, {
      headers: mutationHeaders(slug),
    });
    expect(publishResponse.status()).toBe(200);
    const published = publishPageResponseSchema.parse(await publishResponse.json());
    expect(published.ok, published.error).toBe(true);
    const publicSlug = published.slug ?? slug;

    await page.goto(`/ko/${publicSlug}?perPage=6`, { waitUntil: 'domcontentloaded' });
    const visitorSort = page.getByLabel('Dynamic list sort');
    await expect(visitorSort).toBeVisible();
    const descLink = visitorSort.getByRole('link', { name: 'Title descending' });
    await expect(descLink).toHaveAttribute('href', `/ko/${publicSlug}?sort=title%3Adesc&perPage=6`);

    await Promise.all([
      page.waitForURL((url) => (
        url.pathname.endsWith(`/${publicSlug}`)
        && url.searchParams.get('sort') === 'title:desc'
        && !url.searchParams.has('filter[title]')
      )),
      descLink.click(),
    ]);

    const currentUrl = new URL(page.url());
    expect(currentUrl.searchParams.get('sort')).toBe('title:desc');
    expect(currentUrl.searchParams.has('filter[title]')).toBe(false);
    const visitorFilters = page.getByLabel('Dynamic list visitor filters');
    await expect(visitorFilters).toContainText('sort title:desc');
    await expect(visitorFilters).not.toContainText('title contains 대만');
    await expect(visitorSort.getByRole('link', { name: 'Default order' })).toHaveAttribute(
      'href',
      `/ko/${publicSlug}?perPage=6`,
    );

    await page.screenshot({
      path: '/private/tmp/tseng-law-dynamic-list-authored-filter-sort-desktop.png',
      fullPage: true,
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('Dynamic list sort')).toBeVisible();
    await expect(page.getByLabel('Dynamic list visitor filters')).toContainText('sort title:desc');
    await page.screenshot({
      path: '/private/tmp/tseng-law-dynamic-list-authored-filter-sort-mobile.png',
      fullPage: true,
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  } finally {
    if (pageId) {
      await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
        headers: mutationHeaders(slug),
      }).catch(() => undefined);
    }
  }
});
