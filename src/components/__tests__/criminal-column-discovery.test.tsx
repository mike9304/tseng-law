import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ColumnsGrid from '@/components/ColumnsGrid';
import { getAllColumnPosts } from '@/lib/columns';
import { toColumnListItems } from '@/lib/column-list-items';
import { CRIMINAL_BOARD_LOCALES } from '@/lib/criminal-litigation-board';
import { expectedCriminalBoardSlugs } from '@/lib/__tests__/criminal-coverage-column-files';

const navigation = vi.hoisted(() => ({ params: new URLSearchParams() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/ko/columns',
  useSearchParams: () => navigation.params,
}));
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <span data-image={alt} /> }));

beforeEach(() => { navigation.params = new URLSearchParams(); });

describe('criminal columns in the existing archive', () => {
  it.each(['ko', 'zh-hant', 'en', 'ja', 'vi'] as const)(
    'shows the exact %s criminal inventory when the topic is selected',
    (locale) => {
      navigation.params = new URLSearchParams({ topic: 'criminal' });
      const html = renderToStaticMarkup(<ColumnsGrid locale={locale} posts={toColumnListItems(getAllColumnPosts(locale))} />);
      const expected = expectedCriminalBoardSlugs(locale);
      expect(html).toContain(`data-columns-visible-count="${expected.length}"`);
      expect(html.match(/class="columns-card"/g)).toHaveLength(expected.length);
      expect(html).toContain('data-columns-topic-chip="criminal"');
      for (const slug of expected) expect(html).toContain(`href="/${locale}/columns/${slug}"`);
      expect(html).not.toContain('data-column-topic="litigation"');
    },
  );

  it.each([
    ['ko', '형사소송'], ['zh-hant', '刑事訴訟'], ['en', 'Criminal litigation'], ['ja', '刑事訴訟'], ['vi', 'Pháp luật hình sự'],
  ] as const)('finds the exact %s criminal inventory by its visible topic name', (locale, query) => {
    for (const topic of ['', 'criminal']) {
      navigation.params = new URLSearchParams({ q: query, ...(topic ? { topic } : {}) });
      const html = renderToStaticMarkup(<ColumnsGrid locale={locale} posts={toColumnListItems(getAllColumnPosts(locale))} />);
      const expected = expectedCriminalBoardSlugs(locale);
      for (const slug of expected) expect(html).toContain(`href="/${locale}/columns/${slug}"`);
      if (topic) expect(html.match(/class="columns-card"/g)).toHaveLength(expected.length);
    }
  });

  it.each(CRIMINAL_BOARD_LOCALES)('places the %s board link before search and article cards', (locale) => {
    const html = renderToStaticMarkup(<ColumnsGrid locale={locale} posts={toColumnListItems(getAllColumnPosts(locale))} />);
    const link = html.indexOf('data-criminal-board-link');
    expect(link).toBeGreaterThan(-1);
    expect(html).toContain(`href="/${locale}/criminal-litigation"`);
    expect(link).toBeLessThan(html.indexOf('data-columns-search='));
    expect(link).toBeLessThan(html.indexOf('class="columns-card"'));
  });

  it('puts the Korean criminal filter directly after All so it is not offscreen on phones', () => {
    const html = renderToStaticMarkup(<ColumnsGrid locale="ko" posts={toColumnListItems(getAllColumnPosts('ko'))} />);
    const topics = [...html.matchAll(/data-columns-topic-chip="([a-z]+)"/g)].map((match) => match[1]);
    expect(topics.slice(0, 2)).toEqual(['all', 'criminal']);
  });

  it('does not inject an expertise-board shortcut into a separate issue archive', () => {
    const html = renderToStaticMarkup(<ColumnsGrid locale="ko" posts={[]} hrefBase="/ko/columns/issues" />);
    expect(html).not.toContain('data-criminal-board-link');
  });
});
