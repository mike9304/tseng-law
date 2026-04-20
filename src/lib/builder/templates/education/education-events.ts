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
const MARGIN = 80;

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

const HEADER_H = 140;
const CARD_W = 540;
const CARD_H = 220;
const GAP = 24;
const COLS = 2;

interface Event {
  key: string;
  title: string;
  date: string;
  time: string;
  desc: string;
}

const events: Event[] = [
  { key: 'open-campus', title: '오픈 캠퍼스', date: '2026.05.15', time: '10:00 - 16:00', desc: '캠퍼스 투어, 학과 체험, 입학 상담을 한 번에 경험할 수 있는 행사입니다.' },
  { key: 'graduation', title: '졸업 작품전', date: '2026.06.20', time: '09:00 - 18:00', desc: '졸업생들의 우수 작품을 전시하는 연례 졸업 작품전입니다.' },
  { key: 'seminar', title: '산업 세미나', date: '2026.07.10', time: '14:00 - 17:00', desc: '업계 전문가를 초청하여 최신 산업 동향을 공유하는 세미나입니다.' },
  { key: 'festival', title: '대학 축제', date: '2026.09.25', time: '종일', desc: '학생회 주관의 연례 대학 축제. 공연, 부스, 먹거리가 가득합니다.' },
];

function buildEventCard(event: Event, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-eduevents-card-${event.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    heading(`${cid}-title`, { x: 24, y: 20, width: 400, height: 36 }, event.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-date`,
      parentId: cid,
      rect: { x: 24, y: 64, width: 200, height: 24 },
      text: `${event.date} | ${event.time}`,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 100, width: 480, height: 60 },
      text: event.desc,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 24, y: 172, width: 130, height: 36 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const ROWS = Math.ceil(events.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-eduevents-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '행사 일정', 1, '#123b63'),
  createTextNode({
    id: 'tpl-eduevents-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '다가오는 주요 행사와 이벤트를 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...events.flatMap((e, i) => buildEventCard(e, i)),
]);

export const educationEventsTemplate: PageTemplate = {
  id: 'education-events',
  name: '행사 일정',
  category: 'education',
  subcategory: 'events',
  description: '행사 일정 + 4개 이벤트 카드(날짜 포함)',
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
