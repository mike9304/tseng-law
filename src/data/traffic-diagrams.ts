import type { SiteLocale } from '@/lib/locales';

/**
 * Animated Blender diagrams for the traffic-accident pages.
 *
 * The column loader strips inline markdown images (`stripInlineImages`), so a
 * column opts in through frontmatter instead of the body:
 *
 *   diagram_video: "overtaking-012"            # id in TRAFFIC_DIAGRAMS
 *   diagram_video_after: "<## heading text>"   # optional: place the figure after
 *                                              # the first paragraph of that section
 *
 * Rules (tseng-blender-pilot/traffic/ROUTINE.md): no text inside the frames
 * (number badges only), the clip freezes just before contact, only facts from
 * the source account are drawn, and every caption carries the
 * illustrative-assumption note.
 */
export type TrafficDiagramLocale = Extract<SiteLocale, 'ko' | 'zh-hant' | 'en' | 'ja'>;

export type TrafficDiagramCopy = {
  alt: string;
  legend: string;
  caption: string;
  assumption: string;
};

export type TrafficDiagram = {
  id: string;
  mp4: string;
  webm: string;
  mobileMp4: string;
  mobileWebm: string;
  poster: string;
  mobilePoster: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  durationSeconds: number;
  copy: Record<TrafficDiagramLocale, TrafficDiagramCopy>;
};

export const TRAFFIC_DIAGRAM_MOBILE_QUERY = '(max-width: 640px)';

export const TRAFFIC_DIAGRAMS = {
  'overtaking-012': {
    id: 'overtaking-012',
    mp4: '/videos/traffic/overtaking-012.mp4',
    webm: '/videos/traffic/overtaking-012.webm',
    mobileMp4: '/videos/traffic/overtaking-012-mobile.mp4',
    mobileWebm: '/videos/traffic/overtaking-012-mobile.webm',
    poster: '/images/traffic/overtaking-012-poster.webp',
    mobilePoster: '/images/traffic/overtaking-012-poster-mobile.webp',
    width: 1920,
    height: 1080,
    mobileWidth: 1080,
    mobileHeight: 1350,
    durationSeconds: 6.57,
    copy: {
      ko: {
        alt: '설명용 3D 애니메이션. 오토바이 A가 반대 차로 쪽으로 나가 1호·2호 차량을 앞지르려 하고, 2호 차량이 방향지시등을 켠 뒤 같은 쪽으로 들어옵니다. 충돌 직전에서 멈춥니다.',
        legend: '1 흰색 1호 차량 · 2 노란색 2호 차량 · A 초록색 오토바이(동승자 B) · 색 띠는 지나온 경로',
        caption: '1호 차량이 천천히 진행하고 2호 차량과 오토바이 A가 뒤따르던 중, A가 두 차량을 앞지르려고 반대 차로에 들어가 가속합니다. 2호 차량은 방향지시등을 켠 뒤 1초도 되지 않아 반대 차로로 진입합니다. 애니메이션은 충돌 직전에서 멈춥니다.',
        assumption: '설명용 가정값: 원문에 수치가 없어 정확한 속도·거리·시각은 가정했고, 원문에 없는 도로 모양·차선 표시는 그리지 않았습니다. 2호 차량이 방향지시등을 켠 뒤 1초가 되기 전에 반대 차로로 들어가는 순서만 원문을 따랐습니다. 실제 감정 결과나 과실비율을 나타내지 않으며, 숫자와 A는 차량을 구분하는 표시입니다.',
      },
      'zh-hant': {
        alt: '說明用 3D 動畫：機車 A 駛向對向車道，欲超越 1 號車與 2 號車；2 號車開啟方向燈後也駛入同一側。動畫停在碰撞之前。',
        legend: '1 白色 1 號車 · 2 黃色 2 號車 · A 綠色機車（乘客 B）· 色帶為行經路徑',
        caption: '1 號車緩慢行駛，2 號車與機車 A 跟在後方。A 為一次超越兩車而駛入對向車道並加速；2 號車開啟方向燈後不到一秒即駛入對向車道。動畫停在碰撞發生之前。',
        assumption: '說明用假設值：原文未提供數值，確切的速度、距離與時間均為假設，原文未載明的道路形狀與標線則未繪出；僅「2 號車開啟方向燈後不到一秒即駛入對向車道」依照原文。本圖不代表實際鑑定結果或肇事責任比例，數字及 A 僅用於辨識車輛。',
      },
      en: {
        alt: 'Illustrative 3D animation: motorcycle A moves out towards the oncoming lane to pass Vehicles 1 and 2, and Vehicle 2 moves into the same side after signalling. The animation stops before contact.',
        legend: '1 White Vehicle 1 · 2 Yellow Vehicle 2 · A Green motorcycle (passenger B) · Coloured bands show the paths travelled',
        caption: 'Vehicle 1 moves slowly with Vehicle 2 and motorcycle A behind it. A enters the oncoming lane and accelerates to pass both cars; Vehicle 2 enters the oncoming lane less than one second after activating its turn signal. The animation stops just before the collision.',
        assumption: 'Illustrative assumptions: the source gives no figures, so exact speeds, distances and timing are assumed, and road shape and markings not described in the source are not drawn. Only the sequence of Vehicle 2 entering the oncoming lane less than one second after signalling follows the source. This is not a forensic reconstruction or a finding of fault; the numbers and A only identify the vehicles.',
      },
      ja: {
        alt: '説明用3Dアニメーション：オートバイAが対向車線側へ出て1号車と2号車を追い越そうとし、2号車も方向指示器を出した後に同じ側へ入ります。衝突の直前で止まります。',
        legend: '1 白い1号車 · 2 黄色の2号車 · A 緑色のオートバイ（同乗者B）· 色の帯は通った経路',
        caption: '1号車が低速で進み、2号車とオートバイAが後ろに続きます。Aは二台をまとめて追い越そうと対向車線に入って加速し、2号車は方向指示器を出してから一秒未満で対向車線に入ります。アニメーションは衝突の直前で止まります。',
        assumption: '説明用の仮定値：元の記述に数値はないため、正確な速度・距離・時間は仮定であり、記述のない道路形状や車線表示は描いていません。2号車が方向指示器を出してから一秒未満で対向車線に入る順序だけは元の記述に従っています。実際の事故鑑定や過失割合を示すものではなく、数字とAは車両の識別記号です。',
      },
    },
  },
} as const satisfies Record<string, TrafficDiagram>;

export type TrafficDiagramId = keyof typeof TRAFFIC_DIAGRAMS;

export function isTrafficDiagramId(value: unknown): value is TrafficDiagramId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(TRAFFIC_DIAGRAMS, value);
}

export function isTrafficDiagramLocale(value: string): value is TrafficDiagramLocale {
  return value === 'ko' || value === 'zh-hant' || value === 'en' || value === 'ja';
}

export type ColumnDiagramVideo = { id: TrafficDiagramId; afterHeading?: string };

/** Normalize `diagram_video` / `diagram_video_after` frontmatter. Unknown ids are dropped. */
export function normalizeColumnDiagramVideo(id: unknown, afterHeading: unknown): ColumnDiagramVideo | undefined {
  const trimmed = typeof id === 'string' ? id.trim() : '';
  if (!isTrafficDiagramId(trimmed)) return undefined;
  const heading = typeof afterHeading === 'string' ? afterHeading.trim() : '';
  return heading ? { id: trimmed, afterHeading: heading } : { id: trimmed };
}

/**
 * Split a column body after the first paragraph that follows `## heading`.
 * Returns null when the heading is absent, so callers can fall back to placing
 * the figure before the body.
 */
export function splitColumnContentAfterHeading(content: string, heading: string): [string, string] | null {
  const lines = content.split('\n');
  const target = heading.replace(/^#+\s*/, '').trim();
  const start = lines.findIndex((line) => /^##\s+/.test(line) && line.replace(/^##\s+/, '').trim() === target);
  if (start < 0) return null;
  let index = start + 1;
  while (index < lines.length && lines[index].trim() === '') index += 1;
  if (index >= lines.length || /^#{1,6}\s/.test(lines[index])) {
    index = start + 1;
  } else {
    while (index < lines.length && lines[index].trim() !== '') index += 1;
  }
  const before = lines.slice(0, index).join('\n').trimEnd();
  const after = lines.slice(index).join('\n').trim();
  return [before, after];
}
