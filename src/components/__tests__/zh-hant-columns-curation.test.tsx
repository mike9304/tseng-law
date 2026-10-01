import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ params: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/zh-hant/columns',
  useSearchParams: () => nav.params,
}));
vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <span data-img={props.alt} />,
}));

import ColumnsGrid, { type ColumnListItem } from '@/components/ColumnsGrid';
import ZhHantBoardSwitch from '@/components/zh-hant-columns/ZhHantBoardSwitch';
import { ZH_HANT_COLUMN_TOPIC_ORDER, ZH_HANT_FEATURED_COLUMN_SLUGS } from '@/data/zh-hant-column-curation';

function post(slug: string, topic: ColumnListItem['topic'], audience?: string[]): ColumnListItem {
  return {
    slug,
    title: `title-${slug}`,
    date: '2026-09-28',
    dateDisplay: '',
    readTime: '',
    category: topic === 'company' ? 'formation' : 'legal',
    categoryLabel: '',
    topic,
    featuredImage: '/images/blog/placeholder.jpg',
    summary: '',
    ...(audience ? { audience } : {}),
  };
}

const posts: ColumnListItem[] = [
  post('newest-company', 'company', ['zh-hant']),
  post('newest-tax', 'tax', ['zh-hant']),
  post('newest-visa', 'visa', ['zh-hant']),
  post('taiwan-accident-police-records', 'litigation', ['zh-hant']),
  post('taiwan-criminal-accessory-civil-suit-fraud', 'litigation', ['zh-hant']),
  post('taiwan-labor-severance-law', 'labor'),
  post('litigation-2', 'litigation'),
  post('family-1', 'family'),
  post('inherit-1', 'inheritance'),
];

describe('zh-hant columns curation (domestic readers first)', () => {
  it('opens with the editorial picks in order, even when newer foreign-audience posts exist', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(
      <ColumnsGrid locale="zh-hant" posts={posts} featuredSlugs={ZH_HANT_FEATURED_COLUMN_SLUGS} topicOrder={ZH_HANT_COLUMN_TOPIC_ORDER} />,
    );
    const opening = html.split('data-columns-recommended="zh-hant"')[1]?.split('</section>')[0] ?? '';
    const slugs = [...opening.matchAll(/href="\/zh-hant\/columns\/([^"]+)"/g)].map((m) => m[1]);
    expect(slugs).toEqual([...ZH_HANT_FEATURED_COLUMN_SLUGS]);
  });

  it('orders topic sections disputes and family first, company setup last', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(
      <ColumnsGrid locale="zh-hant" posts={posts} featuredSlugs={ZH_HANT_FEATURED_COLUMN_SLUGS} topicOrder={ZH_HANT_COLUMN_TOPIC_ORDER} />,
    );
    const order = [...html.matchAll(/data-columns-topic-section="([^"]+)"/g)].map((m) => m[1]);
    expect(order[0]).toBe('litigation');
    expect(order.indexOf('family')).toBeLessThan(order.indexOf('company'));
    expect(order[order.length - 1]).toBe('company');
  });

  it('keeps the default behaviour when no curation is passed (other locales)', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(<ColumnsGrid locale="zh-hant" posts={posts} />);
    const order = [...html.matchAll(/data-columns-topic-section="([^"]+)"/g)].map((m) => m[1]);
    expect(order[0]).toBe('company');
  });

  it('renders the board switch with both boards, counts and the newest issue titles', () => {
    const html = renderToStaticMarkup(
      <ZhHantBoardSwitch active="expert" expertCount={45} issueCount={2} latestIssues={[{ slug: 'a', title: 'Issue A' }, { slug: 'b', title: 'Issue B' }]} />,
    );
    expect(html).toContain('data-issue-board-tab="expert"');
    expect(html).toContain('data-issue-board-tab="issues"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('>45<');
    expect(html).toContain('href="/zh-hant/columns/issues/a"');
    expect(html).toContain('專業專欄');
    expect(html).toContain('時事法律解析');
  });

  it('still shows curated picks when no post is recommended for the locale (Astra D1)', () => {
    nav.params = new URLSearchParams();
    const plain = posts.map(({ audience: _audience, ...rest }) => rest);
    const html = renderToStaticMarkup(
      <ColumnsGrid locale="zh-hant" posts={plain} featuredSlugs={ZH_HANT_FEATURED_COLUMN_SLUGS} topicOrder={ZH_HANT_COLUMN_TOPIC_ORDER} />,
    );
    const opening = html.split('data-columns-recommended="zh-hant"')[1]?.split('</section>')[0] ?? '';
    const slugs = [...opening.matchAll(/href="\/zh-hant\/columns\/([^"]+)"/g)].map((m) => m[1]);
    expect(slugs).toEqual([...ZH_HANT_FEATURED_COLUMN_SLUGS]);
    for (const slug of ZH_HANT_FEATURED_COLUMN_SLUGS) expect(html).toContain(`/zh-hant/columns/${slug}`);
  });
});
