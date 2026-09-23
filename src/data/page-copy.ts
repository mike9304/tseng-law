import type { SiteLocale } from '@/lib/locales';
import { TEAM_NAME_BY_LOCALE } from '@/data/team-name';

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

export const pageCopy: Record<SiteLocale, PageCopy> = {
  ko: {
    about: {
      label: 'ABOUT',
      title: '호정 소개',
      description:
        `호정의 이야기와 ${TEAM_NAME_BY_LOCALE['ko']} 구성원을 소개합니다.`
    },
    services: {
      label: 'SERVICES',
      title: '업무분야',
      description: '대만 투자, 소송, 자문 전반을 구조화하여 제공합니다.'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: TEAM_NAME_BY_LOCALE['ko'],
      description: '변호사·사무장·회계사의 이력과 실무 분야를 확인합니다.'
    },
    insights: {
      label: 'INSIGHTS',
      title: '칼럼',
      description: '호정칼럼 전체 글을 카테고리별로 확인할 수 있습니다.'
    },
    videos: {
      label: 'VIDEOS',
      title: '증준외 변호사 미디어·채널',
      description: '증준외 변호사의 공식 프로필, YouTube, 블로그와 외부 소개를 한곳에서 확인하세요.'
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
      description: '법무법인 호정의 주요 서비스별 비용을 안내합니다.'
    },
    reviews: {
      label: 'REVIEWS',
      title: '고객 후기',
      description: '법무법인 호정을 이용하신 고객님들의 솔직한 후기입니다.'
    }
  },
  'zh-hant': {
    about: {
      label: 'ABOUT',
      title: '昊鼎介紹',
      description: `認識昊鼎的團隊背景與${TEAM_NAME_BY_LOCALE['zh-hant']}成員。`
    },
    services: {
      label: 'SERVICES',
      title: '服務領域',
      description: '涵蓋在台投資、訴訟與顧問業務。'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: TEAM_NAME_BY_LOCALE['zh-hant'],
      description: '查看律師、法務專員、事務長與會計師的完整資料。'
    },
    insights: {
      label: 'INSIGHTS',
      title: '專欄',
      description: '依分類整理昊鼎專欄文章，快速查看重點主題。'
    },
    videos: {
      label: 'VIDEOS',
      title: '曾雋崴律師影音·頻道',
      description: '集中查看曾雋崴律師的官方簡介、YouTube、部落格與外部介紹。'
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
      description: "Learn about Hovering's background and meet our team."
    },
    services: {
      label: 'SERVICES',
      title: 'Services',
      description: 'Structured legal services for investment, disputes, and advisory matters in Taiwan.'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: TEAM_NAME_BY_LOCALE['en'],
      description: 'View profiles of our lawyers, operations manager, and accounting partner.'
    },
    insights: {
      label: 'INSIGHTS',
      title: 'Insights',
      description: 'Practical Taiwan law columns on company setup, litigation, labor, and family issues for overseas companies and individuals handling Taiwan legal matters.'
    },
    videos: {
      label: 'VIDEOS',
      title: 'Attorney Wei Tseng: Media & Channels',
      description: 'Review Attorney Wei Tseng’s official profile, YouTube channel, blog, and external references in one place.'
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
  },
  ja: {
    about: {
      label: 'ABOUT',
      title: '昊鼎について',
      description: '台湾を拠点とする国際的な法律実務と、弁護士・スタッフをご紹介します。'
    },
    services: {
      label: 'SERVICES',
      title: '取扱業務',
      description: '日系企業をはじめとする海外企業・在台日本人向けに、台湾投資・会社設立、民事訴訟、家事事件、労働問題、刑事事件、知的財産・金融紛争まで、台湾法務の主要分野を日本語で体系的にご案内します。'
    },
    lawyers: {
      label: 'OUR TEAM',
      title: TEAM_NAME_BY_LOCALE['ja'],
      description: '台湾弁護士、パラリーガル、事務長、提携会計士で構成される昊鼎国際法律事務所のチームについて、各メンバーの経歴・専門分野・連絡先をご確認いただけるページです。'
    },
    insights: {
      label: 'INSIGHTS',
      title: 'コラム',
      description: '台湾進出を検討する日系企業や在台日本人向けに、会社設立、訴訟、労務、家事事件など台湾法務に関する実務コラムをカテゴリ別にまとめてご覧いただけます。'
    },
    videos: {
      label: 'VIDEOS',
      title: '曾雋崴弁護士メディア',
      description: '公式プロフィール、YouTube、ブログ等をまとめて確認できます。'
    },
    faq: {
      label: 'FAQ',
      title: 'よくある質問',
      description: '台湾での会社設立、労働問題、交通事故、離婚・親権、刑事事件、相談の流れや費用など、日本語でよくいただくご質問への回答をまとめてご案内しています。'
    },
    contact: {
      label: 'CONTACT',
      title: 'お問い合わせ',
      description: 'ビジネス・投資、メディア取材、採用、一般のお問い合わせなど窓口別の連絡先と、台北・台中・高雄・屏東の事務所所在地をメールで一括してご案内するページです。'
    },
    search: {
      label: 'SEARCH',
      title: '検索結果',
      description: '必要な情報を素早く見つけるための検索結果です。'
    },
    pricing: {
      label: 'PRICING',
      title: '費用のご案内',
      description: '一般法律相談、民事・刑事訴訟、台湾での会社設立、年間法律顧問など、昊鼎国際法律事務所が提供する主要サービスごとの費用の目安をわかりやすくご案内するページです。'
    },
    reviews: {
      label: 'REVIEWS',
      title: 'ご感想・レビュー',
      description: 'このページでは、昊鼎国際法律事務所の相談・サービスに関する投稿を、内容確認後に掲載します。'
    }
  }
};
