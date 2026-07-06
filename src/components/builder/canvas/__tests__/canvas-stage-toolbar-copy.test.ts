import { describe, expect, it } from 'vitest';
import { getCanvasStageToolbarCopy } from '../canvas-stage-toolbar-copy';

describe('canvas stage toolbar copy', () => {
  it('returns ko toolbar copy', () => {
    const copy = getCanvasStageToolbarCopy('ko');
    expect(copy.gridSnapTitle).toBe('그리드 스냅');
    expect(copy.gridButtonLabel).toBe('그리드');
    expect(copy.gridSizeTitle).toBe('그리드 크기');
    expect(copy.gridSizeAriaLabel).toBe('그리드 크기');
    expect(copy.undoTitle).toBe('실행 취소');
    expect(copy.redoButtonLabel).toBe('다시 실행');
  });

  it('returns zh-hant toolbar copy without Hangul', () => {
    const copy = getCanvasStageToolbarCopy('zh-hant');
    expect(copy.gridSnapTitle).toBe('格線吸附');
    expect(copy.gridButtonLabel).toBe('格線');
    expect(copy.gridSizeAriaLabel).toBe('格線大小');
    expect(copy.undoTitle).toBe('復原');
    expect(copy.redoButtonLabel).toBe('重做');
    expect(Object.values(copy).join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en toolbar copy without CJK', () => {
    const copy = getCanvasStageToolbarCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.gridSnapTitle).toBe('Snap to grid');
    expect(copy.gridButtonLabel).toBe('Grid');
    expect(copy.gridSizeAriaLabel).toBe('Grid size');
    expect(copy.undoTitle).toBe('Undo');
    expect(copy.redoButtonLabel).toBe('Redo');
    expect(Object.values(copy).join(' ')).not.toMatch(cjk);
  });
});
