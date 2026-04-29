import type { BuilderAnimationConfig } from '@/lib/builder/canvas/types';

export const ENTRANCE_PRESET_KEYS = [
  'none',
  'fade-in',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'zoom-in',
  'zoom-out',
  'bounce-in',
  'flip-x',
  'flip-y',
  'reveal-left',
  'reveal-right',
  'spin-in',
  'float-up',
] as const;

export const SCROLL_EFFECT_KEYS = [
  'none',
  'parallax-y',
  'fade-on-scroll',
  'scale-on-scroll',
  'rotate-on-scroll',
  'pin',
] as const;

export const HOVER_ANIMATION_PRESET_KEYS = [
  'none',
  'lift',
  'pulse',
  'glow',
  'rotate-3d',
  'tint',
] as const;

export const ANIMATION_EASING_KEYS = [
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'linear',
] as const;

export type EntrancePreset = (typeof ENTRANCE_PRESET_KEYS)[number];
export type ScrollEffect = (typeof SCROLL_EFFECT_KEYS)[number];
export type HoverAnimationPreset = (typeof HOVER_ANIMATION_PRESET_KEYS)[number];
export type AnimationEasing = (typeof ANIMATION_EASING_KEYS)[number];

export interface EntranceAnimationConfig {
  preset: EntrancePreset;
  duration: number;
  delay: number;
  easing: AnimationEasing;
  triggerOnce: boolean;
}

export interface ScrollAnimationConfig {
  effect: ScrollEffect;
  intensity: number;
}

export interface HoverAnimationConfig {
  preset: HoverAnimationPreset;
  transitionMs: number;
}

export interface NormalizedAnimationConfig {
  entrance: EntranceAnimationConfig;
  scroll: ScrollAnimationConfig;
  hover: HoverAnimationConfig;
}

export interface EntrancePresetDefinition {
  label: string;
  description: string;
  initialOpacity?: number;
  visibleOpacity?: number;
  initialTransform?: string;
  visibleTransform?: string;
  initialClipPath?: string;
  visibleClipPath?: string;
  easing?: AnimationEasing | string;
}

export interface HoverPresetDefinition {
  label: string;
  description: string;
  transform?: string;
  boxShadow?: string;
  filter?: string;
}

export const DEFAULT_ENTRANCE_ANIMATION: EntranceAnimationConfig = {
  preset: 'none',
  duration: 600,
  delay: 0,
  easing: 'ease-out',
  triggerOnce: true,
};

export const DEFAULT_SCROLL_ANIMATION: ScrollAnimationConfig = {
  effect: 'none',
  intensity: 20,
};

export const DEFAULT_HOVER_ANIMATION: HoverAnimationConfig = {
  preset: 'none',
  transitionMs: 200,
};

export const DEFAULT_ANIMATION_CONFIG: NormalizedAnimationConfig = {
  entrance: DEFAULT_ENTRANCE_ANIMATION,
  scroll: DEFAULT_SCROLL_ANIMATION,
  hover: DEFAULT_HOVER_ANIMATION,
};

export const ENTRANCE_PRESET_DEFINITIONS: Record<EntrancePreset, EntrancePresetDefinition> = {
  none: {
    label: 'None',
    description: 'No entrance animation.',
    initialOpacity: 1,
    visibleOpacity: 1,
  },
  'fade-in': {
    label: 'Fade in',
    description: 'Opacity fades from 0 to 1.',
    initialOpacity: 0,
    visibleOpacity: 1,
  },
  'slide-up': {
    label: 'Slide up',
    description: 'Moves up from below while fading in.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateY(40px)',
  },
  'slide-down': {
    label: 'Slide down',
    description: 'Moves down from above while fading in.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateY(-40px)',
  },
  'slide-left': {
    label: 'Slide left',
    description: 'Moves left from the right side while fading in.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateX(40px)',
  },
  'slide-right': {
    label: 'Slide right',
    description: 'Moves right from the left side while fading in.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateX(-40px)',
  },
  'zoom-in': {
    label: 'Zoom in',
    description: 'Scales up into place.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'scale(0.6)',
  },
  'zoom-out': {
    label: 'Zoom out',
    description: 'Scales down into place.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'scale(1.2)',
  },
  'bounce-in': {
    label: 'Bounce in',
    description: 'Pops into place with an overshoot.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'scale(0.3)',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  'flip-x': {
    label: 'Flip X',
    description: 'Flips forward around the X axis.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'perspective(800px) rotateX(90deg)',
  },
  'flip-y': {
    label: 'Flip Y',
    description: 'Flips forward around the Y axis.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'perspective(800px) rotateY(90deg)',
  },
  'reveal-left': {
    label: 'Reveal left',
    description: 'Reveals content from left to right.',
    initialOpacity: 1,
    visibleOpacity: 1,
    initialClipPath: 'inset(0 100% 0 0)',
    visibleClipPath: 'inset(0 0 0 0)',
  },
  'reveal-right': {
    label: 'Reveal right',
    description: 'Reveals content from right to left.',
    initialOpacity: 1,
    visibleOpacity: 1,
    initialClipPath: 'inset(0 0 0 100%)',
    visibleClipPath: 'inset(0 0 0 0)',
  },
  'spin-in': {
    label: 'Spin in',
    description: 'Rotates and scales into place.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'rotate(180deg) scale(0.5)',
  },
  'float-up': {
    label: 'Float up',
    description: 'Longer upward float with a soft fade.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateY(80px)',
  },
};

export const HOVER_PRESET_DEFINITIONS: Record<HoverAnimationPreset, HoverPresetDefinition> = {
  none: {
    label: 'None',
    description: 'No hover animation.',
  },
  lift: {
    label: 'Lift',
    description: 'Raises the node and adds a stronger shadow.',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
  pulse: {
    label: 'Pulse',
    description: 'Slightly scales the node on hover.',
    transform: 'scale(1.05)',
  },
  glow: {
    label: 'Glow',
    description: 'Adds a brand-colored glow around the node.',
    boxShadow: '0 0 24px var(--builder-animation-primary, #3b82f6)',
  },
  'rotate-3d': {
    label: 'Rotate 3D',
    description: 'Tilts the node with perspective.',
    transform: 'perspective(800px) rotateY(8deg)',
  },
  tint: {
    label: 'Tint',
    description: 'Brightens and saturates the node.',
    filter: 'brightness(1.1) saturate(1.2)',
  },
};

export const SCROLL_EFFECT_OPTIONS: Array<{ value: ScrollEffect; label: string; description: string }> = [
  { value: 'none', label: 'None', description: 'No scroll effect.' },
  { value: 'parallax-y', label: 'Parallax Y', description: 'Moves vertically at a different scroll speed.' },
  { value: 'fade-on-scroll', label: 'Fade on scroll', description: 'Fades based on viewport position.' },
  { value: 'scale-on-scroll', label: 'Scale on scroll', description: 'Scales subtly while scrolling.' },
  { value: 'rotate-on-scroll', label: 'Rotate on scroll', description: 'Rotates based on viewport position.' },
  { value: 'pin', label: 'Pin', description: 'Keeps the node sticky during scroll.' },
];

export const ENTRANCE_PRESET_OPTIONS = ENTRANCE_PRESET_KEYS.map((value) => ({
  value,
  label: ENTRANCE_PRESET_DEFINITIONS[value].label,
  description: ENTRANCE_PRESET_DEFINITIONS[value].description,
}));

export const HOVER_PRESET_OPTIONS = HOVER_ANIMATION_PRESET_KEYS.map((value) => ({
  value,
  label: HOVER_PRESET_DEFINITIONS[value].label,
  description: HOVER_PRESET_DEFINITIONS[value].description,
}));

export const ANIMATION_EASING_OPTIONS = ANIMATION_EASING_KEYS.map((value) => ({
  value,
  label: value,
}));

export function normalizeAnimationConfig(animation?: BuilderAnimationConfig | null): NormalizedAnimationConfig {
  return {
    entrance: {
      ...DEFAULT_ENTRANCE_ANIMATION,
      ...(animation?.entrance ?? {}),
    },
    scroll: {
      ...DEFAULT_SCROLL_ANIMATION,
      ...(animation?.scroll ?? {}),
    },
    hover: {
      ...DEFAULT_HOVER_ANIMATION,
      ...(animation?.hover ?? {}),
    },
  };
}
