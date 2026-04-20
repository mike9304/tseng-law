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

const MARGIN = 80;
const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 380;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface BlogPost {
  key: string;
  title: string;
  date: string;
  excerpt: string;
}

const posts: BlogPost[] = [
  { key: 'beginner', title: '운동 초보자를 위한 시작 가이드', date: '2026.03.18', excerpt: '처음 헬스장을 방문하는 분들을 위한 기본 운동 루틴과 주의사항을 안내합니다.' },
  { key: 'muscle', title: '근육량 늘리기 위한 식단과 운동', date: '2026.03.01', excerpt: '벌크업을 목표로 하는 분들을 위한 영양 섭취 전략과 효과적인 트레이닝 방법.' },
  { key: 'stretch-guide', title: '부상 예방을 위한 스트레칭 가이드', date: '2026.02.15', excerpt: '운동 전후 반드시 해야 할 스트레칭 동작을 부위별로 정리했습니다.' },
  { key: 'cardio-myth', title: '유산소 운동에 대한 오해와 진실', date: '2026.01.28', excerpt: '유산소 운동만으로 살이 빠질까? 효과적인 유산소 운동 방법을 알려드립니다.' },
  { key: 'home-workout', title: '집에서도 할 수 있는 홈 트레이닝', date: '2026.01.10', excerpt: '장비 없이 집에서 할 수 있는 효과적인 맨몸 운동 루틴 5가지를 소개합니다.' },
  { key: 'recovery', title: '운동 후 회복을 위한 최적의 방법', date: '2025.12.20', excerpt: '수면, 영양, 스트레칭 등 운동 후 빠른 회복을 위한 과학적 방법을 소개합니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-fitblog-card-${post.key}`;

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
      src: `/images/placeholder-fitness-blog-${post.key}.jpg`,
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
      fontWeight: 'regular',
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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-fitblog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '피트니스 블로그',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fitblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '운동, 영양, 건강에 대한 유용한 정보를 전해 드립니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const fitnessBlogTemplate: PageTemplate = {
  id: 'fitness-blog',
  name: '피트니스 블로그',
  category: 'fitness',
  subcategory: 'blog',
  description: '블로그 제목 + 6개 글 카드(썸네일 + 제목 + 날짜 + 요약 + 더 보기)',
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
