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
const HERO_H = 600;
const MENU_Y = HERO_H + 80;
const MENU_H = 420;
const RESERVATION_Y = MENU_Y + MENU_H + 80;
const RESERVATION_H = 300;
const HOURS_Y = RESERVATION_Y + RESERVATION_H + 80;
const HOURS_H = 200;
const STAGE_H = HOURS_Y + HOURS_H + 80;

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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero section ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-resthome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-hero-bg',
    parentId: 'tpl-resthome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-restaurant-hero.jpg',
    alt: '레스토랑 대표 음식 이미지',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-resthome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '정성을 담은 한 접시',
    1,
    '#ffffff',
    'left',
    'tpl-resthome-hero',
  ),
  createTextNode({
    id: 'tpl-resthome-hero-tagline',
    parentId: 'tpl-resthome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '신선한 재료와 셰프의 정성으로 만드는 특별한 요리를 경험하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-resthome-hero-cta',
    parentId: 'tpl-resthome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Menu highlights ─────────────────────────────────────── */
  heading(
    'tpl-resthome-menu-title',
    { x: 80, y: MENU_Y, width: 400, height: 50 },
    '인기 메뉴',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-resthome-card-1',
    rect: { x: 80, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-1-img',
    parentId: 'tpl-resthome-card-1',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-1.jpg',
    alt: '시그니처 스테이크',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-1-title', { x: 16, y: 172, width: 228, height: 36 }, '시그니처 스테이크', 3, '#123b63', 'left', 'tpl-resthome-card-1'),
  createTextNode({
    id: 'tpl-resthome-card-1-desc',
    parentId: 'tpl-resthome-card-1',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '최상급 한우로 만든 셰프의 시그니처 스테이크입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-resthome-card-2',
    rect: { x: 370, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-2-img',
    parentId: 'tpl-resthome-card-2',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-2.jpg',
    alt: '트러플 파스타',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-2-title', { x: 16, y: 172, width: 228, height: 36 }, '트러플 파스타', 3, '#123b63', 'left', 'tpl-resthome-card-2'),
  createTextNode({
    id: 'tpl-resthome-card-2-desc',
    parentId: 'tpl-resthome-card-2',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '신선한 트러플과 수제 파스타의 완벽한 조화를 즐기세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-resthome-card-3',
    rect: { x: 660, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-3-img',
    parentId: 'tpl-resthome-card-3',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-3.jpg',
    alt: '해산물 플래터',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-3-title', { x: 16, y: 172, width: 228, height: 36 }, '해산물 플래터', 3, '#123b63', 'left', 'tpl-resthome-card-3'),
  createTextNode({
    id: 'tpl-resthome-card-3-desc',
    parentId: 'tpl-resthome-card-3',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '당일 공수한 신선한 해산물로 구성된 프리미엄 플래터입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-resthome-card-4',
    rect: { x: 950, y: MENU_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-resthome-card-4-img',
    parentId: 'tpl-resthome-card-4',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-dish-4.jpg',
    alt: '디저트 셀렉션',
    style: { borderRadius: 0 },
  }),
  heading('tpl-resthome-card-4-title', { x: 16, y: 172, width: 228, height: 36 }, '디저트 셀렉션', 3, '#123b63', 'left', 'tpl-resthome-card-4'),
  createTextNode({
    id: 'tpl-resthome-card-4-desc',
    parentId: 'tpl-resthome-card-4',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '수제 디저트로 식사의 마무리를 달콤하게 장식하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Reservation CTA ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-resthome-reservation',
    rect: { x: 0, y: RESERVATION_Y, width: W, height: RESERVATION_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-resthome-reservation-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '특별한 날을 위한 예약',
    2,
    '#123b63',
    'left',
    'tpl-resthome-reservation',
  ),
  createTextNode({
    id: 'tpl-resthome-reservation-desc',
    parentId: 'tpl-resthome-reservation',
    rect: { x: 80, y: 110, width: 600, height: 60 },
    text: '기념일, 비즈니스 미팅, 가족 모임 등 소중한 순간을 위한 예약을 도와드립니다. 프라이빗 룸도 준비되어 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-resthome-reservation-btn',
    parentId: 'tpl-resthome-reservation',
    rect: { x: 80, y: 200, width: 180, height: 48 },
    label: '온라인 예약',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Hours / Location ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-resthome-hours',
    rect: { x: 0, y: HOURS_Y, width: W, height: HOURS_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-resthome-hours-text',
    parentId: 'tpl-resthome-hours',
    rect: { x: 80, y: 40, width: 400, height: 60 },
    text: '영업시간: 월~토 11:30 - 22:00 | 일요일 12:00 - 21:00',
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-resthome-location-text',
    parentId: 'tpl-resthome-hours',
    rect: { x: 80, y: 110, width: 400, height: 40 },
    text: '서울시 강남구 테헤란로 123 레스토랑빌딩 1층',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.4,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restauranthome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-proof-label', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-proof-title', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'restaurant home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-proof-copy', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-metric-1', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-1-value', parentId: 'tpl-restauranthome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-1-label', parentId: 'tpl-restauranthome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-metric-2', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-2-value', parentId: 'tpl-restauranthome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-2-label', parentId: 'tpl-restauranthome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-metric-3', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-3-value', parentId: 'tpl-restauranthome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-3-label', parentId: 'tpl-restauranthome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-metric-4', parentId: 'tpl-restauranthome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-4-value', parentId: 'tpl-restauranthome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-metric-4-label', parentId: 'tpl-restauranthome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-showcase-label', parentId: 'tpl-restauranthome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-showcase-title', parentId: 'tpl-restauranthome-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-showcase-copy', parentId: 'tpl-restauranthome-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-showcase-visual', parentId: 'tpl-restauranthome-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-showcase-visual-title', parentId: 'tpl-restauranthome-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-showcase-visual-copy', parentId: 'tpl-restauranthome-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restauranthome-wix-showcase-card-1', parentId: 'tpl-restauranthome-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restauranthome-wix-showcase-card-1-title', parentId: 'tpl-restauranthome-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
]);

export const restaurantHomeTemplate: PageTemplate = {
  id: 'restaurant-home',
  name: '레스토랑 홈',
  category: 'restaurant',
  subcategory: 'homepage',
  description: '히어로 음식 이미지 + 인기 메뉴 카드(4개) + 예약 CTA + 영업시간/위치',
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
