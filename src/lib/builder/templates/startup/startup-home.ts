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
const FEATURES_Y = HERO_H + 80;
const FEATURES_H = 520;
const SOCIAL_Y = FEATURES_Y + FEATURES_H + 80;
const SOCIAL_H = 200;
const CTA_Y = SOCIAL_Y + SOCIAL_H + 80;
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
  /* ── Hero section ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stuphome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-stuphome-hero-title',
    { x: 80, y: 140, width: 550, height: 100 },
    '비즈니스를 혁신하는 올인원 플랫폼',
    1,
    '#ffffff',
    'left',
    'tpl-stuphome-hero',
  ),
  createTextNode({
    id: 'tpl-stuphome-hero-tagline',
    parentId: 'tpl-stuphome-hero',
    rect: { x: 80, y: 260, width: 500, height: 60 },
    text: '데이터 분석부터 자동화까지, 하나의 플랫폼으로 모든 업무를 간소화하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-stuphome-hero-cta',
    parentId: 'tpl-stuphome-hero',
    rect: { x: 80, y: 350, width: 200, height: 52 },
    label: '무료 시작하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  createButtonNode({
    id: 'tpl-stuphome-hero-demo',
    parentId: 'tpl-stuphome-hero',
    rect: { x: 300, y: 350, width: 160, height: 52 },
    label: '데모 보기',
    href: '#',
    variant: 'outline',
    style: { borderRadius: 6 },
  }),
  createImageNode({
    id: 'tpl-stuphome-hero-img',
    parentId: 'tpl-stuphome-hero',
    rect: { x: 680, y: 100, width: 520, height: 380 },
    src: '/images/placeholder-product-screenshot.png',
    alt: '제품 스크린샷',
    style: { borderRadius: 12 },
  }),

  /* ── Features (4 cards) ─────────────────────────────────── */
  heading('tpl-stuphome-feat-title', { x: 80, y: FEATURES_Y, width: 400, height: 50 }, '핵심 기능', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-stuphome-feat-1',
    rect: { x: 80, y: FEATURES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-stuphome-feat-1-t', { x: 24, y: 24, width: 212, height: 36 }, '실시간 분석', 3, '#123b63', 'left', 'tpl-stuphome-feat-1'),
  createTextNode({
    id: 'tpl-stuphome-feat-1-d',
    parentId: 'tpl-stuphome-feat-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '실시간 대시보드로 핵심 지표를 한눈에 파악하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-stuphome-feat-2',
    rect: { x: 370, y: FEATURES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-stuphome-feat-2-t', { x: 24, y: 24, width: 212, height: 36 }, '워크플로우 자동화', 3, '#123b63', 'left', 'tpl-stuphome-feat-2'),
  createTextNode({
    id: 'tpl-stuphome-feat-2-d',
    parentId: 'tpl-stuphome-feat-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '반복 업무를 자동화하여 팀 생산성을 극대화하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-stuphome-feat-3',
    rect: { x: 660, y: FEATURES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-stuphome-feat-3-t', { x: 24, y: 24, width: 212, height: 36 }, '팀 협업', 3, '#123b63', 'left', 'tpl-stuphome-feat-3'),
  createTextNode({
    id: 'tpl-stuphome-feat-3-d',
    parentId: 'tpl-stuphome-feat-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '실시간 공유와 코멘트로 팀워크를 강화하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-stuphome-feat-4',
    rect: { x: 950, y: FEATURES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-stuphome-feat-4-t', { x: 24, y: 24, width: 212, height: 36 }, 'API 연동', 3, '#123b63', 'left', 'tpl-stuphome-feat-4'),
  createTextNode({
    id: 'tpl-stuphome-feat-4-d',
    parentId: 'tpl-stuphome-feat-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '기존 도구와 원활하게 연동하여 데이터를 통합하세요.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Social proof ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stuphome-social',
    rect: { x: 0, y: SOCIAL_Y, width: W, height: SOCIAL_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stuphome-social-title', { x: 80, y: 40, width: 600, height: 50 }, '10,000+ 팀이 신뢰합니다', 2, '#123b63', 'center', 'tpl-stuphome-social'),
  createTextNode({
    id: 'tpl-stuphome-social-desc',
    parentId: 'tpl-stuphome-social',
    rect: { x: 80, y: 100, width: 1120, height: 40 },
    text: '삼성, 네이버, 카카오, 쿠팡, 배달의민족 등 국내 주요 기업이 사용 중입니다.',
    fontSize: 16,
    color: '#374151',
    align: 'center',
    lineHeight: 1.5,
  }),

  /* ── Signup CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stuphome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-stuphome-cta-text',
    parentId: 'tpl-stuphome-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '지금 무료로 시작하세요. 신용카드 없이 14일 무료 체험.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-stuphome-cta-btn',
    parentId: 'tpl-stuphome-cta',
    rect: { x: 80, y: 110, width: 200, height: 48 },
    label: '무료 체험 시작',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-startuphome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-proof-label', parentId: 'tpl-startuphome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-proof-title', parentId: 'tpl-startuphome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'startup home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-proof-copy', parentId: 'tpl-startuphome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-metric-1', parentId: 'tpl-startuphome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-1-value', parentId: 'tpl-startuphome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-1-label', parentId: 'tpl-startuphome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-metric-2', parentId: 'tpl-startuphome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-2-value', parentId: 'tpl-startuphome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-2-label', parentId: 'tpl-startuphome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-metric-3', parentId: 'tpl-startuphome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-3-value', parentId: 'tpl-startuphome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-3-label', parentId: 'tpl-startuphome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-metric-4', parentId: 'tpl-startuphome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-4-value', parentId: 'tpl-startuphome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-metric-4-label', parentId: 'tpl-startuphome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-label', parentId: 'tpl-startuphome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-title', parentId: 'tpl-startuphome-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-copy', parentId: 'tpl-startuphome-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-showcase-visual', parentId: 'tpl-startuphome-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-visual-title', parentId: 'tpl-startuphome-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-visual-copy', parentId: 'tpl-startuphome-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-showcase-card-1', parentId: 'tpl-startuphome-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-card-1-title', parentId: 'tpl-startuphome-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-card-1-copy', parentId: 'tpl-startuphome-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuphome-wix-showcase-card-2', parentId: 'tpl-startuphome-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-card-2-title', parentId: 'tpl-startuphome-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuphome-wix-showcase-card-2-copy', parentId: 'tpl-startuphome-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
]);

export const startupHomeTemplate: PageTemplate = {
  id: 'startup-home',
  name: '스타트업 홈',
  category: 'startup',
  subcategory: 'homepage',
  description: '대담한 히어로 + 제품 스크린샷 + 기능(4개 카드) + 소셜 프루프 + 가입 CTA',
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
