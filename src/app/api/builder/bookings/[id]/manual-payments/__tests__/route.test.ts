import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { recordBookingManualPayment } from '@/lib/builder/bookings/payments';
import { runBookingBillingAutomation } from '@/lib/builder/billing-document-automation';
import { getCurrentBillingInvoice } from '@/lib/builder/billing-documents';
import { queueBillingPaymentReceivedNotification } from '@/lib/builder/commerce/notifications-engine';
import type { Booking, BookingManualPayment } from '@/lib/builder/bookings/types';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/bookings/payments', () => ({
  recordBookingManualPayment: vi.fn(async () => ({
    booking: null,
    manualPayment: null,
    error: 'booking_not_found',
  })),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runBookingBillingAutomation: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/billing-documents', () => ({
  getCurrentBillingInvoice: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  queueBillingPaymentReceivedNotification: vi.fn(async () => undefined),
}));

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    bookingId: 'bk-manual-payment-test',
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
    paymentStatus: 'partially_paid',
    paymentAmount: 10000,
    paymentCurrency: 'TWD',
    manualPayments: [],
    billingDocuments: [],
    createdAt: '2026-05-01T00:00:00.000Z',
    updatedAt: '2026-05-01T00:00:00.000Z',
    ...overrides,
  };
}

function manualPayment(overrides: Partial<BookingManualPayment> = {}): BookingManualPayment {
  return {
    paymentId: 'bmp-route-test',
    amountCents: 5000,
    currency: 'TWD',
    method: 'cash',
    status: 'succeeded',
    actor: 'admin',
    createdAt: '2026-05-02T00:00:00.000Z',
    ...overrides,
  };
}

function postRequest(body: unknown, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/bk-manual-payment-test/manual-payments?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function rawPostRequest(body: string, locale = 'ko'): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/bookings/bk-manual-payment-test/manual-payments?locale=${locale}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  });
}

describe('/api/builder/bookings/[id]/manual-payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({ user: { id: 'admin-1' } } as never);
  });

  it('returns localized validation errors for invalid manual payment payloads', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ amountCents: 0 }, 'zh-hant'), {
      params: Promise.resolve({ id: 'bk-manual-payment-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('請確認手動付款資料。');
    expect(payload.errorCode).toBe('validation_error');
    expect(payload.issues.fieldErrors.amountCents).toHaveLength(1);
    expect(recordBookingManualPayment).not.toHaveBeenCalled();
  });

  it('returns localized errors for invalid JSON bodies', async () => {
    const route = await import('../route');
    const response = await route.POST(rawPostRequest('{', 'en'), {
      params: Promise.resolve({ id: 'bk-manual-payment-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the manual payment request format.',
      errorCode: 'invalid_json',
    });
    expect(recordBookingManualPayment).not.toHaveBeenCalled();
  });

  it('returns localized booking-not-found errors from the payment engine', async () => {
    const route = await import('../route');
    const response = await route.POST(postRequest({ amountCents: 5000 }, 'en'), {
      params: Promise.resolve({ id: 'bk-manual-payment-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Booking not found.',
      errorCode: 'booking_not_found',
    });
  });

  it('returns localized domain errors from the payment engine', async () => {
    vi.mocked(recordBookingManualPayment).mockResolvedValueOnce({
      booking: booking(),
      manualPayment: null,
      error: 'manual_payment_exceeds_balance',
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ amountCents: 15000 }, 'zh-hant'), {
      params: Promise.resolve({ id: 'bk-manual-payment-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '手動付款超過應付餘額。',
      errorCode: 'manual_payment_exceeds_balance',
    });
  });

  it('normalizes unknown payment engine errors to localized fallback failures', async () => {
    vi.mocked(recordBookingManualPayment).mockResolvedValueOnce({
      booking: booking(),
      manualPayment: null,
      error: 'unexpected_payment_state',
    });
    const route = await import('../route');
    const response = await route.POST(postRequest({ amountCents: 5000 }, 'ko'), {
      params: Promise.resolve({ id: 'bk-manual-payment-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '수동 결제에 실패했습니다.',
      errorCode: 'manual_payment_failed',
    });
  });

  it('records manual payments with valid payloads and preserves paid automation hooks', async () => {
    const paidBooking = booking({ paymentStatus: 'paid' });
    const automationBooking = booking({ paymentStatus: 'paid', updatedAt: '2026-05-03T00:00:00.000Z' });
    const payment = manualPayment();
    vi.mocked(recordBookingManualPayment).mockResolvedValueOnce({
      booking: paidBooking,
      manualPayment: payment,
    });
    vi.mocked(runBookingBillingAutomation).mockResolvedValueOnce({
      owner: automationBooking,
      actions: [{ type: 'receipt', emailed: true }],
    } as never);
    vi.mocked(getCurrentBillingInvoice).mockResolvedValueOnce({ documentId: 'inv-route-test' } as never);

    const route = await import('../route');
    const response = await route.POST(postRequest({
      amountCents: 5000,
      method: 'cash',
      reference: 'Counter payment',
      note: 'Paid at office',
    }, 'ko'), {
      params: Promise.resolve({ id: 'bk-manual-payment-test' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, booking: automationBooking, manualPayment: payment });
    expect(recordBookingManualPayment).toHaveBeenCalledWith('bk-manual-payment-test', {
      amountCents: 5000,
      method: 'cash',
      status: 'succeeded',
      reference: 'Counter payment',
      note: 'Paid at office',
      actor: 'admin',
    });
    expect(runBookingBillingAutomation).toHaveBeenCalledWith('bk-manual-payment-test', { trigger: 'paid' });
    expect(queueBillingPaymentReceivedNotification).toHaveBeenCalledWith(
      { documentId: 'inv-route-test' },
      expect.objectContaining({
        amount: 5000,
        method: 'manual',
        paymentId: 'bmp-route-test',
        provider: 'manual',
        receiptEmailQueued: true,
      }),
    );
  });
});
