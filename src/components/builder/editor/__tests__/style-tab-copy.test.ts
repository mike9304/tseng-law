import { describe, expect, it } from 'vitest';
import { getStyleTabCopy } from '../style-tab-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') {
    return [
      value('Test'),
      value('variant: Button'),
    ].filter(Boolean) as string[];
  }
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('style tab copy', () => {
  it('returns ko source and border copy', () => {
    const copy = getStyleTabCopy('ko');

    expect(copy.styleSourceTitle).toBe('스타일 소스');
    expect(copy.styleSourceRows.background).toBe('배경');
    expect(copy.originLabels.manual).toBe('직접 입력');
    expect(copy.originHint('variant: Button')).toBe('변형: Button');
    expect(copy.buttonVariantBadge.custom.label).toBe('변형 + 직접 수정');
    expect(copy.borderColorLabel).toBe('테두리 색상');
    expect(copy.borderStyleOptions.dashed).toBe('파선');
    expect(copy.sections.shadow).toBe('그림자');
    expect(copy.shadowXLabel).toBe('그림자 X');
    expect(copy.hoverStateLabel).toBe('호버 상태');
    expect(copy.hoverAdjustmentsLabel).toBe('호버 조정');
    expect(copy.hoverShadowColorLabel).toBe('호버 그림자 색상');
    expect(copy.numberValueAriaLabel('테두리 두께')).toBe('테두리 두께 값');
  });

  it('returns zh-hant source and border copy without Hangul', () => {
    const copy = getStyleTabCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.styleSourceTitle).toBe('樣式來源');
    expect(copy.originHint('사용자 직접 입력')).toBe('使用者手動輸入');
    expect(copy.buttonVariantBadge.linked.label).toBe('已連結變體');
    expect(copy.borderStyleOptions.solid).toBe('實線');
    expect(copy.styleSourceRows.hover).toBe('懸停');
    expect(copy.hoverBorderColorLabel).toBe('懸停邊框顏色');
    expect(copy.transitionMsLabel).toBe('轉場時間 (ms)');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en source and border copy without CJK', () => {
    const copy = getStyleTabCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.styleSourceLegend).toBe('Theme / Variant / Manual');
    expect(copy.originHint('기본값')).toBe('Default value');
    expect(copy.buttonVariantBadge.custom.label).toBe('Variant + custom override');
    expect(copy.borderStyleOptions.dashed).toBe('Dashed');
    expect(copy.shadowColorLabel).toBe('Shadow color');
    expect(copy.hoverAdjustmentsLabel).toBe('Hover adjustments');
    expect(copy.transitionMsLabel).toBe('Transition ms');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});
