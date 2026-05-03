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
const TRIPS_Y = HERO_H + 80;
const TRIPS_H = 420;
const BOOKING_Y = TRIPS_Y + TRIPS_H + 80;
const BOOKING_H = 300;
const WHY_Y = BOOKING_Y + BOOKING_H + 80;
const WHY_H = 280;
const STAGE_H = WHY_Y + WHY_H + 80;

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
    id: 'tpl-travelhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-travelhome-hero-bg',
    parentId: 'tpl-travelhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-travel-hero.jpg',
    alt: '여행 목적지 히어로 배경',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-travelhome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '꿈꾸던 여행을 현실로',
    1,
    '#ffffff',
    'left',
    'tpl-travelhome-hero',
  ),
  createTextNode({
    id: 'tpl-travelhome-hero-tagline',
    parentId: 'tpl-travelhome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '전문 여행 플래너가 설계하는 맞춤 여행으로 잊지 못할 추억을 만들어 드립니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-travelhome-hero-cta',
    parentId: 'tpl-travelhome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '여행 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Popular trips (4 cards) ─────────────────────────────── */
  heading(
    'tpl-travelhome-trips-title',
    { x: 80, y: TRIPS_Y, width: 400, height: 50 },
    '인기 여행지',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-travelhome-card-1',
    rect: { x: 80, y: TRIPS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-travelhome-card-1-img',
    parentId: 'tpl-travelhome-card-1',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-travel-japan.jpg',
    alt: '일본 여행',
    style: { borderRadius: 0 },
  }),
  heading('tpl-travelhome-card-1-title', { x: 16, y: 172, width: 228, height: 36 }, '일본 오사카', 3, '#123b63', 'left', 'tpl-travelhome-card-1'),
  createTextNode({
    id: 'tpl-travelhome-card-1-desc',
    parentId: 'tpl-travelhome-card-1',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '맛의 도시 오사카에서 미식 여행과 문화 체험을 즐기세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelhome-card-2',
    rect: { x: 370, y: TRIPS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-travelhome-card-2-img',
    parentId: 'tpl-travelhome-card-2',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-travel-europe.jpg',
    alt: '유럽 여행',
    style: { borderRadius: 0 },
  }),
  heading('tpl-travelhome-card-2-title', { x: 16, y: 172, width: 228, height: 36 }, '유럽 일주', 3, '#123b63', 'left', 'tpl-travelhome-card-2'),
  createTextNode({
    id: 'tpl-travelhome-card-2-desc',
    parentId: 'tpl-travelhome-card-2',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '파리, 로마, 바르셀로나를 잇는 유럽 핵심 도시 투어.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelhome-card-3',
    rect: { x: 660, y: TRIPS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-travelhome-card-3-img',
    parentId: 'tpl-travelhome-card-3',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-travel-bali.jpg',
    alt: '발리 여행',
    style: { borderRadius: 0 },
  }),
  heading('tpl-travelhome-card-3-title', { x: 16, y: 172, width: 228, height: 36 }, '발리 힐링', 3, '#123b63', 'left', 'tpl-travelhome-card-3'),
  createTextNode({
    id: 'tpl-travelhome-card-3-desc',
    parentId: 'tpl-travelhome-card-3',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '열대 자연 속에서 즐기는 럭셔리 리조트 힐링 여행.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelhome-card-4',
    rect: { x: 950, y: TRIPS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-travelhome-card-4-img',
    parentId: 'tpl-travelhome-card-4',
    rect: { x: 0, y: 0, width: 260, height: 160 },
    src: '/images/placeholder-travel-hawaii.jpg',
    alt: '하와이 여행',
    style: { borderRadius: 0 },
  }),
  heading('tpl-travelhome-card-4-title', { x: 16, y: 172, width: 228, height: 36 }, '하와이', 3, '#123b63', 'left', 'tpl-travelhome-card-4'),
  createTextNode({
    id: 'tpl-travelhome-card-4-desc',
    parentId: 'tpl-travelhome-card-4',
    rect: { x: 16, y: 216, width: 228, height: 60 },
    text: '에메랄드 바다와 화산 트레킹을 즐기는 하와이 여행.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Booking CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelhome-booking',
    rect: { x: 0, y: BOOKING_Y, width: W, height: BOOKING_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-travelhome-booking-title',
    { x: 80, y: 40, width: 500, height: 50 },
    '맞춤 여행 상담',
    2,
    '#123b63',
    'left',
    'tpl-travelhome-booking',
  ),
  createTextNode({
    id: 'tpl-travelhome-booking-desc',
    parentId: 'tpl-travelhome-booking',
    rect: { x: 80, y: 110, width: 600, height: 60 },
    text: '원하는 일정, 예산, 스타일에 맞는 맞춤 여행을 설계해 드립니다. 무료 상담을 신청하세요.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-travelhome-booking-btn',
    parentId: 'tpl-travelhome-booking',
    rect: { x: 80, y: 200, width: 180, height: 48 },
    label: '상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Why choose us ───────────────────────────────────────── */
  heading(
    'tpl-travelhome-why-title',
    { x: 80, y: WHY_Y, width: 400, height: 50 },
    '왜 저희를 선택할까요?',
    2,
    '#123b63',
  ),
  createContainerNode({
    id: 'tpl-travelhome-why-1',
    rect: { x: 80, y: WHY_Y + 60, width: 350, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelhome-why-1-title', { x: 24, y: 20, width: 302, height: 36 }, '15년 경험', 3, '#123b63', 'left', 'tpl-travelhome-why-1'),
  createTextNode({
    id: 'tpl-travelhome-why-1-desc',
    parentId: 'tpl-travelhome-why-1',
    rect: { x: 24, y: 64, width: 302, height: 60 },
    text: '15년간 10만 명 이상의 고객에게 특별한 여행 경험을 제공했습니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelhome-why-2',
    rect: { x: 460, y: WHY_Y + 60, width: 350, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelhome-why-2-title', { x: 24, y: 20, width: 302, height: 36 }, '맞춤 설계', 3, '#123b63', 'left', 'tpl-travelhome-why-2'),
  createTextNode({
    id: 'tpl-travelhome-why-2-desc',
    parentId: 'tpl-travelhome-why-2',
    rect: { x: 24, y: 64, width: 302, height: 60 },
    text: '패키지가 아닌 고객 맞춤형 여행 일정을 전문 플래너가 설계합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelhome-why-3',
    rect: { x: 840, y: WHY_Y + 60, width: 350, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelhome-why-3-title', { x: 24, y: 20, width: 302, height: 36 }, '24시간 지원', 3, '#123b63', 'left', 'tpl-travelhome-why-3'),
  createTextNode({
    id: 'tpl-travelhome-why-3-desc',
    parentId: 'tpl-travelhome-why-3',
    rect: { x: 24, y: 64, width: 302, height: 60 },
    text: '여행 중 긴급 상황 시 24시간 한국어 긴급 지원 서비스를 제공합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelhome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-travelhome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-travelhome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-proof-label', parentId: 'tpl-travelhome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-proof-title', parentId: 'tpl-travelhome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'travel home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-proof-copy', parentId: 'tpl-travelhome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-travelhome-wix-metric-1', parentId: 'tpl-travelhome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-1-value', parentId: 'tpl-travelhome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-1-label', parentId: 'tpl-travelhome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelhome-wix-metric-2', parentId: 'tpl-travelhome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-2-value', parentId: 'tpl-travelhome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-2-label', parentId: 'tpl-travelhome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelhome-wix-metric-3', parentId: 'tpl-travelhome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-3-value', parentId: 'tpl-travelhome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-3-label', parentId: 'tpl-travelhome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelhome-wix-metric-4', parentId: 'tpl-travelhome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-4-value', parentId: 'tpl-travelhome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-metric-4-label', parentId: 'tpl-travelhome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-travelhome-wix-showcase-label', parentId: 'tpl-travelhome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
]);

export const travelHomeTemplate: PageTemplate = {
  id: 'travel-home',
  name: '여행사 홈',
  category: 'travel',
  subcategory: 'homepage',
  description: '여행 히어로 + 인기 여행지 카드(4개) + 상담 CTA + 왜 저희를 선택?',
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
