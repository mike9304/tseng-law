import { describe, expect, it } from 'vitest';
import type { AnimationsTabCopy } from '../animations-tab-copy';
import { getAnimationsTabCopy } from '../animations-tab-copy';

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap((entry) => collectStrings(entry));
}

describe('animations tab copy', () => {
  it('returns ko chrome and option labels', () => {
    const copy = getAnimationsTabCopy('ko');

    expect(copy.sections.entrance).toBe('등장');
    expect(copy.previewButtonLabel).toBe('미리보기 재생');
    expect(copy.aria.scrollEffect).toBe('스크롤 효과');
    expect(copy.labels.entrance['fade-in']).toBe('페이드 인');
    expect(copy.labels.exit.collapse).toBe('접히며 퇴장');
    expect(copy.labels.scroll['scrub-opacity']).toBe('스크럽 투명도');
    expect(copy.labels.hover.lift).toBe('들어 올리기');
    expect(copy.labels.click.shake).toBe('흔들기');
    expect(copy.labels.easing.elastic).toBe('탄성');
    expect(copy.lottie.widgetName).toBe('Media -> Lottie');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getAnimationsTabCopy('zh-hant');
    const hangul = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/;

    expect(copy.sections.motionTimeline).toBe('動態時間軸');
    expect(copy.labels.entrance['expand-from-right']).toBe('由右展開');
    expect(copy.labels.loop.breath).toBe('呼吸');
    expect(copy.labels.scroll.pin).toBe('釘選');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(hangul));
  });

  it('returns en copy without CJK', () => {
    const copy: AnimationsTabCopy = getAnimationsTabCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.sections.entrance).toBe('Entrance');
    expect(copy.labels.entrance['fade-in']).toBe('Fade in');
    expect(copy.labels.scroll['background-parallax']).toBe('Background parallax');
    expect(copy.hints.exit).toBe('Exit runs when the element leaves the viewport on the published page.');
    expect(collectStrings(copy)).not.toContainEqual(expect.stringMatching(cjk));
  });
});
