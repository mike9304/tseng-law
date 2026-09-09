import { expect, test, type Page } from '@playwright/test';
import { guidanceContent } from '@/data/international-guidance-content';
import { publicDocumentLanguage } from '@/lib/public-guidance';
import { listColumnSlugsFromFs } from './column-corpus';

/**
 * WO-G23: new-four columns with on-disk translations (currently vi).
 *
 * The empty-corpus contract — `/vi/columns` stays a guidance index when
 * `src/content/columns-vi` has zero markdown files, and an untranslated slug
 * 404s — is already covered at unit level in
 * `src/lib/__tests__/columns-new-four-locales.test.ts` (temp dirs / missing
 * dirs; no repo fixtures). This browser spec does not re-assert that empty
 * path because every new-four locale in this worktree has at least one file.
 */
const LOCALE = 'vi' as const;

async function readHreflang(page: Page): Promise<Array<{ hreflang: string; href: string }>> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('link[rel="alternate"][hreflang]')).map((node) => ({
      hreflang: node.getAttribute('hreflang') ?? '',
      href: node.getAttribute('href') ?? '',
    })),
  );
}

test.describe('new-four columns with translations', () => {
  test('WO-G23: /vi/columns is ColumnsGrid plus original-language section', async ({ page }) => {
    const pack = guidanceContent[LOCALE];
    const translatedSlugs = listColumnSlugsFromFs(LOCALE);
    const koSlugs = listColumnSlugsFromFs('ko');
    expect(translatedSlugs.length, 'vi translation files').toBeGreaterThan(0);

    const index = await page.goto(`/${LOCALE}/columns`, { waitUntil: 'domcontentloaded' });
    expect(index?.status(), `/${LOCALE}/columns`).toBe(200);
    await expect(page.locator('[data-guidance-shell="true"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.pages.columns.title);
    await expect(page.locator('.columns-grid')).toBeVisible();
    await expect(page.locator('.columns-grid a.columns-card')).toHaveCount(translatedSlugs.length);
    await expect(page.locator('[data-columns-original-language="true"]')).toBeVisible();
    await expect(
      page.locator('[data-columns-original-language="true"] a[href*="/ko/columns/"]'),
    ).toHaveCount(koSlugs.filter((slug) => !translatedSlugs.includes(slug)).length);
    await expect(
      page.locator('header[data-public-site-header] .header-utility .locale-flag-switcher'),
    ).toHaveCount(1);
  });

  test('WO-G23: translated vi slug is 200 with html lang and ko+self hreflang', async ({
    page,
  }) => {
    const translatedSlugs = listColumnSlugsFromFs(LOCALE);
    expect(translatedSlugs.length, 'vi translation files').toBeGreaterThan(0);

    for (const slug of translatedSlugs) {
      const path = `/${LOCALE}/columns/${slug}`;
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(LOCALE));
      const alternates = await readHreflang(page);
      const tags = new Set(alternates.map((item) => item.hreflang));
      expect(tags.has(publicDocumentLanguage(LOCALE)), `${path} hreflang self`).toBe(true);
      expect(tags.has('ko'), `${path} hreflang ko original`).toBe(true);
      expect(
        alternates.some(
          (item) =>
            item.hreflang === publicDocumentLanguage(LOCALE) &&
            item.href.includes(`/${LOCALE}/columns/${slug}`),
        ),
        `${path} self alternate href`,
      ).toBe(true);
      expect(
        alternates.some(
          (item) => item.hreflang === 'ko' && item.href.includes(`/ko/columns/${slug}`),
        ),
        `${path} ko alternate href`,
      ).toBe(true);
    }
  });

  test('WO-G23: untranslated vi slug is localized 404', async ({ page }) => {
    const pack = guidanceContent[LOCALE];
    const translated = new Set(listColumnSlugsFromFs(LOCALE));
    const missing = listColumnSlugsFromFs('ko').find((slug) => !translated.has(slug));
    expect(missing, 'at least one untranslated Korean slug').toBeTruthy();

    const path = `/${LOCALE}/columns/${missing}`;
    const detail = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(detail?.status(), path).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(LOCALE));
    await expect(page.locator('[data-guidance-shell="true"]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.notFoundTitle);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots?.toLowerCase()).toMatch(/noindex/);
  });
});
