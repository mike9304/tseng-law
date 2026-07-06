import { describe, expect, test } from 'vitest';
import { getUndoStackTimelineCopy } from '../undo-stack-timeline-copy';

describe('undo stack timeline copy', () => {
  test('returns localized Korean undo timeline labels', () => {
    const copy = getUndoStackTimelineCopy('ko');

    expect(copy.sectionLabel).toBe('작업 기록');
    expect(copy.snapshotCountLabel(3)).toBe('3개 스냅샷');
    expect(copy.initialSnapshot).toBe('초기 캔버스 스냅샷');
    expect(copy.addedLabel(2)).toBe('2개 추가');
    expect(copy.nodeCountLabel(391, 9)).toBe('노드 391개 · 루트 9개');
    expect(copy.currentBadge).toBe('현재 위치');
    expect(copy.nameInputLabel).toBe('현재 스냅샷 이름');
    expect(copy.saveNameTitle).toBe('현재 스냅샷 이름 저장');
  });

  test('returns localized Traditional Chinese undo timeline labels', () => {
    const copy = getUndoStackTimelineCopy('zh-hant');

    expect(copy.sectionLabel).toBe('操作記錄');
    expect(copy.undo).toBe('復原');
    expect(copy.redo).toBe('重做');
    expect(copy.editedLabel(4)).toBe('內容編輯 4 個');
    expect(copy.savedBadge).toBe('已記錄');
    expect(copy.clearNameTitle).toBe('清除目前快照名稱');
  });

  test('falls back to English undo timeline labels', () => {
    const copy = getUndoStackTimelineCopy('fr');

    expect(copy.sectionLabel).toBe('Action history');
    expect(copy.undoTitle).toBe('Undo last edit');
    expect(copy.snapshotLabel(2)).toBe('Snapshot 2');
    expect(copy.nameInputPlaceholder).toBe('Example: Hero aligned');
  });
});
