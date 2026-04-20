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
const HERO_H = 400;
const PLANS_Y = HERO_H + 80;
const PLANS_H = 380;
const CTA_Y = PLANS_Y + PLANS_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

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
    id: 'tpl-fitnutri-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-fitnutri-hero-img',
    parentId: 'tpl-fitnutri-hero',
    rect: { x: 640, y: 0, width: 640, height: HERO_H },
    src: '/images/placeholder-nutrition-hero.jpg',
    alt: '건강한 식단 이미지',
    style: { opacity: 50, borderRadius: 0 },
  }),
  heading(
    'tpl-fitnutri-hero-title',
    { x: 80, y: 120, width: 520, height: 70 },
    '영양 가이드',
    1,
    '#ffffff',
    'left',
    'tpl-fitnutri-hero',
  ),
  createTextNode({
    id: 'tpl-fitnutri-hero-sub',
    parentId: 'tpl-fitnutri-hero',
    rect: { x: 80, y: 210, width: 480, height: 60 },
    text: '운동만큼 중요한 영양! 전문 영양사와 함께 나에게 맞는 식단을 설계하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-fitnutri-hero-cta',
    parentId: 'tpl-fitnutri-hero',
    rect: { x: 80, y: 300, width: 200, height: 48 },
    label: '상담 예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Meal plan overview ──────────────────────────────────── */
  heading(
    'tpl-fitnutri-plans-title',
    { x: 80, y: PLANS_Y, width: 400, height: 50 },
    '식단 프로그램',
    2,
    '#123b63',
  ),
  createContainerNode({
    id: 'tpl-fitnutri-plan-1',
    rect: { x: 80, y: PLANS_Y + 70, width: 350, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-fitnutri-plan-1-title', { x: 24, y: 24, width: 302, height: 36 }, '다이어트 식단', 3, '#123b63', 'left', 'tpl-fitnutri-plan-1'),
  createTextNode({
    id: 'tpl-fitnutri-plan-1-desc',
    parentId: 'tpl-fitnutri-plan-1',
    rect: { x: 24, y: 70, width: 302, height: 80 },
    text: '칼로리 컨트롤과 영양 균형을 고려한 체중 감량 맞춤 식단입니다. 주간 단위로 식단표를 제공합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-fitnutri-plan-1-price',
    parentId: 'tpl-fitnutri-plan-1',
    rect: { x: 24, y: 170, width: 302, height: 28 },
    text: '월 ₩89,000 (식단표 + 상담 2회)',
    fontSize: 14,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createContainerNode({
    id: 'tpl-fitnutri-plan-2',
    rect: { x: 460, y: PLANS_Y + 70, width: 350, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-fitnutri-plan-2-title', { x: 24, y: 24, width: 302, height: 36 }, '벌크업 식단', 3, '#123b63', 'left', 'tpl-fitnutri-plan-2'),
  createTextNode({
    id: 'tpl-fitnutri-plan-2-desc',
    parentId: 'tpl-fitnutri-plan-2',
    rect: { x: 24, y: 70, width: 302, height: 80 },
    text: '근육량 증가를 위한 고단백 식단 프로그램입니다. 트레이닝 스케줄에 맞춰 영양소 타이밍을 최적화합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-fitnutri-plan-2-price',
    parentId: 'tpl-fitnutri-plan-2',
    rect: { x: 24, y: 170, width: 302, height: 28 },
    text: '월 ₩99,000 (식단표 + 상담 2회)',
    fontSize: 14,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createContainerNode({
    id: 'tpl-fitnutri-plan-3',
    rect: { x: 840, y: PLANS_Y + 70, width: 350, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-fitnutri-plan-3-title', { x: 24, y: 24, width: 302, height: 36 }, '건강 관리 식단', 3, '#123b63', 'left', 'tpl-fitnutri-plan-3'),
  createTextNode({
    id: 'tpl-fitnutri-plan-3-desc',
    parentId: 'tpl-fitnutri-plan-3',
    rect: { x: 24, y: 70, width: 302, height: 80 },
    text: '만성 질환 예방과 전반적인 건강 증진을 위한 균형 잡힌 식단입니다. 혈당/혈압 관리에 초점을 맞춥니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-fitnutri-plan-3-price',
    parentId: 'tpl-fitnutri-plan-3',
    rect: { x: 24, y: 170, width: 302, height: 28 },
    text: '월 ₩79,000 (식단표 + 상담 1회)',
    fontSize: 14,
    color: '#e8a838',
    fontWeight: 'bold',
  }),

  /* ── Consultation CTA ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fitnutri-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-fitnutri-cta-text',
    parentId: 'tpl-fitnutri-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '전문 영양사의 1:1 상담으로 나만의 맞춤 식단을 설계하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-fitnutri-cta-btn',
    parentId: 'tpl-fitnutri-cta',
    rect: { x: 80, y: 120, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const fitnessNutritionTemplate: PageTemplate = {
  id: 'fitness-nutrition',
  name: '영양 가이드',
  category: 'fitness',
  subcategory: 'nutrition',
  description: '영양 히어로 + 식단 프로그램(3 카드) + 상담 CTA',
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
