import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({ searchParams: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  usePathname: () => '/vi/columns',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => navigationState.searchParams,
  notFound: () => { throw new Error('NEXT_NOT_FOUND'); },
  redirect: () => { throw new Error('NEXT_REDIRECT'); },
}));
vi.mock('@/lib/builder/site/public-page', () => ({
  buildPublishedSitePageMetadata: vi.fn().mockResolvedValue(null),
  resolvePublishedSitePage: vi.fn().mockResolvedValue(null),
  PublishedSitePageView: () => null,
}));
vi.mock('@/app/[locale]/(legacy)', () => ({
  getLegacyPageMetadata: vi.fn().mockReturnValue(null),
  renderLegacyPage: vi.fn().mockResolvedValue(null),
}));
vi.mock('@/lib/builder/apps/lifecycle-emitters', () => ({ emitPublicPageRenderHook: vi.fn() }));
vi.mock('@/lib/builder/members/current-member', () => ({ getCurrentSiteMember: vi.fn() }));
vi.mock('@/lib/builder/members/members-engine', () => ({ checkAccess: vi.fn() }));
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: vi.fn().mockResolvedValue(null),
  isBuilderDynamicTemplateBlockVisible: () => true,
}));

import CatchAllPage, { generateMetadata as coreMetadata } from '../[[...slug]]/page';
import ColumnsPage from '../columns/page';
import ColumnPage, { generateMetadata as columnMetadata } from '../columns/[slug]/page';
import type { ColumnDetailViewProps } from '../columns/[slug]/ColumnDetailView';
import IssueBoardPage from '../columns/issues/page';
import IssueArticlePage from '../columns/issues/[slug]/page';
import GuidancePageBody from '@/components/GuidancePageBody';
import ViHomeBody from '@/components/vi-design/ViHomeBody';
import ViPageBody from '@/components/vi-design/ViPageBody';
import { getAllColumnPosts, getAllIssuePosts } from '@/lib/columns';
import { extractColumnToc } from '@/lib/column-toc';
import { isAppleDesignLocale, isApplePresentationLocale } from '@/lib/apple-design-locales';
import { guidanceContent } from '@/data/international-guidance-content';
import { issueBoardCopy } from '@/data/issue-board';

describe('Vietnamese public presentation dispatch', () => {
  beforeEach(() => { navigationState.searchParams = new URLSearchParams(); });

  it('selects the Vietnamese home and every core page without changing the builder locale union', async () => {
    const home = await CatchAllPage({ params: Promise.resolve({ locale: 'vi' }) });
    expect(home.type).toBe(ViHomeBody);
    expect((home as ReactElement<{ posts: { slug: string }[] }>).props.posts.map(({ slug }) => slug))
      .toEqual(getAllColumnPosts('vi').map(({ slug }) => slug));

    for (const pageKey of ['services', 'lawyers', 'faq', 'contact', 'about', 'pricing', 'privacy', 'disclaimer']) {
      const page = await CatchAllPage({ params: Promise.resolve({ locale: 'vi', slug: [pageKey] }) });
      expect(page.type).toBe(ViPageBody);
      expect(page.props).toMatchObject({ pageKey });
    }
    const rewritten = await CatchAllPage({ params: Promise.resolve({ locale: 'vi', slug: ['__public-guidance', 'services'] }) });
    expect(rewritten.type).toBe(ViPageBody);
    const indonesian = await CatchAllPage({ params: Promise.resolve({ locale: 'id', slug: ['services'] }) });
    expect(indonesian.type).toBe(GuidancePageBody);
    expect(isApplePresentationLocale('vi')).toBe(true);
    expect(isAppleDesignLocale('vi')).toBe(false);
    expect(isApplePresentationLocale('en')).toBe(false);
    expect(isApplePresentationLocale('id')).toBe(false);
  });

  it('retains Vietnamese core SEO and hreflang during the presentation change', async () => {
    const metadata = await coreMetadata({ params: Promise.resolve({ locale: 'vi', slug: ['contact'] }) });
    expect(metadata.alternates?.canonical).toBe('https://tseng-law.com/vi/contact');
    expect(metadata.alternates?.languages).toMatchObject({ vi: 'https://tseng-law.com/vi/contact', en: 'https://tseng-law.com/en/contact' });
    expect(metadata.openGraph).toMatchObject({ locale: 'vi_VN' });
  });

  it('renders native columns and issue links inside the shared designed archive', async () => {
    const html = renderToStaticMarkup(await ColumnsPage({ params: Promise.resolve({ locale: 'vi' }) }));
    const posts = getAllColumnPosts('vi');
    const nativeHrefs = new Set(posts.map((post) => `/vi/columns/${post.slug}`));
    const articleLinks = Array.from(html.matchAll(/href="(\/vi\/columns\/[^"/]+)"/g), ([, href]) => href)
      .filter((href) => href !== '/vi/columns/issues');
    expect(html).toContain('id="vi-columns"');
    expect(html).toContain('data-vi-design="columns"');
    expect(html).toContain('aria-label="Vị trí hiện tại"');
    expect(html).toMatch(/<a[^>]*href="\/vi"[^>]*>Trang chủ<\/a>/);
    expect(html).not.toContain('aria-label="Current location"');
    expect(articleLinks.length).toBeGreaterThan(0);
    for (const href of articleLinks) expect(nativeHrefs.has(href)).toBe(true);
    expect(html).toContain(`data-columns-visible-count="${posts.length}"`);
    expect(html).not.toContain('Luật sư Wei Tseng');
    expect(html).not.toContain('columns-card-byline');
    expect(html).not.toContain('Reviewed by Wei Tseng');
    expect(html).toContain('data-issue-board-tab="issues"');
    expect(html).toContain(issueBoardCopy.vi.label);
    expect(html).toContain('href="/vi/columns/issues"');
    expect(html).toContain('href="/ko/columns"');
    expect(html).not.toMatch(/href="\/ko\/columns\//);
    expect(html).not.toContain('id="en-columns"');
  });

  it('keeps columns outside the archive preview reachable through native search', async () => {
    const post = getAllColumnPosts('vi')[0];
    navigationState.searchParams.set('q', post.title);
    const html = renderToStaticMarkup(await ColumnsPage({ params: Promise.resolve({ locale: 'vi' }) }));
    expect(html).toContain(`href="/vi/columns/${post.slug}"`);
    expect(html).toContain('data-columns-visible-count="1"');
  });

  it('renders the real Vietnamese issue archive and preserves its article destinations', async () => {
    const html = renderToStaticMarkup(await IssueBoardPage({ params: Promise.resolve({ locale: 'vi' }) }));
    expect(html).toContain('data-vi-design="columns"');
    expect(html).toContain('data-issue-board-tab="expert"');
    expect(html).toContain('aria-label="Vị trí hiện tại"');
    expect(html).toMatch(/<a[^>]*href="\/vi"[^>]*>Trang chủ<\/a>/);
    expect(html).not.toContain('aria-label="Current location"');
    // The CollectionPage lists the 20 newest issues and topic sections preview three each, so from the 21st
    // vi issue (2026-10-22) the oldest is reached through its topic or search rather than this first render.
    const issues = getAllIssuePosts('vi');
    expect(html).toContain(`data-columns-visible-count="${issues.length}"`);
    for (const post of issues.slice(0, 20)) expect(html).toContain(`/vi/columns/issues/${post.slug}`);
    expect(html).not.toContain('href="/en/columns');
  });

  it('uses the Vietnamese article shell despite the legacy locale=en view prop, preserving body, sources and disclosures', async () => {
    const post = getAllColumnPosts('vi').find((candidate) => candidate.featuredImageCaption)!;
    expect(post).toBeDefined();
    const page = await ColumnPage({ params: Promise.resolve({ locale: 'vi', slug: post.slug }) });
    const props = (page as ReactElement<ColumnDetailViewProps>).props;
    expect(props.locale).toBe('en');
    expect(props.urlLocale).toBe('vi');
    expect(props.post.content).toBe(post.content);
    expect(props.articleJsonLd).toMatchObject({ inLanguage: 'vi' });
    expect(props.breadcrumbJsonLd).toMatchObject({ itemListElement: [
      { name: guidanceContent.vi.nav.home },
      { name: guidanceContent.vi.nav.columns },
      { name: post.title },
    ] });
    const html = renderToStaticMarkup(page);
    expect(html).toContain('data-vi-design="column"');
    expect(html).toContain('data-vi-article-authority');
    expect(html).toContain('data-column-image-caption');
    expect(html).toContain(post.featuredImageCaption);
    expect(html).toContain('href="/vi/contact"');
    expect(html).toContain('href="/vi/lawyers"');
    expect(html).not.toContain('Lead Attorney');
    expect(html).not.toContain('Core Practice Areas');
    expect(html).not.toContain('href="/en/lawyers');
    const source = post.content.match(/\]\((https?:\/\/[^)\s]+)\)/)?.[1];
    if (source) expect(html).toContain(source.replace(/&/g, '&amp;'));
    const metadata = await columnMetadata({ params: Promise.resolve({ locale: 'vi', slug: post.slug }) });
    expect(metadata.alternates?.canonical).toBe(`https://tseng-law.com/vi/columns/${post.slug}`);
  });

  it('keeps issue articles Vietnamese, including heading anchors and the team reference', async () => {
    const post = getAllIssuePosts('vi').find((candidate) => extractColumnToc(candidate.content).length >= 3)!;
    expect(post).toBeDefined();
    const html = renderToStaticMarkup(await IssueArticlePage({ params: Promise.resolve({ locale: 'vi', slug: post.slug }) }));
    expect(html).toContain('data-vi-design="issue"');
    expect(html).toContain('data-vi-article-authority');
    expect(html).toContain(issueBoardCopy.vi.tocLabel);
    const firstHeading = extractColumnToc(post.content)[0];
    expect(html).toContain(`href="#${firstHeading.id}"`);
    expect(html).toContain(`id="${firstHeading.id}"`);
    expect(html).toContain('href="/vi/contact"');
    expect(html).not.toContain('Lead Attorney');
    expect(html).not.toContain('href="/en/lawyers');
  });
});
