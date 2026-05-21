/**
 * F99 — Pure role -> permission lookup for the per-user RBAC layer.
 *
 * This module is intentionally pure (no I/O) and the source of truth for
 * which builder permissions each named role can perform. Keep it free of
 * imports from the legacy `hasBuilderPermission` so callers can rely on
 * the table without pulling in coarse-permission code paths.
 */

import type { BuilderPermission } from '@/lib/builder/security/permissions';
import type { BuilderRoleName } from '@/lib/builder/security/user-role-store';

/**
 * Granular permissions per named role. Owner is computed dynamically as
 * "everything" so we never forget to add new permissions for them.
 */
const NON_OWNER_PERMISSIONS: Record<
  Exclude<BuilderRoleName, 'owner'>,
  readonly BuilderPermission[]
> = {
  admin: [
    'edit-pages',
    'publish',
    'delete-pages',
    'edit-blog',
    'manage-forms',
    'edit-seo',
    'manage-campaigns',
    'view-campaigns',
    'manage-subscribers',
    'manage-cases',
    'view-cases',
    'manage-contacts',
    'view-contacts',
    'manage-bookings',
    'view-bookings',
    'manage-users',
    'manage-search',
    'manage-translations',
    'view-cms',
    'settings',
  ],
  designer: [
    'edit-pages',
    'view-cms',
    'view-bookings',
    'manage-translations',
  ],
  editor: [
    'edit-pages',
    'view-cms',
  ],
  client: [
    'view-cms',
    'view-bookings',
  ],
};

/**
 * Returns the full permission list for a role. Owner gets everything in
 * BUILDER_PERMISSIONS (computed at call time, so future permissions
 * automatically apply).
 */
export function listRolePermissions(
  role: BuilderRoleName,
  allPermissions: readonly BuilderPermission[],
): readonly BuilderPermission[] {
  if (role === 'owner') return allPermissions;
  return NON_OWNER_PERMISSIONS[role] ?? [];
}

/**
 * Lightweight predicate. Avoids importing BUILDER_PERMISSIONS to keep
 * the import graph one-directional.
 */
export function hasRoleAccess(role: BuilderRoleName, permission: BuilderPermission): boolean {
  if (role === 'owner') return true;
  const allowed = NON_OWNER_PERMISSIONS[role] ?? [];
  return allowed.includes(permission);
}

/**
 * Public, JSON-safe view of the role permission matrix. Used by the
 * admin UI to render which permissions a role enables without round-
 * tripping every permission as an HTTP call.
 */
export function rolePermissionMatrix(
  allPermissions: readonly BuilderPermission[],
): Record<BuilderRoleName, readonly BuilderPermission[]> {
  return {
    owner: allPermissions,
    admin: NON_OWNER_PERMISSIONS.admin,
    designer: NON_OWNER_PERMISSIONS.designer,
    editor: NON_OWNER_PERMISSIONS.editor,
    client: NON_OWNER_PERMISSIONS.client,
  };
}