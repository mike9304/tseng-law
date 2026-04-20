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
  { key: 'japan-cherry', title: '일본 벚꽃 시즌 완벽 가이드', date: '2026.03.10', excerpt: '3월~4월 일본 벚꽃 명소와 최적의 방문 시기, 추천 코스를 안내합니다.' },
  { key: 'europe-budget', title: '유럽 여행 예산 절약 꿀팁 10가지', date: '2026.02.22', excerpt: '비행기, 숙소, 식비부터 현지 교통까지 유럽 여행 비용을 줄이는 실전 팁.' },
  { key: 'bali-hidden', title: '발리 숨은 명소 TOP 5', date: '2026.02.05', excerpt: '관광객이 몰리지 않는 발리의 숨겨진 보석 같은 장소들을 소개합니다.' },
  { key: 'packing', title: '여행 짐 싸기 미니멀 가이드', date: '2026.01.18', excerpt: '짐을 가볍게! 효율적인 짐 싸기 방법과 필수 아이템 체크리스트.' },
  { key: 'solo-travel', title: '혼자 여행하기 좋은 나라 7선', date: '2025.12.30', excerpt: '안전하고 즐거운 솔로 여행을 위한 추천 여행지와 주의사항을 정리했습니다.' },
  { key: 'insurance', title: '여행자 보험, 꼭 들어야 할까?', date: '2025.12.15', excerpt: '여행자 보험의 종류, 보장 범위, 선택 기준을 알기 쉽게 설명합니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-travelblog-card-${post.key}`;

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
      src: `/images/placeholder-travel-blog-${post.key}.jpg`,
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
    'tpl-travelblog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '여행 이야기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '여행 전 꼭 읽어야 할 유용한 정보와 생생한 여행기를 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const travelBlogTemplate: PageTemplate = {
  id: 'travel-blog',
  name: '여행 이야기',
  category: 'travel',
  subcategory: 'blog',
  description: '블로그 제목 + 6개 여행 글 카드(썸네일 + 제목 + 날짜 + 요약)',
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
