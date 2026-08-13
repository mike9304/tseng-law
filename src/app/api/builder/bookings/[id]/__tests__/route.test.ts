import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { isSlotAvailable } from '@/lib/builder/bookings/availability';
import {
  getBooking,
  getService,
  getStaff,
  saveBooking,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { sendBookingCancellation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { restorePackageCreditForBooking } from '@/lib/builder/bookings/packages';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn((startAt: string) => new Date(new Date(startAt).getTime() + 30 * 60_000).toISOString()),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async () => null),
  getService: vi.fn(async () => null),
  getStaff: vi.fn(async () => null),
  saveBooking: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingCancellation: vi.fn(async () => ({ ok: true, provider: 'resend', id: 'email-1' })),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(async () => ({ ownerToken: 'test-lease', keys: [], expiresAt: 9_999_999 })),
  releaseSlotLock: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  restorePackageCreditForBooking: vi.fn(async (booking) => booking),
}));

vi.mock('@/lib/builder/bookings/zoom-handoff', () => ({
  maybeCreateBookingZoomLink: vi.fn(async () => null),
}));

function service(overrides: Partial<BookingService> = {}): BookingService {
  return {
    serviceId: 'svc-route-test',
    slug: 'initial-consultation',
    name: { ko: '초기 상담', 'zh-hant': '初步諮詢', en: 'Initial consultation' },
    description: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
    durationMinutes: 30,
    priceTwd: 0,
    staffIds: ['staff-route-test'],
    requiredResourceIds: [],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    maxParticipants: 1,
    slotStepMinutes: 30,
    isActive: true,
    paymentMode: 'free',
    priceCurrency: 'TWD',
    meetingMode: 'in-person',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function staff(overrides: Partial<Staff> = {}): Staff {
  return {
    staffId: 'staff-route-test',
    name: { ko: '담당자', 'zh-hant': '員工', en: 'Staff' },
    title: { ko: '상담사', 'zh-hant': '顧問', en: 'Advisor' },
    email: 'staff@example.com',
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-route-test',
    serviceId: 'svc-route-test',
    staffId: 'staff-route-test',
    customer: {
      name: 'Client',
      email: 'client@example.com',
      locale: 'ko',
    },
    startAt: '2099-01-05T01:00:00.000Z',
    endAt: '2099-01-05T01:30:00.000Z',
    status: 'confirmed',
    source: 'admin',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function patchRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/bk-route-test?locale=${locale}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing bookings', async () => {
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'cancelled' }, 'en'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Booking not found.',
      errorCode: 'booking_not_found',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid booking patch payloads', async () => {
    vi.mocked(getBooking).mockResolvedValueOnce(booking());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'invalid-status' }, 'zh-hant'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認預約資料。');
    expect(payload.errorCode).toBe('invalid_booking_payload');
    expect(payload.details).toHaveLength(1);
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized service/staff lookup errors', async () => {
    vi.mocked(getBooking).mockResolvedValueOnce(booking());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'confirmed' }, 'ko'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '서비스 또는 담당자를 찾을 수 없습니다.',
      errorCode: 'service_or_staff_not_found',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized slot lock conflict errors', async () => {
    vi.mocked(getBooking).mockResolvedValueOnce(booking());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(acquireSlotLock).mockResolvedValueOnce(null);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ startAt: '2099-01-05T02:00:00.000Z' }, 'ko'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '선택한 시간이 다른 요청에서 예약 중입니다.',
      errorCode: 'slot_lock_conflict',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized unavailable slot errors', async () => {
    vi.mocked(getBooking).mockResolvedValueOnce(booking());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(isSlotAvailable).mockResolvedValueOnce(false);
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ startAt: '2099-01-05T02:00:00.000Z' }, 'zh-hant'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '所選時段已無法預約。',
      errorCode: 'slot_unavailable',
    });
    expect(releaseSlotLock).toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('updates bookings with valid patch payloads', async () => {
    const existing = booking();
    vi.mocked(getBooking).mockResolvedValueOnce(existing);
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'cancelled', cancellationReason: 'Client request' }, 'en'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.booking).toEqual(expect.objectContaining({
      bookingId: 'bk-route-test',
      status: 'cancelled',
      cancellationReason: 'Client request',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ status: 'cancelled' }), existing.createdAt);
    expect(restorePackageCreditForBooking).toHaveBeenCalled();
    expect(saveBooking).toHaveBeenCalledWith(payload.booking);
    expect(sendBookingCancellation).toHaveBeenCalledWith(payload.booking, {
      service: expect.objectContaining({ serviceId: 'svc-route-test' }),
      staff: expect.objectContaining({ staffId: 'staff-route-test' }),
    });
    expect(payload.emailDelivery).toEqual({ ok: true });
  });

  it('keeps a persisted admin cancellation successful when the email provider is unconfigured', async () => {
    vi.mocked(getBooking).mockResolvedValueOnce(booking());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(sendBookingCancellation).mockResolvedValueOnce({
      ok: false,
      provider: 'resend',
      reason: 'unconfigured',
    });

    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'cancelled' }, 'en'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.booking.status).toBe('cancelled');
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'unconfigured' });
    expect(saveBooking).toHaveBeenCalledWith(payload.booking);
  });

  it('keeps a persisted admin cancellation successful when cancellation email rendering throws', async () => {
    vi.mocked(getBooking).mockResolvedValueOnce(booking());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(sendBookingCancellation).mockRejectedValueOnce(new Error('secret template failure'));

    const route = await import('../route');
    const response = await route.PATCH(patchRequest({ status: 'cancelled' }, 'en'), {
      params: Promise.resolve({ id: 'bk-route-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.booking.status).toBe('cancelled');
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'internal_error' });
    expect(JSON.stringify(payload)).not.toContain('secret template failure');
    expect(saveBooking).toHaveBeenCalledWith(payload.booking);
  });
});
