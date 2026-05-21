import type { Locale } from '@/lib/locales';
import type {
  CommerceCheckoutAddress,
  CommerceCheckoutCustomer,
  CommerceCheckoutPaymentAdapter,
  CommerceCheckoutShippingQuote,
  CommerceCheckoutTaxQuote,
  CommerceCheckoutTotals,
} from './checkout-shared';
import type { CommerceCartItem } from './cart-shared';
import type { CommerceCurrency } from './products-shared';
import type {
  BillingPaymentLinkHistoryEntry,
  BillingPaymentLinkHistoryReason,
  BillingPaymentLinkHistoryType,
} from '@/lib/builder/billing-payment-link-history';

export const COMMERCE_ORDER_VERSION = 1;

export type CommerceOrderPaymentStatus =
  | 'requires_manual_payment'
  | 'partially_paid'
  | 'authorized_stub'
  | 'paid'
  | 'failed'
  | 'partially_refunded'
  | 'refunded';

export type CommerceOrderFulfillmentStatus =
  | 'unfulfilled'
  | 'processing'
  | 'fulfilled'
  | 'cancelled';

export type CommerceOrderStatus = 'created' | 'confirmed' | 'cancelled';

export type CommerceOrderDocumentType = 'invoice' | 'receipt';
export type CommerceOrderDocumentStatus = 'issued' | 'emailed_stub' | 'voided' | 'superseded';
export type CommerceOrderPaymentLinkRevokedReason = BillingPaymentLinkHistoryReason;

export interface CommerceOrderPayment {
  adapter: CommerceCheckoutPaymentAdapter;
  status: CommerceOrderPaymentStatus;
  label: string;
  stub: boolean;
  referenceId?: string;
}

export interface CommerceOrderRefund {
  refundId: string;
  providerRefundId?: string;
  amountCents: number;
  currency: CommerceCurrency;
  reason?: string;
  status: 'succeeded' | 'failed';
  actor: 'admin' | 'system';
  createdAt: string;
}

export type CommerceOrderManualPaymentMethod = 'cash' | 'bank_transfer' | 'check' | 'other';
export type CommerceOrderManualPaymentStatus = 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface CommerceOrderManualPayment {
  paymentId: string;
  amountCents: number;
  currency: CommerceCurrency;
  method: CommerceOrderManualPaymentMethod;
  reference?: string;
  note?: string;
  idempotencyKey?: string;
  status: CommerceOrderManualPaymentStatus;
  actor: 'admin' | 'system';
  createdAt: string;
}

export interface CommerceOrderDocument {
  documentId: string;
  type: CommerceOrderDocumentType;
  number: string;
  numberReservationId?: string;
  status: CommerceOrderDocumentStatus;
  currency: CommerceCurrency;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  refundedCents: number;
  balanceDueCents: number;
  recipientEmail: string;
  recipientName?: string;
  actor: 'admin' | 'system';
  issuedAt: string;
  emailedAt?: string;
  notificationEventId?: string;
  notes?: string;
  voidedAt?: string;
  voidReason?: string;
  supersedesDocumentId?: string;
  supersededByDocumentId?: string;
  shareLinkCreatedAt?: string;
  shareLinkExpiresAt?: string;
  shareLinkRevokedAt?: string;
  paymentLinkId?: string;
  paymentLinkCreatedAt?: string;
  paymentLinkExpiresAt?: string;
  paymentLinkRevokedAt?: string;
  paymentLinkRevokedReason?: CommerceOrderPaymentLinkRevokedReason;
  paymentLinkRevokedBalanceDue?: number;
  paymentLinkRevokedByPaymentId?: string;
  paymentLinkEvents?: BillingPaymentLinkHistoryEntry[];
  viewedAt?: string;
  viewCount?: number;
  downloadedAt?: string;
  downloadCount?: number;
}

export interface CommerceOrderFulfillment {
  status: CommerceOrderFulfillmentStatus;
  method: string;
  trackingNumber?: string;
  updatedAt: string;
}

export interface CommerceOrderAuditEvent {
  eventId: string;
  type: string;
  actor: 'visitor' | 'system' | 'admin';
  message: string;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface CommerceOrder {
  version: typeof COMMERCE_ORDER_VERSION;
  orderId: string;
  confirmationNumber: string;
  locale: Locale;
  currency: CommerceCurrency;
  status: CommerceOrderStatus;
  customer: CommerceCheckoutCustomer;
  shippingAddress: CommerceCheckoutAddress;
  lineItems: CommerceCartItem[];
  couponCode?: string;
  shipping: CommerceCheckoutShippingQuote;
  tax: CommerceCheckoutTaxQuote;
  totals: CommerceCheckoutTotals;
  payment: CommerceOrderPayment;
  manualPayments: CommerceOrderManualPayment[];
  refunds: CommerceOrderRefund[];
  documents: CommerceOrderDocument[];
  fulfillment: CommerceOrderFulfillment;
  source: 'checkout';
  createdAt: string;
  updatedAt: string;
  audit: CommerceOrderAuditEvent[];
}

export interface CommerceOrderCreateInput {
  confirmationNumber: string;
  locale: Locale;
  currency: CommerceCurrency;
  customer: CommerceCheckoutCustomer;
  shippingAddress: CommerceCheckoutAddress;
  lineItems: CommerceCartItem[];
  couponCode?: string;
  shipping: CommerceCheckoutShippingQuote;
  tax: CommerceCheckoutTaxQuote;
  totals: CommerceCheckoutTotals;
  payment: CommerceOrderPayment;
  now: string;
}

function isLocale(value: unknown): value is Locale {
  return value === 'ko' || value === 'zh-hant' || value === 'en';
}

function isCurrency(value: unknown): value is CommerceCurrency {
  return value === 'TWD' || value === 'KRW' || value === 'USD';
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function normalizePayment(input: unknown): CommerceOrderPayment | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceOrderPayment>;
  if (source.adapter !== 'manual-invoice' && source.adapter !== 'sandbox-card') return null;
  const status = source.status === 'requires_manual_payment'
    || source.status === 'partially_paid'
    || source.status === 'authorized_stub'
    || source.status === 'paid'
    || source.status === 'failed'
    || source.status === 'partially_refunded'
    || source.status === 'refunded'
    ? source.status
    : source.adapter === 'sandbox-card' ? 'authorized_stub' : 'requires_manual_payment';
  return {
    adapter: source.adapter,
    status,
    label: text(source.label, source.adapter),
    stub: Boolean(source.stub),
    referenceId: source.referenceId ? String(source.referenceId) : undefined,
  };
}

function normalizeManualPayments(input: unknown, currencyValue: CommerceCurrency): CommerceOrderManualPayment[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((payment): CommerceOrderManualPayment | null => {
      if (!payment || typeof payment !== 'object') return null;
      const source = payment as Partial<CommerceOrderManualPayment>;
      const amountCents = Number(source.amountCents);
      if (!source.paymentId || !Number.isFinite(amountCents) || amountCents <= 0) return null;
      const method = source.method === 'cash'
        || source.method === 'bank_transfer'
        || source.method === 'check'
        || source.method === 'other'
        ? source.method
        : 'other';
      const status = source.status === 'pending'
        || source.status === 'failed'
        || source.status === 'canceled'
        || source.status === 'succeeded'
        ? source.status
        : 'succeeded';
      return {
        paymentId: String(source.paymentId),
        amountCents: Math.floor(amountCents),
        currency: source.currency === 'TWD' || source.currency === 'KRW' || source.currency === 'USD'
          ? source.currency
          : currencyValue,
        method,
        reference: source.reference ? String(source.reference) : undefined,
        note: source.note ? String(source.note) : undefined,
        idempotencyKey: source.idempotencyKey ? String(source.idempotencyKey) : undefined,
        status,
        actor: source.actor === 'admin' || source.actor === 'system' ? source.actor : 'system',
        createdAt: text(source.createdAt, new Date().toISOString()),
      };
    })
    .filter((payment): payment is CommerceOrderManualPayment => Boolean(payment));
}

function normalizeRefunds(input: unknown, currencyValue: CommerceCurrency): CommerceOrderRefund[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((refund): CommerceOrderRefund | null => {
      if (!refund || typeof refund !== 'object') return null;
      const source = refund as Partial<CommerceOrderRefund>;
      const amountCents = Number(source.amountCents);
      if (!source.refundId || !Number.isFinite(amountCents) || amountCents <= 0) return null;
      return {
        refundId: String(source.refundId),
        providerRefundId: source.providerRefundId ? String(source.providerRefundId) : undefined,
        amountCents: Math.floor(amountCents),
        currency: source.currency === 'TWD' || source.currency === 'KRW' || source.currency === 'USD'
          ? source.currency
          : currencyValue,
        reason: source.reason ? String(source.reason) : undefined,
        status: source.status === 'failed' ? 'failed' : 'succeeded',
        actor: source.actor === 'admin' || source.actor === 'system' ? source.actor : 'system',
        createdAt: text(source.createdAt, new Date().toISOString()),
      };
    })
    .filter((refund): refund is CommerceOrderRefund => Boolean(refund));
}

function cents(value: unknown): number {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
}

function count(value: unknown): number {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
}

function normalizePaymentLinkEvents(input: unknown): BillingPaymentLinkHistoryEntry[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((event): BillingPaymentLinkHistoryEntry | null => {
      if (!event || typeof event !== 'object') return null;
      const source = event as Partial<BillingPaymentLinkHistoryEntry>;
      if (!source.eventId || !source.createdAt) return null;
      const type: BillingPaymentLinkHistoryType | null = source.type === 'created'
        || source.type === 'renewed'
        || source.type === 'revoked'
        ? source.type
        : null;
      if (!type) return null;
      const reason = source.reason === 'admin_revoked'
        || source.reason === 'balance_changed'
        || source.reason === 'document_voided'
        || source.reason === 'document_superseded'
        ? source.reason
        : undefined;
      return {
        eventId: String(source.eventId),
        type,
        actor: source.actor === 'admin' || source.actor === 'system' ? source.actor : 'system',
        createdAt: String(source.createdAt),
        paymentLinkId: source.paymentLinkId ? String(source.paymentLinkId) : undefined,
        expiresAt: source.expiresAt ? String(source.expiresAt) : undefined,
        reason,
        balanceDue: Number.isFinite(Number(source.balanceDue))
          ? Math.max(0, Math.floor(Number(source.balanceDue)))
          : undefined,
        paymentId: source.paymentId ? String(source.paymentId) : undefined,
      };
    })
    .filter((event): event is BillingPaymentLinkHistoryEntry => Boolean(event));
}

function normalizeDocuments(input: unknown, currencyValue: CommerceCurrency): CommerceOrderDocument[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((document): CommerceOrderDocument | null => {
      if (!document || typeof document !== 'object') return null;
      const source = document as Partial<CommerceOrderDocument>;
      if (!source.documentId || !source.number || (source.type !== 'invoice' && source.type !== 'receipt')) return null;
      return {
        documentId: String(source.documentId),
        type: source.type,
        number: String(source.number),
        numberReservationId: source.numberReservationId ? String(source.numberReservationId) : undefined,
        status: source.status === 'emailed_stub'
          || source.status === 'voided'
          || source.status === 'superseded'
          ? source.status
          : 'issued',
        currency: source.currency === 'TWD' || source.currency === 'KRW' || source.currency === 'USD'
          ? source.currency
          : currencyValue,
        subtotalCents: cents(source.subtotalCents),
        discountCents: cents(source.discountCents),
        shippingCents: cents(source.shippingCents),
        taxCents: cents(source.taxCents),
        totalCents: cents(source.totalCents),
        refundedCents: cents(source.refundedCents),
        balanceDueCents: cents(source.balanceDueCents),
        recipientEmail: text(source.recipientEmail),
        recipientName: source.recipientName ? String(source.recipientName) : undefined,
        actor: source.actor === 'admin' || source.actor === 'system' ? source.actor : 'system',
        issuedAt: text(source.issuedAt, new Date().toISOString()),
        emailedAt: source.emailedAt ? String(source.emailedAt) : undefined,
        notificationEventId: source.notificationEventId ? String(source.notificationEventId) : undefined,
        notes: source.notes ? String(source.notes) : undefined,
        voidedAt: source.voidedAt ? String(source.voidedAt) : undefined,
        voidReason: source.voidReason ? String(source.voidReason) : undefined,
        supersedesDocumentId: source.supersedesDocumentId ? String(source.supersedesDocumentId) : undefined,
        supersededByDocumentId: source.supersededByDocumentId ? String(source.supersededByDocumentId) : undefined,
        shareLinkCreatedAt: source.shareLinkCreatedAt ? String(source.shareLinkCreatedAt) : undefined,
        shareLinkExpiresAt: source.shareLinkExpiresAt ? String(source.shareLinkExpiresAt) : undefined,
        shareLinkRevokedAt: source.shareLinkRevokedAt ? String(source.shareLinkRevokedAt) : undefined,
        paymentLinkId: source.paymentLinkId ? String(source.paymentLinkId) : undefined,
        paymentLinkCreatedAt: source.paymentLinkCreatedAt ? String(source.paymentLinkCreatedAt) : undefined,
        paymentLinkExpiresAt: source.paymentLinkExpiresAt ? String(source.paymentLinkExpiresAt) : undefined,
        paymentLinkRevokedAt: source.paymentLinkRevokedAt ? String(source.paymentLinkRevokedAt) : undefined,
        paymentLinkRevokedReason: source.paymentLinkRevokedReason === 'admin_revoked'
          || source.paymentLinkRevokedReason === 'balance_changed'
          || source.paymentLinkRevokedReason === 'document_voided'
          || source.paymentLinkRevokedReason === 'document_superseded'
          ? source.paymentLinkRevokedReason
          : undefined,
        paymentLinkRevokedBalanceDue: Number.isFinite(Number(source.paymentLinkRevokedBalanceDue))
          ? Math.max(0, Math.floor(Number(source.paymentLinkRevokedBalanceDue)))
          : undefined,
        paymentLinkRevokedByPaymentId: source.paymentLinkRevokedByPaymentId ? String(source.paymentLinkRevokedByPaymentId) : undefined,
        paymentLinkEvents: normalizePaymentLinkEvents(source.paymentLinkEvents),
        viewedAt: source.viewedAt ? String(source.viewedAt) : undefined,
        viewCount: count(source.viewCount),
        downloadedAt: source.downloadedAt ? String(source.downloadedAt) : undefined,
        downloadCount: count(source.downloadCount),
      };
    })
    .filter((document): document is CommerceOrderDocument => Boolean(document));
}

function normalizeFulfillment(input: unknown, now: string): CommerceOrderFulfillment {
  const source = input && typeof input === 'object' ? input as Partial<CommerceOrderFulfillment> : {};
  const status = source.status === 'processing'
    || source.status === 'fulfilled'
    || source.status === 'cancelled'
    || source.status === 'unfulfilled'
    ? source.status
    : 'unfulfilled';
  return {
    status,
    method: text(source.method, 'checkout'),
    trackingNumber: source.trackingNumber ? String(source.trackingNumber) : undefined,
    updatedAt: text(source.updatedAt, now),
  };
}

function normalizeAudit(input: unknown): CommerceOrderAuditEvent[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((event): CommerceOrderAuditEvent | null => {
      if (!event || typeof event !== 'object') return null;
      const source = event as Partial<CommerceOrderAuditEvent>;
      if (!source.eventId || !source.type || !source.message) return null;
      return {
        eventId: String(source.eventId),
        type: String(source.type),
        actor: source.actor === 'admin' || source.actor === 'system' || source.actor === 'visitor'
          ? source.actor
          : 'system',
        message: String(source.message),
        createdAt: text(source.createdAt, new Date().toISOString()),
        data: source.data && typeof source.data === 'object' ? source.data as Record<string, unknown> : undefined,
      };
    })
    .filter((event): event is CommerceOrderAuditEvent => Boolean(event));
}

export function normalizeCommerceOrder(input: unknown): CommerceOrder | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceOrder>;
  if (source.version !== COMMERCE_ORDER_VERSION) return null;
  if (!source.orderId || !source.confirmationNumber || !isLocale(source.locale) || !isCurrency(source.currency)) return null;
  if (!source.customer || !source.shippingAddress || !source.shipping || !source.tax || !source.totals) return null;
  if (!Array.isArray(source.lineItems) || source.lineItems.length === 0) return null;
  const payment = normalizePayment(source.payment);
  if (!payment) return null;
  const now = new Date().toISOString();
  const status = source.status === 'cancelled' || source.status === 'created' || source.status === 'confirmed'
    ? source.status
    : 'created';
  return {
    version: COMMERCE_ORDER_VERSION,
    orderId: String(source.orderId),
    confirmationNumber: String(source.confirmationNumber),
    locale: source.locale,
    currency: source.currency,
    status,
    customer: source.customer,
    shippingAddress: source.shippingAddress,
    lineItems: source.lineItems,
    couponCode: source.couponCode ? String(source.couponCode) : undefined,
    shipping: source.shipping,
    tax: source.tax,
    totals: source.totals,
    payment,
    manualPayments: normalizeManualPayments(source.manualPayments, source.currency),
    refunds: normalizeRefunds(source.refunds, source.currency),
    documents: normalizeDocuments(source.documents, source.currency),
    fulfillment: normalizeFulfillment(source.fulfillment, now),
    source: 'checkout',
    createdAt: text(source.createdAt, now),
    updatedAt: text(source.updatedAt, now),
    audit: normalizeAudit(source.audit),
  };
}
