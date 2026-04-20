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

interface Testimonial {
  key: string;
  quote: string;
  name: string;
  stars: string;
}

const testimonials: Testimonial[] = [
  { key: 'client-1', quote: '항상 원하는 스타일로 완벽하게 연출해 주셔서 다른 살롱은 생각도 안 나요. 직원분들도 너무 친절합니다.', name: '김OO (단골 3년)', stars: '★★★★★' },
  { key: 'client-2', quote: '손상 모발 때문에 고민이 많았는데 트리트먼트 받고 나서 머릿결이 확 달라졌어요. 강력 추천합니다!', name: '이OO (트리트먼트 고객)', stars: '★★★★★' },
  { key: 'client-3', quote: '네일 아트 디자인이 정말 섬세하고 예뻐요. 매번 새로운 디자인을 제안해 주셔서 만족합니다.', name: '박OO (네일 고객)', stars: '★★★★★' },
  { key: 'client-4', quote: '웨딩 메이크업과 헤어를 맡겼는데 사진이 너무 잘 나왔어요. 인생샷 건졌습니다!', name: '최OO (웨딩 고객)', stars: '★★★★★' },
  { key: 'client-5', quote: '피부 관리 받은 후 피부 결이 많이 좋아졌어요. 꾸준히 다니고 있습니다.', name: '정OO (피부 관리 고객)', stars: '★★★★☆' },
  { key: 'client-6', quote: '가로수길에서 가성비 최고인 살롱입니다. 실력도 좋고 분위기도 좋아요.', name: '한OO (헤어 고객)', stars: '★★★★★' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-beautytesti-card-${t.key}`;

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
      text: t.stars,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'regular',
    }),
    createTextNode({
      id: `${cid}-quote`,
      parentId: cid,
      rect: { x: 24, y: 54, width: 322, height: 100 },
      text: `"${t.quote}"`,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-name`,
      parentId: cid,
      rect: { x: 24, y: 168, width: 200, height: 28 },
      text: `— ${t.name}`,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-beautytesti-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '고객 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautytesti-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '저희 살롱을 이용하신 고객님들의 생생한 후기입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const beautyTestimonialsTemplate: PageTemplate = {
  id: 'beauty-testimonials',
  name: '살롱 고객 후기',
  category: 'beauty',
  subcategory: 'testimonials',
  description: '후기 제목 + 6개 후기 카드(별점 + 인용문 + 고객명)',
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
