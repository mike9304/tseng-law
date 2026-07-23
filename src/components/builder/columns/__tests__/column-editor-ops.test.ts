import { describe, expect, it, vi } from 'vitest';
import { getColumnEditCopy } from '@/components/builder/columns/column-edit-copy';
import {
  executeColumnPublish,
  executeColumnSave,
  InflightSaveCoordinator,
  mapColumnMutationError,
  withPublishBusyLock,
  type SaveOutcome,
} from '@/components/builder/columns/column-editor-ops';

describe('mapColumnMutationError', () => {
  it.each(['ko', 'zh-hant', 'en'] as const)(
    'maps rate_limit_unavailable to a locale-specific retry message (%s)',
    (locale) => {
      const copy = getColumnEditCopy(locale);
      const message = mapColumnMutationError(
        { kind: 'save', status: 503, error: 'rate_limit_unavailable', errorCode: 'rate_limit_unavailable' },
        copy.editor.saveAlerts,
      );
      expect(message).toBe(copy.editor.saveAlerts.rateLimitUnavailable);
      expect(message.length).toBeGreaterThan(10);
      if (locale === 'ko') {
        expect(message).toMatch(/일시|재시도|저장/);
      } else if (locale === 'zh-hant') {
        expect(message).toMatch(/暫時|稍後|儲存|使用/);
      } else {
        expect(message.toLowerCase()).toMatch(/temporarily|unavailable|try again/);
      }
    },
  );

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'maps HTTP 429 to a locale-specific too-many-requests message (%s)',
    (locale) => {
      const copy = getColumnEditCopy(locale);
      const message = mapColumnMutationError(
        { kind: 'publish', status: 429, error: 'Too many requests' },
        copy.editor.publishAlerts,
      );
      expect(message).toBe(copy.editor.publishAlerts.tooManyRequests);
      if (locale === 'ko') {
        expect(message).toMatch(/너무 많|잠시/);
      } else if (locale === 'zh-hant') {
        expect(message).toMatch(/過多|稍後/);
      } else {
        expect(message.toLowerCase()).toMatch(/too many|try again/);
      }
    },
  );

  it('prefers localized server error text for other failures', () => {
    const copy = getColumnEditCopy('en');
    const message = mapColumnMutationError(
      { kind: 'save', status: 500, error: 'Column update failed.' },
      copy.editor.saveAlerts,
    );
    expect(message).toBe('Save failed: Column update failed.');
  });

  it('maps network errors', () => {
    const copy = getColumnEditCopy('ko');
    const message = mapColumnMutationError(
      { kind: 'publish', networkError: true },
      copy.editor.publishAlerts,
    );
    expect(message).toBe(copy.editor.publishAlerts.networkError);
  });
});

describe('executeColumnSave + executeColumnPublish orchestration', () => {
  it('does not POST publish when PATCH returns 503', async () => {
    const copy = getColumnEditCopy('en');
    const patch = vi.fn(async () => new Response(
      JSON.stringify({ error: 'rate_limit_unavailable' }),
      { status: 503 },
    ));
    const publish = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const saveResult = await executeColumnSave({
      payloadKey: 'payload-1',
      lastSavedKey: 'old',
      hydrated: true,
      request: patch,
      mapHttpError: async (res) => mapColumnMutationError(
        { kind: 'save', status: res.status, error: 'rate_limit_unavailable' },
        copy.editor.saveAlerts,
      ),
      mapNetworkError: () => copy.editor.saveAlerts.networkError,
    });

    expect(saveResult.status).toBe('error');

    const publishResult = await executeColumnPublish({
      cancelDebounce: vi.fn(),
      isPublishBusy: false,
      ensureSaved: async () => saveResult,
      requestPublish: publish,
      mapHttpError: async (res) => mapColumnMutationError(
        { kind: 'publish', status: res.status },
        copy.editor.publishAlerts,
      ),
      mapNetworkError: () => copy.editor.publishAlerts.networkError,
    });

    expect(publishResult.status).toBe('save_failed');
    expect(publish).not.toHaveBeenCalled();
    expect(patch).toHaveBeenCalledTimes(1);
  });

  it('POSTs publish exactly once after a successful save', async () => {
    const copy = getColumnEditCopy('en');
    const patch = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const publish = vi.fn(async () => new Response(
      JSON.stringify({ ok: true, slugRedirect: null }),
      { status: 200 },
    ));
    const cancelDebounce = vi.fn();

    const result = await executeColumnPublish({
      cancelDebounce,
      isPublishBusy: false,
      ensureSaved: async () => executeColumnSave({
        payloadKey: 'payload-2',
        lastSavedKey: 'old',
        hydrated: true,
        request: patch,
        mapHttpError: async () => 'save failed',
        mapNetworkError: () => copy.editor.saveAlerts.networkError,
      }),
      requestPublish: publish,
      mapHttpError: async () => 'publish failed',
      mapNetworkError: () => copy.editor.publishAlerts.networkError,
    });

    expect(cancelDebounce).toHaveBeenCalledTimes(1);
    expect(patch).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledTimes(1);
    expect(result.status).toBe('success');
  });

  it('dedupes identical in-flight saves to a single PATCH', async () => {
    const coordinator = new InflightSaveCoordinator();
    let resolvePatch!: (value: Response) => void;
    const patch = vi.fn(() => new Promise<Response>((resolve) => {
      resolvePatch = resolve;
    }));

    const run = () => coordinator.run('same-payload', () => executeColumnSave({
      payloadKey: 'same-payload',
      lastSavedKey: 'old',
      hydrated: true,
      request: patch,
      mapHttpError: async () => 'err',
      mapNetworkError: () => 'net',
    }));

    const first = run();
    const second = run();
    expect(patch).toHaveBeenCalledTimes(1);

    resolvePatch(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const [a, b] = await Promise.all([first, second]);
    expect(a).toEqual({ status: 'success', payloadKey: 'same-payload' });
    expect(b).toEqual({ status: 'success', payloadKey: 'same-payload' });
    expect(patch).toHaveBeenCalledTimes(1);
  });

  it('serializes different queued payloads: max concurrent execute is 1, order preserved; identical waiters share a flight', async () => {
    const coordinator = new InflightSaveCoordinator();
    let concurrent = 0;
    let maxConcurrent = 0;
    const startOrder: string[] = [];
    const endOrder: string[] = [];
    const gate = new Map<string, { resolve: () => void; promise: Promise<void> }>();

    const openGate = (key: string) => {
      let resolve!: () => void;
      const promise = new Promise<void>((r) => {
        resolve = r;
      });
      gate.set(key, { resolve, promise });
    };

    const makeExecute = (key: string) => async (): Promise<SaveOutcome> => {
      concurrent += 1;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      startOrder.push(key);
      await gate.get(key)!.promise;
      concurrent -= 1;
      endOrder.push(key);
      return { status: 'success', payloadKey: key };
    };

    openGate('A');
    openGate('B');
    openGate('C');

    // A in flight; B and C (different keys) both wait; B2 shares B's key.
    const pA = coordinator.run('A', makeExecute('A'));
    const pB = coordinator.run('B', makeExecute('B'));
    const pC = coordinator.run('C', makeExecute('C'));
    const pB2 = coordinator.run('B', makeExecute('B'));

    expect(startOrder).toEqual(['A']);
    expect(maxConcurrent).toBe(1);
    expect(coordinator.busy).toBe(true);

    gate.get('A')!.resolve();
    // Flush microtasks so waiters resume and B (not C) becomes the next flight.
    await Promise.resolve();
    await Promise.resolve();
    await vi.waitFor(() => {
      expect(startOrder).toEqual(['A', 'B']);
    });
    expect(maxConcurrent).toBe(1);
    // C must still be waiting — not concurrent with B.
    expect(startOrder).not.toContain('C');

    gate.get('B')!.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await vi.waitFor(() => {
      expect(startOrder).toEqual(['A', 'B', 'C']);
    });
    expect(maxConcurrent).toBe(1);

    gate.get('C')!.resolve();
    const [a, b, c, b2] = await Promise.all([pA, pB, pC, pB2]);

    expect(a).toEqual({ status: 'success', payloadKey: 'A' });
    expect(b).toEqual({ status: 'success', payloadKey: 'B' });
    expect(b2).toEqual({ status: 'success', payloadKey: 'B' });
    expect(c).toEqual({ status: 'success', payloadKey: 'C' });
    // Identical B waiters share one execute — makeExecute('B') only starts once.
    expect(startOrder).toEqual(['A', 'B', 'C']);
    expect(endOrder).toEqual(['A', 'B', 'C']);
    expect(maxConcurrent).toBe(1);
    expect(coordinator.busy).toBe(false);
  });

  it('withPublishBusyLock always clears busy in finally, even when work throws', async () => {
    let busy = false;
    const lock = {
      isBusy: () => busy,
      setBusy: (next: boolean) => {
        busy = next;
      },
    };

    await expect(
      withPublishBusyLock(lock, async () => {
        expect(busy).toBe(true);
        throw new Error('unexpected helper failure');
      }),
    ).rejects.toThrow('unexpected helper failure');
    expect(busy).toBe(false);

    const ok = await withPublishBusyLock(lock, async () => 'done');
    expect(ok).toBe('done');
    expect(busy).toBe(false);

    busy = true;
    const blocked = await withPublishBusyLock(lock, async () => 'should-not-run');
    expect(blocked).toEqual({ status: 'busy' });
    expect(busy).toBe(true);
  });

  it('ignores rapid duplicate publish while busy (no second publish POST)', async () => {
    const copy = getColumnEditCopy('en');
    const publish = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const first = executeColumnPublish({
      cancelDebounce: vi.fn(),
      isPublishBusy: false,
      ensureSaved: async () => ({ status: 'noop' }),
      requestPublish: publish,
      mapHttpError: async () => 'err',
      mapNetworkError: () => copy.editor.publishAlerts.networkError,
    });

    const second = await executeColumnPublish({
      cancelDebounce: vi.fn(),
      isPublishBusy: true,
      ensureSaved: async () => ({ status: 'noop' }),
      requestPublish: publish,
      mapHttpError: async () => 'err',
      mapNetworkError: () => copy.editor.publishAlerts.networkError,
    });

    await first;
    expect(second.status).toBe('busy');
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it('cancels debounce before save+publish', async () => {
    const cancelDebounce = vi.fn();
    await executeColumnPublish({
      cancelDebounce,
      isPublishBusy: false,
      ensureSaved: async () => ({ status: 'noop' }),
      requestPublish: async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
      mapHttpError: async () => 'err',
      mapNetworkError: () => 'net',
    });
    expect(cancelDebounce).toHaveBeenCalledTimes(1);
  });
});

