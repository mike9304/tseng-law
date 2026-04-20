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
const SERVICES_Y = HERO_H + 80;
const SERVICES_H = 420;
const CLIENTS_Y = SERVICES_Y + SERVICES_H + 80;
const CLIENTS_H = 200;
const CTA_Y = CLIENTS_Y + CLIENTS_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-creativehome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-creativehome-hero-bg',
    parentId: 'tpl-creativehome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-creative-hero.jpg',
    alt: '크리에이티브 에이전시 작업 이미지',
    style: { opacity: 25, borderRadius: 0 },
  }),
  heading(
    'tpl-creativehome-hero-title',
    { x: MARGIN, y: 140, width: 700, height: 120 },
    '아이디어를 현실로',
    1,
    '#ffffff',
    'left',
    'tpl-creativehome-hero',
  ),
  createTextNode({
    id: 'tpl-creativehome-hero-tagline',
    parentId: 'tpl-creativehome-hero',
    rect: { x: MARGIN, y: 280, width: 500, height: 60 },
    text: '브랜딩, 웹, 영상 등 크리에이티브 솔루션으로 비즈니스를 성장시키세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-creativehome-hero-cta',
    parentId: 'tpl-creativehome-hero',
    rect: { x: MARGIN, y: 370, width: 200, height: 52 },
    label: '프로젝트 문의',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  // Portfolio teaser
  createImageNode({
    id: 'tpl-creativehome-hero-portfolio',
    parentId: 'tpl-creativehome-hero',
    rect: { x: 700, y: 140, width: 480, height: 340 },
    src: '/images/placeholder-portfolio-teaser.jpg',
    alt: '포트폴리오 미리보기',
    style: { borderRadius: 12 },
  }),

  /* ── Services overview ───────────────────────────────────── */
  heading('tpl-creativehome-svc-title', { x: MARGIN, y: SERVICES_Y, width: 400, height: 50 }, '서비스', 2, '#123b63'),
  createContainerNode({
    id: 'tpl-creativehome-svc-1',
    rect: { x: MARGIN, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-creativehome-svc-1-title', { x: 24, y: 24, width: 212, height: 36 }, '브랜딩', 3, '#123b63', 'left', 'tpl-creativehome-svc-1'),
  createTextNode({
    id: 'tpl-creativehome-svc-1-desc',
    parentId: 'tpl-creativehome-svc-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '로고, CI/BI, 브랜드 가이드라인 등 브랜드 아이덴티티를 구축합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-creativehome-svc-2',
    rect: { x: 370, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-creativehome-svc-2-title', { x: 24, y: 24, width: 212, height: 36 }, '웹 디자인', 3, '#123b63', 'left', 'tpl-creativehome-svc-2'),
  createTextNode({
    id: 'tpl-creativehome-svc-2-desc',
    parentId: 'tpl-creativehome-svc-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '반응형 웹사이트, 랜딩 페이지, 전자상거래 등 웹 솔루션을 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-creativehome-svc-3',
    rect: { x: 660, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-creativehome-svc-3-title', { x: 24, y: 24, width: 212, height: 36 }, '영상 제작', 3, '#123b63', 'left', 'tpl-creativehome-svc-3'),
  createTextNode({
    id: 'tpl-creativehome-svc-3-desc',
    parentId: 'tpl-creativehome-svc-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '기업 홍보 영상, 제품 광고, SNS 콘텐츠 등 영상을 제작합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-creativehome-svc-4',
    rect: { x: 950, y: SERVICES_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-creativehome-svc-4-title', { x: 24, y: 24, width: 212, height: 36 }, 'SNS 마케팅', 3, '#123b63', 'left', 'tpl-creativehome-svc-4'),
  createTextNode({
    id: 'tpl-creativehome-svc-4-desc',
    parentId: 'tpl-creativehome-svc-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: 'SNS 채널 운영, 콘텐츠 기획, 광고 집행 등을 대행합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Client logos ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-creativehome-clients',
    rect: { x: 0, y: CLIENTS_Y, width: W, height: CLIENTS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-creativehome-clients-title', { x: MARGIN, y: 40, width: 300, height: 40 }, '함께한 클라이언트', 2, '#123b63', 'center', 'tpl-creativehome-clients'),
  createTextNode({
    id: 'tpl-creativehome-clients-list',
    parentId: 'tpl-creativehome-clients',
    rect: { x: MARGIN, y: 100, width: W - MARGIN * 2, height: 60 },
    text: '삼성 | 현대 | LG | SK | 네이버 | 카카오 | 쿠팡 | 배달의민족',
    fontSize: 18,
    color: '#6b7280',
    align: 'center',
    lineHeight: 1.5,
  }),

  /* ── Contact CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-creativehome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-creativehome-cta-text',
    parentId: 'tpl-creativehome-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '다음 프로젝트를 함께 시작하세요. 무료 상담을 신청하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-creativehome-cta-btn',
    parentId: 'tpl-creativehome-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '프로젝트 문의',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const creativeHomeTemplate: PageTemplate = {
  id: 'creative-home',
  name: '크리에이티브 에이전시 홈',
  category: 'creative',
  subcategory: 'homepage',
  description: '볼드 히어로 + 포트폴리오 티저 + 서비스(4개) + 클라이언트 로고 + CTA',
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
