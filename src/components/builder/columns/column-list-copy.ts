import type { Locale } from '@/lib/locales';

export interface ColumnListCopy {
  quickNavAria: string;
  backToHome: string;
  publicColumns: string;
  eyebrow: string;
  title: string;
  description: string;
  heroBack: string;
  heroTabsAria: string;
  newButton: string;
  stats: {
    posts: string;
    drafts: string;
    scheduled: string;
    published: string;
    authors: string;
    taxonomy: string;
  };
  sidebarAria: string;
  allCategories: string;
  addCategory: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchAria: string;
  statusLabel: string;
  statusOptions: {
    all: string;
    draft: string;
    scheduled: string;
    published: string;
    needsReview: string;
  };
  countLabel: string;
  empty: {
    title: string;
    description: string;
    button: string;
  };
  featuredToggleOn: string;
  featuredToggleOff: string;
  featuredLabel: string;
  menuLabel: string;
  edit: string;
  publicPage: string;
  publish: string;
  apiDetail: string;
  deleteDraft: string;
  deleting: string;
  previewDraftLabel: string;
  summaryFallback: string;
  readingTimeSuffix: string;
  freshnessLabels: {
    fresh: string;
    review_needed: string;
    unknown: string;
  };
  reviewLabels: {
    pending: string;
    reviewed: string;
    'needs-revision': string;
  };
  postStatusLabels: {
    draft: string;
    scheduled: string;
    published: string;
  };
  errorMessages: {
    create: string;
    update: string;
    delete: string;
    publish: string;
  };
  modal: {
    eyebrow: string;
    title: string;
    description: string;
    close: string;
    titleLabel: string;
    titlePlaceholder: string;
    advanced: string;
    category: string;
    author: string;
    cancel: string;
    submit: string;
    pending: string;
    untitled: string;
  };
}

const COLUMN_LIST_COPY: Record<Locale, ColumnListCopy> = {
  ko: {
    quickNavAria: '칼럼 관리 빠른 이동',
    backToHome: '편집 홈 메뉴로 돌아가기',
    publicColumns: '공개 칼럼',
    eyebrow: '블로그 관리자',
    title: '칼럼 관리',
    description: '카테고리별 칼럼을 검색하고, 초안 작성부터 발행까지 한 화면에서 관리합니다.',
    heroBack: '← 편집기 홈으로 돌아가기',
    heroTabsAria: '칼럼 언어 전환',
    newButton: '+ 새 글 쓰기',
    stats: {
      posts: '게시물',
      drafts: '초안',
      scheduled: '예약됨',
      published: '발행됨',
      authors: '저자',
      taxonomy: '카테고리 / 태그',
    },
    sidebarAria: '칼럼 카테고리',
    allCategories: '전체',
    addCategory: '+ 새 카테고리',
    searchLabel: '검색',
    searchPlaceholder: '제목, slug, 태그, 저자 검색',
    searchAria: '칼럼 검색',
    statusLabel: '상태',
    statusOptions: {
      all: '전체 상태',
      draft: '초안',
      scheduled: '예약됨',
      published: '발행됨',
      needsReview: '수정 필요',
    },
    countLabel: '게시물',
    empty: {
      title: '아직 칼럼이 없습니다.',
      description: '새 글 쓰기를 누르면 바로 본문 작성 화면으로 이동합니다.',
      button: '첫 글 쓰기',
    },
    featuredToggleOn: 'featured 해제',
    featuredToggleOff: 'featured 설정',
    featuredLabel: '추천',
    menuLabel: '칼럼 메뉴',
    edit: '편집',
    publicPage: '공개 페이지',
    publish: '발행',
    apiDetail: 'API 상세',
    deleteDraft: 'Draft 삭제',
    deleting: '처리 중',
    previewDraftLabel: '초안 미리보기',
    summaryFallback: '요약 없음',
    readingTimeSuffix: '분 읽기',
    freshnessLabels: {
      fresh: '최신',
      review_needed: '검토 필요',
      unknown: '미확인',
    },
    reviewLabels: {
      pending: '검토 대기',
      reviewed: '검토 완료',
      'needs-revision': '수정 필요',
    },
    postStatusLabels: {
      draft: '초안',
      scheduled: '예약됨',
      published: '발행됨',
    },
    errorMessages: {
      create: '새 글 생성에 실패했습니다.',
      update: '업데이트에 실패했습니다.',
      delete: '삭제에 실패했습니다.',
      publish: '발행에 실패했습니다.',
    },
    modal: {
      eyebrow: '새 글',
      title: '새 글 쓰기',
      description: '제목만 정하면 바로 글쓰기 화면으로 이동합니다. 요약과 주소는 자동으로 만들고, 필요할 때만 설정에서 바꿉니다.',
      close: '닫기',
      titleLabel: '제목',
      titlePlaceholder: '제목을 입력하세요',
      advanced: '글 설정',
      category: '카테고리',
      author: '저자',
      cancel: '취소',
      submit: '글쓰기 시작',
      pending: '글 여는 중...',
      untitled: '제목 없는 글',
    },
  },
  'zh-hant': {
    quickNavAria: '欄目管理快速導覽',
    backToHome: '返回編輯首頁選單',
    publicColumns: '公開欄目',
    eyebrow: '部落格管理',
    title: '欄目管理',
    description: '可搜尋各類欄目，從草稿到發佈都在同一頁管理。',
    heroBack: '← 返回編輯首頁',
    heroTabsAria: '欄目語言切換',
    newButton: '+ 建立草稿',
    stats: {
      posts: '文章',
      drafts: '草稿',
      scheduled: '已排程',
      published: '已發佈',
      authors: '作者',
      taxonomy: '類別 / 標籤',
    },
    sidebarAria: '欄目分類',
    allCategories: '全部',
    addCategory: '+ 新增分類',
    searchLabel: '搜尋',
    searchPlaceholder: '搜尋標題、slug、標籤、作者',
    searchAria: '欄目搜尋',
    statusLabel: '狀態',
    statusOptions: {
      all: '所有狀態',
      draft: '草稿',
      scheduled: '已排程',
      published: '已發佈',
      needsReview: '需要修訂',
    },
    countLabel: '文章',
    empty: {
      title: '目前還沒有欄目。',
      description: '按下「建立草稿」就會直接進入編寫畫面。',
      button: '撰寫第一篇',
    },
    featuredToggleOn: '取消 featured',
    featuredToggleOff: '設定 featured',
    featuredLabel: '精選',
    menuLabel: '欄目選單',
    edit: '編輯',
    publicPage: '公開頁面',
    publish: '發佈',
    apiDetail: 'API 詳情',
    deleteDraft: '刪除草稿',
    deleting: '處理中',
    previewDraftLabel: '草稿預覽',
    summaryFallback: '沒有摘要',
    readingTimeSuffix: '分鐘閱讀',
    freshnessLabels: {
      fresh: '最新',
      review_needed: '需要審閱',
      unknown: '未知',
    },
    reviewLabels: {
      pending: '待審閱',
      reviewed: '已審閱',
      'needs-revision': '需要修訂',
    },
    postStatusLabels: {
      draft: '草稿',
      scheduled: '已排程',
      published: '已發佈',
    },
    errorMessages: {
      create: '建立新文章失敗。',
      update: '更新失敗。',
      delete: '刪除失敗。',
      publish: '發佈失敗。',
    },
    modal: {
      eyebrow: '新文章',
      title: '建立新文章',
      description: '只要先填標題，就會直接進入文章編輯畫面。摘要與網址會自動建立，需要時再到設定修改。',
      close: '關閉',
      titleLabel: '標題',
      titlePlaceholder: '請輸入標題',
      advanced: '文章設定',
      category: '類別',
      author: '作者',
      cancel: '取消',
      submit: '開始寫作',
      pending: '開啟文章中...',
      untitled: '未命名文章',
    },
  },
  en: {
    quickNavAria: 'Column manager quick navigation',
    backToHome: 'Back to editor home',
    publicColumns: 'Public columns',
    eyebrow: 'Blog manager',
    title: 'Builder Columns Admin',
    description: 'Column draft list and creation admin surface.',
    heroBack: '← Back to editor home',
    heroTabsAria: 'Column locale tabs',
    newButton: '+ New post',
    stats: {
      posts: 'Posts',
      drafts: 'Drafts',
      scheduled: 'Scheduled',
      published: 'Published',
      authors: 'Authors',
      taxonomy: 'Categories / tags',
    },
    sidebarAria: 'Column categories',
    allCategories: 'All',
    addCategory: '+ New category',
    searchLabel: 'Search',
    searchPlaceholder: 'Search title, slug, tag, author',
    searchAria: 'Search columns',
    statusLabel: 'Status',
    statusOptions: {
      all: 'All statuses',
      draft: 'Drafts',
      scheduled: 'Scheduled',
      published: 'Published',
      needsReview: 'Needs revision',
    },
    countLabel: 'posts',
    empty: {
      title: 'No columns yet.',
      description: 'Click New post to jump straight into the writing flow.',
      button: 'Write the first post',
    },
    featuredToggleOn: 'Unset featured',
    featuredToggleOff: 'Set featured',
    featuredLabel: 'Featured',
    menuLabel: 'Column menu',
    edit: 'Edit',
    publicPage: 'Public page',
    publish: 'Publish',
    apiDetail: 'API detail',
    deleteDraft: 'Delete draft',
    deleting: 'Working…',
    previewDraftLabel: 'Draft preview',
    summaryFallback: 'No summary',
    readingTimeSuffix: 'min read',
    freshnessLabels: {
      fresh: 'Fresh',
      review_needed: 'Review needed',
      unknown: 'Unknown',
    },
    reviewLabels: {
      pending: 'Pending',
      reviewed: 'Reviewed',
      'needs-revision': 'Needs revision',
    },
    postStatusLabels: {
      draft: 'Draft',
      scheduled: 'Scheduled',
      published: 'Published',
    },
    errorMessages: {
      create: 'Failed to create a new post.',
      update: 'Failed to update.',
      delete: 'Failed to delete.',
      publish: 'Failed to publish.',
    },
    modal: {
      eyebrow: 'New post',
      title: 'Write a new post',
      description: 'Choose a title and jump straight into the editor. Summary and slug are generated for you and can be changed later in settings.',
      close: 'Close',
      titleLabel: 'Title',
      titlePlaceholder: 'Enter a title',
      advanced: 'Post settings',
      category: 'Category',
      author: 'Author',
      cancel: 'Cancel',
      submit: 'Start writing',
      pending: 'Opening post…',
      untitled: 'Untitled post',
    },
  },
};

export function getColumnListCopy(locale: Locale): ColumnListCopy {
  return COLUMN_LIST_COPY[locale] ?? COLUMN_LIST_COPY.en;
}
