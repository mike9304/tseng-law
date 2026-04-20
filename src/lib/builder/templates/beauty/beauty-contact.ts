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
  /* ── Left side: booking info ─────────────────────────────── */
  createContainerNode({
    id: 'tpl-beautycontact-left',
    rect: { x: 0, y: 0, width: 600, height: STAGE_H },
    background: '#ffffff',
    borderRadius: 0,
    padding: 0,
  }),
  heading(
    'tpl-beautycontact-title',
    { x: 80, y: 60, width: 440, height: 56 },
    '예약 및 문의',
    1,
    '#123b63',
    'left',
    'tpl-beautycontact-left',
  ),
  createTextNode({
    id: 'tpl-beautycontact-intro',
    parentId: 'tpl-beautycontact-left',
    rect: { x: 80, y: 130, width: 440, height: 48 },
    text: '전화 또는 온라인으로 편리하게 예약하세요. 첫 방문 고객 할인 혜택!',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.5,
  }),
  heading('tpl-beautycontact-addr-label', { x: 80, y: 210, width: 200, height: 32 }, '위치', 3, '#123b63', 'left', 'tpl-beautycontact-left'),
  createTextNode({
    id: 'tpl-beautycontact-addr',
    parentId: 'tpl-beautycontact-left',
    rect: { x: 80, y: 250, width: 440, height: 32 },
    text: '서울시 강남구 신사동 가로수길 12 2층',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  heading('tpl-beautycontact-phone-label', { x: 80, y: 310, width: 200, height: 32 }, '전화번호', 3, '#123b63', 'left', 'tpl-beautycontact-left'),
  createTextNode({
    id: 'tpl-beautycontact-phone',
    parentId: 'tpl-beautycontact-left',
    rect: { x: 80, y: 350, width: 300, height: 32 },
    text: '02-1234-5678',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  heading('tpl-beautycontact-hours-label', { x: 80, y: 410, width: 200, height: 32 }, '영업 시간', 3, '#123b63', 'left', 'tpl-beautycontact-left'),
  createTextNode({
    id: 'tpl-beautycontact-hours',
    parentId: 'tpl-beautycontact-left',
    rect: { x: 80, y: 450, width: 400, height: 80 },
    text: '화 - 토: 10:00 ~ 20:00\n일요일: 11:00 ~ 18:00\n월요일: 정기 휴무',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createButtonNode({
    id: 'tpl-beautycontact-booking-btn',
    parentId: 'tpl-beautycontact-left',
    rect: { x: 80, y: 570, width: 200, height: 52 },
    label: '온라인 예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Right side: map ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-beautycontact-right',
    rect: { x: 600, y: 0, width: 680, height: STAGE_H },
    background: '#f3f4f6',
    borderRadius: 0,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-beautycontact-map',
    parentId: 'tpl-beautycontact-right',
    rect: { x: 60, y: 60, width: 560, height: 400 },
    src: '/images/placeholder-salon-map.jpg',
    alt: '살롱 위치 지도',
    style: { borderRadius: 12 },
  }),
  createTextNode({
    id: 'tpl-beautycontact-map-note',
    parentId: 'tpl-beautycontact-right',
    rect: { x: 60, y: 490, width: 400, height: 32 },
    text: '신사역 8번 출구에서 도보 3분',
    fontSize: 14,
    color: '#6b7280',
  }),
]);

export const beautyContactTemplate: PageTemplate = {
  id: 'beauty-contact',
  name: '살롱 연락처',
  category: 'beauty',
  subcategory: 'contact',
  description: '분할 레이아웃: 좌측(예약 정보/위치/영업시간) + 우측(지도)',
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
