import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
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
import type { ColumnPost } from '@/lib/column-post';
import type { SiteLocale } from '@/lib/locales';
import { GUIDANCE_LOCALES_4, type GuidanceLocale4 } from '@/lib/public-guidance';

/**
 * O16: the vi/id/th/fil home page must render the same landmark sequence as the
 * English home — full-bleed hero, column archive, service cards, editorial
 * image band, closing contact band — instead of the page-header + card stack
 * the other guidance pages use.
 *
 * The footer is not asserted here because it lives in `[locale]/layout.tsx`
 * (shared with the existing four languages since O14), not in the page body;
 * the browser-side DOM parity artifact covers it.
 */

const HOME_LANDMARKS = [
  { id: 'hero', pattern: /<section[^>]*\bid="hero"/ },
  { id: 'column-archive', pattern: /<section[^>]*\bid="insights"/ },
  { id: 'services', pattern: /<section[^>]*class="[^"]*services-bento/ },
  { id: 'image-band', pattern: /data-home-heritage-interlude="true"/ },
  { id: 'contact-cta', pattern: /<section[^>]*class="[^"]*home-contact-cta/ },
] as const;

/** Landmark ids in document order. */
function homeLandmarkSequence(markup: string): string[] {
  const found: Array<{ id: string; at: number }> = [];
  for (const landmark of HOME_LANDMARKS) {
    const match = landmark.pattern.exec(markup);
    if (match) found.push({ id: landmark.id, at: match.index });
  }
  return found.sort((a, b) => a.at - b.at).map((entry) => entry.id);
}

const EXPECTED_SEQUENCE = ['hero', 'column-archive', 'services', 'image-band', 'contact-cta'];

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
    expect(homeLandmarkSequence(markup)).toEqual(EXPECTED_SEQUENCE);
  });

  it('renders the same landmark sequence for every guidance locale', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      expect(homeLandmarkSequence(renderGuidanceHome(locale)), `${locale} home`).toEqual(
        EXPECTED_SEQUENCE,
      );
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
        .replace(new RegExp(`(data-locale|lang)="${locale}"`, 'g'), '$1="{locale}"'),
    );
    for (const shape of shapes) {
      expect(shape).toEqual(shapes[0]);
    }
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
        'en',
        'zh-Hant',
        'ja',
        'ko',
      ]);
      expect(availableLanguage, `${locale} consultation language count`).toHaveLength(4);

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
});
