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
  role: string;
  text: string;
}

const testimonials: Testimonial[] = [
  { key: 'test-1', name: '김OO', role: '컴퓨터공학 졸업생', text: '실무 중심 교육 덕분에 졸업 후 바로 현업에서 활약할 수 있었습니다.' },
  { key: 'test-2', name: '이OO', role: '경영학 재학생', text: '해외 교환학생 프로그램을 통해 글로벌 시야을 넓힐 수 있었습니다.' },
  { key: 'test-3', name: '박OO', role: '학부모', text: '아이가 즐겁게 학교에 다니며 성장하는 모습을 보니 학교를 잘 선택했다고 느낍니다.' },
  { key: 'test-4', name: '최OO', role: '디자인 졸업생', text: '교수님들의 세심한 지도와 최신 장비 덕분에 포트폴리오 완성도가 높아졌습니다.' },
  { key: 'test-5', name: '정OO', role: '간호학 재학생', text: '임상 실습 기회가 많아 실제 현장에서 필요한 역량을 키울 수 있었습니다.' },
  { key: 'test-6', name: '강OO', role: '조리학 졸업생', text: '학교에서 배운 기초가 탄탄해서 셰프로서 빠르게 성장할 수 있었습니다.' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-edutest-card-${t.key}`;

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
      id: `${cid}-role`,
      parentId: cid,
      rect: { x: 24, y: 172, width: 200, height: 24 },
      text: t.role,
      fontSize: 13,
      color: '#6b7280',
    }),
  ];
}

const ROWS = Math.ceil(testimonials.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-edutest-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '후기', 1, '#123b63'),
  createTextNode({
    id: 'tpl-edutest-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '학생과 학부모님의 생생한 후기를 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const educationTestimonialsTemplate: PageTemplate = {
  id: 'education-testimonials',
  name: '학교 후기',
  category: 'education',
  subcategory: 'testimonials',
  description: '학생/학부모 후기 + 6개 카드',
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
