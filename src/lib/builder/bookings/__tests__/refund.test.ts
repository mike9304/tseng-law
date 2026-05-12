import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Booking, BookingService } from '@/lib/builder/bookings/types';

const fixtures = vi.hoisted(() => ({
  service: null as BookingService | null,
}));

vi.mock('@/lib/builder/bookings/storage', () => ({
  getService: vi.fn(async () => fixtures.service),
}));

import { applyRefundOutcome, computeRefundForCancel } from '@/lib/builder/bookings/refund';

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

describe('booking refund policy', () => {
  beforeEach(() => {
    fixtures.service = service();
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
      expect(body).not.toContain('amount=');
      return new Response(JSON.stringify({ id: 're_full' }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-14T00:00:00.000Z'), fixtures.service!);

    expect(outcome).toMatchObject({ decision: 'full', refundResult: { ok: true, refundId: 're_full' } });
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
      return new Response(JSON.stringify({ id: 're_partial' }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-12T08:00:00.000Z'), fixtures.service!);

    expect(outcome).toMatchObject({
      decision: 'partial',
      partialAmountCents: 2500,
      refundResult: { ok: true, refundId: 're_partial' },
    });
    expect(applyRefundOutcome(booking('2026-05-12T08:00:00.000Z'), outcome, undefined).paymentStatus).toBe('partial-refund');
  });

  it('does not call Stripe when cancellation is inside the no-refund window', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const outcome = await computeRefundForCancel(booking('2026-05-12T02:00:00.000Z'), fixtures.service!);

    expect(outcome).toMatchObject({ decision: 'none', refundResult: null });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(applyRefundOutcome(booking('2026-05-12T02:00:00.000Z'), outcome, 'late').paymentStatus).toBe('paid');
  });
});
