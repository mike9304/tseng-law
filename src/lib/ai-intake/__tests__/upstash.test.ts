import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readAiIntakeUpstashEnvelope, resolveAiIntakeUpstash } from '@/lib/ai-intake/upstash';

describe('readAiIntakeUpstashEnvelope', () => {
  it('treats HTTP 200 result null as a successful Redis nil', () => {
    expect(readAiIntakeUpstashEnvelope({ result: null })).toEqual({ ok: true, result: null });
    expect(readAiIntakeUpstashEnvelope({ result: 'OK' })).toEqual({ ok: true, result: 'OK' });
  });

  it('fails closed on missing result, nonempty error, or non-object bodies', () => {
    expect(readAiIntakeUpstashEnvelope(null).ok).toBe(false);
    expect(readAiIntakeUpstashEnvelope('OK').ok).toBe(false);
    expect(readAiIntakeUpstashEnvelope({ error: 'NOSCRIPT' }).ok).toBe(false);
    expect(readAiIntakeUpstashEnvelope({ error: 'ERR', result: null }).ok).toBe(false);
    expect(readAiIntakeUpstashEnvelope({ ok: true }).ok).toBe(false);
  });
});

const EXPLICIT_URL = 'https://explicit-redis.example.test/';
const EXPLICIT_TOKEN = 'explicit-synthetic-token';
const KV_URL = 'https://kv-redis.example.test/';
const KV_TOKEN = 'kv-synthetic-token';

function clearRedisEnv(): void {
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
  vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
  vi.stubEnv('KV_REST_API_URL', '');
  vi.stubEnv('KV_REST_API_TOKEN', '');
  vi.stubEnv('KV_REST_API_READ_ONLY_TOKEN', '');
  vi.stubEnv('REDIS_URL', '');
  vi.stubEnv('KV_URL', '');
}

describe('resolveAiIntakeUpstash', () => {
  beforeEach(() => {
    clearRedisEnv();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('accepts a complete KV REST pair when the explicit pair is absent', () => {
    vi.stubEnv('KV_REST_API_URL', KV_URL);
    vi.stubEnv('KV_REST_API_TOKEN', KV_TOKEN);
    expect(resolveAiIntakeUpstash()).toEqual({
      url: 'https://kv-redis.example.test',
      token: KV_TOKEN,
    });
  });

  it('prefers a complete explicit pair when both families are present', () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', EXPLICIT_URL);
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', EXPLICIT_TOKEN);
    vi.stubEnv('KV_REST_API_URL', KV_URL);
    vi.stubEnv('KV_REST_API_TOKEN', KV_TOKEN);
    expect(resolveAiIntakeUpstash()).toEqual({
      url: 'https://explicit-redis.example.test',
      token: EXPLICIT_TOKEN,
    });
  });

  it('returns null for a partial explicit pair even when KV is complete', () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', EXPLICIT_URL);
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');
    vi.stubEnv('KV_REST_API_URL', KV_URL);
    vi.stubEnv('KV_REST_API_TOKEN', KV_TOKEN);
    expect(resolveAiIntakeUpstash()).toBeNull();

    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', EXPLICIT_TOKEN);
    expect(resolveAiIntakeUpstash()).toBeNull();
  });

  it('returns null when KV is missing or incomplete and the explicit pair is absent', () => {
    expect(resolveAiIntakeUpstash()).toBeNull();
    vi.stubEnv('KV_REST_API_URL', KV_URL);
    expect(resolveAiIntakeUpstash()).toBeNull();
    vi.stubEnv('KV_REST_API_URL', '');
    vi.stubEnv('KV_REST_API_TOKEN', KV_TOKEN);
    expect(resolveAiIntakeUpstash()).toBeNull();
  });

  it('accepts KV when explicit variables are blank after trimming', () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '   ');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '\t');
    vi.stubEnv('KV_REST_API_URL', `  ${KV_URL}  `);
    vi.stubEnv('KV_REST_API_TOKEN', `  ${KV_TOKEN}  `);
    expect(resolveAiIntakeUpstash()).toEqual({
      url: 'https://kv-redis.example.test',
      token: KV_TOKEN,
    });
  });

  it('does not mix families or accept read-only or legacy URL tokens', () => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', EXPLICIT_URL);
    vi.stubEnv('KV_REST_API_TOKEN', KV_TOKEN);
    expect(resolveAiIntakeUpstash()).toBeNull();

    clearRedisEnv();
    vi.stubEnv('KV_REST_API_URL', KV_URL);
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', EXPLICIT_TOKEN);
    expect(resolveAiIntakeUpstash()).toBeNull();

    clearRedisEnv();
    vi.stubEnv('KV_REST_API_URL', KV_URL);
    vi.stubEnv('KV_REST_API_READ_ONLY_TOKEN', 'read-only-synthetic-token');
    vi.stubEnv('REDIS_URL', 'redis://legacy.example.test:6379');
    vi.stubEnv('KV_URL', 'https://kv-url.example.test');
    expect(resolveAiIntakeUpstash()).toBeNull();
  });
});
