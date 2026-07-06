import type { Locale } from '@/lib/locales';

export interface BlogCategoriesCopy {
  inspector: {
    layoutSection: string;
    layoutLabel: string;
    layoutOptions: Record<'horizontal' | 'vertical' | 'grid', string>;
    displaySection: string;
    showAll: string;
    showPostCount: string;
    activeColorSection: string;
    colorLabel: string;
    colorPlaceholder: string;
  };
  element: {
    allLabel: string;
  };
}

const BLOG_CATEGORIES_COPY: Record<Locale | 'en', BlogCategoriesCopy> = {
  ko: {
    inspector: {
      layoutSection: '레이아웃',
      layoutLabel: '레이아웃',
      layoutOptions: {
        horizontal: '가로',
        vertical: '세로',
        grid: '그리드',
      },
      displaySection: '표시',
      showAll: '전체 카테고리 보이기',
      showPostCount: '글 수 보이기',
      activeColorSection: '활성 색상',
      colorLabel: '색상 (hex)',
      colorPlaceholder: '#0b3b2e',
    },
    element: {
      allLabel: '전체',
    },
  },
  'zh-hant': {
    inspector: {
      layoutSection: '版面',
      layoutLabel: '版面',
      layoutOptions: {
        horizontal: '橫向',
        vertical: '直向',
        grid: '格狀',
      },
      displaySection: '顯示',
      showAll: '顯示「全部」分類',
      showPostCount: '顯示文章數',
      activeColorSection: '啟用色',
      colorLabel: '顏色（hex）',
      colorPlaceholder: '#0b3b2e',
    },
    element: {
      allLabel: '全部',
    },
  },
  en: {
    inspector: {
      layoutSection: 'Layout',
      layoutLabel: 'Layout',
      layoutOptions: {
        horizontal: 'Horizontal',
        vertical: 'Vertical',
        grid: 'Grid',
      },
      displaySection: 'Display',
      showAll: 'Show “All” category',
      showPostCount: 'Show post count',
      activeColorSection: 'Active color',
      colorLabel: 'Color (hex)',
      colorPlaceholder: '#0b3b2e',
    },
    element: {
      allLabel: 'All',
    },
  },
};

export function getBlogCategoriesCopy(locale?: Locale | string | null): BlogCategoriesCopy {
  if (locale === 'ko') return BLOG_CATEGORIES_COPY.ko;
  if (locale === 'zh-hant') return BLOG_CATEGORIES_COPY['zh-hant'];
  return BLOG_CATEGORIES_COPY.en;
}
