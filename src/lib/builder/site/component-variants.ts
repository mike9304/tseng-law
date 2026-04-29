import {
  isGradientBackgroundValue,
  isImageBackgroundValue,
  resolveBackgroundStyle,
  resolveThemeColor,
  type ResolvedBackgroundStyle,
  type ThemeColorToken,
} from '@/lib/builder/site/theme';
import type { BuilderTheme } from '@/lib/builder/site/types';

export const BUTTON_VARIANT_KEYS = [
  'primary-solid',
  'primary-outline',
  'primary-ghost',
  'primary-link',
  'secondary-solid',
  'secondary-outline',
  'cta-shadow',
  'cta-arrow',
] as const;

export const LEGACY_BUTTON_VARIANT_KEYS = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link',
] as const;

export const BUTTON_STYLE_KEYS = [
  ...LEGACY_BUTTON_VARIANT_KEYS,
  ...BUTTON_VARIANT_KEYS,
] as const;

export type ButtonVariantKey = (typeof BUTTON_VARIANT_KEYS)[number];
export type ButtonStyleKey = (typeof BUTTON_STYLE_KEYS)[number];

export interface ComponentVariantOption<T extends string = string> {
  key: T;
  label: string;
  description: string;
}

export const BUTTON_VARIANTS: Array<ComponentVariantOption<ButtonVariantKey>> = [
  {
    key: 'primary-solid',
    label: 'Primary solid',
    description: 'Filled primary button for the main action.',
  },
  {
    key: 'primary-outline',
    label: 'Primary outline',
    description: 'Primary action with a transparent surface.',
  },
  {
    key: 'primary-ghost',
    label: 'Primary ghost',
    description: 'Low-emphasis primary action with a soft tint.',
  },
  {
    key: 'primary-link',
    label: 'Primary link',
    description: 'Text-style primary action.',
  },
  {
    key: 'secondary-solid',
    label: 'Secondary solid',
    description: 'Filled secondary action.',
  },
  {
    key: 'secondary-outline',
    label: 'Secondary outline',
    description: 'Secondary action with a transparent surface.',
  },
  {
    key: 'cta-shadow',
    label: 'CTA shadow',
    description: 'High-emphasis call to action with a larger shadow.',
  },
  {
    key: 'cta-arrow',
    label: 'CTA arrow',
    description: 'Primary CTA with an arrow cue.',
  },
];

export const CARD_VARIANTS = [
  {
    key: 'flat',
    label: 'Flat',
    description: 'Border-only card with no elevation.',
    tokens: {
      background: { kind: 'token', token: 'background' },
      borderColor: { kind: 'token', token: 'muted' },
      borderWidth: 1,
      shadow: 'none',
      backdropFilter: 'none',
    },
  },
  {
    key: 'elevated',
    label: 'Elevated',
    description: 'Subtle shadow for compact content cards.',
    tokens: {
      background: { kind: 'token', token: 'background' },
      borderColor: { kind: 'token', token: 'muted' },
      borderWidth: 1,
      shadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
      backdropFilter: 'none',
    },
  },
  {
    key: 'floating',
    label: 'Floating',
    description: 'Large elevation for featured panels.',
    tokens: {
      background: { kind: 'token', token: 'background' },
      borderColor: 'transparent',
      borderWidth: 0,
      shadow: '0 24px 64px rgba(15, 23, 42, 0.16)',
      backdropFilter: 'none',
    },
  },
  {
    key: 'glass',
    label: 'Glass',
    description: 'Translucent surface with backdrop blur.',
    tokens: {
      background: 'rgba(255, 255, 255, 0.72)',
      borderColor: 'rgba(255, 255, 255, 0.38)',
      borderWidth: 1,
      shadow: '0 18px 44px rgba(15, 23, 42, 0.14)',
      backdropFilter: 'blur(18px)',
    },
  },
] as const;

export const FORM_INPUT_VARIANTS = [
  {
    key: 'default',
    label: 'Default',
    description: 'Classic bordered input.',
    tokens: {
      background: { kind: 'token', token: 'background' },
      borderColor: { kind: 'token', token: 'muted' },
      borderWidth: 1,
      borderRadius: 'md',
    },
  },
  {
    key: 'underline',
    label: 'Underline',
    description: 'Bottom-border input for editorial forms.',
    tokens: {
      background: 'transparent',
      borderColor: { kind: 'token', token: 'secondary' },
      borderWidth: 0,
      borderBottomWidth: 1,
      borderRadius: 0,
    },
  },
  {
    key: 'filled',
    label: 'Filled',
    description: 'Muted filled input for dense forms.',
    tokens: {
      background: { kind: 'token', token: 'muted' },
      borderColor: 'transparent',
      borderWidth: 1,
      borderRadius: 'md',
    },
  },
] as const;

interface ButtonNodeStyleLike {
  backgroundColor: unknown;
  borderColor: unknown;
  borderStyle: 'solid' | 'dashed';
  borderWidth: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: unknown;
}

export interface ResolvedButtonVariantStyles {
  backgroundStyle: ResolvedBackgroundStyle;
  color: string;
  border: string;
  borderColor: string;
  boxShadow: string;
  textDecoration: 'none' | 'underline';
  fontWeight: number;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  gap: number;
  paddingInline: number;
  cssVars: Record<string, string | number | undefined>;
}

export function normalizeButtonVariantKey(value: unknown): ButtonVariantKey {
  switch (value) {
    case 'primary':
      return 'primary-solid';
    case 'secondary':
      return 'secondary-solid';
    case 'outline':
      return 'primary-outline';
    case 'ghost':
      return 'primary-ghost';
    case 'link':
      return 'primary-link';
    case 'primary-solid':
    case 'primary-outline':
    case 'primary-ghost':
    case 'primary-link':
    case 'secondary-solid':
    case 'secondary-outline':
    case 'cta-shadow':
    case 'cta-arrow':
      return value;
    default:
      return 'primary-solid';
  }
}

function tokenColor(token: ThemeColorToken, theme?: BuilderTheme): string {
  return resolveThemeColor({ kind: 'token', token }, theme);
}

function isTransparentColor(color: string | undefined): boolean {
  const normalized = color?.trim().toLowerCase();
  return !normalized || normalized === 'transparent' || normalized === 'rgba(0,0,0,0)' || normalized === 'rgba(0, 0, 0, 0)';
}

function resolveCustomState(s: ButtonNodeStyleLike, theme?: BuilderTheme) {
  const backgroundStyle = resolveBackgroundStyle(s.backgroundColor as never, theme);
  const backgroundColor =
    isGradientBackgroundValue(s.backgroundColor) || isImageBackgroundValue(s.backgroundColor)
      ? undefined
      : resolveThemeColor(s.backgroundColor as never, theme);
  const borderColor = resolveThemeColor(s.borderColor as never, theme);
  const shadowColor = resolveThemeColor(s.shadowColor as never, theme);
  const hasCustomBg = !isTransparentColor(backgroundColor) || Boolean(backgroundStyle.backgroundImage);
  const hasCustomBorder = s.borderWidth > 0;
  const hasShadow =
    s.shadowX !== 0 || s.shadowY !== 0 || s.shadowBlur !== 0 || s.shadowSpread !== 0;

  return {
    backgroundStyle,
    backgroundColor,
    borderColor,
    shadowColor,
    hasCustomBg,
    hasCustomBorder,
    hasShadow,
    border: `${s.borderWidth}px ${s.borderStyle} ${borderColor}`,
    boxShadow: `${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${shadowColor}`,
  };
}

function colorMix(color: string, amount: number, mixedWith = '#ffffff'): string {
  return `color-mix(in srgb, ${color} ${amount}%, ${mixedWith})`;
}

export function resolveButtonVariantStyles(
  value: unknown,
  s: ButtonNodeStyleLike,
  theme?: BuilderTheme,
): ResolvedButtonVariantStyles {
  const variant = normalizeButtonVariantKey(value);
  const custom = resolveCustomState(s, theme);
  const primary = tokenColor('primary', theme);
  const secondary = tokenColor('secondary', theme);
  const accent = tokenColor('accent', theme);
  const text = tokenColor('text', theme);
  const background = tokenColor('background', theme);
  const base: ResolvedButtonVariantStyles = {
    backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: 'transparent' },
    color: text,
    border: custom.hasCustomBorder ? custom.border : '1px solid transparent',
    borderColor: custom.hasCustomBorder ? custom.borderColor : 'transparent',
    boxShadow: custom.hasShadow ? custom.boxShadow : 'none',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 0,
    lineHeight: 1,
    gap: 8,
    paddingInline: 18,
    cssVars: {
      '--builder-button-hover-background': 'transparent',
      '--builder-button-hover-color': text,
      '--builder-button-hover-border-color': 'transparent',
      '--builder-button-hover-box-shadow': custom.hasShadow ? custom.boxShadow : 'none',
      '--builder-button-hover-transform': 'translateY(-1px)',
      '--builder-button-active-transform': 'translateY(0) scale(0.98)',
      '--builder-button-disabled-opacity': 0.46,
    },
  };

  if (variant === 'primary-solid') {
    return {
      ...base,
      backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: primary },
      color: background,
      border: custom.hasCustomBorder ? custom.border : `1px solid ${primary}`,
      borderColor: custom.hasCustomBorder ? custom.borderColor : primary,
      boxShadow: custom.hasShadow ? custom.boxShadow : `0 12px 28px ${colorMix(primary, 24, 'transparent')}`,
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': colorMix(primary, 88, '#000000'),
        '--builder-button-hover-color': background,
        '--builder-button-hover-border-color': colorMix(primary, 88, '#000000'),
        '--builder-button-hover-box-shadow': `0 16px 34px ${colorMix(primary, 30, 'transparent')}`,
      },
    };
  }

  if (variant === 'primary-outline') {
    return {
      ...base,
      backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: 'transparent' },
      color: primary,
      border: custom.hasCustomBorder ? custom.border : `1.5px solid ${primary}`,
      borderColor: custom.hasCustomBorder ? custom.borderColor : primary,
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': colorMix(primary, 10, 'transparent'),
        '--builder-button-hover-color': primary,
        '--builder-button-hover-border-color': colorMix(primary, 82, '#000000'),
      },
    };
  }

  if (variant === 'primary-ghost') {
    return {
      ...base,
      backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: colorMix(primary, 9, 'transparent') },
      color: primary,
      border: custom.hasCustomBorder ? custom.border : '1px solid transparent',
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': colorMix(primary, 15, 'transparent'),
        '--builder-button-hover-color': primary,
        '--builder-button-hover-border-color': 'transparent',
      },
    };
  }

  if (variant === 'primary-link') {
    return {
      ...base,
      backgroundStyle: { background: 'transparent' },
      color: primary,
      border: 'none',
      borderColor: 'transparent',
      boxShadow: 'none',
      textDecoration: 'none',
      fontWeight: 700,
      paddingInline: 2,
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': 'transparent',
        '--builder-button-hover-color': colorMix(primary, 82, '#000000'),
        '--builder-button-hover-border-color': 'transparent',
        '--builder-button-hover-box-shadow': 'none',
        '--builder-button-hover-transform': 'translateY(0)',
      },
    };
  }

  if (variant === 'secondary-solid') {
    return {
      ...base,
      backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: secondary },
      color: background,
      border: custom.hasCustomBorder ? custom.border : `1px solid ${secondary}`,
      borderColor: custom.hasCustomBorder ? custom.borderColor : secondary,
      boxShadow: custom.hasShadow ? custom.boxShadow : `0 10px 22px ${colorMix(secondary, 18, 'transparent')}`,
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': colorMix(secondary, 86, '#000000'),
        '--builder-button-hover-color': background,
        '--builder-button-hover-border-color': colorMix(secondary, 86, '#000000'),
        '--builder-button-hover-box-shadow': `0 14px 30px ${colorMix(secondary, 25, 'transparent')}`,
      },
    };
  }

  if (variant === 'secondary-outline') {
    return {
      ...base,
      backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: 'transparent' },
      color: secondary,
      border: custom.hasCustomBorder ? custom.border : `1.5px solid ${secondary}`,
      borderColor: custom.hasCustomBorder ? custom.borderColor : secondary,
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': colorMix(secondary, 10, 'transparent'),
        '--builder-button-hover-color': secondary,
        '--builder-button-hover-border-color': colorMix(secondary, 82, '#000000'),
      },
    };
  }

  if (variant === 'cta-shadow') {
    return {
      ...base,
      backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: `linear-gradient(135deg, ${accent}, ${primary})` },
      color: '#ffffff',
      border: custom.hasCustomBorder ? custom.border : '1px solid transparent',
      borderColor: custom.hasCustomBorder ? custom.borderColor : 'transparent',
      boxShadow: custom.hasShadow ? custom.boxShadow : `0 18px 42px ${colorMix(primary, 30, 'transparent')}`,
      fontWeight: 800,
      fontSize: 16,
      paddingInline: 22,
      cssVars: {
        ...base.cssVars,
        '--builder-button-hover-background': `linear-gradient(135deg, ${colorMix(accent, 90, '#ffffff')}, ${colorMix(primary, 88, '#000000')})`,
        '--builder-button-hover-color': '#ffffff',
        '--builder-button-hover-border-color': 'transparent',
        '--builder-button-hover-box-shadow': `0 22px 54px ${colorMix(primary, 38, 'transparent')}`,
        '--builder-button-hover-transform': 'translateY(-2px)',
      },
    };
  }

  return {
    ...base,
    backgroundStyle: custom.hasCustomBg ? custom.backgroundStyle : { background: primary },
    color: background,
    border: custom.hasCustomBorder ? custom.border : `1px solid ${primary}`,
    borderColor: custom.hasCustomBorder ? custom.borderColor : primary,
    boxShadow: custom.hasShadow ? custom.boxShadow : `0 12px 28px ${colorMix(primary, 22, 'transparent')}`,
    fontWeight: 800,
    fontSize: 15,
    paddingInline: 20,
    cssVars: {
      ...base.cssVars,
      '--builder-button-hover-background': colorMix(primary, 88, '#000000'),
      '--builder-button-hover-color': background,
      '--builder-button-hover-border-color': colorMix(primary, 88, '#000000'),
      '--builder-button-hover-box-shadow': `0 16px 34px ${colorMix(primary, 30, 'transparent')}`,
      '--builder-button-hover-transform': 'translateY(-1px)',
    },
  };
}

export function getButtonVariantSuffix(value: unknown): string | null {
  return normalizeButtonVariantKey(value) === 'cta-arrow' ? '->' : null;
}
