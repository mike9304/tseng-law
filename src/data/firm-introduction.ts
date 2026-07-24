import type { Locale } from '@/lib/locales';

type FirmIntroductionContent = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  logo: string;
  logoAlt: string;
  sourceUrl: string;
  sourceLabel: string;
};

export const firmIntroductionContent: Record<Locale, FirmIntroductionContent> = {
  ko: {
    sectionLabel: 'ABOUT',
    title: '호정 소개',
    subtitle: '유가굉 변호사, 임가백 변호사, 임무홍 변호사, 원유륜 변호사 및 소윤량 변호사가 공동으로 설립하였습니다.',
    paragraphs: [
      '법무법인 호정은 2016년 국립대만대학교 법학부 출신인 유가굉 변호사, 임가백 변호사, 임무홍 변호사, 원유륜 변호사 및 소윤량 변호사에 의해 공동 창립되었습니다. ‘호’(昊)는 ‘광대한 하늘’을 의미하고, ‘정’(鼎)은 ‘안정된 기초’를 뜻합니다. ‘호정’이라는 이름은 높은 목표와 견고한 기반을 지향하며, 고객에게 가장 전문적인 법률 서비스를 제공하고 가장 신뢰할 수 있는 파트너가 되고자 하는 의지를 담고 있습니다.',
      '법무법인 호정 변호사들은 각기 다른 분야에서 수년 간의 실무 경험을 쌓아온 나라 최고의 법학과 출신입니다. 다양한 복잡한 분쟁을 처리할 수 있는 완벽한 팀을 구성하고 있습니다. 가오슝 사무소는 기업 지배 구조를 주로 다루며 일반적인 민사, 형사, 행정 분쟁에서도 풍부한 경험을 갖추고 있습니다. 타이중 사무소는 건설 사건, 지식 재산 및 한국과 일본 사업을 전문으로 하며, 지식 재산 신청과 법률 분쟁 해결 등 다양한 사건을 처리합니다.',
      '2017년에는 핑둥 사무소를 설립하여 현지에 적합한 서비스를 제공하고 있습니다. 핑둥 사무소의 주임변호사인 사완균 변호사는 농민 단체의 설립, 운영, 평가 업무에 대한 풍부한 실무 경험을 바탕으로 다양하고 종합적인 법률 전문성을 제공할 수 있습니다.',
      '2020년에, 소운평 회계사가 법무법인 호정에 정식으로 합류하며, 호정 회계사무소를 설립하였습니다. 이는 기업주와 고자산 개인에게 종합적인 회계 및 세무 계획 서비스를 제공합니다.',
      '2024년, 기업주에게 법률, 회계, 세무, 인사 관리 등의 통합 서비스를 제공하기 위해 소윤량 변호사가 호정유인 법률사무소를 설립하였습니다. 이는 기업주가 회사 경영에 직면할 수 있는 문제들을 원스톱/전방위적으로 해결할 수 있도록 돕기 위함입니다.',
      '2024년, 증준외 변호사가 법무법인 호정에 정식으로 합류하여 한국 및 일본 고객에게 회사 설립, 비자 신청, 상표 및 특허 신청, 법적 위험 평가, 회사 세무 상담 등 전방위적 법률 서비스를 제공하고 있습니다.',
      '또한, 본 사무소 구성원들은 장기간에 걸쳐 사회 서비스에 헌신하고 있으며, 매년 공익 사건을 담당하고 다양한 유형의 무료 서비스 및 법률 상담을 통해 공정하고 정의로운 법의 핵심 원칙을 실천하고 있습니다.'
    ],
    logo: '/images/brand/hovering-logo-ko.png',
    logoAlt: '법무법인 호정 로고',
    sourceUrl: 'https://www.hoveringlaw.com.tw/kr/about.html',
    sourceLabel: '출처: hoveringlaw.com.tw'
  },
  'zh-hant': {
    sectionLabel: 'ABOUT',
    title: '關於本所',
    subtitle: '由劉家宏律師、林嘉柏律師、林茂弘律師、袁裕倫律師以及邵允亮律師共同成立。',
    paragraphs: [
      '昊鼎國際法律事務所於2016年，由國立臺灣大學法學院劉家宏律師、林嘉柏律師、林茂弘律師、袁裕倫律師以及邵允亮律師共同創立。「昊」之意乃「廣大無垠之天」，「鼎」則取形「三足兩耳」意為「穩固之基礎」；名之為「昊鼎」，即志向高遠，根基踏實，能完整提供客戶最專業的法律服務，亦是最堅實可信任的合作夥伴。',
      '本所律師畢業自我國頂尖法學院，各在不同領域累積多年實務經歷，有完整團隊處理各類複雜糾紛。高雄分所除主理公司治理外，對於一般傳統民事、刑事、行政糾紛亦有豐富承辦經驗；臺中分所為工程案件、智慧財產及韓國、日本事務專所，另有提供智慧財產申請、法律爭端解決，承辦案件多元。',
      '於2017年，本所設立屏東分所，除發揮因地制宜之優勢外，屏東分所主持律師謝宛均律師對於農民團體之成立、運作、評鑑業務具有豐富實務經驗，能提供更為多元及全面性的法律專業。',
      '於2024年，王鼎翔律師、曾雋崴律師正式加入本所團隊。王鼎翔律師除一般律師執業領域，更專精於刑事案件，曾擔任法官助理，熟悉法院內部運作方式及思考脈絡，對當事人具有耐心，能聆聽當事人需求，而給予適切的訴訟策略；曾雋崴律師除有多年訴訟經驗，並致力為日、韓客戶提供包含公司設立、簽證申請、商標專利申請、法律風險評估、公司稅務諮詢等全方面法律服務。',
      '此外，本所成員亦長期投身於社會服務，每年除了固定承辦公益與扶助案件外，也會投入一定時數進行各類型的無償服務與法律諮詢，讓公平正義作為法律內涵的核心理念能夠得到實踐。'
    ],
    logo: '/images/brand/hovering-logo-zh.png',
    logoAlt: '昊鼎國際法律事務所標誌',
    sourceUrl: 'https://www.hoveringlaw.com.tw/zh/about.html',
    sourceLabel: '來源: hoveringlaw.com.tw'
  },
  en: {
    sectionLabel: 'ABOUT',
    title: 'About Hovering',
    subtitle:
      'Founded jointly by Attorneys Liu Chia-Hung, Lin Chia-Po, Lin Mao-Hung, Yuan Yu-Lun, and Shao Yun-Liang.',
    paragraphs: [
      "Hovering International Law Firm was established in 2016 by attorneys from National Taiwan University. The character '昊' (Hao) represents a broad and open sky, and '鼎' (Ding) symbolizes a stable foundation. The name reflects our goal of delivering highly professional legal services while being a trusted long-term partner to clients.",
      'Our lawyers come from top law schools in Taiwan and bring years of practical experience in different practice areas. The Kaohsiung office focuses on corporate governance and also handles general civil, criminal, and administrative disputes. The Taichung office specializes in construction, intellectual property, and Korea/Japan-related matters, including both filings and dispute resolution.',
      'In 2017, we opened the Pingtung office to provide region-specific legal support. Its managing attorney has extensive practical experience in the establishment, operation, and evaluation of farmers’ organizations, allowing broader and more comprehensive legal services.',
      'In 2020, CPA Su Yun-Ping officially joined the firm and established the Hovering Accounting Office to provide integrated accounting and tax planning services for business owners and high-net-worth individuals.',
      'In 2024, to provide integrated support across legal, accounting, tax, and HR matters for business owners, Attorney Shao Yun-Liang established Hovering Youyin Law Office for one-stop, all-around business support.',
      'Also in 2024, Attorney Wei Tseng joined Hovering and has been providing comprehensive legal services for Korean and Japanese clients, including company setup, visa applications, trademark/patent filings, legal risk assessments, and corporate tax consultation.',
      'Our members also remain committed to social service. In addition to annual public-interest and legal-aid cases, we continue to provide pro bono services and legal consultations to put fairness and justice into practice.'
    ],
    logo: '/images/brand/hovering-logo-ko.png',
    logoAlt: 'Hovering International Law Firm logo',
    sourceUrl: 'https://www.hoveringlaw.com.tw/en/about.html',
    sourceLabel: 'Source: hoveringlaw.com.tw'
  }
};
