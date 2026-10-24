import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/de/columns',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
  redirect: () => {
    throw new Error('REDIRECT');
  },
  permanentRedirect: () => {
    throw new Error('REDIRECT');
  },
}));
// Every article block visible, as on the published site.
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: async () => ({}),
  isBuilderDynamicTemplateBlockVisible: () => true,
}));

import type { ColumnDetailViewProps } from '@/app/[locale]/columns/[slug]/ColumnDetailView';
import { MARKET_BOARD_LOCALES, filterMarketBoardColumns } from '@/data/market-column-curation';
import { columnAudienceRank } from '@/lib/column-audience';
import { getAllColumnPosts } from '@/lib/columns';

const SLOW = 120_000;

function hiddenSlugs(locale: string): string[] {
  const listed = new Set(filterMarketBoardColumns(locale, getAllColumnPosts(locale as never)).map((post) => post.slug));
  return getAllColumnPosts(locale as never).map((post) => post.slug).filter((slug) => !listed.has(slug));
}

async function boardHtml(locale: string): Promise<string> {
  const { default: ColumnsPage } = await import('@/app/[locale]/columns/page');
  const element = await ColumnsPage({ params: Promise.resolve({ locale }), searchParams: Promise.resolve({}) } as never);
  return renderToStaticMarkup(element as ReactElement);
}

async function articleProps(locale: string, slug: string): Promise<ColumnDetailViewProps> {
  const { default: Page } = await import('@/app/[locale]/columns/[slug]/page');
  const element = await Page({ params: Promise.resolve({ locale, slug }) });
  return (element as ReactElement<ColumnDetailViewProps>).props;
}

const links = (html: string, locale: string, slug: string) => html.includes(`/${locale}/columns/${slug}"`);

describe('market boards render only their columns (2026-10-24)', () => {
  it.each(MARKET_BOARD_LOCALES)('%s board: no hidden or Korean-title links, opens with every own column', async (locale) => {
    const html = await boardHtml(locale);
    const hidden = hiddenSlugs(locale);
    expect(hidden.length).toBeGreaterThan(0);
    expect(hidden.filter((slug) => links(html, locale, slug))).toEqual([]);
    expect(html).not.toMatch(/href="\/ko\/columns\/[^"]+"/);
    const opening = getAllColumnPosts(locale).filter((post) => columnAudienceRank(locale, post.audience) < 2).length;
    const section = html.match(/data-columns-recommended="[^"]+"[\s\S]*?columns-topic-count">([^<]+)</);
    expect(section?.[1]).toContain(String(opening));
  }, SLOW);

  it('vi stays outside the market boards: every shared column, no Korean-title list', async () => {
    expect(MARKET_BOARD_LOCALES).not.toContain('vi' as never);
    const html = await boardHtml('vi');
    expect(links(html, 'vi', 'taiwan-gym-injury-lawsuit')).toBe(true);
    expect(html).not.toMatch(/href="\/ko\/columns\/[^"]+"/);
  }, SLOW);

  it.each(MARKET_BOARD_LOCALES)('%s articles: a hidden column still opens; links stay on the board', async (locale) => {
    const hidden = hiddenSlugs(locale);
    const hiddenSet = new Set(hidden);
    const off = await articleProps(locale, hidden[0]);
    expect(off.post.slug).toBe(hidden[0]);
    expect(off.prevPost).toBeNull();
    expect(off.nextPost).toBeNull();
    expect(off.recommendedItems.length).toBeGreaterThan(0);
    expect(off.recommendedItems.filter((item) => hiddenSet.has(item.slug))).toEqual([]);

    const listed = filterMarketBoardColumns(locale, getAllColumnPosts(locale));
    const on = await articleProps(locale, listed[Math.floor(listed.length / 2)].slug);
    for (const neighbour of [on.prevPost, on.nextPost]) {
      if (neighbour) expect(hiddenSet.has(neighbour.slug), neighbour.slug).toBe(false);
    }
    expect(on.recommendedItems.filter((item) => hiddenSet.has(item.slug))).toEqual([]);
  }, SLOW);

  it('a traffic column left off the board still gets recommendations', async () => {
    expect(hiddenSlugs('de')).toContain('taiwan-traffic-accident-procedure');
    const props = await articleProps('de', 'taiwan-traffic-accident-procedure');
    expect(props.recommendedItems.length).toBeGreaterThan(0);
  }, SLOW);

  it.each(MARKET_BOARD_LOCALES)('%s home: no hidden column links', async (locale) => {
    const { default: Page } = await import('@/app/[locale]/[[...slug]]/page');
    const element = await Page({ params: Promise.resolve({ locale, slug: undefined }), searchParams: Promise.resolve({}) } as never);
    const html = renderToStaticMarkup(element as ReactElement);
    expect(hiddenSlugs(locale).filter((slug) => links(html, locale, slug))).toEqual([]);
  }, SLOW);
});
