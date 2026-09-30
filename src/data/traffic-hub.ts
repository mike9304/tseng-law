import type { SiteLocale } from '@/lib/locales';

export const TRAFFIC_PATH = '/traffic-accidents';
/** Hypothetical animated diagram shown on the hub (src/data/traffic-diagrams.ts). */
export const TRAFFIC_DIAGRAM_ID = 'passing-hypothetical' as const;
export const TRAFFIC_COLUMN_SLUGS = [
  'taiwan-accident-police-records',
  'taiwan-traffic-accident-procedure',
  'taiwan-overtaking-accident-liability',
] as const;

type CountryGuide = { id: 'tw' | 'us' | 'jp' | 'kr'; name: string; text: string; linkLabel: string; href: string };
type TrafficCopy = {
  nav: string; kicker: string; title: string; description: string; read: string;
  columns: string; visualTitle: string; visualText: string;
  stages: { title: string; text: string }[];
  countriesTitle: string; countriesIntro: string; countries: CountryGuide[];
  contactTitle: string; contactText: string; contact: string; allColumns: string;
};

export const trafficHubCopy: Record<SiteLocale, TrafficCopy> = {
  ko: {
    visualTitle: '앞차가 양보한 뒤의 추월',
    visualText: '제101조의 신호·양보·좌측 통과·복귀 순서를 승용차 두 대로 보여 줍니다. 실제 사건이 아닌 가상 예시이며, 속도·거리·시각은 설명용 가정값입니다. 과실 판단을 위한 영상은 아닙니다.',
    nav: '교통사고', kicker: '교통사고 법률 안내', title: '대만에서 난 교통사고,\n사고 직후부터 손해배상까지',
    description: '대만에서 난 교통사고에서는 경찰 기록과 치료비, 보험 처리와 합의를 함께 봅니다. 한국·일본·미국으로 돌아갈 예정이라면 출국 일정과 남은 절차도 같이 봐야 합니다.',
    read: '칼럼 읽기', columns: '대만 교통사고 칼럼',
    stages: [
      { title: '사고 직후', text: '안전과 구호가 먼저입니다. 신고·진료 기록과 현장 자료도 남깁니다.' },
      { title: '책임과 손해', text: '차량의 움직임, 진단서, 지출 자료를 대조하며 과실과 배상 항목을 살펴봅니다.' },
      { title: '합의와 이후 절차', text: '보험금과 합의금의 관계, 청구 포기 문구, 각 절차의 기한을 구분합니다.' },
    ],
    countriesTitle: '사고가 난 나라마다 절차가 다릅니다',
    countriesIntro: '대만에서 난 교통사고의 처리 절차를 안내합니다. 미국·일본·한국에서 난 사고는 각국의 공식 안내와 현지 법률상담이 출발점입니다.',
    countries: [
      { id: 'tw', name: '대만', text: '현장 대응부터 과실, 보험과 합의, 손해배상까지 대만 교통사고 칼럼에서 자세히 다룹니다.', linkLabel: '대만 사고 대응 Q&A', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: '미국', text: '신고와 보험 절차는 주별로 확인해야 합니다. 아래 자료는 캘리포니아 안내로, 미국 전역에 적용되는 공통 규칙은 아닙니다.', linkLabel: '캘리포니아 DMV 사고 안내', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: '일본', text: '일본에서 난 사고는 현지 경찰의 사고 처리 안내가 출발점입니다. 대만의 신고·합의 절차와는 따로 봐야 합니다.', linkLabel: '오사카부경찰 사고 대응 안내', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: '한국', text: '현장 조치와 신고는 도로교통법으로 확인합니다. 치료·보험·손해배상은 개별 사정에 맞춰 검토합니다.', linkLabel: '국가법령정보센터 도로교통법', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: '대만 교통사고 상담',
    contactText: '사고 날짜와 장소, 부상 여부, 현재 거주국, 경찰·보험 진행 상황, 출국 예정일을 알려 주세요. 첫 문의에는 기밀이 아닌 개요만 적고, 진료기록이나 신분증은 전달 방법을 안내받은 뒤 보내 주세요.',
    contact: '상담 문의', allColumns: '전체 칼럼',
  },
  'zh-hant': {
    visualTitle: '前車允讓後，如何完成超車',
    visualText: '兩輛小客車示範第101條的警示、允讓、從左側超越及返回原車道的順序。這是假設示例，並非實際案件；速度、距離與時間均為說明用假設值，不作為肇事責任判斷。',
    nav: '交通事故', kicker: '交通事故法律指南', title: '台灣車禍，\n從事故現場到損害賠償',
    description: '警方資料、醫療費用、保險與和解：整理處理台灣交通事故所需的資訊。若即將前往美國、日本或韓國，也應一併安排離台後的聯絡與後續程序。',
    read: '閱讀專欄', columns: '台灣交通事故專欄',
    stages: [
      { title: '事故現場', text: '先確保安全與救護，留下報案、就醫紀錄及現場資料。' },
      { title: '責任與損害', text: '比對車輛動向、診斷證明與支出資料，釐清過失及賠償項目。' },
      { title: '和解與後續程序', text: '區分保險給付、和解金、放棄請求的條款，以及各程序的期限。' },
    ],
    countriesTitle: '先從事故發生地開始',
    countriesIntro: '本站以台灣事故的處理為主。若事故發生在美國、日本或韓國，可從下列官方資訊及當地法律諮詢著手。',
    countries: [
      { id: 'tw', name: '台灣', text: '現場處理、過失、保險、和解與損害賠償，詳見台灣交通事故專欄。', linkLabel: '台灣交通事故問答', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: '美國', text: '報案與保險程序須依事故所在州確認。以下是加州指引，不是全美通用規則。', linkLabel: '加州 DMV 事故指引', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: '日本', text: '在日本發生事故，可先查閱當地警方資訊；請勿直接套用台灣的報案或和解程序。', linkLabel: '大阪府警察事故處理指引', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: '韓國', text: '現場處置與報案可查韓國道路交通法。醫療、保險及賠償仍須依具體情況處理。', linkLabel: '韓國道路交通法第54條', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: '諮詢台灣交通事故',
    contactText: '請提供事故日期、地點、有無受傷、目前居住國家、警方與保險處理進度，以及預計離台日期。初次聯繫請先提供非機密概要；病歷或身分文件請在確認傳送方式後提供。',
    contact: '聯絡事務所', allColumns: '所有專欄',
  },
  en: {
    visualTitle: 'When the car ahead lets you pass',
    visualText: 'Two passenger cars show Article 101\'s sequence: signal, wait for the lead car to yield, pass on the left and return to the original lane. This is a hypothetical example, not an actual case; speeds, distances and timing are illustrative assumptions, with no assessment of fault.',
    nav: 'Traffic accidents', kicker: 'Traffic accident guidance', title: 'A traffic accident in Taiwan.\nWhat happens next?',
    description: 'Police records, medical costs, insurance and settlement: practical reading for dealing with an accident in Taiwan, including when you will be returning to the United States, Japan or Korea.',
    read: 'Read article', columns: 'Taiwan accident articles',
    stages: [
      { title: 'At the scene', text: 'Prioritize safety and assistance, then preserve police, medical and scene records.' },
      { title: 'Liability and loss', text: 'Compare vehicle movements, medical evidence and expenses when assessing fault and damages.' },
      { title: 'Settlement and next steps', text: 'Distinguish insurance payments, settlement terms, releases and the deadlines for each procedure.' },
    ],
    countriesTitle: 'Start with where the accident happened',
    countriesIntro: 'Our accident guidance focuses on Taiwan. For a collision in the United States, Japan or Korea, start with the official resources below and legal advice in that jurisdiction.',
    countries: [
      { id: 'tw', name: 'Taiwan', text: 'Read about the accident scene, fault, insurance, settlement and civil compensation in Taiwan.', linkLabel: 'Taiwan accident questions answered', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: 'United States', text: 'Reporting and insurance procedures must be checked for the state involved. This resource is for California, not a nationwide rule.', linkLabel: 'California DMV accident guidance', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: 'Japan', text: 'Consult local police information for an accident in Japan. Taiwan reporting and settlement procedures should not be assumed to apply.', linkLabel: 'Osaka Police accident guidance', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: 'Korea', text: 'See Korea’s Road Traffic Act for duties at the scene and reporting. Treatment, insurance and compensation require assessment of the individual circumstances.', linkLabel: 'Korea Road Traffic Act, Article 54', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: 'Discuss an accident in Taiwan',
    contactText: 'Tell us when and where it happened, whether anyone was injured, your current country, the status of police and insurance proceedings, and any departure date. Begin with a non-confidential outline; ask how to send medical records and identification securely.',
    contact: 'Contact the firm', allColumns: 'All articles',
  },
  ja: {
    visualTitle: '追い越す前の合図と、元の車線への戻り方',
    visualText: '2台の乗用車で、第101条の合図、進路譲り、左側からの追い越し、元の車線への復帰という流れを示します。実際の事件ではない仮想の例で、速度・距離・時刻は説明用の仮定値です。過失の判断を示す映像ではありません。',
    nav: '交通事故', kicker: '交通事故の法律ガイド', title: '台湾での交通事故。\n事故直後から損害賠償まで',
    description: '警察の記録、治療費、保険と示談。台湾での交通事故に対応するための情報をまとめました。日本・韓国・米国へ戻る予定がある方は、帰国日とその後の手続きもあわせて考えましょう。',
    read: 'コラムを読む', columns: '台湾の交通事故コラム',
    stages: [
      { title: '事故直後', text: '安全と救護を優先し、通報・受診の記録と現場資料を残します。' },
      { title: '責任と損害', text: '車両の動き、診断書、支出資料を照らし合わせ、過失と賠償項目を考えます。' },
      { title: '示談とその後', text: '保険金と示談金の関係、請求放棄の条項、各手続きの期限を区別します。' },
    ],
    countriesTitle: 'まず、事故が起きた国を確認',
    countriesIntro: 'この案内は台湾での事故対応が中心です。米国・日本・韓国で起きた事故は、下記の公的情報と現地での法律相談を出発点にしてください。',
    countries: [
      { id: 'tw', name: '台湾', text: '現場対応、過失、保険、示談、損害賠償を台湾の交通事故コラムで説明しています。', linkLabel: '台湾の交通事故 Q&A', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: '米国', text: '届出や保険の手続きは州ごとに確認します。以下はカリフォルニア州の案内で、全米共通の規則ではありません。', linkLabel: 'カリフォルニア州 DMV 事故案内', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: '日本', text: '日本での事故は現地の警察情報から確認しましょう。台湾の通報や示談の手続きとは区別が必要です。', linkLabel: '大阪府警の事故対応案内', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: '韓国', text: '現場での措置や届出は韓国の道路交通法を参照し、治療・保険・損害賠償は個別の事情に応じて検討します。', linkLabel: '韓国道路交通法第54条', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: '台湾の交通事故について相談',
    contactText: '事故の日時と場所、けがの有無、現在の居住国、警察・保険手続きの状況、帰国予定日をお知らせください。初回は非機密の概要のみとし、診療記録や身分証は送付方法の案内後にお送りください。',
    contact: '事務所に相談する', allColumns: 'すべてのコラム',
  },
};
