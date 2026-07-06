'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  BUILDER_APP_CATEGORIES,
  type BuilderAppAuditEvent,
  type BuilderAppCatalogEntry,
  type BuilderAppCategory,
  type BuilderAppInstallStatus,
  type BuilderAppSettingsPanel,
  type BuilderAppUninstallCleanupMode,
} from '@/lib/builder/apps/types';
import type { Locale } from '@/lib/locales';

type StatusFilter = BuilderAppInstallStatus | 'installed' | 'not-installed' | 'all';
type SettingsDraftValue = string | number | boolean;
type SettingsDraft = Record<string, SettingsDraftValue>;
type SettingsErrors = Record<string, string>;

interface AppMarketClientProps {
  locale: Locale;
  initialEntries: BuilderAppCatalogEntry[];
}

const copy = {
  ko: {
    title: '앱 마켓',
    description: '로컬 앱 카탈로그와 설치 수명주기를 관리합니다.',
    noticeReady: '준비됨',
    search: '검색',
    searchPlaceholder: '앱, 권한, 위젯 검색',
    category: '카테고리',
    allCategories: '전체 카테고리',
    status: '상태',
    allStatuses: '전체 상태',
    installedNativeApps: '설치된 네이티브 앱',
    installedNativeAppsDesc: '업데이트, 설정, 앱 관리자 화면을 한 곳에서 관리합니다.',
    installedSuffix: '설치됨',
    enabledApps: '활성 앱',
    disabledApps: '비활성 앱',
    updatesAvailable: '업데이트 가능',
    settingsPanels: '설정 패널',
    catalogApps: '카탈로그 앱',
    widgets: '위젯',
    adminRoutes: '관리 경로',
    installed: '설치됨',
    enabled: '활성',
    disabled: '비활성',
    updateAvailable: '업데이트 가능',
    current: '현재',
    migrationsOk: '마이그레이션 정상',
    notInstalled: '미설치',
    update: '업데이트',
    install: '설치',
    enable: '활성화',
    disable: '비활성화',
    uninstall: '제거',
    rollback: '롤백',
    restore: '복원',
    settings: '설정',
    open: '열기',
    permissions: '권한',
    appDisabledScopesBlocked: '앱이 비활성화되어 권한이 차단됨',
    uninstallArchive: '제거 보관함',
    dataKeptForRestore: '복구를 위해 데이터 보관됨',
    dataRemovedAuditRetained: '데이터 제거됨 · 감사 로그 유지',
    latestEvent: '최근 이벤트',
    uninstallCleanup: '제거 정리',
    keepData: '복구용 데이터 보관',
    removeData: '데이터 제거, 감사 로그 유지',
    migrations: '마이그레이션',
    installFresh: '새로 설치',
    noAppsFound: '앱을 찾을 수 없습니다',
    adjustFilters: '검색, 카테고리, 상태 필터를 조정하세요.',
    settingsSaved: '설정이 저장되었습니다.',
    settingsSavePending: '설정 저장 중...',
    settingsSaveFailed: '설정 저장 실패',
    actionPending: (action: string) => `${action} 처리 중...`,
    actionComplete: (action: string) => `${action} 완료`,
    actionFailed: '앱 작업 실패',
    required: '필수',
    selectPlaceholder: '선택',
    manage: '관리',
    updatedPrefix: '업데이트',
    noInstalledApps: '설치된 앱 없음',
    installNativeAppsHint: '아래 카탈로그에서 네이티브 앱을 설치하면 여기에서 관리할 수 있습니다.',
    latestVersion: (version: string) => `최신 v${version}`,
    installedVersion: (version: string) => `설치됨 v${version}`,
    installedLatestVersion: (installed: string, latest: string) => `설치됨 v${installed} · 최신 v${latest}`,
    builderVersion: (version: number) => `빌더 v${version}`,
    compatible: '호환됨',
    requiresBuilderVersion: (version: number) => `빌더 v${version}+ 필요`,
    rollbackAvailable: '롤백 가능',
    rollbackUnavailable: '롤백 불가',
    previousVersion: (version: string) => `이전 v${version}`,
    grantedScopesEnforced: (count: number) => `${count}개 권한이 적용됨`,
    uninstalledAt: (date: string) => `제거됨 ${date}`,
    latestEventAt: (event: string, date: string) => `${event} · ${date}`,
    migrationsApplied: (applied: number, total: number) => `${applied}/${total} 마이그레이션 적용됨`,
    migrationFailures: (count: number) => `${count}개 실패`,
    migrationIssues: (count: number) => `${count}개 마이그레이션 문제`,
    latestMigration: (id: string, status: string, date: string) => `최근: ${id} · ${status} · ${date}`,
    saveSettings: '설정 저장',
    counts: {
      widgets: (count: number) => `${count}개 위젯`,
      settingsPanels: (count: number) => `${count}개 설정 패널`,
      adminRoutes: (count: number) => `${count}개 관리 경로`,
      routes: (count: number) => `${count}개 경로`,
      migrations: (count: number) => `${count}개 마이그레이션`,
    },
    auditEvents: {
      installed: '설치됨',
      enabled: '활성화됨',
      disabled: '비활성화됨',
      upgraded: '업데이트됨',
      'rolled-back': '롤백됨',
      restored: '복원됨',
      'settings-updated': '설정 업데이트됨',
      'migrations-run': '마이그레이션 실행됨',
      'migrations-failed': '마이그레이션 실패',
      uninstalled: '제거됨',
    },
    migrationStatus: {
      applied: '적용됨',
      failed: '실패',
    },
  },
  'zh-hant': {
    title: '應用市集',
    description: '管理本地應用目錄與安裝生命週期。',
    noticeReady: '就緒',
    search: '搜尋',
    searchPlaceholder: '搜尋應用、權限、小工具',
    category: '類別',
    allCategories: '所有類別',
    status: '狀態',
    allStatuses: '所有狀態',
    installedNativeApps: '已安裝的原生應用',
    installedNativeAppsDesc: '在同一處管理更新、設定與應用管理頁面。',
    installedSuffix: '已安裝',
    enabledApps: '已啟用應用',
    disabledApps: '已停用應用',
    updatesAvailable: '可更新',
    settingsPanels: '設定面板',
    catalogApps: '目錄應用',
    widgets: '小工具',
    adminRoutes: '管理路徑',
    installed: '已安裝',
    enabled: '已啟用',
    disabled: '已停用',
    updateAvailable: '可更新',
    current: '目前',
    migrationsOk: '遷移正常',
    notInstalled: '未安裝',
    update: '更新',
    install: '安裝',
    enable: '啟用',
    disable: '停用',
    uninstall: '移除',
    rollback: '回復',
    restore: '還原',
    settings: '設定',
    open: '開啟',
    permissions: '權限',
    appDisabledScopesBlocked: '應用已停用；權限已封鎖',
    uninstallArchive: '解除安裝封存',
    dataKeptForRestore: '資料已保留以便還原',
    dataRemovedAuditRetained: '資料已移除 · 保留稽核記錄',
    latestEvent: '最近事件',
    uninstallCleanup: '解除安裝清理',
    keepData: '保留資料以便還原',
    removeData: '移除資料，保留稽核記錄',
    migrations: '遷移',
    installFresh: '全新安裝',
    noAppsFound: '找不到應用',
    adjustFilters: '請調整搜尋、類別或狀態篩選。',
    settingsSaved: '設定已儲存。',
    settingsSavePending: '設定儲存中...',
    settingsSaveFailed: '設定儲存失敗',
    actionPending: (action: string) => `${action}處理中...`,
    actionComplete: (action: string) => `${action}完成`,
    actionFailed: '應用操作失敗',
    required: '必填',
    selectPlaceholder: '選擇',
    manage: '管理',
    updatedPrefix: '更新',
    noInstalledApps: '尚未安裝應用',
    installNativeAppsHint: '從下方目錄安裝原生應用後，即可在此管理。',
    latestVersion: (version: string) => `最新 v${version}`,
    installedVersion: (version: string) => `已安裝 v${version}`,
    installedLatestVersion: (installed: string, latest: string) => `已安裝 v${installed} · 最新 v${latest}`,
    builderVersion: (version: number) => `編輯器 v${version}`,
    compatible: '相容',
    requiresBuilderVersion: (version: number) => `需要編輯器 v${version}+`,
    rollbackAvailable: '可回復',
    rollbackUnavailable: '無回復點',
    previousVersion: (version: string) => `前版 v${version}`,
    grantedScopesEnforced: (count: number) => `已強制套用 ${count} 個權限`,
    uninstalledAt: (date: string) => `解除安裝於 ${date}`,
    latestEventAt: (event: string, date: string) => `${event} · ${date}`,
    migrationsApplied: (applied: number, total: number) => `${applied}/${total} 個遷移已套用`,
    migrationFailures: (count: number) => `${count} 個失敗`,
    migrationIssues: (count: number) => `${count} 個遷移問題`,
    latestMigration: (id: string, status: string, date: string) => `最近：${id} · ${status} · ${date}`,
    saveSettings: '儲存設定',
    counts: {
      widgets: (count: number) => `${count} 個小工具`,
      settingsPanels: (count: number) => `${count} 個設定面板`,
      adminRoutes: (count: number) => `${count} 個管理路徑`,
      routes: (count: number) => `${count} 個路徑`,
      migrations: (count: number) => `${count} 個遷移`,
    },
    auditEvents: {
      installed: '已安裝',
      enabled: '已啟用',
      disabled: '已停用',
      upgraded: '已更新',
      'rolled-back': '已回復',
      restored: '已還原',
      'settings-updated': '設定已更新',
      'migrations-run': '遷移已執行',
      'migrations-failed': '遷移失敗',
      uninstalled: '已解除安裝',
    },
    migrationStatus: {
      applied: '已套用',
      failed: '失敗',
    },
  },
  en: {
    title: 'App Market',
    description: 'Local app catalog and install lifecycle controls.',
    noticeReady: 'Ready',
    search: 'Search',
    searchPlaceholder: 'Search apps, scopes, widgets',
    category: 'Category',
    allCategories: 'All categories',
    status: 'Status',
    allStatuses: 'All statuses',
    installedNativeApps: 'Installed native apps',
    installedNativeAppsDesc: 'Manage updates, settings, and app admin surfaces from one place.',
    installedSuffix: 'installed',
    enabledApps: 'Enabled apps',
    disabledApps: 'Disabled apps',
    updatesAvailable: 'Updates available',
    settingsPanels: 'Settings panels',
    catalogApps: 'Catalog apps',
    widgets: 'widgets',
    adminRoutes: 'admin routes',
    installed: 'installed',
    enabled: 'enabled',
    disabled: 'disabled',
    updateAvailable: 'update available',
    current: 'current',
    migrationsOk: 'migrations ok',
    notInstalled: 'not installed',
    update: 'Update',
    install: 'Install',
    enable: 'Enable',
    disable: 'Disable',
    uninstall: 'Uninstall',
    rollback: 'Rollback',
    restore: 'Restore',
    settings: 'Settings',
    open: 'Open',
    permissions: 'permissions',
    appDisabledScopesBlocked: 'App disabled; scopes blocked',
    uninstallArchive: 'Uninstall archive',
    dataKeptForRestore: 'Data kept for restore',
    dataRemovedAuditRetained: 'Data removed; audit retained',
    latestEvent: 'Latest event',
    uninstallCleanup: 'Uninstall cleanup',
    keepData: 'Keep data for restore',
    removeData: 'Remove data, keep audit',
    migrations: 'Migrations',
    installFresh: 'Install fresh',
    noAppsFound: 'No apps found',
    adjustFilters: 'Adjust search, category, or status filters.',
    settingsSaved: 'settings saved',
    settingsSavePending: 'settings save pending',
    settingsSaveFailed: 'Settings save failed',
    actionPending: (action: string) => `${action} pending`,
    actionComplete: (action: string) => `${action} complete`,
    actionFailed: 'App action failed',
    required: 'Required',
    selectPlaceholder: 'Select',
    manage: 'Manage',
    updatedPrefix: 'updated',
    noInstalledApps: 'No installed apps',
    installNativeAppsHint: 'Install native apps from the catalog below to manage them here.',
    latestVersion: (version: string) => `Latest v${version}`,
    installedVersion: (version: string) => `Installed v${version}`,
    installedLatestVersion: (installed: string, latest: string) => `Installed v${installed} · Latest v${latest}`,
    builderVersion: (version: number) => `Builder v${version}`,
    compatible: 'Compatible',
    requiresBuilderVersion: (version: number) => `Requires builder v${version}+`,
    rollbackAvailable: 'Rollback available',
    rollbackUnavailable: 'No rollback point',
    previousVersion: (version: string) => `Previous v${version}`,
    grantedScopesEnforced: (count: number) => `${count} granted scopes enforced`,
    uninstalledAt: (date: string) => `Uninstalled at ${date}`,
    latestEventAt: (event: string, date: string) => `${event} at ${date}`,
    migrationsApplied: (applied: number, total: number) => `${applied}/${total} migrations applied`,
    migrationFailures: (count: number) => `${count} failed`,
    migrationIssues: (count: number) => `${count} migration issues`,
    latestMigration: (id: string, status: string, date: string) => `Last: ${id} · ${status} at ${date}`,
    saveSettings: 'Save settings',
    counts: {
      widgets: (count: number) => `${count} widgets`,
      settingsPanels: (count: number) => `${count} settings panels`,
      adminRoutes: (count: number) => `${count} admin routes`,
      routes: (count: number) => `${count} routes`,
      migrations: (count: number) => `${count} migrations`,
    },
    auditEvents: {
      installed: 'installed',
      enabled: 'enabled',
      disabled: 'disabled',
      upgraded: 'upgraded',
      'rolled-back': 'rolled back',
      restored: 'restored',
      'settings-updated': 'settings updated',
      'migrations-run': 'migrations run',
      'migrations-failed': 'migrations failed',
      uninstalled: 'uninstalled',
    },
    migrationStatus: {
      applied: 'applied',
      failed: 'failed',
    },
  },
} as const;

function entrySearchText(entry: BuilderAppCatalogEntry): string {
  const manifest = entry.manifest;
  return [
    manifest.name,
    manifest.summary,
    manifest.description,
    manifest.category,
    manifest.developer,
    ...manifest.permissions,
  ].join(' ').toLowerCase();
}

function matchesStatus(entry: BuilderAppCatalogEntry, status: StatusFilter): boolean {
  if (status === 'all') return true;
  if (status === 'installed') return Boolean(entry.installation);
  if (status === 'not-installed') return !entry.installation;
  return entry.installation?.status === status;
}

function sortEntries(entries: BuilderAppCatalogEntry[]): BuilderAppCatalogEntry[] {
  return [...entries].sort((a, b) => {
    const aInstalled = a.installation ? 0 : 1;
    const bInstalled = b.installation ? 0 : 1;
    if (aInstalled !== bInstalled) return aInstalled - bInstalled;
    return a.manifest.name.localeCompare(b.manifest.name);
  });
}

function withoutInstallation(entry: BuilderAppCatalogEntry): BuilderAppCatalogEntry {
  return {
    manifest: entry.manifest,
    versionState: {
      latestVersion: entry.manifest.version,
      updateAvailable: false,
      compatibility: entry.versionState.compatibility,
      builderVersion: entry.versionState.builderVersion,
      canRollback: false,
    },
  };
}

function buildSettingsDraft(entry: BuilderAppCatalogEntry): SettingsDraft {
  const draft: SettingsDraft = {};
  const saved = entry.installation?.settings ?? {};
  for (const panel of entry.manifest.settingsPanels) {
    for (const field of panel.fields) {
      const savedValue = saved[field.fieldId];
      if (typeof savedValue === 'string' || typeof savedValue === 'number' || typeof savedValue === 'boolean') {
        draft[field.fieldId] = savedValue;
      } else if (typeof field.defaultValue !== 'undefined') {
        draft[field.fieldId] = field.defaultValue;
      } else if (field.type === 'boolean') {
        draft[field.fieldId] = false;
      } else {
        draft[field.fieldId] = '';
      }
    }
  }
  return draft;
}

function fieldErrorKey(appId: string, fieldId: string): string {
  return `${appId}:${fieldId}`;
}

function localizedRouteHref(locale: Locale, path: string): string {
  if (path.startsWith('/api/')) return path;
  return `/${locale}${path}`;
}

type AppMarketCopy = (typeof copy)[Locale];

function installationStatusLabel(text: AppMarketCopy, status?: BuilderAppInstallStatus): string {
  if (status === 'enabled') return text.enabled;
  if (status === 'disabled') return text.disabled;
  if (status) return text.installed;
  return text.notInstalled;
}

function auditEventLabel(text: AppMarketCopy, type?: BuilderAppAuditEvent['type']): string {
  return type ? text.auditEvents[type] : text.auditEvents.installed;
}

export default function AppMarketClient({ locale, initialEntries }: AppMarketClientProps) {
  const text = copy[locale];
  const [entries, setEntries] = useState(() => sortEntries(initialEntries));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BuilderAppCategory | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [busyAppId, setBusyAppId] = useState<string | null>(null);
  const [settingsBusyAppId, setSettingsBusyAppId] = useState<string | null>(null);
  const [settingsDrafts, setSettingsDrafts] = useState<Record<string, SettingsDraft>>({});
  const [settingsErrors, setSettingsErrors] = useState<SettingsErrors>({});
  const [uninstallModes, setUninstallModes] = useState<Record<string, BuilderAppUninstallCleanupMode>>({});
  const [notice, setNotice] = useState<string>(text.noticeReady);
  const [isPending, startTransition] = useTransition();

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((entry) => {
      if (category !== 'all' && entry.manifest.category !== category) return false;
      if (!matchesStatus(entry, status)) return false;
      if (!query) return true;
      return entrySearchText(entry).includes(query);
    });
  }, [category, entries, search, status]);

  const installedCount = entries.filter((entry) => entry.installation).length;
  const enabledCount = entries.filter((entry) => entry.installation?.status === 'enabled').length;
  const installedEntries = useMemo(
    () => entries.filter((entry) => entry.installation),
    [entries],
  );
  const disabledCount = installedEntries.filter((entry) => entry.installation?.status === 'disabled').length;
  const updateCount = installedEntries.filter((entry) => entry.versionState.updateAvailable).length;
  const settingsPanelCount = installedEntries.reduce(
    (total, entry) => total + entry.manifest.settingsPanels.length,
    0,
  );

  function upsertEntry(nextEntry: BuilderAppCatalogEntry) {
    setEntries((current) => sortEntries(current.map((entry) => (
      entry.manifest.appId === nextEntry.manifest.appId ? nextEntry : entry
    ))));
  }

  function clearInstallation(appId: string) {
    setEntries((current) => sortEntries(current.map((entry) => (
      entry.manifest.appId === appId
        ? withoutInstallation(entry)
        : entry
    ))));
    setSettingsDrafts((current) => {
      const next = { ...current };
      delete next[appId];
      return next;
    });
    setSettingsErrors((current) => Object.fromEntries(
      Object.entries(current).filter(([key]) => !key.startsWith(`${appId}:`)),
    ));
  }

  function draftFor(entry: BuilderAppCatalogEntry): SettingsDraft {
    return settingsDrafts[entry.manifest.appId] ?? buildSettingsDraft(entry);
  }

  function updateSettingDraft(entry: BuilderAppCatalogEntry, fieldId: string, value: SettingsDraftValue) {
    const appId = entry.manifest.appId;
    setSettingsDrafts((current) => ({
      ...current,
      [appId]: {
        ...(current[appId] ?? buildSettingsDraft(entry)),
        [fieldId]: value,
      },
    }));
    setSettingsErrors((current) => {
      const next = { ...current };
      delete next[fieldErrorKey(appId, fieldId)];
      return next;
    });
  }

  async function runAction(appId: string, action: 'install' | 'update' | 'enable' | 'disable' | 'rollback' | 'restore' | 'uninstall') {
    setBusyAppId(appId);
    const actionLabel = text[action];
    setNotice(text.actionPending(actionLabel));
    try {
      const isInstallLikeAction = action === 'install' || action === 'update';
      const url = isInstallLikeAction
        ? `/api/builder/apps/installations?locale=${locale}`
        : `/api/builder/apps/installations/${encodeURIComponent(appId)}?locale=${locale}`;
      const response = await fetch(url, {
        method: isInstallLikeAction ? 'POST' : action === 'uninstall' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: isInstallLikeAction
          ? JSON.stringify({ appId })
          : action === 'uninstall'
            ? JSON.stringify({ cleanupMode: uninstallModes[appId] ?? 'keep-data' })
            : action === 'rollback'
              ? JSON.stringify({ action: 'rollback' })
              : action === 'restore'
                ? JSON.stringify({ action: 'restore' })
              : JSON.stringify({ status: action === 'enable' ? 'enabled' : 'disabled' }),
      });
      const payload = await response.json() as {
        ok?: boolean;
        error?: string;
        entry?: BuilderAppCatalogEntry;
        manifest?: BuilderAppCatalogEntry['manifest'];
      };
      if (!response.ok || !payload.ok) {
        setNotice(payload.error ?? text.actionFailed);
        return;
      }
      startTransition(() => {
        if (payload.entry) upsertEntry(payload.entry);
        else if (action === 'uninstall') clearInstallation(appId);
      });
      setNotice(text.actionComplete(actionLabel));
    } catch {
      setNotice(text.actionFailed);
    } finally {
      setBusyAppId(null);
    }
  }

  async function saveSettings(entry: BuilderAppCatalogEntry) {
    const appId = entry.manifest.appId;
    const draft = draftFor(entry);
    setSettingsBusyAppId(appId);
    setNotice(text.settingsSavePending);
    setSettingsErrors((current) => Object.fromEntries(
      Object.entries(current).filter(([key]) => !key.startsWith(`${appId}:`)),
    ));
    try {
      const response = await fetch(`/api/builder/apps/installations/${encodeURIComponent(appId)}/settings?locale=${locale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: draft }),
      });
      const payload = await response.json() as {
        ok?: boolean;
        error?: string;
        entry?: BuilderAppCatalogEntry;
        validationErrors?: Array<{ fieldId: string; message: string }>;
      };
      if (!response.ok || !payload.ok) {
        if (payload.validationErrors?.length) {
          setSettingsErrors((current) => ({
            ...current,
            ...Object.fromEntries(payload.validationErrors!.map((error) => [
              fieldErrorKey(appId, error.fieldId),
              error.message,
            ])),
          }));
        }
        setNotice(payload.error ?? text.settingsSaveFailed);
        return;
      }
      if (payload.entry) {
        upsertEntry(payload.entry);
        setSettingsDrafts((current) => ({
          ...current,
          [appId]: buildSettingsDraft(payload.entry!),
        }));
      }
      setNotice(text.settingsSaved);
    } catch {
      setNotice(text.settingsSaveFailed);
    } finally {
      setSettingsBusyAppId(null);
    }
  }

  function renderSettingField(
    entry: BuilderAppCatalogEntry,
    panel: BuilderAppSettingsPanel,
    field: BuilderAppSettingsPanel['fields'][number],
  ) {
    const appId = entry.manifest.appId;
    const draft = draftFor(entry);
    const value = draft[field.fieldId];
    const error = settingsErrors[fieldErrorKey(appId, field.fieldId)];
    const fieldDataId = `${appId}:${field.fieldId}`;
    const sharedProps = {
      'data-app-setting-field': fieldDataId,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${appId}-${field.fieldId}-error` : undefined,
    };

    return (
      <label key={field.fieldId} className="builder-app-settings-field">
        <span>
          {field.label}
          {field.required ? <em>{text.required}</em> : null}
        </span>
        {field.type === 'textarea' ? (
          <textarea
            {...sharedProps}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => updateSettingDraft(entry, field.fieldId, event.target.value)}
          />
        ) : field.type === 'boolean' ? (
          <input
            {...sharedProps}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => updateSettingDraft(entry, field.fieldId, event.target.checked)}
          />
        ) : field.type === 'select' ? (
          <select
            {...sharedProps}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => updateSettingDraft(entry, field.fieldId, event.target.value)}
          >
            <option value="">{text.selectPlaceholder}</option>
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            {...sharedProps}
            type={field.type === 'number' ? 'number' : 'text'}
            value={typeof value === 'number' || typeof value === 'string' ? value : ''}
            onChange={(event) => updateSettingDraft(entry, field.fieldId, event.target.value)}
          />
        )}
        {field.description ? <small>{field.description}</small> : null}
        {error ? <strong id={`${appId}-${field.fieldId}-error`}>{error}</strong> : null}
      </label>
    );
  }

  return (
    <div className="builder-dashboard-grid builder-app-market" data-app-market>
      <section className="builder-preview-inspector-card">
        <div className="builder-dashboard-page-head">
          <div>
            <strong>{text.title}</strong>
            <span>{text.description}</span>
          </div>
          <span className="builder-stage-pill builder-stage-pill--accent" aria-live="polite">
            {notice}
          </span>
        </div>

        <div className="builder-dashboard-kpi-grid">
          <article className="builder-dashboard-kpi-card">
            <strong>{entries.length}</strong>
            <span>{text.catalogApps}</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{installedCount}</strong>
            <span>{text.installed}</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{enabledCount}</strong>
            <span>{text.enabled}</span>
          </article>
        </div>

        <div className="builder-app-market-toolbar">
          <label>
            <span>{text.search}</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text.searchPlaceholder}
              data-app-market-search
            />
          </label>
          <label>
            <span>{text.category}</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as BuilderAppCategory | 'all')}
              data-app-market-category
            >
              <option value="all">{text.allCategories}</option>
              {BUILDER_APP_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>{text.status}</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              data-app-market-status-filter
            >
              <option value="all">{text.allStatuses}</option>
              <option value="installed">{text.installed}</option>
              <option value="enabled">{text.enabled}</option>
              <option value="disabled">{text.disabled}</option>
              <option value="not-installed">{text.notInstalled}</option>
            </select>
          </label>
        </div>
      </section>

      <section className="builder-native-app-dashboard" data-native-app-dashboard>
        <div className="builder-dashboard-page-head">
          <div>
            <strong>{text.installedNativeApps}</strong>
            <span>{text.installedNativeAppsDesc}</span>
          </div>
          <span className="builder-stage-pill builder-stage-pill--accent">
            {installedEntries.length} {text.installedSuffix}
          </span>
        </div>

        <div className="builder-dashboard-kpi-grid builder-native-app-dashboard-kpis">
          <article className="builder-dashboard-kpi-card">
            <strong>{enabledCount}</strong>
            <span>{text.enabledApps}</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{disabledCount}</strong>
            <span>{text.disabledApps}</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{updateCount}</strong>
            <span>{text.updatesAvailable}</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{settingsPanelCount}</strong>
            <span>{text.settingsPanels}</span>
          </article>
        </div>

        <div className="builder-native-app-dashboard-list">
          {installedEntries.map((entry) => {
            const { manifest, installation } = entry;
            const adminRoutes = manifest.routes.filter((route) => route.area === 'admin');
            const publicRoutes = manifest.routes.filter((route) => route.area === 'public' && !route.path.includes(':'));
            const failedMigrations = installation?.migrations?.filter((migration) => migration.status === 'failed') ?? [];
            return (
              <article
                key={manifest.appId}
                className="builder-native-app-dashboard-card"
                data-native-app-dashboard-card={manifest.appId}
                data-native-app-dashboard-status={installation?.status ?? 'not-installed'}
                data-native-app-dashboard-update={entry.versionState.updateAvailable ? 'available' : 'current'}
              >
                <div className="builder-native-app-dashboard-main">
                  <span className="builder-app-market-icon" aria-hidden="true">{manifest.icon}</span>
                  <div>
                    <strong>{manifest.name}</strong>
                    <span>{manifest.summary}</span>
                  </div>
                </div>

                <div className="builder-native-app-dashboard-state">
                  <span className={`builder-stage-pill${installation?.status === 'enabled' ? ' builder-stage-pill--accent' : ''}`}>
                    {installation?.status ? (installation.status === 'enabled' ? text.enabled : installation.status === 'disabled' ? text.disabled : text.installed) : text.notInstalled}
                  </span>
                  <span className="builder-stage-pill">
                    {entry.versionState.updateAvailable ? text.updateAvailable : text.current}
                  </span>
                  <span className={`builder-stage-pill${failedMigrations.length > 0 ? ' builder-stage-pill--danger' : ''}`}>
                    {failedMigrations.length > 0 ? text.migrationIssues(failedMigrations.length) : text.migrationsOk}
                  </span>
                </div>

                <div className="builder-native-app-dashboard-meta">
                  <span>{text.counts.widgets(manifest.widgets.length)}</span>
                  <span>{text.counts.settingsPanels(manifest.settingsPanels.length)}</span>
                  <span>{text.counts.adminRoutes(adminRoutes.length)}</span>
                  <span>{text.updatedPrefix} {installation?.updatedAt ?? '-'}</span>
                </div>

                <div className="builder-native-app-dashboard-actions">
                  {entry.versionState.updateAvailable ? (
                    <button
                      type="button"
                      className="builder-shell-button builder-shell-button--primary"
                      disabled={busyAppId === manifest.appId}
                      onClick={() => runAction(manifest.appId, 'update')}
                      data-native-app-update-action={manifest.appId}
                    >
                      {text.update}
                    </button>
                  ) : null}
                  {adminRoutes.map((route) => (
                    <a
                      key={route.routeId}
                      className="builder-shell-button builder-shell-button--primary"
                      href={localizedRouteHref(locale, route.path)}
                      data-native-app-admin-link={`${manifest.appId}:${route.routeId}`}
                    >
                    {route.label ?? text.manage}
                    </a>
                  ))}
                  {manifest.settingsPanels.length > 0 ? (
                    <a
                      className="builder-shell-button"
                      href={`#settings-${manifest.appId}`}
                      data-native-app-settings-link={manifest.appId}
                    >
                      {text.settings}
                    </a>
                  ) : null}
                  {publicRoutes.slice(0, 2).map((route) => (
                    <a
                      key={route.routeId}
                      className="builder-shell-button"
                      href={localizedRouteHref(locale, route.path)}
                      data-native-app-public-link={`${manifest.appId}:${route.routeId}`}
                    >
                    {route.label ?? text.open}
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
          {installedEntries.length === 0 ? (
            <article className="builder-native-app-dashboard-empty" data-native-app-dashboard-empty>
              <strong>{text.noInstalledApps}</strong>
              <span>{text.installNativeAppsHint}</span>
            </article>
          ) : null}
        </div>
      </section>

      <section className="builder-app-market-catalog" aria-live={isPending ? 'polite' : 'off'}>
        {filteredEntries.map((entry) => {
          const { manifest, installation } = entry;
          const uninstall = entry.uninstall;
          const disabled = busyAppId === manifest.appId;
          const latestAudit = installation?.audit[installation.audit.length - 1];
          const appliedMigrations = installation?.migrations?.filter((migration) => migration.status === 'applied') ?? [];
          const failedMigrations = installation?.migrations?.filter((migration) => migration.status === 'failed') ?? [];
          const latestMigration = installation?.migrations?.[installation.migrations.length - 1];
          const versionState = entry.versionState;
          const updateState = !installation
            ? 'not-installed'
            : versionState.updateAvailable
              ? 'available'
              : 'current';
          const compatibilityState = versionState.compatibility === 'compatible' ? 'compatible' : 'unsupported';
          const rollbackState = versionState.canRollback ? 'available' : 'unavailable';
          return (
            <article
              key={manifest.appId}
              className="builder-dashboard-page-card builder-app-market-card"
              data-app-card={manifest.appId}
              data-app-status={installation?.status ?? 'not-installed'}
            >
              <div className="builder-dashboard-page-head">
                <div>
                  <span className="builder-app-market-icon" aria-hidden="true">{manifest.icon}</span>
                  <strong>{manifest.name}</strong>
                  <span>{manifest.summary}</span>
                </div>
                <span className={`builder-stage-pill${installation?.status === 'enabled' ? ' builder-stage-pill--accent' : ''}`}>
                  {installationStatusLabel(text, installation?.status)}
                </span>
              </div>

              <p className="builder-app-market-description">{manifest.description}</p>

              <div className="builder-dashboard-page-meta">
                <span>{manifest.category}</span>
                <span>v{manifest.version}</span>
                <span>{text.counts.widgets(manifest.widgets.length)}</span>
                <span>{text.counts.settingsPanels(manifest.settingsPanels.length)}</span>
                <span>{text.counts.routes(manifest.routes.length)}</span>
                <span>{text.counts.migrations(manifest.migrations.length)}</span>
              </div>

              <div
                className="builder-app-market-version-health"
                data-app-version-health={manifest.appId}
                data-app-update-state={updateState}
                data-app-compat-state={compatibilityState}
                data-app-rollback-state={rollbackState}
              >
                <span data-app-update-chip>
                  <strong>
                    {!installation
                      ? text.latestVersion(versionState.latestVersion)
                      : versionState.updateAvailable
                        ? text.updateAvailable
                        : text.current}
                  </strong>
                  {installation ? (
                    <small>
                      {versionState.updateAvailable
                        ? text.installedLatestVersion(versionState.installedVersion ?? '-', versionState.latestVersion)
                        : text.installedVersion(versionState.installedVersion ?? '-')}
                    </small>
                  ) : null}
                </span>
                <span data-app-compat-chip>
                  <strong>
                      {versionState.compatibility === 'compatible'
                      ? text.compatible
                      : text.requiresBuilderVersion(manifest.compatibility.minBuilderVersion)}
                  </strong>
                  <small>{text.builderVersion(versionState.builderVersion)}</small>
                </span>
                {installation ? (
                  <span data-app-rollback-chip>
                    <strong>
                    {versionState.canRollback ? text.rollbackAvailable : text.rollbackUnavailable}
                    </strong>
                    {versionState.rollbackVersion ? <small>{text.previousVersion(versionState.rollbackVersion)}</small> : null}
                  </span>
                ) : null}
              </div>

              <div className="builder-app-market-scope-list" aria-label={`${manifest.name} ${text.permissions}`}>
                {manifest.permissions.map((permission) => (
                  <span key={permission} data-app-permission-scope={permission}>{permission}</span>
                ))}
              </div>

              {installation ? (
                <div
                  className="builder-app-market-scope-status"
                  data-app-scope-status={manifest.appId}
                  data-app-scope-state={installation.status === 'enabled' ? 'enforced' : 'disabled'}
                >
                  {installation.status === 'enabled'
                    ? text.grantedScopesEnforced(manifest.permissions.length)
                    : text.appDisabledScopesBlocked}
                </div>
              ) : null}

              {!installation && uninstall ? (
                <div
                  className="builder-app-market-uninstall"
                  data-app-uninstall-summary={manifest.appId}
                  data-app-uninstall-reversible={uninstall.reversible ? 'true' : 'false'}
                >
                  <strong>{text.uninstallArchive}</strong>
                  <span>
                    {uninstall.reversible ? text.dataKeptForRestore : text.dataRemovedAuditRetained}
                    {' · '}
                    {uninstall.cleanupMode}
                  </span>
                  <small>{text.uninstalledAt(uninstall.uninstalledAt)}</small>
                </div>
              ) : null}

              {installation ? (
                <div className="builder-app-market-audit">
                  <strong>{text.latestEvent}</strong>
                  <span>
                    {text.latestEventAt(auditEventLabel(text, latestAudit?.type), installation.updatedAt)}
                  </span>
                </div>
              ) : null}

              {installation ? (
                <label className="builder-app-uninstall-mode" data-app-uninstall-mode={manifest.appId}>
                  <span>{text.uninstallCleanup}</span>
                  <select
                    value={uninstallModes[manifest.appId] ?? 'keep-data'}
                    onChange={(event) => setUninstallModes((current) => ({
                      ...current,
                      [manifest.appId]: event.target.value as BuilderAppUninstallCleanupMode,
                    }))}
                    data-app-uninstall-cleanup={manifest.appId}
                  >
                    <option value="keep-data">{text.keepData}</option>
                    <option value="remove-data">{text.removeData}</option>
                  </select>
                </label>
              ) : null}

              {installation && manifest.migrations.length > 0 ? (
                <div
                  className="builder-app-market-migrations"
                  data-app-migration-summary={manifest.appId}
                  data-app-migration-status={failedMigrations.length > 0 ? 'failed' : 'applied'}
                >
                  <strong>{text.migrations}</strong>
                  <span>
                    {text.migrationsApplied(appliedMigrations.length, manifest.migrations.length)}
                    {failedMigrations.length > 0 ? ` · ${text.migrationFailures(failedMigrations.length)}` : ''}
                  </span>
                  {latestMigration ? (
                    <small>
                      {text.latestMigration(
                        latestMigration.migrationId,
                        text.migrationStatus[latestMigration.status],
                        latestMigration.ranAt,
                      )}
                    </small>
                  ) : null}
                </div>
              ) : null}

              {installation && manifest.settingsPanels.length > 0 ? (
                <div className="builder-app-settings" id={`settings-${manifest.appId}`} data-app-settings-panel={manifest.appId}>
                  {manifest.settingsPanels.map((panel) => (
                    <fieldset key={panel.panelId}>
                      <legend>{panel.name}</legend>
                      <div className="builder-app-settings-grid">
                        {panel.fields.map((field) => renderSettingField(entry, panel, field))}
                      </div>
                    </fieldset>
                  ))}
                  <div className="builder-dashboard-page-actions">
                    <button
                      type="button"
                      className="builder-shell-button builder-shell-button--primary"
                      disabled={settingsBusyAppId === manifest.appId}
                      onClick={() => saveSettings(entry)}
                      data-app-settings-save={manifest.appId}
                    >
                    {text.saveSettings}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="builder-dashboard-page-actions">
                {installation && versionState.updateAvailable ? (
                  <button
                    type="button"
                    className="builder-shell-button builder-shell-button--primary"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'update')}
                    data-app-action={`update-${manifest.appId}`}
                  >
                    {text.update}
                  </button>
                ) : null}
                {!installation && uninstall?.reversible ? (
                  <button
                    type="button"
                    className="builder-shell-button builder-shell-button--primary"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'restore')}
                    data-app-action={`restore-${manifest.appId}`}
                  >
                    {text.restore}
                  </button>
                ) : null}
                {!installation ? (
                  <button
                    type="button"
                    className={`builder-shell-button${uninstall?.reversible ? '' : ' builder-shell-button--primary'}`}
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'install')}
                    data-app-action={`install-${manifest.appId}`}
                  >
                    {uninstall ? text.installFresh : text.install}
                  </button>
                ) : installation.status === 'enabled' ? (
                  <button
                    type="button"
                    className="builder-shell-button"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'disable')}
                    data-app-action={`disable-${manifest.appId}`}
                  >
                    {text.disable}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="builder-shell-button builder-shell-button--primary"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'enable')}
                    data-app-action={`enable-${manifest.appId}`}
                  >
                    {text.enable}
                  </button>
                )}
                {installation ? (
                  versionState.canRollback ? (
                    <button
                      type="button"
                      className="builder-shell-button"
                      disabled={disabled}
                      onClick={() => runAction(manifest.appId, 'rollback')}
                      data-app-action={`rollback-${manifest.appId}`}
                    >
                      {text.rollback}
                    </button>
                  ) : null
                ) : null}
                {installation ? (
                  <button
                    type="button"
                    className="builder-shell-button builder-shell-button--danger"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'uninstall')}
                    data-app-action={`uninstall-${manifest.appId}`}
                  >
                    {text.uninstall}
                  </button>
                ) : null}
              </div>
            </article>
          );
        })}
        {filteredEntries.length === 0 ? (
          <article className="builder-dashboard-page-card" data-app-market-empty>
            <div className="builder-dashboard-page-head">
              <div>
                <strong>{text.noAppsFound}</strong>
                <span>{text.adjustFilters}</span>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </div>
  );
}
