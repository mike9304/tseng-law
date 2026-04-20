import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 700;
const STAGE_H = GRID_Y + GRID_H + 80;

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

const testimonials = [
  { quote: '"전략 수립부터 실행까지 체계적으로 지원해 주셔서 매출이 크게 성장했습니다."', name: '— 김OO, 제조업 대표' },
  { quote: '"데이터 기반의 분석으로 정확한 의사결정을 할 수 있었습니다. 강력 추천합니다."', name: '— 이OO, IT기업 CEO' },
  { quote: '"조직 혁신 프로젝트를 통해 직원 만족도와 생산성이 동시에 향상되었습니다."', name: '— 박OO, 유통사 인사팀장' },
  { quote: '"M&A 과정에서 전문적인 자문 덕분에 최적의 조건으로 거래를 성사시켰습니다."', name: '— 최OO, 금융사 CFO' },
  { quote: '"스타트업 특성에 맞는 맞춤 전략으로 투자 유치에 성공할 수 있었습니다."', name: '— 정OO, 스타트업 대표' },
  { quote: '"디지털 전환 프로젝트를 성공적으로 완료할 수 있도록 도와주셨습니다."', name: '— 한OO, 헬스케어 CTO' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = testimonials.flatMap((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-constesti-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#ffffff',
      borderRadius: 12,
      padding: 24,
      borderColor: '#e5e7eb',
      borderWidth: 1,
    }),
    createTextNode({
      id: `${prefix}-q`,
      parentId: prefix,
      rect: { x: 24, y: 24, width: 312, height: 120 },
      text: t.quote,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${prefix}-n`,
      parentId: prefix,
      rect: { x: 24, y: 160, width: 312, height: 32 },
      text: t.name,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-constesti-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-constesti-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '고객 후기', 1, '#ffffff', 'left', 'tpl-constesti-hero'),
  createTextNode({
    id: 'tpl-constesti-hero-sub',
    parentId: 'tpl-constesti-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '고객사의 생생한 경험담을 확인하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-constesti-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '고객 리뷰', 2, '#123b63', 'left'),
  ...cards,
]);

export const consultingTestimonialsTemplate: PageTemplate = {
  id: 'consulting-testimonials',
  name: '컨설팅 고객후기',
  category: 'consulting',
  subcategory: 'testimonials',
  description: '고객 추천사 + 6개 카드',
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
