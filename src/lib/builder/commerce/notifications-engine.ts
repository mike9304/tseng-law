import { createHash, randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import type { Locale } from '@/lib/locales';
import type { BuilderBillingDocumentRow, BillingDocumentSource } from '@/lib/builder/billing-documents';
import { commerceCartTotals, normalizeCartState, type CommerceCartState } from './cart-shared';
import type { CommerceCurrency } from './products-shared';
import type { CommerceOrder, CommerceOrderDocument } from './orders-shared';
import {
  COMMERCE_NOTIFICATION_VERSION,
  DEFAULT_COMMERCE_NOTIFICATION_SETTINGS,
  isCommerceNotificationType,
  normalizeNotificationEvent,
  normalizeNotificationSettings,
  normalizeRecoveryCart,
  type CommerceNotificationEvent,
  type CommerceNotificationEventType,
  type CommerceNotificationRecipient,
  type CommerceNotificationSettings,
  type CommerceNotificationStatus,
  type CommerceRecoveryCart,
  type CommerceRecoveryCartStatus,
} from './notifications-shared';

export type {
  CommerceNotificationEvent,
  CommerceNotificationEventType,
  CommerceNotificationRecipient,
  CommerceNotificationSettings,
  CommerceNotificationStatus,
  CommerceRecoveryCart,
  CommerceRecoveryCartStatus,
} from './notifications-shared';

type CommerceBackend = 'blob' | 'file';

const NOTIFICATION_PREFIX = 'builder-commerce/notifications/';
const EVENTS_PREFIX = `${NOTIFICATION_PREFIX}events/`;
const RECOVERY_PREFIX = `${NOTIFICATION_PREFIX}recoveries/`;
const SETTINGS_BLOB = `${NOTIFICATION_PREFIX}settings.json`;
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

function settingsFilePath(): string {
  return path.join(commerceRoot(), 'notifications', 'settings.json');
}

function eventBlobPath(eventId: string): string {
  return `${EVENTS_PREFIX}${eventId}.json`;
}

function eventFilePath(eventId: string): string {
  return path.join(commerceRoot(), 'notifications', 'events', `${eventId}.json`);
}

function recoveryBlobPath(recoveryId: string): string {
  return `${RECOVERY_PREFIX}${recoveryId}.json`;
}

function recoveryFilePath(recoveryId: string): string {
  return path.join(commerceRoot(), 'notifications', 'recoveries', `${recoveryId}.json`);
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

async function listEventJson(): Promise<CommerceNotificationEvent[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: EVENTS_PREFIX });
    const events: CommerceNotificationEvent[] = [];
    for (const blob of result.blobs) {
      const eventId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<CommerceNotificationEvent>(blob.pathname, eventFilePath(eventId));
      const event = normalizeNotificationEvent(parsed);
      if (event) events.push(event);
    }
    return events;
  }

  const dir = path.join(commerceRoot(), 'notifications', 'events');
  const files = await fs.readdir(dir).catch(() => []);
  const events: CommerceNotificationEvent[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const eventId = path.basename(file, '.json');
    const parsed = await readJson<CommerceNotificationEvent>(eventBlobPath(eventId), eventFilePath(eventId));
    const event = normalizeNotificationEvent(parsed);
    if (event) events.push(event);
  }
  return events;
}

async function listRecoveryJson(): Promise<CommerceRecoveryCart[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: RECOVERY_PREFIX });
    const recoveries: CommerceRecoveryCart[] = [];
    for (const blob of result.blobs) {
      const recoveryId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<CommerceRecoveryCart>(blob.pathname, recoveryFilePath(recoveryId));
      const recovery = normalizeRecoveryCart(parsed);
      if (recovery) recoveries.push(recovery);
    }
    return recoveries;
  }

  const dir = path.join(commerceRoot(), 'notifications', 'recoveries');
  const files = await fs.readdir(dir).catch(() => []);
  const recoveries: CommerceRecoveryCart[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const recoveryId = path.basename(file, '.json');
    const parsed = await readJson<CommerceRecoveryCart>(recoveryBlobPath(recoveryId), recoveryFilePath(recoveryId));
    const recovery = normalizeRecoveryCart(parsed);
    if (recovery) recoveries.push(recovery);
  }
  return recoveries;
}

function plusMinutes(iso: string, minutes: number): string {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function plusDays(iso: string, days: number): string {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export async function loadNotificationSettings(): Promise<CommerceNotificationSettings> {
  const parsed = await readJson<CommerceNotificationSettings>(SETTINGS_BLOB, settingsFilePath());
  return normalizeNotificationSettings(parsed ?? DEFAULT_COMMERCE_NOTIFICATION_SETTINGS);
}

export async function saveNotificationSettings(settings: unknown): Promise<CommerceNotificationSettings> {
  const normalized = normalizeNotificationSettings(settings, new Date().toISOString());
  const next = { ...normalized, updatedAt: new Date().toISOString() };
  await writeJson(SETTINGS_BLOB, settingsFilePath(), next);
  return next;
}

export async function saveNotificationEvent(event: CommerceNotificationEvent): Promise<CommerceNotificationEvent> {
  const normalized = normalizeNotificationEvent(event);
  if (!normalized) throw new Error('commerce_notification_event_invalid');
  await writeJson(eventBlobPath(normalized.eventId), eventFilePath(normalized.eventId), normalized);
  return normalized;
}

export async function saveRecoveryCart(recovery: CommerceRecoveryCart): Promise<CommerceRecoveryCart> {
  const normalized = normalizeRecoveryCart(recovery);
  if (!normalized) throw new Error('commerce_recovery_cart_invalid');
  await writeJson(recoveryBlobPath(normalized.recoveryId), recoveryFilePath(normalized.recoveryId), normalized);
  return normalized;
}

export async function listNotificationEvents(options: {
  locale?: Locale;
  type?: CommerceNotificationEventType | 'all';
  status?: CommerceNotificationStatus | 'all';
} = {}): Promise<CommerceNotificationEvent[]> {
  return (await listEventJson())
    .filter((event) => !options.locale || event.locale === options.locale)
    .filter((event) => !options.type || options.type === 'all' || event.type === options.type)
    .filter((event) => !options.status || options.status === 'all' || event.status === options.status)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function listRecoveryCarts(options: {
  locale?: Locale;
  status?: CommerceRecoveryCartStatus | 'all';
} = {}): Promise<CommerceRecoveryCart[]> {
  return (await listRecoveryJson())
    .filter((recovery) => !options.locale || recovery.locale === options.locale)
    .filter((recovery) => !options.status || options.status === 'all' || recovery.status === options.status)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function queueNotification(input: {
  type: CommerceNotificationEventType;
  locale: Locale;
  recipient: CommerceNotificationRecipient;
  eventId?: string;
  relatedId?: string;
  payload?: Record<string, unknown>;
  statusOverride?: CommerceNotificationStatus;
  now?: string;
}): Promise<CommerceNotificationEvent> {
  if (!isCommerceNotificationType(input.type)) throw new Error('commerce_notification_type_invalid');
  const now = input.now ?? new Date().toISOString();
  const settings = await loadNotificationSettings();
  const template = settings.templates[input.type];
  const computedStatus: CommerceNotificationStatus = settings.enabled
    && template.enabled
    && (input.type !== 'cart.abandoned.customer' || settings.abandonedCart.enabled)
    ? 'queued'
    : 'skipped';
  const status = input.statusOverride === 'skipped' ? 'skipped' : computedStatus;
  const event: CommerceNotificationEvent = {
    version: COMMERCE_NOTIFICATION_VERSION,
    eventId: input.eventId?.trim() || `ntf_${randomUUID()}`,
    type: input.type,
    locale: input.locale,
    channel: 'email',
    status,
    recipient: input.recipient,
    subject: template.subject,
    relatedId: input.relatedId,
    payload: {
      senderName: settings.senderName,
      ...input.payload,
    },
    createdAt: now,
    updatedAt: now,
  };
  return saveNotificationEvent(event);
}

function intlLocale(locale: Locale): string {
  if (locale === 'ko') return 'ko-KR';
  if (locale === 'zh-hant') return 'zh-TW';
  return 'en-US';
}

function formatPaymentAmount(locale: Locale, currency: string, amount: number): string {
  const divisor = currency === 'KRW' || currency === 'JPY' ? 1 : 100;
  return new Intl.NumberFormat(intlLocale(locale), {
    currency,
    style: 'currency',
  }).format(amount / divisor);
}

function deterministicNotificationId(parts: Array<string | number | undefined>): string {
  return `ntf_${createHash('sha256').update(parts.map((part) => String(part ?? '')).join(':')).digest('hex').slice(0, 32)}`;
}

export async function queueBillingPaymentReceivedNotification(
  row: BuilderBillingDocumentRow,
  input: {
    amount: number;
    paymentId: string;
    method: 'manual' | 'hosted';
    provider?: string;
    reference?: string;
    receiptEmailQueued?: boolean;
    now?: string;
  },
): Promise<CommerceNotificationEvent | null> {
  if (row.type !== 'invoice') return null;
  if (!row.recipientEmail.trim()) return null;
  const amount = Math.max(0, Math.floor(Number(input.amount)));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const paymentId = input.paymentId.trim();
  if (!paymentId) return null;
  const settings = await loadNotificationSettings();
  const skipReason = !settings.paymentReceived.enabled
    ? 'payment_received_disabled'
    : input.method === 'manual' && !settings.paymentReceived.manualEnabled
      ? 'manual_payment_received_disabled'
    : input.method === 'hosted' && !settings.paymentReceived.hostedEnabled
      ? 'hosted_payment_received_disabled'
        : settings.paymentReceived.suppressFullSettlementReceiptOverlap && input.receiptEmailQueued
          ? 'receipt_email_queued'
          : '';
  const source: BillingDocumentSource = row.source;
  return queueNotification({
    type: 'billing.payment_received.customer',
    locale: row.locale,
    recipient: { email: row.recipientEmail, name: row.recipientName },
    eventId: deterministicNotificationId([
      'billing.payment_received.customer',
      source,
      row.ownerId,
      row.documentId,
      paymentId,
    ]),
    relatedId: `${source}:${row.ownerId}`,
    payload: {
      source,
      ownerId: row.ownerId,
      ownerLabel: row.ownerLabel,
      documentId: row.documentId,
      documentNumber: row.number,
      paymentId,
      paymentMethod: input.method,
      provider: input.provider,
      reference: input.reference,
      amount,
      amountLabel: formatPaymentAmount(row.locale, row.currency, amount),
      balanceDue: row.balanceDue,
      balanceDueLabel: row.balanceDueLabel,
      paymentStatus: row.paymentStatus,
      customerLabel: row.customerLabel,
      customerName: row.recipientName ?? row.customerLabel,
      customerEmail: row.recipientEmail,
      sourceLabel: row.sourceLabel,
      paymentMethodLabel: input.method === 'hosted' ? 'Hosted payment link' : 'Manual payment',
      paymentDate: input.now ?? new Date().toISOString(),
      paymentReceivedPolicy: {
        manualEnabled: settings.paymentReceived.manualEnabled,
        hostedEnabled: settings.paymentReceived.hostedEnabled,
        suppressFullSettlementReceiptOverlap: settings.paymentReceived.suppressFullSettlementReceiptOverlap,
        receiptEmailQueued: Boolean(input.receiptEmailQueued),
        skipReason: skipReason || undefined,
      },
      templateVariables: [
        'customerName',
        'customerEmail',
        'amountLabel',
        'balanceDueLabel',
        'documentNumber',
        'ownerLabel',
        'paymentMethodLabel',
        'paymentDate',
        'paymentStatus',
        'sourceLabel',
      ],
    },
    statusOverride: skipReason ? 'skipped' : undefined,
    now: input.now,
  });
}

export async function queueOrderCreatedNotifications(order: CommerceOrder): Promise<CommerceNotificationEvent[]> {
  const settings = await loadNotificationSettings();
  const payload = {
    orderId: order.orderId,
    confirmationNumber: order.confirmationNumber,
    totalCents: order.totals.grandTotalCents,
    currency: order.currency,
    paymentStatus: order.payment.status,
    fulfillmentStatus: order.fulfillment.status,
  };
  return Promise.all([
    queueNotification({
      type: 'order.created.customer',
      locale: order.locale,
      recipient: { email: order.customer.email, name: order.customer.name },
      relatedId: order.orderId,
      payload,
      now: order.createdAt,
    }),
    queueNotification({
      type: 'order.created.admin',
      locale: order.locale,
      recipient: { email: settings.adminEmail, name: 'Store admin' },
      relatedId: order.orderId,
      payload: { ...payload, customerEmail: order.customer.email },
      now: order.createdAt,
    }),
  ]);
}

export async function queueOrderUpdatedNotification(order: CommerceOrder, changes: Record<string, unknown> = {}): Promise<CommerceNotificationEvent> {
  return queueNotification({
    type: 'order.updated.customer',
    locale: order.locale,
    recipient: { email: order.customer.email, name: order.customer.name },
    relatedId: order.orderId,
    payload: {
      orderId: order.orderId,
      confirmationNumber: order.confirmationNumber,
      status: order.status,
      paymentStatus: order.payment.status,
      fulfillmentStatus: order.fulfillment.status,
      changes,
    },
    now: order.updatedAt,
  });
}

export async function queueOrderDocumentNotification(
  order: CommerceOrder,
  document: CommerceOrderDocument,
): Promise<CommerceNotificationEvent> {
  return queueNotification({
    type: document.type === 'invoice' ? 'order.invoice.customer' : 'order.receipt.customer',
    locale: order.locale,
    recipient: { email: document.recipientEmail, name: document.recipientName },
    relatedId: order.orderId,
    payload: {
      orderId: order.orderId,
      confirmationNumber: order.confirmationNumber,
      documentId: document.documentId,
      documentNumber: document.number,
      documentType: document.type,
      totalCents: document.totalCents,
      refundedCents: document.refundedCents,
      balanceDueCents: document.balanceDueCents,
      currency: document.currency,
    },
    now: new Date().toISOString(),
  });
}

export async function captureAbandonedCart(input: {
  locale: Locale;
  email: string;
  currency: CommerceCurrency;
  cart: unknown;
  recoveryUrl?: string;
  now?: string;
}): Promise<{ recovery: CommerceRecoveryCart; event: CommerceNotificationEvent }> {
  const now = input.now ?? new Date().toISOString();
  const settings = await loadNotificationSettings();
  const cart: CommerceCartState = normalizeCartState(input.cart, input.locale, input.currency);
  if (cart.items.length === 0) throw new Error('commerce_recovery_cart_empty');
  const totals = commerceCartTotals(cart);
  const recovery: CommerceRecoveryCart = {
    version: COMMERCE_NOTIFICATION_VERSION,
    recoveryId: `rcv_${randomUUID()}`,
    locale: input.locale,
    currency: cart.currency,
    email: input.email,
    cart,
    totals,
    status: 'captured',
    recoveryUrl: input.recoveryUrl?.trim() || `/${input.locale}/store/checkout`,
    createdAt: now,
    updatedAt: now,
    expiresAt: plusDays(now, 7),
  };
  const saved = await saveRecoveryCart(recovery);
  const event = await queueNotification({
    type: 'cart.abandoned.customer',
    locale: input.locale,
    recipient: { email: saved.email },
    relatedId: saved.recoveryId,
    payload: {
      recoveryId: saved.recoveryId,
      recoveryUrl: saved.recoveryUrl,
      itemCount: saved.totals.itemCount,
      totalCents: saved.totals.totalCents,
      currency: saved.currency,
      scheduledAt: plusMinutes(now, settings.abandonedCart.delayMinutes),
    },
    now,
  });
  const linked = await saveRecoveryCart({ ...saved, notificationEventId: event.eventId, updatedAt: now });
  return { recovery: linked, event };
}

export async function markRecoveryCartsConverted(input: {
  locale: Locale;
  email: string;
  orderId: string;
  now?: string;
}): Promise<CommerceRecoveryCart[]> {
  const now = input.now ?? new Date().toISOString();
  const normalizedEmail = input.email.trim().toLowerCase();
  const matching = (await listRecoveryCarts({ locale: input.locale, status: 'captured' }))
    .filter((recovery) => recovery.email === normalizedEmail);
  const converted: CommerceRecoveryCart[] = [];
  for (const recovery of matching) {
    converted.push(await saveRecoveryCart({
      ...recovery,
      status: 'converted',
      orderId: input.orderId,
      updatedAt: now,
    }));
  }
  return converted;
}
