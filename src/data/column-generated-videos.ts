import reverseDashcamCaptions from './reverse-dashcam-video-captions.json';
import generalAccidentCaptions from './general-accident-video-captions.json';
import overtakingCaptions from './overtaking-video-captions.json';
import businessPremisesCaptions from './business-premises-video-captions.json';
import logisticsCaptions from './logistics-video-captions.json';
import precisionPartsCaptions from './precision-parts-video-captions.json';
import gymPauseCaptions from './gym-pause-video-captions.json';
import trafficFilms from './traffic-column-films.json';
import formationDocumentsCaptions from './formation-documents-video-captions.json';
import cosmeticsCheckCaptions from './cosmetics-check-video-captions.json';
import branchModelsCaptions from './branch-models-video-captions.json';
import familyCareCaptions from './family-care-video-captions.json';
import workRecordsCaptions from './work-records-video-captions.json';
import alleyBicycleCaptions from './alley-bicycle-video-captions.json';
import potholeScooterCaptions from './pothole-scooter-video-captions.json';
import passengerSkidCaptions from './passenger-skid-video-captions.json';
import settlementRecordsCaptions from './settlement-records-video-captions.json';
import stopDialogueCaptions from './stop-dialogue-video-captions.json';
import keyCustodyCaptions from './key-custody-video-captions.json';

export type ColumnVideoSource = 'column' | 'issue';

export type ColumnVideoChapter = { start: number; title: string; text: string };

export type ColumnGeneratedVideoAsset = {
  id: string;
  src: string;
  poster: string;
  width: number;
  height: number;
  title: string;
  description: string;
  disclosure: string;
  /** Native looping is independent of the traffic page's first-view autoplay. */
  loop?: boolean;
  durationSeconds?: number;
  sceneCount?: number;
  chapters?: ColumnVideoChapter[];
};

/** Only reviewed article/language pairs belong here. Never infer coverage from a shared slug. */
const REVIEWED_COLUMN_VIDEOS: Readonly<Record<string, ColumnGeneratedVideoAsset>> = {
  ...Object.fromEntries(Object.entries(stopDialogueCaptions).map(([locale, caption]) => {
    const id = `stop-dialogue-v1-${locale}`;
    return [
      `column/${locale}/taiwan-accident-stop-dialogue-hit-and-run-evidence`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(keyCustodyCaptions).map(([locale, caption]) => {
    const id = `key-custody-v1-${locale}`;
    return [
      `column/${locale}/taiwan-borrowed-car-owner-driver-key-custody-liability`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(passengerSkidCaptions).map(([locale, caption]) => {
    const id = `passenger-skid-v4-${locale}`;
    return [
      `column/${locale}/taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(settlementRecordsCaptions).map(([locale, caption]) => {
    const id = `settlement-records-v1-${locale}`;
    return [
      `column/${locale}/taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(alleyBicycleCaptions).map(([locale, caption]) => {
    const id = `alley-bicycle-v2-${locale}`;
    return [
      `column/${locale}/taiwan-video-timing-sidewalk-bicycle-alley-scooter-evidence`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(potholeScooterCaptions).map(([locale, caption]) => {
    const id = `pothole-scooter-v2-${locale}`;
    return [
      `column/${locale}/taiwan-manhole-pothole-road-authority-utility-internal-recourse`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(familyCareCaptions).map(([locale, caption]) => {
    const id = `family-care-v1-${locale}`;
    return [
      `column/${locale}/taiwan-accident-family-care-necessity-period`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(workRecordsCaptions).map(([locale, caption]) => {
    const id = `work-records-v1-${locale}`;
    return [
      `column/${locale}/taiwan-car-accident-work-loss-rest-note`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  ...Object.fromEntries(Object.entries(branchModelsCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `branch-models-v1-${assetLocale}`;
    return [
      `column/${locale}/taiwan-company-subsidiary-vs-branch`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  'column/zh-hant/taiwan-motorway-blocking-no-collision-public-danger': {
    id: 'motorway-brake-v2-zh-hant',
    src: '/videos/columns/motorway-brake-v2-zh-hant.mp4',
    poster: '/images/column-videos/motorway-brake-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '前車切入後煞車，後車近距離停住',
    description: '藍色轎車向左移入前方，煞車燈隨後亮起。鏡頭與前車的距離迅速縮短，最後停住，沒有可見碰撞。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立日間假想場景，非本文夜間攔擋案件或原始行車影像的重建。畫面只呈現一次切入與煞停，未呈現反覆攔擋或其他車流，不能用來判斷實際車速、距離、故意或刑事責任。',
  },
  ...Object.fromEntries(Object.entries(cosmeticsCheckCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `cosmetics-check-v1-${assetLocale}`;
    return [
      `column/${locale}/taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  'column/zh-hant/taiwan-bus-stop-illegal-parking-no-contact-criminal-causation': {
    id: 'bus-stop-v2-zh-hant',
    src: '/videos/columns/bus-stop-v2-zh-hant.mp4',
    poster: '/images/column-videos/bus-stop-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '公車旁的機車側倒滑離貨車',
    description: '畫面從機車側倒、騎士已失去平衡時開始，隨後兩者沿路面滑開。後方公車與站區內的黃色計程車保持停住。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立日間假想場景，非本文夜間事故或六路行車紀錄器的重建。影片未呈現先前變換車道、後座乘客、傷亡或現場實測位置，不能據以認定違停、因果關係、刑責或賠償比例。',
  },
  'column/zh-hant/taiwan-ambulance-red-light-emergency-priority-negligence': {
    id: 'ambulance-scooter-v6-zh-hant',
    src: '/videos/columns/ambulance-scooter-v6-zh-hant.mp4',
    poster: '/images/column-videos/ambulance-scooter-v6-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '側倒的機車滑向救護車',
    description: '畫面從騎士失去平衡後開始。側倒的機車滑向救護車，碰到側面後停住；騎士與機車分離，滑到旁邊。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文事故或法院勘驗影像的重建。畫面只有一名騎士，未呈現乘客、號誌、警笛聲、勤務或傷勢，不能據以判斷優先通行權或肇事責任。',
  },
  'column/zh-hant/taiwan-racing-no-contact-joint-tort-liability': {
    id: 'adjacent-rear-end-v3-zh-hant',
    src: '/videos/columns/adjacent-rear-end-v3-zh-hant.mp4',
    poster: '/images/column-videos/adjacent-rear-end-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '藍車追撞銀色車，鄰線紅車未接觸',
    description: '藍色轎車短距離前進，撞上銀色車的後端，引擎蓋隨即變形。鄰線紅車保持停住，沒有接觸另外兩車。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文夜間競駛事故的重建。畫面未呈現競駛、變換車道、第四輛車或傷亡經過，不能用來認定競駛、因果關係或共同侵權責任。',
  },
  ...Object.fromEntries(Object.entries(formationDocumentsCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `formation-documents-v1-${assetLocale}`;
    return [
      `column/${locale}/taiwan-company-establishment-basics`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  'column/zh-hant/taiwan-bus-sudden-braking-passenger-carrier-liability': {
    id: 'bus-braking-v4-zh-hant',
    src: '/videos/columns/bus-braking-v4-zh-hant.mp4',
    poster: '/images/column-videos/bus-braking-v4-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '乘客向前失衡，倒在公車走道上',
    description: '一名已失去平衡的乘客向前倒下，雙手先碰地，身體隨即側倒在走道上。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文案件或原始車內影像的重建。畫面從乘客失衡後開始，未呈現車外原因或完整煞車過程，不能用來判斷傷勢、駕駛過失或客運公司的法律責任。',
  },
  ...Object.fromEntries(Object.entries(gymPauseCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `gym-pause-v1-${assetLocale}`;
    return [
      `column/${locale}/taiwan-gym-injury-lawsuit`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  'column/zh-hant/taiwan-retaliatory-driving-rear-ended-intentional-injury': {
    id: 'braking-scooter-v2-zh-hant',
    src: '/videos/columns/braking-scooter-v2-zh-hant.mp4',
    poster: '/images/column-videos/braking-scooter-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '機車碰上貨車後端，騎士隨車側倒',
    description: '機車迅速接近前方貨車，接觸後機車傾倒、騎士向前側方滑落，貨車向前移開。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文案件或原始行車影像的重建。畫面未呈現爭執、丟擲物品等前因；接觸與倒地動作不能用來認定故意、傷勢或責任比例。',
  },
  ...Object.fromEntries(Object.entries(precisionPartsCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `precision-parts-v1-${assetLocale}`;
    return [
      `column/${locale}/taiwan-semiconductor-market-entry`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  'column/zh-hant/taiwan-parking-wheelstop-latch-service-safety-causation': {
    id: 'parking-contact-v1-zh-hant',
    src: '/videos/columns/parking-contact-v1-zh-hant.mp4',
    poster: '/images/column-videos/parking-contact-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '倒車後，車尾碰到防護柵門閂',
    description: '藍色小客車短距離倒車，車尾碰到固定的門閂後停住，煞車燈保持亮起。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文先碰車輪擋、前移後再倒車的兩段操作重建。畫面中的車輪擋未被碰到；不能據此推定實際車速、設施尺寸、警示是否足夠或任何一方的法律責任。',
  },
  ...Object.fromEntries(Object.entries(logisticsCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `logistics-dock-v1-${assetLocale}`;
    return [
      `column/${locale}/taiwan-logistics-business-setup`,
      { id, src: `/videos/columns/${id}.mp4`, poster: `/images/column-videos/${id}.jpg`, width: 1280, height: 720, ...caption },
    ];
  })),
  'column/zh-hant/taiwan-flying-object-truck-origin-dashcam-evidence': {
    id: 'flying-metal-v4-zh-hant',
    src: '/videos/columns/flying-metal-v4-zh-hant.mp4',
    poster: '/images/column-videos/flying-metal-v4-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '金屬片撞上引擎蓋後，向左彈出畫面',
    description: '行車視角中，一片金屬片迅速撞上銀色引擎蓋左側，翻轉後從畫面左緣離開。引擎蓋留下凹痕與刮痕，前方貨車繼續行駛。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文兩件判決或原始行車影像的重建。金屬片在開場時已位於空中，畫面未交代來源，也未呈現貨車掉落物品；不能據此判斷物品來自哪輛車、是否為貨物或零件，或認定法律責任。',
  },
  // Explicit reviewed translations share the existing fictional shop scene.
  ...Object.fromEntries(Object.entries(businessPremisesCaptions).map(([locale, caption]) => [
    `column/${locale}/taiwan-company-setup-pitch-location`,
    {
      id: 'business-premises-v1-en',
      src: '/videos/columns/business-premises-v1-en.mp4',
      poster: '/images/column-videos/business-premises-v1-en.jpg',
      width: 1280,
      height: 720,
      ...caption,
    },
  ])),
  'column/zh-hant/taiwan-lowered-height-gantry-state-compensation-driver-fault': {
    id: 'gantry-impact-v1-zh-hant',
    src: '/videos/columns/gantry-impact-v1-zh-hant.mp4',
    poster: '/images/column-videos/gantry-impact-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '貨廂上緣撞上限高橫桿，貨車隨後停住',
    description: '藍色駕駛室先從橫桿下方通過，白色貨廂的前端上緣隨即撞上橫桿、向內折損。貨車亮起煞車燈後停住。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，並非本文貨櫃車事故或現場設施的重建。車型、橫桿高度、道路與動作時間均為設定，畫面未呈現事故前的高度調整或警示過程，不能用來判斷實際淨高、警示是否足夠或責任比例。',
  },
  // Independent two-car illustration, not a reconstruction of the article's case.
  ...Object.fromEntries(Object.entries(overtakingCaptions).map(([locale, caption]) => {
    const assetLocale = ['ko', 'en', 'zh-hant', 'ja'].includes(locale) ? locale : 'en';
    const id = `overtaking-cutback-v2-${assetLocale}`;
    return [
      `column/${locale}/taiwan-overtaking-accident-liability`,
      {
        id,
        src: `/videos/columns/${id}.mp4`,
        poster: `/images/column-videos/${id}.jpg`,
        width: 1280,
        height: 720,
        ...caption,
      },
    ];
  })),
  // These explicit translations share the reviewed scene, with their own captions.
  // The slug and source remain fixed; this is not a fallback for other articles.
  ...Object.fromEntries(Object.entries(generalAccidentCaptions).map(([locale, caption]) => [
    `column/${locale}/taiwan-traffic-accident-procedure`,
    {
      id: 'rear-end-simulation-v3-en',
      src: '/videos/columns/rear-end-simulation-v3-en.mp4',
      poster: '/images/column-videos/rear-end-simulation-v3-en.jpg',
      width: 1280,
      height: 720,
      ...caption,
    },
  ])),
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
  'column/fr/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-fr',
    src: '/videos/columns/rear-end-simulation-v3-fr.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-fr.jpg',
    width: 1280,
    height: 720,
    title: 'Un choc arrière pousse une voiture à l’arrêt',
    description: 'Une berline bleu foncé arrive rapidement par la gauche et percute une berline blanche à l’arrêt. Le capot de la voiture bleue se déforme ; la voiture blanche avance sous le choc, puis s’immobilise. Cette vidéo de quatre secondes est sans son.',
    disclosure: 'Scène fictive générée par IA, et non images d’un accident réel. La route, les vitesses, les distances et le moment du choc sont inventés pour l’illustration ; ils ne permettent pas d’établir les responsabilités dans une affaire réelle.',
  },
  'column/de/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-de',
    src: '/videos/columns/rear-end-simulation-v3-de.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-de.jpg',
    width: 1280,
    height: 720,
    title: 'Ein Auffahrstoß schiebt das stehende Auto nach vorn',
    description: 'Ein dunkelblauer Pkw nähert sich zügig von links und fährt auf einen stehenden weißen Pkw auf. Die Motorhaube des blauen Autos knickt ein; das weiße Auto wird nach vorn geschoben und kommt zum Stehen. Das viersekündige Video hat keinen Ton.',
    disclosure: 'Fiktive, KI-generierte Szene, keine Aufnahme eines echten Unfalls. Straßenverlauf, Geschwindigkeiten, Abstände und Kollisionszeitpunkt sind zur Veranschaulichung gewählt und belegen kein Verschulden in einem konkreten Fall.',
  },
  'column/es/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-es',
    src: '/videos/columns/rear-end-simulation-v3-es.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-es.jpg',
    width: 1280,
    height: 720,
    title: 'Un choque por detrás empuja un coche detenido',
    description: 'Un coche azul oscuro se acerca rápidamente desde la izquierda y choca contra un coche blanco detenido. El capó del coche azul se deforma y el blanco se desplaza hacia delante antes de detenerse. Vídeo de cuatro segundos sin sonido.',
    disclosure: 'Escena ficticia generada con IA; no es una grabación de un accidente real. La vía, las velocidades, las distancias y el momento del impacto se han definido para la ilustración y no permiten determinar la responsabilidad en un caso concreto.',
  },
  'column/pt/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-pt',
    src: '/videos/columns/rear-end-simulation-v3-pt.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-pt.jpg',
    width: 1280,
    height: 720,
    title: 'Uma colisão traseira empurra um carro parado',
    description: 'Um automóvel azul-escuro aproxima-se rapidamente pela esquerda e embate na traseira de um automóvel branco parado. O capô do carro azul deforma-se e o branco avança com o impacto antes de parar. Vídeo de quatro segundos, sem som.',
    disclosure: 'Cena fictícia gerada por IA, não uma gravação de um acidente real. A via, as velocidades, as distâncias e o momento do embate foram definidos para a ilustração e não permitem determinar a responsabilidade num caso concreto.',
  },
  'column/it/taiwan-traffic-accident-procedure': {
    id: 'rear-end-simulation-v3-it',
    src: '/videos/columns/rear-end-simulation-v3-it.mp4',
    poster: '/images/column-videos/rear-end-simulation-v3-it.jpg',
    width: 1280,
    height: 720,
    title: 'Un tamponamento spinge in avanti l’auto ferma',
    description: 'Un’auto blu scuro arriva rapidamente da sinistra e tampona un’auto bianca ferma. Il cofano dell’auto blu si deforma; l’auto bianca viene spinta in avanti e poi si ferma. Il video dura quattro secondi ed è senza audio.',
    disclosure: 'Scena fittizia generata con IA, non la ripresa di un incidente reale. Strada, velocità, distanze e momento dell’urto sono scelte illustrative e non consentono di stabilire la responsabilità in un caso concreto.',
  },
  'column/ko/taiwan-left-turn-vs-straight-motorcycle': {
    id: 'left-turn-scooter-v1-ko',
    src: '/videos/columns/left-turn-scooter-v1-ko.mp4',
    poster: '/images/column-videos/left-turn-scooter-v1-ko.jpg',
    width: 1280,
    height: 720,
    title: '좌회전 차량과 맞은편 오토바이가 부딪히는 장면',
    description: '흰색 승용차가 좌회전할 때 맞은편에서 다가온 청록색 오토바이가 차 앞부분과 부딪힙니다. 차량이 멈추고, 오토바이와 운전자는 화면 왼쪽으로 넘어집니다. 소리가 없는 4초 영상입니다.',
    disclosure: 'AI로 만든 독립된 가상 충돌 장면입니다. 본문에 소개한 판결이나 비접촉 사고를 재현한 영상이 아닙니다. 도로·접촉 위치·동작 시간은 설정이며, 실제 속도·부상·회피 가능성·과실비율을 판단하는 자료로 사용할 수 없습니다.',
  },
  'column/en/taiwan-left-turn-vs-straight-motorcycle': {
    id: 'left-turn-scooter-v1-en',
    src: '/videos/columns/left-turn-scooter-v1-en.mp4',
    poster: '/images/column-videos/left-turn-scooter-v1-en.jpg',
    width: 1280,
    height: 720,
    title: 'An oncoming scooter strikes a left-turning car',
    description: 'A white sedan turns left across the path of an oncoming teal scooter. The scooter contacts the car near its front corner, then the scooter and rider fall to the left as the car stops. This four-second clip has no sound.',
    disclosure: 'This is an independent fictional AI-generated collision, not a reconstruction of any judgment discussed here or of the no-contact fall. The road, contact point and timing are invented; they cannot establish actual speed, injury, avoidance opportunities or fault percentages.',
  },
  'column/zh-hant/taiwan-left-turn-vs-straight-motorcycle': {
    id: 'left-turn-scooter-v1-zh-hant',
    src: '/videos/columns/left-turn-scooter-v1-zh-hant.mp4',
    poster: '/images/column-videos/left-turn-scooter-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '左轉汽車與對向機車碰撞，騎士隨後倒地',
    description: '白色轎車向左轉，對向駛來的藍綠色機車撞上汽車前側。機車與騎士往畫面左側倒下，汽車在路口停住。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想碰撞場景，未重現本文任何判決，也不是文中無接觸摔車案的重建。道路、接觸位置與動作時間均為設定，不能據此判斷實際車速、傷勢、避讓可能性或過失比例。',
  },
  'column/zh-hant/taiwan-flashing-red-yellow-intersection-liability': {
    id: 'flashing-intersection-v1-zh-hant',
    src: '/videos/columns/flashing-intersection-v1-zh-hant.mp4',
    poster: '/images/column-videos/flashing-intersection-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '兩車在紅、黃燈明滅的路口相撞',
    description: '藍車從左側進入路口，車頭撞上由下方駛入的紅車左側。藍車引擎蓋與紅車側面變形，兩車隨後停住，上方紅、黃燈反覆明滅。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想情境，將藍車行向設定為閃黃、紅車行向設定為閃紅，與文內兩段式示意圖是不同設定，也未重現本文兩件判決。燈光節奏、路形與車輛動作均為製作設定，不能用來認定實際車速、停讓過程、反應餘裕或過失比例。',
  },
  'column/zh-hant/green-light-red-light-pedestrian-third-person': {
    id: 'pedestrian-third-person-v1-zh-hant',
    src: '/videos/columns/pedestrian-third-person-v1-zh-hant.mp4',
    poster: '/images/column-videos/pedestrian-third-person-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '車頭碰上穿越斑馬線的行人，行人隨後倒地',
    description: '銀色轎車向畫面右側行駛，車頭碰到正在穿越斑馬線的行人後停住。行人失去平衡，雙手撐地、坐倒路面；另外兩人留在對側人行道上。這是4秒無聲影片。',
    disclosure: 'AI生成的白天假想場景，非本文夜間事故或法院勘驗影像的重建。路形、人物位置、碰撞部位及動作時間均為設定；畫面未呈現號誌，不能用來認定燈號、駕駛視線、反應時間、實際傷勢或法律責任。',
  },
  'column/zh-hant/taiwan-gas-station-tanker-reversing-beeper-liability': {
    id: 'tanker-reversing-v1-zh-hant',
    src: '/videos/columns/tanker-reversing-v1-zh-hant.mp4',
    poster: '/images/column-videos/tanker-reversing-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '油罐車倒車，車尾撞上藍色轎車右後角',
    description: '銀色油罐車向畫面左側後退，後保險桿碰撞藍色轎車右後角。藍車車尾晃動，鈑金與保險桿變形，少量碎片落地，兩車隨後停住。這是4秒無聲影片。',
    disclosure: 'AI生成的白天假想場景，非本文凌晨事故或判決勘驗影像的重建。車輛位置、碰撞側別與時間均為設定；無聲畫面不能證明蜂鳴器或喇叭是否響起，也不能用來判定是否已盡注意義務或責任比例。',
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
  'column/zh-hant/taiwan-car-repair-cost-estimate-parts-depreciation': {
    id: 'repair-workshop-v1-zh-hant',
    src: '/videos/columns/repair-workshop-v1-zh-hant.mp4',
    poster: '/images/column-videos/repair-workshop-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '修車廠內，鏡頭靠近車頭側邊的凹痕與刮痕',
    description: '銀色車停在修車廠內，鏡頭逐漸靠近前輪上方的鈑金與保險桿，呈現原有的凹痕和刮痕。車輛沒有移動，也沒有進行修理。這是6秒無聲影片。',
    disclosure: 'AI生成的假想場景，非本文判決車輛或真實受損紀錄。畫面不能證明修復必要性、零件是否需更換、折舊或修理費用。',
  },
  'column/zh-hant/taiwan-truck-blocking-multiple-dashcam-evidence': {
    id: 'truck-blocking-v2-zh-hant',
    src: '/videos/columns/truck-blocking-v2-zh-hant.mp4',
    poster: '/images/column-videos/truck-blocking-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '貨車切入藍色車前方，兩車隨即碰撞',
    description: '米白色貨車向畫面右下方斜切，藍色車沿原方向向右行駛。藍車車頭撞上貨車側邊，引擎蓋掀起變形，兩車停下。這是單一固定視角的4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文判決或四組原始影像的重建。路形、車損與動作時間均為設定，不能據此認定故意、車速、反應時間或責任。',
  },
  'column/zh-hant/taiwan-car-door-opening-motorcycle-liability': {
    id: 'car-door-v2-zh-hant',
    src: '/videos/columns/car-door-v2-zh-hant.mp4',
    poster: '/images/column-videos/car-door-v2-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '機車撞上打開的車門，騎士失去平衡倒地',
    description: '銀色車停在路邊，前車門向道路打開。向左行駛的藍綠色機車撞上車門，騎士短暫撐腳後向左前方倒下，機車也側倒在路面上。這是4秒無聲影片。',
    disclosure: 'AI生成的獨立假想場景，非本文兩件判決的重建。畫面沒有測量車距、開門速度或反應時間；倒地動作不能證明受傷、避讓能力或責任。',
  },
  'column/zh-hant/taiwan-car-repair-rental-cost-repair-period-evidence': {
    id: 'repair-workshop-v1-zh-hant',
    src: '/videos/columns/repair-workshop-v1-zh-hant.mp4',
    poster: '/images/column-videos/repair-workshop-v1-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '受損車輛停在廠內，畫面沒有交代停留多久',
    description: '鏡頭靠近銀色車前輪旁的凹痕與刮痕，車輛始終停在修車廠內。影片沒有呈現施工、進出廠或租車紀錄。這是6秒無聲影片。',
    disclosure: 'AI生成的假想場景，非本文案件的車輛或維修紀錄。車停在廠內的畫面不能證明不能用車、修理需要幾天，或應賠多少租車費。',
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
  'column/ko/taiwan-road-rage-started-did-not-matter-driver-blocked': {
    id: 'road-rage-started-did-not-matter-driver-blocked-v3-ko',
    src: '/videos/columns/road-rage-started-did-not-matter-driver-blocked-v3-ko.mp4',
    poster: '/images/column-videos/road-rage-started-did-not-matter-driver-blocked-v3-ko.jpg',
    width: 1280,
    height: 720,
    title: '막대를 든 사람이 차문 쪽으로 팔을 뻗는 장면',
    description: '낮의 내리막길에서 긴 막대를 든 사람이 회색 세단의 열린 앞문 옆에 서 있다가, 차문 쪽으로 다른 팔을 뻗은 뒤 내립니다. 시점이 서서히 가까워지면서 차와 사람이 화면에서 점점 크게 보입니다. 소리 없는 약 15초 영상이 반복 재생됩니다.',
    disclosure: 'AI로 만든 가상 장면으로, 실제 블랙박스 영상이나 판결에 나온 사실관계를 재현한 영상이 아닙니다. 거리와 속도, 시간 표현은 설명을 위한 것이며 실제 사건의 과실이나 책임을 판단하는 근거로 사용할 수 없습니다.',
    loop: true,
  },
  'column/ja/taiwan-road-rage-started-did-not-matter-driver-blocked': {
    id: 'road-rage-started-did-not-matter-driver-blocked-v3-ja',
    src: '/videos/columns/road-rage-started-did-not-matter-driver-blocked-v3-ja.mp4',
    poster: '/images/column-videos/road-rage-started-did-not-matter-driver-blocked-v3-ja.jpg',
    width: 1280,
    height: 720,
    title: '棒を持つ人が開いた車のドアへ腕を伸ばす場面',
    description: '昼間の下り坂で、長い棒を持った人が灰色のセダンの開いたドアの横に立ち、もう一方の腕をドアの方へ伸ばしてから下ろします。視点がゆっくりと近づき、車と人が画面の中で大きくなっていきます。約15秒の無音動画が繰り返し再生されます。',
    disclosure: 'AIで生成した架空の場面であり、実際のドライブレコーダー映像や、判決に記された事実関係を再現した映像ではありません。距離・速度・時間は説明用のもので、実際の事件や事故の過失や責任を判断する根拠にはできません。',
    loop: true,
  },
  'column/en/taiwan-road-rage-started-did-not-matter-driver-blocked': {
    id: 'road-rage-started-did-not-matter-driver-blocked-v3-en',
    src: '/videos/columns/road-rage-started-did-not-matter-driver-blocked-v3-en.mp4',
    poster: '/images/column-videos/road-rage-started-did-not-matter-driver-blocked-v3-en.jpg',
    width: 1280,
    height: 720,
    title: 'Person holding a stick reaches toward an open car door',
    description: 'In daylight on a downhill road, a person holding a long stick stands beside the open front door of a gray sedan, extends their free arm toward the door, then lowers it. The view slowly moves closer, making the car and person appear larger. This silent clip lasts about 15 seconds and plays on a loop.',
    disclosure: 'This fictional scene was generated with AI; it is not dashcam footage or a reconstruction of the facts in the judgment. Distances, speeds and timing are illustrative and cannot be used to determine fault in any real case.',
    loop: true,
  },
  'column/zh-hant/taiwan-road-rage-started-did-not-matter-driver-blocked': {
    id: 'road-rage-started-did-not-matter-driver-blocked-v3-zh-hant',
    src: '/videos/columns/road-rage-started-did-not-matter-driver-blocked-v3-zh-hant.mp4',
    poster: '/images/column-videos/road-rage-started-did-not-matter-driver-blocked-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '持棍者朝敞開的車門伸出手臂',
    description: '白天的下坡路上，一個人拿著長棍站在灰色轎車敞開的車門旁，朝車門伸出另一隻手臂，隨後放下。視角緩緩靠近，人與車在畫面中逐漸變大。這段無聲影片長約15秒，會循環播放。',
    disclosure: '這是 AI 生成的虛構場景，不是行車紀錄器實拍影像，也不是判決所載事實的重現。畫面中的距離、速度與時間安排僅供示意，不能用來判斷任何真實案件的過失或責任。',
    loop: true,
  },
  'column/ko/taiwan-road-rage-reversing-into-tailgater-no-self-defense': {
    id: 'road-rage-reversing-into-tailgater-no-self-defense-v4-ko',
    src: '/videos/columns/road-rage-reversing-into-tailgater-no-self-defense-v4-ko.mp4',
    poster: '/images/column-videos/road-rage-reversing-into-tailgater-no-self-defense-v4-ko.jpg',
    width: 1280,
    height: 720,
    ...reverseDashcamCaptions['ko'],
    loop: true,
  },
  'column/ja/taiwan-road-rage-reversing-into-tailgater-no-self-defense': {
    id: 'road-rage-reversing-into-tailgater-no-self-defense-v4-ja',
    src: '/videos/columns/road-rage-reversing-into-tailgater-no-self-defense-v4-ja.mp4',
    poster: '/images/column-videos/road-rage-reversing-into-tailgater-no-self-defense-v4-ja.jpg',
    width: 1280,
    height: 720,
    ...reverseDashcamCaptions['ja'],
    loop: true,
  },
  'column/en/taiwan-road-rage-reversing-into-tailgater-no-self-defense': {
    id: 'road-rage-reversing-into-tailgater-no-self-defense-v4-en',
    src: '/videos/columns/road-rage-reversing-into-tailgater-no-self-defense-v4-en.mp4',
    poster: '/images/column-videos/road-rage-reversing-into-tailgater-no-self-defense-v4-en.jpg',
    width: 1280,
    height: 720,
    ...reverseDashcamCaptions['en'],
    loop: true,
  },
  'column/zh-hant/taiwan-road-rage-reversing-into-tailgater-no-self-defense': {
    id: 'road-rage-reversing-into-tailgater-no-self-defense-v4-zh-hant',
    src: '/videos/columns/road-rage-reversing-into-tailgater-no-self-defense-v4-zh-hant.mp4',
    poster: '/images/column-videos/road-rage-reversing-into-tailgater-no-self-defense-v4-zh-hant.jpg',
    width: 1280,
    height: 720,
    ...reverseDashcamCaptions['zh-hant'],
    loop: true,
  },
  'column/ko/taiwan-road-rage-freeway-cut-in-sentence-reduced': {
    id: 'road-rage-freeway-cut-in-sentence-reduced-v3-ko',
    src: '/videos/columns/road-rage-freeway-cut-in-sentence-reduced-v3-ko.mp4',
    poster: '/images/column-videos/road-rage-freeway-cut-in-sentence-reduced-v3-ko.jpg',
    width: 1280,
    height: 720,
    title: '흰색 탑차가 좌우로 틀다가 바로 앞 차로로 끼어드는 장면',
    description: '바로 앞을 달리던 흰색 소형 탑차가 오른쪽으로 크게 틀었다가 다시 왼쪽으로 꺾어 들어와 정면 차로에 자리 잡습니다. 이후 탑차는 후미등을 켠 채 앞에서 달리고, 촬영 차량은 일정한 간격을 두고 뒤따르며 양옆 차로의 차들도 그대로 흘러갑니다. 소리 없는 약 15초 길이의 영상이며, 화면에 들어오면 자동으로 재생되며 반복됩니다.',
    disclosure: 'AI로 만든 가상 장면이며, 실제 블랙박스 영상이나 판결이 인정한 사실을 재현한 것이 아닙니다. 영상 속 거리·속도·시간 간격은 이해를 돕기 위해 임의로 정한 것이어서 실제 사건의 과실을 판단하는 근거로 쓸 수 없습니다.',
    loop: true,
  },
  'column/ja/taiwan-road-rage-freeway-cut-in-sentence-reduced': {
    id: 'road-rage-freeway-cut-in-sentence-reduced-v3-ja',
    src: '/videos/columns/road-rage-freeway-cut-in-sentence-reduced-v3-ja.mp4',
    poster: '/images/column-videos/road-rage-freeway-cut-in-sentence-reduced-v3-ja.jpg',
    width: 1280,
    height: 720,
    title: '白い箱型トラックが左右に振れてから前の車線に割り込む場面',
    description: 'すぐ前を走っていた白い箱型の小型トラックが右へ大きく向きを変えたあと、左へ切り返して正面の車線に収まります。その後トラックは後部ランプを点けたまま前を走り、撮影車両は一定の車間をあけて後ろを進みます。左右の車線の車もそのまま流れていきます。音声のない約15秒の映像で、画面に入ると自動で再生され、繰り返し流れます。',
    disclosure: 'AIで生成した架空の場面であり、実際のドライブレコーダー映像でも、判決が認定した事実を再現したものでもありません。距離や速度、タイミングは説明のために仮に設定したもので、実際の事件の過失を判断する材料にはなりません。',
    loop: true,
  },
  'column/en/taiwan-road-rage-freeway-cut-in-sentence-reduced': {
    id: 'road-rage-freeway-cut-in-sentence-reduced-v3-en',
    src: '/videos/columns/road-rage-freeway-cut-in-sentence-reduced-v3-en.mp4',
    poster: '/images/column-videos/road-rage-freeway-cut-in-sentence-reduced-v3-en.jpg',
    width: 1280,
    height: 720,
    title: 'A white box truck swings right, then cuts back into the lane ahead',
    description: 'A white box truck just ahead swings sharply to the right, then turns back left and settles into the lane directly in front. It carries on ahead with its rear lights on while the camera car follows at a steady distance and traffic in the other lanes keeps moving. The clip is silent, about 15 seconds long, and starts automatically when visible, then loops.',
    disclosure: 'This is a fictional AI-generated scene, not dashcam footage and not a reconstruction of the facts found in the judgment. Distances, speeds and timing are illustrative only and cannot be used to judge fault in any real case.',
    loop: true,
  },
  'column/zh-hant/taiwan-road-rage-freeway-cut-in-sentence-reduced': {
    id: 'road-rage-freeway-cut-in-sentence-reduced-v3-zh-hant',
    src: '/videos/columns/road-rage-freeway-cut-in-sentence-reduced-v3-zh-hant.mp4',
    poster: '/images/column-videos/road-rage-freeway-cut-in-sentence-reduced-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '白色廂型小貨車左右擺動後切入正前方車道',
    description: '正前方的白色廂型小貨車先大幅往右偏，再往左切回，停在正前方車道上。之後小貨車亮著尾燈在前方行駛，拍攝車輛保持固定車距跟在後面，兩側車道的車輛也照常行駛。這段影片沒有聲音，長約15秒，進入畫面時會自動播放並循環。',
    disclosure: '這是AI生成的虛構畫面，不是行車紀錄器實錄，也不是依判決認定事實所做的重建。畫面中的距離、車速與時間都只是示意，不能用來判斷任何真實案件的過失責任。',
    loop: true,
  },
  'column/ko/taiwan-road-rage-baseball-bat-fracture-damages': {
    id: 'road-rage-baseball-bat-fracture-damages-v3-ko',
    src: '/videos/columns/road-rage-baseball-bat-fracture-damages-v3-ko.mp4',
    poster: '/images/column-videos/road-rage-baseball-bat-fracture-damages-v3-ko.jpg',
    width: 1280,
    height: 720,
    title: '야구방망이를 든 남성이 골목 한가운데로 나와 멈춰 서는 장면',
    description: '해 질 무렵 주택가 골목에서, 짙은 회색 해치백 옆에 있던 남성이 야구방망이를 아래로 든 채 차 옆을 서성이다가 골목 한가운데로 나와 카메라 앞쪽에 멈춰 섭니다. 마지막에는 등을 보인 채 서 있고, 앞차는 후미등을 켠 채 그 자리에 서 있습니다. 소리 없는 약 15초 길이의 영상이며, 화면에 들어오면 자동으로 재생되며 반복됩니다.',
    disclosure: 'AI로 만든 가상의 장면이며, 실제 블랙박스 영상도 판결이 인정한 사실을 재현한 영상도 아닙니다. 화면의 녹화(REC) 표시와 경과 시간은 연출이고, 영상 속 거리·속도·시간은 예시일 뿐이어서 실제 사건에서 누구의 잘못인지 판단하는 근거가 될 수 없습니다.',
    loop: true,
  },
  'column/ja/taiwan-road-rage-baseball-bat-fracture-damages': {
    id: 'road-rage-baseball-bat-fracture-damages-v3-ja',
    src: '/videos/columns/road-rage-baseball-bat-fracture-damages-v3-ja.mp4',
    poster: '/images/column-videos/road-rage-baseball-bat-fracture-damages-v3-ja.jpg',
    width: 1280,
    height: 720,
    title: 'バットを持った男性が路地の中ほどに出て立ち止まる場面',
    description: '夕暮れの住宅街の路地で、濃いグレーのハッチバックの横にいた男性が、バットを下げたまま車のそばを行き来したあと、路地の中ほどに出てカメラの手前で立ち止まります。最後は背中を向けたまま立っており、前の車はテールランプを点けたままその場から動きません。音声のない約15秒の映像で、画面に入ると自動で再生され、繰り返し流れます。',
    disclosure: 'AIで生成した架空の場面で、実際のドライブレコーダー映像でも、判決が認定した事実の再現でもありません。画面の録画（REC）表示と経過時間は演出であり、映像中の距離・速度・タイミングはあくまで例示のため、実際の事件で誰に非があるかを判断する材料にはなりません。',
    loop: true,
  },
  'column/en/taiwan-road-rage-baseball-bat-fracture-damages': {
    id: 'road-rage-baseball-bat-fracture-damages-v3-en',
    src: '/videos/columns/road-rage-baseball-bat-fracture-damages-v3-en.mp4',
    poster: '/images/column-videos/road-rage-baseball-bat-fracture-damages-v3-en.jpg',
    width: 1280,
    height: 720,
    title: 'A man holding a baseball bat steps into the middle of the lane and stops',
    description: 'At dusk in a residential lane, a man beside a stopped dark grey hatchback paces by the car with a baseball bat held low, then steps into the middle of the lane and stops in front of the camera, ending with his back turned. The hatchback stays put with its tail lights on. The clip is silent, about 15 seconds long, and starts automatically when visible, then loops.',
    disclosure: 'This is a fictional AI-generated scene, not dashcam footage and not a reconstruction of the facts found in the judgment. The REC marker and elapsed-time counter are added for effect, and the distances, speeds and timing shown are illustrative only; they cannot be used to judge fault in any real case.',
    loop: true,
  },
  'column/zh-hant/taiwan-road-rage-baseball-bat-fracture-damages': {
    id: 'road-rage-baseball-bat-fracture-damages-v3-zh-hant',
    src: '/videos/columns/road-rage-baseball-bat-fracture-damages-v3-zh-hant.mp4',
    poster: '/images/column-videos/road-rage-baseball-bat-fracture-damages-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '手持球棒的男子走到巷道中央後停下',
    description: '黃昏的住宅區巷道裡，原本站在深灰色掀背車旁的男子，球棒垂在身側，在車旁來回走動後走到巷道中央，停在鏡頭前方，最後背對鏡頭站著。掀背車亮著尾燈，停在原地沒有移動。本片無聲，長約15秒，進入畫面時會自動播放並循環。',
    disclosure: '本片為AI生成的虛構場景，不是行車紀錄器實錄，也不是判決認定事實的重現。畫面上的錄影（REC）標示與計時僅為效果，片中的距離、速度與時間皆為示意，不能用來判斷任何真實案件的責任歸屬。',
    loop: true,
  },
  'column/ko/taiwan-road-rage-driver-stopped-route-66s-fast-lane': {
    id: 'road-rage-driver-stopped-route-66s-fast-lane-v3-ko',
    src: '/videos/columns/road-rage-driver-stopped-route-66s-fast-lane-v3-ko.mp4',
    poster: '/images/column-videos/road-rage-driver-stopped-route-66s-fast-lane-v3-ko.jpg',
    width: 1280,
    height: 720,
    title: '앞 SUV의 브레이크등이 밝아지고 간격이 좁아지는 장면',
    description: '밤의 다차로 도로에서 앞서가는 짙은 회색 SUV와의 간격이 잠시 벌어졌다가, SUV의 브레이크등이 밝아지면서 다시 좁아집니다. 이후 브레이크등이 어두워지며 SUV는 계속 달리고, 흰색과 검은색 차량들이 옆을 지나갑니다. 소리가 없는 약 15초 길이의 영상이며, 재생 버튼을 누르면 반복 재생됩니다.',
    disclosure: 'AI로 만든 가상 장면이며, 실제 블랙박스 영상이나 판결이 인정한 사실을 재현한 영상이 아닙니다. 깜빡이는 REC와 경과 시간 표시는 덧붙인 화면 효과입니다. 영상 속 거리와 속도, 동작이 일어나는 시점은 설명을 위한 설정이며, 실제 사건의 과실을 판단하는 근거로 쓸 수 없습니다.',
    loop: true,
  },
  'column/ja/taiwan-road-rage-driver-stopped-route-66s-fast-lane': {
    id: 'road-rage-driver-stopped-route-66s-fast-lane-v3-ja',
    src: '/videos/columns/road-rage-driver-stopped-route-66s-fast-lane-v3-ja.mp4',
    poster: '/images/column-videos/road-rage-driver-stopped-route-66s-fast-lane-v3-ja.jpg',
    width: 1280,
    height: 720,
    title: 'ブレーキランプが光るSUVとの車間が詰まる場面',
    description: '夜の道路で、前を走る濃いグレーのSUVとの車間がいったん広がったあと、ブレーキランプが明るくなり、車間が再び詰まります。やがてランプの光が弱まり、SUVが走り続ける横を白や黒の車が通り過ぎます。音声のない約15秒の映像で、再生ボタンを押すと繰り返し再生されます。',
    disclosure: 'AIで生成した架空の場面で、実際のドライブレコーダー映像でも、判決が認定した事実の再現でもありません。点滅するRECマークと経過時間の表示は、あとから加えた画面上の演出です。映像内の距離・速度・動作のタイミングは説明用の設定であり、実際の事件で過失を判断する根拠にはなりません。',
    loop: true,
  },
  'column/en/taiwan-road-rage-driver-stopped-route-66s-fast-lane': {
    id: 'road-rage-driver-stopped-route-66s-fast-lane-v3-en',
    src: '/videos/columns/road-rage-driver-stopped-route-66s-fast-lane-v3-en.mp4',
    poster: '/images/column-videos/road-rage-driver-stopped-route-66s-fast-lane-v3-en.jpg',
    width: 1280,
    height: 720,
    title: 'An SUV\'s brake lights brighten as the gap closes',
    description: 'On a multi-lane road at night, a dark gray SUV ahead first moves farther away, then its brake lights brighten and the gap closes. Its brake lights then dim as it continues along the road, with white and black vehicles passing alongside. This silent clip is about 15 seconds long and loops once you press play.',
    disclosure: 'This is a fictional AI-generated scene, not dashcam footage or a reconstruction of the facts in the judgment. The blinking REC marker and elapsed-time counter are added visual effects. Distances, speeds and timing are illustrative only and cannot be used to judge fault in any real case.',
    loop: true,
  },
  'column/zh-hant/taiwan-road-rage-driver-stopped-route-66s-fast-lane': {
    id: 'road-rage-driver-stopped-route-66s-fast-lane-v3-zh-hant',
    src: '/videos/columns/road-rage-driver-stopped-route-66s-fast-lane-v3-zh-hant.mp4',
    poster: '/images/column-videos/road-rage-driver-stopped-route-66s-fast-lane-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '前方休旅車煞車燈亮起，車距縮短',
    description: '夜間的多車道道路上，與前方深灰色休旅車的距離先拉開，接著它的煞車燈變亮，車距逐漸縮短。煞車燈隨後變暗，休旅車繼續前進，白色與黑色車輛從旁駛過。本片無聲，長約15秒，按下播放後會循環播放。',
    disclosure: '這是AI生成的虛構場景，不是行車紀錄器實錄，也不是判決認定事實的重現。閃爍的REC標示與經過時間計數器，都是後製加上的畫面效果。片中的距離、速度與動作發生的時間點僅供示意，不能用來判斷任何實際案件的過失責任。',
    loop: true,
  },
  'column/ko/taiwan-road-rage-freeway-chase-own-dashcam-too': {
    id: 'road-rage-freeway-chase-own-dashcam-too-v3-ko',
    src: '/videos/columns/road-rage-freeway-chase-own-dashcam-too-v3-ko.mp4',
    poster: '/images/column-videos/road-rage-freeway-chase-own-dashcam-too-v3-ko.jpg',
    width: 1280,
    height: 720,
    title: '검은색 세단이 차로로 들어와 흰색 세단과 나란히 달리는 장면',
    description: '해 질 녘 고가도로 분기점에서 검은색 세단이 오른쪽 흰 빗금 구역 가장자리에서 왼쪽으로 움직이며 차로에 들어옵니다. 이어 오른쪽으로 이동해 왼쪽 차로의 흰색 세단과 나란히 달립니다. 소리 없는 약 15초 길이의 영상이며 반복 재생됩니다.',
    disclosure: 'AI로 만든 가상 장면이며, 실제 블랙박스 영상이나 판결이 인정한 사실의 재현이 아닙니다. REC 표시는 연출이며 오른쪽 위 숫자는 날짜나 속도가 아닌 재생 경과 시간입니다. 차간 거리와 속도, 움직임의 타이밍은 설명을 위한 예시이며 실제 사건의 과실을 판단하는 근거로 사용할 수 없습니다.',
    loop: true,
  },
  'column/ja/taiwan-road-rage-freeway-chase-own-dashcam-too': {
    id: 'road-rage-freeway-chase-own-dashcam-too-v3-ja',
    src: '/videos/columns/road-rage-freeway-chase-own-dashcam-too-v3-ja.mp4',
    poster: '/images/column-videos/road-rage-freeway-chase-own-dashcam-too-v3-ja.jpg',
    width: 1280,
    height: 720,
    title: '黒いセダンが車線に入り、白いセダンと並んで走る場面',
    description: '夕暮れの高架道路の分岐点で、黒いセダンが右側の白い斜線区画の縁から左へ動き、車線に入ってきます。続いて右へ移り、左車線の白いセダンと並んで走ります。音声のない約15秒の動画で、繰り返し再生されます。',
    disclosure: 'AIで生成した架空の場面で、実際のドライブレコーダー映像でも、判決が認定した事実の再現でもありません。REC表示は演出で、右上の数字は日付や速度ではなく、再生開始からの経過時間です。車間距離や速度、動きのタイミングは説明のためのもので、実際の事件で過失を判断する根拠には使えません。',
    loop: true,
  },
  'column/en/taiwan-road-rage-freeway-chase-own-dashcam-too': {
    id: 'road-rage-freeway-chase-own-dashcam-too-v3-en',
    src: '/videos/columns/road-rage-freeway-chase-own-dashcam-too-v3-en.mp4',
    poster: '/images/column-videos/road-rage-freeway-chase-own-dashcam-too-v3-en.jpg',
    width: 1280,
    height: 720,
    title: 'A black sedan moves into a lane alongside a white sedan',
    description: 'At a road split at dusk, a black sedan moves left from beside the white-hatched area into a lane. It then moves right and travels alongside a white sedan in the lane to its left. The clip is silent, lasts about 15 seconds and plays on a loop.',
    disclosure: 'This is a fictional AI-generated scene, not dashcam footage or a reconstruction of the facts established in the judgment. The REC marker is a visual effect, and the numbers at the top right show elapsed playback time, not a date or speed. Distances, speeds and timing are illustrative and cannot be used to judge fault in any real case.',
    loop: true,
  },
  'column/zh-hant/taiwan-road-rage-freeway-chase-own-dashcam-too': {
    id: 'road-rage-freeway-chase-own-dashcam-too-v3-zh-hant',
    src: '/videos/columns/road-rage-freeway-chase-own-dashcam-too-v3-zh-hant.mp4',
    poster: '/images/column-videos/road-rage-freeway-chase-own-dashcam-too-v3-zh-hant.jpg',
    width: 1280,
    height: 720,
    title: '黑色轎車駛入車道，與白色轎車並行',
    description: '黃昏的高架道路分岔處，黑色轎車從右側白色槽化線區域的邊緣向左駛入車道。接著黑車向右移動，與左側車道的白色轎車並排行駛。影片無聲，長約15秒，會循環播放。',
    disclosure: '這是AI生成的虛構場景，不是真實的行車紀錄器影像，也不是判決認定事實的重建。REC標記是模擬效果，右上角的數字表示播放經過的時間，不是日期或車速。片中的車距、車速及動作發生的時間僅供示意，不能作為判斷任何真實案件肇事責任的依據。',
    loop: true,
  },
};

export function getColumnGeneratedVideo(
  locale: string,
  slug: string,
  source: ColumnVideoSource = 'column',
): ColumnGeneratedVideoAsset | null {
  const key = `${source}/${locale}/${slug}`;
  return (trafficFilms as Readonly<Record<string, ColumnGeneratedVideoAsset>>)[key]
    ?? REVIEWED_COLUMN_VIDEOS[key]
    ?? null;
}
