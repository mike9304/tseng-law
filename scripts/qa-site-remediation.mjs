import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL ?? 'http://127.0.0.1:4660';
const evidenceDir = path.resolve(
  process.env.QA_EVIDENCE_DIR ?? '.omo/evidence/site-remediation-20260730',
);
const localeBrands = {
  ko: '법무법인 호정',
  'zh-hant': '昊鼎國際法律事務所',
  en: 'Hovering International Law Firm',
  ja: '昊鼎国際法律事務所',
};
const currentHeroMedia = {
  poster: '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
  webm: '/videos/taichung-courthouse-civic-daylight-v2.webm',
  mp4: '/videos/taichung-courthouse-civic-daylight-v2.mp4',
  mobilePoster:
    '/images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
  mobileWebm: '/videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
  mobileMp4: '/videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
};

await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const failures = [];

async function hydrateLazyImages(page) {
  const restoreScrollY = await page.evaluate(() => window.scrollY);
  await page.evaluate(async () => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const step = Math.max(window.innerHeight * 0.8, 480);
    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo({ top: Math.min(y, maxScroll), behavior: 'auto' });
      await new Promise((resolve) => window.setTimeout(resolve, 40));
    }
  });
  await page.evaluate((scrollY) => {
    window.scrollTo({ top: scrollY, behavior: 'auto' });
  }, restoreScrollY);
  await page.waitForLoadState('networkidle');
}

async function revealHomepageAfterCinematicOpening(page, locale) {
  const opening = page.locator('.cinematic-opening');
  const site = page.locator('.site[data-cinematic-home="true"]');
  const header = page.locator('[data-cinematic-chrome="header"] > header');

  assert.equal(await opening.count(), 1, `${locale} should render one cinematic opening`);
  await opening.waitFor({ state: 'visible' });
  assert.equal(
    await site.getAttribute('data-cinematic-intro-visible'),
    'true',
    `${locale} cinematic opening should initially own the viewport`,
  );
  assert.equal(
    await header.isVisible(),
    false,
    `${locale} header should stay hidden while the cinematic opening is visible`,
  );

  await page.mouse.wheel(0, 4);

  await page.waitForFunction(
    () => {
      const cinematicSite = document.querySelector(
        '.site[data-cinematic-home="true"]',
      );
      return (
        cinematicSite?.getAttribute('data-cinematic-intro-visible') === 'false'
        && document.documentElement.getAttribute('data-cinematic-intro-visible') === 'false'
      );
    },
    undefined,
    { timeout: 5_000 },
  );
  await page.waitForTimeout(300);

  const visibleHero = page.locator('#hero:visible').first();
  await visibleHero.waitFor({ state: 'visible' });
  const heroTop = await visibleHero.evaluate((element) =>
    Math.round(element.getBoundingClientRect().top),
  );
  assert.ok(
    Math.abs(heroTop) <= 1,
    `${locale} should replace the opening with the first homepage scene in one gesture`,
  );
  assert.equal(
    await header.isVisible(),
    true,
    `${locale} header should become visible after the cinematic opening`,
  );
}

try {
  for (const [locale, brand] of Object.entries(localeBrands)) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    try {
      const response = await page.goto(`${baseUrl}/${locale}`, {
        waitUntil: 'networkidle',
      });
      assert.equal(response?.status(), 200, `${locale} homepage status`);
      assert.match(await page.title(), new RegExp(`\\| ${brand}$`));

      const consultationLinks = page.locator(
        'a[href^="mailto:wei@hoveringlaw.com.tw"]',
      );
      assert.ok(
        (await consultationLinks.count()) >= 1,
        `${locale} should expose the official consultation mailto`,
      );
      assert.equal(
        await page.locator('a[href*="pf.kakao.com"], a[href*="line.me"], a[href*="lin.ee"]').count(),
        0,
        `${locale} should not expose KakaoTalk or LINE links`,
      );

      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        true,
        `${locale} desktop should not overflow horizontally`,
      );

      assert.equal(
        await page.locator('.year-end-popup-backdrop').count(),
        0,
        `${locale} event popup should be deferred while the cinematic opening is visible`,
      );
      await revealHomepageAfterCinematicOpening(page, locale);

      assert.equal(
        await page.locator('.services-card-grid-item').evaluateAll((nodes) =>
          nodes.filter((node) => node.getBoundingClientRect().width > 0).length,
        ),
        6,
      );
      assert.deepEqual(
        await page.locator('.stat-number').evaluateAll((nodes) =>
          nodes
            .filter((node) => node.getBoundingClientRect().width > 0)
            .map((node) => node.getAttribute('data-count') ?? node.textContent?.trim()),
        ),
        ['4', '3', '7', '2'],
      );
      assert.equal(
        await page.locator('#faq .section-title').evaluateAll((nodes) =>
          nodes.filter((node) => node.getBoundingClientRect().width > 0).length,
        ),
        1,
      );
      assert.equal(
        await page.locator('.office-tabs .tab-button').evaluateAll((nodes) =>
          nodes.filter((node) => node.getBoundingClientRect().width > 0).length,
        ),
        4,
      );

      const heroImages = page.locator('img.hero-media-image');
      assert.equal(await heroImages.count(), 1, `${locale} should render one optimized hero frame`);
      const heroImage = heroImages;
      assert.equal(
        await heroImage.evaluate(
          (image, expectedPoster) =>
            decodeURIComponent(
              image.getAttribute('src') ?? image.currentSrc,
            ).includes(expectedPoster),
          currentHeroMedia.poster,
        ),
        true,
      );

      const popupBackdrop = page.locator('.year-end-popup-backdrop:visible');
      if (locale === 'ko') {
        assert.equal(await popupBackdrop.count(), 1, `${locale} should render one event popup`);
      }
      if (await popupBackdrop.count() > 0) {
        await popupBackdrop.waitFor({ state: 'visible' });
        const popupGeometry = await page.locator('#hero:visible').first().evaluate((hero) => {
          const popup = hero.querySelector('.year-end-popup');
          const backdrop = hero.querySelector('.year-end-popup-backdrop');
          if (!(popup instanceof HTMLElement) || !(backdrop instanceof HTMLElement)) return null;
          const heroRect = hero.getBoundingClientRect();
          const popupRect = popup.getBoundingClientRect();
          return {
            backdropPosition: getComputedStyle(backdrop).position,
            popupPosition: getComputedStyle(popup).position,
            contained:
              popupRect.left >= heroRect.left - 1
              && popupRect.right <= heroRect.right + 1
              && popupRect.top >= heroRect.top - 1
              && popupRect.bottom <= heroRect.bottom + 1,
          };
        });
        assert.deepEqual(popupGeometry, {
          backdropPosition: 'absolute',
          popupPosition: 'absolute',
          contained: true,
        });
      }

      await hydrateLazyImages(page);
      await page.screenshot({
        path: path.join(evidenceDir, `${locale}-desktop.png`),
        fullPage: true,
      });

      const contactResponse = await page.goto(`${baseUrl}/${locale}/contact`, {
        waitUntil: 'networkidle',
      });
      assert.equal(contactResponse?.status(), 200, `${locale} contact status`);
      assert.ok(
        (await page.locator('a[href^="mailto:wei@hoveringlaw.com.tw"]').count()) >= 1,
        `${locale} contact should expose the official consultation mailto`,
      );
      assert.equal(
        await page.locator('a[href*="pf.kakao.com"], a[href*="line.me"], a[href*="lin.ee"]').count(),
        0,
        `${locale} contact should not expose KakaoTalk or LINE links`,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        true,
        `${locale} contact should not overflow horizontally`,
      );
      assert.deepEqual(consoleErrors, [], `${locale} console errors`);
    } catch (error) {
      failures.push(`${locale} desktop: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await context.close();
    }
  }

  for (const locale of Object.keys(localeBrands)) {
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 1,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    const mobilePage = await mobileContext.newPage();
    const mobileErrors = [];
    mobilePage.on('console', (message) => {
      if (message.type() === 'error') mobileErrors.push(message.text());
    });
    mobilePage.on('pageerror', (error) => mobileErrors.push(error.message));

    try {
      const response = await mobilePage.goto(`${baseUrl}/${locale}`, {
        waitUntil: 'networkidle',
      });
      assert.equal(response?.status(), 200, `${locale} mobile homepage status`);
      assert.equal(
        await mobilePage.locator('a[href*="pf.kakao.com"], a[href*="line.me"], a[href*="lin.ee"]').count(),
        0,
      );
      assert.equal(
        await mobilePage.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        true,
        `${locale} mobile should not overflow horizontally`,
      );

      assert.equal(
        await mobilePage.locator('.year-end-popup-backdrop').count(),
        0,
        `${locale} mobile event banner should be deferred behind the cinematic opening`,
      );
      await revealHomepageAfterCinematicOpening(mobilePage, `${locale} mobile`);

      const cardBoxes = await mobilePage.locator('.services-card-grid-item').evaluateAll((nodes) =>
        nodes
          .filter((node) => node.getBoundingClientRect().width > 0)
          .slice(0, 3)
          .map((node) => {
            const rect = node.getBoundingClientRect();
            return { left: Math.round(rect.left), top: Math.round(rect.top) };
          }),
      );
      assert.equal(cardBoxes.length, 3, `${locale} mobile should render service cards`);
      assert.equal(
        new Set(cardBoxes.map((box) => box.left)).size,
        1,
        `${locale} mobile service cards use one column`,
      );

      const popupBackdrop = mobilePage.locator('.year-end-popup-backdrop:visible');
      if (locale === 'ko') {
        assert.equal(await popupBackdrop.count(), 1, `${locale} mobile should render one event banner`);
      }
      if (await popupBackdrop.count() > 0) {
        await popupBackdrop.waitFor({ state: 'visible' });
        const popupGeometry = await mobilePage.locator('#hero:visible').first().evaluate((hero) => {
          const popup = hero.querySelector('.year-end-popup');
          const backdrop = hero.querySelector('.year-end-popup-backdrop');
          const insights = document.querySelector('#insights');
          if (
            !(popup instanceof HTMLElement)
            || !(backdrop instanceof HTMLElement)
            || !(insights instanceof HTMLElement)
          ) return null;
          const heroRect = hero.getBoundingClientRect();
          const popupRect = popup.getBoundingClientRect();
          const insightsRect = insights.getBoundingClientRect();
          const intersectionHeight = Math.max(
            0,
            Math.min(popupRect.bottom, insightsRect.bottom)
              - Math.max(popupRect.top, insightsRect.top),
          );
          return {
            backdropPosition: getComputedStyle(backdrop).position,
            popupPosition: getComputedStyle(popup).position,
            popupHeight: popupRect.height,
            contained:
              popupRect.left >= heroRect.left - 1
              && popupRect.right <= heroRect.right + 1
              && popupRect.top >= heroRect.top - 1
              && popupRect.bottom <= heroRect.bottom + 1,
            followingSectionAfterHero: insightsRect.top >= heroRect.bottom - 1,
            intersectionHeight,
          };
        });
        assert.equal(popupGeometry?.backdropPosition, 'absolute');
        assert.equal(popupGeometry?.popupPosition, 'absolute');
        assert.ok((popupGeometry?.popupHeight ?? Infinity) <= 88);
        assert.equal(popupGeometry?.contained, true);
        assert.equal(popupGeometry?.followingSectionAfterHero, true);
        assert.equal(popupGeometry?.intersectionHeight, 0);
      }

      const mobileToggle = mobilePage.locator('button.mobile-toggle');
      assert.equal(await mobileToggle.count(), 1, `${locale} should expose one mobile menu toggle`);
      const drawerId = await mobileToggle.getAttribute('aria-controls');
      assert.ok(drawerId, `${locale} mobile menu toggle should identify its drawer`);
      await mobileToggle.click();
      const drawer = mobilePage.locator(`#${drawerId}`);
      assert.equal(await drawer.count(), 1, `${locale} mobile drawer should be unique`);
      assert.equal(await mobileToggle.getAttribute('aria-expanded'), 'true');
      await mobilePage.keyboard.press('Escape');
      assert.equal(await mobileToggle.getAttribute('aria-expanded'), 'false');

      await hydrateLazyImages(mobilePage);
      await mobilePage.screenshot({
        path: path.join(evidenceDir, `${locale}-mobile.png`),
        fullPage: true,
      });

      assert.deepEqual(mobileErrors, [], `${locale} mobile console errors`);
    } catch (error) {
      failures.push(`${locale} mobile: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      await mobileContext.close();
    }
  }
} finally {
  await browser.close();
}

if (failures.length > 0) {
  throw new Error(failures.join('\n'));
}

console.log(`Site remediation browser QA passed. Evidence: ${evidenceDir}`);
