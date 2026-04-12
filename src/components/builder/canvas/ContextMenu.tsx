'use client';

import { useEffect, useRef } from 'react';
import styles from './SandboxPage.module.css';

export interface ContextMenuAction {
  key: string;
  label: string;
  title?: string;
  shortcut?: string;
  icon?: string;
  disabled?: boolean;
  separator?: boolean;
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
          action.separator ? (
            <hr key={action.key} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />
          ) : (
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
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                {action.icon && <span style={{ width: 16, textAlign: 'center', fontSize: '0.8rem' }}>{action.icon}</span>}
                {action.label}
              </span>
              {action.shortcut && <kbd style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: 'auto', fontFamily: 'system-ui' }}>{action.shortcut}</kbd>}
            </button>
          )
        ))}
      </div>
    </div>
  );
}
