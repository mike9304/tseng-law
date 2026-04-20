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

interface Attorney {
  key: string;
  name: string;
  title: string;
  bio: string;
}

const attorneys: Attorney[] = [
  {
    key: 'kim',
    name: '김민수 변호사',
    title: '대표 변호사 | 기업법 전문',
    bio: '서울대학교 법학과 졸업, 대만 국립정치대학 법학 석사. 15년간 한국-대만 간 기업 법률 자문 경험. 다수의 M&A 및 합작투자 사례를 성공적으로 수행.',
  },
  {
    key: 'lee',
    name: '이서연 변호사',
    title: '파트너 변호사 | 이민법 전문',
    bio: '고려대학교 법학과 졸업, 대만 변호사 자격 보유. 이민 비자, 거류증, 영주권 관련 풍부한 경험. 연간 200건 이상의 이민 상담 수행.',
  },
  {
    key: 'park',
    name: '박준형 변호사',
    title: '선임 변호사 | 부동산법 전문',
    bio: '연세대학교 법학과 졸업. 대만 부동산 매매, 임대차, 개발 관련 법률 자문 전문. 주요 부동산 개발 프로젝트 다수 참여.',
  },
  {
    key: 'choi',
    name: '최은지 변호사',
    title: '선임 변호사 | 가족법 전문',
    bio: '이화여자대학교 법학과 졸업. 국제 결혼, 이혼, 양육권, 상속 등 가족법 분야 전문. 다문화 가정 법률 자문 경험 다수.',
  },
];

function buildAttorneyCard(a: Attorney, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-atty-card-${a.key}`;

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
      src: `/images/placeholder-attorney-${a.key}.jpg`,
      alt: `${a.name} 프로필 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 216, width: 230, height: 32 }, a.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-title`,
      parentId: cid,
      rect: { x: 20, y: 254, width: 230, height: 28 },
      text: a.title,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${cid}-bio`,
      parentId: cid,
      rect: { x: 20, y: 292, width: 230, height: 110 },
      text: a.bio,
      fontSize: 13,
      color: '#374151',
      lineHeight: 1.55,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-atty-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '변호사 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-atty-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '각 분야 최고의 전문성을 갖춘 변호사진을 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...attorneys.flatMap((a, i) => buildAttorneyCard(a, i)),
]);

export const lawAttorneysTemplate: PageTemplate = {
  id: 'law-attorneys',
  name: '변호사 소개',
  category: 'law',
  subcategory: 'team',
  description: '팀 소개 제목 + 4명 변호사 카드(사진 + 이름 + 직함 + 약력)',
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
