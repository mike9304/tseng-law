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
const MAP_H = 320;
const HOURS_Y = MAP_Y + MAP_H + 80;
const HOURS_H = 200;
const STAGE_H = HOURS_Y + HOURS_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-educontact-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '입학 문의', 1, '#123b63'),
  createTextNode({
    id: 'tpl-educontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '입학 상담 및 캠퍼스 방문을 신청하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  createContainerNode({
    id: 'tpl-educontact-form',
    rect: { x: MARGIN, y: FORM_Y, width: 600, height: FORM_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading('tpl-educontact-form-title', { x: 32, y: 24, width: 400, height: 40 }, '입학 상담 신청', 2, '#123b63', 'left', 'tpl-educontact-form'),
  createTextNode({
    id: 'tpl-educontact-form-desc',
    parentId: 'tpl-educontact-form',
    rect: { x: 32, y: 80, width: 500, height: 100 },
    text: '관심 학과, 입학 시기, 연락처를 남겨주시면 입학 담당자가 상세한 안내를 드립니다. 캠퍼스 투어도 신청 가능합니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-educontact-form-btn',
    parentId: 'tpl-educontact-form',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  createContainerNode({
    id: 'tpl-educontact-info',
    rect: { x: 720, y: FORM_Y, width: 480, height: FORM_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading('tpl-educontact-info-title', { x: 32, y: 24, width: 400, height: 40 }, '연락처', 2, '#ffffff', 'left', 'tpl-educontact-info'),
  createTextNode({
    id: 'tpl-educontact-phone',
    parentId: 'tpl-educontact-info',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '입학처: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-educontact-email',
    parentId: 'tpl-educontact-info',
    rect: { x: 32, y: 130, width: 400, height: 30 },
    text: '이메일: admission@school-example.kr',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  }),
  createTextNode({
    id: 'tpl-educontact-address',
    parentId: 'tpl-educontact-info',
    rect: { x: 32, y: 180, width: 400, height: 40 },
    text: '서울시 서초구 교육로 100',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  }),

  createContainerNode({
    id: 'tpl-educontact-map',
    rect: { x: MARGIN, y: MAP_Y, width: W - MARGIN * 2, height: MAP_H },
    background: '#e2e8f0',
    borderRadius: 12,
  }),
  createImageNode({
    id: 'tpl-educontact-map-img',
    parentId: 'tpl-educontact-map',
    rect: { x: 0, y: 0, width: W - MARGIN * 2, height: MAP_H },
    src: '/images/placeholder-campus-map.jpg',
    alt: '캠퍼스 위치 지도',
    style: { borderRadius: 12 },
  }),

  createContainerNode({
    id: 'tpl-educontact-hours',
    rect: { x: 0, y: HOURS_Y, width: W, height: HOURS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-educontact-hours-title', { x: MARGIN, y: 40, width: 300, height: 44 }, '사무실 운영시간', 2, '#123b63', 'left', 'tpl-educontact-hours'),
  createTextNode({
    id: 'tpl-educontact-hours-text',
    parentId: 'tpl-educontact-hours',
    rect: { x: MARGIN, y: 100, width: 600, height: 60 },
    text: '평일: 09:00 - 18:00 | 토요일: 09:00 - 13:00 | 일요일/공휴일: 휴무',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
]);

export const educationContactTemplate: PageTemplate = {
  id: 'education-contact',
  name: '입학 문의',
  category: 'education',
  subcategory: 'contact',
  description: '입학 상담 폼 + 캠퍼스 지도 + 운영시간',
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
