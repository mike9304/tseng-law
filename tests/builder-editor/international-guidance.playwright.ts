import { expect, test, type Locator, type Page } from '@playwright/test';
import { guidanceContent } from '@/data/international-guidance-content';
import { legalPageContent } from '@/data/legal-pages';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import {
  EXISTING_SITE_LOCALES_4,
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  buildGuidanceCoreLanguageAlternates,
  guidanceCanonicalUrl,
  guidancePublicPath,
  isExistingSiteLocale4,
  isGuidanceLocale4,
  publicDocumentLanguage,
  type ExistingSiteLocale4,
  type GuidancePageKey,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { getSiteUrl } from '@/lib/seo';

const DESKTOP = { width: 1440, height: 1000 } as const;
const MOBILE = { width: 390, height: 844 } as const;
const VIEWPORTS = [DESKTOP, MOBILE] as const;
const UNSUPPORTED_COLUMNS_MISSING = 'columns/missing' as const;

const OLD4_UTILITY_CONTACT_HREF: Record<ExistingSiteLocale4, string> = {
  ko: '/ko/contact',
  'zh-hant': '/zh-hant/contact',
  en: '/en/contact',
  ja: '/ja/contact',
};

type SeoSnapshot = {
  lang: string;
  canonical: string;
  robots: string;
  alternates: Array<{ hreflang: string; href: string }>;
};

function siteUrl(): string {
  return getSiteUrl();
}

function hrefPathname(href: string, base: string): string {
  const url = new URL(href, base);
  return url.pathname.replace(/\/+$/, '') || '/';
}

function guidanceShell(page: Page): Locator {
  return page.locator('[data-guidance-shell="true"]');
}

function old4Header(page: Page): Locator {
  return page.locator('header[data-public-site-header]');
}

function expectedOld4H1(locale: ExistingSiteLocale4, pageKey: GuidancePageKey): string {
  switch (pageKey) {
    case 'home':
      return siteContent[locale].hero.title;
    case 'privacy':
    case 'disclaimer':
      return legalPageContent[locale][pageKey].title;
    case 'columns':
      return pageCopy[locale].insights.title;
    case 'about':
    case 'services':
    case 'lawyers':
    case 'pricing':
    case 'contact':
    case 'faq':
      return pageCopy[locale][pageKey].title;
  }
}

async function documentOverflowPx(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

async function readSeo(page: Page): Promise<SeoSnapshot> {
  return page.evaluate(() => {
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
    const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
    const alternates = Array.from(
      document.querySelectorAll('link[rel="alternate"][hreflang]'),
    ).map((node) => ({
      hreflang: node.getAttribute('hreflang') ?? '',
      href: node.getAttribute('href') ?? '',
    }));
    return {
      lang: document.documentElement.lang,
      canonical,
      robots,
      alternates,
    };
  });
}

async function dismissOld4HomeChrome(page: Page): Promise<void> {
  const cinematicScroll = page.locator('a.cinematic-opening__scroll').first();
  if (await cinematicScroll.isVisible()) {
    await cinematicScroll.click();
  }
}

async function attachViewportScreenshot(
  page: Page,
  name: string,
): Promise<void> {
  await test.info().attach(name, {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
  });
}

async function openOld4LanguageSwitcher(
  page: Page,
  locale: ExistingSiteLocale4,
  viewportWidth: number,
): Promise<Locator> {
  if (viewportWidth <= MOBILE.width) {
    const toggle = old4Header(page).locator('button.mobile-toggle');
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
    await expect(switcher.getByRole('link', { name: PUBLIC_LANGUAGE_AUTONYMS[locale], exact: true })).toBeVisible();
    await expect(switcher.locator('.locale-flag-switcher-flag')).toHaveCount(0);
    return switcher;
  }

  const switcher = old4Header(page).locator('.locale-flag-switcher').first();
  const details = switcher.locator('details');
  await expect(details).toBeVisible();
  if ((await details.getAttribute('open')) === null) {
    await details.locator('summary').click();
  }
  await expect(details).toHaveAttribute('open', '');
  await expect(
    switcher.getByRole('link', { name: PUBLIC_LANGUAGE_AUTONYMS[locale], exact: true }),
  ).toBeVisible();
  await expect(switcher.locator('.locale-flag-switcher-flag')).toHaveCount(0);
  return switcher;
}

async function clickLanguage(
  page: Page,
  currentLocale: PublicLocale8,
  targetLocale: PublicLocale8,
  viewportWidth: number,
): Promise<void> {
  const autonym = PUBLIC_LANGUAGE_AUTONYMS[targetLocale];
  if (isGuidanceLocale4(currentLocale)) {
    const switcher = guidanceShell(page).locator('.public-language-switcher');
    await expect(switcher).toBeVisible();
    await switcher.getByRole('link', { name: autonym, exact: true }).click();
    return;
  }

  const switcher = await openOld4LanguageSwitcher(
    page,
    currentLocale,
    viewportWidth,
  );
  await switcher.getByRole('link', { name: autonym, exact: true }).click();
}

async function clickMenuToContact(
  page: Page,
  locale: PublicLocale8,
  viewportWidth: number,
): Promise<void> {
  if (isGuidanceLocale4(locale)) {
    const pack = guidanceContent[locale];
    const nav = guidanceShell(page).locator('nav').filter({
      has: page.getByRole('link', { name: pack.nav.contact, exact: true }),
    });
    await nav.getByRole('link', { name: pack.nav.contact, exact: true }).click();
    return;
  }

  if (viewportWidth <= MOBILE.width) {
    const toggle = old4Header(page).locator('button.mobile-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    const drawer = page.locator('#public-mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    await drawer.locator(`a[href^="/${locale}/contact"]`).first().click();
    return;
  }

  await old4Header(page)
    .locator('nav.utility-nav')
    .locator(`a[href="${OLD4_UTILITY_CONTACT_HREF[locale]}"]`)
    .click();
}

async function clickBrandHome(page: Page, locale: PublicLocale8): Promise<void> {
  if (isGuidanceLocale4(locale)) {
    await guidanceShell(page)
      .locator('header')
      .locator(`a[href="${guidancePublicPath(locale, 'home')}"]`)
      .first()
      .click();
    return;
  }

  await old4Header(page).locator('a.header-logo').click();
}

function assertHreflangContract(
  pageKey: GuidancePageKey,
  locale: PublicLocale8,
  seo: SeoSnapshot,
  pageUrl: string,
): void {
  const expectedLanguages = buildGuidanceCoreLanguageAlternates(pageKey, siteUrl());
  const expectedCanonical = guidanceCanonicalUrl(locale, pageKey, siteUrl());
  const expectedTags = Object.keys(expectedLanguages).sort();
  const actualTags = [...new Set(seo.alternates.map((item) => item.hreflang))].sort();

  expect(hrefPathname(seo.canonical, pageUrl), `${locale} ${pageKey} canonical`).toBe(
    hrefPathname(expectedCanonical, siteUrl()),
  );
  expect(actualTags, `${locale} ${pageKey} hreflang tags`).toEqual(expectedTags);

  const byTag = new Map(seo.alternates.map((item) => [item.hreflang, item.href]));
  for (const [tag, href] of Object.entries(expectedLanguages)) {
    const actual = byTag.get(tag);
    expect(actual, `${locale} ${pageKey} hreflang ${tag}`).toBeTruthy();
    expect(hrefPathname(actual ?? '', pageUrl)).toBe(hrefPathname(href, siteUrl()));
  }

  if (pageKey === 'faq') {
    expect(byTag.has('en'), `${locale} faq must omit en hreflang`).toBe(false);
    expect(actualTags, `${locale} faq hreflang is 7 locales + x-default`).toHaveLength(8);
  } else {
    expect(byTag.has('en'), `${locale} ${pageKey} must include en hreflang`).toBe(true);
    expect(actualTags, `${locale} ${pageKey} hreflang is 8 locales + x-default`).toHaveLength(9);
  }
}

async function assertCorePage(
  page: Page,
  locale: PublicLocale8,
  pageKey: GuidancePageKey,
): Promise<void> {
  const path = guidancePublicPath(locale, pageKey);
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response, `${path} response`).toBeTruthy();
  expect(response?.status(), `${path} status`).toBe(200);

  await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(locale));
  await expect(page).toHaveURL(new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:/)?(?:[?#]|$)`));

  if (pageKey === 'home' && isExistingSiteLocale4(locale)) {
    await dismissOld4HomeChrome(page);
  }

  const h1 = page.getByRole('heading', { level: 1 }).first();
  await expect(h1).toBeVisible();
  const h1Text = (await h1.innerText()).trim();
  expect(h1Text.length, `${path} h1`).toBeGreaterThan(0);

  if (isGuidanceLocale4(locale)) {
    const pack = guidanceContent[locale];
    const localized = pack.pages[pageKey];
    await expect(h1).toHaveText(localized.title);
    const article = guidanceShell(page).locator('article').first();
    await expect(article).toContainText(localized.description);
    await expect(article).toContainText(localized.intro);
    await expect(article).toContainText(localized.sections[0]?.heading ?? localized.title);

    for (const other of GUIDANCE_LOCALES_4) {
      if (other === locale) continue;
      expect(h1Text, `${path} must not reuse ${other} title`).not.toBe(
        guidanceContent[other].pages[pageKey].title,
      );
    }
    for (const oldLocale of EXISTING_SITE_LOCALES_4) {
      expect(h1Text, `${path} must not fall back to ${oldLocale} copy`).not.toBe(
        expectedOld4H1(oldLocale, pageKey),
      );
    }
  } else {
    await expect(h1).toContainText(expectedOld4H1(locale, pageKey));
  }

  const seo = await readSeo(page);
  expect(seo.lang).toBe(publicDocumentLanguage(locale));
  assertHreflangContract(pageKey, locale, seo, page.url());

  if (locale === 'en' && pageKey === 'faq') {
    expect(seo.robots.toLowerCase(), '/en/faq robots').toMatch(/noindex/);
  } else {
    expect(seo.robots.toLowerCase(), `${path} must stay indexable`).not.toMatch(/noindex/);
  }

  await expect.poll(() => documentOverflowPx(page), { message: `${path} overflow` }).toBeLessThanOrEqual(1);
}

test.describe('international guidance public surface', () => {
  for (const locale of PUBLIC_LOCALES_8) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} @${viewport.width} navigates every core page with lang, h1, overflow, canonical/hreflang`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);

        for (const pageKey of GUIDANCE_PAGE_KEYS) {
          await assertCorePage(page, locale, pageKey);
        }

        await page.goto(guidancePublicPath(locale, 'home'), { waitUntil: 'domcontentloaded' });
        if (isExistingSiteLocale4(locale)) {
          await dismissOld4HomeChrome(page);
        }
        await attachViewportScreenshot(page, `guidance-${locale}-${viewport.width}`);
      });

      test(`${locale} @${viewport.width} clicks actual menu and language selector through contact and back`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(guidancePublicPath(locale, 'home'), { waitUntil: 'domcontentloaded' });
        if (isExistingSiteLocale4(locale)) {
          await dismissOld4HomeChrome(page);
        }

        await clickMenuToContact(page, locale, viewport.width);
        await expect(page).toHaveURL(new RegExp(`/${locale}/contact`));
        await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(locale));

        const otherLocale: PublicLocale8 = isGuidanceLocale4(locale) ? 'ko' : 'vi';
        await clickLanguage(page, locale, otherLocale, viewport.width);
        await expect(page).toHaveURL(new RegExp(`/${otherLocale}/contact`));
        await expect(page.locator('html')).toHaveAttribute(
          'lang',
          publicDocumentLanguage(otherLocale),
        );

        await clickLanguage(page, otherLocale, locale, viewport.width);
        await expect(page).toHaveURL(new RegExp(`/${locale}/contact`));
        await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(locale));

        await clickBrandHome(page, locale);
        await expect(page).toHaveURL(new RegExp(`/${locale}(?:/)?(?:[?#]|$)`));
        await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      });
    }
  }

  for (const locale of GUIDANCE_LOCALES_4) {
    for (const viewport of VIEWPORTS) {
      test(`${locale} @${viewport.width} unsupported /columns/missing is localized 404 noindex`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        const pack = guidanceContent[locale];
        const path = `/${locale}/${UNSUPPORTED_COLUMNS_MISSING}`;
        const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
        expect(response?.status(), path).toBe(404);

        await expect(page.locator('html')).toHaveAttribute('lang', publicDocumentLanguage(locale));
        const shell = guidanceShell(page);
        await expect(shell).toBeVisible();
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(pack.notFoundTitle);
        await expect(shell).toContainText(pack.notFoundText);
        await expect(shell.getByRole('link', { name: pack.backHomeLabel, exact: true })).toBeVisible();

        for (const other of GUIDANCE_LOCALES_4) {
          if (other === locale) continue;
          await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(
            guidanceContent[other].notFoundTitle,
          );
        }

        const seo = await readSeo(page);
        expect(seo.robots.toLowerCase(), `${path} robots`).toMatch(/noindex/);
        await expect.poll(() => documentOverflowPx(page)).toBeLessThanOrEqual(1);
        await attachViewportScreenshot(page, `guidance-404-${locale}-${viewport.width}`);
      });
    }
  }
});
