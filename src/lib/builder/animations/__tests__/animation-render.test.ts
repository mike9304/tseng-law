import { describe, expect, it } from 'vitest';
import {
  ANIMATION_EASING_OPTIONS,
  SCROLL_EFFECT_OPTIONS,
  normalizeAnimationConfig,
  type MotionKeyframe,
} from '@/lib/builder/animations/presets';
import {
  ELASTIC_EASING_CSS,
  buildEditorAnimationStyle,
  buildPublishedAnimationStyle,
  getAnimationSummary,
  getPublishedAnimationAttributes,
  hasActiveAnimation,
} from '@/lib/builder/animations/animation-render';
import type { BuilderAnimationConfig } from '@/lib/builder/canvas/types';

describe('builder animation rendering', () => {
  it('normalizes Phase 22 exit, loop, scrub, custom easing, and timeline settings', () => {
    const animation: BuilderAnimationConfig = {
      entrance: {
        preset: 'expand-in',
        duration: 700,
        delay: 50,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        triggerOnce: false,
      },
      scroll: {
        effect: 'scrub-translate',
        intensity: 42,
      },
      hover: {
        preset: 'fade',
        transitionMs: 180,
      },
      click: {
        preset: 'pulse',
        durationMs: 520,
        intensity: 44,
      },
      exit: {
        preset: 'fade-out',
        duration: 450,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      loop: {
        preset: 'float',
        durationMs: 2600,
        intensity: 36,
      },
      timeline: {
        scrollBound: true,
        durationMs: 1600,
        keyframes: [
          {
            timeOffset: 1,
            properties: { transform: 'scale(1.08)', opacity: 0.55 },
            easing: 'cubic-bezier(0.3, 0, 0.1, 1)',
          } as MotionKeyframe,
          { offset: 0, transform: 'translateY(0)', opacity: 1 },
        ],
      },
    };

    const normalized = normalizeAnimationConfig(animation);
    expect(normalized.exit.preset).toBe('fade-out');
    expect(normalized.loop.preset).toBe('float');
    expect(normalized.timeline.keyframes).toEqual([
      { offset: 0, transform: 'translateY(0)', opacity: 1 },
      {
        offset: 1,
        transform: 'scale(1.08)',
        opacity: 0.55,
        easing: 'cubic-bezier(0.3, 0, 0.1, 1)',
      },
    ]);
    expect(SCROLL_EFFECT_OPTIONS.map((option) => option.value)).toContain('scrub-translate');

    const attrs = getPublishedAnimationAttributes(animation);
    expect(attrs).toMatchObject({
      'data-anim-entrance': 'expand-in',
      'data-anim-once': 'false',
      'data-anim-scroll': 'scrub-translate',
      'data-anim-hover': 'fade',
      'data-anim-click': 'pulse',
      'data-anim-click-duration': '520',
      'data-anim-click-intensity': '44',
      'data-anim-exit': 'fade-out',
      'data-anim-exit-duration': '450',
      'data-anim-exit-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'data-anim-loop': 'float',
      'data-anim-loop-duration': '2600',
      'data-anim-loop-intensity': '36',
      'data-anim-timeline-mode': 'scroll',
      'data-anim-timeline-duration': '1600',
    });
    expect(JSON.parse(attrs['data-anim-timeline'] ?? '[]')).toEqual(normalized.timeline.keyframes);
    expect(hasActiveAnimation(animation)).toBe(true);
    expect(getAnimationSummary(animation)).toContain('click: pulse');
    expect(getAnimationSummary(animation)).toContain('exit: fade-out');
    expect(getAnimationSummary(animation)).toContain('loop: float');
  });

  it('emits hover fade opacity for published and editor previews', () => {
    const animation: BuilderAnimationConfig = {
      hover: {
        preset: 'fade',
        transitionMs: 180,
      },
    };

    const publishedStyle = buildPublishedAnimationStyle({ animation });
    expect(publishedStyle['--builder-anim-hover-opacity']).toBe(0.75);

    const editorStyle = buildEditorAnimationStyle({
      animation,
      isHovered: true,
      previewPhase: null,
    });
    expect(editorStyle.opacity).toBe(0.75);
    expect(editorStyle.transition).toContain('opacity 180ms ease');
  });

  it('exposes background parallax as a published scroll effect', () => {
    const animation: BuilderAnimationConfig = {
      scroll: {
        effect: 'background-parallax',
        intensity: 36,
      },
    };

    expect(SCROLL_EFFECT_OPTIONS.map((option) => option.value)).toContain('background-parallax');
    expect(getPublishedAnimationAttributes(animation)).toMatchObject({
      'data-anim-scroll': 'background-parallax',
      'data-anim-intensity': '36',
    });
    expect(getAnimationSummary(animation)).toBe('scroll: background-parallax');
  });

  it('maps elastic easing to a CSS-safe cubic-bezier while preserving the preset option', () => {
    const animation: BuilderAnimationConfig = {
      entrance: {
        preset: 'slide-up',
        duration: 640,
        delay: 0,
        easing: 'elastic',
        triggerOnce: true,
      },
      exit: {
        preset: 'fade-out',
        duration: 420,
        easing: 'elastic',
      },
    };

    expect(ANIMATION_EASING_OPTIONS.map((option) => option.value)).toContain('elastic');
    expect(normalizeAnimationConfig(animation).entrance.easing).toBe('elastic');
    expect(buildPublishedAnimationStyle({ animation })['--builder-anim-easing']).toBe(ELASTIC_EASING_CSS);
    expect(getPublishedAnimationAttributes(animation)['data-anim-exit-easing']).toBe(ELASTIC_EASING_CSS);
    expect(buildEditorAnimationStyle({
      animation,
      isHovered: false,
      previewPhase: 'visible',
    }).transition).toContain(ELASTIC_EASING_CSS);
  });
});
