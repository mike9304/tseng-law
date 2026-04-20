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
  { key: 'member-1', quote: '3개월 만에 15kg 감량에 성공했습니다! 트레이너님의 맞춤 프로그램 덕분이에요. 인생이 바뀌었습니다.', name: '김OO (다이어트 회원)', stars: '★★★★★' },
  { key: 'member-2', quote: '요가 클래스가 정말 좋습니다. 만성 허리 통증이 많이 개선되었고 유연성도 눈에 띄게 좋아졌어요.', name: '이OO (요가 회원)', stars: '★★★★★' },
  { key: 'member-3', quote: '복싱 수업이 스트레스 해소에 최고입니다. 강사님도 재미있고 매번 오는 것이 즐거워요.', name: '박OO (복싱 회원)', stars: '★★★★★' },
  { key: 'member-4', quote: '시설이 깨끗하고 장비 관리가 잘 되어 있어요. 새벽 6시 오픈이라 출근 전 운동하기 딱 좋습니다.', name: '최OO (새벽 회원)', stars: '★★★★★' },
  { key: 'member-5', quote: 'PT를 처음 받아봤는데 친절하게 동작을 교정해 주셔서 부상 걱정 없이 운동할 수 있었어요.', name: '정OO (PT 회원)', stars: '★★★★☆' },
  { key: 'member-6', quote: '영양 상담까지 해주는 곳은 처음이에요. 식단과 운동을 함께 관리하니 효과가 두 배입니다!', name: '한OO (프리미엄 회원)', stars: '★★★★★' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-fittesti-card-${t.key}`;

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
    'tpl-fittesti-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '회원 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fittesti-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '실제 회원님들의 변화 이야기를 들어보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const fitnessTestimonialsTemplate: PageTemplate = {
  id: 'fitness-testimonials',
  name: '회원 후기',
  category: 'fitness',
  subcategory: 'testimonials',
  description: '후기 제목 + 6개 회원 후기 카드(별점 + 인용문 + 회원명)',
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
