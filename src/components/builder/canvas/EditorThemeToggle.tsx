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
import EditorChromeIcon, { type EditorChromeIconName } from './EditorChromeIcon';
import styles from './SandboxPage.module.css';

const ORDER: EditorTheme[] = ['light', 'dark', 'auto'];

const ICON: Record<EditorTheme, EditorChromeIconName> = {
  light: 'themeLight',
  dark: 'themeDark',
  auto: 'themeAuto',
};

function getEffectiveTheme(theme: EditorTheme, media?: MediaQueryList): 'light' | 'dark' {
  if (theme !== 'auto') return theme;
  return (media ?? window.matchMedia('(prefers-color-scheme: dark)')).matches ? 'dark' : 'light';
}

function applyTheme(theme: EditorTheme, media?: MediaQueryList): void {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.builderEditorTheme = theme;
  const effectiveTheme = getEffectiveTheme(theme, media);
  document.querySelectorAll<HTMLElement>('[data-editor-shell]').forEach((shell) => {
    shell.dataset.editorTheme = effectiveTheme;
  });
}

export default function EditorThemeToggle() {
  const [theme, setTheme] = useState<EditorTheme>(DEFAULT_EDITOR_PREFS.theme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    let currentTheme = loadEditorPreferences().theme;
    const prefs = loadEditorPreferences();
    setTheme(prefs.theme);
    applyTheme(prefs.theme, media);
    function handlePrefsChange(event: Event) {
      const next = (event as CustomEvent<EditorPreferences>).detail ?? loadEditorPreferences();
      currentTheme = next.theme;
      setTheme(next.theme);
      applyTheme(next.theme, media);
    }
    const handleSystemThemeChange = () => {
      if (currentTheme === 'auto') applyTheme(currentTheme, media);
    };
    document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    media.addEventListener('change', handleSystemThemeChange);
    return () => {
      document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
      media.removeEventListener('change', handleSystemThemeChange);
    };
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
      className={`${styles.topBarChip} ${styles.topBarIconButton}`}
      onClick={nextTheme}
      title={`Editor theme: ${theme}`}
      aria-label={`editor theme ${theme}`}
      data-builder-editor-theme-toggle={theme}
    >
      <EditorChromeIcon name={ICON[theme]} className={styles.topBarSvgIcon} />
    </button>
  );
}
