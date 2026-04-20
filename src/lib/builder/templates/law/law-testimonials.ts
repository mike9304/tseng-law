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
  { key: 'client-1', quote: '대만에서 법인을 설립할 때 정말 큰 도움을 받았습니다. 복잡한 절차를 친절하게 안내해 주셔서 감사합니다.', name: '김OO (기업 고객)', stars: '★★★★★' },
  { key: 'client-2', quote: '이민 비자 문제로 고민이 많았는데, 전문적인 상담 덕분에 빠르게 해결할 수 있었습니다. 정말 추천합니다.', name: '이OO (이민 고객)', stars: '★★★★★' },
  { key: 'client-3', quote: '부동산 매매 과정에서 발생한 분쟁을 원만하게 해결해 주셨습니다. 세심한 법률 자문에 감사드립니다.', name: '박OO (부동산 고객)', stars: '★★★★★' },
  { key: 'client-4', quote: '국제 이혼 소송에서 양육권을 확보할 수 있도록 도와주셔서 감사합니다. 어려운 시기에 큰 힘이 되었습니다.', name: '최OO (가족법 고객)', stars: '★★★★★' },
  { key: 'client-5', quote: '한국어로 상담받을 수 있어서 정말 편했습니다. 법률 용어도 쉽게 설명해 주셔서 상황을 잘 이해할 수 있었어요.', name: '정OO (개인 고객)', stars: '★★★★☆' },
  { key: 'client-6', quote: '노동법 관련 분쟁에서 좋은 결과를 얻을 수 있었습니다. 전문적이고 신속한 대응에 매우 만족합니다.', name: '한OO (노동법 고객)', stars: '★★★★★' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-testi-card-${t.key}`;

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
    'tpl-testi-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '고객 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-testi-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '저희 법률사무소를 이용하신 고객님들의 생생한 후기입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const lawTestimonialsTemplate: PageTemplate = {
  id: 'law-testimonials',
  name: '고객 후기',
  category: 'law',
  subcategory: 'testimonials',
  description: '섹션 제목 + 6개 후기 카드(별점 + 인용문 + 고객명)',
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
