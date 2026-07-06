import type { Locale } from '@/lib/locales';

export type InspectorLayoutViewport = 'desktop' | 'tablet' | 'mobile';

export type InspectorDeviceVisibilityCopy = {
  label: string;
  visibleLabel: string;
  hiddenLabel: string;
  toggleActionLabel: string;
  currentEditingLabel: string;
  ariaLabel: (deviceLabel: string, visible: boolean) => string;
  title: (deviceLabel: string, visible: boolean, isActiveViewport: boolean) => string;
};

export type SandboxInspectorLayoutTabCopy = {
  deviceLabels: Record<InspectorLayoutViewport, string>;
  viewportLabel: string;
  viewportGroupAriaLabel: string;
  viewportDesktopHelper: string;
  viewportOverrideCreatedHelper: string;
  viewportInheritedHelper: string;
  overrideBadgeLabel: string;
  overrideCreatedLabel: string;
  overrideEditingLabel: string;
  overrideInheritedNote: string;
  resetViewportTitle: (viewportLabel: string) => string;
  resetViewportLabel: (viewportLabel: string) => string;
  hiddenOverrideExists: (viewportLabel: string) => string;
  hiddenAtViewportWarning: (viewportLabel: string) => string;
  fieldTitle: (label: string, viewportLabel: string) => string;
  fieldValueAriaLabel: (label: string) => string;
  xLabel: string;
  yLabel: string;
  widthLabel: string;
  heightLabel: string;
  fontSizeLabel: string;
  flowLayoutNotice: string;
  rotationLabel: string;
  stateSectionLabel: string;
  stateSectionTitle: string;
  lockLabel: string;
  visibleLabel: string;
  pinLabel: string;
  stickyOffsetLabel: string;
  pinFromLabel: string;
  pinFromAriaLabel: string;
  pinTopLabel: string;
  pinBottomLabel: string;
  anchorNameLabel: string;
  anchorPlaceholder: string;
  anchorLinkPrefix: string;
  anchorHelp: string;
  deviceVisibility: InspectorDeviceVisibilityCopy;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxInspectorLayoutTabCopy> = {
  ko: {
    deviceLabels: {
      desktop: '데스크톱',
      tablet: '태블릿',
      mobile: '모바일',
    },
    viewportLabel: '뷰포트',
    viewportGroupAriaLabel: '인스펙터 뷰포트',
    viewportDesktopHelper: '데스크톱이 기준 레이아웃입니다.',
    viewportOverrideCreatedHelper: '이 뷰포트에 오버라이드가 생성되었습니다.',
    viewportInheritedHelper: '값을 편집하기 전까지 데스크톱 값을 상속합니다.',
    overrideBadgeLabel: '오버라이드',
    overrideCreatedLabel: '오버라이드 생성됨',
    overrideEditingLabel: '뷰포트 오버라이드 편집 중',
    overrideInheritedNote: '오버라이드 미설정 - 데스크톱 값 표시',
    resetViewportTitle: (viewportLabel) => `${viewportLabel} 뷰포트의 오버라이드를 모두 제거합니다`,
    resetViewportLabel: (viewportLabel) => `${viewportLabel} 초기화`,
    hiddenOverrideExists: (viewportLabel) => `${viewportLabel}에 숨김 오버라이드가 있습니다.`,
    hiddenAtViewportWarning: (viewportLabel) => `${viewportLabel}에서 숨김 처리되어 캔버스/미리보기에서 보이지 않습니다.`,
    fieldTitle: (label, viewportLabel) => `${label} (${viewportLabel})`,
    fieldValueAriaLabel: (label) => `${label} 값`,
    xLabel: 'X',
    yLabel: 'Y',
    widthLabel: '너비',
    heightLabel: '높이',
    fontSizeLabel: '글자 크기',
    flowLayoutNotice: '이 요소는 부모의 Flow 레이아웃(flex / grid)을 따릅니다. X/Y 위치는 무시됩니다.',
    rotationLabel: '회전',
    stateSectionLabel: '상태',
    stateSectionTitle: '표시 및 잠금',
    lockLabel: '잠금',
    visibleLabel: '표시',
    pinLabel: '고정',
    stickyOffsetLabel: '고정 오프셋',
    pinFromLabel: '고정 기준',
    pinFromAriaLabel: '고정 기준',
    pinTopLabel: '위쪽',
    pinBottomLabel: '아래쪽',
    anchorNameLabel: '앵커 이름',
    anchorPlaceholder: '예: about, services',
    anchorLinkPrefix: '링크',
    anchorHelp: '영문 소문자, 숫자, 하이픈만. 버튼 href에 #name으로 연결.',
    deviceVisibility: {
      label: '표시 기기',
      visibleLabel: '보임',
      hiddenLabel: '숨김',
      toggleActionLabel: '클릭하여 토글',
      currentEditingLabel: '현재 편집 중',
      ariaLabel: (deviceLabel, visible) => `${deviceLabel}에서 ${visible ? '보임' : '숨김'} (클릭하여 토글)`,
      title: (deviceLabel, visible, isActiveViewport) =>
        `${deviceLabel} · ${visible ? '보임' : '숨김'}\n클릭하여 토글${isActiveViewport ? ' (현재 편집 중)' : ''}`,
    },
  },
  'zh-hant': {
    deviceLabels: {
      desktop: '桌面',
      tablet: '平板',
      mobile: '手機',
    },
    viewportLabel: '視窗',
    viewportGroupAriaLabel: '檢查器視窗',
    viewportDesktopHelper: '桌面是來源版面配置。',
    viewportOverrideCreatedHelper: '此視窗已建立覆寫。',
    viewportInheritedHelper: '編輯數值前會繼承桌面設定。',
    overrideBadgeLabel: '覆寫',
    overrideCreatedLabel: '已建立覆寫',
    overrideEditingLabel: '正在編輯視窗覆寫',
    overrideInheritedNote: '尚未設定覆寫 - 顯示桌面值',
    resetViewportTitle: (viewportLabel) => `移除 ${viewportLabel} 視窗的所有覆寫`,
    resetViewportLabel: (viewportLabel) => `重設 ${viewportLabel}`,
    hiddenOverrideExists: (viewportLabel) => `${viewportLabel} 已有隱藏覆寫。`,
    hiddenAtViewportWarning: (viewportLabel) => `${viewportLabel} 已設為隱藏，因此不會出現在畫布或預覽中。`,
    fieldTitle: (label, viewportLabel) => `${label}（${viewportLabel}）`,
    fieldValueAriaLabel: (label) => `${label}值`,
    xLabel: 'X',
    yLabel: 'Y',
    widthLabel: '寬度',
    heightLabel: '高度',
    fontSizeLabel: '字級',
    flowLayoutNotice: '此元素會依照父層的 Flow 版面配置（flex / grid）排列。X/Y 位置會被忽略。',
    rotationLabel: '旋轉',
    stateSectionLabel: '狀態',
    stateSectionTitle: '顯示與鎖定',
    lockLabel: '鎖定',
    visibleLabel: '顯示',
    pinLabel: '固定',
    stickyOffsetLabel: '固定偏移',
    pinFromLabel: '固定基準',
    pinFromAriaLabel: '固定基準',
    pinTopLabel: '上方',
    pinBottomLabel: '下方',
    anchorNameLabel: '錨點名稱',
    anchorPlaceholder: '例如 about, services',
    anchorLinkPrefix: '連結',
    anchorHelp: '僅可使用英文小寫、數字與連字號。請在按鈕 href 中用 #name 連結。',
    deviceVisibility: {
      label: '顯示裝置',
      visibleLabel: '顯示',
      hiddenLabel: '隱藏',
      toggleActionLabel: '點選以切換',
      currentEditingLabel: '目前編輯中',
      ariaLabel: (deviceLabel, visible) => `${deviceLabel}目前${visible ? '顯示' : '隱藏'}（點選以切換）`,
      title: (deviceLabel, visible, isActiveViewport) =>
        `${deviceLabel} · ${visible ? '顯示' : '隱藏'}\n點選以切換${isActiveViewport ? '（目前編輯中）' : ''}`,
    },
  },
  en: {
    deviceLabels: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
    },
    viewportLabel: 'Viewport',
    viewportGroupAriaLabel: 'Inspector viewport',
    viewportDesktopHelper: 'Desktop is the source layout.',
    viewportOverrideCreatedHelper: 'Override created for this viewport.',
    viewportInheritedHelper: 'Inherits desktop until you edit a value.',
    overrideBadgeLabel: 'override',
    overrideCreatedLabel: 'Override created',
    overrideEditingLabel: 'Editing viewport override',
    overrideInheritedNote: 'Override not set - showing desktop values',
    resetViewportTitle: (viewportLabel) => `Remove all overrides for the ${viewportLabel} viewport`,
    resetViewportLabel: (viewportLabel) => `Reset ${viewportLabel}`,
    hiddenOverrideExists: (viewportLabel) => `Hidden override exists for ${viewportLabel}.`,
    hiddenAtViewportWarning: (viewportLabel) => `${viewportLabel} is hidden and will not appear on the canvas or preview.`,
    fieldTitle: (label, viewportLabel) => `${label} (${viewportLabel})`,
    fieldValueAriaLabel: (label) => `${label} value`,
    xLabel: 'X',
    yLabel: 'Y',
    widthLabel: 'Width',
    heightLabel: 'Height',
    fontSizeLabel: 'Font size',
    flowLayoutNotice: 'This element follows its parent Flow layout (flex / grid). X/Y position is ignored.',
    rotationLabel: 'Rotation',
    stateSectionLabel: 'State',
    stateSectionTitle: 'Visibility and lock',
    lockLabel: 'Lock',
    visibleLabel: 'Visible',
    pinLabel: 'Pin',
    stickyOffsetLabel: 'Sticky offset',
    pinFromLabel: 'Pin from',
    pinFromAriaLabel: 'Pin from',
    pinTopLabel: 'Top',
    pinBottomLabel: 'Bottom',
    anchorNameLabel: 'Anchor name',
    anchorPlaceholder: 'e.g. about, services',
    anchorLinkPrefix: 'Link',
    anchorHelp: 'Use lowercase letters, numbers, and hyphens only. Link buttons with #name in the href.',
    deviceVisibility: {
      label: 'Show on devices',
      visibleLabel: 'visible',
      hiddenLabel: 'hidden',
      toggleActionLabel: 'Click to toggle',
      currentEditingLabel: 'currently editing',
      ariaLabel: (deviceLabel, visible) => `${deviceLabel} is ${visible ? 'visible' : 'hidden'} (click to toggle)`,
      title: (deviceLabel, visible, isActiveViewport) =>
        `${deviceLabel} · ${visible ? 'visible' : 'hidden'}\nClick to toggle${isActiveViewport ? ' (currently editing)' : ''}`,
    },
  },
};

export function getSandboxInspectorLayoutTabCopy(locale: Locale): SandboxInspectorLayoutTabCopy {
  return COPY[locale] ?? COPY.en;
}
