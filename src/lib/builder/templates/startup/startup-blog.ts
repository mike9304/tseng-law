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
  { title: 'AI 기반 워크플로우 자동화의 미래', date: '2026.04.12', desc: 'AI가 비즈니스 자동화를 어떻게 변화시키고 있는지 분석합니다.' },
  { title: 'SaaS 메트릭 가이드: ARR, MRR, Churn', date: '2026.04.05', desc: 'SaaS 비즈니스에서 반드시 추적해야 할 핵심 지표를 설명합니다.' },
  { title: '프로덕트 마켓 핏 찾는 법', date: '2026.03.28', desc: '초기 스타트업이 PMF를 찾기 위한 실전 프레임워크를 공유합니다.' },
  { title: '원격 근무 팀 생산성 높이기', date: '2026.03.20', desc: '분산 팀의 효율적인 협업을 위한 도구와 프로세스를 소개합니다.' },
  { title: '보안을 고려한 API 설계', date: '2026.03.15', desc: '안전한 API를 설계하기 위한 인증, 권한, 암호화 베스트 프랙티스.' },
  { title: '고객 성공 팀 구축 가이드', date: '2026.03.08', desc: 'CS 팀을 구축하고 NPS를 높이는 전략과 사례를 다룹니다.' },
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
  const prefix = `tpl-stupblog-card-${i + 1}`;
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
    id: 'tpl-stupblog-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupblog-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '블로그', 1, '#ffffff', 'left', 'tpl-stupblog-hero'),
  createTextNode({
    id: 'tpl-stupblog-hero-sub',
    parentId: 'tpl-stupblog-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '기술, 프로덕트, 비즈니스 인사이트를 공유합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stupblog-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '최신 글', 2, '#123b63', 'left'),
  ...cards,
]);

export const startupBlogTemplate: PageTemplate = {
  id: 'startup-blog',
  name: '스타트업 블로그',
  category: 'startup',
  subcategory: 'blog',
  description: '테크 블로그 + 6개 아티클 카드',
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
