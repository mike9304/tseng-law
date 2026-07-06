import { rm } from 'fs/promises';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  dispatchAppHookEvent,
  retryStoredAppHookDelivery,
} from '@/lib/builder/apps/hook-runtime';
import {
  clearAppHookDeliveriesForTests,
  listStoredAppHookDeliveries,
} from '@/lib/builder/apps/hook-deliveries';
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
const REGISTRY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-deliveries-test-registrations.json');
const DELIVERY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-deliveries-test.json');
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

function firstDeliveryId(summary: Awaited<ReturnType<typeof dispatchAppHookEvent>>): string {
  const first = summary.stored.hooks[0];
  if (!first || typeof first.deliveryId !== 'string') throw new Error('Expected stored delivery id');
  return first.deliveryId;
}

describe('app hook deliveries', () => {
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

  it('records failed stored hook deliveries and retries the same event', async () => {
    await registerAppHookRecord({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      kind: 'publish.completed',
      priority: 10,
      registeredAt: new Date().toISOString(),
      codeSecretId: 'secret-stored-hook',
    });
    readSecretPlaintextByIdMock.mockResolvedValue(
      'function handler(event) { throw new Error("stored delivery failed for " + event.payload.pageId); }',
    );

    const summary = await dispatchAppHookEvent(publishEvent());
    const deliveryId = firstDeliveryId(summary);
    const deliveries = await listStoredAppHookDeliveries({
      hookId: 'stored-app-publish-1',
      status: 'failed',
      limit: 10,
    });

    expect(deliveries).toEqual([
      expect.objectContaining({
        deliveryId,
        hookId: 'stored-app-publish-1',
        appId: 'stored-app',
        kind: 'publish.completed',
        status: 'failed',
        attempt: 1,
        error: 'stored delivery failed for page-1',
        event: publishEvent(),
      }),
    ]);

    const retry = await retryStoredAppHookDelivery(deliveryId);

    expect(retry.status).toBe('retried');
    if (retry.status !== 'retried') throw new Error('Expected retry result');
    expect(retry.delivery).toMatchObject({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      kind: 'publish.completed',
      status: 'failed',
      attempt: 2,
      error: 'stored delivery failed for page-1',
      event: publishEvent(),
    });
    expect(readSecretPlaintextByIdMock).toHaveBeenCalledTimes(2);
  });
});
