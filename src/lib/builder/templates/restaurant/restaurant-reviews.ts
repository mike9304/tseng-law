import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
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
const CARD_W = 350;
const CARD_H = 240;
const GAP = 24;
const COLS = 3;

interface Review {
  key: string;
  name: string;
  rating: string;
  text: string;
}

const reviews: Review[] = [
  { key: 'review-1', name: '김OO', rating: '★★★★★', text: '분위기도 좋고 음식도 훌륭했습니다. 특히 스테이크가 입에서 녹았어요. 다음에 또 방문하겠습니다.' },
  { key: 'review-2', name: '이OO', rating: '★★★★★', text: '기념일에 방문했는데 서비스가 정말 최고였습니다. 프라이빗 룸도 아늑하고 좋았어요.' },
  { key: 'review-3', name: '박OO', rating: '★★★★☆', text: '트러플 파스타가 지금까지 먹어본 파스타 중 최고입니다. 와인 페어링도 훌륭했습니다.' },
  { key: 'review-4', name: '최OO', rating: '★★★★★', text: '회사 회식으로 이용했는데 단체석 서비스가 완벽했습니다. 직원분들이 매우 친절했습니다.' },
  { key: 'review-5', name: '정OO', rating: '★★★★☆', text: '해산물이 정말 신선하고 맛있었어요. 가격 대비 만족스러운 식사였습니다.' },
  { key: 'review-6', name: '강OO', rating: '★★★★★', text: '디저트까지 하나하나 정성이 느껴지는 레스토랑입니다. 강남 맛집으로 강력 추천합니다.' },
];

function buildReviewCard(review: Review, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-restreviews-card-${review.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    createTextNode({
      id: `${cid}-rating`,
      parentId: cid,
      rect: { x: 24, y: 20, width: 120, height: 28 },
      text: review.rating,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-text`,
      parentId: cid,
      rect: { x: 24, y: 60, width: CARD_W - 48, height: 100 },
      text: `"${review.text}"`,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-name`,
      parentId: cid,
      rect: { x: 24, y: 180, width: 200, height: 28 },
      text: `— ${review.name}`,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
  ];
}

const ROWS = Math.ceil(reviews.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restreviews-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '고객 리뷰',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restreviews-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '소중한 고객님들의 생생한 후기를 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...reviews.flatMap((r, i) => buildReviewCard(r, i)),
]);

export const restaurantReviewsTemplate: PageTemplate = {
  id: 'restaurant-reviews',
  name: '레스토랑 리뷰',
  category: 'restaurant',
  subcategory: 'reviews',
  description: '고객 후기 + 6개 리뷰 카드(별점 + 텍스트 + 이름)',
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
