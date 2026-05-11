/**
 * Phase 23 — Typography scale (W184).
 *
 * Pure math helper. Given a base size + modular ratio, returns heading sizes
 * for h1..h6 and the body size. The site theme `typographyScale` field feeds
 * this. Existing themeTextPresets are unchanged when typographyScale is absent.
 */

import type { BuilderTheme } from '@/lib/builder/site/types';

export const TYPOGRAPHY_SCALE_RATIOS = [1.125, 1.2, 1.25, 1.333, 1.414, 1.5] as const;
export type TypographyScaleRatio = (typeof TYPOGRAPHY_SCALE_RATIOS)[number];

export const TYPOGRAPHY_SCALE_LABELS: Record<TypographyScaleRatio, string> = {
  1.125: '1.125 (Major Second)',
  1.2: '1.2 (Minor Third)',
  1.25: '1.25 (Major Third)',
  1.333: '1.333 (Perfect Fourth)',
  1.414: '1.414 (Augmented Fourth)',
  1.5: '1.5 (Perfect Fifth)',
};

export interface ResolvedTypographyScale {
  baseSize: number;
  ratio: TypographyScaleRatio;
  body: number;
  h6: number;
  h5: number;
  h4: number;
  h3: number;
  h2: number;
  h1: number;
}

export const DEFAULT_TYPOGRAPHY_SCALE: { baseSize: number; ratio: TypographyScaleRatio } = {
  baseSize: 16,
  ratio: 1.25,
};

export function normalizeTypographyScale(
  value: BuilderTheme['typographyScale'] | undefined,
): BuilderTheme['typographyScale'] | undefined {
  if (!value) return undefined;
  const ratio = TYPOGRAPHY_SCALE_RATIOS.includes(value.ratio as TypographyScaleRatio)
    ? value.ratio as TypographyScaleRatio
    : DEFAULT_TYPOGRAPHY_SCALE.ratio;
  return {
    baseSize: Math.max(10, Math.min(28, Math.round(value.baseSize))),
    ratio,
  };
}

export function resolveTypographyScale(theme: BuilderTheme): ResolvedTypographyScale {
  const cfg = normalizeTypographyScale(theme.typographyScale) ?? DEFAULT_TYPOGRAPHY_SCALE;
  const baseSize = cfg.baseSize;
  const ratio = cfg.ratio;
  const step = (level: number) => Math.round(baseSize * Math.pow(ratio, level) * 100) / 100;
  return {
    baseSize,
    ratio,
    body: baseSize,
    h6: step(1),
    h5: step(2),
    h4: step(3),
    h3: step(4),
    h2: step(5),
    h1: step(6),
  };
}

export function headingFontSizeFromTheme(theme: BuilderTheme, level: 1 | 2 | 3 | 4 | 5 | 6): number {
  const scale = resolveTypographyScale(theme);
  switch (level) {
    case 1: return scale.h1;
    case 2: return scale.h2;
    case 3: return scale.h3;
    case 4: return scale.h4;
    case 5: return scale.h5;
    case 6: return scale.h6;
    default: return scale.body;
  }
}
