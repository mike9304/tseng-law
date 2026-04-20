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
const OFFICES_Y = FORM_Y + FORM_H + 80;
const OFFICES_H = 280;
const STAGE_H = OFFICES_Y + OFFICES_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-recontact-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '문의하기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-recontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '매물 문의나 상담 요청을 남겨주세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Inquiry form area ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-recontact-form',
    rect: { x: MARGIN, y: FORM_Y, width: 600, height: FORM_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-recontact-form-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '상담 신청',
    2,
    '#123b63',
    'left',
    'tpl-recontact-form',
  ),
  createTextNode({
    id: 'tpl-recontact-form-desc',
    parentId: 'tpl-recontact-form',
    rect: { x: 32, y: 80, width: 500, height: 100 },
    text: '관심 있는 매물이나 지역, 예산 등을 알려주시면 맞춤 매물을 추천해 드립니다. 무료 상담이며, 빠른 시간 내에 연락드리겠습니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-recontact-form-btn',
    parentId: 'tpl-recontact-form',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Contact info ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-recontact-info',
    rect: { x: 720, y: FORM_Y, width: 480, height: FORM_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-recontact-info-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '연락처',
    2,
    '#ffffff',
    'left',
    'tpl-recontact-info',
  ),
  createTextNode({
    id: 'tpl-recontact-phone',
    parentId: 'tpl-recontact-info',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '대표전화: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-recontact-email',
    parentId: 'tpl-recontact-info',
    rect: { x: 32, y: 130, width: 400, height: 30 },
    text: '이메일: info@realestate-example.kr',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  }),
  createTextNode({
    id: 'tpl-recontact-hours',
    parentId: 'tpl-recontact-info',
    rect: { x: 32, y: 180, width: 400, height: 60 },
    text: '상담시간\n평일: 09:00 - 18:00\n토요일: 10:00 - 15:00',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),

  /* ── Office locations ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-recontact-offices',
    rect: { x: 0, y: OFFICES_Y, width: W, height: OFFICES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-recontact-offices-title',
    { x: MARGIN, y: 40, width: 300, height: 44 },
    '사무소 위치',
    2,
    '#123b63',
    'left',
    'tpl-recontact-offices',
  ),
  createContainerNode({
    id: 'tpl-recontact-office-1',
    parentId: 'tpl-recontact-offices',
    rect: { x: MARGIN, y: 100, width: 480, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 24,
  }),
  heading('tpl-recontact-office-1-title', { x: 24, y: 16, width: 300, height: 28 }, '강남 본점', 3, '#123b63', 'left', 'tpl-recontact-office-1'),
  createTextNode({
    id: 'tpl-recontact-office-1-addr',
    parentId: 'tpl-recontact-office-1',
    rect: { x: 24, y: 52, width: 400, height: 60 },
    text: '서울시 강남구 테헤란로 456\n02-1234-5678',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-recontact-office-2',
    parentId: 'tpl-recontact-offices',
    rect: { x: 600, y: 100, width: 480, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 24,
  }),
  heading('tpl-recontact-office-2-title', { x: 24, y: 16, width: 300, height: 28 }, '여의도 지점', 3, '#123b63', 'left', 'tpl-recontact-office-2'),
  createTextNode({
    id: 'tpl-recontact-office-2-addr',
    parentId: 'tpl-recontact-office-2',
    rect: { x: 24, y: 52, width: 400, height: 60 },
    text: '서울시 영등포구 여의대로 789\n02-9876-5432',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),
]);

export const realestateContactTemplate: PageTemplate = {
  id: 'realestate-contact',
  name: '부동산 문의',
  category: 'realestate',
  subcategory: 'contact',
  description: '상담 신청 폼 + 사무소 위치 + 연락처',
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
