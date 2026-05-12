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
  // Phase 22 — Expand-in variants (W159)
  'expand-in',
  'expand-from-left',
  'expand-from-right',
  'bounce-in',
  'flip-x',
  'flip-y',
  'reveal-left',
  'reveal-right',
  'spin-in',
  'float-up',
] as const;

// Phase 22 — Exit animations (W160). Mirrors entrance keys but
// triggers on element leaving viewport via IntersectionObserver.
export const EXIT_PRESET_KEYS = [
  'none',
  'fade-out',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'zoom-out',
  'collapse',
] as const;
export type ExitPreset = (typeof EXIT_PRESET_KEYS)[number];

export const SCROLL_EFFECT_KEYS = [
  'none',
  'parallax-y',
  'background-parallax',
  'fade-on-scroll',
  'scale-on-scroll',
  'rotate-on-scroll',
  'pin',
  // Phase 22 — Scrub animations (W167) — scroll progress → frame value.
  'scrub-translate',
  'scrub-opacity',
  'scrub-rotate',
] as const;

export const HOVER_ANIMATION_PRESET_KEYS = [
  'none',
  'lift',
  'pulse',
  'glow',
  'rotate-3d',
  'tint',
  // Phase 22 — Hover fade (W168)
  'fade',
] as const;

// Phase 22 — Click trigger animations (W175).
export const CLICK_ANIMATION_PRESET_KEYS = [
  'none',
  'pulse',
  'bounce',
  'shake',
  'flash',
] as const;

// Phase 22 — Loop animations (W170~W171) — always-on idle motion.
export const LOOP_PRESET_KEYS = [
  'none',
  'pulse',
  'float',
  'bounce',
  'sway',
  'wiggle',
  'breath',
] as const;
export type LoopPreset = (typeof LOOP_PRESET_KEYS)[number];

// Phase 22 — Page transition (W172). Applied to route content wrapper.
export const PAGE_TRANSITION_KEYS = [
  'none',
  'fade',
  'slide-up',
  'slide-left',
  'scale',
] as const;
export type PageTransition = (typeof PAGE_TRANSITION_KEYS)[number];

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
export type ClickAnimationPreset = (typeof CLICK_ANIMATION_PRESET_KEYS)[number];
export type AnimationEasing = (typeof ANIMATION_EASING_KEYS)[number];
export type AnimationEasingValue = AnimationEasing | string;

export interface EntranceAnimationConfig {
  preset: EntrancePreset;
  duration: number;
  delay: number;
  easing: AnimationEasingValue;
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

export interface ClickAnimationConfig {
  preset: ClickAnimationPreset;
  durationMs: number;
  intensity: number;
}

// Phase 22 — Exit / loop / keyframe configs.
export interface ExitAnimationConfig {
  preset: ExitPreset;
  duration: number;
  easing: AnimationEasingValue;
}

export interface LoopAnimationConfig {
  preset: LoopPreset;
  durationMs: number;
  intensity: number; // 0~100
}

export interface MotionKeyframe {
  offset?: number; // 0~1, scroll progress or timeline position
  timeOffset?: number;
  transform?: string;
  opacity?: number;
  properties?: {
    transform?: string;
    opacity?: number;
  };
  easing?: AnimationEasingValue;
}

export interface MotionTimelineConfig {
  /** Bound to scroll progress when true; otherwise time-based via durationMs. */
  scrollBound: boolean;
  durationMs: number;
  keyframes: MotionKeyframe[];
}

export interface NormalizedAnimationConfig {
  entrance: EntranceAnimationConfig;
  scroll: ScrollAnimationConfig;
  hover: HoverAnimationConfig;
  click: ClickAnimationConfig;
  exit: ExitAnimationConfig;
  loop: LoopAnimationConfig;
  timeline: MotionTimelineConfig;
}

export const DEFAULT_EXIT_ANIMATION: ExitAnimationConfig = {
  preset: 'none',
  duration: 400,
  easing: 'ease-out',
};

export const DEFAULT_LOOP_ANIMATION: LoopAnimationConfig = {
  preset: 'none',
  durationMs: 2400,
  intensity: 30,
};

export const DEFAULT_MOTION_TIMELINE: MotionTimelineConfig = {
  scrollBound: false,
  durationMs: 1200,
  keyframes: [],
};

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
  opacity?: number;
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

export const DEFAULT_CLICK_ANIMATION: ClickAnimationConfig = {
  preset: 'none',
  durationMs: 500,
  intensity: 30,
};

export const DEFAULT_ANIMATION_CONFIG: NormalizedAnimationConfig = {
  entrance: DEFAULT_ENTRANCE_ANIMATION,
  scroll: DEFAULT_SCROLL_ANIMATION,
  hover: DEFAULT_HOVER_ANIMATION,
  click: DEFAULT_CLICK_ANIMATION,
  exit: DEFAULT_EXIT_ANIMATION,
  loop: DEFAULT_LOOP_ANIMATION,
  timeline: DEFAULT_MOTION_TIMELINE,
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
  'expand-in': {
    label: 'Expand in',
    description: '중앙에서 확장되며 등장.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'scale(0.6)',
    visibleTransform: 'scale(1)',
  },
  'expand-from-left': {
    label: 'Expand from left',
    description: '왼쪽 끝에서 확장.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateX(-20px) scale(0.8)',
    visibleTransform: 'translateX(0) scale(1)',
  },
  'expand-from-right': {
    label: 'Expand from right',
    description: '오른쪽 끝에서 확장.',
    initialOpacity: 0,
    visibleOpacity: 1,
    initialTransform: 'translateX(20px) scale(0.8)',
    visibleTransform: 'translateX(0) scale(1)',
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
  fade: {
    label: 'Fade',
    description: 'Lowers opacity slightly on hover.',
    opacity: 0.75,
  },
};

export const EXIT_PRESET_OPTIONS: Array<{ value: ExitPreset; label: string; description: string }> = [
  { value: 'none', label: 'None', description: 'No exit animation.' },
  { value: 'fade-out', label: 'Fade out', description: 'Opacity fades to zero when leaving the viewport.' },
  { value: 'slide-up', label: 'Slide up', description: 'Moves upward while fading out.' },
  { value: 'slide-down', label: 'Slide down', description: 'Moves downward while fading out.' },
  { value: 'slide-left', label: 'Slide left', description: 'Moves left while fading out.' },
  { value: 'slide-right', label: 'Slide right', description: 'Moves right while fading out.' },
  { value: 'zoom-out', label: 'Zoom out', description: 'Scales down while fading out.' },
  { value: 'collapse', label: 'Collapse', description: 'Collapses vertically from the top edge.' },
];

export const LOOP_PRESET_OPTIONS: Array<{ value: LoopPreset; label: string; description: string }> = [
  { value: 'none', label: 'None', description: 'No idle loop.' },
  { value: 'pulse', label: 'Pulse', description: 'Soft repeating scale pulse.' },
  { value: 'float', label: 'Float', description: 'Slow vertical floating motion.' },
  { value: 'bounce', label: 'Bounce', description: 'Stronger vertical bounce.' },
  { value: 'sway', label: 'Sway', description: 'Gentle side-to-side rotation.' },
  { value: 'wiggle', label: 'Wiggle', description: 'Short repeating rotational wiggle.' },
  { value: 'breath', label: 'Breath', description: 'Subtle opacity and scale breathing.' },
];

export const CLICK_PRESET_OPTIONS: Array<{ value: ClickAnimationPreset; label: string; description: string }> = [
  { value: 'none', label: 'None', description: 'No click trigger.' },
  { value: 'pulse', label: 'Pulse', description: 'Scale pulse once when clicked.' },
  { value: 'bounce', label: 'Bounce', description: 'Move upward and settle when clicked.' },
  { value: 'shake', label: 'Shake', description: 'Short horizontal shake when clicked.' },
  { value: 'flash', label: 'Flash', description: 'Brief opacity flash when clicked.' },
];

export const PAGE_TRANSITION_OPTIONS: Array<{ value: PageTransition; label: string; description: string }> = [
  { value: 'none', label: 'None', description: 'No page transition.' },
  { value: 'fade', label: 'Fade', description: 'Fade route content into view.' },
  { value: 'slide-up', label: 'Slide up', description: 'Fade and slide content upward.' },
  { value: 'slide-left', label: 'Slide left', description: 'Fade and slide content left.' },
  { value: 'scale', label: 'Scale', description: 'Fade and scale content into place.' },
];

export const SCROLL_EFFECT_OPTIONS: Array<{ value: ScrollEffect; label: string; description: string }> = [
  { value: 'none', label: 'None', description: 'No scroll effect.' },
  { value: 'parallax-y', label: 'Parallax Y', description: 'Moves vertically at a different scroll speed.' },
  { value: 'background-parallax', label: 'Background parallax', description: 'Moves the background image at a different scroll speed.' },
  { value: 'fade-on-scroll', label: 'Fade on scroll', description: 'Fades based on viewport position.' },
  { value: 'scale-on-scroll', label: 'Scale on scroll', description: 'Scales subtly while scrolling.' },
  { value: 'rotate-on-scroll', label: 'Rotate on scroll', description: 'Rotates based on viewport position.' },
  { value: 'pin', label: 'Pin', description: 'Keeps the node sticky during scroll.' },
  { value: 'scrub-translate', label: 'Scrub translate', description: 'Maps scroll progress directly to vertical movement.' },
  { value: 'scrub-opacity', label: 'Scrub opacity', description: 'Maps scroll progress directly to opacity.' },
  { value: 'scrub-rotate', label: 'Scrub rotate', description: 'Maps scroll progress directly to rotation.' },
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

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeMotionKeyframes(keyframes: MotionKeyframe[] | undefined): MotionKeyframe[] {
  return (keyframes ?? [])
    .map((keyframe) => {
      const rawOffset = keyframe.offset ?? keyframe.timeOffset ?? 0;
      const offset = Number.isFinite(rawOffset) ? clampNumber(Number(rawOffset), 0, 1) : 0;
      const transform = keyframe.transform ?? keyframe.properties?.transform;
      const opacity = keyframe.opacity ?? keyframe.properties?.opacity;
      return {
        offset,
        ...(transform ? { transform } : {}),
        ...(typeof opacity === 'number' ? { opacity: clampNumber(opacity, 0, 1) } : {}),
        ...(keyframe.easing ? { easing: keyframe.easing } : {}),
      };
    })
    .sort((a, b) => a.offset - b.offset);
}

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
    click: {
      ...DEFAULT_CLICK_ANIMATION,
      ...(animation?.click ?? {}),
    },
    exit: {
      ...DEFAULT_EXIT_ANIMATION,
      ...(animation?.exit ?? {}),
    },
    loop: {
      ...DEFAULT_LOOP_ANIMATION,
      ...(animation?.loop ?? {}),
    },
    timeline: {
      ...DEFAULT_MOTION_TIMELINE,
      ...(animation?.timeline ?? {}),
      keyframes: normalizeMotionKeyframes(animation?.timeline?.keyframes as MotionKeyframe[] | undefined),
    },
  };
}
