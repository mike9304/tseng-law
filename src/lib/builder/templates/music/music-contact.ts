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
const BOOKING_H = 360;
const MGMT_Y = BOOKING_H + 80;
const MGMT_H = 260;
const PRESS_Y = MGMT_Y + MGMT_H + 80;
const PRESS_H = 200;
const STAGE_H = PRESS_Y + PRESS_H + 80;

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
  /* ── Booking inquiry ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-muscontact-booking',
    rect: { x: 0, y: 0, width: W, height: BOOKING_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-muscontact-title',
    { x: 80, y: 60, width: 500, height: 50 },
    '공연 섭외 문의',
    1,
    '#ffffff',
    'left',
    'tpl-muscontact-booking',
  ),
  createTextNode({
    id: 'tpl-muscontact-desc',
    parentId: 'tpl-muscontact-booking',
    rect: { x: 80, y: 130, width: 600, height: 80 },
    text: '페스티벌, 기업 행사, 대학 축제 등 공연 섭외를 원하시면\n아래 이메일로 연락해 주세요.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.8,
  }),
  createTextNode({
    id: 'tpl-muscontact-email',
    parentId: 'tpl-muscontact-booking',
    rect: { x: 80, y: 230, width: 400, height: 32 },
    text: 'booking@blueharmony.kr',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createButtonNode({
    id: 'tpl-muscontact-btn',
    parentId: 'tpl-muscontact-booking',
    rect: { x: 80, y: 280, width: 180, height: 48 },
    label: '문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Management contact ─────────────────────────────────── */
  heading(
    'tpl-muscontact-mgmt-title',
    { x: 80, y: MGMT_Y, width: 400, height: 50 },
    '매니지먼트',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-muscontact-mgmt',
    rect: { x: 80, y: MGMT_Y + 70, width: W - 160, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-muscontact-mgmt-info',
    parentId: 'tpl-muscontact-mgmt',
    rect: { x: 24, y: 16, width: 600, height: 120 },
    text: '소속사: 블루뮤직 엔터테인먼트\n매니저: 이정민\n이메일: manager@bluemusic.kr\n전화: 02-777-8899',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Press kit ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-muscontact-press',
    rect: { x: 0, y: PRESS_Y, width: W, height: PRESS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-muscontact-press-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '프레스 키트',
    2,
    '#123b63',
    'left',
    'tpl-muscontact-press',
  ),
  createTextNode({
    id: 'tpl-muscontact-press-desc',
    parentId: 'tpl-muscontact-press',
    rect: { x: 80, y: 100, width: 500, height: 40 },
    text: '고해상도 사진, 바이오, 로고 등을 다운로드하실 수 있습니다.',
    fontSize: 15,
    color: '#1f2937',
  }),
  createButtonNode({
    id: 'tpl-muscontact-press-btn',
    parentId: 'tpl-muscontact-press',
    rect: { x: 80, y: 150, width: 200, height: 44 },
    label: '프레스 키트 다운로드',
    href: '#',
    variant: 'outline',
    style: { borderRadius: 6 },
  }),
]);

export const musicContactTemplate: PageTemplate = {
  id: 'music-contact',
  name: '뮤직 연락처',
  category: 'music',
  subcategory: 'contact',
  description: '공연 섭외 문의 + 매니지먼트 연락처 + 프레스 키트 다운로드',
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
