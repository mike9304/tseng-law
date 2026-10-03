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
    id: 'rear-end-simulation-v3-ko',
    src: '/videos/columns/rear-end-simulation-v3-ko.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-ko.jpg',
    width: 1280,
    height: 720,
    title: '뒤차가 추돌하고 앞차가 밀려나는 장면',
    description: '남색 승용차가 왼쪽에서 빠르게 다가와 정차한 흰색 승용차를 추돌합니다. 남색 차의 보닛이 찌그러지고 흰색 차가 앞으로 밀려난 뒤 멈춥니다. 소리가 없는 4초 영상입니다.',
    disclosure: 'AI로 만든 가상 장면이며 실제 사고 기록이 아닙니다. 도로·속도·거리·접촉 시점은 설명을 위한 설정으로, 특정 사건의 과실을 판단하는 자료로 쓸 수 없습니다.',
  },
  'column/en/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-en',
    src: '/videos/columns/rear-end-simulation-v3-en.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-en.jpg',
    width: 1280,
    height: 720,
    title: 'A rear-end impact pushes a stopped car forward',
    description: 'A dark-blue sedan approaches quickly from the left and strikes a stationary white sedan. The blue car’s hood buckles and the white car rolls forward before stopping. This four-second clip has no sound.',
    disclosure: 'This is a fictional AI-generated scene, not actual accident footage. The road layout, speeds, distances and timing are illustrative and cannot establish fault in a real case.',
  },
  'column/zh-hant/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-zh-hant',
    src: '/videos/columns/rear-end-simulation-v3-zh-hant.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '後車追撞，停住的前車被推向前方',
    description: '深藍色轎車從左側快速接近，撞上已停住的白色轎車。藍車的引擎蓋變形，白車被推向前方後停下。這是4秒無聲影片。',
    disclosure: 'AI生成的假想場景，非真實事故影像。道路、速度、距離及接觸時點均為說明而設定，不能作為判斷個案過失的證據。',
  },
  'column/ja/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-ja',
    src: '/videos/columns/rear-end-simulation-v3-ja.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-ja.jpg',
    width: 1280,
    height: 720,
    title: '追突された前の車が押し出される場面',
    description: '濃紺の乗用車が左から勢いよく接近し、停止中の白い乗用車に追突します。紺色の車のボンネットが変形し、白い車は前方に押し出されて止まります。音声のない4秒の映像です。',
    disclosure: 'AIで作成した架空の場面であり、実際の事故映像ではありません。道路・速度・距離・接触のタイミングは説明のための設定で、個別の事故の過失を判断する資料には使えません。',
  },
  'column/zh-hant/taiwan-lane-change-side-rear-collision-liability': {
    id: 'lane-change-v3-zh-hant',
    src: '/videos/columns/lane-change-v3-zh-hant.mp4',
    poster: '/images/column-videos/lane-change-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '橙色車跨越虛線，左後角與旁車相撞',
    description: '兩車向右行駛，橙色車從下方車道切入，左後角與藍綠色車的右前角相撞。橙車偏轉並向前移動，兩車隨後停下。這是4秒無聲影片。',
    disclosure: 'AI生成的假想情境，非真實事故或本文判決的重建。位置、速度、間隔與接觸時點均為示意，不能據此認定換道完成時間、過失比例或避讓可能性。',
  },
  'column/zh-hant/taiwan-chain-rear-end-first-impact-evidence': {
    id: 'chain-rear-end-v2-zh-hant',
    src: '/videos/columns/chain-rear-end-v2-zh-hant.mp4',
    poster: '/images/column-videos/chain-rear-end-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '後車先追撞中間車，再將它推向前車',
    description: '深藍色後車追撞銀色中間車，將銀車推向白色前車。第二次撞擊後，白車向前移動，三車陸續停下。這段4秒無聲影片示範一種假設順序。',
    disclosure: 'AI生成的假想情境，非事故重建。這只是「後車先碰中間車」的一種設定，並未重現本文判決；車距、節奏與位移不是實測，也不能據此認定責任或損害。',
  },
  'column/zh-hant/taiwan-roadside-starting-parking-exit-liability': {
    id: 'roadside-start-v3-zh-hant',
    src: '/videos/columns/roadside-start-v3-zh-hant.mp4',
    poster: '/images/column-videos/roadside-start-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '路邊起步的橙色車與後方來車相撞',
    description: '橙色車由路邊向右上方駛出，跨過白色實線。藍綠色車快速向右接近，車頭與橙車左後側相撞。橙車向前偏移，兩車分開後停下。這是4秒無聲影片。',
    disclosure: 'AI生成的假想情境，非本文判決或真實事故的重建。路形、標線、車距及動作時間均為設定；畫面未呈現完整的注意、打燈或讓行過程，不能用來認定道路性質或責任。',
  },
  'column/zh-hant/taiwan-right-turn-car-straight-motorcycle-evidence': {
    id: 'right-turn-scooter-v2-zh-hant',
    src: '/videos/columns/right-turn-scooter-v2-zh-hant.mp4',
    poster: '/images/column-videos/right-turn-scooter-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '右轉車與直行機車相撞，騎士隨後倒地',
    description: '銀色車向右下方轉彎，藍綠色機車向右直行並撞上車身右後側。機車與騎士向畫面前方倒下，汽車在路面上停住。這是4秒無聲影片。',
    disclosure: 'AI生成的假想場景，非真實事故或本文案件的重建。沒有測量車速、間隔、打燈距離或反應時間；騎士倒地的動作也不是傷勢或避讓能力的證明。',
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
