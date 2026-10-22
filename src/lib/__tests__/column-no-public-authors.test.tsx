import { readFileSync } from 'node:fs';
import { Children, type ReactElement } from 'react';
import type { Metadata } from 'next';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { BasicMeta } from 'next/dist/lib/metadata/generate/basic';
import { createDefaultMetadata } from 'next/dist/lib/metadata/default-metadata';
import { COLUMN_CONTENT_DIR_BY_LOCALE } from '@/lib/column-locales';
import { getAllColumnPosts, getAllIssuePosts, ISSUE_BOARD_LOCALES } from '@/lib/columns';
import { isAiAuthoredColumn } from '@/lib/ai-authored-columns';
import { toColumnListItems } from '@/lib/column-list-items';
import { siteLocales } from '@/lib/locales';
import { isGuidanceLocale4 } from '@/lib/public-guidance';
import { buildGuidanceLlmsTxt, buildLocaleLlmsTxt, buildRootLlmsTxt } from '@/lib/llms-txt';
import ColumnPage, { generateMetadata as columnMetadata } from '@/app/[locale]/columns/[slug]/page';
import ColumnDetailView, { type ColumnDetailViewProps } from '@/app/[locale]/columns/[slug]/ColumnDetailView';
import ColumnsPage, { generateMetadata as columnsMetadata } from '@/app/[locale]/columns/page';
import IssuePage, { generateMetadata as issueMetadata } from '@/app/[locale]/columns/issues/[slug]/page';
import IssuesPage, { generateMetadata as issuesMetadata } from '@/app/[locale]/columns/issues/page';
import TrafficPage, { generateMetadata as trafficMetadata } from '@/app/[locale]/traffic-accidents/page';
import { isCriminalBoardLocale } from '@/lib/criminal-litigation-board';
import CriminalPage, { generateMetadata as criminalMetadata } from '@/app/[locale]/criminal-litigation/page';
import { generateMetadata as localeMetadata } from '@/app/[locale]/layout';
import { metadata as rootMetadata } from '@/app/layout';
import ColumnsGrid from '@/components/ColumnsGrid';
import GuidanceHomeBody from '@/components/GuidanceHomeBody';
import JaGlyphCard from '@/components/ja-design/kou/JaGlyphCard';
import { buildArticleJsonLd } from '@/lib/seo';
import { generateArticleSchema } from '@/lib/builder/seo/schema-org';
import { buildArticleJsonLd as buildLegacyArticleJsonLd } from '@/lib/builder/seo/legal-structured-data';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';

vi.mock('@/app/fonts', () => ({
  getLocaleFontClassName: () => '', getLocaleFontStylesheets: () => [],
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/columns',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams('author=PRIVATE_AUTHOR_SENTINEL'),
  notFound: () => { throw new Error('Unexpected missing fixture'); },
}));
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: async () => ({}),
  isBuilderDynamicTemplateBlockVisible: () => true,
}));
// Exercise the real file corpus without reading or writing CMS/runtime data.
vi.mock('@/lib/consultation/columns-blob-reader', async () => {
  const { getAllColumnPosts } = await import('@/lib/columns');
  return { getAllColumnPostsIncludingBlob: async (locale: Parameters<typeof getAllColumnPosts>[0]) => getAllColumnPosts(locale) };
});

const locales = Object.keys(COLUMN_CONTENT_DIR_BY_LOCALE) as (keyof typeof COLUMN_CONTENT_DIR_BY_LOCALE)[];
const attribution = /data-column-(?:byline|ai-author)|columns-card-byline|insights-byline|rel="author"|name="author"|article:author|PRIVATE_AUTHOR_SENTINEL|法律\s*AI\s*助理|Legal AI Assistant/;
const bodyByline = /^\s*(?:#{1,6}\s*|\*{1,2})?(?:作者|著者|執筆者|작성자|글쓴이|저자|author|written by|authored by|byline)\s*[:：]/im;

function assertNoAuthorKeys(value: unknown) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    expect(key).not.toMatch(/^(?:author|authors|authorName|authorEntity|reviewedBy|article:author)$/);
    assertNoAuthorKeys(child);
  }
}

function assertPublicHtml(html: string) {
  expect(html).not.toMatch(attribution);
  for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    assertNoAuthorKeys(JSON.parse(json));
  }
  const meta = html.match(/class="blog-meta">([\s\S]*?)<\/div>/)?.[1];
  if (meta) expect(meta).not.toMatch(/<a\b|Wei Tseng|曾雋崴|증준외|legal-ai-assistant/);
}

async function assertMetadata(locale: string, page: Metadata) {
  // Test every inheritance layer, then render the inherited basic fields using Next's own meta generator.
  const layout = await localeMetadata({ params: Promise.resolve({ locale }) });
  for (const metadata of [rootMetadata, layout, page]) {
    expect(metadata).not.toHaveProperty('authors');
    expect(metadata).not.toHaveProperty('creator');
    expect(metadata.openGraph ?? {}).not.toHaveProperty('authors');
    expect(metadata.other ?? {}).not.toHaveProperty('author');
    expect(metadata.other ?? {}).not.toHaveProperty('article:author');
  }
  const inherited = { ...rootMetadata, ...layout, ...page };
  const resolved = {
    ...createDefaultMetadata(),
    authors: inherited.authors ? [inherited.authors].flat() : null,
    creator: inherited.creator ?? null,
    publisher: inherited.publisher ?? null,
  };
  const html = renderToStaticMarkup(<>{Children.toArray(BasicMeta({ metadata: resolved }))}</>);
  expect(html).not.toMatch(/name="(?:author|creator)"|rel="author"/);
  expect(html).toContain('name="publisher"');
}

describe('all public columns omit author attribution (2026-10-20)', () => {
  it.each(locales)('%s original expert column, archive, metadata and content corpus', async (locale) => {
    const posts = getAllColumnPosts(locale);
    const post = posts.find((item) => !isAiAuthoredColumn(item));
    expect(post, locale).toBeDefined();
    const params = Promise.resolve({ locale, slug: post!.slug });
    const element = await ColumnPage({ params }) as ReactElement<ColumnDetailViewProps>;
    const html = renderToStaticMarkup(<ColumnDetailView {...element.props} />);
    assertPublicHtml(html);
    expect(html).toContain('data-column-disclaimer="true"');
    expect(html).toContain('<h1');
    assertNoAuthorKeys(element.props.articleJsonLd);
    expect(element.props.articleJsonLd.publisher).toMatchObject({ '@type': 'Organization' });
    expect(element.props).not.toHaveProperty('authorName');
    expect(element.props).not.toHaveProperty('authorHref');
    await assertMetadata(locale, await columnMetadata({ params }));
    const archiveParams = Promise.resolve({ locale });
    assertPublicHtml(renderToStaticMarkup(await ColumnsPage({ params: archiveParams, searchParams: Promise.resolve({ author: 'PRIVATE_AUTHOR_SENTINEL' }) })));
    await assertMetadata(locale, await columnsMetadata({ params: archiveParams }));
    for (const item of posts) {
      expect(item.content, `${locale}/${item.slug}`).not.toMatch(bodyByline);
      expect(item.content, `${locale}/${item.slug}: AI authorship`).not.toMatch(/法律\s*AI\s*助理|Legal AI Assistant|법률 AI 어시스턴트|法律AIアシスタント/);
      expect(item.featuredImageAlt ?? '').not.toMatch(attribution);
      // The original manuscripts also had signatures/self-introductions in the
      // body. Preserve actual contacts and the named counsel in a reported case.
      for (const line of item.content.split('\n')) {
        if (/https?:|mailto:|@|\]\(|諮詢|相談|訴訟代理人|문의|연락|寫信|寄信|連絡|consultation|contact|write to|email/i.test(line)) continue;
        expect(line, `${locale}/${item.slug}: standalone attribution`).not.toMatch(/Wei\s*Tseng|雋崴|증준외/);
      }
    }
    const llms = isGuidanceLocale4(locale) ? buildGuidanceLlmsTxt(locale) : buildLocaleLlmsTxt(locale);
    expect(llms).not.toMatch(bodyByline);
    expect(llms).not.toMatch(/legal-ai-assistant|Legal AI Assistant|作者：|작성자:/);
  });

  it.each(ISSUE_BOARD_LOCALES)('%s issue detail, index and criminal board', async (locale) => {
    const posts = getAllIssuePosts(locale);
    if (posts.length === 0) {
      // Board locale without a published piece yet: the board stays hidden (404) and has no metadata.
      await expect(IssuesPage({ params: Promise.resolve({ locale }), searchParams: Promise.resolve({}) })).rejects.toThrow('Unexpected missing fixture'); // notFound() is mocked above
      expect(await issuesMetadata({ params: Promise.resolve({ locale }) })).toEqual({});
      return;
    }
    const params = Promise.resolve({ locale, slug: posts[0].slug });
    const html = renderToStaticMarkup(await IssuePage({ params }));
    assertPublicHtml(html);
    expect(html).toContain('data-column-disclaimer="true"');
    expect(html).toContain('"@type":"Article"');
    await assertMetadata(locale, await issueMetadata({ params }));
    const boardParams = Promise.resolve({ locale });
    assertPublicHtml(renderToStaticMarkup(await IssuesPage({ params: boardParams, searchParams: Promise.resolve({ author: 'PRIVATE_AUTHOR_SENTINEL' }) })));
    await assertMetadata(locale, await issuesMetadata({ params: boardParams }));
    if (isCriminalBoardLocale(locale)) {
      assertPublicHtml(renderToStaticMarkup(await CriminalPage({ params: boardParams })));
      await assertMetadata(locale, await criminalMetadata({ params: boardParams }));
    }
    for (const post of posts) {
      expect(post.content, `${locale}/${post.slug}`).not.toMatch(bodyByline);
      expect(post.featuredImageAlt ?? '').not.toMatch(attribution);
    }
  });

  it('fr issue page uses the French consultation mail, attorney card and caption; boards without pieces are left out of hreflang', async () => {
    const posts = getAllIssuePosts('fr');
    expect(posts.length).toBeGreaterThan(0);
    const html = renderToStaticMarkup(await IssuePage({ params: Promise.resolve({ locale: 'fr', slug: posts[0].slug }) }));
    expect(html).toMatch(/<a href="mailto:[^"]*subject=%5Btseng-law\.com%20Consultation%5D%20Affaire[^"]*" class="button blog-sidebar-btn"/);
    expect(html).toContain('data-issue-attorney="fr"');
    expect(html).toContain('Avocate pour les consultations');
    expect(html).toContain('Scène fictive');
    const languages = Object.keys((await issuesMetadata({ params: Promise.resolve({ locale: 'ko' }) })).alternates?.languages ?? {});
    expect(languages).toContain('fr');
    if (getAllIssuePosts('es').length === 0) expect(languages).not.toContain('es');
  });

  it.each(siteLocales)('%s traffic board and traffic article, including original lawyer content', async (locale) => {
    const params = Promise.resolve({ locale });
    assertPublicHtml(renderToStaticMarkup(await TrafficPage({ params })));
    await assertMetadata(locale, await trafficMetadata({ params }));
    const articleParams = Promise.resolve({ locale, slug: 'taiwan-traffic-accident-procedure' });
    const element = await ColumnPage({ params: articleParams }) as ReactElement<ColumnDetailViewProps>;
    assertPublicHtml(renderToStaticMarkup(<ColumnDetailView {...element.props} />));
    await assertMetadata(locale, await columnMetadata({ params: articleParams }));
  });

  it.each(['ko', 'ja', 'en', 'zh-hant', 'vi', 'fr'] as const)('%s cards ignore custom, AI and absent authors and legacy author filters', (locale) => {
    const source = getAllColumnPosts(locale)[0];
    const posts = [
      { ...source, slug: 'custom', authorName: 'PRIVATE_AUTHOR_SENTINEL', aiAuthored: false },
      { ...source, slug: 'ai', authorName: 'Legal AI Assistant', aiAuthored: true },
      { ...source, slug: 'missing', authorName: undefined, aiAuthored: undefined },
    ];
    const html = renderToStaticMarkup(<ColumnsGrid locale={locale} posts={posts} />);
    assertPublicHtml(html);
    expect(html).toContain('data-columns-search-results="3"');
    for (const post of toColumnListItems(posts)) expect(post).not.toHaveProperty('authorName');
  });

  it.each(siteLocales)('%s home featured and list cards have no byline', (locale) => {
    const posts = getAllColumnPosts(locale).filter((post) => !isAiAuthoredColumn(post)).slice(0, 3);
    assertPublicHtml(renderToStaticMarkup(<InsightsArchiveSection locale={locale} posts={posts} />));
  });

  it.each(['vi', 'fr', 'ar'] as const)('%s guidance home cards have no attribution', (locale) => {
    const posts = getAllColumnPosts(locale).filter((post) => !isAiAuthoredColumn(post)).slice(0, 3);
    const html = renderToStaticMarkup(<GuidanceHomeBody locale={locale} columns={{ sourceLocale: locale, isOriginalLanguage: false, posts }} />);
    assertPublicHtml(html);
    expect(html).not.toContain('insights-byline');
  });

  it.each([true, false, undefined])('Japanese home glyph cards omit authors (aiAuthored=%s)', (aiAuthored) => {
    const post = { slug: 'fixture', title: '本文', dateDisplay: '2026年10月20日', readTime: '3分', aiAuthored };
    const html = renderToStaticMarkup(<JaGlyphCard post={post} />);
    expect(html).toContain('3分');
    expect(html).toContain('2026年10月20日');
    expect(html).not.toMatch(/曾雋崴|監修|Legal AI Assistant/);
  });

  it('all Article helpers ignore stale caller attribution rather than inserting fallback authors', () => {
    const input = {
      locale: 'en' as const, title: 'Article', headline: 'Article', description: 'Summary',
      datePublished: '2026-10-20', path: '/en/columns/example', url: 'https://tseng-law.com/en/columns/example',
      author: 'PRIVATE_AUTHOR_SENTINEL', authorName: 'PRIVATE_AUTHOR_SENTINEL',
      authorEntity: { '@type': 'Person', name: 'PRIVATE_AUTHOR_SENTINEL' },
    };
    for (const data of [buildArticleJsonLd(input), generateArticleSchema(input), buildLegacyArticleJsonLd(input)]) {
      assertNoAuthorKeys(data);
      expect(JSON.stringify(data)).not.toContain('PRIVATE_AUTHOR_SENTINEL');
      expect(data['@type']).toBe('Article');
    }
  });

  it('root discovery catalog and distributed article generation policy omit public authors', () => {
    expect(buildRootLlmsTxt()).not.toMatch(bodyByline);
    const policy = readFileSync('docs/columns/EDITORIAL-VOICE.md', 'utf8');
    expect(policy).toContain('2026-10-20 사용자 지시');
    expect(policy).toContain('JSON-LD author');
    expect(policy).not.toContain('실제 사람 작성자의 byline');
  });
});
