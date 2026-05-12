import { describe, expect, it } from 'vitest';
import { createBookingManageToken, verifyBookingManageToken } from '@/lib/builder/bookings/manage-token';
import type { Booking } from '@/lib/builder/bookings/types';

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

describe('booking manage tokens', () => {
  it('round-trips a signed token with normalized email', () => {
    const token = createBookingManageToken(makeBooking(), 60_000);
    expect(verifyBookingManageToken(token)).toEqual({
      bookingId: 'bk-token-test',
      email: 'token@example.com',
    });
  });

  it('rejects tampered and expired tokens', () => {
    const token = createBookingManageToken(makeBooking(), 60_000);
    expect(verifyBookingManageToken(`${token}x`)).toBeNull();
    expect(verifyBookingManageToken(createBookingManageToken(makeBooking(), -1))).toBeNull();
  });
});
