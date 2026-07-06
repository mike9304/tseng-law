import { describe, expect, it } from 'vitest';
import { getSandboxInspectorPanelCopy } from '../sandbox-inspector-panel-copy';

describe('sandbox inspector panel copy', () => {
  it('returns ko inspector status and z-order copy', () => {
    const copy = getSandboxInspectorPanelCopy('ko');

    expect(copy.inspectorAriaLabel).toBe('인스펙터 패널');
    expect(copy.panelTitle).toBe('인스펙터');
    expect(copy.canvasSelectionLabel).toBe('캔버스');
    expect(copy.collapseTitle).toBe('인스펙터 접기');
    expect(copy.hideButtonLabel).toBe('숨기기');
    expect(copy.multiSelectionNotice(3)).toContain('3개 노드');
    expect(copy.commonSectionLabel).toBe('공통');
    expect(copy.widthLabel).toBe('너비');
    expect(copy.batchActionsLabel).toBe('일괄 작업');
    expect(copy.duplicateSelectionLabel).toBe('선택 항목 복제');
    expect(copy.alignLeftTitle).toBe('왼쪽 정렬');
    expect(copy.distributeHorizontalLabel).toBe('가로 분배');
    expect(copy.matchHeightTitle).toBe('첫 기준 높이에 맞춤');
    expect(copy.tabs.layout).toMatchObject({
      label: '레이아웃',
      title: 'x/y/w/h, 회전, 잠금/숨김 설정',
    });
    expect(copy.tabs.animations.title).toBe('등장, 스크롤, 호버 애니메이션 설정');
    expect(copy.seoNotice).toContain('SEO');
    expect(copy.hiddenNodeHint).toContain('숨겨져');
    expect(copy.lockedNodeHint).toContain('잠금');
    expect(copy.zOrderLabel).toBe('쌓임 순서');
    expect(copy.stackingActionsLabel).toBe('쌓임 작업');
    expect(copy.sendToBackLabel).toBe('맨 뒤로');
    expect(copy.sendBackwardTitle).toBe('한 단계 뒤로');
    expect(copy.bringForwardLabel).toBe('앞으로 한 단계');
    expect(copy.bringToFrontTitle).toBe('맨 앞으로 가져오기');
    expect(copy.duplicateTitle('Cmd+D')).toBe('선택 노드 복제 (Cmd+D)');
    expect(copy.duplicateTitle()).toBe('선택 노드 복제');
    expect(copy.emptyStateTitle).toBe('편집할 요소를 선택하세요');
    expect(copy.compositeSlotTitle('hero.title')).toBe('슬롯 편집 · hero.title');
    expect(copy.compositeCloseLabel).toBe('닫기');
  });

  it('returns zh-hant inspector status and z-order copy without Hangul', () => {
    const copy = getSandboxInspectorPanelCopy('zh-hant');

    expect(copy.zOrderLabel).toBe('層級順序');
    expect(copy.duplicateTitle('Cmd+D')).toBe('再製所選節點（Cmd+D）');
    expect([
      copy.seoNotice,
      copy.inspectorAriaLabel,
      copy.panelTitle,
      copy.canvasSelectionLabel,
      copy.collapseTitle,
      copy.expandTitle,
      copy.hideButtonLabel,
      copy.showButtonLabel,
      copy.multiSelectionNotice(3),
      copy.commonSectionLabel,
      copy.mixedPropertiesTitle,
      copy.widthLabel,
      copy.heightLabel,
      copy.opacityLabel,
      copy.batchActionsLabel,
      copy.multiSelectTitle,
      copy.duplicateSelectionTitle,
      copy.duplicateSelectionLabel,
      copy.alignLeftTitle,
      copy.alignLeftLabel,
      copy.alignCenterTitle,
      copy.alignCenterLabel,
      copy.alignRightTitle,
      copy.alignRightLabel,
      copy.alignTopTitle,
      copy.alignTopLabel,
      copy.alignMiddleTitle,
      copy.alignMiddleLabel,
      copy.alignBottomTitle,
      copy.alignBottomLabel,
      copy.distributeHorizontalTitle,
      copy.distributeHorizontalLabel,
      copy.distributeVerticalTitle,
      copy.distributeVerticalLabel,
      copy.matchWidthTitle,
      copy.matchWidthLabel,
      copy.matchHeightTitle,
      copy.matchHeightLabel,
      Object.values(copy.tabs).map((tab) => `${tab.label} ${tab.title}`).join(' '),
      copy.hiddenNodeHint,
      copy.lockedNodeHint,
      copy.zOrderLabel,
      copy.stackingActionsLabel,
      copy.sendToBackTitle,
      copy.sendToBackLabel,
      copy.sendBackwardTitle,
      copy.sendBackwardLabel,
      copy.bringForwardTitle,
      copy.bringForwardLabel,
      copy.bringToFrontTitle,
      copy.bringToFrontLabel,
      copy.duplicateTitle('Cmd+D'),
      copy.duplicateTitle(),
      copy.duplicateLabel,
      copy.emptyStateTitle,
      copy.emptyStateBody,
      copy.emptyStateClearSelectionLabel,
      copy.compositeSlotTitle('hero.title'),
      copy.compositeCloseLabel,
      copy.compositePlaceholder,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en inspector status and z-order copy without CJK', () => {
    const copy = getSandboxInspectorPanelCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.tabs.layout).toMatchObject({
      label: 'Layout',
      title: 'Set x/y/w/h, rotation, lock, and hidden state',
    });
    expect(copy.zOrderLabel).toBe('Z-order');
    expect(copy.duplicateTitle('Cmd+D')).toBe('Duplicate selected node (Cmd+D)');
    expect([
      copy.seoNotice,
      copy.inspectorAriaLabel,
      copy.panelTitle,
      copy.canvasSelectionLabel,
      copy.collapseTitle,
      copy.expandTitle,
      copy.hideButtonLabel,
      copy.showButtonLabel,
      copy.multiSelectionNotice(3),
      copy.commonSectionLabel,
      copy.mixedPropertiesTitle,
      copy.widthLabel,
      copy.heightLabel,
      copy.opacityLabel,
      copy.batchActionsLabel,
      copy.multiSelectTitle,
      copy.duplicateSelectionTitle,
      copy.duplicateSelectionLabel,
      copy.alignLeftTitle,
      copy.alignLeftLabel,
      copy.alignCenterTitle,
      copy.alignCenterLabel,
      copy.alignRightTitle,
      copy.alignRightLabel,
      copy.alignTopTitle,
      copy.alignTopLabel,
      copy.alignMiddleTitle,
      copy.alignMiddleLabel,
      copy.alignBottomTitle,
      copy.alignBottomLabel,
      copy.distributeHorizontalTitle,
      copy.distributeHorizontalLabel,
      copy.distributeVerticalTitle,
      copy.distributeVerticalLabel,
      copy.matchWidthTitle,
      copy.matchWidthLabel,
      copy.matchHeightTitle,
      copy.matchHeightLabel,
      Object.values(copy.tabs).map((tab) => `${tab.label} ${tab.title}`).join(' '),
      copy.hiddenNodeHint,
      copy.lockedNodeHint,
      copy.zOrderLabel,
      copy.stackingActionsLabel,
      copy.sendToBackTitle,
      copy.sendToBackLabel,
      copy.sendBackwardTitle,
      copy.sendBackwardLabel,
      copy.bringForwardTitle,
      copy.bringForwardLabel,
      copy.bringToFrontTitle,
      copy.bringToFrontLabel,
      copy.duplicateTitle('Cmd+D'),
      copy.duplicateTitle(),
      copy.duplicateLabel,
      copy.emptyStateTitle,
      copy.emptyStateBody,
      copy.emptyStateClearSelectionLabel,
      copy.compositeSlotTitle('hero.title'),
      copy.compositeCloseLabel,
      copy.compositePlaceholder,
    ].join(' ')).not.toMatch(cjk);
  });
});
