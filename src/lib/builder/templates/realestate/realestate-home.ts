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

const HERO_H = 600;
const LISTINGS_Y = HERO_H + 80;
const LISTINGS_H = 480;
const STATS_Y = LISTINGS_Y + LISTINGS_H + 80;
const STATS_H = 200;
const AGENT_Y = STATS_Y + STATS_H + 80;
const AGENT_H = 200;
const STAGE_H = AGENT_Y + AGENT_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero with search bar ────────────────────────────────── */
  createContainerNode({
    id: 'tpl-rehome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-rehome-hero-bg',
    parentId: 'tpl-rehome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-realestate-hero.jpg',
    alt: '도시 스카이라인 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-rehome-hero-title',
    { x: MARGIN, y: 140, width: 700, height: 100 },
    '꿈의 집을 찾아드립니다',
    1,
    '#ffffff',
    'center',
    'tpl-rehome-hero',
  ),
  createTextNode({
    id: 'tpl-rehome-hero-tagline',
    parentId: 'tpl-rehome-hero',
    rect: { x: MARGIN, y: 260, width: 700, height: 50 },
    text: '최적의 부동산 매물을 빠르고 정확하게 검색하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    align: 'center',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-rehome-searchbar',
    parentId: 'tpl-rehome-hero',
    rect: { x: 200, y: 340, width: 600, height: 60 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 16,
  }),
  createTextNode({
    id: 'tpl-rehome-searchbar-text',
    parentId: 'tpl-rehome-searchbar',
    rect: { x: 20, y: 16, width: 400, height: 28 },
    text: '지역, 매물 유형, 가격대로 검색...',
    fontSize: 16,
    color: '#9ca3af',
  }),
  createButtonNode({
    id: 'tpl-rehome-search-btn',
    parentId: 'tpl-rehome-hero',
    rect: { x: 520, y: 420, width: 160, height: 48 },
    label: '매물 검색',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Featured listings ───────────────────────────────────── */
  heading(
    'tpl-rehome-listings-title',
    { x: MARGIN, y: LISTINGS_Y, width: 400, height: 50 },
    '추천 매물',
    2,
    '#123b63',
  ),
  // Listing 1
  createContainerNode({
    id: 'tpl-rehome-listing-1',
    rect: { x: MARGIN, y: LISTINGS_Y + 70, width: 350, height: 380 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-rehome-listing-1-img',
    parentId: 'tpl-rehome-listing-1',
    rect: { x: 0, y: 0, width: 350, height: 200 },
    src: '/images/placeholder-property-1.jpg',
    alt: '강남 아파트 외관',
    style: { borderRadius: 0 },
  }),
  heading('tpl-rehome-listing-1-title', { x: 20, y: 212, width: 310, height: 36 }, '강남 럭셔리 아파트', 3, '#123b63', 'left', 'tpl-rehome-listing-1'),
  createTextNode({
    id: 'tpl-rehome-listing-1-price',
    parentId: 'tpl-rehome-listing-1',
    rect: { x: 20, y: 254, width: 200, height: 28 },
    text: '매매 15억원',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-rehome-listing-1-info',
    parentId: 'tpl-rehome-listing-1',
    rect: { x: 20, y: 290, width: 310, height: 60 },
    text: '3룸 / 2화장실 / 120m²\n강남역 도보 5분, 주차 2대',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),
  // Listing 2
  createContainerNode({
    id: 'tpl-rehome-listing-2',
    rect: { x: 460, y: LISTINGS_Y + 70, width: 350, height: 380 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-rehome-listing-2-img',
    parentId: 'tpl-rehome-listing-2',
    rect: { x: 0, y: 0, width: 350, height: 200 },
    src: '/images/placeholder-property-2.jpg',
    alt: '서초 타운하우스',
    style: { borderRadius: 0 },
  }),
  heading('tpl-rehome-listing-2-title', { x: 20, y: 212, width: 310, height: 36 }, '서초 프리미엄 타운하우스', 3, '#123b63', 'left', 'tpl-rehome-listing-2'),
  createTextNode({
    id: 'tpl-rehome-listing-2-price',
    parentId: 'tpl-rehome-listing-2',
    rect: { x: 20, y: 254, width: 200, height: 28 },
    text: '매매 22억원',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-rehome-listing-2-info',
    parentId: 'tpl-rehome-listing-2',
    rect: { x: 20, y: 290, width: 310, height: 60 },
    text: '4룸 / 3화장실 / 180m²\n정원 포함, 서초역 도보 10분',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),
  // Listing 3
  createContainerNode({
    id: 'tpl-rehome-listing-3',
    rect: { x: 840, y: LISTINGS_Y + 70, width: 350, height: 380 },
    background: '#ffffff',
    borderRadius: 12,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-rehome-listing-3-img',
    parentId: 'tpl-rehome-listing-3',
    rect: { x: 0, y: 0, width: 350, height: 200 },
    src: '/images/placeholder-property-3.jpg',
    alt: '송파 오피스텔',
    style: { borderRadius: 0 },
  }),
  heading('tpl-rehome-listing-3-title', { x: 20, y: 212, width: 310, height: 36 }, '송파 신축 오피스텔', 3, '#123b63', 'left', 'tpl-rehome-listing-3'),
  createTextNode({
    id: 'tpl-rehome-listing-3-price',
    parentId: 'tpl-rehome-listing-3',
    rect: { x: 20, y: 254, width: 200, height: 28 },
    text: '전세 3억원',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-rehome-listing-3-info',
    parentId: 'tpl-rehome-listing-3',
    rect: { x: 20, y: 290, width: 310, height: 60 },
    text: '1룸 / 1화장실 / 33m²\n잠실역 도보 7분, 풀옵션',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),

  /* ── Market stats ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-rehome-stats',
    rect: { x: 0, y: STATS_Y, width: W, height: STATS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-rehome-stats-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '시장 현황',
    2,
    '#123b63',
    'left',
    'tpl-rehome-stats',
  ),
  createTextNode({
    id: 'tpl-rehome-stats-data',
    parentId: 'tpl-rehome-stats',
    rect: { x: MARGIN, y: 100, width: 800, height: 60 },
    text: '관리 매물 500+ | 거래 완료 1,200+ | 평균 거래 기간 45일 | 고객 만족도 98%',
    fontSize: 18,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.6,
  }),

  /* ── Agent CTA ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-rehome-agent',
    rect: { x: 0, y: AGENT_Y, width: W, height: AGENT_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-rehome-agent-text',
    parentId: 'tpl-rehome-agent',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '전문 공인중개사와 상담하세요. 최적의 매물을 추천해 드립니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-rehome-agent-btn',
    parentId: 'tpl-rehome-agent',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-realestatehome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-proof-label', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-proof-title', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'realestate home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-proof-copy', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-metric-1', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-1-value', parentId: 'tpl-realestatehome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-1-label', parentId: 'tpl-realestatehome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-metric-2', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-2-value', parentId: 'tpl-realestatehome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-2-label', parentId: 'tpl-realestatehome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-metric-3', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-3-value', parentId: 'tpl-realestatehome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-3-label', parentId: 'tpl-realestatehome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-metric-4', parentId: 'tpl-realestatehome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-4-value', parentId: 'tpl-realestatehome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-metric-4-label', parentId: 'tpl-realestatehome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-showcase-label', parentId: 'tpl-realestatehome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-showcase-title', parentId: 'tpl-realestatehome-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-showcase-copy', parentId: 'tpl-realestatehome-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-showcase-visual', parentId: 'tpl-realestatehome-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-showcase-visual-title', parentId: 'tpl-realestatehome-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-showcase-visual-copy', parentId: 'tpl-realestatehome-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatehome-wix-showcase-card-1', parentId: 'tpl-realestatehome-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatehome-wix-showcase-card-1-title', parentId: 'tpl-realestatehome-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
]);

export const realestateHomeTemplate: PageTemplate = {
  id: 'realestate-home',
  name: '부동산 홈',
  category: 'realestate',
  subcategory: 'homepage',
  description: '히어로 검색바 + 추천 매물(3개) + 시장 현황 + 중개사 CTA',
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
