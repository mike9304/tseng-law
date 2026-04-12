'use client';

import { useEffect, useRef } from 'react';
import styles from './SandboxPage.module.css';

export interface ContextMenuAction {
  key: string;
  label: string;
  title?: string;
  disabled?: boolean;
  onSelect: () => void;
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

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ left: `${x}px`, top: `${y}px` }}
      role="menu"
      aria-label={title}
    >
      <header className={styles.contextMenuHeader}>
        <span>Context menu</span>
        <strong>{title}</strong>
      </header>
      <div className={styles.contextMenuActions}>
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            role="menuitem"
            className={styles.contextMenuAction}
            title={action.title}
            disabled={action.disabled}
            onClick={() => {
              if (action.disabled) return;
              action.onSelect();
              onClose();
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
