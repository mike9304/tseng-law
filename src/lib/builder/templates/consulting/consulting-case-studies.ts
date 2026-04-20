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

const cases = [
  { title: '글로벌 제조사 비용 절감', metric: '연간 30% 비용 절감', desc: '공급망 최적화를 통해 대형 제조사의 운영 비용을 대폭 절감했습니다.' },
  { title: 'IT기업 매출 성장', metric: '매출 2배 성장', desc: '디지털 마케팅 전략 재수립으로 12개월 내 매출 2배 달성을 지원했습니다.' },
  { title: '유통사 디지털 전환', metric: '온라인 매출 150% 증가', desc: 'O2O 전략과 이커머스 플랫폼 구축으로 디지털 전환에 성공했습니다.' },
  { title: '금융사 조직 혁신', metric: '직원 만족도 40% 향상', desc: '조직 재설계와 문화 혁신으로 직원 만족도와 생산성을 동시에 개선했습니다.' },
  { title: '스타트업 투자 유치', metric: 'Series B 500억 유치', desc: '사업 계획 수립과 투자자 매칭으로 대규모 투자 유치를 성공시켰습니다.' },
  { title: '헬스케어 시장 진입', metric: '신규 시장 점유율 15%', desc: '시장 분석과 진입 전략 수립으로 신규 헬스케어 시장 안착을 지원했습니다.' },
];

const cardW = 360;
const cardH = 250;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = cases.flatMap((c, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-conscase-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, c.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-m`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 312, height: 30 },
      text: c.metric,
      fontSize: 16,
      color: '#e8a838',
      fontWeight: 'bold',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 110, width: 312, height: 80 },
      text: c.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-conscase-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-conscase-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '성공 사례', 1, '#ffffff', 'left', 'tpl-conscase-hero'),
  createTextNode({
    id: 'tpl-conscase-hero-sub',
    parentId: 'tpl-conscase-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '다양한 산업에서 검증된 컨설팅 성과를 확인하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-conscase-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '프로젝트 성과', 2, '#123b63', 'left'),
  ...cards,
]);

export const consultingCaseStudiesTemplate: PageTemplate = {
  id: 'consulting-case-studies',
  name: '컨설팅 성공 사례',
  category: 'consulting',
  subcategory: 'case-studies',
  description: '성공 스토리 + 6개 사례 카드(지표 포함)',
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
