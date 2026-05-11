/**
 * Phase 23 — Style override visualizer (W185).
 *
 * Pure classifier that given a node's resolved style attribute, identifies
 * whether the final value came from:
 *   - 'theme'   — derived from theme tokens (color/font/radii)
 *   - 'variant' — applied by a variant key (card / form-input variant)
 *   - 'manual'  — explicit per-node override in node.style or node.content
 *
 * This is used by the inspector to color-code style chips so users can tell
 * "이 스타일은 어디서 왔나".
 */

import type { BuilderTheme } from '@/lib/builder/site/types';

export type StyleOriginKind = 'theme' | 'variant' | 'manual' | 'default';

export interface StyleOrigin {
  kind: StyleOriginKind;
  /** Human-readable hint, e.g. 'theme.colors.primary' / 'card variant: elevated'. */
  hint?: string;
}

export interface ClassifyStyleInput {
  value: unknown;
  theme: BuilderTheme;
  /** If set, indicates the value comes from a named variant. */
  variantKey?: string;
  /** If true, the user set this property explicitly. */
  manualOverride?: boolean;
}

export function classifyStyleOrigin({ value, theme, variantKey, manualOverride }: ClassifyStyleInput): StyleOrigin {
  if (manualOverride) {
    return { kind: 'manual', hint: '사용자 직접 입력' };
  }
  if (variantKey) {
    return { kind: 'variant', hint: `variant: ${variantKey}` };
  }
  if (typeof value === 'string') {
    if (value === theme.colors.primary) return { kind: 'theme', hint: 'theme.colors.primary' };
    if (value === theme.colors.secondary) return { kind: 'theme', hint: 'theme.colors.secondary' };
    if (value === theme.colors.accent) return { kind: 'theme', hint: 'theme.colors.accent' };
    if (value === theme.colors.text) return { kind: 'theme', hint: 'theme.colors.text' };
    if (value === theme.colors.background) return { kind: 'theme', hint: 'theme.colors.background' };
    if (value === theme.colors.muted) return { kind: 'theme', hint: 'theme.colors.muted' };
    if (value === theme.fonts.heading) return { kind: 'theme', hint: 'theme.fonts.heading' };
    if (value === theme.fonts.body) return { kind: 'theme', hint: 'theme.fonts.body' };
  }
  if (typeof value === 'number') {
    if (value === theme.radii.sm) return { kind: 'theme', hint: 'theme.radii.sm' };
    if (value === theme.radii.md) return { kind: 'theme', hint: 'theme.radii.md' };
    if (value === theme.radii.lg) return { kind: 'theme', hint: 'theme.radii.lg' };
  }
  return { kind: 'default', hint: '기본값' };
}

export const STYLE_ORIGIN_COLOR: Record<StyleOriginKind, string> = {
  theme: '#1d4ed8',
  variant: '#10b981',
  manual: '#f59e0b',
  default: '#94a3b8',
};
