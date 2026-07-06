'use client';

import {
  ANIMATION_EASING_OPTIONS,
  type MotionKeyframe,
} from '@/lib/builder/animations/presets';
import type { MotionTimelineEditorCopy } from '@/components/builder/editor/motion-timeline-editor-copy';

type Props = {
  keyframe: MotionKeyframe;
  index: number;
  offset: number;
  disabled?: boolean;
  copy: MotionTimelineEditorCopy;
  onOffsetChange: (index: number, offset: number) => void;
  onKeyframeChange: (index: number, patch: Partial<MotionKeyframe>) => void;
  onRemove: (index: number) => void;
};

export default function MotionTimelineKeyframeRow({
  keyframe,
  index,
  offset,
  disabled,
  copy,
  onOffsetChange,
  onKeyframeChange,
  onRemove,
}: Props) {
  const displayIndex = index + 1;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '36px minmax(72px, 1fr) minmax(64px, 72px) 30px',
        gap: 6,
        alignItems: 'center',
        fontSize: 11,
      }}
    >
      <strong style={{ color: '#1d4ed8' }}>#{displayIndex}</strong>
      <input
        type="number"
        min={0}
        max={1}
        step={0.01}
        value={offset}
        disabled={disabled}
        onChange={(event) => onOffsetChange(index, Math.max(0, Math.min(1, Number(event.target.value))))}
        style={{ padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
        aria-label={copy.offsetAriaLabel(displayIndex)}
      />
      <input
        type="number"
        min={0}
        max={1}
        step={0.05}
        value={keyframe.opacity ?? 1}
        disabled={disabled}
        onChange={(event) => onKeyframeChange(index, { opacity: Math.max(0, Math.min(1, Number(event.target.value))) })}
        style={{ padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
        aria-label={copy.opacityAriaLabel(displayIndex)}
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={disabled}
        style={{ background: 'transparent', border: 0, color: '#b91c1c', cursor: 'pointer', fontSize: 14 }}
        aria-label={copy.removeKeyframeAriaLabel(displayIndex)}
      >
        ×
      </button>
      <input
        type="text"
        placeholder={copy.transformPlaceholder}
        value={keyframe.transform ?? ''}
        disabled={disabled}
        onChange={(event) => onKeyframeChange(index, { transform: event.target.value })}
        style={{ gridColumn: '2 / -1', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'ui-monospace, Menlo, monospace' }}
        aria-label={copy.transformAriaLabel(displayIndex)}
      />
      <select
        value={keyframe.easing ?? 'linear'}
        disabled={disabled}
        onChange={(event) => onKeyframeChange(index, { easing: event.target.value })}
        style={{ gridColumn: '2 / -1', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
        aria-label={copy.easingAriaLabel(displayIndex)}
        data-builder-motion-keyframe-easing={`${displayIndex}`}
      >
        {ANIMATION_EASING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
