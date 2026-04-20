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
const BOOKING_Y = HERO_H + 80;
const BOOKING_H = 360;
const EMERGENCY_Y = BOOKING_Y + BOOKING_H + 80;
const EMERGENCY_H = 200;
const STAGE_H = EMERGENCY_Y + EMERGENCY_H + 80;

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
  createContainerNode({
    id: 'tpl-petcon-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petcon-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '예약 & 문의', 1, '#ffffff', 'left', 'tpl-petcon-hero'),
  createTextNode({
    id: 'tpl-petcon-hero-sub',
    parentId: 'tpl-petcon-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '온라인으로 간편하게 예약하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Booking area ───────────────────────────────────────── */
  heading('tpl-petcon-book-title', { x: 80, y: BOOKING_Y, width: 400, height: 50 }, '진료 예약', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-petcon-book-form',
    rect: { x: 80, y: BOOKING_Y + 60, width: 600, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-petcon-book-desc',
    parentId: 'tpl-petcon-book-form',
    rect: { x: 24, y: 24, width: 552, height: 80 },
    text: '보호자 이름, 반려동물 이름/종류, 희망 진료일, 증상을 입력해 주세요. 확인 후 연락드립니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-petcon-book-btn',
    parentId: 'tpl-petcon-book-form',
    rect: { x: 24, y: 180, width: 180, height: 48 },
    label: '예약 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Location & hours ───────────────────────────────────── */
  createTextNode({
    id: 'tpl-petcon-addr',
    rect: { x: 740, y: BOOKING_Y + 60, width: 400, height: 40 },
    text: '서울시 서초구 반포대로 45 동물의료센터 2층',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-petcon-hours',
    rect: { x: 740, y: BOOKING_Y + 110, width: 400, height: 80 },
    text: '진료시간: 월~토 09:00-20:00\n일요일/공휴일: 10:00-17:00\n점심시간: 13:00-14:00',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-petcon-phone',
    rect: { x: 740, y: BOOKING_Y + 210, width: 400, height: 40 },
    text: '전화: 02-1234-5678',
    fontSize: 18,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.4,
  }),

  /* ── Emergency hours ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-petcon-emergency',
    rect: { x: 0, y: EMERGENCY_Y, width: W, height: EMERGENCY_H },
    background: '#e8a838',
    borderRadius: 0,
  }),
  heading('tpl-petcon-emerg-title', { x: 80, y: 40, width: 600, height: 50 }, '응급 진료 안내', 2, '#ffffff', 'left', 'tpl-petcon-emergency'),
  createTextNode({
    id: 'tpl-petcon-emerg-desc',
    parentId: 'tpl-petcon-emergency',
    rect: { x: 80, y: 100, width: 600, height: 60 },
    text: '24시간 응급 진료 가능. 야간/공휴일 응급전화: 02-9999-1234',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 1.4,
  }),
]);

export const petContactTemplate: PageTemplate = {
  id: 'pet-contact',
  name: '동물병원 연락처',
  category: 'pet',
  subcategory: 'contact',
  description: '예약 영역 + 응급 진료 시간 + 위치',
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
