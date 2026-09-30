import type { TrafficDiagram, TrafficDiagramCopy, TrafficDiagramLocale } from './traffic-diagrams';

const notes: Record<TrafficDiagramLocale, string> = {
  ko: '서류 종류를 보여주는 모형이며, 실제 서식과 다릅니다.',
  'zh-hant': '文件種類的示意模型，並非官方表單格式。',
  en: 'Illustrative document models, not official forms or actual case records.',
  ja: '書類の種類を示した模型です。実際の書式とは異なります。',
};

function copy(alt: string, legend: string, caption: string, locale: TrafficDiagramLocale): TrafficDiagramCopy {
  return { alt, legend, caption, assumption: notes[locale] };
}

function still(id: string, captions: Record<TrafficDiagramLocale, TrafficDiagramCopy>): TrafficDiagram {
  if (id === 'passing-stages-3d') {
    const assumptions = {
      ko: '특정 사건과 무관한 가상 장면입니다. 그림 속 차로 폭과 차간 거리는 운전 기준이 아닙니다.',
      'zh-hant': '與特定案件無關的假設場景。圖中的車道寬度及車距不代表駕駛標準。',
      en: 'A hypothetical scene unrelated to any case. Lane widths and vehicle gaps are not driving guidance.',
      ja: '特定の事件とは無関係の仮想場面です。図中の車線幅と車間距離は運転の基準ではありません。',
    };
    for (const locale of Object.keys(captions) as TrafficDiagramLocale[]) captions[locale].assumption = assumptions[locale];
  }
  return { id, kind: 'still', poster: `/images/traffic/${id}.webp`, mobilePoster: `/images/traffic/${id}-mobile.webp`, width: 1440, height: 840, mobileWidth: 720, mobileHeight: 420, copy: captions };
}

export const TRAFFIC_STILL_DIAGRAMS = {
  'claim-records-3d': still('claim-records-3d', {
    ko: copy('진료기록, 지출 영수증, 소득 자료를 구분한 세 개의 입체 문서 모형', '① 진료기록  ② 지출 영수증  ③ 소득 자료', '부상과 치료 내용, 실제 지출, 일을 하지 못해 줄어든 소득은 서로 다른 자료로 입증합니다. 각 자료와 사고의 관련성도 설명해야 합니다.', 'ko'),
    'zh-hant': copy('三組立體文件模型，分別代表醫療紀錄、支出收據與所得資料', '① 醫療紀錄  ② 支出收據  ③ 所得資料', '傷勢與治療、實際支出及無法工作造成的收入損失，各有不同的證明資料，也須說明與事故的關聯。', 'zh-hant'),
    en: copy('Three document models representing medical records, expense receipts and income records', '① Medical records  ② Expense receipts  ③ Income records', 'Injuries and treatment, expenses, and income lost through inability to work require different evidence. Their connection to the accident also matters.', 'en'),
    ja: copy('診療記録、支出の領収書、収入資料を分けて示した三つの立体模型', '① 診療記録  ② 支出の領収書  ③ 収入資料', 'けがと治療の内容、実際の支出、働けなかったことによる減収は、それぞれ異なる資料で裏付けます。事故との関係も説明する必要があります。', 'ja'),
  }),
  'police-documents-3d': still('police-documents-3d', {
    ko: copy('당사자 등록연락서, 현장도와 사진, 초보분석판정표를 나란히 놓은 입체 모형', '① 현장: 등록연락서  ② 7일 뒤: 현장도·사진  ③ 30일 뒤: 초보분석판정표', '번호는 서류별 신청 가능 시점을 나타냅니다. 신청한 날 바로 발급된다는 뜻은 아닙니다. 온라인 신청 대상과 대리 수령 요건은 아래 본문에 나와 있습니다.', 'ko'),
    'zh-hant': copy('當事人登記聯單、現場圖與照片、初步分析研判表並列的立體文件模型', '① 現場：登記聯單  ② 7日後：現場圖與照片  ③ 30日後：初步分析研判表', '圖中列的是各項資料可申請的時間，不代表申請當日即可取得。線上申請與委託領取的條件見下文。', 'zh-hant'),
    en: copy('Document models for the party registration slip, scene diagram and photographs, and preliminary analysis', '① At the scene: registration slip  ② After 7 days: diagram and photos  ③ After 30 days: preliminary analysis', 'These are the times from which each document may be requested, not guaranteed issue dates. Online eligibility and collection by a representative are explained below.', 'en'),
    ja: copy('当事者登録連絡票、現場図と写真、初歩分析判定表を並べた立体模型', '① 現場：登録連絡票  ② 7日後：現場図・写真  ③ 30日後：初歩分析判定表', '各資料を申請できる時点を示しています。当日交付を保証するものではありません。オンライン申請と代理受領の条件は本文に記載しています。', 'ja'),
  }),
  'passing-stages-3d': still('passing-stages-3d', {
    ko: copy('같은 방향 두 차로에서 초록색 승용차가 적갈색 승용차의 왼쪽을 지나 앞쪽으로 이동하는 세 장면', '① 추월 전 위치  ② 왼쪽 통과  ③ 원래 진로로 복귀', '초록색 차의 위치 변화만 나타낸 그림입니다. 추월 전 신호와 앞차의 양보, 금지 구간, 필요한 간격 등 제101조의 요건은 본문과 함께 읽어야 합니다.', 'ko'),
    'zh-hant': copy('同向兩車道上的三個示意場景，綠色轎車由紅褐色轎車左側通過後回到原路線', '① 超車前的位置  ② 由左側通過  ③ 回到原行路線', '圖中僅呈現綠車的位置變化。超車前的燈光或喇叭訊號、前車允讓、禁止超車路段及間隔等第101條要件，仍須配合本文閱讀。', 'zh-hant'),
    en: copy('Three generic views of a green car passing a terracotta car on the left in two same-direction lanes', '① Before passing  ② Passing on the left  ③ Returning to the original line', 'Only the green car’s changing position is shown. Read the article for Article 101 requirements on signalling, yielding, prohibited locations and clearance.', 'en'),
    ja: copy('同じ方向の二車線で、緑色の乗用車が赤茶色の車の左側を通過して元の進路に戻る三場面', '① 追越し前の位置  ② 左側を通過  ③ 元の進路へ復帰', '緑色の車の位置の変化だけを示した図です。事前の合図、前車の譲り、追越し禁止区間や間隔など、第101条の要件は本文とあわせて確認してください。', 'ja'),
  }),
} as const;
