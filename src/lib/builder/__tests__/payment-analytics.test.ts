import { describe, expect, it } from 'vitest';
import type { Booking, BookingService } from '@/lib/builder/bookings/types';
import type { CommerceOrder } from '@/lib/builder/commerce/orders-engine';
import { buildPaymentAnalytics } from '@/lib/builder/payment-analytics';

function order(overrides: Partial<CommerceOrder>): CommerceOrder {
  return {
    version: 1,
    orderId: 'order-base',
    confirmationNumber: 'TSENG-BASE',
    locale: 'ko',
    currency: 'TWD',
    status: 'confirmed',
    customer: { name: 'Order Client', email: 'order@example.com' },
    shippingAddress: {
      country: 'TW',
      region: 'Taipei',
      city: 'Taipei',
      postalCode: '100',
      addressLine1: 'No. 1',
    },
    lineItems: [],
    shipping: { method: 'pickup', label: 'Pickup', amountCents: 0, currency: 'TWD', estimatedDays: 'same day', freeShippingApplied: false },
    tax: { country: 'TW', label: 'Tax', rateBps: 0, amountCents: 0 },
    totals: {
      itemCount: 0,
      subtotalCents: 0,
      discountCents: 0,
      totalCents: 0,
      shippingCents: 0,
      taxCents: 0,
      grandTotalCents: 0,
    },
    payment: { adapter: 'sandbox-card', status: 'paid', label: 'Sandbox', stub: true },
    manualPayments: [],
    refunds: [],
    documents: [],
    fulfillment: { status: 'unfulfilled', method: 'pickup', updatedAt: '2026-05-20T00:00:00.000Z' },
    source: 'checkout',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    audit: [],
    ...overrides,
  };
}

function service(overrides: Partial<BookingService> = {}): BookingService {
  return {
    serviceId: 'svc-analytics',
    slug: 'analytics',
    name: { ko: '분석 상담', 'zh-hant': '分析諮詢', en: 'Analytics consult' },
    description: { ko: '', 'zh-hant': '', en: '' },
    durationMinutes: 30,
    priceTwd: 8000,
    priceAmount: 8000,
    priceCurrency: 'TWD',
    category: 'consultation',
    staffIds: ['staff-analytics'],
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 0,
    slotStepMinutes: 30,
    isActive: true,
    paymentMode: 'paid',
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    ...overrides,
  };
}

function booking(overrides: Partial<Booking>): Booking {
  return {
    bookingId: 'booking-base',
    serviceId: 'svc-analytics',
    staffId: 'staff-analytics',
    customer: { name: 'Booking Client', email: 'booking@example.com', locale: 'ko' },
    startAt: '2026-05-21T09:00:00.000Z',
    endAt: '2026-05-21T09:30:00.000Z',
    status: 'confirmed',
    source: 'admin',
    paymentStatus: 'unpaid',
    reminders: [],
    createdAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildPaymentAnalytics', () => {
  it('summarizes revenue, conversion, refunds, failed payments, and balances across orders and bookings', () => {
    const paidOrder = order({
      orderId: 'order-paid',
      totals: { itemCount: 1, subtotalCents: 10000, discountCents: 0, totalCents: 10000, shippingCents: 0, taxCents: 0, grandTotalCents: 10000 },
      payment: { adapter: 'sandbox-card', status: 'paid', label: 'Sandbox', stub: true },
    });
    const failedOrder = order({
      orderId: 'order-failed',
      totals: { itemCount: 1, subtotalCents: 5000, discountCents: 0, totalCents: 5000, shippingCents: 0, taxCents: 0, grandTotalCents: 5000 },
      payment: { adapter: 'sandbox-card', status: 'failed', label: 'Sandbox', stub: true },
    });
    const refundedOrder = order({
      orderId: 'order-refunded',
      totals: { itemCount: 1, subtotalCents: 20000, discountCents: 0, totalCents: 20000, shippingCents: 0, taxCents: 0, grandTotalCents: 20000 },
      payment: { adapter: 'sandbox-card', status: 'partially_refunded', label: 'Sandbox', stub: false, referenceId: 'pi_refund' },
      refunds: [{
        refundId: 'rf-order',
        providerRefundId: 're_order',
        amountCents: 5000,
        currency: 'TWD',
        status: 'succeeded',
        actor: 'admin',
        createdAt: '2026-05-20T01:00:00.000Z',
      }],
    });
    const partialManualOrder = order({
      orderId: 'order-partial',
      totals: { itemCount: 1, subtotalCents: 12000, discountCents: 0, totalCents: 12000, shippingCents: 0, taxCents: 0, grandTotalCents: 12000 },
      payment: { adapter: 'manual-invoice', status: 'partially_paid', label: 'Manual invoice', stub: false, referenceId: 'manual-order' },
      manualPayments: [
        {
          paymentId: 'mp-ok',
          amountCents: 4000,
          currency: 'TWD',
          method: 'bank_transfer',
          status: 'succeeded',
          actor: 'admin',
          createdAt: '2026-05-20T02:00:00.000Z',
        },
        {
          paymentId: 'mp-failed',
          amountCents: 1000,
          currency: 'TWD',
          method: 'bank_transfer',
          status: 'failed',
          actor: 'admin',
          createdAt: '2026-05-20T02:05:00.000Z',
        },
      ],
    });

    const partialBooking = booking({
      bookingId: 'booking-partial',
      paymentStatus: 'partially_paid',
      paymentAmount: 8000,
      paymentCurrency: 'TWD',
      onlinePaidAmount: 2000,
      manualPayments: [
        {
          paymentId: 'bmp-ok',
          amountCents: 1000,
          currency: 'TWD',
          method: 'cash',
          status: 'succeeded',
          actor: 'admin',
          createdAt: '2026-05-20T03:00:00.000Z',
        },
        {
          paymentId: 'bmp-failed',
          amountCents: 500,
          currency: 'TWD',
          method: 'cash',
          status: 'failed',
          actor: 'admin',
          createdAt: '2026-05-20T03:05:00.000Z',
        },
      ],
    });
    const paidBooking = booking({
      bookingId: 'booking-paid',
      paymentStatus: 'paid',
      paymentAmount: 6000,
      paymentCurrency: 'TWD',
    });
    const refundedBooking = booking({
      bookingId: 'booking-refunded',
      paymentStatus: 'refunded',
      paymentAmount: 5000,
      paymentCurrency: 'TWD',
      billingDocuments: [{
        documentId: 'bdoc-booking',
        type: 'receipt',
        number: 'RCT-2026-000001',
        status: 'issued',
        currency: 'TWD',
        amount: 5000,
        refundedAmount: 5000,
        balanceDue: 0,
        recipientEmail: 'booking@example.com',
        recipientName: 'Booking Client',
        actor: 'admin',
        issuedAt: '2026-05-20T04:00:00.000Z',
      }],
    });

    const summary = buildPaymentAnalytics({
      orders: [paidOrder, failedOrder, refundedOrder, partialManualOrder],
      bookings: [partialBooking, paidBooking, refundedBooking],
      services: [service()],
      now: '2026-05-20T05:00:00.000Z',
    });

    expect(summary.totals.paymentAttempts).toBe(7);
    expect(summary.totals.successfulPayments).toBe(6);
    expect(summary.totals.partialPayments).toBe(3);
    expect(summary.totals.failedPayments).toBe(3);
    expect(summary.totals.refundedPayments).toBe(2);
    expect(summary.totals.paymentConversionRate).toBe(85.7);
    expect(summary.totals.failedPaymentRate).toBe(42.9);
    expect(summary.totals.refundRate).toBe(33.3);
    expect(summary.totals.currencyTotals).toEqual([{
      currency: 'TWD',
      grossCollected: 48000,
      refunded: 10000,
      netCollected: 38000,
      outstanding: 13000,
      refundShareRate: 20.8,
    }]);
  });
});
