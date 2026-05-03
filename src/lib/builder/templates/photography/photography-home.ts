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
const HERO_H = 700;
const PORTFOLIO_Y = HERO_H + 80;
const PORTFOLIO_H = 420;
const ABOUT_Y = PORTFOLIO_Y + PORTFOLIO_H + 80;
const ABOUT_H = 300;
const CTA_Y = ABOUT_Y + ABOUT_H + 80;
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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Full-width hero image ──────────────────────────────── */
  createContainerNode({
    id: 'tpl-photohome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-hero-bg',
    parentId: 'tpl-photohome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-photo-hero.jpg',
    alt: '포트폴리오 대표 사진',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-photohome-hero-title',
    { x: 80, y: 220, width: 700, height: 100 },
    '순간을 영원으로',
    1,
    '#ffffff',
    'left',
    'tpl-photohome-hero',
  ),
  createTextNode({
    id: 'tpl-photohome-hero-sub',
    parentId: 'tpl-photohome-hero',
    rect: { x: 80, y: 340, width: 500, height: 60 },
    text: '감성적인 시선으로 당신의 특별한 순간을 담아드립니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-photohome-hero-cta',
    parentId: 'tpl-photohome-hero',
    rect: { x: 80, y: 430, width: 200, height: 52 },
    label: '촬영 예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Portfolio categories (4 cards) ─────────────────────── */
  heading(
    'tpl-photohome-port-title',
    { x: 80, y: PORTFOLIO_Y, width: 400, height: 50 },
    '포트폴리오',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-photohome-cat-1',
    rect: { x: 80, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-1-img',
    parentId: 'tpl-photohome-cat-1',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-wedding.jpg',
    alt: '웨딩 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-1-title', { x: 16, y: 212, width: 228, height: 36 }, '웨딩', 3, '#123b63', 'left', 'tpl-photohome-cat-1'),
  createTextNode({
    id: 'tpl-photohome-cat-1-desc',
    parentId: 'tpl-photohome-cat-1',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '아름다운 결혼식의 순간',
    fontSize: 14,
    color: '#1f2937',
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-photohome-cat-2',
    rect: { x: 370, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-2-img',
    parentId: 'tpl-photohome-cat-2',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-portrait.jpg',
    alt: '인물 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-2-title', { x: 16, y: 212, width: 228, height: 36 }, '인물', 3, '#123b63', 'left', 'tpl-photohome-cat-2'),
  createTextNode({
    id: 'tpl-photohome-cat-2-desc',
    parentId: 'tpl-photohome-cat-2',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '자연스러운 인물 사진',
    fontSize: 14,
    color: '#1f2937',
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-photohome-cat-3',
    rect: { x: 660, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-3-img',
    parentId: 'tpl-photohome-cat-3',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-event.jpg',
    alt: '이벤트 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-3-title', { x: 16, y: 212, width: 228, height: 36 }, '이벤트', 3, '#123b63', 'left', 'tpl-photohome-cat-3'),
  createTextNode({
    id: 'tpl-photohome-cat-3-desc',
    parentId: 'tpl-photohome-cat-3',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '특별한 행사의 기록',
    fontSize: 14,
    color: '#1f2937',
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-photohome-cat-4',
    rect: { x: 950, y: PORTFOLIO_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-photohome-cat-4-img',
    parentId: 'tpl-photohome-cat-4',
    rect: { x: 0, y: 0, width: 260, height: 200 },
    src: '/images/placeholder-photo-product.jpg',
    alt: '제품 촬영',
    style: { borderRadius: 0 },
  }),
  heading('tpl-photohome-cat-4-title', { x: 16, y: 212, width: 228, height: 36 }, '제품', 3, '#123b63', 'left', 'tpl-photohome-cat-4'),
  createTextNode({
    id: 'tpl-photohome-cat-4-desc',
    parentId: 'tpl-photohome-cat-4',
    rect: { x: 16, y: 254, width: 228, height: 30 },
    text: '상업용 제품 사진',
    fontSize: 14,
    color: '#1f2937',
  }),

  /* ── About teaser ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photohome-about',
    rect: { x: 0, y: ABOUT_Y, width: W, height: ABOUT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photohome-about-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '사진작가 소개',
    2,
    '#123b63',
    'left',
    'tpl-photohome-about',
  ),
  createTextNode({
    id: 'tpl-photohome-about-text',
    parentId: 'tpl-photohome-about',
    rect: { x: 80, y: 110, width: 700, height: 120 },
    text: '10년 이상의 경력을 가진 전문 포토그래퍼입니다. 자연광을 활용한 감성적인 촬영 스타일을 추구하며, 각 순간의 진정한 아름다움을 렌즈에 담습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Booking CTA ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photohome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-photohome-cta-text',
    parentId: 'tpl-photohome-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '특별한 순간을 함께 기록하고 싶으시다면 지금 예약하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-photohome-cta-btn',
    parentId: 'tpl-photohome-cta',
    rect: { x: 80, y: 110, width: 200, height: 48 },
    label: '촬영 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photographyhome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-proof-label', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-proof-title', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'photography home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-proof-copy', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-metric-1', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-1-value', parentId: 'tpl-photographyhome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-1-label', parentId: 'tpl-photographyhome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-metric-2', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-2-value', parentId: 'tpl-photographyhome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-2-label', parentId: 'tpl-photographyhome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-metric-3', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-3-value', parentId: 'tpl-photographyhome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-3-label', parentId: 'tpl-photographyhome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-metric-4', parentId: 'tpl-photographyhome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-4-value', parentId: 'tpl-photographyhome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-metric-4-label', parentId: 'tpl-photographyhome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-label', parentId: 'tpl-photographyhome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-title', parentId: 'tpl-photographyhome-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-copy', parentId: 'tpl-photographyhome-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-showcase-visual', parentId: 'tpl-photographyhome-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-visual-title', parentId: 'tpl-photographyhome-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-visual-copy', parentId: 'tpl-photographyhome-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyhome-wix-showcase-card-1', parentId: 'tpl-photographyhome-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-card-1-title', parentId: 'tpl-photographyhome-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyhome-wix-showcase-card-1-copy', parentId: 'tpl-photographyhome-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
]);

export const photographyHomeTemplate: PageTemplate = {
  id: 'photography-home',
  name: '사진 스튜디오 홈',
  category: 'photography',
  subcategory: 'homepage',
  description: '전체 화면 히어로 + 포트폴리오 카테고리(4개) + 소개 + 예약 CTA',
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
