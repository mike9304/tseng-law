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
const STORY_Y = HERO_H + 80;
const STORY_H = 280;
const TEAM_Y = STORY_Y + STORY_H + 80;
const TEAM_H = 360;
const INVESTORS_Y = TEAM_Y + TEAM_H + 80;
const INVESTORS_H = 200;
const STAGE_H = INVESTORS_Y + INVESTORS_H + 80;

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

const team = [
  { name: '김창업 CEO', role: '창업자 & 대표이사', bio: '전 네이버 PM, KAIST 컴퓨터공학 석사' },
  { name: '이기술 CTO', role: '최고기술책임자', bio: '전 구글 엔지니어, 분산시스템 전문가' },
  { name: '박디자인 CDO', role: '최고디자인책임자', bio: '전 삼성 UX 리드, RISD 졸업' },
  { name: '최마케팅 CMO', role: '최고마케팅책임자', bio: '전 카카오 마케팅 총괄, 10년 B2B 경력' },
];

const teamCards: BuilderCanvasNode[] = team.flatMap((m, i) => {
  const x = 80 + i * 290;
  const prefix = `tpl-stupabt-team-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: TEAM_Y + 70, width: 260, height: 240 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 212, height: 36 }, m.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-role`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 212, height: 30 },
      text: m.role,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-bio`,
      parentId: prefix,
      rect: { x: 24, y: 106, width: 212, height: 80 },
      text: m.bio,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupabt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupabt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '회사 소개', 1, '#ffffff', 'left', 'tpl-stupabt-hero'),
  createTextNode({
    id: 'tpl-stupabt-hero-sub',
    parentId: 'tpl-stupabt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '더 나은 비즈니스 도구를 만들기 위해 모인 팀입니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Founding story ─────────────────────────────────────── */
  heading('tpl-stupabt-story-title', { x: 80, y: STORY_Y, width: 400, height: 50 }, '창업 스토리', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-stupabt-story-desc',
    rect: { x: 80, y: STORY_Y + 60, width: 800, height: 160 },
    text: '2022년 "왜 아직도 이렇게 비효율적으로 일해야 할까?"라는 질문에서 시작했습니다. 반복적인 업무에 시간을 낭비하는 팀들을 위해, 누구나 쉽게 사용할 수 있는 올인원 업무 자동화 플랫폼을 만들었습니다. Series B 투자 유치 후 현재 글로벌 확장을 준비하고 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Team ────────────────────────────────────────────────── */
  heading('tpl-stupabt-team-title', { x: 80, y: TEAM_Y, width: 400, height: 50 }, '팀', 2, '#123b63', 'left'),
  ...teamCards,

  /* ── Investors & Mission ────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupabt-investors',
    rect: { x: 0, y: INVESTORS_Y, width: W, height: INVESTORS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupabt-inv-title', { x: 80, y: 40, width: 400, height: 50 }, '투자자 & 미션', 2, '#123b63', 'left', 'tpl-stupabt-investors'),
  createTextNode({
    id: 'tpl-stupabt-inv-desc',
    parentId: 'tpl-stupabt-investors',
    rect: { x: 80, y: 100, width: 800, height: 60 },
    text: 'Sequoia, SoftBank Ventures, 알토스벤처스 등 글로벌 투자사의 지원을 받고 있습니다. 우리의 미션: 모든 팀이 더 스마트하게 일하는 세상을 만듭니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
]);

export const startupAboutTemplate: PageTemplate = {
  id: 'startup-about',
  name: '스타트업 소개',
  category: 'startup',
  subcategory: 'about',
  description: '창업 스토리 + 팀 + 투자자 + 미션',
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
