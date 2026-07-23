import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getQaRuntimeAttestation } from '@/lib/builder/security/qa-runtime-attestation';
import {
  BLOB_RATE_MARKER_BODY,
  checkDraftSaveRateLimit,
  checkMutationRateLimit,
  checkPublishRateLimit,
  hashRateLimitKey,
  resetRateLimitStore,
} from '@/lib/builder/security/rate-limit';

vi.mock('@/lib/builder/security/qa-runtime-attestation', () => ({
  getQaRuntimeAttestation: vi.fn(),
}));

vi.mock('@vercel/blob', () => ({
  list: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
}));

import { del, list, put } from '@vercel/blob';

const ORIGINAL_URL = process.env.UPSTASH_REDIS_REST_URL;
const ORIGINAL_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ORIGINAL_RATE_LIMIT_BACKEND = process.env.BUILDER_RATE_LIMIT_BACKEND;
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const getQaRuntimeAttestationMock = vi.mocked(getQaRuntimeAttestation);
const listMock = vi.mocked(list);
const putMock = vi.mocked(put);
const delMock = vi.mocked(del);

function blobItem(pathname: string, uploadedAt = new Date()) {
  return {
    url: `https://blob.example/${pathname}`,
    downloadUrl: `https://blob.example/${pathname}?download=1`,
    pathname,
    size: 0,
    uploadedAt,
    etag: 'etag',
  };
}

describe('builder rate limit', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    resetRateLimitStore();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.BUILDER_RATE_LIMIT_BACKEND;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    vi.restoreAllMocks();
    getQaRuntimeAttestationMock.mockReturnValue(null);
    listMock.mockReset();
    putMock.mockReset();
    delMock.mockReset();
    listMock.mockResolvedValue({ blobs: [], hasMore: false });
    // Mirror real Vercel Blob: empty body throws (regression guard for production fallback).
    putMock.mockImplementation(async (pathname, body) => {
      if (body === '' || body == null) {
        throw new Error('Vercel Blob: body is required');
      }
      return {
        url: `https://blob.example/${pathname}`,
        downloadUrl: `https://blob.example/${pathname}?download=1`,
        pathname: String(pathname),
        contentType: 'text/plain',
        contentDisposition: '',
        size: typeof body === 'string' ? body.length : 1,
        uploadedAt: new Date(),
        etag: 'etag',
      } as never;
    });
    delMock.mockResolvedValue(undefined as never);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetRateLimitStore();
    if (ORIGINAL_URL) process.env.UPSTASH_REDIS_REST_URL = ORIGINAL_URL;
    else delete process.env.UPSTASH_REDIS_REST_URL;
    if (ORIGINAL_TOKEN) process.env.UPSTASH_REDIS_REST_TOKEN = ORIGINAL_TOKEN;
    else delete process.env.UPSTASH_REDIS_REST_TOKEN;
    if (ORIGINAL_RATE_LIMIT_BACKEND) {
      process.env.BUILDER_RATE_LIMIT_BACKEND = ORIGINAL_RATE_LIMIT_BACKEND;
    } else {
      delete process.env.BUILDER_RATE_LIMIT_BACKEND;
    }
    if (ORIGINAL_BLOB_TOKEN) process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    else delete process.env.BLOB_READ_WRITE_TOKEN;
    vi.restoreAllMocks();
  });

  it('uses the bounded in-memory fallback outside production when Upstash is not configured', async () => {
    for (let index = 0; index < 60; index += 1) {
      const result = await checkMutationRateLimit('127.0.0.1');
      expect(result.allowed).toBe(true);
    }
    const blocked = await checkMutationRateLimit('127.0.0.1');
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(listMock).not.toHaveBeenCalled();
  });

  it('uses the publish 10/min policy', async () => {
    for (let index = 0; index < 10; index += 1) {
      const result = await checkPublishRateLimit('127.0.0.2');
      expect(result.allowed).toBe(true);
    }
    const blocked = await checkPublishRateLimit('127.0.0.2');
    expect(blocked.allowed).toBe(false);
  });

  it('keeps draft autosaves in a higher-volume bucket', async () => {
    for (let index = 0; index < 180; index += 1) {
      const result = await checkDraftSaveRateLimit('127.0.0.3');
      expect(result.allowed).toBe(true);
    }
    const blocked = await checkDraftSaveRateLimit('127.0.0.3');
    expect(blocked.allowed).toBe(false);
  });

  it('calls Upstash Redis REST when configured', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([
        { result: 0 },
        { result: 2 },
        { result: 1 },
        { result: 1 },
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );

    const result = await checkMutationRateLimit('203.0.113.1');

    expect(result).toMatchObject({ allowed: true, remaining: 57 });
    expect(fetchMock).toHaveBeenCalledWith('https://redis.example/pipeline', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: 'Bearer secret',
      }),
    }));
    expect(listMock).not.toHaveBeenCalled();
  });

  it('fails closed for an unattested isolated QA backend even outside production', async () => {
    process.env.BUILDER_RATE_LIMIT_BACKEND = 'isolated-qa';

    const result = await checkMutationRateLimit('192.0.2.1');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(getQaRuntimeAttestationMock).toHaveBeenCalledWith();
  });

  it('fails closed when isolated QA attestation validation throws', async () => {
    process.env.BUILDER_RATE_LIMIT_BACKEND = 'isolated-qa';
    getQaRuntimeAttestationMock.mockImplementation(() => {
      throw new Error('private manifest validation detail');
    });

    const result = await checkMutationRateLimit('192.0.2.3');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(JSON.stringify(result)).not.toContain('private manifest');
  });

  it.each([
    { schemaVersion: 3, state: 'starting', runId: 'a'.repeat(32) },
    { schemaVersion: 2, state: 'ready', runId: 'a'.repeat(32) },
    { state: 'ready', runId: 'a'.repeat(32) },
  ])('fails closed for a truthy but non-ready or malformed QA attestation (%o)', async (attestation) => {
    process.env.BUILDER_RATE_LIMIT_BACKEND = 'isolated-qa';
    getQaRuntimeAttestationMock.mockReturnValue(attestation as never);

    const result = await checkMutationRateLimit('192.0.2.4');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
  });

  it('uses only the bounded in-memory limiter for a ready isolated QA runtime', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BUILDER_RATE_LIMIT_BACKEND = 'isolated-qa';
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    vi.stubEnv('BUILDER_MUTATION_RATE_LIMIT', '2');
    getQaRuntimeAttestationMock.mockReturnValue({
      schemaVersion: 3,
      state: 'ready',
      runId: 'a'.repeat(32),
    } as never);
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    expect(await checkMutationRateLimit('192.0.2.2')).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(await checkMutationRateLimit('192.0.2.2')).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    const blocked = await checkMutationRateLimit('192.0.2.2');

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(listMock).not.toHaveBeenCalled();
    expect(getQaRuntimeAttestationMock).toHaveBeenCalledTimes(3);
  });

  it('falls back to in-memory outside production when Upstash fails', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const result = await checkMutationRateLimit('198.51.100.1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
    expect(listMock).not.toHaveBeenCalled();
  });

  it('allows production requests via Blob when Upstash is not configured', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    vi.stubEnv('BUILDER_MUTATION_RATE_LIMIT', '3');
    listMock.mockResolvedValue({ blobs: [], hasMore: false });

    const result = await checkMutationRateLimit('198.51.100.10');

    expect(result).toMatchObject({ allowed: true, remaining: 2 });
    expect(putMock).toHaveBeenCalledTimes(1);
    const putPath = putMock.mock.calls[0]?.[0] as string;
    const putBody = putMock.mock.calls[0]?.[1];
    const putOpts = putMock.mock.calls[0]?.[2] as { access?: string; token?: string };
    expect(putPath).toContain(hashRateLimitKey('mutation:198.51.100.10'));
    expect(putPath).not.toContain('198.51.100.10');
    expect(BLOB_RATE_MARKER_BODY).not.toBe('');
    expect(putBody).toBe(BLOB_RATE_MARKER_BODY);
    expect(putBody).not.toContain('198.51.100.10');
    expect(putBody).not.toContain('blob-token');
    expect(putOpts.access).toBe('private');
    expect(putOpts.token).toBe('blob-token');
  });

  it('allows production requests via Blob when Upstash fails', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('credential-bearing upstream detail'));
    listMock.mockResolvedValue({ blobs: [], hasMore: false });

    const result = await checkMutationRateLimit('198.51.100.11');

    expect(result).toMatchObject({ allowed: true });
    expect(listMock).toHaveBeenCalled();
    expect(putMock).toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain('credential-bearing');
  });

  it('fails closed in production when Upstash and Blob are both unavailable', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const result = await checkMutationRateLimit('198.51.100.2');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(listMock).not.toHaveBeenCalled();
  });

  it('fails closed in production when Upstash fails and Blob is missing without exposing upstream detail', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('credential-bearing upstream detail'));

    const result = await checkMutationRateLimit('198.51.100.3');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(JSON.stringify(result)).not.toContain('credential-bearing');
  });

  it('fails closed in production when Blob list fails', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    listMock.mockRejectedValue(new Error('blob list credential detail'));

    const result = await checkMutationRateLimit('198.51.100.12');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(JSON.stringify(result)).not.toContain('credential');
    expect(putMock).not.toHaveBeenCalled();
  });

  it('fails closed in production when Blob put fails', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    listMock.mockResolvedValue({ blobs: [], hasMore: false });
    putMock.mockRejectedValue(new Error('blob put credential detail'));

    const result = await checkMutationRateLimit('198.51.100.13');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(JSON.stringify(result)).not.toContain('credential');
  });

  it('fails closed in production when Blob list returns an invalid item', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    listMock.mockResolvedValue({
      blobs: [{ ...blobItem('builder/rate-limit/abc/not-a-marker'), pathname: 'builder/rate-limit/abc/not-a-marker' }],
      hasMore: false,
    });

    const result = await checkMutationRateLimit('198.51.100.14');

    expect(result).toMatchObject({ allowed: false, reason: 'backend_unavailable' });
    expect(putMock).not.toHaveBeenCalled();
  });

  it('does not put raw IP into blob pathname or body', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    const ip = '203.0.113.55';
    listMock.mockResolvedValue({ blobs: [], hasMore: false });

    await checkMutationRateLimit(ip);

    const putPath = String(putMock.mock.calls[0]?.[0] ?? '');
    const putBody = putMock.mock.calls[0]?.[1];
    expect(putPath).not.toContain(ip);
    expect(putPath).toContain(hashRateLimitKey(`mutation:${ip}`));
    expect(putBody).toBe(BLOB_RATE_MARKER_BODY);
    expect(String(putBody)).not.toContain(ip);
    expect(BLOB_RATE_MARKER_BODY.length).toBeGreaterThan(0);
    expect(JSON.stringify(listMock.mock.calls)).not.toContain(ip);
  });

  it('rejects empty Blob put body (production fallback must use non-empty safe constant)', async () => {
    // Guard against regressing to put(path, '') which real Vercel Blob rejects.
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    listMock.mockResolvedValue({ blobs: [], hasMore: false });

    const result = await checkMutationRateLimit('198.51.100.30');

    expect(result).toMatchObject({ allowed: true });
    expect(putMock).toHaveBeenCalledTimes(1);
    const putBody = putMock.mock.calls[0]?.[1];
    expect(putBody).toBe(BLOB_RATE_MARKER_BODY);
    expect(putBody).not.toBe('');
    expect(putBody).not.toBeNull();
    expect(putBody).not.toBeUndefined();
    // Simulated empty put would fail closed — prove the mock enforces it.
    await expect(
      putMock('probe', '', { access: 'private', token: 'blob-token' }),
    ).rejects.toThrow(/body is required/i);
  });

  it('blocks when the Blob window count reaches the limit with positive retryAfterMs', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    vi.stubEnv('BUILDER_MUTATION_RATE_LIMIT', '2');
    const now = Date.now();
    const keyHash = hashRateLimitKey('mutation:198.51.100.20');
    listMock.mockResolvedValue({
      blobs: [
        blobItem(`builder/rate-limit/${keyHash}/${now - 1_000}-aaaa-bbbb-cccc-dddddddddddd`),
        blobItem(`builder/rate-limit/${keyHash}/${now - 500}-eeee-ffff-0000-111111111111`),
      ],
      hasMore: false,
    });

    const blocked = await checkMutationRateLimit('198.51.100.20');

    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(putMock).not.toHaveBeenCalled();
  });

  it('bounds expired marker cleanup deletes', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    vi.stubEnv('BUILDER_MUTATION_RATE_LIMIT', '10');
    const now = Date.now();
    const keyHash = hashRateLimitKey('mutation:198.51.100.21');
    const expired = Array.from({ length: 40 }, (_, index) => (
      blobItem(`builder/rate-limit/${keyHash}/${now - 120_000 - index}-expired-${index}`)
    ));
    listMock.mockResolvedValue({ blobs: expired, hasMore: false });

    const result = await checkMutationRateLimit('198.51.100.21');

    expect(result.allowed).toBe(true);
    expect(delMock).toHaveBeenCalledTimes(1);
    const deleted = delMock.mock.calls[0]?.[0] as string[];
    expect(Array.isArray(deleted)).toBe(true);
    expect(deleted.length).toBeLessThanOrEqual(25);
    expect(deleted.length).toBe(25);
  });

  it('fails closed in production when Upstash returns an invalid response and Blob is missing', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ result: 0 }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await checkMutationRateLimit('198.51.100.4');

    expect(result).toMatchObject({ allowed: false, reason: 'backend_unavailable' });
  });

  it('fails closed in production when a successful pipeline response contains an error and Blob is missing', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([
        { result: 0 },
        { error: 'ERR upstream detail' },
        { result: 1 },
        { result: 1 },
      ]), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    );

    const result = await checkMutationRateLimit('198.51.100.5');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
    expect(JSON.stringify(result)).not.toContain('upstream detail');
  });

  it('honestly allows overshoot under concurrent list-then-put (Blob is not atomic)', async () => {
    // list-then-put is not compare-and-set: two concurrent checks can both see
    // count 0 and both put, exceeding limit=1. This is accepted for the
    // authenticated builder mutation fallback only — not a general atomic limiter.
    vi.stubEnv('NODE_ENV', 'production');
    process.env.BLOB_READ_WRITE_TOKEN = 'blob-token';
    vi.stubEnv('BUILDER_MUTATION_RATE_LIMIT', '1');
    listMock.mockResolvedValue({ blobs: [], hasMore: false });

    const [a, b] = await Promise.all([
      checkMutationRateLimit('198.51.100.99'),
      checkMutationRateLimit('198.51.100.99'),
    ]);

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
    expect(putMock).toHaveBeenCalledTimes(2);
  });
});
