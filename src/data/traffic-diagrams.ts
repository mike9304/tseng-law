import type { SiteLocale } from '@/lib/locales';
import { TRAFFIC_STILL_DIAGRAMS } from './traffic-still-diagrams';
import { TW_LANE_CHANGE_DIAGRAM } from './tw-lane-change-diagram';
import { TW_RIGHT_TURN_DIAGRAM } from './tw-right-turn-diagram';
import { TW_FLASHING_JUNCTION_DIAGRAM } from './tw-flashing-junction-diagram';
import { TW_DOORING_DIAGRAM } from './tw-dooring-diagram';
import { TW_STARTING_ENTRY_DIAGRAM } from './tw-starting-entry-diagram';
import { TW_CHAIN_COLLISION_DIAGRAM } from './tw-chain-collision-diagram';
import { TW_BUS_BRAKING_DIAGRAM } from './tw-bus-braking-diagram';

/**
 * Animated Blender diagrams for the traffic-accident pages.
 *
 * The column loader strips inline markdown images (`stripInlineImages`), so a
 * column opts in through frontmatter instead of the body:
 *
 *   diagram_video: "<id>"                      # id in TRAFFIC_DIAGRAMS
 *   diagram_video_after: "<## heading text>"   # optional: place the figure after
 *                                              # the first paragraph of that section
 *
 * Only original generic explanations are permitted. Never restore the withdrawn
 * overtaking-012 reconstruction. Numbers in the render refer to localized captions.
 * New content may use `diagram` / `diagram_after`; legacy video keys still work.
 */
export type TrafficDiagramLocale = Extract<SiteLocale, 'ko' | 'zh-hant' | 'en' | 'ja'>;

export type TrafficDiagramCopy = {
  alt: string;
  legend: string;
  caption: string;
  assumption: string;
  videoDescription?: string;
  stages?: { label: string; alts: readonly string[] };
};

export type TrafficDiagram = {
  id: string;
  poster: string;
  mobilePoster: string;
  width: number;
  height: number;
  mobileWidth: number;
  mobileHeight: number;
  copy: Partial<Record<TrafficDiagramLocale, TrafficDiagramCopy>>;
  stills?: readonly { poster: string; mobilePoster: string }[];
} & ({ kind: 'still' } | { kind?: 'video'; playback?: 'manual'; playbackTools?: boolean; mp4: string; webm: string; mobileMp4: string; mobileWebm: string; durationSeconds: number });

export const TRAFFIC_DIAGRAM_MOBILE_QUERY = '(max-width: 640px)';

/**
 * The overtaking-012 reconstruction was withdrawn
 * on 2026-09-30 (the party in that case did not consent). Only generic,
 * hypothetical scenes that cannot be linked to a real case may be added here.
 */
export const TRAFFIC_DIAGRAMS = {
  ...TRAFFIC_STILL_DIAGRAMS,
  'lane-change-hypothetical': TW_LANE_CHANGE_DIAGRAM,
  'right-turn-hypothetical': TW_RIGHT_TURN_DIAGRAM,
  'flashing-red-yellow-hypothetical': TW_FLASHING_JUNCTION_DIAGRAM,
  'dooring-hypothetical': TW_DOORING_DIAGRAM,
  'starting-entry-hypothetical': TW_STARTING_ENTRY_DIAGRAM,
  'chain-collision-hypothetical': TW_CHAIN_COLLISION_DIAGRAM,
  'bus-braking-hypothetical': TW_BUS_BRAKING_DIAGRAM,
  'passing-hypothetical': {
    kind: 'video',
    id: 'passing-hypothetical',
    mp4: '/videos/traffic/passing-hypothetical.mp4',
    webm: '/videos/traffic/passing-hypothetical.webm',
    mobileMp4: '/videos/traffic/passing-hypothetical-mobile.mp4',
    mobileWebm: '/videos/traffic/passing-hypothetical-mobile.webm',
    poster: '/images/traffic/passing-hypothetical-poster.webp',
    mobilePoster: '/images/traffic/passing-hypothetical-poster-mobile.webp',
    width: 1920,
    height: 1080,
    mobileWidth: 1080,
    mobileHeight: 1350,
    durationSeconds: 8,
    copy: {
      ko: {
        alt: '평지의 같은 방향 두 차로에서 적갈색 1번 승용차 뒤로 회녹색 2번 승용차가 달립니다. 2번이 전조등을 한 번 깜빡이고 1번이 우측 방향지시등으로 양보하면, 2번은 좌측 방향지시등을 켜고 왼쪽 차로로 옮겨 지나갑니다. 앞차와 거리를 벌린 뒤 우측 방향지시등을 켜고 원래 차로로 돌아오며, 마지막 정지 화면에서는 두 차가 간격을 두고 같은 차로를 달립니다.',
        legend: '1번 · 적갈색 승용차: 처음에 앞서 달리며 양보하는 차. 2번 · 회녹색 승용차: 뒤에서 접근해 추월하는 차. 주황색 불빛은 방향지시등이며, 2번 차 앞의 밝은 불빛 한 번은 전조등 신호입니다.',
        caption: '2번 차가 전조등을 한 번 깜빡인 뒤, 1번 차가 우측 방향지시등으로 양보 의사를 표시합니다. 2번 차는 좌측 방향지시등을 켜고 0.5m 이상의 옆 간격을 두어 통과한 다음, 안전한 거리를 확보하고 우측 방향지시등을 켜 원래 차로로 돌아옵니다.',
        assumption: '가상 예시: 실제 사건이나 판결을 재현한 장면이 아니며, 과실을 판단하기 위한 도해도 아닙니다. 속도·거리·시각은 설명용 가정값이고, 0.5m는 제101조가 정한 최소 옆 간격입니다. 다른 추월 금지 조건이 없다는 설정으로, 신호와 양보만으로 금지된 추월이 허용되는 것은 아닙니다.',
      },
      'zh-hant': {
        alt: '平坦道路上，同向有兩個車道；灰綠色2號小客車跟在磚紅色1號小客車後方。2號車變換燈光一次，1號車亮右方向燈表示允讓後，2號車打左方向燈，駛入左側車道超越。拉開距離後，2號車打右方向燈回到原車道；最後定格時，兩車已前後分開，行駛於同一車道。',
        legend: '1號・磚紅色小客車：起初在前方行駛、允讓後車超越的車輛。2號・灰綠色小客車：從後方超車的車輛。橘色閃光是方向燈；2號車前方的一次亮光是變換燈光的示意。',
        caption: '2號車先變換燈光一次，待1號車亮右方向燈表示允讓，再打左方向燈，保持至少半公尺的側向間隔，從左側超越。行至安全距離後，2號車打右方向燈駛回原車道。',
        assumption: '假設示例：本動畫並非重現實際案件或判決，也不作為肇事責任判斷。速度、距離與時間均為說明用假設值；半公尺則是道路交通安全規則第101條規定的最小側向間隔。本例假設沒有其他禁止超車的條件，不能僅憑警示與允讓，就在禁止超車的情況下超車。',
      },
      en: {
        alt: 'Two passenger cars travel on a flat road with two lanes in the same direction: brick-red car 1 leads, with grey-green car 2 behind. Car 2 flashes its headlights once; car 1 signals right to yield. Car 2 signals left, passes in the left lane, then signals right and returns to its original lane after opening a gap. The final still shows both cars in the same lane, with car 2 ahead and space between them.',
        legend: '1 · Brick-red car: initially ahead, yielding to the following car. 2 · Grey-green car: overtaking from behind. Amber flashes are turn signals; the single bright flash at the front of car 2 is its headlight signal.',
        caption: 'Car 2 flashes its headlights once; after car 1 signals right to let it pass, car 2 signals left and overtakes with at least 0.5 m of lateral clearance. Once safely clear, car 2 signals right and returns to its original lane.',
        assumption: 'Hypothetical example: this animation does not reconstruct an actual case or judgment and makes no assessment of fault. Speeds, distances and timing are illustrative assumptions; the 0.5 m minimum lateral clearance comes from Article 101. The scene assumes no other prohibition on overtaking applies: signalling and yielding do not permit overtaking where it is otherwise prohibited.',
      },
      ja: {
        alt: '平坦な片側2車線の道路を、れんが色の乗用車1と、その後ろの灰緑色の乗用車2が走っています。2が前照灯を1回点滅させ、1が右ウインカーで進路を譲る合図をすると、2は左ウインカーを出して左側の車線から追い越します。前車との距離を確保した後、右ウインカーを出して元の車線に戻り、最後の静止画では2を先頭に2台が間隔を空けて並んでいます。',
        legend: '1・れんが色の乗用車：初めに前を走り、進路を譲る車。2・灰緑色の乗用車：後ろから追い越す車。オレンジ色の点滅はウインカー、2の前方で1回光る明るい灯りは前照灯の合図です。',
        caption: '2が前照灯を1回点滅させ、1が右ウインカーで進路を譲る意思を示した後、2は左ウインカーを出して、横に0.5m以上の間隔を保ちながら追い越します。安全な距離を確保すると、2は右ウインカーを出して元の車線に戻ります。',
        assumption: '仮想の例：実際の事件や判決を再現したものではなく、過失を判断するための図解でもありません。速度・距離・時刻は説明用の仮定値で、横に0.5m以上という間隔は第101条の規定によります。他の追い越し禁止条件がない場面を想定しており、合図や進路譲りによって、禁止されている追い越しが許されるわけではありません。',
      },
    },
  },
  // Generic rule illustration for column 051 (道路交通安全規則 102-1-7). It does not
  // reproduce any judgment cited in the column; lanes, signals and speeds are assumed.
  'left-turn-hypothetical': {
    kind: 'video',
    id: 'left-turn-hypothetical',
    mp4: '/videos/traffic/left-turn-hypothetical.mp4',
    webm: '/videos/traffic/left-turn-hypothetical.webm',
    mobileMp4: '/videos/traffic/left-turn-hypothetical-mobile.mp4',
    mobileWebm: '/videos/traffic/left-turn-hypothetical-mobile.webm',
    poster: '/images/traffic/left-turn-hypothetical-poster.webp',
    mobilePoster: '/images/traffic/left-turn-hypothetical-poster-mobile.webp',
    width: 1920,
    height: 1080,
    mobileWidth: 1080,
    mobileHeight: 1350,
    durationSeconds: 6,
    copy: {
      ko: {
        alt: '신호등이 있는 교차로를 위에서 내려다본 장면입니다. 황토색 1번 승용차가 좌측 방향지시등을 켜고 교차로 안에서 왼쪽으로 돌고, 맞은편에서는 초록불을 받은 2번 오토바이가 곧장 달려옵니다. 오토바이가 승용차 옆에 닿기 직전에 화면이 멈추고, 두 진로가 겹치는 자리에 붉은 원이 나타납니다.',
        legend: '1번 · 황토색 승용차: 좌회전하는 차. 2번 · 짙은 초록색 오토바이: 맞은편에서 직진하는 오토바이. 주황색 불빛은 방향지시등, 붉은 원은 두 진로가 겹치는 자리입니다.',
        caption: '방향지시등을 켰더라도 좌회전하는 1번 차는 맞은편에서 직진해 오는 2번 오토바이가 먼저 지나가게 해야 합니다(도로교통안전규칙 제102조 제1항 제7호). 그림은 두 진로가 겹치기 직전에서 멈춥니다.',
        assumption: '가상 예시: 본문에 소개한 판결이나 실제 사건을 재현한 장면이 아니며, 과실 비율을 판단하는 도해도 아닙니다. 차로 모양·신호·속도·거리·시각은 설명을 위해 정한 값입니다.',
      },
      'zh-hant': {
        alt: '從上方俯瞰設有號誌的路口。土黃色的1號小客車打左方向燈，在路口內左轉；對向的2號機車在綠燈下直行而來。畫面停在機車即將碰到小客車側面之前，兩車路線交會處以紅圈標示。',
        legend: '1號・土黃色小客車：左轉的車輛。2號・深綠色機車：對向直行的機車。橘色閃光是方向燈，紅圈是兩車路線交會的位置。',
        caption: '左轉的1號車即使已打方向燈，仍應讓對向直行的2號機車先行（道路交通安全規則第102條第1項第7款）。畫面停在兩車路線交會之前。這是假設示意，並非重現本文任何事故或判決。',
        assumption: '假設示例：並非重現本文所引判決或任何實際案件，也不作為判斷過失比例的依據。車道配置、號誌、速度、距離與時間均為說明用的假設。',
      },
      en: {
        alt: 'Overhead view of an intersection with traffic lights. Ochre car 1, left turn signal on, turns left inside the intersection while motorcycle 2 comes straight through from the opposite direction on a green light. The frame stops just before the motorcycle reaches the side of the car, and a red circle marks where their paths cross.',
        legend: '1 · Ochre car: turning left. 2 · Dark green motorcycle: going straight from the opposite direction. Amber flashes are turn signals; the red circle marks where the two paths cross.',
        caption: 'Even with its turn signal on, car 1 must let oncoming motorcycle 2 go straight through first (Road Traffic Safety Regulations, Article 102(1)(7)). The animation stops before the paths meet. This hypothetical illustration does not reconstruct any accident or judgment in the article.',
        assumption: 'Hypothetical example: it does not reconstruct the judgments discussed in the article or any real case, and it is not a basis for apportioning fault. Lane layout, signals, speeds, distances and timing are illustrative assumptions.',
      },
      ja: {
        alt: '信号機のある交差点を上から見た場面です。黄土色の乗用車1が左ウインカーを出して交差点内で左折し、対向車線からは青信号でバイク2が直進してきます。バイクが乗用車の側面に届く直前で画面が止まり、二台の進路が交わる位置に赤い円が表示されます。',
        legend: '1・黄土色の乗用車：左折する車。2・濃い緑色のバイク：対向から直進してくるバイク。オレンジ色の点滅はウインカー、赤い円は二台の進路が交わる位置です。',
        caption: 'ウインカーを出していても、左折する1は対向から直進してくるバイク2を先に通さなければなりません（道路交通安全規則第102条第1項第7号）。画面は進路が交わる直前で止まります。',
        assumption: '仮想の例：本文で紹介した判決や実際の事件を再現したものではなく、過失割合を判断するための図解でもありません。車線の配置・信号・速度・距離・時刻は説明用の仮定です。',
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
