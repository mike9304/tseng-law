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
  { title: '디지털 전환 성공 전략 5가지', date: '2026.04.10', desc: 'AI와 클라우드를 활용한 기업 디지털 전환의 핵심 성공 요인을 분석합니다.' },
  { title: 'ESG 경영, 어떻게 시작할까?', date: '2026.04.05', desc: '환경, 사회, 지배구조 관점에서 ESG 경영 도입 방법을 안내합니다.' },
  { title: '글로벌 공급망 리스크 관리', date: '2026.03.28', desc: '불확실한 글로벌 환경에서 공급망 리스크를 최소화하는 전략입니다.' },
  { title: '스타트업 성장 단계별 전략', date: '2026.03.20', desc: '시드부터 시리즈 C까지 각 성장 단계에 필요한 전략을 소개합니다.' },
  { title: '조직 문화 혁신 가이드', date: '2026.03.15', desc: '성과를 만드는 조직 문화를 구축하는 실전 가이드입니다.' },
  { title: 'M&A 성공을 위한 체크리스트', date: '2026.03.08', desc: '인수합병 과정에서 놓치기 쉬운 핵심 체크포인트를 정리했습니다.' },
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
  const prefix = `tpl-consblog-card-${i + 1}`;
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
    id: 'tpl-consblog-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-consblog-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '인사이트', 1, '#ffffff', 'left', 'tpl-consblog-hero'),
  createTextNode({
    id: 'tpl-consblog-hero-sub',
    parentId: 'tpl-consblog-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '산업 동향과 전문가 인사이트를 공유합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-consblog-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '최신 글', 2, '#123b63', 'left'),
  ...cards,
]);

export const consultingBlogTemplate: PageTemplate = {
  id: 'consulting-blog',
  name: '컨설팅 블로그',
  category: 'consulting',
  subcategory: 'blog',
  description: '산업 인사이트 + 6개 아티클 카드',
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
