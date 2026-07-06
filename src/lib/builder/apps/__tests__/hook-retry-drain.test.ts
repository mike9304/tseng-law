import { rm } from 'fs/promises';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchAppHookEvent } from '@/lib/builder/apps/hook-runtime';
import {
  clearAppHookDeliveriesForTests,
  listStoredAppHookDeliveries,
  recordStoredAppHookDelivery,
} from '@/lib/builder/apps/hook-deliveries';
import {
  APP_HOOK_RETRY_MAX_ATTEMPTS,
  runDueStoredAppHookRetries,
} from '@/lib/builder/apps/hook-retry-drain';
import {
  __resetHooksForTests,
  registerAppHookRecord,
} from '@/lib/builder/apps/hooks-registry';
import type { AppHookEvent } from '@/lib/builder/apps/hooks-model';
import { readSecretPlaintextById } from '@/lib/builder/dev/secrets-store';
import { clearLogs } from '@/lib/builder/dev/logs-store';

vi.mock('@/lib/builder/dev/secrets-store', () => ({
  readSecretPlaintextById: vi.fn(),
}));

// 파일별 격리 경로 — 병렬 워커가 공유 레지스트리 파일을 경쟁하지 않도록.
const REGISTRY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-retry-drain-test-registrations.json');
const DELIVERY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-retry-drain-test-deliveries.json');
const readSecretPlaintextByIdMock = vi.mocked(readSecretPlaintextById);

async function cleanStore(): Promise<void> {
  process.env.BUILDER_APP_HOOK_DELIVERIES_PATH = DELIVERY_FILE;
  process.env.BUILDER_APP_HOOK_REGISTRY_PATH = REGISTRY_FILE;
  await rm(REGISTRY_FILE, { force: true });
  clearAppHookDeliveriesForTests();
}

function publishEvent(): AppHookEvent {
  return {
    kind: 'publish.completed',
    payload: { siteId: 'site-a', pageId: 'page-1', revision: 7 },
  };
}

function futureDate(minutes: number): Date {
  return new Date(Date.now() + minutes * 60_000);
}

describe('app hook retry drain', () => {
  beforeEach(async () => {
    __resetHooksForTests();
    clearLogs('app');
    await cleanStore();
    readSecretPlaintextByIdMock.mockReset();
  });

  afterEach(async () => {
    __resetHooksForTests();
    clearLogs('app');
    await cleanStore();
    delete process.env.BUILDER_APP_HOOK_DELIVERIES_PATH;
    delete process.env.BUILDER_APP_HOOK_REGISTRY_PATH;
    vi.clearAllMocks();
  });

  it('retries failed stored hook deliveries only after the backoff window', async () => {
    await registerAppHookRecord({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      kind: 'publish.completed',
      priority: 10,
      registeredAt: new Date().toISOString(),
      codeSecretId: 'secret-stored-hook',
    });
    readSecretPlaintextByIdMock.mockResolvedValue(
      'function handler(event) { throw new Error("retry drain failed for " + event.payload.pageId); }',
    );
    const summary = await dispatchAppHookEvent(publishEvent());
    const first = summary.stored.hooks[0];
    if (!first || typeof first.deliveryId !== 'string') throw new Error('Expected first delivery id');

    const early = await runDueStoredAppHookRetries({ now: new Date(), limit: 5 });

    expect(early).toMatchObject({
      failedTotal: 1,
      retried: 0,
      skipped: 1,
      gaveUp: 0,
      unavailable: 0,
    });

    const due = await runDueStoredAppHookRetries({ now: futureDate(2), limit: 5 });
    const deliveries = await listStoredAppHookDeliveries({ hookId: 'stored-app-publish-1', limit: 10 });
    const retried = deliveries.find((delivery) => delivery.attempt === 2);

    expect(due).toMatchObject({
      failedTotal: 1,
      retried: 1,
      skipped: 0,
      gaveUp: 0,
      unavailable: 0,
    });
    expect(retried).toMatchObject({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      status: 'failed',
      attempt: 2,
      retryOfDeliveryId: first.deliveryId,
      error: 'retry drain failed for page-1',
    });
    expect(readSecretPlaintextByIdMock).toHaveBeenCalledTimes(2);

    const duplicateParent = await runDueStoredAppHookRetries({ now: futureDate(3), limit: 5 });

    expect(duplicateParent.retried).toBe(0);
    expect(duplicateParent.skipped).toBe(2);
    expect(readSecretPlaintextByIdMock).toHaveBeenCalledTimes(2);
  });

  it('gives up failed deliveries that already reached the max attempt count', async () => {
    await recordStoredAppHookDelivery({
      appId: 'stored-app',
      hookId: 'stored-app-publish-1',
      kind: 'publish.completed',
      event: publishEvent(),
      attempt: APP_HOOK_RETRY_MAX_ATTEMPTS,
      outcome: {
        ok: false,
        error: 'final failure',
        logCount: 0,
      },
    });

    const result = await runDueStoredAppHookRetries({ now: futureDate(300), limit: 5 });

    expect(result).toMatchObject({
      failedTotal: 1,
      retried: 0,
      skipped: 0,
      gaveUp: 1,
      unavailable: 0,
    });
    expect(readSecretPlaintextByIdMock).not.toHaveBeenCalled();
  });
});
