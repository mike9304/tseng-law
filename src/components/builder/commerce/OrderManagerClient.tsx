'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { downloadText } from './download-text';
import type { Locale } from '@/lib/locales';
import type {
  CommerceOrder,
  CommerceOrderDocumentType,
  CommerceOrderFulfillmentStatus,
  CommerceOrderPaymentStatus,
  CommerceOrderStatus,
} from '@/lib/builder/commerce/orders-engine';
import styles from './OrderManager.module.css';

type StatusFilter = CommerceOrderStatus | 'all';
type PaymentFilter = CommerceOrderPaymentStatus | 'all';
type FulfillmentFilter = CommerceOrderFulfillmentStatus | 'all';

interface OrderManagerClientProps {
  locale: Locale;
  siteTitle: string;
  initialOrders: CommerceOrder[];
}

function formatPrice(locale: Locale, currency: CommerceOrder['currency'], cents: number): string {
  return new Intl.NumberFormat(locale === 'ko' ? 'ko-KR' : locale === 'zh-hant' ? 'zh-TW' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'TWD' || currency === 'KRW' ? 0 : 2,
  }).format(cents / 100);
}

function orderCsv(orders: CommerceOrder[]): string {
  const rows = [
    ['confirmationNumber', 'orderId', 'customer', 'email', 'status', 'paymentStatus', 'fulfillmentStatus', 'shippingLabel', 'shippingAmount', 'taxLabel', 'taxRate', 'taxAmount', 'total', 'manualPaid', 'balanceDue', 'manualPaymentCount', 'refunded', 'refundCount', 'documents', 'documentStatus', 'currency', 'createdAt'],
    ...orders.map((order) => [
      order.confirmationNumber,
      order.orderId,
      order.customer.name,
      order.customer.email,
      order.status,
      order.payment.status,
      order.fulfillment.status,
      order.shipping.label,
      order.shipping.amountCents / 100,
      order.tax.label,
      `${(order.tax.rateBps / 100).toFixed(2)}%`,
      order.tax.amountCents / 100,
      order.totals.grandTotalCents / 100,
      manualPaidCents(order) / 100,
      manualBalanceDueCents(order) / 100,
      order.manualPayments.length,
      refundedCents(order) / 100,
      order.refunds.length,
      order.documents.map((document) => `${document.type}:${document.number}`).join(' | '),
      order.documents.map((document) => `${document.number}:${document.status}`).join(' | '),
      order.currency,
      order.createdAt,
    ]),
  ];
  return rows.map((row) => row.map((value) => {
    const text = String(value ?? '');
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }).join(',')).join('\n');
}

function refundedCents(order: CommerceOrder): number {
  return order.refunds
    .filter((refund) => refund.status === 'succeeded')
    .reduce((total, refund) => total + refund.amountCents, 0);
}

function refundableCents(order: CommerceOrder): number {
  if (order.payment.status !== 'paid' && order.payment.status !== 'partially_refunded') return 0;
  return Math.max(0, order.totals.grandTotalCents - refundedCents(order));
}

function manualPaidCents(order: CommerceOrder): number {
  return order.manualPayments
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

function manualBalanceDueCents(order: CommerceOrder): number {
  if (order.payment.status === 'paid' || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded') return 0;
  return Math.max(0, order.totals.grandTotalCents - manualPaidCents(order));
}

function canRecordManualPayment(order: CommerceOrder): boolean {
  return order.payment.adapter === 'manual-invoice'
    && order.payment.status !== 'paid'
    && order.payment.status !== 'partially_refunded'
    && order.payment.status !== 'refunded'
    && manualBalanceDueCents(order) > 0;
}

function canIssueProviderRefund(order: CommerceOrder): boolean {
  return !order.payment.stub && Boolean(order.payment.referenceId?.trim());
}

function isProviderRefundReference(refund: CommerceOrder['refunds'][number]): boolean {
  return Boolean(refund.providerRefundId && !refund.providerRefundId.startsWith('rf_stub_'));
}

function refundFailureNotice(providerRefund: boolean, error?: string): string {
  if (!providerRefund) return error ?? 'Manual refund failed';
  return error
    ? `Provider refund failed. No refund was recorded. ${error}`
    : 'Provider refund failed. No refund was recorded.';
}

function refundSubmitLabel(providerRefund: boolean, busy: boolean): string {
  if (busy) return providerRefund ? 'Processing...' : 'Recording...';
  return providerRefund ? 'Issue provider refund' : 'Record manual refund';
}

function manualPaymentMethodLabel(method: CommerceOrder['manualPayments'][number]['method']): string {
  switch (method) {
    case 'bank_transfer':
      return 'Bank transfer';
    case 'cash':
      return 'Cash';
    case 'check':
      return 'Check';
    default:
      return 'Other';
  }
}

function paymentStatusLabel(status: CommerceOrderPaymentStatus): string {
  switch (status) {
    case 'requires_manual_payment':
      return 'Manual payment';
    case 'partially_paid':
      return 'Partially paid';
    case 'authorized_stub':
      return 'Authorized stub';
    case 'paid':
      return 'Paid';
    case 'failed':
      return 'Failed';
    case 'partially_refunded':
      return 'Partially refunded';
    case 'refunded':
      return 'Refunded';
    default:
      return status;
  }
}

function documentTypeLabel(type: CommerceOrderDocumentType): string {
  return type === 'invoice' ? 'Invoice' : 'Receipt';
}

export default function OrderManagerClient({ locale, siteTitle, initialOrders }: OrderManagerClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [paymentStatus, setPaymentStatus] = useState<PaymentFilter>('all');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<FulfillmentFilter>('all');
  const [notice, setNotice] = useState('Ready');
  const [busyOrderId, setBusyOrderId] = useState('');
  const [manualPaymentDrafts, setManualPaymentDrafts] = useState<Record<string, { amount: string; method: CommerceOrder['manualPayments'][number]['method']; reference: string; note: string }>>({});
  const [manualPaymentOpenOrderId, setManualPaymentOpenOrderId] = useState('');
  const [refundDrafts, setRefundDrafts] = useState<Record<string, { amount: string; reason: string }>>({});
  const [refundOpenOrderId, setRefundOpenOrderId] = useState('');
  const [exportText, setExportText] = useState('');

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return orders
      .filter((order) => status === 'all' || order.status === status)
      .filter((order) => paymentStatus === 'all' || order.payment.status === paymentStatus)
      .filter((order) => fulfillmentStatus === 'all' || order.fulfillment.status === fulfillmentStatus)
      .filter((order) => {
        if (!search) return true;
        return [
          order.orderId,
          order.confirmationNumber,
          order.customer.name,
          order.customer.email,
          order.payment.status,
          order.payment.referenceId ?? '',
          ...order.manualPayments.map((payment) => `${payment.paymentId} ${payment.method} ${payment.reference ?? ''} ${payment.note ?? ''}`),
          ...order.refunds.map((refund) => `${refund.refundId} ${refund.providerRefundId ?? ''} ${refund.reason ?? ''}`),
          ...order.documents.map((document) => `${document.documentId} ${document.number} ${document.type} ${document.status}`),
          order.fulfillment.status,
          ...order.lineItems.map((item) => `${item.title} ${item.sku}`),
        ].some((value) => value.toLowerCase().includes(search));
      })
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }, [fulfillmentStatus, orders, paymentStatus, query, status]);

  const counts = useMemo(() => ({
    total: orders.length,
    confirmed: orders.filter((order) => order.status === 'confirmed').length,
    manual: orders.filter((order) => order.payment.status === 'requires_manual_payment' || order.payment.status === 'partially_paid').length,
    paid: orders.filter((order) => order.payment.status === 'paid' || order.payment.status === 'authorized_stub').length,
    partialRefund: orders.filter((order) => order.payment.status === 'partially_refunded').length,
    refunded: orders.filter((order) => order.payment.status === 'refunded').length,
    documents: orders.reduce((total, order) => total + order.documents.length, 0),
    unfulfilled: orders.filter((order) => order.fulfillment.status === 'unfulfilled').length,
  }), [orders]);

  async function refresh() {
    const response = await fetch(`/api/builder/commerce/orders?locale=${locale}`, { cache: 'no-store' });
    const payload = await response.json() as { ok?: boolean; orders?: CommerceOrder[] };
    if (payload.ok && Array.isArray(payload.orders)) setOrders(payload.orders);
  }

  async function recordManualPayment(order: CommerceOrder) {
    const draft = manualPaymentDrafts[order.orderId] ?? {
      amount: '',
      method: 'bank_transfer',
      reference: '',
      note: '',
    };
    const amountCents = Math.round(Number(draft.amount) * 100);
    const balanceDue = manualBalanceDueCents(order);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setNotice('Enter a valid manual payment amount');
      return;
    }
    if (amountCents > balanceDue) {
      setNotice('Manual payment exceeds balance due');
      return;
    }
    setBusyOrderId(order.orderId);
    setNotice('Recording manual payment...');
    try {
      const response = await fetch(`/api/builder/commerce/orders/${encodeURIComponent(order.orderId)}/manual-payments?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountCents,
          method: draft.method,
          reference: draft.reference,
          note: draft.note,
        }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; order?: CommerceOrder; error?: string };
      if (!response.ok || !payload.ok || !payload.order) {
        setNotice(payload.error ?? 'Manual payment failed');
        return;
      }
      setOrders((current) => current.map((entry) => (entry.orderId === payload.order?.orderId ? payload.order : entry)));
      const nextBalance = manualBalanceDueCents(payload.order);
      setManualPaymentDrafts((current) => ({
        ...current,
        [order.orderId]: {
          amount: nextBalance > 0 ? (nextBalance / 100).toFixed(2) : '',
          method: draft.method,
          reference: '',
          note: '',
        },
      }));
      if (nextBalance <= 0) setManualPaymentOpenOrderId('');
      setNotice(payload.order.payment.status === 'paid' ? 'Manual payment completed balance' : 'Manual payment recorded');
    } finally {
      setBusyOrderId('');
    }
  }

  async function refundOrder(order: CommerceOrder) {
    const draft = refundDrafts[order.orderId] ?? { amount: '', reason: '' };
    const amountCents = Math.round(Number(draft.amount) * 100);
    const remainingCents = refundableCents(order);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      setNotice('Enter a valid refund amount');
      return;
    }
    if (amountCents > remainingCents) {
      setNotice('Refund amount exceeds remaining refundable total');
      return;
    }
    const providerRefund = canIssueProviderRefund(order);
    setBusyOrderId(order.orderId);
    setNotice(providerRefund ? 'Processing provider refund...' : 'Recording manual refund...');
    try {
      const response = await fetch(`/api/builder/commerce/orders/${encodeURIComponent(order.orderId)}/refunds?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents, reason: draft.reason }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; order?: CommerceOrder; error?: string };
      if (!response.ok || !payload.ok || !payload.order) {
        setNotice(refundFailureNotice(providerRefund, payload.error));
        return;
      }
      setOrders((current) => current.map((entry) => (entry.orderId === payload.order?.orderId ? payload.order : entry)));
      setRefundDrafts((current) => ({
        ...current,
        [order.orderId]: { amount: (refundableCents(payload.order!) / 100).toFixed(2), reason: '' },
      }));
      if (refundableCents(payload.order) <= 0) setRefundOpenOrderId('');
      setNotice(providerRefund ? 'Provider refund succeeded' : 'Manual refund recorded');
    } finally {
      setBusyOrderId('');
    }
  }

  async function issueDocument(order: CommerceOrder, type: CommerceOrderDocumentType, email = false) {
    setBusyOrderId(order.orderId);
    setNotice(email ? `Queueing ${documentTypeLabel(type).toLowerCase()} email...` : `Issuing ${documentTypeLabel(type).toLowerCase()}...`);
    try {
      const response = await fetch(`/api/builder/commerce/orders/${encodeURIComponent(order.orderId)}/documents?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, email }),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; order?: CommerceOrder; error?: string };
      if (!response.ok || !payload.ok || !payload.order) {
        setNotice(payload.error ?? 'Document action failed');
        return;
      }
      setOrders((current) => current.map((entry) => (entry.orderId === payload.order?.orderId ? payload.order : entry)));
      setNotice(email ? `${documentTypeLabel(type)} email queued` : `${documentTypeLabel(type)} issued`);
    } finally {
      setBusyOrderId('');
    }
  }

  async function updateOrder(
    orderId: string,
    patch: {
      status?: CommerceOrderStatus;
      paymentStatus?: CommerceOrderPaymentStatus;
      fulfillmentStatus?: CommerceOrderFulfillmentStatus;
    },
  ) {
    setBusyOrderId(orderId);
    setNotice('Updating order...');
    try {
      const response = await fetch(`/api/builder/commerce/orders/${encodeURIComponent(orderId)}?locale=${encodeURIComponent(locale)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const payload = await response.json().catch(() => ({})) as { ok?: boolean; order?: CommerceOrder; error?: string };
      if (!response.ok || !payload.ok || !payload.order) {
        setNotice(payload.error ?? 'Order update failed');
        return;
      }
      setOrders((current) => current.map((order) => (order.orderId === payload.order?.orderId ? payload.order : order)));
      setNotice('Order updated');
    } finally {
      setBusyOrderId('');
    }
  }

  return (
    <main className={styles.page} data-commerce-orders-admin>
      <header className={styles.header}>
        <div>
          <span>{siteTitle}</span>
          <h1>Orders</h1>
          <p>Review orders, payment state, fulfillment state, line items, totals, and audit data.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href={`/${locale}/admin-builder/commerce/products`}>Products</Link>
          <Link href={`/${locale}/admin-builder/commerce/payments`}>Payments</Link>
          <Link href={`/${locale}/admin-builder/commerce/documents`}>Documents</Link>
          <Link href={`/${locale}/admin-builder/commerce/currency`}>Currency</Link>
          <Link href={`/${locale}/admin-builder/commerce/tax`}>Tax rules</Link>
          <Link href={`/${locale}/admin-builder/commerce/shipping`}>Shipping</Link>
          <Link href={`/${locale}/admin-builder/commerce/notifications`}>Notifications</Link>
          <Link href={`/${locale}/admin-builder/commerce/webhooks`}>Webhooks</Link>
          <button type="button" onClick={() => { const csv = orderCsv(filtered); setExportText(csv); downloadText('orders.csv', csv); setNotice('Export ready'); }} data-commerce-order-export="filtered">
            Export CSV
          </button>
          <button type="button" onClick={() => void refresh()} data-commerce-orders-refresh>Refresh</button>
        </div>
      </header>

      <section className={styles.kpis} aria-label="Order stats">
        {Object.entries(counts).map(([key, value]) => (
          <article key={key} data-commerce-orders-kpi={key}>
            <strong>{value}</strong>
            <span>{key}</span>
          </article>
        ))}
      </section>

      <section className={styles.toolbar}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search confirmation, email, SKU"
          data-commerce-orders-search
        />
        <select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} data-commerce-orders-status-filter>
          <option value="all">All order status</option>
          <option value="created">Created</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value as PaymentFilter)} data-commerce-orders-payment-filter>
          <option value="all">All payment</option>
          <option value="requires_manual_payment">Manual payment</option>
          <option value="partially_paid">Partially paid</option>
          <option value="authorized_stub">Authorized stub</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="partially_refunded">Partially refunded</option>
          <option value="refunded">Refunded</option>
        </select>
        <select value={fulfillmentStatus} onChange={(event) => setFulfillmentStatus(event.target.value as FulfillmentFilter)} data-commerce-orders-fulfillment-filter>
          <option value="all">All fulfillment</option>
          <option value="unfulfilled">Unfulfilled</option>
          <option value="processing">Processing</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </section>

      <p role="status" className={styles.notice}>{notice}</p>

      <section className={styles.list} aria-label="Orders list">
        {filtered.length === 0 ? (
          <article className={styles.empty} data-commerce-orders-empty>
            <strong>No orders found</strong>
            <span>Orders created at checkout will appear here.</span>
          </article>
        ) : filtered.map((order) => {
          const remainingRefundable = refundableCents(order);
          const draft = refundDrafts[order.orderId] ?? { amount: remainingRefundable > 0 ? (remainingRefundable / 100).toFixed(2) : '', reason: '' };
          const manualDue = manualBalanceDueCents(order);
          const manualPaymentDraft = manualPaymentDrafts[order.orderId] ?? { amount: manualDue > 0 ? (manualDue / 100).toFixed(2) : '', method: 'bank_transfer' as const, reference: '', note: '' };
          const manualPaymentOpen = manualPaymentOpenOrderId === order.orderId;
          const manualPaymentLocked = order.manualPayments.length > 0 && (order.payment.status === 'partially_paid' || order.payment.status === 'paid');
          const refundOpen = refundOpenOrderId === order.orderId;
          const paymentLockedByRefund = order.payment.status === 'partially_refunded' || order.payment.status === 'refunded';
          const paymentLocked = paymentLockedByRefund || manualPaymentLocked;
          const receiptAllowed = order.payment.status === 'paid' || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded';
          const providerRefund = canIssueProviderRefund(order);
          const manualPaymentAllowed = canRecordManualPayment(order);
          return (
          <article
            key={order.orderId}
            className={styles.order}
            data-commerce-order-row={order.orderId}
            data-commerce-order-status={order.status}
            data-commerce-order-payment-status={order.payment.status}
            data-commerce-order-fulfillment-status={order.fulfillment.status}
          >
            <div className={styles.identity}>
              <strong data-commerce-order-confirmation>{order.confirmationNumber}</strong>
              <span>{order.customer.name} · {order.customer.email}</span>
              <small>{new Date(order.createdAt).toLocaleString()}</small>
            </div>
            <div className={styles.totals}>
              <strong data-commerce-order-total>{formatPrice(locale, order.currency, order.totals.grandTotalCents)}</strong>
              <span>{order.lineItems.length} lines · {order.payment.adapter}</span>
              {order.payment.referenceId ? (
                <span data-commerce-order-payment-reference={order.orderId}>
                  Payment ref {order.payment.referenceId}
                </span>
              ) : null}
              <span data-commerce-order-shipping={order.orderId}>
                Shipping {formatPrice(locale, order.currency, order.shipping.amountCents)} · {order.shipping.label}
                {order.shipping.freeShippingApplied ? ' · free shipping' : ''}
              </span>
              <span data-commerce-order-tax={order.orderId}>
                Tax {formatPrice(locale, order.currency, order.tax.amountCents)} · {order.tax.label} · {(order.tax.rateBps / 100).toFixed(2)}%
              </span>
              <span data-commerce-order-refunded={order.orderId}>
                Refunded {formatPrice(locale, order.currency, refundedCents(order))} · refundable {formatPrice(locale, order.currency, remainingRefundable)}
              </span>
              <span data-commerce-order-manual-balance={order.orderId}>
                Manual paid {formatPrice(locale, order.currency, manualPaidCents(order))} · due {formatPrice(locale, order.currency, manualDue)}
              </span>
            </div>
            <div className={styles.controls}>
              <label>
                <span>Payment</span>
                <select
                  value={order.payment.status}
                  disabled={busyOrderId === order.orderId || paymentLocked}
                  data-commerce-order-payment-select={order.orderId}
                  onChange={(event) => void updateOrder(order.orderId, { paymentStatus: event.target.value as CommerceOrderPaymentStatus })}
                >
                  {paymentLocked ? <option value={order.payment.status}>{paymentStatusLabel(order.payment.status)}</option> : null}
                  <option value="requires_manual_payment">Manual payment</option>
                  <option value="authorized_stub">Authorized stub</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
                {paymentLockedByRefund ? <small>Use the refund panel to preserve refund history.</small> : null}
                {manualPaymentLocked ? <small>Use the manual payments panel to preserve payment history.</small> : null}
              </label>
              <label>
                <span>Fulfillment</span>
                <select
                  value={order.fulfillment.status}
                  disabled={busyOrderId === order.orderId}
                  data-commerce-order-fulfillment-select={order.orderId}
                  onChange={(event) => void updateOrder(order.orderId, { fulfillmentStatus: event.target.value as CommerceOrderFulfillmentStatus })}
                >
                  <option value="unfulfilled">Unfulfilled</option>
                  <option value="processing">Processing</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
              <label>
                <span>Order</span>
                <select
                  value={order.status}
                  disabled={busyOrderId === order.orderId}
                  data-commerce-order-status-select={order.orderId}
                  onChange={(event) => void updateOrder(order.orderId, { status: event.target.value as CommerceOrderStatus })}
                >
                  <option value="created">Created</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>
            </div>
            <div className={styles.lines} data-commerce-order-lines={order.orderId}>
              {order.lineItems.map((item) => (
                <span key={item.itemId}>{item.quantity} × {item.sku} · {item.title}</span>
              ))}
            </div>
            <div className={styles.audit} data-commerce-order-audit={order.orderId}>
              {order.audit.map((event) => <span key={event.eventId}>{event.type}</span>)}
            </div>
            <section className={styles.manualPayments} data-commerce-order-manual-payments={order.orderId}>
              <div className={styles.manualPaymentHead}>
                <strong>Manual payments</strong>
                <button
                  type="button"
                  disabled={!manualPaymentAllowed}
                  onClick={() => {
                    setManualPaymentOpenOrderId((current) => (current === order.orderId ? '' : order.orderId));
                    setManualPaymentDrafts((current) => ({
                      ...current,
                      [order.orderId]: current[order.orderId] ?? {
                        amount: manualDue > 0 ? (manualDue / 100).toFixed(2) : '',
                        method: 'bank_transfer',
                        reference: '',
                        note: '',
                      },
                    }));
                  }}
                  data-commerce-order-manual-payment-toggle={order.orderId}
                >
                  {manualPaymentOpen ? 'Hide payment' : 'Record payment'}
                </button>
              </div>
              <div className={styles.manualPaymentSummary}>
                <span data-commerce-order-manual-paid={order.orderId}>Paid {formatPrice(locale, order.currency, manualPaidCents(order))}</span>
                <span data-commerce-order-manual-due={order.orderId}>Balance due {formatPrice(locale, order.currency, manualDue)}</span>
              </div>
              {order.manualPayments.length > 0 ? (
                <div className={styles.manualPaymentList}>
                  {order.manualPayments.map((payment) => (
                    <article key={payment.paymentId} data-commerce-order-manual-payment-row={payment.paymentId}>
                      <strong>{formatPrice(locale, payment.currency, payment.amountCents)} · {manualPaymentMethodLabel(payment.method)} · {payment.status}</strong>
                      <span>{payment.reference ? `Reference ${payment.reference}` : payment.paymentId}</span>
                      {payment.note ? <span>{payment.note}</span> : null}
                    </article>
                  ))}
                </div>
              ) : (
                <span>No manual payments recorded.</span>
              )}
              {manualPaymentOpen ? (
                <div className={styles.manualPaymentForm} data-commerce-order-manual-payment-form={order.orderId}>
                  <label>
                    <span>Amount</span>
                    <input
                      value={manualPaymentDraft.amount}
                      inputMode="decimal"
                      data-commerce-order-manual-payment-amount={order.orderId}
                      onChange={(event) => setManualPaymentDrafts((current) => ({
                        ...current,
                        [order.orderId]: { ...manualPaymentDraft, amount: event.target.value },
                      }))}
                    />
                  </label>
                  <label>
                    <span>Method</span>
                    <select
                      value={manualPaymentDraft.method}
                      data-commerce-order-manual-payment-method={order.orderId}
                      onChange={(event) => setManualPaymentDrafts((current) => ({
                        ...current,
                        [order.orderId]: { ...manualPaymentDraft, method: event.target.value as CommerceOrder['manualPayments'][number]['method'] },
                      }))}
                    >
                      <option value="bank_transfer">Bank transfer</option>
                      <option value="cash">Cash</option>
                      <option value="check">Check</option>
                      <option value="other">Other</option>
                    </select>
                  </label>
                  <label>
                    <span>Reference</span>
                    <input
                      value={manualPaymentDraft.reference}
                      data-commerce-order-manual-payment-reference={order.orderId}
                      onChange={(event) => setManualPaymentDrafts((current) => ({
                        ...current,
                        [order.orderId]: { ...manualPaymentDraft, reference: event.target.value },
                      }))}
                    />
                  </label>
                  <label>
                    <span>Note</span>
                    <textarea
                      value={manualPaymentDraft.note}
                      rows={2}
                      maxLength={500}
                      data-commerce-order-manual-payment-note={order.orderId}
                      onChange={(event) => setManualPaymentDrafts((current) => ({
                        ...current,
                        [order.orderId]: { ...manualPaymentDraft, note: event.target.value },
                      }))}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={busyOrderId === order.orderId || !manualPaymentAllowed}
                    onClick={() => void recordManualPayment(order)}
                    data-commerce-order-manual-payment-submit={order.orderId}
                  >
                    {busyOrderId === order.orderId ? 'Recording...' : 'Record manual payment'}
                  </button>
                </div>
              ) : null}
            </section>
            <section className={styles.documents} data-commerce-order-documents={order.orderId}>
              <div className={styles.documentHead}>
                <strong>Invoices / receipts</strong>
                <div className={styles.documentActions}>
                  <button
                    type="button"
                    disabled={busyOrderId === order.orderId}
                    onClick={() => void issueDocument(order, 'invoice')}
                    data-commerce-order-document-issue={`${order.orderId}:invoice`}
                  >
                    Issue invoice
                  </button>
                  <button
                    type="button"
                    disabled={busyOrderId === order.orderId}
                    onClick={() => void issueDocument(order, 'invoice', true)}
                    data-commerce-order-document-email={`${order.orderId}:invoice`}
                  >
                    Email invoice
                  </button>
                  <button
                    type="button"
                    disabled={busyOrderId === order.orderId || !receiptAllowed}
                    onClick={() => void issueDocument(order, 'receipt')}
                    data-commerce-order-document-issue={`${order.orderId}:receipt`}
                  >
                    Issue receipt
                  </button>
                  <button
                    type="button"
                    disabled={busyOrderId === order.orderId || !receiptAllowed}
                    onClick={() => void issueDocument(order, 'receipt', true)}
                    data-commerce-order-document-email={`${order.orderId}:receipt`}
                  >
                    Email receipt
                  </button>
                </div>
              </div>
              {order.documents.length > 0 ? (
                <div className={styles.documentList}>
                  {order.documents.map((document) => (
                    <article
                      key={document.documentId}
                      data-commerce-order-document-row={`${order.orderId}:${document.type}`}
                      data-commerce-order-document-status={document.status}
                    >
                      <strong>{documentTypeLabel(document.type)} {document.number}</strong>
                      <span>{document.status} · total {formatPrice(locale, document.currency, document.totalCents)} · due {formatPrice(locale, document.currency, document.balanceDueCents)}</span>
                      <span>Refunded {formatPrice(locale, document.currency, document.refundedCents)} · {document.recipientEmail}</span>
                      <a
                        href={`/api/builder/billing-documents/order/${encodeURIComponent(order.orderId)}/${encodeURIComponent(document.documentId)}/download`}
                        data-commerce-order-document-download={`${order.orderId}:${document.documentId}`}
                      >
                        Download PDF
                      </a>
                    </article>
                  ))}
                </div>
              ) : (
                <span>No invoice or receipt issued.</span>
              )}
            </section>
            <section className={styles.refunds} data-commerce-order-refunds={order.orderId}>
              <div className={styles.refundHead}>
                <strong>Refunds</strong>
                <button
                  type="button"
                  disabled={remainingRefundable <= 0}
                  onClick={() => {
                    setRefundOpenOrderId((current) => (current === order.orderId ? '' : order.orderId));
                    setRefundDrafts((current) => ({
                      ...current,
                      [order.orderId]: current[order.orderId] ?? { amount: (remainingRefundable / 100).toFixed(2), reason: '' },
                    }));
                  }}
                  data-commerce-order-refund-toggle={order.orderId}
                >
                  {refundOpen ? 'Hide refund' : 'Refund'}
                </button>
              </div>
              {order.refunds.length > 0 ? (
                <div className={styles.refundList}>
                  {order.refunds.map((refund) => {
                    const rowProviderRefund = isProviderRefundReference(refund);
                    return (
                      <article key={refund.refundId} data-commerce-order-refund-row={refund.refundId}>
                        <strong>
                          {formatPrice(locale, refund.currency, refund.amountCents)} · {rowProviderRefund ? 'Provider' : 'Manual'} {refund.status}
                        </strong>
                        <span data-commerce-order-refund-provider-status={refund.refundId}>
                          {rowProviderRefund ? 'Provider refund' : 'Manual reference'} {refund.providerRefundId ?? refund.refundId}
                        </span>
                        {refund.reason ? <span>{refund.reason}</span> : null}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <span>No refunds recorded.</span>
              )}
              {refundOpen ? (
                <div
                  className={styles.refundForm}
                  data-commerce-order-refund-form={order.orderId}
                  data-commerce-order-refund-mode={providerRefund ? 'provider' : 'manual'}
                >
                  <label>
                    <span>Amount</span>
                    <input
                      value={draft.amount}
                      inputMode="decimal"
                      data-commerce-order-refund-amount={order.orderId}
                      onChange={(event) => setRefundDrafts((current) => ({
                        ...current,
                        [order.orderId]: { ...draft, amount: event.target.value },
                      }))}
                    />
                  </label>
                  <label>
                    <span>Reason</span>
                    <textarea
                      value={draft.reason}
                      rows={3}
                      maxLength={500}
                      data-commerce-order-refund-reason={order.orderId}
                      onChange={(event) => setRefundDrafts((current) => ({
                        ...current,
                        [order.orderId]: { ...draft, reason: event.target.value },
                      }))}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={busyOrderId === order.orderId || remainingRefundable <= 0}
                    onClick={() => void refundOrder(order)}
                    data-commerce-order-refund-submit={order.orderId}
                  >
                    {refundSubmitLabel(providerRefund, busyOrderId === order.orderId)}
                  </button>
                </div>
              ) : null}
            </section>
          </article>
          );
        })}
      </section>

      <section className={styles.exportPanel}>
        <h2>CSV export</h2>
        <textarea
          value={exportText}
          onChange={(event) => setExportText(event.target.value)}
          rows={5}
          data-commerce-order-export-text
        />
      </section>
    </main>
  );
}
