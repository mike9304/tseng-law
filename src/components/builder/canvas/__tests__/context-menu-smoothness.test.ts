import { describe, expect, it, vi } from 'vitest';
import {
  beginMenuFocusCycle,
  clampMenuLayout,
  createMenuDismissController,
  MENU_EDGE_MARGIN,
  MENU_MAX_HEIGHT,
  restoreMenuFocus,
  restoreMenuFocusCycle,
  resolveSubmenuLayout,
  type MenuDismissEventTarget,
} from '../ContextMenu';

type AnyEventListener = (event: unknown) => void;

interface FakeRegistration {
  type: string;
  listener: AnyEventListener;
  capture: boolean;
}

// Minimal event-target double. The real controller only needs
// add/removeEventListener + capture semantics, so a recording fake is enough
// to prove the isolation contract without a DOM.
class FakeEventTarget implements MenuDismissEventTarget {
  registrations: FakeRegistration[] = [];

  addEventListener(type: string, listener: AnyEventListener, options?: { capture?: boolean }) {
    this.registrations.push({ type, listener, capture: !!options?.capture });
  }

  removeEventListener(type: string, listener: AnyEventListener, options?: { capture?: boolean }) {
    const capture = !!options?.capture;
    this.registrations = this.registrations.filter(
      (reg) => !(reg.type === type && reg.listener === listener && reg.capture === capture),
    );
  }

  dispatch(type: string, event: unknown, capture = true): void {
    // Snapshot to mimic the DOM: listeners added during dispatch do not fire
    // for the in-flight event, and removed listeners are skipped.
    const snapshot = [...this.registrations];
    for (const reg of snapshot) {
      if (reg.type !== type || reg.capture !== capture) continue;
      if (!this.registrations.includes(reg)) continue;
      reg.listener(event);
    }
  }

  count(type: string, capture = true): number {
    return this.registrations.filter((reg) => reg.type === type && reg.capture === capture).length;
  }

  has(type: string, capture = true): boolean {
    return this.count(type, capture) > 0;
  }
}

function makePointerEvent(
  target: unknown,
  overrides: Partial<{ pointerId: number; button: number; pointerType: string }> = {},
) {
  return {
    target,
    pointerId: overrides.pointerId ?? 7,
    button: overrides.button ?? 0,
    pointerType: overrides.pointerType ?? 'mouse',
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    stopImmediatePropagation: vi.fn(),
  };
}

const INSIDE = Symbol('inside-menu');
const INSIDE_SUBMENU = Symbol('inside-submenu-portal');
const OUTSIDE = Symbol('outside-canvas');

describe('clampMenuLayout — primary shell viewport clamp', () => {
  it('keeps the anchor when the menu fits the viewport', () => {
    const result = clampMenuLayout({
      x: 100,
      y: 100,
      menuWidth: 280,
      rawHeight: 320,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(result.left).toBe(100);
    expect(result.top).toBe(100);
    expect(result.maxHeight).toBe(MENU_MAX_HEIGHT);
  });

  it('flips the anchor left when the menu would overflow the right edge', () => {
    const result = clampMenuLayout({
      x: 1300,
      y: 100,
      menuWidth: 280,
      rawHeight: 320,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    // x - menuWidth
    expect(result.left).toBe(1300 - 280);
    expect(result.top).toBe(100);
  });

  it('flips the anchor up when the menu would overflow the bottom edge', () => {
    const result = clampMenuLayout({
      x: 100,
      y: 820,
      menuWidth: 280,
      rawHeight: 320,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    // y - menuHeight (rawHeight capped by maxHeight=520, so menuHeight=320)
    expect(result.top).toBe(820 - 320);
    expect(result.left).toBe(100);
  });

  it('clamps into the margin band when overflow cannot be solved by flipping', () => {
    const result = clampMenuLayout({
      x: -500,
      y: -500,
      menuWidth: 280,
      rawHeight: 320,
      viewportWidth: 400,
      viewportHeight: 400,
    });
    expect(result.left).toBeGreaterThanOrEqual(MENU_EDGE_MARGIN);
    expect(result.top).toBeGreaterThanOrEqual(MENU_EDGE_MARGIN);
    expect(result.left).toBeLessThanOrEqual(400 - MENU_EDGE_MARGIN);
    expect(result.top).toBeLessThanOrEqual(400 - MENU_EDGE_MARGIN);
  });

  it('caps maxHeight to the available viewport height', () => {
    const result = clampMenuLayout({
      x: 10,
      y: 10,
      menuWidth: 280,
      rawHeight: 600,
      viewportWidth: 1440,
      viewportHeight: 200,
    });
    expect(result.maxHeight).toBe(200 - MENU_EDGE_MARGIN * 2);
  });
});

describe('resolveSubmenuLayout — submenu anchor + viewport clamp', () => {
  it('opens the submenu to the right of the trigger when it fits', () => {
    const result = resolveSubmenuLayout({
      triggerLeft: 200,
      triggerTop: 100,
      triggerRight: 480,
      nonSeparatorChildCount: 4,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(result.left).toBe(480 + 8);
    expect(result.top).toBe(100 - 6);
    expect(result.estimatedHeight).toBe(12 + 4 * 34);
  });

  it('clamps the submenu left when it would overflow the right edge', () => {
    const result = resolveSubmenuLayout({
      triggerLeft: 1200,
      triggerTop: 100,
      triggerRight: 1400,
      nonSeparatorChildCount: 4,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(result.placement).toBe('left');
    expect(result.left).toBe(1200 - 8 - 220);
    expect(result.left).toBeLessThan(1200);
  });

  it('preserves the viewport margin when neither side has full room', () => {
    const result = resolveSubmenuLayout({
      triggerLeft: 40,
      triggerTop: 100,
      triggerRight: 120,
      nonSeparatorChildCount: 4,
      viewportWidth: 240,
      viewportHeight: 900,
    });
    expect(result.placement).toBe('left');
    expect(result.left).toBe(MENU_EDGE_MARGIN);
  });

  it('caps estimated height at the submenu maximum', () => {
    const result = resolveSubmenuLayout({
      triggerLeft: 200,
      triggerTop: 100,
      triggerRight: 480,
      nonSeparatorChildCount: 50,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    expect(result.estimatedHeight).toBe(260);
  });

  it('clamps the submenu top into the margin band near the bottom edge', () => {
    const result = resolveSubmenuLayout({
      triggerLeft: 200,
      triggerTop: 880,
      triggerRight: 480,
      nonSeparatorChildCount: 4,
      viewportWidth: 1440,
      viewportHeight: 900,
    });
    const estimated = 12 + 4 * 34;
    expect(result.top).toBe(900 - estimated - MENU_EDGE_MARGIN);
  });
});

describe('createMenuDismissController — capture-phase isolation', () => {
  function setup() {
    const target = new FakeEventTarget();
    const onClose = vi.fn();
    const controller = createMenuDismissController({
      target,
      isInside: (node) => node === INSIDE || node === INSIDE_SUBMENU,
      onClose,
    });
    return { target, onClose, controller };
  }

  it('installs exactly one capture-phase pointerdown listener and is idempotent', () => {
    const { target, controller } = setup();
    controller.install();
    expect(target.count('pointerdown', true)).toBe(1);
    // Second install is a no-op (idempotent listener cleanup contract).
    controller.install();
    controller.install();
    expect(target.count('pointerdown', true)).toBe(1);
  });

  it('stops and closes on an outside pointerdown before the event can descend', () => {
    const { target, onClose, controller } = setup();
    controller.install();

    const event = makePointerEvent(OUTSIDE);
    target.dispatch('pointerdown', event, true);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    target.dispatch('pointercancel', makePointerEvent(OUTSIDE), true);
  });

  it('never stops or closes for an interior (inside-menu) pointerdown', () => {
    const { target, onClose, controller } = setup();
    controller.install();

    const event = makePointerEvent(INSIDE);
    target.dispatch('pointerdown', event, true);

    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('recognizes the separately-portaled submenu as interior', () => {
    const { target, onClose, controller } = setup();
    controller.install();

    const event = makePointerEvent(INSIDE_SUBMENU);
    target.dispatch('pointerdown', event, true);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('installs a click guard on outside pointerdown so the follow-up click is swallowed', () => {
    const { target, controller } = setup();
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    // Guard is now live.
    expect(target.has('click', true)).toBe(true);
    expect(target.has('auxclick', true)).toBe(true);
    expect(target.has('contextmenu', true)).toBe(true);

    const followUp = makePointerEvent(OUTSIDE);
    target.dispatch('click', followUp, true);
    expect(followUp.preventDefault).toHaveBeenCalledTimes(1);
    expect(followUp.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    expect(followUp.stopPropagation).toHaveBeenCalledTimes(1);
  });

  it('never swallows a keyboard click or a different pointer/button', () => {
    const { target, controller } = setup();
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    const keyboardClick = makePointerEvent(OUTSIDE, { pointerId: -1, button: 0, pointerType: '' });
    const otherPointer = makePointerEvent(OUTSIDE, { pointerId: 8 });
    const otherButton = makePointerEvent(OUTSIDE, { button: 1 });
    target.dispatch('click', keyboardClick, true);
    target.dispatch('click', otherPointer, true);
    target.dispatch('auxclick', otherButton, true);

    expect(keyboardClick.stopImmediatePropagation).not.toHaveBeenCalled();
    expect(otherPointer.stopImmediatePropagation).not.toHaveBeenCalled();
    expect(otherButton.stopImmediatePropagation).not.toHaveBeenCalled();
    expect(target.has('click', true)).toBe(true);
    target.dispatch('pointercancel', makePointerEvent(OUTSIDE), true);
  });

  it('self-retires the guard after the first follow-up click (no lingering blocking)', () => {
    const { target, controller } = setup();
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    target.dispatch('click', makePointerEvent(OUTSIDE), true);

    expect(target.has('click', true)).toBe(false);
    expect(target.has('auxclick', true)).toBe(false);
    expect(target.has('contextmenu', true)).toBe(false);
    expect(target.has('pointercancel', true)).toBe(false);
  });

  it('bounds drag-away cleanup to the pointerup lifecycle', () => {
    vi.useFakeTimers();
    const { target, controller } = setup();
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    expect(target.has('click', true)).toBe(true);
    controller.teardown();
    expect(target.count('pointerdown', true)).toBe(1);
    const pointerUp = makePointerEvent(OUTSIDE);
    target.dispatch('pointerup', pointerUp, true);
    expect(pointerUp.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    expect(target.has('click', true)).toBe(true);
    vi.runAllTimers();
    expect(target.has('click', true)).toBe(false);
    expect(target.has('pointercancel', true)).toBe(false);
    expect(target.count('pointerdown', true)).toBe(0);
    vi.useRealTimers();
  });

  it('teardown removes the persistent pointerdown listener but leaves a live guard to catch the dismissal click', () => {
    const { target, controller } = setup();
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    controller.teardown();

    // Persistent listener removed (no more auto-close on outside pointerdown).
    expect(target.count('pointerdown', true)).toBe(1); // only the guard lifecycle listener remains
    // Guard still alive to swallow the follow-up click that fires post-unmount.
    expect(target.has('click', true)).toBe(true);

    const followUp = makePointerEvent(OUTSIDE);
    target.dispatch('click', followUp, true);
    expect(followUp.stopPropagation).toHaveBeenCalledTimes(1);
    // Guard now retired.
    expect(target.has('click', true)).toBe(false);
  });

  it('isolates right-button contextmenu/auxclick only for the exact gesture', () => {
    vi.useFakeTimers();
    const { target, controller } = setup();
    controller.install();
    const right = { pointerId: 12, button: 2, pointerType: 'mouse' };

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE, right), true);
    const nativeMenu = makePointerEvent(OUTSIDE, right);
    target.dispatch('contextmenu', nativeMenu, true);
    expect(nativeMenu.preventDefault).toHaveBeenCalledTimes(1);
    expect(target.has('auxclick', true)).toBe(true);

    target.dispatch('pointerup', makePointerEvent(OUTSIDE, right), true);
    const aux = makePointerEvent(OUTSIDE, right);
    target.dispatch('auxclick', aux, true);
    expect(aux.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    vi.runAllTimers();
    expect(target.has('auxclick', true)).toBe(false);
    vi.useRealTimers();
  });

  it('clears immediately on matching pointercancel', () => {
    const { target, controller } = setup();
    controller.install();
    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);

    const cancel = makePointerEvent(OUTSIDE);
    target.dispatch('pointercancel', cancel, true);
    expect(cancel.preventDefault).toHaveBeenCalledTimes(1);
    expect(target.has('click', true)).toBe(false);
    expect(target.has('pointerup', true)).toBe(false);
  });

  it.each(['blur', 'pagehide'])('clears immediately when the window lifecycle emits %s', (type) => {
    const { target, controller } = setup();
    controller.install();
    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    controller.teardown();
    expect(target.has('click', true)).toBe(true);

    target.dispatch(type, {}, true);
    expect(target.has('click', true)).toBe(false);
    expect(target.has('pointerup', true)).toBe(false);
    expect(target.has('blur', true)).toBe(false);
    expect(target.has('pagehide', true)).toBe(false);
  });

  it('bounds listener lifetime even when no terminal pointer event arrives', () => {
    vi.useFakeTimers();
    const { target, controller } = setup();
    controller.install();
    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    controller.teardown();
    expect(target.has('click', true)).toBe(true);

    vi.runAllTimers();
    expect(target.registrations).toEqual([]);
    vi.useRealTimers();
  });

  it.each([
    ['reused identity', {}],
    ['different pointer', { pointerId: 99 }],
  ])('drops the old guard without swallowing the next pointerdown (%s)', (_label, overrides) => {
    const { target, controller } = setup();
    controller.install();
    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    controller.teardown();

    const nextPointer = makePointerEvent(OUTSIDE, overrides);
    target.dispatch('pointerdown', nextPointer, true);
    expect(nextPointer.preventDefault).not.toHaveBeenCalled();
    expect(target.has('click', true)).toBe(false);
  });

  it('invokes onClose exactly once per outside pointerdown (no double invocation)', () => {
    const { target, onClose, controller } = setup();
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    expect(onClose).toHaveBeenCalledTimes(1);
    target.dispatch('pointercancel', makePointerEvent(OUTSIDE), true);
  });

  it('teardown of a controller with no active guard removes only the persistent listener', () => {
    const { target, controller } = setup();
    controller.install();
    controller.teardown();
    expect(target.count('pointerdown', true)).toBe(0);
    expect(target.has('click', true)).toBe(false);
    expect(target.has('auxclick', true)).toBe(false);
    expect(target.has('pointercancel', true)).toBe(false);
  });
});

describe('createMenuDismissController — guard cleanup is idempotent', () => {
  it('installGuard replaces a prior guard rather than stacking listeners', () => {
    const target = new FakeEventTarget();
    const controller = createMenuDismissController({
      target,
      isInside: () => false,
      onClose: () => undefined,
    });
    controller.install();

    target.dispatch('pointerdown', makePointerEvent(OUTSIDE), true);
    expect(target.count('click', true)).toBe(1);

    controller.teardown();
    target.dispatch('pointerdown', makePointerEvent(OUTSIDE, { pointerId: 8 }), true);
    expect(target.count('click', true)).toBe(0);
    expect(target.count('auxclick', true)).toBe(0);
  });
});

describe('restoreMenuFocus', () => {
  it('restores a still-connected origin without scrolling', () => {
    const focus = vi.fn();
    expect(restoreMenuFocus({ isConnected: true, focus })).toBe(true);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('does not focus a detached origin', () => {
    const focus = vi.fn();
    expect(restoreMenuFocus({ isConnected: false, focus })).toBe(false);
    expect(focus).not.toHaveBeenCalled();
  });

  it('resets the restored guard for the StrictMode setup-cleanup-setup lifecycle', () => {
    const focus = vi.fn();
    const origin = { isConnected: true, focus } as unknown as HTMLElement;
    const cycle = { origin: null, restored: false };

    beginMenuFocusCycle(cycle, origin);
    expect(restoreMenuFocusCycle(cycle)).toBe(true); // dev probe cleanup
    expect(restoreMenuFocusCycle(cycle)).toBe(false); // idempotent per cycle

    beginMenuFocusCycle(cycle, origin); // real StrictMode setup resets the guard
    expect(restoreMenuFocusCycle(cycle)).toBe(true); // real parent-driven unmount
    expect(focus).toHaveBeenCalledTimes(2);
  });

  it('does not restore twice after an explicit action/escape/outside close', () => {
    const focus = vi.fn();
    const origin = { isConnected: true, focus } as unknown as HTMLElement;
    const cycle = { origin: null, restored: false };

    beginMenuFocusCycle(cycle, origin);
    expect(restoreMenuFocusCycle(cycle)).toBe(true);
    expect(restoreMenuFocusCycle(cycle)).toBe(false);
    expect(focus).toHaveBeenCalledTimes(1);
  });
});
