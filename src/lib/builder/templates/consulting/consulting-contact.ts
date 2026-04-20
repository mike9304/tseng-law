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
const FORM_Y = HERO_H + 80;
const FORM_H = 360;
const OFFICES_Y = FORM_Y + FORM_H + 80;
const OFFICES_H = 280;
const STAGE_H = OFFICES_Y + OFFICES_H + 80;

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
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-conscon-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-conscon-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '문의하기', 1, '#ffffff', 'left', 'tpl-conscon-hero'),
  createTextNode({
    id: 'tpl-conscon-hero-sub',
    parentId: 'tpl-conscon-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '무료 상담을 통해 최적의 솔루션을 안내받으세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Free consultation area ─────────────────────────────── */
  heading('tpl-conscon-form-title', { x: 80, y: FORM_Y, width: 400, height: 50 }, '무료 상담 신청', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-conscon-form',
    rect: { x: 80, y: FORM_Y + 60, width: 600, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-conscon-form-desc',
    parentId: 'tpl-conscon-form',
    rect: { x: 24, y: 24, width: 552, height: 80 },
    text: '이름, 이메일, 회사명, 관심 서비스를 입력해 주세요. 24시간 이내에 전문 컨설턴트가 연락드립니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-conscon-form-btn',
    parentId: 'tpl-conscon-form',
    rect: { x: 24, y: 180, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Phone / Info ───────────────────────────────────────── */
  createTextNode({
    id: 'tpl-conscon-phone',
    rect: { x: 740, y: FORM_Y + 60, width: 400, height: 40 },
    text: '전화: 02-1234-5678',
    fontSize: 18,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-conscon-email',
    rect: { x: 740, y: FORM_Y + 110, width: 400, height: 40 },
    text: '이메일: contact@consulting.co.kr',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),

  /* ── Office locations ───────────────────────────────────── */
  heading('tpl-conscon-office-title', { x: 80, y: OFFICES_Y, width: 400, height: 50 }, '오피스 위치', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-conscon-office-1',
    rect: { x: 80, y: OFFICES_Y + 60, width: 360, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-conscon-office-1-t', { x: 24, y: 24, width: 312, height: 36 }, '서울 본사', 3, '#123b63', 'left', 'tpl-conscon-office-1'),
  createTextNode({
    id: 'tpl-conscon-office-1-d',
    parentId: 'tpl-conscon-office-1',
    rect: { x: 24, y: 70, width: 312, height: 60 },
    text: '서울시 강남구 테헤란로 123 컨설팅타워 15층',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-conscon-office-2',
    rect: { x: 480, y: OFFICES_Y + 60, width: 360, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-conscon-office-2-t', { x: 24, y: 24, width: 312, height: 36 }, '부산 지사', 3, '#123b63', 'left', 'tpl-conscon-office-2'),
  createTextNode({
    id: 'tpl-conscon-office-2-d',
    parentId: 'tpl-conscon-office-2',
    rect: { x: 24, y: 70, width: 312, height: 60 },
    text: '부산시 해운대구 센텀중앙로 78 센텀빌딩 8층',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
]);

export const consultingContactTemplate: PageTemplate = {
  id: 'consulting-contact',
  name: '컨설팅 연락처',
  category: 'consulting',
  subcategory: 'contact',
  description: '무료 상담 영역 + 오피스 위치 + 전화번호',
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
