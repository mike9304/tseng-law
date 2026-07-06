import { expect, type Locator, type Page } from '@playwright/test';

export async function openBuilder(page: Page, path = '/ko/admin-builder'): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await waitForEditorReady(page);
  // Standard pages (including home) are seeded as live-mirroring `composite`
  // nodes so the editor opens as an exact mirror of the shipped site. Element-
  // level editing requires the decomposed node tree produced by the in-app
  // "decompose to edit" action (PageSwitcher → /api/builder/site/pages/decompose,
  // STANDARD_PAGE_DECOMPOSERS). When a test opens the home editor and finds it
  // still composite (a section node is present but its child nodes are not),
  // trigger the same decompose API and reload so the editable tree is available.
  // Idempotent and self-limiting: it only fires when home is composite, so it is
  // a no-op for already-decomposed home and for non-home editor routes.
  if (await homeNeedsDecompose(page)) {
    const locale = path.match(/\/(ko|zh-hant|en)\//)?.[1] ?? 'ko';
    await page.request
      .post(`/api/builder/site/pages/decompose?locale=${locale}`, {
        headers: { 'Content-Type': 'application/json' },
        data: { slug: '', locale },
      })
      .catch(() => undefined);
    await page.goto(withDecomposedHomeFlag(page.url()), { waitUntil: 'domcontentloaded' });
    await waitForEditorReady(page);
  }
  await waitForHomeHeroImage(page);
}

function withDecomposedHomeFlag(path: string): string {
  const isAbsolute = /^https?:\/\//.test(path);
  const url = new URL(path, 'http://builder.local');
  url.searchParams.set('decomposedHome', '1');
  return isAbsolute ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
}

async function waitForEditorReady(page: Page): Promise<void> {
  await stabilizeEditorVisuals(page);
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
  const shell = page.locator('[data-editor-shell]').first();
  await expect(shell).toBeVisible();
  await expect(shell).toHaveAttribute('data-editor-ready', 'true', { timeout: 30_000 });
}

async function homeNeedsDecompose(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const hasSection = !!document.querySelector('[data-node-id="home-hero"]');
    const hasChild = !!document.querySelector(
      '[data-node-id="home-hero-title"], [data-node-id="home-hero-root"]',
    );
    return hasSection && !hasChild;
  });
}

export async function stabilizeEditorVisuals(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        /* NOTE: do NOT zero animation-delay. Zeroing it collapses delayed
           out-animations that use 'forwards' fill (e.g. the activity/save chip's
           saveChipOut, '... 1.42s forwards' ending in visibility:hidden), making
           those elements mount already-hidden and breaking toBeVisible() — a test
           artifact, not a builder bug. Production reduced-motion only reduces
           duration (globals.css), never the delay, so real users still see them. */
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
  await page.locator('[data-builder-rail-item="add"]').click();
  const drawer = page.locator('aside[aria-hidden="false"]').first();
  await expect(drawer.getByRole('searchbox', { name: /Search add elements|추가 요소 검색|搜尋新增元素/ })).toBeVisible();
  return drawer;
}

export async function openSiteSettings(page: Page): Promise<Locator> {
  await page.locator('header[class*="topBar"]').getByTitle('사이트 설정').click();
  const modal = page.locator('[data-modal-shell="true"][data-modal-nested="false"]').last();
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('사이트 설정');
  await expect(modal.getByText('기본 정보')).toBeVisible();
  await expect(modal.getByPlaceholder('예: 호정국제법률사무소')).toBeVisible();
  return modal;
}

export async function openPreviewModalMobile(page: Page): Promise<Locator> {
  await page.getByRole('button', { name: /^Preview$|^미리보기$/ }).click();
  const modal = page.getByRole('dialog', { name: '페이지 미리보기' });
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: /Mobile|모바일/ }).click();
  await expect(modal.getByRole('button', { name: /Mobile|모바일/ })).toHaveAttribute('aria-pressed', 'true');
  return modal;
}

export async function openAssetLibrary(page: Page): Promise<Locator> {
  const locale = page.url().match(/\/(ko|zh-hant)\//)?.[1] ?? 'en';
  const dialogName = locale === 'ko' ? '자산 라이브러리' : locale === 'zh-hant' ? '素材庫' : 'Asset library';
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
  // The menuitem handler runs setContextMenu(null) + opens the asset-library
  // modal in the same render tick. Playwright's click action retries after
  // dispatch and now sees the modal overlay covering the (just-unmounted)
  // menuitem, so it never returns success. Use dispatchEvent('click') to
  // skip the post-action retry loop — the React handler still fires from
  // the dispatched event, and dialog visibility is asserted next.
  await menu.getByRole('menuitem', { name: /이미지 교체|圖片替換|Replace image/ })
    .dispatchEvent('click');
  const dialog = page.getByRole('dialog', { name: dialogName });
  await expect(dialog).toBeVisible();
  return dialog;
}

async function waitForHomeHeroImage(page: Page): Promise<void> {
  const image = page.locator('[data-node-id="home-hero-media-image"]:visible').first();
  if ((await image.count()) === 0) return;
  await expect(image).toBeVisible({ timeout: 30_000 });
  // Stabilization only — a broken hero src (e.g. an earlier test deleted the
  // asset it points at) must not cascade into every later test in the worker.
  await page.waitForFunction(() => {
    const node = document.querySelector('[data-node-id="home-hero-media-image"]');
    if (!node) return false;
    const img = node.querySelector('img');
    if (img && img instanceof HTMLImageElement) {
      return img.complete && img.naturalWidth > 0;
    }
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }, undefined, { timeout: 10_000 }).catch(() => undefined);
}
