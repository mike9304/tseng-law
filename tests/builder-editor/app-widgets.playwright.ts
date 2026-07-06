import { expect, test, type APIRequestContext } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

const LOCALE = 'ko';
const APP_ID = 'site-search';
const WIDGET_ID = 'app:site-search:search-box';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'app-widgets';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

async function installApp(request: APIRequestContext, scope: string) {
  const response = await request.post(`/api/builder/apps/installations?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { appId: APP_ID },
  });
  expect([200, 201]).toContain(response.status());
}

async function disableApp(request: APIRequestContext, scope: string) {
  const response = await request.patch(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    data: { status: 'disabled' },
  });
  expect([200, 404]).toContain(response.status());
}

async function uninstallIfPresent(request: APIRequestContext, scope: string) {
  await request.delete(`/api/builder/apps/installations/${APP_ID}?locale=${LOCALE}`, {
    headers: mutationHeaders(scope),
    failOnStatusCode: false,
  });
}

test('enabled app widgets appear in the add panel and quick-add to the canvas', async ({ page }) => {
  const token = Date.now().toString(36);
  await uninstallIfPresent(page.request, `app-widget-cleanup-before-${token}`);

  try {
    await installApp(page.request, `app-widget-install-${token}`);
    await openBuilder(page, `/${LOCALE}/admin-builder?appWidget=${token}`);

    let drawer = await openCatalogDrawer(page);
    await expect(drawer.locator('[data-builder-app-widget-section="true"]')).toBeVisible();
    await expect(drawer.locator('[data-builder-app-widget-count="true"]')).toContainText(/1 widgets|위젯 1개/);

    await drawer.getByLabel(/Search add elements|추가 요소 검색/).fill('search');
    const card = drawer.locator(`[data-builder-app-widget-card="${WIDGET_ID}"]`);
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('data-builder-app-widget-kind', 'site-search');

    await card.locator(`[data-builder-app-widget-add="${WIDGET_ID}"]`).click();
    await expect(page.locator('[data-node-id^="site-search-"]')).toBeVisible();
    await expect(page.locator('[data-builder-site-search="true"]')).toBeVisible();

    await disableApp(page.request, `app-widget-disable-${token}`);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await openBuilder(page, `/${LOCALE}/admin-builder?appWidget=${token}&disabled=1`);
    drawer = await openCatalogDrawer(page);
    await drawer.getByLabel(/Search add elements|추가 요소 검색/).fill('search');
    await expect(drawer.locator(`[data-builder-app-widget-card="${WIDGET_ID}"]`)).toHaveCount(0);
  } finally {
    await uninstallIfPresent(page.request, `app-widget-cleanup-after-${token}`);
  }
});
