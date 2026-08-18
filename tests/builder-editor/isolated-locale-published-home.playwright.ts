import { expect, test, type Page } from '@playwright/test';
import type { SiteLocale } from '@/lib/locales';
import { seedDecomposePublishBuilderHomes } from './helpers/locale-home-pipeline';

const PUBLIC_LOCALES = ['ko', 'zh-hant', 'en', 'ja'] as const satisfies readonly SiteLocale[];

const EXPECTED_H1: Record<SiteLocale, string> = {
  ko: '대만 법률을 한국어로 명확하게.',
  'zh-hant': '台灣法律，清楚說明。',
  en: 'Taiwan Law, Clearly Explained.',
  ja: '台湾法を、分かりやすく。',
};

async function measurePublicHome(page: Page) {
  return page.evaluate(() => {
    const h1s = Array.from(document.querySelectorAll('h1')).map((el) => ({
      text: (el.textContent || '').trim(),
      nodeId: el.closest('[data-node-id]')?.getAttribute('data-node-id') || null,
    }));
    const overlay = document.querySelector('[data-anchor="mobile-parity-home-hero"]');
    const overlayHeading = overlay?.querySelector('h1,h2,h3,h4,h5,h6');
    const readMinHeight = (element: Element | null) => {
      if (!element) return 0;
      const inline = Number.parseFloat(
        (element.getAttribute('style') || '').match(/min-height:\s*([\d.]+)px/)?.[1] || '',
      ) || 0;
      const computed = Number.parseFloat(window.getComputedStyle(element).minHeight) || 0;
      return Math.max(inline, computed);
    };
    const main = document.querySelector('.builder-pub-main');
    const insights = document.querySelector('[data-node-id="home-insights-root"]');
    return {
      h1Count: h1s.length,
      h1s,
      overlayHeadingTag: overlayHeading?.tagName || null,
      mainMinHeightPx: readMinHeight(main),
      insightsMinHeightPx: readMinHeight(insights),
      pubNodes: document.querySelectorAll('.builder-pub-node').length,
      cinematic: Boolean(document.querySelector('.cinematic-opening, [data-cinematic-home="true"]')),
      overflowPx: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  });
}

test.describe('isolated published canvases per public locale', () => {
  test('seeds, decomposes, and publishes each builder locale independently', async ({ page }) => {
    test.setTimeout(240_000);

    await page.goto('/ko/admin-builder', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-editor-shell]').first()).toBeVisible({ timeout: 45_000 });

    const published = await seedDecomposePublishBuilderHomes(page.request);
    expect(published.ko.pageId).not.toBe(published['zh-hant'].pageId);
    expect(published.ko.pageId).not.toBe(published.en.pageId);
    expect(published['zh-hant'].pageId).not.toBe(published.en.pageId);

    for (const locale of PUBLIC_LOCALES) {
      await page.setViewportSize({ width: 1440, height: 900 });
      const desktopResponse = await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      expect(desktopResponse?.ok()).toBe(true);
      await page.waitForSelector('h1', { state: 'attached', timeout: 20_000 });
      const cinematicScroll = page.locator('a.cinematic-opening__scroll').first();
      if (await cinematicScroll.isVisible().catch(() => false)) {
        await cinematicScroll.click({ timeout: 10_000 });
        await page.waitForTimeout(400);
      }
      const desktop = await measurePublicHome(page);

      expect(desktop.h1Count, `${locale} desktop h1`).toBe(1);
      expect(desktop.h1s[0]?.text).toContain(EXPECTED_H1[locale]);
      expect(desktop.cinematic, `${locale} cinematic`).toBe(true);
      expect(desktop.overflowPx, `${locale} desktop overflow`).toBeLessThanOrEqual(1);

      if (locale === 'zh-hant') {
        expect(desktop.overlayHeadingTag).not.toBe('H1');
        expect(desktop.pubNodes).toBeGreaterThan(20);
        expect(desktop.mainMinHeightPx).toBeGreaterThan(7000);
        expect(desktop.mainMinHeightPx).toBeLessThanOrEqual(7124);
        expect(desktop.insightsMinHeightPx).toBe(820);
      }
      if (locale === 'ko') {
        expect(desktop.pubNodes).toBeGreaterThan(20);
        expect(desktop.mainMinHeightPx).toBeGreaterThan(7000);
        expect(desktop.mainMinHeightPx).toBeLessThanOrEqual(7124);
        expect(desktop.insightsMinHeightPx).toBe(820);
      }
      if (locale === 'en') {
        expect(desktop.pubNodes).toBeGreaterThan(20);
        expect(desktop.h1s[0]?.text).not.toContain('대만 법률');
      }
      if (locale === 'ja') {
        expect(desktop.pubNodes).toBe(0);
        expect(desktop.h1s[0]?.text).not.toContain('Taiwan Law');
        expect(desktop.h1s[0]?.text).not.toContain('대만 법률');
      }

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(400);
      const mobile = await measurePublicHome(page);
      expect(mobile.h1Count, `${locale} mobile h1`).toBe(1);
      expect(mobile.h1s[0]?.text).toContain(EXPECTED_H1[locale]);
      expect(mobile.overflowPx, `${locale} mobile overflow`).toBeLessThanOrEqual(1);
      if (locale === 'zh-hant') {
        expect(mobile.overlayHeadingTag).not.toBe('H1');
      }
    }
  });
});
