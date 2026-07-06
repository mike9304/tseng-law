import { expect, test, type Page } from '@playwright/test';
import { getImageEditCopy } from '@/lib/builder/components/image/image-edit-copy';

async function imageNode(page: Page) {
  const node = page.locator('[data-node-id="home-hero-media-image"]:visible').first();
  await expect(node).toBeVisible();
  await node.scrollIntoViewIfNeeded();
  return node;
}

async function selectImageLayer(page: Page): Promise<void> {
  const layersPanel = page.locator('[data-builder-layers-panel="true"]');
  if (!(await layersPanel.isVisible().catch(() => false))) {
    await page.getByRole('button', { name: /Layers|레이어|圖層/ }).click();
    await expect(layersPanel).toBeVisible();
  }
  await page.locator('[data-builder-layer-search="true"]').fill('home-hero-media-image');
  await page.locator('[data-builder-layer-row="home-hero-media-image"]').click();
  await expect(page.locator('[data-node-id="home-hero-media-image"][data-selected="true"]')).toBeVisible();
}

for (const locale of ['ko', 'zh-hant'] as const) {
  test.describe(`/${locale}/admin-builder image shell`, () => {
    test('localizes the image inspector and edit dialog shell', async ({ page }) => {
      const copy = getImageEditCopy(locale);
      await page.goto(`/${locale}/admin-builder`, { waitUntil: 'commit' }).catch(() => undefined);
      await expect(page.locator('[data-editor-shell]')).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });

      await imageNode(page);
      await selectImageLayer(page);

      const inspector = page.locator('[class*="inspectorColumn"]').first();
      await expect(inspector).toBeVisible();
      await inspector.getByRole('button', { name: /content|콘텐츠|內容/ }).click();
      await expect(inspector.getByRole('button', { name: copy.inspector.openImageEditor })).toBeVisible();
      await inspector.getByRole('button', { name: copy.inspector.openImageEditor }).click();

      const dialog = page.getByRole('dialog', { name: copy.dialog.ariaLabel });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: copy.dialog.close })).toBeVisible();
      await expect(dialog.getByRole('button', { name: copy.dialog.tabs.crop })).toBeVisible();
      await expect(dialog.getByRole('button', { name: copy.dialog.tabs.filter })).toBeVisible();
      await expect(dialog.getByRole('button', { name: copy.dialog.tabs.alt })).toBeVisible();
      await dialog.getByRole('button', { name: copy.dialog.tabs.alt }).click();
      await expect(dialog.getByPlaceholder(copy.dialog.alt.placeholder)).toBeVisible();
      await dialog.getByRole('button', { name: copy.dialog.ai.cancel }).click();
      await expect(dialog).toBeHidden();
    });
  });
}
