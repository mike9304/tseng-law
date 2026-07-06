import type { Locale } from '@/lib/locales';

export interface BlogAuthorCopy {
  loading: string;
  empty: string;
  fallbackAuthorName: string;
  mock: {
    authorName: string;
    authorTitle: string;
    authorBio: string;
    postTitle: string;
    postExcerpt: string;
  };
}

const BLOG_AUTHOR_COPY: Record<Locale, BlogAuthorCopy> = {
  ko: {
    loading: '작성자를 불러오는 중...',
    empty: '표시할 작성자가 없습니다.',
    fallbackAuthorName: '호정국제 법률사무소',
    mock: {
      authorName: '호정국제 법률사무소',
      authorTitle: '법률 콘텐츠팀',
      authorBio: '대만 법률 실무와 외국인 상담 경험을 바탕으로 칼럼을 검토합니다.',
      postTitle: '대만 회사설립 체크리스트',
      postExcerpt: '법인 설립 전 확인해야 할 절차와 실무 쟁점.',
    },
  },
  'zh-hant': {
    loading: '正在載入作者...',
    empty: '沒有可顯示的作者。',
    fallbackAuthorName: '灝正國際法律事務所',
    mock: {
      authorName: '灝正國際法律事務所',
      authorTitle: '法律內容團隊',
      authorBio: '根據台灣法律實務與外國人諮詢經驗審閱專欄內容。',
      postTitle: '台灣公司設立檢查清單',
      postExcerpt: '設立公司前需要確認的流程與實務重點。',
    },
  },
  en: {
    loading: 'Loading authors...',
    empty: 'No authors to display.',
    fallbackAuthorName: 'HoJung International Law Office',
    mock: {
      authorName: 'HoJung International Law Office',
      authorTitle: 'Legal editorial team',
      authorBio: 'Reviews columns based on Taiwan legal practice and foreign-client advisory experience.',
      postTitle: 'Taiwan company setup checklist',
      postExcerpt: 'Key procedures and practical issues to check before forming a company.',
    },
  },
};

export function getBlogAuthorCopy(locale?: Locale | string | null): BlogAuthorCopy {
  if (locale === 'zh-hant') return BLOG_AUTHOR_COPY['zh-hant'];
  if (locale === 'en') return BLOG_AUTHOR_COPY.en;
  return BLOG_AUTHOR_COPY.ko;
}
