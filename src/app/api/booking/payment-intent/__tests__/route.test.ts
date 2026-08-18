import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { findApplicablePackageCredit } from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import { getService } from '@/lib/builder/bookings/storage';
import {
  MEMBER_SESSION_COOKIE,
  validateSession,
} from '@/lib/builder/members/members-engine';
import type { BookingPackage, BookingPackageCredit, BookingService } from '@/lib/builder/bookings/types';
import { POST } from '../route';

vi.mock('@/lib/builder/security/rate-limit', () => ({
  checkRateLimit: vi.fn(async () => ({ allowed: true, retryAfterMs: 0 })),
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/packages', () => ({
  findApplicablePackageCredit: vi.fn(),
}));

vi.mock('@/lib/builder/bookings/pricing', () => ({
  bookingServicePriceSnapshot: vi.fn(),
}));

vi.mock('@/lib/builder/members/members-engine', () => ({
  MEMBER_SESSION_COOKIE: 'builder_member_session',
  validateSession: vi.fn(),
}));

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
  paymentMode: 'paid',
  priceAmount: 120000,
  priceCurrency: 'KRW',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const packageCredit: BookingPackageCredit = {
  creditId: 'credit-1',
  packageId: 'pkg-1',
  customerEmail: 'client@example.com',
  totalCredits: 5,
  remainingCredits: 3,
  status: 'active',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const bookingPackage: BookingPackage = {
  packageId: 'pkg-1',
  name: { ko: '상담 패키지', 'zh-hant': '諮詢套票', en: 'Consultation Package' },
  eligibleServiceIds: ['svc-1'],
  credits: 5,
  isActive: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const checkRateLimitMock = vi.mocked(checkRateLimit);
const findApplicablePackageCreditMock = vi.mocked(findApplicablePackageCredit);
const bookingServicePriceSnapshotMock = vi.mocked(bookingServicePriceSnapshot);
const getServiceMock = vi.mocked(getService);
const validateSessionMock = vi.mocked(validateSession);

function request(query = '', body: string | unknown = {
  serviceId: 'svc-1',
  customer: { email: 'client@example.com', name: 'Client One' },
}, sessionId?: string, origin: string | null = 'https://tseng-law.com'): NextRequest {
  return new NextRequest(`https://tseng-law.com/api/booking/payment-intent${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-forwarded-for': '203.0.113.4',
      ...(origin ? { origin } : {}),
      ...(sessionId ? { cookie: `${MEMBER_SESSION_COOKIE}=${sessionId}` } : {}),
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/booking/payment-intent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', '');
    vi.stubEnv('STRIPE_PUBLISHABLE_KEY', '');
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterMs: 0 } as never);
    findApplicablePackageCreditMock.mockResolvedValue(null);
    bookingServicePriceSnapshotMock.mockReturnValue({
      paymentRequired: true,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 50000,
      depositAmount: 50000,
      balanceDueAfterOnlinePayment: 70000,
      isDeposit: true,
      payLater: false,
    });
    getServiceMock.mockResolvedValue(service as never);
    validateSessionMock.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('rejects a production-mode request without Origin before rate limiting or service lookup', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request('locale=ko', undefined, undefined, null));
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload).toEqual({ ok: false, error: 'csrf_origin_mismatch', code: 'csrf_origin_mismatch' });
    expect(checkRateLimitMock).not.toHaveBeenCalled();
    expect(getServiceMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns dev stubs while preserving success response shape', async () => {
    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      stub: true,
      clientSecret: 'pi_stub_dev_secret',
      paymentIntentId: 'pi_stub_dev',
      amount: 50000,
      totalAmount: 120000,
      depositAmount: 50000,
      balanceDueAfterPayment: 70000,
      isDeposit: true,
      currency: 'krw',
      note: 'STRIPE_SECRET_KEY unset — returned stub client_secret for dev wiring only.',
    });
  });

  it('forwards discount codes to pricing and includes applied discounts in dev stubs', async () => {
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

    const response = await POST(request('locale=ko', {
      serviceId: 'svc-1',
      staffId: 'staff-1',
      customer: { email: 'client@example.com', name: 'Client One' },
      discountCode: ' legal20 ',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(bookingServicePriceSnapshotMock).toHaveBeenCalledWith(service, {
      staffId: 'staff-1',
      resourceIds: undefined,
      discountCode: 'legal20',
      locale: 'ko',
    });
    expect(payload).toMatchObject({
      ok: true,
      stub: true,
      amount: 40000,
      totalAmount: 100000,
      discountCode: 'LEGAL20',
      discountAmount: 20000,
    });
  });

  it('returns package-credit coverage while preserving success response shape', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BOOKING_PAYMENT_ALLOW_STUB', '1');
    findApplicablePackageCreditMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    } as never);
    validateSessionMock.mockResolvedValueOnce({
      memberId: 'member-1',
      email: ' Client@Example.com ',
      verified: true,
      blocked: false,
    } as never);

    const response = await POST(request('locale=zh-hant', {
      serviceId: 'svc-1',
      customer: { email: 'client@example.com', name: 'Client One' },
    }, 'session-1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(validateSessionMock).toHaveBeenCalledWith('session-1');
    expect(findApplicablePackageCreditMock).toHaveBeenCalledWith({
      customerEmail: 'client@example.com',
      serviceId: 'svc-1',
    });
    expect(payload).toEqual({
      ok: true,
      coveredByPackage: true,
      packageCreditId: 'credit-1',
      packageId: 'pkg-1',
      packageName: bookingPackage.name,
      remainingCredits: 3,
    });
  });

  it.each([
    {
      label: 'anonymous requests',
      sessionId: undefined,
      member: null,
    },
    {
      label: 'invalid sessions',
      sessionId: 'invalid-session',
      member: null,
    },
    {
      label: 'unverified members',
      sessionId: 'unverified-session',
      member: {
        memberId: 'member-unverified',
        email: 'client@example.com',
        verified: false,
        blocked: false,
      },
    },
    {
      label: 'blocked members',
      sessionId: 'blocked-session',
      member: {
        memberId: 'member-blocked',
        email: 'client@example.com',
        verified: true,
        blocked: true,
      },
    },
    {
      label: 'members whose email does not match the customer',
      sessionId: 'other-member-session',
      member: {
        memberId: 'member-other',
        email: 'other@example.com',
        verified: true,
        blocked: false,
      },
    },
  ])('does not disclose package credits to $label', async ({ sessionId, member }) => {
    validateSessionMock.mockResolvedValueOnce(member as never);
    findApplicablePackageCreditMock.mockResolvedValueOnce({
      credit: packageCredit,
      package: bookingPackage,
    } as never);

    const response = await POST(request('locale=en', {
      serviceId: 'svc-1',
      customer: { email: 'client@example.com', name: 'Client One' },
    }, sessionId));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      stub: true,
      paymentIntentId: 'pi_stub_dev',
    });
    expect(payload).not.toHaveProperty('coveredByPackage');
    expect(payload).not.toHaveProperty('packageCreditId');
    expect(findApplicablePackageCreditMock).not.toHaveBeenCalled();
    if (sessionId) {
      expect(validateSessionMock).toHaveBeenCalledWith(sessionId);
    } else {
      expect(validateSessionMock).not.toHaveBeenCalled();
    }
  });

  it('returns Stripe client secrets while preserving success response shape', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({
      id: 'pi_live',
      client_secret: 'pi_live_secret',
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith('https://api.stripe.com/v1/payment_intents', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        Authorization: 'Bearer sk_test_payment',
      }),
    }));
    expect(payload).toEqual({
      ok: true,
      stub: false,
      clientSecret: 'pi_live_secret',
      paymentIntentId: 'pi_live',
      publishableKey: 'pk_test_payment',
      amount: 50000,
      totalAmount: 120000,
      depositAmount: 50000,
      balanceDueAfterPayment: 70000,
      isDeposit: true,
      currency: 'krw',
    });
  });

  it('returns localized rate-limit errors', async () => {
    checkRateLimitMock.mockResolvedValueOnce({ allowed: false, retryAfterMs: 2200 } as never);

    const response = await POST(request('locale=zh-hant'));
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

  it('returns localized validation errors', async () => {
    const response = await POST(request('locale=ko', {
      serviceId: '',
      customer: { email: 'bad', name: '' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '결제 요청 정보를 확인해 주세요.',
      errorCode: 'booking_payment_invalid',
    });
  });

  it('returns localized unavailable service errors', async () => {
    getServiceMock.mockResolvedValueOnce(null);

    const response = await POST(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到可付款的服務。',
      errorCode: 'booking_payment_service_unavailable',
    });
  });

  it('returns localized free-service errors', async () => {
    getServiceMock.mockResolvedValueOnce({ ...service, paymentMode: 'free' } as never);

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Free services do not require online payment.',
      errorCode: 'booking_payment_free_service',
    });
  });

  it('returns no-upfront-payment details for collect-later paid services', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BOOKING_PAYMENT_ALLOW_STUB', '1');
    getServiceMock.mockResolvedValueOnce({ ...service, collectPaymentLater: true } as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: false,
      totalAmount: 120000,
      currency: 'KRW',
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 120000,
      isDeposit: false,
      payLater: true,
    });

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      collectPaymentLater: true,
      amount: 0,
      totalAmount: 120000,
      balanceDueAfterPayment: 120000,
      isDeposit: false,
      currency: 'krw',
    });
  });

  it('returns localized missing-price errors', async () => {
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 0,
      currency: 'KRW',
      amountDueNow: 0,
      balanceDueAfterOnlinePayment: 0,
      isDeposit: false,
      payLater: false,
    });

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '서비스 결제 금액이 설정되지 않았습니다.',
      errorCode: 'booking_payment_price_missing',
    });
  });

  it('fails closed in production even when the legacy stub override is set', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BOOKING_PAYMENT_ALLOW_STUB', '1');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      ok: false,
      error: 'The payment provider is not configured.',
      errorCode: 'booking_payment_provider_not_configured',
    });
    expect(payload).not.toHaveProperty('stub');
    expect(payload).not.toHaveProperty('paymentIntentId');
    expect(warn).toHaveBeenCalledWith('[booking/payment-intent] STRIPE_SECRET_KEY missing in production');
    warn.mockRestore();
  });

  it('forwards the selected staff id to the price snapshot and Stripe metadata', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    const stripeBodies: string[] = [];
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      if (typeof init?.body === 'string') stripeBodies.push(init.body);
      return new Response(JSON.stringify({
        id: 'pi_live_staff',
        client_secret: 'pi_live_staff_secret',
      }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(request('locale=en', {
      serviceId: 'svc-1',
      staffId: 'staff-premium',
      customer: { email: 'client@example.com', name: 'Client One' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(bookingServicePriceSnapshotMock).toHaveBeenCalledWith(service, { staffId: 'staff-premium', resourceIds: undefined });
    const body = stripeBodies[0] ?? '';
    expect(body).toContain('metadata%5BstaffId%5D=staff-premium');
    expect(payload.paymentIntentId).toBe('pi_live_staff');
  });

  it('forwards required resource ids to the price snapshot and Stripe metadata', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    const stripeBodies: string[] = [];
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      if (typeof init?.body === 'string') stripeBodies.push(init.body);
      return new Response(JSON.stringify({
        id: 'pi_live_resource',
        client_secret: 'pi_live_resource_secret',
      }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    const resourceService = { ...service, requiredResourceIds: ['room-a'] };

    getServiceMock.mockResolvedValueOnce(resourceService as never);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 9000,
      currency: 'KRW',
      amountDueNow: 9000,
      balanceDueAfterOnlinePayment: 0,
      isDeposit: false,
      payLater: false,
      effectiveResourceId: 'room-a',
    });

    const response = await POST(request('locale=en', {
      serviceId: 'svc-1',
      customer: { email: 'client@example.com', name: 'Client One' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(bookingServicePriceSnapshotMock).toHaveBeenCalledWith(resourceService, { staffId: undefined, resourceIds: ['room-a'] });
    expect(stripeBodies[0] ?? '').toContain('metadata%5BresourceId%5D=room-a');
    expect(payload.paymentIntentId).toBe('pi_live_resource');
  });

  it('adds applied booking discounts to Stripe metadata', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    const stripeBodies: string[] = [];
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      if (typeof init?.body === 'string') stripeBodies.push(init.body);
      return new Response(JSON.stringify({
        id: 'pi_live_discount',
        client_secret: 'pi_live_discount_secret',
      }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    bookingServicePriceSnapshotMock.mockReturnValueOnce({
      paymentRequired: true,
      totalAmount: 100000,
      currency: 'KRW',
      amountDueNow: 40000,
      depositAmount: 40000,
      balanceDueAfterOnlinePayment: 60000,
      isDeposit: true,
      payLater: false,
      discountCode: 'LEGAL20',
      discountAmount: 20000,
    });

    const response = await POST(request('locale=en', {
      serviceId: 'svc-1',
      customer: { email: 'client@example.com', name: 'Client One' },
      discountCode: 'LEGAL20',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(stripeBodies[0] ?? '').toContain('metadata%5BbookingDiscountCode%5D=LEGAL20');
    expect(stripeBodies[0] ?? '').toContain('metadata%5BbookingDiscountAmount%5D=20000');
    expect(payload).toMatchObject({
      paymentIntentId: 'pi_live_discount',
      discountCode: 'LEGAL20',
      discountAmount: 20000,
    });
  });

  it('returns localized client config errors', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      ok: false,
      error: '결제 클라이언트가 설정되지 않았습니다.',
      errorCode: 'booking_payment_client_not_configured',
    });
    expect(warn).toHaveBeenCalledWith('[booking/payment-intent] Stripe publishable key missing');
    warn.mockRestore();
  });

  it('returns localized provider failures without leaking provider bodies', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.stubGlobal('fetch', vi.fn(async () => new Response('stripe secret leaked', { status: 402 })));

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: 'The payment provider request failed.',
      errorCode: 'booking_payment_provider_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('stripe secret leaked');
    expect(warn).toHaveBeenCalledWith('[booking/payment-intent] stripe error', {
      status: 402,
      body: 'stripe secret leaked',
    });
    warn.mockRestore();
  });

  it('returns localized missing secret errors', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ id: 'pi_no_secret' }), { status: 200 })));

    const response = await POST(request('locale=zh-hant'));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: '付款服務提供者未回傳付款確認資料。',
      errorCode: 'booking_payment_secret_missing',
    });
  });

  it('returns localized provider unreachable errors without leaking exception details', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_payment');
    vi.stubEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'pk_test_payment');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network token leaked');
    }));

    const response = await POST(request('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      ok: false,
      error: '결제 제공자에 연결하지 못했습니다.',
      errorCode: 'booking_payment_provider_unreachable',
    });
    expect(JSON.stringify(payload)).not.toContain('network token leaked');
    expect(warn).toHaveBeenCalledWith('[booking/payment-intent] fetch failed', {
      error: 'network token leaked',
    });
    warn.mockRestore();
  });

  it('returns localized generic payment failures without leaking exception details', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    getServiceMock.mockRejectedValueOnce(new Error('payment storage secret leaked'));

    const response = await POST(request('locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to prepare payment.',
      errorCode: 'booking_payment_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('payment storage secret leaked');
    expect(warn).toHaveBeenCalledWith('[booking/payment-intent] failed', {
      error: 'payment storage secret leaked',
    });
    warn.mockRestore();
  });
});
