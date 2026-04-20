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

const authors = [
  { name: '김민지', role: '편집장', articles: '52편', topic: '라이프스타일' },
  { name: '이수진', role: '테크 에디터', articles: '38편', topic: '테크' },
  { name: '박준영', role: '여행 에디터', articles: '45편', topic: '여행' },
  { name: '최하나', role: '웰니스 에디터', articles: '31편', topic: '건강' },
  { name: '정다은', role: '문화 에디터', articles: '28편', topic: '문화' },
  { name: '한서현', role: '푸드 에디터', articles: '35편', topic: '푸드' },
];

function authorCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-blogauth-card-${n}`;
  const a = authors[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 360, height: 420 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-photo`,
      parentId: cId,
      rect: { x: 80, y: 24, width: 200, height: 200 },
      src: `/images/placeholder-author-${n}.jpg`,
      alt: `${a.name} 프로필`,
      style: { borderRadius: 100 },
    }),
    heading(`${cId}-name`, { x: 16, y: 240, width: 328, height: 32 }, a.name, 3, '#123b63', 'center', cId),
    createTextNode({
      id: `${cId}-role`,
      parentId: cId,
      rect: { x: 16, y: 278, width: 328, height: 24 },
      text: a.role,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      align: 'center',
    }),
    createTextNode({
      id: `${cId}-info`,
      parentId: cId,
      rect: { x: 16, y: 310, width: 328, height: 24 },
      text: `${a.articles} 작성 · ${a.topic} 전문`,
      fontSize: 13,
      color: '#6b7280',
      align: 'center',
    }),
    createTextNode({
      id: `${cId}-bio`,
      parentId: cId,
      rect: { x: 24, y: 346, width: 312, height: 50 },
      text: '다양한 분야의 인사이트를 독자에게 전하는 열정적인 에디터입니다.',
      fontSize: 13,
      color: '#1f2937',
      lineHeight: 1.4,
      align: 'center',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-blogauth-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogauth-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '필진 소개',
    1,
    '#ffffff',
    'left',
    'tpl-blogauth-header',
  ),

  ...authorCard(1, 0, 0),
  ...authorCard(2, 1, 0),
  ...authorCard(3, 2, 0),
  ...authorCard(4, 0, 1),
  ...authorCard(5, 1, 1),
  ...authorCard(6, 2, 1),
]);

export const blogAuthorsTemplate: PageTemplate = {
  id: 'blog-authors',
  name: '블로그 필진',
  category: 'blog',
  subcategory: 'authors',
  description: '기고 작가 그리드, 6개 작가 카드',
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
