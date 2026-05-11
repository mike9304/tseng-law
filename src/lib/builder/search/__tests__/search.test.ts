import { describe, expect, it } from 'vitest';
import { tokenize } from '@/lib/builder/search/tokenize';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import type { SearchDoc } from '@/lib/builder/search/types';

describe('search tokenizer', () => {
  it('lowercases ASCII and splits on whitespace + punctuation', () => {
    expect(tokenize('Hello, World! tseng-law')).toEqual(['hello', 'world', 'tseng', 'law']);
  });

  it('splits CJK characters and emits bigrams', () => {
    const tokens = tokenize('호정 법률');
    expect(tokens).toContain('호');
    expect(tokens).toContain('호정');
    expect(tokens).toContain('법률');
  });

  it('separates ASCII from CJK at the boundary', () => {
    const tokens = tokenize('호정law');
    expect(tokens).toContain('호정');
    expect(tokens).toContain('law');
  });
});

describe('search index + query engine', () => {
  const docs: SearchDoc[] = [
    {
      id: 'page:ko:1',
      kind: 'page',
      locale: 'ko',
      title: '대만 진출 가이드',
      url: '/ko/guide',
      body: '대만 회사 설립과 관련된 절차를 안내합니다. 회사 설립.',
    },
    {
      id: 'page:ko:2',
      kind: 'page',
      locale: 'ko',
      title: '소송 안내',
      url: '/ko/litigation',
      body: '대만 소송 절차에 대한 안내.',
    },
    {
      id: 'page:en:1',
      kind: 'page',
      locale: 'en',
      title: 'Taiwan setup guide',
      url: '/en/guide',
      body: 'How to set up a company in Taiwan.',
    },
  ];

  const index = buildSearchIndex(docs);

  it('returns hits scored by tf-idf within the requested locale only', () => {
    const hits = runSearchQuery({ index, query: '대만 회사', locale: 'ko' });
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].doc.id).toBe('page:ko:1');
    expect(hits.every((h) => h.doc.locale === 'ko')).toBe(true);
  });

  it('filters by kind when requested', () => {
    const hits = runSearchQuery({ index, query: 'guide', locale: 'en', kinds: ['blog'] });
    expect(hits).toEqual([]);
    const allHits = runSearchQuery({ index, query: 'guide', locale: 'en' });
    expect(allHits.length).toBe(1);
  });

  it('returns no hits for empty queries', () => {
    expect(runSearchQuery({ index, query: '   ', locale: 'ko' })).toEqual([]);
  });

  it('boosts title matches over body-only matches', () => {
    const expandedDocs: SearchDoc[] = [
      ...docs,
      {
        id: 'page:ko:3',
        kind: 'page',
        locale: 'ko',
        title: '소송 절차',
        url: '/ko/lit2',
        body: '간단 안내.',
      },
    ];
    const expandedIndex = buildSearchIndex(expandedDocs);
    const hits = runSearchQuery({ index: expandedIndex, query: '소송', locale: 'ko' });
    expect(hits[0].doc.title).toContain('소송');
  });
});
