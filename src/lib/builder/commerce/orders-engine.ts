import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import {
  commitBillingDocumentNumber,
  reserveBillingDocumentNumber,
  voidBillingDocumentNumber,
} from '@/lib/builder/billing-document-numbering';
import { appendPaymentLinkHistory } from '@/lib/builder/billing-payment-link-history';
import {
  COMMERCE_ORDER_VERSION,
  normalizeCommerceOrder,
  type CommerceOrder,
  type CommerceOrderAuditEvent,
  type CommerceOrderCreateInput,
  type CommerceOrderDocument,
  type CommerceOrderDocumentType,
  type CommerceOrderFulfillmentStatus,
  type CommerceOrderManualPayment,
  type CommerceOrderManualPaymentMethod,
  type CommerceOrderManualPaymentStatus,
  type CommerceOrderPaymentStatus,
  type CommerceOrderRefund,
  type CommerceOrderStatus,
} from './orders-shared';

export type {
  CommerceOrder,
  CommerceOrderAuditEvent,
  CommerceOrderCreateInput,
  CommerceOrderDocument,
  CommerceOrderDocumentStatus,
  CommerceOrderDocumentType,
  CommerceOrderFulfillment,
  CommerceOrderFulfillmentStatus,
  CommerceOrderManualPayment,
  CommerceOrderManualPaymentMethod,
  CommerceOrderManualPaymentStatus,
  CommerceOrderPayment,
  CommerceOrderPaymentStatus,
  CommerceOrderRefund,
  CommerceOrderStatus,
} from './orders-shared';

type CommerceBackend = 'blob' | 'file';
type StoredCommerceOrder = CommerceOrder & { deleted?: boolean };

const ORDERS_PREFIX = 'builder-commerce/orders/';
const DEFAULT_COMMERCE_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-commerce');

function getBackend(): CommerceBackend {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (process.env.BUILDER_COMMERCE_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') return 'file';
  return 'blob';
}

function commerceRoot(): string {
  return process.env.BUILDER_COMMERCE_ROOT?.trim() || DEFAULT_COMMERCE_ROOT;
}

function orderBlobPath(orderId: string): string {
  return `${ORDERS_PREFIX}${orderId}.json`;
}

function orderFilePath(orderId: string): string {
  return path.join(commerceRoot(), 'orders', `${orderId}.json`);
}

async function writeJson(blobPath: string, filePath: string, data: unknown): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (getBackend() === 'blob') {
    await put(blobPath, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, body, 'utf8');
}

async function readJson<T>(blobPath: string, filePath: string): Promise<T | null> {
  try {
    if (getBackend() === 'blob') {
      const result = await get(blobPath, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as T;
      }
      return null;
    }

    return JSON.parse(await fs.readFile(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

async function listOrderJson(): Promise<StoredCommerceOrder[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: ORDERS_PREFIX });
    const values: StoredCommerceOrder[] = [];
    for (const blob of result.blobs) {
      const orderId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredCommerceOrder>(blob.pathname, orderFilePath(orderId));
      if (parsed && !parsed.deleted) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(commerceRoot(), 'orders');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredCommerceOrder[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const orderId = path.basename(file, '.json');
    const parsed = await readJson<StoredCommerceOrder>(orderBlobPath(orderId), orderFilePath(orderId));
    if (parsed && !parsed.deleted) values.push(parsed);
  }
  return values;
}

function makeAuditEvent(type: string, message: string, now: string, data?: Record<string, unknown>): CommerceOrderAuditEvent {
  return {
    eventId: `evt_${randomUUID()}`,
    type,
    actor: 'system',
    message,
    createdAt: now,
    data,
  };
}

export async function saveOrder(order: CommerceOrder): Promise<CommerceOrder> {
  const normalized = normalizeCommerceOrder(order);
  if (!normalized) throw new Error('commerce_order_invalid');
  await writeJson(orderBlobPath(normalized.orderId), orderFilePath(normalized.orderId), normalized);
  return normalized;
}

export async function createOrder(input: CommerceOrderCreateInput): Promise<CommerceOrder> {
  const order: CommerceOrder = {
    version: COMMERCE_ORDER_VERSION,
    orderId: `order_${randomUUID()}`,
    confirmationNumber: input.confirmationNumber,
    locale: input.locale,
    currency: input.currency,
    status: 'confirmed',
    customer: input.customer,
    shippingAddress: input.shippingAddress,
    lineItems: input.lineItems,
    couponCode: input.couponCode,
    shipping: input.shipping,
    tax: input.tax,
    totals: input.totals,
    payment: input.payment,
    manualPayments: [],
    refunds: [],
    documents: [],
    fulfillment: {
      status: 'unfulfilled',
      method: input.shipping.method,
      updatedAt: input.now,
    },
    source: 'checkout',
    createdAt: input.now,
    updatedAt: input.now,
    audit: [
      makeAuditEvent('order.created', 'Order created from checkout.', input.now, {
        itemCount: input.totals.itemCount,
        paymentStatus: input.payment.status,
      }),
    ],
  };
  const saved = await saveOrder(order);
  // F109 — fire app extension hooks listening on commerce.order-created.
  void import('@/lib/builder/apps/hooks-registry').then(({ dispatchAppHook }) => (
    dispatchAppHook({
      kind: 'commerce.order-created',
      payload: {
        orderId: saved.orderId,
        totalCents: saved.totals.grandTotalCents,
        currency: saved.currency,
      },
    })
  )).catch(() => undefined);
  return saved;
}

export async function loadOrder(orderId: string): Promise<CommerceOrder | null> {
  const parsed = await readJson<StoredCommerceOrder>(orderBlobPath(orderId), orderFilePath(orderId));
  if (!parsed || parsed.deleted) return null;
  return normalizeCommerceOrder(parsed);
}

export async function listOrders(options: { locale?: Locale; q?: string } = {}): Promise<CommerceOrder[]> {
  const orders = (await listOrderJson())
    .map((order) => normalizeCommerceOrder(order))
    .filter((order): order is CommerceOrder => Boolean(order));
  const q = options.q?.trim().toLowerCase();
  return orders
    .filter((order) => !options.locale || order.locale === options.locale)
    .filter((order) => {
      if (!q) return true;
      return [
        order.orderId,
        order.confirmationNumber,
        order.customer.name,
        order.customer.email,
        ...order.lineItems.map((item) => item.sku),
      ].some((value) => value.toLowerCase().includes(q));
    })
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function successfulRefundTotal(order: CommerceOrder): number {
  return order.refunds
    .filter((refund) => refund.status === 'succeeded')
    .reduce((total, refund) => total + refund.amountCents, 0);
}

export function successfulManualPaymentTotal(order: CommerceOrder): number {
  return order.manualPayments
    .filter((payment) => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amountCents, 0);
}

export function manualPaymentBalanceDue(order: CommerceOrder): number {
  return Math.max(0, order.totals.grandTotalCents - successfulManualPaymentTotal(order));
}

export function refundableAmount(order: CommerceOrder): number {
  if (order.payment.status !== 'paid' && order.payment.status !== 'partially_refunded') return 0;
  return Math.max(0, order.totals.grandTotalCents - successfulRefundTotal(order));
}

function stripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? '';
}

function shouldUseStripeRefund(order: CommerceOrder): boolean {
  return !order.payment.stub && Boolean(order.payment.referenceId?.trim());
}

async function createStripeRefund(order: CommerceOrder, amountCents: number): Promise<{ ok: true; providerRefundId: string } | { ok: false; error: string }> {
  const secret = stripeSecretKey();
  if (!secret) return { ok: false, error: 'refund_provider_not_configured' };
  if (!order.payment.referenceId?.trim()) return { ok: false, error: 'payment_reference_missing' };

  const body = new URLSearchParams();
  body.set('payment_intent', order.payment.referenceId.trim());
  body.set('amount', String(amountCents));
  body.set('metadata[orderId]', order.orderId);
  body.set('metadata[confirmationNumber]', order.confirmationNumber);

  try {
    const response = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      error?: { message?: string };
    };
    if (!response.ok || !payload.id) {
      return { ok: false, error: payload.error?.message || `refund_provider_${response.status || 'failed'}` };
    }
    return { ok: true, providerRefundId: payload.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function orderBalanceDue(order: CommerceOrder): number {
  if (order.payment.status === 'requires_manual_payment' || order.payment.status === 'partially_paid' || order.payment.status === 'failed') {
    return manualPaymentBalanceDue(order);
  }
  if (order.payment.status === 'authorized_stub') {
    return order.totals.grandTotalCents;
  }
  return 0;
}

function makeDocumentFromOrder(
  order: CommerceOrder,
  input: {
    type: CommerceOrderDocumentType;
    actor?: 'admin' | 'system';
    notes?: string;
    number: string;
    numberReservationId?: string;
    now: string;
  },
): CommerceOrderDocument {
  return {
    documentId: `doc_${randomUUID()}`,
    type: input.type,
    number: input.number,
    numberReservationId: input.numberReservationId,
    status: 'issued',
    currency: order.currency,
    subtotalCents: order.totals.subtotalCents,
    discountCents: order.totals.discountCents,
    shippingCents: order.shipping.amountCents,
    taxCents: order.tax.amountCents,
    totalCents: order.totals.grandTotalCents,
    refundedCents: successfulRefundTotal(order),
    balanceDueCents: orderBalanceDue(order),
    recipientEmail: order.customer.email,
    recipientName: order.customer.name,
    actor: input.actor ?? 'admin',
    issuedAt: input.now,
    notes: input.notes?.trim() || undefined,
  };
}

function documentIsCurrent(document: CommerceOrderDocument): boolean {
  return document.status === 'issued' || document.status === 'emailed_stub';
}

function updateCurrentInvoiceBalances(
  documents: CommerceOrderDocument[],
  balanceDueCents: number,
  now: string,
  input: { revokedByPaymentId?: string } = {},
): CommerceOrderDocument[] {
  return documents.map((document) => {
    if (document.type !== 'invoice' || !documentIsCurrent(document)) return document;
    const shouldRevokePaymentLink = Boolean(document.paymentLinkCreatedAt)
      && !document.paymentLinkRevokedAt
      && document.balanceDueCents !== balanceDueCents;
    const nextDocument = {
      ...document,
      balanceDueCents,
      paymentLinkRevokedAt: shouldRevokePaymentLink ? now : document.paymentLinkRevokedAt,
      paymentLinkRevokedReason: shouldRevokePaymentLink ? 'balance_changed' : document.paymentLinkRevokedReason,
      paymentLinkRevokedBalanceDue: shouldRevokePaymentLink ? balanceDueCents : document.paymentLinkRevokedBalanceDue,
      paymentLinkRevokedByPaymentId: shouldRevokePaymentLink ? input.revokedByPaymentId : document.paymentLinkRevokedByPaymentId,
    };
    if (!shouldRevokePaymentLink) return nextDocument;
    return appendPaymentLinkHistory(nextDocument, {
      type: 'revoked',
      actor: 'system',
      createdAt: now,
      paymentLinkId: document.paymentLinkId,
      reason: 'balance_changed',
      balanceDue: balanceDueCents,
      paymentId: input.revokedByPaymentId,
    });
  });
}

function documentSnapshotMatches(document: CommerceOrderDocument, order: CommerceOrder, type: CommerceOrderDocumentType): boolean {
  return document.type === type
    && documentIsCurrent(document)
    && document.totalCents === order.totals.grandTotalCents
    && document.refundedCents === successfulRefundTotal(order)
    && document.balanceDueCents === orderBalanceDue(order);
}

export async function issueOrderDocument(
  orderId: string,
  input: {
    type: CommerceOrderDocumentType;
    actor?: 'admin' | 'system';
    notes?: string;
  },
): Promise<{ order: CommerceOrder | null; document: CommerceOrderDocument | null; created: boolean; error?: string }> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, document: null, created: false, error: 'order_not_found' };
  if (input.type !== 'invoice' && input.type !== 'receipt') {
    return { order, document: null, created: false, error: 'document_type_invalid' };
  }
  if (input.type === 'receipt' && order.payment.status !== 'paid' && order.payment.status !== 'partially_refunded' && order.payment.status !== 'refunded') {
    return { order, document: null, created: false, error: 'receipt_requires_paid_order' };
  }

  const existing = [...order.documents].reverse().find((document) => documentSnapshotMatches(document, order, input.type));
  if (existing) return { order, document: existing, created: false };

  const now = new Date().toISOString();
  const numberReservation = await reserveBillingDocumentNumber(input.type, now);
  const document = makeDocumentFromOrder(order, {
    ...input,
    number: numberReservation.number,
    numberReservationId: numberReservation.reservationId,
    now,
  });
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: `order.${input.type}.issued`,
    actor: input.actor ?? 'admin',
    message: `${input.type === 'invoice' ? 'Invoice' : 'Receipt'} issued.`,
    createdAt: now,
    data: {
      documentId: document.documentId,
      documentNumber: document.number,
      totalCents: document.totalCents,
      refundedCents: document.refundedCents,
      balanceDueCents: document.balanceDueCents,
    },
  };
  let updated: CommerceOrder;
  try {
    updated = await saveOrder({
      ...order,
      documents: [...order.documents, document],
      updatedAt: now,
      audit: [...order.audit, audit],
    });
  } catch (error) {
    await voidBillingDocumentNumber(numberReservation.reservationId, 'order_document_save_failed').catch(() => null);
    throw error;
  }
  await commitBillingDocumentNumber(numberReservation.reservationId, {
    ownerSource: 'order',
    ownerId: order.orderId,
    documentId: document.documentId,
  });
  const savedDocument = updated.documents.find((entry) => entry.documentId === document.documentId) ?? document;
  return { order: updated, document: savedDocument, created: true };
}

export async function markOrderDocumentEmailed(
  orderId: string,
  documentId: string,
  input: {
    notificationEventId?: string;
    actor?: 'admin' | 'system';
  } = {},
): Promise<{ order: CommerceOrder | null; document: CommerceOrderDocument | null; error?: string }> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, document: null, error: 'order_not_found' };
  const document = order.documents.find((entry) => entry.documentId === documentId);
  if (!document) return { order, document: null, error: 'document_not_found' };
  if (!documentIsCurrent(document)) return { order, document, error: 'document_not_current' };

  const now = new Date().toISOString();
  const nextDocument: CommerceOrderDocument = {
    ...document,
    status: 'emailed_stub',
    emailedAt: now,
    notificationEventId: input.notificationEventId ?? document.notificationEventId,
  };
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: `order.${document.type}.emailed`,
    actor: input.actor ?? 'admin',
    message: `${document.type === 'invoice' ? 'Invoice' : 'Receipt'} email queued.`,
    createdAt: now,
    data: {
      documentId: document.documentId,
      documentNumber: document.number,
      notificationEventId: nextDocument.notificationEventId,
      recipientEmail: document.recipientEmail,
    },
  };
  const updated = await saveOrder({
    ...order,
    documents: order.documents.map((entry) => (entry.documentId === documentId ? nextDocument : entry)),
    updatedAt: now,
    audit: [...order.audit, audit],
  });
  const savedDocument = updated.documents.find((entry) => entry.documentId === documentId) ?? nextDocument;
  return { order: updated, document: savedDocument };
}

export async function voidOrderDocument(
  orderId: string,
  documentId: string,
  input: {
    reason?: string;
    actor?: 'admin' | 'system';
  } = {},
): Promise<{ order: CommerceOrder | null; document: CommerceOrderDocument | null; error?: string }> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, document: null, error: 'order_not_found' };
  const document = order.documents.find((entry) => entry.documentId === documentId);
  if (!document) return { order, document: null, error: 'document_not_found' };
  if (!documentIsCurrent(document)) return { order, document, error: 'document_not_current' };

  const now = new Date().toISOString();
  const reason = input.reason?.trim() || 'Voided by admin';
  const shouldRevokePaymentLink = Boolean(document.paymentLinkCreatedAt) && !document.paymentLinkRevokedAt;
  const revokedDocument: CommerceOrderDocument = {
    ...document,
    status: 'voided',
    voidedAt: now,
    voidReason: reason,
    shareLinkRevokedAt: document.shareLinkCreatedAt ? now : document.shareLinkRevokedAt,
    paymentLinkRevokedAt: shouldRevokePaymentLink ? now : document.paymentLinkRevokedAt,
    paymentLinkRevokedReason: shouldRevokePaymentLink ? 'document_voided' : document.paymentLinkRevokedReason,
    paymentLinkRevokedBalanceDue: shouldRevokePaymentLink ? document.balanceDueCents : document.paymentLinkRevokedBalanceDue,
    paymentLinkRevokedByPaymentId: shouldRevokePaymentLink ? undefined : document.paymentLinkRevokedByPaymentId,
  };
  const nextDocument = shouldRevokePaymentLink
    ? appendPaymentLinkHistory(revokedDocument, {
      type: 'revoked',
      actor: input.actor ?? 'admin',
      createdAt: now,
      paymentLinkId: document.paymentLinkId,
      reason: 'document_voided',
      balanceDue: document.balanceDueCents,
    })
    : revokedDocument;
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: `order.${document.type}.voided`,
    actor: input.actor ?? 'admin',
    message: `${document.type === 'invoice' ? 'Invoice' : 'Receipt'} voided.`,
    createdAt: now,
    data: { documentId, documentNumber: document.number, reason },
  };
  const updated = await saveOrder({
    ...order,
    documents: order.documents.map((entry) => (entry.documentId === documentId ? nextDocument : entry)),
    updatedAt: now,
    audit: [...order.audit, audit],
  });
  const savedDocument = updated.documents.find((entry) => entry.documentId === documentId) ?? nextDocument;
  return { order: updated, document: savedDocument };
}

export async function supersedeOrderDocument(
  orderId: string,
  documentId: string,
  input: {
    reason?: string;
    notes?: string;
    actor?: 'admin' | 'system';
  } = {},
): Promise<{
  order: CommerceOrder | null;
  document: CommerceOrderDocument | null;
  supersededDocument: CommerceOrderDocument | null;
  error?: string;
}> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, document: null, supersededDocument: null, error: 'order_not_found' };
  const document = order.documents.find((entry) => entry.documentId === documentId);
  if (!document) return { order, document: null, supersededDocument: null, error: 'document_not_found' };
  if (!documentIsCurrent(document)) return { order, document, supersededDocument: document, error: 'document_not_current' };

  const now = new Date().toISOString();
  const reason = input.reason?.trim() || 'Superseded by admin';
  const numberReservation = await reserveBillingDocumentNumber(document.type, now);
  const replacement = {
    ...makeDocumentFromOrder(order, {
      actor: input.actor ?? 'admin',
      notes: input.notes?.trim() || `Supersedes ${document.number}`,
      number: numberReservation.number,
      numberReservationId: numberReservation.reservationId,
      now,
      type: document.type,
    }),
    supersedesDocumentId: document.documentId,
  };
  const shouldRevokePaymentLink = Boolean(document.paymentLinkCreatedAt) && !document.paymentLinkRevokedAt;
  const revokedSupersededDocument: CommerceOrderDocument = {
    ...document,
    status: 'superseded',
    voidReason: reason,
    supersededByDocumentId: replacement.documentId,
    shareLinkRevokedAt: document.shareLinkCreatedAt ? now : document.shareLinkRevokedAt,
    paymentLinkRevokedAt: shouldRevokePaymentLink ? now : document.paymentLinkRevokedAt,
    paymentLinkRevokedReason: shouldRevokePaymentLink ? 'document_superseded' : document.paymentLinkRevokedReason,
    paymentLinkRevokedBalanceDue: shouldRevokePaymentLink ? document.balanceDueCents : document.paymentLinkRevokedBalanceDue,
    paymentLinkRevokedByPaymentId: shouldRevokePaymentLink ? undefined : document.paymentLinkRevokedByPaymentId,
  };
  const supersededDocument = shouldRevokePaymentLink
    ? appendPaymentLinkHistory(revokedSupersededDocument, {
      type: 'revoked',
      actor: input.actor ?? 'admin',
      createdAt: now,
      paymentLinkId: document.paymentLinkId,
      reason: 'document_superseded',
      balanceDue: document.balanceDueCents,
    })
    : revokedSupersededDocument;
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: `order.${document.type}.superseded`,
    actor: input.actor ?? 'admin',
    message: `${document.type === 'invoice' ? 'Invoice' : 'Receipt'} superseded.`,
    createdAt: now,
    data: {
      documentId,
      documentNumber: document.number,
      replacementDocumentId: replacement.documentId,
      replacementDocumentNumber: replacement.number,
      reason,
    },
  };
  let updated: CommerceOrder;
  try {
    updated = await saveOrder({
      ...order,
      documents: [
        ...order.documents.map((entry) => (entry.documentId === documentId ? supersededDocument : entry)),
        replacement,
      ],
      updatedAt: now,
      audit: [...order.audit, audit],
    });
  } catch (error) {
    await voidBillingDocumentNumber(numberReservation.reservationId, 'order_supersede_save_failed').catch(() => null);
    throw error;
  }
  await commitBillingDocumentNumber(numberReservation.reservationId, {
    ownerSource: 'order',
    ownerId: order.orderId,
    documentId: replacement.documentId,
  });
  const savedReplacement = updated.documents.find((entry) => entry.documentId === replacement.documentId) ?? replacement;
  const savedSuperseded = updated.documents.find((entry) => entry.documentId === documentId) ?? supersededDocument;
  return { order: updated, document: savedReplacement, supersededDocument: savedSuperseded };
}

export async function refundOrderPayment(
  orderId: string,
  input: {
    amountCents: number;
    reason?: string;
    actor?: 'admin' | 'system';
    providerRefundId?: string;
  },
): Promise<{ order: CommerceOrder | null; refund: CommerceOrderRefund | null; error?: string }> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, refund: null, error: 'order_not_found' };

  const amountCents = Math.floor(Number(input.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { order, refund: null, error: 'refund_amount_invalid' };
  }
  const remainingCents = refundableAmount(order);
  if (remainingCents <= 0) return { order, refund: null, error: 'order_not_refundable' };
  if (amountCents > remainingCents) return { order, refund: null, error: 'refund_amount_exceeds_remaining' };

  const providerRefund = shouldUseStripeRefund(order)
    ? await createStripeRefund(order, amountCents)
    : null;
  if (providerRefund && !providerRefund.ok) {
    return { order, refund: null, error: providerRefund.error };
  }

  const now = new Date().toISOString();
  const refund: CommerceOrderRefund = {
    refundId: `rf_${randomUUID()}`,
    providerRefundId: providerRefund?.providerRefundId ?? input.providerRefundId?.trim() ?? `rf_stub_${randomUUID().slice(0, 12)}`,
    amountCents,
    currency: order.currency,
    reason: input.reason?.trim() || undefined,
    status: 'succeeded',
    actor: input.actor ?? 'admin',
    createdAt: now,
  };
  const nextRefundedCents = successfulRefundTotal(order) + refund.amountCents;
  const nextPaymentStatus: CommerceOrderPaymentStatus =
    nextRefundedCents >= order.totals.grandTotalCents ? 'refunded' : 'partially_refunded';
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: 'payment.refund.created',
    actor: input.actor ?? 'admin',
    message: 'Payment refund recorded.',
    createdAt: now,
    data: {
      refundId: refund.refundId,
      providerRefundId: refund.providerRefundId,
      amountCents: refund.amountCents,
      currency: refund.currency,
      paymentStatus: nextPaymentStatus,
      refundedCents: nextRefundedCents,
      remainingRefundableCents: Math.max(0, order.totals.grandTotalCents - nextRefundedCents),
      reason: refund.reason,
    },
  };

  const updated = await saveOrder({
    ...order,
    payment: {
      ...order.payment,
      status: nextPaymentStatus,
    },
    refunds: [...order.refunds, refund],
    updatedAt: now,
    audit: [...order.audit, audit],
  });

  return { order: updated, refund };
}

export async function recordOrderManualPayment(
  orderId: string,
  input: {
    amountCents: number;
    method?: CommerceOrderManualPaymentMethod;
    status?: CommerceOrderManualPaymentStatus;
    reference?: string;
    note?: string;
    idempotencyKey?: string;
    actor?: 'admin' | 'system';
  },
): Promise<{ order: CommerceOrder | null; manualPayment: CommerceOrderManualPayment | null; error?: string }> {
  const order = await loadOrder(orderId);
  if (!order) return { order: null, manualPayment: null, error: 'order_not_found' };
  const idempotencyKey = input.idempotencyKey?.trim();
  const existingPayment = idempotencyKey
    ? order.manualPayments.find((payment) => payment.idempotencyKey === idempotencyKey)
    : undefined;
  if (existingPayment) return { order, manualPayment: existingPayment };
  if (order.payment.adapter !== 'manual-invoice') {
    return { order, manualPayment: null, error: 'order_not_manual_invoice' };
  }
  if (order.payment.status === 'refunded' || order.payment.status === 'partially_refunded') {
    return { order, manualPayment: null, error: 'order_refund_locked' };
  }

  const amountCents = Math.floor(Number(input.amountCents));
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    return { order, manualPayment: null, error: 'manual_payment_amount_invalid' };
  }

  const balanceDue = manualPaymentBalanceDue(order);
  if (balanceDue <= 0 || order.payment.status === 'paid') {
    return { order, manualPayment: null, error: 'order_already_paid' };
  }
  if (amountCents > balanceDue) {
    return { order, manualPayment: null, error: 'manual_payment_exceeds_balance' };
  }

  const now = new Date().toISOString();
  const method = input.method === 'cash'
    || input.method === 'bank_transfer'
    || input.method === 'check'
    || input.method === 'other'
    ? input.method
    : 'other';
  const status: CommerceOrderManualPaymentStatus = input.status === 'pending'
    || input.status === 'failed'
    || input.status === 'canceled'
    || input.status === 'succeeded'
    ? input.status
    : 'succeeded';
  const manualPayment: CommerceOrderManualPayment = {
    paymentId: `mp_${randomUUID()}`,
    amountCents,
    currency: order.currency,
    method,
    reference: input.reference?.trim() || undefined,
    note: input.note?.trim() || undefined,
    idempotencyKey: idempotencyKey || undefined,
    status,
    actor: input.actor ?? 'admin',
    createdAt: now,
  };
  const succeeded = status === 'succeeded';
  const nextPaidCents = successfulManualPaymentTotal(order) + (succeeded ? amountCents : 0);
  const nextBalanceDueCents = Math.max(0, order.totals.grandTotalCents - nextPaidCents);
  const nextPaymentStatus: CommerceOrderPaymentStatus =
    succeeded
      ? (nextPaidCents >= order.totals.grandTotalCents ? 'paid' : 'partially_paid')
      : order.payment.status;
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: 'payment.manual.recorded',
    actor: input.actor ?? 'admin',
    message: succeeded
      ? (nextPaymentStatus === 'paid' ? 'Manual payment completed the order balance.' : 'Manual payment recorded.')
      : `Manual payment ${status} entry recorded.`,
    createdAt: now,
    data: {
      paymentId: manualPayment.paymentId,
      amountCents: manualPayment.amountCents,
      currency: manualPayment.currency,
      method: manualPayment.method,
      manualPaymentStatus: manualPayment.status,
      reference: manualPayment.reference,
      idempotencyKey: manualPayment.idempotencyKey,
      paidCents: nextPaidCents,
      balanceDueCents: nextBalanceDueCents,
      paymentStatus: nextPaymentStatus,
      note: manualPayment.note,
    },
  };

  const updated = await saveOrder({
    ...order,
    payment: {
      ...order.payment,
      status: nextPaymentStatus,
    },
    documents: succeeded
      ? updateCurrentInvoiceBalances(order.documents, nextBalanceDueCents, now, { revokedByPaymentId: manualPayment.paymentId })
      : order.documents,
    manualPayments: [...order.manualPayments, manualPayment],
    updatedAt: now,
    audit: [...order.audit, audit],
  });
  return { order: updated, manualPayment };
}

export async function filterOrders(options: {
  locale?: Locale;
  q?: string;
  status?: CommerceOrderStatus | 'all';
  paymentStatus?: CommerceOrderPaymentStatus | 'all';
  fulfillmentStatus?: CommerceOrderFulfillmentStatus | 'all';
} = {}): Promise<CommerceOrder[]> {
  return (await listOrders({ locale: options.locale, q: options.q }))
    .filter((order) => !options.status || options.status === 'all' || order.status === options.status)
    .filter((order) => !options.paymentStatus || options.paymentStatus === 'all' || order.payment.status === options.paymentStatus)
    .filter((order) => !options.fulfillmentStatus || options.fulfillmentStatus === 'all' || order.fulfillment.status === options.fulfillmentStatus);
}

export async function findOrderByPaymentReference(referenceId: string): Promise<CommerceOrder | null> {
  const normalized = referenceId.trim();
  if (!normalized) return null;
  const orders = await listOrders();
  return orders.find((order) => order.payment.referenceId === normalized) ?? null;
}

export async function applyOrderPaymentWebhook(input: {
  referenceId: string;
  paymentStatus: CommerceOrderPaymentStatus;
  eventId: string;
  eventType: string;
  provider: string;
}): Promise<{ order: CommerceOrder | null; changed: boolean; reason?: string }> {
  const order = await findOrderByPaymentReference(input.referenceId);
  if (!order) return { order: null, changed: false, reason: 'order_not_found' };

  if (order.payment.status === input.paymentStatus) {
    return { order, changed: false, reason: 'payment_status_unchanged' };
  }

  const hasSuccessfulManualPayments = order.manualPayments.some((payment) => payment.status === 'succeeded');
  if (hasSuccessfulManualPayments && input.paymentStatus !== order.payment.status) {
    return { order, changed: false, reason: 'manual_payment_locked' };
  }

  if (order.payment.status === 'partially_refunded' && input.paymentStatus === 'paid') {
    return { order, changed: false, reason: 'refund_payment_locked' };
  }

  if (order.payment.status === 'refunded' && input.paymentStatus !== 'refunded') {
    return { order, changed: false, reason: 'refunded_payment_locked' };
  }

  const now = new Date().toISOString();
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: 'payment.webhook.applied',
    actor: 'system',
    message: 'Payment webhook updated order payment state.',
    createdAt: now,
    data: {
      provider: input.provider,
      paymentReferenceId: input.referenceId,
      webhookEventId: input.eventId,
      webhookEventType: input.eventType,
      previousPaymentStatus: order.payment.status,
      paymentStatus: input.paymentStatus,
    },
  };

  const updated = await saveOrder({
    ...order,
    payment: {
      ...order.payment,
      status: input.paymentStatus,
    },
    updatedAt: now,
    audit: [...order.audit, audit],
  });
  return { order: updated, changed: true };
}

export async function updateOrderState(
  orderId: string,
  patch: {
    status?: CommerceOrderStatus;
    paymentStatus?: CommerceOrderPaymentStatus;
    fulfillmentStatus?: CommerceOrderFulfillmentStatus;
    trackingNumber?: string;
    actor?: 'admin' | 'system';
  },
): Promise<CommerceOrder | null> {
  const order = await loadOrder(orderId);
  if (!order) return null;
  const now = new Date().toISOString();
  const requestedPaymentStatus = patch.paymentStatus;
  const hasSuccessfulManualPayments = order.manualPayments.some((payment) => payment.status === 'succeeded');
  const manualPaymentLocked = hasSuccessfulManualPayments
    && requestedPaymentStatus
    && requestedPaymentStatus !== order.payment.status;
  const nextPaymentStatus = !requestedPaymentStatus
    || manualPaymentLocked
    || requestedPaymentStatus === 'partially_refunded'
    || requestedPaymentStatus === 'refunded'
    || order.payment.status === 'partially_refunded'
    || order.payment.status === 'refunded'
    ? order.payment.status
    : requestedPaymentStatus;
  const audit: CommerceOrderAuditEvent = {
    eventId: `evt_${randomUUID()}`,
    type: 'order.updated',
    actor: patch.actor ?? 'admin',
    message: 'Order state updated.',
    createdAt: now,
    data: {
      status: patch.status ?? order.status,
      paymentStatus: nextPaymentStatus,
      fulfillmentStatus: patch.fulfillmentStatus ?? order.fulfillment.status,
    },
  };

  return saveOrder({
    ...order,
    status: patch.status ?? order.status,
    payment: {
      ...order.payment,
      status: nextPaymentStatus,
    },
    fulfillment: {
      ...order.fulfillment,
      status: patch.fulfillmentStatus ?? order.fulfillment.status,
      trackingNumber: patch.trackingNumber?.trim() || order.fulfillment.trackingNumber,
      updatedAt: now,
    },
    updatedAt: now,
    audit: [...order.audit, audit],
  });
}

export async function softDeleteOrder(orderId: string): Promise<boolean> {
  const order = await loadOrder(orderId);
  if (!order) return false;
  const deleted = { ...order, deleted: true, updatedAt: new Date().toISOString() };
  await writeJson(orderBlobPath(orderId), orderFilePath(orderId), deleted);
  return true;
}
