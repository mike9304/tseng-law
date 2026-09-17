import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cancelScheduledOverlayScrollRestores,
  restoreOverlayScrollSnapshots,
  scheduleOverlayScrollRestore,
  type ScrollSnapshot,
} from '../overlayFocus';

function createSnapshot(left: number, top: number): ScrollSnapshot {
  return {
    element: {
      isConnected: true,
      scrollLeft: left,
      scrollTop: top,
    } as HTMLElement,
    left,
    top,
  };
}

function mutateSnapshot(snapshot: ScrollSnapshot, left: number, top: number): void {
  snapshot.element.scrollLeft = left;
  snapshot.element.scrollTop = top;
}

describe('scheduleOverlayScrollRestore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const fakeSetTimeout = globalThis.setTimeout.bind(globalThis);
    vi.stubGlobal('window', {
      setTimeout: fakeSetTimeout,
      requestAnimationFrame: (callback: FrameRequestCallback) => (
        fakeSetTimeout(() => callback(0), 0) as unknown as number
      ),
    });
  });

  afterEach(() => {
    cancelScheduledOverlayScrollRestores();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('restores immediately and through delayed retries when no gate is provided', () => {
    const snapshot = createSnapshot(12, 34);
    mutateSnapshot(snapshot, 90, 91);

    scheduleOverlayScrollRestore([snapshot]);

    expect(snapshot.element.scrollLeft).toBe(12);
    expect(snapshot.element.scrollTop).toBe(34);

    mutateSnapshot(snapshot, 1, 2);
    vi.advanceTimersByTime(150);

    expect(snapshot.element.scrollLeft).toBe(12);
    expect(snapshot.element.scrollTop).toBe(34);
  });

  it('skips pending retries after shouldRestore flips to false', () => {
    const snapshot = createSnapshot(8, 16);
    let allowRestore = true;

    scheduleOverlayScrollRestore([snapshot], () => allowRestore);
    expect(snapshot.element.scrollLeft).toBe(8);
    expect(snapshot.element.scrollTop).toBe(16);

    mutateSnapshot(snapshot, 40, 50);
    allowRestore = false;
    vi.advanceTimersByTime(150);

    expect(snapshot.element.scrollLeft).toBe(40);
    expect(snapshot.element.scrollTop).toBe(50);
  });

  it('cancelScheduledOverlayScrollRestores no-ops already scheduled retries without blocking a later schedule', () => {
    const snapshot = createSnapshot(5, 6);
    scheduleOverlayScrollRestore([snapshot]);
    mutateSnapshot(snapshot, 70, 80);

    cancelScheduledOverlayScrollRestores();
    vi.advanceTimersByTime(150);

    expect(snapshot.element.scrollLeft).toBe(70);
    expect(snapshot.element.scrollTop).toBe(80);

    scheduleOverlayScrollRestore([snapshot]);
    expect(snapshot.element.scrollLeft).toBe(5);
    expect(snapshot.element.scrollTop).toBe(6);
  });

  it('leaves immediate restoreOverlayScrollSnapshots available after cancel (Escape-style restore)', () => {
    const snapshot = createSnapshot(3, 4);
    mutateSnapshot(snapshot, 11, 12);
    cancelScheduledOverlayScrollRestores();
    restoreOverlayScrollSnapshots([snapshot]);

    expect(snapshot.element.scrollLeft).toBe(3);
    expect(snapshot.element.scrollTop).toBe(4);
  });
});
