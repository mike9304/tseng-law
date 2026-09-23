import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/vi',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import GuidanceHomeBody, {
  resolveGuidanceHomeColumns,
  guidanceHomeServiceCards,
  type GuidanceHomeColumnSource,
} from '@/components/GuidanceHomeBody';
import HeroMediaBackground from '@/components/HeroMediaBackground';
import TaiwanHeritageInterlude from '@/components/TaiwanHeritageInterlude';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { GUIDANCE_CONSULTATION_LANGUAGES } from '@/lib/seo';
import type { ColumnPost } from '@/lib/column-post';
import type { SiteLocale } from '@/lib/locales';
import {
  GUIDANCE_LOCALES_4,
  PUBLIC_LOCALES_8,
  RTL_PUBLIC_LOCALES,
  isGuidanceLocale4,
  isRtlDocumentLanguage,
  publicDocumentLanguage,
  type GuidanceLocale4,
  type PublicLocale8,
} from '@/lib/public-guidance';
import Header from '@/components/Header';
import GuidancePageBody from '@/components/GuidancePageBody';
import {
  AboutLegacyPageBody,
  ColumnsLegacyPageBody,
  ContactLegacyPageBody,
  ServicesLegacyPageBody,
} from '@/app/[locale]/(legacy)/legacy-page-bodies';

/**
 * Guidance homes use the English landmark order. Korean and Japanese homes
 * keep the order `LegacyHomePageBody` already renders.
 *
 * The footer is not asserted here because it lives in `[locale]/layout.tsx`
 * (shared with the existing four languages since O14), not in the page body;
 * the browser-side DOM parity artifact covers it.
 */

const HOME_LANDMARKS = [
  { id: 'hero', pattern: /<section\b[^>]*\bid="hero"/ },
  { id: 'practice', pattern: /<section\b[^>]*\bid="practice"/ },
  { id: 'heritage', pattern: /data-home-heritage-interlude="true"/ },
  { id: 'about', pattern: /<section\b[^>]*\bid="about"/ },
  { id: 'results', pattern: /<section\b[^>]*\bid="results"/ },
  { id: 'stats', pattern: /<section\b[^>]*\bid="stats"/ },
  { id: 'insights', pattern: /<section\b[^>]*\bid="insights"/ },
  { id: 'faq', pattern: /<section\b[^>]*\bid="faq"/ },
  { id: 'offices', pattern: /<section\b[^>]*\bid="offices"/ },
  { id: 'contact', pattern: /<section\b[^>]*\bid="contact"/ },
] as const;

const ENGLISH_HOME_LANDMARK_ORDER = HOME_LANDMARKS.map((landmark) => landmark.id);

function homeLandmarkReport(markup: string): Array<{ id: string; count: number; at: number }> {
  return HOME_LANDMARKS.map((landmark) => {
    const matches = [...markup.matchAll(new RegExp(landmark.pattern.source, 'g'))];
    return { id: landmark.id, count: matches.length, at: matches[0]?.index ?? -1 };
  });
}

/** Landmark ids in document order. Missing landmarks are omitted. */
function homeLandmarkSequence(markup: string): string[] {
  return homeLandmarkReport(markup)
    .filter((entry) => entry.count > 0)
    .sort((a, b) => a.at - b.at)
    .map((entry) => entry.id);
}

function expectLandmarksOnce(markup: string, label: string) {
  const report = homeLandmarkReport(markup);
  for (const entry of report) {
    expect(entry.count, `${label} ${entry.id}`).toBe(1);
  }
}

const EXPECTED_SEQUENCE = [...ENGLISH_HOME_LANDMARK_ORDER];

function fixturePost(index: number): ColumnPost {
  return {
    slug: `column-${index}`,
    title: `Column ${index}`,
    date: `2026-01-0${index}`,
    dateDisplay: `January ${index}, 2026`,
    readTime: '5 min read',
    category: 'corporate' as ColumnPost['category'],
    categoryLabel: 'Corporate',
    featuredImage: `/images/blog/column-${index}.webp`,
    content: '',
    summary: `Summary ${index}`,
  };
}

const FIXTURE_POSTS = [1, 2, 3, 4, 5].map(fixturePost);

const ORIGINAL_LANGUAGE_SOURCE: GuidanceHomeColumnSource = {
  sourceLocale: 'en',
  isOriginalLanguage: true,
  posts: FIXTURE_POSTS,
};

function renderGuidanceHome(
  locale: GuidanceLocale4,
  columns: GuidanceHomeColumnSource = ORIGINAL_LANGUAGE_SOURCE,
): string {
  return renderToStaticMarkup(<GuidanceHomeBody locale={locale} columns={columns} />);
}

describe('guidance home matches the English home composition', () => {
  it('gives the English home the landmark sequence the guidance home targets', () => {
    const markup = renderToStaticMarkup(
      <LegacyHomePageBody
        locale="en"
        posts={FIXTURE_POSTS.map((post) => ({
          slug: post.slug,
          title: post.title,
          date: post.date,
          dateDisplay: post.dateDisplay,
          readTime: post.readTime,
          categoryLabel: post.categoryLabel,
          featuredImage: post.featuredImage,
          summary: post.summary,
        }))}
        faqItems={[]}
      />,
    );
    expectLandmarksOnce(markup, 'en');
    expect(homeLandmarkSequence(markup)).toEqual(EXPECTED_SEQUENCE);
  });

  it('renders the same landmark sequence for every guidance locale', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const markup = renderGuidanceHome(locale);
      expectLandmarksOnce(markup, locale);
      expect(homeLandmarkSequence(markup), `${locale} home`).toEqual(EXPECTED_SEQUENCE);
      const distinction = guidanceContent[locale].pages.home.sections[1]?.heading;
      if (locale !== 'zh-hans') {
        expect(markup, `${locale} consultation-language notice`).toContain(distinction);
      }
      expect(markup, `${locale} booking widget`).not.toMatch(/data-booking|calendly|\/booking\b/i);
      expect(markup, `${locale} response-time SLA`).not.toMatch(/response within \d+|within 24 hours|reply within \d+ hours/i);
    }
  });

  it('uses the shared hero, archive and service-card markup', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const markup = renderGuidanceHome(locale);
      expect(markup, `${locale} hero media`).toContain('class="hero-media"');
      expect(markup, `${locale} hero actions`).toContain('hero-links-minimal hero-cta-actions');
      expect(markup, `${locale} archive grid`).toContain('class="insights-grid"');
      expect(markup, `${locale} archive featured`).toContain('class="insights-featured"');
      expect(markup, `${locale} service cards`).toContain('services-detail-list services-card-grid');
      expect(markup, `${locale} service card`).toContain('services-detail-card services-card');
    }
  });

  it('counts the four consultation languages, not the attorney profile languages', () => {
    // WO-X1 (EN-01): the EN attorney profile now also lists four languages, so
    // the count alone no longer tells the two sources apart; the stat must
    // still equal the consultation-language list published in JSON-LD.
    const profile = getAttorneyProfile('en', primaryAttorneySlug);
    expect(profile?.languages).toEqual(['English', 'Chinese', 'Korean', 'Japanese']);
    const consultationLanguages = [...GUIDANCE_CONSULTATION_LANGUAGES];
    for (const locale of GUIDANCE_LOCALES_4) {
      const label = guidanceTeamCopy[locale].consultationLanguagesLabel;
      const markup = renderGuidanceHome(locale);
      const card = markup.split('class="stat-card').slice(1).find((part) => part.includes(label));
      expect(card, `${locale} consultation stat`).toBeTruthy();
      const nodes = [...markup.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
        (match) => JSON.parse(match[1]) as { '@type'?: string; availableLanguage?: string[]; contactPoint?: Array<{ availableLanguage?: string[] }> },
      );
      const legalService = nodes.find((node) => node['@type'] === 'LegalService');
      expect(legalService?.availableLanguage, `${locale} json-ld languages`).toEqual(consultationLanguages);
      expect(legalService?.contactPoint?.[0]?.availableLanguage, `${locale} contact languages`).toEqual(
        consultationLanguages,
      );
      expect(card?.match(/data-count="(\d+)"/)?.[1], locale).toBe(
        String(legalService?.availableLanguage?.length),
      );
    }
  });

  it('renders exactly six service cards taken from the guidance services page', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const cards = guidanceHomeServiceCards(locale);
      expect(cards, `${locale} card count`).toHaveLength(6);
      const headings = guidanceContent[locale].pages.services.sections
        .slice(0, 6)
        .map((section) => section.heading);
      expect(cards.map((card) => card.title), `${locale} card titles`).toEqual(headings);

      const markup = renderGuidanceHome(locale);
      for (const heading of headings) {
        expect(markup, `${locale} renders ${heading}`).toContain(heading);
      }
    }
  });

  it('keeps the guidance homes structurally identical to one another', () => {
    const shapes = GUIDANCE_LOCALES_4.map((locale) =>
      renderGuidanceHome(locale)
        // Text nodes and human-readable attributes (alt, aria-label and the
        // iframe accessible name) differ by language, as does the locale
        // segment; everything structural must not.
        .replace(/>[^<]*</g, '><')
        .replace(/(alt|aria-label|title)="[^"]*"/g, '$1=""')
        .replace(new RegExp(`"/${locale}/`, 'g'), '"/{locale}/')
        .replace(new RegExp(`(data-locale|lang)="${locale}"`, 'g'), '$1="{locale}"')
        .replace(new RegExp(`\\b(id|aria-controls|aria-labelledby)="${locale}-`, 'g'), '$1="{locale}-'),
    );
    shapes.forEach((shape, index) => {
      expect(shape, `guidance home of ${GUIDANCE_LOCALES_4[index]} differs structurally from ${GUIDANCE_LOCALES_4[0]}`).toEqual(shapes[0]);
    });
  });

  it('labels source-language columns instead of presenting them as translated', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const pack = guidanceContent[locale];
      const markup = renderGuidanceHome(locale);
      expect(markup, `${locale} language badge`).toContain(
        pack.home.columnsOriginalLanguageBadge,
      );
      expect(markup, `${locale} original-language note`).toContain(
        pack.home.columnsOriginalLanguageNote,
      );
      expect(markup, `${locale} links to the source article`).toContain(
        '/en/columns/column-1',
      );
      expect(markup, `${locale} view-all goes to its own index`).toContain(
        `/${locale}/columns`,
      );
    }
  });

  it('drops the badge and links in-locale once translations exist', () => {
    const markup = renderGuidanceHome('vi', {
      sourceLocale: 'vi',
      isOriginalLanguage: false,
      posts: FIXTURE_POSTS,
    });
    expect(markup).not.toContain(guidanceContent.vi.home.columnsOriginalLanguageBadge);
    expect(markup).toContain('/vi/columns/column-1');
  });

  it('carries the LegalService JSON-LD as the first child, ahead of the hero', () => {
    // S2b: the home now emits structured data. It must sit before every
    // landmark so the section sequence asserted above is untouched, and the
    // consultation languages must stay the fixed four (page language != a
    // language the firm can be consulted in).
    const scriptPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    for (const locale of GUIDANCE_LOCALES_4) {
      const markup = renderGuidanceHome(locale);
      expect(markup, `${locale} json-ld is the first child`).toMatch(
        /^<div data-guidance-shell="true"[^>]*><script type="application\/ld\+json">/,
      );

      const nodes = [...markup.matchAll(scriptPattern)].map(
        (match) => JSON.parse(match[1]) as Record<string, unknown>,
      );
      // WO-O28 added the attorney `Person` node the English home already
      // emits. LegalService stays first, so the landmark sequence is unchanged.
      expect(nodes, `${locale} json-ld node count`).toHaveLength(2);
      expect(nodes[0]['@type'], `${locale} json-ld type`).toBe('LegalService');
      expect(nodes[1]['@type'], `${locale} second json-ld type`).toBe('Person');

      const availableLanguage = nodes[0].availableLanguage as string[];
      expect(availableLanguage, `${locale} consultation languages`).toEqual([
        ...GUIDANCE_CONSULTATION_LANGUAGES,
      ]);
      const contactLanguages = (nodes[0].contactPoint as Array<{ availableLanguage?: string[] }>)[0]
        ?.availableLanguage;
      expect(contactLanguages, `${locale} contact languages`).toEqual([
        ...GUIDANCE_CONSULTATION_LANGUAGES,
      ]);

      expectLandmarksOnce(markup, locale);
      expect(homeLandmarkSequence(markup), `${locale} landmarks after json-ld`).toEqual(
        EXPECTED_SEQUENCE,
      );
    }
  });

  it('omits the hero search bar, which has no index or route for these locales', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const markup = renderGuidanceHome(locale);
      expect(markup, `${locale} hero search`).not.toContain('hero-search-bar');
      expect(markup, `${locale} search route`).not.toContain(`/${locale}/search`);
    }
  });
});

describe('guidance home column source resolution', () => {
  it('prefers the locale translations when they exist', () => {
    const resolved = resolveGuidanceHomeColumns('th', (locale) =>
      locale === 'th' ? FIXTURE_POSTS : [],
    );
    expect(resolved.sourceLocale).toBe('th');
    expect(resolved.isOriginalLanguage).toBe(false);
  });

  it('falls back to English first when the locale has no files', () => {
    const resolved = resolveGuidanceHomeColumns('th', (locale) =>
      locale === 'th' ? [] : FIXTURE_POSTS,
    );
    expect(resolved.sourceLocale).toBe('en');
    expect(resolved.isOriginalLanguage).toBe(true);
  });

  it('walks the remaining source languages when English is empty', () => {
    const resolved = resolveGuidanceHomeColumns('id', (locale) =>
      locale === 'ja' ? FIXTURE_POSTS : [],
    );
    expect(resolved.sourceLocale).toBe('ja');
    expect(resolved.isOriginalLanguage).toBe(true);
  });
});

describe('the existing four languages keep their exact home markup', () => {
  it('renders the hero media background identically without the new prop', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as SiteLocale[]) {
      expect(
        renderToStaticMarkup(<HeroMediaBackground locale={locale} />),
        `${locale} hero media`,
      ).toEqual(
        renderToStaticMarkup(
          <HeroMediaBackground
            locale={locale}
            controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
          />,
        ),
      );
    }
  });

  it('renders the heritage interlude identically without the new props', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as SiteLocale[]) {
      const baseline = renderToStaticMarkup(<TaiwanHeritageInterlude locale={locale} />);
      expect(baseline, `${locale} interlude`).toEqual(
        renderToStaticMarkup(
          <TaiwanHeritageInterlude
            locale={locale}
            controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
          />,
        ),
      );
      expect(baseline).toContain('data-home-heritage-interlude="true"');
    }
  });

  it('keeps one of each landmark on Korean, Japanese, English, and Traditional Chinese homes', () => {
    for (const locale of ['ko', 'ja', 'zh-hant', 'en'] as const) {
      const markup = renderToStaticMarkup(
        <LegacyHomePageBody
          locale={locale}
          posts={FIXTURE_POSTS.map((post) => ({
            slug: post.slug,
            title: post.title,
            date: post.date,
            dateDisplay: post.dateDisplay,
            readTime: post.readTime,
            categoryLabel: post.categoryLabel,
            featuredImage: post.featuredImage,
            summary: post.summary,
          }))}
          faqItems={[]}
        />,
      );
      expectLandmarksOnce(markup, locale);
      expect(homeLandmarkSequence(markup), `${locale} order`).toEqual(EXPECTED_SEQUENCE);
    }
  });
});

function primaryNavHrefs(markup: string): string[] {
  const nav = markup.match(/<nav\b[^>]*\bid="mainNav"[\s\S]*?<\/nav>/)?.[0] ?? '';
  return [...nav.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]);
}

function actionHrefs(markup: string): string[] {
  const actions = markup.match(/class="[^"]*\bheader-actions\b[^"]*"[\s\S]*?<\/div>/)?.[0] ?? '';
  return [...actions.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);
}

describe('public headers share one chrome', () => {
  it('gives every public locale a skip link, firm mark, language control, and consultation action', () => {
    for (const locale of PUBLIC_LOCALES_8) {
      const markup = renderToStaticMarkup(<Header locale={locale as PublicLocale8} />);
      const primary = primaryNavHrefs(markup);
      const actions = actionHrefs(markup);
      const combined = [...primary, ...actions];
      expect(new Set(combined).size, `${locale} primary hrefs ${combined.join(' ')}`).toBe(combined.length);
      expect(markup, `${locale} skip`).toContain('href="#main"');
      expect(markup, `${locale} firm`).toContain(`href="/${locale}"`);
      expect(markup, `${locale} language`).toContain('aria-haspopup="dialog"');
      expect(markup, `${locale} consultation`).toMatch(/class="button nav-cta"[^>]*href="[^"]+"/);
      if (isGuidanceLocale4(locale)) {
        expect(markup, `${locale} videos`).not.toContain(`/${locale}/videos`);
        expect(markup, `${locale} login`).not.toContain(`/${locale}/login`);
      }
    }
  });

  it('keeps Korean, English, Japanese, and Traditional Chinese video links that already resolve', () => {
    for (const locale of ['ko', 'en', 'ja', 'zh-hant'] as const) {
      const markup = renderToStaticMarkup(<Header locale={locale} />);
      expect(primaryNavHrefs(markup), locale).toContain(`/${locale}/videos`);
    }
  });

  it('writes guidance nav labels in the page language', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const markup = renderToStaticMarkup(<Header locale={locale} />);
      const pack = guidanceContent[locale];
      expect(markup, locale).toContain(pack.nav.services);
      expect(markup, locale).toContain(pack.contactCta);
      expect(markup, locale).toContain(`href="#main">${pack.skipLink}</a>`);
      expect(markup, `${locale} duplicated faq search`).not.toContain('class="header-search-btn"');
    }
  });

  it('marks Arabic, Hebrew, Urdu, and Persian as right-to-left and keeps the consultation control above the nav', () => {
    for (const locale of RTL_PUBLIC_LOCALES) {
      expect(isRtlDocumentLanguage(publicDocumentLanguage(locale)), locale).toBe(true);
    }
    const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    const chrome = readFileSync(path.join(process.cwd(), 'src/components/PublicChrome.module.css'), 'utf8');
    expect(css).toContain("html[dir='rtl'] .header[data-public-site-header] .main-nav");
    expect(css).toContain('overflow: hidden');
    expect(chrome).toContain("html[dir='rtl'] .header:global(.header)[data-public-site-header][data-header-content-fit='compact'] .headerActions :global(.nav-cta)");
    expect(chrome).toContain(".header:global(.header)[data-public-site-header][data-header-content-fit='compact'] .headerActions :global(.nav-cta) {\n    display: inline-flex;");
    expect(chrome).toContain('transform: scale(0);');
    expect(chrome).toContain('max-width: calc(100% - 3.5rem);');
    expect(chrome).not.toContain("[data-header-content-fit='compact'] .headerUtility:global(.header-utility) {\n    display: none;");
    expect(chrome).toContain('display: inline-flex');
  });
});

describe('services, about, contact, and columns have one heading', () => {
  const pageKeys = ['services', 'about', 'contact', 'columns'] as const;

  it('renders one h1 on every guidance locale', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      for (const pageKey of pageKeys) {
        const markup = renderToStaticMarkup(<GuidancePageBody locale={locale} pageKey={pageKey} />);
        expect(markup.match(/<h1\b/g)?.length ?? 0, `${locale} ${pageKey}`).toBe(1);
        expect(markup, `${locale} ${pageKey} placeholder`).not.toMatch(/lorem ipsum|OPERATOR INSTRUCTION|sk-live-/i);
      }
    }
  });

  it('renders one h1 on the four site locales', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const pages = [
        renderToStaticMarkup(<AboutLegacyPageBody locale={locale} />),
        renderToStaticMarkup(<ServicesLegacyPageBody locale={locale} />),
        renderToStaticMarkup(<ContactLegacyPageBody locale={locale} />),
        renderToStaticMarkup(
          <ColumnsLegacyPageBody locale={locale} posts={FIXTURE_POSTS} />,
        ),
      ];
      for (const markup of pages) {
        expect(markup.match(/<h1\b/g)?.length ?? 0, locale).toBe(1);
      }
    }
  });
});
