import { describe, expect, it } from 'vitest';
import {
  applyTimelineEasing,
  interpolateTimelineFrame,
  parseRuntimeTimelineKeyframes,
} from '../motionTimelineRuntime';

describe('published motion timeline runtime', () => {
  it('interpolates translate, scale, and opacity at linear mid progress', () => {
    const frame = interpolateTimelineFrame([
      { offset: 0, transform: 'translateY(0px) scale(1)', opacity: 1 },
      { offset: 1, transform: 'translateY(-80px) scale(1.2)', opacity: 0.5, easing: 'linear' },
    ], 0.5);

    expect(frame.transform).toBe('translateY(-40px) scale(1.1)');
    expect(frame.opacity).toBe(0.75);
  });

  it('applies keyframe easing before sampling motion values', () => {
    const frame = interpolateTimelineFrame([
      { offset: 0, transform: 'translateY(0px)', opacity: 1 },
      { offset: 1, transform: 'translateY(-80px)', opacity: 0.5, easing: 'ease-in' },
    ], 0.5);

    expect(frame.transform).toBe('translateY(-20px)');
    expect(frame.opacity).toBe(0.875);
  });

  it('parses serialized timeline keyframes from published data attributes', () => {
    const parsed = parseRuntimeTimelineKeyframes([
      {
        timeOffset: 1,
        properties: { transform: 'scale(1.2)', opacity: 0.4 },
        easing: 'ease-out',
      },
      { offset: 0, transform: 'translateY(0px)', opacity: 1 },
    ]);

    expect(parsed).toEqual([
      { offset: 0, transform: 'translateY(0px)', opacity: 1 },
      { offset: 1, transform: 'scale(1.2)', opacity: 0.4, easing: 'ease-out' },
    ]);
  });

  it('keeps unknown easing linear instead of producing invalid values', () => {
    expect(applyTimelineEasing('not-real', 0.5)).toBe(0.5);
  });
});
