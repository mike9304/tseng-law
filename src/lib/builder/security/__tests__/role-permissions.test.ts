import { describe, expect, it } from 'vitest';
import { BUILDER_PERMISSIONS } from '@/lib/builder/security/permissions';
import {
  hasRoleAccess,
  listRolePermissions,
  rolePermissionMatrix,
} from '@/lib/builder/security/role-permissions';

describe('role-permissions matrix', () => {
  it('owner has every permission, even newly added ones', () => {
    for (const perm of BUILDER_PERMISSIONS) {
      expect(hasRoleAccess('owner', perm)).toBe(true);
    }
    expect(hasRoleAccess('owner', 'view-commerce')).toBe(true);
    expect(hasRoleAccess('owner', 'manage-commerce')).toBe(true);
  });

  it('admin has everything except manage-roles and delete-site', () => {
    expect(hasRoleAccess('admin', 'edit-pages')).toBe(true);
    expect(hasRoleAccess('admin', 'publish')).toBe(true);
    expect(hasRoleAccess('admin', 'manage-users')).toBe(true);
    expect(hasRoleAccess('admin', 'settings')).toBe(true);
    expect(hasRoleAccess('admin', 'manage-roles')).toBe(false);
    expect(hasRoleAccess('admin', 'delete-site')).toBe(false);
    expect(hasRoleAccess('admin', 'view-commerce')).toBe(true);
    expect(hasRoleAccess('admin', 'manage-commerce')).toBe(true);
  });

  it.each(['designer', 'editor', 'client'] as const)(
    'does not grant %s either commerce permission',
    (role) => {
      expect(hasRoleAccess(role, 'view-commerce')).toBe(false);
      expect(hasRoleAccess(role, 'manage-commerce')).toBe(false);
    },
  );

  it('designer can edit pages, view CMS/bookings, and manage translations', () => {
    expect(hasRoleAccess('designer', 'edit-pages')).toBe(true);
    expect(hasRoleAccess('designer', 'view-cms')).toBe(true);
    expect(hasRoleAccess('designer', 'view-bookings')).toBe(true);
    expect(hasRoleAccess('designer', 'manage-translations')).toBe(true);
    expect(hasRoleAccess('designer', 'publish')).toBe(false);
    expect(hasRoleAccess('designer', 'manage-users')).toBe(false);
  });

  it('editor is limited to edit-pages and view-cms', () => {
    expect(hasRoleAccess('editor', 'edit-pages')).toBe(true);
    expect(hasRoleAccess('editor', 'view-cms')).toBe(true);
    expect(hasRoleAccess('editor', 'publish')).toBe(false);
    expect(hasRoleAccess('editor', 'manage-translations')).toBe(false);
  });

  it('client is read-only across cms + bookings', () => {
    expect(hasRoleAccess('client', 'view-cms')).toBe(true);
    expect(hasRoleAccess('client', 'view-bookings')).toBe(true);
    expect(hasRoleAccess('client', 'edit-pages')).toBe(false);
    expect(hasRoleAccess('client', 'publish')).toBe(false);
    expect(hasRoleAccess('client', 'manage-users')).toBe(false);
  });

  it('listRolePermissions returns the full list for owner', () => {
    const list = listRolePermissions('owner', BUILDER_PERMISSIONS);
    expect(list).toEqual(BUILDER_PERMISSIONS);
  });

  it('rolePermissionMatrix returns every role', () => {
    const matrix = rolePermissionMatrix(BUILDER_PERMISSIONS);
    expect(Object.keys(matrix).sort()).toEqual(
      ['admin', 'client', 'designer', 'editor', 'owner'].sort(),
    );
  });
});
