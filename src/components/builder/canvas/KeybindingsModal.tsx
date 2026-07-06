'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type CustomKeybinding,
} from '@/lib/builder/canvas/editor-prefs';
import { DEFAULT_KEYBINDINGS, resolveShortcutCombo } from '@/lib/builder/canvas/shortcuts';
import { currentBuilderLocale } from './canvasNodeUtils';
import { getCanvasKeybindingsCopy } from './canvas-shortcuts-copy';
import styles from './KeybindingsModal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(',');

/**
 * Phase 28 W219 — Keybinding mapping modal.
 *
 * Stores user-defined combo overrides in editor preferences. Runtime keyboard
 * handlers and visible shortcut labels read the same effective binding map.
 */
export default function KeybindingsModal({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const locale = currentBuilderLocale();
  const copy = getCanvasKeybindingsCopy(locale as Parameters<typeof getCanvasKeybindingsCopy>[0]);
  const [bindings, setBindings] = useState<CustomKeybinding[]>(
    () => DEFAULT_KEYBINDINGS.map((binding) => ({ action: binding.action, combo: binding.combo })),
  );

  useEffect(() => {
    if (!open) return;
    const prefs = loadEditorPreferences();
    const map = new Map<string, string>();
    for (const b of DEFAULT_KEYBINDINGS) map.set(b.action, b.combo);
    for (const b of prefs.customKeybindings) map.set(b.action, b.combo);
    setBindings(DEFAULT_KEYBINDINGS.map((d) => ({ action: d.action, combo: map.get(d.action) ?? d.combo })));
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return undefined;
    restoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const panel = panelRef.current;
    if (panel) {
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? panel).focus({ preventScroll: true });
    }
    return () => {
      const previous = restoreFocusRef.current;
      if (!previous || typeof previous.focus !== 'function') return;
      try {
        previous.focus({ preventScroll: true });
      } catch {
        // Ignore detached focus targets.
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
      if (focusables.length === 0) {
        event.preventDefault();
        panel.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === panel) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }
      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', handleKeydown, true);
    return () => window.removeEventListener('keydown', handleKeydown, true);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function handlePointerFocus(event: FocusEvent) {
      const panel = panelRef.current;
      if (!panel || !event.target || panel.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? panel).focus({ preventScroll: true });
    }
    document.addEventListener('focusin', handlePointerFocus);
    return () => document.removeEventListener('focusin', handlePointerFocus);
  }, [open]);

  function updateCombo(action: string, combo: string) {
    setBindings((prev) => prev.map((b) => (b.action === action ? { ...b, combo } : b)));
  }

  function persist() {
    const prefs = loadEditorPreferences() ?? DEFAULT_EDITOR_PREFS;
    const overrides = bindings.filter((b) => {
      const def = DEFAULT_KEYBINDINGS.find((d) => d.action === b.action);
      return b.combo.trim() && def?.combo !== b.combo.trim();
    });
    saveAndBroadcastEditorPreferences({ ...prefs, customKeybindings: overrides });
    onClose();
  }

  function reset() {
    setBindings(DEFAULT_KEYBINDINGS.map((binding) => ({ action: binding.action, combo: binding.combo })));
  }

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.ariaLabel}
      data-builder-keybindings-modal="true"
      className={styles.backdrop}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        data-builder-keybindings-panel="true"
        onClick={(e) => e.stopPropagation()}
        className={styles.panel}
      >
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.description}>
          {copy.description}
        </p>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.headingCell}>{copy.action}</th>
              <th className={styles.headingCell}>{copy.descriptionHeading}</th>
              <th className={styles.headingCell}>{copy.shortcutHeading}</th>
            </tr>
          </thead>
          <tbody>
            {bindings.map((b) => (
              <tr key={b.action}>
                <td className={styles.actionCell}>{b.action}</td>
                <td className={styles.descriptionCell}>
                  {DEFAULT_KEYBINDINGS.find((binding) => binding.action === b.action)?.label ?? b.action}
                </td>
                <td className={styles.inputCell}>
                  <input
                    type="text"
                    data-builder-keybinding-input={b.action}
                    value={b.combo}
                    onChange={(event) => updateCombo(b.action, event.target.value)}
                    className={styles.comboInput}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={reset}
            className={`${styles.button} ${styles.secondaryButton} ${styles.resetButton}`}
          >
            {copy.reset}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={persist}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            {copy.save}
          </button>
        </div>
      </div>
    </div>
  );
}

export function resolveKeybinding(action: string): string {
  return resolveShortcutCombo(action);
}
