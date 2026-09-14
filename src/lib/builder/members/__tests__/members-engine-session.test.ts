import { chmod, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createMember,
  loginMember,
  revokeSession,
  validateSession,
} from '@/lib/builder/members/members-engine';

const ORIGINAL_ROOT = process.env.BUILDER_MEMBERS_ROOT;
const ORIGINAL_BACKEND = process.env.BUILDER_MEMBERS_BACKEND;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

let tempDir = '';

describe('FN-15 members-engine session pins', () => {
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'builder-members-session-'));
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

  it('revokeSession is idempotent and validateSession returns none after revoke', async () => {
    const member = await createMember({
      email: 'session-pin@example.com',
      name: 'Session Pin',
      password: 'password123',
      verified: true,
    });
    const session = await loginMember(member.email, 'password123');
    expect(session?.sessionId).toBeTruthy();
    expect((await validateSession(session!.sessionId))?.memberId).toBe(member.memberId);

    await revokeSession(session!.sessionId);
    expect(await validateSession(session!.sessionId)).toBeNull();

    await expect(revokeSession(session!.sessionId)).resolves.toBeUndefined();
    expect(await validateSession(session!.sessionId)).toBeNull();
  });

  it('returns a usable session when lastLoginAt persist fails', async () => {
    const member = await createMember({
      email: 'lastlogin-fail@example.com',
      name: 'LastLogin Fail',
      password: 'password123',
      verified: true,
    });
    const memberFile = path.join(tempDir, 'members', `${member.memberId}.json`);
    await chmod(memberFile, 0o444);
    const warn = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const session = await loginMember(member.email, 'password123');
      expect(session?.sessionId).toBeTruthy();
      expect((await validateSession(session!.sessionId))?.memberId).toBe(member.memberId);
    } finally {
      await chmod(memberFile, 0o644);
      warn.mockRestore();
    }
  });
});
