import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;

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

const MARGIN = 80;
const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 380;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface Destination {
  key: string;
  name: string;
  region: string;
  desc: string;
}

const destinations: Destination[] = [
  { key: 'tokyo', name: '도쿄, 일본', region: '아시아', desc: '전통과 현대가 공존하는 도시에서 문화, 미식, 쇼핑을 즐기세요.' },
  { key: 'paris', name: '파리, 프랑스', region: '유럽', desc: '에펠탑, 루브르, 샹젤리제... 로맨틱한 파리의 모든 것을 경험하세요.' },
  { key: 'bali', name: '발리, 인도네시아', region: '동남아시아', desc: '열대 해변과 우붓 문화를 즐기는 힐링 여행의 최적지입니다.' },
  { key: 'rome', name: '로마, 이탈리아', region: '유럽', desc: '콜로세움, 바티칸, 트레비 분수 등 영원의 도시를 탐험하세요.' },
  { key: 'newyork', name: '뉴욕, 미국', region: '북미', desc: '브로드웨이, 센트럴파크, 자유의 여신상 등 꿈의 도시를 만나보세요.' },
  { key: 'sydney', name: '시드니, 호주', region: '오세아니아', desc: '오페라 하우스와 본다이 비치가 기다리는 호주 최대 도시입니다.' },
];

function buildDestCard(dest: Destination, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-traveldest-card-${dest.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 200 },
      src: `/images/placeholder-dest-${dest.key}.jpg`,
      alt: `${dest.name} 풍경`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 216, width: 260, height: 36 }, dest.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-region`,
      parentId: cid,
      rect: { x: 290, y: 222, width: 60, height: 24 },
      text: dest.region,
      fontSize: 12,
      color: '#e8a838',
      fontWeight: 'medium',
      align: 'right',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 20, y: 260, width: 330, height: 60 },
      text: dest.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 20, y: 336, width: 120, height: 32 },
      label: '자세히 보기',
      href: '#',
      variant: 'link',
      style: { borderRadius: 4 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-traveldest-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '여행지',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-traveldest-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '전 세계 인기 여행지를 둘러보고 나만의 여행을 계획하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...destinations.flatMap((d, i) => buildDestCard(d, i)),
]);

export const travelDestinationsTemplate: PageTemplate = {
  id: 'travel-destinations',
  name: '여행지',
  category: 'travel',
  subcategory: 'destinations',
  description: '여행지 제목 + 6개 목적지 카드(이미지 + 이름 + 지역 + 설명)',
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
