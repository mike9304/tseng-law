import type { CSSProperties } from 'react';
import type { BuilderAnimationConfig } from '@/lib/builder/canvas/types';
import {
  ENTRANCE_PRESET_DEFINITIONS,
  HOVER_PRESET_DEFINITIONS,
  normalizeAnimationConfig,
  type EntranceAnimationConfig,
  type EntrancePreset,
  type HoverAnimationConfig,
  type NormalizedAnimationConfig,
} from '@/lib/builder/animations/presets';

export type AnimationPreviewPhase = 'initial' | 'visible' | null;

type AnimationCssVars = CSSProperties & Record<string, string | number | undefined>;

export interface PublishedAnimationAttributes {
  'data-anim-entrance'?: EntrancePreset;
  'data-anim-state'?: 'pending';
  'data-anim-once'?: 'true' | 'false';
  'data-anim-scroll'?: string;
  'data-anim-intensity'?: string;
  'data-anim-hover'?: string;
  // Phase 22 runtime.
  'data-anim-exit'?: string;
  'data-anim-exit-duration'?: string;
  'data-anim-exit-easing'?: string;
  'data-anim-loop'?: string;
  'data-anim-loop-duration'?: string;
  'data-anim-loop-intensity'?: string;
}

export interface EditorAnimationStyle {
  transform?: string;
  opacity?: number;
  clipPath?: string;
  boxShadow?: string;
  filter?: string;
  transition?: string;
  transformOrigin?: string;
}

function isPresentTransform(value?: string | null): value is string {
  return Boolean(value && value.trim() && value.trim() !== 'none');
}

export function mergeCssTransforms(...values: Array<string | undefined | null>): string | undefined {
  const transforms = values.filter((value): value is string => isPresentTransform(value));
  return transforms.length > 0 ? transforms.join(' ') : undefined;
}

function cssMs(value: number): string {
  return `${Math.round(value)}ms`;
}

function getEntranceEasing(config: EntranceAnimationConfig): string {
  return ENTRANCE_PRESET_DEFINITIONS[config.preset].easing ?? config.easing;
}

function buildEntranceTransform(
  preset: EntrancePreset,
  phase: 'initial' | 'visible',
  baseTransform?: string,
): string {
  const definition = ENTRANCE_PRESET_DEFINITIONS[preset];
  const presetTransform = phase === 'initial'
    ? definition.initialTransform
    : definition.visibleTransform;
  return mergeCssTransforms(baseTransform, presetTransform) ?? baseTransform ?? 'none';
}

function resolveHoverBoxShadow(value: string | undefined, primaryColor: string): string | undefined {
  return value?.replace('var(--builder-animation-primary, #3b82f6)', primaryColor);
}

export function hasEntranceAnimation(animation?: BuilderAnimationConfig | null): boolean {
  return normalizeAnimationConfig(animation).entrance.preset !== 'none';
}

export function hasScrollAnimation(animation?: BuilderAnimationConfig | null): boolean {
  return normalizeAnimationConfig(animation).scroll.effect !== 'none';
}

export function hasHoverAnimation(animation?: BuilderAnimationConfig | null): boolean {
  return normalizeAnimationConfig(animation).hover.preset !== 'none';
}

export function hasActiveAnimation(animation?: BuilderAnimationConfig | null): boolean {
  return hasEntranceAnimation(animation) || hasScrollAnimation(animation) || hasHoverAnimation(animation);
}

export function getAnimationSummary(animation?: BuilderAnimationConfig | null): string | null {
  const normalized = normalizeAnimationConfig(animation);
  const parts: string[] = [];
  if (normalized.entrance.preset !== 'none') {
    parts.push(`entrance: ${ENTRANCE_PRESET_DEFINITIONS[normalized.entrance.preset].label}`);
  }
  if (normalized.scroll.effect !== 'none') {
    parts.push(`scroll: ${normalized.scroll.effect}`);
  }
  if (normalized.hover.preset !== 'none') {
    parts.push(`hover: ${HOVER_PRESET_DEFINITIONS[normalized.hover.preset].label}`);
  }
  return parts.length > 0 ? parts.join(', ') : null;
}

export function getPublishedAnimationAttributes(
  animation?: BuilderAnimationConfig | null,
): PublishedAnimationAttributes {
  const normalized = normalizeAnimationConfig(animation);
  const attrs: PublishedAnimationAttributes = {};

  if (normalized.entrance.preset !== 'none') {
    attrs['data-anim-entrance'] = normalized.entrance.preset;
    attrs['data-anim-state'] = 'pending';
    attrs['data-anim-once'] = normalized.entrance.triggerOnce ? 'true' : 'false';
  }

  if (normalized.scroll.effect !== 'none') {
    attrs['data-anim-scroll'] = normalized.scroll.effect;
    attrs['data-anim-intensity'] = String(normalized.scroll.intensity);
  }

  if (normalized.hover.preset !== 'none') {
    attrs['data-anim-hover'] = normalized.hover.preset;
  }

  // Phase 22 runtime — exit / loop attributes.
  if (normalized.exit && normalized.exit.preset !== 'none') {
    attrs['data-anim-exit'] = normalized.exit.preset;
    attrs['data-anim-exit-duration'] = String(normalized.exit.duration);
    attrs['data-anim-exit-easing'] = normalized.exit.easing;
  }
  if (normalized.loop && normalized.loop.preset !== 'none') {
    attrs['data-anim-loop'] = normalized.loop.preset;
    attrs['data-anim-loop-duration'] = String(normalized.loop.durationMs);
    attrs['data-anim-loop-intensity'] = String(normalized.loop.intensity);
  }

  return attrs;
}

export function buildPublishedAnimationStyle({
  animation,
  baseTransform,
  baseOpacity = 1,
  primaryColor = 'var(--builder-color-primary, #3b82f6)',
}: {
  animation?: BuilderAnimationConfig | null;
  baseTransform?: string;
  baseOpacity?: number;
  primaryColor?: string;
}): AnimationCssVars {
  if (!hasActiveAnimation(animation)) return {};

  const normalized = normalizeAnimationConfig(animation);
  const entrance = normalized.entrance;
  const entranceDefinition = ENTRANCE_PRESET_DEFINITIONS[entrance.preset];
  const hoverDefinition = HOVER_PRESET_DEFINITIONS[normalized.hover.preset];
  const hoverTransform = mergeCssTransforms(baseTransform, hoverDefinition.transform) ?? baseTransform ?? 'none';

  return {
    '--builder-base-transform': baseTransform ?? 'none',
    '--builder-animation-primary': primaryColor,
    '--builder-anim-duration': cssMs(entrance.duration),
    '--builder-anim-delay': cssMs(entrance.delay),
    '--builder-anim-easing': getEntranceEasing(entrance),
    '--builder-anim-initial-opacity': baseOpacity * (entranceDefinition.initialOpacity ?? 1),
    '--builder-anim-visible-opacity': baseOpacity * (entranceDefinition.visibleOpacity ?? 1),
    '--builder-anim-initial-transform': buildEntranceTransform(entrance.preset, 'initial', baseTransform),
    '--builder-anim-visible-transform': buildEntranceTransform(entrance.preset, 'visible', baseTransform),
    '--builder-anim-initial-clip-path': entranceDefinition.initialClipPath ?? 'inset(0 0 0 0)',
    '--builder-anim-visible-clip-path': entranceDefinition.visibleClipPath ?? 'inset(0 0 0 0)',
    '--builder-anim-hover-transition': cssMs(normalized.hover.transitionMs),
    '--builder-anim-hover-transform': hoverTransform,
    '--builder-anim-hover-box-shadow': hoverDefinition.boxShadow,
    '--builder-anim-hover-filter': hoverDefinition.filter,
  };
}

export function buildEditorAnimationStyle({
  animation,
  isHovered,
  previewPhase,
  baseTransform,
  primaryColor = '#3b82f6',
}: {
  animation?: BuilderAnimationConfig | null;
  isHovered: boolean;
  previewPhase: AnimationPreviewPhase;
  baseTransform?: string;
  primaryColor?: string;
}): EditorAnimationStyle {
  const normalized: NormalizedAnimationConfig = normalizeAnimationConfig(animation);
  const transforms: string[] = [];
  const transitionParts: string[] = [];
  let opacity: number | undefined;
  let clipPath: string | undefined;
  let boxShadow: string | undefined;
  let filter: string | undefined;

  if (previewPhase && normalized.entrance.preset !== 'none') {
    const definition = ENTRANCE_PRESET_DEFINITIONS[normalized.entrance.preset];
    const phaseTransform = previewPhase === 'initial'
      ? definition.initialTransform
      : definition.visibleTransform;
    if (phaseTransform) transforms.push(phaseTransform);
    opacity = previewPhase === 'initial'
      ? definition.initialOpacity ?? 1
      : definition.visibleOpacity ?? 1;
    clipPath = previewPhase === 'initial'
      ? definition.initialClipPath
      : definition.visibleClipPath;
    const timing = `${cssMs(normalized.entrance.duration)} ${getEntranceEasing(normalized.entrance)} ${cssMs(normalized.entrance.delay)}`;
    transitionParts.push(`opacity ${timing}`, `transform ${timing}`, `clip-path ${timing}`);
  }

  if (isHovered && normalized.hover.preset !== 'none') {
    const hoverDefinition = HOVER_PRESET_DEFINITIONS[normalized.hover.preset];
    if (hoverDefinition.transform) transforms.push(hoverDefinition.transform);
    boxShadow = resolveHoverBoxShadow(hoverDefinition.boxShadow, primaryColor);
    filter = hoverDefinition.filter;
    const hoverDuration = cssMs(normalized.hover.transitionMs);
    transitionParts.push(
      `transform ${hoverDuration} ease`,
      `box-shadow ${hoverDuration} ease`,
      `filter ${hoverDuration} ease`,
    );
  } else if (normalized.hover.preset !== 'none') {
    const hoverDuration = cssMs((normalized.hover as HoverAnimationConfig).transitionMs);
    transitionParts.push(
      `transform ${hoverDuration} ease`,
      `box-shadow ${hoverDuration} ease`,
      `filter ${hoverDuration} ease`,
    );
  }

  return {
    transform: mergeCssTransforms(baseTransform, ...transforms),
    opacity,
    clipPath,
    boxShadow,
    filter,
    transition: transitionParts.length > 0 ? transitionParts.join(', ') : undefined,
    transformOrigin: hasActiveAnimation(animation) ? 'center center' : undefined,
  };
}
