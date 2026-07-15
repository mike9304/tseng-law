import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { isSlotAvailable } from '@/lib/builder/bookings/availability';
import {
  getService,
  getStaff,
  makeBookingId,
  saveBooking,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn((startAt: string) => new Date(new Date(startAt).getTime() + 30 * 60_000).toISOString()),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => null),
  getStaff: vi.fn(async () => null),
  makeBookingId: vi.fn(() => 'bk-route-test'),
  saveBooking: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingConfirmation: vi.fn(async () => ({
    ok: true,
    customer: { ok: true, provider: 'resend' },
  })),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runBookingBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(() => true),
  releaseSlotLock: vi.fn(() => undefined),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  redeemPackageCreditForBooking: vi.fn(async () => null),
  restorePackageCreditForBooking: vi.fn(async (booking) => booking),
}));

vi.mock('@/lib/builder/bookings/pricing', () => ({
  bookingServicePriceSnapshot: vi.fn(() => ({
    totalAmount: 0,
    amountDueNow: 0,
    currency: 'TWD',
  })),
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

function validBookingPayload() {
  return {
    serviceId: 'svc-route-test',
    staffId: 'staff-route-test',
    startAt: '2099-01-05T01:00:00.000Z',
    customer: {
      name: 'Client',
      email: 'client@example.com',
      locale: 'ko',
    },
    status: 'confirmed',
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/admin-create?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/admin-create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
    vi.mocked(sendBookingConfirmation).mockResolvedValue({
      ok: true,
      customer: { ok: true, provider: 'resend' },
    });
  });

  it('returns localized errors for invalid admin booking payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ serviceId: '', staffId: '', startAt: 'not-a-date' }, 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認預約資料。');
    expect(payload.errorCode).toBe('invalid_booking_payload');
    expect(payload.details).toHaveLength(3);
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized service/staff lookup errors', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Service or staff not found.',
      errorCode: 'service_or_staff_not_found',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized slot lock conflict errors', async () => {
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(acquireSlotLock).mockReturnValueOnce(false);
    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'ko'));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '선택한 시간이 다른 요청에서 예약 중입니다.',
      errorCode: 'slot_lock_conflict',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized unavailable slot errors', async () => {
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(isSlotAvailable).mockResolvedValueOnce(false);
    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '所選時段已無法預約。',
      errorCode: 'slot_unavailable',
    });
    expect(releaseSlotLock).toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('creates admin bookings with valid payloads', async () => {
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.booking).toEqual(expect.objectContaining({
      bookingId: 'bk-route-test',
      serviceId: 'svc-route-test',
      staffId: 'staff-route-test',
      source: 'admin',
      createdAt: '2026-05-01T00:00:00.000Z',
      updatedAt: '2026-05-02T00:00:00.000Z',
    }));
    expect(payload.emailDelivery).toEqual({
      ok: true,
      customer: { ok: true },
    });
    expect(makeBookingId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalled();
    expect(saveBooking).toHaveBeenCalledWith(payload.booking);
    expect(sendBookingConfirmation).toHaveBeenCalledWith(payload.booking, {
      service: expect.objectContaining({ serviceId: 'svc-route-test' }),
      staff: expect.objectContaining({ staffId: 'staff-route-test' }),
    });
  });

  it('keeps an admin booking successful and reports sanitized provider delivery failures', async () => {
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(sendBookingConfirmation).mockResolvedValueOnce({
      ok: false,
      customer: { ok: false, provider: 'resend', reason: 'provider_error', status: 502 },
      admin: { ok: false, provider: 'resend', reason: 'unconfigured' },
    });

    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveBooking).toHaveBeenCalledTimes(1);
    expect(payload.emailDelivery).toEqual({
      ok: false,
      customer: { ok: false, reason: 'provider_error' },
      admin: { ok: false, reason: 'unconfigured' },
    });
    expect(JSON.stringify(payload.emailDelivery)).not.toContain('502');
    expect(JSON.stringify(payload.emailDelivery)).not.toContain('resend');
  });

  it('keeps an admin booking successful when confirmation rendering throws', async () => {
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(sendBookingConfirmation).mockRejectedValueOnce(new Error('secret client@example.com render failure'));

    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveBooking).toHaveBeenCalledTimes(1);
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'internal_error' });
    expect(JSON.stringify(payload)).not.toContain('secret client@example.com render failure');
  });

  it('passes required resource ids into the price snapshot and records the resolved total', async () => {
    const resourceService = service({
      paymentMode: 'paid',
      priceAmount: 5000,
      priceCurrency: 'TWD',
      requiredResourceIds: ['room-a'],
    });
    vi.mocked(getService).mockResolvedValueOnce(resourceService);
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(bookingServicePriceSnapshot).mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 9000,
      currency: 'TWD',
      amountDueNow: 9000,
      balanceDueAfterOnlinePayment: 0,
      isDeposit: false,
      payLater: false,
    });
    const route = await import('../route');
    const response = await route.POST(postRequest(validBookingPayload(), 'en'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(vi.mocked(bookingServicePriceSnapshot)).toHaveBeenCalledWith(resourceService, { staffId: 'staff-route-test', resourceIds: ['room-a'] });
    expect(payload.booking.paymentAmount).toBe(9000);
    expect(payload.booking.resourceIds).toEqual(['room-a']);
  });
});
