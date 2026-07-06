import { describe, expect, it } from 'vitest';
import { getCanvasZoomDockCopy } from '../canvas-zoom-dock-copy';

describe('canvas zoom dock copy', () => {
  it('returns ko zoom dock copy', () => {
    const copy = getCanvasZoomDockCopy('ko');
    expect(copy.zoomOutTitle).toBe('축소');
    expect(copy.zoomInTitle).toBe('확대');
    expect(copy.zoomAriaLabel).toBe('캔버스 확대/축소');
    expect(copy.fitTitle).toBe('화면에 맞추기');
    expect(copy.fitButtonLabel).toBe('맞춤');
  });

  it('returns zh-hant zoom dock copy without Hangul', () => {
    const copy = getCanvasZoomDockCopy('zh-hant');
    expect(copy.zoomOutTitle).toBe('縮小');
    expect(copy.zoomInTitle).toBe('放大');
    expect(copy.zoomAriaLabel).toBe('畫布縮放');
    expect(copy.fitButtonLabel).toBe('符合');
    expect(Object.values(copy).join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en zoom dock copy without CJK', () => {
    const copy = getCanvasZoomDockCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.zoomOutTitle).toBe('Zoom out');
    expect(copy.zoomInTitle).toBe('Zoom in');
    expect(copy.zoomAriaLabel).toBe('Canvas zoom');
    expect(copy.fitButtonLabel).toBe('Fit');
    expect(Object.values(copy).join(' ')).not.toMatch(cjk);
  });
});
