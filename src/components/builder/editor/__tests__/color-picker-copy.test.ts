import { describe, expect, it } from 'vitest';
import { getColorPickerCopy } from '../color-picker-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return [value('#ffffff'), value('Primary')];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('color picker copy', () => {
  it('returns ko color picker copy', () => {
    const copy = getColorPickerCopy('ko');

    expect(copy.dialogAriaLabel).toBe('고급 색상 선택기');
    expect(copy.themePaletteLabel).toBe('테마 팔레트');
    expect(copy.nativeColorAriaLabel).toBe('기본 색상 값');
    expect(copy.eyeDropperLabel).toBe('스포이드');
    expect(copy.contrastAgainstTitle('#ffffff')).toBe('배경 #ffffff 대비');
    expect(copy.wcagLevelLabels.fail).toBe('불합격');
    expect(copy.themeColorLabels.primary).toBe('기본');
    expect(copy.colorBindingBadge.linked.title('기본')).toBe('기본 테마 색상 토큰을 사용합니다.');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getColorPickerCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.dialogAriaLabel).toBe('進階顏色選擇器');
    expect(copy.recentLabel).toBe('最近使用');
    expect(copy.colorBindingBadge.detached.label).toBe('已分離');
    expect(copy.themeColorLabels.muted).toBe('淡色');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en copy without CJK', () => {
    const copy = getColorPickerCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.title).toBe('Color');
    expect(copy.eyeDropperUnavailableTitle).toBe('EyeDropper is unavailable in this browser');
    expect(copy.contrastUnavailableLabel).toBe('Contrast n/a');
    expect(copy.colorBindingBadge.detached.title()).toBe('Uses a fixed color value instead of a theme token.');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});
