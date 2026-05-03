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
    const bounds = menu?.parentElement;
    if (!menu || !bounds) return;

    const boundsRect = bounds.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const visibleLeft = Math.max(boundsRect.left, 0);
    const visibleTop = Math.max(boundsRect.top, 0);
    const visibleRight = Math.min(boundsRect.right, viewportWidth);
    const visibleBottom = Math.min(boundsRect.bottom, viewportHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const maxHeight = Math.max(
      0,
      Math.min(MENU_MAX_HEIGHT, Math.floor(visibleHeight - MENU_EDGE_MARGIN * 2)),
    );
    const menuWidth = menu.offsetWidth;
    const menuHeight = Math.min(menu.scrollHeight, maxHeight);
    const nextLayout = {
      sourceX: x,
      sourceY: y,
      left: clampAxis(
        x,
        visibleLeft - boundsRect.left + MENU_EDGE_MARGIN,
        visibleRight - boundsRect.left - menuWidth - MENU_EDGE_MARGIN,
      ),
      top: clampAxis(
        y,
        visibleTop - boundsRect.top + MENU_EDGE_MARGIN,
        visibleBottom - boundsRect.top - menuHeight - MENU_EDGE_MARGIN,
      ),
      maxHeight,
    };

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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (openSubmenuKey) {
          setOpenSubmenuKey(null);
        } else {
          onClose();
        }
        return;
      }
      if (event.key === 'ArrowRight' && activeActionIndex != null) {
        const action = actions[activeActionIndex];
        if (action?.children?.length) {
          event.preventDefault();
          setOpenSubmenuKey(action.key);
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
      if ((event.key === 'Enter' || event.key === ' ') && activeActionIndex != null) {
        const action = actions[activeActionIndex];
        if (!action || action.separator || action.disabled) return;
        event.preventDefault();
        if (action.children?.length) {
          setOpenSubmenuKey(action.key);
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

  function selectAction(action: ContextMenuAction) {
    if (action.disabled) return;
    if (action.children?.length) {
      setOpenSubmenuKey(action.key);
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

  return (
    <>
      <div
        ref={menuRef}
        className={styles.contextMenu}
        style={{
          left: `${layout?.sourceX === x && layout.sourceY === y ? layout.left : x}px`,
          top: `${layout?.sourceX === x && layout.sourceY === y ? layout.top : y}px`,
          maxHeight: layout?.maxHeight != null ? `${layout.maxHeight}px` : undefined,
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
                  onMouseEnter={() => {
                    setActiveActionIndex(index);
                    if (action.children?.length) setOpenSubmenuKey(action.key);
                  }}
                  onClick={() => {
                    selectAction(action);
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
      {submenu}
    </>
  );
}
