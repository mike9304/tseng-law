import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  computeAvailableSlots,
  isSlotAvailable,
  type Slot,
} from '@/lib/builder/bookings/availability';
import {
  getService,
  getStaff,
  getWaitlistEntry,
  makeBookingId,
  saveBooking,
  saveWaitlistEntry,
  timestamped,
} from '@/lib/builder/bookings/storage';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import type { BookingService, BookingWaitlistEntry, Staff } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn((startAt: string) => new Date(new Date(startAt).getTime() + 30 * 60_000).toISOString()),
  computeAvailableSlots: vi.fn(async () => []),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => null),
  getStaff: vi.fn(async () => null),
  getWaitlistEntry: vi.fn(async () => null),
  makeBookingId: vi.fn(() => 'bk-promoted-route-test'),
  saveBooking: vi.fn(async () => undefined),
  saveWaitlistEntry: vi.fn(async () => undefined),
  timestamped: vi.fn((value: object, createdAt?: string) => ({
    ...value,
    createdAt: createdAt ?? '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-02T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingConfirmation: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(() => true),
  releaseSlotLock: vi.fn(() => undefined),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(() => undefined),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runBookingBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  redeemPackageCreditForBooking: vi.fn(async () => null),
  restorePackageCreditForBooking: vi.fn(async (booking) => booking),
}));

vi.mock('@/lib/builder/bookings/zoom-handoff', () => ({
  maybeCreateBookingZoomLink: vi.fn(async () => null),
}));

const availableSlot: Slot = {
  startAt: '2099-01-05T01:00:00.000Z',
  endAt: '2099-01-05T01:30:00.000Z',
  staffId: 'staff-route-test',
  timezone: 'Asia/Taipei',
};

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

function waitlistEntry(overrides: Partial<BookingWaitlistEntry> = {}): BookingWaitlistEntry {
  return {
    waitlistId: 'wl-route-test',
    serviceId: 'svc-route-test',
    staffId: 'staff-route-test',
    requestedDate: '2099-01-05',
    customer: {
      name: 'Client',
      email: 'client@example.com',
      locale: 'ko',
    },
    customerTimezone: 'Asia/Seoul',
    status: 'active',
    source: 'web',
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function postRequest(body: unknown = {}, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/waitlist/wl-route-test/promote?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/bookings/waitlist/[id]/promote', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized not-found errors for missing waitlist entries', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'en'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Waitlist entry not found.',
      errorCode: 'waitlist_not_found',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('keeps already-promoted waitlist entries idempotent', async () => {
    const existing = waitlistEntry({ status: 'promoted', promotedBookingId: 'bk-existing' });
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(existing);
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'ko'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ waitlist: existing, promotedBookingId: 'bk-existing' });
    expect(getService).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized errors when closed waitlist entries are promoted', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry({ status: 'closed' }));
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'ko'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '종료된 대기 목록은 예약으로 승격할 수 없습니다.',
      errorCode: 'waitlist_closed',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid promotion payloads', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    const route = await import('../route');
    const response = await route.POST(postRequest({ date: 'not-a-date' }, 'zh-hant'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe('請確認候補名單轉預約資料。');
    expect(payload.errorCode).toBe('invalid_waitlist_promotion_payload');
    expect(payload.details).toHaveLength(1);
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized service or staff availability errors', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'en'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Service or staff is not available.',
      errorCode: 'service_or_staff_not_available',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized errors for staff assignments outside the service', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    vi.mocked(getService).mockResolvedValueOnce(service({ staffIds: ['other-staff'] }));
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'ko'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '선택한 담당자는 이 서비스에 배정되어 있지 않습니다.',
      errorCode: 'staff_not_assigned_to_service',
    });
    expect(computeAvailableSlots).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized errors when no promotion slot exists', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'zh-hant'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '沒有可用時段可將此候補名單轉為預約。',
      errorCode: 'no_available_slot',
    });
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized slot lock conflict errors', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(computeAvailableSlots).mockResolvedValueOnce([availableSlot]);
    vi.mocked(acquireSlotLock).mockReturnValueOnce(false);
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'ko'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '선택한 시간이 다른 요청에서 예약 중입니다.',
      errorCode: 'slot_lock_conflict',
    });
    expect(releaseSlotLock).not.toHaveBeenCalled();
    expect(saveBooking).not.toHaveBeenCalled();
  });

  it('returns localized unavailable slot errors and releases the slot lock', async () => {
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(waitlistEntry());
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(computeAvailableSlots).mockResolvedValueOnce([availableSlot]);
    vi.mocked(isSlotAvailable).mockResolvedValueOnce(false);
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'zh-hant'), {
      params: { id: 'wl-route-test' },
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

  it('promotes waitlist entries into bookings with valid requests', async () => {
    const existing = waitlistEntry();
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(existing);
    vi.mocked(getService).mockResolvedValueOnce(service());
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(computeAvailableSlots).mockResolvedValueOnce([availableSlot]);
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'en'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.booking).toEqual(expect.objectContaining({
      bookingId: 'bk-promoted-route-test',
      serviceId: 'svc-route-test',
      staffId: 'staff-route-test',
      source: 'admin',
      status: 'confirmed',
      customerTimezone: 'Asia/Seoul',
    }));
    expect(payload.waitlist).toEqual(expect.objectContaining({
      waitlistId: 'wl-route-test',
      status: 'promoted',
      promotedBookingId: 'bk-promoted-route-test',
    }));
    expect(makeBookingId).toHaveBeenCalled();
    expect(timestamped).toHaveBeenCalledWith(expect.objectContaining({ bookingId: 'bk-promoted-route-test' }));
    expect(saveBooking).toHaveBeenCalledWith(payload.booking);
    expect(saveWaitlistEntry).toHaveBeenCalledWith(payload.waitlist);
    expect(sendBookingConfirmation).toHaveBeenCalledWith(payload.booking, {
      service: expect.objectContaining({ serviceId: 'svc-route-test' }),
      staff: expect.objectContaining({ staffId: 'staff-route-test' }),
    });
    expect(emitEvent).toHaveBeenCalledWith('booking.created', expect.objectContaining({
      bookingId: 'bk-promoted-route-test',
      waitlistId: 'wl-route-test',
      source: 'waitlist-promotion',
    }));
    expect(releaseSlotLock).toHaveBeenCalled();
  });

  it('persists resource-specific deposit amounts when promoting paid waitlist entries', async () => {
    const existing = waitlistEntry();
    vi.mocked(getWaitlistEntry).mockResolvedValueOnce(existing);
    vi.mocked(getService).mockResolvedValueOnce(service({
      paymentMode: 'paid',
      priceAmount: 5000,
      priceCurrency: 'TWD',
      depositAmount: 2000,
      requiredResourceIds: ['room-a'],
      resourcePriceOverrides: { 'room-a': 9000 },
    }));
    vi.mocked(getStaff).mockResolvedValueOnce(staff());
    vi.mocked(computeAvailableSlots).mockResolvedValueOnce([availableSlot]);
    const route = await import('../route');
    const response = await route.POST(postRequest({}, 'en'), {
      params: { id: 'wl-route-test' },
    });
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.booking).toEqual(expect.objectContaining({
      bookingId: 'bk-promoted-route-test',
      paymentAmount: 9000,
      paymentCurrency: 'TWD',
      paymentDueNow: 2000,
      depositAmount: 2000,
      paymentStatus: 'unpaid',
      resourceIds: ['room-a'],
    }));
    expect(saveBooking).toHaveBeenCalledWith(expect.objectContaining({
      paymentAmount: 9000,
      paymentDueNow: 2000,
      depositAmount: 2000,
      resourceIds: ['room-a'],
    }));
  });
});
