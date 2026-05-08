import { describe, expect, it } from 'vitest';
import { reconcileSiteDocumentPagesForWrite } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';

function page(pageId: string, updatedAt: string): BuilderPageMeta {
  return {
    pageId,
    slug: pageId,
    title: { ko: pageId, 'zh-hant': pageId, en: pageId },
    locale: 'ko',
    createdAt: updatedAt,
    updatedAt,
  };
}

function site(pages: BuilderPageMeta[], updatedAt: string): BuilderSiteDocument {
  return {
    version: 1,
    siteId: 'default',
    name: 'Test site',
    locale: 'ko',
    navigation: [],
    theme: {},
    pages,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt,
  } as unknown as BuilderSiteDocument;
}

describe('reconcileSiteDocumentPagesForWrite', () => {
  it('does not preserve latest-only pages by default', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const duplicate = page('duplicate', '2026-01-01T00:00:00.000Z');
    const latest = site([home, duplicate], '2026-01-02T00:00:00.000Z');
    const next = site([home], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(next, latest).pages.map((entry) => entry.pageId))
      .toEqual(['home']);
  });

  it('preserves latest-only pages when explicitly requested', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const concurrent = page('concurrent', '2026-01-02T00:00:00.000Z');
    const latest = site([home, concurrent], '2026-01-02T00:00:01.000Z');
    const next = site([home], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(next, latest, { preserveMissingPages: true }).pages.map((entry) => entry.pageId))
      .toEqual(['home', 'concurrent']);
  });

  it('drops stale next-only pages that the latest site no longer has', () => {
    const home = page('home', '2026-01-03T00:00:00.000Z');
    const deleted = page('deleted', '2026-01-01T00:00:00.000Z');
    const latest = site([home], '2026-01-02T00:00:00.000Z');
    const staleNext = site([home, deleted], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(staleNext, latest, { preserveMissingPages: true }).pages.map((entry) => entry.pageId))
      .toEqual(['home']);
  });

  it('keeps next-only pages that are newer than the latest site snapshot', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const created = page('created', '2026-01-03T00:00:00.000Z');
    const latest = site([home], '2026-01-02T00:00:00.000Z');
    const next = site([home, created], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(next, latest).pages.map((entry) => entry.pageId))
      .toEqual(['home', 'created']);
  });
});
