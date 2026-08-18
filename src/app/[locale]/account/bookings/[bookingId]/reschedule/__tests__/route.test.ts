import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { saveBooking } from '@/lib/builder/bookings/storage';
import { acquireSlotLock } from '@/lib/builder/bookings/slot-lock';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import type { Booking } from '@/lib/builder/bookings/types';
import { POST } from '../route';

const { booking } = vi.hoisted(() => ({
  booking: {
    bookingId: 'bk-member-reschedule',
    serviceId: 'svc-reschedule',
    staffId: 'staff-reschedule',
    customer: { name: 'Member', email: 'member@example.com', locale: 'ko' },
    startAt: '2099-01-05T01:00:00.000Z',
    endAt: '2099-01-05T02:00:00.000Z',
    status: 'confirmed',
    source: 'web',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  } as Booking,
}));

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, remaining: 7, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/members/current-member', () => ({
  getCurrentSiteMember: vi.fn(async () => ({ memberId: 'member-1', email: 'member@example.com' })),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  getMemberPortalEmails: vi.fn(() => ['member@example.com']),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn(() => '2099-01-06T02:00:00.000Z'),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/refund', () => ({
  evaluateBookingSelfServicePolicy: vi.fn(async () => ({ canReschedule: true })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  hasDurableBookingStorage: vi.fn(() => true),
  listBookings: vi.fn(async () => [booking]),
  getService: vi.fn(async () => ({
    serviceId: 'svc-reschedule',
    durationMinutes: 60,
    requiredResourceIds: [],
  })),
  getStaff: vi.fn(async () => ({ staffId: 'staff-reschedule', isActive: true })),
  saveBooking: vi.fn(async () => undefined),
  timestamped: vi.fn((value, createdAt) => ({
    ...value,
    createdAt,
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(async () => ({ ownerToken: 'test-lease', keys: [], expiresAt: 9_999_999 })),
  releaseSlotLock: vi.fn(async () => undefined),
  renewSlotLock: vi.fn(async (lease) => lease),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

function request(
  origin: string | null = 'https://tseng-law.com',
  url = 'https://tseng-law.com/ko/account/bookings/bk-member-reschedule/reschedule',
): NextRequest {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (origin !== null) headers.origin = origin;

  return new NextRequest(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ startAt: '2099-01-06T01:00:00.000Z' }),
  });
}

const context = {
  params: Promise.resolve({ locale: 'ko', bookingId: 'bk-member-reschedule' }),
};

describe('/[locale]/account/bookings/[bookingId]/reschedule', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects missing and cross-origin requests before session or reschedule side effects', async () => {
    const missing = await POST(request(null), context);
    const crossOrigin = await POST(request('https://attacker.example'), context);

    expect(missing.status).toBe(403);
    expect(crossOrigin.status).toBe(403);
    await expect(crossOrigin.json()).resolves.toMatchObject({
      error: 'csrf_origin_mismatch',
      code: 'csrf_origin_mismatch',
    });
    expect(getCurrentSiteMember).not.toHaveBeenCalled();
    expect(acquireSlotLock).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
    expect(emitEvent).not.toHaveBeenCalled();
  });

  it('preserves same-origin success and performs the reschedule once', async () => {
    const response = await POST(request(), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      booking: {
        bookingId: 'bk-member-reschedule',
        startAt: '2099-01-06T01:00:00.000Z',
      },
    });
    expect(acquireSlotLock).toHaveBeenCalledOnce();
    expect(saveBooking).toHaveBeenCalledOnce();
    expect(emitEvent).toHaveBeenCalledOnce();
  });

  it('preserves authentication status after a valid same-origin CSRF check', async () => {
    vi.mocked(getCurrentSiteMember).mockResolvedValueOnce(null);

    const response = await POST(request(), context);

    expect(response.status).toBe(401);
    expect(acquireSlotLock).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('preserves origin-less localhost development requests', async () => {
    const response = await POST(
      request(
        null,
        'http://localhost:3000/ko/account/bookings/bk-member-reschedule/reschedule',
      ),
      context,
    );

    expect(response.status).toBe(200);
    expect(saveBooking).toHaveBeenCalledOnce();
  });
});
