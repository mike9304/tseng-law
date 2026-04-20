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
const PROGRAMS_Y = HERO_H + 80;
const PROGRAMS_H = 420;
const STATS_Y = PROGRAMS_Y + PROGRAMS_H + 80;
const STATS_H = 200;
const CTA_Y = STATS_Y + STATS_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eduhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-eduhome-hero-bg',
    parentId: 'tpl-eduhome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-education-hero.jpg',
    alt: '캠퍼스 전경 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-eduhome-hero-title',
    { x: MARGIN, y: 160, width: 600, height: 100 },
    '미래를 여는 교육',
    1,
    '#ffffff',
    'left',
    'tpl-eduhome-hero',
  ),
  createTextNode({
    id: 'tpl-eduhome-hero-tagline',
    parentId: 'tpl-eduhome-hero',
    rect: { x: MARGIN, y: 280, width: 500, height: 60 },
    text: '최고의 교수진과 실무 중심 커리큘럼으로 여러분의 꿈을 실현하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-eduhome-hero-cta',
    parentId: 'tpl-eduhome-hero',
    rect: { x: MARGIN, y: 370, width: 200, height: 52 },
    label: '입학 지원하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Program highlights ──────────────────────────────────── */
  heading(
    'tpl-eduhome-programs-title',
    { x: MARGIN, y: PROGRAMS_Y, width: 400, height: 50 },
    '주요 프로그램',
    2,
    '#123b63',
  ),
  createContainerNode({
    id: 'tpl-eduhome-prog-1',
    rect: { x: MARGIN, y: PROGRAMS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduhome-prog-1-title', { x: 24, y: 24, width: 212, height: 36 }, '컴퓨터공학', 3, '#123b63', 'left', 'tpl-eduhome-prog-1'),
  createTextNode({
    id: 'tpl-eduhome-prog-1-desc',
    parentId: 'tpl-eduhome-prog-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: 'AI, 빅데이터, 소프트웨어 개발 등 IT 분야의 전문 인재를 양성합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-eduhome-prog-2',
    rect: { x: 370, y: PROGRAMS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduhome-prog-2-title', { x: 24, y: 24, width: 212, height: 36 }, '경영학', 3, '#123b63', 'left', 'tpl-eduhome-prog-2'),
  createTextNode({
    id: 'tpl-eduhome-prog-2-desc',
    parentId: 'tpl-eduhome-prog-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '글로벌 비즈니스 리더를 양성하는 실무 중심의 경영 교육과정입니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-eduhome-prog-3',
    rect: { x: 660, y: PROGRAMS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduhome-prog-3-title', { x: 24, y: 24, width: 212, height: 36 }, '디자인', 3, '#123b63', 'left', 'tpl-eduhome-prog-3'),
  createTextNode({
    id: 'tpl-eduhome-prog-3-desc',
    parentId: 'tpl-eduhome-prog-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '시각, UX/UI, 산업 디자인 분야의 창의적 인재를 키웁니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-eduhome-prog-4',
    rect: { x: 950, y: PROGRAMS_Y + 70, width: 260, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduhome-prog-4-title', { x: 24, y: 24, width: 212, height: 36 }, '외국어', 3, '#123b63', 'left', 'tpl-eduhome-prog-4'),
  createTextNode({
    id: 'tpl-eduhome-prog-4-desc',
    parentId: 'tpl-eduhome-prog-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '영어, 중국어, 일본어 등 글로벌 커뮤니케이션 역량을 강화합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Stats ───────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eduhome-stats',
    rect: { x: 0, y: STATS_Y, width: W, height: STATS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-eduhome-stats-data',
    parentId: 'tpl-eduhome-stats',
    rect: { x: MARGIN, y: 60, width: 800, height: 60 },
    text: '재학생 3,000+ | 취업률 95% | 교수진 200+ | 해외 파트너 50+',
    fontSize: 24,
    color: '#123b63',
    fontWeight: 'bold',
    align: 'center',
    lineHeight: 1.5,
  }),

  /* ── Apply CTA ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eduhome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-eduhome-cta-text',
    parentId: 'tpl-eduhome-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '새로운 시작을 준비하세요. 지금 입학 상담을 신청하세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-eduhome-cta-btn',
    parentId: 'tpl-eduhome-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '입학 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const educationHomeTemplate: PageTemplate = {
  id: 'education-home',
  name: '교육기관 홈',
  category: 'education',
  subcategory: 'homepage',
  description: '히어로 + 주요 프로그램(4개) + 통계 + 입학 CTA',
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
