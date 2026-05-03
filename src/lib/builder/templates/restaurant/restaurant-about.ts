import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
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
const CHEF_Y = HEADER_H + 40;
const CHEF_H = 400;
const HISTORY_Y = CHEF_Y + CHEF_H + 80;
const HISTORY_H = 300;
const PHILOSOPHY_Y = HISTORY_Y + HISTORY_H + 80;
const PHILOSOPHY_H = 280;
const STAGE_H = PHILOSOPHY_Y + PHILOSOPHY_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restabout-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '레스토랑 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '최고의 맛과 서비스를 약속하는 우리의 이야기를 들려드립니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Chef story ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restabout-chef',
    rect: { x: 0, y: CHEF_Y, width: W, height: CHEF_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-restabout-chef-img',
    parentId: 'tpl-restabout-chef',
    rect: { x: MARGIN, y: 40, width: 400, height: 320 },
    src: '/images/placeholder-chef.jpg',
    alt: '셰프 프로필 사진',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-restabout-chef-title',
    { x: 540, y: 40, width: 400, height: 44 },
    '셰프 소개',
    2,
    '#123b63',
    'left',
    'tpl-restabout-chef',
  ),
  createTextNode({
    id: 'tpl-restabout-chef-desc',
    parentId: 'tpl-restabout-chef',
    rect: { x: 540, y: 100, width: 500, height: 200 },
    text: '프랑스 르 코르동 블루 출신의 김OO 셰프는 20년 이상의 경력을 바탕으로 한식과 양식의 조화를 추구합니다. 미쉐린 가이드 추천 레스토랑에서의 경험을 살려, 최상의 재료로 정성을 담은 요리를 선보입니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Restaurant history ──────────────────────────────────── */
  heading(
    'tpl-restabout-history-title',
    { x: MARGIN, y: HISTORY_Y, width: 500, height: 50 },
    '우리의 역사',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restabout-history-desc',
    rect: { x: MARGIN, y: HISTORY_Y + 70, width: 700, height: 180 },
    text: '2010년 작은 비스트로에서 시작한 우리 레스토랑은 15년간 한결같은 맛과 서비스로 사랑받아 왔습니다. 처음에는 20석 규모의 아담한 공간이었지만, 고객님들의 성원에 힘입어 현재 100석 규모의 파인 다이닝 레스토랑으로 성장했습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Philosophy ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restabout-philosophy',
    rect: { x: 0, y: PHILOSOPHY_Y, width: W, height: PHILOSOPHY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-restabout-philosophy-title',
    { x: MARGIN, y: 40, width: 500, height: 50 },
    '요리 철학',
    2,
    '#ffffff',
    'left',
    'tpl-restabout-philosophy',
  ),
  createTextNode({
    id: 'tpl-restabout-philosophy-desc',
    parentId: 'tpl-restabout-philosophy',
    rect: { x: MARGIN, y: 110, width: 800, height: 120 },
    text: '우리는 "제철 재료, 정직한 요리"라는 철학 아래, 매일 산지에서 직송한 신선한 재료만을 사용합니다. 인공 첨가물 없이 재료 본연의 맛을 살리는 것이 우리의 약속입니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restaurantabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-proof-label', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-proof-title', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'restaurant about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-proof-copy', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-metric-1', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-1-value', parentId: 'tpl-restaurantabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-1-label', parentId: 'tpl-restaurantabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-metric-2', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-2-value', parentId: 'tpl-restaurantabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-2-label', parentId: 'tpl-restaurantabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-metric-3', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-3-value', parentId: 'tpl-restaurantabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-3-label', parentId: 'tpl-restaurantabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-metric-4', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-4-value', parentId: 'tpl-restaurantabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-metric-4-label', parentId: 'tpl-restaurantabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-label', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-title', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-copy', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-showcase-visual', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-visual-title', parentId: 'tpl-restaurantabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-visual-copy', parentId: 'tpl-restaurantabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-showcase-card-1', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-card-1-title', parentId: 'tpl-restaurantabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-card-1-copy', parentId: 'tpl-restaurantabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-showcase-card-2', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-card-2-title', parentId: 'tpl-restaurantabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-card-2-copy', parentId: 'tpl-restaurantabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-showcase-card-3', parentId: 'tpl-restaurantabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-card-3-title', parentId: 'tpl-restaurantabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-showcase-card-3-copy', parentId: 'tpl-restaurantabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-quote', parentId: 'tpl-restaurantabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-quote-mark', parentId: 'tpl-restaurantabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-quote-body', parentId: 'tpl-restaurantabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-quote-role', parentId: 'tpl-restaurantabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-cta-label', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-cta-title', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-cta-copy', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-restaurantabout-wix-cta-primary', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-restaurantabout-wix-cta-secondary', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-restaurantabout-wix-cta-note', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantabout-wix-timeline', parentId: 'tpl-restaurantabout-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
]);

export const restaurantAboutTemplate: PageTemplate = {
  id: 'restaurant-about',
  name: '레스토랑 소개',
  category: 'restaurant',
  subcategory: 'about',
  description: '셰프 스토리 + 레스토랑 역사 + 요리 철학 섹션',
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
