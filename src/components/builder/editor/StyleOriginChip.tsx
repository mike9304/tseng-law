'use client';

import type { BuilderColorValue, BuilderBackgroundValue } from '@/lib/builder/site/theme';
import type { BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';
import { classifyStyleOrigin } from '@/lib/builder/site/style-origin';
import { getStyleTabCopy } from '@/components/builder/editor/style-tab-copy';
import styles from './StyleOriginChip.module.css';

interface Props {
  /** Resolved style value (token-resolved string, or raw value). */
  value: unknown;
  theme: BuilderTheme;
  variantKey?: string;
  manualOverride?: boolean;
  locale?: Locale;
}

/**
 * Phase 23 W185 — Style origin chip.
 *
 * Renders a small badge indicating where the current style value came from
 * (theme token, variant preset, manual override, or default). Hovering shows
 * a finer-grained hint (`theme.colors.primary`, `variant: card-elevated`, ...).
 */
export default function StyleOriginChip({ value, theme, variantKey, manualOverride, locale = 'ko' }: Props) {
  const origin = classifyStyleOrigin({ value, theme, variantKey, manualOverride });
  const copy = getStyleTabCopy(locale);
  return (
    <span
      title={copy.originHint(origin.hint)}
      className={styles.originChip}
      data-builder-style-origin={origin.kind}
    >
      <span aria-hidden className={styles.originChipDot} />
      <span className={styles.originChipLabel}>{copy.originLabels[origin.kind]}</span>
    </span>
  );
}

export function resolveColorValueToString(
  value: BuilderColorValue | BuilderBackgroundValue | undefined,
  theme: BuilderTheme,
): unknown {
  if (value == null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'token' in value && typeof value.token === 'string') {
    const token = value.token as keyof typeof theme.colors;
    return theme.colors[token];
  }
  return undefined;
}
