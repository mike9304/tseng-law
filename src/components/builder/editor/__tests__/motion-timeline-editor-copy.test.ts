import { describe, expect, it } from 'vitest';
import { getMotionTimelineEditorCopy } from '../motion-timeline-editor-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') {
    return [value(2, '0.25'), value(2)];
  }
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('motion timeline editor copy', () => {
  it('returns ko timeline editor copy', () => {
    const copy = getMotionTimelineEditorCopy('ko');

    expect(copy.scrollBoundLabel).toBe('스크롤 연동');
    expect(copy.durationLabel).toBe('재생 시간');
    expect(copy.removeTimelineLabel).toBe('타임라인 제거');
    expect(copy.trackAddTitle).toBe('클릭해서 키프레임 추가');
    expect(copy.markerTitle(2, '0.25')).toBe('#2 · 오프셋 0.25');
    expect(copy.markerAriaLabel(2)).toBe('키프레임 2 위치');
    expect(copy.easingAriaLabel(2)).toBe('키프레임 2 이징');
    expect(copy.opacityAriaLabel(2)).toBe('키프레임 2 투명도');
    expect(copy.removeKeyframeAriaLabel(2)).toBe('키프레임 2 제거');
  });

  it('returns zh-hant timeline editor copy without Hangul', () => {
    const copy = getMotionTimelineEditorCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.scrollBoundLabel).toBe('連動捲動');
    expect(copy.emptyTrackLabel).toBe('點擊軌道以新增關鍵影格');
    expect(copy.markerTitle(2, '0.25')).toBe('#2 · 位移 0.25');
    expect(copy.easingAriaLabel(2)).toBe('關鍵影格 2 緩動');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en timeline editor copy without CJK', () => {
    const copy = getMotionTimelineEditorCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.scrollBoundLabel).toBe('Scroll-bound');
    expect(copy.transformPlaceholder).toBe('transform e.g. translateY(-20px) scale(1.05)');
    expect(copy.offsetAriaLabel(2)).toBe('Offset keyframe 2');
    expect(copy.removeKeyframeAriaLabel(2)).toBe('Remove keyframe 2');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});
