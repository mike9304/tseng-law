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
const STAGE_H = GRID_Y + 680 + 80;

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

function livePhoto(n: number): BuilderCanvasNode[] {
  const col = (n - 1) % 4;
  const row = Math.floor((n - 1) / 4);
  const x = 80 + col * 290;
  const y = GRID_Y + row * 340;
  const cId = `tpl-musgal-photo-${n}`;
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 260, height: 300 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 260, height: 260 },
      src: `/images/placeholder-live-${n}.jpg`,
      alt: `라이브 공연 사진 ${n}`,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cId}-caption`,
      parentId: cId,
      rect: { x: 8, y: 266, width: 244, height: 24 },
      text: `라이브 공연 #${n}`,
      fontSize: 12,
      color: '#6b7280',
      align: 'center',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-musgal-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-musgal-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '라이브 갤러리',
    1,
    '#ffffff',
    'left',
    'tpl-musgal-header',
  ),

  ...livePhoto(1),
  ...livePhoto(2),
  ...livePhoto(3),
  ...livePhoto(4),
  ...livePhoto(5),
  ...livePhoto(6),
  ...livePhoto(7),
  ...livePhoto(8),
]);

export const musicGalleryTemplate: PageTemplate = {
  id: 'music-gallery',
  name: '뮤직 갤러리',
  category: 'music',
  subcategory: 'gallery',
  description: '라이브 공연 사진, 8개 이미지 카드',
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
