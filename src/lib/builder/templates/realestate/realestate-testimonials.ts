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
const CARD_H = 220;
const GAP = 24;
const COLS = 3;

interface Testimonial {
  key: string;
  name: string;
  type: string;
  text: string;
}

const testimonials: Testimonial[] = [
  { key: 'test-1', name: '김OO', type: '아파트 매수', text: '전문적인 시세 분석과 빠른 매물 추천 덕분에 원하던 아파트를 좋은 가격에 구매했습니다.' },
  { key: 'test-2', name: '이OO', type: '아파트 매도', text: '마케팅 전략이 훌륭했습니다. 한 달 만에 희망 가격으로 매도에 성공했습니다.' },
  { key: 'test-3', name: '박OO', type: '전세 계약', text: '꼼꼼한 계약서 검토와 친절한 안내 덕분에 안심하고 전세 계약을 할 수 있었습니다.' },
  { key: 'test-4', name: '최OO', type: '상가 투자', text: '수익형 부동산 투자 상담이 매우 전문적이었습니다. 안정적인 수익을 올리고 있습니다.' },
  { key: 'test-5', name: '정OO', type: '신혼집 구매', text: '첫 주택 구매라 걱정이 많았는데 처음부터 끝까지 세심하게 도와주셔서 감사합니다.' },
  { key: 'test-6', name: '강OO', type: '오피스텔 매수', text: '투자 목적의 오피스텔 구매였는데, 입지 분석과 수익률 계산까지 완벽했습니다.' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-retest-card-${t.key}`;

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
      id: `${cid}-text`,
      parentId: cid,
      rect: { x: 24, y: 24, width: CARD_W - 48, height: 100 },
      text: `"${t.text}"`,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-name`,
      parentId: cid,
      rect: { x: 24, y: 140, width: 200, height: 28 },
      text: `— ${t.name}`,
      fontSize: 14,
      color: '#123b63',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-type`,
      parentId: cid,
      rect: { x: 24, y: 172, width: 200, height: 24 },
      text: t.type,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
  ];
}

const ROWS = Math.ceil(testimonials.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-retest-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '고객 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-retest-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '성공적인 부동산 거래를 경험한 고객님들의 이야기입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const realestateTestimonialsTemplate: PageTemplate = {
  id: 'realestate-testimonials',
  name: '부동산 고객 후기',
  category: 'realestate',
  subcategory: 'testimonials',
  description: '고객 성공 스토리 + 6개 리뷰 카드(거래 유형 포함)',
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
