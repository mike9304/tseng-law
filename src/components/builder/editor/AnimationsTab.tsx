'use client';

import type { CSSProperties } from 'react';
import type { BuilderAnimationConfig, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  ANIMATION_EASING_OPTIONS,
  ENTRANCE_PRESET_OPTIONS,
  HOVER_PRESET_OPTIONS,
  SCROLL_EFFECT_OPTIONS,
  normalizeAnimationConfig,
  type AnimationEasing,
  type EntranceAnimationConfig,
  type EntrancePreset,
  type HoverAnimationConfig,
  type HoverAnimationPreset,
  type ScrollAnimationConfig,
  type ScrollEffect,
} from '@/lib/builder/animations/presets';
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
          <label className={styles.inspectorField}>
            <span className={styles.inspectorFieldLabel}>Easing</span>
            <select
              className={styles.inspectorSelect}
              value={animation.entrance.easing}
              disabled={disabled}
              onChange={(event) => updateEntrance({ easing: event.target.value as AnimationEasing })}
            >
              {ANIMATION_EASING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
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
        <span style={sectionTitleStyle}>Scroll</span>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Effect</span>
          <select
            className={styles.inspectorSelect}
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
