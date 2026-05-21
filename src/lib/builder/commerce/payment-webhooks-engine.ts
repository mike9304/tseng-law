import { createHash } from 'node:crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { get, list, put } from '@vercel/blob';
import {
  COMMERCE_PAYMENT_WEBHOOK_VERSION,
  normalizeCommercePaymentWebhookEvent,
  type CommercePaymentWebhookEvent,
  type NormalizedCommercePaymentWebhookInput,
} from './payment-webhooks-shared';
import { applyOrderPaymentWebhook, findOrderByPaymentReference } from './orders-engine';
import type { CommerceOrder } from './orders-shared';
import { runOrderBillingAutomation } from '@/lib/builder/billing-document-automation';

type CommerceBackend = 'blob' | 'file';
type StoredPaymentWebhookEvent = CommercePaymentWebhookEvent & { deleted?: boolean };

const PAYMENT_WEBHOOK_PREFIX = 'builder-commerce/payment-webhooks/';
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
  return `pwh_${hash}`;
}

function eventBlobPath(eventId: string): string {
  return `${PAYMENT_WEBHOOK_PREFIX}${eventId}.json`;
}

function eventFilePath(eventId: string): string {
  return path.join(commerceRoot(), 'payment-webhooks', `${eventId}.json`);
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

async function listEventJson(): Promise<StoredPaymentWebhookEvent[]> {
  if (getBackend() === 'blob') {
    const result = await list({ prefix: PAYMENT_WEBHOOK_PREFIX });
    const values: StoredPaymentWebhookEvent[] = [];
    for (const blob of result.blobs) {
      const eventId = path.basename(blob.pathname, '.json');
      const parsed = await readJson<StoredPaymentWebhookEvent>(blob.pathname, eventFilePath(eventId));
      if (parsed && !parsed.deleted) values.push(parsed);
    }
    return values;
  }

  const dir = path.join(commerceRoot(), 'payment-webhooks');
  const files = await fs.readdir(dir).catch(() => []);
  const values: StoredPaymentWebhookEvent[] = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const eventId = path.basename(file, '.json');
    const parsed = await readJson<StoredPaymentWebhookEvent>(eventBlobPath(eventId), eventFilePath(eventId));
    if (parsed && !parsed.deleted) values.push(parsed);
  }
  return values;
}

function eventVisibleOrder(order: CommerceOrder | null): Pick<CommerceOrder, 'orderId' | 'currency' | 'totals' | 'payment'> | null {
  if (!order) return null;
  return {
    orderId: order.orderId,
    currency: order.currency,
    totals: order.totals,
    payment: order.payment,
  };
}

function isAmountMismatch(event: CommercePaymentWebhookEvent, order: CommerceOrder): boolean {
  return typeof event.amountCents === 'number' && event.amountCents !== order.totals.grandTotalCents;
}

function isCurrencyMismatch(event: CommercePaymentWebhookEvent, order: CommerceOrder): boolean {
  return Boolean(event.currency && event.currency !== order.currency);
}

async function processStoredEvent(
  event: CommercePaymentWebhookEvent,
  options: { replay?: boolean } = {},
): Promise<{ event: CommercePaymentWebhookEvent; order: CommerceOrder | null; changed: boolean; reason?: string }> {
  const now = new Date().toISOString();
  const order = await findOrderByPaymentReference(event.paymentReferenceId);
  if (!order) {
    const next: CommercePaymentWebhookEvent = {
      ...event,
      status: 'unmatched',
      orderId: undefined,
      error: 'order_not_found',
      replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
      lastReplayAt: options.replay ? now : event.lastReplayAt,
      processedAt: now,
      updatedAt: now,
    };
    await savePaymentWebhookEvent(next);
    return { event: next, order: null, changed: false, reason: 'order_not_found' };
  }

  if (isAmountMismatch(event, order) || isCurrencyMismatch(event, order)) {
    const next: CommercePaymentWebhookEvent = {
      ...event,
      status: 'failed',
      orderId: order.orderId,
      error: isCurrencyMismatch(event, order) ? 'currency_mismatch' : 'amount_mismatch',
      replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
      lastReplayAt: options.replay ? now : event.lastReplayAt,
      processedAt: now,
      updatedAt: now,
    };
    await savePaymentWebhookEvent(next);
    return { event: next, order, changed: false, reason: next.error };
  }

  if (
    (order.payment.status === 'paid' || order.payment.status === 'partially_refunded' || order.payment.status === 'refunded')
    && event.paymentStatus === 'failed'
  ) {
    const next: CommercePaymentWebhookEvent = {
      ...event,
      status: 'ignored',
      orderId: order.orderId,
      error: 'paid_payment_locked',
      replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
      lastReplayAt: options.replay ? now : event.lastReplayAt,
      processedAt: now,
      updatedAt: now,
    };
    await savePaymentWebhookEvent(next);
    return { event: next, order, changed: false, reason: 'paid_payment_locked' };
  }

  const result = await applyOrderPaymentWebhook({
    referenceId: event.paymentReferenceId,
    paymentStatus: event.paymentStatus,
    eventId: event.providerEventId,
    eventType: event.eventType,
    provider: event.provider,
  });
  const next: CommercePaymentWebhookEvent = {
    ...event,
    status: result.changed || result.reason === 'payment_status_unchanged' ? 'processed' : 'ignored',
    orderId: result.order?.orderId ?? order.orderId,
    error: result.changed ? undefined : result.reason,
    replayCount: options.replay ? event.replayCount + 1 : event.replayCount,
    lastReplayAt: options.replay ? now : event.lastReplayAt,
    processedAt: now,
    updatedAt: now,
  };
  await savePaymentWebhookEvent(next);
  let automatedOrder = result.order ?? order;
  if (automatedOrder.payment.status === 'paid' && event.paymentStatus === 'paid') {
    try {
      const billingAutomation = await runOrderBillingAutomation(automatedOrder.orderId, { trigger: 'paid' });
      if (billingAutomation?.owner) automatedOrder = billingAutomation.owner;
    } catch (error) {
      console.error('[commerce/payment-webhooks] billing automation failed:', error);
    }
  }

  return {
    event: next,
    order: automatedOrder,
    changed: result.changed,
    reason: result.reason,
  };
}

export async function savePaymentWebhookEvent(event: CommercePaymentWebhookEvent): Promise<CommercePaymentWebhookEvent> {
  const normalized = normalizeCommercePaymentWebhookEvent(event);
  if (!normalized) throw new Error('commerce_payment_webhook_invalid');
  await writeJson(eventBlobPath(normalized.eventId), eventFilePath(normalized.eventId), normalized);
  return normalized;
}

export async function loadPaymentWebhookEvent(eventId: string): Promise<CommercePaymentWebhookEvent | null> {
  const parsed = await readJson<StoredPaymentWebhookEvent>(eventBlobPath(eventId), eventFilePath(eventId));
  if (!parsed || parsed.deleted) return null;
  return normalizeCommercePaymentWebhookEvent(parsed);
}

export async function listPaymentWebhookEvents(options: {
  q?: string;
  provider?: string;
  status?: string;
} = {}): Promise<CommercePaymentWebhookEvent[]> {
  const q = options.q?.trim().toLowerCase();
  return (await listEventJson())
    .map((event) => normalizeCommercePaymentWebhookEvent(event))
    .filter((event): event is CommercePaymentWebhookEvent => Boolean(event))
    .filter((event) => !options.provider || options.provider === 'all' || event.provider === options.provider)
    .filter((event) => !options.status || options.status === 'all' || event.status === options.status)
    .filter((event) => {
      if (!q) return true;
      return [
        event.eventId,
        event.providerEventId,
        event.eventType,
        event.paymentReferenceId,
        event.orderId ?? '',
        event.status,
        event.error ?? '',
      ].some((value) => value.toLowerCase().includes(q));
    })
    .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt));
}

export function summarizePaymentWebhookEvents(events: CommercePaymentWebhookEvent[]) {
  return {
    total: events.length,
    processed: events.filter((event) => event.status === 'processed').length,
    failed: events.filter((event) => event.status === 'failed').length,
    unmatched: events.filter((event) => event.status === 'unmatched').length,
    ignored: events.filter((event) => event.status === 'ignored').length,
    replayed: events.filter((event) => event.replayCount > 0).length,
  };
}

export async function receivePaymentWebhookEvent(
  input: NormalizedCommercePaymentWebhookInput,
): Promise<{ event: CommercePaymentWebhookEvent; order: ReturnType<typeof eventVisibleOrder>; duplicate: boolean; changed: boolean; reason?: string }> {
  const eventId = eventStorageId(input.provider, input.providerEventId);
  const existing = await loadPaymentWebhookEvent(eventId);
  if (existing) {
    let order = existing.orderId ? await findOrderByPaymentReference(existing.paymentReferenceId) : null;
    if (order?.payment.status === 'paid' && existing.paymentStatus === 'paid') {
      try {
        const billingAutomation = await runOrderBillingAutomation(order.orderId, { trigger: 'paid' });
        if (billingAutomation?.owner) order = billingAutomation.owner;
      } catch (error) {
        console.error('[commerce/payment-webhooks] duplicate billing automation failed:', error);
      }
    }
    return {
      event: existing,
      order: eventVisibleOrder(order),
      duplicate: true,
      changed: false,
      reason: 'duplicate_event',
    };
  }

  const now = new Date().toISOString();
  const event: CommercePaymentWebhookEvent = {
    version: COMMERCE_PAYMENT_WEBHOOK_VERSION,
    eventId,
    provider: input.provider,
    providerEventId: input.providerEventId,
    eventType: input.eventType,
    paymentReferenceId: input.paymentReferenceId,
    paymentStatus: input.paymentStatus,
    amountCents: input.amountCents,
    currency: input.currency,
    status: 'unmatched',
    replayCount: 0,
    signatureVerified: true,
    payload: input.payload,
    receivedAt: now,
    updatedAt: now,
  };
  await savePaymentWebhookEvent(event);
  const processed = await processStoredEvent(event);
  return {
    event: processed.event,
    order: eventVisibleOrder(processed.order),
    duplicate: false,
    changed: processed.changed,
    reason: processed.reason,
  };
}

export async function replayPaymentWebhookEvent(
  eventId: string,
): Promise<{ event: CommercePaymentWebhookEvent | null; order: ReturnType<typeof eventVisibleOrder>; changed: boolean; reason?: string }> {
  const existing = await loadPaymentWebhookEvent(eventId);
  if (!existing) return { event: null, order: null, changed: false, reason: 'event_not_found' };
  const processed = await processStoredEvent(existing, { replay: true });
  return {
    event: processed.event,
    order: eventVisibleOrder(processed.order),
    changed: processed.changed,
    reason: processed.reason,
  };
}
