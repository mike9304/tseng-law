import type { Locale } from '@/lib/locales';

export interface ColumnsCopy {
  title: string;
  description: string;
  eyebrow: string;
  searchLabel: string;
  statusLabel: string;
  newButton: string;
}

const COLUMNS_COPY: Record<Locale, ColumnsCopy> = {
  ko: {
    title: '칼럼 관리',
    description: '칼럼 초안 목록과 생성 관리 화면입니다.',
    eyebrow: '블로그 관리자',
    searchLabel: '검색',
    statusLabel: '상태',
    newButton: '+ 새 글 쓰기',
  },
  'zh-hant': {
    title: '欄目管理',
    description: '欄目草稿列表與建立管理頁面。',
    eyebrow: '部落格管理',
    searchLabel: '搜尋',
    statusLabel: '狀態',
    newButton: '+ 建立草稿',
  },
  en: {
    title: 'Builder Columns Admin',
    description: 'Column draft list and creation admin surface.',
    eyebrow: 'Blog manager',
    searchLabel: 'Search',
    statusLabel: 'Status',
    newButton: '+ New post',
  },
};

export function getColumnsCopy(locale: Locale): ColumnsCopy {
  return COLUMNS_COPY[locale] ?? COLUMNS_COPY.en;
}
