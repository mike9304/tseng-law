import type { Booking, BookingService } from '@/lib/builder/bookings/types';
import type { CommerceOrder } from '@/lib/builder/commerce/orders-engine';

export interface PaymentAnalyticsCurrencyTotal {
  currency: string;
  grossCollected: number;
  refunded: number;
  netCollected: number;
  outstanding: number;
  refundShareRate: number;
}

export interface PaymentAnalyticsSourceSummary {
  paymentAttempts: number;
  successfulPayments: number;
  partialPayments: number;
  failedPayments: number;
  refundedPayments: number;
  paymentConversionRate: number;
  failedPaymentRate: number;
  refundRate: number;
  currencyTotals: PaymentAnalyticsCurrencyTotal[];
}

export interface PaymentAnalyticsSummary {
  generatedAt: string;
  totals: PaymentAnalyticsSourceSummary;
  orders: PaymentAnalyticsSourceSummary;
  bookings: PaymentAnalyticsSourceSummary;
}

interface MutableCurrencyTotal {
  currency: string;
  grossCollected: number;
  refunded: number;
  outstanding: number;
}

interface MutableSourceSummary {
  paymentAttempts: number;
  successfulPayments: number;
  partialPayments: number;
  failedPayments: number;
  refundedPayments: number;
  currencyTotals: Map<string, MutableCurrencyTotal>;
}

export interface BuildPaymentAnalyticsInput {
  orders: CommerceOrder[];
  bookings: Booking[];
  services: BookingService[];
  now?: string;
}

function emptyMutableSummary(): MutableSourceSummary {
  return {
    paymentAttempts: 0,
    successfulPayments: 0,
    partialPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
    currencyTotals: new Map(),
  };
}

function roundRate(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function bucketFor(summary: MutableSourceSummary, currency: string): MutableCurrencyTotal {
  const normalized = currency.trim().toUpperCase() || 'TWD';
  const existing = summary.currencyTotals.get(normalized);
  if (existing) return existing;
  const next: MutableCurrencyTotal = {
    currency: normalized,
    grossCollected: 0,
    refunded: 0,
    outstanding: 0,
  };
  summary.currencyTotals.set(normalized, next);
  return next;
}

function addMoney(
  summary: MutableSourceSummary,
  currency: string,
  input: { grossCollected?: number; refunded?: number; outstanding?: number },
): void {
  const bucket = bucketFor(summary, currency);
  bucket.grossCollected += Math.max(0, Math.floor(input.grossCollected ?? 0));
  bucket.refunded += Math.max(0, Math.floor(input.refunded ?? 0));
  bucket.outstanding += Math.max(0, Math.floor(input.outstanding ?? 0));
}

function successfulManualOrderTotal(order: CommerceOrder): number {
  return order.manualPayments
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

function failedManualOrderCount(order: CommerceOrder): number {
  return order.manualPayments.filter((payment) => payment.status === 'failed').length;
}

function successfulOrderRefundTotal(order: CommerceOrder): number {
  return order.refunds
    .filter((refund) => refund.status === 'succeeded')
    .reduce((total, refund) => total + refund.amountCents, 0);
}

function orderGrossCollected(order: CommerceOrder): number {
  if (
    order.payment.status === 'paid'
    || order.payment.status === 'authorized_stub'
    || order.payment.status === 'partially_refunded'
    || order.payment.status === 'refunded'
  ) {
    return order.totals.grandTotalCents;
  }
  if (order.payment.status === 'partially_paid') return successfulManualOrderTotal(order);
  return 0;
}

function orderRefundedAmount(order: CommerceOrder, grossCollected: number): number {
  const explicitRefunded = successfulOrderRefundTotal(order);
  if (explicitRefunded > 0) return explicitRefunded;
  if (order.payment.status === 'refunded') return grossCollected;
  return 0;
}

function orderOutstandingAmount(order: CommerceOrder): number {
  if (
    order.payment.status === 'paid'
    || order.payment.status === 'authorized_stub'
    || order.payment.status === 'partially_refunded'
    || order.payment.status === 'refunded'
  ) {
    return 0;
  }
  if (order.payment.status === 'requires_manual_payment' || order.payment.status === 'partially_paid') {
    return Math.max(0, order.totals.grandTotalCents - successfulManualOrderTotal(order));
  }
  return 0;
}

function bookingCurrency(booking: Booking, service?: BookingService): string {
  return booking.paymentCurrency ?? service?.priceCurrency ?? 'TWD';
}

function bookingTotalAmount(booking: Booking, service?: BookingService): number {
  return Math.max(0, booking.paymentAmount ?? service?.priceAmount ?? service?.priceTwd ?? 0);
}

function successfulManualBookingTotal(booking: Booking): number {
  return (booking.manualPayments ?? [])
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

function failedManualBookingCount(booking: Booking): number {
  return (booking.manualPayments ?? []).filter((payment) => payment.status === 'failed').length;
}

function trackedBookingPaidTotal(booking: Booking): number {
  return Math.max(0, booking.onlinePaidAmount ?? 0) + successfulManualBookingTotal(booking);
}

function maxDocumentRefundedAmount(booking: Booking): number {
  return Math.max(0, ...(booking.billingDocuments ?? []).map((document) => document.refundedAmount));
}

function bookingGrossCollected(booking: Booking, totalAmount: number): number {
  const tracked = trackedBookingPaidTotal(booking);
  if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded' || booking.paymentStatus === 'partial-refund') {
    return Math.max(totalAmount, tracked);
  }
  if (booking.paymentStatus === 'partially_paid') return tracked;
  return 0;
}

function bookingRefundedAmount(booking: Booking, grossCollected: number): number {
  const documentedRefund = maxDocumentRefundedAmount(booking);
  if (documentedRefund > 0) return documentedRefund;
  if (booking.paymentStatus === 'refunded') return grossCollected;
  if (booking.paymentStatus === 'partial-refund') return Math.floor(grossCollected / 2);
  return 0;
}

function bookingOutstandingAmount(booking: Booking, totalAmount: number): number {
  if (booking.paymentStatus === 'paid' || booking.paymentStatus === 'refunded' || booking.paymentStatus === 'partial-refund') return 0;
  return Math.max(0, totalAmount - trackedBookingPaidTotal(booking));
}

function paymentSummary(summary: MutableSourceSummary): PaymentAnalyticsSourceSummary {
  const currencyTotals = Array.from(summary.currencyTotals.values())
    .map((bucket): PaymentAnalyticsCurrencyTotal => {
      const netCollected = Math.max(0, bucket.grossCollected - bucket.refunded);
      return {
        currency: bucket.currency,
        grossCollected: bucket.grossCollected,
        refunded: bucket.refunded,
        netCollected,
        outstanding: bucket.outstanding,
        refundShareRate: roundRate(bucket.refunded, bucket.grossCollected),
      };
    })
    .sort((a, b) => b.netCollected - a.netCollected || a.currency.localeCompare(b.currency));

  return {
    paymentAttempts: summary.paymentAttempts,
    successfulPayments: summary.successfulPayments,
    partialPayments: summary.partialPayments,
    failedPayments: summary.failedPayments,
    refundedPayments: summary.refundedPayments,
    paymentConversionRate: roundRate(summary.successfulPayments, summary.paymentAttempts),
    failedPaymentRate: roundRate(summary.failedPayments, summary.paymentAttempts),
    refundRate: roundRate(summary.refundedPayments, summary.successfulPayments),
    currencyTotals,
  };
}

function mergeCurrencyTotals(target: MutableSourceSummary, source: MutableSourceSummary): void {
  for (const bucket of source.currencyTotals.values()) {
    addMoney(target, bucket.currency, {
      grossCollected: bucket.grossCollected,
      refunded: bucket.refunded,
      outstanding: bucket.outstanding,
    });
  }
}

export function buildPaymentAnalytics(input: BuildPaymentAnalyticsInput): PaymentAnalyticsSummary {
  const orders = emptyMutableSummary();
  const bookings = emptyMutableSummary();
  const totals = emptyMutableSummary();
  const servicesById = new Map(input.services.map((service) => [service.serviceId, service]));

  for (const order of input.orders) {
    orders.paymentAttempts += 1;
    const failedManualCount = failedManualOrderCount(order);
    const grossCollected = orderGrossCollected(order);
    const refunded = orderRefundedAmount(order, grossCollected);
    const outstanding = orderOutstandingAmount(order);
    const successful = grossCollected > 0 || order.payment.status === 'partially_paid';

    orders.successfulPayments += successful ? 1 : 0;
    orders.partialPayments += order.payment.status === 'partially_paid' || order.payment.status === 'partially_refunded' ? 1 : 0;
    orders.failedPayments += order.payment.status === 'failed' ? Math.max(1, failedManualCount) : failedManualCount;
    orders.refundedPayments += refunded > 0 || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded' ? 1 : 0;
    addMoney(orders, order.currency, { grossCollected, refunded, outstanding });
  }

  for (const booking of input.bookings) {
    const service = servicesById.get(booking.serviceId);
    const totalAmount = bookingTotalAmount(booking, service);
    const paymentStatus = booking.paymentStatus ?? 'unpaid';
    const payable = totalAmount > 0 || service?.paymentMode === 'paid' || paymentStatus !== 'unpaid';
    if (!payable) continue;

    bookings.paymentAttempts += 1;
    const grossCollected = bookingGrossCollected(booking, totalAmount);
    const refunded = bookingRefundedAmount(booking, grossCollected);
    const outstanding = bookingOutstandingAmount(booking, totalAmount);
    const failedManualCount = failedManualBookingCount(booking);

    bookings.successfulPayments += grossCollected > 0 || paymentStatus === 'partially_paid' ? 1 : 0;
    bookings.partialPayments += paymentStatus === 'partially_paid' || paymentStatus === 'partial-refund' ? 1 : 0;
    bookings.failedPayments += failedManualCount;
    bookings.refundedPayments += refunded > 0 || paymentStatus === 'refunded' || paymentStatus === 'partial-refund' ? 1 : 0;
    addMoney(bookings, bookingCurrency(booking, service), { grossCollected, refunded, outstanding });
  }

  totals.paymentAttempts = orders.paymentAttempts + bookings.paymentAttempts;
  totals.successfulPayments = orders.successfulPayments + bookings.successfulPayments;
  totals.partialPayments = orders.partialPayments + bookings.partialPayments;
  totals.failedPayments = orders.failedPayments + bookings.failedPayments;
  totals.refundedPayments = orders.refundedPayments + bookings.refundedPayments;
  mergeCurrencyTotals(totals, orders);
  mergeCurrencyTotals(totals, bookings);

  return {
    generatedAt: input.now ?? new Date().toISOString(),
    totals: paymentSummary(totals),
    orders: paymentSummary(orders),
    bookings: paymentSummary(bookings),
  };
}
