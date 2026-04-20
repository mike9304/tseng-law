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
const HERO_H = 700;
const PORTFOLIO_Y = HERO_H + 80;
const PORTFOLIO_H = 420;
const ABOUT_Y = PORTFOLIO_Y + PORTFOLIO_H + 80;
const ABOUT_H = 300;
const CTA_Y = ABOUT_Y + ABOUT_H + 80;
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
  /* ── Full-width hero image ──────────────────────────────── */
  createContainerNode({
    id: 'tpl-photohome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-hero-bg',
    parentId: 'tpl-photohome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-photo-hero.jpg',
    alt: '포트폴리오 대표 사진',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-photohome-hero-title',
    { x: 80, y: 220, width: 700, height: 100 },
    '순간을 영원으로',
    1,
    '#ffffff',
    'left',
    'tpl-photohome-hero',
  ),
  createTextNode({
    id: 'tpl-photohome-hero-sub',
    parentId: 'tpl-photohome-hero',
    rect: { x: 80, y: 340, width: 500, height: 60 },
    text: '감성적인 시선으로 당신의 특별한 순간을 담아드립니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-photohome-hero-cta',
    parentId: 'tpl-photohome-hero',
    rect: { x: 80, y: 430, width: 200, height: 52 },
    label: '촬영 예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Portfolio categories (4 cards) ─────────────────────── */
  heading(
    'tpl-photohome-port-title',
    { x: 80, y: PORTFOLIO_Y, width: 400, height: 50 },
    '포트폴리오',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-photohome-cat-1',
    rect: { x: 80, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-1-img',
    parentId: 'tpl-photohome-cat-1',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-wedding.jpg',
    alt: '웨딩 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-1-title', { x: 16, y: 212, width: 228, height: 36 }, '웨딩', 3, '#123b63', 'left', 'tpl-photohome-cat-1'),
  createTextNode({
    id: 'tpl-photohome-cat-1-desc',
    parentId: 'tpl-photohome-cat-1',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '아름다운 결혼식의 순간',
    fontSize: 14,
    color: '#1f2937',
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-photohome-cat-2',
    rect: { x: 370, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-2-img',
    parentId: 'tpl-photohome-cat-2',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-portrait.jpg',
    alt: '인물 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-2-title', { x: 16, y: 212, width: 228, height: 36 }, '인물', 3, '#123b63', 'left', 'tpl-photohome-cat-2'),
  createTextNode({
    id: 'tpl-photohome-cat-2-desc',
    parentId: 'tpl-photohome-cat-2',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '자연스러운 인물 사진',
    fontSize: 14,
    color: '#1f2937',
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-photohome-cat-3',
    rect: { x: 660, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-3-img',
    parentId: 'tpl-photohome-cat-3',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-event.jpg',
    alt: '이벤트 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-3-title', { x: 16, y: 212, width: 228, height: 36 }, '이벤트', 3, '#123b63', 'left', 'tpl-photohome-cat-3'),
  createTextNode({
    id: 'tpl-photohome-cat-3-desc',
    parentId: 'tpl-photohome-cat-3',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '특별한 행사의 기록',
    fontSize: 14,
    color: '#1f2937',
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-photohome-cat-4',
    rect: { x: 950, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-4-img',
    parentId: 'tpl-photohome-cat-4',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-product.jpg',
    alt: '제품 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-4-title', { x: 16, y: 212, width: 228, height: 36 }, '제품', 3, '#123b63', 'left', 'tpl-photohome-cat-4'),
  createTextNode({
    id: 'tpl-photohome-cat-4-desc',
    parentId: 'tpl-photohome-cat-4',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '상업용 제품 사진',
    fontSize: 14,
    color: '#1f2937',
  }),

  /* ── About teaser ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photohome-about',
    rect: { x: 0, y: ABOUT_Y, width: W, height: ABOUT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photohome-about-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '사진작가 소개',
    2,
    '#123b63',
    'left',
    'tpl-photohome-about',
  ),
  createTextNode({
    id: 'tpl-photohome-about-text',
    parentId: 'tpl-photohome-about',
    rect: { x: 80, y: 110, width: 700, height: 120 },
    text: '10년 이상의 경력을 가진 전문 포토그래퍼입니다. 자연광을 활용한 감성적인 촬영 스타일을 추구하며, 각 순간의 진정한 아름다움을 렌즈에 담습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Booking CTA ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photohome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-photohome-cta-text',
    parentId: 'tpl-photohome-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '특별한 순간을 함께 기록하고 싶으시다면 지금 예약하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-photohome-cta-btn',
    parentId: 'tpl-photohome-cta',
    rect: { x: 80, y: 110, width: 200, height: 48 },
    label: '촬영 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const photographyHomeTemplate: PageTemplate = {
  id: 'photography-home',
  name: '사진 스튜디오 홈',
  category: 'photography',
  subcategory: 'homepage',
  description: '전체 화면 히어로 + 포트폴리오 카테고리(4개) + 소개 + 예약 CTA',
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
