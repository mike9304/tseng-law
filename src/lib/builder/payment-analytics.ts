import type { Booking, BookingService } from '@/lib/builder/bookings/types';
import type { CommerceOrder } from '@/lib/builder/commerce/orders-engine';
import type { CommercePaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-shared';

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

export interface PaymentAnalyticsProviderSummary extends PaymentAnalyticsSourceSummary {
  provider: string;
  label: string;
}

export interface PaymentAnalyticsSourceFunnelSummary extends PaymentAnalyticsSourceSummary {
  source: string;
  label: string;
}

export interface PaymentAnalyticsWebhookReconciliationProviderSummary {
  provider: string;
  label: string;
  totalEvents: number;
  processed: number;
  unmatched: number;
  failed: number;
  ignored: number;
  replayed: number;
}

export interface PaymentAnalyticsWebhookFeeProviderSummary extends PaymentAnalyticsWebhookReconciliationProviderSummary {
  feeEvents: number;
  feeReportedCents: number;
  netReportedCents: number;
  missingFeeEvents: number;
}

export interface PaymentAnalyticsWebhookReconciliationErrorSummary {
  error: string;
  label: string;
  count: number;
}

export interface PaymentAnalyticsWebhookReconciliationEventSummary {
  eventId: string;
  provider: string;
  label: string;
  providerEventId: string;
  status: string;
  paymentReferenceId: string;
  amountCents?: number;
  currency?: string;
  error?: string;
  replayCount: number;
  receivedAt: string;
}

export interface PaymentAnalyticsWebhookReconciliationSummary {
  totalEvents: number;
  processed: number;
  unmatched: number;
  failed: number;
  ignored: number;
  replayed: number;
  amountReportedCents: number;
  amountMatchedCents: number;
  amountUnmatchedCents: number;
  amountMismatchCount: number;
  currencyMismatchCount: number;
  providerBreakdown: PaymentAnalyticsWebhookReconciliationProviderSummary[];
  feeProviderBreakdown: PaymentAnalyticsWebhookFeeProviderSummary[];
  feeReportedCents: number;
  feeNetReportedCents: number;
  feeEvents: number;
  missingFeeEvents: number;
  errorBreakdown: PaymentAnalyticsWebhookReconciliationErrorSummary[];
  recentEvents: PaymentAnalyticsWebhookReconciliationEventSummary[];
}

export interface PaymentAnalyticsProviderFeeCurrencyTotal {
  currency: string;
  grossCollected: number;
  estimatedFee: number;
  estimatedNetCollected: number;
  feeShareRate: number;
}

export interface PaymentAnalyticsTrendPoint {
  day: string;
  paymentAttempts: number;
  successfulPayments: number;
  partialPayments: number;
  failedPayments: number;
  refundedPayments: number;
}

export interface PaymentAnalyticsAlert {
  id: string;
  label: string;
  detail: string;
  tone: 'info' | 'warn' | 'danger';
  amountCents?: number;
  currency?: string;
}

export interface PaymentAnalyticsProviderFeeSummary extends Omit<PaymentAnalyticsProviderSummary, 'currencyTotals'> {
  estimatedFeeCents: number;
  estimatedNetCollectedCents: number;
  feeRateBps: number;
  fixedFeeCents: number;
  currencyTotals: PaymentAnalyticsProviderFeeCurrencyTotal[];
}

export interface PaymentAnalyticsSummary {
  generatedAt: string;
  totals: PaymentAnalyticsSourceSummary;
  orders: PaymentAnalyticsSourceSummary;
  bookings: PaymentAnalyticsSourceSummary;
  trend: PaymentAnalyticsTrendPoint[];
  sourceFunnel: PaymentAnalyticsSourceFunnelSummary[];
  webhookReconciliation: PaymentAnalyticsWebhookReconciliationSummary;
  providerBreakdown: PaymentAnalyticsProviderSummary[];
  providerFeeBreakdown: PaymentAnalyticsProviderFeeSummary[];
}

export interface PaymentAnalyticsReportFile {
  generatedAt: string;
  summary: PaymentAnalyticsSummary;
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

interface MutableProviderSummary {
  provider: string;
  label: string;
  summary: MutableSourceSummary;
}

interface MutableWebhookProviderSummary {
  provider: string;
  label: string;
  totalEvents: number;
  processed: number;
  unmatched: number;
  failed: number;
  ignored: number;
  replayed: number;
}

interface MutableWebhookFeeProviderSummary extends MutableWebhookProviderSummary {
  feeEvents: number;
  feeReportedCents: number;
  netReportedCents: number;
  missingFeeEvents: number;
}

interface MutableWebhookErrorSummary {
  error: string;
  label: string;
  count: number;
}

interface MutableSourceFunnelSummary {
  source: string;
  label: string;
  summary: MutableSourceSummary;
}

interface MutableProviderFeeCurrencyTotal {
  currency: string;
  grossCollected: number;
  estimatedFee: number;
}

interface MutableProviderFeeSummary {
  provider: string;
  label: string;
  feeRateBps: number;
  fixedFeeCents: number;
  summary: MutableSourceSummary;
  currencyTotals: Map<string, MutableProviderFeeCurrencyTotal>;
}

interface MutableTrendPoint {
  paymentAttempts: number;
  successfulPayments: number;
  partialPayments: number;
  failedPayments: number;
  refundedPayments: number;
}

export interface BuildPaymentAnalyticsInput {
  orders: CommerceOrder[];
  bookings: Booking[];
  services: BookingService[];
  webhookEvents?: CommercePaymentWebhookEvent[];
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

function dayKeyUtc(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return date.toISOString().slice(0, 10);
}

function emptyTrendPoint(): MutableTrendPoint {
  return {
    paymentAttempts: 0,
    successfulPayments: 0,
    partialPayments: 0,
    failedPayments: 0,
    refundedPayments: 0,
  };
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

function providerLabel(provider: string): string {
  if (provider === 'sandbox-card') return 'Sandbox card';
  if (provider === 'manual-invoice') return 'Manual invoice';
  return provider;
}

function webhookErrorLabel(error: string): string {
  if (error === 'order_not_found') return 'Order not found';
  if (error === 'amount_mismatch') return 'Amount mismatch';
  if (error === 'currency_mismatch') return 'Currency mismatch';
  if (error === 'paid_payment_locked') return 'Paid payment locked';
  if (error === 'refund_payment_locked') return 'Refund payment locked';
  if (error === 'payment_status_unchanged') return 'Payment status unchanged';
  return error.replace(/_/g, ' ');
}

function providerFeeRules(provider: string): { feeRateBps: number; fixedFeeCents: number } {
  if (provider === 'sandbox-card') {
    return { feeRateBps: 290, fixedFeeCents: 30 };
  }
  return { feeRateBps: 0, fixedFeeCents: 0 };
}

function providerBucket(provider: string, buckets: Map<string, MutableProviderSummary>): MutableProviderSummary {
  const existing = buckets.get(provider);
  if (existing) return existing;
  const next = {
    provider,
    label: providerLabel(provider),
    summary: emptyMutableSummary(),
  };
  buckets.set(provider, next);
  return next;
}

function providerFeeBucket(provider: string, buckets: Map<string, MutableProviderFeeSummary>): MutableProviderFeeSummary {
  const existing = buckets.get(provider);
  if (existing) return existing;
  const rules = providerFeeRules(provider);
  const next = {
    provider,
    label: providerLabel(provider),
    feeRateBps: rules.feeRateBps,
    fixedFeeCents: rules.fixedFeeCents,
    summary: emptyMutableSummary(),
    currencyTotals: new Map<string, MutableProviderFeeCurrencyTotal>(),
  };
  buckets.set(provider, next);
  return next;
}

function providerFeeCurrencyBucket(
  provider: MutableProviderFeeSummary,
  currency: string,
): MutableProviderFeeCurrencyTotal {
  const normalized = currency.trim().toUpperCase() || 'TWD';
  const existing = provider.currencyTotals.get(normalized);
  if (existing) return existing;
  const next = {
    currency: normalized,
    grossCollected: 0,
    estimatedFee: 0,
  };
  provider.currencyTotals.set(normalized, next);
  return next;
}

function estimatedProviderFee(grossCollected: number, successfulPayments: number, feeRateBps: number, fixedFeeCents: number): number {
  const percentageFee = Math.round((grossCollected * feeRateBps) / 10000);
  return Math.max(0, percentageFee + (successfulPayments * fixedFeeCents));
}

function formatCount(count: number, label: string): string {
  return `${count} ${label}${count === 1 ? '' : 's'}`;
}

export function buildPaymentTrendSeries(
  orders: CommerceOrder[],
  bookings: Booking[],
  services: BookingService[],
  days = 7,
  nowMs = Date.now(),
): PaymentAnalyticsTrendPoint[] {
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const endMs = nowMs;
  const startMs = endMs - ((days - 1) * 24 * 60 * 60 * 1000);
  const buckets = new Map<string, MutableTrendPoint>();

  for (let index = 0; index < days; index += 1) {
    const bucketDate = new Date(startMs + index * 24 * 60 * 60 * 1000);
    const day = bucketDate.toISOString().slice(0, 10);
    buckets.set(day, emptyTrendPoint());
  }

  for (const order of orders) {
    const bucket = buckets.get(dayKeyUtc(order.createdAt));
    if (!bucket) continue;
    bucket.paymentAttempts += 1;
    bucket.successfulPayments += order.payment.status === 'paid' || order.payment.status === 'authorized_stub' || order.payment.status === 'partially_paid' ? 1 : 0;
    bucket.partialPayments += order.payment.status === 'partially_paid' || order.payment.status === 'partially_refunded' ? 1 : 0;
    bucket.failedPayments += order.payment.status === 'failed' ? 1 : 0;
    bucket.refundedPayments += order.payment.status === 'partially_refunded' || order.payment.status === 'refunded' ? 1 : 0;
  }

  for (const booking of bookings) {
    const service = serviceById.get(booking.serviceId);
    const totalAmount = bookingTotalAmount(booking, service);
    const paymentStatus = booking.paymentStatus ?? 'unpaid';
    const payable = totalAmount > 0 || service?.paymentMode === 'paid' || paymentStatus !== 'unpaid';
    if (!payable) continue;
    const bucket = buckets.get(dayKeyUtc(booking.createdAt));
    if (!bucket) continue;
    bucket.paymentAttempts += 1;
    bucket.successfulPayments += paymentStatus === 'paid' || paymentStatus === 'partially_paid' || paymentStatus === 'partial-refund' ? 1 : 0;
    bucket.partialPayments += paymentStatus === 'partially_paid' || paymentStatus === 'partial-refund' ? 1 : 0;
    bucket.failedPayments += (booking.manualPayments ?? []).filter((payment) => payment.status === 'failed').length;
    bucket.refundedPayments += paymentStatus === 'refunded' || paymentStatus === 'partial-refund' ? 1 : 0;
  }

  return Array.from(buckets.entries()).map(([day, bucket]) => ({
    day,
    paymentAttempts: bucket.paymentAttempts,
    successfulPayments: bucket.successfulPayments,
    partialPayments: bucket.partialPayments,
    failedPayments: bucket.failedPayments,
    refundedPayments: bucket.refundedPayments,
  }));
}

function sourceFunnelBucket(source: string, buckets: Map<string, MutableSourceFunnelSummary>, label: string): MutableSourceFunnelSummary {
  const existing = buckets.get(source);
  if (existing) return existing;
  const next: MutableSourceFunnelSummary = { source, label, summary: emptyMutableSummary() };
  buckets.set(source, next);
  return next;
}

export function buildPaymentSourceFunnelBreakdown(
  orders: CommerceOrder[],
  bookings: Booking[],
  services: BookingService[],
): PaymentAnalyticsSourceFunnelSummary[] {
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const buckets = new Map<string, MutableSourceFunnelSummary>();
  const orderBucket = sourceFunnelBucket('orders', buckets, 'Orders');
  const webBucket = sourceFunnelBucket('bookings-web', buckets, 'Web bookings');
  const adminBucket = sourceFunnelBucket('bookings-admin', buckets, 'Admin bookings');

  for (const order of orders) {
    orderBucket.summary.paymentAttempts += 1;
    const failedManualCount = failedManualOrderCount(order);
    const grossCollected = orderGrossCollected(order);
    const refunded = orderRefundedAmount(order, grossCollected);
    const outstanding = orderOutstandingAmount(order);
    const successful = grossCollected > 0 || order.payment.status === 'partially_paid';

    orderBucket.summary.successfulPayments += successful ? 1 : 0;
    orderBucket.summary.partialPayments += order.payment.status === 'partially_paid' || order.payment.status === 'partially_refunded' ? 1 : 0;
    orderBucket.summary.failedPayments += order.payment.status === 'failed' ? Math.max(1, failedManualCount) : failedManualCount;
    orderBucket.summary.refundedPayments += refunded > 0 || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded' ? 1 : 0;
    addMoney(orderBucket.summary, order.currency, { grossCollected, refunded, outstanding });
  }

  for (const booking of bookings) {
    const service = serviceById.get(booking.serviceId);
    const totalAmount = bookingTotalAmount(booking, service);
    const paymentStatus = booking.paymentStatus ?? 'unpaid';
    const payable = totalAmount > 0 || service?.paymentMode === 'paid' || paymentStatus !== 'unpaid';
    if (!payable) continue;
    const bucket = booking.source === 'admin' ? adminBucket : webBucket;
    const grossCollected = bookingGrossCollected(booking, totalAmount);
    const refunded = bookingRefundedAmount(booking, grossCollected);
    const outstanding = bookingOutstandingAmount(booking, totalAmount);
    const failedManualCount = failedManualBookingCount(booking);

    bucket.summary.paymentAttempts += 1;
    bucket.summary.successfulPayments += grossCollected > 0 || paymentStatus === 'partially_paid' ? 1 : 0;
    bucket.summary.partialPayments += paymentStatus === 'partially_paid' || paymentStatus === 'partial-refund' ? 1 : 0;
    bucket.summary.failedPayments += failedManualCount;
    bucket.summary.refundedPayments += refunded > 0 || paymentStatus === 'refunded' || paymentStatus === 'partial-refund' ? 1 : 0;
    addMoney(bucket.summary, bookingCurrency(booking, service), { grossCollected, refunded, outstanding });
  }

  return Array.from(buckets.values())
    .map((item) => ({
      source: item.source,
      label: item.label,
      ...paymentSummary(item.summary),
    }))
    .sort((a, b) => {
      const sourceRank = (value: string): number => {
        if (value === 'orders') return 0;
        if (value === 'bookings-web') return 1;
        if (value === 'bookings-admin') return 2;
        return 3;
      };
      return sourceRank(a.source) - sourceRank(b.source) || a.label.localeCompare(b.label);
    });
}

function webhookProviderBucket(
  provider: string,
  buckets: Map<string, MutableWebhookProviderSummary>,
): MutableWebhookProviderSummary {
  const existing = buckets.get(provider);
  if (existing) return existing;
  const next: MutableWebhookProviderSummary = {
    provider,
    label: providerLabel(provider),
    totalEvents: 0,
    processed: 0,
    unmatched: 0,
    failed: 0,
    ignored: 0,
    replayed: 0,
  };
  buckets.set(provider, next);
  return next;
}

function webhookFeeProviderBucket(
  provider: string,
  buckets: Map<string, MutableWebhookFeeProviderSummary>,
): MutableWebhookFeeProviderSummary {
  const existing = buckets.get(provider);
  if (existing) return existing;
  const next: MutableWebhookFeeProviderSummary = {
    provider,
    label: providerLabel(provider),
    totalEvents: 0,
    processed: 0,
    unmatched: 0,
    failed: 0,
    ignored: 0,
    replayed: 0,
    feeEvents: 0,
    feeReportedCents: 0,
    netReportedCents: 0,
    missingFeeEvents: 0,
  };
  buckets.set(provider, next);
  return next;
}

export function buildPaymentWebhookReconciliation(
  events: CommercePaymentWebhookEvent[],
): PaymentAnalyticsWebhookReconciliationSummary {
  const providerBreakdown = new Map<string, MutableWebhookProviderSummary>();
  const feeProviderBreakdown = new Map<string, MutableWebhookFeeProviderSummary>();
  const errorBreakdown = new Map<string, MutableWebhookErrorSummary>();
  let amountReportedCents = 0;
  let amountMatchedCents = 0;
  let amountUnmatchedCents = 0;
  let amountMismatchCount = 0;
  let currencyMismatchCount = 0;
  let feeReportedCents = 0;
  let feeNetReportedCents = 0;
  let feeEvents = 0;
  let missingFeeEvents = 0;

  for (const event of events) {
    const bucket = webhookProviderBucket(event.provider, providerBreakdown);
    const feeBucket = webhookFeeProviderBucket(event.provider, feeProviderBreakdown);
    bucket.totalEvents += 1;
    feeBucket.totalEvents += 1;
    if (event.status === 'processed') bucket.processed += 1;
    if (event.status === 'processed') feeBucket.processed += 1;
    if (event.status === 'unmatched') bucket.unmatched += 1;
    if (event.status === 'unmatched') feeBucket.unmatched += 1;
    if (event.status === 'failed') bucket.failed += 1;
    if (event.status === 'failed') feeBucket.failed += 1;
    if (event.status === 'ignored') bucket.ignored += 1;
    if (event.status === 'ignored') feeBucket.ignored += 1;
    if (event.replayCount > 0) bucket.replayed += 1;
    if (event.replayCount > 0) feeBucket.replayed += 1;

    if (typeof event.amountCents === 'number') {
      amountReportedCents += event.amountCents;
      if (event.status === 'processed') amountMatchedCents += event.amountCents;
      else amountUnmatchedCents += event.amountCents;
    }

    if (typeof event.feeCents === 'number' || typeof event.netAmountCents === 'number') {
      feeEvents += 1;
      feeBucket.feeEvents += 1;
      if (typeof event.feeCents === 'number') {
        feeReportedCents += event.feeCents;
        feeBucket.feeReportedCents += event.feeCents;
      }
      if (typeof event.netAmountCents === 'number') {
        feeNetReportedCents += event.netAmountCents;
        feeBucket.netReportedCents += event.netAmountCents;
      }
    } else {
      missingFeeEvents += 1;
      feeBucket.missingFeeEvents += 1;
    }

    if (event.error === 'amount_mismatch') amountMismatchCount += 1;
    if (event.error === 'currency_mismatch') currencyMismatchCount += 1;
    if (event.error) {
      const existing = errorBreakdown.get(event.error);
      if (existing) existing.count += 1;
      else errorBreakdown.set(event.error, { error: event.error, label: webhookErrorLabel(event.error), count: 1 });
    }
  }

  return {
    totalEvents: events.length,
    processed: events.filter((event) => event.status === 'processed').length,
    unmatched: events.filter((event) => event.status === 'unmatched').length,
    failed: events.filter((event) => event.status === 'failed').length,
    ignored: events.filter((event) => event.status === 'ignored').length,
    replayed: events.filter((event) => event.replayCount > 0).length,
    amountReportedCents,
    amountMatchedCents,
    amountUnmatchedCents,
    amountMismatchCount,
    currencyMismatchCount,
    providerBreakdown: Array.from(providerBreakdown.values())
      .sort((a, b) => b.totalEvents - a.totalEvents || a.label.localeCompare(b.label)),
    feeProviderBreakdown: Array.from(feeProviderBreakdown.values())
      .sort((a, b) => b.feeEvents - a.feeEvents || a.label.localeCompare(b.label)),
    feeReportedCents,
    feeNetReportedCents,
    feeEvents,
    missingFeeEvents,
    errorBreakdown: Array.from(errorBreakdown.values())
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    recentEvents: events
      .slice()
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
      .slice(0, 5)
      .map((event) => ({
        eventId: event.eventId,
        provider: event.provider,
        label: providerLabel(event.provider),
        providerEventId: event.providerEventId,
        status: event.status,
        paymentReferenceId: event.paymentReferenceId,
        amountCents: event.amountCents,
        currency: event.currency,
        error: event.error,
        replayCount: event.replayCount,
        receivedAt: event.receivedAt,
      })),
  };
}

export function buildPaymentAnalyticsAlerts(summary: PaymentAnalyticsSummary): PaymentAnalyticsAlert[] {
  const alerts: PaymentAnalyticsAlert[] = [];
  const failedRate = summary.totals.failedPaymentRate;
  const refundRate = summary.totals.refundRate;
  const totalOutstanding = summary.totals.currencyTotals.reduce((total, bucket) => total + bucket.outstanding, 0);
  const outstandingBuckets = summary.totals.currencyTotals.filter((bucket) => bucket.outstanding > 0).sort((a, b) => b.outstanding - a.outstanding);
  const latestTrend = summary.trend[summary.trend.length - 1];

  if (summary.totals.paymentAttempts === 0) {
    alerts.push({
      id: 'no-activity',
      label: 'No payment activity yet',
      detail: 'The dashboard will surface failures, refunds, and balances after the first payment attempt arrives.',
      tone: 'info',
    });
    return alerts;
  }

  alerts.push({
    id: 'activity-snapshot',
    label: 'Payment activity snapshot',
    detail: `${summary.totals.paymentAttempts} attempts recorded with ${formatCount(summary.totals.failedPayments, 'failed payment')} and ${formatCount(summary.totals.refundedPayments, 'refunded payment')}${totalOutstanding > 0 ? `; ${outstandingBuckets.length} currency bucket${outstandingBuckets.length === 1 ? '' : 's'} still ${outstandingBuckets.length === 1 ? 'carries' : 'carry'} balances due` : '; no outstanding balances'}.`,
    tone: 'info',
  });

  if (summary.totals.failedPayments >= 2 && failedRate >= 25) {
    alerts.push({
      id: 'failed-rate',
      label: 'High failure rate',
      detail: `${formatCount(summary.totals.failedPayments, 'failed payment')} across ${summary.totals.paymentAttempts} attempts (${failedRate.toFixed(1)}%).`,
      tone: 'danger',
    });
  }

  if (summary.totals.refundedPayments >= 1 && refundRate >= 15) {
    alerts.push({
      id: 'refund-rate',
      label: 'Refund activity needs review',
      detail: `${formatCount(summary.totals.refundedPayments, 'refunded payment')} across ${summary.totals.paymentAttempts} attempts (${refundRate.toFixed(1)}%).`,
      tone: 'warn',
    });
  }

  if (totalOutstanding > 0 && outstandingBuckets.length > 0) {
    alerts.push({
      id: 'outstanding-balances',
      label: 'Outstanding balances remain',
      detail: `${outstandingBuckets.length} currency bucket${outstandingBuckets.length === 1 ? '' : 's'} still ${outstandingBuckets.length === 1 ? 'carries' : 'carry'} balances due.`,
      tone: 'warn',
      amountCents: totalOutstanding,
      currency: outstandingBuckets[0].currency,
    });
  }

  if (latestTrend && latestTrend.paymentAttempts > 0) {
    const exceptionCount = latestTrend.failedPayments + latestTrend.refundedPayments;
    const exceptionRate = roundRate(exceptionCount, latestTrend.paymentAttempts);
    if (exceptionCount >= 2 && exceptionRate >= 40) {
      alerts.push({
        id: 'trend-exceptions',
        label: 'Recent trend needs attention',
        detail: `The latest day logged ${formatCount(latestTrend.failedPayments, 'failed payment')} and ${formatCount(latestTrend.refundedPayments, 'refunded payment')} among ${latestTrend.paymentAttempts} attempts.`,
        tone: 'warn',
      });
    }
  }

  return alerts.slice(0, 4);
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
  const providerBreakdown = new Map<string, MutableProviderSummary>();
  const providerFeeBreakdown = new Map<string, MutableProviderFeeSummary>();
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

    const provider = providerBucket(order.payment.adapter, providerBreakdown);
    const providerFee = providerFeeBucket(order.payment.adapter, providerFeeBreakdown);
    provider.summary.paymentAttempts += 1;
    provider.summary.successfulPayments += successful ? 1 : 0;
    provider.summary.partialPayments += order.payment.status === 'partially_paid' || order.payment.status === 'partially_refunded' ? 1 : 0;
    provider.summary.failedPayments += order.payment.status === 'failed' ? Math.max(1, failedManualCount) : failedManualCount;
    provider.summary.refundedPayments += refunded > 0 || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded' ? 1 : 0;
    addMoney(provider.summary, order.currency, { grossCollected, refunded, outstanding });

    providerFee.summary.paymentAttempts += 1;
    providerFee.summary.successfulPayments += successful ? 1 : 0;
    providerFee.summary.partialPayments += order.payment.status === 'partially_paid' || order.payment.status === 'partially_refunded' ? 1 : 0;
    providerFee.summary.failedPayments += order.payment.status === 'failed' ? Math.max(1, failedManualCount) : failedManualCount;
    providerFee.summary.refundedPayments += refunded > 0 || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded' ? 1 : 0;
    const feeCurrencyBucket = providerFeeCurrencyBucket(providerFee, order.currency);
    feeCurrencyBucket.grossCollected += grossCollected;
    feeCurrencyBucket.estimatedFee += estimatedProviderFee(grossCollected, successful ? 1 : 0, providerFee.feeRateBps, providerFee.fixedFeeCents);
    addMoney(providerFee.summary, order.currency, { grossCollected, refunded, outstanding });
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
    trend: buildPaymentTrendSeries(input.orders, input.bookings, input.services, 7, Date.parse(input.now ?? new Date().toISOString())),
    sourceFunnel: buildPaymentSourceFunnelBreakdown(input.orders, input.bookings, input.services),
    webhookReconciliation: buildPaymentWebhookReconciliation(input.webhookEvents ?? []),
    providerBreakdown: Array.from(providerBreakdown.values())
      .map((item) => ({
        provider: item.provider,
        label: item.label,
        ...paymentSummary(item.summary),
      }))
      .sort((a, b) => b.paymentAttempts - a.paymentAttempts || a.label.localeCompare(b.label)),
    providerFeeBreakdown: Array.from(providerFeeBreakdown.values())
      .map((item) => {
        const summary = paymentSummary(item.summary);
        const { currencyTotals: _summaryCurrencyTotals, ...summaryWithoutCurrencyTotals } = summary;
        const currencyTotals = Array.from(item.currencyTotals.values())
          .map((bucket): PaymentAnalyticsProviderFeeCurrencyTotal => ({
            currency: bucket.currency,
            grossCollected: bucket.grossCollected,
            estimatedFee: bucket.estimatedFee,
            estimatedNetCollected: Math.max(0, bucket.grossCollected - bucket.estimatedFee),
            feeShareRate: roundRate(bucket.estimatedFee, bucket.grossCollected),
          }))
          .sort((a, b) => b.estimatedNetCollected - a.estimatedNetCollected || a.currency.localeCompare(b.currency));
        const estimatedFeeCents = currencyTotals.reduce((total, bucket) => total + bucket.estimatedFee, 0);
        const estimatedNetCollectedCents = currencyTotals.reduce((total, bucket) => total + bucket.estimatedNetCollected, 0);
        return {
          provider: item.provider,
          label: item.label,
          feeRateBps: item.feeRateBps,
          fixedFeeCents: item.fixedFeeCents,
          estimatedFeeCents,
          estimatedNetCollectedCents,
          ...summaryWithoutCurrencyTotals,
          currencyTotals,
        };
      })
      .sort((a, b) => b.estimatedNetCollectedCents - a.estimatedNetCollectedCents || a.label.localeCompare(b.label)),
  };
}

export function buildPaymentAnalyticsReportFilename(): string {
  return 'payment-analytics-report.json';
}

export function buildPaymentAnalyticsTrendCsvFilename(): string {
  return 'payment-analytics-trend.csv';
}

export function serializePaymentAnalyticsReportFile(summary: PaymentAnalyticsSummary): string {
  const report: PaymentAnalyticsReportFile = {
    generatedAt: summary.generatedAt,
    summary,
  };
  return JSON.stringify(report, null, 2);
}

function csvEscape(value: unknown): string {
  const text = value == null ? '' : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function serializePaymentAnalyticsTrendCsv(summary: PaymentAnalyticsSummary): string {
  const header = [
    'day',
    'paymentAttempts',
    'successfulPayments',
    'partialPayments',
    'failedPayments',
    'refundedPayments',
  ];
  const rows = [
    header.join(','),
    ...summary.trend.map((point) => [
      point.day,
      point.paymentAttempts,
      point.successfulPayments,
      point.partialPayments,
      point.failedPayments,
      point.refundedPayments,
    ].map(csvEscape).join(',')),
  ];
  return `${rows.join('\r\n')}\r\n`;
}
