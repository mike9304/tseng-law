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
const SERVICES_Y = HERO_H + 80;
const SERVICES_H = 520;
const LOGOS_Y = SERVICES_Y + SERVICES_H + 80;
const LOGOS_H = 200;
const CTA_Y = LOGOS_Y + LOGOS_H + 80;
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
    id: 'tpl-conshome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-conshome-hero-bg',
    parentId: 'tpl-conshome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-consulting-hero.jpg',
    alt: '컨설팅 비즈니스 히어로 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-conshome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '비즈니스 성장을 이끄는 전략 파트너',
    1,
    '#ffffff',
    'left',
    'tpl-conshome-hero',
  ),
  createTextNode({
    id: 'tpl-conshome-hero-tagline',
    parentId: 'tpl-conshome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '데이터 기반 전략과 실행력으로 기업의 지속 가능한 성장을 지원합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-conshome-hero-cta',
    parentId: 'tpl-conshome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '무료 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Service pillars (4 cards) ──────────────────────────── */
  heading(
    'tpl-conshome-svc-title',
    { x: 80, y: SERVICES_Y, width: 400, height: 50 },
    '핵심 서비스',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-conshome-card-1',
    rect: { x: 80, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-conshome-card-1-t', { x: 24, y: 24, width: 212, height: 36 }, '경영 전략', 3, '#123b63', 'left', 'tpl-conshome-card-1'),
  createTextNode({
    id: 'tpl-conshome-card-1-d',
    parentId: 'tpl-conshome-card-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '시장 분석, 성장 전략, 디지털 전환 등 경영 전반에 걸친 자문을 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-conshome-card-2',
    rect: { x: 370, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-conshome-card-2-t', { x: 24, y: 24, width: 212, height: 36 }, '운영 최적화', 3, '#123b63', 'left', 'tpl-conshome-card-2'),
  createTextNode({
    id: 'tpl-conshome-card-2-d',
    parentId: 'tpl-conshome-card-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '프로세스 개선, 비용 절감, 공급망 최적화로 운영 효율을 극대화합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-conshome-card-3',
    rect: { x: 660, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-conshome-card-3-t', { x: 24, y: 24, width: 212, height: 36 }, '재무 컨설팅', 3, '#123b63', 'left', 'tpl-conshome-card-3'),
  createTextNode({
    id: 'tpl-conshome-card-3-d',
    parentId: 'tpl-conshome-card-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '재무 구조 분석, 투자 전략, 리스크 관리로 재무 건전성을 강화합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-conshome-card-4',
    rect: { x: 950, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-conshome-card-4-t', { x: 24, y: 24, width: 212, height: 36 }, 'IT 전략', 3, '#123b63', 'left', 'tpl-conshome-card-4'),
  createTextNode({
    id: 'tpl-conshome-card-4-d',
    parentId: 'tpl-conshome-card-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '디지털 혁신, 시스템 도입, 데이터 분석 기반 IT 전략을 수립합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Client logos ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-conshome-logos',
    rect: { x: 0, y: LOGOS_Y, width: W, height: LOGOS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-conshome-logos-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '신뢰하는 파트너사',
    2,
    '#123b63',
    'left',
    'tpl-conshome-logos',
  ),
  createTextNode({
    id: 'tpl-conshome-logos-desc',
    parentId: 'tpl-conshome-logos',
    rect: { x: 80, y: 100, width: 800, height: 40 },
    text: '삼성, LG, 현대, SK 등 국내외 500+ 기업이 저희와 함께합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.5,
  }),

  /* ── Consultation CTA ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-conshome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-conshome-cta-text',
    parentId: 'tpl-conshome-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '비즈니스 성장의 첫걸음, 무료 상담으로 시작하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-conshome-cta-btn',
    parentId: 'tpl-conshome-cta',
    rect: { x: 80, y: 110, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const consultingHomeTemplate: PageTemplate = {
  id: 'consulting-home',
  name: '컨설팅 홈',
  category: 'consulting',
  subcategory: 'homepage',
  description: '전문 히어로 + 서비스 필라(4개 카드) + 고객사 로고 + 상담 CTA',
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
