import type { Locale } from '@/lib/locales';

export interface BlogFeedCopy {
  inspector: {
    layoutSection: string;
    layoutLabel: string;
    columns: string;
    gap: string;
    postsPerPage: string;
    filterSortSection: string;
    sortBy: string;
    filterByCategory: string;
    filterByTag: string;
    displaySection: string;
    featuredImage: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readingTime: string;
    tags: string;
    layoutOptions: Record<'grid' | 'list' | 'masonry' | 'featured-hero', string>;
    sortOptions: Record<'newest' | 'oldest' | 'featured-first', string>;
    allCategories: string;
    tagPlaceholder: string;
  };
  element: {
    loading: string;
    errorPrefix: string;
    loadError: string;
    emptyState: string;
    featuredBadge: string;
    readMore: string;
    ariaLabel: (title: string) => string;
    readingTimeLabel: (minutes: number) => string;
    mockAuthorName: string;
    mockPosts: Array<{
      title: string;
      excerpt: string;
      category: string;
      tags: string[];
      readingTimeMinutes: number;
      featured: boolean;
      publishedAt: string;
    }>;
  };
}

const BLOG_FEED_COPY: Record<Locale | 'en', BlogFeedCopy> = {
  ko: {
    inspector: {
      layoutSection: '레이아웃',
      layoutLabel: '레이아웃',
      columns: '열 수',
      gap: '간격 (px)',
      postsPerPage: '페이지당 게시물 수',
      filterSortSection: '필터 및 정렬',
      sortBy: '정렬 기준',
      filterByCategory: '카테고리 필터',
      filterByTag: '태그 필터',
      displaySection: '표시',
      featuredImage: '대표 이미지',
      category: '카테고리',
      excerpt: '요약',
      author: '작성자',
      date: '날짜',
      readingTime: '읽는 시간',
      tags: '태그',
      layoutOptions: {
        grid: '그리드',
        list: '리스트',
        masonry: '메이슨리',
        'featured-hero': '대표 히어로',
      },
      sortOptions: {
        newest: '최신순',
        oldest: '오래된순',
        'featured-first': '추천 우선',
      },
      allCategories: '전체 카테고리',
      tagPlaceholder: '예: wage',
    },
    element: {
      loading: '게시물을 불러오는 중...',
      errorPrefix: '블로그 피드 오류:',
      loadError: '게시물을 불러오지 못했습니다.',
      emptyState: '블로그 피드 · 등록된 글이 없습니다.',
      featuredBadge: '추천',
      readMore: '자세히 보기',
      ariaLabel: (title: string) => `${title} 글 보기`,
      readingTimeLabel: (minutes: number) => `${minutes}분 읽기`,
      mockAuthorName: '호정국제 법률사무소',
      mockPosts: [
        {
          title: '대만 회사 설립 가이드',
          excerpt: '외국인이 대만에서 법인을 설립하는 절차와 필요한 서류를 알아봅니다.',
          category: 'company-formation',
          tags: ['외투'],
          readingTimeMinutes: 6,
          featured: true,
          publishedAt: '2026-04-12',
        },
        {
          title: '교통사고 합의금 산정 기준',
          excerpt: '대만 교통사고 처리 절차와 적정 합의금 산정 방법.',
          category: 'traffic-accident',
          tags: ['보험'],
          readingTimeMinutes: 4,
          featured: false,
          publishedAt: '2026-04-08',
        },
        {
          title: '대만 노동법 핵심 정리',
          excerpt: '연차/퇴직금/시간외 수당 등 외국인 근로자가 알아야 할 사항.',
          category: 'labor-law',
          tags: ['연차'],
          readingTimeMinutes: 7,
          featured: false,
          publishedAt: '2026-04-01',
        },
        {
          title: '국제이혼 관할권 분쟁',
          excerpt: '국적이 다른 부부의 이혼소송에서 어느 나라 법원에 제소할지.',
          category: 'family-law',
          tags: [],
          readingTimeMinutes: 5,
          featured: true,
          publishedAt: '2026-03-25',
        },
        {
          title: '형사 변호 조력 절차',
          excerpt: '경찰 조사부터 검찰 송치, 공판까지의 변호인 역할.',
          category: 'criminal-law',
          tags: [],
          readingTimeMinutes: 3,
          featured: false,
          publishedAt: '2026-03-19',
        },
        {
          title: '국제 상속 절차',
          excerpt: '대만에 자산을 둔 외국인 사망 시 상속 처리 흐름.',
          category: 'inheritance',
          tags: [],
          readingTimeMinutes: 6,
          featured: false,
          publishedAt: '2026-03-12',
        },
      ],
    },
  },
  'zh-hant': {
    inspector: {
      layoutSection: '版面',
      layoutLabel: '版面',
      columns: '欄數',
      gap: '間距 (px)',
      postsPerPage: '每頁文章數',
      filterSortSection: '篩選與排序',
      sortBy: '排序依據',
      filterByCategory: '分類篩選',
      filterByTag: '標籤篩選',
      displaySection: '顯示',
      featuredImage: '精選圖片',
      category: '分類',
      excerpt: '摘要',
      author: '作者',
      date: '日期',
      readingTime: '閱讀時間',
      tags: '標籤',
      layoutOptions: {
        grid: '格狀',
        list: '列表',
        masonry: '瀑布流',
        'featured-hero': '精選主視覺',
      },
      sortOptions: {
        newest: '最新優先',
        oldest: '最舊優先',
        'featured-first': '精選優先',
      },
      allCategories: '所有分類',
      tagPlaceholder: '例如：wage',
    },
    element: {
      loading: '文章載入中...',
      errorPrefix: '部落格摘要錯誤：',
      loadError: '無法載入文章。',
      emptyState: '部落格摘要 · 尚無文章。',
      featuredBadge: '精選',
      readMore: '閱讀更多',
      ariaLabel: (title: string) => `查看 ${title} 文章`,
      readingTimeLabel: (minutes: number) => `${minutes}分鐘閱讀`,
      mockAuthorName: '灝正國際法律事務所',
      mockPosts: [
        {
          title: '台灣公司設立指南',
          excerpt: '了解外國人在台灣設立公司的流程與所需文件。',
          category: 'company-formation',
          tags: ['外資'],
          readingTimeMinutes: 6,
          featured: true,
          publishedAt: '2026-04-12',
        },
        {
          title: '交通事故和解金評估標準',
          excerpt: '台灣交通事故處理流程與合理和解金評估方式。',
          category: 'traffic-accident',
          tags: ['保險'],
          readingTimeMinutes: 4,
          featured: false,
          publishedAt: '2026-04-08',
        },
        {
          title: '台灣勞動法重點整理',
          excerpt: '年假、資遣費、加班費等外籍工作者需要了解的事項。',
          category: 'labor-law',
          tags: ['年假'],
          readingTimeMinutes: 7,
          featured: false,
          publishedAt: '2026-04-01',
        },
        {
          title: '跨國離婚管轄權爭議',
          excerpt: '不同國籍配偶離婚訴訟中如何判斷應向哪一國法院提起。',
          category: 'family-law',
          tags: [],
          readingTimeMinutes: 5,
          featured: true,
          publishedAt: '2026-03-25',
        },
        {
          title: '刑事辯護協助流程',
          excerpt: '從警詢、移送檢方到審判程序中的辯護人角色。',
          category: 'criminal-law',
          tags: [],
          readingTimeMinutes: 3,
          featured: false,
          publishedAt: '2026-03-19',
        },
        {
          title: '跨國繼承程序',
          excerpt: '外國人在台灣留有資產時的繼承處理流程。',
          category: 'inheritance',
          tags: [],
          readingTimeMinutes: 6,
          featured: false,
          publishedAt: '2026-03-12',
        },
      ],
    },
  },
  en: {
    inspector: {
      layoutSection: 'Layout',
      layoutLabel: 'Layout',
      columns: 'Columns',
      gap: 'Gap (px)',
      postsPerPage: 'Posts per page',
      filterSortSection: 'Filter & Sort',
      sortBy: 'Sort by',
      filterByCategory: 'Filter by category',
      filterByTag: 'Filter by tag',
      displaySection: 'Display',
      featuredImage: 'Featured image',
      category: 'Category',
      excerpt: 'Excerpt',
      author: 'Author',
      date: 'Date',
      readingTime: 'Reading time',
      tags: 'Tags',
      layoutOptions: {
        grid: 'Grid',
        list: 'List',
        masonry: 'Masonry',
        'featured-hero': 'Featured Hero',
      },
      sortOptions: {
        newest: 'Newest first',
        oldest: 'Oldest first',
        'featured-first': 'Featured first',
      },
      allCategories: 'All categories',
      tagPlaceholder: 'e.g. wage',
    },
    element: {
      loading: 'Loading posts...',
      errorPrefix: 'Blog feed error:',
      loadError: 'Failed to load posts.',
      emptyState: 'Blog Feed · No posts yet.',
      featuredBadge: 'Featured',
      readMore: 'Read more',
      ariaLabel: (title: string) => `View ${title} post`,
      readingTimeLabel: (minutes: number) => `${minutes} min read`,
      mockAuthorName: 'HoJung International Law Office',
      mockPosts: [
        {
          title: 'Taiwan company formation guide',
          excerpt: 'Learn the process and required documents for foreigners setting up a company in Taiwan.',
          category: 'company-formation',
          tags: ['foreign investment'],
          readingTimeMinutes: 6,
          featured: true,
          publishedAt: '2026-04-12',
        },
        {
          title: 'Traffic accident settlement standards',
          excerpt: 'Taiwan traffic accident procedures and practical settlement valuation.',
          category: 'traffic-accident',
          tags: ['insurance'],
          readingTimeMinutes: 4,
          featured: false,
          publishedAt: '2026-04-08',
        },
        {
          title: 'Taiwan labor law essentials',
          excerpt: 'Annual leave, severance, overtime pay, and other points foreign workers should know.',
          category: 'labor-law',
          tags: ['leave'],
          readingTimeMinutes: 7,
          featured: false,
          publishedAt: '2026-04-01',
        },
        {
          title: 'International divorce jurisdiction disputes',
          excerpt: 'How cross-national couples determine which court should hear a divorce case.',
          category: 'family-law',
          tags: [],
          readingTimeMinutes: 5,
          featured: true,
          publishedAt: '2026-03-25',
        },
        {
          title: 'Criminal defense support process',
          excerpt: 'The defense counsel role from police questioning through prosecution and trial.',
          category: 'criminal-law',
          tags: [],
          readingTimeMinutes: 3,
          featured: false,
          publishedAt: '2026-03-19',
        },
        {
          title: 'International inheritance procedures',
          excerpt: 'How inheritance proceeds when a foreign national leaves assets in Taiwan.',
          category: 'inheritance',
          tags: [],
          readingTimeMinutes: 6,
          featured: false,
          publishedAt: '2026-03-12',
        },
      ],
    },
  },
};

export function getBlogFeedCopy(locale?: Locale | string | null): BlogFeedCopy {
  if (locale === 'ko') return BLOG_FEED_COPY.ko;
  if (locale === 'zh-hant') return BLOG_FEED_COPY['zh-hant'];
  return BLOG_FEED_COPY.en;
}
