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
  { key: 'blood-pressure', title: '고혈압 관리를 위한 생활 습관', date: '2026.03.20', excerpt: '고혈압 예방과 관리를 위해 일상에서 실천할 수 있는 건강 습관을 소개합니다.' },
  { key: 'spring-allergy', title: '봄철 알레르기 예방법', date: '2026.03.05', excerpt: '봄철 꽃가루 알레르기 증상과 효과적인 예방 및 대처 방법을 안내합니다.' },
  { key: 'exercise', title: '올바른 운동법과 부상 예방', date: '2026.02.18', excerpt: '운동 시 흔히 발생하는 부상과 이를 예방하기 위한 올바른 운동 방법입니다.' },
  { key: 'sleep', title: '수면의 질을 높이는 방법', date: '2026.02.01', excerpt: '불면증과 수면 장애를 극복하고 건강한 수면 습관을 만드는 팁을 공유합니다.' },
  { key: 'nutrition', title: '균형 잡힌 식단의 중요성', date: '2026.01.15', excerpt: '영양소별 권장 섭취량과 건강한 식단 구성 방법을 소개합니다.' },
  { key: 'mental', title: '직장인 스트레스 관리법', date: '2025.12.28', excerpt: '업무 스트레스로 인한 건강 문제와 효과적인 스트레스 해소 방법입니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-healthblog-card-${post.key}`;

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
      src: `/images/placeholder-healthblog-${post.key}.jpg`,
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
  heading(
    'tpl-healthblog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '건강 블로그',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '건강한 생활을 위한 유용한 정보와 팁을 제공합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const healthBlogTemplate: PageTemplate = {
  id: 'health-blog',
  name: '건강 블로그',
  category: 'health',
  subcategory: 'blog',
  description: '건강 팁 블로그 + 6개 글 카드(썸네일 + 제목 + 날짜 + 요약)',
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
