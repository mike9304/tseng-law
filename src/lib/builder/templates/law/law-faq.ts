import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
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

const MARGIN = 80;
const CONTENT_W = W - MARGIN * 2;
const HEADER_H = 140;
const QA_H = 120;
const GAP = 16;

interface Faq {
  key: string;
  q: string;
  a: string;
}

const faqs: Faq[] = [
  { key: 'consult', q: '초기 상담은 무료인가요?', a: '네, 첫 30분 상담은 무료로 진행됩니다. 전화, 이메일 또는 사무소 방문을 통해 예약하실 수 있습니다. 상담 후 진행 여부는 자유롭게 결정하실 수 있습니다.' },
  { key: 'language', q: '한국어로 상담이 가능한가요?', a: '네, 저희 사무소의 모든 변호사는 한국어에 능통합니다. 한국어로 상담, 서류 작성, 법정 통역까지 모든 법률 서비스를 한국어로 제공합니다.' },
  { key: 'fee', q: '변호사 비용은 어떻게 되나요?', a: '사건의 복잡도와 유형에 따라 다릅니다. 시간당 과금, 성공 보수, 정액 수수료 등 다양한 방식을 제공하며, 상담 시 투명하게 안내해 드립니다.' },
  { key: 'duration', q: '사건 처리에 보통 얼마나 걸리나요?', a: '사건 유형에 따라 다르지만, 간단한 계약 검토는 1~2주, 소송 사건은 3~12개월이 소요될 수 있습니다. 구체적인 일정은 상담 시 안내드립니다.' },
  { key: 'online', q: '온라인 상담도 가능한가요?', a: '네, Zoom, Google Meet 등을 통한 화상 상담을 지원합니다. 대만 외 지역에 거주하시는 분들도 편리하게 상담받으실 수 있습니다.' },
  { key: 'document', q: '필요한 서류는 무엇인가요?', a: '사건 유형에 따라 다르지만, 일반적으로 신분증, 관련 계약서, 통신 기록 등이 필요합니다. 상담 예약 시 필요 서류 목록을 미리 안내해 드립니다.' },
  { key: 'area', q: '어떤 법률 분야를 다루나요?', a: '기업법, 부동산법, 이민법, 가족법, 노동법, 지적재산권 등 대만 법률 전반에 걸쳐 폭넓은 서비스를 제공합니다.' },
  { key: 'emergency', q: '긴급 상황에는 어떻게 연락하나요?', a: '긴급 법률 문제의 경우, 사무소 대표번호로 전화해 주시면 담당 변호사가 빠르게 연락드립니다. 영업시간 외에는 긴급 연락 양식을 이용해 주세요.' },
];

function buildFaqItem(faq: Faq, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (QA_H + GAP);
  const cid = `tpl-faq-item-${faq.key}`;

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
  heading(
    'tpl-faq-title',
    { x: MARGIN, y: 50, width: 600, height: 56 },
    '자주 묻는 질문',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-faq-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '고객님들이 가장 궁금해하시는 질문과 답변을 모았습니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...faqs.flatMap((faq, i) => buildFaqItem(faq, i)),
]);

export const lawFaqTemplate: PageTemplate = {
  id: 'law-faq',
  name: '자주 묻는 질문',
  category: 'law',
  subcategory: 'faq',
  description: 'FAQ 제목 + 8개 Q&A 쌍(질문 + 답변 텍스트), 컨테이너 그룹',
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
