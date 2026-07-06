import { describe, expect, it } from 'vitest';
import { getCanvasStageNodesCopy } from '../canvas-stage-nodes-copy';

describe('canvas stage nodes copy', () => {
  it('returns ko empty canvas copy', () => {
    const copy = getCanvasStageNodesCopy('ko');
    expect(copy.emptyCanvasTitle).toBe('페이지가 비어있습니다.');
    expect(copy.emptyCanvasBody).toBe('좌측 + 패널에서 텍스트, 이미지, 섹션을 추가하세요.');
  });

  it('returns zh-hant empty canvas copy without Hangul', () => {
    const copy = getCanvasStageNodesCopy('zh-hant');
    expect(copy.emptyCanvasTitle).toBe('頁面是空的。');
    expect(copy.emptyCanvasBody).toBe('從左側 + 面板新增文字、圖片或區段。');
    expect(Object.values(copy).join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en empty canvas copy without CJK', () => {
    const copy = getCanvasStageNodesCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.emptyCanvasTitle).toBe('This page is empty.');
    expect(copy.emptyCanvasBody).toBe('Add text, images, or sections from the + panel on the left.');
    expect(Object.values(copy).join(' ')).not.toMatch(cjk);
  });
});
