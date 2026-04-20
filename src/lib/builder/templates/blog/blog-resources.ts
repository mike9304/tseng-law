import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
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

const resources = [
  { title: '생산성 체크리스트', type: 'PDF', desc: '매일 사용할 수 있는 생산성 향상 체크리스트입니다.' },
  { title: '미니멀 라이프 가이드', type: 'eBook', desc: '미니멀 라이프를 시작하기 위한 단계별 가이드입니다.' },
  { title: '건강한 식단 플래너', type: 'PDF', desc: '1주일 건강 식단을 계획할 수 있는 플래너입니다.' },
  { title: '여행 패킹 리스트', type: 'PDF', desc: '여행 전 빠짐없이 챙길 수 있는 패킹 리스트.' },
  { title: '명상 가이드 오디오', type: 'Audio', desc: '초보자를 위한 10분 명상 가이드 오디오입니다.' },
  { title: '독서 기록 노트', type: 'PDF', desc: '읽은 책을 정리할 수 있는 독서 기록 노트 템플릿.' },
];

function resourceCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-blogres-card-${n}`;
  const r = resources[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 360, height: 420 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 32,
    }),
    createTextNode({
      id: `${cId}-type`,
      parentId: cId,
      rect: { x: 32, y: 24, width: 100, height: 24 },
      text: r.type,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    heading(`${cId}-title`, { x: 32, y: 60, width: 296, height: 40 }, r.title, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-desc`,
      parentId: cId,
      rect: { x: 32, y: 112, width: 296, height: 80 },
      text: r.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 32, y: 220, width: 140, height: 44 },
      label: '다운로드',
      href: '#',
      variant: 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-blogres-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogres-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '무료 리소스',
    1,
    '#ffffff',
    'left',
    'tpl-blogres-header',
  ),

  ...resourceCard(1, 0, 0),
  ...resourceCard(2, 1, 0),
  ...resourceCard(3, 2, 0),
  ...resourceCard(4, 0, 1),
  ...resourceCard(5, 1, 1),
  ...resourceCard(6, 2, 1),
]);

export const blogResourcesTemplate: PageTemplate = {
  id: 'blog-resources',
  name: '블로그 리소스',
  category: 'blog',
  subcategory: 'resources',
  description: '다운로드 가능한 리소스, 6개 리소스 카드',
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
