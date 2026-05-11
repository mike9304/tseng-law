'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveEditorPreferences,
  type EditorTheme,
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
  }, []);

  function nextTheme() {
    const idx = ORDER.indexOf(theme);
    const next = ORDER[(idx + 1) % ORDER.length];
    setTheme(next);
    applyTheme(next);
    const prefs = loadEditorPreferences();
    saveEditorPreferences({ ...prefs, theme: next });
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
