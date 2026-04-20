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
const HERO_H = 600;
const MENU_Y = HERO_H + 80;
const MENU_H = 420;
const RESERVATION_Y = MENU_Y + MENU_H + 80;
const RESERVATION_H = 300;
const HOURS_Y = RESERVATION_Y + RESERVATION_H + 80;
const HOURS_H = 200;
const STAGE_H = HOURS_Y + HOURS_H + 80;

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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero section ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-resthome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-hero-bg',
    parentId: 'tpl-resthome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-restaurant-hero.jpg',
    alt: '레스토랑 대표 음식 이미지',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-resthome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '정성을 담은 한 접시',
    1,
    '#ffffff',
    'left',
    'tpl-resthome-hero',
  ),
  createTextNode({
    id: 'tpl-resthome-hero-tagline',
    parentId: 'tpl-resthome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '신선한 재료와 셰프의 정성으로 만드는 특별한 요리를 경험하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-resthome-hero-cta',
    parentId: 'tpl-resthome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Menu highlights ─────────────────────────────────────── */
  heading(
    'tpl-resthome-menu-title',
    { x: 80, y: MENU_Y, width: 400, height: 50 },
    '인기 메뉴',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-resthome-card-1',
    rect: { x: 80, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-1-img',
    parentId: 'tpl-resthome-card-1',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-1.jpg',
    alt: '시그니처 스테이크',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-1-title', { x: 16, y: 172, width: 228, height: 36 }, '시그니처 스테이크', 3, '#123b63', 'left', 'tpl-resthome-card-1'),
  createTextNode({
    id: 'tpl-resthome-card-1-desc',
    parentId: 'tpl-resthome-card-1',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '최상급 한우로 만든 셰프의 시그니처 스테이크입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-resthome-card-2',
    rect: { x: 370, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-2-img',
    parentId: 'tpl-resthome-card-2',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-2.jpg',
    alt: '트러플 파스타',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-2-title', { x: 16, y: 172, width: 228, height: 36 }, '트러플 파스타', 3, '#123b63', 'left', 'tpl-resthome-card-2'),
  createTextNode({
    id: 'tpl-resthome-card-2-desc',
    parentId: 'tpl-resthome-card-2',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '신선한 트러플과 수제 파스타의 완벽한 조화를 즐기세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-resthome-card-3',
    rect: { x: 660, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-3-img',
    parentId: 'tpl-resthome-card-3',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-3.jpg',
    alt: '해산물 플래터',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-3-title', { x: 16, y: 172, width: 228, height: 36 }, '해산물 플래터', 3, '#123b63', 'left', 'tpl-resthome-card-3'),
  createTextNode({
    id: 'tpl-resthome-card-3-desc',
    parentId: 'tpl-resthome-card-3',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '당일 공수한 신선한 해산물로 구성된 프리미엄 플래터입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-resthome-card-4',
    rect: { x: 950, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-4-img',
    parentId: 'tpl-resthome-card-4',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-4.jpg',
    alt: '디저트 셀렉션',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-4-title', { x: 16, y: 172, width: 228, height: 36 }, '디저트 셀렉션', 3, '#123b63', 'left', 'tpl-resthome-card-4'),
  createTextNode({
    id: 'tpl-resthome-card-4-desc',
    parentId: 'tpl-resthome-card-4',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '수제 디저트로 식사의 마무리를 달콤하게 장식하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Reservation CTA ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-resthome-reservation',
    rect: { x: 0, y: RESERVATION_Y, width: W, height: RESERVATION_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-resthome-reservation-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '특별한 날을 위한 예약',
    2,
    '#123b63',
    'left',
    'tpl-resthome-reservation',
  ),
  createTextNode({
    id: 'tpl-resthome-reservation-desc',
    parentId: 'tpl-resthome-reservation',
    rect: { x: 80, y: 110, width: 600, height: 60 },
    text: '기념일, 비즈니스 미팅, 가족 모임 등 소중한 순간을 위한 예약을 도와드립니다. 프라이빗 룸도 준비되어 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-resthome-reservation-btn',
    parentId: 'tpl-resthome-reservation',
    rect: { x: 80, y: 200, width: 180, height: 48 },
    label: '온라인 예약',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Hours / Location ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-resthome-hours',
    rect: { x: 0, y: HOURS_Y, width: W, height: HOURS_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-resthome-hours-text',
    parentId: 'tpl-resthome-hours',
    rect: { x: 80, y: 40, width: 400, height: 60 },
    text: '영업시간: 월~토 11:30 - 22:00 | 일요일 12:00 - 21:00',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-resthome-location-text',
    parentId: 'tpl-resthome-hours',
    rect: { x: 80, y: 110, width: 400, height: 40 },
    text: '서울시 강남구 테헤란로 123 레스토랑빌딩 1층',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.4,
  }),
]);

export const restaurantHomeTemplate: PageTemplate = {
  id: 'restaurant-home',
  name: '레스토랑 홈',
  category: 'restaurant',
  subcategory: 'homepage',
  description: '히어로 음식 이미지 + 인기 메뉴 카드(4개) + 예약 CTA + 영업시간/위치',
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
