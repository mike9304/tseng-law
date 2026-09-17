import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  authenticateAiIntakeRequest,
  getConfiguredAiIntakeClientIds,
  resetAiIntakeAuthCacheForTests,
} from '@/lib/ai-intake/auth';
import {
  TEST_AI_INTAKE_CLIENT_ID,
  TEST_AI_INTAKE_CLIENT_KEY,
  stubAiIntakeTestEnv,
  testClientKeySha256,
} from '@/lib/ai-intake/__tests__/helpers';

describe('ai intake auth', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeAuthCacheForTests();
  });

  it('authenticates a matching bearer digest and never returns the key', () => {
    stubAiIntakeTestEnv();
    const result = authenticateAiIntakeRequest(new Headers({
      authorization: `Bearer ${TEST_AI_INTAKE_CLIENT_KEY}`,
    }));
    expect(result).toEqual({
      ok: true,
      client: expect.objectContaining({ clientId: TEST_AI_INTAKE_CLIENT_ID }),
    });
    expect(JSON.stringify(result)).not.toContain(TEST_AI_INTAKE_CLIENT_KEY);
  });

  it('returns unauthenticated for missing or invalid bearer without distinguishing details', () => {
    stubAiIntakeTestEnv();
    const missing = authenticateAiIntakeRequest(new Headers());
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.reason).toBe('unauthenticated');
    const wrong = authenticateAiIntakeRequest(new Headers({
      authorization: 'Bearer definitely-wrong-client-key-value',
    }));
    expect(wrong.ok).toBe(false);
    if (!wrong.ok) expect(wrong.reason).toBe('unauthenticated');
    const originOnly = authenticateAiIntakeRequest(new Headers({
      origin: 'https://tseng-law.com',
    }));
    expect(originOnly.ok).toBe(false);
    if (!originOnly.ok) expect(originOnly.reason).toBe('unauthenticated');
  });

  it('fails closed on missing, malformed, or duplicate client config', () => {
    vi.stubEnv('AI_INTAKE_CLIENTS', '');
    resetAiIntakeAuthCacheForTests();
    const missingConfig = authenticateAiIntakeRequest(new Headers({
      authorization: `Bearer ${TEST_AI_INTAKE_CLIENT_KEY}`,
    }));
    expect(missingConfig.ok).toBe(false);
    if (!missingConfig.ok) expect(missingConfig.reason).toBe('config');

    vi.stubEnv('AI_INTAKE_CLIENTS', '{not-json');
    resetAiIntakeAuthCacheForTests();
    const malformed = authenticateAiIntakeRequest(new Headers({
      authorization: `Bearer ${TEST_AI_INTAKE_CLIENT_KEY}`,
    }));
    expect(malformed.ok).toBe(false);
    if (!malformed.ok) expect(malformed.reason).toBe('config');

    vi.stubEnv('AI_INTAKE_CLIENTS', JSON.stringify([
      { clientId: 'one', keySha256: testClientKeySha256() },
      { clientId: 'one', keySha256: 'a'.repeat(64) },
    ]));
    resetAiIntakeAuthCacheForTests();
    const duplicate = authenticateAiIntakeRequest(new Headers({
      authorization: `Bearer ${TEST_AI_INTAKE_CLIENT_KEY}`,
    }));
    expect(duplicate.ok).toBe(false);
    if (!duplicate.ok) expect(duplicate.reason).toBe('config');
  });

  it('returns only configured client IDs without hashes, limits, or mutable access', () => {
    const firstHash = testClientKeySha256();
    const secondHash = 'a'.repeat(64);
    vi.stubEnv('AI_INTAKE_CLIENTS', JSON.stringify([
      {
        clientId: 'chatgpt-production',
        keySha256: firstHash,
        limits: { requirementsMax: 100, previewMax: 20, submitMax: 5 },
      },
      { clientId: 'grok-production', keySha256: secondHash },
    ]));
    resetAiIntakeAuthCacheForTests();

    const result = getConfiguredAiIntakeClientIds();

    expect(result).toEqual(['chatgpt-production', 'grok-production']);
    expect(Object.isFrozen(result)).toBe(true);
    expect(JSON.stringify(result)).not.toContain(firstHash);
    expect(JSON.stringify(result)).not.toContain(secondHash);
    expect(JSON.stringify(result)).not.toContain('limits');
    expect(JSON.stringify(result)).not.toContain('requirementsMax');
  });

  it.each([
    undefined,
    '',
    '{not-json',
    JSON.stringify([{ clientId: 'bad id', keySha256: 'a'.repeat(64) }]),
    JSON.stringify([
      { clientId: 'duplicate', keySha256: 'a'.repeat(64) },
      { clientId: 'duplicate', keySha256: 'b'.repeat(64) },
    ]),
  ])('returns an empty ID list for unconfigured or invalid config %#', (raw) => {
    vi.stubEnv('AI_INTAKE_CLIENTS', raw);
    resetAiIntakeAuthCacheForTests();

    expect(() => getConfiguredAiIntakeClientIds()).not.toThrow();
    expect(getConfiguredAiIntakeClientIds()).toEqual([]);
  });
});
