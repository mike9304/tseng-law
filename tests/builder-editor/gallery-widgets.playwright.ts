import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm13-gallery-widgets';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function createBuilderPage(request: APIRequestContext, slug: string, title: string): Promise<string> {
  const response = await request.post('/api/builder/site/pages', {
    data: { locale: 'ko', slug, title, blank: true },
    headers: mutationHeaders(slug),
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { success?: boolean; pageId?: string; error?: string };
  expect(payload.success, payload.error).toBe(true);
  expect(payload.pageId).toBeTruthy();
  return payload.pageId!;
}

test.describe('/ko/admin-builder gallery widget pack', () => {
  test('adds the M13 gallery widget presets from the catalog', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m13-gallery-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `M13 Gallery ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&galleryWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText('Gallery widget pack')).toBeVisible();

      const presets = [
        'gallery-grid',
        'gallery-masonry',
        'gallery-slider',
        'gallery-slideshow',
        'gallery-thumbnail',
        'gallery-pro',
        'gallery-caption-overlay',
        'gallery-filter',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-gallery-widget-preset="${preset}"]`).click();
      }

      await expect(page.locator('[data-builder-gallery-layout="grid"]')).toHaveCount(3);
      await expect(page.locator('[data-builder-gallery-layout="masonry"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-layout="slider"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-layout="slideshow"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-layout="thumbnail"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-layout="pro"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-thumbnail="true"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-pro="mosaic"]')).toHaveCount(1);
      await expect(page.locator('[data-builder-gallery-caption-overlay="true"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-gallery-filterbar="true"]')).toHaveCount(8);
      await expect(page.locator('[data-builder-gallery-filter="featured"][data-active="true"]')).toHaveCount(1);
    } finally {
      if (pageId) {
        await page.request.delete(`/api/builder/site/pages/${pageId}?locale=ko`, {
          headers: mutationHeaders(slug),
          failOnStatusCode: false,
        });
      }
    }
  });
});
