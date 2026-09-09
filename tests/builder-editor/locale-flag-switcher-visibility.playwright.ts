import { expect, test, type Locator, type Page } from '@playwright/test';
import { PUBLIC_LANGUAGE_AUTONYMS, PUBLIC_LOCALES_8 } from '@/lib/public-guidance';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

const LOCALES = ['ko', 'vi'] as const;
const MOBILE_NAV_MAX_WIDTH = 1024;

async function dismissCinematic(page: Page): Promise<void> {
  const cinematicScroll = page.locator('a.cinematic-opening__scroll').first();
  if (await cinematicScroll.isVisible()) {
    await cinematicScroll.click();
  }
  await page.evaluate(() => {
    const site = document.querySelector('.site');
    if (site instanceof HTMLElement) {
      site.dataset.cinematicIntroVisible = 'false';
    }
    document.documentElement.removeAttribute('data-cinematic-intro-visible');
  });
}

async function openLocaleFlagSwitcher(
  page: Page,
  locale: (typeof LOCALES)[number],
  viewportWidth: number,
): Promise<Locator> {
  if (locale === 'vi') {
    const switcher = page.locator('[data-guidance-shell="true"] .locale-flag-switcher').first();
    const details = switcher.locator('details');
    await expect(details).toBeVisible();
    if ((await details.getAttribute('open')) === null) {
      await details.locator('summary').click();
    }
    await expect(details).toHaveAttribute('open', '');
    return switcher;
  }

  await dismissCinematic(page);

  if (viewportWidth <= MOBILE_NAV_MAX_WIDTH) {
    const toggle = page.locator('header[data-public-site-header] button.mobile-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    const drawer = page.locator('#public-mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    const switcher = drawer.locator('.locale-flag-switcher');
    const details = switcher.locator('details');
    await expect(details).toBeVisible();
    if ((await details.getAttribute('open')) === null) {
      await details.locator('summary').click();
    }
    await expect(details).toHaveAttribute('open', '');
    return switcher;
  }

  const switcher = page.locator('header[data-public-site-header] .locale-flag-switcher').first();
  const details = switcher.locator('details');
  await expect(details).toBeVisible();
  if ((await details.getAttribute('open')) === null) {
    await details.locator('summary').click();
  }
  await expect(details).toHaveAttribute('open', '');
  return switcher;
}

test.describe('locale flag switcher visibility', () => {
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} @${viewport.name} keeps every language option on top and in view`, async ({
        page,
      }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        const response = await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
        expect(response?.ok(), `/${locale} status`).toBeTruthy();
        await page.waitForLoadState('load');

        const switcher = await openLocaleFlagSwitcher(page, locale, viewport.width);
        const options = switcher.locator('.locale-flag-switcher-link');
        await expect(options).toHaveCount(PUBLIC_LOCALES_8.length);

        const menu = switcher.locator('ul');
        const menuBox = await menu.boundingBox();
        expect(menuBox, 'open menu box').toBeTruthy();
        expect(menuBox!.x).toBeGreaterThanOrEqual(-1);
        expect(menuBox!.y).toBeGreaterThanOrEqual(-1);
        expect(menuBox!.x + menuBox!.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(viewport.height + 1);

        for (const [index, optionLocale] of PUBLIC_LOCALES_8.entries()) {
          const option = options.nth(index);
          await expect(option).toBeVisible();
          await expect(option).toContainText(PUBLIC_LANGUAGE_AUTONYMS[optionLocale]);

          const coversSelf = await option.evaluate((element) => {
            const rect = element.getBoundingClientRect();
            const top = document.elementFromPoint(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
            );
            return Boolean(top && (top === element || element.contains(top)));
          });
          expect(coversSelf, `${locale} ${viewport.name} ${optionLocale} elementFromPoint`).toBe(
            true,
          );
        }
      });
    }
  }
});
