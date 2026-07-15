import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveBooking } from '@/lib/builder/bookings/storage';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import type { Booking } from '@/lib/builder/bookings/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 7, retryAfterMs: 0 })),
}));

const { booking } = vi.hoisted(() => ({ booking: {
  bookingId: 'bk-cancel-1',
  serviceId: 'svc-1',
  staffId: 'staff-1',
  customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
  startAt: '2099-01-05T01:00:00.000Z',
  endAt: '2099-01-05T02:00:00.000Z',
  status: 'confirmed',
  source: 'web',
  reminders: [],
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
} as Booking }));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async () => booking),
  getService: vi.fn(async () => ({ serviceId: 'svc-1' })),
  getStaff: vi.fn(async () => ({ staffId: 'staff-1' })),
  saveBooking: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/refund', () => ({
  evaluateBookingSelfServicePolicy: vi.fn(async () => ({ canCancel: true })),
  computeRefundForCancel: vi.fn(async () => ({
    decision: 'none',
    refundResult: null,
    refundAmountCents: 0,
    hoursUntilStart: 12,
  })),
  applyRefundOutcome: vi.fn((value) => ({ ...value, status: 'cancelled', cancelledAt: '2026-05-02T00:00:00.000Z' })),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingCancellation: vi.fn(async () => ({ ok: true, provider: 'resend', id: 'email-1' })),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  restorePackageCreditForBooking: vi.fn(async (value) => value),
}));

vi.mock('@/lib/builder/bookings/manage-token', () => ({
  verifyBookingManageToken: vi.fn(() => ({ bookingId: 'bk-cancel-1', email: 'client@example.com' })),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({ emitEvent: vi.fn() }));

function request(): NextRequest {
  return new NextRequest('https://law.example.test/api/booking/cancel', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.4' },
    body: JSON.stringify({ bookingId: 'bk-cancel-1', token: 'signed-token' }),
  });
}

describe('/api/booking/cancel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('keeps the persisted cancellation successful when the email provider reports failure', async () => {
    vi.mocked(sendBookingCancellation).mockResolvedValueOnce({
      ok: false,
      provider: 'resend',
      reason: 'provider_error',
      status: 502,
    });

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.booking.status).toBe('cancelled');
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'provider_error' });
    expect(saveBooking).toHaveBeenCalled();
  });

  it('keeps the persisted cancellation successful when cancellation email rendering throws', async () => {
    vi.mocked(sendBookingCancellation).mockRejectedValueOnce(new Error('private template failure'));

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.booking.status).toBe('cancelled');
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'internal_error' });
    expect(JSON.stringify(payload)).not.toContain('private template failure');
    expect(saveBooking).toHaveBeenCalled();
  });
});
