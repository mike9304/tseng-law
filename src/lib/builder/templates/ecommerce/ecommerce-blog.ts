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

function blogCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-ecblog-card-${n}`;
  const titles = ['스타일링 가이드', '트렌드 리포트', '소재 이야기', '브랜드 콜라보', '시즌 룩북', '고객 인터뷰'];
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
      rect: { x: 0, y: 0, width: 360, height: 220 },
      src: `/images/placeholder-blog-${n}.jpg`,
      alt: `블로그 ${titles[n - 1]} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-title`, { x: 16, y: 232, width: 328, height: 36 }, titles[n - 1], 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-date`,
      parentId: cId,
      rect: { x: 16, y: 276, width: 160, height: 24 },
      text: '2026.04.10',
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-desc`,
      parentId: cId,
      rect: { x: 16, y: 308, width: 328, height: 80 },
      text: '이번 시즌 꼭 알아야 할 패션 정보를 소개합니다. 자세한 내용은 본문에서 확인하세요.',
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-ecblog-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecblog-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '브랜드 블로그',
    1,
    '#ffffff',
    'left',
    'tpl-ecblog-header',
  ),

  ...blogCard(1, 0, 0),
  ...blogCard(2, 1, 0),
  ...blogCard(3, 2, 0),
  ...blogCard(4, 0, 1),
  ...blogCard(5, 1, 1),
  ...blogCard(6, 2, 1),
]);

export const ecommerceBlogTemplate: PageTemplate = {
  id: 'ecommerce-blog',
  name: '온라인 쇼핑몰 블로그',
  category: 'ecommerce',
  subcategory: 'blog',
  description: '브랜드 블로그, 6개 아티클 카드',
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
