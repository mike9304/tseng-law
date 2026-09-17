import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingCancellationPolicy, BookingService } from '@/lib/builder/bookings/types';

const fixtures = vi.hoisted(() => ({
  service: null as BookingService | null,
  policies: {} as Record<string, BookingCancellationPolicy | null>,
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => fixtures.service),
  getCancellationPolicy: vi.fn(async (policyId: string) => fixtures.policies[policyId] ?? null),
}));

import {
  applyRefundOutcome,
  computeRefundForCancel,
  evaluateBookingSelfServicePolicy,
  refundAllowsCancelPersist,
} from '@/lib/builder/bookings/refund';

function booking(startAt: string): Booking {
  return {
    bookingId: 'bk-refund',
    serviceId: 'svc-paid',
    staffId: 'staff-1',
    customer: { name: 'Client', email: 'client@example.com', locale: 'ko' },
    startAt,
    endAt: new Date(Date.parse(startAt) + 30 * 60_000).toISOString(),
    status: 'confirmed',
    source: 'web',
    paymentStatus: 'paid',
    paymentIntentId: 'pi_refund_test',
    paymentCurrency: 'TWD',
    reminders: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

function service(): BookingService {
  return {
    serviceId: 'svc-paid',
    slug: 'paid-consultation',
    name: { ko: '유료 상담', 'zh-hant': '付費諮詢', en: 'Paid consultation' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 5000,
    priceAmount: 5000,
    priceCurrency: 'TWD',
    paymentMode: 'paid',
    cancellationPolicyId: 'standard-24h',
    category: 'consultation',
    staffIds: ['staff-1'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    slotStepMinutes: 30,
    isActive: true,
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
  };
}

function currentService(): BookingService {
  if (!fixtures.service) throw new Error('Booking service fixture is missing.');
  return fixtures.service;
}

function policy(overrides: Partial<BookingCancellationPolicy> = {}): BookingCancellationPolicy {
  const now = '2026-05-01T00:00:00.000Z';
  return {
    policyId: 'standard-24h',
    name: 'Standard policy',
    description: 'Default testing policy.',
    cancelHoursBefore: 0,
    rescheduleHoursBefore: 0,
    fullRefundHoursBefore: 24,
    partialRefundHoursBefore: 6,
    partialRefundPercent: 50,
    cancellationFeePercent: 0,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function stripeSuccess(id = 're_verified', amount = 5000) {
  return { id, object: 'refund', status: 'succeeded', amount, currency: 'twd', payment_intent: 'pi_refund_test' };
}

describe('booking refund policy', () => {
  beforeEach(() => {
    fixtures.service = service();
    fixtures.policies = {
      'standard-24h': policy(),
      'strict-48h': policy({
        policyId: 'strict-48h',
        name: 'Strict policy',
        description: 'Tighter cancellation window.',
        cancelHoursBefore: 6,
        rescheduleHoursBefore: 24,
        fullRefundHoursBefore: 48,
        partialRefundHoursBefore: 24,
        partialRefundPercent: 50,
      }),
      'flexible-6h': policy({
        policyId: 'flexible-6h',
        name: 'Flexible policy',
        description: 'Flexible policy.',
        cancelHoursBefore: 0,
        rescheduleHoursBefore: 0,
        fullRefundHoursBefore: 6,
        partialRefundHoursBefore: 0,
        partialRefundPercent: 0,
      }),
      'fee-10': policy({
        policyId: 'fee-10',
        name: 'Fee policy',
        description: 'Cancellation fee applies.',
        cancellationFeePercent: 10,
      }),
    };
    vi.setSystemTime(new Date('2026-05-12T00:00:00.000Z'));
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_refund');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('creates full Stripe refunds and marks paid bookings refunded', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = init?.body?.toString() ?? '';
      expect(body).toContain('payment_intent=pi_refund_test');
      expect(body).toContain('amount=5000');
      return new Response(JSON.stringify(stripeSuccess('re_full', 5000)), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-14T00:00:00.000Z'), currentService());

    expect(outcome).toMatchObject({ decision: 'full', refundResult: { ok: true, refundId: 're_full' } });
    expect(outcome.refundAmountCents).toBe(5000);
    expect(applyRefundOutcome(booking('2026-05-14T00:00:00.000Z'), outcome, 'client cancel')).toMatchObject({
      status: 'cancelled',
      paymentStatus: 'refunded',
      cancellationReason: 'client cancel',
    });
  });

  it('creates partial Stripe refunds using the service price and policy percent', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = init?.body?.toString() ?? '';
      expect(body).toContain('payment_intent=pi_refund_test');
      expect(body).toContain('amount=2500');
      return new Response(JSON.stringify(stripeSuccess('re_partial', 2500)), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-12T08:00:00.000Z'), currentService());

    expect(outcome).toMatchObject({
      decision: 'partial',
      partialAmountCents: 2500,
      refundAmountCents: 2500,
      refundResult: { ok: true, refundId: 're_partial' },
    });
    expect(applyRefundOutcome(booking('2026-05-12T08:00:00.000Z'), outcome, undefined).paymentStatus).toBe('partial-refund');
  });

  it('uses stable, scoped Stripe idempotency keys for refund retries', async () => {
    const idempotencyKeys: string[] = [];
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      const idempotencyKey = headers.get('Idempotency-Key');
      expect(idempotencyKey).toMatch(/^booking-refund-v1:[a-f0-9]{64}$/);
      idempotencyKeys.push(idempotencyKey ?? '');
      return new Response(JSON.stringify(stripeSuccess(`re_${idempotencyKeys.length}`, Number(new URLSearchParams(init?.body?.toString()).get('amount')))), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const firstBooking = booking('2026-05-14T00:00:00.000Z');
    await computeRefundForCancel(firstBooking, currentService());
    await computeRefundForCancel(firstBooking, currentService());
    await computeRefundForCancel({ ...firstBooking, bookingId: 'bk-refund-distinct' }, currentService());

    fixtures.service = { ...service(), cancellationPolicyId: 'fee-10' };
    await computeRefundForCancel(firstBooking, currentService());

    expect(idempotencyKeys).toHaveLength(4);
    expect(idempotencyKeys[0]).toBe(idempotencyKeys[1]);
    expect(idempotencyKeys[2]).not.toBe(idempotencyKeys[0]);
    expect(idempotencyKeys[3]).not.toBe(idempotencyKeys[0]);
    expect(idempotencyKeys.every((key) => key.length < 255)).toBe(true);
  });

  it('caps full refunds at the captured deposit amount when only a deposit was paid online', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = new URLSearchParams(String(init?.body ?? ''));
      expect(body.get('payment_intent')).toBe('pi_refund_test');
      expect(body.get('amount')).toBe('1500');
      return new Response(JSON.stringify(stripeSuccess('re_deposit_full', 1500)), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    const depositBooking = {
      ...booking('2026-05-14T00:00:00.000Z'),
      paymentStatus: 'partially_paid' as const,
      paymentAmount: 5000,
      paymentDueNow: 1500,
      onlinePaidAmount: 1500,
      depositAmount: 1500,
    };

    const outcome = await computeRefundForCancel(depositBooking, currentService());

    expect(outcome).toMatchObject({
      decision: 'full',
      refundAmountCents: 1500,
      refundResult: { ok: true, refundId: 're_deposit_full' },
    });
  });

  it('deducts a policy cancellation fee from refundable amounts', async () => {
    fixtures.service = { ...service(), cancellationPolicyId: 'fee-10' };
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = init?.body?.toString() ?? '';
      expect(body).toContain('payment_intent=pi_refund_test');
      expect(body).toContain('amount=4500');
      return new Response(JSON.stringify(stripeSuccess('re_fee', 4500)), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-14T00:00:00.000Z'), currentService());

    expect(outcome).toMatchObject({
      decision: 'full',
      refundAmountCents: 4500,
      refundResult: { ok: true, refundId: 're_fee' },
    });
  });

  it('does not call Stripe when cancellation is inside the no-refund window', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-12T02:00:00.000Z'), currentService());

    expect(outcome).toMatchObject({ decision: 'none', refundResult: null });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(applyRefundOutcome(booking('2026-05-12T02:00:00.000Z'), outcome, 'late').paymentStatus).toBe('paid');
  });

  it('does not refund collect-later bookings because no online payment was captured', async () => {
    fixtures.service = { ...service(), collectPaymentLater: true };
    const collectLaterBooking = {
      ...booking('2026-05-14T00:00:00.000Z'),
      paymentStatus: 'unpaid' as const,
      paymentDueNow: 0,
      paymentAmount: 5000,
    };
    delete collectLaterBooking.paymentIntentId;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(collectLaterBooking, fixtures.service);

    expect(outcome).toMatchObject({ decision: 'none', refundResult: null, refundAmountCents: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(applyRefundOutcome(collectLaterBooking, outcome, 'pay later cancel').paymentStatus).toBe('unpaid');
  });

  it('evaluates self-service cancel and reschedule windows from service policy ids', async () => {
    const strict = { ...currentService(), cancellationPolicyId: 'strict-48h' };
    const blocked = await evaluateBookingSelfServicePolicy(booking('2026-05-12T12:00:00.000Z'), strict);
    const allowed = await evaluateBookingSelfServicePolicy(booking('2026-05-14T12:00:00.000Z'), strict);

    expect(blocked).toMatchObject({
      canCancel: true,
      canReschedule: false,
      refundDecision: 'none',
      cancelHoursBefore: 6,
      rescheduleHoursBefore: 24,
    });
    expect(blocked.rescheduleBlockedReason).toContain('24 hours');
    expect(allowed).toMatchObject({
      canCancel: true,
      canReschedule: true,
      refundDecision: 'full',
      fullRefundHoursBefore: 48,
    });
  });

  it('blocks self-service management after the booking start time', async () => {
    const policy = await evaluateBookingSelfServicePolicy(booking('2026-05-11T23:30:00.000Z'), currentService());

    expect(policy).toMatchObject({
      canCancel: false,
      canReschedule: false,
    });
    expect(policy.cancelBlockedReason).toContain('already started');
  });

  it('blocks self-service management for inactive booking statuses', async () => {
    const completed = {
      ...booking('2026-05-14T12:00:00.000Z'),
      status: 'completed' as const,
    };
    const policy = await evaluateBookingSelfServicePolicy(completed, currentService());

    expect(policy).toMatchObject({
      canCancel: false,
      canReschedule: false,
    });
    expect(policy.cancelBlockedReason).toContain('no longer active');
  });

  it('allows cancel persist only when refund is not due or Stripe refund succeeded', () => {
    expect(refundAllowsCancelPersist({
      decision: 'none',
      hoursUntilStart: 12,
      refundResult: null,
    })).toBe(true);
    expect(refundAllowsCancelPersist({
      decision: 'full',
      hoursUntilStart: 48,
      refundResult: { ok: true, refundId: 're_1' },
      refundAmountCents: 1000,
    })).toBe(true);
    expect(refundAllowsCancelPersist({
      decision: 'full',
      hoursUntilStart: 48,
      refundResult: { ok: false, error: 'Stripe 402' },
      refundAmountCents: 1000,
    })).toBe(false);
  });
  it.each([
    ['pending', { ...stripeSuccess(), status: 'pending' }],
    ['requires action', { ...stripeSuccess(), status: 'requires_action' }],
    ['failed', { ...stripeSuccess(), status: 'failed' }],
    ['canceled', { ...stripeSuccess(), status: 'canceled' }],
    ['null status', { ...stripeSuccess(), status: null }],
    ['missing status', { ...stripeSuccess(), status: undefined }],
    ['unknown status', { ...stripeSuccess(), status: 'new_status' }],
    ['id only', { id: 're_unverified' }],
    ['empty id', { ...stripeSuccess(), id: ' ' }],
    ['wrong object', { ...stripeSuccess(), object: 'payment_intent' }],
    ['null', null], ['array', [stripeSuccess()]], ['string', 'refund'],
    ['amount mismatch', { ...stripeSuccess(), amount: 4999 }],
    ['amount string', { ...stripeSuccess(), amount: '5000' }],
    ['amount fractional', { ...stripeSuccess(), amount: 5000.5 }],
    ['amount missing', { ...stripeSuccess(), amount: undefined }],
    ['currency mismatch', { ...stripeSuccess(), currency: 'usd' }],
    ['currency missing', { ...stripeSuccess(), currency: undefined }],
    ['currency uppercase', { ...stripeSuccess(), currency: 'TWD' }],
    ['target mismatch', { ...stripeSuccess(), payment_intent: 'pi_other' }],
    ['target null', { ...stripeSuccess(), payment_intent: null }],
    ['target missing', { ...stripeSuccess(), payment_intent: undefined }],
    ['target expanded mismatch', { ...stripeSuccess(), payment_intent: { id: 'pi_other' } }],
    ['target malformed', { ...stripeSuccess(), payment_intent: { id: 1 } }],
  ])('does not confirm a 2xx %s refund', async (_name, payload) => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(payload), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const original = booking('2026-05-14T00:00:00.000Z');
    const outcome = await computeRefundForCancel(original, currentService());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(outcome.refundResult?.ok).toBe(false);
    expect(refundAllowsCancelPersist(outcome)).toBe(false);
    expect(applyRefundOutcome(original, outcome, undefined).paymentStatus).toBe('paid');
  });

  it('accepts a matching expanded payment intent and recorded currency despite catalog change', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ ...stripeSuccess(), payment_intent: { id: 'pi_refund_test', object: 'payment_intent' } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const outcome = await computeRefundForCancel(booking('2026-05-14T00:00:00.000Z'), { ...currentService(), priceCurrency: 'USD' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(outcome.refundResult?.ok).toBe(true);
    expect(refundAllowsCancelPersist(outcome)).toBe(true);
  });

  it.each([
    ['missing booked currency', { paymentCurrency: undefined }],
    ['invalid booked currency', { paymentCurrency: 'XXX' }],
    ['nonstring booked currency', { paymentCurrency: 123 }],
    ['missing target', { paymentIntentId: undefined }],
    ['blank target', { paymentIntentId: '  ' }],
    ['nonstring target', { paymentIntentId: 123 }],
    ['unsafe computed amount', { onlinePaidAmount: Number.MAX_SAFE_INTEGER + 1 }],
    ['nonfinite computed amount', { onlinePaidAmount: Infinity }],
    ['zero computed amount', { onlinePaidAmount: 0, paymentAmount: 0 }],
  ])('blocks %s before dispatch', async (_name, overrides) => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(stripeSuccess()), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const original = Object.assign(booking('2026-05-14T00:00:00.000Z'), overrides);
    const outcome = await computeRefundForCancel(original, currentService());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(outcome.refundResult?.ok).toBe(false);
    expect(refundAllowsCancelPersist(outcome)).toBe(false);
  });

  it.each(['invalid-json', 'http500', 'network'])('does not retry %s or confirm success', async (failure) => {
    const fetchMock = vi.fn(async () => {
      if (failure === 'network') throw new Error('synthetic connection loss');
      return new Response(failure === 'invalid-json' ? '{' : '{}', { status: failure === 'http500' ? 500 : 200 });
    });
    vi.stubGlobal('fetch', fetchMock);
    const outcome = await computeRefundForCancel(booking('2026-05-14T00:00:00.000Z'), currentService());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(outcome.refundResult?.ok).toBe(false);
    expect(refundAllowsCancelPersist(outcome)).toBe(false);
  });

  it('does not dispatch without provider configuration', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '');
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    const outcome = await computeRefundForCancel(booking('2026-05-14T00:00:00.000Z'), currentService());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(outcome.refundResult?.ok).toBe(false);
  });

});
