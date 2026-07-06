import type { Locale } from '@/lib/locales';

type TopBarSaveState = 'idle' | 'saving' | 'saved' | 'error';
type TopBarViewportMode = 'desktop' | 'tablet' | 'mobile';
type TopBarMemberPreviewMode = 'signed-out' | 'free' | 'premium' | 'admin';

export interface SandboxTopBarCopy {
  siteSettingsTitle: string;
  defaultSiteName: string;
  pageSelectTitle: string;
  pageControlLabel: string;
  homePageLabel: string;
  localeFallbackLabel: (locale: string) => string;
  quickJumpSelectTitle: string;
  quickJumpSelectLabel: string;
  quickJumpSelectPlaceholder: string;
  quickJumpButtonTitle: string;
  quickJumpButtonLabel: string;
  memberPreviewTitle: string;
  memberPreviewLabel: string;
  memberPreviewAriaLabel: string;
  memberPreviewLabels: Record<TopBarMemberPreviewMode, string>;
  collaborationLabel: string;
  presenceActiveLabel: (count: number) => string;
  presenceTitle: (count: number, names: string[]) => string;
  viewportGroupAriaLabel: string;
  viewportLabels: Record<TopBarViewportMode, string>;
  viewportTitle: (label: string, width: number) => string;
  responsiveResetTitle: (viewportLabel: string) => string;
  responsiveResetDisabledTitle: string;
  responsiveResetLabel: string;
  responsivePageResetTitle: (viewportLabel: string) => string;
  responsivePageResetDisabledTitle: string;
  responsivePageResetLabel: string;
  responsiveAiTitle: (viewportLabel: string) => string;
  responsiveAiDisabledTitle: string;
  responsiveAiLabel: string;
  responsiveOverrideBadgeLabel: string;
  responsiveOverrideBadgeTitle: (viewportLabel: string) => string;
  selectionCountLabel: (count: number) => string;
  saveStateLabels: Record<TopBarSaveState, string>;
  saveBlockedLabel: string;
  historyTitle: string;
  historyLabel: string;
  previewTitle: string;
  previewLabel: string;
  seoTitle: string;
  publishTitle: string;
  publishLabel: string;
  quickJumpModalTitle: string;
  quickJumpModalDescription: string;
  quickJumpModalAriaLabel: string;
  quickJumpModalCloseAriaLabel: string;
  quickJumpSearchPlaceholder: string;
  quickJumpSearchAriaLabel: string;
  quickJumpEmptyState: string;
}

const COPY: Record<Locale, SandboxTopBarCopy> = {
  ko: {
    siteSettingsTitle: '사이트 설정',
    defaultSiteName: '호정국제',
    pageSelectTitle: '페이지 선택',
    pageControlLabel: '페이지',
    homePageLabel: '홈',
    localeFallbackLabel: (locale) => `locale: ${locale}`,
    quickJumpSelectTitle: '다른 관리 화면으로 이동',
    quickJumpSelectLabel: '바로가기',
    quickJumpSelectPlaceholder: '이동...',
    quickJumpButtonTitle: '빠른 이동 (Cmd/Ctrl+K)',
    quickJumpButtonLabel: '빠른 이동',
    memberPreviewTitle: '멤버 메뉴 미리보기',
    memberPreviewLabel: '멤버',
    memberPreviewAriaLabel: '멤버 메뉴 미리보기',
    memberPreviewLabels: {
      'signed-out': '방문자',
      free: '무료',
      premium: '프리미엄',
      admin: '관리자',
    },
    collaborationLabel: '협업',
    presenceActiveLabel: (count) => `${count}명 접속 중`,
    presenceTitle: (count, names) => {
      const suffix = names.length > 0 ? `: ${names.join(', ')}` : '';
      return `현재 이 페이지를 보는 편집자 ${count}명${suffix}`;
    },
    viewportGroupAriaLabel: '뷰포트 브레이크포인트 전환',
    viewportLabels: {
      desktop: '데스크톱',
      tablet: '태블릿',
      mobile: '모바일',
    },
    viewportTitle: (label, width) => `${label} (${width}px)`,
    responsiveResetTitle: (viewportLabel) => `${viewportLabel} 반응형 오버라이드 초기화`,
    responsiveResetDisabledTitle: '태블릿/모바일에서 노드를 선택하면 초기화할 수 있습니다',
    responsiveResetLabel: '초기화',
    responsivePageResetTitle: (viewportLabel) => `현재 페이지의 ${viewportLabel} 오버라이드 전체 초기화`,
    responsivePageResetDisabledTitle: '현재 페이지에 초기화할 태블릿/모바일 오버라이드가 없습니다',
    responsivePageResetLabel: '페이지',
    responsiveAiTitle: (viewportLabel) => `${viewportLabel} 반응형 AI 제안 열기`,
    responsiveAiDisabledTitle: '태블릿 또는 모바일 뷰포트에서 반응형 AI를 사용할 수 있습니다',
    responsiveAiLabel: 'AI',
    responsiveOverrideBadgeLabel: '오버라이드',
    responsiveOverrideBadgeTitle: (viewportLabel) => `${viewportLabel} 오버라이드 활성`,
    selectionCountLabel: (count) => `${count}개 선택됨`,
    saveStateLabels: {
      idle: '',
      saving: '저장 중...',
      saved: '저장됨',
      error: '저장 실패',
    },
    saveBlockedLabel: '저장 차단',
    historyTitle: '버전 히스토리',
    historyLabel: '히스토리',
    previewTitle: '미리보기',
    previewLabel: '미리보기',
    seoTitle: '현재 페이지 SEO',
    publishTitle: '사이트 발행',
    publishLabel: '발행',
    quickJumpModalTitle: '관리 화면 빠른 이동',
    quickJumpModalDescription: '최근 이동과 전체 관리 화면을 검색해서 바로 이동합니다.',
    quickJumpModalAriaLabel: '관리 화면 빠른 이동',
    quickJumpModalCloseAriaLabel: '닫기',
    quickJumpSearchPlaceholder: '예: ops, sdk, backup',
    quickJumpSearchAriaLabel: '관리 화면 검색',
    quickJumpEmptyState: '결과가 없습니다.',
  },
  'zh-hant': {
    siteSettingsTitle: '網站設定',
    defaultSiteName: '浩正國際',
    pageSelectTitle: '選擇頁面',
    pageControlLabel: '頁面',
    homePageLabel: '首頁',
    localeFallbackLabel: (locale) => `語系: ${locale}`,
    quickJumpSelectTitle: '前往其他管理畫面',
    quickJumpSelectLabel: '捷徑',
    quickJumpSelectPlaceholder: '前往...',
    quickJumpButtonTitle: '快速前往 (Cmd/Ctrl+K)',
    quickJumpButtonLabel: '快速前往',
    memberPreviewTitle: '會員選單預覽',
    memberPreviewLabel: '會員',
    memberPreviewAriaLabel: '會員選單預覽',
    memberPreviewLabels: {
      'signed-out': '訪客',
      free: '免費會員',
      premium: '進階會員',
      admin: '管理員',
    },
    collaborationLabel: '協作',
    presenceActiveLabel: (count) => `${count} 人在線`,
    presenceTitle: (count, names) => {
      const suffix = names.length > 0 ? `: ${names.join(', ')}` : '';
      return `目前正在看此頁面的編輯者 ${count} 人${suffix}`;
    },
    viewportGroupAriaLabel: '切換視窗斷點',
    viewportLabels: {
      desktop: '桌面',
      tablet: '平板',
      mobile: '手機',
    },
    viewportTitle: (label, width) => `${label} (${width}px)`,
    responsiveResetTitle: (viewportLabel) => `重設 ${viewportLabel} 響應式覆寫`,
    responsiveResetDisabledTitle: '在平板或手機視窗選取節點後即可重設',
    responsiveResetLabel: '重設',
    responsivePageResetTitle: (viewportLabel) => `重設目前頁面的所有 ${viewportLabel} 覆寫`,
    responsivePageResetDisabledTitle: '目前頁面沒有可重設的平板或手機覆寫',
    responsivePageResetLabel: '頁面',
    responsiveAiTitle: (viewportLabel) => `開啟 ${viewportLabel} 響應式 AI 建議`,
    responsiveAiDisabledTitle: '切換到平板或手機視窗後即可使用響應式 AI',
    responsiveAiLabel: 'AI',
    responsiveOverrideBadgeLabel: '覆寫',
    responsiveOverrideBadgeTitle: (viewportLabel) => `${viewportLabel} 覆寫已啟用`,
    selectionCountLabel: (count) => `已選取 ${count} 個`,
    saveStateLabels: {
      idle: '',
      saving: '儲存中...',
      saved: '已儲存',
      error: '儲存失敗',
    },
    saveBlockedLabel: '儲存受阻',
    historyTitle: '版本記錄',
    historyLabel: '記錄',
    previewTitle: '預覽',
    previewLabel: '預覽',
    seoTitle: '目前頁面 SEO',
    publishTitle: '發布網站',
    publishLabel: '發布',
    quickJumpModalTitle: '快速前往管理畫面',
    quickJumpModalDescription: '搜尋最近瀏覽與所有管理畫面，直接前往目標頁面。',
    quickJumpModalAriaLabel: '快速前往管理畫面',
    quickJumpModalCloseAriaLabel: '關閉',
    quickJumpSearchPlaceholder: '例如: ops, sdk, backup',
    quickJumpSearchAriaLabel: '搜尋管理畫面',
    quickJumpEmptyState: '沒有結果。',
  },
  en: {
    siteSettingsTitle: 'Site settings',
    defaultSiteName: 'Tseng Law',
    pageSelectTitle: 'Select page',
    pageControlLabel: 'Page',
    homePageLabel: 'Home',
    localeFallbackLabel: (locale) => `locale: ${locale}`,
    quickJumpSelectTitle: 'Go to another admin screen',
    quickJumpSelectLabel: 'Shortcut',
    quickJumpSelectPlaceholder: 'Go to...',
    quickJumpButtonTitle: 'Quick jump (Cmd/Ctrl+K)',
    quickJumpButtonLabel: 'Quick jump',
    memberPreviewTitle: 'Member menu preview',
    memberPreviewLabel: 'Member',
    memberPreviewAriaLabel: 'Member menu preview',
    memberPreviewLabels: {
      'signed-out': 'Visitor',
      free: 'Free',
      premium: 'Premium',
      admin: 'Admin',
    },
    collaborationLabel: 'Collab',
    presenceActiveLabel: (count) => `${count} online`,
    presenceTitle: (count, names) => {
      const suffix = names.length > 0 ? `: ${names.join(', ')}` : '';
      return `${count} editor${count === 1 ? '' : 's'} on this page${suffix}`;
    },
    viewportGroupAriaLabel: 'Viewport breakpoint switcher',
    viewportLabels: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
    },
    viewportTitle: (label, width) => `${label} (${width}px)`,
    responsiveResetTitle: (viewportLabel) => `Reset ${viewportLabel} responsive override`,
    responsiveResetDisabledTitle: 'Select a node in tablet or mobile to reset an override',
    responsiveResetLabel: 'Reset',
    responsivePageResetTitle: (viewportLabel) => `Reset every ${viewportLabel} override on this page`,
    responsivePageResetDisabledTitle: 'This page has no tablet or mobile overrides to reset',
    responsivePageResetLabel: 'Page',
    responsiveAiTitle: (viewportLabel) => `Open ${viewportLabel} Responsive AI suggestions`,
    responsiveAiDisabledTitle: 'Responsive AI is available in tablet or mobile viewports',
    responsiveAiLabel: 'AI',
    responsiveOverrideBadgeLabel: 'override',
    responsiveOverrideBadgeTitle: (viewportLabel) => `${viewportLabel} override active`,
    selectionCountLabel: (count) => `${count} selected`,
    saveStateLabels: {
      idle: '',
      saving: 'Saving...',
      saved: 'Saved',
      error: 'Save failed',
    },
    saveBlockedLabel: 'Save blocked',
    historyTitle: 'Version history',
    historyLabel: 'History',
    previewTitle: 'Preview',
    previewLabel: 'Preview',
    seoTitle: 'Current page SEO',
    publishTitle: 'Publish site',
    publishLabel: 'Publish',
    quickJumpModalTitle: 'Quick jump to admin',
    quickJumpModalDescription: 'Search recent destinations and every admin screen, then go directly to the page.',
    quickJumpModalAriaLabel: 'Quick jump to admin',
    quickJumpModalCloseAriaLabel: 'Close',
    quickJumpSearchPlaceholder: 'e.g. ops, sdk, backup',
    quickJumpSearchAriaLabel: 'Search admin screens',
    quickJumpEmptyState: 'No results.',
  },
};

export function getSandboxTopBarCopy(locale: Locale): SandboxTopBarCopy {
  return COPY[locale] ?? COPY.ko;
}
