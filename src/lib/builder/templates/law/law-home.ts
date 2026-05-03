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

/* ── Dimensions ──────────────────────────────────────────────── */

const W = 1280;
const HERO_H = 600;
const PRACTICE_Y = HERO_H + 80;
const PRACTICE_H = 520;
const TESTIMONIAL_Y = PRACTICE_Y + PRACTICE_H + 80;
const TESTIMONIAL_H = 360;
const CONTACT_Y = TESTIMONIAL_Y + TESTIMONIAL_H + 80;
const CONTACT_H = 200;
const STAGE_H = CONTACT_Y + CONTACT_H + 80;

/* ── Heading node helper (no helper in shared.ts) ───────────── */

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

/* ── Nodes ───────────────────────────────────────────────────── */

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero section ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-home-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-home-hero-bg',
    parentId: 'tpl-home-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-hero.jpg',
    alt: '법률사무소 히어로 배경 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-home-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '신뢰할 수 있는 법률 파트너',
    1,
    '#ffffff',
    'left',
    'tpl-home-hero',
  ),
  createTextNode({
    id: 'tpl-home-hero-tagline',
    parentId: 'tpl-home-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '복잡한 법률 문제, 경험 많은 전문가와 함께 해결하세요. 초기 상담 무료.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-home-hero-cta',
    parentId: 'tpl-home-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '무료 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Practice areas ──────────────────────────────────────── */
  heading(
    'tpl-home-practice-title',
    { x: 80, y: PRACTICE_Y, width: 400, height: 50 },
    '주요 업무 분야',
    2,
    '#123b63',
    'left',
  ),
  // Card 1
  createContainerNode({
    id: 'tpl-home-card-1',
    rect: { x: 80, y: PRACTICE_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-home-card-1-title', { x: 24, y: 24, width: 212, height: 36 }, '기업법', 3, '#123b63', 'left', 'tpl-home-card-1'),
  createTextNode({
    id: 'tpl-home-card-1-desc',
    parentId: 'tpl-home-card-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '설립, M&A, 계약 검토 등 기업 활동 전반에 걸친 법률 자문을 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 2
  createContainerNode({
    id: 'tpl-home-card-2',
    rect: { x: 370, y: PRACTICE_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-home-card-2-title', { x: 24, y: 24, width: 212, height: 36 }, '부동산법', 3, '#123b63', 'left', 'tpl-home-card-2'),
  createTextNode({
    id: 'tpl-home-card-2-desc',
    parentId: 'tpl-home-card-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '부동산 거래, 임대차 분쟁, 등기 등 부동산 관련 법률 서비스를 전문으로 합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 3
  createContainerNode({
    id: 'tpl-home-card-3',
    rect: { x: 660, y: PRACTICE_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-home-card-3-title', { x: 24, y: 24, width: 212, height: 36 }, '이민법', 3, '#123b63', 'left', 'tpl-home-card-3'),
  createTextNode({
    id: 'tpl-home-card-3-desc',
    parentId: 'tpl-home-card-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '비자 발급, 거류증 연장, 영주권 취득 등 이민 관련 전문 상담을 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  // Card 4
  createContainerNode({
    id: 'tpl-home-card-4',
    rect: { x: 950, y: PRACTICE_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-home-card-4-title', { x: 24, y: 24, width: 212, height: 36 }, '가족법', 3, '#123b63', 'left', 'tpl-home-card-4'),
  createTextNode({
    id: 'tpl-home-card-4-desc',
    parentId: 'tpl-home-card-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '이혼, 양육권, 상속 등 가족 관련 법적 분쟁을 원만하게 해결해 드립니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Testimonial section ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-home-testimonial',
    rect: { x: 0, y: TESTIMONIAL_Y, width: W, height: TESTIMONIAL_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-home-testimonial-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '고객 후기',
    2,
    '#123b63',
    'left',
    'tpl-home-testimonial',
  ),
  createContainerNode({
    id: 'tpl-home-testimonial-card',
    parentId: 'tpl-home-testimonial',
    rect: { x: 80, y: 110, width: 500, height: 180 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-home-testimonial-quote',
    parentId: 'tpl-home-testimonial-card',
    rect: { x: 24, y: 24, width: 452, height: 80 },
    text: '"처음 대만에서 법률 문제를 겪었을 때 막막했는데, 이 사무소 덕분에 무사히 해결할 수 있었습니다. 한국어 상담이 정말 큰 도움이 되었습니다."',
    fontSize: 15,
    color: '#374151',
    fontWeight: 'regular',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-home-testimonial-name',
    parentId: 'tpl-home-testimonial-card',
    rect: { x: 24, y: 120, width: 200, height: 32 },
    text: '— 김OO, 기업 고객',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'medium',
  }),

  /* ── Contact strip ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-home-contact',
    rect: { x: 0, y: CONTACT_Y, width: W, height: CONTACT_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-home-contact-text',
    parentId: 'tpl-home-contact',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '지금 바로 무료 상담을 신청하세요. 전문 변호사가 친절하게 안내해 드립니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-home-contact-btn',
    parentId: 'tpl-home-contact',
    rect: { x: 80, y: 110, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-lawhome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-proof-label', parentId: 'tpl-lawhome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-proof-title', parentId: 'tpl-lawhome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'law home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-proof-copy', parentId: 'tpl-lawhome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-metric-1', parentId: 'tpl-lawhome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-1-value', parentId: 'tpl-lawhome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-1-label', parentId: 'tpl-lawhome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-metric-2', parentId: 'tpl-lawhome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-2-value', parentId: 'tpl-lawhome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-2-label', parentId: 'tpl-lawhome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-metric-3', parentId: 'tpl-lawhome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-3-value', parentId: 'tpl-lawhome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-3-label', parentId: 'tpl-lawhome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-metric-4', parentId: 'tpl-lawhome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-4-value', parentId: 'tpl-lawhome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-metric-4-label', parentId: 'tpl-lawhome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-label', parentId: 'tpl-lawhome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-title', parentId: 'tpl-lawhome-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-copy', parentId: 'tpl-lawhome-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-showcase-visual', parentId: 'tpl-lawhome-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-visual-title', parentId: 'tpl-lawhome-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-visual-copy', parentId: 'tpl-lawhome-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-showcase-card-1', parentId: 'tpl-lawhome-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-card-1-title', parentId: 'tpl-lawhome-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-card-1-copy', parentId: 'tpl-lawhome-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawhome-wix-showcase-card-2', parentId: 'tpl-lawhome-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawhome-wix-showcase-card-2-title', parentId: 'tpl-lawhome-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
]);

/* ── Export ───────────────────────────────────────────────────── */

export const lawHomeTemplate: PageTemplate = {
  id: 'law-home',
  name: '법률사무소 홈',
  category: 'law',
  subcategory: 'homepage',
  description: '히어로 + 업무분야 그리드(4개) + 고객 후기 + 연락처 스트립',
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
