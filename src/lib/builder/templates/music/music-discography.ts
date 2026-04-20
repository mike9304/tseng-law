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
const CARD_W = 540;
const CARD_H = 280;
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

const albums = [
  { name: '새벽의 소리', year: '2026', tracks: '10곡 수록', desc: '밤의 고요함과 새벽의 설렘을 담은 세 번째 정규 앨범' },
  { name: '도시의 밤', year: '2024', tracks: '12곡 수록', desc: '현대 도시의 외로움과 희망을 노래한 두 번째 앨범' },
  { name: '첫 번째 여행', year: '2022', tracks: '8곡 수록', desc: '새로운 시작과 모험을 담은 데뷔 앨범' },
  { name: 'Acoustic Live', year: '2023', tracks: '6곡 수록', desc: '라이브 공연의 감동을 담은 어쿠스틱 실황 앨범' },
];

function albumCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * (CARD_W + 40);
  const y = GRID_Y + row * (CARD_H + CARD_GAP);
  const cId = `tpl-musdisc-album-${n}`;
  const a = albums[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-cover`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 280, height: CARD_H },
      src: `/images/placeholder-album-${n}.jpg`,
      alt: `${a.name} 앨범 커버`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 300, y: 24, width: 220, height: 36 }, a.name, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-year`,
      parentId: cId,
      rect: { x: 300, y: 66, width: 200, height: 24 },
      text: `${a.year} · ${a.tracks}`,
      fontSize: 14,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-desc`,
      parentId: cId,
      rect: { x: 300, y: 100, width: 220, height: 80 },
      text: a.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cId}-stream`,
      parentId: cId,
      rect: { x: 300, y: 200, width: 120, height: 40 },
      label: '스트리밍',
      href: '#',
      variant: 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-musdisc-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-musdisc-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '디스코그래피',
    1,
    '#ffffff',
    'left',
    'tpl-musdisc-header',
  ),

  ...albumCard(1, 0, 0),
  ...albumCard(2, 1, 0),
  ...albumCard(3, 0, 1),
  ...albumCard(4, 1, 1),
]);

export const musicDiscographyTemplate: PageTemplate = {
  id: 'music-discography',
  name: '뮤직 디스코그래피',
  category: 'music',
  subcategory: 'discography',
  description: '앨범 그리드(4개) + 트랙리스트 + 스트리밍 링크',
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
