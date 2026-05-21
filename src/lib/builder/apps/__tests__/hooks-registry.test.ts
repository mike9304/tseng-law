import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rm, readFile } from 'fs/promises';
import path from 'path';
import {
  __resetHooksForTests,
  dispatchAppHook,
  flushAppHookWrites,
  listRegisteredAppHooks,
  registerAppHook,
  registerAppHookRecord,
  unregisterAppHook,
  unregisterAppHooks,
} from '@/lib/builder/apps/hooks-registry';
import type { AppHookEvent } from '@/lib/builder/apps/hooks-model';
import { clearLogs, listLogs } from '@/lib/builder/dev/logs-store';

const REGISTRY_FILE = path.join(process.cwd(), 'runtime-data', 'apps', 'hook-registrations.json');

async function cleanStore(): Promise<void> {
  try { await rm(REGISTRY_FILE, { force: true }); } catch { /* ignore */ }
}

function publishEvent(): AppHookEvent {
  return {
    kind: 'publish.completed',
    payload: { siteId: 'site-a', pageId: 'page-1', revision: 7 },
  };
}

function orderEvent(): AppHookEvent {
  return {
    kind: 'commerce.order-created',
    payload: { orderId: 'order_1', totalCents: 4900 },
  };
}

describe('hooks-registry', () => {
  beforeEach(async () => {
    __resetHooksForTests();
    clearLogs('app');
    await cleanStore();
  });

  afterEach(async () => {
    __resetHooksForTests();
    clearLogs('app');
    await cleanStore();
  });

  it('dispatches handlers ordered by priority desc, then insertion', async () => {
    const calls: string[] = [];
    await registerAppHook({
      appId: 'app-low',
      kind: 'publish.completed',
      hookId: 'app-low-publish-1',
      priority: 0,
      handler: () => { calls.push('low'); },
    });
    await registerAppHook({
      appId: 'app-high',
      kind: 'publish.completed',
      hookId: 'app-high-publish-1',
      priority: 50,
      handler: () => { calls.push('high'); },
    });
    await registerAppHook({
      appId: 'app-mid',
      kind: 'publish.completed',
      hookId: 'app-mid-publish-1',
      priority: 10,
      handler: () => { calls.push('mid'); },
    });

    const summary = await dispatchAppHook(publishEvent());
    expect(summary).toMatchObject({ kind: 'publish.completed', invoked: 3, failed: 0 });
    expect(calls).toEqual(['high', 'mid', 'low']);
  });

  it('isolates handler errors and logs them to the dev log buffer', async () => {
    let goodRan = false;
    await registerAppHook({
      appId: 'broken-app',
      kind: 'publish.completed',
      hookId: 'broken-app-publish-1',
      priority: 100,
      handler: () => { throw new Error('boom'); },
    });
    await registerAppHook({
      appId: 'good-app',
      kind: 'publish.completed',
      hookId: 'good-app-publish-1',
      priority: 0,
      handler: () => { goodRan = true; },
    });

    const summary = await dispatchAppHook(publishEvent());
    expect(goodRan).toBe(true);
    expect(summary.invoked).toBe(1);
    expect(summary.failed).toBe(1);

    const logs = listLogs('app');
    expect(logs.some((entry) => entry.level === 'error' && entry.message.includes('boom'))).toBe(true);
  });

  it('only invokes handlers matching the event kind', async () => {
    const publishCalls: string[] = [];
    const orderCalls: string[] = [];
    await registerAppHook({
      appId: 'multi-app',
      kind: 'publish.completed',
      hookId: 'multi-app-publish-1',
      handler: () => { publishCalls.push('p'); },
    });
    await registerAppHook({
      appId: 'multi-app',
      kind: 'commerce.order-created',
      hookId: 'multi-app-order-1',
      handler: () => { orderCalls.push('o'); },
    });

    await dispatchAppHook(orderEvent());
    expect(publishCalls).toEqual([]);
    expect(orderCalls).toEqual(['o']);
  });

  it('removes all hooks for an app via unregisterAppHooks', async () => {
    await registerAppHook({
      appId: 'leaving',
      kind: 'publish.completed',
      hookId: 'leaving-publish-1',
      handler: () => {},
    });
    await registerAppHook({
      appId: 'leaving',
      kind: 'commerce.order-created',
      hookId: 'leaving-order-1',
      handler: () => {},
    });
    await registerAppHook({
      appId: 'staying',
      kind: 'publish.completed',
      hookId: 'staying-publish-1',
      handler: () => {},
    });

    const removed = await unregisterAppHooks('leaving');
    expect(removed).toBe(2);
    const remaining = await listRegisteredAppHooks();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]).toMatchObject({ appId: 'staying', hasHandler: true });
  });

  it('replaces an existing live binding on re-register with the same hookId', async () => {
    const calls: string[] = [];
    await registerAppHook({
      appId: 'rebind-app',
      kind: 'publish.completed',
      hookId: 'rebind-app-publish-1',
      handler: () => { calls.push('v1'); },
    });
    await registerAppHook({
      appId: 'rebind-app',
      kind: 'publish.completed',
      hookId: 'rebind-app-publish-1',
      handler: () => { calls.push('v2'); },
    });
    await dispatchAppHook(publishEvent());
    expect(calls).toEqual(['v2']);
    const hooks = await listRegisteredAppHooks();
    expect(hooks.filter((hook) => hook.appId === 'rebind-app')).toHaveLength(1);
  });

  it('removes a single hook by hookId via unregisterAppHook', async () => {
    await registerAppHook({
      appId: 'multi-hook',
      kind: 'publish.completed',
      hookId: 'multi-hook-publish-1',
      handler: () => {},
    });
    await registerAppHook({
      appId: 'multi-hook',
      kind: 'publish.completed',
      hookId: 'multi-hook-publish-2',
      handler: () => {},
    });
    const ok = await unregisterAppHook('multi-hook-publish-1');
    expect(ok).toBe(true);
    const remaining = await listRegisteredAppHooks();
    expect(remaining.map((hook) => hook.hookId)).toEqual(['multi-hook-publish-2']);
  });

  it('persists records to disk and reloads them across __resetHooksForTests', async () => {
    await registerAppHook({
      appId: 'persistable',
      kind: 'publish.completed',
      hookId: 'persistable-publish-1',
      priority: 5,
      handler: () => {},
    });
    await flushAppHookWrites();

    const text = await readFile(REGISTRY_FILE, 'utf8');
    const parsed = JSON.parse(text) as { hooks: Array<{ hookId: string; appId: string }> };
    expect(parsed.hooks.map((entry) => entry.hookId)).toContain('persistable-publish-1');

    // Simulate a process restart: in-memory state cleared, file remains.
    __resetHooksForTests();
    const afterReload = await listRegisteredAppHooks();
    expect(afterReload).toHaveLength(1);
    expect(afterReload[0]).toMatchObject({
      appId: 'persistable',
      kind: 'publish.completed',
      hookId: 'persistable-publish-1',
      hasHandler: false, // record survived but no handler is bound yet.
    });

    // Dispatch must NOT call the dormant record.
    const summary = await dispatchAppHook(publishEvent());
    expect(summary).toMatchObject({ invoked: 0, failed: 0 });
  });

  it('registerAppHookRecord persists a metadata-only entry without a handler', async () => {
    const record = await registerAppHookRecord({
      hookId: 'metadata-only-publish-1',
      appId: 'metadata-only',
      kind: 'publish.completed',
      priority: 1,
      registeredAt: new Date().toISOString(),
      codeStubNote: 'pending future bind',
    });
    expect(record).toMatchObject({ hookId: 'metadata-only-publish-1', codeStubNote: 'pending future bind' });

    const hooks = await listRegisteredAppHooks();
    expect(hooks.find((hook) => hook.hookId === 'metadata-only-publish-1')).toMatchObject({
      hasHandler: false,
      codeStubNote: 'pending future bind',
    });

    const summary = await dispatchAppHook(publishEvent());
    expect(summary.invoked).toBe(0);
  });
});