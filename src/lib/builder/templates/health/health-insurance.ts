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
const LIST_Y = HEADER_H + 40;
const LIST_H = 300;
const COVERAGE_Y = LIST_Y + LIST_H + 80;
const COVERAGE_H = 240;
const FAQ_Y = COVERAGE_Y + COVERAGE_H + 80;
const FAQ_ITEM_H = 100;
const FAQ_GAP = 16;
const FAQ_COUNT = 4;
const STAGE_H = FAQ_Y + FAQ_COUNT * (FAQ_ITEM_H + FAQ_GAP) + 80;

interface BillingFaq {
  key: string;
  q: string;
  a: string;
}

const billingFaqs: BillingFaq[] = [
  { key: 'claim', q: '보험 청구는 어떻게 하나요?', a: '원무과에서 보험 청구 서류를 발급해 드립니다. 실손보험의 경우 진단서와 영수증을 보험사에 제출하시면 됩니다.' },
  { key: 'uninsured', q: '비급여 항목은 무엇인가요?', a: '미용 시술, 일부 건강검진 항목, 선택 진료 등이 비급여에 해당합니다. 상세 내역은 원무과에 문의해 주세요.' },
  { key: 'payment', q: '결제 방법은 어떤 것이 있나요?', a: '현금, 카드(신용/체크), 계좌이체, 간편결제(카카오페이, 네이버페이)를 지원합니다.' },
  { key: 'installment', q: '분할 납부가 가능한가요?', a: '고액 진료비의 경우 카드 무이자 할부(2~6개월)를 이용하실 수 있습니다. 상세 내용은 수납 창구에서 안내드립니다.' },
];

function buildBillingFaqItem(faq: BillingFaq, idx: number): BuilderCanvasNode[] {
  const y = FAQ_Y + idx * (FAQ_ITEM_H + FAQ_GAP);
  const cid = `tpl-healthins-faq-${faq.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: FAQ_ITEM_H },
      background: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
      borderRadius: 10,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 20,
    }),
    heading(`${cid}-q`, { x: 20, y: 12, width: CONTENT_W - 60, height: 28 }, faq.q, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-a`,
      parentId: cid,
      rect: { x: 20, y: 48, width: CONTENT_W - 60, height: 40 },
      text: faq.a,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.55,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthins-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '보험 및 수납 안내',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthins-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '보험 적용 및 수납에 관한 안내입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Accepted insurance list ─────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthins-list',
    rect: { x: MARGIN, y: LIST_Y, width: CONTENT_W, height: LIST_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-healthins-list-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '적용 보험 목록',
    2,
    '#123b63',
    'left',
    'tpl-healthins-list',
  ),
  createTextNode({
    id: 'tpl-healthins-list-items',
    parentId: 'tpl-healthins-list',
    rect: { x: 32, y: 80, width: 900, height: 180 },
    text: '국민건강보험 | 삼성화재 실손보험 | 현대해상 실손보험 | DB손해보험 | KB손해보험 | 메리츠화재 | 한화손해보험 | NH농협손해보험 | 롯데손해보험 | 흥국화재',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.8,
  }),

  /* ── Coverage info ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthins-coverage',
    rect: { x: 0, y: COVERAGE_Y, width: W, height: COVERAGE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-healthins-coverage-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '보장 안내',
    2,
    '#ffffff',
    'left',
    'tpl-healthins-coverage',
  ),
  createTextNode({
    id: 'tpl-healthins-coverage-desc',
    parentId: 'tpl-healthins-coverage',
    rect: { x: MARGIN, y: 100, width: 800, height: 100 },
    text: '국민건강보험 적용 시 본인부담금만 납부하시면 됩니다. 실손보험 가입자의 경우 비급여 항목에 대해서도 보험 청구가 가능합니다. 보험 청구에 필요한 서류는 원무과에서 당일 발급해 드립니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),

  /* ── Billing FAQ ─────────────────────────────────────────── */
  heading(
    'tpl-healthins-faq-title',
    { x: MARGIN, y: FAQ_Y - 50, width: 400, height: 40 },
    '수납 관련 FAQ',
    2,
    '#123b63',
  ),
  ...billingFaqs.flatMap((faq, i) => buildBillingFaqItem(faq, i)),
]);

export const healthInsuranceTemplate: PageTemplate = {
  id: 'health-insurance',
  name: '보험 및 수납',
  category: 'health',
  subcategory: 'insurance',
  description: '적용 보험 목록 + 보장 안내 + 수납 FAQ',
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
