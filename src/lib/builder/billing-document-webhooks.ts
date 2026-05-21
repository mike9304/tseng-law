import { createHash } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import { runBookingBillingAutomation, runOrderBillingAutomation } from './billing-document-automation';
import {
  settleBillingDocumentHostedPayment,
  type BuilderBillingDocumentRow,
  type BillingDocumentSource,
} from './billing-documents';
import {
  queueBillingPaymentReceivedNotification,
} from './commerce/notifications-engine';
import type {
  BillingDocumentHostedPaymentStatus,
  BillingDocumentStripeWebhookPayment,
} from './billing-document-hosted-payments';
import type { CommerceOrder } from './commerce/orders-shared';
import type { Booking } from './bookings/types';

type CommerceBackend = 'blob' | 'file';
type StoredBillingWebhookEvent = BillingDocumentWebhookEvent & { deleted?: boolean };

export const BILLING_DOCUMENT_WEBHOOK_VERSION = 1;

export type BillingDocumentWebhookStatus = 'processed' | 'failed' | 'ignored';

export interface BillingDocumentWebhookEvent {
  version: typeof BILLING_DOCUMENT_WEBHOOK_VERSION;
  eventId: string;
  provider: 'stripe';
  providerEventId: string;
  eventType: string;
  source: BillingDocumentSource;
  ownerId: string;
  documentId: string;
  paymentLinkId: string;
  documentNumber?: string;
  providerSessionId?: string;
  providerPaymentId?: string;
  paymentStatus: BillingDocumentHostedPaymentStatus;
  amount: number;
  currency: string;
  status: BillingDocumentWebhookStatus;
  changed: boolean;
  error?: string;
  replayCount: number;
  signatureVerified: boolean;
  receivedAt: string;
  processedAt?: string;
  lastReplayAt?: string;
  updatedAt: string;
}

const BILLING_WEBHOOK_PREFIX = 'builder-commerce/billing-document-webhooks/';
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

function eventStorageId(provider: string, providerEventId: string): string {
  const hash = createHash('sha256').update(`${provider}:${providerEventId}`).digest('hex').slice(0, 32);
  return `bdwh_${hash}`;
}

function eventBlobPath(eventId: string): string {
  return `${BILLING_WEBHOOK_PREFIX}${eventId}.json`;
}

function eventFilePath(eventId: string): string {
  return path.join(commerceRoot(), 'billing-document-webhooks', `${eventId}.json`);
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

async function listEventJson(): Promise<StoredBillingWebhookEvent[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: BILLING_WEBHOOK_PREFIX });
    const values: StoredBillingWebhookEvent[] = [];
    for (const blob of result.blobs) {
      const eventId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredBillingWebhookEvent>(blob.pathname, eventFilePath(eventId));
      if (parsed && !parsed.deleted) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(commerceRoot(), 'billing-document-webhooks');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredBillingWebhookEvent[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const eventId = path.basename(file, '.json');
    const parsed = await readJson<StoredBillingWebhookEvent>(eventBlobPath(eventId), eventFilePath(eventId));
    if (parsed && !parsed.deleted) values.push(parsed);
  }
  return values;
}

function normalizeStatus(value: unknown): BillingDocumentWebhookStatus {
  return value === 'processed' || value === 'failed' || value === 'ignored' ? value : 'failed';
}

function normalizePaymentStatus(value: unknown): BillingDocumentHostedPaymentStatus {
  return value === 'paid' || value === 'failed' || value === 'canceled' || value === 'requires_action'
    ? value
    : 'failed';
}

export function normalizeBillingDocumentWebhookEvent(input: unknown): BillingDocumentWebhookEvent | null {
  if (!input || typeof input !== 'object') return null;
  const source = input as Partial<BillingDocumentWebhookEvent>;
  if (
    source.version !== BILLING_DOCUMENT_WEBHOOK_VERSION
    || !source.eventId
    || source.provider !== 'stripe'
    || !source.providerEventId
    || !source.eventType
    || (source.source !== 'order' && source.source !== 'booking')
    || !source.ownerId
    || !source.documentId
    || !source.paymentLinkId
  ) {
    return null;
  }
  const amount = Number(source.amount);
  const now = new Date().toISOString();
  return {
    version: BILLING_DOCUMENT_WEBHOOK_VERSION,
    eventId: String(source.eventId),
    provider: 'stripe',
    providerEventId: String(source.providerEventId),
    eventType: String(source.eventType),
    source: source.source,
    ownerId: String(source.ownerId),
    documentId: String(source.documentId),
    paymentLinkId: String(source.paymentLinkId),
    documentNumber: source.documentNumber ? String(source.documentNumber) : undefined,
    providerSessionId: source.providerSessionId ? String(source.providerSessionId) : undefined,
    providerPaymentId: source.providerPaymentId ? String(source.providerPaymentId) : undefined,
    paymentStatus: normalizePaymentStatus(source.paymentStatus),
    amount: Number.isFinite(amount) && amount >= 0 ? Math.floor(amount) : 0,
    currency: String(source.currency ?? '').trim().toUpperCase(),
    status: normalizeStatus(source.status),
    changed: Boolean(source.changed),
    error: source.error ? String(source.error) : undefined,
    replayCount: Number.isFinite(Number(source.replayCount)) ? Math.max(0, Math.floor(Number(source.replayCount))) : 0,
    signatureVerified: source.signatureVerified !== false,
    receivedAt: typeof source.receivedAt === 'string' ? source.receivedAt : now,
    processedAt: typeof source.processedAt === 'string' ? source.processedAt : undefined,
    lastReplayAt: typeof source.lastReplayAt === 'string' ? source.lastReplayAt : undefined,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : now,
  };
}

function eventToPaymentInput(event: BillingDocumentWebhookEvent): BillingDocumentStripeWebhookPayment {
  return {
    source: event.source,
    ownerId: event.ownerId,
    documentId: event.documentId,
    paymentLinkId: event.paymentLinkId,
    documentNumber: event.documentNumber,
    provider: 'stripe',
    providerEventId: event.providerEventId,
    providerSessionId: event.providerSessionId,
    providerPaymentId: event.providerPaymentId,
    eventType: event.eventType,
    status: event.paymentStatus,
    amount: event.amount,
    currency: event.currency,
  };
}

function eventFromInput(
  input: BillingDocumentStripeWebhookPayment,
  options: { signatureVerified?: boolean } = {},
): BillingDocumentWebhookEvent {
  const now = new Date().toISOString();
  return {
    version: BILLING_DOCUMENT_WEBHOOK_VERSION,
    eventId: eventStorageId(input.provider, input.providerEventId),
    provider: 'stripe',
    providerEventId: input.providerEventId,
    eventType: input.eventType,
    source: input.source,
    ownerId: input.ownerId,
    documentId: input.documentId,
    paymentLinkId: input.paymentLinkId,
    documentNumber: input.documentNumber,
    providerSessionId: input.providerSessionId,
    providerPaymentId: input.providerPaymentId,
    paymentStatus: input.status,
    amount: input.amount,
    currency: input.currency.toUpperCase(),
    status: 'ignored',
    changed: false,
    replayCount: 0,
    signatureVerified: options.signatureVerified !== false,
    receivedAt: now,
    updatedAt: now,
  };
}

function visibleOrder(order: CommerceOrder | null): Pick<CommerceOrder, 'orderId' | 'payment'> | null {
  return order ? { orderId: order.orderId, payment: order.payment } : null;
}

function visibleBooking(booking: Booking | null): Pick<Booking, 'bookingId' | 'paymentStatus' | 'paymentIntentId'> | null {
  return booking ? {
    bookingId: booking.bookingId,
    paymentStatus: booking.paymentStatus,
    paymentIntentId: booking.paymentIntentId,
  } : null;
}

function visibleDocument(row: BuilderBillingDocumentRow | null): Pick<BuilderBillingDocumentRow, 'source' | 'ownerId' | 'documentId' | 'number' | 'paymentStatus' | 'paymentLinkStatus'> | null {
  return row ? {
    source: row.source,
    ownerId: row.ownerId,
    documentId: row.documentId,
    number: row.number,
    paymentStatus: row.paymentStatus,
    paymentLinkStatus: row.paymentLinkStatus,
  } : null;
}

export async function saveBillingDocumentWebhookEvent(
  event: BillingDocumentWebhookEvent,
): Promise<BillingDocumentWebhookEvent> {
  const normalized = normalizeBillingDocumentWebhookEvent(event);
  if (!normalized) throw new Error('billing_document_webhook_invalid');
  await writeJson(eventBlobPath(normalized.eventId), eventFilePath(normalized.eventId), normalized);
  return normalized;
}

export async function loadBillingDocumentWebhookEvent(eventId: string): Promise<BillingDocumentWebhookEvent | null> {
  const parsed = await readJson<StoredBillingWebhookEvent>(eventBlobPath(eventId), eventFilePath(eventId));
  if (!parsed || parsed.deleted) return null;
  return normalizeBillingDocumentWebhookEvent(parsed);
}

export async function listBillingDocumentWebhookEvents(options: {
  q?: string;
  status?: string;
} = {}): Promise<BillingDocumentWebhookEvent[]> {
  const q = options.q?.trim().toLowerCase();
  return (await listEventJson())
    .map((event) => normalizeBillingDocumentWebhookEvent(event))
    .filter((event): event is BillingDocumentWebhookEvent => Boolean(event))
    .filter((event) => !options.status || options.status === 'all' || event.status === options.status)
    .filter((event) => {
      if (!q) return true;
      return [
        event.eventId,
        event.providerEventId,
        event.eventType,
        event.source,
        event.ownerId,
        event.documentId,
        event.documentNumber ?? '',
        event.paymentLinkId,
        event.status,
        event.error ?? '',
      ].some((value) => value.toLowerCase().includes(q));
    })
    .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
}

export function summarizeBillingDocumentWebhookEvents(events: BillingDocumentWebhookEvent[]) {
  return {
    total: events.length,
    processed: events.filter((event) => event.status === 'processed').length,
    failed: events.filter((event) => event.status === 'failed').length,
    ignored: events.filter((event) => event.status === 'ignored').length,
    replayed: events.filter((event) => event.replayCount > 0).length,
  };
}

async function processStoredEvent(
  event: BillingDocumentWebhookEvent,
  options: { replay?: boolean } = {},
): Promise<{
  event: BillingDocumentWebhookEvent;
  document: ReturnType<typeof visibleDocument>;
  order: ReturnType<typeof visibleOrder>;
  booking: ReturnType<typeof visibleBooking>;
  changed: boolean;
  reason?: string;
}> {
  const now = new Date().toISOString();
  if (event.paymentStatus !== 'paid') {
    const next = await saveBillingDocumentWebhookEvent({
      ...event,
      status: 'ignored',
      changed: false,
      error: event.paymentStatus,
      replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
      lastReplayAt: options.replay ? now : event.lastReplayAt,
      processedAt: now,
      updatedAt: now,
    });
    return { event: next, document: null, order: null, booking: null, changed: false, reason: event.paymentStatus };
  }

  const settled = await settleBillingDocumentHostedPayment(eventToPaymentInput(event));
  if (settled.error) {
    const next = await saveBillingDocumentWebhookEvent({
      ...event,
      status: 'failed',
      changed: false,
      error: settled.error,
      replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
      lastReplayAt: options.replay ? now : event.lastReplayAt,
      processedAt: now,
      updatedAt: now,
    });
    return {
      event: next,
      document: visibleDocument(settled.row),
      order: visibleOrder(settled.order),
      booking: visibleBooking(settled.booking),
      changed: false,
      reason: settled.error,
    };
  }

  let receiptEmailQueued = false;
  if (settled.order?.payment.status === 'paid') {
    try {
      const billingAutomation = await runOrderBillingAutomation(settled.order.orderId, { trigger: 'paid' });
      receiptEmailQueued = Boolean(billingAutomation?.actions.some((action) => action.type === 'receipt' && action.emailed));
    } catch (error) {
      console.error('[billing-document-webhooks] order billing automation failed:', error);
    }
  }
  if (settled.booking?.paymentStatus === 'paid') {
    try {
      const billingAutomation = await runBookingBillingAutomation(settled.booking.bookingId, { trigger: 'paid' });
      receiptEmailQueued = Boolean(billingAutomation?.actions.some((action) => action.type === 'receipt' && action.emailed));
    } catch (error) {
      console.error('[billing-document-webhooks] booking billing automation failed:', error);
    }
  }
  if (settled.changed && settled.row) {
    await queueBillingPaymentReceivedNotification(settled.row, {
      amount: event.amount,
      method: 'hosted',
      paymentId: event.providerEventId,
      provider: event.provider,
      reference: event.providerPaymentId ?? event.providerSessionId,
      receiptEmailQueued,
    }).catch((error) => console.error('[billing-document-webhooks] payment notification policy update failed:', error));
  }

  const next = await saveBillingDocumentWebhookEvent({
    ...event,
    status: 'processed',
    changed: settled.changed,
    error: undefined,
    replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
    lastReplayAt: options.replay ? now : event.lastReplayAt,
    processedAt: now,
    updatedAt: now,
  });
  return {
    event: next,
    document: visibleDocument(settled.row),
    order: visibleOrder(settled.order),
    booking: visibleBooking(settled.booking),
    changed: settled.changed,
  };
}

export async function receiveBillingDocumentWebhookEvent(
  input: BillingDocumentStripeWebhookPayment,
  options: { signatureVerified?: boolean } = {},
): Promise<{
  event: BillingDocumentWebhookEvent;
  document: ReturnType<typeof visibleDocument>;
  order: ReturnType<typeof visibleOrder>;
  booking: ReturnType<typeof visibleBooking>;
  duplicate: boolean;
  changed: boolean;
  reason?: string;
}> {
  const event = eventFromInput(input, options);
  const existing = await loadBillingDocumentWebhookEvent(event.eventId);
  if (existing) {
    return {
      event: existing,
      document: null,
      order: null,
      booking: null,
      duplicate: true,
      changed: false,
      reason: 'duplicate_event',
    };
  }

  await saveBillingDocumentWebhookEvent(event);
  const processed = await processStoredEvent(event);
  return {
    ...processed,
    duplicate: false,
  };
}

export async function replayBillingDocumentWebhookEvent(eventId: string): Promise<{
  event: BillingDocumentWebhookEvent | null;
  document: ReturnType<typeof visibleDocument>;
  order: ReturnType<typeof visibleOrder>;
  booking: ReturnType<typeof visibleBooking>;
  changed: boolean;
  reason?: string;
}> {
  const existing = await loadBillingDocumentWebhookEvent(eventId);
  if (!existing) return { event: null, document: null, order: null, booking: null, changed: false, reason: 'event_not_found' };
  return processStoredEvent(existing, { replay: true });
}
