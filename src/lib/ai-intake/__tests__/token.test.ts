import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetAiIntakeAuthCacheForTests } from '@/lib/ai-intake/auth';
import { resetAiIntakeClockForTests, setAiIntakeNowMsForTests } from '@/lib/ai-intake/clock';
import {
  hashAiIntakeIdempotencyKey,
  mintAiIntakeConfirmationToken,
  verifyAiIntakeConfirmationToken,
} from '@/lib/ai-intake/token';
import { stubAiIntakeTestEnv, TEST_AI_INTAKE_HMAC_SECRET } from '@/lib/ai-intake/__tests__/helpers';

const DIGEST = 'a'.repeat(64);
const IDEMPOTENCY_HASH = hashAiIntakeIdempotencyKey('aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee');

function mint(overrides: Partial<Parameters<typeof mintAiIntakeConfirmationToken>[0]> = {}) {
  return mintAiIntakeConfirmationToken({
    digest: DIGEST,
    intakeId: 'HC-A1B2C3D4',
    clientId: 'test-client',
    idempotencyKeyHash: IDEMPOTENCY_HASH,
    ...overrides,
  });
}

describe('ai intake confirmation token', () => {
  beforeEach(() => {
    stubAiIntakeTestEnv();
    setAiIntakeNowMsForTests(() => 1_700_000_000_000);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    resetAiIntakeClockForTests();
    resetAiIntakeAuthCacheForTests();
  });

  it('round-trips a valid token and rejects expiry, future iat, and wrong secret', () => {
    const minted = mint();
    expect(verifyAiIntakeConfirmationToken(minted.token).ok).toBe(true);

    const expired = verifyAiIntakeConfirmationToken(minted.token, 1_700_000_000 + 631);
    expect(expired.ok).toBe(false);
    if (!expired.ok) expect(expired.reason).toBe('expired');
    const notYet = verifyAiIntakeConfirmationToken(minted.token, 1_700_000_000 - 120);
    expect(notYet.ok).toBe(false);
    if (!notYet.ok) expect(notYet.reason).toBe('invalid');

    vi.stubEnv('AI_INTAKE_HMAC_SECRET', 'other-ai-intake-hmac-secret-do-not-use-live');
    const wrongSecret = verifyAiIntakeConfirmationToken(minted.token);
    expect(wrongSecret.ok).toBe(false);
    if (!wrongSecret.ok) expect(wrongSecret.reason).toBe('invalid');
  });

  it('rejects tampering of every payload field and the signature', () => {
    const minted = mint();
    const [payloadPart, signature] = minted.token.split('.');
    const json = JSON.parse(Buffer.from(payloadPart, 'base64url').toString('utf8')) as Record<string, unknown>;

    const fields: Array<[string, unknown]> = [
      ['v', 2],
      ['digest', 'b'.repeat(64)],
      ['intakeId', 'HC-DEADBEEF'],
      ['clientId', 'other-client'],
      ['idempotencyKeyHash', 'c'.repeat(64)],
      ['jti', 'ffffffff-ffff-4fff-8fff-ffffffffffff'],
      ['requirementsVersion', 'tampered'],
      ['iat', 1],
      ['exp', 1_700_000_000 + 10_000],
    ];
    for (const [key, value] of fields) {
      const tampered = { ...json, [key]: value };
      const part = Buffer.from(JSON.stringify(tampered), 'utf8').toString('base64url');
      const token = `${part}.${signature}`;
      expect(verifyAiIntakeConfirmationToken(token).ok, key).toBe(false);
    }

    const last = signature.slice(-1);
    const flipped = `${payloadPart}.${signature.slice(0, -1)}${last === 'a' ? 'b' : 'a'}`;
    expect(verifyAiIntakeConfirmationToken(flipped).ok).toBe(false);
  });

  it('rejects malformed and oversized tokens and missing secrets', () => {
    const minted = mint();
    expect(verifyAiIntakeConfirmationToken('').ok).toBe(false);
    expect(verifyAiIntakeConfirmationToken('abc').ok).toBe(false);
    expect(verifyAiIntakeConfirmationToken('a.b.c').ok).toBe(false);
    expect(verifyAiIntakeConfirmationToken(`${'a'.repeat(3000)}.${'b'.repeat(40)}`).ok).toBe(false);

    vi.stubEnv('AI_INTAKE_HMAC_SECRET', 'short');
    const weakSecret = verifyAiIntakeConfirmationToken(minted.token);
    expect(weakSecret.ok).toBe(false);
    if (!weakSecret.ok) expect(weakSecret.reason).toBe('config');
    expect(() => mint()).toThrow();
    expect(TEST_AI_INTAKE_HMAC_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
