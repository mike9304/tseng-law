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
  { title: '강아지 예방접종 스케줄 가이드', date: '2026.04.12', desc: '연령별 필수 백신과 접종 시기를 한눈에 정리했습니다.' },
  { title: '고양이 구내염 예방과 치료', date: '2026.04.05', desc: '구내염의 원인, 증상, 치료법을 수의사가 상세히 설명합니다.' },
  { title: '반려동물 비만 관리법', date: '2026.03.28', desc: '적절한 식이 관리와 운동으로 건강한 체중을 유지하는 방법.' },
  { title: '여름철 반려동물 열사병 예방', date: '2026.03.20', desc: '무더위 속 반려동물을 지키는 필수 안전 수칙을 안내합니다.' },
  { title: '노령견 건강 관리 팁', date: '2026.03.15', desc: '시니어 반려견의 건강을 지키기 위한 정기 검진과 관리 요령.' },
  { title: '올바른 양치 습관 만들기', date: '2026.03.08', desc: '반려동물 치아 건강을 위한 올바른 양치 방법과 추천 제품.' },
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
  const prefix = `tpl-petblog-card-${i + 1}`;
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
    id: 'tpl-petblog-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petblog-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '반려동물 건강 블로그', 1, '#ffffff', 'left', 'tpl-petblog-hero'),
  createTextNode({
    id: 'tpl-petblog-hero-sub',
    parentId: 'tpl-petblog-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '수의사가 직접 작성하는 반려동물 건강 정보입니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-petblog-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '최신 글', 2, '#123b63', 'left'),
  ...cards,
]);

export const petBlogTemplate: PageTemplate = {
  id: 'pet-blog',
  name: '동물병원 블로그',
  category: 'pet',
  subcategory: 'blog',
  description: '반려동물 건강 팁 + 6개 아티클 카드',
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
