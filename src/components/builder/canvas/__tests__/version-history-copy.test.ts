import { describe, expect, test } from 'vitest';
import { getVersionHistoryCopy } from '../version-history-copy';

describe('version history copy', () => {
  test('returns localized zh-hant version history labels', () => {
    const copy = getVersionHistoryCopy('zh-hant');

    expect(copy.dialogAriaLabel).toBe('版本記錄');
    expect(copy.confirmQuestion).toBe('要還原到此版本嗎？');
    expect(copy.nodeCountLabel(3)).toBe('節點 3 個');
    expect(copy.draftMetaLabel(3)).toBe('節點 3 個 - 編輯中');
    expect(copy.changeSummaryLabel(copy.sourceLabels.manual)).toBe('變更摘要 - 手動儲存');
    expect(copy.sourceBadgeLabels.publish).toBe('已發佈');
    expect(copy.addedCount(2)).toBe('+ 新增 2');
    expect(copy.restoreThisVersion).toBe('還原到此版本');
  });

  test('returns localized ko source labels', () => {
    const copy = getVersionHistoryCopy('ko');

    expect(copy.currentDraft).toBe('현재 초안');
    expect(copy.sourceLabels.publish).toBe('발행 스냅샷');
    expect(copy.sourceLabels.manual).toBe('수동 저장');
    expect(copy.sourceBadgeLabels.manual).toBe('수동');
    expect(copy.hoverDiffPreview).toBe('마우스를 올리면 차이 미리보기');
  });

  test('falls back to English version history labels', () => {
    const copy = getVersionHistoryCopy('fr');

    expect(copy.title).toBe('Version history');
    expect(copy.restoreThisVersion).toBe('Restore this version');
    expect(copy.addedCount(2)).toBe('+ added 2');
    expect(copy.changeSummaryLabel(copy.sourceLabels.saved)).toBe('Change summary - saved revision');
  });
});
