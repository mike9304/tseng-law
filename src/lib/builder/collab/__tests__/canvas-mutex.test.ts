import { afterEach, describe, expect, it } from 'vitest';
import {
  __getCanvasMutexQueueDepth,
  __resetCanvasMutexForTests,
  withCanvasMutex,
} from '@/lib/builder/collab/canvas-mutex';

afterEach(() => {
  __resetCanvasMutexForTests();
});

describe('withCanvasMutex', () => {
  it('runs tasks sequentially for the same (siteId, pageId)', async () => {
    const order: string[] = [];
    const slow = withCanvasMutex('site', 'page', async () => {
      await new Promise((r) => setTimeout(r, 30));
      order.push('slow');
    });
    const fast = withCanvasMutex('site', 'page', async () => {
      order.push('fast');
    });
    await Promise.all([slow, fast]);
    expect(order).toEqual(['slow', 'fast']);
  });

  it('runs tasks for different keys in parallel', async () => {
    const order: string[] = [];
    const a = withCanvasMutex('site', 'page-a', async () => {
      await new Promise((r) => setTimeout(r, 30));
      order.push('a');
    });
    const b = withCanvasMutex('site', 'page-b', async () => {
      order.push('b');
    });
    await Promise.all([a, b]);
    // b finishes first because a is artificially slow + they don't share a key
    expect(order).toEqual(['b', 'a']);
  });

  it('releases the lock even if the task throws', async () => {
    await expect(
      withCanvasMutex('site', 'err-page', async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    let ran = false;
    await withCanvasMutex('site', 'err-page', async () => {
      ran = true;
    });
    expect(ran).toBe(true);
    expect(__getCanvasMutexQueueDepth('site', 'err-page')).toBe(0);
  });

  it('returns the task value', async () => {
    const result = await withCanvasMutex('site', 'page', async () => 42);
    expect(result).toBe(42);
  });

  it('garbage-collects empty queues', async () => {
    await withCanvasMutex('site', 'temp', async () => undefined);
    expect(__getCanvasMutexQueueDepth('site', 'temp')).toBe(0);
  });
});
