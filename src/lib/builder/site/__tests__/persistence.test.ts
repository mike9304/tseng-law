import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import os from 'os';
import path from 'path';
import { mkdtemp, rm } from 'fs/promises';
import {
  deletePageCanvasRecord,
  mergeLatestPagePublishMetaForWrite,
  mergeUntouchedPageSeoForWrite,
  readPageCanvas,
  reconcileSiteDocumentInstalledAppsForWrite,
  reconcileSiteDocumentNavigationForWrite,
  reconcileSiteDocumentPagesForWrite,
  reconcileSiteDocumentRedirectsForWrite,
  reconcileSiteDocumentUninstalledAppsForWrite,
  writePageCanvas,
} from '@/lib/builder/site/persistence';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { BuilderInstalledApp, BuilderUninstalledAppArchive } from '@/lib/builder/apps/types';
import type { BuilderNavItem, BuilderPageMeta, BuilderSiteDocument, SiteRedirect } from '@/lib/builder/site/types';

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
