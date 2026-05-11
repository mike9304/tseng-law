'use client';

import type { BuilderColorValue, BuilderBackgroundValue } from '@/lib/builder/site/theme';
import type { BuilderTheme } from '@/lib/builder/site/types';
import {
  classifyStyleOrigin,
  STYLE_ORIGIN_COLOR,
  type StyleOriginKind,
} from '@/lib/builder/site/style-origin';

interface Props {
  /** Resolved style value (token-resolved string, or raw value). */
  value: unknown;
  theme: BuilderTheme;
  variantKey?: string;
  manualOverride?: boolean;
}

const LABEL: Record<StyleOriginKind, string> = {
  theme: 'Theme',
  variant: 'Variant',
  manual: 'Manual',
  default: 'Default',
};

/**
 * Phase 23 W185 — Style origin chip.
 *
 * Renders a small badge indicating where the current style value came from
 * (theme token, variant preset, manual override, or default). Hovering shows
 * a finer-grained hint (`theme.colors.primary`, `variant: card-elevated`, ...).
 */
export default function StyleOriginChip({ value, theme, variantKey, manualOverride }: Props) {
  const origin = classifyStyleOrigin({ value, theme, variantKey, manualOverride });
  const color = STYLE_ORIGIN_COLOR[origin.kind];
  return (
    <span
      title={origin.hint}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
      }}
      data-builder-style-origin={origin.kind}
    >
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: color }} />
      {LABEL[origin.kind]}
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
