import { expect, test, type Page } from '@playwright/test';

const shortcutModifier = 'ControlOrMeta';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64',
);

interface UploadedAsset {
  filename: string;
  url: string;
}

interface AssetLibraryPayload {
  ok?: boolean;
  library?: {
    folders?: Array<{ id: string; name: string }>;
    tags?: string[];
    assetFolderByFilename?: Record<string, string>;
    assetTagsByFilename?: Record<string, string[]>;
  };
}

async function uploadAsset(page: Page, filename: string): Promise<UploadedAsset> {
  const response = await page.request.post('/api/builder/assets?locale=ko', {
    timeout: 60_000,
    multipart: {
      file: {
        name: filename,
        mimeType: 'image/png',
        buffer: tinyPng,
      },
    },
  });
  expect(response.status()).toBe(200);
  const payload = (await response.json()) as { ok?: boolean; asset?: UploadedAsset; error?: string };
  expect(payload.ok, payload.error).toBe(true);
  expect(payload.asset?.filename).toContain(filename.replace(/\.png$/, ''));
  return payload.asset!;
}

async function deleteAsset(page: Page, filename: string): Promise<void> {
  await page.request.delete('/api/builder/assets?locale=ko', {
    timeout: 30_000,
    data: { locale: 'ko', filename },
  });
}

async function imageNode(page: Page) {
  const node = page.locator('[data-node-id="home-hero-media-image"]:visible').first();
  await expect(node).toBeVisible();
  await node.scrollIntoViewIfNeeded();
  return node;
}

async function openImageContextMenu(page: Page) {
  const node = await imageNode(page);
  const openMenu = async () => node.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      button: 2,
      clientX: rect.left + Math.min(30, Math.max(10, rect.width / 2)),
      clientY: rect.top + Math.min(30, Math.max(10, rect.height / 2)),
    }));
  });

  await openMenu();
  const menu = page.locator('[role="menu"]').first();
  await expect(menu).toBeVisible();
  const replaceAction = menu.getByRole('menuitem', { name: /이미지 교체|Replace image/ });
  if (!(await replaceAction.isEnabled().catch(() => false))) {
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await openMenu();
    await expect(menu).toBeVisible();
  }
  await expect(replaceAction).toBeEnabled();
  return menu;
}

async function openImageEditDialog(page: Page, actionName: RegExp) {
  const menu = await openImageContextMenu(page);
  await menu.getByRole('menuitem', { name: actionName }).click();
  const dialog = page.getByRole('dialog', { name: 'Crop, filter, and alt text' });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function readAssetLibraryPayload(page: Page): Promise<AssetLibraryPayload> {
  const response = await page.request.get('/api/builder/assets?locale=ko&limit=24');
  expect(response.status()).toBe(200);
  return response.json() as Promise<AssetLibraryPayload>;
}

async function cleanupAssetLibraryToken(page: Page, token: string): Promise<void> {
  const payload = await readAssetLibraryPayload(page);
  const library = payload.library;
  if (!library) return;
  await page.request.patch('/api/builder/assets?locale=ko', {
    data: {
      locale: 'ko',
      library: {
        folders: (library.folders ?? []).filter((folder) => !folder.id.includes(token) && !folder.name.includes(token)),
        tags: (library.tags ?? []).filter((tag) => tag !== token),
        assetFolderByFilename: library.assetFolderByFilename ?? {},
        assetTagsByFilename: Object.fromEntries(
          Object.entries(library.assetTagsByFilename ?? {}).map(([filename, tags]) => [
            filename,
            tags.filter((tag) => tag !== token),
          ]),
        ),
      },
    },
  });
}

test.describe('/ko/admin-builder image asset workflow', () => {
  test('covers W22 asset organization/replacement and W23 Crop/Filter/Alt paths', async ({ page }) => {
    const token = `w22-${Date.now().toString(36)}`;
    const uploaded: UploadedAsset[] = [];
    let originalAlt = '';

    try {
      uploaded.push(await uploadAsset(page, `a-${token}.png`));
      uploaded.push(await uploadAsset(page, `z-${token}.png`));

      await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
      const node = await imageNode(page);
      const renderedImage = node.locator('img').first();
      originalAlt = (await renderedImage.getAttribute('alt')) ?? '';

      const replaceMenu = await openImageContextMenu(page);
      await replaceMenu.getByRole('menuitem', { name: /이미지 교체|Replace image/ }).click();
      let assetDialog = page.getByRole('dialog', { name: 'Asset library' });
      await expect(assetDialog).toBeVisible();
      await expect(assetDialog.getByText('Folders')).toBeVisible();
      await expect(assetDialog.getByText('All assets')).toBeVisible();
      await expect(assetDialog.getByText('Recent')).toBeVisible();

      await assetDialog.locator('input[placeholder="New folder"]').fill(`Case ${token}`);
      await assetDialog.getByRole('button', { name: 'Add' }).click();
      await expect(assetDialog.getByRole('button', { name: new RegExp(`Case ${token}`) })).toBeVisible();

      await assetDialog.locator('input[placeholder="New tag"]').fill(token);
      await assetDialog.getByRole('button', { name: 'Create' }).click();
      await expect(assetDialog.locator('[class*="assetTagBar"]').getByRole('button', { name: token, exact: true })).toBeVisible();
      await expect.poll(async () => {
        const payload = await readAssetLibraryPayload(page);
        return {
          hasFolder: payload.library?.folders?.some((folder) => folder.name === `Case ${token}`) ?? false,
          hasTag: payload.library?.tags?.includes(token) ?? false,
        };
      }).toEqual({ hasFolder: true, hasTag: true });
      await assetDialog.getByRole('button', { name: 'Close' }).click();
      await expect(assetDialog).not.toBeVisible();

      const persistedMenu = await openImageContextMenu(page);
      await persistedMenu.getByRole('menuitem', { name: /이미지 교체|Replace image/ }).click();
      assetDialog = page.getByRole('dialog', { name: 'Asset library' });
      await expect(assetDialog.getByRole('button', { name: new RegExp(`Case ${token}`) })).toBeVisible();
      await expect(assetDialog.locator('[class*="assetTagBar"]').getByRole('button', { name: token, exact: true })).toBeVisible();
      await assetDialog.getByRole('button', { name: /All assets/ }).click();
      await assetDialog.getByRole('button', { name: 'All tags' }).click();

      await assetDialog.getByRole('searchbox').fill(token);
      await assetDialog.locator('select').first().selectOption('name-asc');
      await expect(assetDialog.locator('[class*="assetMeta"] strong').first()).toContainText(`a-${token}`);
      await assetDialog.locator('select').first().selectOption('name-desc');
      await expect(assetDialog.locator('[class*="assetMeta"] strong').first()).toContainText(`z-${token}`);

      const selectedAsset = uploaded.find((asset) => asset.filename.startsWith(`z-${token}`)) ?? uploaded[1];
      await assetDialog
        .locator('article')
        .filter({ hasText: selectedAsset.filename })
        .getByRole('button', { name: 'Use image' })
        .click();
      await expect(renderedImage).toHaveAttribute('src', new RegExp(selectedAsset.filename));
      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expect(renderedImage).not.toHaveAttribute('src', new RegExp(selectedAsset.filename));

      const cropDialog = await openImageEditDialog(page, /Crop \/ Filter \/ Alt/);
      await expect(cropDialog.getByText('Aspect ratio')).toBeVisible();
      await cropDialog.getByRole('button', { name: '16:9' }).click();
      await cropDialog.getByRole('button', { name: 'Focal bottom-left' }).click();
      await cropDialog.getByRole('button', { name: 'Apply' }).click();
      await expect(renderedImage).toHaveAttribute('style', /object-position:\s*20%\s+80%/);

      const filterDialogAfterCrop = await openImageEditDialog(page, /Crop \/ Filter \/ Alt/);
      await expect(filterDialogAfterCrop.getByText('Aspect ratio')).toBeVisible();
      await expect(filterDialogAfterCrop.getByLabel('Focal point X')).toHaveValue('20');
      await expect(filterDialogAfterCrop.getByLabel('Focal point Y')).toHaveValue('80');
      await filterDialogAfterCrop.getByRole('button', { name: 'Close' }).click();

      const filterDialog = await openImageEditDialog(page, /Crop \/ Filter \/ Alt/);
      await filterDialog.getByRole('button', { name: 'filter' }).click();
      await filterDialog.getByRole('button', { name: 'B&W' }).click();
      await expect(filterDialog.locator('[class*="imageEditPreviewFrame"] img')).toHaveAttribute('style', /grayscale\(100%\)/);
      await filterDialog.getByRole('button', { name: 'Apply' }).click();
      await expect(renderedImage).toHaveAttribute('style', /grayscale\(100%\)/);

      await node.click({ position: { x: 18, y: 18 }, force: true });
      const inspector = page.locator('[class*="inspectorColumn"]').first();
      await expect(inspector).toBeVisible();
      await inspector.getByRole('button', { name: 'content' }).click();
      await inspector.getByRole('button', { name: 'Crop / Filter / Alt' }).click();
      const inspectorDialog = page.getByRole('dialog', { name: 'Crop, filter, and alt text' });
      await expect(inspectorDialog).toBeVisible();
      await inspectorDialog.getByRole('button', { name: 'filter' }).click();
      await expect(inspectorDialog.locator('[class*="imageEditPreviewFrame"] img')).toHaveAttribute('style', /grayscale\(100%\)/);
      await inspectorDialog.getByRole('button', { name: 'Close' }).click();

      const altDialog = await openImageEditDialog(page, /Alt 텍스트 편집/);
      const altTextarea = altDialog.getByPlaceholder('Describe the image for accessibility and SEO');
      await expect(altTextarea).toBeVisible();
      const nextAlt = `W23 alt ${token}`;
      await altTextarea.fill(nextAlt);
      await altDialog.getByRole('button', { name: 'Apply' }).click();
      await expect(renderedImage).toHaveAttribute('alt', nextAlt);

      const restoreDialog = await openImageEditDialog(page, /Alt 텍스트 편집/);
      await restoreDialog.getByPlaceholder('Describe the image for accessibility and SEO').fill(originalAlt);
      await restoreDialog.getByRole('button', { name: 'Apply' }).click();
      await expect(renderedImage).toHaveAttribute('alt', originalAlt);
    } finally {
      for (const asset of uploaded) {
        await deleteAsset(page, asset.filename);
      }
      await cleanupAssetLibraryToken(page, token);
    }
  });
});
