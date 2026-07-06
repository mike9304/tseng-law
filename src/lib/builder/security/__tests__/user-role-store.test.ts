import { chmodSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
const ORIGINAL_BASIC_AUTH_USERS = process.env.BUILDER_BASIC_AUTH_USERS;

let tempRoot: string;

beforeEach(() => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'tseng-user-roles-'));
  __setUserRoleStorageRootForTests(tempRoot);
  process.env.BUILDER_USERNAME = 'admin';
  delete process.env.CMS_ADMIN_USERNAME;
  delete process.env.BUILDER_BASIC_AUTH_USERS;
});

afterEach(() => {
  __resetUserRoleStorageRootForTests();
  chmodSync(tempRoot, 0o700);
  rmSync(tempRoot, { recursive: true, force: true });
  if (ORIGINAL_BUILDER === undefined) delete process.env.BUILDER_USERNAME;
  else process.env.BUILDER_USERNAME = ORIGINAL_BUILDER;
  if (ORIGINAL_CMS === undefined) delete process.env.CMS_ADMIN_USERNAME;
  else process.env.CMS_ADMIN_USERNAME = ORIGINAL_CMS;
  if (ORIGINAL_BASIC_AUTH_USERS === undefined) delete process.env.BUILDER_BASIC_AUTH_USERS;
  else process.env.BUILDER_BASIC_AUTH_USERS = ORIGINAL_BASIC_AUTH_USERS;
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

  it('uses the first basic auth username when legacy owner env vars are blank', async () => {
    __resetUserRoleStorageRootForTests();
    __setUserRoleStorageRootForTests(tempRoot);
    process.env.BUILDER_USERNAME = '';
    process.env.CMS_ADMIN_USERNAME = '';
    process.env.BUILDER_BASIC_AUTH_USERS = JSON.stringify([
      { username: 'hojeong-admin', password: 'x' },
    ]);

    const users = await listUserRoles();

    expect(users[0].username).toBe('hojeong-admin');
    expect(users[0].role).toBe('owner');
  });

  it('keeps read paths working when owner seed persistence fails', async () => {
    __resetUserRoleStorageRootForTests();
    __setUserRoleStorageRootForTests(path.join(tempRoot, 'security'));
    chmodSync(tempRoot, 0o500);
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      await expect(getUserRole('x')).resolves.toBeNull();
      await expect(listUserRoles()).resolves.toEqual([]);
      expect(warn).toHaveBeenCalledWith(
        '[user-role-store] owner seed persist skipped (read-only fs?):',
        expect.anything(),
      );
    } finally {
      warn.mockRestore();
    }
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
