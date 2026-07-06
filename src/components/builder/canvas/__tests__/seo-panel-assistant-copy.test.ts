import { describe, expect, it } from 'vitest';
import {
  getSeoPanelAssistantCopy,
  getSeoPanelAssistantFieldLabel,
  isSeoPanelAssistantFailure,
} from '../seo-panel-assistant-copy';

describe('seo panel assistant copy', () => {
  it('returns ko SEO assistant tab copy and labels', () => {
    const copy = getSeoPanelAssistantCopy('ko');

    expect(copy.title).toBe('SEO 도우미');
    expect(copy.empty).toBe('SEO 도우미 점검 항목이 없습니다.');
    expect(copy.taskSeverity.critical).toBe('긴급');
    expect(copy.taskStatus.todo).toBe('할 일');
    expect(copy.issueSeverity.blocker).toBe('차단');
    expect(getSeoPanelAssistantFieldLabel(copy, 'focusKeyword')).toBe('포커스 키워드');
    expect(isSeoPanelAssistantFailure('도우미 저장 실패', copy)).toBe(true);
  });

  it('returns zh-hant SEO assistant tab copy without Hangul', () => {
    const copy = getSeoPanelAssistantCopy('zh-hant');
    const text = [
      copy.title,
      copy.description,
      copy.save,
      copy.focusKeyword,
      copy.empty,
      copy.validationTitle,
      copy.validationPass,
      ...Object.values(copy.taskSeverity),
      ...Object.values(copy.taskStatus),
      ...Object.values(copy.issueSeverity),
      ...Object.values(copy.fieldLabels),
    ].join(' ');

    expect(copy.title).toBe('SEO 助理');
    expect(copy.taskStatus.done).toBe('完成');
    expect(getSeoPanelAssistantFieldLabel(copy, 'structuredData')).toBe('結構化資料');
    expect(isSeoPanelAssistantFailure('助理儲存失敗', copy)).toBe(true);
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en SEO assistant tab copy without CJK', () => {
    const copy = getSeoPanelAssistantCopy('en');
    const text = [
      copy.title,
      copy.description,
      copy.save,
      copy.focusKeyword,
      copy.empty,
      copy.validationTitle,
      copy.validationPass,
      ...Object.values(copy.taskSeverity),
      ...Object.values(copy.taskStatus),
      ...Object.values(copy.issueSeverity),
      ...Object.values(copy.fieldLabels),
    ].join(' ');

    expect(copy.title).toBe('SEO Assistant');
    expect(copy.issueSeverity.warning).toBe('Warning');
    expect(getSeoPanelAssistantFieldLabel(copy, 'unknown-field')).toBe('unknown-field');
    expect(isSeoPanelAssistantFailure('Assistant save failed', copy)).toBe(true);
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
