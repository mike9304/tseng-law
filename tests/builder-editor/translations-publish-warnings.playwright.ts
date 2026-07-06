import { expect, test } from '@playwright/test';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import {
  DASHBOARD_TEST_LOCALES,
  seededTranslationSite,
} from './helpers/translations-dashboard';

test.describe('translation publish warnings', () => {
  let originalSite: Awaited<ReturnType<typeof readSiteDocument>> | null = null;

  test.beforeEach(async () => {
    originalSite = await readSiteDocument('default', 'ko');
    await writeSiteDocument(seededTranslationSite());
  });

  test.afterEach(async () => {
    if (originalSite) {
      await writeSiteDocument(originalSite).catch(() => undefined);
      originalSite = null;
    }
  });

  for (const locale of DASHBOARD_TEST_LOCALES) {
    const copy = getTranslationCopy(locale);

    test(`${locale} publish-warning actions open the exact manager review`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations?sourceLocale=ko`, {
        waitUntil: 'domcontentloaded',
      });

      const action = page.locator('[data-translation-publish-warning-action]').first();
      await expect(action).toBeVisible();
      await expect(action).toHaveText(copy.publishReviewAction);

      const href = await action.getAttribute('href');
      if (!href) throw new Error('Expected publish-warning review action to include an href');
      const expectedUrl = new URL(href, page.url());
      const expectedSearch = expectedUrl.searchParams.get('search');
      const expectedStatus = expectedUrl.searchParams.get('status') ?? 'all';
      const expectedTarget = expectedUrl.searchParams.get('target');

      expect(expectedUrl.searchParams.get('sourceLocale')).toBe('ko');
      expect(expectedUrl.searchParams.get('category')).toBe('pages');
      expect(expectedSearch).toBeTruthy();
      expect(expectedTarget).toBeTruthy();
      await expect(action).toHaveAttribute('href', /category=pages/);
      await expect(action).toHaveAttribute('href', /search=/);
      await expect(action).toHaveAttribute('href', /target=/);

      await action.click();
      await page.waitForURL((url) => (
        url.searchParams.get('sourceLocale') === 'ko' &&
        url.searchParams.get('category') === 'pages' &&
        url.searchParams.get('search') === expectedSearch &&
        (url.searchParams.get('status') ?? 'all') === expectedStatus &&
        url.searchParams.get('target') === expectedTarget
      ));

      await expect(page.locator('[data-translation-search-input="true"]')).toHaveValue(expectedSearch ?? '');
      await expect(page.locator('select').first()).toHaveValue(expectedStatus);
      await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /search=/);
      await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /target=/);

      const screenshotPath = process.env.TRANSLATION_PUBLISH_WARNING_SCREENSHOT_PATH;
      if (screenshotPath) {
        await page.screenshot({ path: screenshotPath, fullPage: true });
      }
    });
  }
});
