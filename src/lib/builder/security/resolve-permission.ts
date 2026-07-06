/**
 * F99 — Adapter that ties the per-user role store to the granular
 * permission table. This is what `guardMutation` should consult once the
 * legacy single-admin shim is retired.
 *
 * Backward compatibility: if no role record exists for the authenticated
 * username, we fall back to the implicit `owner` role. This preserves
 * the current behavior where a freshly deployed instance with only basic
 * auth keeps full access.
 */

import { hasRoleAccess } from '@/lib/builder/security/role-permissions';
import type { BuilderPermission } from '@/lib/builder/security/permissions';
import { getConfiguredBasicAuthUsernames } from '@/lib/builder/security/basic-auth-users';
import {
  type BuilderRoleName,
  getUserRole,
  normalizeUsername,
} from '@/lib/builder/security/user-role-store';

function configuredOwnerUsernames(): readonly string[] {
  const usernames: string[] = [];
  const seen = new Set<string>();
  for (const candidate of [
    process.env.BUILDER_USERNAME,
    process.env.CMS_ADMIN_USERNAME,
    ...getConfiguredBasicAuthUsernames(),
  ]) {
    const username = normalizeUsername(candidate);
    if (!username) continue;
    const key = username.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    usernames.push(username);
  }
  if (usernames.length === 0) usernames.push('admin');
  return usernames;
}

function isConfiguredOwnerUsername(username: string): boolean {
  const normalized = normalizeUsername(username);
  return Boolean(normalized)
    && configuredOwnerUsernames().some(
      (owner) => normalized.toLowerCase() === owner.toLowerCase(),
    );
}

export async function resolveUserRole(username: string): Promise<BuilderRoleName> {
  const record = await getUserRole(username);
  if (record) return record.role;
  return isConfiguredOwnerUsername(username) ? 'owner' : 'client';
}

export async function userHasPermission(
  username: string,
  permission: BuilderPermission,
): Promise<boolean> {
  const role = await resolveUserRole(username);
  return hasRoleAccess(role, permission);
}
