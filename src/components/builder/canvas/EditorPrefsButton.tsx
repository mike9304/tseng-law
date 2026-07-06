'use client';

import { useEffect, useRef, useState } from 'react';
import {
  applyEditorPreferencesToDocument,
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import { currentBuilderLocale } from './canvasNodeUtils';
import { getCanvasEditorPrefsCopy } from './canvas-shortcuts-copy';
import EditorChromeIcon from './EditorChromeIcon';
import KeybindingsModal from './KeybindingsModal';
import styles from './EditorPrefsButton.module.css';
import chromeStyles from './SandboxPage.module.css';

/**
 * Phase 28 — Editor preferences popover button.
 *
 * Provides toggles for rulers (W216), outline view (W218), pixel grid (W221).
 * Theme toggle has its own dedicated button (EditorThemeToggle).
 */
export default function EditorPrefsButton() {
  const [open, setOpen] = useState(false);
  const [keybindingsOpen, setKeybindingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<EditorPreferences>(DEFAULT_EDITOR_PREFS);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const locale = currentBuilderLocale();
  const copy = getCanvasEditorPrefsCopy(locale as Parameters<typeof getCanvasEditorPrefsCopy>[0]);

  useEffect(() => {
    const loaded = loadEditorPreferences();
    setPrefs(loaded);
    applyEditorPreferencesToDocument(loaded);
    function handlePrefsChange(event: Event) {
      setPrefs((event as CustomEvent<EditorPreferences>).detail ?? loadEditorPreferences());
    }
    document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  useEffect(() => {
    if (!open || keybindingsOpen) return undefined;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Node && hostRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [keybindingsOpen, open]);

  function update(partial: Partial<EditorPreferences>) {
    const next: EditorPreferences = { ...prefs, ...partial };
    setPrefs(next);
    saveAndBroadcastEditorPreferences(next);
  }

  return (
    <div className={styles.editorPrefsHost} ref={hostRef}>
      <button
        type="button"
        className={`${chromeStyles.topBarChip} ${chromeStyles.topBarIconButton}`}
        onClick={() => setOpen((v) => !v)}
        title={copy.buttonTitle}
        aria-label={copy.buttonTitle}
        aria-haspopup="true"
        aria-expanded={open}
        data-builder-prefs-button
      >
        <EditorChromeIcon name="settings" className={chromeStyles.topBarSvgIcon} />
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={copy.dialogLabel}
          className={styles.editorPrefsPopover}
        >
          <header className={styles.editorPrefsHeader}>
            <span>{copy.heading}</span>
            <strong>{copy.buttonTitle}</strong>
          </header>
          <label className={styles.editorPrefsToggleRow}>
            <input
              type="checkbox"
              className={styles.editorPrefsToggleInput}
              checked={prefs.rulers.enabled}
              onChange={(event) => update({ rulers: { ...prefs.rulers, enabled: event.target.checked } })}
            />
            <span className={styles.editorPrefsToggleText}>{copy.rulers}</span>
            <span className={styles.editorPrefsToggleSwitch} aria-hidden="true" />
          </label>
          <label className={styles.editorPrefsToggleRow}>
            <input
              type="checkbox"
              className={styles.editorPrefsToggleInput}
              checked={prefs.outline.enabled}
              onChange={(event) => update({ outline: { ...prefs.outline, enabled: event.target.checked } })}
            />
            <span className={styles.editorPrefsToggleText}>{copy.outlineView}</span>
            <span className={styles.editorPrefsToggleSwitch} aria-hidden="true" />
          </label>
          <label className={styles.editorPrefsToggleRow}>
            <input
              type="checkbox"
              className={styles.editorPrefsToggleInput}
              checked={prefs.outline.hideContent}
              disabled={!prefs.outline.enabled}
              onChange={(event) =>
                update({ outline: { ...prefs.outline, hideContent: event.target.checked } })
              }
            />
            <span className={styles.editorPrefsToggleText}>{copy.outlineHideContent}</span>
            <span className={styles.editorPrefsToggleSwitch} aria-hidden="true" />
          </label>
          <label className={styles.editorPrefsToggleRow}>
            <input
              type="checkbox"
              className={styles.editorPrefsToggleInput}
              checked={prefs.pixelGrid.enabled}
              onChange={(event) => update({ pixelGrid: { ...prefs.pixelGrid, enabled: event.target.checked } })}
            />
            <span className={styles.editorPrefsToggleText}>{copy.pixelGrid}</span>
            <span className={styles.editorPrefsToggleSwitch} aria-hidden="true" />
          </label>
          <label className={styles.editorPrefsNumberRow}>
            <span>{copy.gridSize}</span>
            <input
              type="number"
              min={4}
              max={64}
              className={styles.editorPrefsNumberInput}
              value={prefs.pixelGrid.size}
              onChange={(event) =>
                update({ pixelGrid: { ...prefs.pixelGrid, size: Math.max(4, Math.min(64, Number(event.target.value) || 8)) } })
              }
            />
          </label>
          <button
            type="button"
            data-builder-shortcut-map-open="true"
            onClick={() => setKeybindingsOpen(true)}
            className={styles.editorPrefsShortcutButton}
          >
            <EditorChromeIcon name="keyboard" className={styles.editorPrefsShortcutIcon} />
            <span>{copy.shortcutMap}</span>
          </button>
        </div>
      ) : null}
      <KeybindingsModal open={keybindingsOpen} onClose={() => setKeybindingsOpen(false)} />
    </div>
  );
}
