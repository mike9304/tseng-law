import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import type { SearchDoc } from '@/lib/builder/search/types';

const mocks = vi.hoisted(() => ({
  loadSearchIndex: vi.fn(),
}));

vi.mock('@/lib/builder/search/index-storage', () => ({
  loadSearchIndex: mocks.loadSearchIndex,
}));

import SearchPage from '../page';

function doc(partial: Pick<SearchDoc, 'id' | 'kind' | 'locale' | 'title' | 'url'>): SearchDoc {
  return {
    summary: partial.title,
    body: partial.title,
    ...partial,
  };
}

async function renderSearch(locale: 'ko' | 'en', q: string): Promise<string> {
  return renderToStaticMarkup(
    await SearchPage({
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({ q }),
    }),
  );
}

describe('public search kind chips', () => {
  beforeEach(() => {
    mocks.loadSearchIndex.mockReset();
  });

  it('hides kinds whose public document count is 0 and keeps All', async () => {
    mocks.loadSearchIndex.mockResolvedValue(
      buildSearchIndex([
        doc({
          id: 'page:ko:about',
          kind: 'page',
          locale: 'ko',
          title: '소개',
          url: '/ko/about',
        }),
        doc({
          id: 'blog:ko:one',
          kind: 'blog',
          locale: 'ko',
          title: '칼럼 한 편',
          url: '/ko/columns/one',
        }),
        doc({
          id: 'faq:ko:one',
          kind: 'faq',
          locale: 'ko',
          title: '자주 묻는 질문',
          url: '/ko/faq#one',
        }),
      ]),
    );

    const html = await renderSearch('ko', '소개');

    expect(html).toContain('>전체<');
    expect(html).toContain('>페이지<');
    expect(html).toContain('>칼럼<');
    expect(html).toContain('>자주 묻는 질문<');
    expect(html).not.toContain('>포트폴리오<');
    expect(html).not.toContain('tab=portfolio');
  });

  it('keeps All when every kind count is 0', async () => {
    mocks.loadSearchIndex.mockResolvedValue(buildSearchIndex([]));

    const html = await renderSearch('ko', '');

    expect(html).toContain('>전체<');
    expect(html).not.toContain('>포트폴리오<');
    expect(html).not.toContain('>페이지<');
    expect(html).not.toContain('tab=portfolio');
  });

  it('renders a Portfolio chip only when public portfolio documents exist', async () => {
    mocks.loadSearchIndex.mockResolvedValue(
      buildSearchIndex([
        doc({
          id: 'portfolio:en:1',
          kind: 'portfolio',
          locale: 'en',
          title: 'Portfolio One',
          url: '/en/portfolio/1',
        }),
      ]),
    );

    const html = await renderSearch('en', 'Portfolio');

    expect(html).toContain('>All<');
    expect(html).toContain('>Portfolio<');
    expect(html).toContain('tab=portfolio');
  });
});
