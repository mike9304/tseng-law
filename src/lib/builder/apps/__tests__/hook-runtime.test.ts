import { rm } from 'fs/promises';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchAppHookEvent } from '@/lib/builder/apps/hook-runtime';
import {
  __resetHooksForTests,
  registerAppHook,
  registerAppHookRecord,
} from '@/lib/builder/apps/hooks-registry';
import { clearAppHookDeliveriesForTests } from '@/lib/builder/apps/hook-deliveries';
import type { AppHookEvent } from '@/lib/builder/apps/hooks-model';
import { readSecretPlaintextById } from '@/lib/builder/dev/secrets-store';
import { clearLogs, listLogs } from '@/lib/builder/dev/logs-store';

vi.mock('@/lib/builder/dev/secrets-store', () => ({
  readSecretPlaintextById: vi.fn(),
}));

// 파일별 격리 경로 — 병렬 워커가 공유 레지스트리 파일을 경쟁하지 않도록.
const REGISTRY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-runtime-test-registrations.json');
const DELIVERY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-runtime-test-deliveries.json');
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

describe('hook-runtime', () => {
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

  it('dispatches live handlers and stored code hooks for the same lifecycle event', async () => {
    const liveCalls: string[] = [];
    await registerAppHook({
      appId: 'live-app',
      kind: 'publish.completed',
      hookId: 'live-app-publish-1',
      handler: (event, ctx) => {
        liveCalls.push(event.kind);
        ctx.log('live handler ran');
      },
    });
    await registerAppHookRecord({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      kind: 'publish.completed',
      priority: 10,
      registeredAt: new Date().toISOString(),
      codeSecretId: 'secret-stored-hook',
    });
    readSecretPlaintextByIdMock.mockResolvedValue(
      'ctx.log("stored " + event.kind + " " + event.payload.pageId); return { pageId: event.payload.pageId, hookId: app.hookId };',
    );

    const summary = await dispatchAppHookEvent(publishEvent());

    expect(liveCalls).toEqual(['publish.completed']);
    expect(summary).toMatchObject({
      kind: 'publish.completed',
      invoked: 2,
      failed: 0,
      live: { invoked: 1, failed: 0 },
      stored: { invoked: 1, failed: 0, skipped: 1 },
    });
    expect(summary.stored.hooks[0]).toMatchObject({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      ok: true,
      result: { pageId: 'page-1', hookId: 'stored-app-publish-1' },
    });
    expect(listLogs('app', { reference: 'stored-app:stored-app-publish-1' })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: 'log',
          message: 'stored publish.completed page-1',
        }),
      ]),
    );
  });

  it('supports stored handler declarations and isolates stored hook failures', async () => {
    await registerAppHookRecord({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      kind: 'publish.completed',
      priority: 10,
      registeredAt: new Date().toISOString(),
      codeSecretId: 'secret-stored-hook',
    });
    readSecretPlaintextByIdMock.mockResolvedValue(
      'function handler(event, ctx, app) { ctx.warn(app.appId + ":" + event.payload.revision); throw new Error("stored boom"); }',
    );

    const summary = await dispatchAppHookEvent(publishEvent());

    expect(summary).toMatchObject({
      kind: 'publish.completed',
      invoked: 0,
      failed: 1,
      live: { invoked: 0, failed: 0 },
      stored: { invoked: 0, failed: 1, skipped: 0 },
    });
    expect(summary.stored.hooks[0]).toMatchObject({
      hookId: 'stored-app-publish-1',
      appId: 'stored-app',
      ok: false,
      error: 'stored boom',
    });
    expect(listLogs('app', { reference: 'stored-app:stored-app-publish-1' })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ level: 'warn', message: 'stored-app:7' }),
        expect.objectContaining({ level: 'error', message: expect.stringContaining('stored boom') }),
      ]),
    );
  });
});
