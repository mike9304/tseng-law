import { z } from 'zod';
import type { Locale } from '@/lib/locales';

export const BUILDER_APP_CATEGORIES = [
  'content',
  'marketing',
  'booking',
  'commerce',
  'support',
  'analytics',
  'utility',
] as const;

export const BUILDER_APP_PERMISSION_SCOPES = [
  'site:read',
  'site:write',
  'cms:read',
  'cms:write',
  'forms:read',
  'forms:write',
  'media:read',
  'media:write',
  'members:read',
  'members:write',
  'bookings:read',
  'bookings:write',
  'commerce:read',
  'commerce:write',
  'analytics:read',
  'publish:write',
] as const;

export const BUILDER_APP_ROUTE_AREAS = ['admin', 'public', 'api'] as const;
export const BUILDER_APP_WIDGET_AREAS = ['section', 'inline', 'overlay', 'system'] as const;
export const BUILDER_APP_SETTING_FIELD_TYPES = ['text', 'textarea', 'boolean', 'select', 'number'] as const;
export const BUILDER_APP_INSTALL_STATUSES = ['enabled', 'disabled'] as const;
export const BUILDER_APP_UNINSTALL_CLEANUP_MODES = ['keep-data', 'remove-data'] as const;

const appIdSchema = z.string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z][a-z0-9-]*$/);

const appVersionSchema = z.string()
  .trim()
  .min(1)
  .max(40)
  .regex(/^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/i);

export const builderAppWidgetSchema = z.object({
  widgetId: appIdSchema,
  name: z.string().trim().min(1).max(80),
  area: z.enum(BUILDER_APP_WIDGET_AREAS),
  component: z.string().trim().min(1).max(160),
  description: z.string().trim().max(300).optional(),
  defaultContent: z.record(z.string(), z.unknown()).optional(),
  defaultSize: z.object({
    width: z.number().int().min(1).max(4000),
    height: z.number().int().min(1).max(4000),
  }).strict().optional(),
}).strict();

export const builderAppSettingsFieldSchema = z.object({
  fieldId: appIdSchema,
  label: z.string().trim().min(1).max(80),
  type: z.enum(BUILDER_APP_SETTING_FIELD_TYPES),
  required: z.boolean().optional(),
  description: z.string().trim().max(240).optional(),
  options: z.array(z.object({
    label: z.string().trim().min(1).max(80),
    value: z.string().trim().min(1).max(120),
  }).strict()).max(20).optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
}).strict();

export const builderAppSettingsPanelSchema = z.object({
  panelId: appIdSchema,
  name: z.string().trim().min(1).max(80),
  fields: z.array(builderAppSettingsFieldSchema).max(40),
}).strict();

export const builderAppRouteSchema = z.object({
  routeId: appIdSchema,
  area: z.enum(BUILDER_APP_ROUTE_AREAS),
  path: z.string().trim().min(1).max(240).regex(/^\/[a-z0-9/_:.-]*$/i),
  label: z.string().trim().min(1).max(80).optional(),
}).strict();

export const builderAppMigrationSchema = z.object({
  id: appIdSchema,
  fromVersion: appVersionSchema.optional(),
  toVersion: appVersionSchema,
  description: z.string().trim().min(1).max(240),
}).strict();

export const builderAppManifestSchema = z.object({
  appId: appIdSchema,
  name: z.string().trim().min(1).max(80),
  summary: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(700),
  version: appVersionSchema,
  category: z.enum(BUILDER_APP_CATEGORIES),
  developer: z.string().trim().min(1).max(120),
  icon: z.string().trim().min(1).max(12),
  permissions: z.array(z.enum(BUILDER_APP_PERMISSION_SCOPES)).max(40),
  widgets: z.array(builderAppWidgetSchema).max(30).default([]),
  settingsPanels: z.array(builderAppSettingsPanelSchema).max(12).default([]),
  routes: z.array(builderAppRouteSchema).max(30).default([]),
  migrations: z.array(builderAppMigrationSchema).max(20).default([]),
  translations: z.record(z.string().trim().min(1), z.record(z.string().trim().min(1), z.string())).default({}),
  compatibility: z.object({
    minBuilderVersion: z.number().int().min(1),
    maxBuilderVersion: z.number().int().min(1).optional(),
  }).strict(),
}).strict();

export type BuilderAppCategory = (typeof BUILDER_APP_CATEGORIES)[number];
export type BuilderAppPermissionScope = (typeof BUILDER_APP_PERMISSION_SCOPES)[number];
export type BuilderAppManifest = z.infer<typeof builderAppManifestSchema>;
export type BuilderAppWidget = z.infer<typeof builderAppWidgetSchema>;
export type BuilderAppSettingsPanel = z.infer<typeof builderAppSettingsPanelSchema>;
export type BuilderAppInstallStatus = (typeof BUILDER_APP_INSTALL_STATUSES)[number];
export type BuilderAppUninstallCleanupMode = (typeof BUILDER_APP_UNINSTALL_CLEANUP_MODES)[number];

export interface BuilderAppAuditEvent {
  eventId: string;
  type: 'installed' | 'enabled' | 'disabled' | 'upgraded' | 'rolled-back' | 'restored' | 'settings-updated' | 'migrations-run' | 'migrations-failed' | 'uninstalled';
  actor: string;
  at: string;
  fromVersion?: string;
  toVersion?: string;
  note?: string;
}

export interface BuilderAppMigrationRun {
  migrationId: string;
  fromVersion?: string;
  toVersion: string;
  status: 'applied' | 'failed';
  ranAt: string;
  actor: string;
  message?: string;
}

export interface BuilderAppRollbackSnapshot {
  version: string;
  status: BuilderAppInstallStatus;
  capturedAt: string;
  actor: string;
  settings?: Record<string, unknown>;
}

export interface BuilderInstalledApp {
  appId: string;
  version: string;
  status: BuilderAppInstallStatus;
  installedAt: string;
  updatedAt: string;
  settings?: Record<string, unknown>;
  localizedSettings?: Partial<Record<Locale, Record<string, unknown>>>;
  migrations?: BuilderAppMigrationRun[];
  rollback?: BuilderAppRollbackSnapshot;
  audit: BuilderAppAuditEvent[];
}

export interface BuilderUninstalledAppArchive {
  appId: string;
  version: string;
  cleanupMode: BuilderAppUninstallCleanupMode;
  reversible: boolean;
  uninstalledAt: string;
  actor: string;
  snapshot?: BuilderInstalledApp;
  audit: BuilderAppAuditEvent[];
}

export interface BuilderAppVersionState {
  installedVersion?: string;
  latestVersion: string;
  updateAvailable: boolean;
  compatibility: 'compatible' | 'incompatible';
  builderVersion: number;
  canRollback: boolean;
  rollbackVersion?: string;
}

export interface BuilderAppCatalogEntry {
  manifest: BuilderAppManifest;
  installation?: BuilderInstalledApp;
  uninstall?: BuilderUninstalledAppArchive;
  versionState: BuilderAppVersionState;
}

export function parseBuilderAppManifest(input: unknown): BuilderAppManifest {
  return builderAppManifestSchema.parse(input);
}

function normalizeAuditEvent(input: unknown): BuilderAppAuditEvent | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Partial<BuilderAppAuditEvent>;
  if (
    typeof record.type !== 'string' ||
    !['installed', 'enabled', 'disabled', 'upgraded', 'rolled-back', 'restored', 'settings-updated', 'migrations-run', 'migrations-failed', 'uninstalled'].includes(record.type)
  ) {
    return null;
  }
  const eventType = record.type as BuilderAppAuditEvent['type'];
  const at = typeof record.at === 'string' && Number.isFinite(Date.parse(record.at)) ? record.at : new Date().toISOString();
  return {
    eventId: typeof record.eventId === 'string' && record.eventId.trim() ? record.eventId : `app-event-${Date.now()}`,
    type: eventType,
    actor: typeof record.actor === 'string' && record.actor.trim() ? record.actor : 'system',
    at,
    ...(typeof record.fromVersion === 'string' ? { fromVersion: record.fromVersion } : {}),
    ...(typeof record.toVersion === 'string' ? { toVersion: record.toVersion } : {}),
    ...(typeof record.note === 'string' && record.note.trim() ? { note: record.note.trim().slice(0, 300) } : {}),
  };
}

function normalizeMigrationRun(input: unknown): BuilderAppMigrationRun | null {
  if (!input || typeof input !== 'object') return null;
  const record = input as Partial<BuilderAppMigrationRun>;
  if (typeof record.migrationId !== 'string' || !record.migrationId.trim()) return null;
  if (typeof record.toVersion !== 'string' || !appVersionSchema.safeParse(record.toVersion).success) return null;
  if (record.status !== 'applied' && record.status !== 'failed') return null;
  const ranAt = typeof record.ranAt === 'string' && Number.isFinite(Date.parse(record.ranAt))
    ? record.ranAt
    : new Date().toISOString();
  return {
    migrationId: record.migrationId.trim().slice(0, 80),
    ...(typeof record.fromVersion === 'string' && appVersionSchema.safeParse(record.fromVersion).success
      ? { fromVersion: record.fromVersion }
      : {}),
    toVersion: record.toVersion,
    status: record.status,
    ranAt,
    actor: typeof record.actor === 'string' && record.actor.trim() ? record.actor.trim().slice(0, 120) : 'system',
    ...(typeof record.message === 'string' && record.message.trim() ? { message: record.message.trim().slice(0, 300) } : {}),
  };
}

function normalizeRollbackSnapshot(input: unknown): BuilderAppRollbackSnapshot | undefined {
  if (!input || typeof input !== 'object') return undefined;
  const record = input as Partial<BuilderAppRollbackSnapshot>;
  if (typeof record.version !== 'string' || !appVersionSchema.safeParse(record.version).success) return undefined;
  const status = record.status === 'disabled' ? 'disabled' : 'enabled';
  const capturedAt = typeof record.capturedAt === 'string' && Number.isFinite(Date.parse(record.capturedAt))
    ? record.capturedAt
    : new Date().toISOString();
  const settings = record.settings && typeof record.settings === 'object' && !Array.isArray(record.settings)
    ? record.settings
    : undefined;
  return {
    version: record.version,
    status,
    capturedAt,
    actor: typeof record.actor === 'string' && record.actor.trim() ? record.actor.trim().slice(0, 120) : 'system',
    ...(settings ? { settings } : {}),
  };
}

export function normalizeBuilderInstalledApps(value: unknown): BuilderInstalledApp[] {
  if (!Array.isArray(value)) return [];
  const normalized: BuilderInstalledApp[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Partial<BuilderInstalledApp>;
    if (typeof record.appId !== 'string' || !appIdSchema.safeParse(record.appId).success) continue;
    if (seen.has(record.appId)) continue;
    const version = typeof record.version === 'string' && appVersionSchema.safeParse(record.version).success
      ? record.version
      : '0.0.0';
    const status = record.status === 'disabled' ? 'disabled' : 'enabled';
    const installedAt = typeof record.installedAt === 'string' && Number.isFinite(Date.parse(record.installedAt))
      ? record.installedAt
      : new Date().toISOString();
    const updatedAt = typeof record.updatedAt === 'string' && Number.isFinite(Date.parse(record.updatedAt))
      ? record.updatedAt
      : installedAt;
    const settings = record.settings && typeof record.settings === 'object' && !Array.isArray(record.settings)
      ? record.settings
      : undefined;
    const localizedSettings = record.localizedSettings && typeof record.localizedSettings === 'object' && !Array.isArray(record.localizedSettings)
      ? Object.fromEntries(
          Object.entries(record.localizedSettings as Record<string, unknown>)
            .filter(([locale, settingsValue]) => (
              (locale === 'ko' || locale === 'zh-hant' || locale === 'en') &&
              settingsValue &&
              typeof settingsValue === 'object' &&
              !Array.isArray(settingsValue)
            ))
            .map(([locale, settingsValue]) => [locale, settingsValue as Record<string, unknown>]),
        ) as Partial<Record<Locale, Record<string, unknown>>>
      : undefined;
    const migrations = (Array.isArray(record.migrations) ? record.migrations : [])
      .map(normalizeMigrationRun)
      .filter((migration): migration is BuilderAppMigrationRun => Boolean(migration))
      .slice(-50);
    const rollback = normalizeRollbackSnapshot(record.rollback);
    normalized.push({
      appId: record.appId,
      version,
      status,
      installedAt,
      updatedAt,
      ...(settings ? { settings } : {}),
      ...(localizedSettings && Object.keys(localizedSettings).length > 0 ? { localizedSettings } : {}),
      ...(migrations.length > 0 ? { migrations } : {}),
      ...(rollback ? { rollback } : {}),
      audit: (Array.isArray(record.audit) ? record.audit : [])
        .map(normalizeAuditEvent)
        .filter((event): event is BuilderAppAuditEvent => Boolean(event))
        .slice(-25),
    });
    seen.add(record.appId);
  }
  return normalized;
}

export function normalizeBuilderUninstalledApps(value: unknown): BuilderUninstalledAppArchive[] {
  if (!Array.isArray(value)) return [];
  const byAppId = new Map<string, BuilderUninstalledAppArchive>();

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Partial<BuilderUninstalledAppArchive>;
    if (typeof record.appId !== 'string' || !appIdSchema.safeParse(record.appId).success) continue;
    const snapshot = record.snapshot
      ? normalizeBuilderInstalledApps([record.snapshot]).find((app) => app.appId === record.appId)
      : undefined;
    const version = typeof record.version === 'string' && appVersionSchema.safeParse(record.version).success
      ? record.version
      : snapshot?.version ?? '0.0.0';
    const cleanupMode: BuilderAppUninstallCleanupMode = record.cleanupMode === 'remove-data' ? 'remove-data' : 'keep-data';
    const uninstalledAt = typeof record.uninstalledAt === 'string' && Number.isFinite(Date.parse(record.uninstalledAt))
      ? record.uninstalledAt
      : new Date().toISOString();
    const reversible = cleanupMode === 'keep-data' && Boolean(snapshot) && record.reversible !== false;
    const archive: BuilderUninstalledAppArchive = {
      appId: record.appId,
      version,
      cleanupMode,
      reversible,
      uninstalledAt,
      actor: typeof record.actor === 'string' && record.actor.trim() ? record.actor.trim().slice(0, 120) : 'system',
      ...(snapshot && cleanupMode === 'keep-data' ? { snapshot } : {}),
      audit: (Array.isArray(record.audit) ? record.audit : snapshot?.audit ?? [])
        .map(normalizeAuditEvent)
        .filter((event): event is BuilderAppAuditEvent => Boolean(event))
        .slice(-25),
    };
    const existing = byAppId.get(archive.appId);
    if (!existing || Date.parse(archive.uninstalledAt) >= Date.parse(existing.uninstalledAt)) {
      byAppId.set(archive.appId, archive);
    }
  }

  return [...byAppId.values()]
    .sort((left, right) => Date.parse(left.uninstalledAt) - Date.parse(right.uninstalledAt))
    .slice(-50);
}
