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
    stageHeight: STAGE_H,
    nodes,
  },
};
