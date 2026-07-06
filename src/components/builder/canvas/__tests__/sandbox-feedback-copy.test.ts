import { describe, expect, it } from 'vitest';
import { getSandboxFeedbackOverlayCopy } from '../sandbox-feedback-copy';

describe('sandbox feedback overlay copy', () => {
  it('returns ko save status labels', () => {
    const copy = getSandboxFeedbackOverlayCopy('ko');
    expect(copy.saveStatusLabels.saving).toBe('저장 중...');
    expect(copy.saveStatusLabels.saved).toBe('저장됨');
    expect(copy.saveStatusLabels.error).toBe('저장 실패');
  });

  it('returns zh-hant save status labels without Hangul', () => {
    const copy = getSandboxFeedbackOverlayCopy('zh-hant');
    expect(copy.saveStatusLabels.saving).toBe('儲存中...');
    expect(copy.saveStatusLabels.saved).toBe('已儲存');
    expect(copy.saveStatusLabels.error).toBe('儲存失敗');
    expect(Object.values(copy.saveStatusLabels).join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en save status labels without CJK', () => {
    const copy = getSandboxFeedbackOverlayCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.saveStatusLabels.saving).toBe('Saving...');
    expect(copy.saveStatusLabels.saved).toBe('Saved');
    expect(copy.saveStatusLabels.error).toBe('Save failed');
    expect(Object.values(copy.saveStatusLabels).join(' ')).not.toMatch(cjk);
  });
});
