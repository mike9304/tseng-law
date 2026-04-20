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
const INTRO_Y = HEADER_H + 40;
const INTRO_H = 100;
const GRID_Y = INTRO_Y + INTRO_H + 40;
const STAGE_H = GRID_Y + 660 + 80;

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

function weddingPhoto(n: number): BuilderCanvasNode[] {
  const col = (n - 1) % 4;
  const row = Math.floor((n - 1) / 4);
  const x = 80 + col * 290;
  const y = GRID_Y + row * 340;
  const cId = `tpl-photowed-img-${n}`;
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 260, height: 300 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-photo`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 260, height: 260 },
      src: `/images/placeholder-wedding-${n}.jpg`,
      alt: `웨딩 사진 ${n}`,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cId}-caption`,
      parentId: cId,
      rect: { x: 8, y: 266, width: 244, height: 24 },
      text: `웨딩 촬영 #${n}`,
      fontSize: 12,
      color: '#6b7280',
      align: 'center',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-photowed-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photowed-title',
    { x: 80, y: 35, width: 500, height: 50 },
    '웨딩 갤러리',
    1,
    '#ffffff',
    'left',
    'tpl-photowed-header',
  ),

  createTextNode({
    id: 'tpl-photowed-intro',
    rect: { x: 80, y: INTRO_Y, width: 800, height: INTRO_H },
    text: '사랑하는 두 사람의 가장 아름다운 순간을 담았습니다. 자연스러우면서도 로맨틱한 웨딩 포토그래피를 감상해 보세요.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  ...weddingPhoto(1),
  ...weddingPhoto(2),
  ...weddingPhoto(3),
  ...weddingPhoto(4),
  ...weddingPhoto(5),
  ...weddingPhoto(6),
  ...weddingPhoto(7),
  ...weddingPhoto(8),
]);

export const photographyGalleryWeddingTemplate: PageTemplate = {
  id: 'photography-gallery-wedding',
  name: '웨딩 갤러리',
  category: 'photography',
  subcategory: 'gallery',
  description: '웨딩 포토그래피 쇼케이스, 8개 로맨틱 이미지',
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
