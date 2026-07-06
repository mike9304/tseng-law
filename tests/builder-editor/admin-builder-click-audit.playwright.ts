import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

function collectCriticalBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

async function expectNoTopBarOverlap(page: Page) {
  const result = await page.evaluate(() => {
    const controls = Array.from(document.querySelectorAll('header[class*="topBar"] a, header[class*="topBar"] button, header[class*="topBar"] select'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          label: (element.textContent || element.getAttribute('aria-label') || element.getAttribute('title') || '').trim(),
          right: rect.right,
          top: rect.top,
          width: rect.width,
        };
      })
      .filter((item) => item.width > 4 && item.height > 4 && item.bottom > 0);

    const overlaps: string[] = [];
    for (let index = 0; index < controls.length; index += 1) {
      const current = controls[index];
      if (!current) continue;
      for (let nextIndex = index + 1; nextIndex < controls.length; nextIndex += 1) {
        const next = controls[nextIndex];
        if (!next) continue;
        const overlapX = Math.max(0, Math.min(current.right, next.right) - Math.max(current.left, next.left));
        const overlapY = Math.max(0, Math.min(current.bottom, next.bottom) - Math.max(current.top, next.top));
        if (overlapX > 2 && overlapY > 2) overlaps.push(`${current.label} <> ${next.label}`);
      }
    }
    return { overlaps, sample: controls.slice(0, 16).map((item) => item.label) };
  });

  expect(result.overlaps, result.sample.join(' | ')).toEqual([]);
}

async function closeTopmostModal(page: Page) {
  const previewDialog = page.locator('[data-builder-preview-dialog="true"]');
  if (await previewDialog.isVisible().catch(() => false)) {
    await previewDialog.getByRole('button', { name: /닫기|Close/i }).click();
    await expect(previewDialog).toBeHidden();
    return;
  }

  const seoDialog = page.locator('[data-builder-seo-panel-dialog="true"]');
  if (await seoDialog.isVisible().catch(() => false)) {
    await seoDialog.getByRole('button', { name: /닫기|Close/i }).click();
    await expect(seoDialog).toBeHidden();
    return;
  }

  const topModal = page.locator('[data-modal-shell="true"]').last();
  if (await topModal.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    await expect(topModal).toBeHidden();
  }
}

test('/ko/admin-builder click audit opens core builder controls without console errors', async ({ page }) => {
  test.setTimeout(120_000);
  const browserErrors = collectCriticalBrowserErrors(page);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?clickAudit=${Date.now().toString(36)}`);
  await expectNoTopBarOverlap(page);

  const pageSelector = page.locator('[data-builder-topbar-page-selector="true"]');
  await expect(pageSelector).toBeVisible();
  await pageSelector.click();
  await expect(page.locator('[data-builder-drawer="pages"]')).toBeVisible();
  await expect(page.locator('[data-builder-page-row]').first()).toBeVisible();

  const railChecks: Array<{
    item: string;
    surface: string;
  }> = [
    { item: 'add', surface: '[data-builder-drawer="add"] [data-builder-add-card-kind]' },
    { item: 'design', surface: '[data-builder-drawer="design"] [data-builder-designer-audit="true"]' },
    { item: 'layers', surface: '[data-builder-drawer="layers"] [data-builder-layers-panel="true"]' },
    { item: 'nav', surface: '[data-builder-drawer="nav"] [data-builder-navigation-editor="true"]' },
    { item: 'history', surface: '[data-builder-drawer="history"] [data-builder-undo-timeline="true"]' },
  ];

  for (const check of railChecks) {
    const button = page.locator(`[data-builder-rail-item="${check.item}"]`);
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.locator(`[data-builder-drawer="${check.item}"]`)).toBeVisible();
    await expect(page.locator(check.surface).first()).toBeVisible();
  }

  await page.locator('[data-builder-rail-item="columns"]').click();
  await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
  await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
    timeout: 20_000,
  });
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  await page.locator('[data-builder-rail-item="columns"]').click();
  await expect(page.locator('[data-builder-drawer="columns"]')).toBeVisible();
  await expect(page.locator('[data-builder-drawer="columns"] [data-builder-columns-workflow="true"]')).toBeVisible();

  await page.locator('[data-builder-rail-item="layers"]').click();
  const layerSearch = page.locator('[data-builder-layer-search="true"]');
  await expect(layerSearch).toBeVisible();
  await layerSearch.fill('hero');
  await expect(page.locator('[data-builder-layer-row]').first()).toBeVisible();

  for (const viewport of ['tablet', 'mobile', 'desktop'] as const) {
    const button = page.locator(`[data-builder-topbar-viewport="${viewport}"]`);
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  }
  await expectNoTopBarOverlap(page);

  const memberPreview = page.locator('[data-builder-member-preview-mode="true"]');
  await expect(memberPreview).toBeVisible();
  await memberPreview.selectOption('premium');
  await expect(memberPreview).toHaveValue('premium');
  await memberPreview.selectOption('signed-out');
  await expect(memberPreview).toHaveValue('signed-out');

  await page.locator('[data-builder-admin-quickjump-open="true"]').click();
  const quickJumpModal = page.locator('[data-modal-shell="true"]').last();
  await expect(quickJumpModal).toBeVisible();
  await expect(quickJumpModal.locator('input[type="search"]')).toBeVisible();
  await quickJumpModal.locator('input[type="search"]').fill('seo');
  await expect(quickJumpModal.locator('button').first()).toBeVisible();
  await closeTopmostModal(page);

  await page.locator('[data-builder-prefs-button]').click();
  const shortcutMapButton = page.locator('[data-builder-shortcut-map-open="true"]');
  await expect(shortcutMapButton).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(shortcutMapButton).toBeHidden();

  await page.locator('[data-builder-prefs-button]').click();
  await expect(shortcutMapButton).toBeVisible();
  await shortcutMapButton.click();
  await expect(page.locator('[data-builder-keybindings-modal="true"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-builder-keybindings-modal="true"]')).toBeHidden();
  await page.locator('[data-builder-prefs-button]').click();

  await page.locator('[data-builder-prefs-button]').click();
  await expect(shortcutMapButton).toBeVisible();
  await page.getByRole('button', { name: /^Preview$|^미리보기$/ }).click();
  await expect(shortcutMapButton).toBeHidden();
  const previewDialog = page.locator('[data-builder-preview-dialog="true"]');
  await expect(previewDialog).toBeVisible();
  await previewDialog.getByRole('button', { name: /Mobile|모바일/ }).click();
  await expect(previewDialog.getByRole('button', { name: /Mobile|모바일/ })).toHaveAttribute('aria-pressed', 'true');
  await closeTopmostModal(page);

  await page.getByRole('button', { name: /^SEO$/ }).click();
  await expect(page.locator('[data-builder-seo-panel-dialog="true"]')).toBeVisible();
  await closeTopmostModal(page);

  await page.getByRole('button', { name: /^Publish$|^게시$|^발행$/ }).click();
  await expect(page.locator('[data-builder-publish-preflight-item]').first()).toBeVisible();
  await closeTopmostModal(page);

  await expect(page.locator('[data-editor-shell]')).toHaveAttribute('data-editor-ready', 'true');
  expect(browserErrors).toEqual([]);
});
