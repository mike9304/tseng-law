import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot, type Root } from 'react-dom/client';
import { act, isValidElement, type ReactElement, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ColumnsGrid, { type ColumnListItem } from '../ColumnsGrid';

const navigation = vi.hoisted(() => ({
  params: null as URLSearchParams | null,
  pathname: '/en/columns',
  replace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: navigation.replace }),
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.params,
}));

const posts: ColumnListItem[] = [
  {
    slug: 'company-guide',
    title: 'A complete company guide',
    date: '2026-01-05',
    dateDisplay: '2026-01-05',
    readTime: '4 min',
    category: 'formation',
    categoryLabel: 'Company Setup',
    authorName: 'Wei Tseng',
    tags: ['registration'],
    featuredImage: '/images/real-column.jpg',
    summary: 'Planning company registration in Taiwan.',
  },
  {
    slug: 'labor-guide',
    title: 'A complete labor guide',
    date: '2025-02-05',
    dateDisplay: '2025-02-05',
    readTime: '3 min',
    category: 'legal',
    categoryLabel: 'Legal Info',
    authorName: 'Another Author',
    featuredImage: '/images/real-column.jpg',
    summary: 'Understanding employment contracts.',
  },
];

type ControlProps = {
  children?: ReactNode;
  onChange?: (event: { target: { value: string } }) => void;
  onSubmit?: (event: { preventDefault: () => void }) => void;
  onNavigate?: (event: { preventDefault: () => void }) => void;
  onClick?: () => void;
  [key: string]: unknown;
};

function findControl(tree: ReactNode, key: string, value: unknown): ReactElement<ControlProps> {
  const visit = (node: ReactNode): ReactElement<ControlProps> | undefined => {
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = visit(child);
        if (found) return found;
      }
    } else if (isValidElement<ControlProps>(node)) {
      if (node.props[key] === value) return node;
      return visit(node.props.children);
    }
    return undefined;
  };
  const found = visit(tree);
  if (!found) throw new Error(`Missing control ${key}=${String(value)}`);
  return found;
}

const roots: Root[] = [];

// The probe renders no host children. React's actual state/effect scheduling is
// retained while router hook commits can deliberately lag behind URL updates.
async function mountColumns(locale: 'ko' | 'en' | 'ja' | 'zh-hant', items = posts) {
  const url = new URL(`http://localhost/${locale}/columns?${navigation.params ?? ''}`);
  const document = {
    activeElement: null, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' }, nodeType: 9,
  };
  const container = {
    addEventListener: vi.fn(), removeEventListener: vi.fn(), appendChild: vi.fn(), removeChild: vi.fn(),
    namespaceURI: 'http://www.w3.org/1999/xhtml', nodeName: 'DIV', nodeType: 1,
    ownerDocument: document, tagName: 'DIV', textContent: '',
  };
  const writeHistory = (_state: unknown, _unused: string, target: string) => {
    url.href = new URL(target, url).href;
  };
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('window', { location: url, history: { replaceState: writeHistory, pushState: writeHistory } });
  vi.stubGlobal('document', document);
  vi.stubGlobal('HTMLIFrameElement', function HTMLIFrameElement() {});
  vi.stubGlobal('HTMLElement', function HTMLElement() {});
  // React reads the frame constructor from window during a commit.
  Object.assign(window, { HTMLIFrameElement: globalThis.HTMLIFrameElement });
  navigation.pathname = `/${locale}/columns`;
  let tree: ReactNode;
  function Probe() {
    tree = ColumnsGrid({ locale, posts: items });
    return null;
  }
  const root = createRoot(container as unknown as Element);
  roots.push(root);
  const render = async () => { await act(async () => root.render(<Probe />)); };
  await render();
  return {
    url,
    control: (key: string, value: unknown = 'true') => findControl(tree, key, value).props,
    commitUrl: async (query: string) => {
      url.search = query;
      navigation.params = new URLSearchParams(query);
      await render();
    },
  };
}

afterEach(async () => {
  for (const root of roots.splice(0)) await act(async () => root.unmount());
  vi.unstubAllGlobals();
});

beforeEach(() => {
  navigation.params = null;
  navigation.pathname = '/en/columns';
  navigation.replace.mockClear();
});

describe('public columns filter recovery', () => {
  it.each(['ko', 'en', 'ja', 'zh-hant'] as const)(
    'recovers all 17 %s cards when reset precedes the submitted query hook commit',
    async (locale) => {
      const archive = Array.from({ length: 17 }, (_, index) => ({
        ...posts[index % posts.length], slug: `column-${index}`,
      }));
      navigation.params = new URLSearchParams({ category: 'formation' });
      const screen = await mountColumns(locale, archive);
      await act(async () => screen.control('data-columns-search-input').onChange?.({ target: { value: 'no-match-9e183d' } }));
      await act(async () => screen.control('data-columns-search').onSubmit?.({ preventDefault: vi.fn() }));
      expect(screen.control('className', 'columns-grid')['data-columns-visible-count']).toBe(0);
      expect(screen.url.searchParams.get('q')).toBe('no-match-9e183d');
      expect(navigation.params.get('q')).toBeNull(); // Deliberately no intermediate router commit.

      const reset = screen.control('data-columns-filter-reset');
      expect(reset.href).toBe(`/${locale}/columns`);
      const preventDefault = vi.fn();
      await act(async () => reset.onNavigate?.({ preventDefault }));
      expect(preventDefault).not.toHaveBeenCalled(); // Next Link owns navigation/history.
      await screen.commitUrl('');
      expect(screen.control('data-columns-search-input').value).toBe('');
      expect(screen.control('className', 'columns-grid')['data-columns-visible-count']).toBe(17);
      expect(screen.control('className', 'columns-search-status')['data-columns-search-results']).toBe(17);
      const cards = screen.control('className', 'columns-grid').children as ReactElement<ControlProps>[];
      expect(cards.map((card) => card.props.href)).toEqual(archive.map((post) => `/${locale}/columns/${post.slug}`));

      // A later back/forward URL commit must still control query and category.
      await screen.commitUrl('q=registration&category=formation');
      expect(screen.control('data-columns-search-input').value).toBe('registration');
      expect(screen.control('className', 'columns-grid')['data-columns-visible-count']).toBe(9);
      await screen.commitUrl('');
      expect(screen.control('data-columns-search-input').value).toBe('');
      expect(screen.control('className', 'columns-grid')['data-columns-visible-count']).toBe(17);
    },
  );

  it('keeps consecutive query/category changes and unrelated URL parameters before router commits', async () => {
    navigation.params = new URLSearchParams({ campaign: 'public-guide', page: '3' });
    const screen = await mountColumns('en');
    await act(async () => screen.control('data-columns-search-input').onChange?.({ target: { value: 'registration' } }));
    await act(async () => screen.control('data-columns-search').onSubmit?.({ preventDefault: vi.fn() }));
    await act(async () => screen.control('children', 'Company Setup').onClick?.());
    expect(Object.fromEntries(screen.url.searchParams)).toEqual({ campaign: 'public-guide', q: 'registration', category: 'formation' });
    expect(navigation.replace).toHaveBeenLastCalledWith('/en/columns?campaign=public-guide&q=registration&category=formation', { scroll: false });
    await screen.commitUrl(screen.url.search);
    await act(async () => screen.control('data-columns-search-clear').onClick?.());
    expect(Object.fromEntries(screen.url.searchParams)).toEqual({ campaign: 'public-guide', category: 'formation' });
    expect(screen.control('data-columns-search-input').value).toBe('');
  });

  it.each([
    ['ko', '연도', '월', '선택한 조건에 맞는 칼럼이 없습니다.', '필터 초기화'],
    ['en', 'Year', 'Month', 'No columns match the selected filters.', 'Clear filters'],
    ['ja', '年', '月', '選択した条件に一致するコラムはありません。', '絞り込みを解除'],
    ['zh-hant', '年份', '月份', '沒有符合目前條件的專欄。', '清除篩選'],
  ] as const)('explains the date-empty state and offers an unfiltered %s archive', (locale, year, month, emptyCopy, resetCopy) => {
    const html = renderToStaticMarkup(
      <ColumnsGrid locale={locale} posts={posts} initialFilters={{ year: '1900', month: '01' }} />,
    );

    expect(html).toContain('data-columns-visible-count="0"');
    expect(html).toContain('data-columns-search-results="0"');
    expect(html).toContain(`${year}: </span>1900`);
    expect(html).toContain(`${month}: </span>01`);
    expect(html).toContain(emptyCopy);
    expect(html).toContain(resetCopy);
    expect(html).toMatch(new RegExp(`<a[^>]*data-columns-filter-reset="true"[^>]*href="/${locale}/columns"`));
    expect(html.match(/class="columns-filter-btn/g)).toHaveLength(4);
    expect(html).not.toContain('disabled=');
  });

  it('retains combined query, author, date and category filtering with a truthful count', () => {
    navigation.params = new URLSearchParams({
      category: 'formation', author: 'Wei Tseng', q: 'registration', year: '2026', month: '1',
    });
    const html = renderToStaticMarkup(<ColumnsGrid locale="en" posts={posts} />);

    expect(html).toContain('data-columns-visible-count="1"');
    expect(html).toContain('data-columns-search-results="1"');
    expect(html).toContain('A complete company guide');
    expect(html).not.toContain('A complete labor guide');
    expect(html).toContain('Category: </span>Company Setup');
    expect(html).toContain('Author: </span>Wei Tseng');
    expect(html).toContain('Search: </span>registration');
    expect(html).toMatch(/aria-pressed="true"[^>]*class="columns-filter-btn active"[^>]*>Company Setup</);
    expect(html).toContain('data-columns-search-clear="true"');
    expect(html).not.toContain('disabled=');
  });

  it('shows an unknown category honestly without marking All selected, and escapes query text', () => {
    navigation.params = new URLSearchParams({ category: 'missing-topic', q: '<script>test</script>' });
    const html = renderToStaticMarkup(<ColumnsGrid locale="en" posts={posts} />);

    expect(html).toContain('Category: </span>missing-topic');
    expect(html).toContain('&lt;script&gt;test&lt;/script&gt;');
    expect(html).not.toContain('<script>test</script>');
    expect(html).not.toContain('aria-pressed="true"');
    expect(html).toContain('No columns match the selected filters.');
    expect(html).toContain('href="/en/columns"');
  });

  it('accepts month-only filters without inventing a year', () => {
    navigation.params = new URLSearchParams({ month: '02' });
    const html = renderToStaticMarkup(<ColumnsGrid locale="en" posts={posts} />);

    expect(html).toContain('data-columns-visible-count="1"');
    expect(html).toContain('A complete labor guide');
    expect(html).not.toContain('A complete company guide');
    expect(html).toContain('Month: </span>02');
    expect(html).not.toContain('Year: </span>');
  });

  it('uses the current unfiltered URL instead of stale initial filters after navigation', () => {
    navigation.params = new URLSearchParams();
    const html = renderToStaticMarkup(
      <ColumnsGrid locale="en" posts={posts} initialFilters={{ category: 'legal', year: '1900', q: 'missing' }} />,
    );

    expect(html).toContain('data-columns-visible-count="2"');
    expect(html).toMatch(/aria-pressed="true"[^>]*class="columns-filter-btn active"[^>]*>All</);
    expect(html).not.toContain('data-columns-filter-reset');
  });

  it.each([
    ['ko', '아직 게시된 칼럼이 없습니다.'],
    ['en', 'No columns have been published yet.'],
    ['ja', '公開済みのコラムはまだありません。'],
    ['zh-hant', '目前尚無已發布的專欄。'],
  ] as const)('distinguishes an unfiltered empty %s archive from unmatched filters', (locale, emptyCopy) => {
    const html = renderToStaticMarkup(<ColumnsGrid locale={locale} posts={[]} />);

    expect(html).toContain(emptyCopy);
    expect(html).not.toContain('data-columns-filter-reset');
    expect(html).toContain('data-columns-visible-count="0"');
  });
});
