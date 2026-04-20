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
const FEATURED_H = 500;
const POSTS_Y = FEATURED_H + 80;
const POSTS_H = 900;
const SIDEBAR_X = 900;
const NEWSLETTER_Y = POSTS_Y + POSTS_H + 80;
const NEWSLETTER_H = 200;
const STAGE_H = NEWSLETTER_Y + NEWSLETTER_H + 80;

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

function postCard(n: number, row: number): BuilderCanvasNode[] {
  const col = (n - 1) % 2;
  const x = 80 + col * 400;
  const y = POSTS_Y + 70 + row * 270;
  const cId = `tpl-bloghome-post-${n}`;
  const titles = ['디지털 노마드의 삶', '2026 트렌드 전망', '생산성 향상 팁', '미니멀 라이프', '독서 리뷰', '창작의 즐거움'];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 380, height: 250 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 380, height: 140 },
      src: `/images/placeholder-blogpost-${n}.jpg`,
      alt: `${titles[n - 1]} 썸네일`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-title`, { x: 16, y: 150, width: 348, height: 30 }, titles[n - 1], 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-meta`,
      parentId: cId,
      rect: { x: 16, y: 186, width: 300, height: 20 },
      text: '2026.04.10 · 5분 읽기',
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-excerpt`,
      parentId: cId,
      rect: { x: 16, y: 212, width: 348, height: 28 },
      text: '흥미로운 이야기와 인사이트를 공유합니다.',
      fontSize: 14,
      color: '#1f2937',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Featured article hero ──────────────────────────────── */
  createContainerNode({
    id: 'tpl-bloghome-featured',
    rect: { x: 0, y: 0, width: W, height: FEATURED_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-bloghome-featured-bg',
    parentId: 'tpl-bloghome-featured',
    rect: { x: 0, y: 0, width: W, height: FEATURED_H },
    src: '/images/placeholder-featured-article.jpg',
    alt: '주요 기사 배경 이미지',
    style: { opacity: 30, borderRadius: 0 },
  }),
  createTextNode({
    id: 'tpl-bloghome-featured-label',
    parentId: 'tpl-bloghome-featured',
    rect: { x: 80, y: 120, width: 120, height: 28 },
    text: '추천 기사',
    fontSize: 14,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  heading(
    'tpl-bloghome-featured-title',
    { x: 80, y: 160, width: 700, height: 80 },
    '2026년을 이끌어갈 10가지 라이프스타일 트렌드',
    1,
    '#ffffff',
    'left',
    'tpl-bloghome-featured',
  ),
  createTextNode({
    id: 'tpl-bloghome-featured-excerpt',
    parentId: 'tpl-bloghome-featured',
    rect: { x: 80, y: 260, width: 600, height: 60 },
    text: '변화하는 시대에 맞춰 우리의 라이프스타일도 진화하고 있습니다. 올해 주목해야 할 트렌드를 알아봅니다.',
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-bloghome-featured-btn',
    parentId: 'tpl-bloghome-featured',
    rect: { x: 80, y: 350, width: 160, height: 48 },
    label: '읽어보기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Latest posts (6 cards) ─────────────────────────────── */
  heading(
    'tpl-bloghome-posts-title',
    { x: 80, y: POSTS_Y, width: 400, height: 50 },
    '최신 글',
    2,
    '#123b63',
    'left',
  ),
  ...postCard(1, 0),
  ...postCard(2, 0),
  ...postCard(3, 1),
  ...postCard(4, 1),
  ...postCard(5, 2),
  ...postCard(6, 2),

  /* ── Category sidebar ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-bloghome-sidebar',
    rect: { x: SIDEBAR_X, y: POSTS_Y + 70, width: 300, height: 300 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-bloghome-sidebar-title', { x: 24, y: 16, width: 252, height: 30 }, '카테고리', 3, '#123b63', 'left', 'tpl-bloghome-sidebar'),
  createTextNode({
    id: 'tpl-bloghome-sidebar-cats',
    parentId: 'tpl-bloghome-sidebar',
    rect: { x: 24, y: 60, width: 252, height: 200 },
    text: '라이프스타일\n테크놀로지\n여행\n문화\n건강\n비즈니스\n독서\n푸드',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 2.0,
  }),

  /* ── Newsletter signup ──────────────────────────────────── */
  createContainerNode({
    id: 'tpl-bloghome-newsletter',
    rect: { x: 0, y: NEWSLETTER_Y, width: W, height: NEWSLETTER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-bloghome-newsletter-title',
    { x: 80, y: 40, width: 500, height: 40 },
    '뉴스레터 구독',
    2,
    '#ffffff',
    'left',
    'tpl-bloghome-newsletter',
  ),
  createTextNode({
    id: 'tpl-bloghome-newsletter-desc',
    parentId: 'tpl-bloghome-newsletter',
    rect: { x: 80, y: 90, width: 500, height: 32 },
    text: '매주 엄선된 글을 이메일로 받아보세요.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  }),
  createButtonNode({
    id: 'tpl-bloghome-newsletter-btn',
    parentId: 'tpl-bloghome-newsletter',
    rect: { x: 80, y: 138, width: 160, height: 44 },
    label: '구독하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const blogHomeTemplate: PageTemplate = {
  id: 'blog-home',
  name: '블로그 홈',
  category: 'blog',
  subcategory: 'homepage',
  description: '추천 기사 히어로 + 최신 글(6개) + 카테고리 사이드바 + 뉴스레터 구독',
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
