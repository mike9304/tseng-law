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
  { key: 'first-visit', q: '처음 방문할 때 무엇을 준비해야 하나요?', a: '신분증과 건강보험증을 지참해 주세요. 이전 병원에서 받은 검사 결과나 의뢰서가 있으시면 함께 가져오시면 좋습니다.' },
  { key: 'insurance', q: '건강보험 적용이 되나요?', a: '네, 국민건강보험이 적용됩니다. 비급여 항목의 경우 별도 안내를 드리며, 실손보험 서류도 발급해 드립니다.' },
  { key: 'waiting', q: '대기 시간은 얼마나 되나요?', a: '예약 환자를 우선으로 진료하며, 평균 대기 시간은 15~30분입니다. 온라인 예약 시 대기 시간을 줄이실 수 있습니다.' },
  { key: 'parking', q: '주차 시설이 있나요?', a: '건물 지하 1~3층에 200대 규모의 주차장이 있습니다. 진료 환자는 2시간 무료 주차가 가능합니다.' },
  { key: 'procedure', q: '수술 전 주의사항은 무엇인가요?', a: '수술 전 8시간 금식이 필요하며, 복용 중인 약물이 있으시면 반드시 담당 의사에게 알려주세요. 상세 안내는 사전 상담 시 제공됩니다.' },
  { key: 'records', q: '진료 기록을 어떻게 받을 수 있나요?', a: '원무과에서 진료기록 사본을 발급받으실 수 있습니다. 신분증을 지참하시고, 위임 시에는 위임장이 필요합니다.' },
  { key: 'cancel', q: '예약을 취소하거나 변경하려면?', a: '전화 또는 온라인을 통해 진료일 하루 전까지 변경 가능합니다. 당일 취소 시에는 전화로 연락해 주세요.' },
  { key: 'child', q: '소아 진료도 가능한가요?', a: '네, 소아과 전문의가 영유아부터 청소년까지 진료합니다. 예방접종, 성장 클리닉 등 다양한 소아 진료를 제공합니다.' },
];

function buildFaqItem(faq: Faq, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (QA_H + GAP);
  const cid = `tpl-healthfaq-item-${faq.key}`;

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
    'tpl-healthfaq-title',
    { x: MARGIN, y: 50, width: 600, height: 56 },
    '자주 묻는 질문',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthfaq-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '진료, 보험, 방문에 관한 자주 묻는 질문과 답변입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...faqs.flatMap((faq, i) => buildFaqItem(faq, i)),
]);

export const healthFaqTemplate: PageTemplate = {
  id: 'health-faq',
  name: '병원 FAQ',
  category: 'health',
  subcategory: 'faq',
  description: 'FAQ 제목 + 8개 Q&A(방문/보험/진료 관련)',
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
