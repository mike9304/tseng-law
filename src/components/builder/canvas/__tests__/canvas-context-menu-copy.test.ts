import { describe, expect, it } from 'vitest';
import { getCanvasContextMenuCopy } from '../canvas-context-menu-copy';

describe('canvas context menu copy', () => {
  it('returns ko context menu top-action copy', () => {
    const copy = getCanvasContextMenuCopy('ko');
    expect(copy.selectedCountTitle(2)).toBe('2개 선택됨');
    expect(copy.nodeMenuTitle(null)).toBe('요소 메뉴');
    expect(copy.textEditLabel).toBe('텍스트 편집');
    expect(copy.imageEditTitle).toBe('이미지 자르기, 필터, alt 텍스트 편집');
    expect(copy.editLinkWithPreviewLabel('/about')).toBe('링크 편집 - /about');
    expect(copy.removeLinkTitle).toBe('현재 링크 제거');
    expect(copy.copyLabel).toBe('복사');
    expect(copy.pasteStyleTitle).toBe('선택 노드에 스타일만 붙여넣기');
    expect(copy.bringToFrontTitle).toBe('맨 앞으로 가져오기');
    expect(copy.unlockLabel).toBe('잠금 해제');
    expect(copy.alignCenterLabel).toBe('가로 중앙 정렬');
    expect(copy.distributeHorizontalTitle).toBe('가로 균등 분배 (3개 이상)');
    expect(copy.matchWidthTitle).toBe('선택 요소 너비 동일화');
    expect(copy.hideOnViewportLabel).toBe('기기별 숨김');
    expect(copy.hideDesktopLabel).toBe('데스크탑에서 숨김');
    expect(copy.anchorLinkTitle).toBe('레이아웃 탭에서 앵커 이름을 편집하세요');
    expect(copy.moveToPageLabel).toBe('페이지로 이동...');
    expect(copy.saveAsSectionTitle).toBe('컨테이너 + 자식을 라이브러리에 저장 (재사용)');
    expect(copy.overrideTypographyLabel).toBe('서체 오버라이드');
    expect(copy.groupTitle).toBe('그룹 만들기 (2개 이상)');
    expect(copy.deleteLabel).toBe('삭제');
  });

  it('returns zh-hant context menu top-action copy without Hangul', () => {
    const copy = getCanvasContextMenuCopy('zh-hant');
    expect(copy.selectedCountTitle(3)).toBe('已選取 3 個');
    expect(copy.nodeMenuTitle(null)).toBe('元素選單');
    expect(copy.textEditLabel).toBe('編輯文字');
    expect(copy.replaceImageTitle).toBe('開啟素材庫');
    expect(copy.removeLinkLabel).toBe('移除連結');
    expect([
      copy.selectedCountTitle(1),
      copy.nodeMenuTitle('image'),
      copy.textEditLabel,
      copy.textEditTitle,
      copy.imageEditLabel,
      copy.imageEditTitle,
      copy.replaceImageLabel,
      copy.replaceImageTitle,
      copy.editAltLabel,
      copy.editAltTitle,
      copy.editLinkLabel,
      copy.editLinkWithPreviewLabel('/about'),
      copy.removeLinkLabel,
      copy.removeLinkTitle,
      copy.copyLabel,
      copy.cutLabel,
      copy.pasteLabel,
      copy.duplicateLabel,
      copy.pasteStyleLabel,
      copy.pasteStyleTitle,
      copy.copyStyleLabel,
      copy.copyStyleTitle,
      copy.bringToFrontLabel,
      copy.bringToFrontTitle,
      copy.bringForwardLabel,
      copy.bringForwardTitle,
      copy.sendBackwardLabel,
      copy.sendBackwardTitle,
      copy.sendToBackLabel,
      copy.sendToBackTitle,
      copy.lockLabel,
      copy.unlockLabel,
      copy.lockTitle,
      copy.alignLeftLabel,
      copy.alignLeftTitle,
      copy.alignCenterLabel,
      copy.alignCenterTitle,
      copy.alignRightLabel,
      copy.alignRightTitle,
      copy.alignTopLabel,
      copy.alignTopTitle,
      copy.alignMiddleLabel,
      copy.alignMiddleTitle,
      copy.alignBottomLabel,
      copy.alignBottomTitle,
      copy.distributeHorizontalLabel,
      copy.distributeHorizontalTitle,
      copy.distributeVerticalLabel,
      copy.distributeVerticalTitle,
      copy.matchWidthLabel,
      copy.matchWidthTitle,
      copy.matchHeightLabel,
      copy.matchHeightTitle,
      copy.hideOnViewportLabel,
      copy.hideOnViewportTitle,
      copy.hideDesktopLabel,
      copy.hideTabletLabel,
      copy.hideMobileLabel,
      copy.pinToScreenLabel,
      copy.pinToScreenTitle,
      copy.anchorLinkLabel,
      copy.anchorLinkTitle,
      copy.animationsLabel,
      copy.animationsTitle,
      copy.effectsLabel,
      copy.effectsTitle,
      copy.moveToPageLabel,
      copy.moveToPageTitle,
      copy.saveAsSectionLabel,
      copy.saveAsSectionTitle,
      copy.addToLibraryLabel,
      copy.addToLibraryTitle,
      copy.convertToComponentLabel,
      copy.convertToComponentTitle,
      copy.styleOverrideLabel,
      copy.styleOverrideTitle,
      copy.overrideFillLabel,
      copy.overrideTypographyLabel,
      copy.overrideEffectsLabel,
      copy.resetStyleLabel,
      copy.resetStyleTitle,
      copy.groupLabel,
      copy.groupTitle,
      copy.ungroupLabel,
      copy.ungroupTitle,
      copy.deleteLabel,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en context menu top-action copy without CJK', () => {
    const copy = getCanvasContextMenuCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.selectedCountTitle(4)).toBe('4 selected');
    expect(copy.nodeMenuTitle(null)).toBe('Element menu');
    expect(copy.textEditLabel).toBe('Edit text');
    expect(copy.replaceImageTitle).toBe('Open asset library');
    expect(copy.removeLinkLabel).toBe('Remove link');
    expect([
      copy.selectedCountTitle(1),
      copy.nodeMenuTitle('image'),
      copy.textEditLabel,
      copy.textEditTitle,
      copy.imageEditLabel,
      copy.imageEditTitle,
      copy.replaceImageLabel,
      copy.replaceImageTitle,
      copy.editAltLabel,
      copy.editAltTitle,
      copy.editLinkLabel,
      copy.editLinkWithPreviewLabel('/about'),
      copy.removeLinkLabel,
      copy.removeLinkTitle,
      copy.copyLabel,
      copy.cutLabel,
      copy.pasteLabel,
      copy.duplicateLabel,
      copy.pasteStyleLabel,
      copy.pasteStyleTitle,
      copy.copyStyleLabel,
      copy.copyStyleTitle,
      copy.bringToFrontLabel,
      copy.bringToFrontTitle,
      copy.bringForwardLabel,
      copy.bringForwardTitle,
      copy.sendBackwardLabel,
      copy.sendBackwardTitle,
      copy.sendToBackLabel,
      copy.sendToBackTitle,
      copy.lockLabel,
      copy.unlockLabel,
      copy.lockTitle,
      copy.alignLeftLabel,
      copy.alignLeftTitle,
      copy.alignCenterLabel,
      copy.alignCenterTitle,
      copy.alignRightLabel,
      copy.alignRightTitle,
      copy.alignTopLabel,
      copy.alignTopTitle,
      copy.alignMiddleLabel,
      copy.alignMiddleTitle,
      copy.alignBottomLabel,
      copy.alignBottomTitle,
      copy.distributeHorizontalLabel,
      copy.distributeHorizontalTitle,
      copy.distributeVerticalLabel,
      copy.distributeVerticalTitle,
      copy.matchWidthLabel,
      copy.matchWidthTitle,
      copy.matchHeightLabel,
      copy.matchHeightTitle,
      copy.hideOnViewportLabel,
      copy.hideOnViewportTitle,
      copy.hideDesktopLabel,
      copy.hideTabletLabel,
      copy.hideMobileLabel,
      copy.pinToScreenLabel,
      copy.pinToScreenTitle,
      copy.anchorLinkLabel,
      copy.anchorLinkTitle,
      copy.animationsLabel,
      copy.animationsTitle,
      copy.effectsLabel,
      copy.effectsTitle,
      copy.moveToPageLabel,
      copy.moveToPageTitle,
      copy.saveAsSectionLabel,
      copy.saveAsSectionTitle,
      copy.addToLibraryLabel,
      copy.addToLibraryTitle,
      copy.convertToComponentLabel,
      copy.convertToComponentTitle,
      copy.styleOverrideLabel,
      copy.styleOverrideTitle,
      copy.overrideFillLabel,
      copy.overrideTypographyLabel,
      copy.overrideEffectsLabel,
      copy.resetStyleLabel,
      copy.resetStyleTitle,
      copy.groupLabel,
      copy.groupTitle,
      copy.ungroupLabel,
      copy.ungroupTitle,
      copy.deleteLabel,
    ].join(' ')).not.toMatch(cjk);
  });
});
