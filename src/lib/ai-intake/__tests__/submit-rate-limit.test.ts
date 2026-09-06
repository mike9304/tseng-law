import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AI_INTAKE_RATE_LIMITS, AI_INTAKE_RATE_WINDOW_MS } from '@/lib/ai-intake/constants';
import { setAiIntakeNowMsForTests } from '@/lib/ai-intake/clock';
import {
  AI_INTAKE_SUBMIT_RATE_LUA,
  enforceAiIntakeSubmitRateLimit,
  resetAiIntakeSubmitRateLimiterForTests,
  setAiIntakeSubmitRateLimiterForTests,
  type AiIntakeSubmitRateLimiter,
} from '@/lib/ai-intake/submit-rate-limit';
import { stubAiIntakeTestEnv, TEST_AI_INTAKE_CLIENT_ID } from '@/lib/ai-intake/__tests__/helpers';
import type { AiIntakeClient } from '@/lib/ai-intake/auth';

const client: AiIntakeClient = {
  clientId: TEST_AI_INTAKE_CLIENT_ID,
  keySha256: 'a'.repeat(64),
};

describe('ai intake submit rate limit', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    resetAiIntakeSubmitRateLimiterForTests();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    resetAiIntakeSubmitRateLimiterForTests();
  });

  it('admits only the client threshold under a concurrent burst', async () => {
    const burst = AI_INTAKE_RATE_LIMITS.submit.client + 8;
    const results = await Promise.all(Array.from({ length: burst }, () => enforceAiIntakeSubmitRateLimit({
      client,
      ip: '203.0.113.10',
    })));
    expect(results.filter((result) => result.allowed)).toHaveLength(AI_INTAKE_RATE_LIMITS.submit.client);
    expect(results.filter((result) => !result.allowed && result.kind === 'throttled').length).toBeGreaterThan(0);
  });

  it('enforces client and IP dimensions separately', async () => {
    const clientMax = AI_INTAKE_RATE_LIMITS.submit.client;
    for (let i = 0; i < clientMax; i += 1) {
      const allowed = await enforceAiIntakeSubmitRateLimit({ client, ip: `203.0.113.${i}` });
      expect(allowed.allowed).toBe(true);
    }
    const clientBlocked = await enforceAiIntakeSubmitRateLimit({ client, ip: '198.51.100.9' });
    expect(clientBlocked).toEqual({ allowed: false, kind: 'throttled', retryAfterSeconds: expect.any(Number) });

    resetAiIntakeSubmitRateLimiterForTests();
    const ipMax = AI_INTAKE_RATE_LIMITS.submit.ip;
    for (let i = 0; i < ipMax; i += 1) {
      const allowed = await enforceAiIntakeSubmitRateLimit({
        client: { ...client, clientId: `client-${i}` },
        ip: '203.0.113.50',
      });
      expect(allowed.allowed).toBe(true);
    }
    const ipBlocked = await enforceAiIntakeSubmitRateLimit({
      client: { ...client, clientId: 'client-extra' },
      ip: '203.0.113.50',
    });
    expect(ipBlocked.allowed).toBe(false);
  });

  it('expires hits after the window', async () => {
    let now = 5_000_000;
    setAiIntakeNowMsForTests(() => now);
    for (let i = 0; i < AI_INTAKE_RATE_LIMITS.submit.client; i += 1) {
      expect((await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).allowed).toBe(true);
    }
    expect((await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).allowed).toBe(false);
    now += AI_INTAKE_RATE_WINDOW_MS + 1;
    expect((await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).allowed).toBe(true);
  });

  it('fails closed in production when the atomic backend is missing', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    resetAiIntakeSubmitRateLimiterForTests();
    expect(await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).toEqual({
      allowed: false,
      kind: 'backend_unavailable',
    });
  });

  it('fails closed when the backend throws or returns an error', async () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('upstash down');
    }));
    resetAiIntakeSubmitRateLimiterForTests();
    expect(await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).toEqual({
      allowed: false,
      kind: 'backend_unavailable',
    });

    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'noscript' }), { status: 200 })));
    expect(await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).toEqual({
      allowed: false,
      kind: 'backend_unavailable',
    });
  });

  it('uses EVAL for the production limiter and does not log backend bodies', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://redis.example.test');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'upstash-test-token');
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? '[]')) as unknown[];
      expect(body[0]).toBe('EVAL');
      expect(body[1]).toBe(AI_INTAKE_SUBMIT_RATE_LUA);
      return new Response(JSON.stringify({ result: [1, 1, 0] }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    resetAiIntakeSubmitRateLimiterForTests();
    const logged: string[] = [];
    const errorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
      logged.push(args.map(String).join(' '));
    });
    const logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      logged.push(args.map(String).join(' '));
    });
    expect((await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).allowed).toBe(true);
    const requestBody = String(fetchMock.mock.calls[0]?.[1]?.body ?? '');
    expect(requestBody).not.toContain('203.0.113.10');
    expect(requestBody).not.toContain(TEST_AI_INTAKE_CLIENT_ID);
    expect(logged.join('\n')).not.toContain('upstash-test-token');
    errorSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('propagates an injected limiter throw as backend unavailable', async () => {
    const limiter: AiIntakeSubmitRateLimiter = {
      async consume() {
        throw new Error('limiter exploded');
      },
    };
    setAiIntakeSubmitRateLimiterForTests(limiter);
    expect(await enforceAiIntakeSubmitRateLimit({ client, ip: '203.0.113.10' })).toEqual({
      allowed: false,
      kind: 'backend_unavailable',
    });
  });
});
