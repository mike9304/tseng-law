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
const STAGE_H = 700;

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
  /* ── Left side: trial signup ─────────────────────────────── */
  createContainerNode({
    id: 'tpl-fitcontact-left',
    rect: { x: 0, y: 0, width: 600, height: STAGE_H },
    background: '#ffffff',
    borderRadius: 0,
    padding: 0,
  }),
  heading(
    'tpl-fitcontact-title',
    { x: 80, y: 60, width: 440, height: 56 },
    '무료 체험 신청',
    1,
    '#123b63',
    'left',
    'tpl-fitcontact-left',
  ),
  createTextNode({
    id: 'tpl-fitcontact-intro',
    parentId: 'tpl-fitcontact-left',
    rect: { x: 80, y: 130, width: 440, height: 48 },
    text: '1일 무료 체험으로 시설과 프로그램을 직접 경험해 보세요!',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.5,
  }),
  heading('tpl-fitcontact-addr-label', { x: 80, y: 210, width: 200, height: 32 }, '위치', 3, '#123b63', 'left', 'tpl-fitcontact-left'),
  createTextNode({
    id: 'tpl-fitcontact-addr',
    parentId: 'tpl-fitcontact-left',
    rect: { x: 80, y: 250, width: 440, height: 32 },
    text: '서울시 강남구 삼성로 456 피트니스빌딩 B1~2F',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  heading('tpl-fitcontact-phone-label', { x: 80, y: 310, width: 200, height: 32 }, '전화번호', 3, '#123b63', 'left', 'tpl-fitcontact-left'),
  createTextNode({
    id: 'tpl-fitcontact-phone',
    parentId: 'tpl-fitcontact-left',
    rect: { x: 80, y: 350, width: 300, height: 32 },
    text: '02-9876-5432',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  heading('tpl-fitcontact-hours-label', { x: 80, y: 410, width: 200, height: 32 }, '영업 시간', 3, '#123b63', 'left', 'tpl-fitcontact-left'),
  createTextNode({
    id: 'tpl-fitcontact-hours',
    parentId: 'tpl-fitcontact-left',
    rect: { x: 80, y: 450, width: 400, height: 80 },
    text: '월 - 금: 06:00 ~ 23:00\n토요일: 08:00 ~ 20:00\n일요일/공휴일: 09:00 ~ 18:00',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createButtonNode({
    id: 'tpl-fitcontact-trial-btn',
    parentId: 'tpl-fitcontact-left',
    rect: { x: 80, y: 570, width: 200, height: 52 },
    label: '무료 체험 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Right side: map ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fitcontact-right',
    rect: { x: 600, y: 0, width: 680, height: STAGE_H },
    background: '#f3f4f6',
    borderRadius: 0,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-fitcontact-map',
    parentId: 'tpl-fitcontact-right',
    rect: { x: 60, y: 60, width: 560, height: 400 },
    src: '/images/placeholder-gym-map.jpg',
    alt: '피트니스 센터 위치 지도',
    style: { borderRadius: 12 },
  }),
  createTextNode({
    id: 'tpl-fitcontact-parking',
    parentId: 'tpl-fitcontact-right',
    rect: { x: 60, y: 490, width: 400, height: 32 },
    text: '건물 내 무료 주차 2시간 가능 (회원 할인)',
    fontSize: 14,
    color: '#6b7280',
  }),
]);

export const fitnessContactTemplate: PageTemplate = {
  id: 'fitness-contact',
  name: '피트니스 연락처',
  category: 'fitness',
  subcategory: 'contact',
  description: '분할 레이아웃: 좌측(무료 체험/위치/영업시간) + 우측(지도)',
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
