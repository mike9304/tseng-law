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
const HEADER_H = 120;
const GRID_Y = HEADER_H + 60;
const GRID_H = 900;
const STAGE_H = GRID_Y + GRID_H + 80;

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

const merch = [
  { name: '투어 티셔츠', price: '₩35,000' },
  { name: '로고 후디', price: '₩65,000' },
  { name: '앨범 포스터', price: '₩15,000' },
  { name: '사인 CD', price: '₩25,000' },
  { name: '에코백', price: '₩18,000' },
  { name: '폰 케이스', price: '₩22,000' },
];

function merchCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-musmerch-item-${n}`;
  const m = merch[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 360, height: 420 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 360, height: 260 },
      src: `/images/placeholder-merch-${n}.jpg`,
      alt: `${m.name} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 16, y: 272, width: 328, height: 32 }, m.name, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-price`,
      parentId: cId,
      rect: { x: 16, y: 312, width: 160, height: 28 },
      text: m.price,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 16, y: 354, width: 120, height: 40 },
      label: '구매하기',
      href: '#',
      variant: 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-musmerch-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-musmerch-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '굿즈 스토어',
    1,
    '#ffffff',
    'left',
    'tpl-musmerch-header',
  ),

  ...merchCard(1, 0, 0),
  ...merchCard(2, 1, 0),
  ...merchCard(3, 2, 0),
  ...merchCard(4, 0, 1),
  ...merchCard(5, 1, 1),
  ...merchCard(6, 2, 1),
]);

export const musicMerchTemplate: PageTemplate = {
  id: 'music-merch',
  name: '뮤직 굿즈',
  category: 'music',
  subcategory: 'merch',
  description: '굿즈 그리드(6개) + 가격 + 구매 CTA',
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
