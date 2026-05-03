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
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-realestateselling-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-proof-label', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-proof-title', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'realestate selling 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-proof-copy', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-metric-1', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-1-value', parentId: 'tpl-realestateselling-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-1-label', parentId: 'tpl-realestateselling-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-metric-2', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-2-value', parentId: 'tpl-realestateselling-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-2-label', parentId: 'tpl-realestateselling-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-metric-3', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-3-value', parentId: 'tpl-realestateselling-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-3-label', parentId: 'tpl-realestateselling-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-metric-4', parentId: 'tpl-realestateselling-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-4-value', parentId: 'tpl-realestateselling-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-metric-4-label', parentId: 'tpl-realestateselling-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-label', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-title', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-copy', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-showcase-visual', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-visual-title', parentId: 'tpl-realestateselling-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-visual-copy', parentId: 'tpl-realestateselling-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-showcase-card-1', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-card-1-title', parentId: 'tpl-realestateselling-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-card-1-copy', parentId: 'tpl-realestateselling-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-showcase-card-2', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-card-2-title', parentId: 'tpl-realestateselling-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-card-2-copy', parentId: 'tpl-realestateselling-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateselling-wix-showcase-card-3', parentId: 'tpl-realestateselling-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-card-3-title', parentId: 'tpl-realestateselling-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateselling-wix-showcase-card-3-copy', parentId: 'tpl-realestateselling-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
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
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
