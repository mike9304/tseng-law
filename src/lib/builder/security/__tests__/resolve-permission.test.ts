import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resolveUserRole, userHasPermission } from '@/lib/builder/security/resolve-permission';
import {
  __resetUserRoleStorageRootForTests,
  __setUserRoleStorageRootForTests,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';

const ORIGINAL_BUILDER_USERNAME = process.env.BUILDER_USERNAME;
const ORIGINAL_CMS_ADMIN_USERNAME = process.env.CMS_ADMIN_USERNAME;

let tempRoot: string;

describe('resolveUserRole', () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(tmpdir(), 'tseng-resolve-role-'));
    __setUserRoleStorageRootForTests(tempRoot);
    process.env.BUILDER_USERNAME = 'admin';
    delete process.env.CMS_ADMIN_USERNAME;
  });

  afterEach(() => {
    __resetUserRoleStorageRootForTests();
    rmSync(tempRoot, { recursive: true, force: true });
    if (ORIGINAL_BUILDER_USERNAME) process.env.BUILDER_USERNAME = ORIGINAL_BUILDER_USERNAME;
    else delete process.env.BUILDER_USERNAME;
    if (ORIGINAL_CMS_ADMIN_USERNAME) process.env.CMS_ADMIN_USERNAME = ORIGINAL_CMS_ADMIN_USERNAME;
    else delete process.env.CMS_ADMIN_USERNAME;
  });

  it('keeps the configured legacy owner fallback for existing deployments', async () => {
    expect(await resolveUserRole('admin')).toBe('owner');
  });

  it('does not grant owner fallback to secondary credentials without a role record', async () => {
    expect(await resolveUserRole('reviewer')).toBe('client');
    expect(await userHasPermission('reviewer', 'settings')).toBe(false);
  });

  it('uses explicit role records for secondary credentials', async () => {
    await upsertUserRole({
      username: 'reviewer',
      role: 'owner',
      addedBy: 'admin',
    });

    expect(await resolveUserRole('reviewer')).toBe('owner');
    expect(await userHasPermission('reviewer', 'settings')).toBe(true);
  });
});
