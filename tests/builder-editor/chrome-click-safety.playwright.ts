import { inflateSync } from 'node:zlib';
import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type PngImage = {
  width: number;
  height: number;
  channels: 3 | 4;
  data: Uint8Array;
};

type TestNavigationItem = {
  id: string;
  label: string | Record<string, string>;
  href: string;
  pageId?: string;
  children?: TestNavigationItem[];
};

type TestPageMeta = {
  pageId?: string;
  slug?: string;
  memberAccess?: {
    requireLogin?: boolean;
    allowedRoles?: string[];
    redirectPath?: string;
  };
};

type TestDraftNode = {
  kind?: string;
  content?: {
    text?: string;
    label?: string;
    nextPath?: string;
    showSignup?: boolean;
    profileHref?: string;
    bookingsHref?: string;
    loginHref?: string;
    nameLabel?: string;
    phoneLabel?: string;
    saveLabel?: string;
    upcomingLabel?: string;
    pastLabel?: string;
    showPast?: boolean;
    showBookings?: boolean;
    showPremium?: boolean;
  };
};

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'chrome-click-safety';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function builderAuthHeaders(): Record<string, string> {
  const username = process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin';
  const password = process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!';
  return {
    authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
  };
}

let builderApiRequestSequence = 0;

function builderApiHeaders(scope: string): Record<string, string> {
  builderApiRequestSequence += 1;
  return {
    ...builderAuthHeaders(),
    ...mutationHeaders(`${scope}-${builderApiRequestSequence}`),
  };
}

async function navigationFromApi(page: Page): Promise<TestNavigationItem[]> {
  const response = await page.request.get(`/api/builder/site/navigation?locale=ko&_=${Date.now()}`, {
    headers: builderApiHeaders('chrome-click-navigation-read'),
  });
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { navigation?: TestNavigationItem[] };
  return payload.navigation ?? [];
}

async function pageIdBySlug(page: Page, slug: string): Promise<string | null> {
  return (await pageMetaBySlug(page, slug))?.pageId ?? null;
}

async function pageMetaBySlug(page: Page, slug: string): Promise<TestPageMeta | null> {
  const response = await page.request.get('/api/builder/site/pages?locale=ko');
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { pages?: TestPageMeta[] };
  return payload.pages?.find((entry) => entry.slug === slug) ?? null;
}

async function draftNodesByPageId(page: Page, pageId: string): Promise<TestDraftNode[]> {
  const response = await page.request.get(`/api/builder/site/pages/${pageId}/draft?locale=ko`);
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { document?: { nodes?: TestDraftNode[] } };
  return payload.document?.nodes ?? [];
}

async function restoreNavigation(page: Page, navigation: TestNavigationItem[]): Promise<void> {
  const response = await page.request.put('/api/builder/site/navigation', {
    headers: builderApiHeaders('chrome-click-navigation-restore'),
    data: {
      locale: 'ko',
      navigation,
    },
    failOnStatusCode: false,
  });
  expect(response.ok()).toBeTruthy();
}

function koNavigationLabel(item: TestNavigationItem | undefined): string {
  if (!item) return '';
  if (typeof item.label === 'string') return item.label;
  return item.label.ko ?? item.label.en ?? item.label['zh-hant'] ?? '';
}

function decodePng(buffer: Buffer): PngImage {
  const signature = buffer.subarray(0, 8).toString('hex');
  expect(signature).toBe('89504e470d0a1a0a');

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks: Buffer[] = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const chunk = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === 'IHDR') {
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
    } else if (type === 'IDAT') {
      idatChunks.push(Buffer.from(chunk));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + length;
  }

  expect(bitDepth).toBe(8);
  expect([2, 6]).toContain(colorType);
  const channels = (colorType === 6 ? 4 : 3) as 3 | 4;
  const rowLength = width * channels;
  const inflated = inflateSync(Buffer.concat(idatChunks));
  const data = new Uint8Array(width * height * channels);
  let sourceOffset = 0;

  const paeth = (left: number, up: number, upLeft: number) => {
    const p = left + up - upLeft;
    const pa = Math.abs(p - left);
    const pb = Math.abs(p - up);
    const pc = Math.abs(p - upLeft);
    if (pa <= pb && pa <= pc) return left;
    if (pb <= pc) return up;
    return upLeft;
  };

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[sourceOffset];
    sourceOffset += 1;
    const rowStart = y * rowLength;
    for (let x = 0; x < rowLength; x += 1) {
      const raw = inflated[sourceOffset + x];
      const left = x >= channels ? data[rowStart + x - channels] : 0;
      const up = y > 0 ? data[rowStart + x - rowLength] : 0;
      const upLeft = y > 0 && x >= channels ? data[rowStart + x - rowLength - channels] : 0;
      const predictor = filter === 0
        ? 0
        : filter === 1
          ? left
          : filter === 2
            ? up
            : filter === 3
              ? Math.floor((left + up) / 2)
              : paeth(left, up, upLeft);
      data[rowStart + x] = (raw + predictor) & 0xff;
    }
    sourceOffset += rowLength;
  }

  return { width, height, channels, data };
}

function sampledColorVariety(image: PngImage, rect: { x: number; y: number; width: number; height: number }): number {
  const colors = new Set<string>();
  const left = Math.max(0, Math.floor(rect.x));
  const right = Math.min(image.width, Math.ceil(rect.x + rect.width));
  const top = Math.max(0, Math.floor(rect.y));
  const bottom = Math.min(image.height, Math.ceil(rect.y + rect.height));
  const stepX = Math.max(1, Math.floor((right - left) / 32));
  const stepY = Math.max(1, Math.floor((bottom - top) / 32));

  for (let y = top; y < bottom; y += stepY) {
    for (let x = left; x < right; x += stepX) {
      const index = (y * image.width + x) * image.channels;
      colors.add(`${image.data[index] >> 4},${image.data[index + 1] >> 4},${image.data[index + 2] >> 4}`);
    }
  }

  return colors.size;
}

test.describe('/ko/admin-builder public chrome click safety', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await page.setExtraHTTPHeaders(mutationHeaders(`chrome-click-${testInfo.workerIndex}-${testInfo.retry}-${testInfo.title}`));
  });

  test('keeps the public columns shortcut compact on builder viewports', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBuilder(page);

    const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
    await expect(publicChrome).toBeVisible();
    const shortcutButton = publicChrome.getByRole('button', { name: /칼럼|Columns|專欄/ }).first();
    await expect(shortcutButton).toHaveAttribute('aria-pressed', 'false');
    await expect(publicChrome.locator('.quick-contact, .scroll-top, .floating-ai-chat')).toHaveCount(0);
    const shortcutBox = await shortcutButton.boundingBox();
    const inspectorBox = await page.locator('[class*="inspectorColumn"]').first().boundingBox();
    if (!shortcutBox || !inspectorBox) throw new Error('Expected shortcut and inspector boxes in compact builder view.');
    expect(shortcutBox.y + shortcutBox.height).toBeLessThanOrEqual(inspectorBox.y - 8);
    await shortcutButton.click();
    const shortcutPanel = publicChrome.locator('[class*="publicChromeShortcutPanel"]').first();
    await expect(shortcutPanel).toBeVisible();
    const shortcutPanelBox = await shortcutPanel.boundingBox();
    if (!shortcutPanelBox) throw new Error('Expected shortcut panel box in compact builder view.');
    expect(shortcutPanelBox.width).toBeGreaterThan(180);
    expect(shortcutPanelBox.y + shortcutPanelBox.height).toBeLessThanOrEqual(inspectorBox.y - 8);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test('previews the public event popup only after the compact builder event control is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBuilder(page);

    const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
    await expect(publicChrome).toBeVisible();
    const eventButton = publicChrome.getByRole('button', { name: /이벤트 팝업/ }).first();
    await expect(eventButton).toBeVisible();
    await expect(eventButton).toHaveAttribute('aria-pressed', 'false');
    await expect(page.getByRole('dialog', { name: '2026년 기념 리뷰 이벤트' })).toHaveCount(0);
    const eventButtonBox = await eventButton.boundingBox();
    const inspectorBox = await page.locator('[class*="inspectorColumn"]').first().boundingBox();
    if (!eventButtonBox || !inspectorBox) throw new Error('Expected event and inspector boxes in compact builder view.');
    expect(eventButtonBox.y + eventButtonBox.height).toBeLessThanOrEqual(inspectorBox.y - 8);
    await eventButton.click();
    await expect(eventButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('dialog', { name: '2026년 기념 리뷰 이벤트' })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  });

  test('does not let rail labels or public header nav overlap open drawer panels', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const pagesButton = rail.getByRole('button', { name: /^Pages$|^페이지$/ });
    const pagesLabel = pagesButton.locator('[class*="railButtonLabel"]').first();
    await pagesButton.hover();
    await expect(pagesLabel).toHaveCSS('opacity', '1');

    await pagesButton.click();
    const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
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

    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    const navDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first();
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

  test('captures nonblank drawer-open header chrome pixels', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?chromePixelGuard=1');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();

    const rects = await page.evaluate(() => {
      const toRect = (rect: DOMRect | undefined) => {
        if (!rect) return null;
        return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
      };
      return {
        drawer: toRect(document.querySelector<HTMLElement>('aside[aria-hidden="false"]')?.getBoundingClientRect()),
        header: toRect(document.querySelector<HTMLElement>('[class*="globalHeaderRegion"]')?.getBoundingClientRect()),
        toggle: toRect(document.querySelector<HTMLElement>('.builder-site-header .mobile-toggle')?.getBoundingClientRect()),
      };
    });

    expect(rects.drawer).not.toBeNull();
    expect(rects.header).not.toBeNull();
    expect(rects.toggle).not.toBeNull();

    const image = decodePng(await page.screenshot());
    expect(sampledColorVariety(image, rects.drawer!)).toBeGreaterThan(8);
    expect(sampledColorVariety(image, rects.header!)).toBeGreaterThan(8);
    expect(sampledColorVariety(image, rects.toggle!)).toBeGreaterThan(2);
  });

  test('keeps the canvas header menu expanded while side drawers are open when there is room', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();
    await expectExpandedHeader(page);

    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectExpandedHeader(page);
  });

  test('keeps editable mega menu controls clear of side drawers', async ({ page }) => {
    for (const width of [1980, 2100, 2200]) {
      await page.setViewportSize({ width, height: 900 });
      await openBuilder(page, `/ko/admin-builder?megaMenuDrawerClearance=${width}`);

      const rail = page.locator('[class*="iconRail"]').first();
      await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();

      const headerMode = await page.evaluate(() => {
        const mainNav = document.querySelector<HTMLElement>('.builder-site-header .main-nav');
        const megaMenu = document.querySelector<HTMLElement>('.builder-site-header .mega-menu');
        return {
          width: window.innerWidth,
          mainNavDisplay: mainNav ? window.getComputedStyle(mainNav).display : '',
          megaMenuDisplay: megaMenu ? window.getComputedStyle(megaMenu).display : '',
        };
      });

      if (headerMode.mainNavDisplay === 'none') {
        await expectCompactHeader(page);
        expect(headerMode.megaMenuDisplay).toBe('none');
        continue;
      }

      await expectExpandedHeader(page);

      const servicesLink = page.locator('.builder-site-header .nav-link[href="/ko/services"]').first();
      await expect(servicesLink).toBeVisible();
      await servicesLink.dispatchEvent('mouseover');
      await servicesLink.dispatchEvent('mouseenter');
      const activeMegaPanel = page.locator('.builder-site-header .mega-panel.active').first();
      await expect(activeMegaPanel).toBeVisible();
      await expect(activeMegaPanel).toContainText('투자·법인설립');

      const megaClearance = await page.evaluate(() => {
        const drawer = document.querySelector<HTMLElement>('aside[aria-hidden="false"]')?.getBoundingClientRect();
        const panel = document.querySelector<HTMLElement>('.builder-site-header .mega-panel.active')?.getBoundingClientRect();
        const controls = Array.from(document.querySelectorAll<HTMLElement>([
          '.builder-site-header .mega-panel.active .builder-mega-action',
          '.builder-site-header .mega-panel.active .builder-mega-link-row > a',
          '.builder-site-header .mega-panel.active .builder-mega-link-edit',
        ].join(', ')))
          .filter((node) => node.offsetParent !== null)
          .map((node) => {
            const rect = node.getBoundingClientRect();
            return {
              text: node.textContent?.trim() ?? '',
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
            };
          });
        const overlappingControls = drawer
          ? controls.filter((control) => control.left < drawer.right && control.right > drawer.left)
          : controls;
        return {
          width: window.innerWidth,
          drawer: drawer ? { left: drawer.left, right: drawer.right } : null,
          panel: panel ? { left: panel.left, right: panel.right } : null,
          controlCount: controls.length,
          overlappingControls,
        };
      });

      expect(megaClearance.panel).not.toBeNull();
      expect(megaClearance.controlCount).toBeGreaterThan(2);
      expect(megaClearance.overlappingControls).toEqual([]);
    }
  });

  test('keeps nested mega-menu public routes inside the editor shell', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?nestedMegaRoute=1');
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectExpandedHeader(page);

    const servicesLink = page.locator('.builder-site-header .nav-link[href="/ko/services"]').first();
    await expect(servicesLink).toBeVisible();
    await servicesLink.dispatchEvent('mouseover');
    await servicesLink.dispatchEvent('mouseenter');
    const activeMegaPanel = page.locator('.builder-site-header .mega-panel.active').first();
    await expect(activeMegaPanel).toBeVisible();

    const nestedRouteLink = activeMegaPanel.locator('a[href="/ko/services/investment"]').first();
    await expect(nestedRouteLink).toBeVisible();
    await nestedRouteLink.click();

    await expect.poll(() => page.url()).toBe(editorUrl);
    const openDrawer = page.locator('aside[aria-hidden="false"]');
    await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
    await expect(openDrawer).toHaveCount(1);
    await expect(page.locator('.builder-site-header .mega-panel.active')).toHaveCount(0);
    await expect(canvas).toBeVisible();
  });

  test('opens the canvas mobile menu without leaving it under an editor side drawer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page);

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();
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

  test('opens the canvas mobile menu without leaving it under the Navigation drawer', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?navigationMobileMenuClear=1');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectCompactHeader(page);

    const mobileToggle = page.locator('.builder-site-header .mobile-toggle').first();
    await expect(mobileToggle).toBeVisible();
    await mobileToggle.click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open').first()).toBeVisible();

    const menuStack = await page.evaluate(() => {
      const panel = document.querySelector<HTMLElement>('.builder-site-header .site-mobile-nav-panel')?.getBoundingClientRect();
      if (!panel) return { panelPresent: false, panelTopHit: false, editorDrawerAbovePanel: false };
      const panelCenterX = panel.left + (panel.width / 2);
      const panelCenterY = panel.top + Math.min(96, panel.height / 2);
      const stack = document.elementsFromPoint(panelCenterX, panelCenterY);
      const panelStackIndex = stack.findIndex((node) => (
        node instanceof HTMLElement && node.classList.contains('site-mobile-nav-panel')
      ));
      const editorDrawerStackIndex = stack.findIndex((node) => (
        node instanceof HTMLElement && Boolean(node.closest('aside[aria-hidden="false"]'))
      ));
      return {
        panelPresent: true,
        panelTopHit: stack[0] instanceof HTMLElement
          ? Boolean(stack[0].closest('.site-mobile-nav-panel'))
          : false,
        editorDrawerAbovePanel: editorDrawerStackIndex >= 0
          && panelStackIndex >= 0
          && editorDrawerStackIndex < panelStackIndex,
      };
    });

    expect(menuStack.panelPresent).toBe(true);
    expect(menuStack.panelTopHit).toBe(true);
    expect(menuStack.editorDrawerAbovePanel).toBe(false);
  });

  test('keeps the canvas mobile menu panel inside narrow editor bounds', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await openBuilder(page, '/ko/admin-builder?narrowMobileMenuBounds=1');
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();

    const narrowBounds = await page.evaluate(() => {
      const headerRegion = document.querySelector<HTMLElement>('[class*="globalHeaderRegion"]')?.getBoundingClientRect();
      const panel = document.querySelector<HTMLElement>('.builder-site-header .site-mobile-nav-panel')?.getBoundingClientRect();
      const drawer = document.querySelector<HTMLElement>('.builder-site-header .site-mobile-nav-drawer.open')?.getBoundingClientRect();
      return {
        headerRegion: headerRegion
          ? { left: headerRegion.left, right: headerRegion.right, width: headerRegion.width }
          : null,
        drawer: drawer
          ? { left: drawer.left, right: drawer.right, width: drawer.width }
          : null,
        panel: panel
          ? { left: panel.left, right: panel.right, width: panel.width }
          : null,
      };
    });

    expect(narrowBounds.headerRegion).not.toBeNull();
    expect(narrowBounds.drawer).not.toBeNull();
    expect(narrowBounds.panel).not.toBeNull();
    if (!narrowBounds.headerRegion || !narrowBounds.drawer || !narrowBounds.panel) return;
    expect(narrowBounds.drawer.left).toBeGreaterThanOrEqual(narrowBounds.headerRegion.left - 1);
    expect(narrowBounds.drawer.right).toBeLessThanOrEqual(narrowBounds.headerRegion.right + 1);
    expect(narrowBounds.panel.width).toBeLessThanOrEqual(narrowBounds.drawer.width - 24 + 1);
    expect(narrowBounds.panel.left).toBeGreaterThanOrEqual(narrowBounds.headerRegion.left + 11);
    expect(narrowBounds.panel.right).toBeLessThanOrEqual(narrowBounds.headerRegion.right - 11 + 1);
  });

  test('closes the canvas mobile menu before focusing Navigation edits', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await openBuilder(page, '/ko/admin-builder?mobileMenuNavigationEdit=1');
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();
    const serviceChildLink = mobileDrawer.locator('[data-builder-mobile-nav-link="services-child"]').first();
    await expect(serviceChildLink).toBeVisible();
    const serviceChildId = await serviceChildLink.getAttribute('data-builder-nav-item-id');
    expect(serviceChildId).toBeTruthy();
    await serviceChildLink.scrollIntoViewIfNeeded();
    await serviceChildLink.click({ modifiers: ['Alt'] });

    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    const navigationDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first();
    await expect(navigationDrawer).toBeVisible({ timeout: 20_000 });
    await expect(navigationDrawer.locator(`[data-builder-nav-edit-id="${serviceChildId}"]`)).toBeVisible();

    const overlayState = await page.evaluate(() => {
      const editForm = document.querySelector<HTMLElement>('[data-builder-nav-edit-id]')?.getBoundingClientRect();
      if (!editForm) return { editFormVisible: false, coveredByMobileDrawer: false };
      const hit = document.elementFromPoint(editForm.left + Math.min(24, editForm.width / 2), editForm.top + Math.min(24, editForm.height / 2));
      return {
        editFormVisible: true,
        coveredByMobileDrawer: Boolean(hit instanceof HTMLElement && hit.closest('.site-mobile-nav-drawer.open')),
      };
    });
    expect(overlayState.editFormVisible).toBe(true);
    expect(overlayState.coveredByMobileDrawer).toBe(false);
  });

  test('offers visible mobile Navigation edit controls', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await openBuilder(page, '/ko/admin-builder?mobileMenuVisibleEdit=1');
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();
    const serviceChildEdit = mobileDrawer.locator('[data-builder-mobile-nav-edit="services-child"]').first();
    await expect(serviceChildEdit).toBeVisible();
    await expect(serviceChildEdit).toHaveText('편집');
    const serviceChildId = await serviceChildEdit.getAttribute('data-builder-nav-item-id');
    expect(serviceChildId).toBeTruthy();
    await serviceChildEdit.click();

    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    const navigationDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first();
    await expect(navigationDrawer).toBeVisible({ timeout: 20_000 });
    await expect(navigationDrawer.locator(`[data-builder-nav-edit-id="${serviceChildId}"]`)).toBeVisible();
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('offers inline mobile Navigation rename controls', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    const token = Date.now().toString(36);
    const testItemId = `nav-mobile-rename-${token}`;
    const seedLabel = `모바일 이름 원본 ${token}`;
    const renameLabelKo = `모바일 이름 ${token}`;
    const renameLabelZh = `行動選單 ${token}`;
    const renameLabelEn = `Mobile Menu ${token}`;
    try {
      await restoreNavigation(page, [
        ...originalNavigation,
        {
          id: testItemId,
          label: { ko: seedLabel, 'zh-hant': seedLabel, en: seedLabel },
          href: `/mobile-rename-${token}`,
          pageId: `external-${testItemId}`,
        },
      ]);
      await expect.poll(async () => {
        const navigationWithSeed = await navigationFromApi(page);
        return koNavigationLabel(navigationWithSeed.find((item) => item.id === testItemId));
      }, { timeout: 5_000 }).toBe(seedLabel);

      await page.setViewportSize({ width: 390, height: 900 });
      await openBuilder(page, '/ko/admin-builder?mobileMenuRenameControl=1');
      await expectCompactHeader(page);

      await page.locator('.builder-site-header .mobile-toggle').first().click();
      const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
      await expect(mobileDrawer).toBeVisible();
      const renameControl = mobileDrawer.locator(`[data-builder-mobile-nav-rename][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(renameControl).toBeVisible();
      await expect(renameControl).toHaveText('이름');
      await renameControl.scrollIntoViewIfNeeded();
      await renameControl.click();

      const renameForm = mobileDrawer.locator(`[data-builder-mobile-nav-rename-form][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(renameForm).toBeVisible();
      const koRenameInput = renameForm.locator('[data-builder-mobile-nav-rename-input="ko"]');
      const zhRenameInput = renameForm.locator('[data-builder-mobile-nav-rename-input="zh-hant"]');
      const enRenameInput = renameForm.locator('[data-builder-mobile-nav-rename-input="en"]');
      await expect(koRenameInput).toBeFocused();
      await koRenameInput.fill(renameLabelKo);
      await zhRenameInput.fill(renameLabelZh);
      await enRenameInput.fill(renameLabelEn);
      const renameResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PUT'
        && response.url().includes('/api/builder/site/navigation')
      ));
      await renameForm.locator('[data-builder-mobile-nav-rename-save]').click();
      const renameResponse = await renameResponsePromise;
      expect(renameResponse.status()).toBe(200);
      const renamePayload = (await renameResponse.json()) as { navigation?: TestNavigationItem[] };
      const renamedItem = renamePayload.navigation?.find((item) => item.id === testItemId);
      expect(koNavigationLabel(renamedItem)).toBe(renameLabelKo);
      expect(typeof renamedItem?.label === 'object' ? renamedItem.label['zh-hant'] : '').toBe(renameLabelZh);
      expect(typeof renamedItem?.label === 'object' ? renamedItem.label.en : '').toBe(renameLabelEn);
      await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toBeVisible();
      await expect(mobileDrawer.locator(`[data-builder-mobile-nav-link="${testItemId}"]`).first()).toHaveText(renameLabelKo);
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ })).toHaveCount(0);
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('links mobile Navigation rename controls to Translation Manager target handoff', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    const token = Date.now().toString(36);
    const testItemId = `nav-mobile-translation-${token}`;
    const seedLabel = `모바일 번역 원본 ${token}`;
    const translationSearch = `nav:${testItemId}:label`;
    try {
      await restoreNavigation(page, [
        ...originalNavigation,
        {
          id: testItemId,
          label: { ko: seedLabel, 'zh-hant': seedLabel, en: seedLabel },
          href: `/mobile-translation-${token}`,
          pageId: `external-${testItemId}`,
        },
      ]);
      await expect.poll(async () => {
        const navigationWithSeed = await navigationFromApi(page);
        return koNavigationLabel(navigationWithSeed.find((item) => item.id === testItemId));
      }, { timeout: 5_000 }).toBe(seedLabel);

      await page.setViewportSize({ width: 390, height: 900 });
      await openBuilder(page, '/ko/admin-builder?mobileMenuTranslationLink=1');
      await expectCompactHeader(page);

      await page.locator('.builder-site-header .mobile-toggle').first().click();
      const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
      await expect(mobileDrawer).toBeVisible();
      const renameControl = mobileDrawer.locator(`[data-builder-mobile-nav-rename][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(renameControl).toBeVisible();
      await renameControl.scrollIntoViewIfNeeded();
      await renameControl.click();

      const renameForm = mobileDrawer.locator(`[data-builder-mobile-nav-rename-form][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(renameForm).toBeVisible();
      const translationLink = renameForm.locator(`[data-builder-mobile-nav-translation-link][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(translationLink).toBeVisible();
      await expect(translationLink).toHaveText('번역 관리');
      const href = await translationLink.getAttribute('href');
      expect(href).toContain('/ko/admin-builder/translations?');
      expect(href).toContain('category=navigation');
      expect(href).toContain(`search=${encodeURIComponent(translationSearch)}`);

      const enTargetLink = renameForm.locator(`[data-builder-mobile-nav-translation-target="en"][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(enTargetLink).toBeVisible();
      await expect(enTargetLink).toHaveText('EN');
      const enHref = await enTargetLink.getAttribute('href');
      expect(enHref).toContain('/ko/admin-builder/translations?');
      expect(enHref).toContain('category=navigation');
      expect(enHref).toContain('target=en');
      expect(enHref).toContain(`search=${encodeURIComponent(translationSearch)}`);

      await enTargetLink.click();
      await page.waitForURL((url) => (
        url.pathname === '/ko/admin-builder/translations'
        && url.searchParams.get('category') === 'navigation'
        && url.searchParams.get('target') === 'en'
      ));
      await expect(page.getByRole('heading', { name: /Translation Manager|번역 관리자/ })).toBeVisible({ timeout: 20_000 });
      await expect(page.locator('[data-translation-category="navigation"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[data-translation-search-input="true"]')).toHaveValue(translationSearch);
      await expect(page.locator('[data-translation-target-toggle="en"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[data-translation-target-toggle="zh-hant"]')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.getByRole('columnheader', { name: /Target - en|타깃 - en/ })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /Target - zh-hant|타깃 - zh-hant/ })).toHaveCount(0);
      const translationEntry = page.locator(`[data-translation-entry="${translationSearch}"]`).first();
      await expect(translationEntry).toBeVisible({ timeout: 20_000 });
      await expect(translationEntry).toContainText(seedLabel);
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('covers tablet breakpoint rename coverage for mobile Navigation controls', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    const token = Date.now().toString(36);
    const testItemId = `nav-tablet-rename-${token}`;
    const seedLabel = `태블릿 이름 원본 ${token}`;
    const renameLabelKo = `태블릿 이름 ${token}`;
    const renameLabelZh = `平板選單 ${token}`;
    const renameLabelEn = `Tablet Menu ${token}`;
    try {
      await restoreNavigation(page, [
        ...originalNavigation,
        {
          id: testItemId,
          label: { ko: seedLabel, 'zh-hant': seedLabel, en: seedLabel },
          href: `/tablet-rename-${token}`,
          pageId: `external-${testItemId}`,
        },
      ]);
      await expect.poll(async () => {
        const navigationWithSeed = await navigationFromApi(page);
        return koNavigationLabel(navigationWithSeed.find((item) => item.id === testItemId));
      }, { timeout: 5_000 }).toBe(seedLabel);

      await page.setViewportSize({ width: 1280, height: 900 });
      await openBuilder(page, '/ko/admin-builder?tabletMobileMenuRenameControl=1');
      await page.locator('[data-builder-topbar-viewport="tablet"]').click();
      await expect(page.locator('[data-builder-topbar-viewport="tablet"]')).toHaveAttribute('aria-pressed', 'true');
      await expect.poll(async () => (
        page.locator('[class*="globalHeaderRegion"]').first().evaluate((element) => Math.round(element.getBoundingClientRect().width))
      ), { timeout: 5_000 }).toBe(768);
      await expectCompactHeader(page);
      await expect(page.locator('.builder-site-header').first()).toHaveAttribute('data-builder-mobile-header', 'true');

      await page.locator('.builder-site-header .mobile-toggle').first().click();
      const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
      await expect(mobileDrawer).toBeVisible();
      const renameControl = mobileDrawer.locator(`[data-builder-mobile-nav-rename][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(renameControl).toBeVisible();
      await renameControl.scrollIntoViewIfNeeded();
      await renameControl.click();

      const renameForm = mobileDrawer.locator(`[data-builder-mobile-nav-rename-form][data-builder-nav-item-id="${testItemId}"]`).first();
      await expect(renameForm).toBeVisible();
      const koRenameInput = renameForm.locator('[data-builder-mobile-nav-rename-input="ko"]');
      const zhRenameInput = renameForm.locator('[data-builder-mobile-nav-rename-input="zh-hant"]');
      const enRenameInput = renameForm.locator('[data-builder-mobile-nav-rename-input="en"]');
      await expect(koRenameInput).toBeFocused();

      const renameLayout = await page.evaluate((itemId) => {
        const toRect = (rect: DOMRect | undefined) => (rect
          ? { left: rect.left, right: rect.right, width: rect.width }
          : null);
        const panel = document.querySelector<HTMLElement>('.builder-site-header .site-mobile-nav-panel')?.getBoundingClientRect();
        const form = document.querySelector<HTMLElement>(`[data-builder-mobile-nav-rename-form][data-builder-nav-item-id="${itemId}"]`);
        const fields = form?.querySelector<HTMLElement>('.builder-mobile-nav-rename-fields');
        const inputs = Array.from(form?.querySelectorAll<HTMLElement>('[data-builder-mobile-nav-rename-input]') ?? [])
          .map((input) => toRect(input.getBoundingClientRect()));
        const gridTemplateColumns = fields ? window.getComputedStyle(fields).gridTemplateColumns : '';
        return {
          panel: toRect(panel),
          form: toRect(form?.getBoundingClientRect()),
          gridColumnCount: gridTemplateColumns.split(' ').filter(Boolean).length,
          inputs,
        };
      }, testItemId);
      expect(renameLayout.panel).not.toBeNull();
      expect(renameLayout.form).not.toBeNull();
      expect(renameLayout.gridColumnCount).toBe(3);
      if (renameLayout.panel && renameLayout.form) {
        expect(renameLayout.form.left).toBeGreaterThanOrEqual(renameLayout.panel.left - 1);
        expect(renameLayout.form.right).toBeLessThanOrEqual(renameLayout.panel.right + 1);
      }
      expect(renameLayout.inputs).toHaveLength(3);
      for (const input of renameLayout.inputs) {
        expect(input).not.toBeNull();
        if (!input || !renameLayout.form) continue;
        expect(input.left).toBeGreaterThanOrEqual(renameLayout.form.left - 1);
        expect(input.right).toBeLessThanOrEqual(renameLayout.form.right + 1);
        expect(input.width).toBeGreaterThan(40);
      }

      await koRenameInput.fill(renameLabelKo);
      await zhRenameInput.fill(renameLabelZh);
      await enRenameInput.fill(renameLabelEn);
      const renameResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PUT'
        && response.url().includes('/api/builder/site/navigation')
      ));
      await renameForm.locator('[data-builder-mobile-nav-rename-save]').click();
      const renameResponse = await renameResponsePromise;
      expect(renameResponse.status()).toBe(200);
      const renamePayload = (await renameResponse.json()) as { navigation?: TestNavigationItem[] };
      const renamedItem = renamePayload.navigation?.find((item) => item.id === testItemId);
      expect(koNavigationLabel(renamedItem)).toBe(renameLabelKo);
      expect(typeof renamedItem?.label === 'object' ? renamedItem.label['zh-hant'] : '').toBe(renameLabelZh);
      expect(typeof renamedItem?.label === 'object' ? renamedItem.label.en : '').toBe(renameLabelEn);
      await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toBeVisible();
      await expect(mobileDrawer.locator(`[data-builder-mobile-nav-link="${testItemId}"]`).first()).toHaveText(renameLabelKo);
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('offers visible mobile Navigation add controls', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    try {
      await page.setViewportSize({ width: 390, height: 900 });
      await openBuilder(page, '/ko/admin-builder?mobileMenuAddControl=1');
      await expectCompactHeader(page);

      await page.locator('.builder-site-header .mobile-toggle').first().click();
      const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
      await expect(mobileDrawer).toBeVisible();
      const serviceAdd = mobileDrawer.locator('[data-builder-mobile-nav-add="services"]').first();
      await expect(serviceAdd).toBeVisible();
      await expect(serviceAdd).toHaveText('하위 추가');
      const serviceTopId = await serviceAdd.getAttribute('data-builder-nav-item-id');
      expect(serviceTopId).toBeTruthy();
      await serviceAdd.click();

      await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
      const navigationDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first();
      await expect(navigationDrawer).toBeVisible({ timeout: 20_000 });
      const newChildForm = navigationDrawer.locator(`[data-builder-nav-edit-id^="${serviceTopId}-child-"]`).first();
      await expect(newChildForm).toBeVisible();
      await expect(newChildForm.locator('input').first()).toHaveValue('새 하위 메뉴');
      await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('offers visible mobile Navigation reorder controls', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    const token = Date.now().toString(36);
    const temporarySiblingId = `nav-mobile-reorder-sibling-${token}`;
    const serviceSeedIndex = originalNavigation.findIndex((item) => (
      item.href.includes('/services') || koNavigationLabel(item) === '업무분야'
    ));
    try {
      test.skip(serviceSeedIndex < 0, 'services nav item missing in this fixture');
      await restoreNavigation(page, [
        ...originalNavigation.slice(0, serviceSeedIndex + 1),
        {
          id: temporarySiblingId,
          label: { ko: `순서 테스트 ${token}`, 'zh-hant': `排序測試 ${token}`, en: `Reorder Test ${token}` },
          href: `/mobile-reorder-${token}`,
          pageId: `external-${temporarySiblingId}`,
        },
        ...originalNavigation.slice(serviceSeedIndex + 1),
      ]);
      await expect.poll(async () => {
        const seededNavigation = await navigationFromApi(page);
        return seededNavigation.findIndex((item) => item.id === temporarySiblingId);
      }, { timeout: 5_000 }).toBe(serviceSeedIndex + 1);

      await page.setViewportSize({ width: 390, height: 900 });
      await openBuilder(page, '/ko/admin-builder?mobileMenuReorderControl=1');
      await expectCompactHeader(page);

      await page.locator('.builder-site-header .mobile-toggle').first().click();
      const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
      await expect(mobileDrawer).toBeVisible();
      const serviceMoveDown = mobileDrawer.locator('[data-builder-mobile-nav-move="services:down"]').first();
      await expect(serviceMoveDown).toBeVisible();
      const serviceTopId = await serviceMoveDown.getAttribute('data-builder-nav-item-id');
      expect(serviceTopId).toBeTruthy();

      const navigationBeforeMove = await navigationFromApi(page);
      const serviceIndex = navigationBeforeMove.findIndex((item) => item.id === serviceTopId);
      expect(serviceIndex).toBe(serviceSeedIndex);
      expect(navigationBeforeMove[serviceIndex + 1]?.id).toBe(temporarySiblingId);

      const moveDownResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PUT'
        && response.url().includes('/api/builder/site/navigation')
      ));
      await serviceMoveDown.click();
      const moveDownResponse = await moveDownResponsePromise;
      expect(moveDownResponse.status()).toBe(200);
      await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toBeVisible();
      await expect.poll(async () => {
        const navigationAfterMove = await navigationFromApi(page);
        return navigationAfterMove.findIndex((item) => item.id === serviceTopId);
      }, { timeout: 10_000 }).toBe(serviceIndex + 1);
      await expect.poll(async () => {
        const navigationAfterMove = await navigationFromApi(page);
        return navigationAfterMove.findIndex((item) => item.id === temporarySiblingId);
      }, { timeout: 10_000 }).toBe(serviceIndex);

      const serviceMoveUp = mobileDrawer.locator('[data-builder-mobile-nav-move="services:up"]').first();
      await expect(serviceMoveUp).toBeVisible();
      const moveUpResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PUT'
        && response.url().includes('/api/builder/site/navigation')
      ));
      await serviceMoveUp.click();
      const moveUpResponse = await moveUpResponsePromise;
      expect(moveUpResponse.status()).toBe(200);
      await expect.poll(async () => {
        const navigationAfterRestoreMove = await navigationFromApi(page);
        return navigationAfterRestoreMove.findIndex((item) => item.id === serviceTopId);
      }, { timeout: 10_000 }).toBe(serviceIndex);
      await expect.poll(async () => {
        const navigationAfterRestoreMove = await navigationFromApi(page);
        return navigationAfterRestoreMove.findIndex((item) => item.id === temporarySiblingId);
      }, { timeout: 10_000 }).toBe(serviceIndex + 1);
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('lets compact header mobile columns link switch pages after the Navigation drawer was open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?navigationDrawerMobileColumns=1');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();

    const columnsLink = mobileDrawer.locator('[data-builder-mobile-nav-link="columns"][href="/ko/columns"]').first();
    await expect(columnsLink).toBeVisible();
    await columnsLink.scrollIntoViewIfNeeded();
    await expect.poll(async () => page.locator('.builder-site-header .main-nav').first().evaluate((element) => (
      window.getComputedStyle(element).display
    )), { timeout: 5_000 }).toBe('none');
    await expect.poll(async () => {
      const box = await columnsLink.boundingBox();
      if (!box) return 'missing';
      return columnsLink.evaluate((element, point) => {
        const hit = document.elementFromPoint(point.x, point.y);
        return hit && (hit === element || element.contains(hit)) ? 'ok' : hit?.tagName ?? 'covered';
      }, {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
      });
    }, { timeout: 5_000 }).toBe('ok');
    await columnsLink.click();

    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('lets compact header mobile menu links switch builder pages after a side drawer was open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?mobileHeaderNavigate=columns');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();
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

  test('lets compact header mobile utility links switch builder pages after a side drawer was open', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?mobileUtilityNavigate=contact');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();

    await mobileDrawer.locator('.site-mobile-nav-utility a[href="/ko/contact#offices"]').first().click();
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/contact', {
      timeout: 20_000,
    });
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('keeps compact header mobile member login links inside the editor shell', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?mobileMemberLogin=1');
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();

    await mobileDrawer.locator('[data-member-role-link="login-mobile"]').first().click();

    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    const openDrawer = page.locator('aside[aria-hidden="false"]');
    await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
    await expect(openDrawer).toHaveCount(1);
    await expect(canvas).toBeVisible();
  });

  test('opens columns tools only after the rail shortcut reaches the columns page', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?columnsPanelNavigate=1');

    await page.locator('[data-builder-rail-item="columns"]').click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });

    await page.locator('[data-builder-rail-item="columns"]').click();
    const columnsDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '글쓰기' }).first();
    await expect(columnsDrawer).toBeVisible();
    await expect(columnsDrawer.locator('[data-builder-columns-workflow="true"]')).toBeVisible();
    await expect(columnsDrawer.locator('[data-builder-columns-workflow-step="page"]')).toHaveAttribute('data-active', 'true');
    await expect(columnsDrawer.locator('[data-builder-columns-workflow-step="manager"]')).toHaveAttribute('data-active', 'true');

    await page.locator('[data-builder-open-columns-page="true"]').click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('restores a missing columns draft when opening the columns builder page', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?columnsDraftRestore=1');

    const pagesResponse = await page.request.get('/api/builder/site/pages?locale=ko');
    expect(pagesResponse.ok()).toBe(true);
    const pagesPayload = await pagesResponse.json() as {
      pages?: Array<{ pageId: string; slug: string }>;
    };
    const columnsPage = pagesPayload.pages?.find((candidate) => candidate.slug === 'columns');
    expect(columnsPage?.pageId).toBeTruthy();

    let draftGetCount = 0;
    let draftPutCount = 0;
    let restoredDocument: unknown = null;
    const restoredAt = new Date().toISOString();
    await page.route(`**/api/builder/site/pages/${columnsPage!.pageId}/draft?**`, async (route) => {
      const request = route.request();
      if (request.method() === 'GET') {
        draftGetCount += 1;
        if (draftGetCount <= 2) {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ ok: false, error: 'Draft not found' }),
          });
          return;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            draft: { revision: 0, savedAt: restoredAt, updatedBy: 'test' },
            document: restoredDocument,
          }),
        });
        return;
      }
      if (request.method() === 'PUT') {
        draftPutCount += 1;
        restoredDocument = request.postDataJSON()?.document ?? null;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            draft: { revision: 0, savedAt: restoredAt, updatedBy: 'test' },
            document: restoredDocument,
          }),
        });
        return;
      }
      await route.fallback();
    });

    await page.locator('[data-builder-rail-item="columns"]').click();

    await expect.poll(() => draftPutCount).toBe(1);
    await expect.poll(() => draftGetCount).toBeGreaterThanOrEqual(3);
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('[data-node-id="dynamic-list-title-columns"]').first()).toContainText(/칼럼|Columns/);
    expect(JSON.stringify(restoredDocument)).toContain('dynamic-list-repeater-columns');
  });

  test('uses the columns rail item as a direct visible page shortcut before opening writing tools', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?columnsRailShortcut=1');

    await page.locator('[data-builder-rail-item="columns"]').click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

    await page.locator('[data-builder-rail-item="columns"]').click();
    const columnsDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: '글쓰기' }).first();
    await expect(columnsDrawer).toBeVisible();
    await expect(columnsDrawer.locator('[data-builder-columns-workflow-step="page"]')).toHaveAttribute('data-active', 'true');
  });

  test('moves from the Pages drawer column shortcut to the real columns builder page', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?pagesColumnShortcut=1');

    await page.locator('[data-builder-rail-item="pages"]').click();
    const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
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
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();
    await expectStableTopToolbar(page);

    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
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
      await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();
      await expectStableTopToolbar(page);

      await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
      await expectStableTopToolbar(page);
    }
  });

  test('keeps header locale links in shell and lets footer page links switch pages', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 1000 });
    await openBuilder(page);
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const header = page.locator('.builder-site-header').first();
    await expect(header).toBeVisible();
    const enLink = header.locator('.utility-lang').getByRole('link', { name: 'EN' });
    // Another worker can transiently save headerFooter.mobileHamburger='force'
    // (mobile-runtime / published-interactions), which hides .utility-lang via
    // .header.mobile-nav-forced. Reload until the desktop utility bar is back.
    await expect(async () => {
      if (!(await enLink.isVisible().catch(() => false))) {
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
      }
      await expect(enLink).toBeVisible({ timeout: 3_000 });
    }).toPass({ timeout: 60_000 });
    await enLink.click();
    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(canvas).toBeVisible();

    const siteFooter = page.locator('footer:not([class*="statusBar"])').first();
    await expect(siteFooter).toBeVisible();
    await siteFooter.scrollIntoViewIfNeeded();
    const footerColumnsLink = siteFooter.locator('a[href="/ko/columns"]').first();
    await expect(footerColumnsLink).toBeVisible();
    await footerColumnsLink.click({ force: true });
    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(canvas).toBeVisible();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
  });

  test('opens site settings for footer contact links', async ({ page }) => {
    await openBuilder(page, '/ko/admin-builder?footerContactSettings=1');
    const editorUrl = page.url();

    const siteFooter = page.locator('footer:not([class*="statusBar"])').first();
    await expect(siteFooter).toBeVisible();
    await siteFooter.scrollIntoViewIfNeeded();
    await siteFooter.evaluate((footer) => {
      const link = document.createElement('a');
      link.href = 'mailto:footer-contact-test@example.com';
      link.textContent = 'Footer contact test';
      link.setAttribute('data-footer-contact-test', 'true');
      link.style.display = 'inline-flex';
      link.style.padding = '8px';
      footer.appendChild(link);
    });
    const footerEmailLink = siteFooter.locator('[data-footer-contact-test="true"]').first();
    await expect(footerEmailLink).toBeVisible();
    await footerEmailLink.click({ force: true });

    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    const settingsModal = page.locator('div[role="dialog"]').filter({ hasText: '사이트 설정' }).first();
    await expect(settingsModal).toBeVisible();
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('focuses matching Navigation items for footer hash links', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    const token = Date.now().toString(36);
    const footerNavId = `nav-footer-hash-${token}`;
    const footerHref = `#footer-${token}`;

    try {
      await restoreNavigation(page, [
        ...originalNavigation,
        {
          id: footerNavId,
          label: { ko: `Footer Hash ${token}`, 'zh-hant': `Footer Hash ${token}`, en: `Footer Hash ${token}` },
          href: footerHref,
          pageId: `external-${footerNavId}`,
        },
      ]);

      await openBuilder(page, `/ko/admin-builder?footerHashFocus=${token}`);
      const editorUrl = page.url();

      const siteFooter = page.locator('footer:not([class*="statusBar"])').first();
      await expect(siteFooter).toBeVisible();
      await siteFooter.scrollIntoViewIfNeeded();
      const footerHashLink = siteFooter.locator(`a[href="${footerHref}"]`).first();
      await expect(footerHashLink).toBeVisible();
      await footerHashLink.click({ force: true });

      await expect.poll(() => page.url()).toBe(editorUrl);
      const navDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first();
      await expect(navDrawer).toBeVisible();
      await expect(navDrawer.locator(`[data-builder-nav-edit-id="${footerNavId}"]`)).toBeVisible();
      await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('focuses matching Navigation items for footer external links', async ({ page }) => {
    const originalNavigation = await navigationFromApi(page);
    const token = Date.now().toString(36);
    const footerNavId = `nav-footer-external-${token}`;
    const footerHref = `https://example.com/footer-${token}`;

    try {
      await restoreNavigation(page, [
        ...originalNavigation,
        {
          id: footerNavId,
          label: {
            ko: `Footer External ${token}`,
            'zh-hant': `Footer External ${token}`,
            en: `Footer External ${token}`,
          },
          href: footerHref,
          pageId: `external-${footerNavId}`,
        },
      ]);

      await openBuilder(page, `/ko/admin-builder?footerExternalFocus=${token}`);
      const editorUrl = page.url();

      const siteFooter = page.locator('footer:not([class*="statusBar"])').first();
      await expect(siteFooter).toBeVisible();
      await siteFooter.scrollIntoViewIfNeeded();
      const footerExternalLink = siteFooter.locator(`a[href="${footerHref}"]`).first();
      await expect(footerExternalLink).toBeVisible();
      await footerExternalLink.click({ force: true });

      await expect.poll(() => page.url()).toBe(editorUrl);
      const navDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first();
      await expect(navDrawer).toBeVisible();
      await expect(navDrawer.locator(`[data-builder-nav-edit-id="${footerNavId}"]`)).toBeVisible();
      await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    } finally {
      await restoreNavigation(page, originalNavigation);
    }
  });

  test('lets simple public header links switch builder pages', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?headerNavigate=columns');

    const columnsLink = page.locator('.builder-site-header .nav-link[href="/ko/columns"]').first();
    await expect(columnsLink).toBeVisible();
    await columnsLink.click();

    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('uses the public floating columns shortcut as a page-first shortcut', async ({ page }) => {
    await page.setViewportSize({ width: 1365, height: 900 });
    await openBuilder(page, '/ko/admin-builder?publicChromeColumnsShortcut=1');

    const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
    await expect(publicChrome).toBeVisible();
    await publicChrome.getByRole('button', { name: '칼럼' }).click();
    await publicChrome.getByRole('button', { name: '칼럼 관리' }).click();

    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/columns', {
      timeout: 20_000,
    });
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('lets public header CTA and utility links switch builder pages without opening drawers', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?headerCtaNavigate=contact');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();

    const ctaLink = page.locator('.builder-site-header .nav-cta').first();
    await expect(ctaLink).toBeVisible();
    await ctaLink.click();
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/contact', {
      timeout: 20_000,
    });
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();

    const officeLink = page.locator('.builder-site-header .utility-nav > a[href="/ko/contact#offices"]').first();
    await expect(officeLink).toBeVisible();
    await officeLink.click();
    await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/contact', {
      timeout: 20_000,
    });
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
  });

  test('keeps desktop member login links inside the editor shell', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?memberLoginHeader=1');
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();

    const loginLink = page.locator('.builder-site-header .utility-member-nav [data-member-role-link="login"]').first();
    await expect(loginLink).toBeVisible();
    await loginLink.click();

    await expect.poll(() => page.url()).toBe(editorUrl);
    const openDrawer = page.locator('aside[aria-hidden="false"]');
    await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
    await expect(openDrawer).toHaveCount(1);
    await expect(canvas).toBeVisible();
  });

  test('keeps desktop authenticated member links inside the editor shell', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?memberPreview=premium&memberAccountHeader=1');
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();

    for (const roleLink of ['account', 'premium']) {
      const memberLink = page.locator(`.builder-site-header .utility-member-nav [data-member-role-link="${roleLink}"]`).first();
      await expect(memberLink).toBeVisible();
      await memberLink.click();

      await expect.poll(() => page.url()).toBe(editorUrl);
      const openDrawer = page.locator('aside[aria-hidden="false"]');
      await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
      await expect(openDrawer).toHaveCount(1);
      await expect(canvas).toBeVisible();
    }
  });

  test('keeps desktop member logout inside the editor shell', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?memberPreview=premium&memberLogoutHeader=1');
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();

    const logoutButton = page.locator('.builder-site-header .utility-member-nav [data-member-role-link="logout"]').first();
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    await expect.poll(() => page.url()).toBe(editorUrl);
    const openDrawer = page.locator('aside[aria-hidden="false"]');
    await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
    await expect(openDrawer).toHaveCount(1);
    await expect(canvas).toBeVisible();
  });

  test('offers to create missing member pages from the Pages drawer', async ({ page }) => {
    const existingLoginPageId = await pageIdBySlug(page, 'login');
    test.skip(Boolean(existingLoginPageId), 'login builder page already exists');

    let createdLoginPageId: string | null = null;
    try {
      await page.setViewportSize({ width: 2200, height: 900 });
      await openBuilder(page, '/ko/admin-builder?memberPreview=premium&memberCreateLogin=1');
      const editorUrl = page.url();

      const logoutButton = page.locator('.builder-site-header .utility-member-nav [data-member-role-link="logout"]').first();
      await expect(logoutButton).toBeVisible();
      await logoutButton.click();

      await expect.poll(() => page.url()).toBe(editorUrl);
      const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(pagesDrawer).toBeVisible({ timeout: 20_000 });
      const missingCard = pagesDrawer.locator('[data-builder-missing-page-card="true"][data-builder-missing-page-slug="login"]');
      await expect(missingCard).toBeVisible();
      await expect(missingCard).toContainText('/login');

      await missingCard.locator('[data-builder-create-missing-page="true"]').click();
      await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/login', {
        timeout: 20_000,
      });
      await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
      await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();

      createdLoginPageId = await pageIdBySlug(page, 'login');
      expect(createdLoginPageId).toBeTruthy();
      const starterNodes = await draftNodesByPageId(page, createdLoginPageId!);
      expect(starterNodes.some((node) => node.kind === 'text' && node.content?.text === '회원 로그인')).toBe(true);
      expect(starterNodes.some((node) => node.kind === 'button' && node.content?.label === '로그인 폼 연결')).toBe(true);
      expect(starterNodes.some((node) => (
        node.kind === 'member-login'
        && node.content?.nextPath === '/ko/account'
        && node.content?.showSignup === true
      ))).toBe(true);
    } finally {
      const cleanupPageId = createdLoginPageId ?? await pageIdBySlug(page, 'login').catch(() => null);
      if (cleanupPageId && cleanupPageId !== existingLoginPageId) {
        await page.request.delete(`/api/builder/site/pages/${cleanupPageId}?locale=ko`, {
          headers: mutationHeaders(`missing-member-login-${cleanupPageId}`),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('creates member account starter pages with account summary widgets', async ({ page }) => {
    const existingAccountPageId = await pageIdBySlug(page, 'account');
    const existingProfilePageId = await pageIdBySlug(page, 'account/profile');
    test.skip(Boolean(existingAccountPageId || existingProfilePageId), 'account/profile builder page already exists');

    let createdAccountPageId: string | null = null;
    let createdProfilePageId: string | null = null;
    try {
      await page.setViewportSize({ width: 2200, height: 900 });
      await openBuilder(page, '/ko/admin-builder?memberPreview=premium');
      const editorUrl = page.url();

      const accountLink = page.locator('.builder-site-header .utility-member-nav [data-member-role-link="account"]').first();
      await expect(accountLink).toBeVisible();
      await accountLink.click();

      await expect.poll(() => page.url()).toBe(editorUrl);
      const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(pagesDrawer).toBeVisible({ timeout: 20_000 });
      const missingCard = pagesDrawer.locator('[data-builder-missing-page-card="true"][data-builder-missing-page-slug="account"]');
      await expect(missingCard).toBeVisible();
      await expect(missingCard).toContainText('/account');

      await missingCard.locator('[data-builder-create-missing-page="true"]').click();
      await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/account', {
        timeout: 20_000,
      });

      const accountPage = await pageMetaBySlug(page, 'account');
      createdAccountPageId = accountPage?.pageId ?? null;
      expect(createdAccountPageId).toBeTruthy();
      expect(accountPage?.memberAccess).toMatchObject({ requireLogin: true });
      const starterNodes = await draftNodesByPageId(page, createdAccountPageId!);
      expect(starterNodes.some((node) => node.kind === 'text' && node.content?.text === '내 계정')).toBe(true);
      expect(starterNodes.some((node) => (
        node.kind === 'member-account-summary'
        && node.content?.profileHref === '/ko/account/profile'
        && node.content?.bookingsHref === '/ko/account/bookings'
        && node.content?.showBookings === true
        && node.content?.showPremium === true
      ))).toBe(true);
      expect(starterNodes.some((node) => (
        node.kind === 'member-profile-form'
        && node.content?.nameLabel === '이름'
        && node.content?.phoneLabel === '전화번호'
        && node.content?.saveLabel === '프로필 저장'
        && node.content?.loginHref === '/ko/login?next=/ko/account'
      ))).toBe(true);

      const profileLink = page.locator('[data-builder-member-account-summary="true"] [data-builder-member-account-link="profile"]').first();
      await expect(profileLink).toBeVisible();
      await profileLink.click();
      await expect.poll(() => page.url()).toBe(editorUrl);
      const profilePagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(profilePagesDrawer).toBeVisible({ timeout: 20_000 });
      const profileMissingCard = profilePagesDrawer.locator('[data-builder-missing-page-card="true"][data-builder-missing-page-slug="account/profile"]');
      await expect(profileMissingCard).toBeVisible();
      await expect(profileMissingCard).toContainText('/account/profile');

      await profileMissingCard.locator('[data-builder-create-missing-page="true"]').click();
      await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/account/profile', {
        timeout: 20_000,
      });

      const profilePage = await pageMetaBySlug(page, 'account/profile');
      createdProfilePageId = profilePage?.pageId ?? null;
      expect(createdProfilePageId).toBeTruthy();
      expect(profilePage?.memberAccess).toMatchObject({ requireLogin: true });
      const profileStarterNodes = await draftNodesByPageId(page, createdProfilePageId!);
      expect(profileStarterNodes.some((node) => node.kind === 'text' && node.content?.text === '회원 프로필')).toBe(true);
      expect(profileStarterNodes.some((node) => (
        node.kind === 'member-profile-form'
        && node.content?.saveLabel === '프로필 저장'
        && node.content?.loginHref === '/ko/login?next=/ko/account/profile'
      ))).toBe(true);
    } finally {
      const cleanupProfilePageId = createdProfilePageId ?? await pageIdBySlug(page, 'account/profile').catch(() => null);
      if (cleanupProfilePageId && cleanupProfilePageId !== existingProfilePageId) {
        await page.request.delete(`/api/builder/site/pages/${cleanupProfilePageId}?locale=ko`, {
          headers: mutationHeaders(`missing-member-profile-${cleanupProfilePageId}`),
          failOnStatusCode: false,
        });
      }
      const cleanupPageId = createdAccountPageId ?? await pageIdBySlug(page, 'account').catch(() => null);
      if (cleanupPageId && cleanupPageId !== existingAccountPageId) {
        await page.request.delete(`/api/builder/site/pages/${cleanupPageId}?locale=ko`, {
          headers: mutationHeaders(`missing-member-account-${cleanupPageId}`),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('creates member account summary bookings starter page', async ({ page }) => {
    const existingAccountPageId = await pageIdBySlug(page, 'account');
    const existingBookingsPageId = await pageIdBySlug(page, 'account/bookings');
    test.skip(Boolean(existingAccountPageId || existingBookingsPageId), 'account/bookings builder page already exists');

    let createdAccountPageId: string | null = null;
    let createdBookingsPageId: string | null = null;
    try {
      await page.setViewportSize({ width: 2200, height: 900 });
      await openBuilder(page, '/ko/admin-builder?memberPreview=premium');
      const editorUrl = page.url();

      const accountLink = page.locator('.builder-site-header .utility-member-nav [data-member-role-link="account"]').first();
      await expect(accountLink).toBeVisible();
      await accountLink.click();

      await expect.poll(() => page.url()).toBe(editorUrl);
      const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(pagesDrawer).toBeVisible({ timeout: 20_000 });
      const missingCard = pagesDrawer.locator('[data-builder-missing-page-card="true"][data-builder-missing-page-slug="account"]');
      await expect(missingCard).toBeVisible();

      await missingCard.locator('[data-builder-create-missing-page="true"]').click();
      await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/account', {
        timeout: 20_000,
      });

      const accountPage = await pageMetaBySlug(page, 'account');
      createdAccountPageId = accountPage?.pageId ?? null;
      expect(createdAccountPageId).toBeTruthy();

      const bookingsLink = page.locator('[data-builder-member-account-summary="true"] [data-builder-member-account-link="bookings"]').first();
      await expect(bookingsLink).toBeVisible();
      await bookingsLink.click();
      await expect.poll(() => page.url()).toBe(editorUrl);
      const bookingsPagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(bookingsPagesDrawer).toBeVisible({ timeout: 20_000 });
      const bookingsMissingCard = bookingsPagesDrawer.locator('[data-builder-missing-page-card="true"][data-builder-missing-page-slug="account/bookings"]');
      await expect(bookingsMissingCard).toBeVisible();
      await expect(bookingsMissingCard).toContainText('/account/bookings');

      await bookingsMissingCard.locator('[data-builder-create-missing-page="true"]').click();
      await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/account/bookings', {
        timeout: 20_000,
      });

      const bookingsPage = await pageMetaBySlug(page, 'account/bookings');
      createdBookingsPageId = bookingsPage?.pageId ?? null;
      expect(createdBookingsPageId).toBeTruthy();
      expect(bookingsPage?.memberAccess).toMatchObject({ requireLogin: true });
      const bookingsStarterNodes = await draftNodesByPageId(page, createdBookingsPageId!);
      expect(bookingsStarterNodes.some((node) => node.kind === 'text' && node.content?.text === '내 예약')).toBe(true);
      expect(bookingsStarterNodes.some((node) => (
        node.kind === 'member-bookings-list'
        && node.content?.upcomingLabel === '다가오는 예약'
        && node.content?.pastLabel === '지난 예약'
        && node.content?.showPast === true
        && node.content?.loginHref === '/ko/login?next=/ko/account/bookings'
      ))).toBe(true);
    } finally {
      const cleanupBookingsPageId = createdBookingsPageId ?? await pageIdBySlug(page, 'account/bookings').catch(() => null);
      if (cleanupBookingsPageId && cleanupBookingsPageId !== existingBookingsPageId) {
        await page.request.delete(`/api/builder/site/pages/${cleanupBookingsPageId}?locale=ko`, {
          headers: mutationHeaders(`missing-member-bookings-${cleanupBookingsPageId}`),
          failOnStatusCode: false,
        });
      }
      const cleanupPageId = createdAccountPageId ?? await pageIdBySlug(page, 'account').catch(() => null);
      if (cleanupPageId && cleanupPageId !== existingAccountPageId) {
        await page.request.delete(`/api/builder/site/pages/${cleanupPageId}?locale=ko`, {
          headers: mutationHeaders(`missing-member-account-bookings-${cleanupPageId}`),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('creates protected missing premium member pages with access metadata', async ({ page }) => {
    const existingPremiumPageId = await pageIdBySlug(page, 'account/premium');
    test.skip(Boolean(existingPremiumPageId), 'premium account builder page already exists');

    let createdPremiumPageId: string | null = null;
    try {
      await page.setViewportSize({ width: 2200, height: 900 });
      await openBuilder(page, '/ko/admin-builder?memberPreview=premium&memberCreatePremium=1');
      const editorUrl = page.url();

      const premiumLink = page.locator('.builder-site-header .utility-member-nav [data-member-role-link="premium"]').first();
      await expect(premiumLink).toBeVisible();
      await premiumLink.click();

      await expect.poll(() => page.url()).toBe(editorUrl);
      const pagesDrawer = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
      await expect(pagesDrawer).toBeVisible({ timeout: 20_000 });
      const missingCard = pagesDrawer.locator('[data-builder-missing-page-card="true"][data-builder-missing-page-slug="account/premium"]');
      await expect(missingCard).toBeVisible();
      await expect(missingCard).toContainText('/account/premium');

      await missingCard.locator('[data-builder-create-missing-page="true"]').click();
      await expect(page.locator('header[class*="topBar"] [title="페이지 선택"]')).toContainText('/account/premium', {
        timeout: 20_000,
      });

      const premiumPage = await pageMetaBySlug(page, 'account/premium');
      createdPremiumPageId = premiumPage?.pageId ?? null;
      expect(createdPremiumPageId).toBeTruthy();
      expect(premiumPage?.memberAccess).toMatchObject({
        requireLogin: true,
        allowedRoles: ['premium', 'admin'],
      });
      const starterNodes = await draftNodesByPageId(page, createdPremiumPageId!);
      expect(starterNodes.some((node) => node.kind === 'text' && node.content?.text === '프리미엄 멤버십')).toBe(true);

      await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
      await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      const premiumRow = page.locator(`[data-builder-page-row="${createdPremiumPageId}"]`).first();
      await expect(premiumRow).toBeVisible();
      await expect(premiumRow).toHaveAttribute('data-builder-page-member-access', 'premium');
      await expect(premiumRow.locator('[data-builder-page-member-access-badge="premium"]')).toContainText(/PREMIUM|프리미엄/);

      await premiumRow.hover();
      await premiumRow.getByRole('button', { name: '페이지 메뉴' }).click();
      const accessResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PATCH'
        && response.url().includes(`/api/builder/site/pages/${createdPremiumPageId}`)
      ));
      await premiumRow.locator('[data-builder-set-member-access="public"]').click();
      const accessResponse = await accessResponsePromise;
      expect(accessResponse.status()).toBe(200);
      const accessPayload = (await accessResponse.json()) as { ok?: boolean; page?: TestPageMeta; error?: string };
      expect(accessPayload.ok, accessPayload.error).toBe(true);
      expect(accessPayload.page?.memberAccess).toBeUndefined();
      await expect(premiumRow).toHaveAttribute('data-builder-page-member-access', 'public');
      const publicPremiumPage = await pageMetaBySlug(page, 'account/premium');
      expect(publicPremiumPage?.memberAccess).toBeUndefined();

      await premiumRow.hover();
      await premiumRow.getByRole('button', { name: '페이지 메뉴' }).click();
      await premiumRow.locator('[data-builder-open-member-access-settings]').click();
      const accessDialog = page.getByRole('dialog', { name: '회원 권한 설정' });
      await expect(accessDialog).toBeVisible();
      await accessDialog.locator('[data-builder-member-access-mode="true"]').selectOption('member');
      await accessDialog.locator('[data-builder-member-access-redirect="true"]').selectOption('/ko/contact');
      await accessDialog
        .locator('[data-builder-member-access-custom-redirect="true"]')
        .fill('/ko/login?next=/ko/account/premium');
      const settingsResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PATCH'
        && response.url().includes(`/api/builder/site/pages/${createdPremiumPageId}`)
      ));
      await accessDialog.locator('[data-builder-member-access-save="true"]').click();
      const settingsResponse = await settingsResponsePromise;
      expect(settingsResponse.status()).toBe(200);
      const settingsPayload = (await settingsResponse.json()) as { ok?: boolean; page?: TestPageMeta; error?: string };
      expect(settingsPayload.ok, settingsPayload.error).toBe(true);
      expect(settingsPayload.page?.memberAccess).toMatchObject({
        requireLogin: true,
        redirectPath: '/ko/login?next=/ko/account/premium',
      });
      expect(settingsPayload.page?.memberAccess?.allowedRoles).toBeUndefined();
      await expect(accessDialog).toHaveCount(0);
      await expect(premiumRow).toHaveAttribute('data-builder-page-member-access', 'member');
      const memberPremiumPage = await pageMetaBySlug(page, 'account/premium');
      expect(memberPremiumPage?.memberAccess).toMatchObject({
        requireLogin: true,
        redirectPath: '/ko/login?next=/ko/account/premium',
      });

      await premiumRow.hover();
      await premiumRow.getByRole('button', { name: '페이지 메뉴' }).click();
      await premiumRow.locator('[data-builder-open-member-access-settings]').click();
      const pickerDialog = page.getByRole('dialog', { name: '회원 권한 설정' });
      await expect(pickerDialog).toBeVisible();
      await pickerDialog.locator('[data-builder-member-access-page-search="true"]').fill('contact');
      await pickerDialog.locator('[data-builder-member-access-page-choice="/ko/contact"]').click();
      await expect(pickerDialog.locator('[data-builder-member-access-custom-redirect="true"]')).toHaveValue('/ko/contact');
      const pickerResponsePromise = page.waitForResponse((response) => (
        response.request().method() === 'PATCH'
        && response.url().includes(`/api/builder/site/pages/${createdPremiumPageId}`)
      ));
      await pickerDialog.locator('[data-builder-member-access-save="true"]').click();
      const pickerResponse = await pickerResponsePromise;
      expect(pickerResponse.status()).toBe(200);
      const pickerPayload = (await pickerResponse.json()) as { ok?: boolean; page?: TestPageMeta; error?: string };
      expect(pickerPayload.ok, pickerPayload.error).toBe(true);
      expect(pickerPayload.page?.memberAccess).toMatchObject({
        requireLogin: true,
        redirectPath: '/ko/contact',
      });
      await expect(pickerDialog).toHaveCount(0);
      const pickerPremiumPage = await pageMetaBySlug(page, 'account/premium');
      expect(pickerPremiumPage?.memberAccess).toMatchObject({
        requireLogin: true,
        redirectPath: '/ko/contact',
      });
    } finally {
      const cleanupPageId = createdPremiumPageId ?? await pageIdBySlug(page, 'account/premium').catch(() => null);
      if (cleanupPageId && cleanupPageId !== existingPremiumPageId) {
        await page.request.delete(`/api/builder/site/pages/${cleanupPageId}?locale=ko`, {
          headers: mutationHeaders(`missing-member-premium-${cleanupPageId}`),
          failOnStatusCode: false,
        });
      }
    }
  });

  test('lets the top bar preview authenticated member chrome states', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?memberPreview=free');

    const memberPreview = page.locator('[data-builder-member-preview-mode="true"]').first();
    await expect(memberPreview).toBeVisible();
    await expect(memberPreview).toHaveValue('free');
    await expect(page.locator('.builder-site-header .utility-member-nav [data-member-role-link="account"]').first()).toBeVisible();
    await expect(page.locator('.builder-site-header .utility-member-nav [data-member-role-link="premium"]')).toHaveCount(0);

    await memberPreview.selectOption('premium');
    await expect(memberPreview).toHaveValue('premium');
    await expect(page.locator('.builder-site-header .utility-member-nav [data-member-role-link="account"]').first()).toBeVisible();
    await expect(page.locator('.builder-site-header .utility-member-nav [data-member-role-link="premium"]').first()).toBeVisible();

    await memberPreview.selectOption('signed-out');
    await expect(memberPreview).toHaveValue('signed-out');
    await expect(page.locator('.builder-site-header .utility-member-nav [data-member-role-link="login"]').first()).toBeVisible();
  });

  test('keeps compact authenticated member links inside the editor shell', async ({ page }) => {
    for (const roleLink of ['account-mobile', 'premium-mobile']) {
      await page.setViewportSize({ width: 1280, height: 900 });
      await openBuilder(page, `/ko/admin-builder?memberPreview=premium&mobileMemberAccountHeader=${roleLink}`);
      const editorUrl = page.url();
      const canvas = page.getByRole('application', { name: 'Canvas editor' });

      const rail = page.locator('[class*="iconRail"]').first();
      await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
      await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
      await expectCompactHeader(page);

      await page.locator('.builder-site-header .mobile-toggle').first().click();
      await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
      const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
      await expect(mobileDrawer).toBeVisible();
      const memberLink = mobileDrawer.locator(`[data-member-role-link="${roleLink}"]`).first();
      await expect(memberLink).toBeVisible();
      await memberLink.click();

      await expect.poll(() => page.url()).toBe(editorUrl);
      await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
      const openDrawer = page.locator('aside[aria-hidden="false"]');
      await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
      await expect(openDrawer).toHaveCount(1);
      await expect(canvas).toBeVisible();
    }
  });

  test('keeps compact member logout inside the editor shell', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openBuilder(page, '/ko/admin-builder?memberPreview=premium&mobileMemberLogout=1');
    const editorUrl = page.url();
    const canvas = page.getByRole('application', { name: 'Canvas editor' });

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Navigation$|^내비게이션$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Navigation|내비게이션/ }).first()).toBeVisible();
    await expectCompactHeader(page);

    await page.locator('.builder-site-header .mobile-toggle').first().click();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    const mobileDrawer = page.locator('.builder-site-header .site-mobile-nav-drawer.open').first();
    await expect(mobileDrawer).toBeVisible();
    const logoutButton = mobileDrawer.locator('[data-member-role-link="logout-mobile"]').first();
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();

    await expect.poll(() => page.url()).toBe(editorUrl);
    await expect(page.locator('.builder-site-header .site-mobile-nav-drawer.open')).toHaveCount(0);
    const openDrawer = page.locator('aside[aria-hidden="false"]');
    await expect(openDrawer.filter({ hasText: /Pages|페이지/ }).first()).toBeVisible({ timeout: 20_000 });
    await expect(openDrawer).toHaveCount(1);
    await expect(canvas).toBeVisible();
  });

  test('closes open side drawers when expanded public header links switch pages', async ({ page }) => {
    await page.setViewportSize({ width: 2200, height: 900 });
    await openBuilder(page, '/ko/admin-builder?headerNavigateWithDrawer=columns');

    const rail = page.locator('[class*="iconRail"]').first();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first()).toBeVisible();
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
