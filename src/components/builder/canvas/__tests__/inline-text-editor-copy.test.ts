import { describe, expect, it } from 'vitest';
import { getInlineTextEditorCopy } from '../inline-text-editor-copy';

describe('inline text editor copy', () => {
  it('returns ko inline text editor toolbar copy', () => {
    const copy = getInlineTextEditorCopy('ko');

    expect(copy.placeholder).toBe('텍스트 입력...');
    expect(copy.toolbarAriaLabel).toBe('인라인 텍스트 서식 도구');
    expect(copy.boldTitle).toBe('굵게 (Cmd+B)');
    expect(copy.linkButtonText).toBe('링크');
    expect(copy.aiAssistantAriaLabel).toBe('AI 텍스트 어시스턴트');
    expect(copy.commitButtonText).toBe('완료');
    expect(copy.cancelButtonText).toBe('취소');
  });

  it('returns zh-hant inline text editor toolbar copy without Hangul', () => {
    const copy = getInlineTextEditorCopy('zh-hant');
    const text = Object.values(copy).join(' ');

    expect(copy.placeholder).toBe('輸入文字...');
    expect(copy.linkPopoverAriaLabel).toBe('編輯文字連結');
    expect(copy.aiAssistantTitle).toBe('用 AI 改寫、摘要、翻譯或調整語氣');
    expect(copy.commitButtonText).toBe('完成');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en inline text editor toolbar copy without CJK', () => {
    const copy = getInlineTextEditorCopy('en');
    const text = Object.values(copy).join(' ');

    expect(copy.placeholder).toBe('Enter text...');
    expect(copy.toolbarAriaLabel).toBe('Inline text formatting toolbar');
    expect(copy.aiAssistantTitle).toBe('Rewrite, summarize, translate, or adjust tone with AI');
    expect(copy.commitButtonText).toBe('Done');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
