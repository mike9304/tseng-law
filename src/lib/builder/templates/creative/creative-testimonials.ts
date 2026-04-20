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

interface Testimonial {
  key: string;
  name: string;
  company: string;
  projectType: string;
  text: string;
}

const testimonials: Testimonial[] = [
  { key: 'test-1', name: '김OO', company: 'ABC 테크', projectType: '브랜딩', text: '브랜드 리뉴얼 후 인지도가 크게 올랐습니다. 전략적이고 세심한 작업에 감사드립니다.' },
  { key: 'test-2', name: '이OO', company: '패션몰', projectType: '웹 디자인', text: '새 웹사이트 런칭 후 전환율이 40% 향상되었습니다. 기대 이상의 결과였습니다.' },
  { key: 'test-3', name: '박OO', company: '대기업 D', projectType: '영상 제작', text: '기업 홍보 영상의 퀄리티가 매우 높아 여러 행사에서 활용하고 있습니다.' },
  { key: 'test-4', name: '최OO', company: '뷰티 브랜드 E', projectType: 'SNS 마케팅', text: 'SNS 캠페인으로 팔로워가 3배 증가했습니다. 효과적인 전략이었습니다.' },
  { key: 'test-5', name: '정OO', company: '금융사 F', projectType: '인쇄물', text: '연간 보고서 디자인이 수상까지 해서 회사 이미지 제고에 큰 도움이 되었습니다.' },
  { key: 'test-6', name: '강OO', company: '헬스 앱 G', projectType: 'UX/UI', text: '앱 리디자인 후 사용자 리텐션이 크게 개선되었습니다. 프로세스도 체계적이었습니다.' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-creativetest-card-${t.key}`;

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
      id: `${cid}-type`,
      parentId: cid,
      rect: { x: 24, y: 16, width: 120, height: 22 },
      text: t.projectType,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-text`,
      parentId: cid,
      rect: { x: 24, y: 46, width: CARD_W - 48, height: 100 },
      text: `"${t.text}"`,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-name`,
      parentId: cid,
      rect: { x: 24, y: 162, width: 200, height: 28 },
      text: `— ${t.name}`,
      fontSize: 14,
      color: '#123b63',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-company`,
      parentId: cid,
      rect: { x: 24, y: 194, width: 200, height: 24 },
      text: t.company,
      fontSize: 13,
      color: '#6b7280',
    }),
  ];
}

const ROWS = Math.ceil(testimonials.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativetest-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '클라이언트 후기', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativetest-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '함께 프로젝트를 진행한 클라이언트의 이야기입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
]);

export const creativeTestimonialsTemplate: PageTemplate = {
  id: 'creative-testimonials',
  name: '클라이언트 후기',
  category: 'creative',
  subcategory: 'testimonials',
  description: '클라이언트 후기 + 6개 카드(프로젝트 유형 포함)',
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
