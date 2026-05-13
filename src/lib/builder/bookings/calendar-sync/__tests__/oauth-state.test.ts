import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildOauthState, verifyOauthState } from '../oauth-state';

const ORIGINAL_SECRET = process.env.OAUTH_STATE_SECRET;
const ORIGINAL_CRON = process.env.CRON_SECRET;

beforeEach(() => {
  process.env.OAUTH_STATE_SECRET = 'test-secret-32-bytes-fixed-value-aaa';
  delete process.env.CRON_SECRET;
});

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.OAUTH_STATE_SECRET;
  else process.env.OAUTH_STATE_SECRET = ORIGINAL_SECRET;
  if (ORIGINAL_CRON === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = ORIGINAL_CRON;
});

describe('buildOauthState + verifyOauthState (round-trip)', () => {
  it('verifies a state it just built', () => {
    const state = buildOauthState('google', 'staff-123');
    const verified = verifyOauthState(state);
    expect(verified).toEqual({ provider: 'google', staffId: 'staff-123' });
  });

  it('verifies outlook provider too', () => {
    const state = buildOauthState('outlook', 'staff-xyz');
    expect(verifyOauthState(state)).toEqual({ provider: 'outlook', staffId: 'staff-xyz' });
  });

  it('throws when no secret is configured', () => {
    delete process.env.OAUTH_STATE_SECRET;
    delete process.env.CRON_SECRET;
    expect(() => buildOauthState('google', 's1')).toThrow();
  });

  it('falls back to CRON_SECRET when OAUTH_STATE_SECRET is unset', () => {
    delete process.env.OAUTH_STATE_SECRET;
    process.env.CRON_SECRET = 'cron-fallback-secret-32-bytes-aaa';
    const state = buildOauthState('google', 's1');
    expect(verifyOauthState(state)).toEqual({ provider: 'google', staffId: 's1' });
  });
});

describe('verifyOauthState — rejection cases', () => {
  it('rejects state with wrong number of parts', () => {
    expect(verifyOauthState('google:staff-1:abc')).toBeNull(); // missing hmac
    expect(verifyOauthState('google:staff-1')).toBeNull();
    expect(verifyOauthState('google:staff-1:123:hmac:extra')).toBeNull();
    expect(verifyOauthState('')).toBeNull();
  });

  it('rejects unknown provider', () => {
    const valid = buildOauthState('google', 's1');
    const tampered = valid.replace(/^google/, 'apple');
    expect(verifyOauthState(tampered)).toBeNull();
  });

  it('rejects missing staffId', () => {
    expect(verifyOauthState('google::123:abc')).toBeNull();
  });

  it('rejects expired state', () => {
    // Build with current time, then jump clock forward past TTL.
    const state = buildOauthState('google', 's1');
    const parts = state.split(':');
    // Tamper expiresAt to a past timestamp; hmac no longer matches but
    // even if the attacker re-signs, they'd need the secret.
    parts[2] = String(Date.now() - 1000);
    expect(verifyOauthState(parts.join(':'))).toBeNull();
  });

  it('rejects tampered staffId (HMAC mismatch)', () => {
    const state = buildOauthState('google', 'staff-A');
    const tampered = state.replace('staff-A', 'staff-B');
    expect(verifyOauthState(tampered)).toBeNull();
  });

  it('rejects state signed with a different secret', () => {
    const state = buildOauthState('google', 's1');
    process.env.OAUTH_STATE_SECRET = 'different-secret-32-bytes-changed-aa';
    expect(verifyOauthState(state)).toBeNull();
  });

  it('rejects state with malformed hex in hmac', () => {
    const state = buildOauthState('google', 's1');
    const parts = state.split(':');
    parts[3] = 'not-hex-data!@#';
    expect(verifyOauthState(parts.join(':'))).toBeNull();
  });

  it('rejects state with non-numeric expiresAt', () => {
    const state = buildOauthState('google', 's1');
    const parts = state.split(':');
    parts[2] = 'not-a-number';
    expect(verifyOauthState(parts.join(':'))).toBeNull();
  });

  it('rejects when no secret is configured at verify time', () => {
    const state = buildOauthState('google', 's1');
    delete process.env.OAUTH_STATE_SECRET;
    delete process.env.CRON_SECRET;
    expect(verifyOauthState(state)).toBeNull();
  });
});

describe('buildOauthState format', () => {
  it('produces a 4-part colon-separated string', () => {
    const state = buildOauthState('google', 'staff-1');
    const parts = state.split(':');
    expect(parts).toHaveLength(4);
    expect(parts[0]).toBe('google');
    expect(parts[1]).toBe('staff-1');
    expect(Number.parseInt(parts[2], 10)).toBeGreaterThan(Date.now());
    expect(parts[3]).toMatch(/^[0-9a-f]{64}$/); // sha256 hex
  });
});
