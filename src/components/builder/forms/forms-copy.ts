import type { Locale } from '@/lib/locales';

type FormsDashboardCopy = {
  title: string;
  description: string;
  summary: (formId: string, total: number, unread: number) => string;
  openBuilder: string;
  refresh: string;
  searchPlaceholder: string;
  categoryAll: string;
  dateAll: string;
  date7d: string;
  date30d: string;
  statusAll: string;
  unreadOnly: string;
  readOnly: string;
  shown: (shown: number, total: number) => string;
  noSubmissionsYet: string;
  noMatchingSubmissions: string;
  table: {
    status: string;
    date: string;
    name: string;
    email: string;
    category: string;
    message: string;
  };
  detail: {
    title: string;
    closeLabel: string;
    submissionId: string;
    form: string;
    submitted: string;
    status: string;
    read: string;
    unread: string;
    ip: string;
    userAgent: string;
    markAsRead: string;
  };
  builderLinkLabel: string;
  loading: string;
};

type SubmissionsListCopy = {
  title: string;
  description: string;
  summary: (formId: string, shown: number) => string;
  forms: string;
  exportCsv: string;
  searchPlaceholder: string;
  status: {
    status: string;
    date: string;
    name: string;
    email: string;
    summary: string;
  };
  noSubmissionsYet: string;
  noMatchingSubmissions: string;
  detail: {
    title: string;
    closeLabel: string;
    submissionId: string;
    date: string;
    status: string;
    read: string;
    unread: string;
    ip: string;
    userAgent: string;
  };
  loading: string;
  emptyFormIds: string;
};

type FormsBuilderCopy = {
  title: string;
  description: string;
  body: string;
};

type FormsCopy = {
  dashboard: FormsDashboardCopy;
  list: SubmissionsListCopy;
  builder: FormsBuilderCopy;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', FormsCopy> = {
  ko: {
    dashboard: {
      title: '폼 제출',
      description: '폼 제출을 검토하고 필터링합니다.',
      summary: (formId, total, unread) => `${formId} · 총 ${total}건 · 읽지 않음 ${unread}건`,
      openBuilder: '폼 빌더 열기',
      refresh: '새로고침',
      searchPlaceholder: '이름, 이메일, 메시지 검색...',
      categoryAll: '전체 카테고리',
      dateAll: '전체 기간',
      date7d: '최근 7일',
      date30d: '최근 30일',
      statusAll: '전체 상태',
      unreadOnly: '읽지 않음만',
      readOnly: '읽음만',
      shown: (shown, total) => `${shown}/${total}건 표시`,
      noSubmissionsYet: '아직 제출이 없습니다.',
      noMatchingSubmissions: '일치하는 제출이 없습니다.',
      table: {
        status: '상태',
        date: '날짜',
        name: '이름',
        email: '이메일',
        category: '카테고리',
        message: '메시지',
      },
      detail: {
        title: '제출 상세',
        closeLabel: '상세 닫기',
        submissionId: '제출 ID',
        form: '양식',
        submitted: '제출 시각',
        status: '상태',
        read: '읽음',
        unread: '읽지 않음',
        ip: 'IP',
        userAgent: '사용자 에이전트',
        markAsRead: '읽음으로 표시',
      },
      builderLinkLabel: '폼 빌더 열기',
      loading: '불러오는 중...',
    },
    list: {
      title: '폼 제출',
      description: '빌더 폼 제출을 검토하고 내보냅니다.',
      summary: (formId, shown) => `${formId} · ${shown}건 표시`,
      forms: '폼 목록',
      exportCsv: 'CSV 내보내기',
      searchPlaceholder: '제출 검색',
      status: {
        status: '상태',
        date: '날짜',
        name: '이름',
        email: '이메일',
        summary: '요약',
      },
      noSubmissionsYet: '제출이 없습니다.',
      noMatchingSubmissions: '일치하는 제출이 없습니다.',
      detail: {
        title: '제출 상세',
        closeLabel: '상세 닫기',
        submissionId: '제출 ID',
        date: '날짜',
        status: '상태',
        read: '읽음',
        unread: '읽지 않음',
        ip: 'IP',
        userAgent: '사용자 에이전트',
      },
      loading: '불러오는 중...',
      emptyFormIds: '폼이 없습니다',
    },
    builder: {
      title: '폼 빌더',
      description: '폼 필드를 재정렬하고 다단계/조건부 로직을 설정하세요.',
      body: '드래그앤드롭으로 필드를 재정렬하고, step 분할 + 조건부 로직을 적용하세요.',
    },
  },
  'zh-hant': {
    dashboard: {
      title: '表單提交',
      description: '檢視並篩選表單提交。',
      summary: (formId, total, unread) => `${formId} · 共 ${total} 筆 · 未讀 ${unread} 筆`,
      openBuilder: '開啟表單編輯器',
      refresh: '重新整理',
      searchPlaceholder: '搜尋姓名、電子郵件、訊息...',
      categoryAll: '所有類別',
      dateAll: '全部時間',
      date7d: '最近 7 天',
      date30d: '最近 30 天',
      statusAll: '所有狀態',
      unreadOnly: '僅未讀',
      readOnly: '僅已讀',
      shown: (shown, total) => `顯示 ${shown}/${total} 筆`,
      noSubmissionsYet: '目前尚無提交。',
      noMatchingSubmissions: '沒有符合的提交。',
      table: {
        status: '狀態',
        date: '日期',
        name: '姓名',
        email: '電子郵件',
        category: '類別',
        message: '訊息',
      },
      detail: {
        title: '提交詳情',
        closeLabel: '關閉詳情',
        submissionId: '提交 ID',
        form: '表單',
        submitted: '提交時間',
        status: '狀態',
        read: '已讀',
        unread: '未讀',
        ip: 'IP',
        userAgent: '使用者代理',
        markAsRead: '標記為已讀',
      },
      builderLinkLabel: '開啟表單編輯器',
      loading: '載入中...',
    },
    list: {
      title: '表單提交',
      description: '檢視並匯出建站表單提交。',
      summary: (formId, shown) => `${formId} · 顯示 ${shown} 筆`,
      forms: '表單列表',
      exportCsv: '匯出 CSV',
      searchPlaceholder: '搜尋提交',
      status: {
        status: '狀態',
        date: '日期',
        name: '姓名',
        email: '電子郵件',
        summary: '摘要',
      },
      noSubmissionsYet: '目前尚無提交。',
      noMatchingSubmissions: '沒有符合的提交。',
      detail: {
        title: '提交詳情',
        closeLabel: '關閉詳情',
        submissionId: '提交 ID',
        date: '日期',
        status: '狀態',
        read: '已讀',
        unread: '未讀',
        ip: 'IP',
        userAgent: '使用者代理',
      },
      loading: '載入中...',
      emptyFormIds: '沒有表單',
    },
    builder: {
      title: '表單編輯器',
      description: '重新排列表單欄位，並設定多步驟與條件式邏輯。',
      body: '使用拖放重新排列欄位，並套用 step 分割與條件式邏輯。',
    },
  },
  en: {
    dashboard: {
      title: 'Form Submissions',
      description: 'Review form submissions.',
      summary: (formId, total, unread) => `${formId} · ${total} total · ${unread} unread`,
      openBuilder: 'Open form builder',
      refresh: 'Refresh',
      searchPlaceholder: 'Search name, email, message...',
      categoryAll: 'All categories',
      dateAll: 'All time',
      date7d: 'Last 7 days',
      date30d: 'Last 30 days',
      statusAll: 'All status',
      unreadOnly: 'Unread only',
      readOnly: 'Read only',
      shown: (shown, total) => `${shown} of ${total} shown`,
      noSubmissionsYet: 'No submissions yet.',
      noMatchingSubmissions: 'No matching submissions.',
      table: {
        status: 'Status',
        date: 'Date',
        name: 'Name',
        email: 'Email',
        category: 'Category',
        message: 'Message',
      },
      detail: {
        title: 'Submission detail',
        closeLabel: 'Close detail',
        submissionId: 'Submission ID',
        form: 'Form',
        submitted: 'Submitted',
        status: 'Status',
        read: 'Read',
        unread: 'Unread',
        ip: 'IP',
        userAgent: 'User agent',
        markAsRead: 'Mark as Read',
      },
      builderLinkLabel: 'Open form builder',
      loading: 'Loading...',
    },
    list: {
      title: 'Form Submissions',
      description: 'Review builder form submissions.',
      summary: (formId, shown) => `${formId} · ${shown} shown`,
      forms: 'Forms',
      exportCsv: 'Export CSV',
      searchPlaceholder: 'Search submissions',
      status: {
        status: 'Status',
        date: 'Date',
        name: 'Name',
        email: 'Email',
        summary: 'Summary',
      },
      noSubmissionsYet: 'No submissions yet.',
      noMatchingSubmissions: 'No matching submissions.',
      detail: {
        title: 'Submission detail',
        closeLabel: 'Close detail',
        submissionId: 'Submission ID',
        date: 'Date',
        status: 'Status',
        read: 'Read',
        unread: 'Unread',
        ip: 'IP',
        userAgent: 'User agent',
      },
      loading: 'Loading...',
      emptyFormIds: 'No forms',
    },
    builder: {
      title: 'Form Builder',
      description: 'Reorder form fields and configure multi-step and conditional logic.',
      body: 'Reorder fields with drag and drop, then apply step splitting and conditional logic.',
    },
  },
};

export function getFormsCopy(locale: Locale): FormsCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.ko;
}
