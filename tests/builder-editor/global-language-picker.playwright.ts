import { expect, test, type Page } from '@playwright/test';
import { PUBLIC_LANGUAGE_AUTONYMS, PUBLIC_LOCALES_8, type PublicLocale8 } from '@/lib/public-guidance';
import { LANGUAGE_PICKER_COPY } from '@/lib/public-language-registry';
import { listColumnSlugsFromFs } from './column-corpus';

const DESKTOP = { width: 1440, height: 1000 } as const;
const MOBILE = { width: 390, height: 844 } as const;

function header(page: Page) {
  return page.locator('header[data-public-site-header]');
}

function languageDialog(page: Page) {
  return page.locator('[role="dialog"][aria-modal="true"][aria-labelledby]');
}

async function dismissCinematic(page: Page): Promise<void> {
  const cinematicScroll = page.locator('a.cinematic-opening__scroll').first();
  if (await cinematicScroll.isVisible()) {
    await cinematicScroll.click();
  }
}

async function openDesktopPicker(page: Page, locale: PublicLocale8) {
  const trigger = header(page)
    .locator('.header-utility button[aria-haspopup="dialog"]')
    .filter({ hasText: new RegExp('.') })
    .first();
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute(
    'aria-label',
    `${LANGUAGE_PICKER_COPY[locale].open}: ${PUBLIC_LANGUAGE_AUTONYMS[locale]}`,
  );
  await trigger.click();
  return trigger;
}

test.describe('global language picker public chrome', () => {
  for (const locale of ['en', 'ar'] as const) {
    test(`${locale} @1440 opens 11-language dialog, keeps one h1, and returns focus on Escape`, async ({
      page,
    }) => {
      await page.setViewportSize(DESKTOP);
      const response = await page.goto(`/${locale}/services`, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), `/${locale}/services`).toBe(200);
      await dismissCinematic(page);

      const pageH1 = page.locator('h1');
      await expect(pageH1).toHaveCount(1);

      const trigger = await openDesktopPicker(page, locale);
      const dialog = languageDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('a[href]')).toHaveCount(PUBLIC_LOCALES_8.length);
      await expect(dialog.locator('a[aria-current="page"]')).toHaveCount(1);
      await expect(dialog.locator('a[aria-current="page"]')).toHaveAttribute(
        'href',
        new RegExp(`^/${locale}(/|$)`),
      );
      await expect(dialog.getByRole('heading', { level: 2 })).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);

      await page.keyboard.press('Escape');
      await expect(languageDialog(page)).toHaveCount(0);
      await expect.poll(async () =>
        page.evaluate(() => {
          const active = document.activeElement;
          return active instanceof HTMLElement ? active.getAttribute('aria-haspopup') : null;
        }),
      ).toBe('dialog');
      await expect(trigger).toBeFocused();
    });
  }

  test('vi @390 opens the globe from the drawer as a full-screen overlay with 44px close', async ({
    page,
  }) => {
    await page.setViewportSize(MOBILE);
    const response = await page.goto('/vi/services', { waitUntil: 'domcontentloaded' });
    expect(response?.status(), '/vi/services').toBe(200);
    await dismissCinematic(page);

    const toggle = header(page).locator('button.mobile-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();

    const drawer = page.locator('#public-mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    const globe = drawer.locator('button[aria-haspopup="dialog"]');
    await expect(globe).toHaveCount(1);
    await expect(globe).toHaveAttribute(
      'aria-label',
      `${LANGUAGE_PICKER_COPY.vi.open}: ${PUBLIC_LANGUAGE_AUTONYMS.vi}`,
    );
    await globe.click();

    const dialog = languageDialog(page);
    await expect(dialog).toBeVisible();
    await expect(drawer).toBeHidden();
    expect(
      await page.evaluate(() => getComputedStyle(document.body).overflow),
    ).toBe('hidden');

    const dialogBox = await dialog.boundingBox();
    expect(dialogBox, 'fullscreen overlay box').toBeTruthy();
    expect(dialogBox?.width ?? 0).toBeGreaterThanOrEqual(MOBILE.width - 1);
    expect(dialogBox?.height ?? 0).toBeGreaterThanOrEqual(MOBILE.height - 1);

    const close = dialog.getByRole('button', { name: LANGUAGE_PICKER_COPY.vi.close });
    await expect(close).toBeVisible();
    const closeBox = await close.boundingBox();
    expect(closeBox?.width ?? 0).toBeGreaterThanOrEqual(44);
    expect(closeBox?.height ?? 0).toBeGreaterThanOrEqual(44);

    await page.keyboard.press('Escape');
    await expect(languageDialog(page)).toHaveCount(0);
    await expect.poll(async () =>
      page.evaluate(() => {
        const active = document.activeElement;
        return active instanceof HTMLElement ? active.className : '';
      }),
    ).toMatch(/mobile-toggle/);
    await expect(toggle).toBeFocused();
  });

  test('WO-O22 A: language options from JA public pages never 404', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    const sampleSlug = listColumnSlugsFromFs('vi')[0];
    expect(sampleSlug, 'a vi-translated slug').toBeTruthy();

    const paths = [
      `/ja/columns/${sampleSlug}`,
      '/ja/videos',
      '/ja/korean-lawyer-in-taiwan',
      '/ja',
      '/ja/columns',
    ];

    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), path).toBe(200);
      await dismissCinematic(page);

      await openDesktopPicker(page, 'ja');
      const dialog = languageDialog(page);
      await expect(dialog).toBeVisible();
      const options = dialog.locator('a[href]');
      await expect(options, `${path} picker option count`).toHaveCount(PUBLIC_LOCALES_8.length);

      const hrefs = await options.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href') ?? ''),
      );
      expect(hrefs.filter(Boolean), `${path} every option is a link`).toHaveLength(
        PUBLIC_LOCALES_8.length,
      );

      for (const href of hrefs) {
        const probe = await page.request.get(href);
        expect(probe.status(), `${path} -> ${href}`).toBe(200);
      }

      await page.keyboard.press('Escape');
      await expect(languageDialog(page)).toHaveCount(0);
    }
  });
});
