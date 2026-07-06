import type { Locale } from '@/lib/locales';

export interface BlogArchiveCopy {
  inspector: {
    groupSection: string;
    groupBy: string;
    month: string;
    year: string;
    displaySection: string;
    expandLatest: string;
    showCount: string;
  };
  element: {
    title: string;
    emptyState: string;
    yearMonthLabel: (year: number, month: number) => string;
  };
}

const BLOG_ARCHIVE_COPY: Record<Locale | 'en', BlogArchiveCopy> = {
  ko: {
    inspector: {
      groupSection: '그룹',
      groupBy: '그룹 기준',
      month: '연 › 월',
      year: '연도만',
      displaySection: '표시',
      expandLatest: '최신 연도 자동 펼침',
      showCount: '글 수 보이기',
    },
    element: {
      title: '아카이브',
      emptyState: '등록된 글이 없습니다.',
      yearMonthLabel: (year, month) => `${year}-${String(month).padStart(2, '0')}`,
    },
  },
  'zh-hant': {
    inspector: {
      groupSection: '分組',
      groupBy: '分組依據',
      month: '年 › 月',
      year: '僅年份',
      displaySection: '顯示',
      expandLatest: '自動展開最新年份',
      showCount: '顯示文章數',
    },
    element: {
      title: '彙整',
      emptyState: '尚無文章。',
      yearMonthLabel: (year, month) => `${year}-${String(month).padStart(2, '0')}`,
    },
  },
  en: {
    inspector: {
      groupSection: 'Group',
      groupBy: 'Group by',
      month: 'Year › Month',
      year: 'Year only',
      displaySection: 'Display',
      expandLatest: 'Expand latest year',
      showCount: 'Show post count',
    },
    element: {
      title: 'Archive',
      emptyState: 'No posts yet.',
      yearMonthLabel: (year, month) => `${year}-${String(month).padStart(2, '0')}`,
    },
  },
};

export function getBlogArchiveCopy(locale?: Locale | string | null): BlogArchiveCopy {
  if (locale === 'ko') return BLOG_ARCHIVE_COPY.ko;
  if (locale === 'zh-hant') return BLOG_ARCHIVE_COPY['zh-hant'];
  return BLOG_ARCHIVE_COPY.en;
}
