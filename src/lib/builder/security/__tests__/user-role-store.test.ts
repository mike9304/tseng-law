import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  __resetUserRoleStorageRootForTests,
  __setUserRoleStorageRootForTests,
  getUserRole,
  listUserRoles,
  recordUserSeen,
  removeUserRole,
  upsertUserRole,
} from '@/lib/builder/security/user-role-store';

const ORIGINAL_BUILDER = process.env.BUILDER_USERNAME;
const ORIGINAL_CMS = process.env.CMS_ADMIN_USERNAME;

let tempRoot: string;

beforeEach(() => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'tseng-user-roles-'));
  __setUserRoleStorageRootForTests(tempRoot);
  process.env.BUILDER_USERNAME = 'admin';
  delete process.env.CMS_ADMIN_USERNAME;
});

afterEach(() => {
  __resetUserRoleStorageRootForTests();
  rmSync(tempRoot, { recursive: true, force: true });
  if (ORIGINAL_BUILDER) process.env.BUILDER_USERNAME = ORIGINAL_BUILDER;
  else delete process.env.BUILDER_USERNAME;
  if (ORIGINAL_CMS) process.env.CMS_ADMIN_USERNAME = ORIGINAL_CMS;
  else delete process.env.CMS_ADMIN_USERNAME;
});

describe('user-role-store seed', () => {
  it('seeds the configured owner on first read', async () => {
    const users = await listUserRoles();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('admin');
    expect(users[0].role).toBe('owner');
    expect(users[0].addedBy).toBe('system');
  });

  it('uses CMS_ADMIN_USERNAME if BUILDER_USERNAME is unset', async () => {
    __resetUserRoleStorageRootForTests();
    __setUserRoleStorageRootForTests(tempRoot);
    delete process.env.BUILDER_USERNAME;
    process.env.CMS_ADMIN_USERNAME = 'rooty';
    const users = await listUserRoles();
    expect(users.some((u) => u.username === 'rooty' && u.role === 'owner')).toBe(true);
  });

  it('falls back to "admin" if neither env is set', async () => {
    __resetUserRoleStorageRootForTests();
    __setUserRoleStorageRootForTests(tempRoot);
    delete process.env.BUILDER_USERNAME;
    delete process.env.CMS_ADMIN_USERNAME;
    const users = await listUserRoles();
    expect(users[0].username).toBe('admin');
  });
});

describe('user-role-store CRUD', () => {
  it('upserts and retrieves a user record', async () => {
    await listUserRoles(); // ensure seed
    const created = await upsertUserRole({
      username: 'designer1',
      role: 'designer',
      addedBy: 'admin',
    });
    expect(created.username).toBe('designer1');
    expect(created.role).toBe('designer');
    const fetched = await getUserRole('designer1');
    expect(fetched?.role).toBe('designer');
  });

  it('upsert updates an existing role in place', async () => {
    await listUserRoles();
    await upsertUserRole({ username: 'editor1', role: 'editor', addedBy: 'admin' });
    const promoted = await upsertUserRole({
      username: 'editor1',
      role: 'admin',
      addedBy: 'admin',
    });
    expect(promoted.role).toBe('admin');
    const list = await listUserRoles();
    const editors = list.filter((u) => u.username === 'editor1');
    expect(editors).toHaveLength(1);
  });

  it('rejects unknown roles', async () => {
    await listUserRoles();
    await expect(
      upsertUserRole({
        username: 'rogue',
        // @ts-expect-error invalid role on purpose
        role: 'superuser',
        addedBy: 'admin',
      }),
    ).rejects.toThrow();
  });

  it('removes a user', async () => {
    await listUserRoles();
    await upsertUserRole({ username: 'client1', role: 'client', addedBy: 'admin' });
    const removed = await removeUserRole('client1');
    expect(removed).toBe(true);
    expect(await getUserRole('client1')).toBeNull();
  });

  it('refuses to demote the only owner', async () => {
    await listUserRoles();
    await expect(
      upsertUserRole({ username: 'admin', role: 'editor', addedBy: 'admin' }),
    ).rejects.toThrow(/only owner/i);
  });

  it('refuses to remove the only owner', async () => {
    await listUserRoles();
    await expect(removeUserRole('admin')).rejects.toThrow(/only owner/i);
  });

  it('allows demotion when another owner exists', async () => {
    await listUserRoles();
    await upsertUserRole({ username: 'owner2', role: 'owner', addedBy: 'admin' });
    const demoted = await upsertUserRole({
      username: 'admin',
      role: 'admin',
      addedBy: 'owner2',
    });
    expect(demoted.role).toBe('admin');
  });

  it('records last-seen timestamp', async () => {
    await listUserRoles();
    await upsertUserRole({ username: 'editor1', role: 'editor', addedBy: 'admin' });
    await recordUserSeen('editor1');
    const after = await getUserRole('editor1');
    expect(after?.lastSeenAt).toBeDefined();
  });

  it('is case-insensitive on username lookup', async () => {
    await listUserRoles();
    await upsertUserRole({ username: 'MixedCase', role: 'editor', addedBy: 'admin' });
    expect((await getUserRole('mixedcase'))?.username).toBe('MixedCase');
  });
});