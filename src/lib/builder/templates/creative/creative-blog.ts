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

const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 380;
const GAP = 24;
const COLS = 3;

interface BlogPost {
  key: string;
  title: string;
  date: string;
  excerpt: string;
}

const posts: BlogPost[] = [
  { key: 'design-trend', title: '2026 디자인 트렌드 분석', date: '2026.03.20', excerpt: '올해 주목해야 할 디자인 트렌드와 활용법을 분석합니다.' },
  { key: 'branding-tips', title: '성공적인 브랜딩의 5가지 원칙', date: '2026.03.05', excerpt: '강력한 브랜드를 만드는 핵심 원칙을 공유합니다.' },
  { key: 'ux-research', title: 'UX 리서치 실전 가이드', date: '2026.02.18', excerpt: '효과적인 사용자 조사 방법과 인사이트 도출법을 안내합니다.' },
  { key: 'color-theory', title: '색채 이론과 디자인 적용', date: '2026.02.01', excerpt: '색채 심리학과 효과적인 색상 팔레트 구성법입니다.' },
  { key: 'typography', title: '타이포그래피 완벽 가이드', date: '2026.01.15', excerpt: '서체 선택부터 레이아웃까지, 타이포그래피의 모든 것.' },
  { key: 'portfolio', title: '포트폴리오 제작 팁', date: '2025.12.28', excerpt: '클라이언트를 사로잡는 포트폴리오 구성 전략을 소개합니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-creativeblog-card-${post.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-thumb`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 180 },
      src: `/images/placeholder-creativeblog-${post.key}.jpg`,
      alt: `${post.title} 썸네일`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 20, y: 196, width: 330, height: 40 }, post.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-date`,
      parentId: cid,
      rect: { x: 20, y: 242, width: 120, height: 22 },
      text: post.date,
      fontSize: 13,
      color: '#9ca3af',
    }),
    createTextNode({
      id: `${cid}-excerpt`,
      parentId: cid,
      rect: { x: 20, y: 272, width: 330, height: 60 },
      text: post.excerpt,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 20, y: 340, width: 110, height: 32 },
      label: '더 보기',
      href: '#',
      variant: 'link',
      style: { borderRadius: 4 },
    }),
  ];
}

const ROWS = Math.ceil(posts.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativeblog-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '디자인 인사이트', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativeblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '디자인과 크리에이티브에 대한 인사이트를 공유합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const creativeBlogTemplate: PageTemplate = {
  id: 'creative-blog',
  name: '디자인 인사이트',
  category: 'creative',
  subcategory: 'blog',
  description: '디자인 인사이트 블로그 + 6개 글 카드',
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
