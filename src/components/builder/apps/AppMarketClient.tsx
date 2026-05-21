'use client';

import { useMemo, useState, useTransition } from 'react';
import {
  BUILDER_APP_CATEGORIES,
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

export default function AppMarketClient({ locale, initialEntries }: AppMarketClientProps) {
  const [entries, setEntries] = useState(() => sortEntries(initialEntries));
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<BuilderAppCategory | 'all'>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [busyAppId, setBusyAppId] = useState<string | null>(null);
  const [settingsBusyAppId, setSettingsBusyAppId] = useState<string | null>(null);
  const [settingsDrafts, setSettingsDrafts] = useState<Record<string, SettingsDraft>>({});
  const [settingsErrors, setSettingsErrors] = useState<SettingsErrors>({});
  const [uninstallModes, setUninstallModes] = useState<Record<string, BuilderAppUninstallCleanupMode>>({});
  const [notice, setNotice] = useState('Ready');
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
    setNotice(`${action} pending`);
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
        throw new Error(payload.error ?? `Request failed (${response.status})`);
      }
      startTransition(() => {
        if (payload.entry) upsertEntry(payload.entry);
        else if (action === 'uninstall') clearInstallation(appId);
      });
      setNotice(`${action} complete`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'App action failed');
    } finally {
      setBusyAppId(null);
    }
  }

  async function saveSettings(entry: BuilderAppCatalogEntry) {
    const appId = entry.manifest.appId;
    const draft = draftFor(entry);
    setSettingsBusyAppId(appId);
    setNotice('settings save pending');
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
        throw new Error(payload.error ?? `Request failed (${response.status})`);
      }
      if (payload.entry) {
        upsertEntry(payload.entry);
        setSettingsDrafts((current) => ({
          ...current,
          [appId]: buildSettingsDraft(payload.entry!),
        }));
      }
      setNotice('settings saved');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Settings save failed');
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
          {field.required ? <em>Required</em> : null}
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
            <option value="">Select</option>
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
            <strong>App Market</strong>
            <span>Local catalog with manifest validation and lifecycle controls.</span>
          </div>
          <span className="builder-stage-pill builder-stage-pill--accent" aria-live="polite">
            {notice}
          </span>
        </div>

        <div className="builder-dashboard-kpi-grid">
          <article className="builder-dashboard-kpi-card">
            <strong>{entries.length}</strong>
            <span>Catalog apps</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{installedCount}</strong>
            <span>Installed</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{enabledCount}</strong>
            <span>Enabled</span>
          </article>
        </div>

        <div className="builder-app-market-toolbar">
          <label>
            <span>Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search apps, scopes, widgets"
              data-app-market-search
            />
          </label>
          <label>
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as BuilderAppCategory | 'all')}
              data-app-market-category
            >
              <option value="all">All categories</option>
              {BUILDER_APP_CATEGORIES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusFilter)}
              data-app-market-status-filter
            >
              <option value="all">All statuses</option>
              <option value="installed">Installed</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
              <option value="not-installed">Not installed</option>
            </select>
          </label>
        </div>
      </section>

      <section className="builder-native-app-dashboard" data-native-app-dashboard>
        <div className="builder-dashboard-page-head">
          <div>
            <strong>Installed native apps</strong>
            <span>Manage updates, settings, and app admin surfaces from one place.</span>
          </div>
          <span className="builder-stage-pill builder-stage-pill--accent">
            {installedEntries.length} installed
          </span>
        </div>

        <div className="builder-dashboard-kpi-grid builder-native-app-dashboard-kpis">
          <article className="builder-dashboard-kpi-card">
            <strong>{enabledCount}</strong>
            <span>Enabled apps</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{disabledCount}</strong>
            <span>Disabled apps</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{updateCount}</strong>
            <span>Updates available</span>
          </article>
          <article className="builder-dashboard-kpi-card">
            <strong>{settingsPanelCount}</strong>
            <span>Settings panels</span>
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
                    {installation?.status ?? 'not installed'}
                  </span>
                  <span className="builder-stage-pill">
                    {entry.versionState.updateAvailable ? 'update available' : 'current'}
                  </span>
                  <span className={`builder-stage-pill${failedMigrations.length > 0 ? ' builder-stage-pill--danger' : ''}`}>
                    {failedMigrations.length > 0 ? `${failedMigrations.length} migration issues` : 'migrations ok'}
                  </span>
                </div>

                <div className="builder-native-app-dashboard-meta">
                  <span>{manifest.widgets.length} widgets</span>
                  <span>{manifest.settingsPanels.length} settings panels</span>
                  <span>{adminRoutes.length} admin routes</span>
                  <span>updated {installation?.updatedAt ?? '-'}</span>
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
                      Update
                    </button>
                  ) : null}
                  {adminRoutes.map((route) => (
                    <a
                      key={route.routeId}
                      className="builder-shell-button builder-shell-button--primary"
                      href={localizedRouteHref(locale, route.path)}
                      data-native-app-admin-link={`${manifest.appId}:${route.routeId}`}
                    >
                      {route.label ?? 'Manage'}
                    </a>
                  ))}
                  {manifest.settingsPanels.length > 0 ? (
                    <a
                      className="builder-shell-button"
                      href={`#settings-${manifest.appId}`}
                      data-native-app-settings-link={manifest.appId}
                    >
                      Settings
                    </a>
                  ) : null}
                  {publicRoutes.slice(0, 2).map((route) => (
                    <a
                      key={route.routeId}
                      className="builder-shell-button"
                      href={localizedRouteHref(locale, route.path)}
                      data-native-app-public-link={`${manifest.appId}:${route.routeId}`}
                    >
                      {route.label ?? 'Open'}
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
          {installedEntries.length === 0 ? (
            <article className="builder-native-app-dashboard-empty" data-native-app-dashboard-empty>
              <strong>No installed apps</strong>
              <span>Install native apps from the catalog below to manage them here.</span>
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
                  {installation?.status ?? 'not installed'}
                </span>
              </div>

              <p className="builder-app-market-description">{manifest.description}</p>

              <div className="builder-dashboard-page-meta">
                <span>{manifest.category}</span>
                <span>v{manifest.version}</span>
                <span>{manifest.widgets.length} widgets</span>
                <span>{manifest.settingsPanels.length} settings panels</span>
                <span>{manifest.routes.length} routes</span>
                <span>{manifest.migrations.length} migrations</span>
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
                      ? `Latest v${versionState.latestVersion}`
                      : versionState.updateAvailable
                        ? 'Update available'
                        : 'Current version'}
                  </strong>
                  {installation ? (
                    <small>
                      {versionState.updateAvailable
                        ? `Installed v${versionState.installedVersion} · Latest v${versionState.latestVersion}`
                        : `Installed v${versionState.installedVersion}`}
                    </small>
                  ) : null}
                </span>
                <span data-app-compat-chip>
                  <strong>
                    {versionState.compatibility === 'compatible'
                      ? 'Compatible'
                      : `Requires builder v${manifest.compatibility.minBuilderVersion}+`}
                  </strong>
                  <small>Builder v{versionState.builderVersion}</small>
                </span>
                {installation ? (
                  <span data-app-rollback-chip>
                    <strong>
                      {versionState.canRollback ? 'Rollback available' : 'No rollback point'}
                    </strong>
                    {versionState.rollbackVersion ? <small>Previous v{versionState.rollbackVersion}</small> : null}
                  </span>
                ) : null}
              </div>

              <div className="builder-app-market-scope-list" aria-label={`${manifest.name} permissions`}>
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
                    ? `${manifest.permissions.length} granted scopes enforced`
                    : 'App disabled; scopes blocked'}
                </div>
              ) : null}

              {!installation && uninstall ? (
                <div
                  className="builder-app-market-uninstall"
                  data-app-uninstall-summary={manifest.appId}
                  data-app-uninstall-reversible={uninstall.reversible ? 'true' : 'false'}
                >
                  <strong>Uninstall archive</strong>
                  <span>
                    {uninstall.reversible ? 'Data kept for restore' : 'Data removed; audit retained'}
                    {' · '}
                    {uninstall.cleanupMode}
                  </span>
                  <small>Uninstalled at {uninstall.uninstalledAt}</small>
                </div>
              ) : null}

              {installation ? (
                <div className="builder-app-market-audit">
                  <strong>Latest event</strong>
                  <span>
                    {latestAudit?.type ?? 'installed'} at {installation.updatedAt}
                  </span>
                </div>
              ) : null}

              {installation ? (
                <label className="builder-app-uninstall-mode" data-app-uninstall-mode={manifest.appId}>
                  <span>Uninstall cleanup</span>
                  <select
                    value={uninstallModes[manifest.appId] ?? 'keep-data'}
                    onChange={(event) => setUninstallModes((current) => ({
                      ...current,
                      [manifest.appId]: event.target.value as BuilderAppUninstallCleanupMode,
                    }))}
                    data-app-uninstall-cleanup={manifest.appId}
                  >
                    <option value="keep-data">Keep data for restore</option>
                    <option value="remove-data">Remove data, keep audit</option>
                  </select>
                </label>
              ) : null}

              {installation && manifest.migrations.length > 0 ? (
                <div
                  className="builder-app-market-migrations"
                  data-app-migration-summary={manifest.appId}
                  data-app-migration-status={failedMigrations.length > 0 ? 'failed' : 'applied'}
                >
                  <strong>Migrations</strong>
                  <span>
                    {appliedMigrations.length}/{manifest.migrations.length} migrations applied
                    {failedMigrations.length > 0 ? ` · ${failedMigrations.length} failed` : ''}
                  </span>
                  {latestMigration ? (
                    <small>
                      Last: {latestMigration.migrationId} · {latestMigration.status} at {latestMigration.ranAt}
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
                      Save settings
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
                    Update
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
                    Restore
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
                    {uninstall ? 'Install fresh' : 'Install'}
                  </button>
                ) : installation.status === 'enabled' ? (
                  <button
                    type="button"
                    className="builder-shell-button"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'disable')}
                    data-app-action={`disable-${manifest.appId}`}
                  >
                    Disable
                  </button>
                ) : (
                  <button
                    type="button"
                    className="builder-shell-button builder-shell-button--primary"
                    disabled={disabled}
                    onClick={() => runAction(manifest.appId, 'enable')}
                    data-app-action={`enable-${manifest.appId}`}
                  >
                    Enable
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
                      Rollback
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
                    Uninstall
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
                <strong>No apps found</strong>
                <span>Adjust search, category, or status filters.</span>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </div>
  );
}
