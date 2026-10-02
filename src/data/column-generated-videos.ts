export type ColumnVideoSource = 'column' | 'issue';

export type ColumnGeneratedVideoAsset = {
  id: string;
  src: string;
  poster: string;
  width: number;
  height: number;
  title: string;
  description: string;
  disclosure: string;
};

/** Only reviewed article/language pairs belong here. Never infer coverage from a shared slug. */
const REVIEWED_COLUMN_VIDEOS: Readonly<Record<string, ColumnGeneratedVideoAsset>> = {
  'column/ko/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v2-ko',
    src: '/videos/columns/rear-end-simulation-v2-ko.mp4',
    poster: '/images/column-videos/rear-end-simulation-v2-ko.jpg',
    width: 1280,
    height: 720,
    title: '멈춰 있는 앞차에 뒤차가 닿는 장면',
    description: '남색 승용차가 왼쪽에서 다가와 정차한 흰색 승용차의 뒷범퍼에 접촉하고 멈춥니다. 소리가 없는 7초 영상입니다.',
    disclosure: 'AI로 만든 가상 장면이며 실제 사고 기록이 아닙니다. 도로·속도·거리·접촉 시점은 설명을 위한 설정으로, 특정 사건의 과실을 판단하는 자료로 쓸 수 없습니다.',
  },
  'column/en/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v2-en',
    src: '/videos/columns/rear-end-simulation-v2-en.mp4',
    poster: '/images/column-videos/rear-end-simulation-v2-en.jpg',
    width: 1280,
    height: 720,
    title: 'A moving car contacts the rear of a stopped car',
    description: 'A dark-blue sedan approaches from the left, touches the rear bumper of a stationary white sedan and stops. This seven-second clip has no sound.',
    disclosure: 'This is a fictional AI-generated scene, not actual accident footage. The road layout, speeds, distances and timing are illustrative and cannot establish fault in a real case.',
  },
  'column/zh-hant/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v2-zh-hant',
    src: '/videos/columns/rear-end-simulation-v2-zh-hant.mp4',
    poster: '/images/column-videos/rear-end-simulation-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '後車接觸已停住的前車',
    description: '深藍色轎車從左側接近，接觸已停住的白色轎車後保險桿，隨後停住。這是7秒無聲影片。',
    disclosure: 'AI生成的假想場景，非真實事故影像。道路、速度、距離及接觸時點均為說明而設定，不能作為判斷個案過失的證據。',
  },
  'column/ja/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v2-ja',
    src: '/videos/columns/rear-end-simulation-v2-ja.mp4',
    poster: '/images/column-videos/rear-end-simulation-v2-ja.jpg',
    width: 1280,
    height: 720,
    title: '停止中の車に後続車が接触する場面',
    description: '濃紺の乗用車が左から近づき、停止中の白い乗用車の後部バンパーに接触して止まります。音声のない7秒の映像です。',
    disclosure: 'AIで作成した架空の場面であり、実際の事故映像ではありません。道路・速度・距離・接触のタイミングは説明のための設定で、個別の事故の過失を判断する資料には使えません。',
  },
  'column/zh-hant/taiwan-lane-change-side-rear-collision-liability': {
    id: 'lane-change-v2-zh-hant',
    src: '/videos/columns/lane-change-v2-zh-hant.mp4',
    poster: '/images/column-videos/lane-change-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '橙色車跨越虛線後，左後角與旁車接觸',
    description: '兩車朝畫面右側行駛，橙色車從下方車道向上跨越白色虛線，左後角與藍綠色車的右前角接觸。這是6秒無聲影片。',
    disclosure: 'AI生成的假想情境，非真實事故或本文判決的重建。位置、速度、間隔與接觸時點均為示意，不能據此認定換道完成時間、過失比例或避讓可能性。',
  },
  'column/zh-hant/taiwan-chain-rear-end-first-impact-evidence': {
    id: 'chain-rear-end-v1-zh-hant',
    src: '/videos/columns/chain-rear-end-v1-zh-hant.mp4',
    poster: '/images/column-videos/chain-rear-end-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '後車先碰中間車，再將它推向前車',
    description: '深藍色後車先接觸銀色中間車，銀車隨後向右移動並碰到白色前車。這段8秒無聲影片示範一種假設順序。',
    disclosure: 'AI生成的假想情境，非事故重建。這只是「後車先碰中間車」的一種設定，並未重現本文判決；車距、節奏與位移不是實測，也不能據此認定責任或損害。',
  },
  'column/zh-hant/taiwan-roadside-starting-parking-exit-liability': {
    id: 'roadside-start-v1-zh-hant',
    src: '/videos/columns/roadside-start-v1-zh-hant.mp4',
    poster: '/images/column-videos/roadside-start-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '橙色車從路邊起步，跨過白色實線',
    description: '橙色車由畫面下方的路邊位置向右上方駛出，與向右行進的藍綠色車接觸。這是6秒無聲影片。',
    disclosure: 'AI生成的假想情境，非本文判決或真實事故的重建。路形、標線、車距及動作時間均為設定；畫面未呈現完整的注意、打燈或讓行過程，不能用來認定道路性質或責任。',
  },
  'column/zh-hant/taiwan-right-turn-car-straight-motorcycle-evidence': {
    id: 'right-turn-scooter-v1-zh-hant',
    src: '/videos/columns/right-turn-scooter-v1-zh-hant.mp4',
    poster: '/images/column-videos/right-turn-scooter-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '右轉中的銀色車與直行機車接觸',
    description: '銀色車開始向畫面右下方轉彎，藍綠色機車沿原方向向右前進，隨後接觸車身右側。這是6秒無聲影片。',
    disclosure: 'AI生成的假想場景，非真實事故或本文案件的重建。沒有測量車速、間隔、打燈距離或反應時間；騎士停下的動作也不是避讓能力的證明。',
  },
  'column/ko/taiwan-company-setup-pitch-location': {
    id: 'business-premises-v1-ko',
    src: '/videos/columns/business-premises-v1-ko.mp4',
    poster: '/images/column-videos/business-premises-v1-ko.jpg',
    width: 1280,
    height: 720,
    title: '비어 있는 점포 안을 둘러보는 장면',
    description: '카메라가 유리 출입구 안쪽에서 천천히 움직이며 빈 실내와 기둥, 뒤쪽 문을 보여 줍니다. 소리가 없는 6초 영상입니다.',
    disclosure: 'AI로 만든 가상 점포이며 실제 임대 매물이 아닙니다. 화면에는 용도·허가·등기 자료가 없으므로, 이 공간에서 음식점을 운영할 수 있다는 뜻은 아닙니다.',
  },
  'column/en/taiwan-company-setup-pitch-location': {
    id: 'business-premises-v1-en',
    src: '/videos/columns/business-premises-v1-en.mp4',
    poster: '/images/column-videos/business-premises-v1-en.jpg',
    width: 1280,
    height: 720,
    title: 'A slow look inside an empty shop',
    description: 'The camera moves slowly inside an empty shop, showing the glass entrance, a column and a door at the back. This six-second clip has no sound.',
    disclosure: 'An AI-generated fictional space, not an actual rental listing. The clip does not include property records or approvals and does not establish that restaurant use is permitted.',
  },
  'column/zh-hant/taiwan-company-setup-pitch-location': {
    id: 'business-premises-v1-zh-hant',
    src: '/videos/columns/business-premises-v1-zh-hant.mp4',
    poster: '/images/column-videos/business-premises-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '空店面的入口與室內配置',
    description: '鏡頭從玻璃入口內側緩慢向前移動，呈現未擺放家具的室內、柱子與後方的門。這是6秒無聲影片。',
    disclosure: 'AI生成的虛構空間，非實際出租物件。影片沒有建物用途、登記或核准文件，不能據此認定可在此經營餐廳。',
  },
  'column/ja/taiwan-company-setup-pitch-location': {
    id: 'business-premises-v1-ja',
    src: '/videos/columns/business-premises-v1-ja.mp4',
    poster: '/images/column-videos/business-premises-v1-ja.jpg',
    width: 1280,
    height: 720,
    title: '空き店舗の入口から室内を見る',
    description: 'ガラス扉の内側からカメラがゆっくり進み、何も置かれていない室内、柱、奥のドアを映します。音声のない6秒の映像です。',
    disclosure: 'AIで作成した架空の空間で、実際の賃貸物件ではありません。建物の用途・登記・許認可の資料は映っておらず、ここで飲食店を営業できることを示す映像ではありません。',
  },
};

export function getColumnGeneratedVideo(
  locale: string,
  slug: string,
  source: ColumnVideoSource = 'column',
): ColumnGeneratedVideoAsset | null {
  return REVIEWED_COLUMN_VIDEOS[`${source}/${locale}/${slug}`] ?? null;
}
