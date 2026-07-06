import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';
import { buildCategoryProofSections, SUBPAGE_PROOF_HEIGHT } from '../_shared/subpage-proof-sections';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 560; // tightened from 700: 2-row grid only needs ~540px, was leaving a large empty gap before the next section
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
    content: { text, level, color, align, fontFamily: 'Noto Serif KR' },
  };
}

const testimonials = [
  { quote: '"워크플로우 자동화로 주간 반복 업무를 80% 줄였습니다. 팀 생산성이 확연히 달라졌어요."', name: '— 김OO', company: '네이버 프로덕트팀' },
  { quote: '"실시간 대시보드 덕분에 의사결정 속도가 2배 빨라졌습니다."', name: '— 이OO', company: '쿠팡 데이터팀' },
  { quote: '"API 연동이 정말 깔끔합니다. 기존 시스템과 5분 만에 연결했어요."', name: '— 박OO', company: '토스 개발팀' },
  { quote: '"직관적인 UI 덕분에 비개발자도 워크플로우를 만들 수 있어 좋습니다."', name: '— 최OO', company: '배민 운영팀' },
  { quote: '"엔터프라이즈 보안 기능이 우리 규정에 완벽하게 부합했습니다."', name: '— 정OO', company: '삼성 IT 보안팀' },
  { quote: '"고객 성공 팀의 온보딩 지원이 최고였습니다. 도입 2주 만에 전사 사용."', name: '— 한OO', company: '카카오 PM팀' },
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
  const prefix = `tpl-stuptesti-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#ffffff',
      borderRadius: 12,
      padding: 24,
      borderColor: '#dbe6f5',
      borderWidth: 1,
    }),
    createTextNode({
      id: `${prefix}-q`,
      parentId: prefix,
      rect: { x: 24, y: 24, width: 312, height: 100 },
      text: t.quote,
      fontSize: 15,
      color: '#16191f',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${prefix}-n`,
      parentId: prefix,
      rect: { x: 24, y: 140, width: 312, height: 24 },
      text: t.name,
      fontSize: 14,
      color: '#16191f',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-c`,
      parentId: prefix,
      rect: { x: 24, y: 168, width: 312, height: 24 },
      text: t.company,
      fontSize: 13,
      color: '#5f6b7a',
      lineHeight: 1.3,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stuptesti-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#16191f',
    borderRadius: 0,
  }),
  heading('tpl-stuptesti-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '고객 사례', 1, '#ffffff', 'left', 'tpl-stuptesti-hero'),
  createTextNode({
    id: 'tpl-stuptesti-hero-sub',
    parentId: 'tpl-stuptesti-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '실제 고객들의 성공 스토리를 확인하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stuptesti-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '고객 리뷰', 2, '#16191f', 'left'),
  ...cards,
  ...buildCategoryProofSections('startup', 'startup-testimonials', STAGE_H),
]);

export const startupTestimonialsTemplate: PageTemplate = {
  id: 'startup-testimonials',
  name: '스타트업 고객사례',
  category: 'startup',
  subcategory: 'testimonials',
  description: '고객 성공 스토리 + 6개 카드(회사명 포함)',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H + SUBPAGE_PROOF_HEIGHT,
    nodes,
  },
};
