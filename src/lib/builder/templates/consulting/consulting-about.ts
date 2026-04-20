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
const HISTORY_Y = HERO_H + 80;
const HISTORY_H = 300;
const LEADERS_Y = HISTORY_Y + HISTORY_H + 80;
const LEADERS_H = 360;
const VALUES_Y = LEADERS_Y + LEADERS_H + 80;
const VALUES_H = 280;
const STAGE_H = VALUES_Y + VALUES_H + 80;

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

const leaders = [
  { name: '김대표', role: '대표이사 / 전략 전문가', bio: '20년 경영 컨설팅 경력, 대기업 성장 전략 다수 수행' },
  { name: '이상무', role: '운영 부문 대표', bio: '글로벌 SCM 전문가, 제조업 혁신 프로젝트 리더' },
  { name: '박이사', role: '재무 부문 대표', bio: 'CPA/CFA 보유, 기업 구조조정 및 M&A 전문' },
  { name: '최이사', role: 'IT 부문 대표', bio: '디지털 전환 전문가, AI 기반 비즈니스 솔루션 설계' },
];

const leaderCards: BuilderCanvasNode[] = leaders.flatMap((l, i) => {
  const x = 80 + i * 290;
  const prefix = `tpl-consabt-leader-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: LEADERS_Y + 70, width: 260, height: 240 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 212, height: 36 }, l.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-role`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 212, height: 30 },
      text: l.role,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `${prefix}-bio`,
      parentId: prefix,
      rect: { x: 24, y: 106, width: 212, height: 80 },
      text: l.bio,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-consabt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-consabt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '회사 소개', 1, '#ffffff', 'left', 'tpl-consabt-hero'),
  createTextNode({
    id: 'tpl-consabt-hero-sub',
    parentId: 'tpl-consabt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '2005년 설립 이래 대한민국 대표 경영 컨설팅 펌으로 성장해왔습니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Firm history ───────────────────────────────────────── */
  heading('tpl-consabt-hist-title', { x: 80, y: HISTORY_Y, width: 400, height: 50 }, '회사 연혁', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-consabt-hist-desc',
    rect: { x: 80, y: HISTORY_Y + 60, width: 800, height: 180 },
    text: '2005년 서울에서 출발한 저희 컨설팅은 국내외 500개 이상의 프로젝트를 성공적으로 수행했습니다. Fortune 500대 기업부터 유망 스타트업까지 다양한 산업 분야에서 신뢰받는 파트너로 자리 잡았습니다. 2015년 아시아 지역 확장을 시작으로 현재 5개국에 오피스를 운영하고 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Leadership team ────────────────────────────────────── */
  heading('tpl-consabt-leader-title', { x: 80, y: LEADERS_Y, width: 400, height: 50 }, '리더십 팀', 2, '#123b63', 'left'),
  ...leaderCards,

  /* ── Values ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-consabt-values',
    rect: { x: 0, y: VALUES_Y, width: W, height: VALUES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-consabt-values-title', { x: 80, y: 40, width: 400, height: 50 }, '핵심 가치', 2, '#123b63', 'left', 'tpl-consabt-values'),
  createTextNode({
    id: 'tpl-consabt-values-1',
    parentId: 'tpl-consabt-values',
    rect: { x: 80, y: 100, width: 300, height: 40 },
    text: '고객 중심 — 고객의 성공이 곧 우리의 성공입니다.',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createTextNode({
    id: 'tpl-consabt-values-2',
    parentId: 'tpl-consabt-values',
    rect: { x: 80, y: 150, width: 300, height: 40 },
    text: '데이터 기반 — 직관이 아닌 데이터로 의사결정합니다.',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createTextNode({
    id: 'tpl-consabt-values-3',
    parentId: 'tpl-consabt-values',
    rect: { x: 80, y: 200, width: 300, height: 40 },
    text: '혁신 추구 — 끊임없이 새로운 방법론을 탐구합니다.',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
]);

export const consultingAboutTemplate: PageTemplate = {
  id: 'consulting-about',
  name: '컨설팅 소개',
  category: 'consulting',
  subcategory: 'about',
  description: '회사 연혁 + 리더십 팀(4명) + 핵심 가치',
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
