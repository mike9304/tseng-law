'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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

const MENU_EDGE_MARGIN = 12;
const MENU_MAX_HEIGHT = 520;

function clampAxis(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export default function ContextMenu({
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
  const [layout, setLayout] = useState<{
    sourceX: number;
    sourceY: number;
    left: number;
    top: number;
    maxHeight?: number;
  } | null>(null);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);
  const [openSubmenuKey, setOpenSubmenuKey] = useState<string | null>(null);
  const [submenuLayout, setSubmenuLayout] = useState<{ left: number; top: number } | null>(null);

  const enabledActionIndexes = useMemo(
    () => actions
      .map((action, index) => (action.separator || action.disabled ? -1 : index))
      .filter((index) => index >= 0),
    [actions],
  );
  const firstEnabledActionIndex = enabledActionIndexes[0] ?? null;

  useEffect(() => {
    setActiveActionIndex(firstEnabledActionIndex);
  }, [firstEnabledActionIndex]);

  useEffect(() => {
    if (activeActionIndex == null) return;
    const action = actions[activeActionIndex];
    if (!action || action.separator || action.disabled) return;
    actionRefs.current.get(action.key)?.focus();
  }, [actions, activeActionIndex]);

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const menuWidth = menu.offsetWidth || 280;
    const rawHeight = menu.scrollHeight || 0;
    const availableHeight = Math.max(0, viewportHeight - MENU_EDGE_MARGIN * 2);
    const maxHeight = Math.min(MENU_MAX_HEIGHT, availableHeight);
    const menuHeight = Math.min(rawHeight, maxHeight);

    let left = x;
    if (left + menuWidth + MENU_EDGE_MARGIN > viewportWidth) {
      left = x - menuWidth;
    }
    left = clampAxis(left, MENU_EDGE_MARGIN, Math.max(MENU_EDGE_MARGIN, viewportWidth - menuWidth - MENU_EDGE_MARGIN));

    let top = y;
    if (top + menuHeight + MENU_EDGE_MARGIN > viewportHeight) {
      top = y - menuHeight;
    }
    top = clampAxis(top, MENU_EDGE_MARGIN, Math.max(MENU_EDGE_MARGIN, viewportHeight - menuHeight - MENU_EDGE_MARGIN));

    const nextLayout = { sourceX: x, sourceY: y, left, top, maxHeight };

    setLayout((current) => {
      if (
        current?.sourceX === nextLayout.sourceX
        && current.sourceY === nextLayout.sourceY
        && current.left === nextLayout.left
        && current.top === nextLayout.top
        && current.maxHeight === nextLayout.maxHeight
      ) {
        return current;
      }
      return nextLayout;
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
      const estimatedHeight = Math.min(260, 12 + action.children.filter((child) => !child.separator).length * 34);
      setSubmenuLayout({
        left: clampAxis(rect.right + 8, MENU_EDGE_MARGIN, window.innerWidth - 232),
        top: clampAxis(rect.top - 6, MENU_EDGE_MARGIN, window.innerHeight - estimatedHeight - MENU_EDGE_MARGIN),
      });
    };

    updateSubmenuLayout();
    window.addEventListener('resize', updateSubmenuLayout);
    window.addEventListener('scroll', updateSubmenuLayout, true);
    return () => {
      window.removeEventListener('resize', updateSubmenuLayout);
      window.removeEventListener('scroll', updateSubmenuLayout, true);
    };
  }, [actions, openSubmenuKey]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !submenuRef.current?.contains(target)) {
        onClose();
      }
    }

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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (openSubmenuKey) {
          setOpenSubmenuKey(null);
        } else {
          onClose();
        }
        return;
      }
      if (event.key === 'ArrowRight') {
        const actionIndex = getKeyboardActionIndex();
        if (actionIndex == null) return;
        const action = actions[actionIndex];
        if (action?.children?.length) {
          event.preventDefault();
          openSubmenuForAction(action, actionIndex);
        }
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setOpenSubmenuKey(null);
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
          openSubmenuForAction(action, actionIndex);
          return;
        }
        action.onSelect?.();
        onClose();
      }
    }

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actions, activeActionIndex, enabledActionIndexes, onClose, openSubmenuKey]);

  function openSubmenuForAction(action: ContextMenuAction, index?: number) {
    if (action.disabled || !action.children?.length) return;
    if (index != null) setActiveActionIndex(index);

    const trigger = actionRefs.current.get(action.key);
    if (trigger && typeof window !== 'undefined') {
      const rect = trigger.getBoundingClientRect();
      const estimatedHeight = Math.min(260, 12 + action.children.filter((child) => !child.separator).length * 34);
      setSubmenuLayout({
        left: clampAxis(rect.right + 8, MENU_EDGE_MARGIN, window.innerWidth - 232),
        top: clampAxis(rect.top - 6, MENU_EDGE_MARGIN, window.innerHeight - estimatedHeight - MENU_EDGE_MARGIN),
      });
    }
    setOpenSubmenuKey(action.key);
  }

  function selectAction(action: ContextMenuAction, index?: number) {
    if (action.disabled) return;
    if (action.children?.length) {
      openSubmenuForAction(action, index);
      return;
    }
    action.onSelect?.();
    onClose();
  }

  const openSubmenuAction = openSubmenuKey
    ? actions.find((action) => action.key === openSubmenuKey && action.children?.length)
    : null;
  const submenu = openSubmenuAction?.children?.length && submenuLayout && typeof document !== 'undefined'
    ? createPortal(
      <div
        ref={submenuRef}
        className={styles.contextSubmenu}
        role="menu"
        aria-label={`${openSubmenuAction.label} submenu`}
        style={{ left: `${submenuLayout.left}px`, top: `${submenuLayout.top}px` }}
      >
        {openSubmenuAction.children.map((child) => (
          child.separator ? (
            <hr key={child.key} className={styles.contextMenuDivider} />
          ) : (
            <button
              key={child.key}
              type="button"
              role="menuitem"
              className={styles.contextMenuAction}
              data-tone={child.tone === 'danger' ? 'danger' : undefined}
              title={child.title}
              disabled={child.disabled}
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
        width: 280,
        maxHeight: layout?.maxHeight != null ? `${layout.maxHeight}px` : undefined,
        overflowY: 'auto',
        zIndex: 10120,
      }}
      role="menu"
      aria-label={title}
    >
        <header className={styles.contextMenuHeader}>
          <span>Context menu</span>
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
                  data-tone={action.tone === 'danger' ? 'danger' : undefined}
                  data-has-submenu={action.children?.length ? 'true' : undefined}
                  title={action.title}
                  disabled={action.disabled}
                  onFocus={() => {
                    setActiveActionIndex(index);
                  }}
                  onMouseEnter={() => {
                    setActiveActionIndex(index);
                    if (action.children?.length) openSubmenuForAction(action, index);
                  }}
                  onKeyDown={(event) => {
                    if (!action.children?.length) return;
                    if (event.key !== 'ArrowRight' && event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    event.stopPropagation();
                    openSubmenuForAction(action, index);
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
