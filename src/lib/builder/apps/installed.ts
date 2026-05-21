import type { Locale } from '@/lib/locales';
import { BUILDER_SCHEMA_VERSION } from '@/lib/builder/constants';
import {
  filterLocalBuilderAppManifests,
  findLocalBuilderAppManifest,
  localizeBuilderAppManifest,
} from '@/lib/builder/apps/catalog';
import {
  BUILDER_APP_CATEGORIES,
  normalizeBuilderUninstalledApps,
  normalizeBuilderInstalledApps,
  type BuilderAppCatalogEntry,
  type BuilderAppCategory,
  type BuilderAppInstallStatus,
  type BuilderAppManifest,
  type BuilderAppMigrationRun,
  type BuilderInstalledApp,
  type BuilderAppAuditEvent,
  type BuilderAppRollbackSnapshot,
  type BuilderAppSettingsPanel,
  type BuilderAppUninstallCleanupMode,
  type BuilderUninstalledAppArchive,
  type BuilderAppVersionState,
} from '@/lib/builder/apps/types';
import {
  listEnabledBuilderAppWidgetsFromInstalled,
  type BuilderRegisteredAppWidget,
} from '@/lib/builder/apps/widgets';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';

export interface BuilderAppCatalogQuery {
  search?: string;
  category?: BuilderAppCategory | 'all';
  status?: BuilderAppInstallStatus | 'installed' | 'not-installed' | 'all';
}

export interface BuilderAppLifecycleResult {
  entry: BuilderAppCatalogEntry;
  changed: boolean;
  migrations?: BuilderAppMigrationRun[];
  migrationFailed?: boolean;
  rollbackUnavailable?: boolean;
  restoreUnavailable?: boolean;
}

export interface BuilderAppSettingsValidationError {
  panelId: string;
  fieldId: string;
  message: string;
}

export interface BuilderAppSettingsValidationResult {
  settings: Record<string, string | number | boolean>;
  errors: BuilderAppSettingsValidationError[];
}

function nowIso(): string {
  return new Date().toISOString();
}

function createAuditEvent(
  type: BuilderAppAuditEvent['type'],
  actor: string,
  app: BuilderAppManifest,
  patch: Partial<BuilderAppAuditEvent> = {},
): BuilderAppAuditEvent {
  return {
    eventId: `app-event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    actor,
    at: nowIso(),
    toVersion: app.version,
    ...patch,
  };
}

function capAudit(events: BuilderAppAuditEvent[]): BuilderAppAuditEvent[] {
  return events.slice(-25);
}

function capMigrationRuns(runs: BuilderAppMigrationRun[]): BuilderAppMigrationRun[] {
  return runs.slice(-50);
}

function capUninstalledArchives(archives: BuilderUninstalledAppArchive[]): BuilderUninstalledAppArchive[] {
  return archives.slice(-50);
}

export function compareAppVersions(left: string, right: string): number {
  const leftParts = left.split(/[.-]/).slice(0, 3).map((part) => Number.parseInt(part, 10) || 0);
  const rightParts = right.split(/[.-]/).slice(0, 3).map((part) => Number.parseInt(part, 10) || 0);
  for (let index = 0; index < 3; index += 1) {
    const delta = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (delta !== 0) return delta > 0 ? 1 : -1;
  }
  return 0;
}

function cloneAppSettings(settings: Record<string, unknown> | undefined): Record<string, unknown> | undefined {
  if (!settings) return undefined;
  return JSON.parse(JSON.stringify(settings)) as Record<string, unknown>;
}

function captureRollbackSnapshot(
  app: BuilderInstalledApp,
  actor: string,
  capturedAt: string,
): BuilderAppRollbackSnapshot {
  const settings = cloneAppSettings(app.settings);
  return {
    version: app.version,
    status: app.status,
    capturedAt,
    actor,
    ...(settings ? { settings } : {}),
  };
}

export function resolveBuilderAppVersionState(
  manifest: BuilderAppManifest,
  installation?: BuilderInstalledApp,
  builderVersion = BUILDER_SCHEMA_VERSION,
): BuilderAppVersionState {
  const minCompatible = builderVersion >= manifest.compatibility.minBuilderVersion;
  const maxCompatible = typeof manifest.compatibility.maxBuilderVersion === 'number'
    ? builderVersion <= manifest.compatibility.maxBuilderVersion
    : true;
  const installedVersion = installation?.version;
  return {
    ...(installedVersion ? { installedVersion } : {}),
    latestVersion: manifest.version,
    updateAvailable: Boolean(installedVersion && compareAppVersions(manifest.version, installedVersion) > 0),
    compatibility: minCompatible && maxCompatible ? 'compatible' : 'incompatible',
    builderVersion,
    canRollback: Boolean(installation?.rollback),
    ...(installation?.rollback?.version ? { rollbackVersion: installation.rollback.version } : {}),
  };
}

export type BuilderAppMigrationHandler = (context: {
  manifest: BuilderAppManifest;
  migration: BuilderAppManifest['migrations'][number];
}) => Promise<void> | void;

const BUILDER_APP_MIGRATION_HANDLERS: Record<string, BuilderAppMigrationHandler> = {
  'search-install-v1': () => {},
  'faq-install-v1': () => {},
  'live-chat-install-v1': () => {},
  'inbox-install-v1': () => {},
  'appointments-install-v1': () => {},
  'newsletter-install-v1': () => {},
  'native-blog-install-v1': () => {},
  'native-members-install-v1': () => {},
  'native-events-install-v1': () => {},
  'native-portfolio-install-v1': () => {},
  'native-store-install-v1': () => {},
};

export async function runBuilderAppMigrations(
  manifest: BuilderAppManifest,
  existingRuns: BuilderAppMigrationRun[] | undefined,
  actor: string,
  ranAt: string,
  handlers: Record<string, BuilderAppMigrationHandler> = BUILDER_APP_MIGRATION_HANDLERS,
): Promise<{ migrations: BuilderAppMigrationRun[]; appliedCount: number; failedCount: number }> {
  const currentRuns = existingRuns ?? [];
  const appliedIds = new Set(
    currentRuns
      .filter((run) => run.status === 'applied')
      .map((run) => run.migrationId),
  );
  const nextRuns = [...currentRuns];
  let appliedCount = 0;
  let failedCount = 0;

  for (const migration of manifest.migrations) {
    if (appliedIds.has(migration.id)) continue;
    if (compareAppVersions(migration.toVersion, manifest.version) > 0) continue;
    try {
      const handler = handlers[migration.id];
      if (!handler) throw new Error(`No migration handler registered for ${migration.id}.`);
      await handler({ manifest, migration });
      nextRuns.push({
        migrationId: migration.id,
        ...(migration.fromVersion ? { fromVersion: migration.fromVersion } : {}),
        toVersion: migration.toVersion,
        status: 'applied',
        ranAt,
        actor,
        message: migration.description,
      });
      appliedIds.add(migration.id);
      appliedCount += 1;
    } catch (error) {
      nextRuns.push({
        migrationId: migration.id,
        ...(migration.fromVersion ? { fromVersion: migration.fromVersion } : {}),
        toVersion: migration.toVersion,
        status: 'failed',
        ranAt,
        actor,
        message: error instanceof Error ? error.message : 'Migration failed.',
      });
      failedCount += 1;
    }
  }

  return {
    migrations: capMigrationRuns(nextRuns),
    appliedCount,
    failedCount,
  };
}

function settingFieldEntries(manifest: BuilderAppManifest): Array<{
  panel: BuilderAppSettingsPanel;
  field: BuilderAppSettingsPanel['fields'][number];
}> {
  return manifest.settingsPanels.flatMap((panel) => panel.fields.map((field) => ({ panel, field })));
}

export function resolveBuilderAppDefaultSettings(manifest: BuilderAppManifest): Record<string, string | number | boolean> {
  const defaults: Record<string, string | number | boolean> = {};
  for (const { field } of settingFieldEntries(manifest)) {
    if (typeof field.defaultValue !== 'undefined') {
      defaults[field.fieldId] = field.defaultValue;
    } else if (field.type === 'boolean') {
      defaults[field.fieldId] = false;
    }
  }
  return defaults;
}

export function validateBuilderAppSettings(
  manifest: BuilderAppManifest,
  input: unknown,
): BuilderAppSettingsValidationResult {
  const source = input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
  const allowedFieldIds = new Set(settingFieldEntries(manifest).map(({ field }) => field.fieldId));
  const nextSettings: Record<string, string | number | boolean> = {};
  const errors: BuilderAppSettingsValidationError[] = [];

  for (const key of Object.keys(source)) {
    if (!allowedFieldIds.has(key)) {
      errors.push({ panelId: 'settings', fieldId: key, message: 'Unknown setting field.' });
    }
  }

  for (const { panel, field } of settingFieldEntries(manifest)) {
    const raw = Object.prototype.hasOwnProperty.call(source, field.fieldId)
      ? source[field.fieldId]
      : field.defaultValue;
    const addError = (message: string) => {
      errors.push({ panelId: panel.panelId, fieldId: field.fieldId, message });
    };

    if (field.type === 'text' || field.type === 'textarea') {
      if (typeof raw === 'undefined' || raw === null || raw === '') {
        if (field.required) addError(`${field.label} is required.`);
        continue;
      }
      if (typeof raw !== 'string') {
        addError(`${field.label} must be text.`);
        continue;
      }
      const trimmed = raw.trim();
      if (!trimmed) {
        if (field.required) addError(`${field.label} is required.`);
        continue;
      }
      const maxLength = field.type === 'textarea' ? 2000 : 300;
      if (trimmed.length > maxLength) {
        addError(`${field.label} must be ${maxLength} characters or fewer.`);
        continue;
      }
      nextSettings[field.fieldId] = trimmed;
      continue;
    }

    if (field.type === 'boolean') {
      if (typeof raw === 'undefined' || raw === null) {
        nextSettings[field.fieldId] = false;
        continue;
      }
      if (typeof raw !== 'boolean') {
        addError(`${field.label} must be true or false.`);
        continue;
      }
      nextSettings[field.fieldId] = raw;
      continue;
    }

    if (field.type === 'number') {
      if (typeof raw === 'undefined' || raw === null || raw === '') {
        if (field.required) addError(`${field.label} is required.`);
        continue;
      }
      const numeric = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : Number.NaN;
      if (!Number.isFinite(numeric)) {
        addError(`${field.label} must be a number.`);
        continue;
      }
      nextSettings[field.fieldId] = numeric;
      continue;
    }

    if (field.type === 'select') {
      if (typeof raw === 'undefined' || raw === null || raw === '') {
        if (field.required) addError(`${field.label} is required.`);
        continue;
      }
      if (typeof raw !== 'string') {
        addError(`${field.label} must be one of the configured options.`);
        continue;
      }
      const allowed = new Set((field.options ?? []).map((option) => option.value));
      if (!allowed.has(raw)) {
        addError(`${field.label} is not an allowed option.`);
        continue;
      }
      nextSettings[field.fieldId] = raw;
    }
  }

  return { settings: nextSettings, errors };
}

function installedByAppId(installedApps: BuilderInstalledApp[]): Map<string, BuilderInstalledApp> {
  return new Map(normalizeBuilderInstalledApps(installedApps).map((app) => [app.appId, app]));
}

function entryFor(
  app: BuilderAppManifest,
  installed?: BuilderInstalledApp,
  uninstall?: BuilderUninstalledAppArchive,
): BuilderAppCatalogEntry {
  return {
    manifest: app,
    ...(installed ? { installation: installed } : {}),
    ...(uninstall && !installed ? { uninstall } : {}),
    versionState: resolveBuilderAppVersionState(app, installed),
  };
}

function matchesStatus(
  installed: BuilderInstalledApp | undefined,
  status: BuilderAppCatalogQuery['status'],
): boolean {
  if (!status || status === 'all') return true;
  if (status === 'installed') return Boolean(installed);
  if (status === 'not-installed') return !installed;
  return installed?.status === status;
}

export function normalizeBuilderAppCategory(value: string | null | undefined): BuilderAppCategory | 'all' {
  if (!value || value === 'all') return 'all';
  return (BUILDER_APP_CATEGORIES as readonly string[]).includes(value) ? value as BuilderAppCategory : 'all';
}

export function normalizeBuilderAppStatus(value: string | null | undefined): BuilderAppCatalogQuery['status'] {
  if (!value || value === 'all') return 'all';
  if (value === 'installed' || value === 'not-installed' || value === 'enabled' || value === 'disabled') return value;
  return 'all';
}

export async function listBuilderAppCatalogEntries(
  siteId: string,
  locale: Locale,
  query: BuilderAppCatalogQuery = {},
): Promise<BuilderAppCatalogEntry[]> {
  const site = await readSiteDocument(siteId, locale);
  const installed = installedByAppId(site.installedApps ?? []);
  const uninstalled = new Map(
    normalizeBuilderUninstalledApps(site.uninstalledApps ?? []).map((archive) => [archive.appId, archive]),
  );
  return filterLocalBuilderAppManifests(query)
    .map((manifest) => entryFor(
      localizeBuilderAppManifest(manifest, site.translations, locale),
      installed.get(manifest.appId),
      uninstalled.get(manifest.appId),
    ))
    .filter((entry) => matchesStatus(entry.installation, query.status));
}

export async function listInstalledBuilderApps(siteId: string, locale: Locale): Promise<BuilderInstalledApp[]> {
  const site = await readSiteDocument(siteId, locale);
  return normalizeBuilderInstalledApps(site.installedApps ?? []);
}

export async function listEnabledBuilderAppWidgets(
  siteId: string,
  locale: Locale,
): Promise<BuilderRegisteredAppWidget[]> {
  const site = await readSiteDocument(siteId, locale);
  return listEnabledBuilderAppWidgetsFromInstalled(site.installedApps ?? []);
}

export async function installBuilderApp(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
): Promise<BuilderAppLifecycleResult | null> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) return null;

  const site = await readSiteDocument(siteId, locale);
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const existingIndex = installedApps.findIndex((app) => app.appId === manifest.appId);
  const at = nowIso();
  let changed = false;

  if (existingIndex >= 0) {
    const existing = installedApps[existingIndex];
    const upgradeNeeded = existing.version !== manifest.version;
    const enableNeeded = existing.status !== 'enabled';
    const migrationResult = await runBuilderAppMigrations(manifest, existing.migrations, actor, at);
    const migrationFailed = migrationResult.failedCount > 0;
    if (upgradeNeeded || enableNeeded || migrationResult.appliedCount > 0 || migrationFailed) {
      installedApps[existingIndex] = {
        ...existing,
        version: migrationFailed ? existing.version : manifest.version,
        status: migrationFailed ? existing.status : 'enabled',
        updatedAt: at,
        ...(migrationResult.migrations.length > 0 ? { migrations: migrationResult.migrations } : {}),
        ...(upgradeNeeded && !migrationFailed ? { rollback: captureRollbackSnapshot(existing, actor, at) } : {}),
        audit: capAudit([
          ...(existing.audit ?? []),
          createAuditEvent(migrationFailed ? 'migrations-failed' : upgradeNeeded ? 'upgraded' : enableNeeded ? 'enabled' : 'migrations-run', actor, manifest, {
            fromVersion: existing.version,
            note: migrationFailed
              ? `${migrationResult.failedCount} app migrations failed.`
              : upgradeNeeded
              ? 'Installed app upgraded during install.'
              : enableNeeded
                ? 'Existing app enabled during install.'
                : 'Missing app migrations were applied during install.',
          }),
        ]),
      };
      changed = true;
    }
  } else {
    const migrationResult = await runBuilderAppMigrations(manifest, [], actor, at);
    const migrationFailed = migrationResult.failedCount > 0;
    installedApps.push({
      appId: manifest.appId,
      version: manifest.version,
      status: migrationFailed ? 'disabled' : 'enabled',
      installedAt: at,
      updatedAt: at,
      settings: resolveBuilderAppDefaultSettings(manifest),
      ...(migrationResult.migrations.length > 0 ? { migrations: migrationResult.migrations } : {}),
      audit: [
        createAuditEvent(migrationFailed ? 'migrations-failed' : 'installed', actor, manifest, migrationFailed
          ? { note: `${migrationResult.failedCount} app migrations failed.` }
          : {}),
      ],
    });
    changed = true;
  }

  if (changed) {
    site.installedApps = installedApps;
    site.uninstalledApps = normalizeBuilderUninstalledApps(site.uninstalledApps ?? [])
      .filter((archive) => archive.appId !== manifest.appId);
    site.updatedAt = at;
    await writeSiteDocument(site, { deleteUninstalledAppIds: [manifest.appId] });
  }

  return {
    entry: entryFor(manifest, installedApps.find((app) => app.appId === manifest.appId)),
    changed,
    migrations: installedApps.find((app) => app.appId === manifest.appId)?.migrations,
    migrationFailed: installedApps.find((app) => app.appId === manifest.appId)?.migrations
      ?.some((migration) => migration.status === 'failed' && migration.ranAt === at),
  };
}

async function updateBuilderAppStatus(
  siteId: string,
  locale: Locale,
  appId: string,
  status: BuilderAppInstallStatus,
  actor: string,
): Promise<BuilderAppLifecycleResult | null> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) return null;

  const site = await readSiteDocument(siteId, locale);
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const index = installedApps.findIndex((app) => app.appId === manifest.appId);
  if (index < 0) return null;

  const existing = installedApps[index];
  const at = nowIso();
  const migrationResult = status === 'enabled'
    ? await runBuilderAppMigrations(manifest, existing.migrations, actor, at)
    : { migrations: existing.migrations ?? [], appliedCount: 0, failedCount: 0 };
  const migrationFailed = migrationResult.failedCount > 0;
  if (existing.status === status && migrationResult.appliedCount === 0 && !migrationFailed) {
    return { entry: entryFor(manifest, existing), changed: false };
  }

  const eventType = migrationFailed
    ? 'migrations-failed'
    : existing.status === status && migrationResult.appliedCount > 0
    ? 'migrations-run'
    : status === 'enabled' ? 'enabled' : 'disabled';
  const nextStatus = migrationFailed ? existing.status : status;
  installedApps[index] = {
    ...existing,
    status: nextStatus,
    updatedAt: at,
    ...(migrationResult.migrations.length > 0 ? { migrations: migrationResult.migrations } : {}),
    audit: capAudit([
      ...(existing.audit ?? []),
      createAuditEvent(eventType, actor, manifest, migrationFailed
        ? { note: `${migrationResult.failedCount} app migrations failed.` }
        : migrationResult.appliedCount > 0
          ? { note: `${migrationResult.appliedCount} app migrations applied.` }
        : {}),
    ]),
  };
  site.installedApps = installedApps;
  site.updatedAt = at;
  await writeSiteDocument(site);

  return {
    entry: entryFor(manifest, installedApps[index]),
    changed: true,
    migrations: migrationResult.migrations,
    migrationFailed,
  };
}

export function enableBuilderApp(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
): Promise<BuilderAppLifecycleResult | null> {
  return updateBuilderAppStatus(siteId, locale, appId, 'enabled', actor);
}

export function disableBuilderApp(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
): Promise<BuilderAppLifecycleResult | null> {
  return updateBuilderAppStatus(siteId, locale, appId, 'disabled', actor);
}

export async function rollbackBuilderApp(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
): Promise<BuilderAppLifecycleResult | null> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) return null;

  const site = await readSiteDocument(siteId, locale);
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const index = installedApps.findIndex((app) => app.appId === manifest.appId);
  if (index < 0) return null;

  const existing = installedApps[index];
  if (!existing.rollback) {
    return {
      entry: entryFor(manifest, existing),
      changed: false,
      rollbackUnavailable: true,
    };
  }

  const at = nowIso();
  const rollbackTarget = existing.rollback;
  const nextSettings = cloneAppSettings(rollbackTarget.settings);
  const nextApp: BuilderInstalledApp = {
    ...existing,
    version: rollbackTarget.version,
    status: rollbackTarget.status,
    updatedAt: at,
    rollback: captureRollbackSnapshot(existing, actor, at),
    audit: capAudit([
      ...(existing.audit ?? []),
      createAuditEvent('rolled-back', actor, manifest, {
        fromVersion: existing.version,
        toVersion: rollbackTarget.version,
        note: 'Installed app version state rolled back.',
      }),
    ]),
  };
  if (nextSettings) {
    nextApp.settings = nextSettings;
  } else {
    delete nextApp.settings;
  }

  installedApps[index] = nextApp;
  site.installedApps = installedApps;
  site.updatedAt = at;
  await writeSiteDocument(site);

  return {
    entry: entryFor(manifest, nextApp),
    changed: true,
  };
}

export async function restoreUninstalledBuilderApp(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
): Promise<BuilderAppLifecycleResult | null> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) return null;

  const site = await readSiteDocument(siteId, locale);
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const existing = installedApps.find((app) => app.appId === manifest.appId);
  const archives = normalizeBuilderUninstalledApps(site.uninstalledApps ?? []);
  const archive = archives.find((item) => item.appId === manifest.appId);
  if (existing) {
    return {
      entry: entryFor(manifest, existing, archive),
      changed: false,
      restoreUnavailable: true,
    };
  }
  if (!archive?.reversible || !archive.snapshot) {
    return {
      entry: entryFor(manifest, undefined, archive),
      changed: false,
      restoreUnavailable: true,
    };
  }

  const at = nowIso();
  const restoredApp: BuilderInstalledApp = {
    ...archive.snapshot,
    updatedAt: at,
    audit: capAudit([
      ...(archive.snapshot.audit ?? []),
      createAuditEvent('restored', actor, manifest, {
        fromVersion: archive.version,
        toVersion: archive.snapshot.version,
        note: `App restored from ${archive.cleanupMode} uninstall archive.`,
      }),
    ]),
  };
  site.installedApps = [...installedApps, restoredApp];
  site.uninstalledApps = archives.filter((item) => item.appId !== manifest.appId);
  site.updatedAt = at;
  await writeSiteDocument(site, { deleteUninstalledAppIds: [manifest.appId] });

  return {
    entry: entryFor(manifest, restoredApp),
    changed: true,
  };
}

export async function uninstallBuilderApp(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
  cleanupMode: BuilderAppUninstallCleanupMode = 'keep-data',
): Promise<{
  manifest: BuilderAppManifest;
  entry: BuilderAppCatalogEntry;
  archive?: BuilderUninstalledAppArchive;
  removed?: BuilderInstalledApp;
  changed: boolean;
} | null> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) return null;

  const site = await readSiteDocument(siteId, locale);
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const existing = installedApps.find((app) => app.appId === manifest.appId);
  const archives = normalizeBuilderUninstalledApps(site.uninstalledApps ?? []);
  const existingArchive = archives.find((archive) => archive.appId === manifest.appId);
  if (!existing) return { manifest, entry: entryFor(manifest, undefined, existingArchive), archive: existingArchive, changed: false };

  const at = nowIso();
  const uninstallEvent = createAuditEvent('uninstalled', actor, manifest, {
    fromVersion: existing.version,
    note: cleanupMode === 'keep-data'
      ? 'App uninstalled and data kept for restore.'
      : 'App uninstalled and app data removed; audit retained.',
  });
  const removed: BuilderInstalledApp = {
    ...existing,
    updatedAt: at,
    audit: capAudit([...(existing.audit ?? []), uninstallEvent]),
  };
  const archive: BuilderUninstalledAppArchive = {
    appId: manifest.appId,
    version: existing.version,
    cleanupMode,
    reversible: cleanupMode === 'keep-data',
    uninstalledAt: at,
    actor,
    ...(cleanupMode === 'keep-data' ? { snapshot: removed } : {}),
    audit: removed.audit,
  };
  site.installedApps = installedApps.filter((app) => app.appId !== manifest.appId);
  site.uninstalledApps = capUninstalledArchives([
    ...archives.filter((item) => item.appId !== manifest.appId),
    archive,
  ]);
  site.updatedAt = at;
  await writeSiteDocument(site, { deleteInstalledAppIds: [manifest.appId] });
  return { manifest, entry: entryFor(manifest, undefined, archive), archive, removed, changed: true };
}

export async function updateBuilderAppSettings(
  siteId: string,
  locale: Locale,
  appId: string,
  actor: string,
  settingsInput: unknown,
): Promise<BuilderAppLifecycleResult & { validationErrors?: BuilderAppSettingsValidationError[] } | null> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) return null;

  const validation = validateBuilderAppSettings(manifest, settingsInput);
  if (validation.errors.length > 0) {
    const site = await readSiteDocument(siteId, locale);
    const installed = normalizeBuilderInstalledApps(site.installedApps ?? [])
      .find((app) => app.appId === manifest.appId);
    if (!installed) return null;
    return {
      entry: entryFor(manifest, installed),
      changed: false,
      validationErrors: validation.errors,
    };
  }

  const site = await readSiteDocument(siteId, locale);
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const index = installedApps.findIndex((app) => app.appId === manifest.appId);
  if (index < 0) return null;

  const existing = installedApps[index];
  const changed = JSON.stringify(existing.settings ?? {}) !== JSON.stringify(validation.settings);
  if (!changed) {
    return { entry: entryFor(manifest, existing), changed: false };
  }

  const at = nowIso();
  installedApps[index] = {
    ...existing,
    settings: validation.settings,
    updatedAt: at,
    audit: capAudit([
      ...(existing.audit ?? []),
      createAuditEvent('settings-updated', actor, manifest, { note: 'App settings saved.' }),
    ]),
  };
  site.installedApps = installedApps;
  site.updatedAt = at;
  await writeSiteDocument(site);

  return { entry: entryFor(manifest, installedApps[index]), changed: true };
}
