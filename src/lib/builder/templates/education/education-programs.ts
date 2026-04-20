import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
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
const CARD_W = 350;
const CARD_H = 300;
const GAP = 24;
const COLS = 3;

interface Program {
  key: string;
  title: string;
  duration: string;
  price: string;
  desc: string;
}

const programs: Program[] = [
  { key: 'cs', title: '컴퓨터공학과', duration: '4년', price: '학기당 450만원', desc: 'AI, 클라우드, 보안 등 최신 IT 기술을 배우는 실무 중심 과정입니다.' },
  { key: 'biz', title: '경영학과', duration: '4년', price: '학기당 400만원', desc: '마케팅, 재무, 인사 등 경영 전반의 이론과 실무를 학습합니다.' },
  { key: 'design', title: '디자인학과', duration: '4년', price: '학기당 480만원', desc: 'UX/UI, 그래픽, 산업 디자인 분야의 전문 역량을 갖춥니다.' },
  { key: 'language', title: '국제어학과', duration: '2년', price: '학기당 350만원', desc: '영어, 중국어, 일본어 집중 과정으로 글로벌 역량을 강화합니다.' },
  { key: 'cooking', title: '조리학과', duration: '2년', price: '학기당 500만원', desc: '한식, 양식, 제과제빵 등 전문 셰프 양성 과정입니다.' },
  { key: 'nursing', title: '간호학과', duration: '4년', price: '학기당 420만원', desc: '간호사 국가시험 대비 이론과 임상 실습을 병행하는 과정입니다.' },
];

function buildProgramCard(prog: Program, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-eduprog-card-${prog.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    heading(`${cid}-title`, { x: 24, y: 20, width: 300, height: 36 }, prog.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-duration`,
      parentId: cid,
      rect: { x: 24, y: 64, width: 120, height: 24 },
      text: `기간: ${prog.duration}`,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 160, y: 64, width: 160, height: 24 },
      text: prog.price,
      fontSize: 14,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 104, width: 300, height: 80 },
      text: prog.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 24, y: 248, width: 130, height: 36 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const ROWS = Math.ceil(programs.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-eduprog-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '교육 프로그램',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-eduprog-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '실무 역량을 갖춘 전문가를 양성하는 다양한 과정을 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...programs.flatMap((p, i) => buildProgramCard(p, i)),
]);

export const educationProgramsTemplate: PageTemplate = {
  id: 'education-programs',
  name: '교육 프로그램',
  category: 'education',
  subcategory: 'programs',
  description: '코스 카탈로그 + 6개 프로그램 카드(기간/비용 포함)',
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
