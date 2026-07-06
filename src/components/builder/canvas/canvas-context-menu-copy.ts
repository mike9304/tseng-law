import type { Locale } from '@/lib/locales';

export type CanvasContextMenuCopy = {
  selectedCountTitle: (count: number) => string;
  nodeMenuTitle: (kind: string | null | undefined) => string;
  textEditLabel: string;
  textEditTitle: string;
  imageEditLabel: string;
  imageEditTitle: string;
  replaceImageLabel: string;
  replaceImageTitle: string;
  editAltLabel: string;
  editAltTitle: string;
  editLinkLabel: string;
  editLinkWithPreviewLabel: (preview: string) => string;
  removeLinkLabel: string;
  removeLinkTitle: string;
  copyLabel: string;
  cutLabel: string;
  pasteLabel: string;
  duplicateLabel: string;
  pasteStyleLabel: string;
  pasteStyleTitle: string;
  copyStyleLabel: string;
  copyStyleTitle: string;
  bringToFrontLabel: string;
  bringToFrontTitle: string;
  bringForwardLabel: string;
  bringForwardTitle: string;
  sendBackwardLabel: string;
  sendBackwardTitle: string;
  sendToBackLabel: string;
  sendToBackTitle: string;
  lockLabel: string;
  unlockLabel: string;
  lockTitle: string;
  alignLeftLabel: string;
  alignLeftTitle: string;
  alignCenterLabel: string;
  alignCenterTitle: string;
  alignRightLabel: string;
  alignRightTitle: string;
  alignTopLabel: string;
  alignTopTitle: string;
  alignMiddleLabel: string;
  alignMiddleTitle: string;
  alignBottomLabel: string;
  alignBottomTitle: string;
  distributeHorizontalLabel: string;
  distributeHorizontalTitle: string;
  distributeVerticalLabel: string;
  distributeVerticalTitle: string;
  matchWidthLabel: string;
  matchWidthTitle: string;
  matchHeightLabel: string;
  matchHeightTitle: string;
  hideOnViewportLabel: string;
  hideOnViewportTitle: string;
  hideDesktopLabel: string;
  hideTabletLabel: string;
  hideMobileLabel: string;
  pinToScreenLabel: string;
  pinToScreenTitle: string;
  anchorLinkLabel: string;
  anchorLinkTitle: string;
  animationsLabel: string;
  animationsTitle: string;
  effectsLabel: string;
  effectsTitle: string;
  moveToPageLabel: string;
  moveToPageTitle: string;
  saveAsSectionLabel: string;
  saveAsSectionTitle: string;
  addToLibraryLabel: string;
  addToLibraryTitle: string;
  convertToComponentLabel: string;
  convertToComponentTitle: string;
  styleOverrideLabel: string;
  styleOverrideTitle: string;
  overrideFillLabel: string;
  overrideTypographyLabel: string;
  overrideEffectsLabel: string;
  resetStyleLabel: string;
  resetStyleTitle: string;
  groupLabel: string;
  groupTitle: string;
  ungroupLabel: string;
  ungroupTitle: string;
  deleteLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', CanvasContextMenuCopy> = {
  ko: {
    selectedCountTitle: (count) => `${count}개 선택됨`,
    nodeMenuTitle: (kind) => `${kind ?? '요소'} 메뉴`,
    textEditLabel: '텍스트 편집',
    textEditTitle: '인라인 텍스트 편집 (또는 더블클릭)',
    imageEditLabel: '자르기 / 필터 / Alt...',
    imageEditTitle: '이미지 자르기, 필터, alt 텍스트 편집',
    replaceImageLabel: '이미지 교체',
    replaceImageTitle: '에셋 라이브러리 열기',
    editAltLabel: 'Alt 텍스트 편집',
    editAltTitle: '이미지 alt 텍스트 편집',
    editLinkLabel: '링크 편집',
    editLinkWithPreviewLabel: (preview) => `링크 편집 - ${preview}`,
    removeLinkLabel: '링크 제거',
    removeLinkTitle: '현재 링크 제거',
    copyLabel: '복사',
    cutLabel: '잘라내기',
    pasteLabel: '붙여넣기',
    duplicateLabel: '복제',
    pasteStyleLabel: '스타일 붙여넣기',
    pasteStyleTitle: '선택 노드에 스타일만 붙여넣기',
    copyStyleLabel: '스타일 복사',
    copyStyleTitle: '선택 노드의 스타일만 복사',
    bringToFrontLabel: '맨 앞으로',
    bringToFrontTitle: '맨 앞으로 가져오기',
    bringForwardLabel: '한 단계 앞으로',
    bringForwardTitle: '한 단계 앞으로',
    sendBackwardLabel: '한 단계 뒤로',
    sendBackwardTitle: '한 단계 뒤로',
    sendToBackLabel: '맨 뒤로',
    sendToBackTitle: '맨 뒤로 보내기',
    lockLabel: '잠금',
    unlockLabel: '잠금 해제',
    lockTitle: '선택 잠금 토글',
    alignLeftLabel: '왼쪽 정렬',
    alignLeftTitle: '왼쪽 정렬',
    alignCenterLabel: '가로 중앙 정렬',
    alignCenterTitle: '가운데 정렬',
    alignRightLabel: '오른쪽 정렬',
    alignRightTitle: '오른쪽 정렬',
    alignTopLabel: '위쪽 정렬',
    alignTopTitle: '상단 정렬',
    alignMiddleLabel: '세로 중앙 정렬',
    alignMiddleTitle: '중앙 정렬',
    alignBottomLabel: '아래쪽 정렬',
    alignBottomTitle: '하단 정렬',
    distributeHorizontalLabel: '가로 균등 분배',
    distributeHorizontalTitle: '가로 균등 분배 (3개 이상)',
    distributeVerticalLabel: '세로 균등 분배',
    distributeVerticalTitle: '세로 균등 분배 (3개 이상)',
    matchWidthLabel: '너비 맞춤',
    matchWidthTitle: '선택 요소 너비 동일화',
    matchHeightLabel: '높이 맞춤',
    matchHeightTitle: '선택 요소 높이 동일화',
    hideOnViewportLabel: '기기별 숨김',
    hideOnViewportTitle: '현재 선택을 특정 뷰포트에서 숨깁니다',
    hideDesktopLabel: '데스크탑에서 숨김',
    hideTabletLabel: '태블릿에서 숨김',
    hideMobileLabel: '모바일에서 숨김',
    pinToScreenLabel: '화면 고정',
    pinToScreenTitle: '준비 중 - Codex F-track',
    anchorLinkLabel: '앵커 링크...',
    anchorLinkTitle: '레이아웃 탭에서 앵커 이름을 편집하세요',
    animationsLabel: '애니메이션...',
    animationsTitle: '인스펙터의 애니메이션 탭을 여세요',
    effectsLabel: '효과...',
    effectsTitle: '준비 중 - Codex F-track',
    moveToPageLabel: '페이지로 이동...',
    moveToPageTitle: '다른 페이지로 이동',
    saveAsSectionLabel: '섹션으로 저장...',
    saveAsSectionTitle: '컨테이너 + 자식을 라이브러리에 저장 (재사용)',
    addToLibraryLabel: '라이브러리에 추가',
    addToLibraryTitle: '준비 중 - Codex F-track',
    convertToComponentLabel: '컴포넌트로 변환',
    convertToComponentTitle: '준비 중 - Codex F-track',
    styleOverrideLabel: '스타일 오버라이드',
    styleOverrideTitle: '준비 중 - Codex F-track',
    overrideFillLabel: '채색 오버라이드',
    overrideTypographyLabel: '서체 오버라이드',
    overrideEffectsLabel: '효과 오버라이드',
    resetStyleLabel: '스타일 초기화',
    resetStyleTitle: '준비 중 - Codex F-track',
    groupLabel: '그룹',
    groupTitle: '그룹 만들기 (2개 이상)',
    ungroupLabel: '그룹 해제',
    ungroupTitle: '그룹 해제',
    deleteLabel: '삭제',
  },
  'zh-hant': {
    selectedCountTitle: (count) => `已選取 ${count} 個`,
    nodeMenuTitle: (kind) => `${kind ?? '元素'}選單`,
    textEditLabel: '編輯文字',
    textEditTitle: '編輯行內文字（或按兩下）',
    imageEditLabel: '裁切 / 濾鏡 / Alt...',
    imageEditTitle: '編輯圖片裁切、濾鏡與 alt 文字',
    replaceImageLabel: '更換圖片',
    replaceImageTitle: '開啟素材庫',
    editAltLabel: '編輯 Alt 文字',
    editAltTitle: '編輯圖片 alt 文字',
    editLinkLabel: '編輯連結',
    editLinkWithPreviewLabel: (preview) => `編輯連結 - ${preview}`,
    removeLinkLabel: '移除連結',
    removeLinkTitle: '移除目前連結',
    copyLabel: '複製',
    cutLabel: '剪下',
    pasteLabel: '貼上',
    duplicateLabel: '再製',
    pasteStyleLabel: '貼上樣式',
    pasteStyleTitle: '只將樣式貼到所選節點',
    copyStyleLabel: '複製樣式',
    copyStyleTitle: '只複製所選節點的樣式',
    bringToFrontLabel: '移到最前',
    bringToFrontTitle: '移到最前',
    bringForwardLabel: '向前一層',
    bringForwardTitle: '向前一層',
    sendBackwardLabel: '向後一層',
    sendBackwardTitle: '向後一層',
    sendToBackLabel: '移到最後',
    sendToBackTitle: '移到最後',
    lockLabel: '鎖定',
    unlockLabel: '解除鎖定',
    lockTitle: '切換所選項目鎖定',
    alignLeftLabel: '靠左對齊',
    alignLeftTitle: '靠左對齊',
    alignCenterLabel: '水平置中',
    alignCenterTitle: '置中對齊',
    alignRightLabel: '靠右對齊',
    alignRightTitle: '靠右對齊',
    alignTopLabel: '靠上對齊',
    alignTopTitle: '頂端對齊',
    alignMiddleLabel: '垂直置中',
    alignMiddleTitle: '中央對齊',
    alignBottomLabel: '靠下對齊',
    alignBottomTitle: '底端對齊',
    distributeHorizontalLabel: '水平平均分配',
    distributeHorizontalTitle: '水平平均分配（3 個以上）',
    distributeVerticalLabel: '垂直平均分配',
    distributeVerticalTitle: '垂直平均分配（3 個以上）',
    matchWidthLabel: '符合寬度',
    matchWidthTitle: '讓所選元素寬度一致',
    matchHeightLabel: '符合高度',
    matchHeightTitle: '讓所選元素高度一致',
    hideOnViewportLabel: '依裝置隱藏',
    hideOnViewportTitle: '在指定視窗隱藏目前選取項目',
    hideDesktopLabel: '在桌面隱藏',
    hideTabletLabel: '在平板隱藏',
    hideMobileLabel: '在手機隱藏',
    pinToScreenLabel: '固定到畫面',
    pinToScreenTitle: '即將推出 - Codex F-track',
    anchorLinkLabel: '錨點連結...',
    anchorLinkTitle: '請在版面配置分頁編輯錨點名稱',
    animationsLabel: '動畫...',
    animationsTitle: '在檢查器中開啟動畫分頁',
    effectsLabel: '效果...',
    effectsTitle: '即將推出 - Codex F-track',
    moveToPageLabel: '移到頁面...',
    moveToPageTitle: '移到其他頁面',
    saveAsSectionLabel: '儲存為區段...',
    saveAsSectionTitle: '將容器與子項儲存到素材庫（可重複使用）',
    addToLibraryLabel: '加入素材庫',
    addToLibraryTitle: '即將推出 - Codex F-track',
    convertToComponentLabel: '轉換為元件',
    convertToComponentTitle: '即將推出 - Codex F-track',
    styleOverrideLabel: '樣式覆寫',
    styleOverrideTitle: '即將推出 - Codex F-track',
    overrideFillLabel: '填色覆寫',
    overrideTypographyLabel: '字體覆寫',
    overrideEffectsLabel: '效果覆寫',
    resetStyleLabel: '重設樣式',
    resetStyleTitle: '即將推出 - Codex F-track',
    groupLabel: '群組',
    groupTitle: '建立群組（2 個以上）',
    ungroupLabel: '取消群組',
    ungroupTitle: '取消群組',
    deleteLabel: '刪除',
  },
  en: {
    selectedCountTitle: (count) => `${count} selected`,
    nodeMenuTitle: (kind) => `${kind ?? 'Element'} menu`,
    textEditLabel: 'Edit text',
    textEditTitle: 'Edit inline text (or double-click)',
    imageEditLabel: 'Crop / filters / Alt...',
    imageEditTitle: 'Edit image crop, filters, and alt text',
    replaceImageLabel: 'Replace image',
    replaceImageTitle: 'Open asset library',
    editAltLabel: 'Edit alt text',
    editAltTitle: 'Edit image alt text',
    editLinkLabel: 'Edit link',
    editLinkWithPreviewLabel: (preview) => `Edit link - ${preview}`,
    removeLinkLabel: 'Remove link',
    removeLinkTitle: 'Remove current link',
    copyLabel: 'Copy',
    cutLabel: 'Cut',
    pasteLabel: 'Paste',
    duplicateLabel: 'Duplicate',
    pasteStyleLabel: 'Paste style',
    pasteStyleTitle: 'Paste only styles onto the selected node',
    copyStyleLabel: 'Copy style',
    copyStyleTitle: 'Copy only styles from the selected node',
    bringToFrontLabel: 'Bring to front',
    bringToFrontTitle: 'Bring to front',
    bringForwardLabel: 'Bring forward',
    bringForwardTitle: 'Bring forward',
    sendBackwardLabel: 'Send backward',
    sendBackwardTitle: 'Send backward',
    sendToBackLabel: 'Send to back',
    sendToBackTitle: 'Send to back',
    lockLabel: 'Lock',
    unlockLabel: 'Unlock',
    lockTitle: 'Toggle selection lock',
    alignLeftLabel: 'Align left',
    alignLeftTitle: 'Align left',
    alignCenterLabel: 'Align center horizontally',
    alignCenterTitle: 'Align center',
    alignRightLabel: 'Align right',
    alignRightTitle: 'Align right',
    alignTopLabel: 'Align top',
    alignTopTitle: 'Align top',
    alignMiddleLabel: 'Align middle vertically',
    alignMiddleTitle: 'Align middle',
    alignBottomLabel: 'Align bottom',
    alignBottomTitle: 'Align bottom',
    distributeHorizontalLabel: 'Distribute horizontally',
    distributeHorizontalTitle: 'Distribute horizontally (3 or more)',
    distributeVerticalLabel: 'Distribute vertically',
    distributeVerticalTitle: 'Distribute vertically (3 or more)',
    matchWidthLabel: 'Match width',
    matchWidthTitle: 'Make selected elements the same width',
    matchHeightLabel: 'Match height',
    matchHeightTitle: 'Make selected elements the same height',
    hideOnViewportLabel: 'Hide by device',
    hideOnViewportTitle: 'Hide the current selection on a specific viewport',
    hideDesktopLabel: 'Hide on desktop',
    hideTabletLabel: 'Hide on tablet',
    hideMobileLabel: 'Hide on mobile',
    pinToScreenLabel: 'Pin to screen',
    pinToScreenTitle: 'Coming soon - Codex F-track',
    anchorLinkLabel: 'Anchor link...',
    anchorLinkTitle: 'Use the Layout tab to edit anchor name',
    animationsLabel: 'Animations...',
    animationsTitle: 'Open the Animations tab in the inspector',
    effectsLabel: 'Effects...',
    effectsTitle: 'Coming soon - Codex F-track',
    moveToPageLabel: 'Move to page...',
    moveToPageTitle: 'Move to another page',
    saveAsSectionLabel: 'Save as section...',
    saveAsSectionTitle: 'Save container + children to the library for reuse',
    addToLibraryLabel: 'Add to library',
    addToLibraryTitle: 'Coming soon - Codex F-track',
    convertToComponentLabel: 'Convert to component',
    convertToComponentTitle: 'Coming soon - Codex F-track',
    styleOverrideLabel: 'Style overrides',
    styleOverrideTitle: 'Coming soon - Codex F-track',
    overrideFillLabel: 'Fill override',
    overrideTypographyLabel: 'Typography override',
    overrideEffectsLabel: 'Effects override',
    resetStyleLabel: 'Reset style',
    resetStyleTitle: 'Coming soon - Codex F-track',
    groupLabel: 'Group',
    groupTitle: 'Create group (2 or more)',
    ungroupLabel: 'Ungroup',
    ungroupTitle: 'Ungroup',
    deleteLabel: 'Delete',
  },
};

export function getCanvasContextMenuCopy(locale: Locale): CanvasContextMenuCopy {
  return COPY[locale] ?? COPY.en;
}
