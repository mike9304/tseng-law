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
  type GuidancePageKey,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { getSiteUrl } from '@/lib/seo';
import { guidanceOfficeCopy } from '@/data/international-guidance-offices';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { teamContent } from '@/data/team-members';
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
        await expect(roster).toContainText(copy.title);
        await expect(roster).toContainText(copy.representativeTitle);
        await expect(roster).toContainText(copy.teamTitle);
        await expect(roster).toContainText(copy.partnerTitle);
        await expect(roster).toContainText(copy.introLabel);
        await expect(roster).toContainText(copy.educationLabel);
        await expect(roster).toContainText(copy.experienceLabel);
        // The English-original biography lines are declared as such, in the
        // page language, instead of being passed off as a translation.
        await expect(roster.locator('[data-guidance-team-source-language="en"]')).toContainText(
          copy.sourceLanguageNote,
        );

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

  for (const locale of GUIDANCE_LOCALES_4) {
    test(`${locale} /contact renders office photos and addresses like /en`, async ({ page }) => {
      await page.setViewportSize(DESKTOP);

      await page.goto('/en/contact', { waitUntil: 'domcontentloaded' });
      const enOffices = page.locator('#offices');
      await expect(enOffices.first()).toBeVisible();
      const expectedOffices = await enOffices.locator('[role="tab"]').count();
      const expectedPhotos = await enOffices.locator('img').count();
      expect(expectedOffices, '/en/contact must list offices to compare against').toBeGreaterThan(0);
      expect(expectedPhotos, '/en/contact must show office photos to compare against')
        .toBeGreaterThan(0);

      await page.goto(guidancePublicPath(locale, 'contact'), { waitUntil: 'domcontentloaded' });
      const band = page.locator('section[data-guidance-offices="true"]');
      await expect(band).toBeVisible();
      await expect(band.locator('[data-guidance-office]')).toHaveCount(expectedOffices);
      await expect(band.locator('[data-guidance-office-photo] img')).toHaveCount(expectedPhotos);

      const copy = guidanceOfficeCopy[locale];
      await expect(band).toContainText(copy.title);
      await expect(band).toContainText(copy.mapLinkLabel);
      for (const title of Object.values(copy.officeTitles)) {
        await expect(band).toContainText(title);
      }

      const photos = band.locator('[data-guidance-office-photo] img');
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

        for (const key of ['teamImages', 'serviceCards', 'iframes'] as const) {
          if (allowance[key] === 'skip') continue;
          expect(actual[key], `${locale}/${pageKey} ${key} (en=${expected[key]})`).toBe(
            expected[key],
          );
        }

        // `OfficeMapTabs` puts three of the four offices behind inactive tabs,
        // so the English page exposes one office's phone number and map link at
        // a time. The guidance band lists all four at once, which is a superset,
        // never fewer. Equality here would force the guidance page to hide
        // canonical contact details it already renders correctly.
        for (const key of ['telLinks', 'mapLinks'] as const) {
          if (allowance[key] === 'skip') continue;
          expect(
            actual[key],
            `${locale}/${pageKey} ${key} must be at least the en count (en=${expected[key]})`,
          ).toBeGreaterThanOrEqual(expected[key]);
          if (expected[key] > 0) {
            expect(actual[key], `${locale}/${pageKey} ${key} must not be zero`).toBeGreaterThan(0);
          }
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
