import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getQaRuntimeAttestation } from '@/lib/builder/security/qa-runtime-attestation';
import {
  checkDraftSaveRateLimit,
  checkMutationRateLimit,
  checkPublishRateLimit,
  resetRateLimitStore,
} from '@/lib/builder/security/rate-limit';

vi.mock('@/lib/builder/security/qa-runtime-attestation', () => ({
  getQaRuntimeAttestation: vi.fn(),
}));

const ORIGINAL_URL = process.env.UPSTASH_REDIS_REST_URL;
const ORIGINAL_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const ORIGINAL_RATE_LIMIT_BACKEND = process.env.BUILDER_RATE_LIMIT_BACKEND;
const getQaRuntimeAttestationMock = vi.mocked(getQaRuntimeAttestation);

describe('builder rate limit', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
    resetRateLimitStore();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.BUILDER_RATE_LIMIT_BACKEND;
    vi.restoreAllMocks();
    getQaRuntimeAttestationMock.mockReturnValue(null);
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
    expect(getQaRuntimeAttestationMock).toHaveBeenCalledTimes(3);
  });

  it('falls back to in-memory outside production when Upstash fails', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const result = await checkMutationRateLimit('198.51.100.1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
  });

  it('fails closed in production when Upstash is not configured', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const result = await checkMutationRateLimit('198.51.100.2');

    expect(result).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 0,
      reason: 'backend_unavailable',
    });
  });

  it('fails closed in production without exposing an Upstash request error', async () => {
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

  it('fails closed in production when Upstash returns an invalid response', async () => {
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

  it('fails closed in production when a successful pipeline response contains an error', async () => {
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
});
