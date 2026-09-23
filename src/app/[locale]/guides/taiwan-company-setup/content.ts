import type { SiteLocale } from '@/lib/locales';

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
  lawyerLink?: { href: string; label: string };
  planHeading?: string;
  planIntro?: string;
  planQuestions?: string[];
  prepareHeading?: string;
  prepareIntro?: string;
  prepareItems?: string[];
  separateReviewHeading?: string;
  separateReviewItems?: Array<{ title: string; text: string }>;
  countrySpecificHeading?: string;
  countrySpecificIntro?: string;
  countrySpecificItems?: Array<{ title: string; text: string }>;
};

const relatedColumnsKo = [
  { slug: 'taiwan-company-establishment-basics', title: '대만 회사설립 -기초편-' },
  { slug: 'taiwan-company-establishment-advanced-1', title: '대만 회사설립 -심화편-1' },
  { slug: 'taiwan-company-establishment-advanced-2', title: '대만 회사설립 -심화편-2' },
  { slug: 'taiwan-company-subsidiary-vs-branch', title: '대만 회사설립 자회사 VS 지사' },
];

const relatedColumnsJa = [
  { slug: 'taiwan-company-establishment-basics', title: '台湾会社設立 -基礎編-' },
  { slug: 'taiwan-company-establishment-advanced-1', title: '台湾会社設立 -応用編-1' },
  { slug: 'taiwan-company-establishment-advanced-2', title: '台湾会社設立 -応用編-2' },
  { slug: 'taiwan-company-subsidiary-vs-branch', title: '台湾会社設立 子会社 VS 支店' },
];

// en·zh 제목은 해당 칼럼 원문(src/content/columns-en|columns-zh) front matter title 그대로 사용
const relatedColumnsEn = [
  {
    slug: 'taiwan-company-establishment-basics',
    title: 'Setting Up a Company in Taiwan: Subsidiaries, Branches, Representative Offices, Procedures, and Work Permits',
  },
  {
    slug: 'taiwan-company-establishment-advanced-1',
    title: 'Taiwan Company Formation: Practical Q&A on Addresses, Bank Accounts, and Investment Review',
  },
  {
    slug: 'taiwan-company-establishment-advanced-2',
    title: 'Taiwan Company Formation: Capital Remittance, Banking, and Foreign Hiring',
  },
  {
    slug: 'taiwan-company-subsidiary-vs-branch',
    title: 'Entering the Taiwan Market: Key Differences Between a Subsidiary and a Branch',
  },
];

const relatedColumnsZh = [
  { slug: 'taiwan-company-establishment-basics', title: '台灣公司設立基礎：子公司、分公司、代表人辦事處、設立程序與工作許可' },
  { slug: 'taiwan-company-establishment-advanced-1', title: '台灣公司設立：地址、銀行帳戶與審查實務Q&A' },
  { slug: 'taiwan-company-establishment-advanced-2', title: '台灣公司設立：資本金匯款、銀行帳戶與外國人聘僱實務Q&A' },
  { slug: 'taiwan-company-subsidiary-vs-branch', title: '進入台灣市場：子公司與分公司的差異' },
];

export const guideContent: Record<SiteLocale, GuideContent> = {
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
    planHeading: '사업 계획부터 정리하기',
    planIntro:
      '대만 법인설립 정보는 형태 선택·준비자료·검토 질문을 정리하기 위한 안내입니다. 실제 수임·상담 절차는 아래 의뢰 페이지에서 확인하세요.',
    planQuestions: [
      '대만에서 할 활동은 판매, 계약, 제조, 연락 업무 중 무엇인가요?',
      '투자자 또는 한국 본사는 어디이며, 자금은 어느 나라에서 송금하나요?',
      '대만에서 계약을 체결하고 매출을 받을 주체는 누구인가요?',
      '직원이 대만에서 근무하며 취업허가나 거류가 필요한가요?',
      '이미 정해 둔 주소, 업종, 일정이 있나요?',
    ],
    lawyerLink: {
      href: '/ko/taiwan-company-setup-lawyer',
      label: '대만 회사설립 법률 상담 문의',
    },
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
    // 출처: MOF 영문 안내(2026-09-18 확인) — 2023-12-27 발효, 2024-01-01 적용. https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10
    costRows: [
      { item: '최소 자본금(설립 자체)', values: ['법정 최소 없음 (1대만 달러 가능)'] },
      { item: '취업허가증·거류증용 자본금', values: ['단일 주주 최소 50만 대만 달러 (대만 파트너 있으면 약 17만 대만 달러)'] },
      { item: '설립 소요 기간', values: ['약 3개월'] },
      { item: '취업허가증·거류증 소요 기간', values: ['약 1개월'] },
      { item: '영업세', values: ['5% (2개월마다 신고)'] },
      { item: '법인세', values: ['20% (연간)'] },
      { item: '한국-대만 이중과세 약정', values: ['2023.12.27 발효, 2024.1.1부터 적용. 고정 사업장이 아니면 영업이익 면세, 배당금 상한세율 10%'] },
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
      '以中文整理台灣公司設立流程（投審會核准→公司名稱預查→設立登記→稅籍登記→銀行開戶）、主體比較（子公司·分公司·辦事處）、費用與時間、常見問題。本頁同時說明台灣本地企業與外國投資人應分開檢視的事項。',
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
    planHeading: '先整理事業計畫',
    planIntro:
      '本頁是資訊指南，協助台灣本地企業與外國投資人分別確認型態選擇、準備資料與審查問題。實際委任與諮詢流程請見法律諮詢頁。',
    planQuestions: [
      '在台灣實際進行的活動是銷售、締約、製造、聯絡，或混合型？',
      '出資或控制台灣據點的是台灣本地股東，還是外國投資人？資金預計從哪一國匯入？',
      '誰在台灣簽約並收取營收？',
      '是否有人員在台灣工作，是否需要工作許可或居留？',
      '是否已有預定地址、業種或時程？',
    ],
    lawyerLink: {
      href: '/zh-hant/taiwan-company-setup-lawyer',
      label: '台灣公司設立法律諮詢',
    },
    countrySpecificHeading: '國家或投資人身分別注意事項',
    countrySpecificIntro:
      '下列說明只適用標題所指的國家或身分，不是每一位中文讀者的預設規則。',
    countrySpecificItems: [
      {
        title: '韓國：匯款與海外直接投資申報',
        text: '若資金由韓國銀行匯出，公開專欄記載本人臨櫃匯款與海外直接投資申報，常是韓國投資人需要另行確認的事項。這不是所有外國投資人的共通匯款規則。',
      },
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
        text: '開立公司籌備帳戶並匯入資本額，經資本額查核後向經濟部辦理公司登記。匯款地國與往來銀行的手續應在資金移動前個別確認；韓國銀行匯款的臨櫃與申報要求見後述國家注意事項。',
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
      { form: '合資（他人參股）', values: ['可以', '不可（外國總公司100%）', '不可'] },
      { form: '在台上市', values: ['可以（股份有限公司）', '不可', '不可'] },
      { form: '研發投資抵減', values: ['最高30%', '無', '無'] },
    ],
    costHeading: '費用與時間摘要',
    costIntro:
      '以下數值為本所專欄公開之一般要件、稅率與時程整理。實際費用因行業、資本額與代辦費用而異。',
    costColumns: ['項目', '內容'],
    // 출처: MOF 영문 안내(2026-09-18 확인) — 2023-12-27 발효, 2024-01-01 적용. https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10
    costRows: [
      { item: '最低資本額（設立本身）', values: ['無法定最低（1元新台幣亦可）'] },
      { item: '工作許可·居留證所需資本額', values: ['單一股東至少新台幣50萬元（有台灣合夥人則約17萬元）'] },
      { item: '設立所需時間', values: ['約3個月'] },
      { item: '工作許可·居留證所需時間', values: ['約1個月'] },
      { item: '營業稅', values: ['5%（每2個月申報）'] },
      { item: '營利事業所得稅', values: ['20%（每年）'] },
      { item: '韓台避免雙重課稅協定', values: ['2023.12.27生效，自2024.1.1起適用。非固定營業場所營業利潤免稅，股利上限稅率10%'] },
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
    relatedColumns: relatedColumnsZh,
    relatedResourcesHeading: '相關指南',
    relatedResources: [
      { href: 'korean-lawyer-in-taiwan', label: '可使用韓語溝通的台灣律師' },
      { href: 'taiwan-company-setup-lawyer', label: '台灣公司設立律師指南' },
      { href: 'taiwan-lawyer', label: '台灣律師搜尋指南' },
      { href: 'services/investment', label: '台灣投資與公司設立服務' },
    ],
    ctaTitle: '想釐清最適的設立架構',
    ctaText:
      '依行業、資本額與是否需要居留證，子公司、分公司與辦事處的選擇會不同。提供資料後，我們可安排與曾雋崴律師的諮詢流程。',
    ctaButton: '聯絡諮詢',
  },
  en: {
    title: 'How to Set Up a Company in Taiwan: A Guide for Overseas Businesses',
    metaTitle: 'Taiwan Company Setup Guide for Foreign Firms',
    description:
      'Understand the decisions, documents and legal checks involved in planning a Taiwan company, branch or representative office.',
    keywords: [
      'Taiwan company setup',
      'Taiwan company registration',
      'Taiwan subsidiary',
      'Taiwan branch office',
      'Taiwan Investment Commission',
      'set up company in Taiwan cost',
    ],
    heroLabel: 'INFORMATION GUIDE',
    summary: [
      'This guide is for overseas companies and investors who need to understand Taiwan company, branch, and representative-office options before asking the firm to handle a filing.',
      'The right structure depends on who will invest, who will contract in Taiwan, and what the local team will actually do. Those facts are not the same for every nationality.',
      'Company registration, foreign-investment review, banking, tax, permits, hiring, and residence are related but separate reviews. Completing one step does not finish the others.',
    ],
    planHeading: 'Start with Your Business Plan',
    planIntro:
      'Planning a Taiwan business starts with understanding how it will operate, who will invest, and what the local team will do. The questions below are a preparation aid, not a legal test that every investor must pass in the same way.',
    planQuestions: [
      'What activity will take place in Taiwan: sales, contracting, manufacturing, liaison, or a mix?',
      'Who will own or control the Taiwan presence, and from which country are funds expected to come?',
      'Who will sign contracts and receive revenue in Taiwan?',
      'Will staff work in Taiwan, and will any of them need work permission or residence?',
      'Is there a preferred address, industry, or timeline already in view?',
    ],
    procedureHeading: 'Understand the Formation Process',
    procedureIntro:
      'The outline below is a conditional overview of tasks that often arise when a foreign investor forms a Taiwan company. It is not a single sequence, duration, or document list that applies to every structure or nationality.',
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
        text: 'Open a preparatory bank account, remit the capital, pass a capital audit, then file incorporation with the Ministry of Economic Affairs. How funds may be remitted depends on the investor’s bank and home-country rules; those rules should be checked before money is moved.',
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
    comparisonHeading: 'Compare a Company, Branch and Representative Office',
    comparisonIntro:
      'Taiwan entry is often compared across a company (limited company or company limited by shares), a branch of the foreign company, and a representative office. Tax exposure, legal personality, and permitted activity differ, and the comparison below is a starting map rather than advice for a specific investor.',
    comparisonColumns: ['Item', 'Subsidiary (Co., Ltd. / Ltd.)', 'Branch', 'Liaison Office'],
    comparisonRows: [
      { form: 'Legal personality', values: ['Yes (independent entity)', 'No (business capacity only)', 'No'] },
      { form: 'Business tax (VAT)', values: ['5%', '5%', 'N/A'] },
      { form: 'Corporate income tax', values: ['20%', '20%', 'N/A'] },
      { form: 'Dividend withholding (foreign)', values: ['21%', 'None', 'N/A'] },
      { form: 'Undistributed-earnings tax', values: ['5%', 'None', 'N/A'] },
      { form: 'Joint venture (others as shareholders)', values: ['Allowed', 'Not allowed (a branch has no shareholders)', 'Not allowed'] },
      { form: 'Listing in Taiwan', values: ['Allowed (Co., Ltd.)', 'Not allowed', 'Not allowed'] },
      { form: 'R&D tax credit', values: ['Up to 30%', 'None', 'None'] },
    ],
    costHeading: 'Figures already published in our columns',
    costIntro:
      'The figures below are restated from existing public columns as general information. They are not a quote, a guaranteed timeline, or a rule that applies to every investor or nationality. Attorney review is required before relying on any figure for a specific plan.',
    costColumns: ['Item', 'Detail'],
    // 출처: MOF 영문 안내(2026-09-18 확인) — 2023-12-27 발효, 2024-01-01 적용. https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10
    costRows: [
      { item: 'Minimum capital (formation itself)', values: ['No statutory minimum (1 TWD possible)'] },
      { item: 'Capital for work permit / residence card', values: ['Sole shareholder at least TWD 500,000 (about TWD 170,000 with a Taiwanese partner)'] },
      { item: 'Formation duration', values: ['About 3 months'] },
      { item: 'Work permit / residence card duration', values: ['About 1 month'] },
      { item: 'Business tax (VAT)', values: ['5% (filed every 2 months)'] },
      { item: 'Corporate income tax', values: ['20% (annual)'] },
      { item: 'Korea-specific tax agreement', values: ['See the country-specific section below. The Taiwan–Korea income tax agreement is not a worldwide investor rule.'] },
    ],
    prepareHeading: 'Prepare the Information and Documents',
    prepareIntro:
      'The items below help an overseas team brief the firm. They are not a complete statutory list, and originals or sensitive identity and banking files should wait for later instructions.',
    prepareItems: [
      'A short description of the planned Taiwan activity and who will own or control it',
      'The investor’s country of organisation and any existing group structure',
      'Whether a Taiwan address, industry, or hiring plan is already in view',
      'Any deadline already driving the project',
    ],
    separateReviewHeading: 'Review Banking, Permits and Staffing Separately',
    separateReviewItems: [
      {
        title: 'Banking',
        text: 'Opening or converting a company account is a bank process. It is not completed by company registration alone, and the documents a bank asks for can differ from the company-registry file.',
      },
      {
        title: 'Permits and the business activity',
        text: 'The registered business item and the premises should be checked against the activity you actually intend to carry on. Some industries need a separate licence.',
      },
      {
        title: 'Staffing and residence',
        text: 'Work permission and residence are separate from forming a company. Whether a manager or investor can work in Taiwan depends on the role and the applicable criteria, not on registration by itself.',
      },
    ],
    countrySpecificHeading: 'Country-Specific Considerations',
    countrySpecificIntro:
      'The notes below apply only to the country named in the heading. They are not restated as rules for every overseas investor.',
    countrySpecificItems: [
      {
        title: 'Korea: remittance and outbound-investment reporting',
        text: 'Where funds would be remitted from a Korean bank, existing public columns describe in-person remittance and outbound direct-investment reporting as issues that Korean investors often have to check. That description is Korea-specific and is not a worldwide remittance rule.',
      },
      {
        title: 'Korea: Taiwan–Korea income tax agreement',
        text: 'Existing public columns record that the Taiwan–Korea Income Tax Agreement entered into force on 27 December 2023 and applies from 1 January 2024, and discuss PE analysis and a 10% maximum source-country rate for qualifying dividends, interest, and royalties. Those treaty points apply only when the agreement’s conditions are met for a Korean-related fact pattern. Other nationalities require a separate review.',
      },
    ],
    faqHeading: 'Questions from Overseas Businesses',
    faq: [
      {
        q: 'How should we compare a company, a branch, and a representative office?',
        a: 'Compare who will contract, who will bear liabilities, what activity is actually planned, and how profits would be taken out. The table on this page is a starting map. It is not a recommendation of one form for every investor.',
      },
      {
        q: 'What should an overseas head office organise before the first discussion?',
        a: 'A short outline of the planned Taiwan activity, the investor or parent, any deadline, and the preferred contact language is usually enough to start. Identity documents and bank records can wait until the firm asks for them.',
      },
      {
        q: 'Why review the business activity and address separately from company registration?',
        a: 'Name reservation or company registration does not, by itself, confirm that the intended activity may be carried on at the intended premises. Industry permits and address rules are separate checks.',
      },
      {
        q: 'When should banking, hiring, and residence be reviewed?',
        a: 'They should be reviewed as their own topics, not assumed to finish on the same day as company registration. The sequence depends on the structure, the bank, and whether anyone will work in Taiwan.',
      },
      {
        q: 'What should we send when contacting the firm?',
        a: 'Send a brief business outline, the Taiwan connection, and any deadline. Do not attach passports, account numbers, or other sensitive files in the first email.',
      },
    ],
    relatedHeading: 'Related Columns',
    relatedColumns: relatedColumnsEn,
    relatedResourcesHeading: 'Related Guides',
    relatedResources: [
      { href: 'lawyers/wei-tseng', label: 'Attorney Wei Tseng profile' },
      { href: 'taiwan-company-setup-lawyer', label: 'Discuss Your Taiwan Company Setup' },
      { href: 'taiwan-lawyer', label: 'Taiwan lawyer search guide' },
      { href: 'services/investment', label: 'Taiwan investment and company setup services' },
    ],
    ctaTitle: 'Discuss Your Taiwan Business Plan',
    ctaText:
      'If you already know the business plan you want reviewed, continue to the company-formation legal-services page. Attorney Wei Tseng reviews the first enquiry; it is not a retainer.',
    ctaButton: 'Discuss Your Taiwan Company Setup',
    lawyerLink: {
      href: '/en/taiwan-company-setup-lawyer',
      label: 'Discuss Your Taiwan Company Setup',
    },
  },
  ja: {
    title: '台湾法人設立（会社設立）総合ガイド',
    metaTitle: '台湾法人設立・会社設立の手続き・費用まとめ (2026) | 昊鼎国際法律事務所',
    description:
      '台湾法人設立（会社設立）の手続き（経済部投資審議司（旧・投資審議委員会）の承認→社名予備審査→設立登記→税務登記→口座開設）、法人形態の比較（子会社・支店・代表者事務所（いわゆる駐在員事務所））、費用・期間、よくある質問まで日本語でまとめた総合ガイドです。',
    keywords: [
      '台湾会社設立',
      '台湾法人設立',
      '台湾会社設立費用',
      '台湾会社設立手続き',
      '台湾投資審議委員会',
      '台湾子会社',
      '台湾支店',
    ],
    heroLabel: 'COMPLETE GUIDE',
    summary: [
      '台湾法人設立の手続きは、投資審議司の承認、社名予備審査・公証、設立・税務登記、正式口座開設の順で進みます。',
      '台湾の会社設立自体に最低資本金の制限はなく1新台湾ドル（NT$）でも可能ですが、代表者の就業許可証・居留証が必要な場合は、単一株主基準で最低NT$50万の資本金が必要です。',
      '会社設立に約3ヶ月、設立後の就業許可証・居留証の取得に約1ヶ月かかるのが一般的です。',
      '核心手続きは、投資審議司の投資承認 → 社名予備審査・委任状公証 → 設立登記 → 税務登記 → 銀行正式口座開設の流れで進みます。',
    ],
    planHeading: '事業計画から整理する',
    planIntro:
      'このページは、進出形態、準備資料、手続の確認事項を理解するための情報ガイドです。委任や相談の進め方は、会社設立の法律相談ページで別途案内します。',
    planQuestions: [
      '台湾で行う活動は、販売、契約、製造、連絡業務、またはその組合せか。',
      '出資者または親会社はどこにあり、資金はどの国・地域から送金する見込みか。',
      '台湾で契約を締結し、売上を受け取る主体は誰か。',
      '台湾で勤務する人員はいるか。就業許可や居留が必要か。',
      '既に予定している住所、業種、期限はあるか。',
    ],
    lawyerLink: {
      href: '/ja/taiwan-company-setup-lawyer',
      label: '台湾の会社設立・進出に関する法律相談',
    },
    countrySpecificHeading: '国・地域別の例外',
    countrySpecificIntro: '以下は見出しに示した国に関する説明です。',
    countrySpecificItems: [
      {
        title: '韓国：送金と海外直接投資申告',
        text: '資金を韓国の銀行から送金する場合、公開コラムでは本人の窓口手続と海外直接投資申告が問題になり得ると説明しています。これは韓国に関する例外であり、日本を含む他の国の送金規則に置き換えたものではありません。',
      },
      {
        title: '韓国：台湾・韓国所得税協定',
        text: '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。配当・利子・使用料の源泉地国上限税率10％や恒久的施設の検討は、協定の要件を満たす韓国関連の事実関係に限ります。',
      },
    ],
    procedureHeading: '台湾法人設立の手続き（5段階）',
    procedureIntro:
      '以下の5段階は台湾法人設立の核心的な流れをまとめたものです。各段階の詳細書類とスケジュールは案件によって異なる場合があります。',
    steps: [
      {
        name: '投資審議司の投資承認',
        text: '外国人は台湾の投資審議司に投資計画書を提出して審査を受ける必要があります。投資審議司は資本金が実際の投資用途に使われるかを確認し、承認後1年以内に資本金を送金しなければなりません。',
      },
      {
        name: '社名予備審査と委任状の公証',
        text: '会社の中国語名称を検索・申請し、台湾弁護士などへの委任状の認証・公証を行います。投資計画の審査と並行して会社登記住所を探すと時間を短縮できます。',
      },
      {
        name: '設立登記（資本金送金・監査・法人登記）',
        text: '会社の準備口座を開設して資本金を送金し、資本金監査を経て経済部に法人登記を完了します。送金元の国・地域の手続と利用銀行の取扱いは、資金を動かす前に個別に確認します。韓国の銀行から送金する場合の本人来店や海外直接投資申告は、後述の国別例外を参照してください。',
      },
      {
        name: '税務登記',
        text: '法人登記後に税務登記を行います。会社は営業税（付加価値税）5%を2ヶ月ごとに申告し、毎年5月に前年度の営利事業所得税（法人税）20%を申告します。',
      },
      {
        name: '銀行の正式口座開設',
        text: '法人登記書類を受け取った後、責任者が銀行で準備口座を正式口座に切り替えます。マネーロンダリング防止のため口座開設が厳格化されており、賃貸契約書の審査・実地調査が行われ、銀行によってはインターネットバンキングに追加条件がある場合があります。',
      },
    ],
    comparisonHeading: '法人形態の比較（子会社・支店・代表者事務所）',
    comparisonIntro:
      '台湾進出の形態は大きく子会社（株式会社・有限公司）、支店、代表者事務所に分かれます。税金・法的責任・上場の可否が異なります。',
    comparisonColumns: ['項目', '子会社（株式会社・有限公司）', '支店', '代表者事務所'],
    comparisonRows: [
      { form: '法人格', values: ['あり（独立法人）', 'なし（営業資格のみ）', 'なし'] },
      { form: '営業税（付加価値税）', values: ['5%', '5%', '該当なし'] },
      { form: '法人税', values: ['20%', '20%', '該当なし'] },
      { form: '配当金の外国人所得税', values: ['21%', 'なし', '該当なし'] },
      { form: '未処分利益留保金税', values: ['5%', 'なし', '該当なし'] },
      { form: '合弁（第三者の持分参加）', values: ['可能', '不可（支店に株主はいない）', '不可'] },
      { form: '台湾での上場', values: ['可能（株式会社）', '不可', '不可'] },
      { form: 'R&D税額控除', values: ['最大30%', 'なし', 'なし'] },
    ],
    costHeading: '費用・期間まとめ',
    costIntro:
      '以下の数値は当事務所のコラムに公開された一般的な要件・税率・期間をまとめたものです。実際の費用は業種・資本金・代行手数料によって異なります。',
    costColumns: ['項目', '内容'],
    // 출처: MOF 영문 안내(2026-09-18 확인) — 2023-12-27 발효, 2024-01-01 적용. https://www.mof.gov.tw/eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=e1e57a4211474ff9b5d63a83b30dcf10
    costRows: [
      { item: '最低資本金（設立自体）', values: ['法定最低額なし（NT$1でも可能）'] },
      { item: '就業許可証・居留証用の資本金', values: ['単一株主で最低NT$50万（台湾パートナーがいる場合は約NT$17万）'] },
      { item: '設立にかかる期間', values: ['約3ヶ月'] },
      { item: '就業許可証・居留証にかかる期間', values: ['約1ヶ月'] },
      { item: '営業税', values: ['5%（2ヶ月ごとに申告）'] },
      { item: '法人税', values: ['20%（年間）'] },
    ],
    faqHeading: 'よくある質問',
    faq: [
      {
        q: '台湾法人設立に最低資本金はありますか？',
        a: '会社設立自体に最低資本金の制限はなく、NT$1でも可能です。ただし代表者の就業許可証と居留証が必要な場合は、単一株主基準で最低NT$50万、台湾パートナーがいる場合はその3分の1（約NT$17万）を投資する必要があり、会社の年間売上高がNT$300万を超える必要があります。',
      },
      {
        q: '会社を設立すれば台湾のビザを取得できますか？',
        a: 'はい。投資家が台湾で会社を管理・運営する必要がある場合、台湾労働部に外国人就業許可証を申請し、取得後に移民署に居留証を申請できます。外国人就業許可証の許可期間は1〜3年で、居留証と有効期間が同じです。',
      },
      {
        q: '子会社と支店の税金の違いは？',
        a: 'どちらも営業税5%と法人税20%は同じです。子会社は利益を配当する際に21%の外国人所得税が追加され、分配しない場合は5%の未処分利益留保金税がかかります。支店は利益を親会社に送金する際に追加の税金と未処分利益留保金税がありません。',
      },
      {
        q: '銀行口座の開設が難しいと聞きましたが、本当ですか？',
        a: '台湾はマネーロンダリング防止のため銀行口座の開設がますます厳格化されています。多くの銀行が賃貸契約書を審査し、会社住所を実地調査します。居留証がなくても移民署で基本資料表の発行を受けて口座開設が可能です。',
      },
      {
        q: '法人設立には通常どのくらいかかりますか？',
        a: '会社設立に約3ヶ月、設立後の就業許可証と居留証の取得に約1ヶ月かかるのが一般的です。店舗賃貸契約の開始日はできるだけ遅く設定するのが安全です。',
      },
      {
        q: '台湾法人設立の手続きはどのようになっていますか？',
        a: '投資審議司の承認、社名予備審査・公証、設立・税務登記、正式口座開設の順で進みます。',
      },
    ],
    relatedHeading: '関連コラム',
    relatedColumns: relatedColumnsJa,
    relatedResourcesHeading: '関連案内',
    relatedResources: [
      { href: 'lawyers/wei-tseng', label: '曾雋崴弁護士のプロフィール' },
      { href: 'taiwan-company-setup-lawyer', label: '台湾法人設立・会社設立弁護士のご案内' },
      { href: 'taiwan-lawyer', label: '台湾弁護士検索ガイド' },
      { href: 'services/investment', label: '台湾投資・会社設立関連サービス' },
    ],
    ctaTitle: '案件に合った設立の方向を整理するには',
    ctaText:
      '業種・資本金・ビザの必要性によって、子会社・支店・代表者事務所の選択が変わります。資料をお送りいただければ、曾雋崴台湾弁護士につながる相談の流れをご案内します。',
    ctaButton: '相談のお問い合わせ',
  },
};
