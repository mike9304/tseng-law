import { expect, test } from '@playwright/test';
import { checkBuilderA11y } from './helpers/a11y';
import { openBuilder, openCatalogDrawer, openSiteSettings, selectTextNode } from './helpers/editor';

test.describe('/ko/admin-builder axe coverage', () => {
  test('has no WCAG 2.1 AA violations in core editor states', async ({ page }) => {
    test.setTimeout(90_000);
    await openBuilder(page);
    await selectTextNode(page);
    await checkBuilderA11y(page);

    await openCatalogDrawer(page);
    await checkBuilderA11y(page, 'body');

    await page.keyboard.press('Escape');
    const settings = await openSiteSettings(page);
    await expect(settings).toBeVisible();
    await checkBuilderA11y(page, 'body');
  });
});
