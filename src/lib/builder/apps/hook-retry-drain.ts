import {
  listStoredAppHookDeliveries,
  type StoredAppHookDeliveryRecord,
} from './hook-deliveries';
import { retryStoredAppHookDelivery } from './hook-runtime';

export const APP_HOOK_RETRY_MAX_ATTEMPTS = 5;

const DEFAULT_RETRY_LIMIT = 25;
const MAX_RETRY_LIMIT = 100;
const DELIVERY_SCAN_LIMIT = 500;
const BACKOFF_MINUTES_BY_ATTEMPT: Readonly<Record<number, number>> = {
  1: 1,
  2: 5,
  3: 30,
  4: 240,
};

export interface StoredAppHookRetryDrainOptions {
  readonly now?: Date;
  readonly limit?: number;
}

export interface StoredAppHookRetryDrainResult {
  readonly failedTotal: number;
  readonly retried: number;
  readonly skipped: number;
  readonly gaveUp: number;
  readonly unavailable: number;
}

function normalizeRetryLimit(limit?: number): number {
  if (typeof limit !== 'number' || !Number.isFinite(limit)) return DEFAULT_RETRY_LIMIT;
  return Math.max(1, Math.min(MAX_RETRY_LIMIT, Math.trunc(limit)));
}

function backoffMsForAttempt(attempt: number): number {
  return (BACKOFF_MINUTES_BY_ATTEMPT[attempt] ?? 240) * 60_000;
}

function retryChildIds(deliveries: readonly StoredAppHookDeliveryRecord[]): Set<string> {
  const ids = new Set<string>();
  for (const delivery of deliveries) {
    if (delivery.retryOfDeliveryId) ids.add(delivery.retryOfDeliveryId);
  }
  return ids;
}

function isRetryDue(delivery: StoredAppHookDeliveryRecord, nowMs: number): boolean {
  const lastTriedMs = Date.parse(delivery.updatedAt);
  if (!Number.isFinite(lastTriedMs)) return false;
  return nowMs - lastTriedMs >= backoffMsForAttempt(delivery.attempt);
}

function oldestFirst(
  left: StoredAppHookDeliveryRecord,
  right: StoredAppHookDeliveryRecord,
): number {
  return left.createdAt.localeCompare(right.createdAt);
}

export async function runDueStoredAppHookRetries(
  options: StoredAppHookRetryDrainOptions = {},
): Promise<StoredAppHookRetryDrainResult> {
  const nowMs = options.now?.getTime() ?? Date.now();
  const limit = normalizeRetryLimit(options.limit);
  const deliveries = await listStoredAppHookDeliveries({ limit: DELIVERY_SCAN_LIMIT });
  const children = retryChildIds(deliveries);
  const failed = deliveries
    .filter((delivery) => delivery.status === 'failed')
    .sort(oldestFirst);
  let retried = 0;
  let skipped = 0;
  let gaveUp = 0;
  let unavailable = 0;

  for (const delivery of failed) {
    if (children.has(delivery.deliveryId)) {
      skipped += 1;
      continue;
    }
    if (delivery.attempt >= APP_HOOK_RETRY_MAX_ATTEMPTS) {
      gaveUp += 1;
      continue;
    }
    if (!isRetryDue(delivery, nowMs) || retried >= limit) {
      skipped += 1;
      continue;
    }
    const result = await retryStoredAppHookDelivery(delivery.deliveryId);
    switch (result.status) {
      case 'retried':
        retried += 1;
        break;
      case 'not-found':
      case 'unavailable':
        unavailable += 1;
        break;
    }
  }

  return {
    failedTotal: failed.length,
    retried,
    skipped,
    gaveUp,
    unavailable,
  };
}
