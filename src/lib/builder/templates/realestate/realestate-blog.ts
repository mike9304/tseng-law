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
  { key: 'market-q1', title: '2026년 1분기 부동산 시장 전망', date: '2026.03.20', excerpt: '올해 1분기 서울 부동산 시장의 동향과 향후 전망을 분석합니다.' },
  { key: 'tax-guide', title: '부동산 세금 완벽 가이드', date: '2026.03.05', excerpt: '취득세, 양도소득세, 종합부동산세 등 부동산 관련 세금을 정리했습니다.' },
  { key: 'first-home', title: '생애 첫 주택 구매 팁', date: '2026.02.18', excerpt: '처음 집을 사는 분들이 알아야 할 핵심 사항을 정리했습니다.' },
  { key: 'invest', title: '수익형 부동산 투자 전략', date: '2026.02.01', excerpt: '오피스텔, 상가 등 수익형 부동산 투자 시 고려해야 할 점을 안내합니다.' },
  { key: 'renovation', title: '리모델링으로 집값 올리기', date: '2026.01.15', excerpt: '비용 대비 효과가 높은 리모델링 포인트를 소개합니다.' },
  { key: 'trend', title: '2026 인테리어 트렌드', date: '2025.12.28', excerpt: '올해 주목할 인테리어 트렌드와 공간 활용법을 소개합니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-reblog-card-${post.key}`;

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
      src: `/images/placeholder-reblog-${post.key}.jpg`,
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
    'tpl-reblog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '부동산 블로그',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-reblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '부동산 시장 소식과 유용한 정보를 전합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const realestateBlogTemplate: PageTemplate = {
  id: 'realestate-blog',
  name: '부동산 블로그',
  category: 'realestate',
  subcategory: 'blog',
  description: '시장 소식 블로그 + 6개 글 카드',
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
