'use client';

import { useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'builder-published-theme-mode';

function getPreferredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyMode(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;
}

export default function DarkModeToggle() {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const initialMode = getPreferredMode();
    setMode(initialMode);
    applyMode(initialMode);

    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') return;
      const nextMode = event.matches ? 'dark' : 'light';
      setMode(nextMode);
      applyMode(nextMode);
    };

    media.addEventListener('change', handlePreferenceChange);
    return () => media.removeEventListener('change', handlePreferenceChange);
  }, []);

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
