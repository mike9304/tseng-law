import { describe, expect, it, vi } from 'vitest';
import {
  createInteractionMutationSessionController,
  createPointerMoveCoalescer,
  findScopedPreviewElement,
  isReusablePreviewElement,
  type PointerMoveCoalescerRefs,
} from '../hooks/useCanvasInteractions';
import type { PointerMoveSnapshot } from '../canvasInteraction';
import {
  createCanvasRotationOwnerCoordinator,
  createRotationPointerSessionController,
  isOwnedInteractionPointer,
} from '../hooks/useCanvasNodeRotation';

function previewElement(nodeId: string, connected = true): HTMLElement {
  return {
    isConnected: connected,
    getAttribute: (name: string) => (name === 'data-node-id' ? nodeId : null),
  } as unknown as HTMLElement;
}

function previewRoot(getCandidate: () => HTMLElement | null) {
  const querySelector = vi.fn(() => getCandidate());
  const root = {
    isConnected: true,
    contains: (element: HTMLElement) => element === getCandidate(),
    querySelector,
  } as unknown as HTMLElement;
  return { querySelector, root };
}

describe('canvas interaction DOM ownership', () => {
  it('never replaces a claimed page-A element with a remounted page-B node that reuses its id', () => {
    const pageA = previewElement('shared-node');
    const pageB = previewElement('shared-node');
    let mountedElement: HTMLElement | null = pageA;
    const { querySelector, root } = previewRoot(() => mountedElement);
    const claimed = new Map<string, HTMLElement>();

    expect(findScopedPreviewElement('shared-node', claimed, root)).toBe(pageA);
    expect(querySelector).toHaveBeenCalledTimes(1);

    Object.defineProperty(pageA, 'isConnected', { configurable: true, value: false });
    mountedElement = pageB;

    expect(findScopedPreviewElement('shared-node', claimed, root)).toBeNull();
    expect(querySelector).toHaveBeenCalledTimes(1);
    expect(claimed.get('shared-node')).toBe(pageA);

    const pageBClaims = new Map<string, HTMLElement>();
    expect(findScopedPreviewElement('shared-node', pageBClaims, root)).toBe(pageB);
    expect(querySelector).toHaveBeenCalledTimes(2);
  });

  it('rejects connected elements outside the initiating canvas root', () => {
    const inside = previewElement('node-a');
    const outside = previewElement('node-a');
    const root = {
      contains: (element: HTMLElement) => element === inside,
    } as unknown as HTMLElement;

    expect(isReusablePreviewElement(inside, 'node-a', root)).toBe(true);
    expect(isReusablePreviewElement(outside, 'node-a', root)).toBe(false);
  });
});

describe('canvas mutation session lifecycle', () => {
  it('matches an activated move or resize with exactly one terminal callback', () => {
    const begin = vi.fn();
    const cancel = vi.fn();
    const commit = vi.fn();
    const controller = createInteractionMutationSessionController({ begin, cancel, commit });

    expect(controller.begin(71)).toBe(true);
    expect(controller.begin(71)).toBe(false);
    expect(controller.cancel(72)).toBe(false);
    expect(controller.cancel(71)).toBe(true);
    expect(controller.cancel(71)).toBe(false);
    expect(begin).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(commit).not.toHaveBeenCalled();

    expect(controller.begin(81)).toBe(true);
    expect(controller.commit(81)).toBe(true);
    expect(controller.commit(81)).toBe(false);
    expect(begin).toHaveBeenCalledTimes(2);
    expect(commit).toHaveBeenCalledTimes(1);
  });

  it('cancels the previous owner once when a new pointer supersedes it or unmount resets it', () => {
    const begin = vi.fn();
    const cancel = vi.fn();
    const commit = vi.fn();
    const controller = createInteractionMutationSessionController({ begin, cancel, commit });

    controller.begin(91);
    controller.begin(92);
    expect(controller.activePointerId()).toBe(92);
    expect(begin).toHaveBeenCalledTimes(2);
    expect(cancel).toHaveBeenCalledTimes(1);

    expect(controller.cancel()).toBe(true);
    expect(controller.cancel()).toBe(false);
    expect(controller.activePointerId()).toBeNull();
    expect(cancel).toHaveBeenCalledTimes(2);
    expect(commit).not.toHaveBeenCalled();
  });
});

describe('rotation pointer ownership', () => {
  it('accepts move/up/cancel only from the pointer that initiated rotation', () => {
    expect(isOwnedInteractionPointer(101, 101)).toBe(true);
    expect(isOwnedInteractionPointer(102, 101)).toBe(false);
  });

  it('starts a replacement pointer from the reverted base instead of the stale transient angle', () => {
    const controller = createRotationPointerSessionController(0);

    expect(controller.begin(101, 0)).toBe(0);
    expect(controller.move(101, 90, false)).toBe(90);
    controller.syncRotation(90);
    expect(controller.terminate('cancel', 101)).toBe(true);

    expect(controller.begin(102, 45)).toBe(0);
    expect(controller.move(102, 45, false)).toBe(0);
    expect(controller.move(101, 135, false)).toBeNull();
    expect(controller.terminate('commit', 101)).toBe(false);
    expect(controller.move(102, 135, false)).toBe(90);
    expect(controller.terminate('commit', 102)).toBe(true);
    expect(controller.terminate('commit', 102)).toBe(false);
  });

  it('treats owner capture loss as one cancel while ignoring foreign and late terminal events', () => {
    const controller = createRotationPointerSessionController(15);
    const cancelMutationSession = vi.fn();
    const losePointerCapture = (pointerId: number) => {
      const didCancel = controller.terminate('cancel', pointerId);
      if (didCancel) cancelMutationSession();
      return didCancel;
    };

    expect(controller.begin(201, 10)).toBe(15);
    expect(controller.move(201, 100, false)).toBe(105);
    expect(losePointerCapture(202)).toBe(false);
    expect(cancelMutationSession).not.toHaveBeenCalled();
    expect(controller.move(201, 100, false)).toBe(105);
    expect(losePointerCapture(201)).toBe(true);
    expect(losePointerCapture(201)).toBe(false);
    expect(cancelMutationSession).toHaveBeenCalledTimes(1);

    expect(controller.begin(203, 40)).toBe(15);
    expect(controller.move(201, 130, false)).toBeNull();
    expect(controller.terminate('commit', 201)).toBe(false);
    expect(controller.move(203, 40, false)).toBe(15);
  });

  it('cancels node A before node B begins and rejects A terminal events after cross-node takeover', () => {
    const coordinator = createCanvasRotationOwnerCoordinator();
    const nodeA = createRotationPointerSessionController(0);
    const nodeB = createRotationPointerSessionController(30);
    const lifecycleOrder: string[] = [];
    const beginMutationSession = vi.fn(() => lifecycleOrder.push('begin'));
    const cancelMutationSession = vi.fn(() => lifecycleOrder.push('cancel'));
    const commitMutationSession = vi.fn();
    const ownerA = {};
    const ownerB = {};

    const cancelA = vi.fn(() => {
      if (!nodeA.terminate('cancel', 301)) return;
      if (coordinator.release(ownerA)) cancelMutationSession();
    });
    const cancelB = vi.fn(() => {
      if (!nodeB.terminate('cancel', 302)) return;
      if (coordinator.release(ownerB)) cancelMutationSession();
    });

    expect(nodeA.begin(301, 0)).toBe(0);
    coordinator.takeover(ownerA, cancelA);
    beginMutationSession();
    expect(nodeA.move(301, 90, false)).toBe(90);

    expect(nodeB.begin(302, 45)).toBe(30);
    coordinator.takeover(ownerB, cancelB);
    expect(cancelA).toHaveBeenCalledTimes(1);
    expect(cancelMutationSession).toHaveBeenCalledTimes(1);
    beginMutationSession();
    expect(beginMutationSession).toHaveBeenCalledTimes(2);
    expect(lifecycleOrder).toEqual(['begin', 'cancel', 'begin']);
    expect(nodeB.move(302, 45, false)).toBe(30);

    expect(nodeA.terminate('commit', 301)).toBe(false);
    expect(coordinator.release(ownerA)).toBe(false);
    expect(commitMutationSession).not.toHaveBeenCalled();

    expect(nodeB.terminate('commit', 302)).toBe(true);
    if (coordinator.release(ownerB)) commitMutationSession();
    expect(commitMutationSession).toHaveBeenCalledTimes(1);
    expect(cancelB).not.toHaveBeenCalled();
  });
});

function createCoalescerRefs(): PointerMoveCoalescerRefs {
  return {
    pending: { current: { pointerId: 0, clientX: 0, clientY: 0, shiftKey: false } },
    hasPending: { current: false },
    frame: { current: null },
  };
}

// A frame clock whose callbacks are addressable by handle, so a test can prove
// that a stale (superseded) rAF callback is a no-op even if the platform still
// fires it. cancelFrame intentionally leaves the callback addressable so the
// generation/handle guard inside the coalescer — not the clock — is what blocks
// the stale invocation.
function createControllableFrameClock() {
  const callbacks = new Map<number, () => void>();
  let nextHandle = 1;
  return {
    requestFrame(callback: () => void) {
      const handle = nextHandle;
      nextHandle += 1;
      callbacks.set(handle, callback);
      return handle;
    },
    cancelFrame(handle: number) {
      callbacks.delete(handle);
    },
    invoke(handle: number) {
      const callback = callbacks.get(handle);
      callbacks.delete(handle);
      callback?.();
    },
    liveHandles() {
      return [...callbacks.keys()];
    },
  };
}

describe('pointer move coalescer terminal safety', () => {
  it('coalesces rapid samples into one frame that processes only the latest sample', () => {
    const clock = createControllableFrameClock();
    const refs = createCoalescerRefs();
    const processed: PointerMoveSnapshot[] = [];
    const coalescer = createPointerMoveCoalescer({
      refs,
      process: (sample) => processed.push({ ...sample }),
      requestFrame: clock.requestFrame,
      cancelFrame: clock.cancelFrame,
    });

    coalescer.setSample(11, 10, 20, false);
    coalescer.setSample(11, 30, 40, false);
    coalescer.setSample(11, 50, 60, true);

    expect(clock.liveHandles()).toHaveLength(1);
    expect(coalescer.isScheduled()).toBe(true);
    expect(coalescer.hasPending()).toBe(true);

    const [handle] = clock.liveHandles();
    clock.invoke(handle!);

    expect(processed).toEqual([{ pointerId: 11, clientX: 50, clientY: 60, shiftKey: true }]);
    expect(coalescer.isScheduled()).toBe(false);
    expect(coalescer.hasPending()).toBe(false);
  });

  it('cancel stops a scheduled frame so no stale sample runs after terminal cleanup', () => {
    const clock = createControllableFrameClock();
    const refs = createCoalescerRefs();
    const processed: PointerMoveSnapshot[] = [];
    const coalescer = createPointerMoveCoalescer({
      refs,
      process: (sample) => processed.push({ ...sample }),
      requestFrame: clock.requestFrame,
      cancelFrame: clock.cancelFrame,
    });

    coalescer.setSample(21, 100, 110, false);
    const [staleHandle] = clock.liveHandles();
    expect(staleHandle).toBeDefined();
    expect(coalescer.isScheduled()).toBe(true);

    coalescer.cancel();

    expect(coalescer.isScheduled()).toBe(false);
    expect(coalescer.hasPending()).toBe(false);
    // Even if the platform fires the already-scheduled callback, it must not
    // process the stale sample (the generation/handle guard rejects it).
    clock.invoke(staleHandle!);
    expect(processed).toHaveLength(0);
  });

  it('flush processes the pending sample once, clears the schedule, and recovers for new samples', () => {
    const clock = createControllableFrameClock();
    const refs = createCoalescerRefs();
    const processed: PointerMoveSnapshot[] = [];
    const coalescer = createPointerMoveCoalescer({
      refs,
      process: (sample) => processed.push({ ...sample }),
      requestFrame: clock.requestFrame,
      cancelFrame: clock.cancelFrame,
    });

    coalescer.setSample(31, 5, 6, false);
    coalescer.setSample(31, 7, 8, false);
    coalescer.flush();

    expect(processed).toEqual([{ pointerId: 31, clientX: 7, clientY: 8, shiftKey: false }]);
    expect(coalescer.isScheduled()).toBe(false);
    expect(coalescer.hasPending()).toBe(false);
    expect(clock.liveHandles()).toHaveLength(0);

    // After terminal cleanup the coalescer must remain usable for a fresh gesture.
    coalescer.setSample(32, 90, 91, true);
    expect(coalescer.isScheduled()).toBe(true);
    const [handle] = clock.liveHandles();
    clock.invoke(handle!);
    expect(processed).toEqual([
      { pointerId: 31, clientX: 7, clientY: 8, shiftKey: false },
      { pointerId: 32, clientX: 90, clientY: 91, shiftKey: true },
    ]);
  });
});
