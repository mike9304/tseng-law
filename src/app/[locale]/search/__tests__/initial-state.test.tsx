import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { siteContent } from '@/data/site-content';
const mocks = vi.hoisted(() => ({ loadSearchIndex: vi.fn() }));
vi.mock('@/lib/builder/search/index-storage', () => ({ loadSearchIndex: mocks.loadSearchIndex }));
import SearchPage from '../page';

beforeEach(() => {
  mocks.loadSearchIndex.mockReset();
  mocks.loadSearchIndex.mockResolvedValue(buildSearchIndex([]));
});

describe('blank search versus no matches', () => {
  it.each([
    ['ko', '검색어를 입력하거나', '검색 결과가 없습니다.'],
    ['en', 'Enter a keyword', 'No search results found.'],
    ['ja', 'キーワードを入力するか', '検索結果が見つかりませんでした。'],
    ['zh-hant', '請輸入關鍵字', '沒有搜尋結果。'],
  ] as const)('offers %s suggestions before searching and preserves genuine no-results state', async (locale, initial, empty) => {
    const blank = renderToStaticMarkup(await SearchPage({ params: Promise.resolve({ locale }), searchParams: Promise.resolve({ q: '  ' }) }));
    expect(blank).toContain(initial);
    expect(blank).not.toContain(empty);
    expect(blank).not.toContain('search-results-total');
    expect(mocks.loadSearchIndex).not.toHaveBeenCalled();
    for (const suggestion of siteContent[locale].search.suggestions) {
      expect(blank).toContain(`href="/${locale}/search?q=${encodeURIComponent(suggestion)}"`);
    }
    const searched = renderToStaticMarkup(await SearchPage({ params: Promise.resolve({ locale }), searchParams: Promise.resolve({ q: 'unmatched-query' }) }));
    expect(searched).toContain(empty);
    expect(searched).toContain('search-results-total');
    expect(searched).not.toContain('data-search-initial');
  });
});
