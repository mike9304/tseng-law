'use client';

import { useEffect, useState } from 'react';
import {
  applyEditorPreferencesToDocument,
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import styles from './SandboxPage.module.css';

/**
 * Phase 28 — Editor preferences popover button.
 *
 * Provides toggles for rulers (W216), outline view (W218), pixel grid (W221).
 * Theme toggle has its own dedicated button (EditorThemeToggle).
 */
export default function EditorPrefsButton() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<EditorPreferences>(DEFAULT_EDITOR_PREFS);

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

  function update(partial: Partial<EditorPreferences>) {
    const next: EditorPreferences = { ...prefs, ...partial };
    setPrefs(next);
    saveAndBroadcastEditorPreferences(next);
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className={styles.topBarChip}
        onClick={() => setOpen((v) => !v)}
        title="Editor preferences"
        aria-haspopup="true"
        aria-expanded={open}
        data-builder-prefs-button
      >
        ⚙
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Editor preferences"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            boxShadow: '0 18px 40px rgba(15,23,42,0.18)',
            padding: 12,
            width: 240,
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            fontSize: 12,
          }}
        >
          <strong style={{ color: '#475569', textTransform: 'uppercase', fontSize: 10 }}>Editor</strong>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={prefs.rulers.enabled}
              onChange={(event) => update({ rulers: { ...prefs.rulers, enabled: event.target.checked } })}
            />
            <span>Rulers</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={prefs.outline.enabled}
              onChange={(event) => update({ outline: { ...prefs.outline, enabled: event.target.checked } })}
            />
            <span>Outline view</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={prefs.pixelGrid.enabled}
              onChange={(event) => update({ pixelGrid: { ...prefs.pixelGrid, enabled: event.target.checked } })}
            />
            <span>Pixel grid + snap</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1 }}>Grid size</span>
            <input
              type="number"
              min={4}
              max={64}
              value={prefs.pixelGrid.size}
              onChange={(event) =>
                update({ pixelGrid: { ...prefs.pixelGrid, size: Math.max(4, Math.min(64, Number(event.target.value) || 8)) } })
              }
              style={{ width: 56, padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
            />
          </label>
        </div>
      ) : null}
    </div>
  );
}
