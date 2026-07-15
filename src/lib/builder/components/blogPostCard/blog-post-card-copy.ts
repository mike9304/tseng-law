import type { Locale } from '@/lib/locales';

export interface BlogPostCardCopy {
  section: {
    post: string;
    cardStyle: string;
    display: string;
  };
  inspector: {
    postSlug: string;
    postPlaceholder: string;
    manualPostIdOverride: string;
    manualPostIdPlaceholder: string;
    cardVariant: string;
    featuredImage: string;
    category: string;
    excerpt: string;
    author: string;
    date: string;
    readingTime: string;
    selectPost: string;
  };
  runtime: {
    featuredBadge: string;
    selectPostNotice: string;
    loadingNotice: string;
    unavailableNotice: string;
    loadingTitle: string;
    loadingExcerpt: string;
    publishedLoadingTitle: string;
    publishedLoadingExcerpt: string;
    errorExcerpt: string;
    publishedNoPostTitle: string;
    publishedNoPostExcerpt: string;
    publishedUnavailableTitle: string;
    publishedUnavailableExcerpt: string;
    generalCategory: string;
    readMore: string;
    readingTime: (minutes: number) => string;
    cardAriaLabel: (title: string) => string;
    postNotFound: (postId: string) => string;
    failedToLoadPost: (postId: string) => string;
    mockPost: {
      title: string;
      excerpt: string;
      authorName: string;
      authorTitle: string;
    };
  };
  variants: Record<string, string>;
}

const BLOG_POST_CARD_COPY: Record<Locale | 'en', BlogPostCardCopy> = {
  ko: {
    section: {
      post: '게시물',
      cardStyle: '카드 스타일',
      display: '표시',
    },
    inspector: {
      postSlug: '게시물 (slug)',
      postPlaceholder: '— 게시물 선택 —',
      manualPostIdOverride: '수동 postId 재정의',
      manualPostIdPlaceholder: 'custom-slug',
      cardVariant: '카드 변형',
      featuredImage: '대표 이미지',
      category: '카테고리',
      excerpt: '요약',
      author: '작성자',
      date: '날짜',
      readingTime: '읽는 시간',
      selectPost: '게시물 선택',
    },
    runtime: {
      featuredBadge: '추천',
      selectPostNotice: '게시물 선택',
      loadingNotice: '불러오는 중',
      unavailableNotice: '사용 불가',
      loadingTitle: '게시물 불러오는 중...',
      loadingExcerpt: '선택한 블로그 글을 불러오는 중입니다.',
      publishedLoadingTitle: '글을 불러오는 중입니다',
      publishedLoadingExcerpt: '잠시만 기다려 주세요.',
      errorExcerpt: '블로그 관리자에서 공개 상태 또는 slug 값을 확인하세요.',
      publishedNoPostTitle: '표시할 글이 없습니다',
      publishedNoPostExcerpt: '이 영역에는 현재 표시할 콘텐츠가 없습니다.',
      publishedUnavailableTitle: '글을 표시할 수 없습니다',
      publishedUnavailableExcerpt: '현재 이 글을 표시할 수 없습니다.',
      generalCategory: '일반',
      readMore: '자세히 보기',
      readingTime: (minutes) => `${minutes}분 읽기`,
      cardAriaLabel: (title) => `${title} 글 보기`,
      postNotFound: (postId) => `게시물을 찾을 수 없음: ${postId}`,
      failedToLoadPost: (postId) => `게시물을 불러오지 못함: ${postId}`,
      mockPost: {
        title: '대만 회사 설립 가이드',
        excerpt: '외국인이 대만에서 법인을 설립하는 절차와 필요한 서류를 알아봅니다.',
        authorName: '호정국제 법률사무소',
        authorTitle: 'Taiwan Legal Desk',
      },
    },
    variants: {
      flat: '평면',
      elevated: '고급',
      floating: '부유',
      glass: '글래스',
      split: '분할',
      editorial: '에디토리얼',
      compact: '컴팩트',
      spotlight: '스포트라이트',
      outline: '윤곽선',
      timeline: '타임라인',
      soft: '부드러운',
      contrast: '강한 대비',
    },
  },
  'zh-hant': {
    section: {
      post: '文章',
      cardStyle: '卡片樣式',
      display: '顯示',
    },
    inspector: {
      postSlug: '文章（slug）',
      postPlaceholder: '— 選擇文章 —',
      manualPostIdOverride: '手動覆寫 postId',
      manualPostIdPlaceholder: 'custom-slug',
      cardVariant: '卡片變體',
      featuredImage: '精選圖片',
      category: '分類',
      excerpt: '摘要',
      author: '作者',
      date: '日期',
      readingTime: '閱讀時間',
      selectPost: '選擇文章',
    },
    runtime: {
      featuredBadge: '精選',
      selectPostNotice: '選擇文章',
      loadingNotice: '載入中',
      unavailableNotice: '無法使用',
      loadingTitle: '正在載入文章...',
      loadingExcerpt: '正在載入選取的部落格文章。',
      publishedLoadingTitle: '正在載入文章',
      publishedLoadingExcerpt: '請稍候。',
      errorExcerpt: '請在部落格管理員確認發布狀態或 slug 值。',
      publishedNoPostTitle: '目前沒有可顯示的文章',
      publishedNoPostExcerpt: '此區域目前沒有可顯示的內容。',
      publishedUnavailableTitle: '目前無法顯示文章',
      publishedUnavailableExcerpt: '目前無法提供此文章內容。',
      generalCategory: '一般',
      readMore: '閱讀更多',
      readingTime: (minutes) => `閱讀 ${minutes} 分鐘`,
      cardAriaLabel: (title) => `閱讀「${title}」`,
      postNotFound: (postId) => `找不到文章：${postId}`,
      failedToLoadPost: (postId) => `無法載入文章：${postId}`,
      mockPost: {
        title: '台灣公司設立指南',
        excerpt: '了解外國人在台灣設立公司的流程與所需文件。',
        authorName: '灝正國際法律事務所',
        authorTitle: '台灣法律服務',
      },
    },
    variants: {
      flat: '平面',
      elevated: '提升',
      floating: '浮動',
      glass: '玻璃',
      split: '分欄',
      editorial: '編輯風',
      compact: '精簡',
      spotlight: '聚光',
      outline: '外框',
      timeline: '時間軸',
      soft: '柔和',
      contrast: '高對比',
    },
  },
  en: {
    section: {
      post: 'Post',
      cardStyle: 'Card style',
      display: 'Display',
    },
    inspector: {
      postSlug: 'Post (slug)',
      postPlaceholder: '— Select post —',
      manualPostIdOverride: 'Manual postId override',
      manualPostIdPlaceholder: 'custom-slug',
      cardVariant: 'Card variant',
      featuredImage: 'Featured image',
      category: 'Category',
      excerpt: 'Excerpt',
      author: 'Author',
      date: 'Date',
      readingTime: 'Reading time',
      selectPost: 'Select post',
    },
    runtime: {
      featuredBadge: 'Featured',
      selectPostNotice: 'Select post',
      loadingNotice: 'Loading',
      unavailableNotice: 'Unavailable',
      loadingTitle: 'Loading post...',
      loadingExcerpt: 'Loading the selected blog post.',
      publishedLoadingTitle: 'Loading article',
      publishedLoadingExcerpt: 'Please wait while the article loads.',
      errorExcerpt: 'Check the publish status or slug in the blog manager.',
      publishedNoPostTitle: 'No article available',
      publishedNoPostExcerpt: 'There is currently no article to display.',
      publishedUnavailableTitle: 'Article unavailable',
      publishedUnavailableExcerpt: 'This article is currently unavailable.',
      generalCategory: 'General',
      readMore: 'Read more',
      readingTime: (minutes) => `${minutes} min read`,
      cardAriaLabel: (title) => `Read ${title}`,
      postNotFound: (postId) => `Post not found: ${postId}`,
      failedToLoadPost: (postId) => `Failed to load post: ${postId}`,
      mockPost: {
        title: 'Taiwan company formation guide',
        excerpt: 'Learn the process and required documents for foreigners setting up a company in Taiwan.',
        authorName: 'HoJung International Law Office',
        authorTitle: 'Taiwan Legal Desk',
      },
    },
    variants: {
      flat: 'Flat',
      elevated: 'Elevated',
      floating: 'Floating',
      glass: 'Glass',
      split: 'Split',
      editorial: 'Editorial',
      compact: 'Compact',
      spotlight: 'Spotlight',
      outline: 'Outline',
      timeline: 'Timeline',
      soft: 'Soft',
      contrast: 'Contrast',
    },
  },
};

export function getBlogPostCardCopy(locale?: Locale | string | null): BlogPostCardCopy {
  if (locale === 'ko') return BLOG_POST_CARD_COPY.ko;
  if (locale === 'zh-hant') return BLOG_POST_CARD_COPY['zh-hant'];
  return BLOG_POST_CARD_COPY.en;
}
