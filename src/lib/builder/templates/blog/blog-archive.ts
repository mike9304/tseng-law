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
const LIST_Y = HEADER_H + 60;
const ENTRY_H = 120;
const ENTRY_GAP = 20;
const STAGE_H = LIST_Y + (ENTRY_H + ENTRY_GAP) * 8 + 60;

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

const articles = [
  { title: '2026년 라이프스타일 트렌드', date: '2026.04.10', cat: '라이프스타일' },
  { title: '디지털 노마드의 삶', date: '2026.04.03', cat: '테크' },
  { title: '봄맞이 인테리어 가이드', date: '2026.03.27', cat: '라이프스타일' },
  { title: '유럽 소도시 여행기', date: '2026.03.20', cat: '여행' },
  { title: '건강한 아침 루틴 5가지', date: '2026.03.13', cat: '건강' },
  { title: '미니멀 워드로브 만들기', date: '2026.03.06', cat: '패션' },
  { title: '독서 습관 기르는 법', date: '2026.02.27', cat: '문화' },
  { title: '홈 카페 레시피 모음', date: '2026.02.20', cat: '푸드' },
];

function archiveEntry(n: number): BuilderCanvasNode[] {
  const y = LIST_Y + (ENTRY_H + ENTRY_GAP) * (n - 1);
  const cId = `tpl-blogarc-entry-${n}`;
  const a = articles[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x: 80, y, width: W - 160, height: ENTRY_H },
      background: n % 2 === 1 ? '#f3f4f6' : '#ffffff',
      borderRadius: 8,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-thumb`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 160, height: ENTRY_H },
      src: `/images/placeholder-archive-${n}.jpg`,
      alt: `${a.title} 썸네일`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-title`, { x: 180, y: 16, width: 500, height: 30 }, a.title, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-meta`,
      parentId: cId,
      rect: { x: 180, y: 52, width: 300, height: 20 },
      text: `${a.date} · ${a.cat}`,
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-excerpt`,
      parentId: cId,
      rect: { x: 180, y: 80, width: 700, height: 28 },
      text: '흥미로운 이야기와 실용적인 정보를 제공하는 기사입니다. 더 알아보세요.',
      fontSize: 14,
      color: '#1f2937',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-blogarc-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogarc-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '전체 아카이브',
    1,
    '#ffffff',
    'left',
    'tpl-blogarc-header',
  ),

  ...archiveEntry(1),
  ...archiveEntry(2),
  ...archiveEntry(3),
  ...archiveEntry(4),
  ...archiveEntry(5),
  ...archiveEntry(6),
  ...archiveEntry(7),
  ...archiveEntry(8),
]);

export const blogArchiveTemplate: PageTemplate = {
  id: 'blog-archive',
  name: '블로그 아카이브',
  category: 'blog',
  subcategory: 'archive',
  description: '전체 아카이브, 8개 기사 카드 시간순 배열',
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
