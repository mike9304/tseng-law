import type { SiteLocale } from '@/lib/locales';

export const TRAFFIC_PATH = '/traffic-accidents';
/** Hypothetical animated diagram shown on the hub (src/data/traffic-diagrams.ts). */
export const TRAFFIC_DIAGRAM_ID = 'passing-hypothetical' as const;
export const TRAFFIC_COLUMN_SLUGS = [
  'taiwan-accident-police-records',
  'taiwan-traffic-accident-procedure',
  'taiwan-overtaking-accident-liability',
] as const;

/**
 * Traffic columns released Korean-first (column routine: ko → zh-Hant → en).
 * A slug is listed only for locales whose file already exists, so the hub never
 * falls back to another language. Add a locale here when its translation ships.
 * Newest first.
 */
export const TRAFFIC_LOCALE_COLUMN_SLUGS: Partial<Record<SiteLocale, readonly string[]>> = {
  ko: ['taiwan-left-turn-vs-straight-motorcycle'],
};

/** Hub order for `locale`: locale-specific releases first, then the four-locale core. */
export function trafficColumnSlugsFor(locale: string): readonly string[] {
  const extra = (TRAFFIC_LOCALE_COLUMN_SLUGS as Partial<Record<string, readonly string[]>>)[locale] ?? [];
  return [...extra, ...TRAFFIC_COLUMN_SLUGS];
}

export function isTrafficColumnSlug(slug: string, locale: string): boolean {
  return trafficColumnSlugsFor(locale).includes(slug);
}

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
    nav: '교통사고', kicker: '호정 법률 칼럼', title: '대만 교통사고',
    description: '경찰 자료 신청, 과실 판단, 보험과 손해배상, 귀국 후 서류 수령과 대리 절차.',
    read: '칼럼 읽기', columns: '대만 교통사고 칼럼',
    stages: [
      { title: '사고 직후', text: '안전과 구호가 먼저입니다. 신고·진료 기록과 현장 자료도 남깁니다.' },
      { title: '책임과 손해', text: '차량의 움직임, 진단서, 지출 자료를 대조하며 과실과 배상 항목을 살펴봅니다.' },
      { title: '합의와 이후 절차', text: '보험금과 합의금의 관계, 청구 포기 문구, 각 절차의 기한을 구분합니다.' },
    ],
    countriesTitle: '사고가 난 나라마다 절차가 다릅니다',
    countriesIntro: '미국·일본·한국에서 발생한 사고는 각국의 공식 안내와 현지 법률상담을 참고할 수 있습니다.',
    countries: [
      { id: 'tw', name: '대만', text: '현장 대응부터 과실, 보험과 합의, 손해배상까지 대만 교통사고 칼럼에서 자세히 다룹니다.', linkLabel: '대만 사고 대응 Q&A', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: '미국', text: '신고와 보험 절차는 주별로 확인해야 합니다. 아래 자료는 캘리포니아 안내로, 미국 전역에 적용되는 공통 규칙은 아닙니다.', linkLabel: '캘리포니아 DMV 사고 안내', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: '일본', text: '오사카부경찰의 사고 처리 안내입니다. 대만의 신고·합의 절차와는 구분해야 합니다.', linkLabel: '오사카부경찰 사고 대응 안내', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: '한국', text: '현장 조치와 신고는 도로교통법으로 확인합니다. 치료·보험·손해배상은 개별 사정에 맞춰 검토합니다.', linkLabel: '국가법령정보센터 도로교통법', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: '대만 교통사고 상담',
    contactText: '사고 날짜와 장소, 부상 여부, 현재 거주국, 경찰·보험 진행 상황, 출국 예정일을 알려 주세요. 첫 문의에는 기밀이 아닌 개요만 적고, 진료기록이나 신분증은 전달 방법을 안내받은 뒤 보내 주세요.',
    contact: '상담 문의', allColumns: '전체 칼럼',
  },
  'zh-hant': {
    visualTitle: '前車允讓後，如何完成超車',
    visualText: '兩輛小客車示範第101條的警示、允讓、從左側超越及返回原車道的順序。這是假設示例，並非實際案件；速度、距離與時間均為說明用假設值，不作為判斷肇事責任的依據。',
    nav: '交通事故', kicker: '車禍與法律', title: '台灣車禍之後，\n從現場處理到損害賠償',
    description: '台灣車禍的後續處理，牽涉警方資料、醫療費用、保險與和解。若即將前往美國、日本或韓國，離台後的聯絡和後續程序也要一併安排。',
    read: '閱讀專欄', columns: '台灣車禍法律專欄',
    stages: [
      { title: '事故當下', text: '事故當下以安全與救護為先，報案、就醫紀錄和現場資料也要保留。' },
      { title: '責任與損害', text: '車輛動向、診斷證明與支出資料相互比對，釐清過失及賠償項目。' },
      { title: '和解與後續程序', text: '保險給付、和解金、放棄請求的條款，以及各項程序的期限，都要分清楚。' },
    ],
    countriesTitle: '事故發生地不同，處理程序也不同',
    countriesIntro: '本站以台灣車禍的處理程序為主。事故若發生在美國、日本或韓國，後續處理可從下列官方資料和當地法律諮詢著手。',
    countries: [
      { id: 'tw', name: '台灣', text: '現場處理、過失、保險、和解與損害賠償，台灣交通事故專欄都有更完整的說明。', linkLabel: '台灣交通事故問答', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: '美國', text: '報案與保險程序要看事故發生在哪一州。此處連結的是加州指引，並非全美通用的規則。', linkLabel: '加州 DMV 事故指引', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: '日本', text: '在日本發生的車禍，可先查閱當地警方的資料；台灣的報案或和解程序不能直接套用。', linkLabel: '大阪府警察車禍處理指引', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: '韓國', text: '現場處置與報案可查韓國道路交通法；醫療、保險與賠償，仍須按個案處理。', linkLabel: '韓國道路交通法第54條', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: '台灣車禍法律諮詢',
    contactText: '初次聯繫時，請以不含機密資訊的概要說明事故日期、地點、有無受傷、目前居住國家、警方與保險處理進度，以及預計離台日期。病歷或身分文件，待確認傳送方式後再提供。',
    contact: '聯絡事務所', allColumns: '全部專欄',
  },
  en: {
    visualTitle: 'When the car ahead lets you pass',
    visualText: 'Two passenger cars show Article 101\'s sequence: signal, wait for the lead car to yield, pass on the left and return to the original lane. This is a hypothetical example, not an actual case; speeds, distances and timing are illustrative assumptions, with no assessment of fault.',
    nav: 'Traffic accidents', kicker: 'Accidents and the law', title: 'After a traffic accident in Taiwan\nFrom the scene to compensation',
    description: 'Police records, medical costs, insurance and settlement: what follows a traffic accident in Taiwan, and what remains to be done if you are heading back to the United States, Japan or Korea.',
    read: 'Read article', columns: 'Traffic accidents in Taiwan',
    stages: [
      { title: 'At the scene', text: 'Safety and assistance come first. Preserving police, medical and scene records comes next.' },
      { title: 'Liability and loss', text: 'Assessing fault and damages means comparing how the vehicles moved, the medical evidence and the expenses.' },
      { title: 'Settlement and later steps', text: 'Settlement involves distinguishing insurance payments, settlement terms and releases, while keeping track of each procedure’s deadline.' },
    ],
    countriesTitle: 'The procedure depends on where the accident happened',
    countriesIntro: 'The guidance here covers accidents in Taiwan. For an accident in the United States, Japan or Korea, the official resources linked here and local legal advice are the starting points.',
    countries: [
      { id: 'tw', name: 'Taiwan', text: 'The Taiwan accident articles cover the accident scene, fault, insurance, settlement and civil compensation.', linkLabel: 'Taiwan accident Q&A', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: 'United States', text: 'Reporting and insurance procedures need to be checked for the state where the accident happened. The linked guidance applies to California, not the United States as a whole.', linkLabel: 'California DMV accident guidance', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: 'Japan', text: 'Local police information is the starting point for an accident in Japan. Taiwan’s reporting and settlement procedures cannot be assumed to apply there.', linkLabel: 'Osaka Police accident guidance', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: 'Korea', text: 'For duties at the scene and reporting requirements, see Korea’s Road Traffic Act. Treatment, insurance and compensation require assessment of the individual circumstances.', linkLabel: 'Korea Road Traffic Act, Article 54', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: 'Discuss an accident in Taiwan',
    contactText: 'For a first inquiry, please send a non-confidential outline: when and where the accident happened, whether anyone was injured, your current country, the status of police and insurance proceedings, and any departure date. Before sending medical records or identification, ask about secure delivery.',
    contact: 'Contact the firm', allColumns: 'All articles',
  },
  ja: {
    visualTitle: '追い越す前の合図と、元の車線への戻り方',
    visualText: '2台の乗用車で、第101条に沿って、合図を出し、前の車が進路を譲った後に左側から追い越して元の車線に戻る流れを示します。実際の事件ではない仮想の例で、速度・距離・時刻は説明用の仮定値です。過失の判断を示す映像ではありません。',
    nav: '交通事故', kicker: '交通事故と法律', title: '台湾で交通事故に遭ったら\n事故直後から損害賠償まで',
    description: '台湾での交通事故では、警察の記録や治療費を確認し、保険や示談についても検討します。日本・韓国・米国へ戻る予定がある場合は、帰国日とその後の手続きも含めて考えます。',
    read: 'コラムを読む', columns: '台湾の交通事故コラム',
    stages: [
      { title: '事故直後の対応', text: 'まずは安全と救護です。通報や受診の記録、現場の資料も残しておきます。' },
      { title: '責任と損害', text: '車両の動き、診断書、支出資料を照らし合わせ、過失と賠償項目を検討します。' },
      { title: '示談、その後の手続き', text: '保険金と示談金の関係、請求放棄の条項、各手続きの期限は、それぞれ分けて考えます。' },
    ],
    countriesTitle: '手続きは、事故が起きた国で変わる',
    countriesIntro: '台湾での事故対応が中心の案内です。米国・日本・韓国で起きた事故は、下の公的情報と現地での法律相談が出発点になります。',
    countries: [
      { id: 'tw', name: '台湾', text: '現場での対応から過失、保険、示談、損害賠償まで、台湾の交通事故コラムに詳しい説明があります。', linkLabel: '台湾の交通事故 Q&A', href: '/columns/taiwan-traffic-accident-procedure' },
      { id: 'us', name: '米国', text: '届出や保険の手続きは、事故が起きた州ごとに確認します。リンク先はカリフォルニア州の案内で、全米共通の規則ではありません。', linkLabel: 'カリフォルニア州 DMV 事故案内', href: 'https://www.dmv.ca.gov/portal/dmv-virtual-office/accident-reporting/' },
      { id: 'jp', name: '日本', text: '日本での事故対応は、まず現地の警察情報から確認します。通報や示談の手続きは、台湾のものとは区別が必要です。', linkLabel: '大阪府警の事故対応案内', href: 'https://www.police.pref.osaka.lg.jp/kotsu/anzen/trafficrules/22200.html' },
      { id: 'kr', name: '韓国', text: '現場での措置や届出は、韓国の道路交通法を参照します。治療・保険・損害賠償は、個別の事情に応じて検討します。', linkLabel: '韓国道路交通法第54条', href: 'https://www.law.go.kr/법령/도로교통법/제54조' },
    ],
    contactTitle: '台湾での交通事故のご相談',
    contactText: '初回のご連絡では、機密情報を含まない概要として、事故の日時と場所、けがの有無、現在の居住国、警察や保険の手続きの状況、帰国予定日をお知らせください。診療記録や身分証は、送付方法の案内を受けてからお送りください。',
    contact: '事務所に相談', allColumns: 'コラム一覧',
  },
};
