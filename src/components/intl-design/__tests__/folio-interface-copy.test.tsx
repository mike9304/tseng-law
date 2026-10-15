import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/fr/columns',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
// Every article block visible, as on the published site.
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: async () => ({}),
  isBuilderDynamicTemplateBlockVisible: () => true,
}));

import Breadcrumbs from '@/components/Breadcrumbs';
import PageHeader from '@/components/PageHeader';
import ColumnsGrid, { type ColumnListItem } from '@/components/ColumnsGrid';
import ScrollTopButton from '@/components/ScrollTopButton';
import ColumnDetailView, { type ColumnDetailViewProps } from '@/app/[locale]/columns/[slug]/ColumnDetailView';
import { guidanceContent } from '@/data/international-guidance-content';
import { guidanceTeamCopy } from '@/data/international-guidance-team';
import { folioArticleCopy, folioResultsImageAlt } from '@/data/intl-design-ui';
import { folioChrome, folioChromeCopy } from '@/data/intl-design-chrome';
import { folioColumnsCopy } from '@/data/intl-design-columns-ui';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { getAllColumnPosts } from '@/lib/columns';
import { guidanceHomeResults } from '@/lib/guidance-home-bands';
import { INTL_DESIGN_LOCALES, type IntlDesignLocale } from '@/lib/intl-design-locales';
import { HOME_RESULTS_SHARED_IMAGE_ALT } from '@/components/HomeCaseResultsSplit';

/** English fallbacks the review found on Folio pages (shell, rail, attorney card, list, chrome). */
const ENGLISH_FALLBACKS = [
  'Book Consultation',
  'If you have any questions about Taiwan law',
  'Contact Us',
  'Related Topics',
  'Reviewing Attorney',
  'Consulting Attorney',
  'Attorney Wei Tseng',
  'Lead Attorney',
  'Core Practice Areas',
  'Public Profiles and Channels',
  'Full Profile',
  'Email about a consultation',
  'In this article',
  '← Previous',
  'Next →',
  'If the table extends beyond the screen',
  'Back to Insights',
  'Search columns',
  'Search title, summary or tag',
  'Reviewed by Wei Tseng',
  'Current location',
  'Back to top',
  'Related reading',
];

const flatten = (value: unknown): string[] =>
  typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(flatten) : [];

async function articleProps(locale: IntlDesignLocale, slug: string): Promise<ColumnDetailViewProps> {
  const { default: Page } = await import('@/app/[locale]/columns/[slug]/page');
  const element = await Page({ params: Promise.resolve({ locale, slug }) });
  return (element as ReactElement<ColumnDetailViewProps>).props;
}

describe('Folio interface copy maps', () => {
  it('cover exactly the 29 Folio locales with non-empty, non-English values', () => {
    for (const map of [folioChromeCopy, folioColumnsCopy, folioArticleCopy, folioResultsImageAlt]) {
      expect(Object.keys(map).sort()).toEqual([...INTL_DESIGN_LOCALES].sort());
      for (const locale of INTL_DESIGN_LOCALES) {
        for (const text of flatten(map[locale])) {
          expect(text.trim(), `${locale}: ${text}`).not.toBe('');
          for (const english of ENGLISH_FALLBACKS) expect(text).not.toContain(english);
        }
      }
    }
    for (const locale of INTL_DESIGN_LOCALES) {
      expect(folioColumnsCopy[locale].resultCount).toContain('{n}');
      expect(folioArticleCopy[locale].byline).toContain('Wei Tseng');
      expect(folioResultsImageAlt[locale]).not.toBe(HOME_RESULTS_SHARED_IMAGE_ALT);
    }
  });

  it('reuses the reviewed pack wording for the column byline and the home label', () => {
    for (const locale of INTL_DESIGN_LOCALES) {
      expect(folioColumnsCopy[locale].reviewedBy).toBe(guidanceContent[locale].home.columnsReviewLabel);
      expect(folioChrome(locale)?.home).toBe(guidanceContent[locale].nav.home);
    }
    expect(folioChrome('ko')).toBeNull();
    expect(folioChrome('ms')).toBeNull();
  });

  it('localizes the home results image alt only on Folio locales', () => {
    expect(guidanceHomeResults('fr').imageAlt).toBe(folioResultsImageAlt.fr);
    expect(guidanceHomeResults('ms').imageAlt).toBe(HOME_RESULTS_SHARED_IMAGE_ALT);
  });
});

describe('Folio article shell (every locale)', () => {
  it.each(INTL_DESIGN_LOCALES)('%s renders the article without English fallbacks and keeps provenance', async (locale) => {
    const posts = getAllColumnPosts(locale);
    const reviewed = posts.find((post) => !isAiAuthoredColumn(post));
    expect(reviewed).toBeDefined();
    const props = await articleProps(locale, reviewed!.slug);
    const html = renderToStaticMarkup(<ColumnDetailView {...props} />);
    const pack = guidanceContent[locale];
    for (const english of ENGLISH_FALLBACKS) {
      expect(html, `${locale} html: ${english}`).not.toContain(english);
      expect(JSON.stringify(props), `${locale} props: ${english}`).not.toContain(english);
    }
    // Reviewed column: byline and the pack's own review label, exactly as the list and home say.
    expect(props.attorneyHeading).toBe(pack.home.columnsReviewLabel);
    expect(html).toContain(`>${folioArticleCopy[locale].byline}</a>`);
    expect(props.articleJsonLd.author).toMatchObject({ '@type': 'Person', name: folioArticleCopy[locale].byline });
    // Consultation card: the pack's contact label and CTA, plus the four consultation languages from the team record.
    expect(props.t.consultationTitle).toBe(pack.nav.contact);
    expect(props.t.consultationButton).toBe(pack.contactCta);
    expect(props.t.consultationText).toContain(guidanceTeamCopy[locale].consultationLanguagesLabel);
    expect(html).toContain('data-folio-article-authority=""');
    expect(props.folio?.authority?.lawyersLabel).toBe(pack.nav.lawyers);
    expect(html).toContain(guidanceTeamCopy[locale].roles['tseng-junwei']);
    expect(JSON.stringify(props.breadcrumbJsonLd)).toContain(JSON.stringify(pack.nav.home));
  });

  it.each(['id', 'th'] as const)('%s AI-written columns keep no byline and no review claim', async (locale) => {
    const ai = getAllColumnPosts(locale).find((post) => isAiAuthoredColumn(post));
    expect(ai).toBeDefined();
    const props = await articleProps(locale, ai!.slug);
    const html = renderToStaticMarkup(<ColumnDetailView {...props} />);
    expect(props.attorneyHeading).toBe(folioArticleCopy[locale].consultingAttorney);
    expect(props.attorneyHeading).not.toBe(guidanceContent[locale].home.columnsReviewLabel);
    expect(props.articleJsonLd).not.toHaveProperty('author');
    expect(html).not.toContain(`>${folioArticleCopy[locale].byline}</a>`);
    expect(html).toContain('data-column-disclaimer="true"');
  });

  it('carries the localized table hint only on Folio pages', async () => {
    const posts = getAllColumnPosts('de');
    const withTable = posts.find((post) => /^\s*\|.*\|\s*$/m.test(post.content));
    expect(withTable).toBeDefined();
    const props = await articleProps('de', withTable!.slug);
    expect(renderToStaticMarkup(<ColumnDetailView {...props} />)).toContain(folioArticleCopy.de.tableScrollHint);
  });
});

describe('Folio chrome and list labels; other locales unchanged', () => {
  const post: ColumnListItem = {
    slug: 'fixture', title: 'Titre', date: '2026-01-02', dateDisplay: '2 janvier 2026', readTime: '3 min',
    category: 'legal', categoryLabel: 'Informations juridiques sur Taïwan', featuredImage: '/images/x.jpg', summary: 'Résumé',
  };

  it('the columns page hands ColumnsGrid the Folio labels, and only on Folio locales', async () => {
    const { default: ColumnsPage } = await import('@/app/[locale]/columns/page');
    const find = (node: unknown): ReactElement<{ folioLabels?: unknown }> | null => {
      if (!node || typeof node !== 'object') return null;
      if (Array.isArray(node)) return node.map(find).find(Boolean) ?? null;
      const element = node as ReactElement<{ children?: unknown }>;
      if (element.type === ColumnsGrid) return element as ReactElement<{ folioLabels?: unknown }>;
      return find(element.props?.children);
    };
    const page = (locale: string) => ColumnsPage({ params: Promise.resolve({ locale }), searchParams: Promise.resolve({}) } as never);
    expect(find(await page('fr'))?.props.folioLabels).toBe(folioColumnsCopy.fr);
    expect(find(await page('th'))?.props.folioLabels).toBe(folioColumnsCopy.th);
    const ms = find(await page('ms'));
    expect(ms).not.toBeNull();
    expect(ms?.props).not.toHaveProperty('folioLabels');
  });

  it('ColumnsGrid', () => {
    const fr = renderToStaticMarkup(<ColumnsGrid locale="fr" posts={[post]} folioLabels={folioColumnsCopy.fr} />);
    expect(fr).toContain(folioColumnsCopy.fr.label);
    expect(fr).toContain(folioColumnsCopy.fr.resultCount.replace('{n}', '1'));
    expect(fr).toContain(folioColumnsCopy.fr.reviewedBy);
    expect(fr).not.toMatch(/Search columns|Reviewed by Wei Tseng|\d+ results?\b/);
    const ms = renderToStaticMarkup(<ColumnsGrid locale="ms" posts={[post]} />);
    expect(ms).toContain('Search columns');
    expect(ms).toContain('Reviewed by Wei Tseng');
    const ko = renderToStaticMarkup(<ColumnsGrid locale="ko" posts={[post]} />);
    expect(ko).toContain('칼럼 검색');
  });

  it('PageHeader draws no breadcrumb trail on Folio pages (DIRECTION §7, review round 2), and ScrollTopButton', () => {
    const fr = renderToStaticMarkup(<PageHeader locale="fr" label="Articles" title="Articles" />);
    expect(fr).not.toContain('breadcrumb');
    expect(fr).toContain('Articles</h1>');
    expect(renderToStaticMarkup(<PageHeader locale="ms" label="Artikel" title="Artikel" />)).toContain('>Home</a>');
    expect(renderToStaticMarkup(<Breadcrumbs locale="ko" current="칼럼" />)).toContain('>홈</a>');
    expect(renderToStaticMarkup(<ScrollTopButton locale="th" folioLabel={folioChromeCopy.th.backToTop} />)).toContain(
      folioChromeCopy.th.backToTop,
    );
    expect(renderToStaticMarkup(<ScrollTopButton locale="en" />)).toContain('Back to top');
  });
});
