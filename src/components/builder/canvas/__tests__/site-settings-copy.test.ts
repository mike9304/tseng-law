import { describe, expect, it } from 'vitest';
import { getSiteSettingsCopy } from '../site-settings-copy';

describe('getSiteSettingsCopy', () => {
  it('localizes modal chrome and tab labels for ko', () => {
    const copy = getSiteSettingsCopy('ko');
    expect(copy.modal.title).toBe('사이트 설정');
    expect(copy.modal.tabs.mobile).toBe('모바일');
    expect(copy.general.heading).toBe('기본 정보');
    expect(copy.mobile.headerHeading).toBe('모바일 헤더');
    expect(copy.dark.previewHeader('light')).toContain('라이트');
    expect(copy.advanced.themeColorLabels.primary).toBe('기본');
    expect(copy.advanced.pageTransitionOptions.fade).toBe('페이드');
    expect(copy.modal.invalidDarkColor(copy.advanced.themeColorLabels.primary)).toContain('다크 기본');
    expect(copy.modal.presetApplied('Soft')).toBe('Soft 프리셋을 적용했습니다. 저장을 눌러 사이트에 반영하세요.');
    expect(copy.modal.componentPresetNoTargets('Soft')).toBe('Soft 프리셋에 변경할 button/card/form 요소가 현재 페이지에 없습니다.');
    expect(copy.modal.componentPresetApplied('Soft', 3, 1, 1, 1, 0)).toBe(
      'Soft 프리셋을 3개 컴포넌트에 적용했습니다. 버튼 1개, 카드 1개, 필드 1개, 제출 버튼 0개가 변경됐습니다.',
    );
    expect(copy.modal.themeDeleted).toBe('내 테마 프리셋을 삭제했습니다.');
    expect(copy.modal.myThemeName('')).toBe('My Theme');
  });

  it('localizes modal chrome and tab labels for zh-hant', () => {
    const copy = getSiteSettingsCopy('zh-hant');
    expect(copy.modal.title).toBe('網站設定');
    expect(copy.modal.tabs.advanced).toBe('進階');
    expect(copy.general.heading).toBe('基本資訊');
    expect(copy.mobile.bottomHeading).toBe('行動版底部 CTA');
    expect(copy.dark.previewHeader('dark')).toContain('深色');
    expect(copy.advanced.themeColorLabels.background).toBe('背景');
    expect(copy.advanced.pageTransitionOptions['slide-left']).toBe('向左滑入');
    expect(copy.modal.invalidDarkColor(copy.advanced.themeColorLabels.background)).toContain('深色 背景');
    expect(copy.modal.componentPresetNoTargets('Soft')).toBe('Soft 預設沒有可變更的 button/card/form 元素。');
    expect(copy.modal.componentPresetApplied('Soft', 3, 1, 1, 1, 0)).toContain('3 個元件');
    expect(copy.modal.themeDeleted).toBe('我的主題預設已刪除。');
    expect(copy.modal.myThemeName('')).toBe('我的主題');
  });

  it('localizes preset feedback for en without CJK', () => {
    const copy = getSiteSettingsCopy('en');
    const text = [
      copy.modal.presetApplied('Soft'),
      copy.modal.componentPresetNoTargets('Soft'),
      copy.modal.componentPresetApplied('Soft', 3, 1, 1, 1, 0),
      copy.modal.radiusApplied('Soft'),
      copy.modal.shadowApplied('Soft'),
    ].join(' ');

    expect(copy.modal.componentPresetNoTargets('Soft')).toBe('Soft preset has no button, card, or form elements to update on this page.');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
