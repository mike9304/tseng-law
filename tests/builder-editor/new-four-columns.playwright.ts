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

  test('WO-O22 D: a slug with no markdown file anywhere is a localized vi 404', async ({ page }) => {
    const pack = guidanceContent[LOCALE];
    // Every Korean slug now has a vi translation, so the "unknown slug 404s"
    // contract is probed with a slug that has no file in any locale. The
    // contract is unchanged; only the probe is.
    const missing = 'nonexistent-article';
    expect(listColumnSlugsFromFs('ko')).not.toContain(missing);
    expect(listColumnSlugsFromFs(LOCALE)).not.toContain(missing);

    const path = `/${LOCALE}/columns/${missing}`;
    const detail = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(detail?.status(), path).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(LOCALE));
    await expect(page.locator('[data-guidance-shell="true"]')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.notFoundTitle);
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots?.toLowerCase()).toMatch(/noindex/);
  });

  /**
   * WO-O22 A: the switcher offers all eight languages on every public page,
   * including the JA column detail and the JA-only routes that used to show
   * four, and none of those links may 404.
   */
  test('WO-O22 A: every public page offers all eight languages with live links', async ({
    page,
  }) => {
    const translatedSlugs = listColumnSlugsFromFs(LOCALE);
    const sampleSlug = translatedSlugs[0];
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

      const switcher = page
        .locator('header[data-public-site-header] .locale-flag-switcher')
        .first();
      const options = switcher.locator('.locale-flag-switcher-link');
      await expect(options, `${path} switcher option count`).toHaveCount(8);

      const hrefs = await options.evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href') ?? ''),
      );
      expect(hrefs.filter(Boolean), `${path} every option is a link`).toHaveLength(8);
      for (const locale of ['vi', 'id', 'th', 'fil'] as const) {
        expect(
          hrefs.some((href) => href === `/${locale}` || href.startsWith(`/${locale}/`)),
          `${path} -> ${locale}`,
        ).toBe(true);
      }

      // No option may point at a 404.
      for (const href of hrefs) {
        const probe = await page.request.get(href);
        expect(probe.status(), `${path} -> ${href}`).toBe(200);
      }
    }
  });

  test('WO-O22 A: a JA column detail links the same article in the new four', async ({ page }) => {
    const sampleSlug = listColumnSlugsFromFs(LOCALE)[0];
    const response = await page.goto(`/ja/columns/${sampleSlug}`, {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(200);

    for (const locale of ['vi', 'id', 'th', 'fil'] as const) {
      await expect(
        page.locator(
          `header[data-public-site-header] .locale-flag-switcher a[href="/${locale}/columns/${sampleSlug}"]`,
        ),
        `${locale} same-slug switcher link`,
      ).toHaveCount(1);
    }
  });
});
