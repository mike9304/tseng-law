import { describe, expect, it } from 'vitest';
import { getContentTabCopy } from '../content-tab-copy';

describe('content tab copy', () => {
  it('returns ko missing inspector copy', () => {
    const copy = getContentTabCopy('ko');

    expect(copy.missingInspectorMessage('customWidget')).toBe(
      'customWidget은 아직 콘텐츠 인스펙터가 연결되지 않았습니다.',
    );
  });

  it('returns zh-hant missing inspector copy without Hangul', () => {
    const copy = getContentTabCopy('zh-hant');

    expect(copy.missingInspectorMessage('customWidget')).toBe('customWidget 尚未連接內容檢查器。');
    expect(copy.missingInspectorMessage('customWidget')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en missing inspector copy without CJK', () => {
    const copy = getContentTabCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.missingInspectorMessage('customWidget')).toBe(
      'customWidget does not have a content inspector connected yet.',
    );
    expect(copy.missingInspectorMessage('customWidget')).not.toMatch(cjk);
  });
});
