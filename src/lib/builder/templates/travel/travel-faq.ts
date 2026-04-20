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
  { key: 'booking', q: '예약은 어떻게 하나요?', a: '온라인 문의, 전화, 또는 방문 상담을 통해 예약하실 수 있습니다. 원하는 일정과 예산을 말씀해 주시면 맞춤 견적을 보내드립니다.' },
  { key: 'cancel', q: '취소 및 환불 정책은 어떻게 되나요?', a: '출발 30일 전까지 전액 환불, 15일 전까지 70% 환불, 7일 전까지 50% 환불됩니다. 항공권은 별도 규정이 적용됩니다.' },
  { key: 'insurance', q: '여행자 보험은 포함되어 있나요?', a: '기본 패키지에는 여행자 보험이 포함되어 있습니다. 추가 보장을 원하시면 프리미엄 보험 업그레이드가 가능합니다.' },
  { key: 'visa', q: '비자가 필요한 나라는 어떻게 준비하나요?', a: '비자 필요 여부를 사전에 안내드리며, 비자 신청 대행 서비스도 제공합니다. 추가 비용이 발생할 수 있습니다.' },
  { key: 'group', q: '단체 여행도 가능한가요?', a: '네, 10인 이상 단체 여행 시 할인 혜택이 적용됩니다. 기업 연수, 동호회, 가족 모임 등 다양한 형태의 단체 여행을 기획합니다.' },
  { key: 'payment', q: '결제 방법은 어떤 것이 있나요?', a: '신용카드(무이자 할부 가능), 계좌이체, 현장 결제가 가능합니다. 분할 결제도 상담을 통해 조율 가능합니다.' },
  { key: 'custom', q: '패키지를 수정할 수 있나요?', a: '네, 모든 패키지는 고객의 요청에 따라 일정, 호텔, 액티비티 등을 조정할 수 있습니다. 완전한 맞춤 여행도 가능합니다.' },
  { key: 'emergency', q: '여행 중 긴급 상황에는 어떻게 하나요?', a: '24시간 긴급 연락처를 제공하며, 현지 파트너와 협력하여 빠르게 대응합니다. 의료, 분실, 항공편 변경 등을 지원합니다.' },
];

function buildFaqItem(faq: Faq, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (QA_H + GAP);
  const cid = `tpl-travelfaq-item-${faq.key}`;

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
    'tpl-travelfaq-title',
    { x: MARGIN, y: 50, width: 600, height: 56 },
    '자주 묻는 질문',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelfaq-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '여행 예약에 관해 궁금한 점을 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...faqs.flatMap((faq, i) => buildFaqItem(faq, i)),
]);

export const travelFaqTemplate: PageTemplate = {
  id: 'travel-faq',
  name: '여행 FAQ',
  category: 'travel',
  subcategory: 'faq',
  description: 'FAQ 제목 + 8개 Q&A 쌍(질문 + 답변)',
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
