import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { decryptToken, encryptToken } from '@/lib/builder/bookings/calendar-sync/encryption';

describe('calendar-sync token encryption', () => {
  beforeEach(() => {
    process.env.CMS_SESSION_SECRET = 'test-secret-value-do-not-use-in-prod';
  });
  afterEach(() => {
    delete process.env.CMS_SESSION_SECRET;
  });

  it('round-trips a refresh token', () => {
    const original = 'ya29.refresh-token-fake-value';
    const encrypted = encryptToken(original);
    expect(encrypted.split(':')).toHaveLength(3);
    expect(decryptToken(encrypted)).toBe(original);
  });

  it('throws on tampered ciphertext (GCM auth tag mismatch)', () => {
    const encrypted = encryptToken('payload');
    const [iv, cipher, tag] = encrypted.split(':');
    // Flip a byte in the cipher portion.
    const tampered = `${iv}:${cipher.replace(/^./, (c) => (c === '0' ? '1' : '0'))}:${tag}`;
    expect(() => decryptToken(tampered)).toThrow();
  });

  it('throws when secret is missing', () => {
    delete process.env.CMS_SESSION_SECRET;
    expect(() => encryptToken('whatever')).toThrow(/CMS_SESSION_SECRET/);
  });
});
