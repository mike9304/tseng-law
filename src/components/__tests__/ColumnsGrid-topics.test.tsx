import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const nav = vi.hoisted(() => ({ params: new URLSearchParams() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/ko/columns',
  useSearchParams: () => nav.params,
}));
vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <span data-img={props.alt} />,
}));

import ColumnsGrid, { type ColumnListItem } from '@/components/ColumnsGrid';

function post(slug: string, topic: ColumnListItem['topic'], category: ColumnListItem['category'] = 'legal'): ColumnListItem {
  return {
    slug,
    title: `title-${slug}`,
    date: '2026-09-28',
    dateDisplay: '',
    readTime: '',
    category,
    categoryLabel: category,
    topic,
    featuredImage: '/images/blog/placeholder.jpg',
    summary: '',
  };
}

const posts: ColumnListItem[] = [
  post('f1', 'family'), post('f2', 'family'), post('f3', 'family'), post('f4', 'family'), post('f5', 'family'),
  post('c1', 'company', 'formation'),
  post('t1', 'tax'),
  post('l1', 'litigation', 'case'),
];

describe('ColumnsGrid topic grouping', () => {
  it('renders one section per topic in canonical order, previewing at most 3 cards each', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(<ColumnsGrid locale="ko" posts={posts} />);
    const sections = [...html.matchAll(/data-columns-topic-section="([a-z]+)"/g)].map((m) => m[1]);
    expect(sections).toEqual(['company', 'tax', 'family', 'litigation']);
    expect(html).toContain('법인설립·투자');
    expect(html).toContain('국제결혼·이혼');
    // family has 5 columns → 3 previewed + "view all"
    expect(html.match(/data-column-topic="family"/g)).toHaveLength(3);
    expect(html).toContain('data-columns-topic-more="family"');
    expect(html).not.toContain('data-columns-topic-more="company"');
    expect(html).toContain('data-columns-topic-chip="tax"');
  });

  it('shows a flat, filtered list when ?topic= is set', () => {
    nav.params = new URLSearchParams('topic=family');
    const html = renderToStaticMarkup(<ColumnsGrid locale="en" posts={posts} />);
    expect(html).not.toContain('data-columns-grouped');
    expect(html.match(/data-column-topic="family"/g)).toHaveLength(5);
    expect(html).not.toContain('data-column-topic="company"');
    expect(html).toContain('International marriage &amp; divorce');
  });

  it('translated guidance locales group by their reviewed category labels', () => {
    nav.params = new URLSearchParams();
    const html = renderToStaticMarkup(<ColumnsGrid locale="vi" posts={posts} />);
    const sections = [...html.matchAll(/data-columns-topic-section="([a-z]+)"/g)].map((m) => m[1]);
    expect(sections).toEqual(['formation', 'legal', 'case']);
  });
});
