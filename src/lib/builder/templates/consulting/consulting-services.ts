import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 700;
const CTA_Y = GRID_Y + GRID_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

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

const services = [
  { title: '전략 컨설팅', desc: '시장 진입 전략, 사업 다각화, M&A 자문 등 기업 성장 전략을 수립합니다.' },
  { title: '운영 컨설팅', desc: '프로세스 혁신, 린 경영, 공급망 관리로 운영 효율을 높입니다.' },
  { title: '재무 자문', desc: '재무 구조 개선, 자금 조달, 투자 전략으로 재무 건전성을 강화합니다.' },
  { title: '마케팅 전략', desc: '브랜드 전략, 디지털 마케팅, 고객 분석으로 매출 성장을 이끕니다.' },
  { title: 'HR 컨설팅', desc: '조직 설계, 인재 확보, 보상 체계 구축으로 인적 자원을 최적화합니다.' },
  { title: 'IT 컨설팅', desc: '디지털 전환, 시스템 통합, 데이터 분석 인프라를 구축합니다.' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = services.flatMap((svc, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-conssvc-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, svc.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 312, height: 100 },
      text: svc.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-conssvc-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-conssvc-hero-title',
    { x: 80, y: 80, width: 600, height: 60 },
    '서비스 안내',
    1,
    '#ffffff',
    'left',
    'tpl-conssvc-hero',
  ),
  createTextNode({
    id: 'tpl-conssvc-hero-sub',
    parentId: 'tpl-conssvc-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '각 분야 최고 전문가가 맞춤 솔루션을 제공합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Service cards (6) ──────────────────────────────────── */
  heading(
    'tpl-conssvc-grid-title',
    { x: 80, y: GRID_Y, width: 400, height: 50 },
    '전문 서비스 영역',
    2,
    '#123b63',
    'left',
  ),
  ...cards,

  /* ── CTA ─────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-conssvc-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-conssvc-cta-text',
    parentId: 'tpl-conssvc-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '맞춤 서비스가 필요하신가요? 전문가와 상담하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-conssvc-cta-btn',
    parentId: 'tpl-conssvc-cta',
    rect: { x: 80, y: 110, width: 180, height: 48 },
    label: '상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const consultingServicesTemplate: PageTemplate = {
  id: 'consulting-services',
  name: '컨설팅 서비스',
  category: 'consulting',
  subcategory: 'services',
  description: '서비스 상세(6개 카드): 전략/운영/재무/마케팅/HR/IT',
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
