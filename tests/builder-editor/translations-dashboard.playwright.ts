import { expect, test } from '@playwright/test';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';
import {
  DASHBOARD_REFRESH_LABELS,
  DASHBOARD_TEST_LOCALES,
  refreshedTranslationSite,
  seededTranslationSite,
} from './helpers/translations-dashboard';

test.describe('translations dashboard', () => {
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

    test(`${locale} dashboard preserves filter state in the URL`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations/dashboard?sourceLocale=ko`, { waitUntil: 'domcontentloaded' });

      await expect(page.getByRole('heading', { name: copy.dashboardTitle })).toBeVisible();
      await expect(page.locator('[data-translation-dashboard-share-link="true"]')).toHaveAttribute('href', /sourceLocale=ko/);

      await page.getByRole('button', { name: copy.dashboardPublished }).click();
      await page.waitForFunction(() => new URLSearchParams(window.location.search).get('status') === 'published');
      await expect(page.getByRole('button', { name: copy.dashboardPublished })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('[data-translation-dashboard-share-link="true"]')).toHaveAttribute('href', /status=published/);

      const url = page.url();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForURL(url);
      await expect(page.getByRole('button', { name: copy.dashboardPublished })).toHaveAttribute('aria-pressed', 'true');

      await page.getByRole('button', { name: copy.dashboardReset }).click();
      await page.waitForFunction(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('sourceLocale') === 'ko' && !params.has('status');
      });
      await expect(page.locator('[data-translation-dashboard-share-link="true"]')).toHaveAttribute('href', /sourceLocale=ko/);
    });

    test(`${locale} dashboard accepts missing as an untranslated status alias`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations/dashboard?sourceLocale=ko&status=missing`, { waitUntil: 'domcontentloaded' });

      await expect(page.getByRole('heading', { name: copy.dashboardTitle })).toBeVisible();
      await page.waitForFunction(() => new URLSearchParams(window.location.search).get('status') === 'untranslated');
      await expect(page.getByRole('button', { name: copy.dashboardMissing })).toHaveAttribute('aria-pressed', 'true');
      await expect(page.getByRole('button', { name: copy.dashboardAll })).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('[data-translation-dashboard-share-link="true"]')).toHaveAttribute('href', /status=untranslated/);
    });

    test(`${locale} dashboard surfaces CMS, media, and app translation coverage`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations/dashboard?sourceLocale=ko`, { waitUntil: 'domcontentloaded' });

      const coverage = page.locator('[data-translation-dashboard-coverage="true"]');
      await expect(coverage).toBeVisible();
      await expect(page.locator('[data-translation-dashboard-coverage-kind="cms"]')).toContainText('50%');
      await expect(page.locator('[data-translation-dashboard-coverage-kind="media"]')).toContainText('50%');
      await expect(page.locator('[data-translation-dashboard-coverage-kind="apps"]')).toContainText('50%');
      await expect(coverage).toContainText('zh-hant');
      await expect(coverage).toContainText('en');
    });

    test(`${locale} dashboard refreshes coverage from the live API`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations/dashboard?sourceLocale=ko`, { waitUntil: 'domcontentloaded' });

      const cmsCoverage = page.locator('[data-translation-dashboard-coverage-kind="cms"]');
      await expect(cmsCoverage).toContainText('50%');

      await writeSiteDocument(refreshedTranslationSite());
      await page.getByRole('button', { name: DASHBOARD_REFRESH_LABELS[locale] }).click();

      await expect(cmsCoverage).toContainText('100%');
      await expect(page.locator('[data-translation-dashboard-last-sync="true"]')).toContainText(copy.dashboardUpdated);
    });

    test(`${locale} dashboard shows publish warnings and resets review filters`, async ({ page }) => {
      await page.goto(`/${locale}/admin-builder/translations?sourceLocale=ko`, { waitUntil: 'domcontentloaded' });

      const warningBanner = page.locator('div[role="alert"]').first();
      await expect(warningBanner).toContainText(copy.publishMissing);
      await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /sourceLocale=ko/);

      const reviewStrip = page.locator(`[aria-label="${copy.managerReviewSummary}"]`);
      await reviewStrip.getByRole('button', { name: new RegExp(`^${copy.managerMissing} \\d+$`) }).first().click();
      await page.waitForFunction(() => new URLSearchParams(window.location.search).get('status') === 'missing');
      await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /status=missing/);
      await expect(page.getByRole('button', { name: copy.managerResetView })).toBeVisible();

      await page.getByRole('button', { name: copy.managerResetView }).click();
      await page.waitForFunction(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('sourceLocale') === 'ko'
          && !params.has('category')
          && !params.has('search')
          && !params.has('status')
          && !params.has('target')
          && !params.has('targets');
      });
    });

    test(`${locale} dashboard review links open the manager with the right review query`, async ({ page }) => {
      test.setTimeout(120_000);

      await page.goto(`/${locale}/admin-builder/translations/dashboard?sourceLocale=ko`, { waitUntil: 'domcontentloaded' });

      const missingLink = page.getByRole('link', { name: copy.dashboardReviewMissing }).first();
      await expect(missingLink).toBeVisible();
      await expect(missingLink).toHaveAttribute('href', /status=missing/);

      await missingLink.click();
      await page.waitForURL(/\/admin-builder\/translations\?/);
      await expect(page.getByRole('heading', { name: copy.managerTitle })).toBeVisible();
      await expect(page.locator('select').first()).toHaveValue('missing');
      await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /status=missing/);

      await page.getByRole('button', { name: copy.managerResetView }).click();
      await page.waitForFunction(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get('sourceLocale') === 'ko'
          && !params.has('category')
          && !params.has('search')
          && !params.has('status')
          && !params.has('target')
          && !params.has('targets');
      });
      await expect(page.locator('select').first()).toHaveValue('all');
      await expect(page.locator('[data-translation-share-link="true"]')).toHaveAttribute('href', /sourceLocale=ko/);
    });
  }
});
