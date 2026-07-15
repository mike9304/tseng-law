'use client';

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './SandboxPage.module.css';

export interface ContextMenuAction {
  key: string;
  label: string;
  title?: string;
  shortcut?: string;
  icon?: ReactNode;
  disabled?: boolean;
  separator?: boolean;
  tone?: 'default' | 'danger';
  children?: ContextMenuAction[];
  onSelect?: () => void;
}

export const MENU_EDGE_MARGIN = 12;
export const MENU_MAX_HEIGHT = 520;
const MENU_WIDTH = 280;
const SUBMENU_GAP = 8;
const SUBMENU_WIDTH = 220;
const SUBMENU_TRIGGER_TOP_OFFSET = 6;
const SUBMENU_BASE_HEIGHT = 12;
const SUBMENU_ROW_HEIGHT = 34;
const SUBMENU_MAX_HEIGHT = 260;
const DISMISS_GUARD_MAX_LIFETIME_MS = 5_000;

function clampAxis(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export interface MenuClampInput {
  x: number;
  y: number;
  menuWidth: number;
  rawHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  edgeMargin?: number;
  maxHeightCap?: number;
}

export interface MenuClampResult {
  left: number;
  top: number;
  maxHeight: number;
}

// Pure viewport-clamp for the primary menu shell. Extracted so the geometry is
// unit-testable without a DOM. The formula is identical to the prior inline
// implementation: flip the anchor to the left/top when the menu would overflow,
// then clamp to the margin band. `maxHeight` is the CSS cap (the element
// scrolls internally); `top` is positioned using the actual rendered height.
export function clampMenuLayout(input: MenuClampInput): MenuClampResult {
  const edgeMargin = input.edgeMargin ?? MENU_EDGE_MARGIN;
  const maxHeightCap = input.maxHeightCap ?? MENU_MAX_HEIGHT;
  const availableHeight = Math.max(0, input.viewportHeight - edgeMargin * 2);
  const maxHeight = Math.min(maxHeightCap, availableHeight);
  const menuHeight = Math.min(input.rawHeight, maxHeight);

  let left = input.x;
  if (left + input.menuWidth + edgeMargin > input.viewportWidth) {
    left = input.x - input.menuWidth;
  }
  left = clampAxis(
    left,
    edgeMargin,
    Math.max(edgeMargin, input.viewportWidth - input.menuWidth - edgeMargin),
  );

  let top = input.y;
  if (top + menuHeight + edgeMargin > input.viewportHeight) {
    top = input.y - menuHeight;
  }
  top = clampAxis(
    top,
    edgeMargin,
    Math.max(edgeMargin, input.viewportHeight - menuHeight - edgeMargin),
  );

  return { left, top, maxHeight };
}

export interface SubmenuLayoutInput {
  triggerLeft: number;
  triggerTop: number;
  triggerRight: number;
  nonSeparatorChildCount: number;
  viewportWidth: number;
  viewportHeight: number;
  edgeMargin?: number;
}

export interface SubmenuLayoutResult {
  left: number;
  top: number;
  estimatedHeight: number;
  placement: 'left' | 'right';
}

// Pure submenu anchor resolver. Prefer the right side, but flip to the actual
// left side of the trigger before clamping when the right side has no room.
export function resolveSubmenuLayout(input: SubmenuLayoutInput): SubmenuLayoutResult {
  const edgeMargin = input.edgeMargin ?? MENU_EDGE_MARGIN;
  const estimatedHeight = Math.min(
    SUBMENU_MAX_HEIGHT,
    SUBMENU_BASE_HEIGHT + Math.max(0, input.nonSeparatorChildCount) * SUBMENU_ROW_HEIGHT,
  );
  const rightCandidate = input.triggerRight + SUBMENU_GAP;
  const leftCandidate = input.triggerLeft - SUBMENU_GAP - SUBMENU_WIDTH;
  const placement = rightCandidate + SUBMENU_WIDTH + edgeMargin > input.viewportWidth
    ? 'left'
    : 'right';
  const left = clampAxis(
    placement === 'left' ? leftCandidate : rightCandidate,
    edgeMargin,
    Math.max(edgeMargin, input.viewportWidth - SUBMENU_WIDTH - edgeMargin),
  );
  const top = clampAxis(
    input.triggerTop - SUBMENU_TRIGGER_TOP_OFFSET,
    edgeMargin,
    Math.max(edgeMargin, input.viewportHeight - estimatedHeight - edgeMargin),
  );
  return { left, top, estimatedHeight, placement };
}

type AnyEventListener = (event: unknown) => void;

export interface MenuDismissEventTarget {
  addEventListener: (type: string, listener: AnyEventListener, options?: { capture?: boolean }) => void;
  removeEventListener: (type: string, listener: AnyEventListener, options?: { capture?: boolean }) => void;
}

export interface MenuDismissController {
  install: () => void;
  teardown: () => void;
}

interface MenuPointerIdentity {
  pointerId: number;
  button: number;
  pointerType: string;
}

interface MenuPointerEventLike {
  target?: unknown;
  pointerId?: number;
  button?: number;
  pointerType?: string;
  preventDefault?: () => void;
  stopPropagation?: () => void;
  stopImmediatePropagation?: () => void;
}

function asMenuEvent(event: unknown): MenuPointerEventLike {
  if (event && typeof event === 'object') {
    return event as MenuPointerEventLike;
  }
  return {};
}

function pointerIdentity(event: MenuPointerEventLike): MenuPointerIdentity | null {
  if (
    typeof event.pointerId !== 'number'
    || typeof event.button !== 'number'
    || typeof event.pointerType !== 'string'
  ) {
    return null;
  }
  return {
    pointerId: event.pointerId,
    button: event.button,
    pointerType: event.pointerType,
  };
}

function isSamePointer(event: MenuPointerEventLike, identity: MenuPointerIdentity): boolean {
  return event.pointerId === identity.pointerId
    && event.button === identity.button
    && event.pointerType === identity.pointerType;
}

function isolatePointerEvent(event: MenuPointerEventLike): void {
  event.preventDefault?.();
  event.stopImmediatePropagation?.();
  event.stopPropagation?.();
}

export function restoreMenuFocus(origin: { isConnected?: boolean; focus?: (options?: FocusOptions) => void } | null): boolean {
  if (!origin?.isConnected || typeof origin.focus !== 'function') return false;
  origin.focus({ preventScroll: true });
  return true;
}

export interface MenuFocusCycle {
  origin: HTMLElement | null;
  restored: boolean;
}

export function beginMenuFocusCycle(cycle: MenuFocusCycle, origin: HTMLElement | null): void {
  cycle.origin = origin;
  cycle.restored = false;
}

export function restoreMenuFocusCycle(cycle: MenuFocusCycle): boolean {
  if (cycle.restored) return false;
  const restored = restoreMenuFocus(cycle.origin);
  if (restored) cycle.restored = true;
  return restored;
}

// Capture-phase outside-pointer isolation. A persistent `pointerdown` capture
// listener intercepts any outside press BEFORE it descends to the canvas React
// root, so the dismissal gesture can neither select nor move an underlying
// node (selection here is pointerdown-driven).
//
// Follow-up `click`/`auxclick`/`contextmenu` events may fire AFTER the menu
// unmounts, so a pointer-identity guard survives controller `teardown()`. It
// retires on the matching terminal event/cancel, a different pointer,
// blur/pagehide, or a bounded safety timeout. Pointerup shortens that timeout
// to the next task so native click/auxclick still remains protected.
//
// `install()` is idempotent. `teardown()` removes the persistent pointerdown
// listener but leaves a live guard in place so the dismissal gesture remains
// isolated through its native event lifecycle.
export function createMenuDismissController(options: {
  target: MenuDismissEventTarget;
  isInside: (target: unknown) => boolean;
  onClose: () => void;
}): MenuDismissController {
  const { target, isInside, onClose } = options;
  const CAPTURE = { capture: true };
  const pointerDownType = 'pointerdown';
  const followUpTypes = ['click', 'auxclick', 'contextmenu'] as const;
  let installed = false;
  let guardIdentity: MenuPointerIdentity | null = null;
  let cleanupTimer: ReturnType<typeof setTimeout> | null = null;

  const clearGuard = () => {
    if (!guardIdentity) return;
    guardIdentity = null;
    if (cleanupTimer != null) {
      clearTimeout(cleanupTimer);
      cleanupTimer = null;
    }
    for (const type of followUpTypes) {
      target.removeEventListener(type, stopFollowUp, CAPTURE);
    }
    target.removeEventListener('pointerdown', handleGuardPointerDown, CAPTURE);
    target.removeEventListener('pointerup', handleGuardPointerEnd, CAPTURE);
    target.removeEventListener('pointercancel', handleGuardPointerCancel, CAPTURE);
    target.removeEventListener('blur', clearGuard, CAPTURE);
    target.removeEventListener('pagehide', clearGuard, CAPTURE);
  };

  const stopFollowUp = (event: unknown) => {
    const e = asMenuEvent(event);
    const identity = guardIdentity;
    if (!identity || !isSamePointer(e, identity)) return;
    isolatePointerEvent(e);
    // click and auxclick are terminal. contextmenu may precede pointerup and
    // auxclick for a right-button gesture, so keep the guard through it.
    if (typeof e.button === 'number' && e.button !== 2) clearGuard();
  };

  const handleGuardPointerDown = (_event: unknown) => {
    if (!guardIdentity) return;
    // This listener is installed during the dismissing pointerdown, so it
    // cannot observe that in-flight dispatch. Any pointerdown it does observe
    // is necessarily a new gesture, even when the browser reuses pointerId 1.
    clearGuard();
  };

  const handleGuardPointerEnd = (event: unknown) => {
    const e = asMenuEvent(event);
    const identity = guardIdentity;
    if (!identity || !isSamePointer(e, identity)) return;
    isolatePointerEvent(e);
    // The browser emits click/auxclick immediately after pointerup. A zero-delay
    // task bounds cleanup for drag-away gestures while leaving that native
    // follow-up dispatch in the same interaction turn protected.
    if (cleanupTimer != null) clearTimeout(cleanupTimer);
    cleanupTimer = setTimeout(clearGuard, 0);
  };

  const handleGuardPointerCancel = (event: unknown) => {
    const e = asMenuEvent(event);
    const identity = guardIdentity;
    if (!identity || !isSamePointer(e, identity)) return;
    isolatePointerEvent(e);
    clearGuard();
  };

  const installGuard = (identity: MenuPointerIdentity) => {
    clearGuard();
    guardIdentity = identity;
    for (const type of followUpTypes) {
      target.addEventListener(type, stopFollowUp, CAPTURE);
    }
    target.addEventListener('pointerdown', handleGuardPointerDown, CAPTURE);
    target.addEventListener('pointerup', handleGuardPointerEnd, CAPTURE);
    target.addEventListener('pointercancel', handleGuardPointerCancel, CAPTURE);
    target.addEventListener('blur', clearGuard, CAPTURE);
    target.addEventListener('pagehide', clearGuard, CAPTURE);
    cleanupTimer = setTimeout(clearGuard, DISMISS_GUARD_MAX_LIFETIME_MS);
  };

  const handleOutsidePointerDown = (event: unknown) => {
    const e = asMenuEvent(event);
    if (isInside(e.target)) return; // interior pointer events flow normally
    const identity = pointerIdentity(e);
    if (!identity) return;
    isolatePointerEvent(e);
    installGuard(identity);
    onClose();
  };

  return {
    install() {
      if (installed) return; // idempotent
      installed = true;
      target.addEventListener(pointerDownType, handleOutsidePointerDown, CAPTURE);
    },
    teardown() {
      if (!installed) return;
      installed = false;
      target.removeEventListener(pointerDownType, handleOutsidePointerDown, CAPTURE);
      // Intentionally do NOT clearGuard(): a guard installed by the most recent
      // outside pointerdown must outlive this controller so the follow-up click
      // (which fires after unmount) is still blocked. The guard self-retires.
    },
  };
}

function ContextMenu({
  x,
  y,
  title,
  actions,
  onClose,
}: {
  x: number;
  y: number;
  title: string;
  actions: ContextMenuAction[];
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const submenuRef = useRef<HTMLDivElement | null>(null);
  const actionRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const submenuActionRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());
  const focusCycleRef = useRef<MenuFocusCycle>({ origin: null, restored: false });
  const submenuKeyboardOpenRef = useRef(false);
  const [layout, setLayout] = useState<{
    sourceX: number;
    sourceY: number;
    left: number;
    top: number;
    maxHeight?: number;
  } | null>(null);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);
  const [activeSubmenuIndex, setActiveSubmenuIndex] = useState<number | null>(null);
  const [openSubmenuKey, setOpenSubmenuKey] = useState<string | null>(null);
  const [submenuLayout, setSubmenuLayout] = useState<{
    left: number;
    top: number;
    placement: 'left' | 'right';
  } | null>(null);

  const enabledActionIndexes = useMemo(
    () => actions
      .map((action, index) => (action.separator || action.disabled ? -1 : index))
      .filter((index) => index >= 0),
    [actions],
  );
  const firstEnabledActionIndex = enabledActionIndexes[0] ?? null;
  const openSubmenuAction = useMemo(
    () => openSubmenuKey
      ? actions.find((action) => action.key === openSubmenuKey && action.children?.length)
      : null,
    [actions, openSubmenuKey],
  );
  const enabledSubmenuIndexes = useMemo(
    () => openSubmenuAction?.children
      ?.map((action, index) => (action.separator || action.disabled ? -1 : index))
      .filter((index) => index >= 0) ?? [],
    [openSubmenuAction],
  );

  const restoreFocusOrigin = useCallback(() => {
    restoreMenuFocusCycle(focusCycleRef.current);
  }, []);

  const closeMenu = useCallback(() => {
    restoreFocusOrigin();
    onClose();
  }, [onClose, restoreFocusOrigin]);

  useLayoutEffect(() => {
    beginMenuFocusCycle(
      focusCycleRef.current,
      document.activeElement instanceof HTMLElement ? document.activeElement : null,
    );
    return () => {
      restoreFocusOrigin();
    };
  }, [restoreFocusOrigin]);

  useEffect(() => {
    setActiveActionIndex(firstEnabledActionIndex);
  }, [firstEnabledActionIndex]);

  useEffect(() => {
    if (activeActionIndex == null) return;
    const action = actions[activeActionIndex];
    if (!action || action.separator || action.disabled) return;
    actionRefs.current.get(action.key)?.focus();
  }, [actions, activeActionIndex]);

  useEffect(() => {
    if (!openSubmenuAction || !submenuKeyboardOpenRef.current || activeSubmenuIndex == null) return;
    const action = openSubmenuAction.children?.[activeSubmenuIndex];
    if (!action || action.separator || action.disabled) return;
    submenuActionRefs.current.get(action.key)?.focus();
  }, [activeSubmenuIndex, openSubmenuAction]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const nextLayout = clampMenuLayout({
      x,
      y,
      menuWidth: menu.offsetWidth || MENU_WIDTH,
      rawHeight: menu.scrollHeight || 0,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    });
    const source = { sourceX: x, sourceY: y, ...nextLayout };

    setLayout((current) => {
      if (
        current?.sourceX === source.sourceX
        && current.sourceY === source.sourceY
        && current.left === source.left
        && current.top === source.top
        && current.maxHeight === source.maxHeight
      ) {
        return current;
      }
      return source;
    });
  }, [actions.length, title, x, y]);

  useLayoutEffect(() => {
    if (!openSubmenuKey) {
      setSubmenuLayout(null);
      return undefined;
    }

    const updateSubmenuLayout = () => {
      const trigger = actionRefs.current.get(openSubmenuKey);
      const action = actions.find((item) => item.key === openSubmenuKey);
      if (!trigger || !action?.children?.length) {
        setSubmenuLayout(null);
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const resolved = resolveSubmenuLayout({
        triggerLeft: rect.left,
        triggerTop: rect.top,
        triggerRight: rect.right,
        nonSeparatorChildCount: action.children.filter((child) => !child.separator).length,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      setSubmenuLayout({ left: resolved.left, top: resolved.top, placement: resolved.placement });
    };

    updateSubmenuLayout();
    window.addEventListener('resize', updateSubmenuLayout);
    window.addEventListener('scroll', updateSubmenuLayout, true);
    return () => {
      window.removeEventListener('resize', updateSubmenuLayout);
      window.removeEventListener('scroll', updateSubmenuLayout, true);
    };
  }, [actions, openSubmenuKey]);

  // Capture-phase outside-pointer isolation. Deps are intentionally stable
  // (onClose is a memoized callback from the layer) so the listener never
  // re-registers between renders — re-registration would briefly drop the
  // capture boundary and let a click slip through to the canvas. The handler
  // reads live refs each event, so it always sees the current menu/submenu.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const controller = createMenuDismissController({
      // Explicit adapter so the controller's generic listener signature does
      // not collide with WindowEventMap overload resolution.
      target: {
        addEventListener: (type, listener, options) => window.addEventListener(
          type,
          listener as EventListener,
          options,
        ),
        removeEventListener: (type, listener, options) => window.removeEventListener(
          type,
          listener as EventListener,
          options,
        ),
      },
      isInside: (node) => {
        if (!(node instanceof Node)) return false;
        const menu = menuRef.current;
        if (menu && menu.contains(node)) return true;
        const submenu = submenuRef.current;
        if (submenu && submenu.contains(node)) return true;
        return false;
      },
      onClose: closeMenu,
    });
    controller.install();
    return () => controller.teardown();
  }, [closeMenu]);

  const closeSubmenu = useCallback(() => {
    const triggerKey = openSubmenuKey;
    submenuKeyboardOpenRef.current = false;
    setActiveSubmenuIndex(null);
    setOpenSubmenuKey(null);
    if (triggerKey) actionRefs.current.get(triggerKey)?.focus();
  }, [openSubmenuKey]);

  const openSubmenuForAction = useCallback((
    action: ContextMenuAction,
    index?: number,
    focusFirstChild = false,
  ) => {
    if (action.disabled || !action.children?.length) return;
    if (index != null) setActiveActionIndex(index);

    const trigger = actionRefs.current.get(action.key);
    if (trigger && typeof window !== 'undefined') {
      const rect = trigger.getBoundingClientRect();
      const resolved = resolveSubmenuLayout({
        triggerLeft: rect.left,
        triggerTop: rect.top,
        triggerRight: rect.right,
        nonSeparatorChildCount: action.children.filter((child) => !child.separator).length,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      });
      setSubmenuLayout({ left: resolved.left, top: resolved.top, placement: resolved.placement });
    }
    submenuKeyboardOpenRef.current = focusFirstChild;
    const firstEnabledChildIndex = action.children.findIndex((child) => !child.separator && !child.disabled);
    setActiveSubmenuIndex(focusFirstChild && firstEnabledChildIndex >= 0
      ? firstEnabledChildIndex
      : null);
    setOpenSubmenuKey(action.key);
  }, []);

  const selectAction = useCallback((action: ContextMenuAction, index?: number) => {
    if (action.disabled) return;
    if (action.children?.length) {
      openSubmenuForAction(action, index, false);
      return;
    }
    // Restore/close before running the command. Commands that intentionally
    // move focus (text edit, modal open) may then establish their own target.
    closeMenu();
    action.onSelect?.();
  }, [closeMenu, openSubmenuForAction]);

  useEffect(() => {
    function moveActive(delta: 1 | -1) {
      if (enabledActionIndexes.length === 0) return;
      setActiveActionIndex((current) => {
        const currentEnabledIndex = enabledActionIndexes.indexOf(current ?? -1);
        const startIndex = currentEnabledIndex === -1 ? 0 : currentEnabledIndex;
        const nextEnabledIndex = (startIndex + delta + enabledActionIndexes.length) % enabledActionIndexes.length;
        return enabledActionIndexes[nextEnabledIndex] ?? null;
      });
    }

    function getKeyboardActionIndex() {
      const focused = document.activeElement;
      const focusedIndex = actions.findIndex((action) => (
        !action.separator && actionRefs.current.get(action.key) === focused
      ));
      return focusedIndex >= 0 ? focusedIndex : activeActionIndex;
    }

    function getKeyboardSubmenuIndex() {
      const focused = document.activeElement;
      const focusedIndex = openSubmenuAction?.children?.findIndex((action) => (
        !action.separator && submenuActionRefs.current.get(action.key) === focused
      )) ?? -1;
      return focusedIndex >= 0 ? focusedIndex : activeSubmenuIndex;
    }

    function moveSubmenuActive(delta: 1 | -1) {
      if (enabledSubmenuIndexes.length === 0) return;
      setActiveSubmenuIndex((current) => {
        const currentEnabledIndex = enabledSubmenuIndexes.indexOf(current ?? -1);
        const startIndex = currentEnabledIndex === -1 ? 0 : currentEnabledIndex;
        const nextEnabledIndex = (
          startIndex + delta + enabledSubmenuIndexes.length
        ) % enabledSubmenuIndexes.length;
        return enabledSubmenuIndexes[nextEnabledIndex] ?? null;
      });
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (openSubmenuKey) {
          event.preventDefault();
          closeSubmenu();
        } else {
          closeMenu();
        }
        return;
      }
      const submenuIndex = getKeyboardSubmenuIndex();
      const submenuHasFocus = submenuIndex != null
        && submenuIndex >= 0
        && openSubmenuAction?.children?.[submenuIndex] != null
        && submenuActionRefs.current.get(openSubmenuAction.children[submenuIndex]!.key) === document.activeElement;
      if (submenuHasFocus) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          closeSubmenu();
          return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          moveSubmenuActive(event.key === 'ArrowDown' ? 1 : -1);
          return;
        }
        if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault();
          setActiveSubmenuIndex(event.key === 'Home'
            ? (enabledSubmenuIndexes[0] ?? null)
            : (enabledSubmenuIndexes[enabledSubmenuIndexes.length - 1] ?? null));
          return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
          const action = openSubmenuAction?.children?.[submenuIndex];
          if (!action || action.separator || action.disabled) return;
          event.preventDefault();
          selectAction(action);
          return;
        }
      }
      if (event.key === 'ArrowRight') {
        const actionIndex = getKeyboardActionIndex();
        if (actionIndex == null) return;
        const action = actions[actionIndex];
        if (action?.children?.length) {
          event.preventDefault();
          openSubmenuForAction(action, actionIndex, true);
        }
        return;
      }
      if (event.key === 'ArrowLeft') {
        if (openSubmenuKey) {
          event.preventDefault();
          closeSubmenu();
        }
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveActive(1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveActive(-1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setActiveActionIndex(enabledActionIndexes[0] ?? null);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        setActiveActionIndex(enabledActionIndexes[enabledActionIndexes.length - 1] ?? null);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        const actionIndex = getKeyboardActionIndex();
        if (actionIndex == null) return;
        const action = actions[actionIndex];
        if (!action || action.separator || action.disabled) return;
        event.preventDefault();
        if (action.children?.length) {
          openSubmenuForAction(action, actionIndex, true);
          return;
        }
        selectAction(action, actionIndex);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    actions,
    activeActionIndex,
    activeSubmenuIndex,
    closeMenu,
    closeSubmenu,
    enabledActionIndexes,
    enabledSubmenuIndexes,
    openSubmenuAction,
    openSubmenuForAction,
    openSubmenuKey,
    selectAction,
  ]);
  const submenu = openSubmenuAction?.children?.length && submenuLayout && typeof document !== 'undefined'
    ? createPortal(
      <div
        ref={submenuRef}
        className={styles.contextSubmenu}
        role="menu"
        aria-label={`${openSubmenuAction.label} submenu`}
        data-submenu-placement={submenuLayout.placement}
        style={{ left: `${submenuLayout.left}px`, top: `${submenuLayout.top}px` }}
      >
        {openSubmenuAction.children.map((child, childIndex) => (
          child.separator ? (
            <hr key={child.key} className={styles.contextMenuDivider} />
          ) : (
            <button
              ref={(element) => {
                submenuActionRefs.current.set(child.key, element);
              }}
              key={child.key}
              type="button"
              role="menuitem"
              className={styles.contextMenuAction}
              data-active={activeSubmenuIndex === childIndex ? 'true' : undefined}
              data-context-menu-action={child.key}
              data-tone={child.tone === 'danger' ? 'danger' : undefined}
              title={child.title}
              disabled={child.disabled}
              onFocus={() => {
                setActiveSubmenuIndex(childIndex);
              }}
              onMouseEnter={() => {
                submenuKeyboardOpenRef.current = false;
                setActiveSubmenuIndex(childIndex);
              }}
              onClick={() => selectAction(child)}
            >
              <span className={styles.contextMenuActionLabel}>
                {child.icon && <span className={styles.contextMenuActionIcon}>{child.icon}</span>}
                {child.label}
              </span>
              {child.shortcut && <kbd className={styles.contextMenuShortcut}>{child.shortcut}</kbd>}
            </button>
          )
        ))}
      </div>,
      document.body,
    )
    : null;

  if (typeof document === 'undefined') return null;

  const menuNode = (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{
        position: 'fixed',
        left: `${layout?.sourceX === x && layout.sourceY === y ? layout.left : x}px`,
        top: `${layout?.sourceX === x && layout.sourceY === y ? layout.top : y}px`,
        width: MENU_WIDTH,
        maxHeight: layout?.maxHeight != null ? `${layout.maxHeight}px` : undefined,
        overflowY: 'auto',
        zIndex: 10120,
      }}
      role="menu"
      aria-label={title}
    >
        <header className={styles.contextMenuHeader}>
          <strong>{title}</strong>
        </header>
        <div className={styles.contextMenuActions}>
          {actions.map((action, index) => (
            action.separator ? (
              <hr key={action.key} className={styles.contextMenuDivider} />
            ) : (
              <div key={action.key} className={styles.contextMenuActionWrap}>
                <button
                  ref={(element) => {
                    actionRefs.current.set(action.key, element);
                  }}
                  type="button"
                  role="menuitem"
                  className={styles.contextMenuAction}
                  data-active={activeActionIndex === index ? 'true' : undefined}
                  data-context-menu-action={action.key}
                  data-tone={action.tone === 'danger' ? 'danger' : undefined}
                  data-has-submenu={action.children?.length ? 'true' : undefined}
                  aria-haspopup={action.children?.length ? 'menu' : undefined}
                  aria-expanded={action.children?.length ? openSubmenuKey === action.key : undefined}
                  title={action.title}
                  disabled={action.disabled}
                  onFocus={() => {
                    setActiveActionIndex(index);
                  }}
                  onMouseEnter={() => {
                    setActiveActionIndex(index);
                    if (action.children?.length) openSubmenuForAction(action, index, false);
                  }}
                  onKeyDown={(event) => {
                    if (!action.children?.length) return;
                    if (event.key !== 'ArrowRight' && event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    event.stopPropagation();
                    openSubmenuForAction(action, index, true);
                  }}
                  onClick={() => {
                    selectAction(action, index);
                  }}
                >
                  <span className={styles.contextMenuActionLabel}>
                    {action.icon && <span className={styles.contextMenuActionIcon}>{action.icon}</span>}
                    {action.label}
                  </span>
                  {action.shortcut && <kbd className={styles.contextMenuShortcut}>{action.shortcut}</kbd>}
                  {action.children?.length ? <span className={styles.contextMenuSubmenuChevron} aria-hidden>▶</span> : null}
                </button>
              </div>
            )
          ))}
        </div>
      </div>
  );

  return (
    <>
      {createPortal(menuNode, document.body)}
      {submenu}
    </>
  );
}

export default memo(ContextMenu);
