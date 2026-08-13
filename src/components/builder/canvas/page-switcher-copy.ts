import type { Locale } from '@/lib/locales';

export type PageSwitcherMemberAccessMode = 'public' | 'member' | 'premium';
export type PageSwitcherDynamicCollectionId = 'columns' | 'service-areas' | 'attorney-profiles';
export type PageSwitcherMemberStarterHeroCopy = {
  heading: string;
  body: string;
  ctaLabel: string;
};
export type PageSwitcherMemberStarterWidgetCopy = {
  loginSubtitle: string;
  accountSubtitle: string;
  profileTitle: string;
  profileSubtitle: string;
  bookingsSubtitle: string;
  loginLabel: string;
  profileLabel: string;
  bookingsLabel: string;
  premiumLabel: string;
  nameLabel: string;
  phoneLabel: string;
  saveProfileLabel: string;
  savingLabel: string;
  savedLabel: string;
  upcomingBookingsLabel: string;
  pastBookingsLabel: string;
  emptyUpcomingBookingsLabel: string;
  emptyPastBookingsLabel: string;
};

export type PageSwitcherCopy = {
  networkErrorToast: string;
  fetchPagesError: string;
  drawerTitle: string;
  addPageButtonLabel: string;
  addPageBusyLabel: string;
  clipboardCountLabel: (count: number) => string;
  homeBadge: string;
  publishedTitle: string;
  draftTitle: string;
  unpublishedChangesBadge: string;
  untitled: string;
  nestedBadge: string;
  dynamicBadge: string;
  treeLoadingLabel: string;
  pageOrderAriaLabel: string;
  pageOrderHandleTitle: string;
  pageMenuAriaLabel: string;
  menuRename: string;
  menuAddChild: string;
  menuMoveUp: string;
  menuMoveDown: string;
  menuDelete: string;
  renameTitleAriaLabel: string;
  renameTitlePlaceholder: string;
  renameSlugAriaLabel: string;
  renameSlugPlaceholder: string;
  renameRedirectLabel: string;
  renameRedirectDescription: (fromPath: string) => string;
  renameDynamicRedirectDescription: string;
  renameRedirectConflictHint: string;
  renameBusyHint: string;
  renameIdleHint: string;
  pageTitleRequiredError: string;
  savePageNameError: string;
  deleteConfirm: string;
  deletePageError: string;
  createPageError: string;
  createMissingPageError: string;
  createDynamicListPageError: string;
  createDynamicItemPageError: string;
  saveMemberAccessError: string;
  memberAccessSaved: string;
  savePageOrderError: string;
  pageOrderSaved: string;
  redirectWarning: (from: string, message: string) => string;
  memberAccessGroup: string;
  memberAccessSettings: string;
  memberAccessBadgeLabels: Record<Exclude<PageSwitcherMemberAccessMode, 'public'>, string>;
  memberAccessModeLabels: Record<PageSwitcherMemberAccessMode, string>;
  memberAccessDialogLabel: string;
  memberAccessDialogTitle: string;
  memberAccessDialogDescription: (slug: string) => string;
  memberAccessModeLabel: string;
  memberAccessRedirectLabel: string;
  memberAccessRedirectOptions: (locale: Locale) => Array<{ value: string; label: string }>;
  memberAccessCustomRedirectLabel: string;
  memberAccessCustomRedirectHint: string;
  memberAccessPagePickerLabel: string;
  memberAccessPageSearchPlaceholder: string;
  memberAccessPageChoicesLabel: string;
  memberAccessNoMatchingPages: string;
  cancel: string;
  save: string;
  saving: string;
  slugPromptDialogLabel: string;
  slugPromptTitle: string;
  slugPromptTemplateDescription: string;
  slugPromptBlankDescription: string;
  slugPromptPlaceholder: string;
  missingPageCardLabel: string;
  missingPageTitle: string;
  missingPageDescription: string;
  missingPageCreateLabel: (title: string) => string;
  missingPageTitleForSlug: (slug: string) => string;
  memberStarterEyebrow: string;
  memberStarterHeroForSlug: (slug: string) => PageSwitcherMemberStarterHeroCopy;
  memberStarterSetupTitle: string;
  memberStarterSetupCopy: string;
  memberStarterWidgetCopy: PageSwitcherMemberStarterWidgetCopy;
  columnsQuickAriaLabel: string;
  columnsQuickTitle: string;
  columnsQuickLoading: string;
  columnsQuickCountLabel: (count: number) => string;
  columnsQuickEditPostLabel: (title: string) => string;
  columnsQuickGoToPage: string;
  columnsQuickManage: string;
  columnsQuickNewPost: string;
  dynamicQuickAriaLabel: string;
  dynamicQuickTitle: string;
  dynamicQuickMeta: string;
  dynamicQuickColumnList: string;
  dynamicQuickServiceList: string;
  dynamicQuickAttorneyList: string;
  dynamicQuickColumnDetail: string;
  dynamicQuickServiceDetail: string;
  dynamicQuickAttorneyDetail: string;
  dynamicListPageTitle: (collectionId: PageSwitcherDynamicCollectionId, token: string) => string;
  dynamicItemPageTitle: (collectionId: PageSwitcherDynamicCollectionId, token: string) => string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  emptyStateCreateFirst: string;
  addToNavigationLabel: string;
  addToNavigationHint: string;
  chooseAnotherTemplate: string;
  create: string;
  creating: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', PageSwitcherCopy> = {
  ko: {
    networkErrorToast: '네트워크 오류, 다시 시도해주세요',
    fetchPagesError: '페이지 목록을 불러오지 못했습니다.',
    drawerTitle: '페이지',
    addPageButtonLabel: '+ 새 페이지',
    addPageBusyLabel: '...',
    clipboardCountLabel: (count) => `${count}개 요소 클립보드`,
    homeBadge: '대표',
    publishedTitle: '발행됨',
    draftTitle: '초안',
    unpublishedChangesBadge: '미발행 변경',
    untitled: '제목 없음',
    nestedBadge: '하위',
    dynamicBadge: 'CMS',
    treeLoadingLabel: '불러오는 중...',
    pageOrderAriaLabel: '페이지 순서 이동',
    pageOrderHandleTitle: '드래그하거나 ArrowUp/ArrowDown 키로 순서를 바꾸세요',
    pageMenuAriaLabel: '페이지 메뉴',
    menuRename: '이름 변경',
    menuAddChild: '하위 페이지 추가',
    menuMoveUp: '위로 이동',
    menuMoveDown: '아래로 이동',
    menuDelete: '삭제',
    renameTitleAriaLabel: '페이지 이름',
    renameTitlePlaceholder: '관리자에 표시할 이름 · 예: 회사소개',
    renameSlugAriaLabel: '페이지 slug',
    renameSlugPlaceholder: '영문 소문자·하이픈 · 예: about, services/pricing',
    renameRedirectLabel: '301 redirect 생성',
    renameRedirectDescription: (fromPath) => `저장 시 ${fromPath} 에서 새 URL로 이동합니다.`,
    renameDynamicRedirectDescription: 'CMS 레코드 상세 URL은 /old/* 에서 /new/* 로 함께 이동합니다.',
    renameRedirectConflictHint: '기존 redirect 규칙이 같은 URL을 쓰면 페이지는 저장되고 redirect만 건너뜁니다.',
    renameBusyHint: '저장 중...',
    renameIdleHint: 'Enter 저장 · Esc 취소',
    pageTitleRequiredError: '페이지 이름은 비워둘 수 없습니다.',
    savePageNameError: '페이지 이름을 저장하지 못했습니다.',
    deleteConfirm: '정말 삭제하시겠습니까?',
    deletePageError: '페이지를 삭제하지 못했습니다.',
    createPageError: '페이지를 생성하지 못했습니다.',
    createMissingPageError: '누락된 페이지를 생성하지 못했습니다.',
    createDynamicListPageError: '동적 리스트 페이지를 생성하지 못했습니다.',
    createDynamicItemPageError: '동적 상세 페이지를 생성하지 못했습니다.',
    saveMemberAccessError: '페이지 권한을 저장하지 못했습니다.',
    memberAccessSaved: '페이지 권한을 저장했습니다.',
    savePageOrderError: '페이지 순서를 저장하지 못했습니다.',
    pageOrderSaved: '페이지 순서를 저장했습니다.',
    redirectWarning: (from, message) => `페이지는 저장됐지만 ${from} redirect는 생성되지 않았습니다. 기존 redirect 규칙을 확인하세요. (${message})`,
    memberAccessGroup: '회원 권한',
    memberAccessSettings: '권한 상세 설정',
    memberAccessBadgeLabels: {
      member: '회원',
      premium: '프리미엄',
    },
    memberAccessModeLabels: {
      public: '공개',
      member: '로그인 필요',
      premium: 'Premium/Admin',
    },
    memberAccessDialogLabel: '회원 권한 설정',
    memberAccessDialogTitle: '회원 권한 설정',
    memberAccessDialogDescription: (slug) => `/${slug} 페이지의 공개 범위와 접근 실패 redirect를 설정합니다.`,
    memberAccessModeLabel: '공개 범위',
    memberAccessRedirectLabel: '접근 실패 redirect',
    memberAccessRedirectOptions: (locale) => [
      { value: `/${locale}/login`, label: '로그인 페이지' },
      { value: `/${locale}/account`, label: '계정 페이지' },
      { value: `/${locale}/contact`, label: '문의 페이지' },
    ],
    memberAccessCustomRedirectLabel: '직접 redirect path',
    memberAccessCustomRedirectHint: '/로 시작하는 내부 경로만 저장됩니다.',
    memberAccessPagePickerLabel: '페이지에서 선택',
    memberAccessPageSearchPlaceholder: '페이지 이름 또는 경로로 검색 · 예: about',
    memberAccessPageChoicesLabel: 'Redirect 페이지 선택지',
    memberAccessNoMatchingPages: '일치하는 페이지가 없습니다.',
    cancel: '취소',
    save: '저장',
    saving: '저장 중...',
    slugPromptDialogLabel: '페이지 slug 입력',
    slugPromptTitle: '페이지 주소 입력',
    slugPromptTemplateDescription: '선택한 템플릿으로 새 페이지를 생성합니다.',
    slugPromptBlankDescription: '빈 페이지를 생성합니다. 하위 페이지는 parent/child 형식으로 만들 수 있습니다.',
    slugPromptPlaceholder: '영문 소문자·하이픈 · 예: about, services, columns/taiwan-guide',
    missingPageCardLabel: '누락된 페이지 생성',
    missingPageTitle: '페이지 없음',
    missingPageDescription: '선택한 header/member 링크가 아직 빌더 페이지와 연결되지 않았습니다.',
    missingPageCreateLabel: (title) => `${title} 페이지 만들기`,
    missingPageTitleForSlug: (slug) => {
      if (slug === 'login') return '로그인';
      if (slug === 'account') return '내 계정';
      if (slug === 'account/profile') return '회원 프로필';
      if (slug === 'account/bookings') return '내 예약';
      if (slug === 'account/premium') return '프리미엄';
      return '제목 없음';
    },
    memberStarterEyebrow: '회원 영역',
    memberStarterHeroForSlug: (slug) => {
      if (slug === 'login') {
        return {
          heading: '회원 로그인',
          body: '방문자가 계정으로 로그인하고 전용 자료와 사건 진행 상태로 이동할 수 있는 멤버 시작 페이지입니다.',
          ctaLabel: '로그인 폼 연결',
        };
      }
      if (slug === 'account') {
        return {
          heading: '내 계정',
          body: '회원 전용 안내, 문의 이력, 저장한 자료로 연결되는 계정 대시보드의 시작 레이아웃입니다.',
          ctaLabel: '상담 기록 연결',
        };
      }
      if (slug === 'account/profile') {
        return {
          heading: '회원 프로필',
          body: '회원이 자신의 이름과 연락처를 직접 확인하고 수정할 수 있는 프로필 편집 시작 레이아웃입니다.',
          ctaLabel: '계정 대시보드 연결',
        };
      }
      if (slug === 'account/bookings') {
        return {
          heading: '내 예약',
          body: '회원 이메일과 일치하는 다가오는 상담 예약과 지난 예약을 보여주는 시작 레이아웃입니다.',
          ctaLabel: '계정 대시보드 연결',
        };
      }
      return {
        heading: '프리미엄 멤버십',
        body: '승인된 프리미엄 멤버에게만 보여줄 혜택, 자료, 상담 옵션을 안내하는 시작 레이아웃입니다.',
        ctaLabel: '프리미엄 상담 연결',
      };
    },
    memberStarterSetupTitle: '다음 설정',
    memberStarterSetupCopy: '- 멤버 로그인/계정 앱 위젯 배치\n- 페이지 권한을 회원 전용으로 연결\n- 로그인 후 이동 경로와 CTA 확인',
    memberStarterWidgetCopy: {
      loginSubtitle: '회원 계정은 담당자가 확인 후 발급합니다. 기존 회원은 로그인해 주세요.',
      accountSubtitle: '회원 정보, 프로필, 예약, 프리미엄 영역을 한 화면에서 안내합니다.',
      profileTitle: '프로필 정보',
      profileSubtitle: '회원이 직접 이름과 전화번호를 저장할 수 있는 기본 프로필 폼입니다.',
      bookingsSubtitle: '회원 이메일로 연결된 상담 예약을 자동으로 불러옵니다.',
      loginLabel: '로그인',
      profileLabel: '프로필',
      bookingsLabel: '예약',
      premiumLabel: '프리미엄',
      nameLabel: '이름',
      phoneLabel: '전화번호',
      saveProfileLabel: '프로필 저장',
      savingLabel: '저장 중...',
      savedLabel: '저장되었습니다.',
      upcomingBookingsLabel: '다가오는 예약',
      pastBookingsLabel: '지난 예약',
      emptyUpcomingBookingsLabel: '예정된 예약이 없습니다.',
      emptyPastBookingsLabel: '지난 예약 내역이 없습니다.',
    },
    columnsQuickAriaLabel: '칼럼 빠른 이동',
    columnsQuickTitle: '칼럼',
    columnsQuickLoading: '불러오는 중...',
    columnsQuickCountLabel: (count) => `게시글 ${count}개`,
    columnsQuickEditPostLabel: (title) => `수정 · ${title}`,
    columnsQuickGoToPage: '칼럼 페이지로 이동',
    columnsQuickManage: '칼럼 관리',
    columnsQuickNewPost: '새 글 쓰기',
    dynamicQuickAriaLabel: '동적 리스트 페이지 만들기',
    dynamicQuickTitle: 'CMS 동적 리스트',
    dynamicQuickMeta: 'draft page',
    dynamicQuickColumnList: '칼럼 리스트',
    dynamicQuickServiceList: '서비스 리스트',
    dynamicQuickAttorneyList: '변호사 리스트',
    dynamicQuickColumnDetail: '칼럼 상세',
    dynamicQuickServiceDetail: '서비스 상세',
    dynamicQuickAttorneyDetail: '변호사 상세',
    dynamicListPageTitle: (collectionId, token) => (
      collectionId === 'columns'
        ? `칼럼 동적 리스트 ${token}`
        : collectionId === 'attorney-profiles'
          ? `변호사 동적 리스트 ${token}`
          : `서비스 동적 리스트 ${token}`
    ),
    dynamicItemPageTitle: (collectionId, token) => (
      collectionId === 'columns'
        ? `칼럼 동적 상세 ${token}`
        : collectionId === 'attorney-profiles'
          ? `변호사 동적 상세 ${token}`
          : `서비스 동적 상세 ${token}`
    ),
    emptyStateTitle: '페이지가 없습니다.',
    emptyStateDescription: '새 페이지를 만들거나 템플릿으로 시작하세요.',
    emptyStateCreateFirst: '첫 페이지 만들기',
    addToNavigationLabel: '메뉴에 추가',
    addToNavigationHint: '생성한 페이지를 사이트 상단 메뉴에 바로 연결합니다.',
    chooseAnotherTemplate: '다른 템플릿 선택',
    create: '생성',
    creating: '생성 중...',
  },
  'zh-hant': {
    networkErrorToast: '網路錯誤，請再試一次',
    fetchPagesError: '無法載入頁面列表。',
    drawerTitle: '頁面',
    addPageButtonLabel: '+ 新增',
    addPageBusyLabel: '...',
    clipboardCountLabel: (count) => `剪貼簿中有 ${count} 個元素`,
    homeBadge: '主頁',
    publishedTitle: '已發佈',
    draftTitle: '草稿',
    unpublishedChangesBadge: '未發佈變更',
    untitled: '未命名',
    nestedBadge: '子頁',
    dynamicBadge: 'CMS',
    treeLoadingLabel: '載入中...',
    pageOrderAriaLabel: '移動頁面順序',
    pageOrderHandleTitle: '拖曳或按 ArrowUp/ArrowDown 調整順序',
    pageMenuAriaLabel: '頁面選單',
    menuRename: '重新命名',
    menuAddChild: '新增子頁',
    menuMoveUp: '上移',
    menuMoveDown: '下移',
    menuDelete: '刪除',
    renameTitleAriaLabel: '頁面名稱',
    renameTitlePlaceholder: '管理介面顯示的名稱 · 例：關於我們',
    renameSlugAriaLabel: '頁面 slug',
    renameSlugPlaceholder: '英文小寫·連字號 · 例：about, services/pricing',
    renameRedirectLabel: '建立 301 redirect',
    renameRedirectDescription: (fromPath) => `儲存時會將 ${fromPath} 轉往新的 URL。`,
    renameDynamicRedirectDescription: 'CMS 記錄詳細 URL 也會從 /old/* 一併移到 /new/*。',
    renameRedirectConflictHint: '如果既有 redirect 規則使用相同 URL，頁面仍會儲存並略過該 redirect。',
    renameBusyHint: '儲存中...',
    renameIdleHint: 'Enter 儲存 · Esc 取消',
    pageTitleRequiredError: '頁面名稱不能空白。',
    savePageNameError: '無法儲存頁面名稱。',
    deleteConfirm: '確定要刪除嗎？',
    deletePageError: '無法刪除頁面。',
    createPageError: '無法建立頁面。',
    createMissingPageError: '無法建立遺漏頁面。',
    createDynamicListPageError: '無法建立動態列表頁面。',
    createDynamicItemPageError: '無法建立動態詳細頁面。',
    saveMemberAccessError: '無法儲存頁面權限。',
    memberAccessSaved: '已儲存頁面權限。',
    savePageOrderError: '無法儲存頁面順序。',
    pageOrderSaved: '已儲存頁面順序。',
    redirectWarning: (from, message) => `頁面已儲存，但未建立 ${from} redirect。請檢查既有 redirect 規則。(${message})`,
    memberAccessGroup: '會員權限',
    memberAccessSettings: '權限詳細設定',
    memberAccessBadgeLabels: {
      member: '會員',
      premium: '進階',
    },
    memberAccessModeLabels: {
      public: '公開',
      member: '需要登入',
      premium: 'Premium/Admin',
    },
    memberAccessDialogLabel: '會員權限設定',
    memberAccessDialogTitle: '會員權限設定',
    memberAccessDialogDescription: (slug) => `設定 /${slug} 頁面的公開範圍與存取失敗 redirect。`,
    memberAccessModeLabel: '公開範圍',
    memberAccessRedirectLabel: '存取失敗 redirect',
    memberAccessRedirectOptions: (locale) => [
      { value: `/${locale}/login`, label: '登入頁面' },
      { value: `/${locale}/account`, label: '帳戶頁面' },
      { value: `/${locale}/contact`, label: '聯絡頁面' },
    ],
    memberAccessCustomRedirectLabel: '自訂 redirect path',
    memberAccessCustomRedirectHint: '只會儲存以 / 開頭的內部路徑。',
    memberAccessPagePickerLabel: '從頁面選擇',
    memberAccessPageSearchPlaceholder: '搜尋頁面名稱或路徑 · 例：about',
    memberAccessPageChoicesLabel: 'Redirect 頁面選項',
    memberAccessNoMatchingPages: '沒有符合的頁面。',
    cancel: '取消',
    save: '儲存',
    saving: '儲存中...',
    slugPromptDialogLabel: '輸入頁面 slug',
    slugPromptTitle: '輸入頁面路徑',
    slugPromptTemplateDescription: '使用選取的範本建立新頁面。',
    slugPromptBlankDescription: '建立空白頁面。子頁可使用 parent/child 格式。',
    slugPromptPlaceholder: '英文小寫·連字號 · 例如 about、services、columns/taiwan-guide',
    missingPageCardLabel: '建立遺漏頁面',
    missingPageTitle: '找不到頁面',
    missingPageDescription: '選取的 header/member 連結尚未連到任何建站器頁面。',
    missingPageCreateLabel: (title) => `建立「${title}」頁面`,
    missingPageTitleForSlug: (slug) => {
      if (slug === 'login') return '登入';
      if (slug === 'account') return '我的帳戶';
      if (slug === 'account/profile') return '會員個人資料';
      if (slug === 'account/bookings') return '我的預約';
      if (slug === 'account/premium') return '進階會員';
      return '未命名';
    },
    memberStarterEyebrow: '會員區',
    memberStarterHeroForSlug: (slug) => {
      if (slug === 'login') {
        return {
          heading: '會員登入',
          body: '訪客可登入帳戶，並前往專屬資料或案件進度的會員起始頁。',
          ctaLabel: '連結登入表單',
        };
      }
      if (slug === 'account') {
        return {
          heading: '我的帳戶',
          body: '帳戶儀表板起始版面，可連結會員公告、諮詢紀錄與儲存資料。',
          ctaLabel: '連結諮詢紀錄',
        };
      }
      if (slug === 'account/profile') {
        return {
          heading: '會員個人資料',
          body: '會員可查看並更新姓名與電話的個人資料編輯起始版面。',
          ctaLabel: '連結帳戶儀表板',
        };
      }
      if (slug === 'account/bookings') {
        return {
          heading: '我的預約',
          body: '顯示符合會員信箱的即將到來與過去諮詢預約的起始版面。',
          ctaLabel: '連結帳戶儀表板',
        };
      }
      return {
        heading: '進階會員',
        body: '提供已核准進階會員專屬權益、資料與諮詢選項的起始版面。',
        ctaLabel: '連結進階諮詢',
      };
    },
    memberStarterSetupTitle: '下一步設定',
    memberStarterSetupCopy: '- 放置會員登入/帳戶應用元件\n- 將頁面連結到會員專屬權限\n- 確認登入後導向與行動按鈕',
    memberStarterWidgetCopy: {
      loginSubtitle: '會員帳戶由事務所確認後建立。既有會員請登入。',
      accountSubtitle: '在同一個儀表板引導會員查看個人資料、預約與進階區。',
      profileTitle: '個人資料',
      profileSubtitle: '會員可自行儲存姓名與電話的基本個人資料表單。',
      bookingsSubtitle: '自動載入與會員信箱連結的諮詢預約。',
      loginLabel: '登入',
      profileLabel: '個人資料',
      bookingsLabel: '預約',
      premiumLabel: '進階會員區',
      nameLabel: '姓名',
      phoneLabel: '電話',
      saveProfileLabel: '儲存個人資料',
      savingLabel: '儲存中...',
      savedLabel: '已儲存。',
      upcomingBookingsLabel: '即將到來',
      pastBookingsLabel: '過去預約',
      emptyUpcomingBookingsLabel: '目前沒有即將到來的預約。',
      emptyPastBookingsLabel: '目前沒有過去預約。',
    },
    columnsQuickAriaLabel: '專欄快速導覽',
    columnsQuickTitle: '專欄',
    columnsQuickLoading: '載入中...',
    columnsQuickCountLabel: (count) => `${count} 篇文章`,
    columnsQuickEditPostLabel: (title) => `編輯 · ${title}`,
    columnsQuickGoToPage: '前往專欄頁面',
    columnsQuickManage: '管理專欄',
    columnsQuickNewPost: '撰寫新文章',
    dynamicQuickAriaLabel: '建立動態列表頁面',
    dynamicQuickTitle: 'CMS 動態列表',
    dynamicQuickMeta: '草稿頁面',
    dynamicQuickColumnList: '專欄列表',
    dynamicQuickServiceList: '服務列表',
    dynamicQuickAttorneyList: '律師列表',
    dynamicQuickColumnDetail: '專欄詳細',
    dynamicQuickServiceDetail: '服務詳細',
    dynamicQuickAttorneyDetail: '律師詳細',
    dynamicListPageTitle: (collectionId, token) => (
      collectionId === 'columns'
        ? `專欄動態列表 ${token}`
        : collectionId === 'attorney-profiles'
          ? `律師動態列表 ${token}`
          : `服務動態列表 ${token}`
    ),
    dynamicItemPageTitle: (collectionId, token) => (
      collectionId === 'columns'
        ? `專欄動態詳細 ${token}`
        : collectionId === 'attorney-profiles'
          ? `律師動態詳細 ${token}`
          : `服務動態詳細 ${token}`
    ),
    emptyStateTitle: '目前沒有頁面。',
    emptyStateDescription: '建立新頁面或從範本開始。',
    emptyStateCreateFirst: '建立第一個頁面',
    addToNavigationLabel: '加入選單',
    addToNavigationHint: '建立後立即連結到網站頂部選單。',
    chooseAnotherTemplate: '選擇其他範本',
    create: '建立',
    creating: '建立中...',
  },
  en: {
    networkErrorToast: 'Network error. Please try again.',
    fetchPagesError: 'Could not load pages.',
    drawerTitle: 'Pages',
    addPageButtonLabel: '+ New',
    addPageBusyLabel: '...',
    clipboardCountLabel: (count) => `${count} elements in clipboard`,
    homeBadge: 'MAIN',
    publishedTitle: 'Published',
    draftTitle: 'Draft',
    unpublishedChangesBadge: 'Unpublished changes',
    untitled: 'Untitled',
    nestedBadge: 'Child',
    dynamicBadge: 'CMS',
    treeLoadingLabel: 'Loading...',
    pageOrderAriaLabel: 'Move page order',
    pageOrderHandleTitle: 'Drag or press ArrowUp/ArrowDown to reorder',
    pageMenuAriaLabel: 'Page menu',
    menuRename: 'Rename',
    menuAddChild: 'Add child page',
    menuMoveUp: 'Move up',
    menuMoveDown: 'Move down',
    menuDelete: 'Delete',
    renameTitleAriaLabel: 'Page name',
    renameTitlePlaceholder: 'Name shown in admin · e.g. About us',
    renameSlugAriaLabel: 'Page slug',
    renameSlugPlaceholder: 'Lowercase + hyphens · e.g. about, services/pricing',
    renameRedirectLabel: 'Create 301 redirect',
    renameRedirectDescription: (fromPath) => `On save, ${fromPath} will redirect to the new URL.`,
    renameDynamicRedirectDescription: 'CMS record detail URLs also move from /old/* to /new/*.',
    renameRedirectConflictHint: 'If an existing redirect rule uses the same URL, the page is saved and only the redirect is skipped.',
    renameBusyHint: 'Saving...',
    renameIdleHint: 'Enter saves · Esc cancels',
    pageTitleRequiredError: 'Page name cannot be blank.',
    savePageNameError: 'Could not save page name.',
    deleteConfirm: 'Are you sure you want to delete this page?',
    deletePageError: 'Could not delete page.',
    createPageError: 'Could not create page.',
    createMissingPageError: 'Could not create missing page.',
    createDynamicListPageError: 'Could not create dynamic list page.',
    createDynamicItemPageError: 'Could not create dynamic detail page.',
    saveMemberAccessError: 'Could not save page access.',
    memberAccessSaved: 'Page access saved.',
    savePageOrderError: 'Could not save page order.',
    pageOrderSaved: 'Page order saved.',
    redirectWarning: (from, message) => `The page was saved, but the ${from} redirect was not created. Check existing redirect rules. (${message})`,
    memberAccessGroup: 'Member access',
    memberAccessSettings: 'Access settings',
    memberAccessBadgeLabels: {
      member: 'Member',
      premium: 'Premium',
    },
    memberAccessModeLabels: {
      public: 'Public',
      member: 'Login required',
      premium: 'Premium/Admin',
    },
    memberAccessDialogLabel: 'Member access settings',
    memberAccessDialogTitle: 'Member access settings',
    memberAccessDialogDescription: (slug) => `Set visibility and failed-access redirect for /${slug}.`,
    memberAccessModeLabel: 'Visibility',
    memberAccessRedirectLabel: 'Failed-access redirect',
    memberAccessRedirectOptions: (locale) => [
      { value: `/${locale}/login`, label: 'Login page' },
      { value: `/${locale}/account`, label: 'Account page' },
      { value: `/${locale}/contact`, label: 'Contact page' },
    ],
    memberAccessCustomRedirectLabel: 'Custom redirect path',
    memberAccessCustomRedirectHint: 'Only internal paths starting with / are saved.',
    memberAccessPagePickerLabel: 'Choose from pages',
    memberAccessPageSearchPlaceholder: 'Search page name or path · e.g. about',
    memberAccessPageChoicesLabel: 'Redirect page choices',
    memberAccessNoMatchingPages: 'No matching pages.',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    slugPromptDialogLabel: 'Enter page slug',
    slugPromptTitle: 'Enter Page Path',
    slugPromptTemplateDescription: 'Create a new page from the selected template.',
    slugPromptBlankDescription: 'Create a blank page. Child pages can use the parent/child format.',
    slugPromptPlaceholder: 'Lowercase + hyphens · e.g. about, services, columns/taiwan-guide',
    missingPageCardLabel: 'Create missing page',
    missingPageTitle: 'Page missing',
    missingPageDescription: 'The selected header/member link is not connected to a builder page yet.',
    missingPageCreateLabel: (title) => `Create ${title} page`,
    missingPageTitleForSlug: (slug) => {
      if (slug === 'login') return 'Sign in';
      if (slug === 'account') return 'Account';
      if (slug === 'account/profile') return 'Profile';
      if (slug === 'account/bookings') return 'Bookings';
      if (slug === 'account/premium') return 'Premium';
      return 'Untitled';
    },
    memberStarterEyebrow: 'MEMBER AREA',
    memberStarterHeroForSlug: (slug) => {
      if (slug === 'login') {
        return {
          heading: 'Member sign in',
          body: 'A member entry page where visitors can sign in and continue to private resources or case updates.',
          ctaLabel: 'Connect sign-in form',
        };
      }
      if (slug === 'account') {
        return {
          heading: 'My account',
          body: 'A starter account dashboard for member-only notices, inquiry history, and saved resources.',
          ctaLabel: 'Connect case history',
        };
      }
      if (slug === 'account/profile') {
        return {
          heading: 'Member profile',
          body: 'A starter profile editor where members can review and update their name and phone.',
          ctaLabel: 'Connect account dashboard',
        };
      }
      if (slug === 'account/bookings') {
        return {
          heading: 'My bookings',
          body: 'A starter layout for showing upcoming and past consultations that match the member email.',
          ctaLabel: 'Connect account dashboard',
        };
      }
      return {
        heading: 'Premium membership',
        body: 'A starter layout for approved premium members, private benefits, resources, and consultation options.',
        ctaLabel: 'Connect premium consult',
      };
    },
    memberStarterSetupTitle: 'Next setup',
    memberStarterSetupCopy: '- Place the member login/account app widget\n- Connect this page to member-only permissions\n- Confirm post-login routing and calls to action',
    memberStarterWidgetCopy: {
      loginSubtitle: 'Member accounts are issued by the firm after review. Existing members can sign in.',
      accountSubtitle: 'Guide members to profile details, bookings, and premium areas from one dashboard.',
      profileTitle: 'Profile details',
      profileSubtitle: 'A basic profile form members can use to save their name and phone.',
      bookingsSubtitle: 'Automatically loads consultations linked to the member email.',
      loginLabel: 'Sign in',
      profileLabel: 'Profile',
      bookingsLabel: 'Bookings',
      premiumLabel: 'Premium',
      nameLabel: 'Name',
      phoneLabel: 'Phone',
      saveProfileLabel: 'Save profile',
      savingLabel: 'Saving...',
      savedLabel: 'Saved.',
      upcomingBookingsLabel: 'Upcoming',
      pastBookingsLabel: 'Past bookings',
      emptyUpcomingBookingsLabel: 'No upcoming bookings.',
      emptyPastBookingsLabel: 'No past bookings yet.',
    },
    columnsQuickAriaLabel: 'Columns quick links',
    columnsQuickTitle: 'Columns',
    columnsQuickLoading: 'Loading...',
    columnsQuickCountLabel: (count) => `${count} posts`,
    columnsQuickEditPostLabel: (title) => `Edit - ${title}`,
    columnsQuickGoToPage: 'Go to Columns page',
    columnsQuickManage: 'Manage columns',
    columnsQuickNewPost: 'New post',
    dynamicQuickAriaLabel: 'Create dynamic list pages',
    dynamicQuickTitle: 'CMS dynamic lists',
    dynamicQuickMeta: 'draft page',
    dynamicQuickColumnList: 'Column list',
    dynamicQuickServiceList: 'Service list',
    dynamicQuickAttorneyList: 'Attorney list',
    dynamicQuickColumnDetail: 'Column detail',
    dynamicQuickServiceDetail: 'Service detail',
    dynamicQuickAttorneyDetail: 'Attorney detail',
    dynamicListPageTitle: (collectionId, token) => (
      collectionId === 'columns'
        ? `Column dynamic list ${token}`
        : collectionId === 'attorney-profiles'
          ? `Attorney dynamic list ${token}`
          : `Service dynamic list ${token}`
    ),
    dynamicItemPageTitle: (collectionId, token) => (
      collectionId === 'columns'
        ? `Column dynamic detail ${token}`
        : collectionId === 'attorney-profiles'
          ? `Attorney dynamic detail ${token}`
          : `Service dynamic detail ${token}`
    ),
    emptyStateTitle: 'No pages yet.',
    emptyStateDescription: 'Create a new page or start from a template.',
    emptyStateCreateFirst: 'Create first page',
    addToNavigationLabel: 'Add to menu',
    addToNavigationHint: 'Link the new page directly in the site top menu.',
    chooseAnotherTemplate: 'Choose another template',
    create: 'Create',
    creating: 'Creating...',
  },
};

export function getPageSwitcherCopy(locale: Locale): PageSwitcherCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.en;
}
