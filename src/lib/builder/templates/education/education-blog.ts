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
  { key: 'ai-edu', title: 'AI 시대의 교육 혁신', date: '2026.03.20', excerpt: '인공지능이 교육 현장을 어떻게 변화시키고 있는지 살펴봅니다.' },
  { key: 'career', title: '취업 성공을 위한 대학생활 팁', date: '2026.03.05', excerpt: '졸업 후 취업에 유리한 대학 생활 전략을 공유합니다.' },
  { key: 'exchange', title: '교환학생 경험담', date: '2026.02.18', excerpt: '미국 교환학생을 다녀온 선배의 생생한 경험담을 전합니다.' },
  { key: 'scholarship', title: '장학금 활용 가이드', date: '2026.02.01', excerpt: '다양한 장학금 종류와 신청 방법을 안내합니다.' },
  { key: 'startup', title: '학생 창업 지원 프로그램', date: '2026.01.15', excerpt: '학교에서 제공하는 창업 지원 프로그램을 소개합니다.' },
  { key: 'online', title: '효과적인 온라인 학습법', date: '2025.12.28', excerpt: '온라인 수업을 효과적으로 활용하는 학습 전략입니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-edublog-card-${post.key}`;

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
      src: `/images/placeholder-edublog-${post.key}.jpg`,
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
  heading('tpl-edublog-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '교육 뉴스', 1, '#123b63'),
  createTextNode({
    id: 'tpl-edublog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '교육 분야의 최신 소식과 유용한 정보를 전합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const educationBlogTemplate: PageTemplate = {
  id: 'education-blog',
  name: '교육 뉴스',
  category: 'education',
  subcategory: 'blog',
  description: '교육 뉴스 블로그 + 6개 글 카드',
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
