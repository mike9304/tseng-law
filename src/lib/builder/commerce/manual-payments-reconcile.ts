/**
 * F71 — Manual payments depth: reconciliation helpers.
 *
 * Wraps the existing orders-engine manual-payment primitives to provide:
 *   1. `recordManualPayment(orderId, payment)` — records a manual payment
 *      against an order, defaulting to status `'pending'` so an admin can
 *      reconcile later. Mirrors `recordOrderManualPayment` but enforces the
 *      pending-first reconciliation workflow.
 *   2. `listPendingReconciliations()` — surfaces all manual payments that
 *      still need reconciliation across all orders.
 *   3. `applyReconciliation(orderId, paymentId, status)` — updates an existing
 *      manual payment's status (pending -> succeeded/failed/canceled) and
 *      recomputes the parent order's payment status from the new totals.
 *
 * Over-pay / partial-pay / full-pay scenarios are all derived from the
 * order's `successfulManualPaymentTotal` against `grandTotalCents`. A
 * reconciliation that would push the paid total over `grandTotalCents` is
 * rejected with `manual_payment_exceeds_balance`.
 */
import { randomUUID } from 'node:crypto';
import {
  listOrders,
  loadOrder,
  manualPaymentBalanceDue,
  recordOrderManualPayment,
  saveOrder,
  successfulManualPaymentTotal,
  type CommerceOrder,
  type CommerceOrderAuditEvent,
  type CommerceOrderManualPayment,
  type CommerceOrderManualPaymentMethod,
  type CommerceOrderManualPaymentStatus,
  type CommerceOrderPaymentStatus,
} from './orders-engine';

export type ManualReconciliationStatus = Extract<
  CommerceOrderManualPaymentStatus,
  'succeeded' | 'failed' | 'canceled'
>;

export interface ManualPaymentInput {
  amountCents: number;
  method?: CommerceOrderManualPaymentMethod;
  /**
   * Initial status. Defaults to `'pending'` to drive a reconcile-later flow.
   * Pass `'succeeded'` for immediate cash-in-hand payments.
   */
  status?: CommerceOrderManualPaymentStatus;
  reference?: string;
  note?: string;
  idempotencyKey?: string;
  actor?: 'admin' | 'system';
}

export interface ManualPaymentRecordResult {
  order: CommerceOrder | null;
  payment: CommerceOrderManualPayment | null;
  error?: string;
}

export interface PendingReconciliationRow {
  orderId: string;
  confirmationNumber: string;
  paymentId: string;
  amountCents: number;
  currency: string;
  method: CommerceOrderManualPaymentMethod;
  reference?: string;
  note?: string;
  createdAt: string;
  balanceDueCents: number;
  grandTotalCents: number;
  paidCents: number;
  customerName: string;
  customerEmail: string;
}

export interface ReconciliationResult {
  order: CommerceOrder | null;
  payment: CommerceOrderManualPayment | null;
  /** True when the order's overall payment status changed (e.g., to 'paid'). */
  paymentStatusChanged: boolean;
  /** Resulting order payment status. */
  paymentStatus?: CommerceOrderPaymentStatus;
  error?: string;
}

/**
 * Record a manual payment against an order. Defaults to status='pending' so
 * the admin can reconcile when the funds clear. Idempotent on
 * `idempotencyKey`.
 */
export async function recordManualPayment(
  orderId: string,
  input: ManualPaymentInput,
): Promise<ManualPaymentRecordResult> {
  const status: CommerceOrderManualPaymentStatus = input.status ?? 'pending';
  const result = await recordOrderManualPayment(orderId, {
    ...input,
    status,
  });
  return {
    order: result.order,
    payment: result.manualPayment,
    error: result.error,
  };
}

/**
 * Surface every pending manual payment across all orders. Used by the
 * "needs reconciliation" admin panel and analytics.
 */
export async function listPendingReconciliations(): Promise<PendingReconciliationRow[]> {
  const orders = await listOrders();
  const rows: PendingReconciliationRow[] = [];
  for (const order of orders) {
    const balanceDue = manualPaymentBalanceDue(order);
    const paidCents = successfulManualPaymentTotal(order);
    for (const payment of order.manualPayments) {
      if (payment.status !== 'pending') continue;
      rows.push({
        orderId: order.orderId,
        confirmationNumber: order.confirmationNumber,
        paymentId: payment.paymentId,
        amountCents: payment.amountCents,
        currency: payment.currency,
        method: payment.method,
        reference: payment.reference,
        note: payment.note,
        createdAt: payment.createdAt,
        balanceDueCents: balanceDue,
        grandTotalCents: order.totals.grandTotalCents,
        paidCents,
        customerName: order.customer.name,
        customerEmail: order.customer.email,
      });
    }
  }
  return rows.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
}

/**
 * Update an existing manual payment's status (pending -> succeeded/failed/
 * canceled) and recompute the order's payment status.
 *
 * Returns `manual_payment_exceeds_balance` when reconciling to `succeeded`
 * would push the paid total over the order's grand total. Returns
 * `manual_payment_already_settled` when the payment is no longer pending.
 */
export async function applyReconciliation(
  orderId: string,
  paymentId: string,
  status: ManualReconciliationStatus,
  options: { note?: string; actor?: 'admin' | 'system' } = {},
): Promise<ReconciliationResult> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, payment: null, paymentStatusChanged: false, error: 'order_not_found' };

  const payment = order.manualPayments.find((entry) => entry.paymentId === paymentId);
  if (!payment) {
    return { order, payment: null, paymentStatusChanged: false, error: 'manual_payment_not_found' };
  }
  if (payment.status !== 'pending') {
    return { order, payment, paymentStatusChanged: false, error: 'manual_payment_already_settled' };
  }

  // Compute the would-be paid total after this reconciliation lands.
  const currentSucceeded = successfulManualPaymentTotal(order);
  const succeededDelta = status === 'succeeded' ? payment.amountCents : 0;
  const nextPaidCents = currentSucceeded + succeededDelta;

  if (status === 'succeeded' && nextPaidCents > order.totals.grandTotalCents) {
    return {
      order,
      payment,
      paymentStatusChanged: false,
      error: 'manual_payment_exceeds_balance',
    };
  }

  const now = new Date().toISOString();
  const nextPayment: CommerceOrderManualPayment = {
    ...payment,
    status,
    note: options.note?.trim() || payment.note,
  };

  const nextPaymentStatus = computeNextPaymentStatus(order, nextPaidCents);
  const paymentStatusChanged = nextPaymentStatus !== order.payment.status;
  const balanceDueCents = Math.max(0, order.totals.grandTotalCents - nextPaidCents);

  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: 'payment.manual.reconciled',
    actor: options.actor ?? 'admin',
    message: `Manual payment reconciled as ${status}.`,
    createdAt: now,
    data: {
      paymentId: payment.paymentId,
      amountCents: payment.amountCents,
      previousStatus: payment.status,
      newStatus: status,
      paidCents: nextPaidCents,
      balanceDueCents,
      paymentStatus: nextPaymentStatus,
      note: options.note,
    },
  };

  const updated = await saveOrder({
    ...order,
    manualPayments: order.manualPayments.map((entry) => (
      entry.paymentId === paymentId ? nextPayment : entry
    )),
    payment: {
      ...order.payment,
      status: nextPaymentStatus,
    },
    updatedAt: now,
    audit: [...order.audit, audit],
  });

  const savedPayment = updated.manualPayments.find((entry) => entry.paymentId === paymentId) ?? nextPayment;
  return {
    order: updated,
    payment: savedPayment,
    paymentStatusChanged,
    paymentStatus: nextPaymentStatus,
  };
}

function computeNextPaymentStatus(order: CommerceOrder, nextPaidCents: number): CommerceOrderPaymentStatus {
  // Preserve terminal/refund states.
  if (order.payment.status === 'refunded' || order.payment.status === 'partially_refunded') {
    return order.payment.status;
  }
  if (nextPaidCents <= 0) return order.payment.status;
  if (nextPaidCents >= order.totals.grandTotalCents) return 'paid';
  return 'partially_paid';
}

/**
 * Summary helper used by analytics tiles — counts how many pending
 * manual-payment rows exist plus their gross outstanding cents.
 */
export function summarizePendingReconciliations(
  rows: PendingReconciliationRow[],
): { count: number; outstandingCents: number; byCurrency: Record<string, number> } {
  const byCurrency: Record<string, number> = {};
  let outstandingCents = 0;
  for (const row of rows) {
    outstandingCents += row.amountCents;
    byCurrency[row.currency] = (byCurrency[row.currency] ?? 0) + row.amountCents;
  }
  return { count: rows.length, outstandingCents, byCurrency };
}