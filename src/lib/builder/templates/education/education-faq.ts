import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const MARGIN = 80;
const CONTENT_W = W - MARGIN * 2;
const HEADER_H = 140;
const QA_H = 120;
const GAP = 16;

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

interface Faq {
  key: string;
  q: string;
  a: string;
}

const faqs: Faq[] = [
  { key: 'requirement', q: '입학 자격은 어떻게 되나요?', a: '고등학교 졸업(예정)자 또는 동등 학력 인정자가 지원 가능합니다. 학과별 추가 요건은 입학처에 문의해 주세요.' },
  { key: 'deadline', q: '원서 접수 기간은 언제인가요?', a: '정시는 매년 12월~1월, 수시는 9월~10월에 접수합니다. 정확한 일정은 입학처 공지를 확인해 주세요.' },
  { key: 'scholarship', q: '장학금 제도가 있나요?', a: '성적 우수, 가정형편, 특기자 장학금 등 다양한 장학 프로그램을 운영합니다. 신입생 전원 대상 입학 장학금도 있습니다.' },
  { key: 'dormitory', q: '기숙사를 이용할 수 있나요?', a: '교내 기숙사(2인실/4인실)를 운영하며, 원거리 학생에게 우선권을 부여합니다. 기숙사비는 학기당 150만원입니다.' },
  { key: 'transfer', q: '편입학이 가능한가요?', a: '네, 매년 3월에 편입학 전형을 실시합니다. 전적 대학 이수 학점에 따라 학년이 배정됩니다.' },
  { key: 'internship', q: '인턴십 기회가 있나요?', a: '산학협력 기업과의 연계를 통해 3~4학년 학생에게 인턴십 기회를 제공합니다. 취업 연계율이 높습니다.' },
  { key: 'exchange', q: '해외 교환학생 프로그램이 있나요?', a: '미국, 일본, 유럽 등 50여 개 파트너 대학과 교환학생 프로그램을 운영합니다.' },
  { key: 'credit', q: '학점 인정은 어떻게 되나요?', a: '온라인 강좌, 자격증 등 다양한 경로로 학점 인정이 가능합니다. 학사 규정에 따라 심사를 진행합니다.' },
];

function buildFaqItem(faq: Faq, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (QA_H + GAP);
  const cid = `tpl-edufaq-item-${faq.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: QA_H },
      background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
      borderRadius: 10,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 20,
    }),
    heading(`${cid}-q`, { x: 20, y: 16, width: CONTENT_W - 60, height: 32 }, faq.q, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-a`,
      parentId: cid,
      rect: { x: 20, y: 54, width: CONTENT_W - 60, height: 48 },
      text: faq.a,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.55,
    }),
  ];
}

const STAGE_H = HEADER_H + 40 + faqs.length * (QA_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-edufaq-title', { x: MARGIN, y: 50, width: 600, height: 56 }, '입학 FAQ', 1, '#123b63'),
  createTextNode({
    id: 'tpl-edufaq-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '입학에 관해 자주 묻는 질문과 답변을 모았습니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...faqs.flatMap((faq, i) => buildFaqItem(faq, i)),
]);

export const educationFaqTemplate: PageTemplate = {
  id: 'education-faq',
  name: '입학 FAQ',
  category: 'education',
  subcategory: 'faq',
  description: '입학 관련 FAQ + 8개 Q&A 쌍',
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
