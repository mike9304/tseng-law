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
const HEADER_H = 120;
const GRID_Y = HEADER_H + 60;
const STAGE_H = GRID_Y + 1100 + 80;

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

const photoData = [
  { cat: '웨딩', alt: '웨딩 포트폴리오 사진' },
  { cat: '인물', alt: '인물 포트폴리오 사진' },
  { cat: '이벤트', alt: '이벤트 포트폴리오 사진' },
  { cat: '제품', alt: '제품 포트폴리오 사진' },
  { cat: '가족', alt: '가족 포트폴리오 사진' },
  { cat: '기업', alt: '기업 포트폴리오 사진' },
  { cat: '풍경', alt: '풍경 포트폴리오 사진' },
  { cat: '패션', alt: '패션 포트폴리오 사진' },
];

/* Masonry-style: alternating heights */
function photoCard(n: number): BuilderCanvasNode[] {
  const col = (n - 1) % 4;
  const row = Math.floor((n - 1) / 4);
  const tall = n % 2 === 1;
  const h = tall ? 500 : 340;
  const x = 80 + col * 290;
  const y = GRID_Y + row * 560;
  const cId = `tpl-photoport-card-${n}`;
  const d = photoData[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 260, height: h },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 260, height: h - 60 },
      src: `/images/placeholder-portfolio-${n}.jpg`,
      alt: d.alt,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cId}-cat`,
      parentId: cId,
      rect: { x: 12, y: h - 50, width: 100, height: 28 },
      text: d.cat,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-photoport-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoport-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '포트폴리오',
    1,
    '#ffffff',
    'left',
    'tpl-photoport-header',
  ),

  ...photoCard(1),
  ...photoCard(2),
  ...photoCard(3),
  ...photoCard(4),
  ...photoCard(5),
  ...photoCard(6),
  ...photoCard(7),
  ...photoCard(8),
]);

export const photographyPortfolioTemplate: PageTemplate = {
  id: 'photography-portfolio',
  name: '사진 포트폴리오',
  category: 'photography',
  subcategory: 'portfolio',
  description: '매소니 스타일 그리드, 8개 사진 카드 + 카테고리 라벨',
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
