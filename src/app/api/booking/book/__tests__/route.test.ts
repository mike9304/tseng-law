import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { addBookingDuration, isSlotAvailable } from '@/lib/builder/bookings/availability';
import {
  fetchPaymentIntentStatus,
  isPaymentIntentBookable,
  paymentIntentPriceMismatch,
} from '@/lib/builder/bookings/stripe-verify';
import { acquireSlotLock, releaseSlotLock } from '@/lib/builder/bookings/slot-lock';
import {
  findApplicablePackageCredit,
  redeemPackageCreditForBooking,
  restorePackageCreditForBooking,
} from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import { maybeCreateBookingZoomLink } from '@/lib/builder/bookings/zoom-handoff';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { sendBookingConfirmation } from '@/lib/builder/bookings/notifications';
import { emitEvent } from '@/lib/builder/webhooks/dispatcher';
import { getService, getStaff, makeBookingId, saveBooking, timestamped } from '@/lib/builder/bookings/storage';
import type { Booking, BookingPackage, BookingPackageCredit, BookingService, Staff } from '@/lib/builder/bookings/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/availability', () => ({
  addBookingDuration: vi.fn(() => '2026-06-10T02:00:00.000Z'),
  isSlotAvailable: vi.fn(async () => true),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(),
  getStaff: vi.fn(),
  makeBookingId: vi.fn(() => 'bk-1'),
  saveBooking: vi.fn(async () => undefined),
  timestamped: vi.fn((booking) => ({
    ...booking,
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
  })),
}));

vi.mock('@/lib/builder/bookings/notifications', () => ({
  sendBookingConfirmation: vi.fn(async () => ({
    ok: true,
    customer: { ok: true, provider: 'resend' },
  })),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  emitEvent: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/stripe-verify', () => ({
  fetchPaymentIntentStatus: vi.fn(async () => null),
  isPaymentIntentBookable: vi.fn(() => true),
  paymentIntentPriceMismatch: vi.fn(() => null),
}));

vi.mock('@/lib/builder/bookings/slot-lock', () => ({
  acquireSlotLock: vi.fn(() => true),
  releaseSlotLock: vi.fn(),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runBookingBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  findApplicablePackageCredit: vi.fn(async () => null),
  redeemPackageCreditForBooking: vi.fn(async () => null),
  restorePackageCreditForBooking: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/bookings/pricing', () => ({
  bookingServicePriceSnapshot: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/zoom-handoff', () => ({
  maybeCreateBookingZoomLink: vi.fn(async () => null),
}));

const freeService: BookingService = {
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

const paidService: BookingService = {
  ...freeService,
  paymentMode: 'paid',
  priceAmount: 120000,
  priceCurrency: 'KRW',
  depositAmount: 50000,
};

const payLaterService: BookingService = {
  ...freeService,
  paymentMode: 'paid',
  collectPaymentLater: true,
  priceAmount: 120000,
  priceCurrency: 'KRW',
};

const staff: Staff = {
  staffId: 'staff-1',
  name: { ko: '담당자', 'zh-hant': '員工', en: 'Staff' },
  title: { ko: '변호사', 'zh-hant': '律師', en: 'Attorney' },
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const packageCredit: BookingPackageCredit = {
  creditId: 'credit-1',
  packageId: 'pkg-1',
  customerEmail: 'client@example.com',
  totalCredits: 5,
  remainingCredits: 2,
  status: 'active',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const bookingPackage: BookingPackage = {
  packageId: 'pkg-1',
  name: { ko: '패키지', 'zh-hant': '方案', en: 'Package' },
  eligibleServiceIds: ['svc-1'],
  credits: 5,
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const addBookingDurationMock = vi.mocked(addBookingDuration);
const isSlotAvailableMock = vi.mocked(isSlotAvailable);
const getServiceMock = vi.mocked(getService);
const getStaffMock = vi.mocked(getStaff);
const makeBookingIdMock = vi.mocked(makeBookingId);
const saveBookingMock = vi.mocked(saveBooking);
const timestampedMock = vi.mocked(timestamped);
const sendBookingConfirmationMock = vi.mocked(sendBookingConfirmation);
const emitEventMock = vi.mocked(emitEvent);
const fetchPaymentIntentStatusMock = vi.mocked(fetchPaymentIntentStatus);
const isPaymentIntentBookableMock = vi.mocked(isPaymentIntentBookable);
const paymentIntentPriceMismatchMock = vi.mocked(paymentIntentPriceMismatch);
const acquireSlotLockMock = vi.mocked(acquireSlotLock);
const releaseSlotLockMock = vi.mocked(releaseSlotLock);
const runBookingBillingAutomationMock = vi.mocked(runBookingBillingAutomation);
const findApplicablePackageCreditMock = vi.mocked(findApplicablePackageCredit);
const redeemPackageCreditForBookingMock = vi.mocked(redeemPackageCreditForBooking);
const restorePackageCreditForBookingMock = vi.mocked(restorePackageCreditForBooking);
const bookingServicePriceSnapshotMock = vi.mocked(bookingServicePriceSnapshot);
const maybeCreateBookingZoomLinkMock = vi.mocked(maybeCreateBookingZoomLink);

function bookingBody(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    serviceId: 'svc-1',
    staffId: 'staff-1',
    startAt: '2026-06-10T01:00:00.000Z',
    customer: {
      name: 'Client One',
      email: 'client@example.com',
      phone: '010',
      locale: 'ko',
    },
    ...overrides,
  };
}

function localizedBookingBody(
  locale: 'ko' | 'zh-hant' | 'en',
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  const customer = typeof overrides.customer === 'object' && overrides.customer !== null && !Array.isArray(overrides.customer)
    ? overrides.customer as Record<string, unknown>
    : {};
  return bookingBody({
    ...overrides,
    customer: {
      name: 'Client One',
      email: 'client@example.com',
      phone: '010',
      ...customer,
      locale,
    },
  });
}

function request(query = '', body: string | unknown = bookingBody()): NextRequest {
  return new NextRequest(`https://law.example.test/api/booking/book${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.8',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/booking/book', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv('NODE_ENV', 'test');
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    addBookingDurationMock.mockReturnValue('2026-06-10T02:00:00.000Z');
    isSlotAvailableMock.mockResolvedValue(true);
    getServiceMock.mockResolvedValue(freeService as never);
    getStaffMock.mockResolvedValue(staff as never);
    makeBookingIdMock.mockReturnValue('bk-1');
    saveBookingMock.mockResolvedValue(undefined as never);
    timestampedMock.mockImplementation((booking) => ({
      ...booking,
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    }) as never);
    sendBookingConfirmationMock.mockResolvedValue({
      ok: true,
      customer: { ok: true, provider: 'resend' },
    });
    fetchPaymentIntentStatusMock.mockResolvedValue(null);
    isPaymentIntentBookableMock.mockReturnValue(true);
    paymentIntentPriceMismatchMock.mockReturnValue(null);
    acquireSlotLockMock.mockReturnValue(true);
    runBookingBillingAutomationMock.mockResolvedValue(null as never);
    findApplicablePackageCreditMock.mockResolvedValue(null);
    redeemPackageCreditForBookingMock.mockResolvedValue(null);
    restorePackageCreditForBookingMock.mockResolvedValue(undefined as never);
    bookingServicePriceSnapshotMock.mockReturnValue({
      paymentRequired: false,
      totalAmount: 0,
      currency: 'KRW',
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 0,
      isDeposit: false,
      payLater: false,
    });
    maybeCreateBookingZoomLinkMock.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('preserves successful booking response shape and side effects', async () => {
    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toMatchObject({
      bookingId: 'bk-1',
      booking: {
        bookingId: 'bk-1',
        serviceId: 'svc-1',
        staffId: 'staff-1',
        status: 'confirmed',
        source: 'web',
        customer: { email: 'client@example.com', locale: 'ko' },
      },
      emailDelivery: {
        ok: true,
        customer: { ok: true },
      },
    });
    expect(releaseSlotLockMock).toHaveBeenCalledTimes(1);
    expect(sendBookingConfirmationMock).toHaveBeenCalledWith(payload.booking, { service: freeService, staff });
    expect(emitEventMock).toHaveBeenCalledWith('booking.created', expect.objectContaining({
      bookingId: 'bk-1',
      serviceId: 'svc-1',
    }));
  });

  it('keeps a persisted booking successful and reports sanitized provider delivery failures', async () => {
    sendBookingConfirmationMock.mockResolvedValueOnce({
      ok: false,
      customer: { ok: false, provider: 'resend', reason: 'provider_error', status: 503 },
      admin: { ok: false, provider: 'resend', reason: 'unconfigured' },
    });

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveBookingMock).toHaveBeenCalledTimes(1);
    expect(payload.emailDelivery).toEqual({
      ok: false,
      customer: { ok: false, reason: 'provider_error' },
      admin: { ok: false, reason: 'unconfigured' },
    });
    expect(JSON.stringify(payload.emailDelivery)).not.toContain('503');
    expect(JSON.stringify(payload.emailDelivery)).not.toContain('resend');
  });

  it('keeps a persisted booking successful when confirmation rendering throws', async () => {
    sendBookingConfirmationMock.mockRejectedValueOnce(new Error('secret client@example.com render failure'));

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(saveBookingMock).toHaveBeenCalledTimes(1);
    expect(payload.emailDelivery).toEqual({ ok: false, reason: 'internal_error' });
    expect(JSON.stringify(payload)).not.toContain('secret client@example.com render failure');
  });

  it('returns localized rate-limit errors with retry headers', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 2100 } as never);

    const response = await POST(request('locale=zh-hant', localizedBookingBody('zh-hant')));
    const payload = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBe('3');
    expect(payload).toEqual({
      ok: false,
      error: '預約請求過多，請稍後再試。',
      errorCode: 'too_many_requests',
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('locale=en', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the booking request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized honeypot rejection errors', async () => {
    const response = await POST(request('locale=en', bookingBody({
      customer: { name: 'Client One', email: 'client@example.com', locale: 'zh-hant' },
      company: 'spam company',
    })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '無法接受此預約請求。',
      errorCode: 'booking_create_rejected',
    });
  });

  it('returns localized validation errors with stable codes', async () => {
    const response = await POST(request('locale=ko', {
      serviceId: '',
      staffId: '',
      startAt: 'bad',
      customer: { name: '', email: 'bad', locale: 'ko' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '예약 요청 정보를 확인해 주세요.',
      errorCode: 'booking_create_invalid',
    });
    expect(payload.details).toHaveLength(3);
  });

  it('returns localized service or staff unavailable errors', async () => {
    getStaffMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=zh-hant', localizedBookingBody('zh-hant')));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '無法預約所選服務或員工。',
      errorCode: 'booking_create_service_or_staff_unavailable',
    });
  });

  it('rejects staff members that are not assigned to the selected service', async () => {
    getServiceMock.mockResolvedValueOnce({
      ...freeService,
      staffIds: ['staff-other'],
    } as never);

    const response = await POST(request('locale=en', localizedBookingBody('en')));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'The selected service or staff member cannot be booked.',
      errorCode: 'booking_create_service_or_staff_unavailable',
    });
    expect(bookingServicePriceSnapshotMock).not.toHaveBeenCalled();
    expect(saveBookingMock).not.toHaveBeenCalled();
  });

  it('returns localized payment-required errors', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });

    const response = await POST(request('locale=en', localizedBookingBody('en')));
    const payload = await response.json();

    expect(response.status).toBe(402);
    expect(payload).toEqual({
      ok: false,
      error: 'Payment is required before booking this service.',
      errorCode: 'booking_create_payment_required',
    });
  });

  it('returns localized payment-not-allowed errors for free services', async () => {
    const response = await POST(request('locale=ko', bookingBody({ paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '이 서비스에는 결제 정보가 필요하지 않습니다.',
      errorCode: 'booking_create_payment_not_allowed',
    });
  });

  it('confirms a pay-later booking without online payment and marks it unpaid with the full balance', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    vi.stubEnv('BOOKING_PAYMENT_ALLOW_STUB', '1');
    getServiceMock.mockResolvedValueOnce(payLaterService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: false,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 120000,
      isDeposit: false,
      payLater: true,
    });

    const response = await POST(request('locale=ko', bookingBody()));

    expect(response.status).toBe(201);
    expect(fetchPaymentIntentStatusMock).not.toHaveBeenCalled();
    const savedBooking = saveBookingMock.mock.calls[0]?.[0] as Booking | undefined;
    expect(savedBooking?.paymentStatus).toBe('unpaid');
    expect(savedBooking?.paymentAmount).toBe(120000);
    expect(savedBooking?.paymentDueNow).toBe(0);
    expect(savedBooking?.status).toBe('confirmed');
  });

  it('confirms a package-covered booking in production without Stripe', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    vi.stubEnv('BOOKING_PAYMENT_ALLOW_STUB', '1');
    getServiceMock.mockResolvedValueOnce(paidService as never);
    findApplicablePackageCreditMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    });
    redeemPackageCreditForBookingMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    });
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });

    const response = await POST(request('locale=en', localizedBookingBody('en')));

    expect(response.status).toBe(201);
    expect(fetchPaymentIntentStatusMock).not.toHaveBeenCalled();
    const savedBooking = saveBookingMock.mock.calls[0]?.[0] as Booking | undefined;
    expect(savedBooking).toMatchObject({
      packageId: 'pkg-1',
      packageCreditId: 'credit-1',
      packageCreditsUsed: 1,
      paymentStatus: 'paid',
    });
  });

  it('rejects a payment intent submitted for a pay-later service', async () => {
    getServiceMock.mockResolvedValueOnce(payLaterService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: false,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 120000,
      isDeposit: false,
      payLater: true,
    });

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'This service does not require payment details.',
      errorCode: 'booking_create_payment_not_allowed',
    });
    expect(saveBookingMock).not.toHaveBeenCalled();
  });

  it('returns localized payment mismatch errors without leaking raw verifier strings', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    fetchPaymentIntentStatusMock.mockResolvedValueOnce({
      id: 'pi_test',
      status: 'succeeded',
      amount: 1,
      currency: 'krw',
      metadata: { serviceId: 'svc-1', staffId: 'staff-1' },
    });
    paymentIntentPriceMismatchMock.mockReturnValueOnce('PaymentIntent amount could not be verified.');

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'The payment details do not match the selected service.',
      errorCode: 'booking_create_payment_mismatch',
    });
    expect(JSON.stringify(payload)).not.toContain('PaymentIntent amount');
  });

  it('rejects a verified payment intent priced for a different staff member', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    fetchPaymentIntentStatusMock.mockResolvedValueOnce({
      id: 'pi_test',
      status: 'succeeded',
      amount: 50000,
      currency: 'krw',
      metadata: { serviceId: 'svc-1', staffId: 'staff-other' },
    });

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'The payment details do not match the selected service.',
      errorCode: 'booking_create_payment_mismatch',
    });
    expect(saveBookingMock).not.toHaveBeenCalled();
  });

  it('rejects a verified payment intent missing staff metadata', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    fetchPaymentIntentStatusMock.mockResolvedValueOnce({
      id: 'pi_test',
      status: 'succeeded',
      amount: 50000,
      currency: 'krw',
      metadata: { serviceId: 'svc-1' },
    });

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'The payment details do not match the selected service.',
      errorCode: 'booking_create_payment_mismatch',
    });
    expect(saveBookingMock).not.toHaveBeenCalled();
  });

  it('accepts a verified payment intent whose metadata staff id matches the booking staff id', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    fetchPaymentIntentStatusMock.mockResolvedValueOnce({
      id: 'pi_test',
      status: 'succeeded',
      amount: 50000,
      currency: 'krw',
      metadata: { serviceId: 'svc-1', staffId: 'staff-1' },
    });

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_test' })));

    expect(response.status).toBe(201);
    expect(saveBookingMock).toHaveBeenCalledTimes(1);
  });

  it('passes required resource ids into the price snapshot and records the resolved total', async () => {
    const resourceService: BookingService = { ...paidService, requiredResourceIds: ['room-a'] };
    getServiceMock.mockResolvedValueOnce(resourceService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 9000,
      currency: 'KRW',
      amountDueNow: 9000,
      balanceDueAfterOnlinePayment: 0,
      isDeposit: false,
      payLater: false,
    });

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_test' })));

    expect(response.status).toBe(201);
    expect(bookingServicePriceSnapshotMock).toHaveBeenCalledWith(resourceService, { staffId: 'staff-1', resourceIds: ['room-a'] });
    const savedBooking = saveBookingMock.mock.calls[0]?.[0] as Booking | undefined;
    expect(savedBooking?.paymentAmount).toBe(9000);
    expect(savedBooking?.resourceIds).toEqual(['room-a']);
  });

  it('passes discount codes into the price snapshot and persists the applied discount', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 100000,
      currency: 'KRW',
      amountDueNow: 40000,
      depositAmount: 40000,
      balanceDueAfterOnlinePayment: 60000,
      isDeposit: true,
      payLater: false,
      subtotalAmount: 120000,
      discountCode: 'LEGAL20',
      discountAmount: 20000,
    });

    const response = await POST(request('locale=ko', localizedBookingBody('ko', {
      paymentIntentId: 'pi_test',
      discountCode: ' legal20 ',
    })));

    expect(response.status).toBe(201);
    expect(bookingServicePriceSnapshotMock).toHaveBeenCalledWith(paidService, {
      staffId: 'staff-1',
      resourceIds: undefined,
      discountCode: 'legal20',
      locale: 'ko',
    });
    const savedBooking = saveBookingMock.mock.calls[0]?.[0] as Booking | undefined;
    expect(savedBooking).toMatchObject({
      paymentAmount: 100000,
      paymentDueNow: 40000,
      discountCode: 'LEGAL20',
      discountAmount: 20000,
    });
  });

  it('returns localized unsettled payment errors with status metadata', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    fetchPaymentIntentStatusMock.mockResolvedValueOnce({
      id: 'pi_test',
      status: 'requires_payment_method',
      amount: 50000,
      currency: 'krw',
      metadata: { serviceId: 'svc-1', staffId: 'staff-1' },
    });
    isPaymentIntentBookableMock.mockReturnValueOnce(false);

    const response = await POST(request('locale=zh-hant', localizedBookingBody('zh-hant', { paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(402);
    expect(payload).toEqual({
      ok: false,
      error: '付款尚未完成。',
      errorCode: 'booking_create_payment_not_settled',
      paymentStatus: 'requires_payment_method',
    });
  });

  it('returns localized payment-unverified errors in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_live_secret');
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    fetchPaymentIntentStatusMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=ko', bookingBody({ paymentIntentId: 'pi_test' })));
    const payload = await response.json();

    expect(response.status).toBe(402);
    expect(payload).toEqual({
      ok: false,
      error: '결제 정보를 확인하지 못했습니다.',
      errorCode: 'booking_create_payment_unverified',
    });
    expect(saveBookingMock).not.toHaveBeenCalled();
    expect(acquireSlotLockMock).not.toHaveBeenCalled();
  });

  it('fails closed before verification or saving when production Stripe is unconfigured', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    vi.stubEnv('BOOKING_PAYMENT_ALLOW_STUB', '1');
    getServiceMock.mockResolvedValueOnce(paidService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });

    const response = await POST(request('locale=en', localizedBookingBody('en', { paymentIntentId: 'pi_stub_dev' })));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      ok: false,
      error: 'The payment provider is not configured.',
      errorCode: 'booking_payment_provider_not_configured',
    });
    expect(fetchPaymentIntentStatusMock).not.toHaveBeenCalled();
    expect(acquireSlotLockMock).not.toHaveBeenCalled();
    expect(saveBookingMock).not.toHaveBeenCalled();
  });

  it('returns localized slot lock conflicts', async () => {
    acquireSlotLockMock.mockReturnValueOnce(false);

    const response = await POST(request('locale=en', localizedBookingBody('en')));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: 'The selected time is being processed by another request.',
      errorCode: 'booking_create_slot_locked',
    });
    expect(releaseSlotLockMock).not.toHaveBeenCalled();
  });

  it('returns localized unavailable slot conflicts and releases the lock', async () => {
    isSlotAvailableMock.mockResolvedValueOnce(false);

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '선택한 시간은 더 이상 예약할 수 없습니다.',
      errorCode: 'booking_create_slot_unavailable',
    });
    expect(releaseSlotLockMock).toHaveBeenCalledTimes(1);
  });

  it('returns localized package-credit conflicts', async () => {
    getServiceMock.mockResolvedValueOnce(paidService as never);
    findApplicablePackageCreditMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    });
    redeemPackageCreditForBookingMock.mockResolvedValueOnce(null);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });

    const response = await POST(request('locale=zh-hant', localizedBookingBody('zh-hant')));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '沒有可用的方案點數。',
      errorCode: 'booking_create_package_unavailable',
    });
    expect(releaseSlotLockMock).toHaveBeenCalledTimes(1);
  });

  it('restores package credits and returns localized fallback errors when saving fails', async () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getServiceMock.mockResolvedValueOnce(paidService as never);
    findApplicablePackageCreditMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    });
    redeemPackageCreditForBookingMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    });
    saveBookingMock.mockRejectedValueOnce(new Error('booking storage secret leaked'));
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });

    const response = await POST(request('locale=en', localizedBookingBody('en')));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to create the booking.',
      errorCode: 'booking_create_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('booking storage secret leaked');
    expect(restorePackageCreditForBookingMock).toHaveBeenCalledWith(expect.objectContaining({
      bookingId: 'bk-1',
      packageCreditId: 'credit-1',
    }));
    expect(releaseSlotLockMock).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});
