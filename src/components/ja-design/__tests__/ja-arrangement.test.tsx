import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ params: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/ja/columns',
  useSearchParams: () => nav.params,
}));
vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <span data-img={props.alt} />,
}));

import ColumnsGrid, { type ColumnListItem } from '@/components/ColumnsGrid';
import ServicesBento from '@/components/ServicesBento';
import { COLUMN_TOPICS } from '@/lib/column-topics';
import { getColumnPost } from '@/lib/columns';
import { getServiceSlugs } from '@/data/service-details';
import { siteContent } from '@/data/site-content';
import {
  JA_COLUMN_TOPIC_ORDER,
  JA_PINNED_COLUMN_SLUGS,
  JA_SERVICE_ORDER,
  pinJaColumns,
} from '@/components/ja-design/ja-arrangement';

function post(slug: string, topic: ColumnListItem['topic'], audience?: string[]): ColumnListItem {
  return {
    slug,
    title: `title-${slug}`,
    date: '2026-09-28',
    dateDisplay: '',
    readTime: '',
    category: 'legal',
    categoryLabel: 'legal',
    topic,
    featuredImage: '/images/blog/placeholder.jpg',
    summary: '',
    audience,
  };
}

describe('ja arrangement data', () => {
  it('pins only columns that exist in Japanese', () => {
    for (const slug of JA_PINNED_COLUMN_SLUGS) {
      expect(getColumnPost(slug, 'ja'), slug).toBeDefined();
    }
  });

  it('orders every column topic and every service exactly once', () => {
    expect([...JA_COLUMN_TOPIC_ORDER].sort()).toEqual([...COLUMN_TOPICS].sort());
    expect([...JA_SERVICE_ORDER].sort()).toEqual([...getServiceSlugs()].sort());
  });

  it('puts pinned posts first in pinned order and keeps the rest in incoming order', () => {
    const posts = [post('a', 'tax'), post('b', 'labor'), post('c', 'company'), post('d', 'family')];
    expect(pinJaColumns(posts, ['c', 'missing', 'a']).map((p) => p.slug)).toEqual(['c', 'a', 'b', 'd']);
  });
});

describe('ColumnsGrid ja props', () => {
  const posts = [
    post('r1', 'family', ['ja']), post('r2', 'tax', ['ja']), post('r3', 'visa', ['ja']), post('r4', 'labor', ['ja']),
    post('p1', 'company'), post('p2', 'litigation'),
  ];

  it('opens with the curated slugs in order and orders theme sections by topicOrder', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(
      <ColumnsGrid locale="ja" posts={posts} openingSlugs={['p2', 'r4', 'p1']} topicOrder={JA_COLUMN_TOPIC_ORDER} />,
    );
    const opening = html.split('data-columns-recommended="ja"')[1]?.split('</section>')[0] ?? '';
    expect([...opening.matchAll(/href="\/ja\/columns\/([a-z0-9]+)"/g)].map((m) => m[1])).toEqual(['p2', 'r4', 'p1']);
    const sections = [...html.matchAll(/data-columns-topic-section="([a-z]+)"/g)].map((m) => m[1]);
    // p1/p2/r4 are already in the opening section, so company/litigation/labor have nothing left to preview.
    expect(sections).toEqual(['family', 'visa', 'tax']);
    const chips = [...html.matchAll(/data-columns-topic-chip="([a-z]+)"/g)].map((m) => m[1]);
    expect(chips).toEqual(['all', 'company', 'labor', 'litigation', 'family', 'visa', 'tax']);
  });

  it('keeps the default opening (first three recommended) and canonical order without the props', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(<ColumnsGrid locale="ja" posts={posts} />);
    const opening = html.split('data-columns-recommended="ja"')[1]?.split('</section>')[0] ?? '';
    expect(opening.match(/class="columns-card"/g)).toHaveLength(3);
    const chips = [...html.matchAll(/data-columns-topic-chip="([a-z]+)"/g)].map((m) => m[1]);
    expect(chips).toEqual(['all', 'company', 'tax', 'visa', 'family', 'litigation', 'labor']);
  });
});

describe('ServicesBento order prop', () => {
  const titles = (html: string) => [...html.matchAll(/class="services-detail-title">([^<]+)</g)].map((m) => m[1].replace(/&amp;/g, '&'));

  it('renders ja practice areas in JA_SERVICE_ORDER with each area keeping its own anchor and link', () => {
    const html = renderToStaticMarkup(<ServicesBento locale="ja" order={JA_SERVICE_ORDER} />);
    const slugs = getServiceSlugs();
    const expected = JA_SERVICE_ORDER.map((slug) => siteContent.ja.services.items[slugs.indexOf(slug)].title);
    expect(titles(html)).toEqual(expected);
    expect([...html.matchAll(/href="\/ja\/services\/([a-z]+)"/g)].map((m) => m[1])).toEqual([...JA_SERVICE_ORDER]);
    expect([...html.matchAll(/<article class="services-detail-card services-card" id="([a-z-]+)"/g)].map((m) => m[1]))
      .toEqual([...JA_SERVICE_ORDER]);
  });

  it('is unchanged without the prop', () => {
    const html = renderToStaticMarkup(<ServicesBento locale="en" />);
    expect(titles(html)).toEqual(siteContent.en.services.items.map((item) => item.title));
  });
});
