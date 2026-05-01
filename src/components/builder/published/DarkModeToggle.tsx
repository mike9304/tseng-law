'use client';

import { useEffect, useState } from 'react';
import type { DarkModeConfig } from '@/lib/builder/site/types';

type ThemeMode = 'light' | 'dark';
type DefaultThemeMode = NonNullable<DarkModeConfig['defaultMode']>;

const STORAGE_KEY = 'builder-theme';

function resolveDefaultMode(defaultMode: DefaultThemeMode): ThemeMode {
  if (defaultMode === 'dark') return 'dark';
  if (defaultMode === 'auto') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getPreferredMode(defaultMode: DefaultThemeMode): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  const activeTheme = document.documentElement.dataset.theme;
  if (activeTheme === 'light' || activeTheme === 'dark') return activeTheme;
  return resolveDefaultMode(defaultMode);
}

function applyMode(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}

export default function DarkModeToggle({
  defaultMode = 'light',
  allowVisitorToggle = true,
}: {
  defaultMode?: DarkModeConfig['defaultMode'];
  allowVisitorToggle?: boolean;
}) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const resolvedDefaultMode: DefaultThemeMode = defaultMode === 'dark' || defaultMode === 'auto' ? defaultMode : 'light';

  useEffect(() => {
    if (!allowVisitorToggle) return undefined;
    const initialMode = getPreferredMode(resolvedDefaultMode);
    setMode(initialMode);
    applyMode(initialMode);

    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return;
      if (resolvedDefaultMode !== 'auto') return;
      const nextMode = event.matches ? 'dark' : 'light';
      setMode(nextMode);
      applyMode(nextMode);
    };

    media.addEventListener('change', handlePreferenceChange);
    return () => media.removeEventListener('change', handlePreferenceChange);
  }, [allowVisitorToggle, resolvedDefaultMode]);

  if (!allowVisitorToggle) return null;

  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextMode} mode`}
      onClick={() => {
        setMode(nextMode);
        window.localStorage.setItem(STORAGE_KEY, nextMode);
        applyMode(nextMode);
      }}
      style={{
        position: 'fixed',
        top: 18,
        right: 18,
        zIndex: 5000,
        border: '1px solid var(--builder-color-muted, #e5e7eb)',
        borderRadius: 999,
        background: 'var(--builder-color-background, #ffffff)',
        color: 'var(--builder-color-text, #1f2937)',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
        padding: '8px 12px',
        fontSize: '0.78rem',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
      }}
    >
      {mode === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
