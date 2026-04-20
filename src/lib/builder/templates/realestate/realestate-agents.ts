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

interface Agent {
  key: string;
  name: string;
  specialty: string;
  phone: string;
  desc: string;
}

const agents: Agent[] = [
  { key: 'agent-kim', name: '김OO 공인중개사', specialty: '강남/서초 아파트', phone: '010-1234-5678', desc: '15년 경력의 강남 지역 전문가. 투자 상담부터 실거주 매물까지.' },
  { key: 'agent-lee', name: '이OO 공인중개사', specialty: '상업용 부동산', phone: '010-2345-6789', desc: '오피스, 상가 등 상업용 부동산 전문. 수익형 투자 상담.' },
  { key: 'agent-park', name: '박OO 공인중개사', specialty: '신축/분양', phone: '010-3456-7890', desc: '신축 아파트, 오피스텔 분양 전문. 청약 상담 가능.' },
  { key: 'agent-choi', name: '최OO 공인중개사', specialty: '전월세 전문', phone: '010-4567-8901', desc: '전세, 월세 전문. 합리적인 가격의 매물을 찾아드립니다.' },
];

function buildAgentCard(agent: Agent, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-reagents-card-${agent.key}`;

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
      rect: { x: 0, y: 0, width: CARD_W, height: 200 },
      src: `/images/placeholder-${agent.key}.jpg`,
      alt: `${agent.name} 프로필`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 16, y: 212, width: 228, height: 36 }, agent.name, 3, '#123b63', 'center', cid),
    createTextNode({
      id: `${cid}-specialty`,
      parentId: cid,
      rect: { x: 16, y: 254, width: 228, height: 24 },
      text: agent.specialty,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 16, y: 286, width: 228, height: 60 },
      text: agent.desc,
      fontSize: 13,
      color: '#6b7280',
      lineHeight: 1.5,
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-phone`,
      parentId: cid,
      rect: { x: 16, y: 354, width: 228, height: 24 },
      text: agent.phone,
      fontSize: 14,
      color: '#123b63',
      fontWeight: 'medium',
      align: 'center',
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 60, y: 384, width: 140, height: 32 },
      label: '상담 요청',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const STAGE_H = HEADER_H + 40 + CARD_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-reagents-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '공인중개사 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-reagents-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '경험 풍부한 전문 공인중개사가 함께합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...agents.flatMap((a, i) => buildAgentCard(a, i)),
]);

export const realestateAgentsTemplate: PageTemplate = {
  id: 'realestate-agents',
  name: '공인중개사 소개',
  category: 'realestate',
  subcategory: 'agents',
  description: '중개사 프로필 카드(4개) + 전문분야 + 연락처',
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
