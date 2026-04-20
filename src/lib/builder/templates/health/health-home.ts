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

const HERO_H = 600;
const DEPT_Y = HERO_H + 80;
const DEPT_H = 420;
const APPT_Y = DEPT_Y + DEPT_H + 80;
const APPT_H = 240;
const INSURANCE_Y = APPT_Y + APPT_H + 80;
const INSURANCE_H = 200;
const STAGE_H = INSURANCE_Y + INSURANCE_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-healthhome-hero-bg',
    parentId: 'tpl-healthhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-health-hero.jpg',
    alt: '병원 시설 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-healthhome-hero-title',
    { x: MARGIN, y: 160, width: 600, height: 100 },
    '건강한 삶을 위한 동반자',
    1,
    '#ffffff',
    'left',
    'tpl-healthhome-hero',
  ),
  createTextNode({
    id: 'tpl-healthhome-hero-tagline',
    parentId: 'tpl-healthhome-hero',
    rect: { x: MARGIN, y: 280, width: 500, height: 60 },
    text: '최신 의료 장비와 전문 의료진이 여러분의 건강을 책임집니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-healthhome-hero-cta',
    parentId: 'tpl-healthhome-hero',
    rect: { x: MARGIN, y: 370, width: 200, height: 52 },
    label: '진료 예약',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Departments ─────────────────────────────────────────── */
  heading(
    'tpl-healthhome-dept-title',
    { x: MARGIN, y: DEPT_Y, width: 400, height: 50 },
    '진료 과목',
    2,
    '#123b63',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-healthhome-dept-1',
    rect: { x: MARGIN, y: DEPT_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-healthhome-dept-1-title', { x: 24, y: 24, width: 212, height: 36 }, '내과', 3, '#123b63', 'left', 'tpl-healthhome-dept-1'),
  createTextNode({
    id: 'tpl-healthhome-dept-1-desc',
    parentId: 'tpl-healthhome-dept-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '감기, 고혈압, 당뇨 등 내과 전반의 질환을 진단하고 치료합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-healthhome-dept-2',
    rect: { x: 370, y: DEPT_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-healthhome-dept-2-title', { x: 24, y: 24, width: 212, height: 36 }, '정형외과', 3, '#123b63', 'left', 'tpl-healthhome-dept-2'),
  createTextNode({
    id: 'tpl-healthhome-dept-2-desc',
    parentId: 'tpl-healthhome-dept-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '관절, 척추, 골절 등 근골격계 질환의 전문적인 진료를 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-healthhome-dept-3',
    rect: { x: 660, y: DEPT_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-healthhome-dept-3-title', { x: 24, y: 24, width: 212, height: 36 }, '피부과', 3, '#123b63', 'left', 'tpl-healthhome-dept-3'),
  createTextNode({
    id: 'tpl-healthhome-dept-3-desc',
    parentId: 'tpl-healthhome-dept-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '피부 질환 치료와 미용 시술을 전문으로 하는 피부과입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-healthhome-dept-4',
    rect: { x: 950, y: DEPT_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-healthhome-dept-4-title', { x: 24, y: 24, width: 212, height: 36 }, '치과', 3, '#123b63', 'left', 'tpl-healthhome-dept-4'),
  createTextNode({
    id: 'tpl-healthhome-dept-4-desc',
    parentId: 'tpl-healthhome-dept-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '충치 치료, 교정, 임플란트 등 치과 진료 전반을 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Appointment CTA ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthhome-appt',
    rect: { x: 0, y: APPT_Y, width: W, height: APPT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-healthhome-appt-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '진료 예약',
    2,
    '#123b63',
    'left',
    'tpl-healthhome-appt',
  ),
  createTextNode({
    id: 'tpl-healthhome-appt-desc',
    parentId: 'tpl-healthhome-appt',
    rect: { x: MARGIN, y: 100, width: 600, height: 44 },
    text: '온라인으로 간편하게 예약하세요. 대기 시간 없이 편리하게 진료받으실 수 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createButtonNode({
    id: 'tpl-healthhome-appt-btn',
    parentId: 'tpl-healthhome-appt',
    rect: { x: MARGIN, y: 170, width: 180, height: 48 },
    label: '예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Insurance info ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthhome-insurance',
    rect: { x: 0, y: INSURANCE_Y, width: W, height: INSURANCE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-healthhome-insurance-text',
    parentId: 'tpl-healthhome-insurance',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '국민건강보험 및 주요 실손보험을 모두 적용받으실 수 있습니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-healthhome-insurance-sub',
    parentId: 'tpl-healthhome-insurance',
    rect: { x: MARGIN, y: 110, width: 500, height: 40 },
    text: '보험 관련 문의는 원무과(02-1234-5678)로 연락해 주세요.',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.4,
  }),
]);

export const healthHomeTemplate: PageTemplate = {
  id: 'health-home',
  name: '병원 홈',
  category: 'health',
  subcategory: 'homepage',
  description: '히어로 + 4개 진료과목 카드 + 예약 CTA + 보험 안내',
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
