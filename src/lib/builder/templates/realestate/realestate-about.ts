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
const STORY_Y = HEADER_H + 40;
const STORY_H = 360;
const EXPERTISE_Y = STORY_Y + STORY_H + 80;
const EXPERTISE_H = 240;
const AWARDS_Y = EXPERTISE_Y + EXPERTISE_H + 80;
const AWARDS_H = 200;
const STAGE_H = AWARDS_Y + AWARDS_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-reabout-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '회사 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-reabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '신뢰와 전문성으로 부동산 거래를 이끄는 우리 회사를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Agency story ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reabout-story',
    rect: { x: 0, y: STORY_Y, width: W, height: STORY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-reabout-story-img',
    parentId: 'tpl-reabout-story',
    rect: { x: MARGIN, y: 40, width: 450, height: 280 },
    src: '/images/placeholder-realestate-office.jpg',
    alt: '부동산 사무실 내부',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-reabout-story-title',
    { x: 580, y: 40, width: 400, height: 44 },
    '우리의 이야기',
    2,
    '#123b63',
    'left',
    'tpl-reabout-story',
  ),
  createTextNode({
    id: 'tpl-reabout-story-desc',
    parentId: 'tpl-reabout-story',
    rect: { x: 580, y: 100, width: 500, height: 200 },
    text: '2008년 설립 이래, 서울 주요 지역의 부동산 거래를 전문으로 해왔습니다. 1,200건 이상의 성공적인 거래를 통해 고객의 신뢰를 쌓아왔으며, 투명하고 정직한 거래를 최우선으로 합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Market expertise ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reabout-expertise',
    rect: { x: 0, y: EXPERTISE_Y, width: W, height: EXPERTISE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-reabout-expertise-title',
    { x: MARGIN, y: 40, width: 500, height: 44 },
    '시장 전문성',
    2,
    '#ffffff',
    'left',
    'tpl-reabout-expertise',
  ),
  createTextNode({
    id: 'tpl-reabout-expertise-desc',
    parentId: 'tpl-reabout-expertise',
    rect: { x: MARGIN, y: 100, width: 800, height: 100 },
    text: '강남, 서초, 송파, 여의도 등 서울 핵심 지역의 시세 동향을 실시간으로 분석합니다. 빅데이터 기반의 시장 분석과 전문 중개사의 현장 경험을 결합하여 최적의 투자 전략을 제안합니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),

  /* ── Awards ──────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reabout-awards',
    rect: { x: 0, y: AWARDS_Y, width: W, height: AWARDS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-reabout-awards-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '수상 및 인증',
    2,
    '#123b63',
    'left',
    'tpl-reabout-awards',
  ),
  createTextNode({
    id: 'tpl-reabout-awards-desc',
    parentId: 'tpl-reabout-awards',
    rect: { x: MARGIN, y: 100, width: 800, height: 60 },
    text: '2024 우수 공인중개사무소 선정 | 한국부동산협회 공로상 | 고객만족도 1위 (3년 연속) | ISO 9001 인증',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-realestateabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-proof-label', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-proof-title', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'realestate about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-proof-copy', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-metric-1', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-1-value', parentId: 'tpl-realestateabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-1-label', parentId: 'tpl-realestateabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-metric-2', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-2-value', parentId: 'tpl-realestateabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-2-label', parentId: 'tpl-realestateabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-metric-3', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-3-value', parentId: 'tpl-realestateabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-3-label', parentId: 'tpl-realestateabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-metric-4', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-4-value', parentId: 'tpl-realestateabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-metric-4-label', parentId: 'tpl-realestateabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-label', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-title', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-copy', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-showcase-visual', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-visual-title', parentId: 'tpl-realestateabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-visual-copy', parentId: 'tpl-realestateabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-showcase-card-1', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-card-1-title', parentId: 'tpl-realestateabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-card-1-copy', parentId: 'tpl-realestateabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-showcase-card-2', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-card-2-title', parentId: 'tpl-realestateabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-card-2-copy', parentId: 'tpl-realestateabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-showcase-card-3', parentId: 'tpl-realestateabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-card-3-title', parentId: 'tpl-realestateabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-showcase-card-3-copy', parentId: 'tpl-realestateabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestateabout-wix-quote', parentId: 'tpl-realestateabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-quote-mark', parentId: 'tpl-realestateabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-quote-body', parentId: 'tpl-realestateabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-quote-role', parentId: 'tpl-realestateabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-cta-label', parentId: 'tpl-realestateabout-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-cta-title', parentId: 'tpl-realestateabout-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-cta-copy', parentId: 'tpl-realestateabout-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-realestateabout-wix-cta-primary', parentId: 'tpl-realestateabout-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-realestateabout-wix-cta-secondary', parentId: 'tpl-realestateabout-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-realestateabout-wix-cta-note', parentId: 'tpl-realestateabout-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
]);

export const realestateAboutTemplate: PageTemplate = {
  id: 'realestate-about',
  name: '부동산 회사 소개',
  category: 'realestate',
  subcategory: 'about',
  description: '에이전시 스토리 + 시장 전문성 + 수상 내역',
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
