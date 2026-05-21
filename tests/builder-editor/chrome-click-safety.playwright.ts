import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test.describe('/ko/admin-builder public chrome click safety', () => {
  test('does not let rail labels or public header nav overlap open drawer panels', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const pagesButton = rail.getByRole('button', { name: 'Pages', exact: true });
    const pagesLabel = pagesButton.locator('[class*="railButtonLabel"]').first();
    await pagesButton.hover();
    await expect(pagesLabel).toHaveCSS('opacity', '1');

    await pagesButton.click();
    const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first();
    await expect(pagesDrawer).toBeVisible();
    await expect(pagesLabel).toBeHidden();

    const pagesChrome = await page.evaluate(() => {
      const drawer = document.querySelector('aside[aria-hidden="false"]')?.getBoundingClientRect();
      const mainNav = document.querySelector('.builder-site-header .main-nav');
      const mobileToggle = document.querySelector('.builder-site-header .mobile-toggle');
      const visibleNavLinks = Array.from(document.querySelectorAll<HTMLElement>('.builder-site-header .nav-link'))
        .filter((node) => node.offsetParent !== null)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return { text: node.textContent?.trim() ?? '', left: rect.left, right: rect.right };
        });
      const overlappingLinks = drawer
        ? visibleNavLinks.filter((link) => link.left < drawer.right && link.right > drawer.left)
        : visibleNavLinks;
      return {
        mainNavDisplay: mainNav ? window.getComputedStyle(mainNav).display : '',
        mobileToggleDisplay: mobileToggle ? window.getComputedStyle(mobileToggle).display : '',
        overlappingLinks,
      };
    });
    expect(pagesChrome.mainNavDisplay).toBe('none');
    expect(pagesChrome.mobileToggleDisplay).not.toBe('none');
    expect(pagesChrome.overlappingLinks).toEqual([]);

    await rail.getByRole('button', { name: 'Navigation', exact: true }).click();
    const navDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Navigation' }).first();
    await expect(navDrawer).toBeVisible();

    const navChrome = await page.evaluate(() => {
      const drawer = document.querySelector('aside[aria-hidden="false"]')?.getBoundingClientRect();
      const labels = Array.from(document.querySelectorAll<HTMLElement>('[class*="railButtonLabel"]'))
        .map((node) => window.getComputedStyle(node).display);
      const visibleNavLinks = Array.from(document.querySelectorAll<HTMLElement>('.builder-site-header .nav-link'))
        .filter((node) => node.offsetParent !== null)
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return { text: node.textContent?.trim() ?? '', left: rect.left, right: rect.right };
        });
      const overlappingLinks = drawer
        ? visibleNavLinks.filter((link) => link.left < drawer.right && link.right > drawer.left)
        : visibleNavLinks;
      return { labels, overlappingLinks };
    });
    expect(navChrome.labels.every((display) => display === 'none')).toBe(true);
    expect(navChrome.overlappingLinks).toEqual([]);
  });

  test('keeps the canvas header menu expanded while side drawers are open when there is room', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await openBuilder(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first()).toBeVisible();
    await expectExpandedHeader(page);

    await rail.getByRole('button', { name: 'Navigation', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Navigation' }).first()).toBeVisible();
    await expectExpandedHeader(page);
  });

  test('opens the canvas mobile menu without leaving it under an editor side drawer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first()).toBeVisible();
    await expectCompactHeader(page);

    const mobileToggle = page.locator('.builder-site-header .mobile-toggle').first();
    await expect(mobileToggle).toBeVisible();
    await mobileToggle.click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open').first()).toBeVisible();

    const mobileMenuChrome = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLElement>('[class*="canvasColumn"]')?.getBoundingClientRect();
      const headerRegion = document.querySelector<HTMLElement>('[class*="globalHeaderRegion"]')?.getBoundingClientRect();
      const drawer = document.querySelector<HTMLElement>('.builder-site-header .site-mobile-nav-drawer.open')?.getBoundingClientRect();
      const panel = document.querySelector<HTMLElement>('.builder-site-header .site-mobile-nav-panel')?.getBoundingClientRect();
      const editorDrawer = document.querySelector<HTMLElement>('aside[aria-hidden="false"]')?.getBoundingClientRect();
      const inspector = document.querySelector<HTMLElement>('[class*="inspectorColumn"]')?.getBoundingClientRect();
      const rail = document.querySelector<HTMLElement>('[class*="iconRail"]')?.getBoundingClientRect();
      const headerBadge = document.querySelector<HTMLElement>('[class*="globalRegionBadge"]');
      const panelCenterX = panel ? panel.left + (panel.width / 2) : 0;
      const panelCenterY = panel ? panel.top + Math.min(96, panel.height / 2) : 0;
      const stackedAtPanelCenter = panel
        ? document.elementsFromPoint(panelCenterX, panelCenterY)
        : [];
      const panelStackIndex = stackedAtPanelCenter.findIndex((node) => (
        node instanceof HTMLElement && node.classList.contains('site-mobile-nav-panel')
      ));
      const editorDrawerStackIndex = stackedAtPanelCenter.findIndex((node) => (
        node instanceof HTMLElement && Boolean(node.closest('aside[aria-hidden="false"]'))
      ));

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        canvas: canvas ? { left: canvas.left, right: canvas.right, top: canvas.top } : null,
        headerRegion: headerRegion ? { left: headerRegion.left, right: headerRegion.right, top: headerRegion.top, bottom: headerRegion.bottom } : null,
        drawer: drawer ? { left: drawer.left, right: drawer.right, top: drawer.top, bottom: drawer.bottom } : null,
        panel: panel ? { left: panel.left, right: panel.right, top: panel.top, bottom: panel.bottom } : null,
        editorDrawer: editorDrawer ? { left: editorDrawer.left, right: editorDrawer.right } : null,
        inspector: inspector ? { left: inspector.left, right: inspector.right } : null,
        rail: rail ? { left: rail.left, right: rail.right } : null,
        headerBadge: headerBadge
          ? {
              opacity: window.getComputedStyle(headerBadge).opacity,
              pointerEvents: window.getComputedStyle(headerBadge).pointerEvents,
            }
          : null,
        panelCenterTopBelongsToPanel: stackedAtPanelCenter[0] instanceof HTMLElement
          ? Boolean(stackedAtPanelCenter[0].closest('.site-mobile-nav-panel'))
          : false,
        editorDrawerAbovePanel: editorDrawerStackIndex >= 0
          && panelStackIndex >= 0
          && editorDrawerStackIndex < panelStackIndex,
      };
    });

    expect(mobileMenuChrome.canvas).not.toBeNull();
    expect(mobileMenuChrome.headerRegion).not.toBeNull();
    expect(mobileMenuChrome.drawer).not.toBeNull();
    expect(mobileMenuChrome.panel).not.toBeNull();
    expect(mobileMenuChrome.editorDrawer).toBeNull();
    expect(mobileMenuChrome.headerBadge).not.toBeNull();
    if (!mobileMenuChrome.canvas || !mobileMenuChrome.headerRegion || !mobileMenuChrome.drawer || !mobileMenuChrome.panel) return;
    expect(mobileMenuChrome.drawer.left).toBeGreaterThanOrEqual(mobileMenuChrome.headerRegion.left - 1);
    expect(mobileMenuChrome.drawer.right).toBeLessThanOrEqual(mobileMenuChrome.headerRegion.right + 1);
    expect(mobileMenuChrome.drawer.top).toBeGreaterThanOrEqual(mobileMenuChrome.headerRegion.bottom - 1);
    expect(mobileMenuChrome.panel.left).toBeGreaterThanOrEqual(mobileMenuChrome.headerRegion.left + 7);
    expect(mobileMenuChrome.panel.right).toBeLessThanOrEqual(mobileMenuChrome.headerRegion.right - 7 + 1);
    if (mobileMenuChrome.inspector) {
      expect(mobileMenuChrome.panel.right).toBeLessThanOrEqual(mobileMenuChrome.inspector.left + 1);
    }
    if (mobileMenuChrome.rail) {
      expect(mobileMenuChrome.panel.left).toBeGreaterThanOrEqual(mobileMenuChrome.rail.right + 1);
    }
    expect(mobileMenuChrome.panelCenterTopBelongsToPanel).toBe(true);
    expect(mobileMenuChrome.editorDrawerAbovePanel).toBe(false);
    expect(mobileMenuChrome.headerBadge?.opacity).toBe('0');
    expect(mobileMenuChrome.headerBadge?.pointerEvents).toBe('none');
  });

  test('lets compact header mobile menu links switch builder pages after a side drawer was open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?mobileHeaderNavigate=columns');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first()).toBeVisible();
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();

    await mobileDrawer.locator('a[href="/ko/columns"]').first().click();
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('moves from the columns panel to the real columns builder page', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?columnsPanelNavigate=1');

    await page.locator('[data-builder-rail-item="columns"]').click();
    const columnsDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '글쓰기' }).first();
    await expect(columnsDrawer).toBeVisible();

    await page.locator('[data-builder-open-columns-page="true"]').click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('uses the columns rail item as a direct page shortcut while keeping writing tools available', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?columnsRailShortcut=1');

    await page.locator('[data-builder-rail-item="columns"]').click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: '글쓰기' }).first()).toBeVisible();
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('moves from the Pages drawer column shortcut to the real columns builder page', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?pagesColumnShortcut=1');

    await page.locator('[data-builder-rail-item="pages"]').click();
    const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first();
    await expect(pagesDrawer).toBeVisible();

    await pagesDrawer.getByRole('button', { name: '칼럼 페이지로 이동' }).click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('keeps top toolbar controls separated when side drawers are open', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page);

    await expectStableTopToolbar(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first()).toBeVisible();
    await expectStableTopToolbar(page);

    await rail.getByRole('button', { name: 'Navigation', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Navigation' }).first()).toBeVisible();
    await expectStableTopToolbar(page);
  });

  test('keeps top toolbar inside narrow editor widths', async ({ page }) => {
    const sizes = [
      { width: 768, height: 900 },
      { width: 390, height: 900 },
    ];

    for (const size of sizes) {
      await page.setViewportSize(size);
      await openBuilder(page, `/ko/admin-builder?topbarNarrow=${size.width}`);

      const rail = page.locator('[class*="iconRail"]').first();
      await rail.getByRole('button', { name: 'Pages', exact: true }).click();
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first()).toBeVisible();
      await expectStableTopToolbar(page);

      await rail.getByRole('button', { name: 'Navigation', exact: true }).click();
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Navigation' }).first()).toBeVisible();
      await expectStableTopToolbar(page);
    }
  });

  test('keeps header locale links and footer links inside the editor shell', async ({ page }) => {
    await openBuilder(page);
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const header = page.locator('.builder-site-header').first();
    await expect(header).toBeVisible();
    await header.locator('.utility-lang').getByRole('link', { name: 'EN' }).click();
    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(canvas).toBeVisible();

    const siteFooter = page.locator('footer:not([aria-label="Editor status"])').first();
    await expect(siteFooter).toBeVisible();
    await siteFooter.scrollIntoViewIfNeeded();
    const footerLink = siteFooter.locator('a[href^="/ko/"]').first();
    await expect(footerLink).toBeVisible();
    await footerLink.click({ force: true });
    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(canvas).toBeVisible();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Navigation' }).first()).toBeVisible();
  });

  test('lets simple public header links switch builder pages', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await openBuilder(page, '/ko/admin-builder?headerNavigate=columns');

    const columnsLink = page.locator('.builder-site-header .nav-link[href="/ko/columns"]').first();
    await expect(columnsLink).toBeVisible();
    await columnsLink.click();

    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('closes open side drawers when expanded public header links switch pages', async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await openBuilder(page, '/ko/admin-builder?headerNavigateWithDrawer=columns');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: 'Pages', exact: true }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: 'Pages' }).first()).toBeVisible();
    await expectExpandedHeader(page);

    const columnsLink = page.locator('.builder-site-header .nav-link[href="/ko/columns"]').first();
    await expect(columnsLink).toBeVisible();
    await columnsLink.click();

    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });
});

async function expectCompactHeader(page: Page): Promise<void> {
  const chrome = await page.evaluate(() => {
    const mainNav = document.querySelector('.builder-site-header .main-nav');
    const mobileToggle = document.querySelector('.builder-site-header .mobile-toggle');
    const visibleNavLinks = Array.from(document.querySelectorAll<HTMLElement>('.builder-site-header .nav-link'))
      .filter((node) => node.offsetParent !== null)
      .map((node) => node.textContent?.trim() ?? '');
    return {
      mainNavDisplay: mainNav ? window.getComputedStyle(mainNav).display : '',
      mobileToggleDisplay: mobileToggle ? window.getComputedStyle(mobileToggle).display : '',
      visibleNavLinks,
    };
  });
  expect(chrome.mainNavDisplay).toBe('none');
  expect(chrome.mobileToggleDisplay).not.toBe('none');
  expect(chrome.visibleNavLinks).toEqual([]);
}

async function expectExpandedHeader(page: Page): Promise<void> {
  const chrome = await page.evaluate(() => {
    const header = document.querySelector('.builder-site-header');
    const mainNav = document.querySelector('.builder-site-header .main-nav');
    const mobileToggle = document.querySelector('.builder-site-header .mobile-toggle');
    const visibleNavLinks = Array.from(document.querySelectorAll<HTMLElement>('.builder-site-header .nav-link'))
      .filter((node) => node.offsetParent !== null)
      .map((node) => node.textContent?.trim() ?? '');
    return {
      forced: header?.classList.contains('mobile-nav-forced') ?? false,
      mainNavDisplay: mainNav ? window.getComputedStyle(mainNav).display : '',
      mobileToggleDisplay: mobileToggle ? window.getComputedStyle(mobileToggle).display : '',
      visibleNavLinks,
    };
  });
  expect(chrome.forced).toBe(false);
  expect(chrome.mainNavDisplay).not.toBe('none');
  expect(chrome.mobileToggleDisplay).toBe('none');
  expect(chrome.visibleNavLinks.length).toBeGreaterThan(0);
}

type TopToolbarSnapshot =
  | { present: false }
  | {
      present: true;
      height: number;
      clientWidth: number;
      scrollWidth: number;
      overlaps: string[];
      outOfBounds: string[];
      groups: Array<{
        text: string;
        left: number;
        right: number;
        top: number;
        bottom: number;
        width: number;
        height: number;
      }>;
    };

async function expectStableTopToolbar(page: Page): Promise<void> {
  const chrome = await page.evaluate<TopToolbarSnapshot>(() => {
    const topBar = document.querySelector<HTMLElement>('header[class*="topBar"]');
    if (!topBar) return { present: false };

    const topBarRect = topBar.getBoundingClientRect();
    const groups = Array.from(topBar.children).map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        text: node.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ?? '',
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    });

    const overlaps: string[] = [];
    for (let i = 0; i < groups.length; i += 1) {
      for (let j = i + 1; j < groups.length; j += 1) {
        const a = groups[i];
        const b = groups[j];
        const horizontallyOverlaps = a.left < b.right && b.left < a.right;
        const verticallyOverlaps = a.top < b.bottom && b.top < a.bottom;
        if (horizontallyOverlaps && verticallyOverlaps) {
          overlaps.push(`${a.text || `group-${i}`} overlaps ${b.text || `group-${j}`}`);
        }
      }
    }

    const outOfBounds = groups
      .filter((group) => group.top < topBarRect.top - 0.5 || group.bottom > topBarRect.bottom + 0.5)
      .map((group) => group.text);

    return {
      present: true,
      height: topBarRect.height,
      clientWidth: topBar.clientWidth,
      scrollWidth: topBar.scrollWidth,
      overlaps,
      outOfBounds,
      groups,
    };
  });

  expect(chrome.present).toBe(true);
  if (!chrome.present) return;
  expect(chrome.height).toBeGreaterThanOrEqual(52);
  expect(chrome.scrollWidth).toBeLessThanOrEqual(chrome.clientWidth + 1);
  expect(chrome.overlaps).toEqual([]);
  expect(chrome.outOfBounds).toEqual([]);
}
