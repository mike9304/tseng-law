'use client';

import { useState, type CSSProperties } from 'react';
import type {
  ThemeSuggestion,
} from '@/lib/builder/ai-generator/theme-suggestions';
import type { Locale } from '@/lib/locales';
import styles from './ThemeSuggestionsPanel.module.css';
import { getThemeSuggestionsCopy } from './theme-suggestions-copy';

interface ThemeSuggestionResponse {
  ok?: boolean;
  suggestion?: ThemeSuggestion;
  error?: string;
}

interface ThemeSuggestionsPanelProps {
  locale: Locale;
  onApplySuggestion: (suggestion: ThemeSuggestion) => void;
}

type ThemeSuggestionStyleVars = CSSProperties & {
  [key: `--theme-suggestions-${string}`]: string | number | undefined;
};

const COLOR_TOKENS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
  'muted',
] satisfies ReadonlyArray<keyof ThemeSuggestion['colors']>;

function swatchStyle(color: string): ThemeSuggestionStyleVars {
  return {
    '--theme-suggestions-swatch': color,
  };
}

function previewStyle(suggestion: ThemeSuggestion): ThemeSuggestionStyleVars {
  return {
    '--theme-suggestions-preview-bg': suggestion.colors.background,
    '--theme-suggestions-preview-text': suggestion.colors.text,
    '--theme-suggestions-preview-muted': suggestion.colors.muted,
    '--theme-suggestions-preview-accent': suggestion.colors.accent,
    '--theme-suggestions-preview-radius': `${suggestion.radii.md}px`,
    '--theme-suggestions-preview-font': suggestion.fonts.heading,
  };
}

export function ThemeSuggestionsPanel({
  locale,
  onApplySuggestion,
}: ThemeSuggestionsPanelProps) {
  const copy = getThemeSuggestionsCopy(locale);
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState<ThemeSuggestion | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestSuggestion() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError(copy.emptyPrompt);
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/builder/ai-generator/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ action: 'suggest', prompt: trimmed }),
      });
      const data = await response.json().catch(() => ({})) as ThemeSuggestionResponse;
      if (!response.ok || !data.suggestion) {
        setError(data.error || copy.error);
        return;
      }
      setSuggestion(data.suggestion);
    } catch {
      setError(copy.error);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.panel} data-testid="theme-suggestions-panel">
      <div className={styles.header}>
        <strong className={styles.title}>{copy.heading}</strong>
        {suggestion ? (
          <span className={styles.vibe} data-theme-suggestion-vibe={suggestion.vibe}>
            {copy.vibes[suggestion.vibe]}
          </span>
        ) : null}
      </div>

      <div className={styles.formRow}>
        <label className={styles.field}>
          <span className={styles.label}>{copy.promptLabel}</span>
          <input
            value={prompt}
            aria-label={copy.promptLabel}
            className={styles.input}
            placeholder={copy.promptPlaceholder}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void requestSuggestion();
            }}
          />
        </label>
        <button
          type="button"
          className={styles.button}
          disabled={pending}
          onClick={() => void requestSuggestion()}
        >
          {pending ? copy.suggesting : copy.suggest}
        </button>
      </div>

      {error ? (
        <span className={styles.status} data-tone="error" role="status">
          {error}
        </span>
      ) : null}

      {suggestion ? (
        <section className={styles.result} style={previewStyle(suggestion)}>
          <div className={styles.preview}>
            <div className={styles.previewTitle}>Aa</div>
            <div className={styles.previewLine} />
          </div>
          <div className={styles.resultBody}>
            <span className={styles.rationale}>{copy.rationales[suggestion.vibe]}</span>
            <div className={styles.palette} aria-label={copy.labels.palette}>
              {COLOR_TOKENS.map((token) => (
                <span
                  key={token}
                  className={styles.swatch}
                  data-theme-suggestion-color={token}
                  style={swatchStyle(suggestion.colors[token])}
                  title={`${token}: ${suggestion.colors[token]}`}
                />
              ))}
            </div>
            <div className={styles.metaGrid}>
              <span>{copy.labels.radius}: {copy.radiusPresets[suggestion.effects.radiusPreset]}</span>
              <span>{copy.labels.shadow}: {copy.shadowPresets[suggestion.effects.shadowPreset]}</span>
              <span>{copy.labels.base}: {suggestion.typographyScale.baseSize}px</span>
              <span>{copy.labels.scale}: {suggestion.typographyScale.ratio}</span>
            </div>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => onApplySuggestion(suggestion)}
            >
              {copy.apply}
            </button>
          </div>
        </section>
      ) : null}
    </section>
  );
}
