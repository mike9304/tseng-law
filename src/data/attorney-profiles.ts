import type { SiteLocale } from '@/lib/locales';
import type { FAQItem } from '@/data/faq-content';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

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
  searchTerms: string[];
  proofPoints: string[];
  faq: FAQItem[];
};

const commonSameAs = [
  'https://www.hoveringlaw.com.tw/en/wei.html',
  'https://www.hoveringlaw.com.tw/zh/wei.html',
  'https://www.hoveringlaw.com.tw/kr/wei.html',
  'https://www.wei-wei-lawyer.com/',
  'https://www.wei-wei-lawyer.com/lawyertseng',
  'https://www.youtube.com/@weilawyer',
  'https://blog.naver.com/wei_lawyer/223461663913',
  'https://www.threads.com/@lawyer.wei',
];

export const attorneyProfiles: Record<SiteLocale, Record<AttorneyProfileSlug, AttorneyProfile>> = {
  ko: {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: '증준외 변호사',
      alternateNames: ['증준외', '曾雋崴', 'Wei Tseng', 'Attorney Wei Tseng'],
      role: '대만 변호사 · 대표 변호사',
      title: '증준외 대만변호사 프로필',
      description:
        '한국 고객의 대만 회사설립, 투자, 소송, 비자, 상표·특허, 법률자문을 지원하는 증준외 대만변호사의 경력과 대표 사례를 정리한 프로필 페이지입니다.',
      email: CONSULTATION_EMAIL,
      image: '/images/team/wei-tseng-official.png',
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
        { label: '대만변호사 안내', href: '/ko/taiwan-lawyer' },
        { label: '대만 회사설립 변호사 안내', href: '/ko/taiwan-company-setup-lawyer' },
        { label: '대만 회사설립 서비스', href: '/ko/services/investment' },
        { label: '민사소송·손해배상 서비스', href: '/ko/services/civil' },
        { label: '대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목', href: '/ko/columns/taiwan-gym-injury-lawsuit' },
        { label: '상담 문의', href: getConsultationPublicMailto('ko') },
      ],
      externalProfiles: [
        { label: '법무법인 호정 프로필', href: 'https://www.hoveringlaw.com.tw/kr/wei.html' },
        { label: '개인 프로필 사이트', href: 'https://www.wei-wei-lawyer.com/lawyertseng' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['증준외 변호사', '증준외 대만변호사', '대만변호사', '한국어 가능한 대만 변호사', '대만 회사설립 변호사', '대만 소송 변호사'],
      searchTerms: ['증준외 대만변호사', '대만변호사 증준외', '한국어 가능한 대만변호사', '대만 회사설립 변호사 증준외'],
      proofPoints: [
        '한국어·중국어·일본어 상담이 가능한 대만 변호사로, 한국 고객 사건을 직접 소통합니다.',
        '대만 회사설립, 투자, 비자, 소송, 상표·특허까지 한국 고객의 실제 실행 흐름을 함께 설계합니다.',
        '한국 유학생 헬스장 손해배상 사건에서 157만 TWD 1심 판결을 이끈 공개 사례가 있습니다.',
        '호정 공식 프로필, 개인 사이트, YouTube, Naver Blog 등 외부 채널에서 동일 인물 정보가 확인됩니다.',
      ],
      faq: [
        {
          question: '증준외 변호사는 어떤 사건을 주로 다루나요?',
          answer:
            '대만 회사설립, 투자 법률자문, 민사소송·손해배상, 상표·특허, 비자·체류, 가족·노동 분쟁처럼 한국 고객이 자주 문의하는 대만 법률 이슈를 중심으로 대응합니다.',
        },
        {
          question: '증준외 변호사와 한국어로 상담할 수 있나요?',
          answer:
            '가능합니다. 한국어, 중국어, 일본어로 사실관계와 서류 흐름을 정리할 수 있어 한국 고객이 대만 절차를 이해하기 쉽게 상담을 진행할 수 있습니다.',
        },
        {
          question: '증준외 변호사 상담은 어떻게 시작하나요?',
          answer:
            '문의 페이지로 사건 개요와 관련 자료를 먼저 보내주시면, 회사설립·투자·소송 등 사안 유형에 맞춰 초기 검토 흐름과 필요한 준비 자료를 안내합니다.',
        },
      ],
    },
  },
  'zh-hant': {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: '曾雋崴律師',
      alternateNames: ['曾雋崴', '증준외', 'Wei Tseng', 'Attorney Wei Tseng'],
      role: '台灣律師 · 代表律師',
      title: '曾雋崴台灣律師簡介',
      description:
        '整理曾雋崴台灣律師的學經歷、主要服務領域與代表案件，聚焦韓國客戶在台公司設立、投資、訴訟、簽證與智慧財產等法律需求。',
      email: CONSULTATION_EMAIL,
      image: '/images/team/wei-tseng-official.png',
      summary: [
        '曾雋崴律師長期協助韓國、日本客戶處理在台投資、公司設立、訴訟、智慧財產、簽證與法律風險評估。',
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
        { label: '台灣律師指南', href: '/zh-hant/taiwan-lawyer' },
        { label: '台灣公司設立律師指南', href: '/zh-hant/taiwan-company-setup-lawyer' },
        { label: '台灣公司設立服務', href: '/zh-hant/services/investment' },
        { label: '民事訴訟服務', href: '/zh-hant/services/civil' },
        { label: '台灣健身房受傷求償：一審案例、期限、證據與賠償項目', href: '/zh-hant/columns/taiwan-gym-injury-lawsuit' },
        { label: '聯絡諮詢', href: getConsultationPublicMailto('zh-hant') },
      ],
      externalProfiles: [
        { label: '昊鼎官方律師頁面', href: 'https://www.hoveringlaw.com.tw/zh/wei.html' },
        { label: '個人網站簡介', href: 'https://www.wei-wei-lawyer.com/lawyertseng' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['曾雋崴 律師', '曾雋崴台灣律師', '台灣律師', '韓文 台灣律師', '台灣公司設立 律師', '台灣訴訟 律師'],
      searchTerms: ['曾雋崴台灣律師', '曾雋崴 律師', '韓文 台灣律師', '台灣公司設立 律師 曾雋崴'],
      proofPoints: [
        '可用韓文、中文、日文直接對接韓國客戶與台灣在地程序。',
        '處理台灣公司設立、投資、訴訟、簽證與智慧財產等跨境法律需求。',
        '曾代理韓國留學生健身房受傷求償案件，取得 157 萬 TWD 一審判決。',
        '昊鼎官方頁面、個人網站、YouTube 與 Naver Blog 都可交叉驗證律師資訊。',
      ],
      faq: [
        {
          question: '曾雋崴律師主要處理哪些案件？',
          answer:
            '以韓國客戶常見的台灣公司設立、投資法律顧問、民事訴訟與損害賠償、商標專利、簽證居留、家事與勞動爭議為核心。',
        },
        {
          question: '可以用韓文與曾雋崴律師諮詢嗎？',
          answer:
            '可以。曾雋崴律師可用韓文、中文、日文協助整理事實、文件與程序安排，讓韓國客戶更容易理解台灣法律流程。',
        },
        {
          question: '如何開始與曾雋崴律師的諮詢？',
          answer:
            '可先透過聯絡頁面提供案件背景與文件，我們會依公司設立、投資、訴訟等不同需求安排初步檢視與後續流程。',
        },
      ],
    },
  },
  en: {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: 'Attorney Wei Tseng',
      alternateNames: ['Wei Tseng', '증준외', '曾雋崴'],
      role: 'Taiwan Attorney · Managing Attorney',
      title: 'Wei Tseng Taiwan Attorney Profile',
      description:
        'A dedicated profile for Wei Tseng, a Taiwan attorney focusing on company setup, investment, litigation, visa, and IP support for Korean and international clients.',
      email: CONSULTATION_EMAIL,
      image: '/images/team/wei-tseng-official.png',
      summary: [
        'Attorney Wei Tseng advises Korean and Japanese clients on Taiwan company setup, investment, litigation, intellectual property, visas, and legal risk review.',
        'She works across Korean, Chinese, and Japanese communication to connect initial consultation, filings, execution, and dispute response into one strategy.',
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
        { label: 'Taiwan Lawyer Guide', href: '/en/taiwan-lawyer' },
        { label: 'Taiwan Company Setup Lawyer Guide', href: '/en/taiwan-company-setup-lawyer' },
        { label: 'Taiwan Company Setup Service', href: '/en/services/investment' },
        { label: 'Civil Litigation Service', href: '/en/services/civil' },
        { label: 'Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages', href: '/en/columns/taiwan-gym-injury-lawsuit' },
        { label: 'Book Consultation', href: getConsultationPublicMailto('en') },
      ],
      externalProfiles: [
        { label: 'Hovering official profile', href: 'https://www.hoveringlaw.com.tw/en/wei.html' },
        { label: 'Personal profile website', href: 'https://www.wei-wei-lawyer.com/lawyertseng' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['Wei Tseng attorney', 'Wei Tseng Taiwan attorney', 'Taiwan lawyer for Korean clients', 'Taiwan attorney profile', 'Taiwan company setup lawyer', 'Taiwan litigation attorney'],
      searchTerms: ['Wei Tseng Taiwan attorney', 'Attorney Wei Tseng', 'Taiwan lawyer for Korean clients', 'Wei Tseng company setup lawyer'],
      proofPoints: [
        'Wei Tseng works across Korean, Chinese, and Japanese communication for cross-border client matters.',
        'Her practice covers Taiwan company setup, investment, litigation, visas, and trademark or patent filings.',
        'A public representative case includes a TWD 1.57M first-instance damages ruling in a Korean student gym injury dispute.',
        'Her identity is corroborated across the Hovering profile, personal site, YouTube channel, and Naver Blog.',
      ],
      faq: [
        {
          question: 'What matters does Attorney Wei Tseng typically handle?',
          answer:
            'She focuses on Taiwan company setup, investment legal advisory, civil litigation and damages, trademarks and patents, visas and residency, and cross-border family or labor disputes for Korean and international clients.',
        },
        {
          question: 'Can Korean-speaking clients consult directly with Attorney Wei Tseng?',
          answer:
            'Yes. Korean-speaking clients can start by sharing the core facts and documents, and the consultation can proceed with Korean, Chinese, or Japanese communication support depending on the matter.',
        },
        {
          question: 'How should a client start a consultation with Attorney Wei Tseng?',
          answer:
            'Start through the contact page with a short case outline and the main documents. The team then sorts the matter into the right consultation flow for company setup, investment, litigation, or another Taiwan-law issue.',
        },
      ],
    },
  },
  ja: {
    'wei-tseng': {
      slug: 'wei-tseng',
      name: '曾雋崴弁護士',
      alternateNames: ['曾雋崴', '증준외', 'Wei Tseng', 'Attorney Wei Tseng'],
      role: '台湾弁護士・代表弁護士',
      title: '曾雋崴台湾弁護士プロフィール',
      description:
        '韓国のクライアントによる台湾での会社設立、投資、訴訟、ビザ、商標・特許、法律顧問業務を支援する曾雋崴台湾弁護士の経歴と代表事例をまとめたプロフィールです。',
      email: CONSULTATION_EMAIL,
      image: '/images/team/wei-tseng-official.png',
      summary: [
        '曾雋崴弁護士は、韓国・日本のクライアントによる台湾での投資、会社設立、訴訟、知的財産、ビザおよび法的リスクの検討を支援しています。',
        '韓国語・中国語・日本語でのコミュニケーションを通じて、初回相談から各種手続の遂行、紛争対応まで一貫してサポートします。',
        '韓国人留学生のジム負傷損害賠償事件で157万TWDの損害賠償を認める一審判決を獲得した代表事例があり、WEI Lawyerチャンネルや外部メディアを通じて台湾法を解説しています。',
      ],
      languages: ['韓国語', '中国語', '日本語'],
      practiceAreas: ['台湾での会社設立', '台湾投資に関する法務顧問', '民事訴訟・損害賠償', '商標・特許', 'ビザ・在留', '家事・労働紛争'],
      education: [
        '国立台湾大学財務金融研究所 修士号取得',
        '国立政治大学法律学科・金融学科ダブルメジャー（学士）',
        '神戸大学・早稲田大学への交換留学',
      ],
      experience: ['趨勢法律事務所', '昊鼎国際法律事務所', '法律扶助基金会台中分会の扶助弁護士'],
      notableMatters: [
        '韓国人留学生のジム負傷事件で157万TWDの損害賠償を認める一審判決を獲得',
        '韓国企業による台湾での会社設立、投資、ビザおよび事業運営リスクの検討を支援',
        '商標・特許の出願、企業契約の審査、民事・家事・労働紛争に関する助言',
      ],
      internalLinks: [
        { label: '台湾弁護士・チーム紹介', href: '/ja/lawyers' },
        { label: '台湾会社設立ガイド', href: '/ja/columns/taiwan-company-establishment-basics' },
        { label: '台湾会社設立サービス', href: '/ja/services#investment' },
        { label: '民事訴訟・損害賠償サービス', href: '/ja/services#civil' },
        { label: '台湾のジム事故損害賠償：一審事例・期限・証拠・賠償項目', href: '/ja/columns/taiwan-gym-injury-lawsuit' },
        { label: 'お問い合わせ・ご相談', href: getConsultationPublicMailto('ja') },
      ],
      externalProfiles: [
        { label: '昊鼎公式弁護士プロフィール', href: 'https://www.hoveringlaw.com.tw/zh/wei.html' },
        { label: '個人プロフィールサイト', href: 'https://www.wei-wei-lawyer.com/lawyertseng' },
        { label: 'WEI Lawyer YouTube', href: 'https://www.youtube.com/@weilawyer' },
        { label: 'Naver Blog', href: 'https://blog.naver.com/wei_lawyer/223461663913' },
      ],
      sameAs: commonSameAs,
      keywords: ['曾雋崴弁護士', '曾雋崴台湾弁護士', '台湾弁護士', '韓国語対応の台湾弁護士', '台湾会社設立弁護士', '台湾訴訟弁護士'],
      searchTerms: ['曾雋崴台湾弁護士', '曾雋崴弁護士', '韓国語対応の台湾弁護士', '台湾会社設立弁護士 曾雋崴'],
      proofPoints: [
        '韓国語・中国語・日本語で相談できる台湾弁護士として、韓国のクライアントと直接コミュニケーションを行います。',
        '台湾での会社設立、投資、ビザ、訴訟、商標・特許まで、韓国のクライアントに必要な手続の流れを一緒に設計します。',
        '韓国人留学生のジム負傷損害賠償事件で157万TWDの損害賠償を認める一審判決を獲得した公開事例があります。',
        '昊鼎の公式プロフィール、個人サイト、YouTube、Naver Blogなどの外部チャンネルで同一人物の情報を確認できます。',
      ],
      faq: [
        {
          question: '曾雋崴弁護士は主にどのような案件を扱っていますか？',
          answer:
            '台湾での会社設立、台湾投資に関する法務顧問、民事訴訟・損害賠償、商標・特許、ビザ・在留、家事・労働紛争など、韓国のクライアントから相談の多い台湾法の問題を中心に対応しています。',
        },
        {
          question: '曾雋崴弁護士に韓国語で相談できますか？',
          answer:
            'はい。韓国語、中国語、日本語で事実関係や書類、手続の流れを整理できるため、韓国のクライアントにも台湾の手続を分かりやすくご案内できます。',
        },
        {
          question: '曾雋崴弁護士への相談はどのように始めればよいですか？',
          answer:
            'お問い合わせページから案件の概要と関連資料をお送りください。会社設立、投資、訴訟など案件の種類に応じて、初期検討の流れと必要な準備資料をご案内します。',
        },
      ],
    },
  },
};

export function getAttorneyProfile(locale: SiteLocale, slug: string): AttorneyProfile | undefined {
  if (slug !== primaryAttorneySlug) {
    return undefined;
  }

  return attorneyProfiles[locale][primaryAttorneySlug];
}

export function getAttorneyProfileSlugs(): AttorneyProfileSlug[] {
  return [primaryAttorneySlug];
}

export function getAttorneyProfilePath(locale: SiteLocale, slug: string = primaryAttorneySlug) {
  return `/${locale}/lawyers/${slug}`;
}
