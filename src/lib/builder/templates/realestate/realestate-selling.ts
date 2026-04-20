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
const VALUATION_Y = HEADER_H + 40;
const VALUATION_H = 300;
const STRATEGY_Y = VALUATION_Y + VALUATION_H + 80;
const STRATEGY_H = 400;
const CTA_Y = STRATEGY_Y + STRATEGY_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-reselling-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '매도 가이드',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-reselling-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '최적의 가격에 빠르게 매도하는 방법을 안내합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Home valuation CTA ──────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reselling-valuation',
    rect: { x: MARGIN, y: VALUATION_Y, width: W - MARGIN * 2, height: VALUATION_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-reselling-valuation-title',
    { x: 32, y: 24, width: 500, height: 44 },
    '내 집 가치 알아보기',
    2,
    '#123b63',
    'left',
    'tpl-reselling-valuation',
  ),
  createTextNode({
    id: 'tpl-reselling-valuation-desc',
    parentId: 'tpl-reselling-valuation',
    rect: { x: 32, y: 84, width: 800, height: 80 },
    text: '실거래가 데이터와 시세 분석을 기반으로 정확한 매물 가치를 산정해 드립니다. 무료 시세 조회를 통해 적정 매도가를 확인하세요.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
  createButtonNode({
    id: 'tpl-reselling-valuation-btn',
    parentId: 'tpl-reselling-valuation',
    rect: { x: 32, y: 200, width: 200, height: 52 },
    label: '무료 시세 조회',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Marketing strategy ──────────────────────────────────── */
  heading(
    'tpl-reselling-strategy-title',
    { x: MARGIN, y: STRATEGY_Y, width: 500, height: 50 },
    '마케팅 전략',
    2,
    '#123b63',
  ),
  // Strategy card 1
  createContainerNode({
    id: 'tpl-reselling-strat-1',
    rect: { x: MARGIN, y: STRATEGY_Y + 70, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 24,
  }),
  heading('tpl-reselling-strat-1-title', { x: 24, y: 16, width: 300, height: 28 }, '전문 사진 촬영', 3, '#123b63', 'left', 'tpl-reselling-strat-1'),
  createTextNode({
    id: 'tpl-reselling-strat-1-desc',
    parentId: 'tpl-reselling-strat-1',
    rect: { x: 24, y: 52, width: 300, height: 60 },
    text: '전문 사진작가가 매물의 장점을 극대화하는 고퀄리티 사진을 촬영합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  // Strategy card 2
  createContainerNode({
    id: 'tpl-reselling-strat-2',
    rect: { x: 460, y: STRATEGY_Y + 70, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 24,
  }),
  heading('tpl-reselling-strat-2-title', { x: 24, y: 16, width: 300, height: 28 }, '온라인 마케팅', 3, '#123b63', 'left', 'tpl-reselling-strat-2'),
  createTextNode({
    id: 'tpl-reselling-strat-2-desc',
    parentId: 'tpl-reselling-strat-2',
    rect: { x: 24, y: 52, width: 300, height: 60 },
    text: '주요 부동산 포털과 SNS를 통해 매물을 적극적으로 홍보합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  // Strategy card 3
  createContainerNode({
    id: 'tpl-reselling-strat-3',
    rect: { x: 840, y: STRATEGY_Y + 70, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 24,
  }),
  heading('tpl-reselling-strat-3-title', { x: 24, y: 16, width: 300, height: 28 }, '가격 전략', 3, '#123b63', 'left', 'tpl-reselling-strat-3'),
  createTextNode({
    id: 'tpl-reselling-strat-3-desc',
    parentId: 'tpl-reselling-strat-3',
    rect: { x: 24, y: 52, width: 300, height: 60 },
    text: '시장 동향을 반영한 최적의 가격 전략으로 빠른 거래를 돕습니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  // Second row
  createContainerNode({
    id: 'tpl-reselling-strat-4',
    rect: { x: MARGIN, y: STRATEGY_Y + 234, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 24,
  }),
  heading('tpl-reselling-strat-4-title', { x: 24, y: 16, width: 300, height: 28 }, '홈 스테이징', 3, '#123b63', 'left', 'tpl-reselling-strat-4'),
  createTextNode({
    id: 'tpl-reselling-strat-4-desc',
    parentId: 'tpl-reselling-strat-4',
    rect: { x: 24, y: 52, width: 300, height: 60 },
    text: '매물의 매력을 높이기 위한 인테리어 정리 및 연출 서비스를 제공합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),

  /* ── CTA ─────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reselling-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-reselling-cta-text',
    parentId: 'tpl-reselling-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '매도를 결정하셨다면, 전문가와 상의하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-reselling-cta-btn',
    parentId: 'tpl-reselling-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '매도 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const realestateSellingTemplate: PageTemplate = {
  id: 'realestate-selling',
  name: '매도 가이드',
  category: 'realestate',
  subcategory: 'selling',
  description: '매도 가이드 + 시세 조회 CTA + 마케팅 전략',
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
