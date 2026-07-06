import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { isSlotAvailable } from '@/lib/builder/bookings/availability';
import { verifyBookingManageToken } from '@/lib/builder/bookings/manage-token';
import { getBooking, getService, getStaff } from '@/lib/builder/bookings/storage';
import { evaluateBookingSelfServicePolicy, type BookingSelfServicePolicy } from '@/lib/builder/bookings/refund';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import type { Booking, BookingService, Staff } from '@/lib/builder/bookings/types';
import { GET, PATCH } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn(() => '2026-06-10T02:00:00.000Z'),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/manage-token', () => ({
  verifyBookingManageToken: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(),
  getService: vi.fn(),
  getStaff: vi.fn(),
  saveBooking: vi.fn(async () => undefined),
  timestamped: vi.fn((booking, createdAt) => ({
    ...booking,
    createdAt,
    updatedAt: '2026-06-03T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/refund', () => ({
  applyRefundOutcome: vi.fn((booking) => ({
    ...booking,
    status: 'cancelled',
    cancelledAt: '2026-06-03T00:00:00.000Z',
  })),
  computeRefundForCancel: vi.fn(async () => ({
    decision: 'none',
    hoursUntilStart: 12,
    refundResult: null,
  })),
  evaluateBookingSelfServicePolicy: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingCancellation: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  restorePackageCreditForBooking: vi.fn(async (booking) => booking),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(() => true),
  releaseSlotLock: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/zoom-handoff', () => ({
  maybeCreateBookingZoomLink: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

const policy: BookingSelfServicePolicy = {
  policyId: null,
  name: 'Default booking policy',
  hoursUntilStart: 12,
  canCancel: true,
  canReschedule: true,
  cancelHoursBefore: 0,
  rescheduleHoursBefore: 0,
  fullRefundHoursBefore: 0,
  partialRefundHoursBefore: 0,
  partialRefundPercent: 0,
  cancellationFeePercent: 0,
  refundDecision: 'none',
};

const service: BookingService = {
  serviceId: 'svc-1',
  slug: 'consult',
  name: { ko: '상담', 'zh-hant': '諮詢', en: 'Consultation' },
  description: { ko: '상담 설명', 'zh-hant': '諮詢說明', en: 'Consultation details' },
  durationMinutes: 60,
  staffIds: ['staff-1'],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  isActive: true,
  paymentMode: 'free',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const staff: Staff = {
  staffId: 'staff-1',
  name: { ko: '담당자', 'zh-hant': '員工', en: 'Staff' },
  title: { ko: '변호사', 'zh-hant': '律師', en: 'Attorney' },
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-1',
    serviceId: 'svc-1',
    staffId: 'staff-1',
    customer: {
      name: 'Client One',
      email: 'client@example.com',
      phone: '010',
      locale: 'ko',
    },
    startAt: '2026-06-10T01:00:00.000Z',
    endAt: '2026-06-10T02:00:00.000Z',
    status: 'confirmed',
    source: 'web',
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    reminders: [],
    ...overrides,
  };
}

function request(method: 'GET' | 'PATCH', query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/booking/manage/token-1${query}`, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.9',
    },
    ...(body === undefined ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  });
}

const context = { params: { token: 'token-1' } };
const checkRateLimitMock = vi.mocked(checkRateLimit);
const verifyBookingManageTokenMock = vi.mocked(verifyBookingManageToken);
const getBookingMock = vi.mocked(getBooking);
const getServiceMock = vi.mocked(getService);
const getStaffMock = vi.mocked(getStaff);
const isSlotAvailableMock = vi.mocked(isSlotAvailable);
const evaluateBookingSelfServicePolicyMock = vi.mocked(evaluateBookingSelfServicePolicy);
const acquireSlotLockMock = vi.mocked(acquireSlotLock);
const releaseSlotLockMock = vi.mocked(releaseSlotLock);

describe('/api/booking/manage/[token]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    checkRateLimitMock.mockResolvedValue({ allowed: true, remaining: 7, retryAfterMs: 0 });
    verifyBookingManageTokenMock.mockReturnValue({ bookingId: 'bk-1', email: 'client@example.com' });
    getBookingMock.mockResolvedValue(booking());
    getServiceMock.mockResolvedValue(service);
    getStaffMock.mockResolvedValue(staff);
    isSlotAvailableMock.mockResolvedValue(true);
    evaluateBookingSelfServicePolicyMock.mockResolvedValue(policy);
    acquireSlotLockMock.mockReturnValue(true);
  });

  it('returns a localized stable code for an invalid zh-hant manage token', async () => {
    verifyBookingManageTokenMock.mockReturnValue(null);

    const response = await GET(request('GET', '?locale=zh-hant'), context);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      error: '預約管理連結無效或已過期。',
      errorCode: 'invalid_or_expired_link',
    });
    expect(getBookingMock).not.toHaveBeenCalled();
  });

  it('returns a localized stable code when the booking no longer exists', async () => {
    getBookingMock.mockResolvedValue(null);

    const response = await GET(request('GET', '?locale=en'), context);
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: 'Booking not found.',
      errorCode: 'booking_not_found',
    });
  });

  it('localizes policy block reasons in the GET payload', async () => {
    evaluateBookingSelfServicePolicyMock.mockResolvedValue({
      ...policy,
      canCancel: false,
      cancelBlockedReason: 'Cancellation requires at least 24 hours before start.',
    });

    const response = await GET(request('GET'), context);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.policy.cancelBlockedReason).toBe('이 예약은 취소할 수 없습니다.');
  });

  it('returns a localized stable code for an invalid ko PATCH body', async () => {
    const response = await PATCH(request('PATCH', '', { action: 'reschedule' }), context);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: '예약 변경 내용을 확인해 주세요.',
      errorCode: 'invalid_update',
    });
  });

  it('returns a localized stable code when the booking is already cancelled', async () => {
    getBookingMock.mockResolvedValue(booking({ status: 'cancelled' }));

    const response = await PATCH(request('PATCH', '', { action: 'cancel' }), context);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '이미 취소된 예약입니다.',
      errorCode: 'booking_already_cancelled',
    });
  });

  it('returns localized policy payloads without leaking English cancel reasons', async () => {
    evaluateBookingSelfServicePolicyMock.mockResolvedValue({
      ...policy,
      canCancel: false,
      cancelBlockedReason: 'Booking has already started.',
    });

    const response = await PATCH(request('PATCH', '', { action: 'cancel' }), context);
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.errorCode).toBe('cancel_unavailable');
    expect(payload.error).toBe('이 예약은 취소할 수 없습니다.');
    expect(payload.policy.cancelBlockedReason).toBe('이 예약은 취소할 수 없습니다.');
  });

  it('returns a localized stable code when the requested slot is locked', async () => {
    acquireSlotLockMock.mockReturnValue(false);

    const response = await PATCH(
      request('PATCH', '', { action: 'reschedule', startAt: '2026-06-11T01:00:00.000Z' }),
      context,
    );
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      error: '선택한 시간이 다른 요청에서 예약 중입니다.',
      errorCode: 'slot_lock_conflict',
    });
  });

  it('returns a localized stable code when the replacement staff is unavailable', async () => {
    getStaffMock.mockImplementation(async (staffId) => (staffId === 'staff-2' ? null : staff));

    const response = await PATCH(
      request('PATCH', '', {
        action: 'reschedule',
        staffId: 'staff-2',
        startAt: '2026-06-11T01:00:00.000Z',
      }),
      context,
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      error: '선택한 담당자를 예약할 수 없습니다.',
      errorCode: 'staff_unavailable',
    });
    expect(releaseSlotLockMock).toHaveBeenCalled();
  });
});
