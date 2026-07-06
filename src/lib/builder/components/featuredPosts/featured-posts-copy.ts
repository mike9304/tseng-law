import type { Locale } from '@/lib/locales';

export interface FeaturedPostMock {
  postId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
}

export interface FeaturedPostsCopy {
  inspector: {
    featuredSection: string;
    limit: string;
    layout: string;
    layoutOptions: Record<'hero' | 'side-by-side' | 'stacked', string>;
  };
  element: {
    emptyState: string;
    categoryPrefix: string;
    featuredMarker: string;
    mockPosts: FeaturedPostMock[];
  };
}

const FEATURED_POSTS_COPY: Record<Locale | 'en', FeaturedPostsCopy> = {
  ko: {
    inspector: {
      featuredSection: '피처드',
      limit: '개수',
      layout: '레이아웃',
      layoutOptions: {
        hero: '히어로 (1개 크게 + 사이드)',
        'side-by-side': '나란히',
        stacked: '세로',
      },
    },
    element: {
      emptyState: '피처드 글이 없습니다.',
      categoryPrefix: '카테고리',
      featuredMarker: '추천',
      mockPosts: [
        { postId: 'm1', slug: 'm1', title: '대만 회사 설립 가이드', excerpt: '외국인 법인 설립 절차 총정리.', category: 'company-formation' },
        { postId: 'm2', slug: 'm2', title: '국제이혼 관할권 분쟁', excerpt: '국적이 다른 부부의 이혼소송 관할 결정.', category: 'family-law' },
        { postId: 'm3', slug: 'm3', title: '교통사고 합의금 산정', excerpt: '대만 교통사고 합의금 적정선 산출.', category: 'traffic-accident' },
      ],
    },
  },
  'zh-hant': {
    inspector: {
      featuredSection: '精選',
      limit: '數量',
      layout: '版面',
      layoutOptions: {
        hero: '主視覺（1 個大卡 + 側欄）',
        'side-by-side': '並排',
        stacked: '堆疊',
      },
    },
    element: {
      emptyState: '尚無精選文章。',
      categoryPrefix: '分類',
      featuredMarker: '精選',
      mockPosts: [
        { postId: 'm1', slug: 'm1', title: '台灣公司設立指南', excerpt: '外國人設立公司的程序完整整理。', category: 'company-formation' },
        { postId: 'm2', slug: 'm2', title: '跨國離婚管轄權爭議', excerpt: '不同國籍夫妻離婚訴訟管轄的判斷重點。', category: 'family-law' },
        { postId: 'm3', slug: 'm3', title: '交通事故和解金估算', excerpt: '台灣交通事故和解金合理範圍的計算。', category: 'traffic-accident' },
      ],
    },
  },
  en: {
    inspector: {
      featuredSection: 'Featured',
      limit: 'Limit',
      layout: 'Layout',
      layoutOptions: {
        hero: 'Hero (1 big + side)',
        'side-by-side': 'Side-by-side',
        stacked: 'Stacked',
      },
    },
    element: {
      emptyState: 'No featured posts yet.',
      categoryPrefix: 'Category',
      featuredMarker: 'Featured',
      mockPosts: [
        { postId: 'm1', slug: 'm1', title: 'Taiwan company formation guide', excerpt: 'A practical overview of foreign company registration procedures.', category: 'company-formation' },
        { postId: 'm2', slug: 'm2', title: 'Cross-border divorce jurisdiction disputes', excerpt: 'How jurisdiction is decided for spouses with different nationalities.', category: 'family-law' },
        { postId: 'm3', slug: 'm3', title: 'Traffic accident settlement estimate', excerpt: 'Calculating a reasonable settlement range for Taiwan traffic accidents.', category: 'traffic-accident' },
      ],
    },
  },
};

export function getFeaturedPostsCopy(locale?: Locale | string | null): FeaturedPostsCopy {
  if (locale === 'ko') return FEATURED_POSTS_COPY.ko;
  if (locale === 'zh-hant') return FEATURED_POSTS_COPY['zh-hant'];
  return FEATURED_POSTS_COPY.en;
}
