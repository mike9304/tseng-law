export type WorkspaceLocale = 'ko' | 'zh-hant' | 'en';

export type WorkspaceCopy = {
  pageTitle: string;
  pageDescription: string;
  pageEyebrow: string;
  ownerLabel: string;
  accountIdLabel: string;
  sectionsLabel: string;
  tabs: {
    overview: string;
    sites: string;
    members: string;
    sharedAssets: string;
    analytics: string;
  };
  overview: {
    sites: string;
    members: string;
    sharedAssets: string;
    collections: string;
    orders: string;
    bookings: string;
    grossCollected: string;
    outstanding: string;
    account: string;
    createdPrefix: string;
    updatedPrefix: string;
  };
  analytics: {
    unavailable: string;
    orders: string;
    bookings: string;
    grossCollected: string;
    outstanding: string;
    workspaceOperations: string;
    sites: string;
    members: string;
    sharedAssets: string;
    assetStorage: string;
    cmsCollectionsMetric: string;
    cmsRecords: string;
    perSiteBreakdown: string;
    noSites: string;
    cmsCollections: string;
    noCollections: string;
    orderCountSuffix: string;
    bookingCountSuffix: string;
    collectionCountSuffix: string;
    recordCountSuffix: string;
    siteCountSuffix: string;
    bindableTarget: string;
    bindableTargets: string;
  };
  sites: {
    siteIdLabel: string;
    siteNameLabel: string;
    siteIdPlaceholder: string;
    siteNamePlaceholder: string;
    register: string;
    adding: string;
    openEditor: string;
    noSites: string;
    errors: {
      add: string;
    };
    role: Record<'owner' | 'editor' | 'viewer', string>;
  };
  members: {
    emailLabel: string;
    emailPlaceholder: string;
    roleLabel: string;
    invite: string;
    adding: string;
    remove: string;
    addedPrefix: string;
    errors: {
      add: string;
      updateRole: string;
      remove: string;
    };
    role: Record<'owner' | 'editor' | 'viewer', string>;
  };
  sharedAssets: {
    upload: string;
    uploading: string;
    hint: string;
    noAssets: string;
    delete: string;
    errors: {
      upload: string;
      delete: string;
    };
  };
};

const WORKSPACE_COPY: Record<WorkspaceLocale, WorkspaceCopy> = {
  ko: {
    pageTitle: '작업 공간',
    pageDescription: '빌더 작업 공간의 사이트, 구성원, 공유 에셋, 분석을 한 곳에서 관리합니다.',
    pageEyebrow: '작업 공간',
    ownerLabel: '소유자',
    accountIdLabel: '계정 ID',
    sectionsLabel: '작업 공간 섹션',
    tabs: {
      overview: '개요',
      sites: '사이트',
      members: '구성원',
      sharedAssets: '공유 에셋',
      analytics: '분석',
    },
    overview: {
      sites: '사이트',
      members: '구성원',
      sharedAssets: '공유 에셋',
      collections: 'CMS 컬렉션',
      orders: '주문',
      bookings: '예약',
      grossCollected: '총 수금액',
      outstanding: '미수금',
      account: '계정',
      createdPrefix: '생성',
      updatedPrefix: '업데이트',
    },
    analytics: {
      unavailable: '분석 집계는 현재 사용할 수 없습니다.',
      orders: '주문',
      bookings: '예약',
      grossCollected: '총 수금액',
      outstanding: '미수금',
      workspaceOperations: '작업 공간 운영 지표',
      sites: '사이트',
      members: '구성원',
      sharedAssets: '공유 에셋',
      assetStorage: '공유 에셋 저장량',
      cmsCollectionsMetric: 'CMS 컬렉션',
      cmsRecords: 'CMS 레코드',
      perSiteBreakdown: '사이트별 요약',
      noSites: '등록된 사이트가 없습니다.',
      cmsCollections: 'CMS 컬렉션 (읽기 전용)',
      noCollections: '집계된 컬렉션이 없습니다.',
      orderCountSuffix: '주문',
      bookingCountSuffix: '예약',
      collectionCountSuffix: '컬렉션',
      recordCountSuffix: '레코드',
      siteCountSuffix: '사이트',
      bindableTarget: '바인딩 가능한 대상',
      bindableTargets: '바인딩 가능한 대상',
    },
    sites: {
      siteIdLabel: '사이트 ID',
      siteNameLabel: '표시 이름',
      siteIdPlaceholder: 'site-id',
      siteNamePlaceholder: '선택 사항인 표시 이름',
      register: '사이트 등록',
      adding: '추가 중…',
      openEditor: '편집기 열기',
      noSites: '아직 등록된 사이트가 없습니다.',
      errors: { add: '사이트를 추가하지 못했습니다.' },
      role: { owner: '소유자', editor: '편집자', viewer: '뷰어' },
    },
    members: {
      emailLabel: '구성원 이메일',
      emailPlaceholder: 'member@example.com',
      roleLabel: '구성원 역할',
      invite: '구성원 초대',
      adding: '추가 중…',
      remove: '삭제',
      addedPrefix: '추가됨',
      errors: {
        add: '구성원을 추가하지 못했습니다.',
        updateRole: '구성원 역할을 업데이트하지 못했습니다.',
        remove: '구성원을 삭제하지 못했습니다.',
      },
      role: { owner: '소유자', editor: '편집자', viewer: '뷰어' },
    },
    sharedAssets: {
      upload: '공유 에셋 업로드',
      uploading: '업로드 중…',
      hint: 'JPG / PNG / WEBP / GIF / AVIF / SVG, 최대 10MB.',
      noAssets: '공유 에셋이 아직 없습니다.',
      delete: '삭제',
      errors: { upload: '업로드하지 못했습니다.', delete: '삭제하지 못했습니다.' },
    },
  },
  'zh-hant': {
    pageTitle: '工作區',
    pageDescription: '在同一處管理建構器工作區的網站、成員、共用素材與分析。',
    pageEyebrow: '工作區',
    ownerLabel: '擁有者',
    accountIdLabel: '帳號 ID',
    sectionsLabel: '工作區區段',
    tabs: {
      overview: '概覽',
      sites: '網站',
      members: '成員',
      sharedAssets: '共用素材',
      analytics: '分析',
    },
    overview: {
      sites: '網站',
      members: '成員',
      sharedAssets: '共用素材',
      collections: 'CMS 清單',
      orders: '訂單',
      bookings: '預約',
      grossCollected: '總收款',
      outstanding: '未收款',
      account: '帳號',
      createdPrefix: '建立',
      updatedPrefix: '更新',
    },
    analytics: {
      unavailable: '分析彙總目前無法使用。',
      orders: '訂單',
      bookings: '預約',
      grossCollected: '總收款',
      outstanding: '未收款',
      workspaceOperations: '工作區營運指標',
      sites: '網站',
      members: '成員',
      sharedAssets: '共用素材',
      assetStorage: '共用素材儲存量',
      cmsCollectionsMetric: 'CMS 清單',
      cmsRecords: 'CMS 紀錄',
      perSiteBreakdown: '各站點摘要',
      noSites: '尚未註冊站點。',
      cmsCollections: 'CMS 清單（唯讀）',
      noCollections: '沒有彙總的清單。',
      orderCountSuffix: '訂單',
      bookingCountSuffix: '預約',
      collectionCountSuffix: '個清單',
      recordCountSuffix: '筆紀錄',
      siteCountSuffix: '個站點',
      bindableTarget: '可綁定目標',
      bindableTargets: '可綁定目標',
    },
    sites: {
      siteIdLabel: '網站 ID',
      siteNameLabel: '顯示名稱',
      siteIdPlaceholder: 'site-id',
      siteNamePlaceholder: '選填顯示名稱',
      register: '註冊網站',
      adding: '新增中…',
      openEditor: '開啟編輯器',
      noSites: '尚無已註冊的網站。',
      errors: { add: '無法新增網站。' },
      role: { owner: '擁有者', editor: '編輯者', viewer: '檢視者' },
    },
    members: {
      emailLabel: '成員電子郵件',
      emailPlaceholder: 'member@example.com',
      roleLabel: '成員角色',
      invite: '邀請成員',
      adding: '新增中…',
      remove: '移除',
      addedPrefix: '加入於',
      errors: {
        add: '無法新增成員。',
        updateRole: '無法更新成員角色。',
        remove: '無法移除成員。',
      },
      role: { owner: '擁有者', editor: '編輯者', viewer: '檢視者' },
    },
    sharedAssets: {
      upload: '上傳共用素材',
      uploading: '上傳中…',
      hint: 'JPG / PNG / WEBP / GIF / AVIF / SVG，最多 10MB。',
      noAssets: '尚無共用素材。',
      delete: '刪除',
      errors: { upload: '無法上傳。', delete: '無法刪除。' },
    },
  },
  en: {
    pageTitle: 'Workspace',
    pageDescription: 'Manage sites, members, shared assets, and analytics for the builder workspace.',
    pageEyebrow: 'Workspace',
    ownerLabel: 'Owner',
    accountIdLabel: 'Account id',
    sectionsLabel: 'Workspace sections',
    tabs: {
      overview: 'Overview',
      sites: 'Sites',
      members: 'Members',
      sharedAssets: 'Shared Assets',
      analytics: 'Analytics',
    },
    overview: {
      sites: 'Sites',
      members: 'Members',
      sharedAssets: 'Shared assets',
      collections: 'CMS collections',
      orders: 'Orders',
      bookings: 'Bookings',
      grossCollected: 'Gross collected',
      outstanding: 'Outstanding',
      account: 'Account',
      createdPrefix: 'Created',
      updatedPrefix: 'Updated',
    },
    analytics: {
      unavailable: 'Analytics rollup is unavailable right now.',
      orders: 'Orders',
      bookings: 'Bookings',
      grossCollected: 'Gross collected',
      outstanding: 'Outstanding',
      workspaceOperations: 'Workspace operations',
      sites: 'Sites',
      members: 'Members',
      sharedAssets: 'Shared assets',
      assetStorage: 'Shared asset storage',
      cmsCollectionsMetric: 'CMS collections',
      cmsRecords: 'CMS records',
      perSiteBreakdown: 'Per-site breakdown',
      noSites: 'No sites registered.',
      cmsCollections: 'CMS collections (read-only)',
      noCollections: 'No collections aggregated.',
      orderCountSuffix: 'orders',
      bookingCountSuffix: 'bookings',
      collectionCountSuffix: 'collections',
      recordCountSuffix: 'records',
      siteCountSuffix: 'site(s)',
      bindableTarget: 'Bindable target',
      bindableTargets: 'Bindable targets',
    },
    sites: {
      siteIdLabel: 'Site id',
      siteNameLabel: 'Display name',
      siteIdPlaceholder: 'site-id',
      siteNamePlaceholder: 'Display name (optional)',
      register: 'Register site',
      adding: 'Adding…',
      openEditor: 'Open editor',
      noSites: 'No sites registered yet.',
      errors: { add: 'Failed to add site.' },
      role: { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' },
    },
    members: {
      emailLabel: 'Member email',
      emailPlaceholder: 'member@example.com',
      roleLabel: 'Member role',
      invite: 'Invite member',
      adding: 'Adding…',
      remove: 'Remove',
      addedPrefix: 'Added',
      errors: {
        add: 'Failed to add member.',
        updateRole: 'Failed to update role.',
        remove: 'Failed to remove member.',
      },
      role: { owner: 'Owner', editor: 'Editor', viewer: 'Viewer' },
    },
    sharedAssets: {
      upload: 'Upload shared asset',
      uploading: 'Uploading…',
      hint: 'JPG / PNG / WEBP / GIF / AVIF / SVG, up to 10MB.',
      noAssets: 'No shared assets yet.',
      delete: 'Delete',
      errors: { upload: 'Upload failed.', delete: 'Delete failed.' },
    },
  },
};

export function getWorkspaceCopy(locale: string): WorkspaceCopy {
  const key = locale in WORKSPACE_COPY ? (locale as WorkspaceLocale) : 'en';
  return WORKSPACE_COPY[key];
}
