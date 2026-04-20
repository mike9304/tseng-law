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
const LIST_Y = HEADER_H + 60;
const ENTRY_H = 100;
const ENTRY_GAP = 20;
const PAST_Y = LIST_Y + (ENTRY_H + ENTRY_GAP) * 6 + 60;
const PAST_H = 200;
const STAGE_H = PAST_Y + PAST_H + 80;

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

const tourDates = [
  { date: '2026.05.10', venue: '서울 올림픽홀', time: '토 19:00' },
  { date: '2026.06.22', venue: '부산 벡스코', time: '토 18:00' },
  { date: '2026.07.15', venue: '대구 엑스코', time: '일 17:00' },
  { date: '2026.08.05', venue: '인천 아트센터', time: '토 19:00' },
  { date: '2026.09.12', venue: '광주 문화전당', time: '토 18:00' },
  { date: '2026.10.01', venue: '제주 ICC', time: '일 17:00' },
];

function tourEntry(n: number): BuilderCanvasNode[] {
  const y = LIST_Y + (ENTRY_H + ENTRY_GAP) * (n - 1);
  const cId = `tpl-mustour-entry-${n}`;
  const t = tourDates[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x: 80, y, width: W - 160, height: ENTRY_H },
      background: n % 2 === 1 ? '#f3f4f6' : '#ffffff',
      borderRadius: 8,
      padding: 20,
    }),
    createTextNode({
      id: `${cId}-date`,
      parentId: cId,
      rect: { x: 20, y: 20, width: 150, height: 28 },
      text: t.date,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cId}-venue`,
      parentId: cId,
      rect: { x: 200, y: 20, width: 400, height: 28 },
      text: `${t.venue} · ${t.time}`,
      fontSize: 16,
      color: '#1f2937',
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 800, y: 16, width: 140, height: 40 },
      label: '티켓 구매',
      href: '#',
      variant: 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-mustour-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-mustour-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '투어 일정',
    1,
    '#ffffff',
    'left',
    'tpl-mustour-header',
  ),

  ...tourEntry(1),
  ...tourEntry(2),
  ...tourEntry(3),
  ...tourEntry(4),
  ...tourEntry(5),
  ...tourEntry(6),

  /* ── Past tours ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-mustour-past',
    rect: { x: 0, y: PAST_Y, width: W, height: PAST_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-mustour-past-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '지난 투어',
    2,
    '#123b63',
    'left',
    'tpl-mustour-past',
  ),
  createTextNode({
    id: 'tpl-mustour-past-text',
    parentId: 'tpl-mustour-past',
    rect: { x: 80, y: 100, width: 800, height: 60 },
    text: '2025 전국 투어 "도시의 밤" (8개 도시) · 2024 단독 콘서트 "첫 번째 여행" · 2023 대학 축제 투어',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
]);

export const musicTourTemplate: PageTemplate = {
  id: 'music-tour',
  name: '뮤직 투어 일정',
  category: 'music',
  subcategory: 'tour',
  description: '투어 일정(6개) + 티켓 CTA + 지난 투어',
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
