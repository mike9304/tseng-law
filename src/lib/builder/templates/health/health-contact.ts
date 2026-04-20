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
const BOOKING_Y = HEADER_H + 40;
const BOOKING_H = 400;
const EMERGENCY_Y = BOOKING_Y + BOOKING_H + 80;
const EMERGENCY_H = 200;
const MAP_Y = EMERGENCY_Y + EMERGENCY_H + 80;
const MAP_H = 360;
const HOURS_Y = MAP_Y + MAP_H + 80;
const HOURS_H = 200;
const STAGE_H = HOURS_Y + HOURS_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthcontact-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '진료 예약 및 문의',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthcontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '편리하게 진료를 예약하고 문의하실 수 있습니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Appointment booking area ────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcontact-booking',
    rect: { x: MARGIN, y: BOOKING_Y, width: 600, height: BOOKING_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-healthcontact-booking-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '온라인 예약',
    2,
    '#123b63',
    'left',
    'tpl-healthcontact-booking',
  ),
  createTextNode({
    id: 'tpl-healthcontact-booking-desc',
    parentId: 'tpl-healthcontact-booking',
    rect: { x: 32, y: 80, width: 500, height: 120 },
    text: '원하시는 진료과, 날짜, 시간을 선택하여 예약해 주세요. 예약 확인 문자를 보내드립니다. 초진의 경우 15분 전에 내원해 주시기 바랍니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-healthcontact-booking-btn',
    parentId: 'tpl-healthcontact-booking',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Contact info sidebar ────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcontact-sidebar',
    rect: { x: 720, y: BOOKING_Y, width: 480, height: BOOKING_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-healthcontact-sidebar-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '연락처',
    2,
    '#ffffff',
    'left',
    'tpl-healthcontact-sidebar',
  ),
  createTextNode({
    id: 'tpl-healthcontact-phone',
    parentId: 'tpl-healthcontact-sidebar',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '대표전화: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-healthcontact-fax',
    parentId: 'tpl-healthcontact-sidebar',
    rect: { x: 32, y: 130, width: 400, height: 30 },
    text: '팩스: 02-1234-5679',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  }),
  createTextNode({
    id: 'tpl-healthcontact-email',
    parentId: 'tpl-healthcontact-sidebar',
    rect: { x: 32, y: 170, width: 400, height: 30 },
    text: '이메일: info@hospital-example.kr',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  }),

  /* ── Emergency info ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcontact-emergency',
    rect: { x: 0, y: EMERGENCY_Y, width: W, height: EMERGENCY_H },
    background: '#fef2f2',
    borderRadius: 0,
  }),
  heading(
    'tpl-healthcontact-emergency-title',
    { x: MARGIN, y: 40, width: 300, height: 44 },
    '응급 연락',
    2,
    '#dc2626',
    'left',
    'tpl-healthcontact-emergency',
  ),
  createTextNode({
    id: 'tpl-healthcontact-emergency-desc',
    parentId: 'tpl-healthcontact-emergency',
    rect: { x: MARGIN, y: 100, width: 600, height: 60 },
    text: '응급 상황 시 119로 전화하시거나, 응급실 직통번호 02-1234-9999로 연락해 주세요. 24시간 응급 진료 가능합니다.',
    fontSize: 16,
    color: '#991b1b',
    lineHeight: 1.6,
  }),

  /* ── Map ──────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcontact-map',
    rect: { x: MARGIN, y: MAP_Y, width: W - MARGIN * 2, height: MAP_H },
    background: '#e2e8f0',
    borderRadius: 12,
  }),
  createImageNode({
    id: 'tpl-healthcontact-map-img',
    parentId: 'tpl-healthcontact-map',
    rect: { x: 0, y: 0, width: W - MARGIN * 2, height: MAP_H },
    src: '/images/placeholder-map.jpg',
    alt: '병원 위치 지도',
    style: { borderRadius: 12 },
  }),

  /* ── Hours ───────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcontact-hours',
    rect: { x: 0, y: HOURS_Y, width: W, height: HOURS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-healthcontact-hours-title',
    { x: MARGIN, y: 40, width: 300, height: 44 },
    '진료 시간',
    2,
    '#123b63',
    'left',
    'tpl-healthcontact-hours',
  ),
  createTextNode({
    id: 'tpl-healthcontact-hours-text',
    parentId: 'tpl-healthcontact-hours',
    rect: { x: MARGIN, y: 100, width: 600, height: 60 },
    text: '평일: 09:00 - 18:00 | 토요일: 09:00 - 13:00 | 일요일/공휴일: 휴진\n점심시간: 12:30 - 14:00',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
]);

export const healthContactTemplate: PageTemplate = {
  id: 'health-contact',
  name: '병원 예약/문의',
  category: 'health',
  subcategory: 'contact',
  description: '예약 폼 영역 + 응급 연락 + 위치 지도 + 진료 시간',
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
