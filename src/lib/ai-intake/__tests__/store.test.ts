import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobPreconditionFailedError } from '@vercel/blob';
import {
  AI_INTAKE_BACKEND_TIMEOUT_MS,
  AI_INTAKE_CLAIM_TTL_MS,
  AI_INTAKE_MEMORY_CLAIM_CAP,
} from '@/lib/ai-intake/constants';
import { resetAiIntakeClockForTests, setAiIntakeNowMsForTests } from '@/lib/ai-intake/clock';
import {
  AI_INTAKE_CLAIM_UPDATE_LUA,
  aiIntakeMemoryClaimCountForTests,
  aiIntakeMemoryLockCountForTests,
  getAiIntakeClaimStore,
  hashAiIntakeClaimKey,
  resetAiIntakeClaimStoreForTests,
} from '@/lib/ai-intake/store';
import { stubAiIntakeTestEnv } from '@/lib/ai-intake/__tests__/helpers';

vi.mock('@vercel/blob', async () => {
  const actual = await vi.importActual<typeof import('@vercel/blob')>('@vercel/blob');
  return {
    ...actual,
    put: vi.fn(),
    get: vi.fn(),
    del: vi.fn(),
  };
});

import { del as blobDel, get as blobGet, put as blobPut } from '@vercel/blob';

const putMock = vi.mocked(blobPut);
const getMock = vi.mocked(blobGet);
const delMock = vi.mocked(blobDel);

const DIGEST_A = 'a'.repeat(64);
const DIGEST_B = 'b'.repeat(64);

function blobGetResult(record: object, etag = 'etag-1') {
  const existingBody = JSON.stringify(record);
  return {
    statusCode: 200,
    stream: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(existingBody));
        controller.close();
      },
    }),
    headers: new Headers(),
    blob: {
      etag,
      url: '',
      downloadUrl: '',
      pathname: '',
      contentDisposition: '',
      cacheControl: '',
      uploadedAt: new Date(),
      contentType: 'application/json',
      size: existingBody.length,
    },
  } as never;
}

describe('ai intake claim store', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    resetAiIntakeClaimStoreForTests();
    putMock.mockReset();
    getMock.mockReset();
    delMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    resetAiIntakeClaimStoreForTests();
    resetAiIntakeClockForTests();
  });

  it('gives exactly one acquired claim under concurrency and treats digest mismatch as conflict', async () => {
    const store = getAiIntakeClaimStore();
    expect(store).not.toBeNull();
    const results = await Promise.all(Array.from({ length: 12 }, (_, index) => store!.claim({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST0001',
      digest: DIGEST_A,
    }).then((result) => ({ index, result }))));

    const acquired = results.filter((entry) => entry.result.type === 'acquired');
    const duplicates = results.filter((entry) => entry.result.type === 'duplicate');
    expect(acquired).toHaveLength(1);
    expect(duplicates).toHaveLength(11);

    const conflict = await store!.claim({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST0002',
      digest: DIGEST_B,
    });
    expect(conflict.type).toBe('conflict');
    expect(hashAiIntakeClaimKey('test-client', 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee')).toMatch(/^[a-f0-9]{64}$/);
  });

  it('rejects sent -> failed_unknown and failed_unknown -> sent on memory', async () => {
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00AA',
      digest: 'c'.repeat(64),
    };
    expect((await store.claim(key)).type).toBe('acquired');
    expect(await store.update({ ...key, status: 'sent' })).toBe('updated');
    expect(await store.update({ ...key, status: 'failed_unknown', failureClass: 'delivery_unknown' })).toBe('conflict');
    const sentReplay = await store.claim(key);
    expect(sentReplay.type).toBe('duplicate');
    if (sentReplay.type === 'duplicate') expect(sentReplay.record.status).toBe('sent');

    const failedKey = {
      ...key,
      idempotencyKey: 'bbbbbbbb-cccc-4ccc-8ddd-eeeeeeeeeeee',
    };
    expect((await store.claim(failedKey)).type).toBe('acquired');
    expect(await store.update({ ...failedKey, status: 'failed_unknown', failureClass: 'delivery_unknown' })).toBe('updated');
    expect(await store.update({ ...failedKey, status: 'sent' })).toBe('conflict');
  });

  it('does not resend after failed_unknown replay at the store layer', async () => {
    const store = getAiIntakeClaimStore()!;
    const first = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00AA',
      digest: 'c'.repeat(64),
    });
    expect(first.type).toBe('acquired');
    await store.update({
      clientId: 'test-client',
      idempotencyKey: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      digest: 'c'.repeat(64),
      status: 'failed_unknown',
      failureClass: 'delivery_unknown',
    });
    const replay = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'bbbbbbbb-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00AA',
      digest: 'c'.repeat(64),
    });
    expect(replay.type).toBe('duplicate');
    if (replay.type === 'duplicate') {
      expect(replay.record.status).toBe('failed_unknown');
    }
  });

  it('cleans memory locks after many unique keys', async () => {
    const store = getAiIntakeClaimStore()!;
    for (let i = 0; i < AI_INTAKE_MEMORY_CLAIM_CAP / 20; i += 1) {
      const suffix = i.toString(16).padStart(12, '0');
      await store.claim({
        clientId: 'test-client',
        idempotencyKey: `aaaaaaaa-bbbb-4ccc-8ddd-${suffix}`,
        intakeId: 'HC-TESTLOCK',
        digest: DIGEST_A,
      });
    }
    expect(aiIntakeMemoryLockCountForTests()).toBe(0);
  });

  it('uses Upstash SET NX as the atomic claim and EVAL CAS for update', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const raw = typeof init?.body === 'string'
        ? init.body
        : Buffer.isBuffer(init?.body)
          ? init.body.toString('utf8')
          : String(init?.body ?? '[]');
      if (raw.includes('"EVAL"') || raw.startsWith('["EVAL"')) {
        return new Response(JSON.stringify({ result: 'updated' }), { status: 200 });
      }
      if (raw.includes('"SET"') && raw.includes('"NX"')) {
        return new Response(JSON.stringify({ result: 'OK' }), { status: 200 });
      }
      return new Response(JSON.stringify({ result: null }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const result = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00BB',
      digest: 'd'.repeat(64),
    });
    expect(result.type).toBe('acquired');
    expect(await store.update({
      clientId: 'test-client',
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      digest: 'd'.repeat(64),
      status: 'sent',
    })).toBe('updated');
    const bodies = fetchMock.mock.calls.map((call) => String(call[1]?.body));
    expect(bodies.some((body) => body.includes('EVAL'))).toBe(true);
    expect(bodies.some((body) => body.includes(AI_INTAKE_CLAIM_UPDATE_LUA.slice(0, 24)))).toBe(true);
    expect(bodies.every((body) => !body.startsWith('["GET"'))).toBe(true);
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain('jane@');
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain('cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee');
  });

  it('returns conflict for an Upstash CAS loser and preserves PX TTL args', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? '[]')) as unknown[];
      if (body[0] === 'EVAL') {
        expect(body).toContain(String(AI_INTAKE_CLAIM_TTL_MS));
        return new Response(JSON.stringify({ result: 'conflict' }), { status: 200 });
      }
      return new Response(JSON.stringify({ result: 'OK' }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    expect(await store.update({
      clientId: 'test-client',
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      digest: 'd'.repeat(64),
      status: 'failed_unknown',
      failureClass: 'delivery_unknown',
    })).toBe('conflict');
  });

  it('treats SET NX nil as occupied, retries once after GET nil, and does not loop', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    const results = ['SET-null', 'GET-null', 'SET-ok'] as const;
    let step = 0;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const cmd = JSON.parse(String(init?.body ?? '[]')) as unknown[];
      const current = results[step];
      step += 1;
      if (current === 'SET-null') {
        expect(cmd[0]).toBe('SET');
        return new Response(JSON.stringify({ result: null }), { status: 200 });
      }
      if (current === 'GET-null') {
        expect(cmd[0]).toBe('GET');
        return new Response(JSON.stringify({ result: null }), { status: 200 });
      }
      expect(cmd[0]).toBe('SET');
      return new Response(JSON.stringify({ result: 'OK' }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const acquired = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00BB',
      digest: DIGEST_A,
    });
    expect(acquired.type).toBe('acquired');
    expect(fetchMock).toHaveBeenCalledTimes(3);

    step = 0;
    const failResults = ['SET-null', 'GET-null', 'SET-null'] as const;
    const failMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const cmd = JSON.parse(String(init?.body ?? '[]')) as unknown[];
      const current = failResults[step];
      step += 1;
      if (cmd[0] === 'GET') return new Response(JSON.stringify({ result: null }), { status: 200 });
      if (current === 'SET-null') return new Response(JSON.stringify({ result: null }), { status: 200 });
      return new Response(JSON.stringify({ result: null }), { status: 200 });
    });
    vi.stubGlobal('fetch', failMock);
    const unavailable = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00CC',
      digest: DIGEST_B,
    });
    expect(unavailable.type).toBe('unavailable');
    expect(failMock).toHaveBeenCalledTimes(3);

    let errorStep = 0;
    const errorMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const cmd = JSON.parse(String(init?.body ?? '[]')) as unknown[];
      errorStep += 1;
      if (errorStep === 1) {
        expect(cmd[0]).toBe('SET');
        return new Response(JSON.stringify({ result: null }), { status: 200 });
      }
      if (errorStep === 2) {
        expect(cmd[0]).toBe('GET');
        return new Response(JSON.stringify({ result: null }), { status: 200 });
      }
      expect(cmd[0]).toBe('SET');
      return new Response(JSON.stringify({ error: 'unavailable' }), { status: 200 });
    });
    vi.stubGlobal('fetch', errorMock);
    const errored = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'eeeeeeee-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-TEST00DD',
      digest: DIGEST_A,
    });
    expect(errored.type).toBe('unavailable');
    expect(errorMock).toHaveBeenCalledTimes(3);
  });

  it('treats EVAL null as update unavailable', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ result: null }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    expect(await store.update({
      clientId: 'test-client',
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      digest: DIGEST_A,
      status: 'sent',
    })).toBe('unavailable');
  });

  it('uses Blob allowOverwrite false as atomic create fallback and honors ETag races', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    putMock.mockResolvedValueOnce({
      url: 'https://blob.example/ai-intake/claims/x.json',
      downloadUrl: 'https://blob.example/ai-intake/claims/x.json',
      pathname: 'ai-intake/claims/x.json',
      contentType: 'application/json',
      contentDisposition: '',
      size: 2,
      uploadedAt: new Date(),
      etag: 'etag-1',
    } as never);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const result = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-ABCDEF01',
      digest: 'e'.repeat(64),
    });
    expect(result.type).toBe('acquired');
    expect(putMock).toHaveBeenCalledWith(
      expect.stringMatching(/^ai-intake\/claims\/[a-f0-9]{64}\.json$/),
      expect.any(String),
      expect.objectContaining({ allowOverwrite: false, addRandomSuffix: false, access: 'private' }),
    );
    putMock.mockRejectedValueOnce(new BlobPreconditionFailedError());
    const nowIso = new Date().toISOString();
    getMock.mockResolvedValueOnce(blobGetResult({
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: 'e'.repeat(64),
      status: 'sending',
      createdAt: nowIso,
      updatedAt: nowIso,
    }));
    const duplicate = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-ABCDEF01',
      digest: 'e'.repeat(64),
    });
    expect(duplicate.type).toBe('duplicate');

    getMock.mockResolvedValueOnce(blobGetResult({
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: 'e'.repeat(64),
      status: 'sending',
      createdAt: nowIso,
      updatedAt: nowIso,
    }, 'etag-1'));
    putMock.mockRejectedValueOnce(new BlobPreconditionFailedError());
    expect(await store.update({
      clientId: 'test-client',
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      digest: 'e'.repeat(64),
      status: 'sent',
    })).toBe('conflict');
  });

  it('replaces a fully TTL-expired Blob record under an ETag condition', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const expiredAt = new Date(Date.now() - AI_INTAKE_CLAIM_TTL_MS - 1_000).toISOString();
    putMock.mockImplementation(async (...args: unknown[]) => {
      const options = args[2] as { allowOverwrite?: boolean; ifMatch?: string } | undefined;
      if (!options || options.allowOverwrite !== true) {
        throw new BlobPreconditionFailedError();
      }
      expect(options.ifMatch).toBe('etag-old');
      return {
        url: 'https://blob.example/ai-intake/claims/x.json',
        downloadUrl: 'https://blob.example/ai-intake/claims/x.json',
        pathname: 'ai-intake/claims/x.json',
        contentType: 'application/json',
        contentDisposition: '',
        size: 2,
        uploadedAt: new Date(),
        etag: 'etag-new',
      } as never;
    });
    getMock.mockImplementation(async () => blobGetResult({
      v: 1,
      intakeId: 'HC-DEADBEEF',
      digest: 'e'.repeat(64),
      status: 'sent',
      createdAt: expiredAt,
      updatedAt: expiredAt,
    }, 'etag-old'));
    const acquired = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-NEW00001',
      digest: DIGEST_A,
    });
    expect(acquired.type).toBe('acquired');
    expect(putMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ allowOverwrite: true, ifMatch: 'etag-old' }),
    );
  });

  it('rejects terminal Blob transitions without writing', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const nowIso = new Date().toISOString();
    getMock.mockResolvedValue(blobGetResult({
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: 'e'.repeat(64),
      status: 'sent',
      createdAt: nowIso,
      updatedAt: nowIso,
    }));
    expect(await store.update({
      clientId: 'test-client',
      idempotencyKey: 'dddddddd-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      digest: 'e'.repeat(64),
      status: 'failed_unknown',
      failureClass: 'delivery_unknown',
    })).toBe('conflict');
    expect(putMock).not.toHaveBeenCalled();
  });

  it('fails closed in production when no durable backend exists', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    resetAiIntakeClaimStoreForTests();
    expect(getAiIntakeClaimStore()).toBeNull();
  });

  it('never evicts a live memory claim at capacity and keeps the first sent key as duplicate', async () => {
    const now = 4_000_000;
    setAiIntakeNowMsForTests(() => now);
    const store = getAiIntakeClaimStore()!;
    const first = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-000000000000',
      intakeId: 'HC-CAP00001',
      digest: DIGEST_A,
    };
    expect((await store.claim(first)).type).toBe('acquired');
    expect(await store.update({ ...first, status: 'sent' })).toBe('updated');

    for (let i = 1; i < AI_INTAKE_MEMORY_CLAIM_CAP; i += 1) {
      const acquired = await store.claim({
        clientId: 'test-client',
        idempotencyKey: `aaaaaaaa-bbbb-4ccc-8ddd-${i.toString(16).padStart(12, '0')}`,
        intakeId: 'HC-CAPLIVE1',
        digest: DIGEST_A,
      });
      expect(acquired.type).toBe('acquired');
    }
    expect(aiIntakeMemoryClaimCountForTests()).toBe(AI_INTAKE_MEMORY_CLAIM_CAP);

    const overflow = await store.claim({
      clientId: 'test-client',
      idempotencyKey: `aaaaaaaa-bbbb-4ccc-8ddd-${AI_INTAKE_MEMORY_CLAIM_CAP.toString(16).padStart(12, '0')}`,
      intakeId: 'HC-CAPOVER1',
      digest: DIGEST_B,
    });
    expect(overflow.type).toBe('unavailable');
    expect(aiIntakeMemoryClaimCountForTests()).toBe(AI_INTAKE_MEMORY_CLAIM_CAP);

    const replay = await store.claim(first);
    expect(replay.type).toBe('duplicate');
    if (replay.type === 'duplicate') expect(replay.record.status).toBe('sent');
    expect(aiIntakeMemoryClaimCountForTests()).toBe(AI_INTAKE_MEMORY_CLAIM_CAP);
  });

  it('prunes only expired memory claims and then acquires without exceeding the cap', async () => {
    let now = 2_000_000;
    setAiIntakeNowMsForTests(() => now);
    const store = getAiIntakeClaimStore()!;
    for (let i = 0; i < AI_INTAKE_MEMORY_CLAIM_CAP; i += 1) {
      const acquired = await store.claim({
        clientId: 'test-client',
        idempotencyKey: `bbbbbbbb-bbbb-4ccc-8ddd-${i.toString(16).padStart(12, '0')}`,
        intakeId: 'HC-CAPEXP01',
        digest: DIGEST_A,
      });
      expect(acquired.type).toBe('acquired');
    }
    expect(aiIntakeMemoryClaimCountForTests()).toBe(AI_INTAKE_MEMORY_CLAIM_CAP);

    now += AI_INTAKE_CLAIM_TTL_MS + 1;
    const replacement = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'cccccccc-bbbb-4ccc-8ddd-ffffffffffff',
      intakeId: 'HC-CAPNEW01',
      digest: DIGEST_B,
    });
    expect(replacement.type).toBe('acquired');
    expect(aiIntakeMemoryClaimCountForTests()).toBeLessThanOrEqual(AI_INTAKE_MEMORY_CLAIM_CAP);
    expect(aiIntakeMemoryClaimCountForTests()).toBe(1);
  });

  it('advances memory time for expiry via the test clock', async () => {
    let now = 1_000_000;
    setAiIntakeNowMsForTests(() => now);
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'eeeeeeee-bbbb-4ccc-8ddd-eeeeeeeeeeee',
      intakeId: 'HC-EXPIRE01',
      digest: DIGEST_A,
    };
    expect((await store.claim(key)).type).toBe('acquired');
    now += AI_INTAKE_CLAIM_TTL_MS + 1;
    expect((await store.claim(key)).type).toBe('acquired');
  });

  it('looks up memory claims without writing and treats expired records as absent', async () => {
    const now = 9_000_000;
    setAiIntakeNowMsForTests(() => now);
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-111111111111',
      intakeId: 'HC-LOOK0001',
      digest: DIGEST_A,
    };
    expect(await store.lookup({ clientId: key.clientId, idempotencyKey: key.idempotencyKey })).toEqual({
      type: 'absent',
    });
    expect((await store.claim(key)).type).toBe('acquired');
    expect(await store.update({ ...key, status: 'sent' })).toBe('updated');
    const found = await store.lookup({ clientId: key.clientId, idempotencyKey: key.idempotencyKey });
    expect(found.type).toBe('found');
    if (found.type === 'found') expect(found.record.status).toBe('sent');
    expect(aiIntakeMemoryClaimCountForTests()).toBe(1);

    setAiIntakeNowMsForTests(() => now + AI_INTAKE_CLAIM_TTL_MS + 1);
    expect(await store.lookup({ clientId: key.clientId, idempotencyKey: key.idempotencyKey })).toEqual({
      type: 'absent',
    });
    expect(aiIntakeMemoryClaimCountForTests()).toBe(1);
  });

  it('looks up Upstash records with one GET and no writes', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    const nowIso = new Date().toISOString();
    const record = {
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: DIGEST_A,
      status: 'sent',
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const raw = typeof init?.body === 'string'
        ? init.body
        : String(init?.body ?? '[]');
      const body = JSON.parse(raw) as unknown[];
      if (body[0] !== 'GET') {
        return new Response(JSON.stringify({ error: 'unexpected' }), { status: 200 });
      }
      return new Response(JSON.stringify({ result: JSON.stringify(record) }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    expect(store).not.toBeNull();
    const found = await store.lookup({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-222222222222',
    });
    expect(found).toEqual({ type: 'found', record });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain('SET');
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toContain('EVAL');

    fetchMock.mockImplementationOnce(async () => new Response(JSON.stringify({ result: null }), { status: 200 }));
    expect(await store.lookup({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-333333333333',
    })).toEqual({ type: 'absent' });

    fetchMock.mockImplementationOnce(async () => new Response(JSON.stringify({ error: 'nope' }), { status: 200 }));
    expect(await store.lookup({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-444444444444',
    })).toEqual({ type: 'unavailable' });
  });

  it('distinguishes Blob not-found from 500, abort, and invalid records on lookup', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-555555555555',
    };
    const nowIso = new Date().toISOString();

    getMock.mockReset();
    getMock.mockResolvedValue(blobGetResult({
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: DIGEST_A,
      status: 'sent',
      createdAt: nowIso,
      updatedAt: nowIso,
    }));
    const found = await store.lookup(key);
    expect(found.type).toBe('found');
    expect(putMock).not.toHaveBeenCalled();
    expect(delMock).not.toHaveBeenCalled();

    getMock.mockResolvedValueOnce(null);
    expect(await store.lookup(key)).toEqual({ type: 'absent' });

    getMock.mockResolvedValueOnce({ statusCode: 404, stream: null } as never);
    expect(await store.lookup(key)).toEqual({ type: 'absent' });

    getMock.mockResolvedValueOnce({ statusCode: 500, stream: null, headers: new Headers(), blob: {} } as never);
    expect(await store.lookup(key)).toEqual({ type: 'unavailable' });

    getMock.mockRejectedValueOnce(Object.assign(new Error('aborted'), { name: 'AbortError' }));
    expect(await store.lookup(key)).toEqual({ type: 'unavailable' });

    getMock.mockResolvedValueOnce(blobGetResult({ not: 'a-record' }));
    expect(await store.lookup(key)).toEqual({ type: 'unavailable' });
    expect(putMock).not.toHaveBeenCalled();
    expect(delMock).not.toHaveBeenCalled();
  });

  it('treats logically expired Blob records as absent without turning cleanup failure into unavailable', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    const now = 6_000_000;
    setAiIntakeNowMsForTests(() => now);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-666666666666',
    };
    const liveIso = new Date(now).toISOString();
    getMock.mockResolvedValueOnce(blobGetResult({
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: DIGEST_A,
      status: 'sent',
      createdAt: liveIso,
      updatedAt: liveIso,
    }, 'etag-live'));
    const live = await store.lookup(key);
    expect(live.type).toBe('found');
    expect(delMock).not.toHaveBeenCalled();

    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    getMock.mockResolvedValueOnce(blobGetResult({
      v: 1,
      intakeId: 'HC-ABCDEF01',
      digest: DIGEST_A,
      status: 'sent',
      createdAt: expiredIso,
      updatedAt: expiredIso,
    }, 'etag-expired'));
    delMock.mockRejectedValueOnce(new Error('cleanup TRACE'));
    expect(await store.lookup(key)).toEqual({ type: 'absent' });
    expect(delMock).toHaveBeenCalledWith(
      expect.stringMatching(/^ai-intake\/claims\/[a-f0-9]{64}\.json$/),
      expect.objectContaining({ ifMatch: 'etag-expired' }),
    );
    expect(putMock).not.toHaveBeenCalled();
  });

  it('acquires after an expired Blob lookup via the existing ETag replacement path', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    const now = 7_000_000;
    setAiIntakeNowMsForTests(() => now);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-777777777777',
      intakeId: 'HC-NEW00001',
      digest: DIGEST_B,
    };
    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    const expiredRecord = {
      v: 1,
      intakeId: 'HC-DEADBEEF',
      digest: DIGEST_A,
      status: 'sent' as const,
      createdAt: expiredIso,
      updatedAt: expiredIso,
    };
    getMock.mockImplementation(async () => blobGetResult(expiredRecord, 'etag-old'));
    delMock.mockResolvedValue(undefined as never);
    expect(await store.lookup({ clientId: key.clientId, idempotencyKey: key.idempotencyKey })).toEqual({
      type: 'absent',
    });

    putMock.mockImplementation(async (...args: unknown[]) => {
      const options = args[2] as { allowOverwrite?: boolean; ifMatch?: string } | undefined;
      if (!options || options.allowOverwrite !== true) {
        throw new BlobPreconditionFailedError();
      }
      expect(options.ifMatch).toBe('etag-old');
      return {
        url: 'https://blob.example/ai-intake/claims/x.json',
        downloadUrl: 'https://blob.example/ai-intake/claims/x.json',
        pathname: 'ai-intake/claims/x.json',
        contentType: 'application/json',
        contentDisposition: '',
        size: 2,
        uploadedAt: new Date(),
        etag: 'etag-new',
      } as never;
    });
    const acquired = await store.claim(key);
    expect(acquired.type).toBe('acquired');
  });

  it('fails closed on missing or unusable Blob ETags', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    const now = 8_000_000;
    setAiIntakeNowMsForTests(() => now);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const key = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-888888888888',
      intakeId: 'HC-ETAG0001',
      digest: DIGEST_A,
    };
    const nowIso = new Date(now).toISOString();
    const record = {
      v: 1,
      intakeId: key.intakeId,
      digest: key.digest,
      status: 'sending' as const,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    for (const etag of ['', '   ', 'etag\r\nunsafe']) {
      getMock.mockResolvedValueOnce(blobGetResult(record, etag));
      expect(await store.lookup(key), JSON.stringify(etag)).toEqual({ type: 'unavailable' });
    }
    const missingEtag = blobGetResult(record) as unknown as { blob: { etag?: string } };
    delete missingEtag.blob.etag;
    getMock.mockResolvedValueOnce(missingEtag as never);
    expect(await store.lookup(key)).toEqual({ type: 'unavailable' });

    putMock.mockReset();
    putMock.mockRejectedValueOnce(new BlobPreconditionFailedError());
    getMock.mockResolvedValueOnce(blobGetResult(record, ''));
    expect(await store.claim(key)).toEqual({ type: 'unavailable' });
    expect(putMock).toHaveBeenCalledTimes(1);

    getMock.mockResolvedValueOnce(blobGetResult(record, ''));
    expect(await store.update({ ...key, status: 'sent' })).toBe('unavailable');
    expect(delMock).not.toHaveBeenCalled();
    expect(putMock).toHaveBeenCalledTimes(1);
  });

  it('bounds a never-settling expired Blob cleanup and still reports the claim absent', async () => {
    vi.useFakeTimers();
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    const now = 9_000_000;
    setAiIntakeNowMsForTests(() => now);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    getMock.mockResolvedValueOnce(blobGetResult({
      v: 1,
      intakeId: 'HC-71AE0001',
      digest: DIGEST_A,
      status: 'sent',
      createdAt: expiredIso,
      updatedAt: expiredIso,
    }, 'etag-expired'));

    let cleanupSignal: AbortSignal | undefined;
    let markCleanupStarted!: () => void;
    const cleanupStarted = new Promise<void>((resolve) => {
      markCleanupStarted = resolve;
    });
    delMock.mockImplementation(async (_pathname, options) => {
      cleanupSignal = options?.abortSignal;
      markCleanupStarted();
      await new Promise<void>(() => undefined);
    });

    const pending = store.lookup({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-999999999999',
    });
    await vi.advanceTimersByTimeAsync(0);
    await cleanupStarted;
    expect(cleanupSignal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(AI_INTAKE_BACKEND_TIMEOUT_MS + 1);
    await expect(pending).resolves.toEqual({ type: 'absent' });
    expect(cleanupSignal?.aborted).toBe(true);
  });

  it('allows exactly one acquired claim when concurrent callers replace the same expired Blob ETag', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    const now = 10_000_000;
    setAiIntakeNowMsForTests(() => now);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    let current = {
      record: {
        v: 1,
        intakeId: 'HC-01D00001',
        digest: DIGEST_A,
        status: 'sent' as const,
        createdAt: expiredIso,
        updatedAt: expiredIso,
      },
      etag: 'etag-old',
    };
    let initialReads = 0;
    let releaseInitialReads!: () => void;
    const initialReadBarrier = new Promise<void>((resolve) => {
      releaseInitialReads = resolve;
    });
    getMock.mockImplementation(async () => {
      const snapshot = blobGetResult(current.record, current.etag);
      initialReads += 1;
      if (initialReads <= 2) {
        if (initialReads === 2) releaseInitialReads();
        await initialReadBarrier;
      }
      return snapshot;
    });
    putMock.mockImplementation(async (...args: unknown[]) => {
      const body = args[1] as string;
      const options = args[2] as { allowOverwrite?: boolean; ifMatch?: string } | undefined;
      if (!options?.allowOverwrite) throw new BlobPreconditionFailedError();
      if (!options.ifMatch || options.ifMatch !== current.etag) {
        throw new BlobPreconditionFailedError();
      }
      current = {
        record: JSON.parse(body) as typeof current.record,
        etag: 'etag-new',
      };
      return {} as never;
    });

    const input = {
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-aaaaaaaaaaaa',
      intakeId: 'HC-AE000002',
      digest: DIGEST_A,
    };
    const results = await Promise.all([store.claim(input), store.claim(input)]);
    expect(results.filter((result) => result.type === 'acquired')).toHaveLength(1);
    expect(results.filter((result) => result.type === 'duplicate')).toHaveLength(1);
    for (const call of putMock.mock.calls.filter((call) => call[2]?.allowOverwrite === true)) {
      expect(call[2]?.ifMatch).toBe('etag-old');
    }
  });

  it('keeps delayed expired cleanup from deleting a newer active Blob claim', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'blob-test-token');
    const now = 11_000_000;
    setAiIntakeNowMsForTests(() => now);
    resetAiIntakeClaimStoreForTests();
    const store = getAiIntakeClaimStore()!;
    const expiredIso = new Date(now - AI_INTAKE_CLAIM_TTL_MS - 1).toISOString();
    let current: { record: Record<string, unknown>; etag: string } | null = {
      record: {
        v: 1,
        intakeId: 'HC-01D00002',
        digest: DIGEST_A,
        status: 'sent',
        createdAt: expiredIso,
        updatedAt: expiredIso,
      },
      etag: 'etag-old',
    };
    getMock.mockImplementation(async () => {
      if (!current) return null;
      return blobGetResult(current.record, current.etag);
    });
    putMock.mockImplementation(async (...args: unknown[]) => {
      const body = args[1] as string;
      const options = args[2] as { allowOverwrite?: boolean; ifMatch?: string } | undefined;
      if (!options?.allowOverwrite) throw new BlobPreconditionFailedError();
      if (!current || !options.ifMatch || options.ifMatch !== current.etag) {
        throw new BlobPreconditionFailedError();
      }
      current = { record: JSON.parse(body) as Record<string, unknown>, etag: 'etag-new' };
      return {} as never;
    });
    let releaseCleanup!: () => void;
    const cleanupGate = new Promise<void>((resolve) => {
      releaseCleanup = resolve;
    });
    let markCleanupStarted!: () => void;
    const cleanupStarted = new Promise<void>((resolve) => {
      markCleanupStarted = resolve;
    });
    delMock.mockImplementation(async (_pathname, options) => {
      markCleanupStarted();
      await cleanupGate;
      if (!current || options?.ifMatch !== current.etag) throw new BlobPreconditionFailedError();
      current = null;
    });

    const lookup = store.lookup({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-bbbbbbbbbbbb',
    });
    await cleanupStarted;
    const claim = await store.claim({
      clientId: 'test-client',
      idempotencyKey: 'aaaaaaaa-bbbb-4ccc-8ddd-bbbbbbbbbbbb',
      intakeId: 'HC-AE000003',
      digest: DIGEST_A,
    });
    expect(claim.type).toBe('acquired');
    expect(current?.etag).toBe('etag-new');
    releaseCleanup();
    await expect(lookup).resolves.toEqual({ type: 'absent' });
    expect(current?.etag).toBe('etag-new');
  });
});
