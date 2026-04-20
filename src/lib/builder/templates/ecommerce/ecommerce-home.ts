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
const HERO_H = 500;
const PRODUCTS_Y = HERO_H + 80;
const PRODUCTS_H = 520;
const CATEGORIES_Y = PRODUCTS_Y + PRODUCTS_H + 80;
const CATEGORIES_H = 300;
const PROMO_Y = CATEGORIES_Y + CATEGORIES_H + 80;
const PROMO_H = 160;
const STAGE_H = PROMO_Y + PROMO_H + 80;

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
  /* ── Hero banner ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-echome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-echome-hero-bg',
    parentId: 'tpl-echome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-shop-hero.jpg',
    alt: '온라인 쇼핑몰 히어로 배너',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-echome-hero-title',
    { x: 80, y: 120, width: 600, height: 100 },
    '새로운 시즌, 새로운 스타일',
    1,
    '#ffffff',
    'left',
    'tpl-echome-hero',
  ),
  createTextNode({
    id: 'tpl-echome-hero-sub',
    parentId: 'tpl-echome-hero',
    rect: { x: 80, y: 240, width: 500, height: 60 },
    text: '트렌디한 신상품을 만나보세요. 지금 주문하면 무료 배송!',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-echome-hero-cta',
    parentId: 'tpl-echome-hero',
    rect: { x: 80, y: 330, width: 200, height: 52 },
    label: '쇼핑하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Featured products (4 cards) ────────────────────────── */
  heading(
    'tpl-echome-prod-title',
    { x: 80, y: PRODUCTS_Y, width: 400, height: 50 },
    '인기 상품',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-echome-prod-1',
    rect: { x: 80, y: PRODUCTS_Y + 70, width: 260, height: 400 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-echome-prod-1-img',
    parentId: 'tpl-echome-prod-1',
    rect: { x: 0, y: 0, width: 260, height: 220 },
    src: '/images/placeholder-product-1.jpg',
    alt: '상품 이미지 1',
    style: { borderRadius: 0 },
  }),
  heading('tpl-echome-prod-1-name', { x: 16, y: 232, width: 228, height: 36 }, '프리미엄 가방', 3, '#123b63', 'left', 'tpl-echome-prod-1'),
  createTextNode({
    id: 'tpl-echome-prod-1-price',
    parentId: 'tpl-echome-prod-1',
    rect: { x: 16, y: 276, width: 228, height: 30 },
    text: '₩89,000',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-echome-prod-1-desc',
    parentId: 'tpl-echome-prod-1',
    rect: { x: 16, y: 314, width: 228, height: 60 },
    text: '고급 소재로 제작된 데일리 가방. 다양한 컬러 옵션.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-echome-prod-2',
    rect: { x: 370, y: PRODUCTS_Y + 70, width: 260, height: 400 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-echome-prod-2-img',
    parentId: 'tpl-echome-prod-2',
    rect: { x: 0, y: 0, width: 260, height: 220 },
    src: '/images/placeholder-product-2.jpg',
    alt: '상품 이미지 2',
    style: { borderRadius: 0 },
  }),
  heading('tpl-echome-prod-2-name', { x: 16, y: 232, width: 228, height: 36 }, '캐주얼 스니커즈', 3, '#123b63', 'left', 'tpl-echome-prod-2'),
  createTextNode({
    id: 'tpl-echome-prod-2-price',
    parentId: 'tpl-echome-prod-2',
    rect: { x: 16, y: 276, width: 228, height: 30 },
    text: '₩129,000',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-echome-prod-2-desc',
    parentId: 'tpl-echome-prod-2',
    rect: { x: 16, y: 314, width: 228, height: 60 },
    text: '편안하고 세련된 디자인의 캐주얼 스니커즈.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-echome-prod-3',
    rect: { x: 660, y: PRODUCTS_Y + 70, width: 260, height: 400 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-echome-prod-3-img',
    parentId: 'tpl-echome-prod-3',
    rect: { x: 0, y: 0, width: 260, height: 220 },
    src: '/images/placeholder-product-3.jpg',
    alt: '상품 이미지 3',
    style: { borderRadius: 0 },
  }),
  heading('tpl-echome-prod-3-name', { x: 16, y: 232, width: 228, height: 36 }, '미니멀 시계', 3, '#123b63', 'left', 'tpl-echome-prod-3'),
  createTextNode({
    id: 'tpl-echome-prod-3-price',
    parentId: 'tpl-echome-prod-3',
    rect: { x: 16, y: 276, width: 228, height: 30 },
    text: '₩199,000',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-echome-prod-3-desc',
    parentId: 'tpl-echome-prod-3',
    rect: { x: 16, y: 314, width: 228, height: 60 },
    text: '심플한 디자인의 클래식 손목시계.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-echome-prod-4',
    rect: { x: 950, y: PRODUCTS_Y + 70, width: 260, height: 400 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-echome-prod-4-img',
    parentId: 'tpl-echome-prod-4',
    rect: { x: 0, y: 0, width: 260, height: 220 },
    src: '/images/placeholder-product-4.jpg',
    alt: '상품 이미지 4',
    style: { borderRadius: 0 },
  }),
  heading('tpl-echome-prod-4-name', { x: 16, y: 232, width: 228, height: 36 }, '실크 스카프', 3, '#123b63', 'left', 'tpl-echome-prod-4'),
  createTextNode({
    id: 'tpl-echome-prod-4-price',
    parentId: 'tpl-echome-prod-4',
    rect: { x: 16, y: 276, width: 228, height: 30 },
    text: '₩59,000',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-echome-prod-4-desc',
    parentId: 'tpl-echome-prod-4',
    rect: { x: 16, y: 314, width: 228, height: 60 },
    text: '부드러운 실크 소재의 멀티 스카프.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Categories ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-echome-cat',
    rect: { x: 0, y: CATEGORIES_Y, width: W, height: CATEGORIES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-echome-cat-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '카테고리',
    2,
    '#123b63',
    'left',
    'tpl-echome-cat',
  ),
  createTextNode({
    id: 'tpl-echome-cat-list',
    parentId: 'tpl-echome-cat',
    rect: { x: 80, y: 110, width: 800, height: 120 },
    text: '의류 · 가방 · 신발 · 액세서리 · 뷰티 · 홈리빙 · 디지털 · 식품',
    fontSize: 18,
    color: '#1f2937',
    fontWeight: 'medium',
    lineHeight: 1.8,
  }),

  /* ── Promo strip ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-echome-promo',
    rect: { x: 0, y: PROMO_Y, width: W, height: PROMO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-echome-promo-text',
    parentId: 'tpl-echome-promo',
    rect: { x: 80, y: 30, width: 700, height: 44 },
    text: '지금 가입하면 첫 구매 15% 할인! 무료 배송 혜택까지.',
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-echome-promo-btn',
    parentId: 'tpl-echome-promo',
    rect: { x: 80, y: 90, width: 180, height: 48 },
    label: '회원가입',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const ecommerceHomeTemplate: PageTemplate = {
  id: 'ecommerce-home',
  name: '온라인 쇼핑몰 홈',
  category: 'ecommerce',
  subcategory: 'homepage',
  description: '히어로 배너 + 인기 상품(4개) + 카테고리 + 프로모션 스트립',
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
