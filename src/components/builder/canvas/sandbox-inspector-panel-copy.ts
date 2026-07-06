import type { Locale } from '@/lib/locales';

export type SandboxInspectorTabId = 'layout' | 'style' | 'content' | 'animations' | 'interactions' | 'a11y' | 'seo';

export type SandboxInspectorTabCopy = {
  label: string;
  title: string;
};

export type SandboxInspectorPanelCopy = {
  inspectorAriaLabel: string;
  panelTitle: string;
  canvasSelectionLabel: string;
  collapseTitle: string;
  expandTitle: string;
  hideButtonLabel: string;
  showButtonLabel: string;
  multiSelectionNotice: (count: number) => string;
  commonSectionLabel: string;
  mixedPropertiesTitle: string;
  widthLabel: string;
  heightLabel: string;
  opacityLabel: string;
  batchActionsLabel: string;
  multiSelectTitle: string;
  duplicateSelectionTitle: string;
  duplicateSelectionLabel: string;
  alignLeftTitle: string;
  alignLeftLabel: string;
  alignCenterTitle: string;
  alignCenterLabel: string;
  alignRightTitle: string;
  alignRightLabel: string;
  alignTopTitle: string;
  alignTopLabel: string;
  alignMiddleTitle: string;
  alignMiddleLabel: string;
  alignBottomTitle: string;
  alignBottomLabel: string;
  distributeHorizontalTitle: string;
  distributeHorizontalLabel: string;
  distributeVerticalTitle: string;
  distributeVerticalLabel: string;
  matchWidthTitle: string;
  matchWidthLabel: string;
  matchHeightTitle: string;
  matchHeightLabel: string;
  tabs: Record<SandboxInspectorTabId, SandboxInspectorTabCopy>;
  seoNotice: string;
  hiddenNodeHint: string;
  lockedNodeHint: string;
  zOrderLabel: string;
  stackingActionsLabel: string;
  sendToBackTitle: string;
  sendToBackLabel: string;
  sendBackwardTitle: string;
  sendBackwardLabel: string;
  bringForwardTitle: string;
  bringForwardLabel: string;
  bringToFrontTitle: string;
  bringToFrontLabel: string;
  duplicateTitle: (shortcutTitle?: string) => string;
  duplicateLabel: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  emptyStateClearSelectionLabel: string;
  compositeSlotTitle: (surfaceKey: string) => string;
  compositeCloseLabel: string;
  compositePlaceholder: string;
  compositeDecomposeTitle: string;
  compositeDecomposeBody: string;
  compositeDecomposeButton: string;
  compositeDecomposePending: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxInspectorPanelCopy> = {
  ko: {
    inspectorAriaLabel: '인스펙터 패널',
    panelTitle: '인스펙터',
    canvasSelectionLabel: '캔버스',
    collapseTitle: '인스펙터 접기',
    expandTitle: '인스펙터 열기',
    hideButtonLabel: '숨기기',
    showButtonLabel: '보이기',
    multiSelectionNotice: (count) => `${count}개 노드가 선택됐습니다. 일괄 복제와 정렬 툴바를 사용할 수 있습니다.`,
    commonSectionLabel: '공통',
    mixedPropertiesTitle: '혼합 속성',
    widthLabel: '너비',
    heightLabel: '높이',
    opacityLabel: '투명도',
    batchActionsLabel: '일괄 작업',
    multiSelectTitle: '다중 선택',
    duplicateSelectionTitle: '선택된 노드 모두 복제',
    duplicateSelectionLabel: '선택 항목 복제',
    alignLeftTitle: '왼쪽 정렬',
    alignLeftLabel: '왼쪽',
    alignCenterTitle: '가운데 정렬',
    alignCenterLabel: '가운데',
    alignRightTitle: '오른쪽 정렬',
    alignRightLabel: '오른쪽',
    alignTopTitle: '상단 정렬',
    alignTopLabel: '위쪽',
    alignMiddleTitle: '중앙 정렬',
    alignMiddleLabel: '중앙',
    alignBottomTitle: '하단 정렬',
    alignBottomLabel: '아래쪽',
    distributeHorizontalTitle: '가로 간격 분배',
    distributeHorizontalLabel: '가로 분배',
    distributeVerticalTitle: '세로 간격 분배',
    distributeVerticalLabel: '세로 분배',
    matchWidthTitle: '첫 기준 너비에 맞춤',
    matchWidthLabel: '너비 맞춤',
    matchHeightTitle: '첫 기준 높이에 맞춤',
    matchHeightLabel: '높이 맞춤',
    tabs: {
      layout: {
        label: '레이아웃',
        title: 'x/y/w/h, 회전, 잠금/숨김 설정',
      },
      style: {
        label: '스타일',
        title: '배경, 테두리, 그림자, 투명도 설정',
      },
      content: {
        label: '콘텐츠',
        title: '텍스트, 이미지 등 콘텐츠 편집',
      },
      animations: {
        label: '애니메이션',
        title: '등장, 스크롤, 호버 애니메이션 설정',
      },
      interactions: {
        label: '인터랙션',
        title: '클릭 시 페이지, 앵커, 라이트박스, 팝업 동작 설정',
      },
      a11y: {
        label: '접근성',
        title: '접근성 검사',
      },
      seo: {
        label: 'SEO',
        title: '페이지 SEO 패널 안내',
      },
    },
    seoNotice:
      '페이지 단위 SEO는 상단 바의 전용 SEO 모달에서 관리합니다. 요소 단위 SEO 필드는 노드 메타데이터 기능이 들어오면 여기에 연결됩니다.',
    hiddenNodeHint:
      '이 노드는 현재 캔버스에서 숨겨져 있습니다. 레이어나 인스펙터에서 다시 표시할 수 있습니다.',
    lockedNodeHint:
      '잠금 상태에서는 드래그, 크기 조정, nudge, 삭제, 쌓임 순서 변경이 막힙니다. 인스펙터에서만 잠금 해제할 수 있습니다.',
    zOrderLabel: '쌓임 순서',
    stackingActionsLabel: '쌓임 작업',
    sendToBackTitle: '맨 뒤로 보내기',
    sendToBackLabel: '맨 뒤로',
    sendBackwardTitle: '한 단계 뒤로',
    sendBackwardLabel: '뒤로 한 단계',
    bringForwardTitle: '한 단계 앞으로',
    bringForwardLabel: '앞으로 한 단계',
    bringToFrontTitle: '맨 앞으로 가져오기',
    bringToFrontLabel: '맨 앞으로',
    duplicateTitle: (shortcutTitle) => shortcutTitle ? `선택 노드 복제 (${shortcutTitle})` : '선택 노드 복제',
    duplicateLabel: '복제',
    emptyStateTitle: '편집할 요소를 선택하세요',
    emptyStateBody: '캔버스에서 요소를 클릭하거나 레이어 패널을 사용하세요.',
    emptyStateClearSelectionLabel: '선택 해제',
    compositeSlotTitle: (surfaceKey) => `슬롯 편집 · ${surfaceKey}`,
    compositeCloseLabel: '닫기',
    compositePlaceholder: '비워두면 원본 기본값을 사용합니다',
    compositeDecomposeTitle: '라이브 미러',
    compositeDecomposeBody: '요소 단위 편집으로 전환할 수 있습니다.',
    compositeDecomposeButton: '요소 편집으로 전환',
    compositeDecomposePending: '전환 중...',
  },
  'zh-hant': {
    inspectorAriaLabel: '檢查器面板',
    panelTitle: '檢查器',
    canvasSelectionLabel: '畫布',
    collapseTitle: '收合檢查器',
    expandTitle: '展開檢查器',
    hideButtonLabel: '隱藏',
    showButtonLabel: '顯示',
    multiSelectionNotice: (count) => `已選取 ${count} 個節點。可使用批次再製與對齊工具列。`,
    commonSectionLabel: '通用',
    mixedPropertiesTitle: '混合屬性',
    widthLabel: '寬度',
    heightLabel: '高度',
    opacityLabel: '不透明度',
    batchActionsLabel: '批次操作',
    multiSelectTitle: '多選',
    duplicateSelectionTitle: '再製所有所選節點',
    duplicateSelectionLabel: '再製選取項目',
    alignLeftTitle: '靠左對齊',
    alignLeftLabel: '靠左',
    alignCenterTitle: '置中對齊',
    alignCenterLabel: '置中',
    alignRightTitle: '靠右對齊',
    alignRightLabel: '靠右',
    alignTopTitle: '頂端對齊',
    alignTopLabel: '頂端',
    alignMiddleTitle: '垂直置中',
    alignMiddleLabel: '中間',
    alignBottomTitle: '底端對齊',
    alignBottomLabel: '底端',
    distributeHorizontalTitle: '水平分配間距',
    distributeHorizontalLabel: '水平分配',
    distributeVerticalTitle: '垂直分配間距',
    distributeVerticalLabel: '垂直分配',
    matchWidthTitle: '符合第一個項目的寬度',
    matchWidthLabel: '符合寬度',
    matchHeightTitle: '符合第一個項目的高度',
    matchHeightLabel: '符合高度',
    tabs: {
      layout: {
        label: '版面配置',
        title: '設定 x/y/w/h、旋轉、鎖定與隱藏',
      },
      style: {
        label: '樣式',
        title: '設定背景、邊框、陰影與不透明度',
      },
      content: {
        label: '內容',
        title: '編輯文字、圖片等內容',
      },
      animations: {
        label: '動畫',
        title: '設定進場、捲動與 hover 動畫',
      },
      interactions: {
        label: '互動',
        title: '設定點擊後前往頁面、錨點、Lightbox 或 Popup',
      },
      a11y: {
        label: '無障礙',
        title: '無障礙檢查',
      },
      seo: {
        label: 'SEO',
        title: '頁面 SEO 面板說明',
      },
    },
    seoNotice:
      '頁面層級 SEO 請在頂端列的專用 SEO 模態視窗管理。元素層級 SEO 欄位會在節點中繼資料功能完成後顯示於此。',
    hiddenNodeHint:
      '此節點目前已在畫布中隱藏。你可以從圖層或檢查器再次顯示。',
    lockedNodeHint:
      '鎖定狀態會阻止拖曳、調整大小、微調、刪除與層級順序變更。只能在檢查器中解除鎖定。',
    zOrderLabel: '層級順序',
    stackingActionsLabel: '堆疊操作',
    sendToBackTitle: '移到最後',
    sendToBackLabel: '移到最後',
    sendBackwardTitle: '向後一層',
    sendBackwardLabel: '向後一層',
    bringForwardTitle: '向前一層',
    bringForwardLabel: '向前一層',
    bringToFrontTitle: '移到最前',
    bringToFrontLabel: '移到最前',
    duplicateTitle: (shortcutTitle) => shortcutTitle ? `再製所選節點（${shortcutTitle}）` : '再製所選節點',
    duplicateLabel: '再製',
    emptyStateTitle: '選取要編輯的元素',
    emptyStateBody: '請在畫布中點選元素，或使用圖層面板。',
    emptyStateClearSelectionLabel: '清除選取',
    compositeSlotTitle: (surfaceKey) => `編輯插槽 · ${surfaceKey}`,
    compositeCloseLabel: '關閉',
    compositePlaceholder: '留空即可使用原始預設值',
    compositeDecomposeTitle: '即時鏡像',
    compositeDecomposeBody: '可切換為逐元素編輯。',
    compositeDecomposeButton: '切換為元素編輯',
    compositeDecomposePending: '切換中...',
  },
  en: {
    inspectorAriaLabel: 'Inspector panel',
    panelTitle: 'Inspector',
    canvasSelectionLabel: 'Canvas',
    collapseTitle: 'Collapse inspector',
    expandTitle: 'Expand inspector',
    hideButtonLabel: 'Hide',
    showButtonLabel: 'Show',
    multiSelectionNotice: (count) => `${count} nodes selected. Batch duplicate and alignment tools are available.`,
    commonSectionLabel: 'Common',
    mixedPropertiesTitle: 'Mixed properties',
    widthLabel: 'Width',
    heightLabel: 'Height',
    opacityLabel: 'Opacity',
    batchActionsLabel: 'Batch actions',
    multiSelectTitle: 'Multi-select',
    duplicateSelectionTitle: 'Duplicate all selected nodes',
    duplicateSelectionLabel: 'Duplicate selection',
    alignLeftTitle: 'Align left',
    alignLeftLabel: 'Left',
    alignCenterTitle: 'Align center',
    alignCenterLabel: 'Center',
    alignRightTitle: 'Align right',
    alignRightLabel: 'Right',
    alignTopTitle: 'Align top',
    alignTopLabel: 'Top',
    alignMiddleTitle: 'Align middle',
    alignMiddleLabel: 'Middle',
    alignBottomTitle: 'Align bottom',
    alignBottomLabel: 'Bottom',
    distributeHorizontalTitle: 'Distribute horizontal spacing',
    distributeHorizontalLabel: 'Distribute H',
    distributeVerticalTitle: 'Distribute vertical spacing',
    distributeVerticalLabel: 'Distribute V',
    matchWidthTitle: 'Match the first selected width',
    matchWidthLabel: 'Match W',
    matchHeightTitle: 'Match the first selected height',
    matchHeightLabel: 'Match H',
    tabs: {
      layout: {
        label: 'Layout',
        title: 'Set x/y/w/h, rotation, lock, and hidden state',
      },
      style: {
        label: 'Style',
        title: 'Set background, border, shadow, and opacity',
      },
      content: {
        label: 'Content',
        title: 'Edit text, images, and other content',
      },
      animations: {
        label: 'Animations',
        title: 'Set entrance, scroll, and hover animations',
      },
      interactions: {
        label: 'Interactions',
        title: 'Set click actions for pages, anchors, lightboxes, and popups',
      },
      a11y: {
        label: 'A11y',
        title: 'Accessibility checks',
      },
      seo: {
        label: 'SEO',
        title: 'Page SEO panel guidance',
      },
    },
    seoNotice:
      'Page-level SEO lives in the dedicated SEO modal from the top bar. Element-level SEO fields will attach here when per-node metadata lands.',
    hiddenNodeHint:
      'This node is currently hidden on the canvas. Show it again from Layers or the inspector.',
    lockedNodeHint:
      'Locked nodes cannot be dragged, resized, nudged, deleted, or reordered. Unlock them from the inspector.',
    zOrderLabel: 'Z-order',
    stackingActionsLabel: 'Stacking actions',
    sendToBackTitle: 'Send to back',
    sendToBackLabel: 'Send to back',
    sendBackwardTitle: 'Send backward',
    sendBackwardLabel: 'Backward',
    bringForwardTitle: 'Bring forward',
    bringForwardLabel: 'Forward',
    bringToFrontTitle: 'Bring to front',
    bringToFrontLabel: 'Bring to front',
    duplicateTitle: (shortcutTitle) => shortcutTitle ? `Duplicate selected node (${shortcutTitle})` : 'Duplicate selected node',
    duplicateLabel: 'Duplicate',
    emptyStateTitle: 'Select an element to edit',
    emptyStateBody: 'Click an element on the canvas or use the Layers panel.',
    emptyStateClearSelectionLabel: 'Clear selection',
    compositeSlotTitle: (surfaceKey) => `Edit slot · ${surfaceKey}`,
    compositeCloseLabel: 'Close',
    compositePlaceholder: 'Leave blank to use the original default',
    compositeDecomposeTitle: 'Live mirror',
    compositeDecomposeBody: 'Switch to element-level editing.',
    compositeDecomposeButton: 'Switch to element editing',
    compositeDecomposePending: 'Switching...',
  },
};

export function getSandboxInspectorPanelCopy(locale: Locale): SandboxInspectorPanelCopy {
  return COPY[locale] ?? COPY.en;
}
