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

interface Teacher {
  key: string;
  name: string;
  dept: string;
  qualifications: string;
}

const teachers: Teacher[] = [
  { key: 'prof-kim', name: '김OO 교수', dept: '컴퓨터공학', qualifications: 'MIT 박사\nAI 연구 논문 50편\n경력 18년' },
  { key: 'prof-lee', name: '이OO 교수', dept: '경영학', qualifications: '하버드 MBA\n기업 컨설팅 10년\n경력 15년' },
  { key: 'prof-park', name: '박OO 교수', dept: '디자인', qualifications: 'RISD 석사\n레드닷 디자인 수상\n경력 12년' },
  { key: 'prof-choi', name: '최OO 교수', dept: '국제어학', qualifications: '옥스퍼드 박사\nTOEFL 교재 저자\n경력 20년' },
];

function buildTeacherCard(teacher: Teacher, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-eduteacher-card-${teacher.key}`;

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
      src: `/images/placeholder-teacher-${teacher.key}.jpg`,
      alt: `${teacher.name} 프로필`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 212, width: 220, height: 36 }, teacher.name, 3, '#123b63', 'center', cid),
    createTextNode({
      id: `${cid}-dept`,
      parentId: cid,
      rect: { x: 20, y: 254, width: 220, height: 24 },
      text: teacher.dept,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-qual`,
      parentId: cid,
      rect: { x: 20, y: 290, width: 220, height: 90 },
      text: teacher.qualifications,
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
    'tpl-eduteacher-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '교수진 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-eduteacher-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '각 분야 최고의 전문가가 여러분의 교육을 이끕니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...teachers.flatMap((t, i) => buildTeacherCard(t, i)),
]);

export const educationTeachersTemplate: PageTemplate = {
  id: 'education-teachers',
  name: '교수진 소개',
  category: 'education',
  subcategory: 'teachers',
  description: '교수 프로필 카드(4개) + 자격사항',
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
