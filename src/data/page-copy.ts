import type { Locale } from '@/lib/locales';

type PageSectionCopy = {
  label: string;
  title: string;
  description: string;
};

type PageCopy = {
  about: PageSectionCopy;
  services: PageSectionCopy;
  lawyers: PageSectionCopy;
  insights: PageSectionCopy;
  videos: PageSectionCopy;
  faq: PageSectionCopy;
  contact: PageSectionCopy;
  search: PageSectionCopy;
  pricing: PageSectionCopy;
  reviews: PageSectionCopy;
};

export const pageCopy: Record<Locale, PageCopy> = {
  ko: {
    about: {
      label: 'ABOUT',
      title: '호정 소개',
      description:
        '호정의 스토리와 한국 업무팀 구성원을 확인할 수 있습니다.'
    },
    services: {
      label: 'SERVICES',
      title: '업무분야',
      description: '대만 투자, 소송, 자문 전반을 구조화하여 제공합니다.'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: '호정 한국·대만 업무팀',
      description: '변호사·사무장·회계사의 이력과 실무 분야를 확인합니다.'
    },
    insights: {
      label: 'INSIGHTS',
      title: '칼럼',
      description: '호정칼럼 전체 글을 카테고리별로 확인할 수 있습니다.'
    },
    videos: {
      label: 'VIDEOS',
      title: '영상/채널',
      description: 'WEI Lawyer 유튜브 채널 및 외부 링크를 확인하세요.'
    },
    faq: {
      label: 'FAQ',
      title: '자주 묻는 질문',
      description: '상담 절차 관련 FAQ를 안내합니다.'
    },
    contact: {
      label: 'CONTACT',
      title: '문의 및 연락처',
      description: '문의 유형, 연락처, 사무소 위치를 한 번에 확인하세요.'
    },
    search: {
      label: 'SEARCH',
      title: '검색 결과',
      description: '필요한 정보를 빠르게 찾도록 돕습니다.'
    },
    pricing: {
      label: 'PRICING',
      title: '서비스 비용 안내',
      description: '호정국제법률사무소의 주요 서비스별 비용을 안내합니다.'
    },
    reviews: {
      label: 'REVIEWS',
      title: '고객 후기',
      description: '호정국제법률사무소를 이용하신 고객님들의 솔직한 후기입니다.'
    }
  },
  'zh-hant': {
    about: {
      label: 'ABOUT',
      title: '昊鼎介紹',
      description: '查看昊鼎團隊背景與韓國業務團隊成員。'
    },
    services: {
      label: 'SERVICES',
      title: '服務領域',
      description: '涵蓋在台投資、訴訟與顧問業務。'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: '昊鼎 韓國·台灣 業務團隊',
      description: '查看律師、韓國事務長與會計師的完整資料。'
    },
    insights: {
      label: 'INSIGHTS',
      title: '洞見',
      description: '依分類整理昊鼎專欄文章，快速查看重點主題。'
    },
    videos: {
      label: 'VIDEOS',
      title: '影音/頻道',
      description: '查看 WEI Lawyer YouTube 頻道與外部連結。'
    },
    faq: {
      label: 'FAQ',
      title: '常見問題',
      description: '提供諮詢流程相關 FAQ。'
    },
    contact: {
      label: 'CONTACT',
      title: '聯絡與諮詢',
      description: '一次查看詢問類型、聯絡方式與事務所據點。'
    },
    search: {
      label: 'SEARCH',
      title: '搜尋結果',
      description: '協助您快速找到所需資訊。'
    },
    pricing: {
      label: 'PRICING',
      title: '服務費用說明',
      description: '昊鼎國際法律事務所主要服務項目收費標準。'
    },
    reviews: {
      label: 'REVIEWS',
      title: '客戶評價',
      description: '昊鼎國際法律事務所客戶的真實評價與回饋。'
    }
  },
  en: {
    about: {
      label: 'ABOUT',
      title: 'About Hovering',
      description: 'Learn our story and meet the Korea-Taiwan legal team.'
    },
    services: {
      label: 'SERVICES',
      title: 'Practice Areas',
      description: 'Structured legal services for investment, disputes, and advisory matters in Taiwan.'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: 'Hovering Korea-Taiwan Team',
      description: 'View profiles of our lawyers, operations manager, and accounting partner.'
    },
    insights: {
      label: 'INSIGHTS',
      title: 'Columns',
      description: 'Browse practical legal columns by category.'
    },
    videos: {
      label: 'VIDEOS',
      title: 'Videos / Channels',
      description: 'Watch WEI Lawyer content and related external channels.'
    },
    faq: {
      label: 'FAQ',
      title: 'Frequently Asked Questions',
      description: 'Answers to common consultation and process questions.'
    },
    contact: {
      label: 'CONTACT',
      title: 'Contact & Inquiry',
      description: 'View inquiry types, contact channels, and office locations in one place.'
    },
    search: {
      label: 'SEARCH',
      title: 'Search Results',
      description: 'Quickly find the information you need.'
    },
    pricing: {
      label: 'PRICING',
      title: 'Service Fees',
      description: 'Fee structure for major services at Hovering International Law Firm.'
    },
    reviews: {
      label: 'REVIEWS',
      title: 'Client Reviews',
      description: 'Honest feedback from our valued clients.'
    }
  }
};
