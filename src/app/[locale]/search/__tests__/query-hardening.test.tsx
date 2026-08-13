import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildSearchIndex } from '@/lib/builder/search/index-builder';

const mocks = vi.hoisted(() => ({
  loadSearchIndex: vi.fn(),
  runSearchQuery: vi.fn(),
}));

vi.mock('@/lib/builder/search/index-storage', () => ({
  loadSearchIndex: mocks.loadSearchIndex,
}));

vi.mock('@/lib/builder/search/query-engine', () => ({
  runSearchQuery: mocks.runSearchQuery,
}));

import SearchPage from '../page';

const emptyIndex = buildSearchIndex([]);

async function renderSearch(
  q: string,
  locale: 'ko' | 'zh-hant' | 'en' | 'ja' = 'en',
): Promise<string> {
  return renderToStaticMarkup(
    await SearchPage({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({ q }),
    }),
  );
}

describe('/search query hardening', () => {
  beforeEach(() => {
    mocks.loadSearchIndex.mockReset();
    mocks.loadSearchIndex.mockResolvedValue(emptyIndex);
    mocks.runSearchQuery.mockReset();
    mocks.runSearchQuery.mockReturnValue([]);
  });

  it('bounds an overlong Unicode query before running the search engine', async () => {
    const query = '😀'.repeat(201);
    const html = await renderSearch(query);

    expect(mocks.runSearchQuery).toHaveBeenCalledTimes(1);
    expect(mocks.runSearchQuery).toHaveBeenCalledWith(
      expect.objectContaining({ query: '😀'.repeat(200) }),
    );
    expect(Array.from(mocks.runSearchQuery.mock.calls[0][0].query)).toHaveLength(200);
    expect(html).toContain('maxLength="200"');
    expect(html).not.toContain('😀'.repeat(201));
  });

  it.each(['', '\t'])('keeps an empty or tab-only query out of the search engine', async (query) => {
    await renderSearch(query);

    expect(mocks.runSearchQuery).not.toHaveBeenCalled();
  });

  it('keeps the rendered query React-escaped', async () => {
    const html = await renderSearch('"><img src=x onerror=alert(1)>');

    expect(html).toContain('value="&quot;&gt;&lt;img src=x onerror=alert(1)&gt;"');
    expect(html).not.toContain('<img src=x onerror=alert(1)>');
  });

  it.each([
    ['ko', '검색'],
    ['zh-hant', '搜尋'],
    ['en', 'Search'],
    ['ja', '検索'],
  ] as const)('renders a localized accessible name for the %s search input', async (locale, label) => {
    const html = await renderSearch('', locale);

    expect(html).toContain(`aria-label="${label}"`);
  });
});
