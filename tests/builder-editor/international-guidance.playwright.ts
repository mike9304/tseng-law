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
  type GuidanceLocale4,
  // Core-key spec: every assertion below reads `pack.pages` and the
  // eight-language hreflang cluster, both of which are the original ten.
  type GuidanceCorePageKey as GuidancePageKey,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { getSiteUrl } from '@/lib/seo';
import { guidanceOfficeCopy } from '@/data/international-guidance-offices';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import {
  GUIDANCE_BIO_PRESERVED_TERMS,
  guidanceTeamBios,
  guidanceTeamCopy,
  isGuidanceTeamMemberId,
} from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
import { buildGuidanceAttorneyFacts } from '@/lib/guidance-attorney-facts';
import {
  guidanceRosterTextBlocks,
  normalizeGuidanceTextBlock,
} from '@/lib/guidance-roster-text';
import { listColumnSlugsFromFs } from './column-corpus';

const DESKTOP = { width: 1440, height: 1000 } as const;
const MOBILE = { width: 390, height: 844 } as const;
const VIEWPORTS = [DESKTOP, MOBILE] as const;
const UNSUPPORTED_COLUMNS_MISSING = 'columns/missing' as const;

/**
 * O14: every public locale — the guidance four included — now renders the same
 * site header/footer chrome, so the menu/language/brand interactions below use
 * the real header for all eight locales instead of a guidance-only shell.
 */
function utilityContactHref(locale: PublicLocale8): string {
  return `/${locale}/contact`;
}

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

async function locatorPathnames(locator: Locator, base: string): Promise<string[]> {
  const hrefs = await locator.evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href') ?? ''),
  );
  return hrefs.map((href) => hrefPathname(href, base)).sort((a, b) => a.localeCompare(b, 'en'));
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

async function openHeaderLanguageSwitcher(
  page: Page,
  locale: PublicLocale8,
  viewportWidth: number,
): Promise<Locator> {
  // The site header owns the switcher for all eight locales now; the page body
  // must never render a second one (the removed in-component guidance dropdown).
  await expect(
    page.locator('header[data-public-site-header] .header-utility .locale-flag-switcher'),
    `${locale} @${viewportWidth} header switcher count`,
  ).toHaveCount(1);
  await expect(
    page.locator('[data-guidance-shell="true"] .locale-flag-switcher'),
    `${locale} @${viewportWidth} duplicate switcher in page body`,
  ).toHaveCount(0);

  let switcher: Locator;

  if (viewportWidth <= MOBILE.width) {
    const toggle = old4Header(page).locator('button.mobile-toggle');
    await expect(toggle).toBeVisible();
    await toggle.click();
    const drawer = page.locator('#public-mobile-nav-drawer');
    await expect(drawer).toBeVisible();
    switcher = drawer.locator('.locale-flag-switcher');
    await expect(switcher, `${locale} @${viewportWidth} drawer switcher count`).toHaveCount(1);
  } else {
    switcher = old4Header(page).locator('.locale-flag-switcher').first();
  }

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
  // G21 contract kept: the open menu offers all eight languages, and every one
  // of them is actually visible (not painted behind the header CTA).
  const options = switcher.locator('.locale-flag-switcher-link');
  await expect(options, `${locale} @${viewportWidth} language options`).toHaveCount(
    PUBLIC_LOCALES_8.length,
  );
  for (const [index, optionLocale] of PUBLIC_LOCALES_8.entries()) {
    await expect(
      options.nth(index),
      `${locale} @${viewportWidth} option ${optionLocale}`,
    ).toBeVisible();
  }
  return switcher;
}

async function clickLanguage(
  page: Page,
  currentLocale: PublicLocale8,
  targetLocale: PublicLocale8,
  viewportWidth: number,
): Promise<void> {
  const autonym = PUBLIC_LANGUAGE_AUTONYMS[targetLocale];
  const switcher = await openHeaderLanguageSwitcher(
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
    .locator(`a[href="${utilityContactHref(locale)}"]`)
    .click();
}

async function clickBrandHome(page: Page, locale: PublicLocale8): Promise<void> {
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

async function assertTranslatedColumnsIndex(
  page: Page,
  locale: GuidanceLocale4,
  path: string,
): Promise<void> {
  const translatedSlugs = listColumnSlugsFromFs(locale);
  const koSlugs = listColumnSlugsFromFs('ko');
  const expectedCardHrefs = translatedSlugs.map((slug) => `/${locale}/columns/${slug}`);
  const untranslatedSlugs = koSlugs.filter((slug) => !translatedSlugs.includes(slug));
  const expectedOriginalHrefs = untranslatedSlugs.map((slug) => `/ko/columns/${slug}`);

  await expect(
    page.locator('[data-guidance-shell="true"]'),
    `${path} must leave the empty-corpus guidance shell`,
  ).toHaveCount(0);
  await expect(page.locator('.columns-grid'), `${path} ColumnsGrid`).toBeVisible();
  const cards = page.locator('.columns-grid a.columns-card');
  await expect(cards, `${path} translated card count`).toHaveCount(translatedSlugs.length);
  expect(await locatorPathnames(cards, page.url()), `${path} card hrefs`).toEqual(
    expectedCardHrefs.sort((a, b) => a.localeCompare(b, 'en')),
  );

  for (const href of expectedCardHrefs) {
    const detail = await page.request.get(href);
    expect(detail.status(), `${href} translated detail`).toBe(200);
  }

  const originalSection = page.locator('[data-columns-original-language="true"]');
  await expect(originalSection, `${path} original-language section`).toBeVisible();
  const remaining = originalSection.locator('a[href*="/ko/columns/"]');
  await expect(remaining, `${path} untranslated slug count`).toHaveCount(untranslatedSlugs.length);
  expect(await locatorPathnames(remaining, page.url()), `${path} untranslated hrefs`).toEqual(
    expectedOriginalHrefs.sort((a, b) => a.localeCompare(b, 'en')),
  );
}

async function assertEmptyColumnsGuidance(
  page: Page,
  locale: GuidanceLocale4,
  path: string,
): Promise<void> {
  const localized = guidanceContent[locale].pages.columns;
  const article = guidanceShell(page);
  await expect(article, `${path} empty-corpus guidance shell`).toBeVisible();
  await expect(article).toContainText(localized.description);
  await expect(article).toContainText(localized.intro);
  await expect(article).toContainText(localized.sections[0]?.heading ?? localized.title);
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

  if (pageKey === 'home') {
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

    if (pageKey === 'columns') {
      const translatedCount = listColumnSlugsFromFs(locale).length;
      if (translatedCount > 0) {
        await assertTranslatedColumnsIndex(page, locale, path);
      } else {
        await assertEmptyColumnsGuidance(page, locale, path);
      }
    } else {
      // O16: the home page now opens on the shared hero (title + description) and
      // carries its intro and section cards further down, so the guidance copy is
      // no longer inside a single leading <article>. The three assertions below
      // are unchanged; only their scope moved from that article to the guidance
      // shell, which is still guidance-only content.
      const article = guidanceShell(page);
      await expect(article).toContainText(localized.description);
      await expect(article).toContainText(localized.intro);
      await expect(article).toContainText(localized.sections[0]?.heading ?? localized.title);
    }

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
        await dismissOld4HomeChrome(page);
        await attachViewportScreenshot(page, `guidance-${locale}-${viewport.width}`);
      });

      test(`${locale} @${viewport.width} clicks actual menu and language selector through contact and back`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await page.goto(guidancePublicPath(locale, 'home'), { waitUntil: 'domcontentloaded' });
        await dismissOld4HomeChrome(page);

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

/**
 * O19 — asset parity between the four guidance locales and the English pages.
 *
 * The reported defect: `/{vi,id,th,fil}/lawyers` rendered no attorney
 * photograph or profile card while `/en/lawyers` renders five. The audit
 * (evidence/O19-AUDIT.md) found the same roster missing from `/about`, and the
 * office photographs and addresses missing from `/contact`.
 *
 * Every count below is READ FROM THE ENGLISH PAGE and compared, so the
 * assertions keep holding when a team member or an office is added or removed.
 */
test.describe('O19 guidance asset parity with /en', () => {
  const ROSTER_PAGES = ['lawyers', 'about'] as const;

  async function englishRosterCounts(page: Page, pageKey: string) {
    await page.goto(`/en/${pageKey}`, { waitUntil: 'domcontentloaded' });
    const roster = page.locator('section.attorney-team-section');
    await expect(roster.first()).toBeVisible();
    const cards = await roster.locator('article.attorney-card').count();
    const images = await roster.locator('img').count();
    return { cards, images };
  }

  for (const pageKey of ROSTER_PAGES) {
    for (const locale of GUIDANCE_LOCALES_4) {
      test(`${locale} /${pageKey} renders the same team roster as /en`, async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const expected = await englishRosterCounts(page, pageKey);
        expect(expected.cards, `/en/${pageKey} must have team cards to compare against`)
          .toBeGreaterThan(0);
        expect(expected.images, `/en/${pageKey} must have team photos to compare against`)
          .toBeGreaterThan(0);

        await page.goto(guidancePublicPath(locale, pageKey as GuidancePageKey), {
          waitUntil: 'domcontentloaded',
        });
        const roster = page.locator('section[data-guidance-team="true"]');
        await expect(roster).toBeVisible();
        await expect(roster.locator('article.attorney-card')).toHaveCount(expected.cards);
        await expect(roster.locator('img')).toHaveCount(expected.images);

        // Every portrait resolves to a real file, and its alt text is not empty.
        const images = roster.locator('img');
        for (let i = 0; i < expected.images; i += 1) {
          const img = images.nth(i);
          await expect(img).toHaveAttribute('alt', /\S/);
          // next/image lazy-loads below the fold, so the portrait has to be
          // scrolled to before `naturalWidth` means anything.
          await img.scrollIntoViewIfNeeded();
          await expect
            .poll(async () => img.evaluate((node) => (node as HTMLImageElement).naturalWidth))
            .toBeGreaterThan(0);
        }

        // Roster headings and labels are in the page language, not English.
        const copy = guidanceTeamCopy[locale];
        // `/en/lawyers` renders the roster with `showIntro={false}` — the page
        // header already names the team — and `/en/about` renders the eyebrow,
        // heading and lede. The guidance pages follow the same split, so the
        // roster heading is asserted where `/en` has one and the page `h1`
        // carries the team name on `lawyers`.
        if (pageKey === 'about') {
          await expect(roster).toContainText(copy.title);
          await expect(roster).toContainText(copy.description);
        } else {
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(copy.title);
        }
        await expect(roster).toContainText(copy.representativeTitle);
        await expect(roster).toContainText(copy.teamTitle);
        await expect(roster).toContainText(copy.partnerTitle);
        await expect(roster).toContainText(copy.introLabel);
        await expect(roster).toContainText(copy.educationLabel);
        await expect(roster).toContainText(copy.experienceLabel);

        // WO-O33 reversed this assertion. The roster used to render the
        // English canonical biography lines and declare them as such through
        // `sourceLanguageNote`; it now renders this locale's own translation,
        // so the English original must be absent from the rendered text.
        const rosterCopy = ((await roster.textContent()) ?? '').replace(/\s+/g, ' ');
        for (const member of teamContent.en.members) {
          if (!isGuidanceTeamMemberId(member.id)) continue;
          for (const field of ['intro', 'education'] as const) {
            for (const line of member[field]) {
              expect(
                rosterCopy.includes(line.replace(/\s+/g, ' ')),
                `${locale}/${pageKey} still renders the English line: ${line}`,
              ).toBe(false);
            }
          }
          // …and the localized line for the same member is what is rendered.
          for (const line of guidanceTeamBios[locale][member.id].intro) {
            expect(
              rosterCopy.includes(line.replace(/\s+/g, ' ')),
              `${locale}/${pageKey} must render its own intro line: ${line}`,
            ).toBe(true);
          }
        }

        // Names come from the canonical record unchanged.
        for (const member of teamContent.en.members) {
          await expect(roster).toContainText(member.name);
        }

        // No other guidance locale's roster copy leaked onto this page.
        for (const other of GUIDANCE_LOCALES_4) {
          if (other === locale) continue;
          await expect(roster).not.toContainText(guidanceTeamCopy[other].representativeTitle);
        }

        // The roster must not link to /{guidance locale}/lawyers/{slug}: that
        // route serves the four site locales only.
        await expect(
          roster.locator(`a[href^="/${locale}/lawyers/"]`),
        ).toHaveCount(0);

        await expect.poll(() => documentOverflowPx(page)).toBeLessThanOrEqual(1);
      });
    }
  }

  /**
   * WO-O29 A. The guidance locales used to render a flat band listing all four
   * offices at once, which could never match the `/en` element counts because
   * `/en` renders `OfficeMapTabs` and shows one office at a time. All eight
   * locales now render that same component, so the structure is compared
   * directly and every office must still be reachable by clicking its tab.
   */
  for (const pageKey of ['home', 'contact'] as const) {
    for (const locale of GUIDANCE_LOCALES_4) {
      test(`${locale} /${pageKey} renders the same office tabs as /en`, async ({ page }) => {
        await page.setViewportSize(DESKTOP);

        const enPath = pageKey === 'home' ? '/en' : '/en/contact';
        await page.goto(enPath, { waitUntil: 'domcontentloaded' });
        // Counts only — the English home wraps this section in a scroll
        // `reveal` wrapper, so assert it is in the DOM rather than on screen.
        const enOffices = page.locator('#offices').first();
        await expect(enOffices).toBeAttached();
        const expectedTabs = await enOffices.locator('[role="tab"]').count();
        const expectedPhotos = await enOffices.locator('img').count();
        const expectedIframes = await enOffices.locator('iframe').count();
        const expectedTel = await enOffices.locator('a[href^="tel:"]').count();
        expect(expectedTabs, `${enPath} must list office tabs to compare against`).toBe(4);
        expect(expectedPhotos, `${enPath} must show office photos to compare against`)
          .toBeGreaterThan(0);

        await page.goto(guidancePublicPath(locale, pageKey), { waitUntil: 'domcontentloaded' });
        const band = page.locator('section[data-guidance-offices="true"]');
        await expect(band).toBeAttached();
        await expect(band).toHaveAttribute('id', 'offices');
        await expect(band.locator('[role="tab"]')).toHaveCount(expectedTabs);
        await expect(band.locator('img')).toHaveCount(expectedPhotos);
        await expect(band.locator('iframe')).toHaveCount(expectedIframes);
        await expect(band.locator('a[href^="tel:"]')).toHaveCount(expectedTel);

        const copy = guidanceOfficeCopy[locale];
        await expect(band).toContainText(copy.title);
        for (const title of Object.values(copy.officeTitles)) {
          await expect(band.locator('[role="tab"]', { hasText: title })).toHaveCount(1);
        }

        // The home page runs inside the cinematic scroll shell `/en` also uses,
        // so the click-through below is asserted on the contact page, where the
        // section sits in normal document flow in every language.
        if (pageKey !== 'contact') return;

        await band.scrollIntoViewIfNeeded();
        await expect(band).toBeVisible();

        // No information is lost to the tabs: every office's canonical address
        // (and its phone number, where the record has one) is reachable by
        // clicking that office's tab.
        for (const [officeId, title] of Object.entries(copy.officeTitles)) {
          await band.locator('[role="tab"]', { hasText: title }).click();
          const card = band.locator('[data-guidance-office]');
          await expect(card).toHaveAttribute('data-guidance-office', officeId);
          await expect(card.locator('.card-title')).toHaveText(title);
          const address = ((await card.locator('.card-copy').first().textContent()) ?? '').trim();
          expect(address.length, `${locale} ${officeId} address`).toBeGreaterThan(10);
          if (officeId !== 'taipei') {
            await expect(
              card.locator('a[href^="tel:"]'),
              `${locale} ${officeId} phone number`,
            ).toHaveCount(1);
          }
        }

        // Taipei is the opening tab and carries the three office photographs.
        await band.locator('[role="tab"]', { hasText: copy.officeTitles.taipei }).click();
        const photos = band.locator('[data-guidance-office-photo] img');
        await expect(photos).toHaveCount(expectedPhotos);
        for (let i = 0; i < expectedPhotos; i += 1) {
          const img = photos.nth(i);
          await expect(img).toHaveAttribute('alt', /\S/);
          await img.scrollIntoViewIfNeeded();
          await expect
            .poll(async () => img.evaluate((node) => (node as HTMLImageElement).naturalWidth))
            .toBeGreaterThan(0);
        }

        await expect.poll(() => documentOverflowPx(page)).toBeLessThanOrEqual(1);
      });
    }
  }

  /**
   * The roster must never read as "we can consult in this language". The four
   * consultation languages notice is the only language claim on the page.
   */
  for (const locale of GUIDANCE_LOCALES_4) {
    test(`${locale} /lawyers roster adds no consultation-language claim`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(guidancePublicPath(locale, 'lawyers'), { waitUntil: 'domcontentloaded' });
      const roster = page.locator('section[data-guidance-team="true"]');
      await expect(roster).toBeVisible();
      const rosterText = ((await roster.textContent()) ?? '').toLowerCase();
      // Only the four NEW languages are checked. The canonical English bio
      // does mention English / Chinese / Japanese / Korean — those are the
      // firm's four consultation languages and saying so is correct. What must
      // never appear is a guidance language presented as a working language.
      for (const guidance of GUIDANCE_LOCALES_4) {
        const autonym = PUBLIC_LANGUAGE_AUTONYMS[guidance];
        expect(
          rosterText.includes(autonym.toLowerCase()),
          `roster must not name ${autonym} as a working language`,
        ).toBe(false);
      }
    });
  }
});

/**
 * O19 count vectors. Every expected number is read from the English page in
 * the same run, so nothing here is hard-coded to today's content.
 *
 * `allowances` records the differences the audit found to be deliberate and
 * says why. A page not listed must match /en exactly on every vector.
 */
type CountVector = {
  teamImages: number;
  serviceCards: number;
  iframes: number;
  telLinks: number;
  mapLinks: number;
  jsonLdTypes: string[];
};

async function readCountVector(page: Page, path: string): Promise<CountVector> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  return page.evaluate(() => {
    const decoded = (value: string) => {
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    };
    const images = Array.from(document.querySelectorAll('img'));
    const jsonLdTypes = new Set<string>();
    for (const node of Array.from(
      document.querySelectorAll('script[type="application/ld+json"]'),
    )) {
      try {
        const parsed = JSON.parse(node.textContent ?? '');
        for (const entry of Array.isArray(parsed) ? parsed : [parsed]) {
          const type = entry?.['@type'];
          for (const value of Array.isArray(type) ? type : [type]) {
            if (typeof value === 'string') jsonLdTypes.add(value);
          }
        }
      } catch {
        /* a malformed block is caught by the SEO suite, not here */
      }
    }
    return {
      teamImages: images.filter((img) => decoded(img.getAttribute('src') ?? '').includes('/images/team/')).length,
      serviceCards: document.querySelectorAll('.services-detail-card').length,
      iframes: document.querySelectorAll('iframe').length,
      telLinks: document.querySelectorAll('a[href^="tel:"]').length,
      mapLinks: document.querySelectorAll('a[href*="google.com/maps"], a[href*="maps.app.goo.gl"]').length,
      jsonLdTypes: Array.from(jsonLdTypes).sort(),
    };
  });
}

/**
 * Deliberate differences, with the reason. Anything not listed must match /en.
 *   - home `teamImages`: the English home runs `HomeAttorneySplit`, a
 *     single-portrait editorial block whose copy has no guidance-language
 *     source. The roster lives on /lawyers and /about instead.
 *   - JSON-LD: closed by WO-O28. The guidance pages now emit the English
 *     `@type` set minus {@link JSON_LD_TYPE_EXCEPTIONS}.
 */
const O19_ALLOWANCES: Partial<
  Record<string, Partial<Record<keyof CountVector, 'skip'>>>
> = {
  home: { teamImages: 'skip' },
};

/**
 * `@type` values `/en` emits that a guidance page must NOT reproduce.
 *
 * `SearchAction` is the single entry: the four site locales advertise
 * `/{locale}/search`, and the guidance surface publishes ten pages and no
 * search route. Emitting the action anyway would point crawlers and answer
 * engines at a 404 and claim a capability the page does not have.
 */
const JSON_LD_TYPE_EXCEPTIONS = new Set(['SearchAction']);

test.describe('O19 count vectors vs /en', () => {
  const VECTOR_PAGES = ['home', 'services', 'about', 'lawyers', 'contact'] as const;

  for (const pageKey of VECTOR_PAGES) {
    for (const locale of GUIDANCE_LOCALES_4) {
      test(`${locale} /${pageKey} matches the /en count vector`, async ({ page }) => {
        await page.setViewportSize(DESKTOP);
        const enPath = pageKey === 'home' ? '/en' : `/en/${pageKey}`;
        const expected = await readCountVector(page, enPath);
        const actual = await readCountVector(
          page,
          guidancePublicPath(locale, pageKey as GuidancePageKey),
        );
        const allowance = O19_ALLOWANCES[pageKey] ?? {};

        // WO-O29 A: `telLinks` and `mapLinks` are compared exactly, like the
        // rest. They used to be a `>=` comparison because the guidance pages
        // rendered a flat office band while `/en` renders `OfficeMapTabs`; all
        // eight locales now render the same tabs, so the counts must agree.
        for (const key of [
          'teamImages',
          'serviceCards',
          'iframes',
          'telLinks',
          'mapLinks',
        ] as const) {
          if (allowance[key] === 'skip') continue;
          expect(actual[key], `${locale}/${pageKey} ${key} (en=${expected[key]})`).toBe(
            expected[key],
          );
        }

        if (allowance.jsonLdTypes !== 'skip') {
          for (const type of expected.jsonLdTypes) {
            if (JSON_LD_TYPE_EXCEPTIONS.has(type)) continue;
            expect(actual.jsonLdTypes, `${locale}/${pageKey} JSON-LD @type`).toContain(type);
          }
        }
      });
    }
  }

  /**
   * WO-O28. The `@type` comparison, over all ten published guidance pages.
   * The expected set is read from the matching `/en` page in the same run —
   * nothing is hard-coded — and the guidance page must be a superset of it
   * once {@link JSON_LD_TYPE_EXCEPTIONS} is removed.
   */
  const JSON_LD_PAGES: readonly GuidancePageKey[] = [
    'home',
    'services',
    'about',
    'lawyers',
    'pricing',
    'contact',
    'faq',
    'privacy',
    'disclaimer',
    'columns',
  ];

  for (const pageKey of JSON_LD_PAGES) {
    for (const locale of GUIDANCE_LOCALES_4) {
      test(`${locale} /${pageKey} JSON-LD @type set covers /en`, async ({ page }) => {
        const enPath = pageKey === 'home' ? '/en' : `/en/${pageKey}`;
        const expected = await readCountVector(page, enPath);
        const actual = await readCountVector(page, guidancePublicPath(locale, pageKey));

        const required = expected.jsonLdTypes.filter(
          (type) => !JSON_LD_TYPE_EXCEPTIONS.has(type),
        );
        expect(required.length, `/en/${pageKey} must publish structured data`).toBeGreaterThan(0);

        const missing = required.filter((type) => !actual.jsonLdTypes.includes(type));
        expect(
          missing,
          `${locale}/${pageKey} missing @type (en=${expected.jsonLdTypes.join(',')}, actual=${actual.jsonLdTypes.join(',')})`,
        ).toEqual([]);

        // The exception must actually be absent, not merely tolerated.
        for (const excepted of JSON_LD_TYPE_EXCEPTIONS) {
          expect(
            actual.jsonLdTypes,
            `${locale}/${pageKey} must not emit ${excepted}`,
          ).not.toContain(excepted);
        }
      });
    }
  }

  /**
   * English chrome labels that used to survive on the guidance pages. Proper
   * nouns, e-mail addresses and Taiwan addresses are exempt and are not listed.
   */
  const ENGLISH_CHROME_RESIDUE = [
    'Offices',
    'Taipei Office',
    'Official consultation email',
    'Copy email address',
    'Follow',
    'Sitemap',
  ] as const;

  for (const locale of GUIDANCE_LOCALES_4) {
    test(`${locale} footer carries no English chrome label`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto(guidancePublicPath(locale, 'home'), { waitUntil: 'domcontentloaded' });
      const footerHtml = await page.evaluate(() => {
        const footer = document.querySelector('footer.site-footer');
        if (!footer) return '';
        // aria-labels and titles count: they are read out loud.
        return `${footer.outerHTML}`;
      });
      expect(footerHtml, 'the public footer must render').not.toBe('');
      for (const label of ENGLISH_CHROME_RESIDUE) {
        expect(footerHtml.includes(label), `footer must not contain "${label}"`).toBe(false);
      }
    });

    test(`${locale} page titles carry the firm name`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      await page.goto('/en/lawyers', { waitUntil: 'domcontentloaded' });
      const enTitle = await page.title();
      const brand = enTitle.split('|').pop()?.trim() ?? '';
      expect(brand, '/en/lawyers title must carry a brand suffix').not.toBe('');

      for (const pageKey of ['home', 'lawyers', 'contact'] as const) {
        await page.goto(guidancePublicPath(locale, pageKey), { waitUntil: 'domcontentloaded' });
        expect(await page.title(), `${locale}/${pageKey} title`).toContain(brand);
      }
    });
  }
});

/**
 * WO-O29 C. `og:locale` was published by ko/zh-hant/en/ja and by no guidance
 * page, because the guidance routes build their metadata by hand and emitted
 * no Open Graph block at all. `og:locale:alternate` must stay absent in all
 * eight languages: the four site locales emit none, and parity is "at least
 * the /en set".
 */
test.describe('O29 og:locale across the eight public locales', () => {
  const EXPECTED_OG_LOCALE: Record<PublicLocale8, string> = {
    ko: 'ko_KR',
    'zh-hant': 'zh_TW',
    en: 'en_US',
    ja: 'ja_JP',
    vi: 'vi_VN',
    id: 'id_ID',
    th: 'th_TH',
    fil: 'fil_PH',
  };

  for (const locale of PUBLIC_LOCALES_8) {
    test(`${locale} home publishes og:locale ${EXPECTED_OG_LOCALE[locale]}`, async ({ page }) => {
      await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
      const values = await page.evaluate(() =>
        Array.from(document.querySelectorAll('meta[property="og:locale"]')).map((node) =>
          node.getAttribute('content'),
        ),
      );
      expect(values, `/${locale} og:locale`).toEqual([EXPECTED_OG_LOCALE[locale]]);

      const alternates = await page.evaluate(
        () => document.querySelectorAll('meta[property="og:locale:alternate"]').length,
      );
      expect(alternates, `/${locale} og:locale:alternate`).toBe(0);
    });
  }

  for (const locale of GUIDANCE_LOCALES_4) {
    test(`${locale} inner guidance pages publish og:locale`, async ({ page }) => {
      for (const pageKey of ['contact', 'columns'] as const) {
        await page.goto(guidancePublicPath(locale, pageKey), { waitUntil: 'domcontentloaded' });
        const value = await page.evaluate(
          () =>
            document
              .querySelector('meta[property="og:locale"]')
              ?.getAttribute('content') ?? null,
        );
        expect(value, `${locale}/${pageKey} og:locale`).toBe(EXPECTED_OG_LOCALE[locale]);
      }
    });
  }
});

/**
 * WO-O33 — `/lawyers` composition parity with `/en`.
 *
 * The three prose cards the guidance `lawyers` page used to carry were a
 * duplicate of the English key-facts rows, a third copy of the consultation
 * language notice, and a jurisdiction disclaimer that belongs on the
 * disclaimer page. They pushed the roster two screens down and made the page
 * body roughly twice the length of `/en`. This suite is the gate that keeps
 * the two surfaces the same shape.
 *
 * Every expected value is READ FROM `/en` in the same run. Nothing below is a
 * hard-coded count, a hard-coded block order, or a hard-coded name.
 */
test.describe('O33 /lawyers composition parity with /en', () => {
  /**
   * Role vocabulary. A block's role is its `data-page-block` attribute when it
   * has one, otherwise the stable class name the shared components already
   * carry. Reading the class is deliberate: `/en` is byte-frozen for this work
   * order, so the four site locales are not given new attributes just to be
   * measured. Both surfaces are resolved through this one map, so the English
   * sequence is measured, not assumed.
   */
  const BLOCK_ROLE_BY_CLASS: ReadonlyArray<readonly [string, string]> = [
    ['page-header', 'header'],
    ['attorney-team-section', 'roster'],
    ['attorney-facts-section', 'attorney-facts'],
    ['home-contact-cta', 'contact-band'],
  ];

  /**
   * Blocks a guidance page may add to the English sequence, and why:
   *   - `answer-summary`: the answer-first paragraph all six answerable
   *     guidance pages carry for generative engines. Capped at one paragraph.
   *   - `contact-band`: the closing CTA band every guidance page ends with,
   *     including the home page. `/en/lawyers` has no equivalent.
   */
  const ALLOWED_INSERTIONS = new Set(['answer-summary', 'contact-band']);

  type PageShape = {
    roles: string[];
    headingCount: number;
    articleHeadingCount: number;
    textLength: number;
    comparableTextLength: number;
    insertedTextLength: number;
    answerParagraphs: number;
    firstBodySectionTeamImages: number;
    rosterText: string;
  };

  async function readPageShape(page: Page, path: string): Promise<PageShape> {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    return page.evaluate(
      ({ roleMap, insertions }) => {
        const decoded = (value: string) => {
          try {
            return decodeURIComponent(value);
          } catch {
            return value;
          }
        };
        const main = document.querySelector('main#main');
        if (!main) throw new Error('page has no <main id="main"> landmark');

        const sections = Array.from(main.querySelectorAll('section')).filter(
          (section) => !section.closest('nav'),
        );
        const roleOf = (section: Element): string => {
          const explicit = section.getAttribute('data-page-block');
          if (explicit) return explicit;
          for (const [className, role] of roleMap) {
            if (section.classList.contains(className)) return role;
          }
          return `unknown:${section.className}`;
        };
        const roles = sections.map(roleOf);

        // K2: the first block that is neither the header nor an allowed
        // answer paragraph must be the one carrying the portraits.
        const firstBody = sections.find((section) => {
          const role = roleOf(section);
          return role !== 'header' && insertions.includes(role) === false;
        });
        const teamImages = firstBody
          ? Array.from(firstBody.querySelectorAll('img')).filter((img) =>
              decoded(img.getAttribute('src') ?? '').includes('/images/team/'),
            ).length
          : 0;

        const headings = Array.from(main.querySelectorAll('h1,h2,h3')).filter(
          (node) => !node.closest('nav'),
        );
        // The guidance pages wrap their own copy in one <article>; `/en` has no
        // such wrapper, so its whole <main> is the equivalent region. The
        // closing contact band sits outside the article in both readings.
        const article = main.querySelector('article[data-guidance-article="true"]');
        const articleHeadings = Array.from(
          (article ?? main).querySelectorAll('h1,h2,h3'),
        ).filter((node) => !node.closest('nav'));

        const blockText = (node: Element) =>
          ((node as HTMLElement).innerText || '').replace(/\s+/g, ' ').trim().length;
        // K3 compares like with like: the blocks that have an English
        // counterpart. The two allowed insertions are measured separately and
        // capped, so they cannot grow into a second page body unnoticed.
        const comparableTextLength = sections
          .filter((section) => !insertions.includes(roleOf(section)))
          .reduce((total, section) => total + blockText(section), 0);
        const insertedTextLength = sections
          .filter((section) => insertions.includes(roleOf(section)))
          .reduce((total, section) => total + blockText(section), 0);

        const answerBlock = main.querySelector('[data-page-block="answer-summary"]');
        const answerParagraphs = answerBlock ? answerBlock.querySelectorAll('p').length : 0;

        const rosterNodes = Array.from(
          main.querySelectorAll('.attorney-team-section, .attorney-facts-section'),
        );

        return {
          roles,
          headingCount: headings.length,
          articleHeadingCount: articleHeadings.length,
          textLength: ((main as HTMLElement).innerText || '').replace(/\s+/g, ' ').trim().length,
          comparableTextLength,
          insertedTextLength,
          answerParagraphs,
          firstBodySectionTeamImages: teamImages,
          rosterText: rosterNodes
            .map((node) => (node as HTMLElement).innerText || '')
            .join('\n\n'),
        };
      },
      { roleMap: BLOCK_ROLE_BY_CLASS, insertions: [...ALLOWED_INSERTIONS] },
    );
  }

  /** Leaf text blocks, the rendered equivalent of the checker's markdown blocks. */
  function textBlocks(text: string): string[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  /**
   * K6 token universe: the values that must survive translation unchanged.
   * Emails and years are found by pattern; the institution and firm names come
   * from `GUIDANCE_BIO_PRESERVED_TERMS`, which the unit gate asserts is a
   * subset of `teamContent.en` — so no name here is invented either.
   */
  function factTokens(text: string): string[] {
    const flat = text.replace(/\s+/g, ' ');
    const emails = flat.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/gu) ?? [];
    const years = flat.match(/\b(?:19|20)\d{2}\b/gu) ?? [];
    const names = GUIDANCE_BIO_PRESERVED_TERMS.filter((term) => flat.includes(term));
    return Array.from(new Set([...emails, ...years, ...names])).sort();
  }

  for (const locale of GUIDANCE_LOCALES_4) {
    test(`${locale} /lawyers K1 block sequence equals /en plus allowed insertions`, async ({
      page,
    }) => {
      await page.setViewportSize(DESKTOP);
      const en = await readPageShape(page, '/en/lawyers');
      const actual = await readPageShape(page, guidancePublicPath(locale, 'lawyers'));

      expect(en.roles.filter((role) => role.startsWith('unknown:')), '/en block roles').toEqual([]);
      expect(
        actual.roles.filter((role) => role.startsWith('unknown:')),
        `${locale} block roles`,
      ).toEqual([]);
      expect(en.roles.length, '/en/lawyers must publish blocks to compare against')
        .toBeGreaterThan(0);

      // Sequence, not set and not count: the defect the previous gate missed
      // was that the roster came after two screens of prose.
      expect(
        actual.roles.filter((role) => !ALLOWED_INSERTIONS.has(role)),
        `${locale}/lawyers block sequence (en=${en.roles.join(' > ')}, actual=${actual.roles.join(' > ')})`,
      ).toEqual(en.roles);

      // The answer block is one paragraph, never a second body of copy.
      expect(actual.answerParagraphs, `${locale}/lawyers answer paragraphs`).toBeLessThanOrEqual(1);
    });

    test(`${locale} /lawyers K2 first body block carries the portraits`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      const en = await readPageShape(page, '/en/lawyers');
      const actual = await readPageShape(page, guidancePublicPath(locale, 'lawyers'));
      expect(en.firstBodySectionTeamImages, '/en first body block portraits').toBeGreaterThan(0);
      expect(
        actual.firstBodySectionTeamImages,
        `${locale}/lawyers first body block portraits`,
      ).toBe(en.firstBodySectionTeamImages);
    });

    /**
     * K3. The blocks that have an English counterpart — everything except the
     * two insertions K1 allows — must stay within 0.7-1.4x of `/en`. That is
     * the measurement the defect was about: the guidance body was roughly
     * twice `/en` because of three prose cards, and it is now 1.15-1.30x,
     * which is ordinary Vietnamese / Indonesian / Thai / Filipino expansion
     * over English rather than extra content.
     *
     * `/en/lawyers` has no answer paragraph and no contact band at all, so
     * including them would compare a page against a page that does not exist
     * and would fail for a reason unrelated to the defect. They are bounded
     * instead: together they may never be more than 40% of the page's own
     * body, so neither can quietly become a second body of copy.
     */
    test(`${locale} /lawyers K3 body length stays within 0.7-1.4x of /en`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      const en = await readPageShape(page, '/en/lawyers');
      const actual = await readPageShape(page, guidancePublicPath(locale, 'lawyers'));
      expect(en.insertedTextLength, '/en/lawyers has no insertable block').toBe(0);

      const ratio = actual.comparableTextLength / en.comparableTextLength;
      const detail = `${locale}/lawyers comparable text ${actual.comparableTextLength} vs /en ${en.comparableTextLength}`
        + ` (ratio ${ratio.toFixed(3)}; whole main ${actual.textLength} vs ${en.textLength})`;
      expect(ratio, detail).toBeGreaterThanOrEqual(0.7);
      expect(ratio, detail).toBeLessThanOrEqual(1.4);

      const insertedShare = actual.insertedTextLength / actual.textLength;
      expect(
        insertedShare,
        `${locale}/lawyers answer + contact band are ${(insertedShare * 100).toFixed(1)}% of the page body`,
      ).toBeLessThanOrEqual(0.4);
    });

    /**
     * K4. Two halves, and both are needed.
     *
     * The column checker's `english` and `forbidden` rules are pure functions
     * over strings, and the unit gate
     * (`src/data/__tests__/guidance-team-bios.test.ts`) runs them over
     * `guidanceRosterTextBlocks(locale)` — the exact list of blocks these two
     * sections render. What a browser adds is proof that the page renders
     * that list and nothing else: every rendered line must be a member of it,
     * so a string cannot reach a reader without having passed the rules.
     * Comparison is case-insensitive because CSS uppercases the field labels.
     */
    test(`${locale} /lawyers K4 roster and key facts are in the page language`, async ({
      page,
    }) => {
      await page.setViewportSize(DESKTOP);
      const en = await readPageShape(page, '/en/lawyers');
      const actual = await readPageShape(page, guidancePublicPath(locale, 'lawyers'));
      expect(en.rosterText.length, '/en roster text').toBeGreaterThan(0);
      expect(actual.rosterText.length, `${locale} roster text`).toBeGreaterThan(0);

      const vetted = new Set(
        guidanceRosterTextBlocks(locale, { showIntro: false, includeFacts: true }).map(
          normalizeGuidanceTextBlock,
        ),
      );
      const rendered = textBlocks(actual.rosterText).map(normalizeGuidanceTextBlock);
      expect(rendered.length, `${locale} rendered roster lines`).toBeGreaterThan(0);
      expect(
        rendered.filter((line) => !vetted.has(line)),
        `${locale}/lawyers renders text the language gate never checked`,
      ).toEqual([]);

      // The English canonical biography lines must be gone from the page.
      for (const member of teamContent.en.members) {
        if (!isGuidanceTeamMemberId(member.id)) continue;
        for (const field of ['intro', 'education'] as const) {
          for (const line of member[field]) {
            expect(
              actual.rosterText.replace(/\s+/g, ' ').includes(line.replace(/\s+/g, ' ')),
              `${locale}/lawyers still renders the English line: ${line}`,
            ).toBe(false);
          }
        }
      }

      // Allowances: the institution and firm names the canonical record
      // publishes, e-mail addresses, and the "(English)" label on the English
      // profile link are the only Latin runs the page may carry.
      expect(/[가-힣]/u.test(actual.rosterText), `${locale} roster must contain no Hangul`).toBe(
        false,
      );
      // Han is allowed only where `/en` renders it (today: nowhere) or where
      // this locale's own published consultation notice already carries it —
      // the Indonesian notice writes "bahasa Tionghoa (中文)" because that is
      // how an Indonesian reader is told which Chinese is meant. A Han
      // character from anywhere else would mean a biography drifted.
      const allowedHan = new Set([
        ...(en.rosterText.match(/\p{Script=Han}/gu) ?? []),
        ...(internationalInquiryCopy[locale].consultationNotice.match(/\p{Script=Han}/gu) ?? []),
      ]);
      const actualHan = Array.from(new Set(actual.rosterText.match(/\p{Script=Han}/gu) ?? []))
        .sort();
      expect(
        actualHan.filter((character) => !allowedHan.has(character)),
        `${locale} roster Han characters (allowed=${[...allowedHan].join('')})`,
      ).toEqual([]);
    });

    test(`${locale} /lawyers K5 heading count equals /en`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      const en = await readPageShape(page, '/en/lawyers');
      const actual = await readPageShape(page, guidancePublicPath(locale, 'lawyers'));
      expect(en.articleHeadingCount, '/en heading count').toBeGreaterThan(0);
      expect(actual.articleHeadingCount, `${locale}/lawyers h1-h3 count`).toBe(
        en.articleHeadingCount,
      );
    });

    test(`${locale} /lawyers K6 renders the same facts as /en`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      const en = await readPageShape(page, '/en/lawyers');
      const actual = await readPageShape(page, guidancePublicPath(locale, 'lawyers'));
      const expected = factTokens(en.rosterText);
      expect(expected.length, '/en must publish facts to compare against').toBeGreaterThan(0);
      expect(factTokens(actual.rosterText), `${locale}/lawyers fact tokens`).toEqual(expected);

      // The localized key-facts block states the same three rows `/en` does.
      const facts = buildGuidanceAttorneyFacts(locale);
      expect(facts, `${locale} key facts`).toBeTruthy();
      const factsBlock = page.locator('[data-guidance-attorney-facts="true"]');
      await expect(factsBlock).toHaveCount(1);
      await expect(factsBlock).toContainText(facts?.heading ?? '');
      await expect(factsBlock).toContainText(facts?.qualification ?? '');
      for (const area of facts?.practiceAreas ?? []) {
        await expect(factsBlock).toContainText(area);
      }
      for (const language of facts?.languages ?? []) {
        await expect(factsBlock).toContainText(language);
      }
    });
  }

  /**
   * K7. The same shape across the four guidance languages, on all ten
   * published pages — not just `lawyers`. A page that gains a block or a
   * heading in one language only is the defect this catches.
   */
  const ALL_GUIDANCE_PAGES: readonly GuidancePageKey[] = [
    'home',
    'services',
    'about',
    'lawyers',
    'pricing',
    'contact',
    'faq',
    'privacy',
    'disclaimer',
    'columns',
  ];

  for (const pageKey of ALL_GUIDANCE_PAGES) {
    test(`K7 /${pageKey} has the same shape in vi, id, th and fil`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);
      const shapes: Array<{ locale: GuidanceLocale4; shape: PageShape; sections: number }> = [];
      for (const locale of GUIDANCE_LOCALES_4) {
        shapes.push({
          locale,
          shape: await readPageShape(page, guidancePublicPath(locale, pageKey)),
          sections: guidanceContent[locale].pages[pageKey].sections.length,
        });
      }
      const [first, ...rest] = shapes;
      for (const entry of rest) {
        expect(
          entry.shape.roles,
          `/${pageKey} block sequence ${entry.locale} vs ${first.locale}`,
        ).toEqual(first.shape.roles);
        expect(
          entry.shape.articleHeadingCount,
          `/${pageKey} heading count ${entry.locale} vs ${first.locale}`,
        ).toBe(first.shape.articleHeadingCount);
        expect(
          entry.sections,
          `/${pageKey} sections ${entry.locale} vs ${first.locale}`,
        ).toBe(first.sections);
      }
    });
  }
});
