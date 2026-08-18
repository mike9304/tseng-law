import { describe, expect, it } from 'vitest';
import {
  BUILDER_PERMISSIONS,
  hasBuilderPermission,
  isBuilderPermission,
  type BuilderPermission,
} from '@/lib/builder/security/permissions';

describe('builder permissions', () => {
  it('includes the commerce read and mutation permissions', () => {
    expect(BUILDER_PERMISSIONS).toEqual(
      expect.arrayContaining(['view-commerce', 'manage-commerce']),
    );
  });

  it('owner has every granular permission', () => {
    for (const perm of BUILDER_PERMISSIONS) {
      expect(hasBuilderPermission('owner', perm)).toBe(true);
    }
  });

  it('editor can edit/publish but cannot manage users or change settings', () => {
    expect(hasBuilderPermission('editor', 'edit-pages')).toBe(true);
    expect(hasBuilderPermission('editor', 'publish')).toBe(true);
    expect(hasBuilderPermission('editor', 'edit-blog')).toBe(true);
    expect(hasBuilderPermission('editor', 'manage-users')).toBe(false);
    expect(hasBuilderPermission('editor', 'settings')).toBe(false);
    expect(hasBuilderPermission('editor', 'delete-pages')).toBe(false);
  });

  it.each(['editor', 'reviewer', 'viewer'] as const)(
    'does not grant legacy %s roles either commerce permission',
    (role) => {
      expect(hasBuilderPermission(role, 'view-commerce')).toBe(false);
      expect(hasBuilderPermission(role, 'manage-commerce')).toBe(false);
    },
  );

  it('reviewer cannot edit but can view comment-level data', () => {
    expect(hasBuilderPermission('reviewer', 'edit-pages')).toBe(false);
    expect(hasBuilderPermission('reviewer', 'view-cases')).toBe(true);
    expect(hasBuilderPermission('reviewer', 'view-campaigns')).toBe(true);
  });

  it('viewer is locked down to comment scope only', () => {
    expect(hasBuilderPermission('viewer', 'edit-pages')).toBe(false);
    expect(hasBuilderPermission('viewer', 'view-cases')).toBe(true);
    expect(hasBuilderPermission('viewer', 'publish')).toBe(false);
  });

  it('isBuilderPermission narrows correctly', () => {
    expect(isBuilderPermission('edit-pages')).toBe(true);
    expect(isBuilderPermission('not-a-permission')).toBe(false);
    expect(isBuilderPermission(42)).toBe(false);

    const value: unknown = 'edit-seo';
    if (isBuilderPermission(value)) {
      const perm: BuilderPermission = value;
      expect(perm).toBe('edit-seo');
    }
  });
});
