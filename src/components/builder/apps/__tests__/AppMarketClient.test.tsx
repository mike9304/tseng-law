import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderAppCatalogEntry } from '@/lib/builder/apps/types';
import AppMarketClient from '../AppMarketClient';

const installedEntry: BuilderAppCatalogEntry = {
  manifest: {
    appId: 'site-search',
    name: '站內搜尋',
    summary: '搜尋頁面與內容。',
    description: '提供可設定的站內搜尋體驗。',
    version: '1.1.0',
    category: 'utility',
    developer: 'Hojeong Builder',
    icon: 'SEARCH',
    permissions: ['site:read', 'cms:read'],
    widgets: [
      {
        widgetId: 'search-box',
        name: '搜尋框',
        area: 'section',
        component: 'SiteSearchBox',
      },
    ],
    settingsPanels: [
      {
        panelId: 'search-settings',
        name: '搜尋設定',
        fields: [
          {
            fieldId: 'mode',
            label: '模式',
            type: 'select',
            required: true,
            options: [{ label: '完整', value: 'full' }],
          },
        ],
      },
    ],
    routes: [
      { routeId: 'search-admin', area: 'admin', path: '/admin-builder/search' },
      { routeId: 'search-public', area: 'public', path: '/search' },
    ],
    migrations: [
      {
        id: 'search-install-v1',
        toVersion: '1.1.0',
        description: '建立搜尋設定。',
      },
    ],
    translations: {},
    compatibility: { minBuilderVersion: 1 },
  },
  installation: {
    appId: 'site-search',
    version: '1.0.0',
    status: 'enabled',
    installedAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    settings: { mode: 'full' },
    migrations: [
      {
        migrationId: 'search-install-v1',
        toVersion: '1.1.0',
        status: 'failed',
        ranAt: '2026-06-03T00:00:00.000Z',
        actor: 'apps-admin@example.test',
      },
    ],
    audit: [
      {
        eventId: 'event-1',
        type: 'migrations-failed',
        actor: 'apps-admin@example.test',
        at: '2026-06-03T00:00:00.000Z',
      },
    ],
  },
  versionState: {
    installedVersion: '1.0.0',
    latestVersion: '1.1.0',
    updateAvailable: true,
    compatibility: 'compatible',
    builderVersion: 1,
    canRollback: true,
    rollbackVersion: '1.0.0',
  },
};

describe('AppMarketClient localization', () => {
  it('renders localized App Market lifecycle chrome in zh-hant', () => {
    const html = renderToStaticMarkup(
      <AppMarketClient locale="zh-hant" initialEntries={[installedEntry]} />,
    );

    expect(html).toContain('必填');
    expect(html).toContain('選擇');
    expect(html).toContain('管理');
    expect(html).toContain('更新 2026-06-03T00:00:00.000Z');
    expect(html).toContain('1 個小工具');
    expect(html).toContain('1 個設定面板');
    expect(html).toContain('1 個管理路徑');
    expect(html).toContain('已安裝 v1.0.0 · 最新 v1.1.0');
    expect(html).toContain('編輯器 v1');
    expect(html).toContain('可回復');
    expect(html).toContain('前版 v1.0.0');
    expect(html).toContain('已強制套用 2 個權限');
    expect(html).toContain('遷移失敗');
    expect(html).toContain('0/1 個遷移已套用');
    expect(html).toContain('1 個失敗');
    expect(html).toContain('最近：search-install-v1 · 失敗 · 2026-06-03T00:00:00.000Z');
    expect(html).toContain('儲存設定');

    expect(html).not.toContain('Required');
    expect(html).not.toContain('Select</option>');
    expect(html).not.toContain('Latest v');
    expect(html).not.toContain('Installed v');
    expect(html).not.toContain('Builder v');
    expect(html).not.toContain('Rollback available');
    expect(html).not.toContain('Previous v');
    expect(html).not.toContain('granted scopes enforced');
    expect(html).not.toContain('migrations applied');
    expect(html).not.toContain('Last:');
    expect(html).not.toContain('Save settings');
  });

  it('renders localized empty installed-app state in zh-hant', () => {
    const html = renderToStaticMarkup(
      <AppMarketClient locale="zh-hant" initialEntries={[]} />,
    );

    expect(html).toContain('尚未安裝應用');
    expect(html).toContain('從下方目錄安裝原生應用後，即可在此管理。');
    expect(html).not.toContain('No installed apps');
    expect(html).not.toContain('Install native apps from the catalog below to manage them here.');
  });
});
