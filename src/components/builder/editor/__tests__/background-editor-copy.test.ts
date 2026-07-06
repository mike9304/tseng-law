import { describe, expect, it } from 'vitest';
import { getBackgroundEditorCopy } from '../background-editor-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return [value(2)];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('background editor copy', () => {
  it('returns ko background editor copy', () => {
    const copy = getBackgroundEditorCopy('ko');

    expect(copy.modeLabels.solid).toBe('단색');
    expect(copy.fillColorLabel).toBe('채우기 색상');
    expect(copy.gradientTypeOptions.radial).toBe('방사형');
    expect(copy.stopLabel(2)).toBe('스톱 2');
    expect(copy.removeStopAriaLabel(2)).toBe('스톱 2 제거');
    expect(copy.chooseAssetsLabel).toBe('에셋에서 선택');
    expect(copy.imageRepeatOptions['repeat-y']).toBe('세로 반복');
    expect(copy.overlayOpacityAriaLabel).toBe('오버레이 투명도');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getBackgroundEditorCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.modeLabels.gradient).toBe('漸層');
    expect(copy.stopPositionAriaLabel(2)).toBe('色標 2 位置');
    expect(copy.imagePositionOptions['bottom-right']).toBe('右下');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en copy without CJK', () => {
    const copy = getBackgroundEditorCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.modeLabels.image).toBe('Image');
    expect(copy.assetLoadError).toBe('Failed to load assets.');
    expect(copy.imageSizeOptions.contain).toBe('Contain');
    expect(copy.overlayLabel).toBe('Overlay');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});
