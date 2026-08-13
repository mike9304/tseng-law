import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import os from 'os';
import path from 'path';
import { chmod, mkdir, mkdtemp, readFile, readdir, realpath, rm, symlink, writeFile } from 'fs/promises';

const blobMock = vi.hoisted(() => {
  class BlobError extends Error {}
  class BlobNotFoundError extends BlobError {}
  class BlobPreconditionFailedError extends BlobError {}
  class BlobRequestAbortedError extends BlobError {}
  class BlobServiceNotAvailable extends BlobError {}
  class BlobServiceRateLimited extends BlobError {}
  class BlobStoreNotFoundError extends BlobError {}
  class BlobStoreSuspendedError extends BlobError {}

  return {
    get: vi.fn(),
    put: vi.fn(),
    del: vi.fn(),
    BlobError,
    BlobNotFoundError,
    BlobPreconditionFailedError,
    BlobRequestAbortedError,
    BlobServiceNotAvailable,
    BlobServiceRateLimited,
    BlobStoreNotFoundError,
    BlobStoreSuspendedError,
  };
});

vi.mock('@vercel/blob', () => ({
  get: blobMock.get,
  put: blobMock.put,
  del: blobMock.del,
  BlobError: blobMock.BlobError,
  BlobNotFoundError: blobMock.BlobNotFoundError,
  BlobPreconditionFailedError: blobMock.BlobPreconditionFailedError,
  BlobRequestAbortedError: blobMock.BlobRequestAbortedError,
  BlobServiceNotAvailable: blobMock.BlobServiceNotAvailable,
  BlobServiceRateLimited: blobMock.BlobServiceRateLimited,
  BlobStoreNotFoundError: blobMock.BlobStoreNotFoundError,
  BlobStoreSuspendedError: blobMock.BlobStoreSuspendedError,
}));
import {
  BuilderCanvasPersistenceError,
  PAGE_CANVAS_CAS_ACTIVATION_MARKER,
  PAGE_CANVAS_CAS_MARKER_ENV,
  PAGE_CANVAS_CAS_MODE_ENV,
  PAGE_CANVAS_CAS_ROOT_ENV,
  PageCanvasCasConflictError,
  PageCanvasCasMigrationRequiredError,
  createPage,
  deletePage,
  deletePageCanvasRecord,
  mergeLatestPagePublishMetaForWrite,
  mergeUntouchedPageSeoForWrite,
  publishPage as publishSeedPage,
  readFooterCanvas,
  readHeaderCanvas,
  readLightboxCanvas,
  readPageCanvas,
  readPageCanvasRecordState,
  readSiteDocument,
  reconcileSiteDocumentInstalledAppsForWrite,
  reconcileSiteDocumentNavigationForWrite,
  reconcileSiteDocumentPagesForWrite,
  reconcileSiteDocumentRedirectsForWrite,
  reconcileSiteDocumentUninstalledAppsForWrite,
  updatePageCanvasRecord,
  writePageCanvas,
  writePageCanvasRecord,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import {
  PAGE_CANVAS_CAS_VALUE_FORMAT,
  createPageCanvasVersionedStore,
  pageCanvasCasKey,
} from '@/lib/builder/site/page-canvas-versioned-store';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import type { BuilderInstalledApp, BuilderUninstalledAppArchive } from '@/lib/builder/apps/types';
import type { BuilderNavItem, BuilderPageMeta, BuilderSiteDocument, SiteRedirect } from '@/lib/builder/site/types';
import { SiteInvariantError } from '@/lib/builder/site/site-invariants';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { BuilderSiteIdentityError } from '@/lib/builder/site/identity';

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

function redirect(redirectId: string, from: string, to: string): SiteRedirect {
  return {
    redirectId,
    from,
    to,
    type: 301,
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function installedApp(status: 'enabled' | 'disabled', updatedAt: string): BuilderInstalledApp {
  return {
    appId: 'site-search',
    version: '1.0.0',
    status,
    installedAt: '2026-01-01T00:00:00.000Z',
    updatedAt,
    audit: [
      {
        eventId: `event-${status}`,
        type: status === 'enabled' ? 'enabled' : 'disabled',
        actor: 'admin',
        at: updatedAt,
      },
    ],
  };
}

function uninstalledApp(uninstalledAt: string, cleanupMode: 'keep-data' | 'remove-data' = 'keep-data'): BuilderUninstalledAppArchive {
  const snapshot = installedApp('enabled', uninstalledAt);
  return {
    appId: 'site-search',
    version: '1.0.0',
    cleanupMode,
    reversible: cleanupMode === 'keep-data',
    uninstalledAt,
    actor: 'admin',
    ...(cleanupMode === 'keep-data' ? { snapshot } : {}),
    audit: [
      {
        eventId: `uninstalled-${cleanupMode}`,
        type: 'uninstalled',
        actor: 'admin',
        at: uninstalledAt,
      },
    ],
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

  it('removes only explicitly deleted pages while preserving concurrent latest-only pages', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const deleted = page('deleted', '2026-01-01T00:00:00.000Z');
    const concurrent = page('concurrent', '2026-01-02T00:00:00.000Z');
    const latest = site([home, deleted, concurrent], '2026-01-02T00:00:01.000Z');
    const deleteWriter = site([home], '2026-01-03T00:00:00.000Z');

    expect(
      reconcileSiteDocumentPagesForWrite(deleteWriter, latest, { deletePageIds: ['deleted'] })
        .pages.map((entry) => entry.pageId),
    ).toEqual(['home', 'concurrent']);
  });

  it('does not keep an explicitly deleted next-only page via publish preservation', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const deleted = page('deleted', '2026-01-01T00:00:00.000Z');
    const latest = site([home], '2026-01-02T00:00:00.000Z');
    const next = site([home, deleted], '2026-01-03T00:00:00.000Z');

    expect(
      reconcileSiteDocumentPagesForWrite(next, latest, {
        deletePageIds: ['deleted'],
        preserveNextPageIds: ['deleted'],
      }).pages.map((entry) => entry.pageId),
    ).toEqual(['home']);
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

  it('keeps explicitly preserved next-only pages even when the latest snapshot is newer', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const publishing = page('publishing', '2026-01-01T00:00:01.000Z');
    const latest = site([home], '2026-01-02T00:00:00.000Z');
    const next = site([home, publishing], '2026-01-03T00:00:00.000Z');

    expect(
      reconcileSiteDocumentPagesForWrite(next, latest, { preserveNextPageIds: ['publishing'] })
        .pages.map((entry) => entry.pageId),
    ).toEqual(['home', 'publishing']);
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

describe('reconcileSiteDocumentRedirectsForWrite', () => {
  it('preserves latest-only redirect rules by default', () => {
    const latest = {
      ...site([page('home', '2026-01-01T00:00:00.000Z')], '2026-01-02T00:00:00.000Z'),
      redirects: [redirect('redir-existing', '/ko/old', '/ko/new')],
    };
    const staleWriter = site([page('home', '2026-01-01T00:00:00.000Z')], '2026-01-03T00:00:00.000Z');

    const reconciled = reconcileSiteDocumentRedirectsForWrite(staleWriter, latest);

    expect(reconciled.redirects?.map((entry) => entry.redirectId)).toEqual(['redir-existing']);
  });

  it('does not resurrect explicitly deleted redirect rules', () => {
    const latest = {
      ...site([page('home', '2026-01-01T00:00:00.000Z')], '2026-01-02T00:00:00.000Z'),
      redirects: [
        redirect('redir-delete', '/ko/delete', '/ko/contact'),
        redirect('redir-keep', '/ko/keep', '/ko/services'),
      ],
    };
    const deleteWriter = {
      ...site([page('home', '2026-01-01T00:00:00.000Z')], '2026-01-03T00:00:00.000Z'),
      redirects: [redirect('redir-keep', '/ko/keep', '/ko/services')],
    };

    const reconciled = reconcileSiteDocumentRedirectsForWrite(deleteWriter, latest, {
      deleteRedirectIds: ['redir-delete'],
    });

    expect(reconciled.redirects?.map((entry) => entry.redirectId)).toEqual(['redir-keep']);
  });

  it('prefers latest active redirect when a stale writer creates the same source path', () => {
    const latest = {
      ...site([page('home', '2026-01-01T00:00:00.000Z')], '2026-01-02T00:00:00.000Z'),
      redirects: [redirect('redir-latest', '/ko/old', '/ko/contact')],
    };
    const staleWriter = {
      ...site([page('home', '2026-01-01T00:00:00.000Z')], '2026-01-03T00:00:00.000Z'),
      redirects: [redirect('redir-stale', '/ko/old', '/ko/new')],
    };

    const reconciled = reconcileSiteDocumentRedirectsForWrite(staleWriter, latest);

    expect(reconciled.redirects).toEqual([
      expect.objectContaining({ redirectId: 'redir-latest', from: '/ko/old', to: '/ko/contact' }),
    ]);
  });
});

describe('reconcileSiteDocumentInstalledAppsForWrite', () => {
  it('preserves newer app status when a stale writer saves later', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const staleWriter = {
      ...site([home], '2026-01-03T00:00:00.000Z'),
      installedApps: [installedApp('enabled', '2026-01-01T00:00:00.000Z')],
    };
    const latest = {
      ...site([home], '2026-01-02T00:00:00.000Z'),
      installedApps: [installedApp('disabled', '2026-01-02T00:00:00.000Z')],
    };

    const reconciled = reconcileSiteDocumentInstalledAppsForWrite(staleWriter, latest);

    expect(reconciled.installedApps?.[0]).toMatchObject({
      appId: 'site-search',
      status: 'disabled',
      updatedAt: '2026-01-02T00:00:00.000Z',
    });
  });

  it('keeps incoming app status when it is newer than the latest snapshot', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const next = {
      ...site([home], '2026-01-03T00:00:00.000Z'),
      installedApps: [installedApp('disabled', '2026-01-03T00:00:00.000Z')],
    };
    const latest = {
      ...site([home], '2026-01-02T00:00:00.000Z'),
      installedApps: [installedApp('enabled', '2026-01-02T00:00:00.000Z')],
    };

    const reconciled = reconcileSiteDocumentInstalledAppsForWrite(next, latest);

    expect(reconciled.installedApps?.[0]).toMatchObject({
      appId: 'site-search',
      status: 'disabled',
      updatedAt: '2026-01-03T00:00:00.000Z',
    });
  });

  it('does not resurrect explicitly uninstalled apps', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const next = {
      ...site([home], '2026-01-03T00:00:00.000Z'),
      installedApps: [],
    };
    const latest = {
      ...site([home], '2026-01-02T00:00:00.000Z'),
      installedApps: [installedApp('enabled', '2026-01-02T00:00:00.000Z')],
    };

    const reconciled = reconcileSiteDocumentInstalledAppsForWrite(next, latest, {
      deleteInstalledAppIds: ['site-search'],
    });

    expect(reconciled.installedApps).toEqual([]);
  });
});

describe('reconcileSiteDocumentUninstalledAppsForWrite', () => {
  it('preserves latest uninstall archive when a stale writer saves later', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const staleWriter = {
      ...site([home], '2026-01-03T00:00:00.000Z'),
      uninstalledApps: [],
    };
    const latest = {
      ...site([home], '2026-01-02T00:00:00.000Z'),
      uninstalledApps: [uninstalledApp('2026-01-02T00:00:00.000Z')],
    };

    const reconciled = reconcileSiteDocumentUninstalledAppsForWrite(staleWriter, latest);

    expect(reconciled.uninstalledApps?.[0]).toMatchObject({
      appId: 'site-search',
      cleanupMode: 'keep-data',
      reversible: true,
      uninstalledAt: '2026-01-02T00:00:00.000Z',
    });
  });

  it('does not resurrect an archive after explicit restore cleanup', () => {
    const home = page('home', '2026-01-01T00:00:00.000Z');
    const next = {
      ...site([home], '2026-01-03T00:00:00.000Z'),
      uninstalledApps: [],
    };
    const latest = {
      ...site([home], '2026-01-02T00:00:00.000Z'),
      uninstalledApps: [uninstalledApp('2026-01-02T00:00:00.000Z')],
    };

    const reconciled = reconcileSiteDocumentUninstalledAppsForWrite(next, latest, {
      deleteUninstalledAppIds: ['site-search'],
    });

    expect(reconciled.uninstalledApps).toEqual([]);
  });
});

describe('mergeLatestPagePublishMetaForWrite', () => {
  it('preserves newer publish metadata when a stale writer has the same page without publish fields', () => {
    const latestPublished = {
      ...page('published', '2026-01-02T00:00:00.000Z'),
      publishedAt: '2026-01-02T00:00:00.000Z',
      publishedRevisionId: 'rev-latest',
      publishedRevision: 4,
      publishedSavedAt: '2026-01-02T00:00:00.000Z',
      lastPublishedDraftRevision: 7,
    };
    const stalePage = page('published', '2026-01-03T00:00:00.000Z');
    const latest = site([latestPublished], '2026-01-02T00:00:01.000Z');
    const staleWriter = site([stalePage], '2026-01-03T00:00:01.000Z');

    const merged = mergeLatestPagePublishMetaForWrite(staleWriter, latest);

    expect(merged.pages[0]).toMatchObject({
      pageId: 'published',
      publishedAt: latestPublished.publishedAt,
      publishedRevisionId: 'rev-latest',
      publishedRevision: 4,
      publishedSavedAt: latestPublished.publishedSavedAt,
      lastPublishedDraftRevision: 7,
    });
    expect(merged.pages[0]?.updatedAt).toBe(stalePage.updatedAt);
  });

  it('keeps incoming publish metadata when it is newer than the latest stored page', () => {
    const latestPublished = {
      ...page('published', '2026-01-02T00:00:00.000Z'),
      publishedAt: '2026-01-02T00:00:00.000Z',
      publishedRevisionId: 'rev-old',
      publishedRevision: 3,
      publishedSavedAt: '2026-01-02T00:00:00.000Z',
    };
    const incomingPublished = {
      ...page('published', '2026-01-03T00:00:00.000Z'),
      publishedAt: '2026-01-03T00:00:00.000Z',
      publishedRevisionId: 'rev-new',
      publishedRevision: 4,
      publishedSavedAt: '2026-01-03T00:00:00.000Z',
    };

    const merged = mergeLatestPagePublishMetaForWrite(
      site([incomingPublished], '2026-01-03T00:00:01.000Z'),
      site([latestPublished], '2026-01-02T00:00:01.000Z'),
    );

    expect(merged.pages[0]?.publishedRevisionId).toBe('rev-new');
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

describe('deletePageCanvasRecord', () => {
  const previousRoot = process.env.BUILDER_SITE_ROOT;
  const previousBackend = process.env.BUILDER_SITE_BACKEND;
  let tempRoot = '';

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-site-persistence-'));
    process.env.BUILDER_SITE_ROOT = tempRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
  });

  afterEach(async () => {
    if (previousRoot === undefined) delete process.env.BUILDER_SITE_ROOT;
    else process.env.BUILDER_SITE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previousBackend;
    await rm(tempRoot, { recursive: true, force: true });
  });

  it('removes a local page canvas variant', async () => {
    const document: BuilderCanvasDocument = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-21T00:00:00.000Z',
      updatedBy: 'rollback-test',
      stageWidth: 1280,
      stageHeight: 720,
      nodes: [],
    };

    await writePageCanvas('rollback-site', 'rollback-page', 'published', document);
    await expect(readPageCanvas('rollback-site', 'rollback-page', 'published'))
      .resolves.toMatchObject({ updatedBy: 'rollback-test' });

    await deletePageCanvasRecord('rollback-site', 'rollback-page', 'published');

    await expect(readPageCanvas('rollback-site', 'rollback-page', 'published'))
      .resolves.toBeNull();
  });
});

describe('local canvas read boundary', () => {
  const previousRoot = process.env.BUILDER_SITE_ROOT;
  const previousBackend = process.env.BUILDER_SITE_BACKEND;
  let tempRoot = '';

  const canvas: BuilderCanvasDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-13T01:00:00.000Z',
    updatedBy: 'local-read-boundary',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };

  const cases = [
    {
      name: 'page',
      relativePath: path.join('read-boundary-site', 'pages', 'page-1.draft.json'),
      read: () => readPageCanvas('read-boundary-site', 'page-1', 'draft'),
    },
    {
      name: 'lightbox',
      relativePath: path.join('read-boundary-site', 'lightboxes', 'lightbox-1.json'),
      read: () => readLightboxCanvas('read-boundary-site', 'lightbox-1'),
    },
    {
      name: 'header',
      relativePath: path.join('read-boundary-site', 'global', 'header.json'),
      read: () => readHeaderCanvas('read-boundary-site'),
    },
    {
      name: 'footer',
      relativePath: path.join('read-boundary-site', 'global', 'footer.json'),
      read: () => readFooterCanvas('read-boundary-site'),
    },
  ] as const;

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-canvas-read-boundary-'));
    process.env.BUILDER_SITE_ROOT = tempRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
  });

  afterEach(async () => {
    if (previousRoot === undefined) delete process.env.BUILDER_SITE_ROOT;
    else process.env.BUILDER_SITE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previousBackend;
    await rm(tempRoot, { recursive: true, force: true });
  });

  async function writeStored(relativePath: string, contents: string): Promise<string> {
    const filePath = path.join(tempRoot, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents, 'utf8');
    return filePath;
  }

  it.each(cases)('returns null only for a truly absent $name path', async ({ read }) => {
    await expect(read()).resolves.toBeNull();
  });

  it('keeps legacy raw page documents and valid record envelopes readable', async () => {
    const relativePath = path.join('read-boundary-site', 'pages', 'page-1.draft.json');
    await writeStored(relativePath, JSON.stringify(canvas));
    await expect(readPageCanvas('read-boundary-site', 'page-1', 'draft'))
      .resolves.toMatchObject({ updatedBy: 'local-read-boundary' });

    await writeStored(relativePath, JSON.stringify({
      revision: 7,
      savedAt: '2026-07-13T01:02:00.000Z',
      updatedBy: '',
      document: { ...canvas, updatedBy: 'envelope-document' },
    }));
    await expect(readPageCanvas('read-boundary-site', 'page-1', 'draft'))
      .resolves.toMatchObject({ updatedBy: 'envelope-document' });
  });

  it.each(cases)('propagates malformed $name JSON as sanitized invalid_data', async ({ relativePath, read }) => {
    await writeStored(relativePath, '{not-json');

    await expect(read()).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'invalid_data',
      backend: 'local',
      message: 'Stored builder canvas data is invalid',
      cause: expect.any(SyntaxError),
    });
  });

  it.each(cases)('propagates valid-JSON schema corruption for $name', async ({ relativePath, read }) => {
    await writeStored(relativePath, JSON.stringify({ version: 1, nodes: 'not-an-array' }));

    await expect(read()).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'invalid_data',
      backend: 'local',
    });
  });

  it.each(cases)('propagates $name EISDIR instead of treating it as absence', async ({ relativePath, read }) => {
    await mkdir(path.join(tempRoot, relativePath), { recursive: true });

    let thrown: unknown;
    try {
      await read();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(BuilderCanvasPersistenceError);
    expect(thrown).toMatchObject({ code: 'read_failed', backend: 'local' });
    expect((thrown as BuilderCanvasPersistenceError).cause).toMatchObject({ code: 'EISDIR' });
    expect((thrown as Error).message).not.toContain(tempRoot);
  });

  it.each(cases)('propagates $name ENOTDIR instead of treating it as absence', async ({ relativePath, read }) => {
    const filePath = path.join(tempRoot, relativePath);
    const blockingParent = path.dirname(filePath);
    await mkdir(path.dirname(blockingParent), { recursive: true });
    await writeFile(blockingParent, 'not-a-directory', 'utf8');

    let thrown: unknown;
    try {
      await read();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(BuilderCanvasPersistenceError);
    expect(thrown).toMatchObject({ code: 'read_failed', backend: 'local' });
    expect((thrown as BuilderCanvasPersistenceError).cause).toMatchObject({ code: 'ENOTDIR' });
    expect((thrown as Error).message).not.toContain(tempRoot);
  });

  it.each(cases)('propagates $name EACCES without exposing the local path', async ({ relativePath, read }) => {
    const filePath = await writeStored(relativePath, JSON.stringify(canvas));
    await chmod(filePath, 0o000);
    try {
      let thrown: unknown;
      try {
        await read();
      } catch (error) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(BuilderCanvasPersistenceError);
      expect(thrown).toMatchObject({ code: 'read_failed', backend: 'local' });
      expect((thrown as BuilderCanvasPersistenceError).cause).toMatchObject({ code: 'EACCES' });
      expect((thrown as Error).message).not.toContain(tempRoot);
      expect(Object.keys(thrown as object)).not.toContain('cause');
    } finally {
      await chmod(filePath, 0o600);
    }
  });

  it.each(cases)('does not classify a dangling $name symlink as absence', async ({ relativePath, read }) => {
    const filePath = path.join(tempRoot, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await symlink('missing-canvas-target.json', filePath);

    await expect(read()).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'read_failed',
      backend: 'local',
      cause: expect.objectContaining({ code: 'ENOENT' }),
    });
  });

  it.each(cases)('does not classify a dangling ancestor symlink as absent $name storage', async ({ read }) => {
    await symlink('missing-site-target', path.join(tempRoot, 'read-boundary-site'));

    await expect(read()).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'read_failed',
      backend: 'local',
      cause: expect.objectContaining({ code: 'ENOENT' }),
    });
  });

  it('keeps the latest page bytes unchanged when a mutation cannot parse them', async () => {
    const relativePath = path.join('read-boundary-site', 'pages', 'page-1.draft.json');
    const malformedBytes = '{"revision":4,"savedAt":"2026-07-13T01:00:00.000Z","document":';
    const filePath = await writeStored(relativePath, malformedBytes);

    await expect(writePageCanvas('read-boundary-site', 'page-1', 'draft', {
      ...canvas,
      updatedBy: 'must-not-overwrite',
    })).rejects.toMatchObject({ code: 'invalid_data', backend: 'local' });
    await expect(readFile(filePath, 'utf8')).resolves.toBe(malformedBytes);
  });

  it('does not invoke an updater or change bytes after a failed latest read', async () => {
    const relativePath = path.join('read-boundary-site', 'pages', 'page-1.draft.json');
    const malformedBytes = '{"revision":4,"savedAt":"2026-07-13T01:00:00.000Z","document":';
    const filePath = await writeStored(relativePath, malformedBytes);
    const updater = vi.fn(() => ({
      revision: 5,
      savedAt: '2026-07-13T01:01:00.000Z',
      document: canvas,
    }));

    await expect(updatePageCanvasRecord(
      'read-boundary-site',
      'page-1',
      'draft',
      updater,
    )).rejects.toMatchObject({ code: 'invalid_data', backend: 'local' });
    expect(updater).not.toHaveBeenCalled();
    await expect(readFile(filePath, 'utf8')).resolves.toBe(malformedBytes);
  });

  it('refuses a schema-invalid direct record write and preserves valid bytes', async () => {
    await writePageCanvas('read-boundary-site', 'page-1', 'draft', canvas);
    const filePath = path.join(
      tempRoot,
      'read-boundary-site',
      'pages',
      'page-1.draft.json',
    );
    const validBytes = await readFile(filePath, 'utf8');
    const invalidRecord = {
      revision: 5,
      savedAt: '2026-07-13T01:01:00.000Z',
      document: { ...canvas, nodes: 'not-an-array' },
    } as unknown as Parameters<typeof writePageCanvasRecord>[2];

    await expect(writePageCanvasRecord(
      'read-boundary-site',
      'page-1',
      invalidRecord,
      'draft',
    )).rejects.toMatchObject({ code: 'invalid_data', backend: 'local' });
    await expect(readFile(filePath, 'utf8')).resolves.toBe(validBytes);
  });

  it.each([
    [-1, '2026-07-13T01:00:00.000Z'],
    [1.5, '2026-07-13T01:00:00.000Z'],
    [4, 'not-a-timestamp'],
  ])('rejects a malformed page record envelope (revision=%s, savedAt=%s)', async (revision, savedAt) => {
    const relativePath = path.join('read-boundary-site', 'pages', 'page-1.draft.json');
    await writeStored(relativePath, JSON.stringify({ revision, savedAt, document: canvas }));

    await expect(readPageCanvas('read-boundary-site', 'page-1', 'draft')).rejects.toMatchObject({
      code: 'invalid_data',
      backend: 'local',
    });
  });
});

describe('page canvas CAS activation and cutover boundary', () => {
  const previousRoot = process.env.BUILDER_SITE_ROOT;
  const previousBackend = process.env.BUILDER_SITE_BACKEND;
  let tempRoot = '';
  let casRoot = '';

  const canvas: BuilderCanvasDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-13T03:00:00.000Z',
    updatedBy: 'cas-boundary',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };

  function record(revision: number, marker: string) {
    return {
      revision,
      savedAt: `2026-07-13T03:${String(revision).padStart(2, '0')}:00.000Z`,
      updatedBy: marker,
      document: { ...canvas, updatedBy: marker },
    };
  }

  async function writeLegacyPage(contents: string): Promise<string> {
    const filePath = path.join(tempRoot, 'cas-site', 'pages', 'page-1.draft.json');
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents, 'utf8');
    return filePath;
  }

  function activate(mode: 'expand' | 'cutover') {
    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, mode);
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, PAGE_CANVAS_CAS_ACTIVATION_MARKER);
    vi.stubEnv(PAGE_CANVAS_CAS_ROOT_ENV, casRoot);
  }

  beforeEach(async () => {
    tempRoot = await realpath(await mkdtemp(path.join(os.tmpdir(), 'builder-page-cas-boundary-')));
    casRoot = path.join(tempRoot, 'cas-root');
    await mkdir(casRoot, { mode: 0o700 });
    process.env.BUILDER_SITE_ROOT = tempRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
    blobMock.get.mockReset();
    blobMock.put.mockReset();
    blobMock.del.mockReset();
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    if (previousRoot === undefined) delete process.env.BUILDER_SITE_ROOT;
    else process.env.BUILDER_SITE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previousBackend;
    await rm(tempRoot, { recursive: true, force: true });
  });

  it('requires the exact activation handshake and leaves legacy bytes unchanged', async () => {
    const legacyPath = await writeLegacyPage(JSON.stringify(record(7, 'legacy')));
    const original = await readFile(legacyPath, 'utf8');

    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, 'cutover');
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, 'wrong-marker');
    vi.stubEnv(PAGE_CANVAS_CAS_ROOT_ENV, casRoot);

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).rejects.toMatchObject({
      code: 'invalid_data',
      backend: 'local',
    });
    await expect(writePageCanvas('cas-site', 'page-1', 'draft', canvas))
      .rejects.toMatchObject({ code: 'invalid_data' });
    await expect(readFile(legacyPath, 'utf8')).resolves.toBe(original);
    await expect(readdir(casRoot)).resolves.toEqual([]);
  });

  it.each([
    ['mode only', 'cutover', ''],
    ['marker only', '', PAGE_CANVAS_CAS_ACTIVATION_MARKER],
    ['padded mode', ' cutover', PAGE_CANVAS_CAS_ACTIVATION_MARKER],
    ['padded marker', 'cutover', ` ${PAGE_CANVAS_CAS_ACTIVATION_MARKER}`],
    ['legacy with marker', 'legacy', PAGE_CANVAS_CAS_ACTIVATION_MARKER],
  ])('rejects a non-exact activation handshake: %s', async (_name, mode, marker) => {
    await writeLegacyPage(JSON.stringify(record(7, 'legacy')));
    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, mode);
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, marker);
    vi.stubEnv(PAGE_CANVAS_CAS_ROOT_ENV, casRoot);

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).rejects.toMatchObject({
      code: 'invalid_data',
      backend: 'local',
    });
    await expect(readdir(casRoot)).resolves.toEqual([]);
  });

  it('keeps expand reads compatible but freezes writes until offline migration', async () => {
    const legacyPath = await writeLegacyPage(JSON.stringify(record(7, 'legacy-expand')));
    const original = await readFile(legacyPath, 'utf8');
    activate('expand');

    await expect(readPageCanvas('cas-site', 'page-1', 'draft'))
      .resolves.toMatchObject({ updatedBy: 'legacy-expand' });
    await expect(writePageCanvas('cas-site', 'page-1', 'draft', {
      ...canvas,
      updatedBy: 'must-not-auto-migrate',
    })).rejects.toBeInstanceOf(PageCanvasCasMigrationRequiredError);
    await expect(readFile(legacyPath, 'utf8')).resolves.toBe(original);
    await expect(readdir(casRoot)).resolves.toEqual([]);
  });

  it('never falls back to legacy bytes after cutover when CAS is missing', async () => {
    await writeLegacyPage(JSON.stringify(record(7, 'stale-legacy')));
    activate('cutover');

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).resolves.toBeNull();
    await expect(writePageCanvas('cas-site', 'page-1', 'draft', {
      ...canvas,
      updatedBy: 'must-not-bypass-incomplete-backfill',
    })).rejects.toBeInstanceOf(PageCanvasCasMigrationRequiredError);
  });

  it('distinguishes an unprepared CAS root from a truly missing record', async () => {
    await writeLegacyPage(JSON.stringify(record(7, 'stale-legacy')));
    activate('cutover');
    await rm(casRoot, { recursive: true, force: true });

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'read_failed',
      backend: 'local',
    });
  });

  it('fails closed on a corrupt CAS value instead of reading a valid legacy record', async () => {
    await writeLegacyPage(JSON.stringify(record(7, 'legacy-must-not-win')));
    activate('expand');
    const coordinate = { siteId: 'cas-site', pageId: 'page-1', variant: 'draft' as const };
    const key = pageCanvasCasKey(coordinate);
    const hash = createHash('sha256').update(key, 'utf8').digest('hex');
    await writeFile(path.join(casRoot, `cas-${hash}.json`), JSON.stringify({
      format: 'file-cas-v1',
      key,
      generation: '0'.repeat(32),
      value: {
        format: 'stale-page-canvas-format',
        siteId: coordinate.siteId,
        pageId: coordinate.pageId,
        variant: coordinate.variant,
        record: record(7, 'invalid-cas'),
      },
    }), 'utf8');

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'invalid_data',
      backend: 'local',
    });
  });

  it('fails expand verification when valid CAS and legacy records diverge', async () => {
    await writeLegacyPage(JSON.stringify(record(7, 'legacy-version')));
    const coordinate = { siteId: 'cas-site', pageId: 'page-1', variant: 'draft' as const };
    const store = createPageCanvasVersionedStore({
      backend: 'local',
      localRoot: casRoot,
      productionMutationPolicy: 'allow',
    });
    await store.create(coordinate, record(7, 'cas-version'));
    activate('expand');

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'invalid_data',
      backend: 'local',
    });
  });

  it('fails expand verification when a CAS record has no legacy source', async () => {
    const coordinate = { siteId: 'cas-site', pageId: 'page-1', variant: 'draft' as const };
    const store = createPageCanvasVersionedStore({
      backend: 'local',
      localRoot: casRoot,
      productionMutationPolicy: 'allow',
    });
    await store.create(coordinate, record(7, 'cas-only'));
    activate('expand');

    await expect(readPageCanvas('cas-site', 'page-1', 'draft')).rejects.toMatchObject({
      name: 'BuilderCanvasPersistenceError',
      code: 'invalid_data',
      backend: 'local',
    });
  });

  it('rejects a direct CAS record that attempts to inject an opaque storage version', async () => {
    activate('cutover');
    const injected = {
      ...record(7, 'injected-input'),
      storageVersion: 'file-v1:must-never-persist',
    } as unknown as Parameters<typeof writePageCanvasRecord>[2];

    await expect(writePageCanvasRecord('cas-site', 'page-1', injected, 'draft'))
      .rejects.toMatchObject({ code: 'invalid_data' });
    await expect(readdir(casRoot)).resolves.toEqual([]);
  });

  it('rejects a stored CAS record containing an injected opaque storage version', async () => {
    activate('cutover');
    const coordinate = { siteId: 'cas-site', pageId: 'page-1', variant: 'draft' as const };
    const key = pageCanvasCasKey(coordinate);
    const hash = createHash('sha256').update(key, 'utf8').digest('hex');
    await writeFile(path.join(casRoot, `cas-${hash}.json`), JSON.stringify({
      format: 'file-cas-v1',
      key,
      generation: '4'.repeat(32),
      value: {
        format: PAGE_CANVAS_CAS_VALUE_FORMAT,
        siteId: coordinate.siteId,
        pageId: coordinate.pageId,
        variant: coordinate.variant,
        record: {
          ...record(7, 'injected-stored'),
          storageVersion: 'file-v1:must-never-read',
        },
      },
    }), 'utf8');

    await expect(readPageCanvasRecordState('cas-site', 'page-1', 'draft'))
      .rejects.toMatchObject({ code: 'invalid_data', backend: 'local' });
  });

  it('keeps opaque storage versions out of the numeric page record contract', async () => {
    activate('cutover');
    const coordinate = { siteId: 'cas-site', pageId: 'page-1', variant: 'draft' as const };
    const store = createPageCanvasVersionedStore({
      backend: 'local',
      localRoot: casRoot,
      productionMutationPolicy: 'allow',
    });
    await store.create(coordinate, record(7, 'seed-v7'));

    const state = await readPageCanvasRecordState('cas-site', 'page-1', 'draft');
    expect(state).toEqual({
      record: expect.objectContaining({ revision: 7, updatedBy: 'seed-v7' }),
      isEnvelope: true,
    });
    expect(state).not.toHaveProperty('storageVersion');
    expect(state?.record).not.toHaveProperty('storageVersion');

    const updater = vi.fn((current: typeof state) => {
      if (!current) throw new Error('expected seeded CAS record');
      return record(current.record.revision + 1, 'winner-v8');
    });
    const committed = await updatePageCanvasRecord(
      'cas-site',
      'page-1',
      'draft',
      updater,
    );
    expect(updater).toHaveBeenCalledTimes(1);
    expect(committed).toMatchObject({ revision: 8, updatedBy: 'winner-v8' });
    expect(committed).not.toHaveProperty('storageVersion');
  });

  it('uses Blob ETag ifMatch once and captures only after a successful commit', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'blob');
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, 'cutover');
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, PAGE_CANVAS_CAS_ACTIVATION_MARKER);
    const key = pageCanvasCasKey({ siteId: 'cas-site', pageId: 'page-1', variant: 'draft' });
    blobMock.get.mockResolvedValue({
      statusCode: 200,
      stream: new Response(JSON.stringify({
        format: 'blob-cas-v1',
        key,
        generation: '1'.repeat(32),
        value: {
          format: PAGE_CANVAS_CAS_VALUE_FORMAT,
          siteId: 'cas-site',
          pageId: 'page-1',
          variant: 'draft',
          record: record(7, 'blob-v7'),
        },
      })).body,
      blob: { etag: 'etag-v7' },
    });
    blobMock.put.mockResolvedValue({ etag: 'etag-v8' });
    const updater = vi.fn(() => record(8, 'blob-winner'));
    const capture = vi.fn();

    const committed = await updatePageCanvasRecord(
      'cas-site',
      'page-1',
      'draft',
      updater,
    );
    capture(committed);

    expect(updater).toHaveBeenCalledTimes(1);
    expect(capture).toHaveBeenCalledTimes(1);
    expect(blobMock.put).toHaveBeenCalledTimes(1);
    expect(blobMock.put).toHaveBeenCalledWith(
      'builder-site-cas/page-canvas-v1/cas-site/pages/page-1.draft.json',
      expect.any(String),
      expect.objectContaining({
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        ifMatch: 'etag-v7',
        token: 'test-token',
      }),
    );
    expect(committed).toMatchObject({ revision: 8, updatedBy: 'blob-winner' });
  });

  it('rejects an injected Blob domain storageVersion without writing', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'blob');
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, 'cutover');
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, PAGE_CANVAS_CAS_ACTIVATION_MARKER);
    const key = pageCanvasCasKey({ siteId: 'cas-site', pageId: 'page-1', variant: 'draft' });
    blobMock.get.mockResolvedValue({
      statusCode: 200,
      stream: new Response(JSON.stringify({
        format: 'blob-cas-v1',
        key,
        generation: '5'.repeat(32),
        value: {
          format: PAGE_CANVAS_CAS_VALUE_FORMAT,
          siteId: 'cas-site',
          pageId: 'page-1',
          variant: 'draft',
          record: {
            ...record(7, 'blob-injected'),
            storageVersion: 'etag-must-never-read',
          },
        },
      })).body,
      blob: { etag: 'etag-v7' },
    });

    await expect(readPageCanvasRecordState('cas-site', 'page-1', 'draft'))
      .rejects.toMatchObject({ code: 'invalid_data', backend: 'blob' });
    expect(blobMock.put).not.toHaveBeenCalled();
  });

  it('re-reads a Blob CAS loser once and never runs a post-commit capture', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token');
    vi.stubEnv('BUILDER_USE_BLOB_IN_DEV', '1');
    vi.stubEnv('BUILDER_SITE_BACKEND', 'blob');
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv(PAGE_CANVAS_CAS_MODE_ENV, 'cutover');
    vi.stubEnv(PAGE_CANVAS_CAS_MARKER_ENV, PAGE_CANVAS_CAS_ACTIVATION_MARKER);
    const key = pageCanvasCasKey({ siteId: 'cas-site', pageId: 'page-1', variant: 'draft' });
    const blobEnvelope = (etag: string, value: ReturnType<typeof record>) => ({
      statusCode: 200,
      stream: new Response(JSON.stringify({
        format: 'blob-cas-v1',
        key,
        generation: etag === 'etag-v7' ? '2'.repeat(32) : '3'.repeat(32),
        value: {
          format: PAGE_CANVAS_CAS_VALUE_FORMAT,
          siteId: 'cas-site',
          pageId: 'page-1',
          variant: 'draft',
          record: value,
        },
      })).body,
      blob: { etag },
    });
    blobMock.get
      .mockResolvedValueOnce(blobEnvelope('etag-v7', record(7, 'blob-v7')))
      .mockResolvedValueOnce(blobEnvelope('etag-v8', record(8, 'other-winner')));
    blobMock.put.mockRejectedValue(new blobMock.BlobPreconditionFailedError());
    const updater = vi.fn(() => record(8, 'loser-attempt'));
    const capture = vi.fn();

    let thrown: unknown;
    try {
      const committed = await updatePageCanvasRecord(
        'cas-site',
        'page-1',
        'draft',
        updater,
      );
      capture(committed);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(PageCanvasCasConflictError);
    expect(thrown).toMatchObject({
      code: 'conflict',
      current: expect.objectContaining({ revision: 8 }),
    });
    expect((thrown as PageCanvasCasConflictError).current).not.toHaveProperty('document');
    expect((thrown as PageCanvasCasConflictError).current).not.toHaveProperty('updatedBy');
    expect(updater).toHaveBeenCalledTimes(1);
    expect(blobMock.get).toHaveBeenCalledTimes(2);
    expect(blobMock.put).toHaveBeenCalledTimes(1);
    expect(capture).not.toHaveBeenCalled();
  });
});

describe('writeSiteDocument invariant boundary', () => {
  const previousRoot = process.env.BUILDER_SITE_ROOT;
  const previousBackend = process.env.BUILDER_SITE_BACKEND;
  let tempRoot = '';

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-site-invariants-'));
    process.env.BUILDER_SITE_ROOT = tempRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
  });

  afterEach(async () => {
    if (previousRoot === undefined) delete process.env.BUILDER_SITE_ROOT;
    else process.env.BUILDER_SITE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previousBackend;
    await rm(tempRoot, { recursive: true, force: true });
  });

  function persistedSite(siteId: string): BuilderSiteDocument {
    const home = {
      ...page('home-ko', '2026-01-01T00:00:00.000Z'),
      slug: '',
      isHomePage: true,
    };
    return {
      ...site([home], '2026-01-01T00:00:00.000Z'),
      siteId,
    };
  }

  it('rejects a stale merge that creates a duplicate route without changing valid bytes', async () => {
    const siteId = 'invariant-concurrency';
    const initial = persistedSite(siteId);
    await writeSiteDocument(initial);

    const firstWriter = structuredClone(initial);
    firstWriter.pages.push(pageWithTimestamps(
      'first-contact',
      '2026-07-13T00:00:01.000Z',
      '2026-07-13T00:00:01.000Z',
    ));
    firstWriter.pages[1]!.slug = 'contact';
    firstWriter.updatedAt = '2026-07-13T00:00:01.000Z';
    await writeSiteDocument(firstWriter);

    const canonicalPath = path.join(tempRoot, siteId, 'site.json');
    const validBytes = await readFile(canonicalPath, 'utf8');
    const staleWriter = structuredClone(initial);
    staleWriter.pages.push(pageWithTimestamps(
      'second-contact',
      '2026-07-13T00:00:02.000Z',
      '2026-07-13T00:00:02.000Z',
    ));
    staleWriter.pages[1]!.slug = 'contact';
    staleWriter.updatedAt = '2026-07-13T00:00:02.000Z';

    await expect(writeSiteDocument(staleWriter)).rejects.toMatchObject({
      name: 'SiteInvariantError',
      issues: expect.arrayContaining([expect.objectContaining({
        code: 'ROUTE_DUPLICATE',
        pageId: 'first-contact',
        conflictingPageId: 'second-contact',
        locale: 'ko',
      })]),
    });
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(validBytes);
  });

  it('rejects direct deletion of an authored home without changing valid bytes', async () => {
    const siteId = 'invariant-delete-home';
    await writeSiteDocument(persistedSite(siteId));
    const canonicalPath = path.join(tempRoot, siteId, 'site.json');
    const validBytes = await readFile(canonicalPath, 'utf8');

    await expect(deletePage(siteId, 'home-ko', 'ko')).rejects.toBeInstanceOf(SiteInvariantError);
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(validBytes);
  });

  it('rejects a direct duplicate page create without changing valid bytes', async () => {
    const siteId = 'invariant-duplicate-create';
    await writeSiteDocument(persistedSite(siteId));
    await createPage(siteId, 'ko', 'contact', 'Contact');
    const canonicalPath = path.join(tempRoot, siteId, 'site.json');
    const validBytes = await readFile(canonicalPath, 'utf8');

    await expect(createPage(siteId, 'ko', 'contact', 'Another contact')).rejects.toMatchObject({
      name: 'SiteInvariantError',
      issues: expect.arrayContaining([expect.objectContaining({
        code: 'ROUTE_DUPLICATE',
        locale: 'ko',
        slug: 'contact',
      })]),
    });
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(validBytes);
  });

  it('rejects unsafe and duplicate page ids at the final write boundary', async () => {
    const siteId = 'invariant-page-ids';
    const initial = persistedSite(siteId);
    await writeSiteDocument(initial);
    const canonicalPath = path.join(tempRoot, siteId, 'site.json');
    const validBytes = await readFile(canonicalPath, 'utf8');

    const unsafe = structuredClone(initial);
    unsafe.pages.push({
      ...pageWithTimestamps('../escape', '2026-07-13T00:00:01.000Z', '2026-07-13T00:00:01.000Z'),
      slug: 'escape',
    });
    unsafe.updatedAt = '2026-07-13T00:00:01.000Z';
    await expect(writeSiteDocument(unsafe)).rejects.toMatchObject({
      issues: expect.arrayContaining([expect.objectContaining({ code: 'PAGE_ID_UNSAFE' })]),
    });

    const duplicate = structuredClone(initial);
    duplicate.pages.push(
      { ...pageWithTimestamps('same-id', '2026-07-13T00:00:01.000Z', '2026-07-13T00:00:01.000Z'), slug: 'one' },
      { ...pageWithTimestamps('same-id', '2026-07-13T00:00:02.000Z', '2026-07-13T00:00:02.000Z'), slug: 'two' },
    );
    duplicate.updatedAt = '2026-07-13T00:00:02.000Z';
    await expect(writeSiteDocument(duplicate)).rejects.toMatchObject({
      issues: expect.arrayContaining([expect.objectContaining({ code: 'PAGE_ID_DUPLICATE' })]),
    });
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(validBytes);
  });

  it('returns a fresh default only when the local site file is truly absent', async () => {
    await expect(readSiteDocument('absent-local-site', 'ko')).resolves.toMatchObject({
      siteId: 'absent-local-site',
      pages: [expect.objectContaining({ locale: 'ko', isHomePage: true, slug: '' })],
    });
  });

  it('serves many concurrent public site reads from one complete snapshot', async () => {
    const siteId = 'concurrent-public-site-reads';
    const document = persistedSite(siteId);
    document.name = 'Concurrent public read sentinel';
    const dir = path.join(tempRoot, siteId);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'site.json'), JSON.stringify(document), 'utf8');

    const snapshots = await Promise.all(
      Array.from({ length: 128 }, () => readSiteDocument(siteId, 'ko')),
    );

    expect(snapshots).toHaveLength(128);
    for (const snapshot of snapshots) {
      expect(snapshot).toMatchObject({
        siteId,
        name: 'Concurrent public read sentinel',
      });
      expect(snapshot.pages.map((page) => page.pageId))
        .toEqual(document.pages.map((page) => page.pageId));
    }
    await expect(readdir(dir)).resolves.toEqual(['site.json']);
  });

  it('propagates malformed JSON and local I/O errors instead of treating them as absence', async () => {
    const malformedDir = path.join(tempRoot, 'malformed-local');
    await mkdir(malformedDir, { recursive: true });
    await writeFile(path.join(malformedDir, 'site.json'), '{not-json', 'utf8');
    await expect(readSiteDocument('malformed-local', 'ko')).rejects.toBeInstanceOf(SyntaxError);

    await mkdir(path.join(tempRoot, 'io-error-local', 'site.json'), { recursive: true });
    await expect(readSiteDocument('io-error-local', 'ko')).rejects.toMatchObject({ code: 'EISDIR' });
  });

  it('does not overwrite malformed latest bytes after a read failure', async () => {
    const siteId = 'malformed-write-boundary';
    const dir = path.join(tempRoot, siteId);
    const canonicalPath = path.join(dir, 'site.json');
    await mkdir(dir, { recursive: true });
    const malformedBytes = '{"pages":';
    await writeFile(canonicalPath, malformedBytes, 'utf8');

    await expect(writeSiteDocument(persistedSite(siteId))).rejects.toBeInstanceOf(SyntaxError);
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(malformedBytes);
  });

  it('rejects corrupted latest duplicate ids before reconcile and preserves its bytes', async () => {
    const siteId = 'corrupt-latest-duplicate-ids';
    const corrupted = persistedSite(siteId);
    corrupted.pages.push(
      { ...page('duplicate-id', '2026-01-01T00:00:01.000Z'), slug: 'one' },
      { ...page('duplicate-id', '2026-01-01T00:00:02.000Z'), slug: 'two' },
    );
    const dir = path.join(tempRoot, siteId);
    const canonicalPath = path.join(dir, 'site.json');
    await mkdir(dir, { recursive: true });
    const corruptedBytes = JSON.stringify(corrupted);
    await writeFile(canonicalPath, corruptedBytes, 'utf8');

    await expect(writeSiteDocument(persistedSite(siteId))).rejects.toMatchObject({
      name: 'SiteInvariantError',
      issues: expect.arrayContaining([expect.objectContaining({ code: 'PAGE_ID_DUPLICATE' })]),
    });
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(corruptedBytes);
  });

  it.each([
    ['db-probe-r04', 'Database probe'],
    ['visual-template-r04', 'Visual template'],
    ['g-editor-qa-r04', 'G Editor UI QA fixture'],
  ])('rejects canonical production internal page %s before write and preserves bytes', async (slug, title) => {
    const initial = persistedSite(DEFAULT_BUILDER_SITE_ID);
    await writeSiteDocument(initial);
    const canonicalPath = path.join(tempRoot, DEFAULT_BUILDER_SITE_ID, 'site.json');
    const validBytes = await readFile(canonicalPath, 'utf8');
    const next = structuredClone(initial);
    const internal = pageWithTimestamps(
      `page-${slug}`,
      '2026-07-13T00:00:01.000Z',
      '2026-07-13T00:00:01.000Z',
    );
    internal.slug = slug;
    internal.title = { ko: title, 'zh-hant': title, en: title };
    next.pages.push(internal);
    next.updatedAt = '2026-07-13T00:00:01.000Z';
    vi.stubEnv('NODE_ENV', 'production');
    try {
      await expect(writeSiteDocument(next)).rejects.toMatchObject({
        name: 'SiteInvariantError',
        issues: expect.arrayContaining([expect.objectContaining({
          code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
          pageId: `page-${slug}`,
          slug,
        })]),
      });
    } finally {
      vi.unstubAllEnvs();
    }
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(validBytes);
  });

  it('allows internal fixtures in an isolated custom site even in production', async () => {
    const siteId = 'isolated-r04-fixtures';
    const isolated = persistedSite(siteId);
    isolated.pages.push({
      ...page('page-db-probe-r04', '2026-07-13T00:00:01.000Z'),
      slug: 'db-probe-r04',
    });
    isolated.updatedAt = '2026-07-13T00:00:01.000Z';
    vi.stubEnv('NODE_ENV', 'production');
    try {
      await expect(writeSiteDocument(isolated)).resolves.toBeUndefined();
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('rejects a canonical production localized internal alias and preserves bytes', async () => {
    const initial = persistedSite(DEFAULT_BUILDER_SITE_ID);
    await writeSiteDocument(initial);
    const canonicalPath = path.join(tempRoot, DEFAULT_BUILDER_SITE_ID, 'site.json');
    const validBytes = await readFile(canonicalPath, 'utf8');
    const next = structuredClone(initial);
    next.pages.push({
      ...page('localized-probe', '2026-07-13T00:00:01.000Z'),
      slug: 'legitimate-page',
      slugByLocale: { en: 'db-probe-r04' },
    });
    next.updatedAt = '2026-07-13T00:00:01.000Z';
    vi.stubEnv('NODE_ENV', 'production');
    try {
      await expect(writeSiteDocument(next)).rejects.toMatchObject({
        name: 'SiteInvariantError',
        issues: expect.arrayContaining([expect.objectContaining({
          code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
          pageId: 'localized-probe',
          locale: 'en',
          slug: 'db-probe-r04',
        })]),
      });
    } finally {
      vi.unstubAllEnvs();
    }
    await expect(readFile(canonicalPath, 'utf8')).resolves.toBe(validBytes);
  });
});

describe('Blob site document read boundary', () => {
  const previous = {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    useBlobInDev: process.env.BUILDER_USE_BLOB_IN_DEV,
    backend: process.env.BUILDER_SITE_BACKEND,
    consultationBackend: process.env.CONSULTATION_LOG_BACKEND,
    vercelEnv: process.env.VERCEL_ENV,
  };

  beforeEach(() => {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';
    process.env.BUILDER_USE_BLOB_IN_DEV = '1';
    delete process.env.BUILDER_SITE_BACKEND;
    delete process.env.CONSULTATION_LOG_BACKEND;
    delete process.env.VERCEL_ENV;
    blobMock.get.mockReset();
    blobMock.put.mockReset();
    blobMock.del.mockReset();
    blobMock.put.mockResolvedValue({ url: 'https://blob.example/site.json' });
  });

  afterEach(() => {
    if (previous.token === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previous.token;
    if (previous.useBlobInDev === undefined) delete process.env.BUILDER_USE_BLOB_IN_DEV;
    else process.env.BUILDER_USE_BLOB_IN_DEV = previous.useBlobInDev;
    if (previous.backend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previous.backend;
    if (previous.consultationBackend === undefined) delete process.env.CONSULTATION_LOG_BACKEND;
    else process.env.CONSULTATION_LOG_BACKEND = previous.consultationBackend;
    if (previous.vercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous.vercelEnv;
  });

  it.each([
    ['null response', null],
    ['404 response', { statusCode: 404, stream: null }],
  ])('treats only Blob absence as a missing site: %s', async (_label, result) => {
    blobMock.get.mockResolvedValue(result);

    await expect(readSiteDocument('absent-blob-site', 'ko')).resolves.toMatchObject({
      siteId: 'absent-blob-site',
      pages: [expect.objectContaining({ isHomePage: true })],
    });
  });

  it('propagates Blob provider failures', async () => {
    const providerError = new Error('blob provider unavailable');
    blobMock.get.mockRejectedValue(providerError);

    await expect(readSiteDocument('provider-error-site', 'ko')).rejects.toBe(providerError);
  });

  it('propagates invalid Blob JSON', async () => {
    blobMock.get.mockResolvedValue({
      statusCode: 200,
      stream: new Response('{bad-json').body,
    });

    await expect(readSiteDocument('invalid-blob-json', 'ko')).rejects.toBeInstanceOf(SyntaxError);
  });

  it('does not put stale data when the latest Blob read fails', async () => {
    blobMock.get.mockRejectedValue(new Error('blob read failed'));

    await expect(writeSiteDocument({
      ...site([{
        ...page('home-ko', '2026-01-01T00:00:00.000Z'),
        slug: '',
        isHomePage: true,
      }], '2026-01-01T00:00:00.000Z'),
      siteId: 'stale-blob-write',
    })).rejects.toThrow('blob read failed');
    expect(blobMock.put).not.toHaveBeenCalled();
  });
});

describe('Blob canvas read boundary', () => {
  const previous = {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    useBlobInDev: process.env.BUILDER_USE_BLOB_IN_DEV,
    backend: process.env.BUILDER_SITE_BACKEND,
    consultationBackend: process.env.CONSULTATION_LOG_BACKEND,
    vercelEnv: process.env.VERCEL_ENV,
  };

  const canvas: BuilderCanvasDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-13T02:00:00.000Z',
    updatedBy: 'blob-read-boundary',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };

  const cases = [
    {
      name: 'page',
      read: () => readPageCanvas('blob-read-site', 'page-1', 'draft'),
    },
    {
      name: 'lightbox',
      read: () => readLightboxCanvas('blob-read-site', 'lightbox-1'),
    },
    {
      name: 'header',
      read: () => readHeaderCanvas('blob-read-site'),
    },
    {
      name: 'footer',
      read: () => readFooterCanvas('blob-read-site'),
    },
  ] as const;

  beforeEach(() => {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-blob-token';
    process.env.BUILDER_USE_BLOB_IN_DEV = '1';
    delete process.env.BUILDER_SITE_BACKEND;
    delete process.env.CONSULTATION_LOG_BACKEND;
    delete process.env.VERCEL_ENV;
    blobMock.get.mockReset();
    blobMock.put.mockReset();
    blobMock.del.mockReset();
    blobMock.put.mockResolvedValue({ url: 'https://blob.example/canvas.json' });
  });

  afterEach(() => {
    if (previous.token === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previous.token;
    if (previous.useBlobInDev === undefined) delete process.env.BUILDER_USE_BLOB_IN_DEV;
    else process.env.BUILDER_USE_BLOB_IN_DEV = previous.useBlobInDev;
    if (previous.backend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previous.backend;
    if (previous.consultationBackend === undefined) delete process.env.CONSULTATION_LOG_BACKEND;
    else process.env.CONSULTATION_LOG_BACKEND = previous.consultationBackend;
    if (previous.vercelEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous.vercelEnv;
  });

  it.each(cases)('returns null for SDK null on $name', async ({ read }) => {
    blobMock.get.mockResolvedValue(null);
    await expect(read()).resolves.toBeNull();
  });

  it.each(cases)('returns null for an exact numeric 404 result on $name', async ({ read }) => {
    blobMock.get.mockResolvedValue({ statusCode: 404, stream: null });
    await expect(read()).resolves.toBeNull();
  });

  it.each(cases)('rejects an invalid undefined Blob result for $name', async ({ read }) => {
    blobMock.get.mockResolvedValue(undefined);
    await expect(read()).rejects.toMatchObject({
      code: 'read_failed',
      backend: 'blob',
      message: 'Builder canvas persistence read failed',
    });
  });

  it.each(cases)('returns null for an exact numeric 404 error on $name', async ({ read }) => {
    blobMock.get.mockRejectedValue(Object.assign(new Error('opaque provider failure'), { status: 404 }));
    await expect(read()).resolves.toBeNull();
  });

  it.each(cases)('reads and validates a 200 $name response', async ({ read }) => {
    blobMock.get.mockResolvedValue({
      statusCode: 200,
      stream: new Response(JSON.stringify(canvas)).body,
    });
    await expect(read()).resolves.toMatchObject({ updatedBy: 'blob-read-boundary' });
  });

  it.each(cases)('rejects 401/403/500/304 and 200-without-stream for $name', async ({ read }) => {
    for (const statusCode of [401, 403, 500, 304]) {
      blobMock.get.mockResolvedValue({ statusCode, stream: null });
      await expect(read()).rejects.toMatchObject({
        name: 'BuilderCanvasPersistenceError',
        code: 'read_failed',
        backend: 'blob',
        statusCode,
        message: 'Builder canvas persistence read failed',
      });
    }

    blobMock.get.mockResolvedValue({ statusCode: 200, stream: null });
    await expect(read()).rejects.toMatchObject({
      code: 'read_failed',
      backend: 'blob',
      statusCode: 200,
    });
  });

  it.each(cases)('propagates a $name network error even when its message says 404/not found', async ({ read }) => {
    const providerError = new Error('404 not found for secret provider tenant');
    blobMock.get.mockRejectedValue(providerError);

    let thrown: unknown;
    try {
      await read();
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(BuilderCanvasPersistenceError);
    expect(thrown).toMatchObject({
      code: 'read_failed',
      backend: 'blob',
      message: 'Builder canvas persistence read failed',
    });
    expect((thrown as BuilderCanvasPersistenceError).cause).toBe(providerError);
    expect((thrown as Error).message).not.toContain('404');
    expect((thrown as Error).message).not.toContain('tenant');
    expect(Object.keys(thrown as object)).not.toContain('cause');
  });

  it.each(cases)('propagates a non-404 typed provider status for $name', async ({ read }) => {
    const providerError = Object.assign(new Error('provider access detail'), { statusCode: 403 });
    blobMock.get.mockRejectedValue(providerError);

    await expect(read()).rejects.toMatchObject({
      code: 'read_failed',
      backend: 'blob',
      statusCode: 403,
      cause: providerError,
    });
  });

  it.each(cases)('propagates malformed $name Blob JSON as invalid_data', async ({ read }) => {
    blobMock.get.mockResolvedValue({
      statusCode: 200,
      stream: new Response('{bad-json').body,
    });

    await expect(read()).rejects.toMatchObject({
      code: 'invalid_data',
      backend: 'blob',
      message: 'Stored builder canvas data is invalid',
      cause: expect.any(SyntaxError),
    });
  });

  it.each(cases)('propagates $name Blob schema corruption as invalid_data', async ({ read }) => {
    blobMock.get.mockResolvedValue({
      statusCode: 200,
      stream: new Response(JSON.stringify({ version: 1, nodes: 'not-an-array' })).body,
    });

    await expect(read()).rejects.toMatchObject({
      code: 'invalid_data',
      backend: 'blob',
    });
  });

  it('does not put a page record after any failed latest Blob read', async () => {
    const failures: Array<() => void> = [
      () => blobMock.get.mockResolvedValue({ statusCode: 500, stream: null }),
      () => blobMock.get.mockRejectedValue(new Error('404 not found but untyped')),
      () => blobMock.get.mockResolvedValue({
        statusCode: 200,
        stream: new Response('{malformed').body,
      }),
    ];

    for (const arrangeFailure of failures) {
      blobMock.put.mockClear();
      arrangeFailure();
      await expect(writePageCanvas('blob-read-site', 'page-1', 'draft', {
        ...canvas,
        updatedBy: 'must-not-put',
      })).rejects.toBeInstanceOf(BuilderCanvasPersistenceError);
      expect(blobMock.put).not.toHaveBeenCalled();
    }
  });

  it('does not invoke an updater after a failed latest Blob read', async () => {
    const updater = vi.fn(() => ({
      revision: 2,
      savedAt: '2026-07-13T02:01:00.000Z',
      document: canvas,
    }));
    blobMock.get.mockResolvedValue({ statusCode: 304, stream: null });

    await expect(updatePageCanvasRecord(
      'blob-read-site',
      'page-1',
      'draft',
      updater,
    )).rejects.toMatchObject({
      code: 'read_failed',
      backend: 'blob',
      statusCode: 304,
    });
    expect(updater).not.toHaveBeenCalled();
    expect(blobMock.put).not.toHaveBeenCalled();
  });
});

describe('strict mutation site identity boundary', () => {
  const previousRoot = process.env.BUILDER_SITE_ROOT;
  const previousBackend = process.env.BUILDER_SITE_BACKEND;
  let tempRoot = '';

  const canvas: BuilderCanvasDocument = {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-13T00:00:00.000Z',
    updatedBy: 'identity-boundary-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [],
  };

  function validSite(siteId: string): BuilderSiteDocument {
    return {
      ...site([{
        ...page('home-ko', '2026-01-01T00:00:00.000Z'),
        slug: '',
        isHomePage: true,
      }], '2026-01-01T00:00:00.000Z'),
      siteId,
    };
  }

  beforeEach(async () => {
    tempRoot = await mkdtemp(path.join(os.tmpdir(), 'builder-site-identity-'));
    process.env.BUILDER_SITE_ROOT = tempRoot;
    process.env.BUILDER_SITE_BACKEND = 'local';
  });

  afterEach(async () => {
    if (previousRoot === undefined) delete process.env.BUILDER_SITE_ROOT;
    else process.env.BUILDER_SITE_ROOT = previousRoot;
    if (previousBackend === undefined) delete process.env.BUILDER_SITE_BACKEND;
    else process.env.BUILDER_SITE_BACKEND = previousBackend;
    await rm(tempRoot, { recursive: true, force: true });
  });

  it.each(['undefined', '../../x'])(
    'rejects site writes, page creation, and canvas writes for %s without changing canonical data',
    async (invalidSiteId) => {
      const canonicalSite = validSite(DEFAULT_BUILDER_SITE_ID);
      await writeSiteDocument(canonicalSite);
      await writePageCanvas(DEFAULT_BUILDER_SITE_ID, 'home-ko', 'draft', canvas);

      const canonicalSitePath = path.join(tempRoot, DEFAULT_BUILDER_SITE_ID, 'site.json');
      const canonicalCanvasPath = path.join(
        tempRoot,
        DEFAULT_BUILDER_SITE_ID,
        'pages',
        'home-ko.draft.json',
      );
      const siteBytes = await readFile(canonicalSitePath, 'utf8');
      const canvasBytes = await readFile(canonicalCanvasPath, 'utf8');

      await expect(writeSiteDocument(validSite(invalidSiteId)))
        .rejects.toBeInstanceOf(BuilderSiteIdentityError);
      await expect(createPage(invalidSiteId, 'ko', 'contact', 'Contact'))
        .rejects.toBeInstanceOf(BuilderSiteIdentityError);
      await expect(writePageCanvas(invalidSiteId, 'home-ko', 'draft', {
        ...canvas,
        updatedBy: 'must-not-persist',
      })).rejects.toBeInstanceOf(BuilderSiteIdentityError);

      await expect(readFile(canonicalSitePath, 'utf8')).resolves.toBe(siteBytes);
      await expect(readFile(canonicalCanvasPath, 'utf8')).resolves.toBe(canvasBytes);
    },
  );

  it('persists a safe custom site id inside an isolated root', async () => {
    const customSiteId = 'customer-site_2';
    await writeSiteDocument(validSite(customSiteId));
    await writePageCanvas(customSiteId, 'home-ko', 'draft', canvas);

    await expect(readSiteDocument(customSiteId, 'ko')).resolves.toMatchObject({
      siteId: customSiteId,
    });
    await expect(readPageCanvas(customSiteId, 'home-ko', 'draft')).resolves.toMatchObject({
      updatedBy: 'identity-boundary-test',
    });
    await expect(readFile(path.join(tempRoot, customSiteId, 'site.json'), 'utf8'))
      .resolves.toContain(`\"siteId\":\"${customSiteId}\"`);
  });

  it('blocks the seed publish helper before a canonical published write', async () => {
    const canonicalSite = validSite(DEFAULT_BUILDER_SITE_ID);
    const disabledChannelCanvas = {
      ...canvas,
      nodes: [
        {
          id: 'disabled-channel-cta',
          kind: 'button' as const,
          rect: { x: 0, y: 0, width: 320, height: 52 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            label: 'LINE 상담',
            href: 'https://line.me/R/ti/p/example',
            style: 'primary' as const,
          },
        },
      ],
    } satisfies BuilderCanvasDocument;
    await writeSiteDocument(canonicalSite);
    await writePageCanvas(DEFAULT_BUILDER_SITE_ID, 'home-ko', 'draft', disabledChannelCanvas);

    await expect(publishSeedPage(
      DEFAULT_BUILDER_SITE_ID,
      'home-ko',
      'ko',
    )).resolves.toBe(false);
    await expect(readPageCanvas(
      DEFAULT_BUILDER_SITE_ID,
      'home-ko',
      'published',
    )).resolves.toBeNull();
    await expect(readSiteDocument(DEFAULT_BUILDER_SITE_ID, 'ko')).resolves.toMatchObject({
      pages: [expect.not.objectContaining({ publishedAt: expect.any(String) })],
    });
  });

  it('keeps the seed publish helper available to an isolated customer site', async () => {
    const customSiteId = 'customer-channel-site';
    const customSite = validSite(customSiteId);
    const customCanvas = {
      ...canvas,
      nodes: [
        {
          id: 'customer-line-cta',
          kind: 'button' as const,
          rect: { x: 0, y: 0, width: 320, height: 52 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            label: 'LINE consultation',
            href: 'https://line.me/R/ti/p/example',
            style: 'primary' as const,
          },
        },
      ],
    } satisfies BuilderCanvasDocument;
    await writeSiteDocument(customSite);
    await writePageCanvas(customSiteId, 'home-ko', 'draft', customCanvas);

    await expect(publishSeedPage(customSiteId, 'home-ko', 'ko')).resolves.toBe(true);
    await expect(readPageCanvas(customSiteId, 'home-ko', 'published')).resolves.toMatchObject({
      nodes: [expect.objectContaining({ id: 'customer-line-cta' })],
    });
  });
});
