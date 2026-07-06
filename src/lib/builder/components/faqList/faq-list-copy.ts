import type { Locale } from '@/lib/locales';

export interface FaqListCopy {
  all: string;
  categoriesLabel: string;
  loading: string;
  noResults: string;
  searchLabel: string;
  searchPlaceholder: string;
  emptyState: string;
  inspector: {
    source: string;
    sourceStatic: string;
    sourceApp: string;
    category: string;
    limit: string;
    showSearch: string;
    showCategoryFilter: string;
    expandFirst: string;
    schemaEnabled: string;
    items: (count: number) => string;
    questionPlaceholder: string;
    answerPlaceholder: string;
    removeItem: string;
    addItem: string;
  };
}

const FAQ_LIST_COPY: Record<Locale, FaqListCopy> = {
  ko: {
    all: '전체',
    categoriesLabel: 'FAQ 분류',
    loading: 'FAQ 불러오는 중...',
    noResults: '조건에 맞는 FAQ가 없습니다.',
    searchLabel: 'FAQ 검색',
    searchPlaceholder: '질문 검색',
    emptyState: 'FAQ 목록이 없습니다.',
    inspector: {
      source: '소스',
      sourceStatic: '직접 입력',
      sourceApp: 'FAQ 앱 데이터',
      category: '카테고리',
      limit: '표시 수',
      showSearch: '검색창 표시',
      showCategoryFilter: '카테고리 필터 표시',
      expandFirst: '첫 질문 열기',
      schemaEnabled: 'FAQPage schema 출력',
      items: (count: number) => `항목 (${count})`,
      questionPlaceholder: '질문',
      answerPlaceholder: '답변',
      removeItem: '제거',
      addItem: '+ Q&A 추가',
    },
  },
  'zh-hant': {
    all: '全部',
    categoriesLabel: 'FAQ 分類',
    loading: 'FAQ 載入中...',
    noResults: '沒有符合條件的 FAQ。',
    searchLabel: '搜尋 FAQ',
    searchPlaceholder: '搜尋問題',
    emptyState: '沒有 FAQ 項目。',
    inspector: {
      source: '來源',
      sourceStatic: '手動輸入',
      sourceApp: 'FAQ 應用資料',
      category: '分類',
      limit: '顯示數量',
      showSearch: '顯示搜尋框',
      showCategoryFilter: '顯示分類篩選',
      expandFirst: '展開第一個問題',
      schemaEnabled: '輸出 FAQPage schema',
      items: (count: number) => `項目 (${count})`,
      questionPlaceholder: '問題',
      answerPlaceholder: '答案',
      removeItem: '移除',
      addItem: '+ 新增 Q&A',
    },
  },
  en: {
    all: 'All',
    categoriesLabel: 'FAQ categories',
    loading: 'Loading FAQ...',
    noResults: 'No FAQ results.',
    searchLabel: 'Search FAQ',
    searchPlaceholder: 'Search questions',
    emptyState: 'No FAQ items.',
    inspector: {
      source: 'Source',
      sourceStatic: 'Manual entries',
      sourceApp: 'FAQ app data',
      category: 'Category',
      limit: 'Limit',
      showSearch: 'Show search',
      showCategoryFilter: 'Show category filter',
      expandFirst: 'Open first question',
      schemaEnabled: 'Output FAQPage schema',
      items: (count: number) => `Items (${count})`,
      questionPlaceholder: 'Question',
      answerPlaceholder: 'Answer',
      removeItem: 'Remove',
      addItem: '+ Add Q&A',
    },
  },
};

export function getFaqListCopy(locale: Locale): FaqListCopy {
  return FAQ_LIST_COPY[locale] ?? FAQ_LIST_COPY.ko;
}
