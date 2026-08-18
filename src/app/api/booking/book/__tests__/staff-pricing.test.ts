import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { isSlotAvailable } from '@/lib/builder/bookings/availability';
import { fetchPaymentIntentStatus } from '@/lib/builder/bookings/stripe-verify';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import { getService, getStaff, saveBooking } from '@/lib/builder/bookings/storage';
import type { BookingService, Staff } from '@/lib/builder/bookings/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn(() => '2099-01-05T01:30:00.000Z'),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(),
  getStaff: vi.fn(),
  hasDurableBookingStorage: vi.fn(() => true),
  makeBookingId: vi.fn(() => 'bk-staff-price'),
  saveBooking: vi.fn(async () => undefined),
  timestamped: vi.fn((booking) => ({
    ...booking,
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/stripe-verify', async () => {
  const actual = await vi.importActual<typeof import('@/lib/builder/bookings/stripe-verify')>('@/lib/builder/bookings/stripe-verify');
  return {
    ...actual,
    fetchPaymentIntentStatus: vi.fn(),
  };
});

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(async () => ({ ownerToken: 'test-lease', keys: [], expiresAt: 9_999_999 })),
  releaseSlotLock: vi.fn(async () => undefined),
  renewSlotLock: vi.fn(async (lease) => lease),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runBookingBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingConfirmation: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  findApplicablePackageCredit: vi.fn(async () => null),
  redeemPackageCreditForBooking: vi.fn(async () => null),
  restorePackageCreditForBooking: vi.fn(async (booking) => booking),
}));

vi.mock('@/lib/builder/bookings/zoom-handoff', () => ({
  maybeCreateBookingZoomLink: vi.fn(async () => null),
}));

const premiumStaffId = 'staff-premium';

const service: BookingService = {
  serviceId: 'svc-staff-price',
  slug: 'staff-price',
  name: { ko: '스태프 가격 상담', 'zh-hant': '員工價格諮詢', en: 'Staff price consultation' },
  description: { ko: '가격 검증', 'zh-hant': '價格測試', en: 'Price check' },
  durationMinutes: 30,
  staffIds: ['staff-base', premiumStaffId],
  bufferBeforeMinutes: 0,
  bufferAfterMinutes: 0,
  isActive: true,
  paymentMode: 'paid',
  priceAmount: 5000,
  priceCurrency: 'TWD',
  staffPriceOverrides: { [premiumStaffId]: 8000 },
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const premiumStaff: Staff = {
  staffId: premiumStaffId,
  name: { ko: '프리미엄 담당', 'zh-hant': '高級員工', en: 'Premium staff' },
  title: { ko: '변호사', 'zh-hant': '律師', en: 'Attorney' },
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

function request(): NextRequest {
  return new NextRequest('https://law.example.test/api/booking/book?locale=ko', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.44',
      origin: 'https://tseng-law.com',
    },
    body: JSON.stringify({
      serviceId: service.serviceId,
      staffId: premiumStaffId,
      startAt: '2099-01-05T01:00:00.000Z',
      paymentIntentId: 'pi_base_price',
      customer: {
        name: 'Client',
        email: 'client@example.com',
        locale: 'ko',
      },
    }),
  });
}

describe('/api/booking/book staff-specific pricing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkRateLimit).mockResolvedValue({ allowed: true, remaining: 20, retryAfterMs: 0 });
    vi.mocked(getService).mockResolvedValue(service);
    vi.mocked(getStaff).mockResolvedValue(premiumStaff);
    vi.mocked(isSlotAvailable).mockResolvedValue(true);
    vi.mocked(acquireSlotLock).mockResolvedValue({ ownerToken: 'test-lease', keys: [], expiresAt: 9_999_999 });
    vi.mocked(fetchPaymentIntentStatus).mockResolvedValue({
      id: 'pi_base_price',
      status: 'succeeded',
      amount: 5000,
      currency: 'twd',
      metadata: { serviceId: service.serviceId },
    });
  });

  it('rejects a base-priced payment intent for a premium staff booking', async () => {
    const response = await POST(request());
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '결제 정보가 선택한 서비스와 일치하지 않습니다.',
      errorCode: 'booking_create_payment_mismatch',
    });
    expect(saveBooking).not.toHaveBeenCalled();
    expect(releaseSlotLock).not.toHaveBeenCalled();
  });
});
