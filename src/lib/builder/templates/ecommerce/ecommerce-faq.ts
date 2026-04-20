import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HEADER_H = 120;
const QA_START = HEADER_H + 60;
const QA_H = 100;
const QA_GAP = 20;
const STAGE_H = QA_START + (QA_H + QA_GAP) * 8 + 60;

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

const faqData = [
  { q: '반품/교환 정책은 어떻게 되나요?', a: '상품 수령일로부터 7일 이내에 교환/반품 신청이 가능합니다. 단, 고객 변심으로 인한 반품 시 배송비는 고객 부담입니다.' },
  { q: '배송은 얼마나 걸리나요?', a: '결제 완료 후 1~3 영업일 내 출고되며, 출고 후 1~2일 이내 배송됩니다.' },
  { q: '해외 배송이 가능한가요?', a: '현재 국내 배송만 가능하며, 해외 배송은 추후 지원 예정입니다.' },
  { q: '결제는 어떤 방법으로 할 수 있나요?', a: '신용카드, 체크카드, 실시간 계좌이체, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.' },
  { q: '주문 취소는 어떻게 하나요?', a: '출고 전 주문 취소가 가능하며, 마이페이지에서 직접 취소하거나 고객센터로 연락해 주세요.' },
  { q: '포인트/적립금은 어떻게 사용하나요?', a: '결제 시 보유 포인트를 사용할 수 있으며, 최소 1,000포인트부터 사용 가능합니다.' },
  { q: '회원 등급 혜택은 무엇인가요?', a: 'VIP 이상 등급 시 전 상품 5% 추가 할인, 무료 배송, 생일 쿠폰 등의 혜택을 제공합니다.' },
  { q: '상품 재입고 알림을 받을 수 있나요?', a: '품절 상품 페이지에서 재입고 알림 신청을 하시면 입고 즉시 알림을 보내드립니다.' },
];

function faqCard(n: number): BuilderCanvasNode[] {
  const y = QA_START + (QA_H + QA_GAP) * (n - 1);
  const cId = `tpl-ecfaq-qa-${n}`;
  return [
    createContainerNode({
      id: cId,
      rect: { x: 80, y, width: W - 160, height: QA_H },
      background: '#f3f4f6',
      borderRadius: 8,
      padding: 20,
    }),
    createTextNode({
      id: `${cId}-q`,
      parentId: cId,
      rect: { x: 20, y: 12, width: 900, height: 28 },
      text: `Q. ${faqData[n - 1].q}`,
      fontSize: 16,
      color: '#123b63',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cId}-a`,
      parentId: cId,
      rect: { x: 20, y: 48, width: 900, height: 36 },
      text: `A. ${faqData[n - 1].a}`,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Header ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecfaq-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecfaq-title',
    { x: 80, y: 35, width: 600, height: 50 },
    '자주 묻는 질문 (FAQ)',
    1,
    '#ffffff',
    'left',
    'tpl-ecfaq-header',
  ),

  /* ── 8 Q&A pairs ────────────────────────────────────────── */
  ...faqCard(1),
  ...faqCard(2),
  ...faqCard(3),
  ...faqCard(4),
  ...faqCard(5),
  ...faqCard(6),
  ...faqCard(7),
  ...faqCard(8),
]);

export const ecommerceFaqTemplate: PageTemplate = {
  id: 'ecommerce-faq',
  name: '온라인 쇼핑몰 FAQ',
  category: 'ecommerce',
  subcategory: 'faq',
  description: '쇼핑 FAQ (반품/배송/결제) 8개 Q&A 쌍',
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
