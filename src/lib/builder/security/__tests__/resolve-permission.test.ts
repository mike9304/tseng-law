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
const ORIGINAL_BASIC_AUTH_USERS = process.env.BUILDER_BASIC_AUTH_USERS;

let tempRoot: string;

describe('resolveUserRole', () => {
  beforeEach(() => {
    tempRoot = mkdtempSync(path.join(tmpdir(), 'tseng-resolve-role-'));
    __setUserRoleStorageRootForTests(tempRoot);
    process.env.BUILDER_USERNAME = 'admin';
    delete process.env.CMS_ADMIN_USERNAME;
    delete process.env.BUILDER_BASIC_AUTH_USERS;
  });

  afterEach(() => {
    __resetUserRoleStorageRootForTests();
    rmSync(tempRoot, { recursive: true, force: true });
    if (ORIGINAL_BUILDER_USERNAME === undefined) delete process.env.BUILDER_USERNAME;
    else process.env.BUILDER_USERNAME = ORIGINAL_BUILDER_USERNAME;
    if (ORIGINAL_CMS_ADMIN_USERNAME === undefined) delete process.env.CMS_ADMIN_USERNAME;
    else process.env.CMS_ADMIN_USERNAME = ORIGINAL_CMS_ADMIN_USERNAME;
    if (ORIGINAL_BASIC_AUTH_USERS === undefined) delete process.env.BUILDER_BASIC_AUTH_USERS;
    else process.env.BUILDER_BASIC_AUTH_USERS = ORIGINAL_BASIC_AUTH_USERS;
  });

  it('keeps the configured legacy owner fallback for existing deployments', async () => {
    expect(await resolveUserRole('admin')).toBe('owner');
  });

  it('keeps the CMS admin owner fallback when only CMS_ADMIN_USERNAME is configured', async () => {
    delete process.env.BUILDER_USERNAME;
    process.env.CMS_ADMIN_USERNAME = 'admin';

    expect(await resolveUserRole('admin')).toBe('owner');
  });

  it('uses basic auth usernames as implicit owners when legacy owner env vars are unset', async () => {
    delete process.env.BUILDER_USERNAME;
    delete process.env.CMS_ADMIN_USERNAME;
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'hojeong-admin', password: 'x' },
    ]);

    expect(await resolveUserRole('hojeong-admin')).toBe('owner');
    expect(await resolveUserRole('stranger')).toBe('client');
    expect(await userHasPermission('hojeong-admin', 'edit-pages')).toBe(true);
  });

  it('skips blank legacy owner env vars before checking basic auth usernames', async () => {
    process.env.BUILDER_USERNAME = '';
    process.env.CMS_ADMIN_USERNAME = '';
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'hojeong-admin', password: 'x' },
    ]);

    expect(await resolveUserRole('hojeong-admin')).toBe('owner');
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
