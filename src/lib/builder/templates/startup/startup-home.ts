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
    stageHeight: STAGE_H,
    nodes,
  },
};
