import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import { createDefaultSiteDocument } from '@/lib/builder/site/types';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { listLocalBuilderAppManifests } from '@/lib/builder/apps/catalog';
import {
  disableBuilderApp,
  enableBuilderApp,
  installBuilderApp,
  listBuilderAppCatalogEntries,
  listEnabledBuilderAppWidgets,
  resolveBuilderAppVersionState,
  restoreUninstalledBuilderApp,
  rollbackBuilderApp,
  runBuilderAppMigrations,
  uninstallBuilderApp,
  updateBuilderAppSettings,
} from '@/lib/builder/apps/installed';
import { resolveBuilderAppWidgetRuntimeForNode } from '@/lib/builder/apps/widgets';
import {
  authorizeBuilderAppScope,
  BuilderAppScopeError,
} from '@/lib/builder/apps/scopes';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

function makeAppWidgetNode(overrides: Partial<BuilderCanvasNode> = {}): BuilderCanvasNode {
  return {
    id: 'runtime-search-widget',
    kind: 'site-search',
    rect: { x: 0, y: 0, width: 620, height: 64 },
    style: {},
    zIndex: 1,
    appWidget: {
      appId: 'site-search',
      widgetId: 'search-box',
    },
    content: {},
    ...overrides,
  } as BuilderCanvasNode;
}

describe('builder app catalog and lifecycle', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    site = createDefaultSiteDocument('ko', 'tseng-law-main-site');
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('validates all local app manifests', () => {
    const manifests = listLocalBuilderAppManifests();
    expect(manifests.length).toBeGreaterThanOrEqual(5);
    expect(manifests.map((manifest) => manifest.appId)).toContain('site-search');
    expect(manifests.every((manifest) => manifest.permissions.length > 0)).toBe(true);
  });

  it('installs, disables, enables, and uninstalls an app with audit history', async () => {
    const installResult = await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(installResult?.changed).toBe(true);
    expect(site.installedApps).toHaveLength(1);
    expect(site.installedApps?.[0]).toMatchObject({
      appId: 'site-search',
      version: '1.0.0',
      status: 'enabled',
      settings: {
        placeholder: 'Search articles and services',
        'include-cms': true,
        'include-portfolio': true,
        'default-result-limit': 12,
      },
      migrations: [
        expect.objectContaining({
          migrationId: 'search-install-v1',
          toVersion: '1.0.0',
          status: 'applied',
          actor: 'admin',
        }),
      ],
      audit: [expect.objectContaining({ type: 'installed', actor: 'admin' })],
    });

    const disableResult = await disableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(disableResult?.entry.installation?.status).toBe('disabled');

    const enableResult = await enableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(enableResult?.entry.installation?.status).toBe('enabled');
    expect(site.installedApps?.[0]?.audit.map((event) => event.type)).toEqual([
      'installed',
      'disabled',
      'enabled',
    ]);

    const catalog = await listBuilderAppCatalogEntries('tseng-law-main-site', 'ko', { status: 'installed' });
    expect(catalog).toHaveLength(1);
    expect(catalog[0]?.manifest.appId).toBe('site-search');

    const uninstallResult = await uninstallBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(uninstallResult?.changed).toBe(true);
    const removedAudit = uninstallResult?.removed?.audit ?? [];
    expect(removedAudit[removedAudit.length - 1]).toMatchObject({ type: 'uninstalled' });
    expect(site.installedApps).toHaveLength(0);
    expect(site.uninstalledApps?.[0]).toMatchObject({
      appId: 'site-search',
      cleanupMode: 'keep-data',
      reversible: true,
      snapshot: expect.objectContaining({
        appId: 'site-search',
      }),
    });
    expect(mockedWriteSiteDocument).toHaveBeenLastCalledWith(
      expect.objectContaining({ installedApps: [], uninstalledApps: expect.any(Array) }),
      { deleteInstalledAppIds: ['site-search'] },
    );
  });

  it('validates and persists installed app settings', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');

    const saved = await updateBuilderAppSettings('tseng-law-main-site', 'ko', 'site-search', 'admin', {
      placeholder: 'Search Taiwan law updates',
      'include-cms': false,
    });

    expect(saved?.changed).toBe(true);
    expect(saved?.entry.installation?.settings).toEqual({
      placeholder: 'Search Taiwan law updates',
      'include-cms': false,
      'include-portfolio': true,
      'default-result-limit': 12,
    });
    await disableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    await enableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(site.installedApps?.find((app) => app.appId === 'site-search')?.settings).toEqual({
      placeholder: 'Search Taiwan law updates',
      'include-cms': false,
      'include-portfolio': true,
      'default-result-limit': 12,
    });
    expect(site.installedApps?.[0]?.audit.map((event) => event.type)).toEqual([
      'installed',
      'settings-updated',
      'disabled',
      'enabled',
    ]);

    await installBuilderApp('tseng-law-main-site', 'ko', 'visitor-inbox', 'admin');
    const invalid = await updateBuilderAppSettings('tseng-law-main-site', 'ko', 'visitor-inbox', 'admin', {
      'default-status': 'bad-status',
    });

    expect(invalid?.changed).toBe(false);
    expect(invalid?.validationErrors).toEqual([
      expect.objectContaining({
        fieldId: 'default-status',
        message: 'Default status is not an allowed option.',
      }),
    ]);
    expect(site.installedApps?.find((app) => app.appId === 'visitor-inbox')?.settings).toEqual({
      'default-status': 'pending',
    });

    const unknown = await updateBuilderAppSettings('tseng-law-main-site', 'ko', 'visitor-inbox', 'admin', {
      'default-status': 'pending',
      mystery: true,
    });
    expect(unknown?.changed).toBe(false);
    expect(unknown?.validationErrors).toEqual([
      expect.objectContaining({
        fieldId: 'mystery',
        message: 'Unknown setting field.',
      }),
    ]);
  });

  it('projects enabled installed app widgets for the editor add panel', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    await installBuilderApp('tseng-law-main-site', 'ko', 'newsletter-lite', 'admin');

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets.map((widget) => widget.id)).toEqual([
      'app:site-search:search-box',
      'app:newsletter-lite:newsletter-signup',
    ]);
    expect(widgets.find((widget) => widget.appId === 'site-search')).toMatchObject({
      widgetId: 'search-box',
      canvasKind: 'site-search',
      insertable: true,
    });
    expect(widgets.find((widget) => widget.appId === 'newsletter-lite')).toMatchObject({
      widgetId: 'newsletter-signup',
      insertable: false,
      unavailableReason: 'Widget runtime is not available yet.',
    });

    await disableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    const enabledAfterDisable = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(enabledAfterDisable.map((widget) => widget.appId)).toEqual(['newsletter-lite']);
  });

  it('projects native Blog public widgets for list, post, category, author, recent, and search', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'native-blog', 'admin');

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets.map((widget) => widget.id)).toEqual([
      'app:native-blog:blog-list',
      'app:native-blog:blog-post-card',
      'app:native-blog:blog-categories',
      'app:native-blog:blog-author',
      'app:native-blog:recent-posts',
      'app:native-blog:blog-search',
    ]);
    expect(widgets.map((widget) => widget.canvasKind)).toEqual([
      'blog-feed',
      'blog-post-card',
      'blog-categories',
      'blog-author',
      'blog-recent-posts',
      'site-search',
    ]);
    expect(widgets.find((widget) => widget.widgetId === 'blog-search')).toMatchObject({
      insertable: true,
      defaultContent: expect.objectContaining({ kinds: ['blog'] }),
    });

    const runtimeNode = {
      id: 'native-blog-author-node',
      kind: 'blog-author',
      rect: { x: 0, y: 0, width: 420, height: 360 },
      style: {},
      zIndex: 1,
      appWidget: { appId: 'native-blog', widgetId: 'blog-author' },
      content: {},
    } as BuilderCanvasNode;
    expect(resolveBuilderAppWidgetRuntimeForNode(runtimeNode, site.installedApps ?? []))
      .toMatchObject({
        id: 'app:native-blog:blog-author',
        component: 'BlogAuthorWidget',
        canvasKind: 'blog-author',
        status: 'enabled',
      });
  });

  it('projects native Events public widgets for list, calendar, and RSVP', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'native-events', 'admin');

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets.map((widget) => widget.id)).toEqual([
      'app:native-events:events-list',
      'app:native-events:events-calendar',
      'app:native-events:event-rsvp',
    ]);
    expect(widgets.map((widget) => widget.canvasKind)).toEqual([
      'event-list',
      'event-calendar',
      'event-rsvp',
    ]);
    expect(widgets.find((widget) => widget.widgetId === 'events-list')).toMatchObject({
      insertable: true,
      defaultContent: expect.objectContaining({ timeFilter: 'upcoming' }),
    });

    const runtimeNode = {
      id: 'native-events-list-node',
      kind: 'event-list',
      rect: { x: 0, y: 0, width: 1120, height: 620 },
      style: {},
      zIndex: 1,
      appWidget: { appId: 'native-events', widgetId: 'events-list' },
      content: {},
    } as BuilderCanvasNode;
    expect(resolveBuilderAppWidgetRuntimeForNode(runtimeNode, site.installedApps ?? []))
      .toMatchObject({
        id: 'app:native-events:events-list',
        component: 'EventsListWidget',
        canvasKind: 'event-list',
        status: 'enabled',
      });
  });

  it('projects native FAQ public widgets for list and search', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'faq-manager', 'admin');

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets.map((widget) => widget.id)).toEqual([
      'app:faq-manager:faq-list',
      'app:faq-manager:faq-search',
    ]);
    expect(widgets.map((widget) => widget.canvasKind)).toEqual([
      'faqList',
      'site-search',
    ]);
    expect(widgets.find((widget) => widget.widgetId === 'faq-list')).toMatchObject({
      insertable: true,
      defaultContent: expect.objectContaining({
        source: 'app',
        showSearch: true,
        showCategoryFilter: true,
        schemaEnabled: true,
      }),
    });
    expect(widgets.find((widget) => widget.widgetId === 'faq-search')).toMatchObject({
      insertable: true,
      defaultContent: expect.objectContaining({ kinds: ['faq'] }),
    });

    const runtimeNode = {
      id: 'native-faq-list-node',
      kind: 'faqList',
      rect: { x: 0, y: 0, width: 960, height: 520 },
      style: {},
      zIndex: 1,
      appWidget: { appId: 'faq-manager', widgetId: 'faq-list' },
      content: {},
    } as BuilderCanvasNode;
    expect(resolveBuilderAppWidgetRuntimeForNode(runtimeNode, site.installedApps ?? []))
      .toMatchObject({
        id: 'app:faq-manager:faq-list',
        component: 'FaqListWidget',
        canvasKind: 'faqList',
        status: 'enabled',
      });
  });

  it('projects native Live Chat launcher widget and settings defaults', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'live-chat', 'admin');

    const installation = site.installedApps?.find((app) => app.appId === 'live-chat');
    expect(installation).toMatchObject({
      appId: 'live-chat',
      status: 'enabled',
      settings: {
        'launcher-enabled': true,
        'launcher-label': '실시간 상담',
        title: '호정국제 상담',
        'intro-text': '이름과 이메일은 선택 사항입니다.',
        'offline-message': '지금은 답변이 지연될 수 있습니다. 메시지를 남겨주시면 확인 후 연락드리겠습니다.',
        'accent-color': '#0f172a',
        placement: 'bottom-right',
        'email-required': false,
      },
      migrations: [
        expect.objectContaining({
          migrationId: 'live-chat-install-v1',
          status: 'applied',
        }),
      ],
    });

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets).toEqual([
      expect.objectContaining({
        id: 'app:live-chat:chat-launcher',
        appId: 'live-chat',
        widgetId: 'chat-launcher',
        canvasKind: 'floating-chat',
        insertable: true,
        defaultContent: expect.objectContaining({
          provider: 'live-chat',
          label: '실시간 상담',
          placement: 'bottom-right',
        }),
      }),
    ]);

    const runtimeNode = {
      id: 'live-chat-launcher-node',
      kind: 'floating-chat',
      rect: { x: 0, y: 0, width: 64, height: 64 },
      style: {},
      zIndex: 1,
      appWidget: { appId: 'live-chat', widgetId: 'chat-launcher' },
      content: {
        provider: 'live-chat',
        href: '',
        label: '실시간 상담',
        placement: 'bottom-right',
        showLabel: false,
        color: '#0f172a',
      },
    } as BuilderCanvasNode;
    expect(resolveBuilderAppWidgetRuntimeForNode(runtimeNode, site.installedApps ?? []))
      .toMatchObject({
        id: 'app:live-chat:chat-launcher',
        component: 'LiveChatLauncherWidget',
        canvasKind: 'floating-chat',
        status: 'enabled',
      });
  });

  it('projects native Portfolio public widgets and settings defaults', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'native-portfolio', 'admin');

    const installation = site.installedApps?.find((app) => app.appId === 'native-portfolio');
    expect(installation).toMatchObject({
      appId: 'native-portfolio',
      status: 'enabled',
      settings: {
        'default-list-size': 6,
        'show-category-filter': true,
        'default-layout': 'cards',
      },
      migrations: [
        expect.objectContaining({
          migrationId: 'native-portfolio-install-v1',
          status: 'applied',
        }),
      ],
    });

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets).toEqual([
      expect.objectContaining({
        id: 'app:native-portfolio:portfolio-list',
        appId: 'native-portfolio',
        widgetId: 'portfolio-list',
        canvasKind: 'portfolio-list',
        insertable: true,
        defaultContent: expect.objectContaining({
          layout: 'cards',
          showCategoryFilter: true,
          columns: 3,
        }),
      }),
    ]);

    const runtimeNode = {
      id: 'native-portfolio-list-node',
      kind: 'portfolio-list',
      rect: { x: 0, y: 0, width: 1120, height: 620 },
      style: {},
      zIndex: 1,
      appWidget: { appId: 'native-portfolio', widgetId: 'portfolio-list' },
      content: {},
    } as BuilderCanvasNode;
    expect(resolveBuilderAppWidgetRuntimeForNode(runtimeNode, site.installedApps ?? []))
      .toMatchObject({
        id: 'app:native-portfolio:portfolio-list',
        component: 'PortfolioListWidget',
        canvasKind: 'portfolio-list',
        status: 'enabled',
      });
  });

  it('projects native Store product gallery widgets and settings defaults', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'native-store', 'admin');

    const installation = site.installedApps?.find((app) => app.appId === 'native-store');
    expect(installation).toMatchObject({
      appId: 'native-store',
      status: 'enabled',
      settings: {
        'default-page-size': 6,
        'show-category-filter': true,
        'show-quick-view': true,
        'default-sort': 'updated-desc',
      },
      migrations: [
        expect.objectContaining({
          migrationId: 'native-store-install-v1',
          status: 'applied',
        }),
      ],
    });

    const widgets = await listEnabledBuilderAppWidgets('tseng-law-main-site', 'ko');
    expect(widgets).toEqual([
      expect.objectContaining({
        id: 'app:native-store:product-gallery',
        appId: 'native-store',
        widgetId: 'product-gallery',
        canvasKind: 'product-gallery',
        insertable: true,
        defaultContent: expect.objectContaining({
          layout: 'grid',
          showCategoryFilter: true,
          showQuickView: true,
          pageSize: 6,
        }),
      }),
    ]);

    const runtimeNode = {
      id: 'native-store-gallery-node',
      kind: 'product-gallery',
      rect: { x: 0, y: 0, width: 1120, height: 680 },
      style: {},
      zIndex: 1,
      appWidget: { appId: 'native-store', widgetId: 'product-gallery' },
      content: {},
    } as BuilderCanvasNode;
    expect(resolveBuilderAppWidgetRuntimeForNode(runtimeNode, site.installedApps ?? []))
      .toMatchObject({
        id: 'app:native-store:product-gallery',
        component: 'ProductGalleryWidget',
        canvasKind: 'product-gallery',
        status: 'enabled',
      });
  });

  it('runs manifest app migrations once and backfills legacy installations', async () => {
    const installResult = await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(installResult?.changed).toBe(true);
    expect(site.installedApps?.[0]?.migrations).toEqual([
      expect.objectContaining({
        migrationId: 'search-install-v1',
        status: 'applied',
        toVersion: '1.0.0',
        actor: 'admin',
      }),
    ]);

    const reinstallResult = await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(reinstallResult?.changed).toBe(false);
    expect(site.installedApps?.[0]?.migrations).toHaveLength(1);

    site.installedApps = [{
      appId: 'site-search',
      version: '0.9.0',
      status: 'disabled',
      installedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      settings: {},
      audit: [],
    }];
    mockedReadSiteDocument.mockResolvedValue(site);

    const upgradeResult = await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(upgradeResult?.changed).toBe(true);
    expect(site.installedApps?.[0]).toMatchObject({
      version: '1.0.0',
      status: 'enabled',
      rollback: {
        version: '0.9.0',
        status: 'disabled',
        actor: 'admin',
        settings: {},
      },
      migrations: [
        expect.objectContaining({
          migrationId: 'search-install-v1',
          status: 'applied',
        }),
      ],
      audit: [
        expect.objectContaining({
          type: 'upgraded',
          fromVersion: '0.9.0',
        }),
      ],
    });
    expect(upgradeResult?.entry.versionState).toMatchObject({
      installedVersion: '1.0.0',
      latestVersion: '1.0.0',
      updateAvailable: false,
      canRollback: true,
      rollbackVersion: '0.9.0',
    });
  });

  it('resolves app version state and rolls installed app state back to the previous snapshot', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    const manifest = listLocalBuilderAppManifests().find((app) => app.appId === 'site-search');
    expect(manifest).toBeTruthy();
    expect(resolveBuilderAppVersionState(manifest!, site.installedApps?.[0])).toMatchObject({
      installedVersion: '1.0.0',
      latestVersion: '1.0.0',
      compatibility: 'compatible',
      updateAvailable: false,
      canRollback: false,
    });

    site.installedApps = [{
      appId: 'site-search',
      version: '0.9.0',
      status: 'disabled',
      installedAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      settings: {
        placeholder: 'Legacy search',
        'include-cms': false,
      },
      audit: [],
    }];
    mockedReadSiteDocument.mockResolvedValue(site);
    const catalogBeforeUpgrade = await listBuilderAppCatalogEntries('tseng-law-main-site', 'ko', { status: 'installed' });
    expect(catalogBeforeUpgrade[0]?.versionState).toMatchObject({
      installedVersion: '0.9.0',
      latestVersion: '1.0.0',
      updateAvailable: true,
      canRollback: false,
    });

    const upgradeResult = await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(upgradeResult?.entry.versionState).toMatchObject({
      installedVersion: '1.0.0',
      canRollback: true,
      rollbackVersion: '0.9.0',
    });

    const rollbackResult = await rollbackBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(rollbackResult?.changed).toBe(true);
    expect(rollbackResult?.entry.installation).toMatchObject({
      version: '0.9.0',
      status: 'disabled',
      settings: {
        placeholder: 'Legacy search',
        'include-cms': false,
      },
      rollback: {
        version: '1.0.0',
        status: 'enabled',
      },
      audit: [
        expect.objectContaining({
          type: 'upgraded',
          fromVersion: '0.9.0',
        }),
        expect.objectContaining({
          type: 'rolled-back',
          fromVersion: '1.0.0',
          toVersion: '0.9.0',
        }),
      ],
    });
    expect(rollbackResult?.entry.versionState).toMatchObject({
      installedVersion: '0.9.0',
      latestVersion: '1.0.0',
      updateAvailable: true,
      canRollback: true,
      rollbackVersion: '1.0.0',
    });
  });

  it('returns an unavailable result when no app rollback snapshot exists', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');

    const rollbackResult = await rollbackBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(rollbackResult).toMatchObject({
      changed: false,
      rollbackUnavailable: true,
      entry: {
        versionState: {
          canRollback: false,
        },
      },
    });
    expect(site.installedApps?.[0]?.version).toBe('1.0.0');
  });

  it('archives uninstall cleanup data and restores reversible app installs', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    await updateBuilderAppSettings('tseng-law-main-site', 'ko', 'site-search', 'admin', {
      placeholder: 'Restore me',
      'include-cms': false,
    });

    const uninstallResult = await uninstallBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin', 'keep-data');
    expect(uninstallResult?.entry).toMatchObject({
      uninstall: {
        appId: 'site-search',
        cleanupMode: 'keep-data',
        reversible: true,
      },
      versionState: {
        latestVersion: '1.0.0',
        canRollback: false,
      },
    });
    expect(site.installedApps).toEqual([]);
    expect(site.uninstalledApps?.[0]).toMatchObject({
      appId: 'site-search',
      version: '1.0.0',
      cleanupMode: 'keep-data',
      reversible: true,
      snapshot: expect.objectContaining({
        settings: {
          placeholder: 'Restore me',
          'include-cms': false,
          'include-portfolio': true,
          'default-result-limit': 12,
        },
        audit: expect.arrayContaining([
          expect.objectContaining({ type: 'uninstalled' }),
        ]),
      }),
    });

    const restoreResult = await restoreUninstalledBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(restoreResult?.changed).toBe(true);
    expect(restoreResult?.entry.installation).toMatchObject({
      appId: 'site-search',
      status: 'enabled',
      settings: {
        placeholder: 'Restore me',
        'include-cms': false,
        'include-portfolio': true,
        'default-result-limit': 12,
      },
      audit: expect.arrayContaining([
        expect.objectContaining({ type: 'restored' }),
      ]),
    });
    expect(site.uninstalledApps).toEqual([]);
    expect(mockedWriteSiteDocument).toHaveBeenLastCalledWith(
      expect.objectContaining({
        installedApps: [expect.objectContaining({ appId: 'site-search' })],
        uninstalledApps: [],
      }),
      { deleteUninstalledAppIds: ['site-search'] },
    );
  });

  it('keeps uninstall audit but blocks restore after remove-data cleanup', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');

    const uninstallResult = await uninstallBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin', 'remove-data');
    expect(uninstallResult?.archive).toMatchObject({
      appId: 'site-search',
      cleanupMode: 'remove-data',
      reversible: false,
      audit: expect.arrayContaining([
        expect.objectContaining({ type: 'uninstalled' }),
      ]),
    });
    expect(uninstallResult?.archive?.snapshot).toBeUndefined();

    const restoreResult = await restoreUninstalledBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(restoreResult).toMatchObject({
      changed: false,
      restoreUnavailable: true,
      entry: {
        uninstall: expect.objectContaining({
          cleanupMode: 'remove-data',
          reversible: false,
        }),
      },
    });
    expect(site.installedApps).toEqual([]);
  });

  it('records failed app migration handler runs and allows retry', async () => {
    const manifest = listLocalBuilderAppManifests().find((app) => app.appId === 'site-search');
    expect(manifest).toBeTruthy();
    const ranAt = '2026-05-19T00:00:00.000Z';

    const failed = await runBuilderAppMigrations(manifest!, [], 'admin', ranAt, {});
    expect(failed).toMatchObject({
      appliedCount: 0,
      failedCount: 1,
      migrations: [
        expect.objectContaining({
          migrationId: 'search-install-v1',
          status: 'failed',
          actor: 'admin',
          ranAt,
        }),
      ],
    });
    expect(failed.migrations[0]?.message).toContain('No migration handler registered');

    const retried = await runBuilderAppMigrations(
      manifest!,
      failed.migrations,
      'admin',
      '2026-05-19T00:01:00.000Z',
      { 'search-install-v1': () => {} },
    );
    expect(retried.appliedCount).toBe(1);
    expect(retried.failedCount).toBe(0);
    expect(retried.migrations.map((migration) => migration.status)).toEqual(['failed', 'applied']);
  });

  it('enforces installed app permission scopes before app-context access', async () => {
    await expect(authorizeBuilderAppScope('tseng-law-main-site', 'ko', 'site-search', 'cms:read'))
      .rejects.toMatchObject({ code: 'app_not_installed' } satisfies Partial<BuilderAppScopeError>);

    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    await expect(authorizeBuilderAppScope('tseng-law-main-site', 'ko', 'site-search', 'cms:read'))
      .resolves.toEqual({ appId: 'site-search', scope: 'cms:read' });

    await expect(authorizeBuilderAppScope('tseng-law-main-site', 'ko', 'site-search', 'media:write'))
      .rejects.toMatchObject({ code: 'app_scope_not_granted' } satisfies Partial<BuilderAppScopeError>);

    await disableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    await expect(authorizeBuilderAppScope('tseng-law-main-site', 'ko', 'site-search', 'cms:read'))
      .rejects.toMatchObject({ code: 'app_disabled' } satisfies Partial<BuilderAppScopeError>);
  });

  it('resolves published app widget runtime status from node metadata and installation state', async () => {
    await installBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');

    const enabled = resolveBuilderAppWidgetRuntimeForNode(makeAppWidgetNode(), site.installedApps ?? []);
    expect(enabled).toMatchObject({
      id: 'app:site-search:search-box',
      appId: 'site-search',
      widgetId: 'search-box',
      component: 'SiteSearchBox',
      canvasKind: 'site-search',
      status: 'enabled',
    });

    await disableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(resolveBuilderAppWidgetRuntimeForNode(makeAppWidgetNode(), site.installedApps ?? [])?.status)
      .toBe('disabled');

    expect(resolveBuilderAppWidgetRuntimeForNode(makeAppWidgetNode(), [])?.status)
      .toBe('not-installed');

    await enableBuilderApp('tseng-law-main-site', 'ko', 'site-search', 'admin');
    expect(resolveBuilderAppWidgetRuntimeForNode(makeAppWidgetNode({ kind: 'button' }), site.installedApps ?? [])?.status)
      .toBe('unmapped-kind');

    expect(resolveBuilderAppWidgetRuntimeForNode(makeAppWidgetNode({
      appWidget: { appId: 'site-search', widgetId: 'missing-widget' },
    }), site.installedApps ?? [])?.status).toBe('unknown-widget');

    expect(resolveBuilderAppWidgetRuntimeForNode(makeAppWidgetNode({ appWidget: undefined }), site.installedApps ?? []))
      .toBeNull();
  });
});
