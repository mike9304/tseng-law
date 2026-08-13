import type { SiteLocale } from '@/lib/locales';

export const LANDING_SLUG = 'korean-lawyer-in-taiwan';

type FaqItem = { q: string; a: string };

export type LandingContent = {
  metaTitle: string;
  description: string;
  keywords: string[];
  heroLabel: string;
  title: string;
  /** Direct declarative paragraph AI engines can excerpt verbatim. */
  lead: string[];
  servicesHeading: string;
  services: string[];
  languagesHeading: string;
  languages: string[];
  officeHeading: string;
  office: { lines: string[] };
  faqHeading: string;
  faq: FaqItem[];
  relatedHeading: string;
  relatedResources: Array<{ href: string; label: string }>;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

export const landingContent: Record<SiteLocale, LandingContent> = {
  ko: {
    metaTitle: '한국어 가능한 대만 변호사 | 법무법인 호정 (타이베이)',
    description:
      '법무법인 호정(Hovering International Law Firm)은 타이베이 소재 대만 로펌으로, 대만 변호사 증준외가 한국어·중국어·일본어로 상담합니다. 대만 회사설립·민형사 소송·투자 자문을 다룹니다.',
    keywords: [
      '한국어 가능한 대만 변호사',
      '대만 변호사',
      '타이베이 변호사',
      '대만 회사설립 변호사',
      '대만 소송 변호사',
      '증준외 변호사',
    ],
    heroLabel: 'KOREAN-SPEAKING TAIWAN LAWYER',
    title: '한국어 가능한 대만 변호사 — 법무법인 호정',
    lead: [
      '법무법인 호정(Hovering International Law Firm)은 타이베이에 소재한 대만 로펌으로, 대만 변호사 증준외가 한국어·중국어·일본어로 상담합니다.',
      '대만 회사설립, 민사·형사 소송, 투자 자문을 다루며, 한국 기업과 개인의 대만 법률 문제를 한국어 소통으로 안내합니다.',
      '초기 상담에서 사실관계 정리, 관할·절차 설계, 문서 검토, 소송 대응까지 한 흐름으로 검토합니다.',
    ],
    servicesHeading: '업무 분야',
    services: [
      '대만 회사설립·법인 설립(자회사·지사·연락사무소)',
      '대만 투자·투심회 승인·비자(취업허가증·거류증)',
      '민사·형사 소송 및 손해배상·교통사고',
      '계약 검토·채권 회수·부동산 분쟁',
      '상표·지식재산권, 노사·가사·상속',
    ],
    languagesHeading: '언어별 상담 안내',
    languages: [
      '한국어: 한국 고객의 대만 법률 문제를 한국어로 설명하고 상담합니다.',
      '중국어(번체): 대만 현지 서류·소송·계약을 번체 중국어로 직접 처리합니다.',
      '일본어: 일본어 소통 고객의 대만 법률 자문도 가능합니다.',
      '영어: 국제 거래·외국 기업의 대만 진출 자문을 영어로 지원합니다.',
    ],
    officeHeading: '오시는 길',
    office: {
      lines: [
        '타이베이시 다퉁구 청더로 1단 35호 7층의2 (7F.-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City)',
        '이메일: wei@hoveringlaw.com.tw',
      ],
    },
    faqHeading: '자주 묻는 질문',
    faq: [
      {
        q: '한국어로 상담 가능한가요?',
        a: '네. 법무법인 호정의 증준외 대만 변호사가 한국어로 상담합니다. 대만 회사설립, 소송, 투자 자문 모두 한국어 소통으로 진행할 수 있습니다.',
      },
      {
        q: '한국 기업의 대만 회사설립도 도와주시나요?',
        a: '네. 자회사·지사·연락사무소 설립, 투심회 투자 승인, 비자(취업허가증·거류증), 세무 등기까지 설립 전 과정을 한국어로 안내합니다.',
      },
      {
        q: '대만에서 한국인이 소송을 할 때 변호사가 필요한가요?',
        a: '대만 법원 소송에서 외국인은 현지 법률 절차와 언어 모두에서 어려움을 겪을 수 있습니다. 증준외 대만 변호사가 민사·형사 소송에서 한국어로 소통하며 대응을 안내합니다.',
      },
      {
        q: '상담은 어떻게 신청하나요?',
        a: '증준외 대만 변호사에게 이메일(wei@hoveringlaw.com.tw)로 문의해 주시면, 사건 내용을 검토한 뒤 상담 흐름을 안내해 드립니다.',
      },
      {
        q: '중국어·일본어 상담도 가능한가요?',
        a: '네. 증준외 대만 변호사는 한국어 외에 중국어(번체)·일본어로도 상담이 가능하며, 다국어 계약·서류 검토도 지원합니다.',
      },
    ],
    relatedHeading: '관련 안내',
    relatedResources: [
      { href: 'guides/taiwan-company-setup', label: '대만 회사설립 종합 가이드' },
      { href: 'taiwan-company-setup-lawyer', label: '대만 법인설립·회사설립 변호사 안내' },
      { href: 'taiwan-lawyer', label: '대만 변호사 검색 가이드' },
      { href: 'taiwan-litigation-lawyer', label: '대만 소송 변호사 안내' },
      { href: 'services', label: '대만 법률 서비스 전체 보기' },
    ],
    ctaTitle: '대만 법률 문제, 한국어로 상담 받으세요',
    ctaText:
      '회사설립, 투자, 소송, 가사 분쟁 등 대만 법률 문제가 있으시면 증준외 대만 변호사에게 이메일로 문의해 주세요. 내용을 검토한 뒤 상담 흐름을 안내해 드립니다.',
    ctaButton: '증준외 대만 변호사에게 이메일 상담',
  },
  'zh-hant': {
    metaTitle: '會說韓文的台灣律師 | 昊鼎國際法律事務所（台北）',
    description:
      '昊鼎國際法律事務所（Hovering International Law Firm）為台北的台灣律師事務所，曾雋崴律師可以韓語、中文、日語提供諮詢，承辦台灣公司設立、民刑事案件與投資顧問。',
    keywords: [
      '會說韓文的台灣律師',
      '台灣律師',
      '台北律師',
      '台灣公司設立律師',
      '台灣訴訟律師',
      '曾雋崴律師',
    ],
    heroLabel: 'KOREAN-SPEAKING TAIWAN LAWYER',
    title: '會說韓文的台灣律師 — 昊鼎國際法律事務所',
    lead: [
      '昊鼎國際法律事務所（Hovering International Law Firm）為台北的台灣律師事務所，曾雋崴律師可以韓語、中文、日語提供諮詢。',
      '承辦台灣公司設立、民刑事訴訟、投資顧問，以韓語溝通協助韓國企業與個人處理台灣法律問題。',
      '從初步諮詢的事實整理、管轄與流程設計、文件審閱到訴訟因應，提供完整的一條龍服務。',
    ],
    servicesHeading: '服務領域',
    services: [
      '台灣公司設立（子公司·分公司·辦事處）',
      '台灣投資·投審會核准·工作許可與居留證',
      '民刑事訴訟、損害賠償、車禍案件',
      '合約審閱·債權回收·不動產爭議',
      '商標與智慧財產權、勞資·家事·繼承',
    ],
    languagesHeading: '各語言諮詢說明',
    languages: [
      '韓語：以韓語為韓國客戶說明並諮詢台灣法律問題。',
      '中文（繁體）：直接以繁體中文處理台灣在地文件、訴訟與合約。',
      '日語：亦提供日語溝通客戶的台灣法律顧問服務。',
      '英語：以英語協助國際交易與外國企業來台投資顧問。',
    ],
    officeHeading: '事務所地址',
    office: {
      lines: [
        '台北市大同區承德路一段35號7樓之2（7F.-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City）',
        'Email：wei@hoveringlaw.com.tw',
      ],
    },
    faqHeading: '常見問題',
    faq: [
      {
        q: '可以用韓語諮詢嗎？',
        a: '可以。昊鼎國際法律事務所的曾雋崴律師以韓語提供諮詢，舉凡台灣公司設立、訴訟、投資顧問，皆可以韓語溝通進行。',
      },
      {
        q: '可以協助韓國企業在台設立公司嗎？',
        a: '可以。從子公司、分公司、辦事處設立，到投審會投資核准、工作許可與居留證、稅籍登記，全程以韓語說明。',
      },
      {
        q: '韓國人在台灣打官司需要律師嗎？',
        a: '在台灣法院訴訟中，外國人常面臨在地程序與語言的雙重困難。曾雋崴律師在民事、刑事訴訟中以韓語溝通，協助因應。',
      },
      {
        q: '如何預約諮詢？',
        a: '請寄信至 wei@hoveringlaw.com.tw 諮詢曾雋崴律師；我們確認案件內容後，將說明後續諮詢流程。',
      },
      {
        q: '也可以用中文或日語諮詢嗎？',
        a: '可以。曾雋崴律師除韓語外，亦可以中文（繁體）及日語諮詢，並支援多語合約與文件審閱。',
      },
    ],
    relatedHeading: '相關指南',
    relatedResources: [
      { href: 'guides/taiwan-company-setup', label: '台灣公司設立完整指南' },
      { href: 'taiwan-company-setup-lawyer', label: '台灣公司設立律師指南' },
      { href: 'taiwan-lawyer', label: '台灣律師搜尋指南' },
      { href: 'taiwan-litigation-lawyer', label: '台灣訴訟律師指南' },
      { href: 'services', label: '查看所有台灣法律服務' },
    ],
    ctaTitle: '台灣法律問題，用韓語諮詢',
    ctaText:
      '不論是公司設立、投資、訴訟或家事爭議，歡迎寄信諮詢曾雋崴律師。我們確認案件概要後，將說明後續諮詢流程。',
    ctaButton: '寄信諮詢曾雋崴律師',
  },
  en: {
    metaTitle: 'Korean-Speaking Taiwan Lawyer | Hovering International Law Firm (Taipei)',
    description:
      'Hovering International Law Firm is a Taiwan law firm based in Taipei. Attorney Wei Tseng consults in Korean, Chinese, and Japanese, covering Taiwan company setup, civil and criminal litigation, and investment advisory.',
    keywords: [
      'Korean-speaking Taiwan lawyer',
      'Taiwan lawyer',
      'Taipei lawyer',
      'Taiwan company setup lawyer',
      'Taiwan litigation lawyer',
      'Attorney Wei Tseng',
    ],
    heroLabel: 'KOREAN-SPEAKING TAIWAN LAWYER',
    title: 'Korean-Speaking Taiwan Lawyer — Hovering International Law Firm',
    lead: [
      'Hovering International Law Firm is a Taiwan law firm based in Taipei. Attorney Wei Tseng consults in Korean, Chinese, and Japanese.',
      'The firm handles Taiwan company setup, civil and criminal litigation, and investment advisory, guiding Korean companies and individuals through Taiwan legal matters in Korean.',
      'From fact-finding and jurisdiction design in the first consultation to document review and litigation response, the firm works through the matter end to end.',
    ],
    servicesHeading: 'Practice Areas',
    services: [
      'Taiwan company setup (subsidiary, branch, liaison office)',
      'Taiwan investment, Investment Commission approval, work permits and residence cards',
      'Civil and criminal litigation, damages, and traffic accidents',
      'Contract review, debt recovery, real estate disputes',
      'Trademarks and intellectual property, labor, family, and inheritance',
    ],
    languagesHeading: 'Consultation by Language',
    languages: [
      'Korean: explains and consults on Taiwan legal matters for Korean clients.',
      'Chinese (Traditional): handles Taiwan documents, litigation, and contracts directly in Traditional Chinese.',
      'Japanese: also available for Japanese-speaking clients seeking Taiwan legal advice.',
      'English: supports international transactions and foreign companies investing in Taiwan.',
    ],
    officeHeading: 'Office',
    office: {
      lines: [
        '7F.-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City, Taiwan',
        'Email: wei@hoveringlaw.com.tw',
      ],
    },
    faqHeading: 'Frequently Asked Questions',
    faq: [
      {
        q: 'Can I consult in Korean?',
        a: 'Yes. Attorney Wei Tseng at Hovering International Law Firm consults in Korean. Taiwan company setup, litigation, and investment advisory can all be handled in Korean.',
      },
      {
        q: 'Do you help Korean companies set up in Taiwan?',
        a: 'Yes. From subsidiary, branch, and liaison office formation to Investment Commission approval, work permits and residence cards, and tax registration, the whole process is explained in Korean.',
      },
      {
        q: 'Does a Korean national need a lawyer to litigate in Taiwan?',
        a: 'In Taiwan courts, foreigners often face both procedural and language difficulties. Attorney Wei Tseng communicates in Korean and guides the response in civil and criminal cases.',
      },
      {
        q: 'How do I request a consultation?',
        a: 'Request a consultation with Attorney Tseng by email at wei@hoveringlaw.com.tw. After reviewing the matter, we will explain the consultation process.',
      },
      {
        q: 'Can I also consult in Chinese or Japanese?',
        a: 'Yes. In addition to Korean, Attorney Wei Tseng consults in Chinese (Traditional) and Japanese, and supports multilingual contract and document review.',
      },
    ],
    relatedHeading: 'Related Guides',
    relatedResources: [
      { href: 'guides/taiwan-company-setup', label: 'Complete Taiwan company setup guide' },
      { href: 'taiwan-company-setup-lawyer', label: 'Taiwan company setup lawyer guide' },
      { href: 'taiwan-lawyer', label: 'Taiwan lawyer search guide' },
      { href: 'taiwan-litigation-lawyer', label: 'Taiwan litigation lawyer guide' },
      { href: 'services', label: 'View all Taiwan legal services' },
    ],
    ctaTitle: 'Taiwan legal matters — consult in Korean',
    ctaText:
      'For company setup, investment, litigation, or family disputes, email Attorney Tseng in Korean. After reviewing your inquiry, we will explain the consultation process.',
    ctaButton: 'Email Attorney Tseng for Consultation',
  },
  ja: {
    metaTitle: '韓国語対応の台湾弁護士 | 昊鼎国際法律事務所（台北）',
    description:
      '昊鼎国際法律事務所（Hovering International Law Firm）は台北所在の台湾法律事務所で、台湾弁護士の曾雋崴が韓国語・中国語・日本語でご相談を承ります。台湾会社設立・民事刑事訴訟・投資顧問を取り扱います。',
    keywords: [
      '韓国語対応の台湾弁護士',
      '台湾弁護士',
      '台北弁護士',
      '台湾会社設立弁護士',
      '台湾訴訟弁護士',
      '曾雋崴弁護士',
    ],
    heroLabel: 'KOREAN-SPEAKING TAIWAN LAWYER',
    title: '韓国語対応の台湾弁護士 — 昊鼎国際法律事務所',
    lead: [
      '昊鼎国際法律事務所（Hovering International Law Firm）は台北に所在する台湾法律事務所で、台湾弁護士の曾雋崴が韓国語・中国語・日本語でご相談を承ります。',
      '台湾会社設立、民事・刑事訴訟、投資顧問を取り扱い、韓国企業と個人の台湾法律問題を韓国語でのコミュニケーションでご案内します。',
      '初回相談で事実関係の整理、管轄・手続きの設計、文書レビュー、訴訟対応まで一つの流れで検討します。',
    ],
    servicesHeading: '取扱業務',
    services: [
      '台湾会社設立・法人設立（子会社・支店・連絡事務所）',
      '台湾投資・投審会承認・ビザ（就労許可証・居留証）',
      '民事・刑事訴訟および損害賠償・交通事故',
      '契約レビュー・債権回収・不動産紛争',
      '商標・知的財産権、労使・家事・相続',
    ],
    languagesHeading: '言語別のご相談案内',
    languages: [
      '韓国語：韓国のクライアントの台湾法律問題を韓国語で説明し、ご相談を承ります。',
      '中国語（繁体字）：台湾現地の書類・訴訟・契約を繁体字中国語で直接処理します。',
      '日本語：日本語でのコミュニケーションをご希望のクライアントの台湾法律顧問も可能です。',
      '英語：国際取引・外国企業の台湾進出顧問を英語でサポートします。',
    ],
    officeHeading: 'アクセス',
    office: {
      lines: [
        '台北市大同区承徳路一段35号7F-2 (7F.-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City)',
        'メール: wei@hoveringlaw.com.tw',
      ],
    },
    faqHeading: 'よくある質問',
    faq: [
      {
        q: '韓国語で相談できますか？',
        a: 'はい。昊鼎国際法律事務所の曾雋崴台湾弁護士が韓国語でご相談を承ります。台湾会社設立、訴訟、投資顧問のすべてを韓国語でのコミュニケーションで進められます。',
      },
      {
        q: '韓国企業の台湾会社設立もサポートしていただけますか？',
        a: 'はい。子会社・支店・連絡事務所の設立、投審会の投資承認、ビザ（就労許可証・居留証）、税務登記まで設立の全過程を韓国語でご案内します。',
      },
      {
        q: '台湾で韓国人が訴訟をするときに弁護士は必要ですか？',
        a: '台湾の裁判所の訴訟で外国人は現地の法律手続きと言語の両方で困難に直面することがあります。曾雋崴台湾弁護士が民事・刑事訴訟で韓国語でコミュニケーションを取りながら対応をご案内します。',
      },
      {
        q: '相談はどのように申し込めばよいですか？',
        a: '曾雋崴台湾弁護士宛てにメール（wei@hoveringlaw.com.tw）でお問い合わせください。案件内容を確認後、ご相談の流れをご案内します。',
      },
      {
        q: '中国語・日本語での相談も可能ですか？',
        a: 'はい。曾雋崴台湾弁護士は韓国語のほか、中国語（繁体字）・日本語でもご相談が可能で、多言語の契約書・書類レビューもサポートします。',
      },
    ],
    relatedHeading: '関連案内',
    relatedResources: [
      { href: 'guides/taiwan-company-setup', label: '台湾会社設立総合ガイド' },
      { href: 'taiwan-company-setup-lawyer', label: '台湾法人設立・会社設立弁護士のご案内' },
      { href: 'taiwan-lawyer', label: '台湾弁護士検索ガイド' },
      { href: 'taiwan-litigation-lawyer', label: '台湾訴訟弁護士のご案内' },
      { href: 'services', label: '台湾法律サービス一覧' },
    ],
    ctaTitle: '台湾の法律問題、韓国語でご相談ください',
    ctaText:
      '会社設立、投資、訴訟、家事紛争など台湾の法律問題は、曾雋崴台湾弁護士へメールでお問い合わせください。内容を確認後、ご相談の流れをご案内します。',
    ctaButton: '曾雋崴弁護士にメール相談',
  },
};
