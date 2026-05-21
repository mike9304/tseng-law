import type { BuilderBillingDocumentRow, BillingDocumentSource } from './billing-documents';
import { parseBillingDocumentSource } from './billing-documents';

export type BillingDocumentHostedPaymentStatus = 'paid' | 'failed' | 'canceled' | 'requires_action';

export interface BillingDocumentStripeCheckoutRequest {
  body: URLSearchParams;
  idempotencyKey: string;
}

export interface BillingDocumentStripeCheckoutSession {
  ok: true;
  sessionId: string;
  url: string;
}

export interface BillingDocumentStripeCheckoutError {
  ok: false;
  status: number;
  error: string;
}

export interface BillingDocumentStripeWebhookPayment {
  source: BillingDocumentSource;
  ownerId: string;
  documentId: string;
  paymentLinkId: string;
  documentNumber?: string;
  provider: 'stripe';
  providerEventId: string;
  providerSessionId?: string;
  providerPaymentId?: string;
  eventType: string;
  status: BillingDocumentHostedPaymentStatus;
  amount: number;
  currency: string;
}

type FetchLike = typeof fetch;

const STRIPE_CHECKOUT_SESSIONS_URL = 'https://api.stripe.com/v1/checkout/sessions';

function stripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY?.trim() ?? '';
}

export function billingDocumentStripeCheckoutConfigured(): boolean {
  return Boolean(stripeSecretKey());
}

function absolutePath(origin: string, path: string): string {
  const normalizedOrigin = origin.replace(/\/+$/, '');
  return `${normalizedOrigin}${path.startsWith('/') ? path : `/${path}`}`;
}

function withPaymentReturn(path: string, value: 'return' | 'cancel'): string {
  return `${path}${path.includes('?') ? '&' : '?'}payment=${value}`;
}

function checkoutMetadata(row: BuilderBillingDocumentRow): Record<string, string> {
  return {
    billing_source: row.source,
    billing_owner_id: row.ownerId,
    billing_document_id: row.documentId,
    billing_payment_link_id: row.paymentLinkId ?? '',
    billing_document_number: row.number,
  };
}

function setMetadata(body: URLSearchParams, prefix: string, metadata: Record<string, string>): void {
  for (const [key, value] of Object.entries(metadata)) {
    body.set(prefix ? `${prefix}[metadata][${key}]` : `metadata[${key}]`, value);
  }
}

export function buildBillingDocumentStripeCheckoutRequest(
  row: BuilderBillingDocumentRow,
  origin: string,
): BillingDocumentStripeCheckoutRequest {
  if (!row.paymentLinkPath || !row.paymentLinkId) {
    throw new Error('billing_document_payment_link_inactive');
  }

  const metadata = checkoutMetadata(row);
  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('success_url', absolutePath(origin, withPaymentReturn(row.paymentLinkPath, 'return')));
  body.set('cancel_url', absolutePath(origin, withPaymentReturn(row.paymentLinkPath, 'cancel')));
  body.set('client_reference_id', `${row.source}:${row.ownerId}:${row.documentId}:${row.paymentLinkId}`);
  body.set('customer_email', row.recipientEmail);
  body.set('line_items[0][quantity]', '1');
  body.set('line_items[0][price_data][currency]', row.currency.toLowerCase());
  body.set('line_items[0][price_data][unit_amount]', String(row.balanceDue));
  body.set('line_items[0][price_data][product_data][name]', `${row.typeLabel} ${row.number}`);
  body.set('line_items[0][price_data][product_data][description]', `${row.sourceLabel} ${row.ownerLabel}`);
  setMetadata(body, '', metadata);
  setMetadata(body, 'payment_intent_data', metadata);

  return {
    body,
    idempotencyKey: [
      'billing-document',
      row.source,
      row.ownerId,
      row.documentId,
      row.paymentLinkId,
      row.currency,
      row.balanceDue,
    ].join(':'),
  };
}

export async function createBillingDocumentStripeCheckoutSession(
  row: BuilderBillingDocumentRow,
  options: { origin: string; fetchImpl?: FetchLike },
): Promise<BillingDocumentStripeCheckoutSession | BillingDocumentStripeCheckoutError> {
  const secret = stripeSecretKey();
  if (!secret) {
    return { ok: false, status: 503, error: 'stripe_not_configured' };
  }

  const request = buildBillingDocumentStripeCheckoutRequest(row, options.origin);
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(STRIPE_CHECKOUT_SESSIONS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': request.idempotencyKey,
    },
    body: request.body.toString(),
  });
  const payload = (await response.json().catch(() => ({}))) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.url || !payload.id) {
    return {
      ok: false,
      status: response.status || 502,
      error: payload.error?.message || 'stripe_checkout_session_failed',
    };
  }

  return {
    ok: true,
    sessionId: payload.id,
    url: payload.url,
  };
}

function objectValue(input: unknown): Record<string, unknown> {
  return input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function cents(value: unknown): number {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? Math.floor(amount) : 0;
}

function metadataString(metadata: Record<string, unknown>, key: string): string {
  return text(metadata[key]);
}

function statusForStripeEvent(eventType: string, object: Record<string, unknown>): BillingDocumentHostedPaymentStatus | null {
  switch (eventType) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      return text(object.payment_status) === 'paid' || eventType === 'checkout.session.async_payment_succeeded'
        ? 'paid'
        : null;
    case 'payment_intent.succeeded':
      return 'paid';
    case 'payment_intent.payment_failed':
    case 'checkout.session.async_payment_failed':
      return 'failed';
    case 'payment_intent.canceled':
    case 'checkout.session.expired':
      return 'canceled';
    case 'payment_intent.requires_action':
      return 'requires_action';
    default:
      return null;
  }
}

export function normalizeBillingDocumentStripeWebhookPayload(
  payload: unknown,
): BillingDocumentStripeWebhookPayment | null {
  const root = objectValue(payload);
  const eventType = text(root.type);
  const providerEventId = text(root.id);
  const data = objectValue(root.data);
  const object = objectValue(data.object);
  const metadata = objectValue(object.metadata);
  const status = statusForStripeEvent(eventType, object);
  const source = parseBillingDocumentSource(metadataString(metadata, 'billing_source'));
  const ownerId = metadataString(metadata, 'billing_owner_id');
  const documentId = metadataString(metadata, 'billing_document_id');
  const paymentLinkId = metadataString(metadata, 'billing_payment_link_id');

  if (!eventType || !providerEventId || !status || !source || !ownerId || !documentId || !paymentLinkId) {
    return null;
  }

  const amount = eventType.startsWith('checkout.session')
    ? cents(object.amount_total)
    : cents(object.amount_received ?? object.amount);
  const currency = text(object.currency).toUpperCase();
  if (!amount || !currency) return null;

  return {
    source,
    ownerId,
    documentId,
    paymentLinkId,
    documentNumber: metadataString(metadata, 'billing_document_number') || undefined,
    provider: 'stripe',
    providerEventId,
    providerSessionId: eventType.startsWith('checkout.session') ? text(object.id) || undefined : undefined,
    providerPaymentId: text(object.payment_intent) || text(object.id) || undefined,
    eventType,
    status,
    amount,
    currency,
  };
}
