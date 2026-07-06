import { describe, expect, it } from 'vitest';
import { getAiTextAssistantCopy } from '../ai-text-assistant-copy';

describe('ai text assistant copy', () => {
  it('returns ko panel copy', () => {
    const copy = getAiTextAssistantCopy('ko');
    expect(copy.dialogLabel).toBe('AI 텍스트 어시스턴트');
    expect(copy.emptySourceError).toContain('빈 텍스트');
    expect(copy.actionLabels.rewrite).toBe('다시 쓰기');
    expect(copy.toneLabels.authoritative).toBe('전문가답게');
    expect(copy.customPromptPlaceholder).toContain('변호사 사무실 톤');
    expect(copy.characterCountLabel(12)).toBe('12자');
    expect(copy.describeAction({ action: 'translate', targetLocale: 'en' })).toBe('번역 -> English');
    expect(copy.describeAction({ action: 'tone', tone: 'warm' })).toBe('톤 -> 따뜻하게');
  });

  it('returns zh-hant panel copy without Hangul in visible chrome', () => {
    const copy = getAiTextAssistantCopy('zh-hant');
    expect(copy.dialogLabel).toBe('AI 文字助手');
    expect(copy.actionLabels.translate).toBe('翻譯');
    expect(copy.toneLabels.concise).toBe('精簡');
    expect(copy.characterCountLabel(8)).toBe('8 字');
    expect(copy.describeAction({ action: 'translate', targetLocale: 'en' })).toBe('翻譯 -> English');
    expect([
      copy.emptySourceError,
      copy.requestFailedError,
      copy.callFailedError,
      copy.callExceptionError,
      copy.dialogLabel,
      copy.title,
      copy.closeLabel,
      copy.actionGroupLabel,
      Object.values(copy.actionLabels).join(' '),
      copy.targetLocaleLabel,
      copy.toneLabel,
      copy.toneSelectLabel,
      Object.values(copy.toneLabels).join(' '),
      copy.customPromptLabel,
      copy.customPromptPlaceholder,
      copy.generatingLabel,
      copy.regenerateLabel,
      copy.generateLabel,
      copy.previousResultLabel,
      copy.nextResultLabel,
      copy.noResultsLabel,
      copy.showResultLabel,
      copy.showOriginalLabel,
      copy.originalLabel,
      copy.resetLabel,
      copy.applyLabel,
      copy.characterCountLabel(9),
      copy.describeAction({ action: 'tone', tone: 'formal' }),
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en panel copy without CJK', () => {
    const copy = getAiTextAssistantCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.dialogLabel).toBe('AI text assistant');
    expect(copy.actionLabels.rewrite).toBe('Rewrite');
    expect(copy.toneLabels.authoritative).toBe('Authoritative');
    expect(copy.customPromptPlaceholder).toContain('legal office tone');
    expect(copy.characterCountLabel(10)).toBe('10 chars');
    expect(copy.describeAction({ action: 'translate', targetLocale: 'zh-hant' })).toBe('Translate -> Traditional Chinese');
    expect([
      copy.emptySourceError,
      copy.requestFailedError,
      copy.callFailedError,
      copy.callExceptionError,
      copy.dialogLabel,
      copy.title,
      copy.closeLabel,
      copy.actionGroupLabel,
      Object.values(copy.actionLabels).join(' '),
      copy.targetLocaleLabel,
      Object.values(copy.localeLabels).join(' '),
      copy.toneLabel,
      copy.toneSelectLabel,
      Object.values(copy.toneLabels).join(' '),
      copy.customPromptLabel,
      copy.customPromptPlaceholder,
      copy.generatingLabel,
      copy.regenerateLabel,
      copy.generateLabel,
      copy.previousResultLabel,
      copy.nextResultLabel,
      copy.noResultsLabel,
      copy.showResultLabel,
      copy.showOriginalLabel,
      copy.originalLabel,
      copy.resetLabel,
      copy.applyLabel,
      copy.characterCountLabel(11),
      copy.describeAction({ action: 'tone', tone: 'formal' }),
    ].join(' ')).not.toMatch(cjk);
  });
});
