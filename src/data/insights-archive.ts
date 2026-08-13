import type { Locale } from '@/lib/locales';

export type InsightCategory = 'formation' | 'legal' | 'case';

export type InsightPost = {
  id: string;
  title: string;
  summary: string;
  href: string;
  category: InsightCategory;
  date?: string;
  readTime?: string;
  image: string;
  keywords: string[];
};

export type InsightsArchive = {
  label: string;
  title: string;
  description: string;
  categories: Record<InsightCategory, string>;
  posts: InsightPost[];
  homeFeaturedIds: string[];
};

const baseInsightsArchive: Record<'ko' | 'zh-hant', InsightsArchive> = {
  ko: {
    label: 'INSIGHTS',
    title: '호정칼럼',
    description: '대만 법인설립, 법률정보, 소송사례 분석을 한 곳에서 정리합니다.',
    categories: {
      formation: '대만 법인설립',
      legal: '대만 법률정보',
      case: '소송사례 분석'
    },
    homeFeaturedIds: ['gym-injury-lawsuit', 'cosmetics-market-entry', 'company-advanced-2'],
    posts: [
      {
        id: 'gym-injury-lawsuit',
        title: '대만 헬스장 부상 손해배상: 1심 사례·청구기한·증거·배상항목',
        summary: '대만 헬스장 부상 1심 사례를 바탕으로 형사 고소기간, 민사 청구기한, 증거보전, 배상항목과 보험 확인 사항을 정리합니다.',
        href: '/ko/insights/gym-injury-lawsuit',
        category: 'case',
        date: '2025.09.13',
        readTime: '7분',
        image: '/images/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
        keywords: ['헬스장 부상', '손해배상', '청구기한', '증거보전', '배상항목']
      },
      {
        id: 'cosmetics-market-entry',
        title: '대만 화장품 시장 진출: 법인 설립부터 PIF 등록까지',
        summary: '진출 모델 선택, PIF 등록, 광고 규제까지 화장품 판매 핵심 리스크를 정리했습니다.',
        href: '/ko/insights/cosmetics-market-entry',
        category: 'formation',
        date: '2026.02.04',
        readTime: '3분',
        image: '/images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
        keywords: ['화장품', 'PIF', 'TFDA', '법인설립']
      },
      {
        id: 'company-advanced-2',
        title: '대만 회사설립 -심화편-2',
        summary: '자본금 송금, 예비계좌, 정식 계좌 전환, 인터넷 뱅킹 조건을 Q&A로 정리했습니다.',
        href: '/ko/insights/company-advanced-2',
        category: 'formation',
        date: '2025.09.13',
        readTime: '2분',
        image: '/images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
        keywords: ['자본금', '예비계좌', '외환관리법', '법인설립']
      },
      {
        id: 'withdraw-capital',
        title: '대만 회사 운영 종료 시 자본금 회수 방법',
        summary: '해산·청산 절차를 통해 잔여재산을 분배받는 자본금 회수 흐름을 설명합니다.',
        href: '/ko/insights/withdraw-capital',
        category: 'formation',
        image: '/images/002-withdraw-capital-taiwan-company/featured-01.png',
        keywords: ['해산', '청산', '자본금 회수']
      },
      {
        id: 'logistics-business',
        title: '대만에서 물류업을 경영하는 방법',
        summary: '대만 물류업 진출 시 검토해야 할 법적 요건과 실무 절차를 정리했습니다.',
        href: '/ko/insights/logistics-business',
        category: 'formation',
        image: '/images/017-taiwan-logistics-business-setup/featured-01.jpg',
        keywords: ['물류업', '사업허가', '대만 진출']
      },
      {
        id: 'company-location',
        title: '대만 회사설립 -심화편-3 영업 장소 찾기',
        summary: '영업 주소지 선정 시 용도지역 규정과 지방정부 요건을 함께 확인해야 합니다.',
        href: '/ko/insights/company-location',
        category: 'formation',
        image: '/images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
        keywords: ['영업장소', '용도지역', '식당사업']
      },
      {
        id: 'company-advanced-1',
        title: '대만 회사설립 -심화편-1',
        summary: '회사 설립 이후 취업비자·거류증 관련 실무 질문을 심화 Q&A로 정리했습니다.',
        href: '/ko/insights/company-advanced-1',
        category: 'formation',
        image: '/images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
        keywords: ['취업비자', '거류증', '법인설립']
      },
      {
        id: 'subsidiary-vs-branch',
        title: '대만 회사설립 자회사 VS 지사',
        summary: '자회사, 지사, 연락사무소의 법인격·세무·영업 범위를 비교합니다.',
        href: '/ko/insights/subsidiary-vs-branch',
        category: 'formation',
        image: '/images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
        keywords: ['자회사', '지사', '연락사무소']
      },
      {
        id: 'company-basics',
        title: '대만 회사설립 -기초편-',
        summary: '회사 설립 절차와 필요 서류를 기초 단계부터 영상과 함께 안내합니다.',
        href: '/ko/insights/company-basics',
        category: 'formation',
        image: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
        keywords: ['회사설립', '기초편', '필요서류']
      },
      {
        id: 'inheritance-custody',
        title: '대만 상속과 친권: 남은 가족을 위한 법률 안내',
        summary: '대만의 상속순위, 배우자 재산청구, 친권상 권리·의무와 미성년자 재산보호를 익명 사례 없이 설명합니다.',
        href: '/ko/insights/taiwan-inheritance-custody-analysis',
        category: 'legal',
        image: '/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
        keywords: ['상속', '친권', '미성년자 재산']
      },
      {
        id: 'overtaking-accident',
        title: '대만 추월 사고의 책임은 어떻게 판단하나요?',
        summary:
          '대만 도로교통안전규칙 제101조의 추월 금지 조건과 같은 차로에서의 추월 절차, 익명 사고 사례를 통한 과실 판단 요소를 결과 보장 없이 정리합니다.',
        href: '/ko/insights/overtaking-accident',
        category: 'legal',
        readTime: '4분 분량',
        image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
        keywords: [
          '대만 추월 사고',
          '도로교통안전규칙 제101조',
          '교통사고 과실',
          '사고 감정',
        ],
      },
      {
        id: 'severance-exception',
        title: '자발적 퇴사에도 퇴직금을 받을 수 있는 예외',
        summary: '대만 노동법상 자발적 퇴사 예외 상황에서 퇴직금 가능성을 설명합니다.',
        href: '/ko/insights/severance-exception',
        category: 'legal',
        image: '/images/009-직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외/featured-01.jpeg',
        keywords: ['퇴직금', '노동법', '자발적 퇴사']
      },
      {
        id: 'divorce-qna',
        title: '대만 이혼 절차 Q&A: 조정·소송·재산분할·자녀',
        summary:
          '대만의 협의·조정·재판이혼 절차, 국제결혼·외국 이혼의 호적·승인 문제, 부부재산, 이혼 후 청구와 미성년 자녀 문제를 결과 보장 없이 정리합니다.',
        href: '/ko/insights/divorce-qna',
        category: 'legal',
        readTime: '18분 분량',
        image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
        keywords: [
          '대만 이혼 절차',
          '국제이혼',
          '부부재산',
          '이혼 후 청구',
          '미성년 자녀',
        ],
      },
      {
        id: 'massage-law',
        title: '대만 마사지 역사와 법률정보',
        summary: '마사지 산업의 역사와 현행 규제 체계를 함께 정리한 법률정보 글입니다.',
        href: '/ko/insights/massage-law',
        category: 'legal',
        image: '/images/006-taiwan-massage-history-law/featured-01.jpg',
        keywords: ['마사지', '규제', '법률정보']
      },
      {
        id: 'mandatory-employment',
        title: '대만 최소 근무기간 약정: 효력·교육비·위약금 판단 기준',
        summary: '두 가지 선택적 법정 요건과 별도의 합리성 심사를 설명하고, 훈련비와 선급성 급부의 반환을 구분하며, 계약 종료 사유의 책임 귀속이 제15조의1 제4항상 훈련비 반환 책임에 미치는 영향을 살펴봅니다.',
        href: '/ko/insights/taiwan-mandatory-employment-period',
        category: 'legal',
        image: '/images/014-taiwan-mandatory-employment-period/featured-01.jpg',
        keywords: ['최소 근무기간', '교육비 반환', '선급성 급부', '책임 귀속']
      },
      {
        id: 'labor-severance',
        title: '대만 노동법: 대만에서 퇴직금 받기 어렵다고??',
        summary: '한국과 대만의 퇴직금 제도 차이와 해고·퇴직금 관계를 비교합니다.',
        href: '/ko/insights/labor-severance',
        category: 'legal',
        image: '/images/008-대만-노동법-대만에서-퇴직금-받기-어렵다고/featured-01.jpg',
        keywords: ['노동법', '퇴직금', '해고']
      },
      {
        id: 'traffic-accident-procedure',
        title: '대만에서 교통사고 발생시',
        summary: '사고 직후 대응, 경찰 신고, 보험 처리, 배상 청구 절차를 안내합니다.',
        href: '/ko/insights/traffic-accident-procedure',
        category: 'legal',
        image: '/images/003-taiwan-traffic-accident-procedure/featured-01.jpg',
        keywords: ['교통사고', '보험', '배상청구']
      }
    ]
  },
  'zh-hant': {
    label: 'INSIGHTS',
    title: '昊鼎專欄',
    description: '整理台灣公司設立、法律資訊與訴訟案例重點內容。',
    categories: {
      formation: '台灣公司設立',
      legal: '台灣法律資訊',
      case: '訴訟案例分析'
    },
    homeFeaturedIds: ['gym-injury-lawsuit', 'cosmetics-market-entry', 'company-advanced-2'],
    posts: [
      {
        id: 'gym-injury-lawsuit',
        title: '台灣健身房受傷求償：一審案例、期限、證據與賠償項目',
        summary: '以台灣健身房受傷的一審案例為基礎，整理刑事告訴與民事求償的期限、證據保存、賠償項目及保險確認事項。',
        href: '/zh-hant/insights/gym-injury-lawsuit',
        category: 'case',
        date: '2025.09.13',
        readTime: '7分',
        image: '/images/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
        keywords: ['健身房受傷', '損害賠償', '求償期限', '證據保存', '賠償項目']
      },
      {
        id: 'cosmetics-market-entry',
        title: '台灣化妝品市場進入：公司設立到 PIF 登錄',
        summary: '整理市場進入模式、PIF 文件要求與廣告法規風險。',
        href: '/zh-hant/insights/cosmetics-market-entry',
        category: 'formation',
        date: '2026.02.04',
        readTime: '3分',
        image: '/images/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide/featured-01.jpg',
        keywords: ['化妝品', 'PIF', 'TFDA', '公司設立']
      },
      {
        id: 'company-advanced-2',
        title: '台灣公司設立進階篇 2',
        summary: '以 Q&A 說明資本額匯款、籌備帳戶與正式帳戶轉換重點。',
        href: '/zh-hant/insights/company-advanced-2',
        category: 'formation',
        date: '2025.09.13',
        readTime: '2分',
        image: '/images/005-taiwan-company-establishment-advanced-2/featured-01.jpg',
        keywords: ['資本額', '籌備帳戶', '公司設立']
      },
      {
        id: 'withdraw-capital',
        title: '公司停止營運時如何取回資本額',
        summary: '透過解散與清算程序，依法分配剩餘財產。',
        href: '/zh-hant/insights/withdraw-capital',
        category: 'formation',
        image: '/images/002-withdraw-capital-taiwan-company/featured-01.png',
        keywords: ['解散', '清算', '資本回收']
      },
      {
        id: 'logistics-business',
        title: '在台經營物流業的方法',
        summary: '整理物流業在台落地時需要留意的法律與程序。',
        href: '/zh-hant/insights/logistics-business',
        category: 'formation',
        image: '/images/017-taiwan-logistics-business-setup/featured-01.jpg',
        keywords: ['物流業', '營運許可']
      },
      {
        id: 'company-location',
        title: '台灣公司設立進階篇 3：營業場所選址',
        summary: '選址時除了市場因素，也要先確認土地使用分區與地方規範。',
        href: '/zh-hant/insights/company-location',
        category: 'formation',
        image: '/images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
        keywords: ['營業場所', '土地使用分區']
      },
      {
        id: 'company-advanced-1',
        title: '台灣公司設立進階篇 1',
        summary: '彙整公司設立後就業簽證與居留證常見問題。',
        href: '/zh-hant/insights/company-advanced-1',
        category: 'formation',
        image: '/images/013-taiwan-company-establishment-advanced-1/featured-01.jpg',
        keywords: ['就業簽證', '居留證']
      },
      {
        id: 'subsidiary-vs-branch',
        title: '台灣公司設立：子公司 VS 分公司',
        summary: '比較子公司、分公司與聯絡處在法律地位與稅務上的差異。',
        href: '/zh-hant/insights/subsidiary-vs-branch',
        category: 'formation',
        image: '/images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
        keywords: ['子公司', '分公司', '聯絡處']
      },
      {
        id: 'company-basics',
        title: '台灣公司設立基礎篇',
        summary: '從基本流程到所需文件，快速掌握設立重點。',
        href: '/zh-hant/insights/company-basics',
        category: 'formation',
        image: '/images/001-taiwan-company-establishment-basics/featured-01.jpg',
        keywords: ['公司設立', '流程', '文件']
      },
      {
        id: 'inheritance-custody',
        title: '台灣繼承與親權：遺屬法律指南',
        summary: '說明台灣法下的繼承順位、配偶剩餘財產請求、親權權利義務及未成年人財產保護。',
        href: '/zh-hant/insights/taiwan-inheritance-custody-analysis',
        category: 'legal',
        image: '/images/016-taiwan-inheritance-custody-analysis/featured-generic.webp',
        keywords: ['繼承', '親權', '未成年人財產']
      },
      {
        id: 'overtaking-accident',
        title: '台灣超車事故的責任如何判斷？',
        summary:
          '整理台灣《道路交通安全規則》第101條的禁止超車條件、同車道程序及匿名事故案例的責任判斷因素，不保證個案結果。',
        href: '/zh-hant/insights/overtaking-accident',
        category: 'legal',
        readTime: '3分鐘閱讀',
        image: '/images/012-taiwan-overtaking-accident-liability/featured-01.jpg',
        keywords: [
          '台灣超車事故',
          '道路交通安全規則第101條',
          '交通事故過失',
          '事故鑑定',
        ],
      },
      {
        id: 'severance-exception',
        title: '自願離職也可能領到資遣費的例外',
        summary: '說明台灣勞動法下自願離職的例外情形。',
        href: '/zh-hant/insights/severance-exception',
        category: 'legal',
        image: '/images/009-직원이-자발적으로-퇴사해도-퇴직금을-받을-수-있는-예외/featured-01.jpeg',
        keywords: ['勞動法', '資遣費']
      },
      {
        id: 'divorce-qna',
        title: '台灣離婚程序 Q&A：調解、訴訟、財產分配與子女',
        summary:
          '整理台灣協議、調解與裁判離婚程序、跨國婚姻與外國離婚的戶籍及承認問題、夫妻財產、離婚後請求與未成年子女事項，不保證個案結果。',
        href: '/zh-hant/insights/divorce-qna',
        category: 'legal',
        readTime: '20分鐘閱讀',
        image: '/images/007-taiwan-divorce-lawsuit-qna/featured-01.jpg',
        keywords: [
          '台灣離婚程序',
          '跨國離婚',
          '夫妻財產',
          '離婚後請求',
          '未成年子女',
        ],
      },
      {
        id: 'massage-law',
        title: '台灣按摩產業歷史與法規',
        summary: '從產業演變到現行規範，整理核心法律重點。',
        href: '/zh-hant/insights/massage-law',
        category: 'legal',
        image: '/images/006-taiwan-massage-history-law/featured-01.jpg',
        keywords: ['按摩', '產業規範']
      },
      {
        id: 'mandatory-employment',
        title: '台灣最低服務年限約定：效力、培訓費用與違約金判斷',
        summary: '說明兩項擇一的法定基礎及另行的合理範圍審查，區分培訓費用與預付性給付的返還，並說明契約終止的可歸責性對第15條之1第4項培訓費用返還責任的影響。',
        href: '/zh-hant/insights/taiwan-mandatory-employment-period',
        category: 'legal',
        image: '/images/014-taiwan-mandatory-employment-period/featured-01.jpg',
        keywords: ['最低服務年限', '培訓費用', '預付性給付', '責任歸屬']
      },
      {
        id: 'labor-severance',
        title: '台灣勞動法：資遣費真的很難領嗎？',
        summary: '比較韓國與台灣制度差異，釐清資遣費要件。',
        href: '/zh-hant/insights/labor-severance',
        category: 'legal',
        image: '/images/008-대만-노동법-대만에서-퇴직금-받기-어렵다고/featured-01.jpg',
        keywords: ['勞動法', '資遣費', '解雇']
      },
      {
        id: 'traffic-accident-procedure',
        title: '台灣交通事故發生時的處理流程',
        summary: '事故後報警、保險與求償流程一次整理。',
        href: '/zh-hant/insights/traffic-accident-procedure',
        category: 'legal',
        image: '/images/003-taiwan-traffic-accident-procedure/featured-01.jpg',
        keywords: ['交通事故', '保險', '求償']
      }
    ]
  }
};

const englishPostCopy: Record<string, { title: string; summary: string; keywords?: string[]; readTime?: string }> = {
  'gym-injury-lawsuit': {
    title: 'Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages',
    summary: 'Using a first-instance Taiwan gym injury case, this guide explains deadlines for criminal complaints and civil claims, evidence preservation, damages, and insurance checks.',
    keywords: ['gym injury', 'damages', 'claim deadlines', 'evidence preservation', 'insurance']
  },
  'cosmetics-market-entry': {
    title: 'Taiwan Cosmetics Market Entry: From Incorporation to PIF Registration',
    summary: 'A practical guide to market-entry model selection, PIF filings, and advertising compliance.',
    keywords: ['cosmetics', 'PIF', 'TFDA', 'company setup']
  },
  'company-advanced-2': {
    title: 'Taiwan Company Setup: Advanced Guide 2',
    summary: 'Q&A on capital remittance, preparatory accounts, and conversion to formal bank accounts.',
    keywords: ['capital', 'bank account', 'FX compliance', 'company setup']
  },
  'withdraw-capital': {
    title: 'How to Recover Capital When Closing a Taiwan Company',
    summary: 'How dissolution and liquidation procedures are used to distribute remaining assets lawfully.',
    keywords: ['dissolution', 'liquidation', 'capital recovery']
  },
  'logistics-business': {
    title: 'How to Operate a Logistics Business in Taiwan',
    summary: 'Key legal requirements and practical procedures for entering the Taiwan logistics market.',
    keywords: ['logistics', 'business licensing', 'Taiwan market entry']
  },
  'company-location': {
    title: 'Taiwan Company Setup: Advanced Guide 3 - Business Location',
    summary: 'How to check zoning and local compliance requirements before selecting a business address.',
    keywords: ['business premises', 'zoning', 'location compliance']
  },
  'company-advanced-1': {
    title: 'Taiwan Company Setup: Advanced Guide 1',
    summary: 'Frequently asked questions on post-incorporation work visa and ARC matters.',
    keywords: ['work visa', 'ARC', 'company setup']
  },
  'subsidiary-vs-branch': {
    title: 'Taiwan Company Setup: Subsidiary vs Branch',
    summary: 'A comparison of subsidiaries, branches, and representative offices in legal and tax structure.',
    keywords: ['subsidiary', 'branch', 'representative office']
  },
  'company-basics': {
    title: 'Taiwan Company Setup Basics',
    summary: 'An introductory overview of core incorporation procedures and required documents.',
    keywords: ['company setup', 'incorporation process', 'required documents']
  },
  'inheritance-custody': {
    title: 'Taiwan Inheritance and Parental Rights: A Guide for Surviving Families',
    summary: 'A guide to Taiwan succession, spousal residual-property claims, parental rights and duties, and protection of a minor’s property.',
    keywords: ['inheritance', 'parental rights', 'minor property']
  },
  'overtaking-accident': {
    title: 'How Is Liability Assessed After an Overtaking Accident in Taiwan?',
    summary:
      "A guide to Article 101's overtaking prohibitions and same-lane procedure, plus the fact-specific factors used to assess fault in an anonymized Taiwan collision, without guaranteeing an outcome.",
    readTime: '4 min read',
    keywords: [
      'Taiwan overtaking accident',
      'Road Traffic Safety Regulations Article 101',
      'traffic accident fault',
      'accident appraisal',
    ],
  },
  'severance-exception': {
    title: 'Exceptions Where Voluntary Resignation May Still Qualify for Severance',
    summary: 'Key exceptions under Taiwan labor law where severance remains claimable after voluntary resignation.',
    keywords: ['severance', 'labor law', 'voluntary resignation']
  },
  'divorce-qna': {
    title: 'Taiwan Divorce Q&A: Mediation, Litigation, Property, and Children',
    summary:
      'A guide to Taiwan divorce by agreement, court mediation or judgment, cross-border marriage and divorce records, matrimonial property, post-divorce claims, and minor-child issues, without promising an outcome.',
    readTime: '25 min read',
    keywords: [
      'Taiwan divorce procedure',
      'cross-border divorce',
      'matrimonial property',
      'post-divorce claims',
      'minor children',
    ],
  },
  'massage-law': {
    title: 'History and Regulation of Taiwan’s Massage Industry',
    summary: 'A legal overview from historical development to current regulatory requirements.',
    keywords: ['massage industry', 'regulation', 'legal history']
  },
  'mandatory-employment': {
    title: 'Taiwan Minimum Service Period Clauses: Validity, Training Costs, and Repayment',
    summary: 'Explains the two alternative statutory bases and the separate reasonable-scope review, distinguishes reimbursement of training expenses from repayment of prepaid benefits, and explains how attribution for the end of employment affects training-expense liability under Article 15-1(4).',
    keywords: ['minimum service period', 'training-cost repayment', 'prepaid benefit', 'attribution']
  },
  'labor-severance': {
    title: 'Taiwan Labor Law: Is Severance Really Hard to Receive?',
    summary: 'A comparison of Taiwan and Korea severance systems with practical legal conditions.',
    keywords: ['labor law', 'severance', 'dismissal']
  },
  'traffic-accident-procedure': {
    title: 'What to Do After a Traffic Accident in Taiwan',
    summary: 'Step-by-step response flow: evidence, police report, insurance, and compensation claims.',
    keywords: ['traffic accident', 'insurance', 'compensation claim']
  }
};

function toEnglishReadTime(value?: string) {
  if (!value) return value;
  return value.replace(/분/g, ' min').replace(/分/g, ' min');
}

function buildEnglishInsights(base: InsightsArchive): InsightsArchive {
  return {
    ...base,
    label: 'INSIGHTS',
    title: 'Columns',
    description: 'Practical legal insights on Taiwan incorporation, legal information, and litigation cases.',
    categories: {
      formation: 'Company Setup',
      legal: 'Legal Information',
      case: 'Case Analysis'
    },
    posts: base.posts.map((post) => {
      const translated = englishPostCopy[post.id];
      return {
        ...post,
        title: translated?.title ?? post.title,
        summary: translated?.summary ?? post.summary,
        keywords: translated?.keywords ?? post.keywords,
        href: post.href.replace(/^\/ko\/insights\//, '/en/insights/'),
        readTime: translated?.readTime ?? toEnglishReadTime(post.readTime)
      };
    })
  };
}

export const insightsArchive: Record<Locale, InsightsArchive> = {
  ...baseInsightsArchive,
  en: buildEnglishInsights(baseInsightsArchive.ko)
};

function resolveInsightDateValue(post: InsightPost): number {
  const parts = post.date?.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (!parts) return Number.NEGATIVE_INFINITY;
  return Date.UTC(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
}

export function sortInsightPostsNewestFirst(posts: readonly InsightPost[]): InsightPost[] {
  return posts
    .map((post, index) => ({ post, index, dateValue: resolveInsightDateValue(post) }))
    .sort((a, b) => (b.dateValue - a.dateValue) || (a.index - b.index))
    .map(({ post }) => post);
}

export function getFeaturedInsights(locale: Locale) {
  const content = insightsArchive[locale];
  return sortInsightPostsNewestFirst(
    content.homeFeaturedIds
      .map((id) => content.posts.find((post) => post.id === id))
      .filter((post): post is InsightPost => Boolean(post)),
  );
}
