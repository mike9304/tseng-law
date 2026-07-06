import { describe, expect, it } from 'vitest';
import { getSandboxInspectorLayoutTabCopy } from '../sandbox-inspector-layout-tab-copy';

describe('sandbox inspector layout tab copy', () => {
  it('returns ko viewport and device visibility copy', () => {
    const copy = getSandboxInspectorLayoutTabCopy('ko');

    expect(copy.viewportLabel).toBe('뷰포트');
    expect(copy.deviceLabels.tablet).toBe('태블릿');
    expect(copy.deviceLabels.desktop).toBe('데스크톱');
    expect(copy.viewportDesktopHelper).toBe('데스크톱이 기준 레이아웃입니다.');
    expect(copy.viewportInheritedHelper).toContain('상속');
    expect(copy.resetViewportLabel('태블릿')).toBe('태블릿 초기화');
    expect(copy.hiddenOverrideExists('모바일')).toBe('모바일에 숨김 오버라이드가 있습니다.');
    expect(copy.deviceVisibility.label).toBe('표시 기기');
    expect(copy.deviceVisibility.ariaLabel('모바일', false)).toBe('모바일에서 숨김 (클릭하여 토글)');
    expect(copy.deviceVisibility.title('데스크톱', true, true)).toContain('현재 편집 중');
    expect(copy.fieldValueAriaLabel('너비')).toBe('너비 값');
    expect(copy.flowLayoutNotice).toContain('Flow 레이아웃');
    expect(copy.stateSectionLabel).toBe('상태');
    expect(copy.stickyOffsetLabel).toBe('고정 오프셋');
    expect(copy.anchorHelp).toContain('#name');
  });

  it('returns zh-hant viewport and device visibility copy without Hangul', () => {
    const copy = getSandboxInspectorLayoutTabCopy('zh-hant');

    expect(copy.viewportLabel).toBe('視窗');
    expect(copy.deviceLabels.desktop).toBe('桌面');
    expect([
      copy.viewportLabel,
      copy.viewportGroupAriaLabel,
      copy.viewportDesktopHelper,
      copy.viewportOverrideCreatedHelper,
      copy.viewportInheritedHelper,
      copy.overrideBadgeLabel,
      copy.overrideCreatedLabel,
      copy.overrideEditingLabel,
      copy.overrideInheritedNote,
      copy.resetViewportTitle('平板'),
      copy.resetViewportLabel('平板'),
      copy.hiddenOverrideExists('手機'),
      copy.hiddenAtViewportWarning('手機'),
      copy.fieldTitle('寬度', '手機'),
      copy.fieldValueAriaLabel('寬度'),
      copy.xLabel,
      copy.yLabel,
      copy.widthLabel,
      copy.heightLabel,
      copy.fontSizeLabel,
      copy.flowLayoutNotice,
      copy.rotationLabel,
      copy.stateSectionLabel,
      copy.stateSectionTitle,
      copy.lockLabel,
      copy.visibleLabel,
      copy.pinLabel,
      copy.stickyOffsetLabel,
      copy.pinFromLabel,
      copy.pinFromAriaLabel,
      copy.pinTopLabel,
      copy.pinBottomLabel,
      copy.anchorNameLabel,
      copy.anchorPlaceholder,
      copy.anchorLinkPrefix,
      copy.anchorHelp,
      Object.values(copy.deviceLabels).join(' '),
      copy.deviceVisibility.label,
      copy.deviceVisibility.visibleLabel,
      copy.deviceVisibility.hiddenLabel,
      copy.deviceVisibility.toggleActionLabel,
      copy.deviceVisibility.currentEditingLabel,
      copy.deviceVisibility.ariaLabel('手機', false),
      copy.deviceVisibility.title('桌面', true, true),
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en viewport and device visibility copy without CJK', () => {
    const copy = getSandboxInspectorLayoutTabCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.viewportLabel).toBe('Viewport');
    expect(copy.deviceLabels.mobile).toBe('Mobile');
    expect(copy.deviceVisibility.ariaLabel('Tablet', true)).toBe('Tablet is visible (click to toggle)');
    expect([
      copy.viewportLabel,
      copy.viewportGroupAriaLabel,
      copy.viewportDesktopHelper,
      copy.viewportOverrideCreatedHelper,
      copy.viewportInheritedHelper,
      copy.overrideBadgeLabel,
      copy.overrideCreatedLabel,
      copy.overrideEditingLabel,
      copy.overrideInheritedNote,
      copy.resetViewportTitle('Tablet'),
      copy.resetViewportLabel('Tablet'),
      copy.hiddenOverrideExists('Mobile'),
      copy.hiddenAtViewportWarning('Mobile'),
      copy.fieldTitle('Width', 'Mobile'),
      copy.fieldValueAriaLabel('Width'),
      copy.xLabel,
      copy.yLabel,
      copy.widthLabel,
      copy.heightLabel,
      copy.fontSizeLabel,
      copy.flowLayoutNotice,
      copy.rotationLabel,
      copy.stateSectionLabel,
      copy.stateSectionTitle,
      copy.lockLabel,
      copy.visibleLabel,
      copy.pinLabel,
      copy.stickyOffsetLabel,
      copy.pinFromLabel,
      copy.pinFromAriaLabel,
      copy.pinTopLabel,
      copy.pinBottomLabel,
      copy.anchorNameLabel,
      copy.anchorPlaceholder,
      copy.anchorLinkPrefix,
      copy.anchorHelp,
      Object.values(copy.deviceLabels).join(' '),
      copy.deviceVisibility.label,
      copy.deviceVisibility.visibleLabel,
      copy.deviceVisibility.hiddenLabel,
      copy.deviceVisibility.toggleActionLabel,
      copy.deviceVisibility.currentEditingLabel,
      copy.deviceVisibility.ariaLabel('Mobile', false),
      copy.deviceVisibility.title('Desktop', true, true),
    ].join(' ')).not.toMatch(cjk);
  });
});
