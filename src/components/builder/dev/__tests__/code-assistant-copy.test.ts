import { describe, expect, it } from 'vitest';
import { getCodeAssistantCopy } from '@/components/builder/dev/code-assistant-copy';

describe('getCodeAssistantCopy', () => {
  it('localizes the assistant shell and action labels for ko', () => {
    const copy = getCodeAssistantCopy('ko');
    expect(copy.title).toBe('AI 코드 어시스턴트');
    expect(copy.actionLabels.fix).toBe('버그 수정');
    expect(copy.run).toBe('실행');
    expect(copy.diff).toBe('차이');
    expect(copy.diffSummaryNone).toBe('코드 변경 없음.');
    expect(copy.noDiffAvailable).toBe('사용할 diff가 없습니다.');
    expect(copy.selectedDiffLabel).toBe('적용할 변경 조각');
    expect(copy.hunkLabel(1, 1, 1, 1)).toBe('조각 1 · 줄 1 · +1 / -1');
    expect(copy.hunksSummary(1, 2)).toBe('1/2개의 변경 조각 선택됨');
  });

  it('localizes the assistant shell and action labels for zh-hant', () => {
    const copy = getCodeAssistantCopy('zh-hant');
    expect(copy.title).toBe('AI 程式助理');
    expect(copy.actionLabels.fix).toBe('修正錯誤');
    expect(copy.run).toBe('執行');
    expect(copy.diff).toBe('差異');
    expect(copy.diffSummaryNone).toBe('沒有程式碼變更。');
    expect(copy.noDiffAvailable).toBe('沒有可用的 diff。');
    expect(copy.selectedDiffLabel).toBe('要套用的變更區塊');
    expect(copy.hunkLabel(1, 1, 1, 1)).toBe('區塊 1 · 第 1 行 · +1 / -1');
    expect(copy.hunksSummary(1, 2)).toBe('已選取 1/2 個變更區塊');
  });

  it('localizes the function editor shell copy', () => {
    const ko = getCodeAssistantCopy('ko');
    expect(ko.testRun).toBe('테스트 실행');
    expect(ko.delete).toBe('삭제');
    expect(ko.codeBody).toBe('코드 본문');

    const zh = getCodeAssistantCopy('zh-hant');
    expect(zh.testRun).toBe('測試執行');
    expect(zh.delete).toBe('刪除');
    expect(zh.codeBody).toBe('程式碼內容');
  });
});
