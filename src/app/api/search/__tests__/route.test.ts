import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import {
  appendQueryLog,
  loadSearchIndex,
} from '@/lib/builder/search/index-storage';
import { runSearchQuery } from '@/lib/builder/search/query-engine';
import { collectAllSearchDocs } from '@/lib/builder/search/source-collector';
import type { SearchDoc, SearchIndex } from '@/lib/builder/search/types';
import { GET } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true })),
}));

vi.mock('@/lib/builder/search/index-storage', () => ({
  appendQueryLog: vi.fn(async () => undefined),
  loadSearchIndex: vi.fn(),
}));

vi.mock('@/lib/builder/search/index-builder', () => ({
  buildSearchIndex: vi.fn(),
}));

vi.mock('@/lib/builder/search/source-collector', () => ({
  collectAllSearchDocs: vi.fn(),
}));

vi.mock('@/lib/builder/search/query-engine', () => ({
  runSearchQuery: vi.fn(),
}));

const doc: SearchDoc = {
  id: 'portfolio:ko:pf-1',
  kind: 'portfolio',
  locale: 'ko',
  title: 'Portfolio One',
  url: '/ko/portfolio/portfolio-one',
  summary: 'Portfolio summary',
  body: 'Portfolio body',
};

const storedIndex: SearchIndex = {
  builtAt: '2026-06-03T00:00:00.000Z',
  byLocale: {
    ko: [doc],
    'zh-hant': [],
    en: [],
  },
  invertedByLocale: {
    ko: { portfolio: ['0:1'] },
    'zh-hant': {},
    en: {},
  },
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const appendQueryLogMock = vi.mocked(appendQueryLog);
const buildSearchIndexMock = vi.mocked(buildSearchIndex);
const collectAllSearchDocsMock = vi.mocked(collectAllSearchDocs);
const loadSearchIndexMock = vi.mocked(loadSearchIndex);
const runSearchQueryMock = vi.mocked(runSearchQuery);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/search${query ? `?${query}` : ''}`, {
    headers: {
      'x-forwarded-for': '203.0.113.1',
      'user-agent': 'vitest-search',
    },
  });
}

describe('/api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true } as never);
    appendQueryLogMock.mockResolvedValue(undefined as never);
    buildSearchIndexMock.mockReturnValue(storedIndex);
    collectAllSearchDocsMock.mockResolvedValue([doc] as never);
    loadSearchIndexMock.mockResolvedValue(storedIndex);
    runSearchQueryMock.mockReturnValue([
      {
        doc,
        score: 1.234,
        highlights: ['Portfolio body'],
      },
    ]);
  });

  it('returns empty hits for blank queries without loading the index', async () => {
    const response = await GET(request('locale=ko&q='));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      query: '',
      hits: [],
      total: 0,
    });
    expect(loadSearchIndexMock).not.toHaveBeenCalled();
    expect(runSearchQueryMock).not.toHaveBeenCalled();
  });

  it('returns search hits while preserving success response shape', async () => {
    const response = await GET(request('locale=ko&q=portfolio&kinds=portfolio,bad&limit=5'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(loadSearchIndexMock).toHaveBeenCalled();
    expect(runSearchQueryMock).toHaveBeenCalledWith({
      index: storedIndex,
      query: 'portfolio',
      locale: 'ko',
      limit: 5,
      kinds: ['portfolio'],
    });
    expect(appendQueryLogMock).toHaveBeenCalledWith(expect.objectContaining({
      query: 'portfolio',
      locale: 'ko',
      hits: 1,
      hitId: 'portfolio:ko:pf-1',
      userAgentDigest: expect.any(String),
    }));
    expect(payload).toEqual({
      ok: true,
      query: 'portfolio',
      locale: 'ko',
      indexMissing: false,
      total: 1,
      hits: [
        {
          id: 'portfolio:ko:pf-1',
          kind: 'portfolio',
          title: 'Portfolio One',
          url: '/ko/portfolio/portfolio-one',
          summary: 'Portfolio summary',
          highlights: ['Portfolio body'],
          score: 1.23,
        },
      ],
    });
  });

  it('builds a fallback index when no stored index exists', async () => {
    loadSearchIndexMock.mockResolvedValueOnce(null);

    const response = await GET(request('locale=ko&q=portfolio'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(collectAllSearchDocsMock).toHaveBeenCalledWith('default');
    expect(buildSearchIndexMock).toHaveBeenCalledWith([doc]);
    expect(payload.indexMissing).toBe(true);
  });

  it('returns localized rate-limit errors', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false } as never);

    const response = await GET(request('locale=zh-hant&q=portfolio'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(payload).toEqual({
      ok: false,
      error: '搜尋請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
    expect(loadSearchIndexMock).not.toHaveBeenCalled();
  });

  it('returns localized index failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    loadSearchIndexMock.mockRejectedValueOnce(new Error('search index secret leaked'));

    const response = await GET(request('locale=en&q=portfolio'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load the search index.',
      errorCode: 'search_index_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('search index secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[public/search] index load failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized query failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    runSearchQueryMock.mockImplementationOnce(() => {
      throw new Error('search query secret leaked');
    });

    const response = await GET(request('locale=ko&q=portfolio'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '검색을 완료하지 못했습니다.',
      errorCode: 'search_query_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('search query secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[public/search] query failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
