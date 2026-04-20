import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const MARGIN = 80;

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

const HEADER_H = 140;
const CARD_W = 540;
const CARD_H = 320;
const GAP = 24;
const COLS = 2;

interface Neighborhood {
  key: string;
  name: string;
  avgPrice: string;
  schools: string;
  transport: string;
  desc: string;
}

const neighborhoods: Neighborhood[] = [
  { key: 'gangnam', name: '강남구', avgPrice: '평균 매매가 18억원', schools: '학군 우수', transport: '2호선, 신분당선', desc: '서울의 대표 주거지역. 뛰어난 교통과 교육 인프라를 갖춘 프리미엄 지역입니다.' },
  { key: 'seocho', name: '서초구', avgPrice: '평균 매매가 16억원', schools: '학군 우수', transport: '2호선, 3호선', desc: '예술의전당, 국립중앙도서관 등 문화시설이 풍부한 주거 명소입니다.' },
  { key: 'songpa', name: '송파구', avgPrice: '평균 매매가 14억원', schools: '학군 양호', transport: '2호선, 8호선, 9호선', desc: '잠실, 올림픽공원 등 편의시설과 공원이 조화로운 지역입니다.' },
  { key: 'yongsan', name: '용산구', avgPrice: '평균 매매가 15억원', schools: '학군 양호', transport: '1호선, 4호선, 6호선', desc: '서울 중심부에 위치하며 한강 조망과 재개발 호재가 있는 지역입니다.' },
];

function buildNeighborhoodCard(n: Neighborhood, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-reneighborhood-card-${n.key}`;

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
      rect: { x: 0, y: 0, width: CARD_W, height: 160 },
      src: `/images/placeholder-neighborhood-${n.key}.jpg`,
      alt: `${n.name} 전경`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 172, width: 300, height: 36 }, n.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 20, y: 214, width: 200, height: 24 },
      text: n.avgPrice,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-stats`,
      parentId: cid,
      rect: { x: 20, y: 244, width: 400, height: 24 },
      text: `${n.schools} | ${n.transport}`,
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 20, y: 274, width: 500, height: 36 },
      text: n.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.4,
    }),
  ];
}

const ROWS = Math.ceil(neighborhoods.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-reneighborhood-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '지역 가이드',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-reneighborhood-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '서울 주요 지역의 특성과 시세 정보를 안내합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...neighborhoods.flatMap((n, i) => buildNeighborhoodCard(n, i)),
]);

export const realestateNeighborhoodsTemplate: PageTemplate = {
  id: 'realestate-neighborhoods',
  name: '지역 가이드',
  category: 'realestate',
  subcategory: 'neighborhoods',
  description: '지역 가이드 + 4개 지역 카드(시세 + 학군 + 교통)',
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
