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
const HERO_H = 300;
const EVENTS_Y = HERO_H + 80;
const EVENTS_H = 560;
const STAGE_H = EVENTS_Y + EVENTS_H + 80;

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

const events = [
  { title: '재즈 라이브 나이트', date: '매주 금요일 19:00', desc: '라이브 재즈 공연과 함께하는 특별한 저녁. 시그니처 칵테일 10% 할인.' },
  { title: '커핑 테이스팅', date: '매월 첫째 토요일 14:00', desc: '새로운 원두를 함께 시음하는 커핑 세션. 참가비 무료, 사전 예약 필수.' },
  { title: '라떼아트 워크숍', date: '매월 셋째 일요일 11:00', desc: '프로 바리스타에게 배우는 라떼아트. 기본 기법부터 고급 패턴까지.' },
  { title: '홈베이킹 클래스', date: '매월 둘째 토요일 10:00', desc: '시그니처 스콘과 머핀 만들기. 재료비 포함, 만든 제품 포장 제공.' },
];

const cardW = 550;
const cardH = 200;
const gapY = 20;

const eventCards: BuilderCanvasNode[] = events.flatMap((e, i) => {
  const y = EVENTS_Y + 70 + i * (cardH + gapY);
  const prefix = `tpl-cafeevt-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x: 80, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 502, height: 36 }, e.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-date`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 300, height: 24 },
      text: e.date,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 100, width: 502, height: 60 },
      text: e.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafeevt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafeevt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '이벤트', 1, '#ffffff', 'left', 'tpl-cafeevt-hero'),
  createTextNode({
    id: 'tpl-cafeevt-hero-sub',
    parentId: 'tpl-cafeevt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '라이브 음악, 테이스팅, 워크숍 등 다양한 이벤트에 참여하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-cafeevt-events-title', { x: 80, y: EVENTS_Y, width: 400, height: 50 }, '예정된 이벤트', 2, '#123b63', 'left'),
  ...eventCards,
  createButtonNode({
    id: 'tpl-cafeevt-reserve-btn',
    rect: { x: 680, y: EVENTS_Y + 100, width: 200, height: 48 },
    label: '이벤트 예약',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const cafeEventsTemplate: PageTemplate = {
  id: 'cafe-events',
  name: '카페 이벤트',
  category: 'cafe',
  subcategory: 'events',
  description: '라이브 음악, 테이스팅, 워크숍 — 4개 이벤트 카드',
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
