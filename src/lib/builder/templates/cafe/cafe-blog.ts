import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 700;
const STAGE_H = GRID_Y + GRID_H + 80;

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

const articles = [
  { title: '완벽한 에스프레소 추출법', date: '2026.04.12', desc: '바리스타가 알려주는 에스프레소 추출의 핵심 변수와 최적 세팅 가이드.' },
  { title: '콜드브루 vs 아이스 아메리카노', date: '2026.04.08', desc: '두 음료의 차이점과 각각의 매력을 비교 분석합니다.' },
  { title: '커피와 잘 어울리는 디저트', date: '2026.03.30', desc: '커피 종류별로 완벽한 페어링을 이루는 디저트를 소개합니다.' },
  { title: '홈 카페 시작하기', date: '2026.03.22', desc: '집에서도 카페 수준의 커피를 즐기기 위한 장비와 팁.' },
  { title: '커피 원두 보관법', date: '2026.03.15', desc: '원두의 신선함을 오래 유지하는 올바른 보관 방법을 알려드립니다.' },
  { title: '카페인과 건강', date: '2026.03.08', desc: '적정 카페인 섭취량과 건강에 미치는 영향을 과학적으로 살펴봅니다.' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = articles.flatMap((a, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-cafeblog-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    createTextNode({
      id: `${prefix}-date`,
      parentId: prefix,
      rect: { x: 24, y: 24, width: 150, height: 24 },
      text: a.date,
      fontSize: 13,
      color: '#6b7280',
      lineHeight: 1.3,
    }),
    heading(`${prefix}-t`, { x: 24, y: 52, width: 312, height: 36 }, a.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 100, width: 312, height: 80 },
      text: a.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafeblog-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafeblog-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '커피 블로그', 1, '#ffffff', 'left', 'tpl-cafeblog-hero'),
  createTextNode({
    id: 'tpl-cafeblog-hero-sub',
    parentId: 'tpl-cafeblog-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '커피 문화와 라이프스타일 이야기를 나눕니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-cafeblog-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '최신 글', 2, '#123b63', 'left'),
  ...cards,
]);

export const cafeBlogTemplate: PageTemplate = {
  id: 'cafe-blog',
  name: '카페 블로그',
  category: 'cafe',
  subcategory: 'blog',
  description: '커피 문화 블로그 + 6개 아티클 카드',
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
