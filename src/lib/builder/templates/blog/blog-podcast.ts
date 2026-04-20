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

const episodes = [
  { title: 'EP.48 디지털 노마드의 현실', duration: '45분', guest: '게스트: 이준호 (프리랜서)' },
  { title: 'EP.47 미니멀 라이프 실천기', duration: '38분', guest: '게스트: 박소영 (블로거)' },
  { title: 'EP.46 2026 테크 트렌드', duration: '52분', guest: '게스트: 김태현 (CTO)' },
  { title: 'EP.45 건강한 아침 루틴', duration: '35분', guest: '게스트: 최유진 (웰니스 코치)' },
];

function episodeCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 580;
  const y = GRID_Y + row * (CARD_H + CARD_GAP);
  const cId = `tpl-blogpod-ep-${n}`;
  const ep = episodes[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 540, height: CARD_H },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-thumb`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 200, height: CARD_H },
      src: `/images/placeholder-podcast-${n}.jpg`,
      alt: `${ep.title} 썸네일`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-title`, { x: 220, y: 24, width: 296, height: 36 }, ep.title, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-meta`,
      parentId: cId,
      rect: { x: 220, y: 68, width: 296, height: 24 },
      text: `${ep.duration} · ${ep.guest}`,
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-desc`,
      parentId: cId,
      rect: { x: 220, y: 104, width: 296, height: 80 },
      text: '이번 에피소드에서는 흥미로운 주제에 대해 깊이 있는 대화를 나눕니다.',
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
    createContainerNode({
      id: `${cId}-play-area`,
      parentId: cId,
      rect: { x: 220, y: 200, width: 296, height: 48 },
      background: '#123b63',
      borderRadius: 24,
      padding: 0,
    }),
    createTextNode({
      id: `${cId}-play-btn`,
      parentId: `${cId}-play-area`,
      rect: { x: 80, y: 12, width: 140, height: 24 },
      text: '▶ 재생하기',
      fontSize: 15,
      color: '#ffffff',
      fontWeight: 'medium',
      align: 'center',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-blogpod-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogpod-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '팟캐스트',
    1,
    '#ffffff',
    'left',
    'tpl-blogpod-header',
  ),

  ...episodeCard(1, 0, 0),
  ...episodeCard(2, 1, 0),
  ...episodeCard(3, 0, 1),
  ...episodeCard(4, 1, 1),
]);

export const blogPodcastTemplate: PageTemplate = {
  id: 'blog-podcast',
  name: '블로그 팟캐스트',
  category: 'blog',
  subcategory: 'podcast',
  description: '팟캐스트 에피소드 목록, 4개 에피소드 카드 + 재생 버튼',
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
