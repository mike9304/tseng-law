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
const INTRO_Y = HEADER_H + 40;
const INTRO_H = 200;
const CARDS_Y = INTRO_Y + INTRO_H + 80;
const CARD_W = 260;
const CARD_H = 320;
const GAP = 24;
const CTA_Y = CARDS_Y + CARD_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

interface EventType {
  key: string;
  title: string;
  desc: string;
  img: string;
}

const eventTypes: EventType[] = [
  { key: 'wedding', title: '웨딩 리셉션', desc: '아름다운 공간에서 잊지 못할 결혼 피로연을 준비해 드립니다.', img: 'placeholder-event-wedding.jpg' },
  { key: 'corporate', title: '기업 행사', desc: '비즈니스 미팅, 회식, 워크숍 등 기업 행사를 전문적으로 지원합니다.', img: 'placeholder-event-corporate.jpg' },
  { key: 'birthday', title: '생일 파티', desc: '특별한 생일을 위한 맞춤 파티 서비스를 제공합니다.', img: 'placeholder-event-birthday.jpg' },
  { key: 'private', title: '프라이빗 디너', desc: '소규모 모임을 위한 프라이빗 다이닝 룸을 운영합니다.', img: 'placeholder-event-private.jpg' },
];

function buildEventCard(event: EventType, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-restevents-card-${event.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: CARDS_Y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 160 },
      src: `/images/${event.img}`,
      alt: `${event.title} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 16, y: 172, width: CARD_W - 32, height: 36 }, event.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 16, y: 216, width: CARD_W - 32, height: 80 },
      text: event.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restevents-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '이벤트 & 행사',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restevents-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '특별한 날을 더욱 빛나게 만들어 드립니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Intro ───────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restevents-intro',
    rect: { x: MARGIN, y: INTRO_Y, width: W - MARGIN * 2, height: INTRO_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  createTextNode({
    id: 'tpl-restevents-intro-text',
    parentId: 'tpl-restevents-intro',
    rect: { x: 32, y: 32, width: 800, height: 120 },
    text: '우리 레스토랑은 다양한 행사를 위한 맞춤 서비스를 제공합니다. 최대 80명까지 수용 가능한 넓은 공간과 전문 이벤트 코디네이터가 여러분의 행사를 완벽하게 준비해 드립니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Event type cards ────────────────────────────────────── */
  ...eventTypes.flatMap((event, i) => buildEventCard(event, i)),

  /* ── Inquiry CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restevents-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-restevents-cta-text',
    parentId: 'tpl-restevents-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '이벤트에 대해 문의하시면 맞춤 견적을 안내해 드립니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-restevents-cta-btn',
    parentId: 'tpl-restevents-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '행사 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const restaurantEventsTemplate: PageTemplate = {
  id: 'restaurant-events',
  name: '레스토랑 이벤트',
  category: 'restaurant',
  subcategory: 'events',
  description: '이벤트 소개 + 4종 이벤트 카드 + 문의 CTA',
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
