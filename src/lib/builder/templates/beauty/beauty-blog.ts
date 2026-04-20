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
  { key: 'hair-trend', title: '2026 봄 헤어 트렌드 총정리', date: '2026.03.20', excerpt: '올 봄 유행할 헤어 스타일과 컬러를 미리 확인하세요. 레이어드 컷부터 파스텔 컬러까지 트렌드를 소개합니다.' },
  { key: 'skin-routine', title: '피부 타입별 데일리 스킨케어 루틴', date: '2026.03.05', excerpt: '건성, 지성, 복합성 피부 타입에 맞는 아침/저녁 스킨케어 루틴을 단계별로 안내합니다.' },
  { key: 'nail-care', title: '네일 건강을 지키는 관리법', date: '2026.02.18', excerpt: '젤 네일 후 손톱이 약해졌다면? 네일 건강을 회복하고 유지하는 홈 케어 팁을 소개합니다.' },
  { key: 'hair-damage', title: '손상 모발 복구를 위한 홈 케어', date: '2026.02.01', excerpt: '잦은 시술로 손상된 모발을 집에서 관리하는 방법과 추천 제품을 알려드립니다.' },
  { key: 'makeup-base', title: '지속력 높은 베이스 메이크업 팁', date: '2026.01.15', excerpt: '하루 종일 무너지지 않는 베이스 메이크업 비법을 메이크업 아티스트가 전수합니다.' },
  { key: 'scalp-care', title: '건강한 두피를 위한 관리 가이드', date: '2025.12.28', excerpt: '탈모 예방과 건강한 모발 성장을 위한 두피 관리 방법과 전문가 조언을 공유합니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-beautyblog-card-${post.key}`;

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
      src: `/images/placeholder-beauty-blog-${post.key}.jpg`,
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
    'tpl-beautyblog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '뷰티 팁 블로그',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautyblog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '전문가가 알려주는 뷰티 꿀팁과 트렌드 소식을 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const beautyBlogTemplate: PageTemplate = {
  id: 'beauty-blog',
  name: '뷰티 팁 블로그',
  category: 'beauty',
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
