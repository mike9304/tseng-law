import type { Locale } from '@/lib/locales';
import { findLocalBuilderAppManifest } from '@/lib/builder/apps/catalog';
import {
  BUILDER_APP_PERMISSION_SCOPES,
  normalizeBuilderInstalledApps,
  type BuilderAppPermissionScope,
} from '@/lib/builder/apps/types';
import { readSiteDocument } from '@/lib/builder/site/persistence';

export type BuilderAppScopeErrorCode =
  | 'app_not_found'
  | 'app_not_installed'
  | 'app_disabled'
  | 'app_scope_unknown'
  | 'app_scope_not_granted';

export class BuilderAppScopeError extends Error {
  constructor(
    public readonly code: BuilderAppScopeErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'BuilderAppScopeError';
  }
}

export function isBuilderAppPermissionScope(value: string): value is BuilderAppPermissionScope {
  return (BUILDER_APP_PERMISSION_SCOPES as readonly string[]).includes(value);
}

export async function authorizeBuilderAppScope(
  siteId: string,
  locale: Locale,
  appId: string,
  scope: BuilderAppPermissionScope,
): Promise<{ appId: string; scope: BuilderAppPermissionScope }> {
  const manifest = findLocalBuilderAppManifest(appId);
  if (!manifest) {
    throw new BuilderAppScopeError('app_not_found', 'App manifest was not found.');
  }

  const site = await readSiteDocument(siteId, locale);
  const installation = normalizeBuilderInstalledApps(site.installedApps ?? [])
    .find((installedApp) => installedApp.appId === manifest.appId);
  if (!installation) {
    throw new BuilderAppScopeError('app_not_installed', 'App is not installed.');
  }

  if (installation.status !== 'enabled') {
    throw new BuilderAppScopeError('app_disabled', 'App is disabled.');
  }

  if (!manifest.permissions.includes(scope)) {
    throw new BuilderAppScopeError('app_scope_not_granted', `App does not declare ${scope}.`);
  }

  return { appId: manifest.appId, scope };
}

export function parseBuilderAppScope(value: unknown): BuilderAppPermissionScope {
  if (typeof value !== 'string' || !isBuilderAppPermissionScope(value)) {
    throw new BuilderAppScopeError('app_scope_unknown', 'Unknown app permission scope.');
  }
  return value;
}
