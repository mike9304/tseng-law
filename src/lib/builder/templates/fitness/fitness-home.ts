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
const HERO_H = 600;
const CLASSES_Y = HERO_H + 80;
const CLASSES_H = 420;
const CTA_Y = CLASSES_Y + CLASSES_H + 80;
const CTA_H = 300;
const TRAINER_Y = CTA_Y + CTA_H + 80;
const TRAINER_H = 340;
const STAGE_H = TRAINER_Y + TRAINER_H + 80;

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
  /* ── Hero section ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fithome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-fithome-hero-bg',
    parentId: 'tpl-fithome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-gym-hero.jpg',
    alt: '피트니스 센터 히어로 배경',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-fithome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '당신의 한계를 넘어서',
    1,
    '#ffffff',
    'left',
    'tpl-fithome-hero',
  ),
  createTextNode({
    id: 'tpl-fithome-hero-tagline',
    parentId: 'tpl-fithome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '전문 트레이너와 함께하는 맞춤 운동 프로그램으로 건강한 변화를 시작하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-fithome-hero-cta',
    parentId: 'tpl-fithome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '무료 체험 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Class highlights (4 cards) ──────────────────────────── */
  heading(
    'tpl-fithome-class-title',
    { x: 80, y: CLASSES_Y, width: 400, height: 50 },
    '인기 클래스',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-fithome-card-1',
    rect: { x: 80, y: CLASSES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-fithome-card-1-img',
    parentId: 'tpl-fithome-card-1',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-fitness-yoga.jpg',
    alt: '요가 클래스',
    style: { borderRadius: 0 },
  }),
  heading('tpl-fithome-card-1-title', { x: 16, y: 172, width: 228, height: 36 }, '요가', 3, '#123b63', 'left', 'tpl-fithome-card-1'),
  createTextNode({
    id: 'tpl-fithome-card-1-desc',
    parentId: 'tpl-fithome-card-1',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '유연성과 마음의 평화를 동시에 얻는 요가 프로그램입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-fithome-card-2',
    rect: { x: 370, y: CLASSES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-fithome-card-2-img',
    parentId: 'tpl-fithome-card-2',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-fitness-hiit.jpg',
    alt: 'HIIT 클래스',
    style: { borderRadius: 0 },
  }),
  heading('tpl-fithome-card-2-title', { x: 16, y: 172, width: 228, height: 36 }, 'HIIT', 3, '#123b63', 'left', 'tpl-fithome-card-2'),
  createTextNode({
    id: 'tpl-fithome-card-2-desc',
    parentId: 'tpl-fithome-card-2',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '고강도 인터벌 트레이닝으로 짧은 시간에 최대 효과를 경험하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-fithome-card-3',
    rect: { x: 660, y: CLASSES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-fithome-card-3-img',
    parentId: 'tpl-fithome-card-3',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-fitness-boxing.jpg',
    alt: '복싱 클래스',
    style: { borderRadius: 0 },
  }),
  heading('tpl-fithome-card-3-title', { x: 16, y: 172, width: 228, height: 36 }, '복싱', 3, '#123b63', 'left', 'tpl-fithome-card-3'),
  createTextNode({
    id: 'tpl-fithome-card-3-desc',
    parentId: 'tpl-fithome-card-3',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '스트레스 해소와 체력 증진을 동시에! 복싱 피트니스 프로그램입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-fithome-card-4',
    rect: { x: 950, y: CLASSES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-fithome-card-4-img',
    parentId: 'tpl-fithome-card-4',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-fitness-pilates.jpg',
    alt: '필라테스 클래스',
    style: { borderRadius: 0 },
  }),
  heading('tpl-fithome-card-4-title', { x: 16, y: 172, width: 228, height: 36 }, '필라테스', 3, '#123b63', 'left', 'tpl-fithome-card-4'),
  createTextNode({
    id: 'tpl-fithome-card-4-desc',
    parentId: 'tpl-fithome-card-4',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '코어 강화와 체형 교정을 위한 전문 필라테스 수업입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Membership CTA ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fithome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-fithome-cta-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '지금 시작하세요',
    2,
    '#123b63',
    'left',
    'tpl-fithome-cta',
  ),
  createTextNode({
    id: 'tpl-fithome-cta-desc',
    parentId: 'tpl-fithome-cta',
    rect: { x: 80, y: 110, width: 600, height: 60 },
    text: '첫 달 50% 할인! 무료 체험 후 나에게 맞는 멤버십을 선택하세요. 전문 트레이너의 1:1 상담이 포함됩니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-fithome-cta-btn',
    parentId: 'tpl-fithome-cta',
    rect: { x: 80, y: 200, width: 200, height: 48 },
    label: '멤버십 보기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Trainer spotlight ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fithome-trainer',
    rect: { x: 0, y: TRAINER_Y, width: W, height: TRAINER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-fithome-trainer-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '트레이너 소개',
    2,
    '#ffffff',
    'left',
    'tpl-fithome-trainer',
  ),
  createTextNode({
    id: 'tpl-fithome-trainer-desc',
    parentId: 'tpl-fithome-trainer',
    rect: { x: 80, y: 100, width: 500, height: 48 },
    text: '국제 공인 자격증을 보유한 전문 트레이너팀이 여러분의 목표 달성을 도와드립니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createImageNode({
    id: 'tpl-fithome-trainer-img',
    parentId: 'tpl-fithome-trainer',
    rect: { x: 80, y: 170, width: 400, height: 140 },
    src: '/images/placeholder-trainers-group.jpg',
    alt: '트레이너팀 단체 사진',
    style: { borderRadius: 12 },
  }),
  createButtonNode({
    id: 'tpl-fithome-trainer-btn',
    parentId: 'tpl-fithome-trainer',
    rect: { x: 520, y: 220, width: 180, height: 48 },
    label: '트레이너 보기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const fitnessHomeTemplate: PageTemplate = {
  id: 'fitness-home',
  name: '피트니스 홈',
  category: 'fitness',
  subcategory: 'homepage',
  description: '다이나믹 히어로 + 인기 클래스 카드(4개) + 멤버십 CTA + 트레이너 스포트라이트',
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
