import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'm15-interactive-widgets';
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

test.describe('/ko/admin-builder interactive widget pack', () => {
  test('adds the M15 interactive widget presets from the catalog', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-m15-interactive-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `M15 Interactive ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&interactiveWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText('Interactive widget pack')).toBeVisible();

      const presets = [
        'interactive-countdown-card',
        'interactive-countdown-compact',
        'interactive-progress-bar',
        'interactive-progress-ring',
        'interactive-progress-segments',
        'interactive-rating-stars',
        'interactive-rating-hearts',
        'interactive-notification-bar-info',
        'interactive-notification-bar-warning',
        'interactive-back-to-top',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-interactive-widget-preset="${preset}"]`).click();
      }

      await expect(page.locator('[data-builder-interactive-widget="countdown"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-countdown-variant="card"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-countdown-variant="compact"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-progress-variant="bar"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-progress-variant="ring"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-progress-variant="segments"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-rating-variant="stars"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-rating-variant="hearts"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-interactive-widget="notification-bar"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-notification-tone="info"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-notification-tone="warning"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-interactive-widget="back-to-top"]').first()).toBeAttached();
      await expect(page.locator('[data-builder-back-to-top-placement="bottom-right"]').first()).toBeAttached();
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
