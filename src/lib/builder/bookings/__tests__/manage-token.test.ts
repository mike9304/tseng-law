import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBookingManageToken, verifyBookingManageToken } from '@/lib/builder/bookings/manage-token';
import type { Booking } from '@/lib/builder/bookings/types';

const STRONG_DEDICATED_SECRET = 'booking-manage-test-secret-at-least-32-bytes';
const STRONG_CMS_SECRET = 'cms-session-test-secret-at-least-32-bytes';

function makeBooking(): Pick<Booking, 'bookingId' | 'customer'> {
  return {
    bookingId: 'bk-token-test',
    customer: {
      name: 'Token Tester',
      email: 'TOKEN@example.com',
      locale: 'ko',
    },
  };
}

function clearSigningSecrets(): void {
  vi.stubEnv('BOOKING_MANAGE_TOKEN_SECRET', '');
  vi.stubEnv('BOOKINGS_MANAGE_SECRET', '');
  vi.stubEnv('CMS_SESSION_SECRET', '');
  vi.stubEnv('NEXTAUTH_SECRET', '');
}

describe('booking manage tokens', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('round-trips a signed token with normalized email', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BOOKING_MANAGE_TOKEN_SECRET', STRONG_DEDICATED_SECRET);
    const token = createBookingManageToken(makeBooking(), 60_000);
    expect(verifyBookingManageToken(token)).toEqual({
      bookingId: 'bk-token-test',
      email: 'token@example.com',
    });
  });

  it('rejects tampered and expired tokens', () => {
    vi.stubEnv('BOOKING_MANAGE_TOKEN_SECRET', STRONG_DEDICATED_SECRET);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T00:00:00.000Z'));
    const token = createBookingManageToken(makeBooking(), 60_000);
    expect(verifyBookingManageToken(`${token}x`)).toBeNull();
    expect(verifyBookingManageToken(`${token}.extra`)).toBeNull();

    vi.advanceTimersByTime(60_001);
    expect(verifyBookingManageToken(token)).toBeNull();
  });

  it('fails closed in production when no strong server secret is configured', () => {
    vi.stubEnv('NODE_ENV', 'production');
    clearSigningSecrets();

    expect(() => createBookingManageToken(makeBooking(), 60_000)).toThrow(
      /BOOKING_MANAGE_TOKEN_SECRET/,
    );
    expect(verifyBookingManageToken('payload.signature')).toBeNull();
  });

  it('does not treat the legacy or a short configured secret as a production signing key', () => {
    vi.stubEnv('NODE_ENV', 'production');
    clearSigningSecrets();
    vi.stubEnv('BOOKINGS_MANAGE_SECRET', 'legacy-secret-that-used-to-be-accepted');
    vi.stubEnv('BOOKING_MANAGE_TOKEN_SECRET', 'too-short');

    expect(() => createBookingManageToken(makeBooking(), 60_000)).toThrow(
      /BOOKING_MANAGE_TOKEN_SECRET/,
    );
  });

  it('accepts a strong server-only fallback when the dedicated secret is unavailable', () => {
    vi.stubEnv('NODE_ENV', 'production');
    clearSigningSecrets();
    vi.stubEnv('CMS_SESSION_SECRET', STRONG_CMS_SECRET);

    const token = createBookingManageToken(makeBooking(), 60_000);
    expect(verifyBookingManageToken(token)).toEqual({
      bookingId: 'bk-token-test',
      email: 'token@example.com',
    });
  });

  it('uses a deterministic local fallback only in an explicit development environment', () => {
    clearSigningSecrets();
    vi.stubEnv('NODE_ENV', 'development');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-30T00:00:00.000Z'));

    const first = createBookingManageToken(makeBooking(), 60_000);
    const second = createBookingManageToken(makeBooking(), 60_000);
    expect(first).toBe(second);
    expect(verifyBookingManageToken(first)).toEqual({
      bookingId: 'bk-token-test',
      email: 'token@example.com',
    });

    vi.stubEnv('NODE_ENV', '');
    expect(() => createBookingManageToken(makeBooking(), 60_000)).toThrow(
      /BOOKING_MANAGE_TOKEN_SECRET/,
    );
  });
});
