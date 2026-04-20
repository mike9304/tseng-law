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
const GRID_H = 900;
const PAGINATION_Y = GRID_Y + GRID_H + 40;
const PAGINATION_H = 60;
const STAGE_H = PAGINATION_Y + PAGINATION_H + 80;

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

function articleCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-blogcat-card-${n}`;
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
      rect: { x: 0, y: 0, width: 360, height: 200 },
      src: `/images/placeholder-category-${n}.jpg`,
      alt: `카테고리 기사 ${n} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-title`, { x: 16, y: 212, width: 328, height: 36 }, `카테고리 기사 ${n}`, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-meta`,
      parentId: cId,
      rect: { x: 16, y: 256, width: 300, height: 20 },
      text: '2026.04.10 · 5분 읽기',
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-excerpt`,
      parentId: cId,
      rect: { x: 16, y: 284, width: 328, height: 100 },
      text: '이 카테고리에 속한 흥미로운 기사입니다. 더 자세한 내용은 본문에서 확인하세요.',
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-blogcat-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogcat-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '라이프스타일',
    1,
    '#ffffff',
    'left',
    'tpl-blogcat-header',
  ),

  ...articleCard(1, 0, 0),
  ...articleCard(2, 1, 0),
  ...articleCard(3, 2, 0),
  ...articleCard(4, 0, 1),
  ...articleCard(5, 1, 1),
  ...articleCard(6, 2, 1),

  /* ── Pagination placeholder ─────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogcat-pagination',
    rect: { x: 400, y: PAGINATION_Y, width: 480, height: PAGINATION_H },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
  }),
  createTextNode({
    id: 'tpl-blogcat-pagination-text',
    parentId: 'tpl-blogcat-pagination',
    rect: { x: 80, y: 16, width: 320, height: 28 },
    text: '← 이전  1  2  3  4  5  다음 →',
    fontSize: 15,
    color: '#123b63',
    fontWeight: 'medium',
    align: 'center',
  }),
]);

export const blogCategoryTemplate: PageTemplate = {
  id: 'blog-category',
  name: '블로그 카테고리',
  category: 'blog',
  subcategory: 'category',
  description: '카테고리 아카이브, 6개 기사 카드 + 페이지네이션',
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
