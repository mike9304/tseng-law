import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkMutationRateLimit,
  checkPublishRateLimit,
  resetRateLimitStore,
} from '@/lib/builder/security/rate-limit';

const ORIGINAL_URL = process.env.UPSTASH_REDIS_REST_URL;
const ORIGINAL_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

describe('builder rate limit', () => {
  beforeEach(() => {
    resetRateLimitStore();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    resetRateLimitStore();
    if (ORIGINAL_URL) process.env.UPSTASH_REDIS_REST_URL = ORIGINAL_URL;
    else delete process.env.UPSTASH_REDIS_REST_URL;
    if (ORIGINAL_TOKEN) process.env.UPSTASH_REDIS_REST_TOKEN = ORIGINAL_TOKEN;
    else delete process.env.UPSTASH_REDIS_REST_TOKEN;
    vi.restoreAllMocks();
  });

  it('uses the in-memory fallback when Upstash is not configured', async () => {
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

  it('falls back to in-memory if Upstash fails closed', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.example';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'secret';
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const result = await checkMutationRateLimit('198.51.100.1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
  });
});
