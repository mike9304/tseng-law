import type { Locale } from '@/lib/locales';
import { commerceCartTotals, normalizeCartState, type CommerceCartState, type CommerceCartTotals } from './cart-shared';
import type { CommerceCurrency } from './products-shared';

export const COMMERCE_NOTIFICATION_VERSION = 1;

export type CommerceNotificationEventType =
  | 'order.created.customer'
  | 'order.created.admin'
  | 'order.updated.customer'
  | 'order.invoice.customer'
  | 'order.receipt.customer'
  | 'billing.payment_received.customer'
  | 'cart.abandoned.customer';

export type CommerceNotificationStatus = 'queued' | 'sent_stub' | 'skipped';
export type CommerceRecoveryCartStatus = 'captured' | 'converted' | 'dismissed';

export interface CommerceNotificationRecipient {
  email: string;
  name?: string;
}

export interface CommerceNotificationTemplate {
  enabled: boolean;
  subject: string;
}

export interface CommercePaymentReceivedNotificationSettings {
  enabled: boolean;
  manualEnabled: boolean;
  hostedEnabled: boolean;
  suppressFullSettlementReceiptOverlap: boolean;
}

export interface CommerceNotificationSettings {
  version: typeof COMMERCE_NOTIFICATION_VERSION;
  enabled: boolean;
  senderName: string;
  adminEmail: string;
  abandonedCart: {
    enabled: boolean;
    delayMinutes: number;
  };
  paymentReceived: CommercePaymentReceivedNotificationSettings;
  templates: Record<CommerceNotificationEventType, CommerceNotificationTemplate>;
  updatedAt: string;
}

export interface CommerceNotificationEvent {
  version: typeof COMMERCE_NOTIFICATION_VERSION;
  eventId: string;
  type: CommerceNotificationEventType;
  locale: Locale;
  channel: 'email';
  status: CommerceNotificationStatus;
  recipient: CommerceNotificationRecipient;
  subject: string;
  relatedId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CommerceRecoveryCart {
  version: typeof COMMERCE_NOTIFICATION_VERSION;
  recoveryId: string;
  locale: Locale;
  currency: CommerceCurrency;
  email: string;
  cart: CommerceCartState;
  totals: CommerceCartTotals;
  status: CommerceRecoveryCartStatus;
  recoveryUrl: string;
  notificationEventId?: string;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export const DEFAULT_COMMERCE_NOTIFICATION_SETTINGS: CommerceNotificationSettings = {
  version: COMMERCE_NOTIFICATION_VERSION,
  enabled: true,
  senderName: 'Tseng Law Store',
  adminEmail: 'commerce@example.com',
  abandonedCart: {
    enabled: true,
    delayMinutes: 60,
  },
  paymentReceived: {
    enabled: true,
    manualEnabled: true,
    hostedEnabled: true,
    suppressFullSettlementReceiptOverlap: true,
  },
  templates: {
    'order.created.customer': {
      enabled: true,
      subject: 'Order confirmation',
    },
    'order.created.admin': {
      enabled: true,
      subject: 'New store order',
    },
    'order.updated.customer': {
      enabled: true,
      subject: 'Order status updated',
    },
    'order.invoice.customer': {
      enabled: true,
      subject: 'Invoice for your order',
    },
    'order.receipt.customer': {
      enabled: true,
      subject: 'Receipt for your order',
    },
    'billing.payment_received.customer': {
      enabled: true,
      subject: 'Payment received',
    },
    'cart.abandoned.customer': {
      enabled: true,
      subject: 'Complete your checkout',
    },
  },
  updatedAt: '2026-05-20T00:00:00.000Z',
};

const notificationTypes: CommerceNotificationEventType[] = [
  'order.created.customer',
  'order.created.admin',
  'order.updated.customer',
  'order.invoice.customer',
  'order.receipt.customer',
  'billing.payment_received.customer',
  'cart.abandoned.customer',
];

function isLocale(value: unknown): value is Locale {
  return value === 'ko' || value === 'zh-hant' || value === 'en';
}

function isCurrency(value: unknown): value is CommerceCurrency {
  return value === 'TWD' || value === 'KRW' || value === 'USD';
}

function email(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase().slice(0, 200) : '';
}

export function isCommerceNotificationType(value: unknown): value is CommerceNotificationEventType {
  return notificationTypes.includes(value as CommerceNotificationEventType);
}

export function normalizeNotificationSettings(input: unknown, now = new Date().toISOString()): CommerceNotificationSettings {
  const source = input && typeof input === 'object' ? input as Partial<CommerceNotificationSettings> : {};
  const defaults = DEFAULT_COMMERCE_NOTIFICATION_SETTINGS;
  const sourceTemplates = source.templates && typeof source.templates === 'object'
    ? source.templates as Partial<Record<CommerceNotificationEventType, Partial<CommerceNotificationTemplate>>>
    : {};
  const templates = Object.fromEntries(notificationTypes.map((type) => {
    const template = sourceTemplates[type] as Partial<CommerceNotificationTemplate> | undefined;
    return [type, {
      enabled: typeof template?.enabled === 'boolean' ? template.enabled : defaults.templates[type].enabled,
      subject: typeof template?.subject === 'string' && template.subject.trim()
        ? template.subject.trim().slice(0, 180)
        : defaults.templates[type].subject,
    }];
  })) as Record<CommerceNotificationEventType, CommerceNotificationTemplate>;
  const delayMinutes = Number(source.abandonedCart?.delayMinutes);

  return {
    version: COMMERCE_NOTIFICATION_VERSION,
    enabled: typeof source.enabled === 'boolean' ? source.enabled : defaults.enabled,
    senderName: typeof source.senderName === 'string' && source.senderName.trim()
      ? source.senderName.trim().slice(0, 120)
      : defaults.senderName,
    adminEmail: email(source.adminEmail) || defaults.adminEmail,
    abandonedCart: {
      enabled: typeof source.abandonedCart?.enabled === 'boolean'
        ? source.abandonedCart.enabled
        : defaults.abandonedCart.enabled,
      delayMinutes: Number.isFinite(delayMinutes) ? Math.max(5, Math.min(10080, Math.floor(delayMinutes))) : defaults.abandonedCart.delayMinutes,
    },
    paymentReceived: {
      enabled: typeof source.paymentReceived?.enabled === 'boolean'
        ? source.paymentReceived.enabled
        : defaults.paymentReceived.enabled,
      manualEnabled: typeof source.paymentReceived?.manualEnabled === 'boolean'
        ? source.paymentReceived.manualEnabled
        : defaults.paymentReceived.manualEnabled,
      hostedEnabled: typeof source.paymentReceived?.hostedEnabled === 'boolean'
        ? source.paymentReceived.hostedEnabled
        : defaults.paymentReceived.hostedEnabled,
      suppressFullSettlementReceiptOverlap: typeof source.paymentReceived?.suppressFullSettlementReceiptOverlap === 'boolean'
        ? source.paymentReceived.suppressFullSettlementReceiptOverlap
        : defaults.paymentReceived.suppressFullSettlementReceiptOverlap,
    },
    templates,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}

export function normalizeNotificationEvent(input: unknown): CommerceNotificationEvent | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceNotificationEvent>;
  if (source.version !== COMMERCE_NOTIFICATION_VERSION || !source.eventId || !isCommerceNotificationType(source.type) || !isLocale(source.locale)) {
    return null;
  }
  const recipientEmail = email(source.recipient?.email);
  if (!recipientEmail) return null;
  const status = source.status === 'sent_stub' || source.status === 'skipped' || source.status === 'queued'
    ? source.status
    : 'queued';
  const now = new Date().toISOString();
  return {
    version: COMMERCE_NOTIFICATION_VERSION,
    eventId: String(source.eventId),
    type: source.type,
    locale: source.locale,
    channel: 'email',
    status,
    recipient: {
      email: recipientEmail,
      name: typeof source.recipient?.name === 'string' && source.recipient.name.trim()
        ? source.recipient.name.trim().slice(0, 120)
        : undefined,
    },
    subject: typeof source.subject === 'string' && source.subject.trim() ? source.subject.trim().slice(0, 180) : 'Store notification',
    relatedId: typeof source.relatedId === 'string' && source.relatedId.trim() ? source.relatedId.trim().slice(0, 160) : undefined,
    payload: source.payload && typeof source.payload === 'object' ? source.payload as Record<string, unknown> : {},
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}

export function normalizeRecoveryCart(input: unknown): CommerceRecoveryCart | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<CommerceRecoveryCart>;
  if (source.version !== COMMERCE_NOTIFICATION_VERSION || !source.recoveryId || !isLocale(source.locale) || !isCurrency(source.currency)) return null;
  const recoveryEmail = email(source.email);
  if (!recoveryEmail) return null;
  const cart = normalizeCartState(source.cart, source.locale, source.currency);
  if (cart.items.length === 0) return null;
  const status = source.status === 'converted' || source.status === 'dismissed' || source.status === 'captured'
    ? source.status
    : 'captured';
  const now = new Date().toISOString();
  return {
    version: COMMERCE_NOTIFICATION_VERSION,
    recoveryId: String(source.recoveryId),
    locale: source.locale,
    currency: source.currency,
    email: recoveryEmail,
    cart,
    totals: source.totals && typeof source.totals === 'object' ? source.totals as CommerceCartTotals : commerceCartTotals(cart),
    status,
    recoveryUrl: typeof source.recoveryUrl === 'string' && source.recoveryUrl.trim() ? source.recoveryUrl.trim().slice(0, 400) : `/${source.locale}/store/checkout`,
    notificationEventId: typeof source.notificationEventId === 'string' ? source.notificationEventId : undefined,
    orderId: typeof source.orderId === 'string' ? source.orderId : undefined,
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
    expiresAt: typeof source.expiresAt === 'string' ? source.expiresAt : now,
  };
}
