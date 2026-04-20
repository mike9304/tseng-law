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
const FILTER_Y = HEADER_H + 40;
const FILTER_H = 60;
const GRID_Y = FILTER_Y + FILTER_H + 40;
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

function productCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-ecprods-card-${n}`;
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
      rect: { x: 0, y: 0, width: 360, height: 240 },
      src: `/images/placeholder-product-${n}.jpg`,
      alt: `상품 ${n} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 16, y: 252, width: 328, height: 36 }, `상품 ${n}`, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-price`,
      parentId: cId,
      rect: { x: 16, y: 296, width: 160, height: 30 },
      text: '₩79,000',
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cId}-desc`,
      parentId: cId,
      rect: { x: 16, y: 336, width: 328, height: 60 },
      text: '고품질 소재로 제작된 인기 상품입니다.',
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Header ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecprods-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecprods-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '전체 상품',
    1,
    '#ffffff',
    'left',
    'tpl-ecprods-header',
  ),

  /* ── Sort/Filter placeholder ────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecprods-filter',
    rect: { x: 80, y: FILTER_Y, width: W - 160, height: FILTER_H },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
  }),
  createTextNode({
    id: 'tpl-ecprods-filter-text',
    parentId: 'tpl-ecprods-filter',
    rect: { x: 16, y: 16, width: 400, height: 28 },
    text: '정렬: 인기순 | 최신순 | 낮은 가격순 | 높은 가격순',
    fontSize: 14,
    color: '#1f2937',
  }),

  /* ── Product grid (6 cards, 3 columns × 2 rows) ────────── */
  ...productCard(1, 0, 0),
  ...productCard(2, 1, 0),
  ...productCard(3, 2, 0),
  ...productCard(4, 0, 1),
  ...productCard(5, 1, 1),
  ...productCard(6, 2, 1),
]);

export const ecommerceProductsTemplate: PageTemplate = {
  id: 'ecommerce-products',
  name: '온라인 쇼핑몰 상품 목록',
  category: 'ecommerce',
  subcategory: 'products',
  description: '상품 그리드(6개) + 정렬/필터 영역 + 가격/이미지/제목',
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
