import { expect, test } from '@playwright/test';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';
import {
  DASHBOARD_TEST_LOCALES,
  seededTranslationSite,
} from './helpers/translations-dashboard';

test.describe('translations dashboard coverage drill-down', () => {
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

    test(`${locale} dashboard exposes per-locale coverage drill-down links`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations/dashboard?sourceLocale=ko`, { waitUntil: 'domcontentloaded' });

      const cmsCard = page.locator('[data-translation-dashboard-coverage-kind="cms"]');
      const outdatedDetail = cmsCard.locator('[data-translation-dashboard-coverage-detail="cms-zh-hant"]');
      await expect(outdatedDetail).toBeVisible();
      await expect(outdatedDetail).toContainText('zh-hant');
      await expect(outdatedDetail).toContainText(copy.dashboardOutdated);

      const outdatedLink = outdatedDetail.getByRole('link', { name: copy.dashboardReviewOutdated });
      await expect(outdatedLink).toHaveAttribute('href', /category=columns/);
      await expect(outdatedLink).toHaveAttribute('href', /status=outdated/);
      await expect(outdatedLink).toHaveAttribute('href', /target=zh-hant/);

      const mediaCard = page.locator('[data-translation-dashboard-coverage-kind="media"]');
      const missingDetail = mediaCard.locator('[data-translation-dashboard-coverage-detail="media-zh-hant"]');
      const missingLink = missingDetail.getByRole('link', { name: copy.dashboardReviewMissing });
      await expect(missingDetail).toContainText(copy.dashboardMissing);
      await expect(missingLink).toHaveAttribute('href', /category=pages/);
      await expect(missingLink).toHaveAttribute('href', /search=Alt/);
      await expect(missingLink).toHaveAttribute('href', /status=missing/);
      await expect(missingLink).toHaveAttribute('href', /target=zh-hant/);

      if (locale === 'ko' && process.env.TRANSLATION_DASHBOARD_SCREENSHOT_PATH) {
        await page.screenshot({
          path: process.env.TRANSLATION_DASHBOARD_SCREENSHOT_PATH,
          fullPage: true,
        });
      }
    });
  }
});
