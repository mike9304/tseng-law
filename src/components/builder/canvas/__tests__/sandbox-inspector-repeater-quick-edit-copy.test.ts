import { describe, expect, it } from 'vitest';
import { getSandboxInspectorRepeaterQuickEditCopy } from '../sandbox-inspector-repeater-quick-edit-copy';

describe('sandbox inspector repeater quick edit copy', () => {
  it('returns ko repeater quick edit copy', () => {
    const copy = getSandboxInspectorRepeaterQuickEditCopy('ko');

    expect(copy.sectionLabel).toBe('리피터');
    expect(copy.serviceTitle(2)).toBe('서비스 항목 2');
    expect(copy.serviceNotice).toContain('제목과 본문');
    expect(copy.serviceDetailLinkLabel).toBe('상세 링크');
    expect(copy.faqTitle(3)).toBe('FAQ 항목 3');
    expect(copy.faqQuestionLabel).toBe('질문');
    expect(copy.faqAnswerLabel).toBe('답변');
  });

  it('returns zh-hant repeater quick edit copy without Hangul', () => {
    const copy = getSandboxInspectorRepeaterQuickEditCopy('zh-hant');

    expect(copy.sectionLabel).toBe('重複器');
    expect(copy.serviceTitle(1)).toBe('服務項目 1');
    expect([
      copy.sectionLabel,
      copy.serviceTitle(2),
      copy.serviceNotice,
      copy.serviceTitleLabel,
      copy.serviceDescriptionLabel,
      copy.serviceDetailLinkLabel,
      copy.faqTitle(3),
      copy.faqNotice,
      copy.faqQuestionLabel,
      copy.faqAnswerLabel,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en repeater quick edit copy without CJK', () => {
    const copy = getSandboxInspectorRepeaterQuickEditCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.sectionLabel).toBe('Repeater');
    expect(copy.serviceTitle(1)).toBe('Service item 1');
    expect(copy.faqTitle(2)).toBe('FAQ item 2');
    expect([
      copy.sectionLabel,
      copy.serviceTitle(2),
      copy.serviceNotice,
      copy.serviceTitleLabel,
      copy.serviceDescriptionLabel,
      copy.serviceDetailLinkLabel,
      copy.faqTitle(3),
      copy.faqNotice,
      copy.faqQuestionLabel,
      copy.faqAnswerLabel,
    ].join(' ')).not.toMatch(cjk);
  });
});
