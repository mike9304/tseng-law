import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
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
const CARD_W = 260;
const CARD_H = 420;
const GAP = 24;

interface TeamMember {
  key: string;
  name: string;
  role: string;
  funFact: string;
}

const members: TeamMember[] = [
  { key: 'member-kim', name: '김OO', role: '크리에이티브 디렉터', funFact: '취미는 도예. 매일 아침 핸드드립 커피로 시작합니다.' },
  { key: 'member-lee', name: '이OO', role: 'UX/UI 디자이너', funFact: '보드게임 마니아. 주말마다 새로운 카페를 탐방합니다.' },
  { key: 'member-park', name: '박OO', role: '영상 프로듀서', funFact: '여행 유튜버 경력 보유. 30개국 이상 방문했습니다.' },
  { key: 'member-choi', name: '최OO', role: '프론트엔드 개발자', funFact: '인디 게임 개발이 취미. 고양이 두 마리를 키웁니다.' },
];

function buildMemberCard(member: TeamMember, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-creativeteam-card-${member.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: HEADER_H + 40, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-photo`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 220 },
      src: `/images/placeholder-team-${member.key}.jpg`,
      alt: `${member.name} 프로필`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 232, width: 220, height: 36 }, member.name, 3, '#123b63', 'center', cid),
    createTextNode({
      id: `${cid}-role`,
      parentId: cid,
      rect: { x: 20, y: 274, width: 220, height: 24 },
      text: member.role,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-funfact`,
      parentId: cid,
      rect: { x: 20, y: 310, width: 220, height: 80 },
      text: member.funFact,
      fontSize: 13,
      color: '#6b7280',
      lineHeight: 1.6,
      align: 'center',
    }),
  ];
}

const STAGE_H = HEADER_H + 40 + CARD_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativeteam-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '팀 소개', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativeteam-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '열정과 창의력으로 가득한 우리 팀을 만나보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...members.flatMap((m, i) => buildMemberCard(m, i)),
]);

export const creativeTeamTemplate: PageTemplate = {
  id: 'creative-team',
  name: '팀 소개',
  category: 'creative',
  subcategory: 'team',
  description: '팀 멤버 카드(4개) + 역할 + 재미있는 사실',
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
