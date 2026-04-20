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
const CARD_W = 540;
const CARD_H = 360;
const CARD_GAP = 40;
const STAGE_H = GRID_Y + (CARD_H + CARD_GAP) * 2 + 60;

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

const videos = [
  { title: '새벽의 소리 (Official MV)', year: '2026' },
  { title: '도시의 밤 (Official MV)', year: '2024' },
  { title: '첫 번째 여행 (Live at 올림픽홀)', year: '2023' },
  { title: '빗소리 (Acoustic Session)', year: '2025' },
];

function videoCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * (CARD_W + CARD_GAP);
  const y = GRID_Y + row * (CARD_H + CARD_GAP);
  const cId = `tpl-musvid-card-${n}`;
  const v = videos[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-thumb`,
      parentId: cId,
      rect: { x: 0, y: 0, width: CARD_W, height: 280 },
      src: `/images/placeholder-mv-${n}.jpg`,
      alt: `${v.title} 썸네일`,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cId}-play`,
      parentId: cId,
      rect: { x: 230, y: 120, width: 80, height: 40 },
      text: '▶ 재생',
      fontSize: 18,
      color: '#ffffff',
      fontWeight: 'bold',
      align: 'center',
    }),
    heading(`${cId}-title`, { x: 16, y: 290, width: 460, height: 30 }, v.title, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-year`,
      parentId: cId,
      rect: { x: 16, y: 326, width: 100, height: 20 },
      text: v.year,
      fontSize: 13,
      color: '#6b7280',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-musvid-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-musvid-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '뮤직비디오',
    1,
    '#ffffff',
    'left',
    'tpl-musvid-header',
  ),

  ...videoCard(1, 0, 0),
  ...videoCard(2, 1, 0),
  ...videoCard(3, 0, 1),
  ...videoCard(4, 1, 1),
]);

export const musicVideosTemplate: PageTemplate = {
  id: 'music-videos',
  name: '뮤직비디오',
  category: 'music',
  subcategory: 'videos',
  description: '뮤직비디오 그리드, 4개 비디오 플레이스홀더 카드',
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
