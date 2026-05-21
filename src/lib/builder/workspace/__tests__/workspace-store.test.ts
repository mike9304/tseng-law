import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';
import {
  DEFAULT_BUILDER_SITE_ID,
  DEFAULT_BUILDER_WORKSPACE_ID,
} from '@/lib/builder/constants';
import {
  __resetWorkspaceStorageRootForTests,
  __setWorkspaceStorageRootForTests,
  addMember,
  addSite,
  ensureDefaultAccount,
  listMembers,
  listWorkspaceSites,
  readAccount,
  removeMember,
  removeSite,
  updateAccountName,
  updateMemberRole,
} from '@/lib/builder/workspace/workspace-store';

let tempDir: string;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), `workspace-store-${randomUUID()}-`));
  __setWorkspaceStorageRootForTests(tempDir);
});

afterEach(async () => {
  __resetWorkspaceStorageRootForTests();
  await rm(tempDir, { recursive: true, force: true });
});

describe('workspace-store', () => {
  it('seeds a default account that maps to the workspace constant', async () => {
    const account = await ensureDefaultAccount();
    expect(account.id).toBe(DEFAULT_BUILDER_WORKSPACE_ID);
    expect(account.name.length).toBeGreaterThan(0);

    const sites = await listWorkspaceSites();
    expect(sites.map((s) => s.siteId)).toContain(DEFAULT_BUILDER_SITE_ID);

    const members = await listMembers();
    expect(members.length).toBeGreaterThan(0);
    expect(members[0].role).toBe('owner');
  });

  it('readAccount is idempotent and returns the persisted account', async () => {
    const first = await ensureDefaultAccount();
    const direct = await readAccount();
    expect(direct.id).toBe(first.id);
    expect(direct.createdAt).toBe(first.createdAt);
  });

  it('updates the account name and refuses empty input', async () => {
    await ensureDefaultAccount();
    const updated = await updateAccountName('Hojeong Studio');
    expect(updated.name).toBe('Hojeong Studio');
    await expect(updateAccountName('   ')).rejects.toThrow();
  });

  it('registers a site once and is idempotent on repeat ids', async () => {
    await ensureDefaultAccount();
    const newSite = await addSite({ siteId: 'preview-site', name: 'Preview' });
    const repeat = await addSite({ siteId: 'preview-site' });
    expect(newSite.siteId).toBe('preview-site');
    expect(repeat.siteId).toBe('preview-site');
    const sites = await listWorkspaceSites();
    expect(sites.filter((s) => s.siteId === 'preview-site')).toHaveLength(1);
  });

  it('removes a site that exists and ignores unknown ids', async () => {
    await ensureDefaultAccount();
    await addSite({ siteId: 'preview-site' });
    expect(await removeSite('preview-site')).toBe(true);
    expect(await removeSite('preview-site')).toBe(false);
  });

  it('adds members, updates roles, and removes them', async () => {
    await ensureDefaultAccount();
    const member = await addMember({ email: 'editor@example.com', role: 'editor' });
    expect(member.email).toBe('editor@example.com');
    expect(member.role).toBe('editor');

    const promoted = await updateMemberRole('editor@example.com', 'viewer');
    expect(promoted?.role).toBe('viewer');

    expect(await removeMember('editor@example.com')).toBe(true);
    expect((await listMembers()).find((m) => m.email === 'editor@example.com')).toBeUndefined();
  });

  it('prevents removing the only owner', async () => {
    const account = await ensureDefaultAccount();
    await expect(removeMember(account.ownerEmail)).rejects.toThrow();
    await expect(updateMemberRole(account.ownerEmail, 'viewer')).rejects.toThrow();
  });

  it('rejects malformed member emails', async () => {
    await ensureDefaultAccount();
    await expect(addMember({ email: 'not-an-email' })).rejects.toThrow();
    await expect(addMember({ email: '' })).rejects.toThrow();
  });

  it('serializes concurrent member additions without losing entries', async () => {
    await ensureDefaultAccount();
    await Promise.all(
      Array.from({ length: 8 }, (_, index) =>
        addMember({ email: `concurrent-${index}@example.com`, role: 'editor' }),
      ),
    );
    const emails = (await listMembers()).map((m) => m.email);
    for (let i = 0; i < 8; i += 1) {
      expect(emails).toContain(`concurrent-${i}@example.com`);
    }
  });
});