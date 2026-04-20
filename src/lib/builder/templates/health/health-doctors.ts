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
const CARD_H = 400;
const GAP = 24;

interface Doctor {
  key: string;
  name: string;
  specialty: string;
  credentials: string;
}

const doctors: Doctor[] = [
  { key: 'dr-kim', name: '김OO 원장', specialty: '내과 전문의', credentials: '서울대학교 의과대학 졸업\n내과 전문의 자격\n경력 20년' },
  { key: 'dr-lee', name: '이OO 과장', specialty: '정형외과 전문의', credentials: '연세대학교 의과대학 졸업\n정형외과 전문의\n경력 15년' },
  { key: 'dr-park', name: '박OO 과장', specialty: '피부과 전문의', credentials: '고려대학교 의과대학 졸업\n피부과 전문의\n경력 12년' },
  { key: 'dr-choi', name: '최OO 과장', specialty: '치과 전문의', credentials: '서울대학교 치과대학 졸업\n치과 전문의\n경력 10년' },
];

function buildDoctorCard(doc: Doctor, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-healthdoc-card-${doc.key}`;

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
      src: `/images/placeholder-doctor-${doc.key}.jpg`,
      alt: `${doc.name} 프로필 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 212, width: 220, height: 36 }, doc.name, 3, '#123b63', 'center', cid),
    createTextNode({
      id: `${cid}-specialty`,
      parentId: cid,
      rect: { x: 20, y: 254, width: 220, height: 24 },
      text: doc.specialty,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-cred`,
      parentId: cid,
      rect: { x: 20, y: 290, width: 220, height: 90 },
      text: doc.credentials,
      fontSize: 13,
      color: '#6b7280',
      lineHeight: 1.6,
      align: 'center',
    }),
  ];
}

const STAGE_H = HEADER_H + 40 + CARD_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthdoc-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '의료진 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthdoc-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '풍부한 경험과 전문성을 갖춘 의료진을 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...doctors.flatMap((d, i) => buildDoctorCard(d, i)),
]);

export const healthDoctorsTemplate: PageTemplate = {
  id: 'health-doctors',
  name: '의료진 소개',
  category: 'health',
  subcategory: 'doctors',
  description: '의사 프로필 카드(4개) + 전문분야 + 자격사항',
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
