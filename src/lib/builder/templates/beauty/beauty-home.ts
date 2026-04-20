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
const SERVICES_Y = HERO_H + 80;
const SERVICES_H = 420;
const BOOKING_Y = SERVICES_Y + SERVICES_H + 80;
const BOOKING_H = 300;
const GALLERY_Y = BOOKING_Y + BOOKING_H + 80;
const GALLERY_H = 340;
const STAGE_H = GALLERY_Y + GALLERY_H + 80;

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
    id: 'tpl-beautyhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-beautyhome-hero-bg',
    parentId: 'tpl-beautyhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-salon-hero.jpg',
    alt: '뷰티살롱 히어로 배경 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-beautyhome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '당신의 아름다움을 빛나게',
    1,
    '#ffffff',
    'left',
    'tpl-beautyhome-hero',
  ),
  createTextNode({
    id: 'tpl-beautyhome-hero-tagline',
    parentId: 'tpl-beautyhome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '전문 스타일리스트가 트렌디한 스타일과 맞춤 케어로 최고의 아름다움을 선사합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-beautyhome-hero-cta',
    parentId: 'tpl-beautyhome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '지금 예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Services showcase (4 cards) ─────────────────────────── */
  heading(
    'tpl-beautyhome-svc-title',
    { x: 80, y: SERVICES_Y, width: 400, height: 50 },
    '인기 서비스',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-beautyhome-card-1',
    rect: { x: 80, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-beautyhome-card-1-img',
    parentId: 'tpl-beautyhome-card-1',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-beauty-hair.jpg',
    alt: '헤어 스타일링',
    style: { borderRadius: 0 },
  }),
  heading('tpl-beautyhome-card-1-title', { x: 16, y: 172, width: 228, height: 36 }, '헤어 스타일링', 3, '#123b63', 'left', 'tpl-beautyhome-card-1'),
  createTextNode({
    id: 'tpl-beautyhome-card-1-desc',
    parentId: 'tpl-beautyhome-card-1',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '커트, 염색, 펌 등 트렌디한 헤어 스타일을 완성합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-beautyhome-card-2',
    rect: { x: 370, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-beautyhome-card-2-img',
    parentId: 'tpl-beautyhome-card-2',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-beauty-nails.jpg',
    alt: '네일 아트',
    style: { borderRadius: 0 },
  }),
  heading('tpl-beautyhome-card-2-title', { x: 16, y: 172, width: 228, height: 36 }, '네일 아트', 3, '#123b63', 'left', 'tpl-beautyhome-card-2'),
  createTextNode({
    id: 'tpl-beautyhome-card-2-desc',
    parentId: 'tpl-beautyhome-card-2',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '젤, 아크릴, 아트 네일 등 섬세한 네일 케어를 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-beautyhome-card-3',
    rect: { x: 660, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-beautyhome-card-3-img',
    parentId: 'tpl-beautyhome-card-3',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-beauty-skin.jpg',
    alt: '피부 관리',
    style: { borderRadius: 0 },
  }),
  heading('tpl-beautyhome-card-3-title', { x: 16, y: 172, width: 228, height: 36 }, '피부 관리', 3, '#123b63', 'left', 'tpl-beautyhome-card-3'),
  createTextNode({
    id: 'tpl-beautyhome-card-3-desc',
    parentId: 'tpl-beautyhome-card-3',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '페이셜, 필링, 보습 케어로 건강한 피부를 만듭니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-beautyhome-card-4',
    rect: { x: 950, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-beautyhome-card-4-img',
    parentId: 'tpl-beautyhome-card-4',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-beauty-makeup.jpg',
    alt: '메이크업',
    style: { borderRadius: 0 },
  }),
  heading('tpl-beautyhome-card-4-title', { x: 16, y: 172, width: 228, height: 36 }, '메이크업', 3, '#123b63', 'left', 'tpl-beautyhome-card-4'),
  createTextNode({
    id: 'tpl-beautyhome-card-4-desc',
    parentId: 'tpl-beautyhome-card-4',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '웨딩, 촬영, 데일리 등 맞춤 메이크업 서비스를 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Booking CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-beautyhome-booking',
    rect: { x: 0, y: BOOKING_Y, width: W, height: BOOKING_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-beautyhome-booking-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '온라인 예약',
    2,
    '#123b63',
    'left',
    'tpl-beautyhome-booking',
  ),
  createTextNode({
    id: 'tpl-beautyhome-booking-desc',
    parentId: 'tpl-beautyhome-booking',
    rect: { x: 80, y: 110, width: 600, height: 60 },
    text: '원하는 날짜와 시간에 간편하게 예약하세요. 첫 방문 고객에게는 10% 할인 혜택을 드립니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-beautyhome-booking-btn',
    parentId: 'tpl-beautyhome-booking',
    rect: { x: 80, y: 200, width: 180, height: 48 },
    label: '예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Instagram gallery ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-beautyhome-gallery',
    rect: { x: 0, y: GALLERY_Y, width: W, height: GALLERY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-beautyhome-gallery-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '인스타그램 갤러리',
    2,
    '#ffffff',
    'left',
    'tpl-beautyhome-gallery',
  ),
  createTextNode({
    id: 'tpl-beautyhome-gallery-desc',
    parentId: 'tpl-beautyhome-gallery',
    rect: { x: 80, y: 100, width: 500, height: 32 },
    text: '@our_salon에서 최신 작업물을 확인하세요.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.4,
  }),
  createImageNode({
    id: 'tpl-beautyhome-gallery-img-1',
    parentId: 'tpl-beautyhome-gallery',
    rect: { x: 80, y: 150, width: 260, height: 160 },
    src: '/images/placeholder-insta-1.jpg',
    alt: '인스타그램 작업물 1',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-beautyhome-gallery-img-2',
    parentId: 'tpl-beautyhome-gallery',
    rect: { x: 366, y: 150, width: 260, height: 160 },
    src: '/images/placeholder-insta-2.jpg',
    alt: '인스타그램 작업물 2',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-beautyhome-gallery-img-3',
    parentId: 'tpl-beautyhome-gallery',
    rect: { x: 652, y: 150, width: 260, height: 160 },
    src: '/images/placeholder-insta-3.jpg',
    alt: '인스타그램 작업물 3',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-beautyhome-gallery-img-4',
    parentId: 'tpl-beautyhome-gallery',
    rect: { x: 938, y: 150, width: 260, height: 160 },
    src: '/images/placeholder-insta-4.jpg',
    alt: '인스타그램 작업물 4',
    style: { borderRadius: 8 },
  }),
]);

export const beautyHomeTemplate: PageTemplate = {
  id: 'beauty-home',
  name: '뷰티살롱 홈',
  category: 'beauty',
  subcategory: 'homepage',
  description: '살롱 히어로 + 인기 서비스 카드(4개) + 예약 CTA + 인스타그램 갤러리',
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
