import { describe, expect, it } from 'vitest';
import {
  mergeUntouchedPageSeoForWrite,
  reconcileSiteDocumentNavigationForWrite,
  reconcileSiteDocumentPagesForWrite,
} from '@/lib/builder/site/persistence';
import type { BuilderNavItem, BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';

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

function pageWithTimestamps(pageId: string, createdAt: string, updatedAt: string): BuilderPageMeta {
  return {
    ...page(pageId, updatedAt),
    createdAt,
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

function navItem(id: string, pageId: string, href: string): BuilderNavItem {
  return {
    id,
    pageId,
    href,
    label: { ko: id, 'zh-hant': id, en: id },
  };
}

describe('reconcileSiteDocumentPagesForWrite', () => {
  it('preserves latest-only pages by default', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const concurrent = page('concurrent', '2026-01-02T00:00:00.000Z');
    const latest = site([home, concurrent], '2026-01-02T00:00:01.000Z');
    const next = site([home], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(next, latest).pages.map((entry) => entry.pageId))
      .toEqual(['home', 'concurrent']);
  });

  it('drops latest-only pages when explicitly requested', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const duplicate = page('duplicate', '2026-01-01T00:00:00.000Z');
    const latest = site([home, duplicate], '2026-01-02T00:00:00.000Z');
    const next = site([home], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(next, latest, { preserveMissingPages: false }).pages.map((entry) => entry.pageId))
      .toEqual(['home']);
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

  it('drops old next-only pages even when their updatedAt is newer', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const deleted = pageWithTimestamps(
      'deleted',
      '2026-01-01T00:00:00.000Z',
      '2026-01-03T00:00:00.000Z',
    );
    const latest = site([home], '2026-01-02T00:00:00.000Z');
    const staleNext = site([home, deleted], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(staleNext, latest).pages.map((entry) => entry.pageId))
      .toEqual(['home']);
  });

  it('does not resurrect a page deleted in another tab when a stale writer saves later', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const deletedInLatest = pageWithTimestamps(
      'deleted-in-latest',
      '2026-01-01T00:00:00.000Z',
      '2026-01-03T00:00:00.000Z',
    );
    const latestAfterDelete = site([home], '2026-01-02T00:00:00.000Z');
    const staleWriter = site([home, deletedInLatest], '2026-01-03T00:00:00.000Z');

    const reconciled = reconcileSiteDocumentPagesForWrite(staleWriter, latestAfterDelete);

    expect(reconciled.pages.map((entry) => entry.pageId)).toEqual(['home']);
  });

  it('drops next-only pages without a reliable createdAt timestamp', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const missingCreatedAt = pageWithTimestamps(
      'unknown',
      '',
      '2026-01-03T00:00:00.000Z',
    );
    const latest = site([home], '2026-01-02T00:00:00.000Z');
    const staleNext = site([home, missingCreatedAt], '2026-01-03T00:00:00.000Z');

    expect(reconcileSiteDocumentPagesForWrite(staleNext, latest).pages.map((entry) => entry.pageId))
      .toEqual(['home']);
  });
});

describe('reconcileSiteDocumentNavigationForWrite', () => {
  it('preserves latest-only navigation items by default', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const created = page('created', '2026-01-02T00:00:00.000Z');
    const latest = {
      ...site([home, created], '2026-01-02T00:00:01.000Z'),
      navigation: [
        navItem('nav-home', 'home', '/ko'),
        navItem('nav-created', 'created', '/ko/created'),
      ],
    };
    const staleWriter = {
      ...site([home, created], '2026-01-03T00:00:00.000Z'),
      navigation: [navItem('nav-home', 'home', '/ko')],
    };

    const reconciled = reconcileSiteDocumentNavigationForWrite(staleWriter, latest);

    expect(reconciled.navigation.map((entry) => entry.id)).toEqual(['nav-home', 'nav-created']);
  });

  it('allows explicit navigation deletion paths to opt out', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const created = page('created', '2026-01-02T00:00:00.000Z');
    const latest = {
      ...site([home, created], '2026-01-02T00:00:01.000Z'),
      navigation: [
        navItem('nav-home', 'home', '/ko'),
        navItem('nav-created', 'created', '/ko/created'),
      ],
    };
    const next = {
      ...site([home, created], '2026-01-03T00:00:00.000Z'),
      navigation: [navItem('nav-home', 'home', '/ko')],
    };

    const reconciled = reconcileSiteDocumentNavigationForWrite(next, latest, {
      preserveMissingNavigation: false,
    });

    expect(reconciled.navigation.map((entry) => entry.id)).toEqual(['nav-home']);
  });

  it('does not resurrect latest-only navigation items whose page was deleted', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const latest = {
      ...site([home], '2026-01-02T00:00:01.000Z'),
      navigation: [
        navItem('nav-home', 'home', '/ko'),
        navItem('nav-deleted', 'deleted', '/ko/deleted'),
      ],
    };
    const staleWriter = {
      ...site([home], '2026-01-03T00:00:00.000Z'),
      navigation: [navItem('nav-home', 'home', '/ko')],
    };

    const reconciled = reconcileSiteDocumentNavigationForWrite(staleWriter, latest);

    expect(reconciled.navigation.map((entry) => entry.id)).toEqual(['nav-home']);
  });
});

describe('mergeUntouchedPageSeoForWrite', () => {
  it('preserves latest page SEO when a newer stale writer omits SEO metadata', () => {
    const latestHome = {
      ...page('home', '2026-01-02T00:00:00.000Z'),
      seo: {
        title: 'Latest SEO title',
        description: 'Search result description',
        canonical: 'https://example.com/ko',
      },
    };
    const nextHome = {
      ...page('home', '2026-01-03T00:00:00.000Z'),
      title: { ko: 'Edited title', 'zh-hant': 'Edited title', en: 'Edited title' },
    };
    const latest = site([latestHome], '2026-01-02T00:00:01.000Z');
    const staleNext = site([nextHome], '2026-01-03T00:00:01.000Z');

    const merged = mergeUntouchedPageSeoForWrite(staleNext, latest);

    expect(merged.pages[0]?.seo).toEqual(latestHome.seo);
    expect(merged.pages[0]?.title.ko).toBe('Edited title');
  });

  it('keeps incoming SEO when the writer explicitly supplies SEO metadata', () => {
    const latestHome = {
      ...page('home', '2026-01-02T00:00:00.000Z'),
      seo: { title: 'Latest SEO title' },
    };
    const nextHome = {
      ...page('home', '2026-01-03T00:00:00.000Z'),
      seo: { title: 'Incoming SEO title' },
    };
    const latest = site([latestHome], '2026-01-02T00:00:01.000Z');
    const next = site([nextHome], '2026-01-03T00:00:01.000Z');

    expect(mergeUntouchedPageSeoForWrite(next, latest).pages[0]?.seo)
      .toEqual(nextHome.seo);
  });

  it('keeps an explicit empty SEO field so SEO settings can be cleared', () => {
    const latestHome = {
      ...page('home', '2026-01-02T00:00:00.000Z'),
      seo: { title: 'Latest SEO title' },
    };
    const nextHome = {
      ...page('home', '2026-01-03T00:00:00.000Z'),
      seo: undefined,
    };
    const latest = site([latestHome], '2026-01-02T00:00:01.000Z');
    const next = site([nextHome], '2026-01-03T00:00:01.000Z');

    expect(Object.prototype.hasOwnProperty.call(nextHome, 'seo')).toBe(true);
    expect(mergeUntouchedPageSeoForWrite(next, latest).pages[0]?.seo)
      .toBeUndefined();
  });
});
