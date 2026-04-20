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
  /* ── Left side: info ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-contact-left',
    rect: { x: 0, y: 0, width: 600, height: STAGE_H },
    background: '#ffffff',
    borderRadius: 0,
    padding: 0,
  }),
  heading(
    'tpl-contact-title',
    { x: 80, y: 60, width: 440, height: 56 },
    '문의 및 상담',
    1,
    '#123b63',
    'left',
    'tpl-contact-left',
  ),
  createTextNode({
    id: 'tpl-contact-intro',
    parentId: 'tpl-contact-left',
    rect: { x: 80, y: 130, width: 440, height: 48 },
    text: '법률 문제가 있으시면 언제든지 연락해 주십시오. 친절하게 안내해 드리겠습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.5,
  }),
  // Address
  heading('tpl-contact-addr-label', { x: 80, y: 210, width: 200, height: 32 }, '사무소 주소', 3, '#123b63', 'left', 'tpl-contact-left'),
  createTextNode({
    id: 'tpl-contact-addr',
    parentId: 'tpl-contact-left',
    rect: { x: 80, y: 250, width: 440, height: 48 },
    text: '台北市大安區敦化南路二段XXX號X樓\n(타이베이시 다안구 둔화남로 2단 XXX번 X층)',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Phone
  heading('tpl-contact-phone-label', { x: 80, y: 320, width: 200, height: 32 }, '전화번호', 3, '#123b63', 'left', 'tpl-contact-left'),
  createTextNode({
    id: 'tpl-contact-phone',
    parentId: 'tpl-contact-left',
    rect: { x: 80, y: 360, width: 300, height: 32 },
    text: '+886-2-XXXX-XXXX',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  // Email
  heading('tpl-contact-email-label', { x: 80, y: 416, width: 200, height: 32 }, '이메일', 3, '#123b63', 'left', 'tpl-contact-left'),
  createTextNode({
    id: 'tpl-contact-email',
    parentId: 'tpl-contact-left',
    rect: { x: 80, y: 456, width: 300, height: 32 },
    text: 'contact@lawfirm.com.tw',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  // Hours
  heading('tpl-contact-hours-label', { x: 80, y: 512, width: 200, height: 32 }, '영업 시간', 3, '#123b63', 'left', 'tpl-contact-left'),
  createTextNode({
    id: 'tpl-contact-hours',
    parentId: 'tpl-contact-left',
    rect: { x: 80, y: 552, width: 400, height: 60 },
    text: '월 - 금: 09:00 ~ 18:00\n토요일: 10:00 ~ 14:00 (예약제)\n일요일 · 공휴일: 휴무',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Right side: map + CTA ───────────────────────────────── */
  createContainerNode({
    id: 'tpl-contact-right',
    rect: { x: 600, y: 0, width: 680, height: STAGE_H },
    background: '#f3f4f6',
    borderRadius: 0,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-contact-map',
    parentId: 'tpl-contact-right',
    rect: { x: 60, y: 60, width: 560, height: 400 },
    src: '/images/placeholder-map.jpg',
    alt: '사무소 위치 지도',
    style: { borderRadius: 12 },
  }),
  createButtonNode({
    id: 'tpl-contact-cta',
    parentId: 'tpl-contact-right',
    rect: { x: 60, y: 500, width: 220, height: 52 },
    label: '온라인 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  createTextNode({
    id: 'tpl-contact-cta-note',
    parentId: 'tpl-contact-right',
    rect: { x: 60, y: 570, width: 400, height: 32 },
    text: '평일 24시간 이내 답변 드립니다.',
    fontSize: 14,
    color: '#6b7280',
  }),
]);

export const lawContactTemplate: PageTemplate = {
  id: 'law-contact',
  name: '연락처',
  category: 'law',
  subcategory: 'contact',
  description: '분할 레이아웃: 좌측(주소/전화/이메일/시간) + 우측(지도/CTA)',
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
