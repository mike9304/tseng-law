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

function portraitPhoto(n: number): BuilderCanvasNode[] {
  const col = (n - 1) % 4;
  const row = Math.floor((n - 1) / 4);
  const x = 80 + col * 290;
  const y = GRID_Y + row * 340;
  const cId = `tpl-photoport2-img-${n}`;
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
      src: `/images/placeholder-portrait-${n}.jpg`,
      alt: `인물 사진 ${n}`,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cId}-caption`,
      parentId: cId,
      rect: { x: 8, y: 266, width: 244, height: 24 },
      text: `인물 촬영 #${n}`,
      fontSize: 12,
      color: '#6b7280',
      align: 'center',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-photoport2-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoport2-title',
    { x: 80, y: 35, width: 500, height: 50 },
    '인물 갤러리',
    1,
    '#ffffff',
    'left',
    'tpl-photoport2-header',
  ),

  createTextNode({
    id: 'tpl-photoport2-intro',
    rect: { x: 80, y: INTRO_Y, width: 800, height: INTRO_H },
    text: '각 인물의 개성과 분위기를 자연스럽게 담아낸 인물 사진 컬렉션입니다. 자연광과 스튜디오 조명을 활용한 다양한 스타일을 감상해 보세요.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  ...portraitPhoto(1),
  ...portraitPhoto(2),
  ...portraitPhoto(3),
  ...portraitPhoto(4),
  ...portraitPhoto(5),
  ...portraitPhoto(6),
  ...portraitPhoto(7),
  ...portraitPhoto(8),
]);

export const photographyGalleryPortraitTemplate: PageTemplate = {
  id: 'photography-gallery-portrait',
  name: '인물 갤러리',
  category: 'photography',
  subcategory: 'gallery',
  description: '인물 갤러리, 8개 인물 이미지',
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
