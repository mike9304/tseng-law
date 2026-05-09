import { expect, type Locator, type Page } from '@playwright/test';

export async function openBuilder(page: Page, path = '/ko/admin-builder'): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await stabilizeEditorVisuals(page);
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible();
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
}

export async function stabilizeEditorVisuals(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
        caret-color: transparent !important;
      }
      iframe { visibility: hidden !important; }
      [class*="savingSpinner"] { display: none !important; }
    `,
  }).catch(() => undefined);
}

export async function editorShell(page: Page): Promise<Locator> {
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible();
  return shell;
}

export async function selectTextNode(page: Page): Promise<Locator> {
  const candidates = [
    '[data-node-id="home-hero-title"]',
    '[data-node-id="home-hero-subtitle"]',
    '[data-node-id*="title"]',
    '[data-node-id*="subtitle"]',
    '[data-node-id]:visible',
  ];
  for (const selector of candidates) {
    const node = page.locator(selector).first();
    if ((await node.count()) === 0) continue;
    if (!(await node.isVisible().catch(() => false))) continue;
    await node.scrollIntoViewIfNeeded().catch(() => undefined);
    await node.click({ position: { x: 16, y: 16 }, force: true });
    return node;
  }
  throw new Error('No selectable builder node found.');
}

export async function openCatalogDrawer(page: Page): Promise<Locator> {
  await page.getByTitle('Add').click();
  const drawer = page.locator('aside[aria-hidden="false"]').first();
  await expect(drawer.getByText('Catalog')).toBeVisible();
  return drawer;
}

export async function openSiteSettings(page: Page): Promise<Locator> {
  await page.locator('header[class*="topBar"]').getByTitle('사이트 설정').click();
  const modal = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('사이트 설정');
  return modal;
}

export async function openPreviewModalMobile(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: 'Preview' }).click();
  const modal = page.getByRole('dialog', { name: '페이지 미리보기' });
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: /Mobile/ }).click();
  await expect(modal.getByRole('button', { name: /Mobile/ })).toHaveAttribute('aria-pressed', 'true');
  return modal;
}

export async function openAssetLibrary(page: Page): Promise<Locator> {
  const image = page.locator('[data-node-id="home-hero-media-image"]:visible').first();
  await expect(image).toBeVisible();
  await image.click({ position: { x: 20, y: 20 }, force: true });
  await image.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    element.dispatchEvent(new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      button: 2,
      clientX: rect.left + Math.min(32, Math.max(10, rect.width / 2)),
      clientY: rect.top + Math.min(32, Math.max(10, rect.height / 2)),
    }));
  });
  const menu = page.getByRole('menu').last();
  await expect(menu).toBeVisible();
  await menu.getByRole('menuitem', { name: /이미지 교체|Replace image/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Asset library' });
  await expect(dialog).toBeVisible();
  return dialog;
}
