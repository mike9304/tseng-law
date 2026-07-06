import { describe, expect, it } from 'vitest';
import { getAiSectionGeneratorCopy } from '../ai-section-generator-copy';

describe('ai section generator copy', () => {
  it('returns ko copy for the panel chrome', () => {
    const copy = getAiSectionGeneratorCopy('ko');
    expect(copy.dialogLabel).toBe('AI 섹션 생성기');
    expect(copy.emptyPromptError).toBe('섹션 설명을 입력하세요.');
    expect(copy.autoKindLabel).toBe('자동 선택');
    expect(copy.promptPlaceholder).toContain('대만 진출 한국 기업');
    expect(copy.applyToCanvasLabel).toBe('캔버스에 삽입');
    expect(copy.nodeCountLabel(3)).toBe('3개 노드');
    expect(copy.fallbackNotice).toContain('OPENAI_API_KEY');
  });

  it('returns zh-hant copy without Hangul', () => {
    const copy = getAiSectionGeneratorCopy('zh-hant');
    expect(copy.dialogLabel).toBe('AI 區段產生器');
    expect(copy.emptyPromptError).toBe('請輸入區段描述。');
    expect(copy.autoKindLabel).toBe('自動選擇');
    expect(copy.kindLabels.cta).toBe('行動呼籲');
    expect(copy.nodeCountLabel(2)).toBe('2 個節點');
    expect([
      copy.dialogLabel,
      copy.emptyPromptError,
      copy.requestFailedError,
      copy.callFailedError,
      copy.title,
      copy.closeLabel,
      copy.sectionKindLabel,
      copy.autoKindLabel,
      copy.sectionDescriptionLabel,
      copy.promptPlaceholder,
      copy.generatingLabel,
      copy.regenerateLabel,
      copy.generateLabel,
      copy.applyToCanvasLabel,
      copy.nodeCountLabel(4),
      copy.fallbackNotice,
      Object.values(copy.kindLabels).join(' '),
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en copy without CJK', () => {
    const copy = getAiSectionGeneratorCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.dialogLabel).toBe('AI section generator');
    expect(copy.emptyPromptError).toBe('Enter a section description.');
    expect(copy.autoKindLabel).toBe('Auto select');
    expect(copy.kindLabels.features).toBe('Features grid');
    expect(copy.nodeCountLabel(5)).toBe('5 nodes');
    expect([
      copy.dialogLabel,
      copy.emptyPromptError,
      copy.requestFailedError,
      copy.callFailedError,
      copy.title,
      copy.closeLabel,
      copy.sectionKindLabel,
      copy.autoKindLabel,
      copy.sectionDescriptionLabel,
      copy.promptPlaceholder,
      copy.generatingLabel,
      copy.regenerateLabel,
      copy.generateLabel,
      copy.applyToCanvasLabel,
      copy.nodeCountLabel(6),
      copy.fallbackNotice,
      Object.values(copy.kindLabels).join(' '),
    ].join(' ')).not.toMatch(cjk);
  });
});
