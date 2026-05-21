/**
 * Phase Wix-Studio — Account workspace model (v1, single-account).
 *
 * The account is the top-level grouping above sites. v1 hard-codes a single
 * account (`DEFAULT_BUILDER_WORKSPACE_ID`) that every known site rolls up to;
 * the types below are intentionally written so a future multi-account release
 * can keep the same shapes and just add account routing.
 */

export type BuilderWorkspaceRole = 'owner' | 'editor' | 'viewer';

export const BUILDER_WORKSPACE_ROLES: readonly BuilderWorkspaceRole[] = [
  'owner',
  'editor',
  'viewer',
] as const;

export function isBuilderWorkspaceRole(value: unknown): value is BuilderWorkspaceRole {
  return typeof value === 'string'
    && (BUILDER_WORKSPACE_ROLES as readonly string[]).includes(value);
}

export interface BuilderAccount {
  id: string;
  name: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuilderWorkspaceSite {
  siteId: string;
  name: string;
  accountId: string;
  role: BuilderWorkspaceRole;
  createdAt: string;
}

export interface BuilderWorkspaceMember {
  email: string;
  accountId: string;
  role: BuilderWorkspaceRole;
  addedAt: string;
}

/**
 * Storage envelope. Single JSON file holds the account record together with
 * the site / member rosters. Keeping them in one document mirrors the
 * `BuilderSiteDocument` design and lets writes share a single mutex.
 */
export interface BuilderWorkspaceDocument {
  account: BuilderAccount;
  sites: BuilderWorkspaceSite[];
  members: BuilderWorkspaceMember[];
}

export function normalizeWorkspaceEmail(input: string | null | undefined): string {
  return (input ?? '').trim().toLowerCase();
}