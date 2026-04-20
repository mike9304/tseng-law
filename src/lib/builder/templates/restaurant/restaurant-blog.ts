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
  { key: 'seasonal', title: '봄 제철 재료로 만드는 특별 메뉴', date: '2026.03.20', excerpt: '봄에만 맛볼 수 있는 제철 식재료를 활용한 셰프의 신메뉴를 소개합니다.' },
  { key: 'wine-pair', title: '와인 페어링의 기본 원칙', date: '2026.03.05', excerpt: '음식과 와인의 완벽한 궁합을 찾는 방법, 소믈리에가 알려드립니다.' },
  { key: 'steak-guide', title: '완벽한 스테이크 굽기 가이드', date: '2026.02.18', excerpt: '레어부터 웰던까지, 스테이크를 최상의 상태로 즐기는 방법을 안내합니다.' },
  { key: 'pasta-story', title: '수제 파스타 만들기의 비밀', date: '2026.02.01', excerpt: '매일 직접 만드는 수제 파스타의 제조 과정과 셰프의 노하우를 공개합니다.' },
  { key: 'dessert-art', title: '디저트 플레이팅의 예술', date: '2026.01.15', excerpt: '맛과 비주얼을 모두 잡은 디저트 플레이팅 기법을 소개합니다.' },
  { key: 'table-manner', title: '파인 다이닝 테이블 매너', date: '2025.12.28', excerpt: '특별한 날 레스토랑 방문 시 알아두면 좋은 기본 테이블 매너입니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-restblog-card-${post.key}`;

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
      src: `/images/placeholder-restblog-${post.key}.jpg`,
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

const ROWS = Math.ceil(posts.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restblog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '푸드 블로그',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '맛있는 이야기와 셰프의 요리 팁을 공유합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const restaurantBlogTemplate: PageTemplate = {
  id: 'restaurant-blog',
  name: '레스토랑 블로그',
  category: 'restaurant',
  subcategory: 'blog',
  description: '푸드 블로그 + 6개 글 카드(썸네일 + 제목 + 날짜 + 요약)',
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
