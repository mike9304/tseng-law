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
const DETAIL_H = 600;
const REVIEWS_Y = DETAIL_H + 80;
const REVIEWS_H = 400;
const STAGE_H = REVIEWS_Y + REVIEWS_H + 80;

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
  /* ── Product detail ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecdetail-main',
    rect: { x: 0, y: 0, width: W, height: DETAIL_H },
    background: '#ffffff',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-ecdetail-img',
    parentId: 'tpl-ecdetail-main',
    rect: { x: 80, y: 40, width: 500, height: 520 },
    src: '/images/placeholder-product-large.jpg',
    alt: '상품 상세 이미지',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-ecdetail-name',
    { x: 640, y: 60, width: 540, height: 50 },
    '프리미엄 가죽 가방',
    1,
    '#123b63',
    'left',
    'tpl-ecdetail-main',
  ),
  createTextNode({
    id: 'tpl-ecdetail-price',
    parentId: 'tpl-ecdetail-main',
    rect: { x: 640, y: 130, width: 300, height: 40 },
    text: '₩189,000',
    fontSize: 28,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-ecdetail-desc',
    parentId: 'tpl-ecdetail-main',
    rect: { x: 640, y: 190, width: 540, height: 160 },
    text: '최상급 이탈리안 가죽으로 제작된 프리미엄 가방입니다. 세련된 디자인과 뛰어난 내구성을 자랑합니다. 다양한 수납공간이 있어 실용적이며, 어떤 스타일에도 잘 어울립니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),
  createButtonNode({
    id: 'tpl-ecdetail-cart-btn',
    parentId: 'tpl-ecdetail-main',
    rect: { x: 640, y: 380, width: 240, height: 56 },
    label: '장바구니에 담기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-ecdetail-buy-btn',
    parentId: 'tpl-ecdetail-main',
    rect: { x: 900, y: 380, width: 200, height: 56 },
    label: '바로 구매',
    href: '#',
    variant: 'outline',
    style: { borderRadius: 8 },
  }),

  /* ── Reviews section ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecdetail-reviews',
    rect: { x: 0, y: REVIEWS_Y, width: W, height: REVIEWS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecdetail-reviews-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '고객 리뷰',
    2,
    '#123b63',
    'left',
    'tpl-ecdetail-reviews',
  ),
  createContainerNode({
    id: 'tpl-ecdetail-review-1',
    parentId: 'tpl-ecdetail-reviews',
    rect: { x: 80, y: 110, width: 500, height: 120 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-ecdetail-review-1-text',
    parentId: 'tpl-ecdetail-review-1',
    rect: { x: 24, y: 16, width: 452, height: 50 },
    text: '"디자인이 너무 예쁘고 퀄리티가 좋아요! 배송도 빨랐습니다."',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-ecdetail-review-1-author',
    parentId: 'tpl-ecdetail-review-1',
    rect: { x: 24, y: 76, width: 200, height: 24 },
    text: '— 박OO ★★★★★',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'medium',
  }),
  createContainerNode({
    id: 'tpl-ecdetail-review-2',
    parentId: 'tpl-ecdetail-reviews',
    rect: { x: 620, y: 110, width: 500, height: 120 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-ecdetail-review-2-text',
    parentId: 'tpl-ecdetail-review-2',
    rect: { x: 24, y: 16, width: 452, height: 50 },
    text: '"선물용으로 구매했는데 받으신 분이 정말 좋아하셨어요."',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-ecdetail-review-2-author',
    parentId: 'tpl-ecdetail-review-2',
    rect: { x: 24, y: 76, width: 200, height: 24 },
    text: '— 김OO ★★★★☆',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'medium',
  }),
]);

export const ecommerceProductDetailTemplate: PageTemplate = {
  id: 'ecommerce-product-detail',
  name: '온라인 쇼핑몰 상품 상세',
  category: 'ecommerce',
  subcategory: 'product-detail',
  description: '대형 이미지 + 상품명 + 가격 + 설명 + 장바구니 버튼 + 리뷰',
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
