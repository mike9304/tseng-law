import { expect, test } from '@playwright/test';
import { checkBuilderA11y } from './helpers/a11y';
import { openBuilder, openCatalogDrawer, selectTextNode } from './helpers/editor';

test.describe('zh-hant builder smoke', () => {
  test('loads Traditional Chinese editor and public columns surfaces', async ({ page }) => {
    test.setTimeout(90_000);
    await openBuilder(page, '/zh-hant/admin-builder');
    await selectTextNode(page);
    await expect(page.locator('[data-editor-shell]')).toBeVisible();
    await expect(page.locator('body')).toContainText(/Ho|Tseng|曾|호정|首頁|Home|Catalog/);

    const drawer = await openCatalogDrawer(page);
    await expect(drawer).toContainText(/Catalog|基本|Basic|文字|Text/);
    await checkBuilderA11y(page, 'body');

    const columnsResponse = await page.goto('/zh-hant/columns', { waitUntil: 'domcontentloaded' });
    expect(columnsResponse?.status()).toBeLessThan(400);
    await expect(page.locator('body')).toContainText(/台灣|公司|法律|칼럼|Columns/);
  });
});
