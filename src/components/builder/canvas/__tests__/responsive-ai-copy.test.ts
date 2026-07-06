import { describe, expect, it } from 'vitest';
import { getResponsiveAiCopy } from '../responsive-ai-copy';

describe('responsive ai copy', () => {
  it('returns ko responsive assistant copy', () => {
    const copy = getResponsiveAiCopy('ko');
    expect(copy.dialogLabel).toBe('반응형 AI 어시스턴트');
    expect(copy.title('mobile')).toBe('반응형 AI (모바일)');
    expect(copy.reasonLabels['font-too-large']).toBe('큰 글꼴 축소');
    expect(copy.reasonLabels['node-overflows-viewport']).toBe('화면 밖 요소 위치 보정');
    expect(copy.intro('tablet')).toContain('720px');
    expect(copy.applyAllLabel(2)).toBe('전체 적용 (2)');
    expect(copy.previewAllLabel(2)).toBe('전체 미리보기 (2)');
    expect(copy.previewLabel).toBe('미리보기');
    expect(copy.cancelPreviewLabel).toBe('미리보기 취소');
    expect(copy.undoLastLabel).toBe('마지막 적용 취소');
    expect(copy.appliedCountLabel(3)).toBe('3개 적용됨');
    expect(copy.stateLabels.discarded).toBe('제외됨');
  });

  it('returns zh-hant responsive assistant copy without Hangul', () => {
    const copy = getResponsiveAiCopy('zh-hant');
    expect(copy.dialogLabel).toBe('反應式 AI 助手');
    expect(copy.title('tablet')).toContain('平板');
    expect(copy.reasonLabels['node-overflows-viewport']).toContain('版面');
    expect(copy.reasonLabels['side-by-side-stack']).toContain('垂直排列');
    expect(copy.applyAllLabel(2)).toBe('全部套用（2）');
    expect([
      copy.requestFailedError,
      copy.callFailedError,
      copy.dialogLabel,
      copy.title('mobile'),
      copy.closeLabel,
      Object.values(copy.viewportLabels).join(' '),
      Object.values(copy.reasonLabels).join(' '),
      copy.intro('mobile'),
      copy.analyzingLabel,
      copy.reanalyzeLabel,
      copy.analyzeLabel,
      copy.applyAllLabel(4),
      copy.previewAllLabel(4),
      copy.previewLabel,
      copy.cancelPreviewLabel,
      copy.undoLastLabel,
      copy.undoLastDisabledLabel,
      copy.appliedCountLabel(5),
      copy.emptySuggestionsLabel,
      copy.nodePrefix,
      copy.applyLabel,
      copy.discardLabel,
      Object.values(copy.stateLabels).join(' '),
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en responsive assistant copy without CJK', () => {
    const copy = getResponsiveAiCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.dialogLabel).toBe('Responsive AI assistant');
    expect(copy.title('mobile')).toBe('Responsive AI (mobile)');
    expect(copy.reasonLabels['text-overflows-viewport']).toBe('Shrink overflowing text');
    expect(copy.reasonLabels['node-overflows-viewport']).toBe('Move element inside viewport');
    expect(copy.applyAllLabel(2)).toBe('Apply all (2)');
    expect(copy.previewAllLabel(2)).toBe('Preview all (2)');
    expect(copy.previewLabel).toBe('Preview');
    expect([
      copy.requestFailedError,
      copy.callFailedError,
      copy.dialogLabel,
      copy.title('tablet'),
      copy.closeLabel,
      Object.values(copy.viewportLabels).join(' '),
      Object.values(copy.reasonLabels).join(' '),
      copy.intro('tablet'),
      copy.analyzingLabel,
      copy.reanalyzeLabel,
      copy.analyzeLabel,
      copy.applyAllLabel(4),
      copy.previewAllLabel(4),
      copy.previewLabel,
      copy.cancelPreviewLabel,
      copy.undoLastLabel,
      copy.undoLastDisabledLabel,
      copy.appliedCountLabel(5),
      copy.emptySuggestionsLabel,
      copy.nodePrefix,
      copy.applyLabel,
      copy.discardLabel,
      Object.values(copy.stateLabels).join(' '),
    ].join(' ')).not.toMatch(cjk);
  });
});
