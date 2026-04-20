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
const TEAM_Y = HERO_H + 80;
const TEAM_H = 520;
const STAGE_H = TEAM_Y + TEAM_H + 80;

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

const vets = [
  { name: '김수의 원장', specialty: '내과 / 종양학', credentials: '서울대 수의학과 졸업, 미국 수의내과 전문의' },
  { name: '이진료 부원장', specialty: '외과 / 정형외과', credentials: '건국대 수의학과, 일본 정형외과 연수' },
  { name: '박동물 수의사', specialty: '치과 / 구강외과', credentials: '전북대 수의학과, 반려동물 치과 전문 자격' },
  { name: '최케어 수의사', specialty: '피부과 / 알레르기', credentials: '경상대 수의학과, 피부과 전문 수련 이수' },
];

const cardW = 260;
const gapX = 30;

const vetCards: BuilderCanvasNode[] = vets.flatMap((v, i) => {
  const x = 80 + i * (cardW + gapX);
  const prefix = `tpl-petteam-vet-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: TEAM_Y + 70, width: cardW, height: 280 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 212, height: 36 }, v.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-spec`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 212, height: 30 },
      text: v.specialty,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-cred`,
      parentId: prefix,
      rect: { x: 24, y: 106, width: 212, height: 120 },
      text: v.credentials,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-petteam-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petteam-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '의료진 소개', 1, '#ffffff', 'left', 'tpl-petteam-hero'),
  createTextNode({
    id: 'tpl-petteam-hero-sub',
    parentId: 'tpl-petteam-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '전문 수의사가 반려동물의 건강을 지킵니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-petteam-grid-title', { x: 80, y: TEAM_Y, width: 400, height: 50 }, '수의사 프로필', 2, '#123b63', 'left'),
  ...vetCards,
]);

export const petTeamTemplate: PageTemplate = {
  id: 'pet-team',
  name: '동물병원 의료진',
  category: 'pet',
  subcategory: 'team',
  description: '수의사 프로필(4개 카드) + 전문분야 + 자격',
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
