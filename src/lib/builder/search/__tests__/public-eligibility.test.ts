import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { listPages } from '@/lib/builder/site/persistence';
import type { SearchHit } from '@/lib/builder/search/types';
import { retainPublicPageHits } from '@/lib/builder/search/public-eligibility';

vi.mock('@/lib/builder/site/persistence', () => ({
  listPages: vi.fn(async () => []),
}));

const mockedListPages = vi.mocked(listPages);

function pageMeta(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'probe',
    slug: 'probe',
    title: { ko: 'Probe', en: 'Probe', 'zh-hant': 'Probe' },
    locale: 'ko',
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedAt: '2026-09-14T00:00:00.000Z',
    publishedAt: '2026-09-14T00:00:00.000Z',
    ...overrides,
  };
}

function pageHit(pageId = 'probe'): SearchHit {
  return {
    doc: {
      id: `page:ko:${pageId}`,
      kind: 'page',
      locale: 'ko',
      title: 'Probe',
      url: '/ko/probe',
      body: 'public body',
    },
    score: 1,
    highlights: ['public body'],
  };
}

function blogHit(): SearchHit {
  return {
    doc: {
      id: 'blog:ko:keep-me',
      kind: 'blog',
      locale: 'ko',
      title: 'Keep',
      url: '/ko/columns/keep-me',
      body: 'blog body',
    },
    score: 1,
    highlights: [],
  };
}

describe('retainPublicPageHits', () => {
  beforeEach(() => {
    mockedListPages.mockReset();
    mockedListPages.mockResolvedValue([]);
  });

  it('drops page hits whose page was deleted from the site document', async () => {
    mockedListPages.mockResolvedValue([]);

    const hits = await retainPublicPageHits([pageHit(), blogHit()], 'ko');

    expect(hits.map((hit) => hit.doc.id)).toEqual(['blog:ko:keep-me']);
  });

  it('drops noIndex page hits', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({ seo: { noIndex: true } }),
    ]);

    const hits = await retainPublicPageHits([pageHit()], 'ko');

    expect(hits).toEqual([]);
  });

  it('drops member-only page hits', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({ memberAccess: { requireLogin: true, allowedRoles: ['premium'] } }),
    ]);

    const hits = await retainPublicPageHits([pageHit()], 'ko');

    expect(hits).toEqual([]);
  });

  it('drops password-protected page hits', async () => {
    mockedListPages.mockResolvedValue([
      pageMeta({ password: 'secret' }),
    ]);

    const hits = await retainPublicPageHits([pageHit()], 'ko');

    expect(hits).toEqual([]);
  });

  it('keeps currently public published page hits', async () => {
    mockedListPages.mockResolvedValue([pageMeta()]);

    const hits = await retainPublicPageHits([pageHit(), blogHit()], 'ko');

    expect(hits.map((hit) => hit.doc.id)).toEqual(['page:ko:probe', 'blog:ko:keep-me']);
  });
});
