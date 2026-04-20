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
  { key: 'visa-guide', title: '대만 취업 비자 신청 완벽 가이드', date: '2026.03.15', excerpt: '대만에서 취업하려면 어떤 비자가 필요할까요? 취업 비자 신청 절차, 필요 서류, 소요 기간 등을 상세히 안내합니다.' },
  { key: 'company', title: '대만에서 법인 설립하기: 단계별 안내', date: '2026.02.28', excerpt: '대만에서 사업을 시작하려는 한국 기업인을 위한 법인 설립 절차, 자본금 요건, 세금 구조에 대해 설명합니다.' },
  { key: 'realestate', title: '외국인의 대만 부동산 구매 시 유의사항', date: '2026.02.10', excerpt: '외국인이 대만에서 부동산을 구매할 때 알아야 할 법적 제한, 세금, 계약 체결 시 주의사항을 정리했습니다.' },
  { key: 'inheritance', title: '대만 상속법의 주요 내용과 절차', date: '2026.01.20', excerpt: '대만에서의 상속 절차, 법정 상속분, 유언장 작성법 등 상속에 관한 핵심 내용을 설명합니다.' },
  { key: 'labor-rights', title: '대만 근로자 권리 보호: 알아야 할 것들', date: '2025.12.15', excerpt: '대만 노동법상 근로자의 주요 권리, 부당해고 시 대처 방법, 산업재해 보상 절차 등을 안내합니다.' },
  { key: 'divorce', title: '국제 이혼 절차와 양육권 문제', date: '2025.11.30', excerpt: '한국-대만 간 국제 이혼 시 관할권 문제, 양육권 결정 기준, 재산 분할 방법에 대해 설명합니다.' },
];

function buildBlogCard(post: BlogPost, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-blog-card-${post.key}`;

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
      src: `/images/placeholder-blog-${post.key}.jpg`,
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
    'tpl-blog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '법률 블로그',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-blog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '대만 법률에 대한 유용한 정보와 최신 소식을 전해 드립니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...posts.flatMap((p, i) => buildBlogCard(p, i)),
]);

export const lawBlogListTemplate: PageTemplate = {
  id: 'law-blog-list',
  name: '블로그 목록',
  category: 'law',
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
