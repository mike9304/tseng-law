import { expect, test, type Page } from '@playwright/test';
import { openBuilder, selectTextNode, stabilizeEditorVisuals } from './helpers/editor';

const adminRoundTrips = [
  { href: '/ko/admin-builder/cms' },
  { href: '/ko/admin-builder/apps' },
  { href: '/ko/admin-builder/ai-generator' },
] as const;

async function expectHomeHeroImageLoaded(page: Page): Promise<void> {
  const imageNode = page.locator('[data-node-id="home-hero-media-image"]:visible').first();
  await expect(imageNode).toBeVisible({ timeout: 30_000 });
  await expect.poll(async () => imageNode.evaluate((element) => {
    const image = element.querySelector('img');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  })).toBe(true);
}

async function expectPublicHomeHeroImageLoaded(page: Page): Promise<void> {
  const imageNode = page
    .locator('[data-node-id="home-hero-media-image"]:visible, .builder-pub-node[data-node-id="home-hero"] .hero-media-image:visible')
    .first();
  await expect(imageNode).toBeVisible({ timeout: 15_000 });
  await expect.poll(async () => imageNode.evaluate((element) => {
    const image = element instanceof HTMLImageElement ? element : element.querySelector('img');
    return image instanceof HTMLImageElement
      && image.complete
      && image.naturalWidth > 0
      && Boolean(image.currentSrc || image.src);
  }), { timeout: 15_000 }).toBe(true);
}

async function expectPublishedHeaderNotOverlapping(page: Page): Promise<void> {
  const header = page.locator('.builder-site-header, .site-header, .header').first();
  await expect(header).toBeVisible();
  await expect(header.locator('.main-nav:visible, .mobile-toggle:visible').first()).toBeVisible();
  const overlaps = await header.locator('.header-main-inner').evaluate((container) => {
    const children = Array.from(container.children).filter((child): child is HTMLElement => {
      if (!(child instanceof HTMLElement)) return false;
      const rect = child.getBoundingClientRect();
      const style = window.getComputedStyle(child);
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0;
    });
    const collisions: string[] = [];
    children.forEach((left, leftIndex) => {
      const leftRect = left.getBoundingClientRect();
      children.slice(leftIndex + 1).forEach((right) => {
        const rightRect = right.getBoundingClientRect();
        const intersects = leftRect.left < rightRect.right - 1
          && leftRect.right > rightRect.left + 1
          && leftRect.top < rightRect.bottom - 1
          && leftRect.bottom > rightRect.top + 1;
        if (intersects) {
          collisions.push(`${left.className || left.tagName} overlaps ${right.className || right.tagName}`);
        }
      });
    });
    return collisions;
  });
  expect(overlaps).toEqual([]);
}

async function clickAdminBackToEditor(page: Page): Promise<void> {
  const backLink = page.locator('[data-builder-admin-rail-back="true"]').first();
  await expect(backLink).toHaveAttribute('href', '/ko/admin-builder');
  await backLink.click({ noWaitAfter: true });
  await expect(page).toHaveURL(/\/ko\/admin-builder(?:\?|$)/, { timeout: 30_000 });
}

async function openPagesPanel(page: Page) {
  await page.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
  const panel = page.locator('[data-page-switcher="true"]').first();
  await expect(panel).toBeVisible();
  await expect(panel.locator('[data-builder-page-row]').first()).toBeVisible({ timeout: 30_000 });
  return panel;
}

async function readPageRows(page: Page) {
  return page.locator('[data-builder-page-row]').evaluateAll((elements) => elements.map((element) => ({
    id: element.getAttribute('data-builder-page-row') ?? '',
    slug: element.getAttribute('data-builder-page-slug') ?? '',
    text: element.textContent?.replace(/\s+/g, ' ').trim() ?? '',
  })));
}

async function dragEditableNodeToCreateLocalHistory(page: Page): Promise<void> {
  const target = await selectTextNode(page);
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error('Expected an editable node to create local history.');
  const x = box.x + box.width / 2;
  const y = box.y + Math.min(24, Math.max(8, box.height / 3));
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 28, y + 18, { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(120);
}

async function clickBuilderHeaderNav(page: Page, href: string): Promise<void> {
  const link = page
    .locator(`.builder-site-header .nav-link[href="${href}"]:visible`)
    .first();
  await expect(link).toBeVisible({ timeout: 30_000 });
  await link.click({ force: true });
}

async function clickPublicHeaderLink(page: Page, href: string): Promise<void> {
  const link = page
    .locator([
      `.builder-site-header .nav-link[href="${href}"]:visible`,
      `.site-header .nav-link[href="${href}"]:visible`,
      `.header .nav-link[href="${href}"]:visible`,
      `.main-nav .nav-link[href="${href}"]:visible`,
    ].join(', '))
    .first();
  await expect(link).toBeVisible({ timeout: 30_000 });
  await link.click();
}

async function clickPublicHomeLogo(page: Page, href: string): Promise<void> {
  const link = page
    .locator([
      `.builder-site-header .header-logo[href="${href}"]:visible`,
      `.site-header .header-logo[href="${href}"]:visible`,
      `.header .header-logo[href="${href}"]:visible`,
      `a.header-logo[href="${href}"]:visible`,
    ].join(', '))
    .first();
  await expect(link).toBeVisible({ timeout: 30_000 });
  await link.click();
}

test('/ko/admin-builder keeps the home hero image after switching pages and returning home', async ({ page }) => {
  await openBuilder(page, `/ko/admin-builder?homeImageNavigation=${Date.now().toString(36)}`);
  await expectHomeHeroImageLoaded(page);

  let panel = await openPagesPanel(page);
  const rows = await readPageRows(page);
  const home = rows.find((row) => row.slug === '' || row.slug === '/' || row.slug === 'home' || row.text.includes('대표'));
  const target = rows.find((row) => row.id && row.id !== home?.id && row.slug !== '' && row.slug !== '/' && row.slug !== 'home');
  expect(home).toBeDefined();
  expect(target).toBeDefined();
  if (!home || !target) {
    throw new Error('Expected home and target page rows for navigation regression.');
  }

  await panel.locator(`[data-builder-page-row="${target.id}"]`).locator('button').nth(1).click();
  await expect(page.getByText(/Loaded page:/)).toBeVisible();

  panel = await openPagesPanel(page);
  const homeRow = panel.locator(`[data-builder-page-row="${home.id}"]`).first();
  await expect(homeRow).toBeVisible();
  await homeRow.locator('button').nth(1).click();

  await expectHomeHeroImageLoaded(page);
});

test('/ko/admin-builder keeps the home hero image after header navigation back to home', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 950 });
  await openBuilder(page, `/ko/admin-builder?headerRoundtrip=${Date.now().toString(36)}`);
  await expectHomeHeroImageLoaded(page);

  await clickBuilderHeaderNav(page, '/ko/services');
  await expect(page.getByText(/Loaded page:/)).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-node-id="home-hero-media-image"]:visible')).toHaveCount(0);

  const panel = await openPagesPanel(page);
  const rows = await readPageRows(page);
  const home = rows.find((row) => row.slug === '' || row.slug === '/' || row.slug === 'home' || row.text.includes('대표'));
  expect(home).toBeDefined();
  if (!home) {
    throw new Error('Expected a home page row after header navigation.');
  }
  await panel.locator(`[data-builder-page-row="${home.id}"]`).locator('button').nth(1).click();

  await expectHomeHeroImageLoaded(page);
});

test('/ko/admin-builder does not flash an empty canvas before the home image mounts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(`/ko/admin-builder?initialHomeMount=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await stabilizeEditorVisuals(page);
  await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });

  const emptyCanvasVisible = await page.getByText('페이지가 비어있습니다.').isVisible();
  const heroImageVisible = await page.locator('[data-node-id="home-hero-media-image"]:visible').first().isVisible();
  expect(emptyCanvasVisible).toBe(false);
  expect(heroImageVisible).toBe(true);
  await expectHomeHeroImageLoaded(page);
});

test('/ko/admin-builder keeps the home hero image after admin page round trips', async ({ page }) => {
  await openBuilder(page, `/ko/admin-builder?adminRoundtrip=${Date.now().toString(36)}`);
  await expectHomeHeroImageLoaded(page);

  for (const destination of adminRoundTrips) {
    await page.locator(`a[href="${destination.href}"]`).first().click();
    await expect(page).toHaveURL(new RegExp(`${destination.href}(?:\\?|$)`));

    await clickAdminBackToEditor(page);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
    await expectHomeHeroImageLoaded(page);
  }
});

test('/ko/admin-builder restores home immediately after leaving a locally edited page', async ({ page }) => {
  await openBuilder(page, `/ko/admin-builder?locallyEditedPageRoundtrip=${Date.now().toString(36)}`);
  await expectHomeHeroImageLoaded(page);

  const panel = await openPagesPanel(page);
  const rows = await readPageRows(page);
  const home = rows.find((row) => row.slug === '' || row.slug === '/' || row.slug === 'home' || row.text.includes('대표'));
  const target = rows.find((row) => row.slug === 'case-results')
    ?? rows.find((row) => row.id && row.id !== home?.id && row.slug !== '' && row.slug !== '/' && row.slug !== 'home');
  expect(home).toBeDefined();
  expect(target).toBeDefined();
  if (!home || !target) {
    throw new Error('Expected home and target page rows for local-history navigation regression.');
  }

  await panel.locator(`[data-builder-page-row="${target.id}"]`).locator('button').nth(1).click();
  await expect(page.getByText(/Loaded page:/)).toBeVisible();
  await dragEditableNodeToCreateLocalHistory(page);

  const homeDraftGate: { release?: () => void } = {};
  await page.route(`**/api/builder/site/pages/${home.id}/draft?locale=ko`, async (route) => {
    await new Promise<void>((resolve) => {
      homeDraftGate.release = resolve;
    });
    await route.continue().catch(() => undefined);
  });

  try {
    await page.locator('a[href="/ko/admin-builder/apps"]').first().click();
    await expect(page).toHaveURL(/\/ko\/admin-builder\/apps(?:\?|$)/);

    await clickAdminBackToEditor(page);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('페이지가 비어있습니다.')).toHaveCount(0);
    await expectHomeHeroImageLoaded(page);
  } finally {
    homeDraftGate.release?.();
    await page.unroute(`**/api/builder/site/pages/${home.id}/draft?locale=ko`).catch(() => undefined);
  }
});

test('/ko public home renders the published builder hero image after public navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(`/ko?publicHomeImage=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await expectPublicHomeHeroImageLoaded(page);
  await expectPublishedHeaderNotOverlapping(page);

  await page.goto('/ko/services', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/ko\/services(?:\?|$)/);
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/ko(?:\?|$)/);
  await expectPublicHomeHeroImageLoaded(page);
  await expectPublishedHeaderNotOverlapping(page);
});

test('/ko public home keeps the hero image after real header clicks', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 950 });
  await page.goto(`/ko?publicHeaderClicks=${Date.now().toString(36)}`, { waitUntil: 'domcontentloaded' });
  await expectPublicHomeHeroImageLoaded(page);

  await clickPublicHeaderLink(page, '/ko/services');
  await expect(page).toHaveURL(/\/ko\/services(?:\?|$)/);

  await clickPublicHomeLogo(page, '/ko');
  await expect(page).toHaveURL(/\/ko(?:\?|$)/);
  await expectPublicHomeHeroImageLoaded(page);
  await page.setViewportSize({ width: 1440, height: 950 });
  await expectPublishedHeaderNotOverlapping(page);
});
