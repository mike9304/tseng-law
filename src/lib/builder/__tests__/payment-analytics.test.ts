import { describe, expect, it } from 'vitest';
import type { Booking, BookingService } from '@/lib/builder/bookings/types';
import type { CommerceOrder } from '@/lib/builder/commerce/orders-engine';
import type { CommercePaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-shared';
import {
  buildPaymentAnalyticsAlerts,
  buildPaymentAnalytics,
  buildPaymentAnalyticsReportFilename,
  buildPaymentSourceFunnelBreakdown,
  buildPaymentWebhookReconciliation,
  buildPaymentAnalyticsTrendCsvFilename,
  serializePaymentAnalyticsReportFile,
  serializePaymentAnalyticsTrendCsv,
} from '@/lib/builder/payment-analytics';

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

function webhookEvent(overrides: Partial<CommercePaymentWebhookEvent>): CommercePaymentWebhookEvent {
  return {
    version: 1,
    eventId: 'evt-webhook-base',
    provider: 'sandbox-card',
    providerEventId: 'evt-webhook-base-provider',
    eventType: 'payment_intent.succeeded',
    paymentReferenceId: 'pi-webhook-base',
    paymentStatus: 'paid',
    status: 'processed',
    replayCount: 0,
    signatureVerified: true,
    payload: {},
    receivedAt: '2026-05-20T05:10:00.000Z',
    updatedAt: '2026-05-20T05:10:00.000Z',
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
      source: 'web',
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
      source: 'web',
      paymentStatus: 'paid',
      paymentAmount: 6000,
      paymentCurrency: 'TWD',
    });
    const refundedBooking = booking({
      bookingId: 'booking-refunded',
      source: 'admin',
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
    const webhookEvents = [
      webhookEvent({
        eventId: 'evt-webhook-processed',
        providerEventId: 'evt-webhook-processed-provider',
        paymentReferenceId: 'pi-webhook-processed',
        amountCents: 10000,
        currency: 'TWD',
        feeCents: 360,
        netAmountCents: 9640,
        balanceTransactionId: 'bt-webhook-processed',
        status: 'processed',
        error: undefined,
      }),
      webhookEvent({
        eventId: 'evt-webhook-unmatched',
        providerEventId: 'evt-webhook-unmatched-provider',
        paymentReferenceId: 'pi-webhook-unmatched',
        amountCents: 5000,
        currency: 'TWD',
        status: 'unmatched',
        error: 'order_not_found',
        replayCount: 1,
      }),
    ];

    const summary = buildPaymentAnalytics({
      orders: [paidOrder, failedOrder, refundedOrder, partialManualOrder],
      bookings: [partialBooking, paidBooking, refundedBooking],
      services: [service()],
      webhookEvents,
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
    expect(summary.trend).toHaveLength(7);
    expect(summary.trend[6]).toMatchObject({
      day: '2026-05-20',
      paymentAttempts: 7,
      successfulPayments: 4,
      partialPayments: 3,
      failedPayments: 2,
      refundedPayments: 2,
    });
    expect(summary.providerBreakdown.map((item) => item.provider)).toEqual(['sandbox-card', 'manual-invoice']);
    expect(summary.providerBreakdown[0]).toMatchObject({
      label: 'Sandbox card',
      paymentAttempts: 3,
      successfulPayments: 2,
      partialPayments: 1,
      failedPayments: 1,
      refundedPayments: 1,
    });
    expect(summary.providerBreakdown[1]).toMatchObject({
      label: 'Manual invoice',
      paymentAttempts: 1,
      successfulPayments: 1,
      partialPayments: 1,
      failedPayments: 1,
      refundedPayments: 0,
    });
    expect(summary.providerFeeBreakdown.map((item) => item.provider)).toEqual(['sandbox-card', 'manual-invoice']);
    expect(summary.providerFeeBreakdown[0]).toMatchObject({
      label: 'Sandbox card',
      feeRateBps: 290,
      fixedFeeCents: 30,
      estimatedFeeCents: 930,
      estimatedNetCollectedCents: 29070,
    });
    expect(summary.providerFeeBreakdown[0].currencyTotals).toEqual([{
      currency: 'TWD',
      grossCollected: 30000,
      estimatedFee: 930,
      estimatedNetCollected: 29070,
      feeShareRate: 3.1,
    }]);
    expect(summary.providerFeeBreakdown[1]).toMatchObject({
      label: 'Manual invoice',
      feeRateBps: 0,
      fixedFeeCents: 0,
      estimatedFeeCents: 0,
      estimatedNetCollectedCents: 4000,
    });
    expect(summary.sourceFunnel).toEqual([
      expect.objectContaining({
        source: 'orders',
        label: 'Orders',
        paymentAttempts: 4,
      }),
      expect.objectContaining({
        source: 'bookings-web',
        label: 'Web bookings',
        paymentAttempts: 2,
      }),
      expect.objectContaining({
        source: 'bookings-admin',
        label: 'Admin bookings',
        paymentAttempts: 1,
      }),
    ]);
    expect(buildPaymentSourceFunnelBreakdown(
      [paidOrder, failedOrder, refundedOrder, partialManualOrder],
      [partialBooking, paidBooking, refundedBooking],
      [service()],
    ).map((item) => item.source)).toEqual(['orders', 'bookings-web', 'bookings-admin']);
    expect(summary.webhookReconciliation).toMatchObject({
      totalEvents: 2,
      processed: 1,
      unmatched: 1,
      failed: 0,
      ignored: 0,
      replayed: 1,
      amountReportedCents: 15000,
      amountMatchedCents: 10000,
      amountUnmatchedCents: 5000,
      amountMismatchCount: 0,
      currencyMismatchCount: 0,
      feeReportedCents: 360,
      feeNetReportedCents: 9640,
      feeEvents: 1,
      missingFeeEvents: 1,
    });
    expect(summary.webhookReconciliation.providerBreakdown).toEqual([
      expect.objectContaining({
        provider: 'sandbox-card',
        label: 'Sandbox card',
        totalEvents: 2,
        processed: 1,
        unmatched: 1,
        replayed: 1,
      }),
    ]);
    expect(summary.webhookReconciliation.feeProviderBreakdown).toEqual([
      expect.objectContaining({
        provider: 'sandbox-card',
        label: 'Sandbox card',
        totalEvents: 2,
        feeEvents: 1,
        feeReportedCents: 360,
        netReportedCents: 9640,
        missingFeeEvents: 1,
      }),
    ]);
    expect(summary.webhookReconciliation.errorBreakdown).toEqual([
      expect.objectContaining({
        error: 'order_not_found',
        label: 'Order not found',
        count: 1,
      }),
    ]);
    expect(summary.webhookReconciliation.recentEvents).toEqual([
      expect.objectContaining({ eventId: 'evt-webhook-processed' }),
      expect.objectContaining({ eventId: 'evt-webhook-unmatched' }),
    ]);
    expect(buildPaymentWebhookReconciliation(webhookEvents)).toMatchObject({
      totalEvents: 2,
      processed: 1,
      unmatched: 1,
    });
    expect(buildPaymentAnalyticsAlerts(summary)).toEqual([
      {
        id: 'activity-snapshot',
        label: 'Payment activity snapshot',
        detail: '7 attempts recorded with 3 failed payments and 2 refunded payments; 1 currency bucket still carries balances due.',
        tone: 'info',
      },
      {
        id: 'failed-rate',
        label: 'High failure rate',
        detail: '3 failed payments across 7 attempts (42.9%).',
        tone: 'danger',
      },
      {
        id: 'refund-rate',
        label: 'Refund activity needs review',
        detail: '2 refunded payments across 7 attempts (33.3%).',
        tone: 'warn',
      },
      {
        id: 'outstanding-balances',
        label: 'Outstanding balances remain',
        detail: '1 currency bucket still carries balances due.',
        tone: 'warn',
        amountCents: 13000,
        currency: 'TWD',
      },
    ]);
    expect(buildPaymentAnalyticsReportFilename()).toBe('payment-analytics-report.json');
    expect(buildPaymentAnalyticsTrendCsvFilename()).toBe('payment-analytics-trend.csv');
    expect(serializePaymentAnalyticsReportFile(summary)).toContain('"providerFeeBreakdown"');
    expect(serializePaymentAnalyticsReportFile(summary)).toContain('"sourceFunnel"');
    expect(serializePaymentAnalyticsTrendCsv(summary)).toContain('day,paymentAttempts,successfulPayments,partialPayments,failedPayments,refundedPayments');
  });
});
