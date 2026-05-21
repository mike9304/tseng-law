import { mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  checkAccess,
  createMember,
  getMemberByEmail,
  listMembers,
  loginMember,
  publicMember,
  revokeSession,
  updateMemberAdmin,
  updateMemberProfile,
  validateSession,
} from '@/lib/builder/members/members-engine';

const ORIGINAL_ROOT = process.env.BUILDER_MEMBERS_ROOT;
const ORIGINAL_BACKEND = process.env.BUILDER_MEMBERS_BACKEND;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

let tempDir = '';

describe('native members engine', () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'builder-members-'));
    process.env.BUILDER_MEMBERS_ROOT = tempDir;
    process.env.BUILDER_MEMBERS_BACKEND = 'local';
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    if (ORIGINAL_ROOT === undefined) delete process.env.BUILDER_MEMBERS_ROOT;
    else process.env.BUILDER_MEMBERS_ROOT = ORIGINAL_ROOT;
    if (ORIGINAL_BACKEND === undefined) delete process.env.BUILDER_MEMBERS_BACKEND;
    else process.env.BUILDER_MEMBERS_BACKEND = ORIGINAL_BACKEND;
    if (ORIGINAL_BLOB_TOKEN === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    await rm(tempDir, { recursive: true, force: true });
  });

  it('creates members, validates sessions, updates profiles, and checks role gates', async () => {
    const free = await createMember({
      email: 'free@example.com',
      name: 'Free Member',
      password: 'password123',
    });
    const premium = await createMember({
      email: 'premium@example.com',
      name: 'Premium Member',
      password: 'password123',
      role: 'premium',
      verified: true,
    });

    await expect(createMember({
      email: 'FREE@example.com',
      name: 'Duplicate',
      password: 'password123',
    })).rejects.toThrow('이미 가입된 이메일입니다.');

    expect(await listMembers()).toHaveLength(2);
    expect((await getMemberByEmail('premium@example.com'))?.role).toBe('premium');
    expect(publicMember(free)).not.toHaveProperty('passwordHash');

    const session = await loginMember('free@example.com', 'password123');
    expect(session?.sessionId).toBeTruthy();
    expect((await validateSession(session!.sessionId))?.memberId).toBe(free.memberId);
    await updateMemberProfile(free.memberId, { name: 'Updated Free', phone: '+886-2-1234-5678' });
    expect((await getMemberByEmail('free@example.com'))?.name).toBe('Updated Free');

    expect(checkAccess({ pageId: 'account', requireLogin: true, allowedRoles: [] }, free)).toBe(true);
    expect(checkAccess({ pageId: 'premium', requireLogin: true, allowedRoles: ['premium', 'admin'] }, free)).toBe(false);
    expect(checkAccess({ pageId: 'premium', requireLogin: true, allowedRoles: ['premium', 'admin'] }, premium)).toBe(true);

    await updateMemberAdmin(premium.memberId, { blocked: true });
    expect(await loginMember('premium@example.com', 'password123')).toBeNull();

    await revokeSession(session!.sessionId);
    expect(await validateSession(session!.sessionId)).toBeNull();
  });
});
