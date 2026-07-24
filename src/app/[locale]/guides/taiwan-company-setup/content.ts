import type { Locale } from '@/lib/locales';

export const GUIDE_SLUG = 'guides/taiwan-company-setup';

type FaqItem = { q: string; a: string };
type HowToStep = { name: string; text: string };

export type GuideContent = {
  title: string;
  metaTitle: string;
  description: string;
  keywords: string[];
  heroLabel: string;
  summary: string[];
  procedureHeading: string;
  procedureIntro: string;
  steps: HowToStep[];
  comparisonHeading: string;
  comparisonIntro: string;
  comparisonColumns: string[];
  comparisonRows: Array<{ form: string; values: string[] }>;
  costHeading: string;
  costIntro: string;
  costColumns: string[];
  costRows: Array<{ item: string; values: string[] }>;
  faqHeading: string;
  faq: FaqItem[];
  relatedHeading: string;
  relatedColumns: Array<{ slug: string; title: string }>;
  relatedResourcesHeading: string;
  relatedResources: Array<{ href: string; label: string }>;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

const relatedColumnsKo = [
  { slug: 'taiwan-company-establishment-basics', title: '대만 회사설립 -기초편-' },
  { slug: 'taiwan-company-establishment-advanced-1', title: '대만 회사설립 -심화편-1' },
  { slug: 'taiwan-company-establishment-advanced-2', title: '대만 회사설립 -심화편-2' },
  { slug: 'taiwan-company-subsidiary-vs-branch', title: '대만 회사설립 자회사 VS 지사' },
];

export const guideContent: Record<Locale, GuideContent> = {
  ko: {
    title: '대만 법인설립(회사설립) 종합 가이드',
    metaTitle: '대만 법인설립·회사설립 절차·비용 총정리 (2026) | 법무법인 호정',
    description:
      '대만 법인설립(회사설립) 절차(투심회 승인→사명 예심→설립 등기→세적 등기→계좌 개설), 법인 형태 비교(자회사·지사·연락사무소), 비용·기간, 자주 묻는 질문까지 한국어로 정리한 종합 가이드입니다.',
    keywords: [
      '대만 회사설립',
      '대만 법인설립',
      '대만 회사설립 비용',
      '대만 회사설립 절차',
      '대만 투자심의위원회',
      '대만 자회사',
      '대만 지사',
    ],
    heroLabel: 'COMPLETE GUIDE',
    summary: [
      '대만 법인설립 절차는 투심회 승인, 사명 예심·공증, 설립·세적 등기, 정식 계좌 개설 순으로 진행됩니다.',
      '대만 회사 설립 자체는 최소 자본금 제한이 없어 1대만 달러로도 가능하지만, 대표자의 취업허가증·거류증이 필요하면 단일 주주 기준 최소 50만 대만 달러의 자본금이 필요합니다.',
      '회사 설립에 약 3개월, 설립 후 취업허가증·거류증 취득에 약 1개월이 소요되는 것이 일반적입니다.',
      '핵심 절차는 투자심의위원회(투심회) 투자 승인 → 사명 예심·위임장 공증 → 설립 등기 → 세무 등기 → 은행 정식 계좌 개설의 흐름으로 진행됩니다.',
    ],
    procedureHeading: '대만 법인설립 절차 (5단계)',
    procedureIntro:
      '아래 5단계는 대만 법인설립의 핵심 흐름을 정리한 것입니다. 각 단계의 세부 서류와 일정은 사안에 따라 달라질 수 있습니다.',
    steps: [
      {
        name: '투자심의위원회(투심회) 투자 승인',
        text: '외국인은 대만 투자심의위원회에 투자계획서를 제출해 심사를 받아야 합니다. 투심회는 자본금이 실제 투자 용도로 쓰이는지 확인하며, 승인 후 1년 이내에 자본금을 송금해야 합니다.',
      },
      {
        name: '사명 예심 및 위임장 공증',
        text: '회사의 중국어 명칭을 검색·신청하고, 대만 변호사 등에게 위임장 인증·공증을 진행합니다. 투자계획 심사와 병행해 회사 등록 주소지를 물색하면 시간을 줄일 수 있습니다.',
      },
      {
        name: '설립 등기 (자본금 송금·감사·법인 등기)',
        text: '회사 예비 계좌를 개설하고 자본금을 송금한 뒤 자본금 감사를 거쳐 경제부에 법인 등기를 마칩니다. 한국 은행에서 송금할 때는 본인이 직접 방문해 송금해야 하고 해외직접투자 신고가 필요합니다.',
      },
      {
        name: '세적(세무) 등기',
        text: '법인 등기 후 세무 등기를 진행합니다. 회사는 영업세(부가가치세) 5%를 2개월마다 신고하고, 매년 5월 전년도 영리사업소득세(법인세) 20%를 신고합니다.',
      },
      {
        name: '은행 정식 계좌 개설',
        text: '법인 등기 서류를 받은 뒤 책임자가 은행에서 예비 계좌를 정식 계좌로 전환합니다. 자금세탁 방지로 계좌 개설이 엄격해 임대계약서 검사·실사가 이루어지며, 은행에 따라 인터넷뱅킹에 추가 조건이 있을 수 있습니다.',
      },
    ],
    comparisonHeading: '법인 형태 비교 (자회사·지사·연락사무소)',
    comparisonIntro:
      '대만 진출 형태는 크게 자회사(주식회사·유한회사), 지사(지점), 연락사무소(사무소)로 나뉩니다. 세금·법적 책임·상장 가능 여부가 다릅니다.',
    comparisonColumns: ['항목', '자회사 (주식회사·유한회사)', '지사 (지점)', '연락사무소'],
    comparisonRows: [
      { form: '법인격', values: ['있음 (독립 법인)', '없음 (영업 자격만)', '없음'] },
      { form: '영업세(부가세)', values: ['5%', '5%', '해당 없음'] },
      { form: '법인세', values: ['20%', '20%', '해당 없음'] },
      { form: '배당금 외국인소득세', values: ['21%', '없음', '해당 없음'] },
      { form: '미처분이익잉여금세', values: ['5%', '없음', '해당 없음'] },
      { form: '합자(타인 지분 참여)', values: ['가능', '불가 (한국 모기업 100%)', '불가'] },
      { form: '대만 상장', values: ['가능 (주식회사)', '불가', '불가'] },
      { form: 'R&D 세액공제', values: ['최대 30%', '없음', '없음'] },
    ],
    costHeading: '비용·기간 요약',
    costIntro:
      '아래 수치는 당사 칼럼에 공개된 일반 요건·세율·기간을 정리한 것입니다. 실제 비용은 업종·자본금·대행 수수료에 따라 다릅니다.',
    costColumns: ['항목', '내용'],
    costRows: [
      { item: '최소 자본금(설립 자체)', values: ['법정 최소 없음 (1대만 달러 가능)'] },
      { item: '취업허가증·거류증용 자본금', values: ['단일 주주 최소 50만 대만 달러 (대만 파트너 있으면 약 17만 대만 달러)'] },
      { item: '설립 소요 기간', values: ['약 3개월'] },
      { item: '취업허가증·거류증 소요 기간', values: ['약 1개월'] },
      { item: '영업세', values: ['5% (2개월마다 신고)'] },
      { item: '법인세', values: ['20% (연간)'] },
      { item: '한국-대만 이중과세 약정', values: ['2023.12.2 발효. 고정 사업장이 아니면 영업이익 면세, 배당금 상한세율 10%'] },
    ],
    faqHeading: '자주 묻는 질문',
    faq: [
      {
        q: '대만 법인설립 시 최소 자본금이 있나요?',
        a: '회사 설립 자체는 최소 자본금 제한이 없어 1대만 달러로도 가능합니다. 다만 대표자의 취업허가증과 거류증이 필요하면 단일 주주 기준 최소 50만 대만 달러, 대만 파트너가 있으면 그 3분의 1(약 17만 대만 달러)을 투자해야 하며 회사 연 매출액이 300만 대만 달러를 초과해야 합니다.',
      },
      {
        q: '회사를 설립하면 대만 비자를 받을 수 있나요?',
        a: '네. 투자자가 대만에서 회사를 관리·운영해야 하는 경우 대만 노동부에 외국인 취업허가증을 신청하고, 받은 후 이민국에 거류증을 신청할 수 있습니다. 외국인 취업허가증 허가 기간은 1~3년이며 거류증과 유효 기간이 같습니다.',
      },
      {
        q: '자회사와 지사의 세금 차이는?',
        a: '둘 다 영업세 5%와 법인세 20%는 같습니다. 자회사는 이익을 배당할 때 21% 외국인소득세가 추가되고 분배하지 않으면 5% 미처분이익잉여금세가 붙습니다. 지사는 이익을 모기업으로 송금할 때 추가 세금과 미처분이익잉여금세가 없습니다.',
      },
      {
        q: '은행 계좌 개설이 어렵다고 들었는데 사실인가요?',
        a: '대만은 자금세탁 방지로 은행 계좌 개설이 점점 엄격해지고 있습니다. 많은 은행이 임대계약서를 검토하고 회사 주소지를 실사합니다. 거류증이 없어도 이민서에서 기본자료표를 발급받아 계좌 개설이 가능합니다.',
      },
      {
        q: '법인설립에 보통 얼마나 걸리나요?',
        a: '회사 설립에 약 3개월, 설립 후 취업허가증과 거류증 취득에 약 1개월이 소요되는 것이 일반적입니다. 점포 임대 계약 시작일은 가능한 늦게 잡는 것이 안전합니다.',
      },
      {
        q: '대만 법인설립 절차는 어떻게 되나요?',
        a: '투심회 승인, 사명 예심·공증, 설립·세적 등기, 정식 계좌 개설 순으로 진행됩니다.',
      },
    ],
    relatedHeading: '관련 칼럼',
    relatedColumns: relatedColumnsKo,
    relatedResourcesHeading: '관련 안내',
    relatedResources: [
      { href: 'korean-lawyer-in-taiwan', label: '한국어 가능한 대만 변호사' },
      { href: 'taiwan-company-setup-lawyer', label: '대만 법인설립·회사설립 변호사 안내' },
      { href: 'taiwan-lawyer', label: '대만 변호사 검색 가이드' },
      { href: 'services/investment', label: '대만 투자·회사설립 관련 서비스' },
    ],
    ctaTitle: '사안에 맞는 설립 방향을 정리하려면',
    ctaText:
      '업종·자본금·비자 필요 여부에 따라 자회사·지사·연락사무소 중 선택이 달라집니다. 자료를 보내주시면 증준외 대만 변호사와 연결되는 상담 흐름을 안내해 드립니다.',
    ctaButton: '상담 문의',
  },
  'zh-hant': {
    title: '台灣公司設立完整指南',
    metaTitle: '台灣公司設立流程·費用總整理 (2026) | 昊鼎國際法律事務所',
    description:
      '以韓語整理台灣公司設立流程（投審會核准→公司名稱預查→設立登記→稅籍登記→銀行開戶）、主體比較（子公司·分公司·辦事處）、費用與時間、常見問題的完整指南。',
    keywords: [
      '台灣公司設立',
      '台灣公司設立流程',
      '台灣公司設立費用',
      '投資審議委員會',
      '台灣子公司',
      '台灣分公司',
    ],
    heroLabel: 'COMPLETE GUIDE',
    summary: [
      '台灣公司設立本身沒有最低資本額限制，一元新台幣亦可設立；但代表人需要工作許可與居留證時，單一股東須至少投資新台幣50萬元。',
      '公司設立約需3個月，設立後申請工作許可與居留證約需1個月，為一般情形。',
      '核心流程為：投資審議委員會（投審會）投資核准 → 公司名稱預查與授權書公證 → 設立登記 → 稅籍登記 → 銀行正式帳戶開立。',
    ],
    procedureHeading: '台灣公司設立流程（5階段）',
    procedureIntro:
      '下列5階段為台灣公司設立的核心流程。各階段的細節文件與時程因個案而異。',
    steps: [
      {
        name: '投資審議委員會（投審會）投資核准',
        text: '外國人須向投資審議委員會提交投資計畫書接受審查。投審會會確認資本額確實用於投資，核准後須於1年內匯入資本額。',
      },
      {
        name: '公司名稱預查與授權書公證',
        text: '申請公司中文名稱預查，並辦理授權書的認證與公證。可同時尋找公司登記地址，以縮短作業時間。',
      },
      {
        name: '設立登記（資本匯入·查核·公司登記）',
        text: '開立公司籌備帳戶並匯入資本額，經資本額查核後向經濟部辦理公司登記。自韓國銀行匯款須由本人親自辦理並完成海外直接投資申報。',
      },
      {
        name: '稅籍登記',
        text: '完成公司登記後辦理稅籍登記。公司須每2個月申報營業稅5%，並於每年5月申報前一年度營利事業所得稅20%。',
      },
      {
        name: '銀行正式帳戶開立',
        text: '取得公司登記文件後，負責人至銀行將籌備帳戶轉為正式帳戶。因防制洗錢，開戶審查趨嚴，銀行會審閱租約並實地查訪。',
      },
    ],
    comparisonHeading: '主體比較（子公司·分公司·辦事處）',
    comparisonIntro:
      '來台型態分為子公司（股份有限公司·有限公司）、分公司、辦事處，稅負、法律責任與上市資格各不相同。',
    comparisonColumns: ['項目', '子公司（股份有限公司·有限公司）', '分公司', '辦事處'],
    comparisonRows: [
      { form: '法人格', values: ['有（獨立法人）', '無（僅營業資格）', '無'] },
      { form: '營業稅', values: ['5%', '5%', '不適用'] },
      { form: '營利事業所得稅', values: ['20%', '20%', '不適用'] },
      { form: '股利外國人就源扣繳', values: ['21%', '無', '不適用'] },
      { form: '未分配盈餘稅', values: ['5%', '無', '不適用'] },
      { form: '合資（他人參股）', values: ['可以', '不可（韓國母公司100%）', '不可'] },
      { form: '在台上市', values: ['可以（股份有限公司）', '不可', '不可'] },
      { form: '研發投資抵減', values: ['最高30%', '無', '無'] },
    ],
    costHeading: '費用與時間摘要',
    costIntro:
      '以下數值為本所專欄公開之一般要件、稅率與時程整理。實際費用因行業、資本額與代辦費用而異。',
    costColumns: ['項目', '內容'],
    costRows: [
      { item: '最低資本額（設立本身）', values: ['無法定最低（1元新台幣亦可）'] },
      { item: '工作許可·居留證所需資本額', values: ['單一股東至少新台幣50萬元（有台灣合夥人則約17萬元）'] },
      { item: '設立所需時間', values: ['約3個月'] },
      { item: '工作許可·居留證所需時間', values: ['約1個月'] },
      { item: '營業稅', values: ['5%（每2個月申報）'] },
      { item: '營利事業所得稅', values: ['20%（每年）'] },
      { item: '韓台避免雙重課稅協定', values: ['2023.12.2生效。非固定營業場所營業利潤免稅，股利上限稅率10%'] },
    ],
    faqHeading: '常見問題',
    faq: [
      {
        q: '台灣公司設立有最低資本額嗎？',
        a: '公司設立本身沒有最低資本額限制，1元新台幣亦可設立。但代表人需要工作許可與居留證時，單一股東須至少投資新台幣50萬元，有台灣合夥人時為其三分之一（約17萬元），且公司年營業額須超過新台幣300萬元。',
      },
      {
        q: '設立公司後可以取得台灣居留資格嗎？',
        a: '可以。投資人需在台管理營運公司時，可向勞動部申請外國人工作許可，取得後再向移民署申請居留證。工作許可期間為1~3年，與居留證有效期一致。',
      },
      {
        q: '子公司與分公司的稅負差異為何？',
        a: '兩者營業稅5%與營利事業所得稅20%相同。子公司分配盈餘時須另扣21%外國人就源扣繳，不分派則加計5%未分配盈餘稅；分公司將盈餘匯回母公司則無額外稅負與未分配盈餘稅。',
      },
      {
        q: '聽說銀行開戶很困難，是真的嗎？',
        a: '台灣因防制洗錢，銀行開戶審查日益嚴格。多數銀行會審閱租約並實地查訪公司地址。即使沒有居留證，也可向移民署申請「統一證號基本資料表」辦理開戶。',
      },
      {
        q: '設立通常需要多久？',
        a: '公司設立約需3個月，設立後申請工作許可與居留證約需1個月，為一般情形。營業場所租約起租日建議盡量延後，較為穩妥。',
      },
    ],
    relatedHeading: '相關專欄',
    relatedColumns: relatedColumnsKo,
    relatedResourcesHeading: '相關指南',
    relatedResources: [
      { href: 'korean-lawyer-in-taiwan', label: '可使用韓語溝通的台灣律師' },
      { href: 'taiwan-company-setup-lawyer', label: '台灣公司設立律師指南' },
      { href: 'taiwan-lawyer', label: '台灣律師搜尋指南' },
      { href: 'services/investment', label: '台灣投資與公司設立服務' },
    ],
    ctaTitle: '想釐清最適的設立架構',
    ctaText:
      '依行業、資本額與是否需要居留證，子公司、分公司與辦事處的選擇會不同。提供資料後，我們可安排與曾俊瑋律師的諮詢流程。',
    ctaButton: '聯絡諮詢',
  },
  en: {
    title: 'Complete Guide to Setting Up a Company in Taiwan',
    metaTitle: 'Taiwan Company Setup: Process, Cost & Timeline (2026) | Hovering International Law Firm',
    description:
      'A complete English guide to setting up a company in Taiwan: Investment Commission approval, name pre-check, company & tax registration, bank account opening, entity comparison (subsidiary, branch, liaison office), cost and timeline, and FAQs.',
    keywords: [
      'Taiwan company setup',
      'Taiwan company registration',
      'Taiwan subsidiary',
      'Taiwan branch office',
      'Taiwan Investment Commission',
      'set up company in Taiwan cost',
    ],
    heroLabel: 'COMPLETE GUIDE',
    summary: [
      'Taiwan company formation has no statutory minimum capital — even 1 TWD is possible — but a representative who needs a work permit and residence card must invest at least TWD 500,000 as a sole shareholder.',
      'Company setup typically takes about 3 months, with an additional month for the work permit and residence card after incorporation.',
      'The core flow is: Investment Commission approval → company name pre-check and power of attorney notarization → incorporation registration → tax registration → formal bank account opening.',
    ],
    procedureHeading: 'Taiwan Company Setup Process (5 Steps)',
    procedureIntro:
      'The five steps below summarize the core flow of setting up a company in Taiwan. Detailed documents and timelines vary by case.',
    steps: [
      {
        name: 'Investment Commission (投審會) approval',
        text: 'Foreign investors must file an investment plan with the Investment Commission for review. The Commission verifies that the capital is genuinely used for investment; after approval, capital must be remitted within one year.',
      },
      {
        name: 'Company name pre-check and power of attorney notarization',
        text: 'Apply to reserve the Chinese company name and complete authentication and notarization of the power of attorney. Searching for a registered office address in parallel saves time.',
      },
      {
        name: 'Incorporation registration (capital remittance, audit, registration)',
        text: 'Open a preparatory bank account, remit the capital, pass a capital audit, then file incorporation with the Ministry of Economic Affairs. Remitting from a Korean bank requires in-person transfer by the investor and an overseas direct investment report.',
      },
      {
        name: 'Tax registration',
        text: 'After incorporation, complete tax registration. The company files business tax (VAT) of 5% every two months and profit-seeking enterprise income tax of 20% each May for the prior year.',
      },
      {
        name: 'Formal bank account opening',
        text: 'Once incorporation documents are issued, the responsible person converts the preparatory account into a formal account at the bank. Anti-money-laundering rules make account opening strict; banks review lease agreements and conduct site visits.',
      },
    ],
    comparisonHeading: 'Entity Comparison (Subsidiary, Branch, Liaison Office)',
    comparisonIntro:
      'Taiwan entry takes three main forms: subsidiary (company limited by shares / limited company), branch, and liaison office. Tax exposure, legal liability, and listing eligibility differ.',
    comparisonColumns: ['Item', 'Subsidiary (Co., Ltd. / Ltd.)', 'Branch', 'Liaison Office'],
    comparisonRows: [
      { form: 'Legal personality', values: ['Yes (independent entity)', 'No (business capacity only)', 'No'] },
      { form: 'Business tax (VAT)', values: ['5%', '5%', 'N/A'] },
      { form: 'Corporate income tax', values: ['20%', '20%', 'N/A'] },
      { form: 'Dividend withholding (foreign)', values: ['21%', 'None', 'N/A'] },
      { form: 'Undistributed-earnings tax', values: ['5%', 'None', 'N/A'] },
      { form: 'Joint venture (others as shareholders)', values: ['Allowed', 'Not allowed (Korean HQ 100%)', 'Not allowed'] },
      { form: 'Listing in Taiwan', values: ['Allowed (Co., Ltd.)', 'Not allowed', 'Not allowed'] },
      { form: 'R&D tax credit', values: ['Up to 30%', 'None', 'None'] },
    ],
    costHeading: 'Cost and Timeline Summary',
    costIntro:
      'The figures below summarize the general requirements, tax rates, and timelines published in our columns. Actual costs vary by industry, capital, and professional fees.',
    costColumns: ['Item', 'Detail'],
    costRows: [
      { item: 'Minimum capital (formation itself)', values: ['No statutory minimum (1 TWD possible)'] },
      { item: 'Capital for work permit / residence card', values: ['Sole shareholder at least TWD 500,000 (about TWD 170,000 with a Taiwanese partner)'] },
      { item: 'Formation duration', values: ['About 3 months'] },
      { item: 'Work permit / residence card duration', values: ['About 1 month'] },
      { item: 'Business tax (VAT)', values: ['5% (filed every 2 months)'] },
      { item: 'Corporate income tax', values: ['20% (annual)'] },
      { item: 'Korea–Taiwan double-taxation agreement', values: ['Effective 2023-12-02. Business profits tax-exempt without a fixed PE; dividend cap rate 10%'] },
    ],
    faqHeading: 'Frequently Asked Questions',
    faq: [
      {
        q: 'Is there a minimum capital to set up a company in Taiwan?',
        a: 'Company formation itself has no minimum capital requirement — even 1 TWD is possible. However, if the representative needs a work permit and residence card, a sole shareholder must invest at least TWD 500,000 (about TWD 170,000 with a Taiwanese partner), and the company’s annual revenue must exceed TWD 3,000,000.',
      },
      {
        q: 'Can setting up a company lead to a Taiwan residence card?',
        a: 'Yes. When the investor must manage and operate the company in Taiwan, they may apply to the Ministry of Labor for a foreign work permit, then to the immigration agency for a residence card. Work permits are granted for 1–3 years, matching the residence card validity.',
      },
      {
        q: 'What is the tax difference between a subsidiary and a branch?',
        a: 'Both pay 5% business tax and 20% corporate income tax. A subsidiary adds 21% foreign-shareholder withholding on distributed dividends and a 5% undistributed-earnings tax if profits are retained. A branch remits profits to the head office with no extra tax and no undistributed-earnings tax.',
      },
      {
        q: 'Is bank account opening really difficult?',
        a: 'Anti-money-laundering rules have made Taiwan banks stricter about opening accounts. Most banks review the lease and conduct a site visit to the registered address. Without a residence card, you can obtain a "Unified Number Basic Data Form" from the immigration agency to open an account.',
      },
      {
        q: 'How long does setup usually take?',
        a: 'Company formation typically takes about 3 months, plus about one more month for the work permit and residence card. It is safest to set the lease start date for your premises as late as possible.',
      },
    ],
    relatedHeading: 'Related Columns',
    relatedColumns: relatedColumnsKo,
    relatedResourcesHeading: 'Related Guides',
    relatedResources: [
      { href: 'korean-lawyer-in-taiwan', label: 'Korean-speaking Taiwan lawyer' },
      { href: 'taiwan-company-setup-lawyer', label: 'Taiwan company setup lawyer guide' },
      { href: 'taiwan-lawyer', label: 'Taiwan lawyer search guide' },
      { href: 'services/investment', label: 'Taiwan investment and company setup services' },
    ],
    ctaTitle: 'Clarify the right setup structure for your case',
    ctaText:
      'The choice between a subsidiary, branch, and liaison office depends on industry, capital, and whether you need a residence card. Share your materials and we will arrange a consultation flow with Attorney Wei Tseng.',
    ctaButton: 'Book Consultation',
  },
};
