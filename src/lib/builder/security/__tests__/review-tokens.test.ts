import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  __resetReviewStorageRootForTests,
  __setReviewStorageRootForTests,
  createReviewSession,
  listReviewSessions,
  revokeReviewSession,
  verifyReviewToken,
} from '@/lib/builder/security/review-tokens';

const ORIGINAL_SECRET = process.env.NEXTAUTH_SECRET;
const ORIGINAL_REVIEW_SECRET = process.env.BUILDER_REVIEW_SECRET;
const ORIGINAL_CMS_SECRET = process.env.CMS_SESSION_SECRET;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

let tempRoot: string;

beforeEach(() => {
  tempRoot = mkdtempSync(path.join(tmpdir(), 'tseng-review-'));
  __setReviewStorageRootForTests(tempRoot);
  process.env.BUILDER_REVIEW_SECRET = 'test-review-secret-1234';
});

afterEach(() => {
  __resetReviewStorageRootForTests();
  rmSync(tempRoot, { recursive: true, force: true });
  if (ORIGINAL_SECRET) process.env.NEXTAUTH_SECRET = ORIGINAL_SECRET;
  else delete process.env.NEXTAUTH_SECRET;
  if (ORIGINAL_REVIEW_SECRET) process.env.BUILDER_REVIEW_SECRET = ORIGINAL_REVIEW_SECRET;
  else delete process.env.BUILDER_REVIEW_SECRET;
  if (ORIGINAL_CMS_SECRET) process.env.CMS_SESSION_SECRET = ORIGINAL_CMS_SECRET;
  else delete process.env.CMS_SESSION_SECRET;
  if (ORIGINAL_NODE_ENV) (process.env as Record<string, string | undefined>).NODE_ENV = ORIGINAL_NODE_ENV;
  else delete (process.env as Record<string, string | undefined>).NODE_ENV;
});

describe('review-tokens', () => {
  it('round-trips sign + verify', async () => {
    const { token, session } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    const verified = await verifyReviewToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.id).toBe(session.id);
    expect(verified?.branchOrPageId).toBe('home');
    expect(verified?.audienceRole).toBe('client');
  });

  it('rejects a tampered token', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    const [payload, sig] = token.split('.');
    const tampered = `${payload}A.${sig}`;
    expect(await verifyReviewToken(tampered)).toBeNull();
  });

  it('rejects a bad signature', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    const [payload] = token.split('.');
    const broken = `${payload}.AAAA`;
    expect(await verifyReviewToken(broken)).toBeNull();
  });

  it('rejects malformed tokens', async () => {
    expect(await verifyReviewToken('nope')).toBeNull();
    expect(await verifyReviewToken('')).toBeNull();
    expect(await verifyReviewToken('foo.bar.baz')).toBeNull();
  });

  it('expires past the ttl', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
      ttlMs: 60_000, // 1 minute (well above min)
    });
    // Travel time forward by overwriting Date.now()
    const realNow = Date.now;
    try {
      Date.now = () => realNow() + 1000 * 60 * 60 * 24 * 30;
      expect(await verifyReviewToken(token)).toBeNull();
    } finally {
      Date.now = realNow;
    }
  });

  it.skip('lists sessions newest first', async () => {
    await createReviewSession({ branchOrPageId: 'a', createdBy: 'admin' });
    await createReviewSession({ branchOrPageId: 'b', createdBy: 'admin' });
    const list = await listReviewSessions();
    expect(list).toHaveLength(2);
    expect(list[0].branchOrPageId).toBe('b');
  });

  it('rejects revoked sessions', async () => {
    const { session, token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    expect(await verifyReviewToken(token)).not.toBeNull();
    expect(await revokeReviewSession(session.id)).toBe(true);
    expect(await verifyReviewToken(token)).toBeNull();
  });

  it('rejects a token when its persisted session has the wrong audience', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    const sessionFile = path.join(tempRoot, 'review-sessions.json');
    const document = JSON.parse(readFileSync(sessionFile, 'utf8')) as {
      sessions: Array<{ audienceRole: string }>;
    };
    document.sessions[0].audienceRole = 'owner';
    writeFileSync(sessionFile, JSON.stringify(document));

    expect(await verifyReviewToken(token)).toBeNull();
  });

  it('rejects a token when its payload expiry no longer matches its persisted session', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    const sessionFile = path.join(tempRoot, 'review-sessions.json');
    const document = JSON.parse(readFileSync(sessionFile, 'utf8')) as {
      sessions: Array<{ expiresAt: string }>;
    };
    document.sessions[0].expiresAt = new Date(Date.now() + 60_000).toISOString();
    writeFileSync(sessionFile, JSON.stringify(document));

    expect(await verifyReviewToken(token)).toBeNull();
  });

  it('refuses tokens signed with a different secret', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    process.env.BUILDER_REVIEW_SECRET = 'rotated-secret-xyz';
    expect(await verifyReviewToken(token)).toBeNull();
  });

  it('requires BUILDER_REVIEW_SECRET in production without falling back to other secrets', async () => {
    delete process.env.BUILDER_REVIEW_SECRET;
    process.env.NEXTAUTH_SECRET = 'not-a-review-secret';
    process.env.CMS_SESSION_SECRET = 'also-not-a-review-secret';
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';

    await expect(
      createReviewSession({ branchOrPageId: 'home', createdBy: 'admin' }),
    ).rejects.toThrow('BUILDER_REVIEW_SECRET');
  });

  it('fails closed during public verification when the production secret is missing', async () => {
    const { token } = await createReviewSession({
      branchOrPageId: 'home',
      createdBy: 'admin',
    });
    delete process.env.BUILDER_REVIEW_SECRET;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';

    await expect(verifyReviewToken(token)).resolves.toBeNull();
  });

  it('requires a branchOrPageId', async () => {
    await expect(
      createReviewSession({ branchOrPageId: '   ', createdBy: 'admin' }),
    ).rejects.toThrow();
  });
});
