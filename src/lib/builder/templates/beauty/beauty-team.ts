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
const CARD_W = 270;
const CARD_H = 420;
const GAP = 24;
const MARGIN = 80;
const CARDS_Y = HEADER_H + 40;
const STAGE_H = CARDS_Y + CARD_H + 80;

interface Stylist {
  key: string;
  name: string;
  title: string;
  specialties: string;
  bio: string;
}

const stylists: Stylist[] = [
  {
    key: 'yoon',
    name: '윤지현 원장',
    title: '대표 원장 | 헤어 디자인',
    specialties: '커트, 염색, 펌',
    bio: '15년 경력의 헤어 디자이너. 서울 뷰티 어워드 수상. 자연스러우면서도 트렌디한 스타일을 추구합니다.',
  },
  {
    key: 'kim',
    name: '김소영 실장',
    title: '수석 디자이너 | 컬러 전문',
    specialties: '염색, 탈색, 옴브레',
    bio: '컬러 전문 디자이너 10년 경력. 아시아 헤어 디자인 대회 입상. 개인 피부톤에 맞는 컬러를 제안합니다.',
  },
  {
    key: 'lee',
    name: '이수진 디자이너',
    title: '네일 아티스트',
    specialties: '젤 네일, 아트, 케어',
    bio: '섬세한 손길로 트렌디한 네일 아트를 완성합니다. 일본 네일 자격증 보유.',
  },
  {
    key: 'park',
    name: '박하나 디자이너',
    title: '피부 관리 전문',
    specialties: '페이셜, 필링, 리프팅',
    bio: '피부미용사 국가자격증 보유. 개인별 피부 타입 분석 후 맞춤 관리를 제공합니다.',
  },
];

function buildStylistCard(s: Stylist, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-beautyteam-card-${s.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: CARDS_Y, width: CARD_W, height: CARD_H },
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
      src: `/images/placeholder-stylist-${s.key}.jpg`,
      alt: `${s.name} 프로필 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 216, width: 230, height: 32 }, s.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-title`,
      parentId: cid,
      rect: { x: 20, y: 254, width: 230, height: 28 },
      text: s.title,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${cid}-specialties`,
      parentId: cid,
      rect: { x: 20, y: 288, width: 230, height: 22 },
      text: `전문: ${s.specialties}`,
      fontSize: 12,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-bio`,
      parentId: cid,
      rect: { x: 20, y: 318, width: 230, height: 84 },
      text: s.bio,
      fontSize: 13,
      color: '#374151',
      lineHeight: 1.55,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-beautyteam-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '스타일리스트 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautyteam-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '각 분야 최고의 전문가들이 당신의 아름다움을 책임집니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...stylists.flatMap((s, i) => buildStylistCard(s, i)),
]);

export const beautyTeamTemplate: PageTemplate = {
  id: 'beauty-team',
  name: '스타일리스트 소개',
  category: 'beauty',
  subcategory: 'team',
  description: '팀 소개 제목 + 4명 스타일리스트 카드(사진 + 이름 + 전문분야 + 약력)',
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
