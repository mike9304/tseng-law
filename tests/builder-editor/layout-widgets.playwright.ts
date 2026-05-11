import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm14-layout-widgets';
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

test.describe('/ko/admin-builder layout widget pack', () => {
  test('adds the M14 layout widget presets from the catalog', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m14-layout-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `M14 Layout ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&layoutWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText('Layout widget pack')).toBeVisible();

      const presets = [
        'layout-strip',
        'layout-box',
        'layout-columns',
        'layout-repeater',
        'layout-tabs',
        'layout-accordion',
        'layout-slideshow-container',
        'layout-hover-box',
        'layout-sticky-anchor',
        'layout-grid',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-layout-widget-preset="${preset}"]`).click();
      }

      await expect(page.locator('[data-builder-layout-mode="strip"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-mode="box"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-mode="columns"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-mode="repeater"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-mode="grid"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-widget="tabs"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-widget="accordion"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-widget="slideshow"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-widget="hoverBox"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-widget="repeater"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-layout-sticky="true"]').first()).toBeAttached();
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
