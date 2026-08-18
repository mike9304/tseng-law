import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveBooking } from '@/lib/builder/bookings/storage';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import type { Booking } from '@/lib/builder/bookings/types';
import { POST } from '../route';

const { booking } = vi.hoisted(() => ({ booking: {
  bookingId: 'bk-member-1',
  serviceId: 'svc-1',
  staffId: 'staff-1',
  customer: { name: 'Member', email: 'member@example.com', locale: 'ko' },
  startAt: '2099-01-05T01:00:00.000Z',
  endAt: '2099-01-05T02:00:00.000Z',
  status: 'confirmed',
  source: 'web',
  reminders: [],
  createdAt: '2026-05-01T00:00:00.000Z',
  updatedAt: '2026-05-01T00:00:00.000Z',
} as Booking }));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 7, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: vi.fn(async () => ({ memberId: 'member-1', email: 'member@example.com' })),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMemberPortalEmails: vi.fn(() => ['member@example.com']),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  listBookings: vi.fn(async () => [booking]),
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

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({ emitEvent: vi.fn() }));

function request(
  origin: string | null = 'https://tseng-law.com',
  url = 'https://tseng-law.com/ko/account/bookings/bk-member-1/cancel',
): NextRequest {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-forwarded-for': '203.0.113.5',
  };
  if (origin !== null) headers.origin = origin;

  return new NextRequest(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ reason: 'Changed plans' }),
  });
}

const context = {
  params: Promise.resolve({ locale: 'ko', bookingId: 'bk-member-1' }),
};

describe('/[locale]/account/bookings/[bookingId]/cancel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects missing and cross-origin requests before session or cancellation side effects', async () => {
    const missing = await POST(request(null), context);
    const crossOrigin = await POST(request('https://attacker.example'), context);

    expect(missing.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    await expect(crossOrigin.json()).resolves.toMatchObject({
      error: 'csrf_origin_mismatch',
      code: 'csrf_origin_mismatch',
    });
    expect(getCurrentSiteMember).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
    expect(sendBookingCancellation).not.toHaveBeenCalled();
  });

  it('preserves authentication status after a valid same-origin CSRF check', async () => {
    vi.mocked(getCurrentSiteMember).mockResolvedValueOnce(null);

    const response = await POST(request(), context);

    expect(response.status).toBe(401);
    expect(saveBooking).not.toHaveBeenCalled();
    expect(sendBookingCancellation).not.toHaveBeenCalled();
  });

  it('preserves origin-less localhost development requests', async () => {
    const response = await POST(
      request(null, 'http://localhost:3000/ko/account/bookings/bk-member-1/cancel'),
      context,
    );

    expect(response.status).toBe(200);
    expect(saveBooking).toHaveBeenCalledOnce();
  });

  it('keeps the persisted cancellation successful when the email provider is unconfigured', async () => {
    vi.mocked(sendBookingCancellation).mockResolvedValueOnce({
      ok: false,
      provider: 'resend',
      reason: 'unconfigured',
    });

    const response = await POST(request(), context);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.booking.status).toBe('cancelled');
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'unconfigured' });
    expect(saveBooking).toHaveBeenCalled();
  });

  it('keeps the persisted cancellation successful when cancellation email rendering throws', async () => {
    vi.mocked(sendBookingCancellation).mockRejectedValueOnce(new Error('member private details'));

    const response = await POST(request(), context);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.booking.status).toBe('cancelled');
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'internal_error' });
    expect(JSON.stringify(payload)).not.toContain('member private details');
    expect(saveBooking).toHaveBeenCalled();
  });
});
