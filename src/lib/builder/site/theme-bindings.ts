import type { CSSProperties } from 'react';
import type {
  BuilderCanvasNode,
  BuilderCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import {
  BUTTON_VARIANTS,
  normalizeButtonVariantKey,
} from '@/lib/builder/site/component-variants';
import {
  THEME_COLOR_LABELS,
  isGradientBackgroundValue,
  isImageBackgroundValue,
  isThemeColorReference,
  type BuilderBackgroundValue,
  type BuilderColorValue,
  type ThemeTextPresetKey,
} from '@/lib/builder/site/theme';

export type ThemeBindingTone = 'linked' | 'detached' | 'custom';

export interface ThemeBindingIndicator {
  label: string;
  tone: ThemeBindingTone;
  title: string;
}

const BADGE_TONE_STYLES: Record<ThemeBindingTone, Pick<CSSProperties, 'background' | 'borderColor' | 'color'>> = {
  linked: {
    background: '#eff6ff',
    borderColor: '#bfdbfe',
    color: '#1d4ed8',
  },
  detached: {
    background: '#f8fafc',
    borderColor: '#cbd5e1',
    color: '#475569',
  },
  custom: {
    background: '#fffbeb',
    borderColor: '#fde68a',
    color: '#92400e',
  },
};

export function getThemeBindingBadgeStyle(tone: ThemeBindingTone): CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    minHeight: 18,
    padding: '2px 7px',
    border: `1px solid ${BADGE_TONE_STYLES[tone].borderColor}`,
    borderRadius: 999,
    background: BADGE_TONE_STYLES[tone].background,
    color: BADGE_TONE_STYLES[tone].color,
    fontSize: '0.62rem',
    fontWeight: 800,
    letterSpacing: 0,
    lineHeight: 1,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  };
}

export function getColorBindingIndicator(value: BuilderColorValue | undefined): ThemeBindingIndicator {
  if (isThemeColorReference(value)) {
    const tokenLabel = THEME_COLOR_LABELS[value.token];
    return {
      label: 'Theme linked',
      tone: 'linked',
      title: `Uses the ${tokenLabel} theme color token.`,
    };
  }

  return {
    label: 'Detached',
    tone: 'detached',
    title: 'Uses a fixed color value instead of a theme token.',
  };
}

export function getTypographyBindingIndicator(
  themePreset: ThemeTextPresetKey | undefined,
): ThemeBindingIndicator {
  if (themePreset) {
    return {
      label: 'Typography linked',
      tone: 'linked',
      title: 'Follows the selected theme text preset.',
    };
  }

  return {
    label: 'Detached',
    tone: 'detached',
    title: 'Manual typography values are stored on this element.',
  };
}

function normalizeRawColor(value: string | undefined): string {
  return value?.trim().toLowerCase().replace(/\s+/g, '') ?? '';
}

function isTransparentRawColor(value: string | undefined): boolean {
  const normalized = normalizeRawColor(value);
  return (
    !normalized
    || normalized === 'transparent'
    || normalized === 'rgba(0,0,0,0)'
    || normalized === 'hsla(0,0%,0%,0)'
  );
}

function hasVisibleBackground(value: BuilderBackgroundValue | undefined): boolean {
  if (!value) return false;
  if (isGradientBackgroundValue(value) || isImageBackgroundValue(value) || isThemeColorReference(value)) {
    return true;
  }
  return !isTransparentRawColor(value);
}

export function hasButtonVariantCustomStyleOverride(
  style: Pick<
    BuilderCanvasNodeStyle,
    | 'backgroundColor'
    | 'borderWidth'
    | 'shadowX'
    | 'shadowY'
    | 'shadowBlur'
    | 'shadowSpread'
    | 'opacity'
  >,
): boolean {
  return (
    hasVisibleBackground(style.backgroundColor)
    || style.borderWidth > 0
    || style.shadowX !== 0
    || style.shadowY !== 0
    || style.shadowBlur !== 0
    || style.shadowSpread !== 0
    || style.opacity !== 100
  );
}

export function getButtonVariantBindingIndicator(node: BuilderCanvasNode): ThemeBindingIndicator | null {
  if (node.kind !== 'button' || node.content.className) return null;

  const variantKey = normalizeButtonVariantKey(node.content.style);
  const variantLabel = BUTTON_VARIANTS.find((variant) => variant.key === variantKey)?.label ?? 'Button';
  const hasCustomOverride = hasButtonVariantCustomStyleOverride(node.style);

  if (hasCustomOverride) {
    return {
      label: 'Variant + custom override',
      tone: 'custom',
      title: `${variantLabel} variant plus custom background, border, shadow, or opacity values from this tab.`,
    };
  }

  return {
    label: 'Variant linked',
    tone: 'linked',
    title: `${variantLabel} variant is driving this button's visual style.`,
  };
}
