'use client';

import type { CSSProperties } from 'react';
import type { MotionKeyframe, MotionTimelineConfig } from '@/lib/builder/animations/presets';

interface Props {
  value: MotionTimelineConfig | undefined;
  disabled?: boolean;
  onChange: (next: MotionTimelineConfig | undefined) => void;
}

const DEFAULT: MotionTimelineConfig = {
  scrollBound: false,
  durationMs: 1200,
  keyframes: [],
};

const trackStyle: CSSProperties = {
  position: 'relative',
  height: 36,
  borderRadius: 6,
  background: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px) 0 0/10% 100%, #fafafa',
  border: '1px solid #e2e8f0',
};

const markerStyle: CSSProperties = {
  position: 'absolute',
  top: 2,
  bottom: 2,
  width: 10,
  borderRadius: 4,
  background: '#1d4ed8',
  cursor: 'ew-resize',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontSize: 9,
  fontWeight: 800,
};

/**
 * Phase 23 W173 — Motion timeline visual editor.
 *
 * Renders a horizontal track with draggable keyframe markers (offset 0~1).
 * Each keyframe can have a CSS `transform` and `opacity`. Supports a
 * scroll-bound toggle and a duration field (used when not scroll-bound).
 *
 * Designed for the inspector animations tab; emits a normalized
 * MotionTimelineConfig or `undefined` to clear.
 */
export default function MotionTimelineEditor({ value, disabled, onChange }: Props) {
  const config = value ?? DEFAULT;
  const keyframes = config.keyframes;

  function update(patch: Partial<MotionTimelineConfig>) {
    onChange({ ...config, ...patch });
  }

  function updateKeyframe(idx: number, patch: Partial<MotionKeyframe>) {
    const next = keyframes.map((k, i) => (i === idx ? { ...k, ...patch } : k));
    update({ keyframes: next });
  }

  function removeKeyframe(idx: number) {
    update({ keyframes: keyframes.filter((_, i) => i !== idx) });
  }

  function addKeyframe(offset: number) {
    if (keyframes.length >= 16) return;
    const clamped = Math.max(0, Math.min(1, offset));
    const next: MotionKeyframe = { offset: Number(clamped.toFixed(3)), transform: '', opacity: 1 };
    update({ keyframes: [...keyframes, next].sort((a, b) => a.offset - b.offset) });
  }

  function handleTrackClick(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = (event.clientX - rect.left) / rect.width;
    addKeyframe(offset);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={config.scrollBound}
            disabled={disabled}
            onChange={(event) => update({ scrollBound: event.target.checked })}
          />
          Scroll-bound
        </label>
        {!config.scrollBound ? (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Duration
            <input
              type="number"
              min={200}
              max={20000}
              step={100}
              value={config.durationMs}
              disabled={disabled}
              onChange={(event) => update({ durationMs: Number(event.target.value) || 1200 })}
              style={{ width: 80, padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
            />
            ms
          </label>
        ) : null}
        {value ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            disabled={disabled}
            style={{ marginLeft: 'auto', fontSize: 11, color: '#b91c1c', background: 'transparent', border: 0, cursor: 'pointer' }}
          >
            타임라인 제거
          </button>
        ) : null}
      </div>

      <div
        style={trackStyle}
        onClick={handleTrackClick}
        title="클릭해서 키프레임 추가"
        role="presentation"
      >
        {keyframes.map((kf, idx) => (
          <div
            key={idx}
            style={{ ...markerStyle, left: `${kf.offset * 100}%` }}
            title={`#${idx} · offset ${kf.offset.toFixed(2)}`}
          >
            {idx + 1}
          </div>
        ))}
        {keyframes.length === 0 ? (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              color: '#94a3b8',
              pointerEvents: 'none',
            }}
          >
            트랙을 클릭해 키프레임 추가
          </span>
        ) : null}
      </div>

      {keyframes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {keyframes.map((kf, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '36px 90px 1fr 70px 30px',
                gap: 6,
                alignItems: 'center',
                fontSize: 11,
              }}
            >
              <strong style={{ color: '#1d4ed8' }}>#{idx + 1}</strong>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={kf.offset}
                disabled={disabled}
                onChange={(event) => updateKeyframe(idx, { offset: Math.max(0, Math.min(1, Number(event.target.value))) })}
                style={{ padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
              />
              <input
                type="text"
                placeholder="transform e.g. translateY(-20px) scale(1.05)"
                value={kf.transform ?? ''}
                disabled={disabled}
                onChange={(event) => updateKeyframe(idx, { transform: event.target.value })}
                style={{ padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'ui-monospace, Menlo, monospace' }}
              />
              <input
                type="number"
                min={0}
                max={1}
                step={0.05}
                value={kf.opacity ?? 1}
                disabled={disabled}
                onChange={(event) => updateKeyframe(idx, { opacity: Math.max(0, Math.min(1, Number(event.target.value))) })}
                style={{ padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                aria-label={`Opacity keyframe ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => removeKeyframe(idx)}
                disabled={disabled}
                style={{ background: 'transparent', border: 0, color: '#b91c1c', cursor: 'pointer', fontSize: 14 }}
                aria-label={`Remove keyframe ${idx + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
