import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;

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

const MARGIN = 80;
const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 220;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface Review {
  key: string;
  quote: string;
  name: string;
  stars: string;
}

const reviews: Review[] = [
  { key: 'traveler-1', quote: '오사카 여행이 정말 완벽했습니다. 숨은 맛집까지 알려주셔서 매 끼니가 행복했어요. 다음에도 꼭 이용할게요!', name: '김OO (일본 여행)', stars: '★★★★★' },
  { key: 'traveler-2', quote: '유럽 일주 패키지로 갔는데 일정이 알차면서도 여유로웠어요. 가이드분도 친절하고 전문적이었습니다.', name: '이OO (유럽 여행)', stars: '★★★★★' },
  { key: 'traveler-3', quote: '신혼여행을 발리로 갔는데 리조트 선택이 탁월했습니다. 로맨틱한 분위기에서 최고의 추억을 만들었어요.', name: '박OO (신혼여행)', stars: '★★★★★' },
  { key: 'traveler-4', quote: '하와이 가족 여행을 맞춤으로 설계해 주셔서 아이들도 어른도 모두 만족했습니다. 감사합니다!', name: '최OO (가족 여행)', stars: '★★★★★' },
  { key: 'traveler-5', quote: '혼자 여행인데 긴급 상황에서 빠르게 도와주셔서 안심할 수 있었어요. 24시간 지원이 큰 장점입니다.', name: '정OO (솔로 여행)', stars: '★★★★☆' },
  { key: 'traveler-6', quote: '회사 워크숍 해외 단체 여행을 기획해 주셨는데 모든 일정이 매끄러웠습니다. 동료들 반응도 최고!', name: '한OO (단체 여행)', stars: '★★★★★' },
];

function buildReviewCard(r: Review, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-travelreview-card-${r.key}`;

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
      id: `${cid}-stars`,
      parentId: cid,
      rect: { x: 24, y: 20, width: 120, height: 24 },
      text: r.stars,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'regular',
    }),
    createTextNode({
      id: `${cid}-quote`,
      parentId: cid,
      rect: { x: 24, y: 54, width: 322, height: 100 },
      text: `"${r.quote}"`,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-name`,
      parentId: cid,
      rect: { x: 24, y: 168, width: 200, height: 28 },
      text: `— ${r.name}`,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-travelreview-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '여행자 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelreview-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '실제 여행자분들의 생생한 이야기를 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...reviews.flatMap((r, i) => buildReviewCard(r, i)),
]);

export const travelReviewsTemplate: PageTemplate = {
  id: 'travel-reviews',
  name: '여행자 후기',
  category: 'travel',
  subcategory: 'reviews',
  description: '후기 제목 + 6개 여행자 후기 카드(별점 + 인용문 + 여행자명)',
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
