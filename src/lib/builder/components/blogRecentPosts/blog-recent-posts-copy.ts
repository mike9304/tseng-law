import type { Locale } from '@/lib/locales';

export interface BlogRecentPostMock {
  postId: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  date: string;
}

export interface BlogRecentPostsCopy {
  element: {
    loading: string;
    emptyState: string;
    mockPosts: BlogRecentPostMock[];
  };
}

const BLOG_RECENT_POSTS_COPY: Record<Locale | 'en', BlogRecentPostsCopy> = {
  ko: {
    element: {
      loading: '게시물을 불러오는 중...',
      emptyState: '최근 공개 글이 없습니다.',
      mockPosts: [
        {
          postId: 'recent-1',
          slug: 'recent-1',
          title: '대만 회사설립 체크리스트',
          excerpt: '법인 설립 전 확인해야 할 절차와 실무 쟁점.',
          category: 'company-formation',
          authorName: '호정국제 법률사무소',
          date: '2026-04-12',
        },
        {
          postId: 'recent-2',
          slug: 'recent-2',
          title: '노동계약 분쟁 대응',
          excerpt: '근로계약, 퇴직금, 해고 통지 관련 핵심 정리.',
          category: 'labor-law',
          authorName: '대만 비즈니스 법무팀',
          date: '2026-04-08',
        },
        {
          postId: 'recent-3',
          slug: 'recent-3',
          title: '교통사고 합의 절차',
          excerpt: '보험사 협의와 손해 산정에서 놓치기 쉬운 항목.',
          category: 'traffic-accident',
          authorName: '분쟁대응팀',
          date: '2026-04-01',
        },
      ],
    },
  },
  'zh-hant': {
    element: {
      loading: '文章載入中...',
      emptyState: '目前沒有最新公開文章。',
      mockPosts: [
        {
          postId: 'recent-1',
          slug: 'recent-1',
          title: '台灣公司設立檢查清單',
          excerpt: '公司設立前應確認的程序與實務重點。',
          category: 'company-formation',
          authorName: '浩正國際法律事務所',
          date: '2026-04-12',
        },
        {
          postId: 'recent-2',
          slug: 'recent-2',
          title: '勞動契約爭議應對',
          excerpt: '勞動契約、退休金與解僱通知的重點整理。',
          category: 'labor-law',
          authorName: '台灣商務法律團隊',
          date: '2026-04-08',
        },
        {
          postId: 'recent-3',
          slug: 'recent-3',
          title: '交通事故和解程序',
          excerpt: '與保險公司協商及損害計算時容易忽略的項目。',
          category: 'traffic-accident',
          authorName: '爭議處理團隊',
          date: '2026-04-01',
        },
      ],
    },
  },
  en: {
    element: {
      loading: 'Loading posts...',
      emptyState: 'No recent posts yet.',
      mockPosts: [
        {
          postId: 'recent-1',
          slug: 'recent-1',
          title: 'Taiwan company setup checklist',
          excerpt: 'Procedures and practical issues to review before company formation.',
          category: 'company-formation',
          authorName: 'Hojung International Law Office',
          date: '2026-04-12',
        },
        {
          postId: 'recent-2',
          slug: 'recent-2',
          title: 'Responding to employment contract disputes',
          excerpt: 'Key points on employment contracts, severance, and dismissal notices.',
          category: 'labor-law',
          authorName: 'Taiwan business legal team',
          date: '2026-04-08',
        },
        {
          postId: 'recent-3',
          slug: 'recent-3',
          title: 'Traffic accident settlement process',
          excerpt: 'Commonly missed items in insurer negotiations and damage calculations.',
          category: 'traffic-accident',
          authorName: 'Dispute response team',
          date: '2026-04-01',
        },
      ],
    },
  },
};

export function getBlogRecentPostsCopy(locale?: Locale | string | null): BlogRecentPostsCopy {
  if (locale === 'ko') return BLOG_RECENT_POSTS_COPY.ko;
  if (locale === 'zh-hant') return BLOG_RECENT_POSTS_COPY['zh-hant'];
  return BLOG_RECENT_POSTS_COPY.en;
}
