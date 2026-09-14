import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBooking, hasDurableBookingStorage, saveBooking } from '@/lib/builder/bookings/storage';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock, renewSlotLock } from '@/lib/builder/bookings/slot-lock';
import { computeRefundForCancel } from '@/lib/builder/bookings/refund';
import { restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
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
  hasDurableBookingStorage: vi.fn(() => true),
  saveBooking: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/refund', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/bookings/refund')>(
    '@/lib/builder/bookings/refund',
  );
  return {
    ...actual,
    evaluateBookingSelfServicePolicy: vi.fn(async () => ({ canCancel: true })),
    computeRefundForCancel: vi.fn(async () => ({
      decision: 'none',
      refundResult: null,
      refundAmountCents: 0,
      hoursUntilStart: 12,
    })),
    applyRefundOutcome: vi.fn((value) => ({ ...value, status: 'cancelled', cancelledAt: '2026-05-02T00:00:00.000Z' })),
  };
});

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingCancellation: vi.fn(async () => ({ ok: true, provider: 'resend', id: 'email-1' })),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  restorePackageCreditForBooking: vi.fn(async (value) => value),
}));

vi.mock('@/lib/builder/bookings/manage-token', () => ({
  verifyBookingManageToken: vi.fn(() => ({ bookingId: 'bk-cancel-1', email: 'client@example.com' })),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(async () => ({ ownerToken: 'test-lease', keys: [], expiresAt: 9_999_999 })),
  releaseSlotLock: vi.fn(async () => undefined),
  renewSlotLock: vi.fn(async (lease) => lease),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({ emitEvent: vi.fn() }));

function request(): NextRequest {
  return new NextRequest('https://law.example.test/api/booking/cancel', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.4',
      origin: 'https://tseng-law.com',
    },
    body: JSON.stringify({ bookingId: 'bk-cancel-1', token: 'signed-token' }),
  });
}

describe('/api/booking/cancel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hasDurableBookingStorage).mockReturnValue(true);
    vi.mocked(acquireSlotLock).mockResolvedValue({ ownerToken: 'test-lease', keys: [], expiresAt: 9_999_999 });
    vi.mocked(getBooking).mockResolvedValue(booking);
    vi.mocked(saveBooking).mockResolvedValue(undefined);
    vi.mocked(computeRefundForCancel).mockResolvedValue({
      decision: 'none',
      refundResult: null,
      refundAmountCents: 0,
      hoursUntilStart: 12,
    });
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

  it('rejects a cross-site cancellation before rate-limit or booking access', async () => {
    const crossSite = new NextRequest('https://law.example.test/api/booking/cancel', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://attacker.example' },
      body: JSON.stringify({ bookingId: 'bk-cancel-1', token: 'signed-token' }),
    });

    const response = await POST(crossSite);

    expect(response.status).toBe(403);
    expect(getBooking).not.toHaveBeenCalled();
  });

  it('fails closed before booking access when durable storage is unavailable', async () => {
    vi.mocked(hasDurableBookingStorage).mockReturnValue(false);

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.errorCode).toBe('booking_storage_unavailable');
    expect(getBooking).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
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

  it('serializes concurrent cancellation before refund and persistence', async () => {
    vi.mocked(acquireSlotLock)
      .mockResolvedValueOnce({ ownerToken: 'first-lease', keys: [], expiresAt: 9_999_999 })
      .mockResolvedValueOnce(null);

    const [first, second] = await Promise.all([POST(request()), POST(request())]);

    expect([first.status, second.status].sort()).toEqual([200, 409]);
    expect(computeRefundForCancel).toHaveBeenCalledTimes(1);
    expect(saveBooking).toHaveBeenCalledTimes(1);
  });

  it('does not persist cancellation when refund returns ok:false', async () => {
    vi.mocked(computeRefundForCancel).mockResolvedValueOnce({
      decision: 'full',
      refundResult: { ok: false, error: 'Stripe 402' },
      refundAmountCents: 50000,
      hoursUntilStart: 48,
    });

    const response = await POST(request());
    const payload = await response.json();
    const body = JSON.stringify(payload);

    expect(response.status).toBe(502);
    expect(payload.errorCode).toBe('booking_refund_failed');
    expect(payload.error).toBe('We could not confirm the refund status or booking cancellation. Please contact us for help.');
    expect(payload).not.toHaveProperty('refundResult');
    expect(body).not.toContain('Stripe 402');
    expect(saveBooking).not.toHaveBeenCalled();
    expect(restorePackageCreditForBooking).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
    expect(sendBookingCancellation).not.toHaveBeenCalled();
    expect(releaseSlotLock).toHaveBeenCalledTimes(1);
  });

  it('does not persist cancellation when refund computation throws', async () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(computeRefundForCancel).mockRejectedValueOnce(new Error('stripe network'));

    const response = await POST(request());
    const payload = await response.json();
    const body = JSON.stringify(payload);

    expect(response.status).toBe(502);
    expect(payload.errorCode).toBe('booking_refund_failed');
    expect(payload.error).toBe('We could not confirm the refund status or booking cancellation. Please contact us for help.');
    expect(payload).not.toHaveProperty('refundResult');
    expect(body).not.toContain('stripe network');
    expect(saveBooking).not.toHaveBeenCalled();
    expect(restorePackageCreditForBooking).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
    expect(sendBookingCancellation).not.toHaveBeenCalled();
    expect(releaseSlotLock).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });

  it('returns 503 when refund succeeded but slot lock renew fails before persist', async () => {
    vi.mocked(computeRefundForCancel).mockResolvedValueOnce({
      decision: 'full',
      refundResult: { ok: true, refundId: 're_1' },
      refundAmountCents: 50000,
      hoursUntilStart: 48,
    });
    vi.mocked(renewSlotLock).mockResolvedValueOnce(null);

    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.errorCode).toBe('booking_storage_unavailable');
    expect(restorePackageCreditForBooking).toHaveBeenCalledTimes(1);
    expect(saveBooking).not.toHaveBeenCalled();
    expect(sendBookingCancellation).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
    expect(releaseSlotLock).toHaveBeenCalledTimes(1);
  });

  it('rejects when refund succeeded but persist throws', async () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(computeRefundForCancel).mockResolvedValueOnce({
      decision: 'full',
      refundResult: { ok: true, refundId: 're_1' },
      refundAmountCents: 50000,
      hoursUntilStart: 48,
    });
    vi.mocked(saveBooking).mockRejectedValueOnce(new Error('blob down'));

    await expect(POST(request())).rejects.toThrow('blob down');
    expect(computeRefundForCancel).toHaveBeenCalledTimes(1);
    expect(restorePackageCreditForBooking).toHaveBeenCalledTimes(1);
    expect(saveBooking).toHaveBeenCalledTimes(1);
    expect(sendBookingCancellation).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
    expect(releaseSlotLock).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
