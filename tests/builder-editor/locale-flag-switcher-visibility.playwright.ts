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

function languageDialog(page: Page): Locator {
  return page.locator('[role="dialog"][aria-modal="true"][aria-labelledby]');
}

/**
 * O14 folded the guidance locales into the shared site chrome, so /vi is driven
 * through the same header picker as /ko. Open via the dialog trigger and read
 * `[role="dialog"] a[href]`.
 */
async function openLocaleFlagSwitcher(
  page: Page,
  viewportWidth: number,
): Promise<Locator> {
  await dismissCinematic(page);

  if (viewportWidth <= MOBILE_NAV_MAX_WIDTH) {
    const toggle = page.locator('header[data-public-site-header] button.mobile-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    const drawer = page.locator('#public-mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    const trigger = drawer.locator('button[aria-haspopup="dialog"]');
    await expect(trigger).toBeVisible();
    await trigger.click();
  } else {
    const trigger = page
      .locator('header[data-public-site-header] .header-utility button[aria-haspopup="dialog"]')
      .first();
    await expect(trigger).toBeVisible();
    await trigger.click();
  }

  const dialog = languageDialog(page);
  await expect(dialog).toBeVisible();
  // The panel slides in over 200ms (translateY 10px → 0); measure the settled box.
  await dialog.evaluate((element) =>
    Promise.all(
      [element, ...Array.from(element.querySelectorAll('*'))]
        .flatMap((node) => node.getAnimations({ subtree: false }))
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  return dialog;
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

        const dialog = await openLocaleFlagSwitcher(page, viewport.width);
        const options = dialog.locator('a[href]');
        await expect(options).toHaveCount(PUBLIC_LOCALES_8.length);

        const dialogBox = await dialog.boundingBox();
        expect(dialogBox, 'open dialog box').toBeTruthy();
        expect(dialogBox!.x).toBeGreaterThanOrEqual(-1);
        expect(dialogBox!.y).toBeGreaterThanOrEqual(-1);
        expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(viewport.width + 1);
        expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(viewport.height + 1);

        for (const optionLocale of PUBLIC_LOCALES_8) {
          const option = options.filter({ hasText: PUBLIC_LANGUAGE_AUTONYMS[optionLocale] });
          await expect(option).toHaveCount(1);
          await option.scrollIntoViewIfNeeded();
          await expect(option).toBeVisible();

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
