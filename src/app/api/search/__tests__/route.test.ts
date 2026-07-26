import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { buildSearchIndex } from '@/lib/builder/search/index-builder';
import {
  appendQueryLog,
  loadSearchIndex,
  saveSearchIndex,
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
  saveSearchIndex: vi.fn(async () => undefined),
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
const saveSearchIndexMock = vi.mocked(saveSearchIndex);

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
    vi.resetAllMocks();
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
    saveSearchIndexMock.mockResolvedValue(undefined as never);
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

  it('rebuilds and persists an index older than the five-minute freshness window before serving results', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-03T00:06:00.000Z'));

    try {
      const currentDoc: SearchDoc = {
        ...doc,
        id: 'portfolio:ko:current-column',
        title: 'Current Column',
        url: '/ko/columns/current-column',
        summary: 'Current replacement summary',
        body: 'Current replacement body',
      };
      const staleIndex: SearchIndex = {
        ...storedIndex,
        builtAt: '2026-06-03T00:00:00.000Z',
      };
      const rebuiltIndex: SearchIndex = {
        builtAt: '2026-06-03T00:06:00.000Z',
        byLocale: {
          ko: [currentDoc],
          'zh-hant': [],
          en: [],
        },
        invertedByLocale: {
          ko: { current: ['0:2'] },
          'zh-hant': {},
          en: {},
        },
      };

      loadSearchIndexMock.mockResolvedValueOnce(staleIndex);
      collectAllSearchDocsMock.mockResolvedValueOnce([currentDoc] as never);
      buildSearchIndexMock.mockReturnValueOnce(rebuiltIndex);
      runSearchQueryMock.mockReturnValueOnce([
        {
          doc: currentDoc,
          score: 2,
          highlights: ['Current replacement body'],
        },
      ]);

      const response = await GET(request('locale=ko&q=current'));
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(collectAllSearchDocsMock).toHaveBeenCalledWith('default');
      expect(buildSearchIndexMock).toHaveBeenCalledWith([currentDoc]);
      expect(saveSearchIndexMock).toHaveBeenCalledWith(rebuiltIndex);
      expect(runSearchQueryMock).toHaveBeenCalledWith(expect.objectContaining({
        index: rebuiltIndex,
        query: 'current',
        locale: 'ko',
      }));
      expect(payload.hits).toEqual([
        expect.objectContaining({
          id: 'portfolio:ko:current-column',
          title: 'Current Column',
        }),
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('treats a future-dated stored index as stale and serves rebuilt current hits', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-03T00:00:00.000Z'));

    try {
      const currentDoc: SearchDoc = {
        ...doc,
        id: 'portfolio:ko:current-future-replacement',
        title: 'Current Future Replacement',
        url: '/ko/columns/current-future-replacement',
        summary: 'Current future replacement summary',
        body: 'Current future replacement body',
      };
      const futureIndex: SearchIndex = {
        ...storedIndex,
        builtAt: '2026-06-03T00:01:00.000Z',
      };
      const rebuiltIndex: SearchIndex = {
        builtAt: '2026-06-03T00:00:00.000Z',
        byLocale: { ko: [currentDoc], 'zh-hant': [], en: [] },
        invertedByLocale: { ko: { current: ['0:3'] }, 'zh-hant': {}, en: {} },
      };

      loadSearchIndexMock.mockResolvedValueOnce(futureIndex);
      collectAllSearchDocsMock.mockResolvedValueOnce([currentDoc] as never);
      buildSearchIndexMock.mockReturnValueOnce(rebuiltIndex);
      runSearchQueryMock.mockReturnValueOnce([
        { doc: currentDoc, score: 3, highlights: ['Current future replacement body'] },
      ]);

      const response = await GET(request('locale=ko&q=current'));
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(collectAllSearchDocsMock).toHaveBeenCalledWith('default');
      expect(buildSearchIndexMock).toHaveBeenCalledWith([currentDoc]);
      expect(saveSearchIndexMock).toHaveBeenCalledWith(rebuiltIndex);
      expect(runSearchQueryMock).toHaveBeenCalledWith(expect.objectContaining({
        index: rebuiltIndex,
        query: 'current',
        locale: 'ko',
      }));
      expect(payload.hits).toEqual([
        expect.objectContaining({
          id: 'portfolio:ko:current-future-replacement',
          title: 'Current Future Replacement',
        }),
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('serves rebuilt current hits when persisting a refreshed index fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-03T00:06:00.000Z'));

    try {
      const currentDoc: SearchDoc = {
        ...doc,
        id: 'portfolio:ko:current-unsaved-replacement',
        title: 'Current Unsaved Replacement',
        url: '/ko/columns/current-unsaved-replacement',
        summary: 'Current unsaved replacement summary',
        body: 'Current unsaved replacement body',
      };
      const staleIndex: SearchIndex = {
        ...storedIndex,
        builtAt: '2026-06-03T00:00:00.000Z',
      };
      const rebuiltIndex: SearchIndex = {
        builtAt: '2026-06-03T00:06:00.000Z',
        byLocale: { ko: [currentDoc], 'zh-hant': [], en: [] },
        invertedByLocale: { ko: { current: ['0:4'] }, 'zh-hant': {}, en: {} },
      };

      loadSearchIndexMock.mockResolvedValueOnce(staleIndex);
      collectAllSearchDocsMock.mockResolvedValueOnce([currentDoc] as never);
      buildSearchIndexMock.mockReturnValueOnce(rebuiltIndex);
      saveSearchIndexMock.mockRejectedValueOnce(new Error('index persistence is unavailable'));
      runSearchQueryMock.mockReturnValueOnce([
        { doc: currentDoc, score: 4, highlights: ['Current unsaved replacement body'] },
      ]);

      const response = await GET(request('locale=ko&q=current'));
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(saveSearchIndexMock).toHaveBeenCalledWith(rebuiltIndex);
      expect(runSearchQueryMock).toHaveBeenCalledWith(expect.objectContaining({ index: rebuiltIndex }));
      expect(payload).toMatchObject({
        ok: true,
        hits: [
          {
            id: 'portfolio:ko:current-unsaved-replacement',
            title: 'Current Unsaved Replacement',
          },
        ],
      });
      expect(payload).not.toHaveProperty('errorCode');
    } finally {
      consoleError.mockRestore();
      vi.useRealTimers();
    }
  });

  it('uses a fresh stored index without collecting, rebuilding, or persisting', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-03T00:05:00.000Z'));

    try {
      const freshIndex: SearchIndex = {
        ...storedIndex,
        builtAt: '2026-06-03T00:04:00.000Z',
      };
      loadSearchIndexMock.mockResolvedValueOnce(freshIndex);

      const response = await GET(request('locale=ko&q=portfolio'));
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(runSearchQueryMock).toHaveBeenCalledWith(expect.objectContaining({ index: freshIndex }));
      expect(collectAllSearchDocsMock).not.toHaveBeenCalled();
      expect(buildSearchIndexMock).not.toHaveBeenCalled();
      expect(saveSearchIndexMock).not.toHaveBeenCalled();
      expect(payload.hits).toEqual([
        expect.objectContaining({ id: 'portfolio:ko:pf-1', title: 'Portfolio One' }),
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('coalesces concurrent stale-index refreshes and serves both requests rebuilt current hits', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-03T00:06:00.000Z'));

    try {
      const currentDoc: SearchDoc = {
        ...doc,
        id: 'portfolio:ko:current-concurrent-replacement',
        title: 'Current Concurrent Replacement',
        url: '/ko/columns/current-concurrent-replacement',
        summary: 'Current concurrent replacement summary',
        body: 'Current concurrent replacement body',
      };
      const staleIndex: SearchIndex = {
        ...storedIndex,
        builtAt: '2026-06-03T00:00:00.000Z',
      };
      const rebuiltIndex: SearchIndex = {
        builtAt: '2026-06-03T00:06:00.000Z',
        byLocale: { ko: [currentDoc], 'zh-hant': [], en: [] },
        invertedByLocale: { ko: { current: ['0:5'] }, 'zh-hant': {}, en: {} },
      };
      let releaseCollection: (docs: SearchDoc[]) => void = () => undefined;
      let notifyFirstCollectionStarted: () => void = () => undefined;
      const collectionGate = new Promise<SearchDoc[]>((resolve) => {
        releaseCollection = resolve;
      });
      const firstCollectionStarted = new Promise<void>((resolve) => {
        notifyFirstCollectionStarted = resolve;
      });

      loadSearchIndexMock.mockResolvedValue(staleIndex);
      collectAllSearchDocsMock.mockImplementation(async () => {
        notifyFirstCollectionStarted();
        return collectionGate;
      });
      buildSearchIndexMock.mockReturnValue(rebuiltIndex);
      runSearchQueryMock.mockReturnValue([
        { doc: currentDoc, score: 5, highlights: ['Current concurrent replacement body'] },
      ]);

      const firstRequest = GET(request('locale=ko&q=current'));
      await firstCollectionStarted;

      const secondRequest = GET(request('locale=ko&q=current'));
      await Promise.resolve();
      await Promise.resolve();
      releaseCollection([currentDoc]);
      const [firstResponse, secondResponse] = await Promise.all([firstRequest, secondRequest]);
      const [firstPayload, secondPayload] = await Promise.all([
        firstResponse.json(),
        secondResponse.json(),
      ]);

      expect(firstResponse.status).toBe(200);
      expect(secondResponse.status).toBe(200);
      expect(collectAllSearchDocsMock).toHaveBeenCalledTimes(1);
      expect(buildSearchIndexMock).toHaveBeenCalledTimes(1);
      expect(saveSearchIndexMock).toHaveBeenCalledTimes(1);
      expect(runSearchQueryMock).toHaveBeenCalledTimes(2);
      expect(runSearchQueryMock).toHaveBeenNthCalledWith(1, expect.objectContaining({ index: rebuiltIndex }));
      expect(runSearchQueryMock).toHaveBeenNthCalledWith(2, expect.objectContaining({ index: rebuiltIndex }));
      expect(firstPayload.hits).toEqual([
        expect.objectContaining({ id: 'portfolio:ko:current-concurrent-replacement' }),
      ]);
      expect(secondPayload.hits).toEqual([
        expect.objectContaining({ id: 'portfolio:ko:current-concurrent-replacement' }),
      ]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('returns localized rate-limit errors for genuine throttle', async () => {
    checkRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      retryAfterMs: 3100,
    } as never);

    const response = await GET(request('locale=zh-hant&q=portfolio'));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('4');
    expect(payload).toEqual({
      ok: false,
      error: '搜尋請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
    expect(loadSearchIndexMock).not.toHaveBeenCalled();
  });

  it('returns 503 when rate-limit backend is unavailable', async () => {
    checkRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    } as never);

    const response = await GET(request('locale=en&q=portfolio'));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(response.headers.get('Retry-After')).toBeNull();
    expect(payload).toEqual({
      ok: false,
      error: 'Search protection is temporarily unavailable. Try again shortly.',
      errorCode: 'rate_limit_unavailable',
    });
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
