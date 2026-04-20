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
const FORM_Y = HEADER_H + 40;
const FORM_H = 400;
const MAP_Y = FORM_Y + FORM_H + 80;
const MAP_H = 360;
const INFO_Y = MAP_Y + MAP_H + 80;
const INFO_H = 200;
const STAGE_H = INFO_Y + INFO_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restcontact-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '예약 및 문의',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restcontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '예약이나 문의사항이 있으시면 언제든지 연락해 주세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Reservation form area ───────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-form',
    rect: { x: MARGIN, y: FORM_Y, width: 600, height: FORM_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-restcontact-form-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '예약 신청',
    2,
    '#123b63',
    'left',
    'tpl-restcontact-form',
  ),
  createTextNode({
    id: 'tpl-restcontact-form-desc',
    parentId: 'tpl-restcontact-form',
    rect: { x: 32, y: 80, width: 500, height: 80 },
    text: '날짜, 시간, 인원 수를 알려주시면 빠르게 예약을 확인해 드립니다. 특별 요청사항이 있으시면 메시지란에 남겨 주세요.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-restcontact-form-btn',
    parentId: 'tpl-restcontact-form',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '예약 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Side info ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-info',
    rect: { x: 720, y: FORM_Y, width: 480, height: FORM_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-restcontact-info-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '연락처 정보',
    2,
    '#ffffff',
    'left',
    'tpl-restcontact-info',
  ),
  createTextNode({
    id: 'tpl-restcontact-phone',
    parentId: 'tpl-restcontact-info',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '전화: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-restcontact-hours',
    parentId: 'tpl-restcontact-info',
    rect: { x: 32, y: 140, width: 400, height: 60 },
    text: '영업시간\n월~토: 11:30 - 22:00\n일: 12:00 - 21:00',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-restcontact-address',
    parentId: 'tpl-restcontact-info',
    rect: { x: 32, y: 230, width: 400, height: 40 },
    text: '서울시 강남구 테헤란로 123 레스토랑빌딩 1층',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.4,
  }),

  /* ── Map ──────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-map',
    rect: { x: MARGIN, y: MAP_Y, width: W - MARGIN * 2, height: MAP_H },
    background: '#e2e8f0',
    borderRadius: 12,
  }),
  createImageNode({
    id: 'tpl-restcontact-map-img',
    parentId: 'tpl-restcontact-map',
    rect: { x: 0, y: 0, width: W - MARGIN * 2, height: MAP_H },
    src: '/images/placeholder-map.jpg',
    alt: '레스토랑 위치 지도',
    style: { borderRadius: 12 },
  }),

  /* ── Hours strip ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-strip',
    rect: { x: 0, y: INFO_Y, width: W, height: INFO_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-restcontact-strip-text',
    parentId: 'tpl-restcontact-strip',
    rect: { x: MARGIN, y: 60, width: 600, height: 60 },
    text: '특별한 날의 프라이빗 다이닝도 예약 가능합니다. 전화로 문의해 주세요.',
    fontSize: 18,
    color: '#123b63',
    fontWeight: 'medium',
    lineHeight: 1.5,
  }),
]);

export const restaurantContactTemplate: PageTemplate = {
  id: 'restaurant-contact',
  name: '레스토랑 예약/문의',
  category: 'restaurant',
  subcategory: 'contact',
  description: '예약 폼 영역 + 지도 + 영업시간 + 전화번호',
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
