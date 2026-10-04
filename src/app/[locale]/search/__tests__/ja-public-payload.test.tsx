import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import JaSearchView from '../JaSearchView';
import type { SearchPageViewProps } from '../SearchPageView';

vi.mock('@/lib/builder/search/current-search', () => ({
  searchCurrentPublication: async () => ({
    availableKinds: ['blog'],
    hits: [{
      doc: { id: 'public-hit', kind: 'blog', title: '公開タイトル', url: '/ja/columns/public-hit', summary: '公開要約', body: 'UNSHIPPED_FULL_BODY', tags: ['UNSHIPPED_TAG'], publishedAt: 'UNSHIPPED_INTERNAL_DATE' },
      score: 12345, highlights: ['表示する抜粋'],
    }],
  }),
}));

describe('Japanese search SSR payload', () => {
  it('sends only visible result fields through its synchronous boundary', async () => {
    const { default: Page } = await import('../page');
    const result = await Page({ params: Promise.resolve({ locale: 'ja' }), searchParams: Promise.resolve({ q: '公開', tab: 'blog' }) });
    expect((result as ReactElement).type).toBe(JaSearchView);
    const props = (result as ReactElement<SearchPageViewProps>).props;
    expect(props.results).toEqual([{ id: 'public-hit', kindLabel: 'コラム', url: '/ja/columns/public-hit', title: '公開タイトル', description: '表示する抜粋' }]);
    expect(JSON.stringify(props)).not.toContain('UNSHIPPED');
    expect(JSON.stringify(props)).not.toContain('12345');
    const html = renderToStaticMarkup(result);
    expect(html).toContain('href="/ja/columns/public-hit"');
    expect(html).toContain('表示する抜粋');
    expect(html).toContain('method="get"');
  });
});
