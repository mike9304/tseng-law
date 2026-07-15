import { describe, expect, it, vi } from 'vitest';
import {
  computePanZoomUpdate,
  createActivePanReplacementGuard,
  createPointerMoveCoalescer,
  resolveHoveredContainerUpdate,
} from '../hooks/useCanvasInteractions';
import type { ContainerHitRect } from '../canvasInteraction';

type Sample = {
  pointerId: number;
  clientX: number;
  clientY: number;
  shiftKey: boolean;
};

function createCoalescerHarness() {
  const refs = {
    pending: { current: { pointerId: 0, clientX: 0, clientY: 0, shiftKey: false } as Sample },
    hasPending: { current: false },
    frame: { current: null as number | null },
  };
  const processed: Sample[] = [];
  const frames: Array<{ handle: number; run: () => void }> = [];
  let nextHandle = 1;
  const requestFrame = vi.fn((run: () => void) => {
    const handle = nextHandle;
    nextHandle += 1;
    frames.push({ handle, run });
    return handle;
  });
  const cancelFrame = vi.fn((handle: number) => {
    // Browsers normally suppress a cancelled callback, but a callback already
    // queued by a scheduler/test double can still arrive. Retain it so stale
    // callback assertions exercise the callback rather than an empty array.
    expect(frames.some((entry) => entry.handle === handle)).toBe(true);
  });
  const createCoalescer = () => createPointerMoveCoalescer({
    refs,
    process: (sample) => {
      processed.push({
        pointerId: sample.pointerId,
        clientX: sample.clientX,
        clientY: sample.clientY,
        shiftKey: sample.shiftKey,
      });
    },
    requestFrame,
    cancelFrame,
  });
  const coalescer = createCoalescer();
  const runLastScheduledFrame = () => {
    const last = frames[frames.length - 1];
    if (last) last.run();
  };
  const runScheduledFrame = (index: number) => frames[index]?.run();
  return {
    refs,
    processed,
    requestFrame,
    cancelFrame,
    coalescer,
    createCoalescer,
    runLastScheduledFrame,
    runScheduledFrame,
  };
}

describe('pointer-move rAF coalescer', () => {
  it('coalesces 100 queued samples into one rAF request and one processed sample (latest wins)', () => {
    const harness = createCoalescerHarness();

    for (let index = 1; index <= 100; index += 1) {
      harness.coalescer.setSample(7, index, index * 10, index % 2 === 0);
    }

    expect(harness.requestFrame).toHaveBeenCalledTimes(1);
    expect(harness.cancelFrame).not.toHaveBeenCalled();
    expect(harness.coalescer.isScheduled()).toBe(true);
    expect(harness.coalescer.hasPending()).toBe(true);

    harness.runLastScheduledFrame();

    expect(harness.processed).toHaveLength(1);
    expect(harness.processed[0]).toEqual({
      pointerId: 7,
      clientX: 100,
      clientY: 1000,
      shiftKey: true,
    });
    expect(harness.coalescer.isScheduled()).toBe(false);
    expect(harness.coalescer.hasPending()).toBe(false);
  });

  it('does not allocate extra frames while one is already scheduled', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.setSample(1, 5, 5, false);
    expect(harness.requestFrame).toHaveBeenCalledTimes(1);

    harness.coalescer.setSample(1, 6, 6, false);
    harness.coalescer.setSample(1, 7, 7, false);
    expect(harness.requestFrame).toHaveBeenCalledTimes(1);

    harness.runLastScheduledFrame();
    expect(harness.processed).toEqual([
      { pointerId: 1, clientX: 7, clientY: 7, shiftKey: false },
    ]);

    harness.coalescer.setSample(1, 8, 8, false);
    expect(harness.requestFrame).toHaveBeenCalledTimes(2);
  });

  it('flush processes the latest pending sample and cancels the scheduled frame', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.setSample(9, 1, 1, false);
    harness.coalescer.setSample(9, 2, 2, false);
    expect(harness.requestFrame).toHaveBeenCalledTimes(1);

    harness.coalescer.flush();

    expect(harness.cancelFrame).toHaveBeenCalledTimes(1);
    expect(harness.processed).toEqual([
      { pointerId: 9, clientX: 2, clientY: 2, shiftKey: false },
    ]);
    expect(harness.coalescer.isScheduled()).toBe(false);
    expect(harness.coalescer.hasPending()).toBe(false);
  });

  it('flush is a no-op when there is no pending sample', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.flush();

    expect(harness.processed).toHaveLength(0);
    expect(harness.cancelFrame).not.toHaveBeenCalled();
  });

  it('flush does not double-process: a second flush after the first is inert', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.setSample(9, 4, 4, true);
    harness.coalescer.flush();
    harness.coalescer.flush();

    expect(harness.processed).toHaveLength(1);
    expect(harness.cancelFrame).toHaveBeenCalledTimes(1);
  });

  it('cancel drops the pending sample and scheduled frame, and a stale frame firing is a no-op', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.setSample(3, 10, 10, true);
    expect(harness.requestFrame).toHaveBeenCalledTimes(1);

    harness.coalescer.cancel();

    expect(harness.cancelFrame).toHaveBeenCalledTimes(1);
    expect(harness.coalescer.isScheduled()).toBe(false);
    expect(harness.coalescer.hasPending()).toBe(false);

    // Simulate a stale rAF callback firing after it was cancelled.
    harness.runLastScheduledFrame();

    expect(harness.processed).toHaveLength(0);
  });

  it('cancel after a flush does not resurrect processing', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.setSample(3, 1, 1, false);
    harness.coalescer.flush();
    harness.coalescer.cancel();

    expect(harness.processed).toHaveLength(1);
  });

  it('does not let an old effect callback consume a replacement effect sample', () => {
    const harness = createCoalescerHarness();

    harness.coalescer.setSample(3, 10, 10, false);
    harness.coalescer.cancel();

    const replacementCoalescer = harness.createCoalescer();
    replacementCoalescer.setSample(4, 40, 50, true);
    expect(harness.requestFrame).toHaveBeenCalledTimes(2);

    // The first callback remains callable even though its frame was cancelled.
    harness.runScheduledFrame(0);
    expect(harness.processed).toHaveLength(0);
    expect(replacementCoalescer.isScheduled()).toBe(true);

    harness.runScheduledFrame(1);
    expect(harness.processed).toEqual([
      { pointerId: 4, clientX: 40, clientY: 50, shiftKey: true },
    ]);
    expect(replacementCoalescer.isScheduled()).toBe(false);
  });

  it('processes exactly one sample per frame across multiple coalesced bursts', () => {
    const harness = createCoalescerHarness();

    // Burst 1
    harness.coalescer.setSample(2, 1, 1, false);
    harness.coalescer.setSample(2, 2, 2, false);
    harness.runLastScheduledFrame();
    // Burst 2, same frame slot reused only after the prior frame fired
    harness.coalescer.setSample(2, 3, 3, false);
    harness.coalescer.setSample(2, 4, 4, false);
    harness.runLastScheduledFrame();

    expect(harness.processed).toEqual([
      { pointerId: 2, clientX: 2, clientY: 2, shiftKey: false },
      { pointerId: 2, clientX: 4, clientY: 4, shiftKey: false },
    ]);
    expect(harness.requestFrame).toHaveBeenCalledTimes(2);
  });
});

describe('active pan external viewport replacement', () => {
  it('accepts owned pan publications without terminating the interaction', () => {
    const guard = createActivePanReplacementGuard();
    guard.begin(7, { zoom: 1, panX: 10, panY: 20 });
    guard.publish(7, 35, 45);

    expect(guard.observe(7, { zoom: 1, panX: 35, panY: 45 })).toBe(false);
    expect(guard.finish(7)).toBe(true);
    expect(guard.finish(7)).toBe(false);
  });

  it('terminates exactly once when fit replaces zoom and pan while preserving the fitted values', () => {
    const guard = createActivePanReplacementGuard();
    const fittedViewport = { zoom: 0.64, panX: 118, panY: 0 };
    guard.begin(11, { zoom: 1, panX: 0, panY: 0 });
    guard.publish(11, 24, 12);

    expect(guard.observe(11, fittedViewport)).toBe(true);
    expect(guard.observe(11, fittedViewport)).toBe(false);
    expect(guard.finish(11)).toBe(false);
    expect(fittedViewport).toEqual({ zoom: 0.64, panX: 118, panY: 0 });
  });

  it('also treats an external pan-only replacement as terminal', () => {
    const guard = createActivePanReplacementGuard();
    guard.begin(12, { zoom: 0.8, panX: 10, panY: 20 });

    expect(guard.observe(12, { zoom: 0.8, panX: 90, panY: 40 })).toBe(true);
    expect(guard.observe(12, { zoom: 0.8, panX: 90, panY: 40 })).toBe(false);
  });
});

describe('pan zoom update dedupe', () => {
  it('returns null when the computed pan equals the last published pan', () => {
    const result = computePanZoomUpdate({
      startPanX: 10,
      startPanY: 20,
      deltaX: 5,
      deltaY: 7,
      lastPublishedPanX: 15,
      lastPublishedPanY: 27,
    });
    expect(result).toBeNull();
  });

  it('returns the next pan when it differs from the last published pan', () => {
    const result = computePanZoomUpdate({
      startPanX: 10,
      startPanY: 20,
      deltaX: 5,
      deltaY: 7,
      lastPublishedPanX: 0,
      lastPublishedPanY: 0,
    });
    expect(result).toEqual({ panX: 15, panY: 27 });
  });

  it('publishes the very first computed pan even when delta is zero (no last published baseline)', () => {
    const result = computePanZoomUpdate({
      startPanX: 0,
      startPanY: 0,
      deltaX: 0,
      deltaY: 0,
      lastPublishedPanX: null,
      lastPublishedPanY: null,
    });
    expect(result).toEqual({ panX: 0, panY: 0 });
  });

  it('publishes once across a redundant-then-changed sequence when seeded with the start pan (mirrors hook guard)', () => {
    const startPanX = 100;
    const startPanY = 50;
    const publishes: Array<{ panX: number; panY: number }> = [];
    let lastPublishedPanX: number | null = startPanX;
    let lastPublishedPanY: number | null = startPanY;

    const applyFrame = (deltaX: number, deltaY: number) => {
      const next = computePanZoomUpdate({
        startPanX,
        startPanY,
        deltaX,
        deltaY,
        lastPublishedPanX,
        lastPublishedPanY,
      });
      if (!next) return;
      lastPublishedPanX = next.panX;
      lastPublishedPanY = next.panY;
      publishes.push(next);
    };

    applyFrame(0, 0);
    applyFrame(0, 0);
    applyFrame(5, 0);
    applyFrame(5, 0);
    applyFrame(5, 3);
    applyFrame(5, 3);

    expect(publishes).toEqual([
      { panX: 105, panY: 50 },
      { panX: 105, panY: 53 },
    ]);
  });
});

describe('hovered container publish suppression', () => {
  const rectA = { x: 0, y: 0, width: 10, height: 10 };
  const rectB = { x: 2, y: 2, width: 24, height: 24 };

  it('does not publish when the same id is represented by a different rect object', () => {
    const hitOne: ContainerHitRect = { id: 'container-a', rect: rectA };
    const hitTwo: ContainerHitRect = { id: 'container-a', rect: rectB };

    expect(hitOne).not.toBe(hitTwo);

    const first = resolveHoveredContainerUpdate({ currentHoveredId: null, nextHit: hitOne });
    expect(first.shouldPublish).toBe(true);
    expect(first.nextId).toBe('container-a');
    expect(first.nextHit).toBe(hitOne);

    const second = resolveHoveredContainerUpdate({ currentHoveredId: 'container-a', nextHit: hitTwo });
    expect(second.shouldPublish).toBe(false);
    expect(second.nextId).toBe('container-a');
    expect(second.nextHit).toBe(hitTwo);
  });

  it('resolves id changes and null transitions', () => {
    expect(
      resolveHoveredContainerUpdate({ currentHoveredId: 'a', nextHit: null }).shouldPublish,
    ).toBe(true);
    expect(
      resolveHoveredContainerUpdate({ currentHoveredId: 'a', nextHit: null }).nextId,
    ).toBeNull();

    expect(
      resolveHoveredContainerUpdate({
        currentHoveredId: 'a',
        nextHit: { id: 'b', rect: rectA },
      }).shouldPublish,
    ).toBe(true);

    expect(
      resolveHoveredContainerUpdate({
        currentHoveredId: 'a',
        nextHit: { id: 'a', rect: rectA },
      }).shouldPublish,
    ).toBe(false);
  });

  it('publishes hovered-container state once for repeated same-id hits (mirrors hook guard)', () => {
    const published: Array<string | null> = [];
    let currentHoveredId: string | null = null;
    const hitRefSyncs: Array<ContainerHitRect | null> = [];

    const apply = (nextHit: ContainerHitRect | null) => {
      const decision = resolveHoveredContainerUpdate({ currentHoveredId, nextHit });
      hitRefSyncs.push(decision.nextHit);
      if (!decision.shouldPublish) return;
      currentHoveredId = decision.nextId;
      published.push(decision.nextId);
    };

    const hitOne: ContainerHitRect = { id: 'c1', rect: rectA };
    const hitTwo: ContainerHitRect = { id: 'c1', rect: rectB };

    apply(hitOne);
    apply(hitTwo);
    apply(hitTwo);
    apply(null);
    apply(null);

    expect(published).toEqual(['c1', null]);
    // The hit ref is always synced to the latest hit, even when unpublished.
    expect(hitRefSyncs).toEqual([hitOne, hitTwo, hitTwo, null, null]);
  });
});
