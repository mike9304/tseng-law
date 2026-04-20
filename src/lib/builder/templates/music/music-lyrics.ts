import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HEADER_H = 120;
const SONG_H = 400;
const SONG_GAP = 60;
const STAGE_H = HEADER_H + 40 + (SONG_H + SONG_GAP) * 4 + 40;

function heading(
  id: string,
  rect: BuilderCanvasNode['rect'],
  text: string,
  level: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'left',
  parentId?: string,
): BuilderCanvasNode {
  return {
    id,
    kind: 'heading',
    parentId,
    rect,
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: { text, level, color, align },
  };
}

const songs = [
  {
    title: '새벽의 소리',
    lyrics: '고요한 밤이 지나고\n창가에 스미는 빛\n\n아직 잠들지 못한 마음에\n새벽이 속삭이네\n\n모든 것이 괜찮아질 거라고\n어둠 뒤에 빛이 온다고\n\n지금 이 순간을 기억해\n새벽의 소리를 들어봐',
  },
  {
    title: '도시의 밤',
    lyrics: '네온사인 아래 걷는 밤\n수많은 사람 속 홀로\n\n이 도시는 잠들지 않고\n나만 홀로 깨어있는 것 같아\n\n하지만 어딘가 같은 밤을\n바라보는 누군가가 있겠지\n\n외롭지 않아 이 도시의 밤\n우리는 함께 빛나고 있으니까',
  },
  {
    title: '첫 번째 여행',
    lyrics: '낯선 길 위에 서면\n두렵기도 하지만\n\n발걸음 하나하나가\n새로운 이야기가 되어\n\n바람이 부는 대로\n마음이 이끄는 대로\n\n이 여행의 끝에서\n더 나은 내가 되어있길',
  },
  {
    title: '빗소리',
    lyrics: '창밖에 내리는 비\n리듬처럼 떨어지는 물방울\n\n오늘은 아무것도 하지 않아도\n괜찮은 날이야\n\n빗소리에 기대어\n오래된 노래를 흥얼거려\n\n이 고요한 오후가\n나에게 주는 작은 선물',
  },
];

function songBlock(n: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + (SONG_H + SONG_GAP) * (n - 1);
  const cId = `tpl-muslyrics-song-${n}`;
  const s = songs[n - 1];
  const bg = n % 2 === 0 ? '#f3f4f6' : '#ffffff';
  return [
    createContainerNode({
      id: cId,
      rect: { x: 80, y, width: W - 160, height: SONG_H },
      background: bg,
      borderRadius: 12,
      padding: 40,
    }),
    heading(`${cId}-title`, { x: 40, y: 24, width: 600, height: 40 }, s.title, 2, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-text`,
      parentId: cId,
      rect: { x: 40, y: 80, width: 800, height: 280 },
      text: s.lyrics,
      fontSize: 16,
      color: '#1f2937',
      lineHeight: 1.8,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-muslyrics-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-muslyrics-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '가사',
    1,
    '#ffffff',
    'left',
    'tpl-muslyrics-header',
  ),

  ...songBlock(1),
  ...songBlock(2),
  ...songBlock(3),
  ...songBlock(4),
]);

export const musicLyricsTemplate: PageTemplate = {
  id: 'music-lyrics',
  name: '뮤직 가사',
  category: 'music',
  subcategory: 'lyrics',
  description: '가사 페이지, 4곡의 제목 + 가사 블록',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H,
    nodes,
  },
};
