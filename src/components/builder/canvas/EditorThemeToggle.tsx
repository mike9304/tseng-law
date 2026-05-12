'use client';

import { useEffect, useState } from 'react';
import {
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type EditorTheme,
  type EditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import styles from './SandboxPage.module.css';

const ORDER: EditorTheme[] = ['light', 'dark', 'auto'];

const LABEL: Record<EditorTheme, string> = {
  light: '☀',
  dark: '☾',
  auto: '◐',
};

function applyTheme(theme: EditorTheme): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.builderEditorTheme = theme;
}

export default function EditorThemeToggle() {
  const [theme, setTheme] = useState<EditorTheme>(DEFAULT_EDITOR_PREFS.theme);

  useEffect(() => {
    const prefs = loadEditorPreferences();
    setTheme(prefs.theme);
    applyTheme(prefs.theme);
    function handlePrefsChange(event: Event) {
      const next = (event as CustomEvent<EditorPreferences>).detail ?? loadEditorPreferences();
      setTheme(next.theme);
      applyTheme(next.theme);
    }
    document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  function nextTheme() {
    const idx = ORDER.indexOf(theme);
    const next = ORDER[(idx + 1) % ORDER.length];
    setTheme(next);
    applyTheme(next);
    const prefs = loadEditorPreferences();
    saveAndBroadcastEditorPreferences({ ...prefs, theme: next });
  }

  return (
    <button
      type="button"
      className={styles.topBarChip}
      onClick={nextTheme}
      title={`Editor theme: ${theme}`}
      aria-label={`editor theme ${theme}`}
      data-builder-editor-theme-toggle={theme}
    >
      <span style={{ fontSize: 14 }}>{LABEL[theme]}</span>
    </button>
  );
}
