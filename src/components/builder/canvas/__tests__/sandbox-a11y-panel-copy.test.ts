import { describe, expect, it } from 'vitest';
import { getSandboxA11yPanelCopy } from '../sandbox-a11y-panel-copy';

describe('sandbox a11y panel copy', () => {
  it('returns ko a11y panel copy', () => {
    const copy = getSandboxA11yPanelCopy('ko');

    expect(copy.passMessage).toBe('접근성 검사 통과!');
    expect(copy.pageKindLabel).toBe('페이지');
    expect(copy.summaryLabel({ total: 4, error: 1, warning: 2, info: 1 })).toBe(
      '이슈 4개 (오류 1, 경고 2, 정보 1)',
    );
  });

  it('returns zh-hant a11y panel copy without Hangul', () => {
    const copy = getSandboxA11yPanelCopy('zh-hant');

    expect(copy.passMessage).toBe('已通過無障礙檢查！');
    expect([
      copy.passMessage,
      copy.pageKindLabel,
      copy.summaryLabel({ total: 4, error: 1, warning: 2, info: 1 }),
      copy.summaryLabel({ total: 1, error: 0, warning: 1, info: 0 }),
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en a11y panel copy without CJK', () => {
    const copy = getSandboxA11yPanelCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.passMessage).toBe('Accessibility check passed.');
    expect(copy.summaryLabel({ total: 1, error: 1, warning: 0, info: 0 })).toBe('1 issue (1 error)');
    expect(copy.summaryLabel({ total: 3, error: 0, warning: 2, info: 1 })).toBe('3 issues (2 warnings, 1 info)');
    expect([
      copy.passMessage,
      copy.pageKindLabel,
      copy.summaryLabel({ total: 4, error: 1, warning: 2, info: 1 }),
    ].join(' ')).not.toMatch(cjk);
  });
});
