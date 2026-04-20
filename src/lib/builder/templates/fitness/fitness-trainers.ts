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

interface Trainer {
  key: string;
  name: string;
  title: string;
  certs: string;
  bio: string;
}

const trainers: Trainer[] = [
  {
    key: 'cho',
    name: '조현우 트레이너',
    title: '헤드 트레이너 | 근력/체형 교정',
    certs: 'NSCA-CPT, NASM-CES',
    bio: '10년 경력의 퍼스널 트레이너. 체형 분석 기반 맞춤 프로그램으로 안전하고 효과적인 운동을 지도합니다.',
  },
  {
    key: 'jung',
    name: '정수빈 트레이너',
    title: '요가/필라테스 전문',
    certs: 'RYT-500, STOTT Pilates',
    bio: '인도 요가 센터 수련 출신. 호흡과 명상을 통한 전인적 건강 관리를 지향합니다.',
  },
  {
    key: 'kang',
    name: '강민재 트레이너',
    title: 'HIIT/크로스핏 전문',
    certs: 'CrossFit L2, ACE-CPT',
    bio: '전 국가대표 체력 트레이너 출신. 과학적 트레이닝 방법으로 퍼포먼스를 극대화합니다.',
  },
  {
    key: 'shin',
    name: '신예린 트레이너',
    title: '댄스/유산소 전문',
    certs: 'AFAA GFI, Zumba Instructor',
    bio: '댄스 전공 출신으로 즐겁고 에너지 넘치는 그룹 수업을 진행합니다.',
  },
];

function buildTrainerCard(t: Trainer, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-fittrainer-card-${t.key}`;

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
      src: `/images/placeholder-trainer-${t.key}.jpg`,
      alt: `${t.name} 프로필 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 216, width: 230, height: 32 }, t.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-title`,
      parentId: cid,
      rect: { x: 20, y: 254, width: 230, height: 28 },
      text: t.title,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${cid}-certs`,
      parentId: cid,
      rect: { x: 20, y: 288, width: 230, height: 22 },
      text: t.certs,
      fontSize: 12,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-bio`,
      parentId: cid,
      rect: { x: 20, y: 318, width: 230, height: 84 },
      text: t.bio,
      fontSize: 13,
      color: '#374151',
      lineHeight: 1.55,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-fittrainer-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '트레이너 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fittrainer-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '국제 공인 자격을 갖춘 전문 트레이너팀을 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...trainers.flatMap((t, i) => buildTrainerCard(t, i)),
]);

export const fitnessTrainersTemplate: PageTemplate = {
  id: 'fitness-trainers',
  name: '트레이너 소개',
  category: 'fitness',
  subcategory: 'team',
  description: '트레이너 제목 + 4명 트레이너 카드(사진 + 이름 + 전문분야 + 자격 + 약력)',
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
