import { describe, expect, it } from 'vitest';
import { matchStaticSearchDocs, type StaticSearchDoc } from '../StaticSearchPage';
import { formatSearchTotal } from '../search-labels';

const docs: StaticSearchDoc[] = [
  { id: 'blog:a', kind: 'blog', url: '/ko/columns/a', title: '대만 회사 설립 기초', summary: '자본금과 절차' },
  { id: 'blog:b', kind: 'blog', url: '/ko/columns/b', title: '이혼 재산 분할', tags: ['가사'] },
  { id: 'page:services', kind: 'page', url: '/ko/services', title: '업무분야', summary: '회사 설립·소송' },
  { id: 'faq:1', kind: 'faq', url: '/ko/faq', title: 'ＡＢＣ Company FAQ' },
];

describe('static-site search matching', () => {
  it('returns nothing for an empty query', () => {
    expect(matchStaticSearchDocs(docs, '   ', 'all')).toEqual([]);
  });

  it('requires every token across title, summary and tags', () => {
    expect(matchStaticSearchDocs(docs, '회사 설립', 'all').map((d) => d.id)).toEqual(['blog:a', 'page:services']);
    expect(matchStaticSearchDocs(docs, '회사 이혼', 'all')).toEqual([]);
    expect(matchStaticSearchDocs(docs, '가사', 'all').map((d) => d.id)).toEqual(['blog:b']);
  });

  it('filters by kind', () => {
    expect(matchStaticSearchDocs(docs, '회사', 'page').map((d) => d.id)).toEqual(['page:services']);
  });

  it('normalizes width and case', () => {
    expect(matchStaticSearchDocs(docs, 'abc company', 'all').map((d) => d.id)).toEqual(['faq:1']);
  });

  it('labels capped totals like the server search', () => {
    expect(formatSearchTotal('ko', 50)).toBe('상위 50건');
    expect(formatSearchTotal('ja', 3)).toBe('全 3 件');
  });
});
