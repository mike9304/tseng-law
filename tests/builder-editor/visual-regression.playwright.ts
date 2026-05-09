import { expect, test } from '@playwright/test';
import {
  editorShell,
  openAssetLibrary,
  openBuilder,
  openCatalogDrawer,
  openPreviewModalMobile,
  openSiteSettings,
  selectTextNode,
} from './helpers/editor';

test.describe('/ko/admin-builder visual baselines', () => {
  test('captures Wix-like editor states', async ({ page }) => {
    test.setTimeout(120_000);
    await openBuilder(page);
    await expect(await editorShell(page)).toHaveScreenshot('admin-builder-first-screen.png');

    await openCatalogDrawer(page);
    await expect(await editorShell(page)).toHaveScreenshot('admin-builder-catalog-drawer.png');

    await page.keyboard.press('Escape');
    await selectTextNode(page);
    await expect(await editorShell(page)).toHaveScreenshot('admin-builder-text-inspector.png');

    const previewModal = await openPreviewModalMobile(page);
    await expect(previewModal).toHaveScreenshot('admin-builder-preview-mobile.png');
    await previewModal.getByRole('button', { name: '미리보기 닫기' }).click();
    await expect(previewModal).toBeHidden();

    const settingsModal = await openSiteSettings(page);
    await expect(settingsModal).toHaveScreenshot('admin-builder-site-settings.png');
    await settingsModal.getByRole('button', { name: 'Close' }).click();
    await expect(settingsModal).toBeHidden();

    const assetDialog = await openAssetLibrary(page);
    await expect(assetDialog).toHaveScreenshot('admin-builder-asset-library.png');
  });
});
