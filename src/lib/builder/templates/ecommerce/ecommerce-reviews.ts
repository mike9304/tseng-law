import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HEADER_H = 120;
const GRID_Y = HEADER_H + 60;
const CARD_H = 200;
const CARD_GAP = 30;
const STAGE_H = GRID_Y + (CARD_H + CARD_GAP) * 3 + 60;

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

const reviewData = [
  { product: '프리미엄 가방', text: '정말 예쁘고 실용적이에요. 출근용으로 매일 사용하고 있어요.', author: '이OO', rating: '★★★★★' },
  { product: '캐주얼 스니커즈', text: '발이 편하고 쿠션이 좋아요. 오래 걸어도 피로하지 않습니다.', author: '박OO', rating: '★★★★★' },
  { product: '미니멀 시계', text: '디자인이 깔끔하고 고급스러워요. 선물용으로도 좋을 것 같아요.', author: '최OO', rating: '★★★★☆' },
  { product: '실크 스카프', text: '촉감이 정말 좋고 색상이 화면과 동일해요. 만족합니다.', author: '김OO', rating: '★★★★★' },
  { product: '리넨 셔츠', text: '여름에 시원하게 입기 좋아요. 세탁 후에도 형태가 잘 유지돼요.', author: '정OO', rating: '★★★★☆' },
  { product: '데님 팬츠', text: '핏이 너무 좋아서 다른 색상도 추가 구매했어요!', author: '한OO', rating: '★★★★★' },
];

function reviewCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 570;
  const y = GRID_Y + row * (CARD_H + CARD_GAP);
  const cId = `tpl-ecrevs-card-${n}`;
  const d = reviewData[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 540, height: CARD_H },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${cId}-product`, { x: 24, y: 16, width: 300, height: 30 }, d.product, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-rating`,
      parentId: cId,
      rect: { x: 340, y: 20, width: 160, height: 24 },
      text: d.rating,
      fontSize: 16,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'right',
    }),
    createTextNode({
      id: `${cId}-text`,
      parentId: cId,
      rect: { x: 24, y: 60, width: 492, height: 80 },
      text: `"${d.text}"`,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cId}-author`,
      parentId: cId,
      rect: { x: 24, y: 150, width: 200, height: 24 },
      text: `— ${d.author}`,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-ecrevs-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecrevs-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '고객 리뷰',
    1,
    '#ffffff',
    'left',
    'tpl-ecrevs-header',
  ),

  ...reviewCard(1, 0, 0),
  ...reviewCard(2, 1, 0),
  ...reviewCard(3, 0, 1),
  ...reviewCard(4, 1, 1),
  ...reviewCard(5, 0, 2),
  ...reviewCard(6, 1, 2),
]);

export const ecommerceReviewsTemplate: PageTemplate = {
  id: 'ecommerce-reviews',
  name: '온라인 쇼핑몰 리뷰',
  category: 'ecommerce',
  subcategory: 'reviews',
  description: '고객 리뷰 페이지, 상품명 포함 6개 리뷰 카드',
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
