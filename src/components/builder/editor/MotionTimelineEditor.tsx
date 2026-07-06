'use client';

import { useRef, type CSSProperties } from 'react';
import type { MotionKeyframe, MotionTimelineConfig } from '@/lib/builder/animations/presets';
import type { Locale } from '@/lib/locales';
import { getMotionTimelineEditorCopy } from '@/components/builder/editor/motion-timeline-editor-copy';
import MotionTimelineKeyframeRow from '@/components/builder/editor/MotionTimelineKeyframeRow';

interface Props {
  value: MotionTimelineConfig | undefined;
  disabled?: boolean;
  locale?: Locale;
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

function keyframeOffset(keyframe: MotionKeyframe): number {
  const raw = keyframe.offset ?? keyframe.timeOffset ?? 0;
  return Math.max(0, Math.min(1, raw));
}

export default function MotionTimelineEditor({ value, disabled, locale = 'ko', onChange }: Props) {
  const config = value ?? DEFAULT;
  const keyframes = config.keyframes;
  const copy = getMotionTimelineEditorCopy(locale);
  const draggingIndexRef = useRef<number | null>(null);

  function update(patch: Partial<MotionTimelineConfig>) {
    onChange({ ...config, ...patch });
  }

  function updateKeyframe(idx: number, patch: Partial<MotionKeyframe>) {
    const next = keyframes.map((k, i) => (i === idx ? { ...k, ...patch } : k));
    update({ keyframes: next });
  }

  function updateKeyframeOffset(idx: number, offset: number) {
    const next = keyframes
      .map((keyframe, index) => (index === idx ? { ...keyframe, offset } : keyframe))
      .sort((left, right) => keyframeOffset(left) - keyframeOffset(right));
    update({ keyframes: next });
  }

  function removeKeyframe(idx: number) {
    update({ keyframes: keyframes.filter((_, i) => i !== idx) });
  }

  function addKeyframe(offset: number) {
    if (keyframes.length >= 16) return;
    const clamped = Math.max(0, Math.min(1, offset));
    const next: MotionKeyframe = { offset: Number(clamped.toFixed(3)), transform: '', opacity: 1 };
    update({ keyframes: [...keyframes, next].sort((a, b) => keyframeOffset(a) - keyframeOffset(b)) });
  }

  function handleTrackClick(event: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    if (event.currentTarget !== event.target) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = (event.clientX - rect.left) / rect.width;
    addKeyframe(offset);
  }

  function markerOffsetFromPointer(event: React.PointerEvent<HTMLDivElement>): number | null {
    const track = event.currentTarget.parentElement;
    if (!track) return null;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return null;
    return Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  }

  function handleMarkerPointerDown(event: React.PointerEvent<HTMLDivElement>, idx: number) {
    if (disabled) return;
    event.preventDefault();
    event.stopPropagation();
    draggingIndexRef.current = idx;
    event.currentTarget.setPointerCapture(event.pointerId);
    const offset = markerOffsetFromPointer(event);
    if (offset !== null) updateKeyframeOffset(idx, Number(offset.toFixed(3)));
  }

  function handleMarkerPointerMove(event: React.PointerEvent<HTMLDivElement>, idx: number) {
    if (disabled || draggingIndexRef.current !== idx) return;
    event.preventDefault();
    event.stopPropagation();
    const offset = markerOffsetFromPointer(event);
    if (offset !== null) updateKeyframeOffset(idx, Number(offset.toFixed(3)));
  }

  function handleMarkerPointerUp(event: React.PointerEvent<HTMLDivElement>, idx: number) {
    if (draggingIndexRef.current !== idx) return;
    event.preventDefault();
    event.stopPropagation();
    draggingIndexRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
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
          {copy.scrollBoundLabel}
        </label>
        {!config.scrollBound ? (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {copy.durationLabel}
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
            {copy.millisecondsLabel}
          </label>
        ) : null}
        {value ? (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            disabled={disabled}
            style={{ marginLeft: 'auto', fontSize: 11, color: '#b91c1c', background: 'transparent', border: 0, cursor: 'pointer' }}
          >
            {copy.removeTimelineLabel}
          </button>
        ) : null}
      </div>

      <div
        style={trackStyle}
        onClick={handleTrackClick}
        title={copy.trackAddTitle}
        role="presentation"
      >
        {keyframes.map((kf, idx) => (
          <div
            key={idx}
            role="slider"
            aria-label={copy.markerAriaLabel(idx + 1)}
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={keyframeOffset(kf)}
            tabIndex={disabled ? -1 : 0}
            data-builder-motion-keyframe-marker={`${idx + 1}`}
            style={{ ...markerStyle, left: `${keyframeOffset(kf) * 100}%` }}
            title={copy.markerTitle(idx + 1, keyframeOffset(kf).toFixed(2))}
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => handleMarkerPointerDown(event, idx)}
            onPointerMove={(event) => handleMarkerPointerMove(event, idx)}
            onPointerUp={(event) => handleMarkerPointerUp(event, idx)}
            onPointerCancel={(event) => handleMarkerPointerUp(event, idx)}
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
            {copy.emptyTrackLabel}
          </span>
        ) : null}
      </div>

      {keyframes.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {keyframes.map((kf, idx) => (
            <MotionTimelineKeyframeRow
              key={idx}
              keyframe={kf}
              index={idx}
              offset={keyframeOffset(kf)}
              copy={copy}
              disabled={disabled}
              onOffsetChange={updateKeyframeOffset}
              onKeyframeChange={updateKeyframe}
              onRemove={removeKeyframe}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
