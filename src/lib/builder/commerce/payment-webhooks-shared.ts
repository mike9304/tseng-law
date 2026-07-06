import type { CommercePaymentProviderId } from './payment-providers';
import type { CommerceOrderPaymentStatus } from './orders-shared';
import type { CommerceCurrency } from './products-shared';

export const COMMERCE_PAYMENT_WEBHOOK_VERSION = 1;

export type CommercePaymentWebhookStatus =
  | 'processed'
  | 'unmatched'
  | 'failed'
  | 'ignored';

export interface CommercePaymentWebhookEvent {
  version: typeof COMMERCE_PAYMENT_WEBHOOK_VERSION;
  eventId: string;
  provider: CommercePaymentProviderId;
  providerEventId: string;
  eventType: string;
  paymentReferenceId: string;
  paymentStatus: CommerceOrderPaymentStatus;
  amountCents?: number;
  currency?: CommerceCurrency;
  feeCents?: number;
  netAmountCents?: number;
  balanceTransactionId?: string;
  orderId?: string;
  status: CommercePaymentWebhookStatus;
  error?: string;
  replayCount: number;
  signatureVerified: boolean;
  payload: unknown;
  receivedAt: string;
  processedAt?: string;
  lastReplayAt?: string;
  updatedAt: string;
}

export interface NormalizedCommercePaymentWebhookInput {
  provider: CommercePaymentProviderId;
  providerEventId: string;
  eventType: string;
  paymentReferenceId: string;
  paymentStatus: CommerceOrderPaymentStatus;
  amountCents?: number;
  currency?: CommerceCurrency;
  feeCents?: number;
  netAmountCents?: number;
  balanceTransactionId?: string;
  signatureVerified?: boolean;
  payload: unknown;
}

function isCurrency(value: unknown): value is CommerceCurrency {
  return value === 'TWD' || value === 'KRW' || value === 'USD';
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function cents(value: unknown): number | undefined {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? Math.floor(amount) : undefined;
}

function currency(value: unknown): CommerceCurrency | undefined {
  const normalized = text(value).toUpperCase();
  return isCurrency(normalized) ? normalized : undefined;
}

function balanceTransactionFeeDetails(input: Record<string, unknown>): number | undefined {
  const direct = cents(input.fee);
  if (direct !== undefined) return direct;
  const feeDetails = input.fee_details;
  if (!Array.isArray(feeDetails)) return undefined;
  const first = feeDetails[0];
  if (!first || typeof first !== 'object') return undefined;
  const amount = cents((first as Record<string, unknown>).amount);
  return amount;
}

function balanceTransactionNetAmount(input: Record<string, unknown>, feeCents?: number): number | undefined {
  const direct = cents(input.net);
  if (direct !== undefined) return direct;
  const amount = cents(input.amount);
  if (amount === undefined || feeCents === undefined) return undefined;
  return Math.max(0, amount - feeCents);
}

function objectValue(input: unknown): Record<string, unknown> {
  return input && typeof input === 'object' && !Array.isArray(input)
    ? input as Record<string, unknown>
    : {};
}

function objectAt(input: Record<string, unknown>, key: string): Record<string, unknown> {
  return objectValue(input[key]);
}

function maskSensitivePayload(input: unknown, depth = 0): unknown {
  if (depth > 5) return '[truncated]';
  if (Array.isArray(input)) return input.map((value) => maskSensitivePayload(value, depth + 1));
  if (!input || typeof input !== 'object') return input;

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    const lower = key.toLowerCase();
    if (
      lower.includes('secret')
      || lower.includes('password')
      || lower.includes('card')
      || lower.includes('cvc')
      || lower.includes('token')
      || lower.includes('authorization')
    ) {
      masked[key] = '[masked]';
      continue;
    }
    masked[key] = maskSensitivePayload(value, depth + 1);
  }
  return masked;
}

function mapEventTypeToPaymentStatus(eventType: string): CommerceOrderPaymentStatus | null {
  switch (eventType) {
    case 'payment_intent.succeeded':
    case 'payment_intent.captured':
    case 'sandbox.payment.captured':
    case 'manual_invoice.paid':
      return 'paid';
    case 'payment_intent.payment_failed':
    case 'sandbox.payment.failed':
    case 'manual_invoice.failed':
      return 'failed';
    case 'payment_intent.authorized':
    case 'sandbox.payment.authorized':
      return 'authorized_stub';
    default:
      return null;
  }
}

export function normalizeCommercePaymentWebhookPayload(
  provider: CommercePaymentProviderId,
  payload: unknown,
): NormalizedCommercePaymentWebhookInput | null {
  const root = objectValue(payload);
  const data = objectAt(root, 'data');
  const nestedObject = objectAt(data, 'object');
  const object = Object.keys(nestedObject).length ? nestedObject : root;
  const balanceTransaction = objectAt(object, 'balance_transaction');
  const eventType = text(root.type) || text(root.eventType);
  const paymentStatus = mapEventTypeToPaymentStatus(eventType);
  const providerEventId = text(root.id) || text(root.eventId);
  const paymentReferenceId =
    text(object.id)
    || text(root.paymentIntentId)
    || text(root.paymentReferenceId)
    || text(root.referenceId)
    || text(object.payment_intent);

  if (!providerEventId || !eventType || !paymentStatus || !paymentReferenceId) return null;

  return {
    provider,
    providerEventId,
    eventType,
    paymentReferenceId,
    paymentStatus,
    amountCents: cents(object.amountCents ?? object.amount ?? root.amountCents),
    currency: currency(object.currency ?? root.currency),
    feeCents: balanceTransactionFeeDetails(balanceTransaction) ?? cents(object.application_fee_amount ?? root.application_fee_amount),
    netAmountCents: balanceTransactionNetAmount(balanceTransaction, balanceTransactionFeeDetails(balanceTransaction)) ?? cents(object.netAmountCents ?? root.netAmountCents),
    balanceTransactionId: text(balanceTransaction.id) || text(object.balance_transaction_id) || text(root.balance_transaction_id) || undefined,
    payload: maskSensitivePayload(payload),
  };
}

export function normalizeCommercePaymentWebhookEvent(input: unknown): CommercePaymentWebhookEvent | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommercePaymentWebhookEvent>;
  if (
    source.version !== COMMERCE_PAYMENT_WEBHOOK_VERSION
    || !source.eventId
    || (source.provider !== 'manual-invoice' && source.provider !== 'sandbox-card')
    || !source.providerEventId
    || !source.eventType
    || !source.paymentReferenceId
  ) {
    return null;
  }
  const status = source.status === 'processed'
    || source.status === 'unmatched'
    || source.status === 'failed'
    || source.status === 'ignored'
    ? source.status
    : 'failed';
  const paymentStatus = source.paymentStatus === 'requires_manual_payment'
    || source.paymentStatus === 'partially_paid'
    || source.paymentStatus === 'authorized_stub'
    || source.paymentStatus === 'paid'
    || source.paymentStatus === 'failed'
    || source.paymentStatus === 'partially_refunded'
    || source.paymentStatus === 'refunded'
    ? source.paymentStatus
    : 'failed';
  const now = new Date().toISOString();

  return {
    version: COMMERCE_PAYMENT_WEBHOOK_VERSION,
    eventId: String(source.eventId),
    provider: source.provider,
    providerEventId: String(source.providerEventId),
    eventType: String(source.eventType),
    paymentReferenceId: String(source.paymentReferenceId),
    paymentStatus,
    amountCents: cents(source.amountCents),
    currency: currency(source.currency),
    feeCents: cents(source.feeCents),
    netAmountCents: cents(source.netAmountCents),
    balanceTransactionId: source.balanceTransactionId ? String(source.balanceTransactionId) : undefined,
    orderId: source.orderId ? String(source.orderId) : undefined,
    status,
    error: source.error ? String(source.error) : undefined,
    replayCount: Number.isFinite(Number(source.replayCount)) ? Math.max(0, Math.floor(Number(source.replayCount))) : 0,
    signatureVerified: source.signatureVerified === true,
    payload: source.payload ?? {},
    receivedAt: typeof source.receivedAt === 'string' ? source.receivedAt : now,
    processedAt: typeof source.processedAt === 'string' ? source.processedAt : undefined,
    lastReplayAt: typeof source.lastReplayAt === 'string' ? source.lastReplayAt : undefined,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}
