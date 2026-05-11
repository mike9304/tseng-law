'use client';

import type { CSSProperties } from 'react';
import type { BuilderAnimationConfig, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  ANIMATION_EASING_OPTIONS,
  CLICK_PRESET_OPTIONS,
  ENTRANCE_PRESET_OPTIONS,
  EXIT_PRESET_OPTIONS,
  HOVER_PRESET_OPTIONS,
  LOOP_PRESET_OPTIONS,
  SCROLL_EFFECT_OPTIONS,
  normalizeAnimationConfig,
  type AnimationEasing,
  type AnimationEasingValue,
  type ClickAnimationConfig,
  type ClickAnimationPreset,
  type EntranceAnimationConfig,
  type EntrancePreset,
  type ExitAnimationConfig,
  type ExitPreset,
  type HoverAnimationConfig,
  type HoverAnimationPreset,
  type LoopAnimationConfig,
  type LoopPreset,
  type MotionTimelineConfig,
  type ScrollAnimationConfig,
  type ScrollEffect,
} from '@/lib/builder/animations/presets';
import MotionTimelineEditor from '@/components/builder/editor/MotionTimelineEditor';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

type AnimationConfigValue = NonNullable<BuilderAnimationConfig>;

const sectionStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  paddingTop: 10,
  borderTop: '1px solid #e2e8f0',
};

const sectionHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
};

const sectionTitleStyle: CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

const hintStyle: CSSProperties = {
  margin: 0,
  color: '#64748b',
  fontSize: '0.74rem',
  lineHeight: 1.45,
};

const previewButtonStyle: CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#334155',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '4px 8px',
  cursor: 'pointer',
};

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function isPresetEasing(value: AnimationEasingValue): value is AnimationEasing {
  return ANIMATION_EASING_OPTIONS.some((option) => option.value === value);
}

function isCubicBezierEasing(value: string): boolean {
  return /^cubic-bezier\(\s*-?(?:\d+|\d*\.\d+)\s*,\s*-?(?:\d+|\d*\.\d+)\s*,\s*-?(?:\d+|\d*\.\d+)\s*,\s*-?(?:\d+|\d*\.\d+)\s*\)$/.test(value.trim());
}

function EasingField({
  label = 'Easing',
  value,
  disabled,
  onChange,
}: {
  label?: string;
  value: AnimationEasingValue;
  disabled?: boolean;
  onChange: (value: AnimationEasingValue) => void;
}) {
  const isPreset = isPresetEasing(value);
  const customValue = isPreset ? '' : value;
  const commitCustom = (rawValue: string) => {
    const nextValue = rawValue.trim();
    if (isCubicBezierEasing(nextValue)) onChange(nextValue);
  };

  return (
    <div className={styles.inspectorFieldGrid}>
      <label className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>{label}</span>
        <select
          className={styles.inspectorSelect}
          aria-label={label}
          value={isPreset ? value : 'custom'}
          disabled={disabled}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === 'custom' ? 'cubic-bezier(0.25, 0.1, 0.25, 1)' : nextValue);
          }}
        >
          {ANIMATION_EASING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          <option value="custom">Custom cubic-bezier</option>
        </select>
      </label>
      <label className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>Custom</span>
        <input
          className={styles.inspectorInput}
          type="text"
          defaultValue={customValue}
          placeholder="cubic-bezier(0.34, 1.56, 0.64, 1)"
          disabled={disabled || isPreset}
          onBlur={(event) => commitCustom(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitCustom(event.currentTarget.value);
          }}
        />
      </label>
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  disabled,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  const commit = (rawValue: string) => {
    const nextValue = clampNumber(Number(rawValue), min, max);
    if (Number.isFinite(nextValue)) onChange(nextValue);
  };

  return (
    <label className={styles.inspectorField}>
      <span className={styles.inspectorFieldLabel}>{label}</span>
      <div className={styles.inspectorRangeRow}>
        <input
          className={styles.inspectorRange}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => commit(event.target.value)}
        />
        <input
          className={styles.inspectorInput}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => commit(event.target.value)}
          aria-label={`${label}${suffix ? ` (${suffix})` : ''}`}
        />
      </div>
    </label>
  );
}

export default function AnimationsTab({
  node,
  disabled = false,
  onUpdateAnimation,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  onUpdateAnimation: (animation: BuilderAnimationConfig) => void;
}) {
  const animation = normalizeAnimationConfig(node.animation);

  const commitAnimation = (nextAnimation: AnimationConfigValue) => {
    onUpdateAnimation(nextAnimation);
  };

  const updateEntrance = (patch: Partial<EntranceAnimationConfig>) => {
    commitAnimation({
      ...(node.animation ?? {}),
      entrance: {
        ...animation.entrance,
        ...patch,
      },
    });
  };

  const updateScroll = (patch: Partial<ScrollAnimationConfig>) => {
    commitAnimation({
      ...(node.animation ?? {}),
      scroll: {
        ...animation.scroll,
        ...patch,
      },
    });
  };

  const updateHover = (patch: Partial<HoverAnimationConfig>) => {
    commitAnimation({
      ...(node.animation ?? {}),
      hover: {
        ...animation.hover,
        ...patch,
      },
    });
  };

  const updateClick = (patch: Partial<ClickAnimationConfig>) => {
    commitAnimation({
      ...(node.animation ?? {}),
      click: {
        ...animation.click,
        ...patch,
      },
    });
  };

  const updateExit = (patch: Partial<ExitAnimationConfig>) => {
    commitAnimation({
      ...(node.animation ?? {}),
      exit: {
        ...animation.exit,
        ...patch,
      },
    });
  };

  const updateLoop = (patch: Partial<LoopAnimationConfig>) => {
    commitAnimation({
      ...(node.animation ?? {}),
      loop: {
        ...animation.loop,
        ...patch,
      },
    });
  };

  const playPreview = () => {
    window.document.dispatchEvent(
      new CustomEvent('builder:play-animation-preview', {
        detail: { nodeId: node.id, startedAt: Date.now() },
      }),
    );
  };

  return (
    <div className={styles.inspectorFormStack}>
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>Entrance</span>
          <button
            type="button"
            style={previewButtonStyle}
            disabled={disabled || animation.entrance.preset === 'none'}
            onClick={playPreview}
          >
            Play preview
          </button>
        </div>

        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Preset</span>
          <select
            className={styles.inspectorSelect}
            aria-label="Entrance preset"
            value={animation.entrance.preset}
            disabled={disabled}
            onChange={(event) => updateEntrance({ preset: event.target.value as EntrancePreset })}
          >
            {ENTRANCE_PRESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <RangeField
          label="Duration"
          value={animation.entrance.duration}
          min={100}
          max={3000}
          step={50}
          suffix="ms"
          disabled={disabled}
          onChange={(duration) => updateEntrance({ duration: Math.round(duration) })}
        />
        <RangeField
          label="Delay"
          value={animation.entrance.delay}
          min={0}
          max={3000}
          step={50}
          suffix="ms"
          disabled={disabled}
          onChange={(delay) => updateEntrance({ delay: Math.round(delay) })}
        />

        <div className={styles.inspectorFieldGrid}>
          <EasingField
            value={animation.entrance.easing}
            disabled={disabled}
            onChange={(easing) => updateEntrance({ easing })}
          />
          <label className={styles.inspectorToggle}>
            <input
              type="checkbox"
              checked={animation.entrance.triggerOnce}
              disabled={disabled}
              onChange={(event) => updateEntrance({ triggerOnce: event.target.checked })}
            />
            <span>Trigger once</span>
          </label>
        </div>
      </section>

      <section style={sectionStyle}>
        <span style={sectionTitleStyle}>Exit</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Preset</span>
          <select
            className={styles.inspectorSelect}
            aria-label="Exit preset"
            value={animation.exit.preset}
            disabled={disabled}
            onChange={(event) => updateExit({ preset: event.target.value as ExitPreset })}
          >
            {EXIT_PRESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <RangeField
          label="Duration"
          value={animation.exit.duration}
          min={100}
          max={3000}
          step={50}
          suffix="ms"
          disabled={disabled || animation.exit.preset === 'none'}
          onChange={(duration) => updateExit({ duration: Math.round(duration) })}
        />
        <EasingField
          value={animation.exit.easing}
          disabled={disabled || animation.exit.preset === 'none'}
          onChange={(easing) => updateExit({ easing })}
        />
        <p style={hintStyle}>Exit runs when the element leaves the viewport on the published page.</p>
      </section>

      <section style={sectionStyle}>
        <span style={sectionTitleStyle}>Loop</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Preset</span>
          <select
            className={styles.inspectorSelect}
            aria-label="Loop preset"
            value={animation.loop.preset}
            disabled={disabled}
            onChange={(event) => updateLoop({ preset: event.target.value as LoopPreset })}
          >
            {LOOP_PRESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <RangeField
          label="Duration"
          value={animation.loop.durationMs}
          min={200}
          max={20000}
          step={100}
          suffix="ms"
          disabled={disabled || animation.loop.preset === 'none'}
          onChange={(durationMs) => updateLoop({ durationMs: Math.round(durationMs) })}
        />
        <RangeField
          label="Intensity"
          value={animation.loop.intensity}
          min={0}
          max={100}
          step={1}
          disabled={disabled || animation.loop.preset === 'none'}
          onChange={(intensity) => updateLoop({ intensity: Math.round(intensity) })}
        />
        <p style={hintStyle}>Loop presets run continuously on the published page and respect reduced motion.</p>
      </section>

      <section style={sectionStyle}>
        <span style={sectionTitleStyle}>Scroll</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Effect</span>
          <select
            className={styles.inspectorSelect}
            aria-label="Scroll effect"
            value={animation.scroll.effect}
            disabled={disabled}
            onChange={(event) => updateScroll({ effect: event.target.value as ScrollEffect })}
          >
            {SCROLL_EFFECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <RangeField
          label="Intensity"
          value={animation.scroll.intensity}
          min={-100}
          max={100}
          step={1}
          disabled={disabled || animation.scroll.effect === 'none'}
          onChange={(intensity) => updateScroll({ intensity })}
        />
        <p style={hintStyle}>Scroll effects run on the published page; the editor keeps this as a runtime setting.</p>
      </section>

      <section style={sectionStyle}>
        <span style={sectionTitleStyle}>Hover</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Preset</span>
          <select
            className={styles.inspectorSelect}
            aria-label="Hover preset"
            value={animation.hover.preset}
            disabled={disabled}
            onChange={(event) => updateHover({ preset: event.target.value as HoverAnimationPreset })}
          >
            {HOVER_PRESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <RangeField
          label="Transition"
          value={animation.hover.transitionMs}
          min={0}
          max={2000}
          step={25}
          suffix="ms"
          disabled={disabled}
          onChange={(transitionMs) => updateHover({ transitionMs: Math.round(transitionMs) })}
        />
        <p style={hintStyle}>Hover presets are separate from the Style tab hover controls and can be layered with them.</p>
      </section>

      <section style={sectionStyle}>
        <span style={sectionTitleStyle}>Click</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Preset</span>
          <select
            className={styles.inspectorSelect}
            aria-label="Click preset"
            value={animation.click.preset}
            disabled={disabled}
            onChange={(event) => updateClick({ preset: event.target.value as ClickAnimationPreset })}
          >
            {CLICK_PRESET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <RangeField
          label="Duration"
          value={animation.click.durationMs}
          min={100}
          max={3000}
          step={50}
          suffix="ms"
          disabled={disabled || animation.click.preset === 'none'}
          onChange={(durationMs) => updateClick({ durationMs: Math.round(durationMs) })}
        />
        <RangeField
          label="Intensity"
          value={animation.click.intensity}
          min={0}
          max={100}
          step={1}
          disabled={disabled || animation.click.preset === 'none'}
          onChange={(intensity) => updateClick({ intensity: Math.round(intensity) })}
        />
        <p style={hintStyle}>Click trigger replays once every time the published element is clicked.</p>
      </section>

      <section style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <span style={sectionTitleStyle}>Motion timeline</span>
        </div>
        <MotionTimelineEditor
          value={(node.animation as { timeline?: MotionTimelineConfig } | undefined)?.timeline}
          disabled={disabled}
          onChange={(timeline) => {
            const base = node.animation ?? {};
            if (!timeline) {
              const next = { ...base } as Record<string, unknown>;
              delete next.timeline;
              commitAnimation(next as AnimationConfigValue);
              return;
            }
            commitAnimation({ ...base, timeline });
          }}
        />
        <p style={hintStyle}>키프레임은 0~1 범위. scroll-bound 켜면 스크롤 진행률에 맞춰 보간, 끄면 durationMs 동안 시간 기반 재생.</p>
      </section>

      <button
        type="button"
        className={styles.actionButton}
        disabled={disabled || !node.animation}
        onClick={() => onUpdateAnimation(undefined)}
      >
        Reset animations
      </button>
    </div>
  );
}
