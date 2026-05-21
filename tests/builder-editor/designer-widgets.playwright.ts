import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'designer-widgets';
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

test.describe('/ko/admin-builder designer widget pack', () => {
  test('adds professional designer blocks from the catalog', async ({ page }) => {
    const token = Date.now().toString(36);
    const slug = `g-editor-designer-${token}`;
    let pageId: string | null = null;

    try {
      pageId = await createBuilderPage(page.request, slug, `Designer Widgets ${token}`);
      await openBuilder(page, `/ko/admin-builder?pageId=${encodeURIComponent(pageId)}&designerWidgets=${token}`);
      await page.keyboard.press('Escape');

      const drawer = await openCatalogDrawer(page);
      await expect(drawer.getByText('Designer blocks pack')).toBeVisible();

      const presets = [
        'designer-proof-counter',
        'designer-testimonial-card',
        'designer-service-gradient-card',
        'designer-team-profile',
        'designer-pricing-table',
        'designer-timeline-roadmap',
        'designer-comparison-table',
      ];

      for (const preset of presets) {
        await drawer.locator(`[data-builder-designer-widget-preset="${preset}"]`).click();
      }

      for (const widget of [
        'counter',
        'testimonial-carousel',
        'service-feature-card',
        'team-member-card',
        'pricing-table',
        'timeline',
        'comparison-table',
      ]) {
        await expect(page.locator(`[data-builder-datadisplay-widget="${widget}"]`).first()).toBeAttached();
      }
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
