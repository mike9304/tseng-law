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
  dept: string;
  text: string;
}

const testimonials: Testimonial[] = [
  { key: 'test-1', name: '김OO', dept: '내과', text: '친절한 진료와 정확한 진단 덕분에 빠르게 회복할 수 있었습니다. 감사합니다.' },
  { key: 'test-2', name: '이OO', dept: '정형외과', text: '무릎 수술 후 재활까지 체계적으로 관리해 주셔서 정말 만족스러웠습니다.' },
  { key: 'test-3', name: '박OO', dept: '피부과', text: '피부 고민을 오래 했는데 전문적인 상담과 시술로 자신감을 되찾았습니다.' },
  { key: 'test-4', name: '최OO', dept: '건강검진', text: '종합 검진 프로그램이 체계적이고 결과 설명도 상세해서 매년 방문합니다.' },
  { key: 'test-5', name: '정OO', dept: '소아과', text: '아이가 병원을 무서워했는데, 선생님이 편안하게 대해주셔서 잘 다니고 있어요.' },
  { key: 'test-6', name: '강OO', dept: '치과', text: '임플란트 시술이 걱정됐는데 상세한 설명과 세심한 시술 덕에 편안했습니다.' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-healthtest-card-${t.key}`;

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
      id: `${cid}-dept`,
      parentId: cid,
      rect: { x: 24, y: 172, width: 200, height: 24 },
      text: `${t.dept} 환자`,
      fontSize: 13,
      color: '#6b7280',
    }),
  ];
}

const ROWS = Math.ceil(testimonials.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthtest-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '환자 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthtest-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '저희 병원을 이용하신 환자분들의 생생한 후기입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const healthTestimonialsTemplate: PageTemplate = {
  id: 'health-testimonials',
  name: '환자 후기',
  category: 'health',
  subcategory: 'testimonials',
  description: '환자 스토리 + 6개 후기 카드(텍스트 + 이름 + 진료과)',
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
