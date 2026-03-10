import type { Locale } from '@/lib/locales';

export const primaryAttorneySlug = 'wei-tseng' as const;
export type AttorneyProfileSlug = typeof primaryAttorneySlug;

type ProfileLink = {
  label: string;
  href: string;
};

export type AttorneyProfile = {
  slug: AttorneyProfileSlug;
  name: string;
  alternateNames: string[];
  role: string;
  title: string;
  description: string;
  email: string;
  image: string;
  summary: string[];
  languages: string[];
  practiceAreas: string[];
  education: string[];
  experience: string[];
  notableMatters: string[];
  internalLinks: ProfileLink[];
  externalProfiles: ProfileLink[];
  sameAs: string[];
  keywords: string[];
};

const commonSameAs = [
  'https://www.hoveringlaw.com.tw/en/wei.html',
  'https://www.hoveringlaw.com.tw/zh/wei.html',
  'https://www.hoveringlaw.com.tw/kr/wei.html',
  'https://www.wei-wei-lawyer.com/',
  'https://www.wei-wei-lawyer.com/about-8',
  'https://www.youtube.com/@weilawyer',
  'https://blog.naver.com/wei_lawyer/223461663913',
];

export const attorneyProfiles: Record<Locale, Record<AttorneyProfileSlug, AttorneyProfile>> = {
  ko: {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: '증준외 변호사',
      alternateNames: ['증준외', '曾俊瑋', 'Wei Tseng', 'Attorney Wei Tseng'],
      role: '대만 변호사 · 대표 변호사',
      title: '증준외 변호사 프로필',
      description:
        '한국 고객의 대만 회사설립, 투자, 소송, 비자, 상표·특허, 법률자문을 지원하는 증준외 변호사의 경력과 대표 사례를 정리한 프로필 페이지입니다.',
      email: 'wei@hoveringlaw.com.tw',
      image: '/images/team/tseng-junwei.png',
      summary: [
        '증준외 변호사는 한국·일본 고객의 대만 투자, 회사설립, 소송, 지식재산, 비자 및 리스크 검토 업무를 수행합니다.',
        '한국어·중국어·일본어 커뮤니케이션을 바탕으로 초기 상담부터 실행 및 분쟁 대응까지 한 흐름으로 지원합니다.',
        '한국 유학생 헬스장 손해배상 사건에서 157만 TWD 1심 판결을 이끈 대표 사례가 있으며, WEI Lawyer 채널과 외부 매체를 통해 대만 법률을 설명하고 있습니다.',
      ],
      languages: ['한국어', '중국어', '일본어'],
      practiceAreas: ['대만 회사설립', '대만 투자 법률자문', '민사소송·손해배상', '상표·특허', '비자·체류', '가족·노동 분쟁'],
      education: [
        '국립 타이완 대학교 재무금융연구소 석사',
        '국립 정치 대학교 법학과·금융학과 복수전공 학사',
        '일본 고베 대학교·와세다 대학교 교환 학생',
      ],
      experience: ['추세법률사무소', '법무법인 호정', '법률지원재단 타이중지부 지원 변호사'],
      notableMatters: [
        '한국 유학생 헬스장 부상 사건에서 157만 TWD 손해배상 1심 판결',
        '한국 기업의 대만 회사설립, 투자, 비자 및 운영 리스크 검토 지원',
        '상표·특허 신청, 기업 계약 검토, 민사·가사·노동 분쟁 자문',
      ],
      internalLinks: [
        { label: '대만 회사설립 서비스', href: '/ko/services/investment' },
        { label: '민사소송·손해배상 서비스', href: '/ko/services/civil' },
        { label: '헬스장 부상 소송 칼럼', href: '/ko/columns/taiwan-gym-injury-lawsuit' },
        { label: '상담 문의', href: '/ko/contact' },
      ],
      externalProfiles: [
        { label: '법무법인 호정 프로필', href: 'https://www.hoveringlaw.com.tw/kr/wei.html' },
        { label: '개인 프로필 사이트', href: 'https://www.wei-wei-lawyer.com/about-8' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['증준외 변호사', '대만변호사', '한국어 가능한 대만 변호사', '대만 회사설립 변호사', '대만 소송 변호사'],
    },
  },
  'zh-hant': {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: '曾俊瑋律師',
      alternateNames: ['曾俊瑋', '증준외', 'Wei Tseng', 'Attorney Wei Tseng'],
      role: '台灣律師 · 代表律師',
      title: '曾俊瑋律師簡介',
      description:
        '整理曾俊瑋律師的學經歷、主要服務領域與代表案件，聚焦韓國客戶在台公司設立、投資、訴訟、簽證與智慧財產等法律需求。',
      email: 'wei@hoveringlaw.com.tw',
      image: '/images/team/tseng-junwei.png',
      summary: [
        '曾俊瑋律師長期協助韓國、日本客戶處理在台投資、公司設立、訴訟、智慧財產、簽證與法律風險評估。',
        '可提供韓文、中文、日文溝通，將諮詢、申請與爭議處理整合為同一策略流程。',
        '曾代理韓國留學生健身房受傷損害賠償案件，取得 157 萬 TWD 一審判決，並持續透過 WEI Lawyer 與外部媒體說明台灣法律議題。',
      ],
      languages: ['韓文', '中文', '日文'],
      practiceAreas: ['台灣公司設立', '在台投資法律顧問', '民事訴訟與損害賠償', '商標與專利', '簽證與居留', '家事與勞動爭議'],
      education: [
        '國立臺灣大學財務金融研究所碩士',
        '國立政治大學法律學系與金融學系雙主修學士',
        '日本神戶大學、早稻田大學交換',
      ],
      experience: ['趨勢法律事務所', '昊鼎國際法律事務所', '法律扶助基金會台中分會扶助律師'],
      notableMatters: [
        '代理韓國留學生健身房受傷案，獲判 157 萬 TWD 損害賠償',
        '協助韓國企業處理台灣公司設立、投資、簽證與營運風險',
        '處理商標、專利、契約審閱及民事、家事、勞動爭議',
      ],
      internalLinks: [
        { label: '台灣公司設立服務', href: '/zh-hant/services/investment' },
        { label: '民事訴訟服務', href: '/zh-hant/services/civil' },
        { label: '健身房受傷案件專欄', href: '/zh-hant/columns/taiwan-gym-injury-lawsuit' },
        { label: '聯絡諮詢', href: '/zh-hant/contact' },
      ],
      externalProfiles: [
        { label: '昊鼎官方律師頁面', href: 'https://www.hoveringlaw.com.tw/zh/wei.html' },
        { label: '個人網站簡介', href: 'https://www.wei-wei-lawyer.com/about-8' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['曾俊瑋 律師', '台灣律師', '韓文 台灣律師', '台灣公司設立 律師', '台灣訴訟 律師'],
    },
  },
  en: {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: 'Attorney Wei Tseng',
      alternateNames: ['Wei Tseng', '증준외', '曾俊瑋'],
      role: 'Taiwan Attorney · Managing Attorney',
      title: 'Attorney Wei Tseng Profile',
      description:
        'A dedicated profile for Attorney Wei Tseng, focusing on Taiwan company setup, investment, litigation, visa, and IP support for Korean and international clients.',
      email: 'wei@hoveringlaw.com.tw',
      image: '/images/team/tseng-junwei.png',
      summary: [
        'Attorney Wei Tseng advises Korean and Japanese clients on Taiwan company setup, investment, litigation, intellectual property, visas, and legal risk review.',
        'He works across Korean, Chinese, and Japanese communication to connect initial consultation, filings, execution, and dispute response into one strategy.',
        'Representative work includes a TWD 1.57M first-instance damages ruling in a Korean student gym injury case, alongside continuous legal publishing through WEI Lawyer and external media appearances.',
      ],
      languages: ['Korean', 'Chinese', 'Japanese'],
      practiceAreas: ['Taiwan company setup', 'Taiwan investment counsel', 'Civil litigation and damages', 'Trademark and patent filings', 'Visa and residency', 'Family and labor disputes'],
      education: [
        'M.S., Institute of Finance, National Taiwan University',
        'B.A. (Double Major), Law and Finance, National Chengchi University',
        'Exchange Student, Kobe University and Waseda University',
      ],
      experience: ['Trend Law Office', 'Hovering International Law Firm', 'Legal Aid Foundation, Taichung Branch'],
      notableMatters: [
        'Obtained a TWD 1.57M first-instance damages ruling in a Korean student gym injury case',
        'Supports Korean businesses with Taiwan company setup, investment, visa, and operating-risk matters',
        'Advises on trademark, patent, contract review, and cross-border civil, family, and labor disputes',
      ],
      internalLinks: [
        { label: 'Taiwan Company Setup Service', href: '/en/services/investment' },
        { label: 'Civil Litigation Service', href: '/en/services/civil' },
        { label: 'Gym Injury Case Column', href: '/en/columns/taiwan-gym-injury-lawsuit' },
        { label: 'Book Consultation', href: '/en/contact' },
      ],
      externalProfiles: [
        { label: 'Hovering official profile', href: 'https://www.hoveringlaw.com.tw/en/wei.html' },
        { label: 'Personal profile website', href: 'https://www.wei-wei-lawyer.com/about-8' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['Wei Tseng attorney', 'Taiwan lawyer for Korean clients', 'Taiwan attorney profile', 'Taiwan company setup lawyer', 'Taiwan litigation attorney'],
    },
  },
};

export function getAttorneyProfile(locale: Locale, slug: string): AttorneyProfile | undefined {
  if (slug !== primaryAttorneySlug) {
    return undefined;
  }

  return attorneyProfiles[locale][primaryAttorneySlug];
}

export function getAttorneyProfileSlugs(): AttorneyProfileSlug[] {
  return [primaryAttorneySlug];
}

export function getAttorneyProfilePath(locale: Locale, slug: string = primaryAttorneySlug) {
  return `/${locale}/lawyers/${slug}`;
}
