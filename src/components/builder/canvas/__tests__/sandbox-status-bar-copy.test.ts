import { describe, expect, it } from 'vitest';
import { getSandboxStatusBarCopy } from '../sandbox-status-bar-copy';

describe('sandbox status bar copy', () => {
  it('returns ko status bar copy', () => {
    const copy = getSandboxStatusBarCopy('ko');
    expect(copy.footerAriaLabel).toBe('편집기 상태');
    expect(copy.viewportLabel).toBe('뷰포트');
    expect(copy.selectionCountLabel(2)).toBe('2개 선택됨');
    expect(copy.saveStateLabels.saving).toBe('저장 중...');
    expect(copy.densityLabels.compact).toBe('좁게');
    expect(copy.themeModeLabels.dark).toBe('다크');
    expect(copy.shortcutsLabel).toBe('단축키: ?');
  });

  it('returns zh-hant status bar copy without Hangul', () => {
    const copy = getSandboxStatusBarCopy('zh-hant');
    expect(copy.footerAriaLabel).toBe('編輯器狀態');
    expect(copy.selectionCountLabel(3)).toBe('已選取 3 個');
    expect(copy.saveStateLabels.error).toBe('儲存失敗');
    expect(copy.densityLabels.comfortable).toBe('寬鬆');
    expect([
      copy.footerAriaLabel,
      copy.viewportLabel,
      copy.selectionCountLabel(1),
      Object.values(copy.saveStateLabels).join(' '),
      copy.densityAriaLabel,
      Object.values(copy.densityLabels).join(' '),
      Object.values(copy.themeModeLabels).join(' '),
      copy.shortcutsLabel,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en status bar copy without CJK', () => {
    const copy = getSandboxStatusBarCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.footerAriaLabel).toBe('Editor status');
    expect(copy.selectionCountLabel(4)).toBe('4 selected');
    expect(copy.saveStateLabels.error).toBe('Save failed');
    expect(copy.densityLabels.comfortable).toBe('Comfortable');
    expect([
      copy.footerAriaLabel,
      copy.viewportLabel,
      copy.selectionCountLabel(1),
      Object.values(copy.saveStateLabels).join(' '),
      copy.densityAriaLabel,
      Object.values(copy.densityLabels).join(' '),
      Object.values(copy.themeModeLabels).join(' '),
      copy.shortcutsLabel,
    ].join(' ')).not.toMatch(cjk);
  });
});
