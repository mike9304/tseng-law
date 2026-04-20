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
const SUPPORT_H = 360;
const FAQ_Y = SUPPORT_H + 80;
const FAQ_H = 400;
const SHIPPING_Y = FAQ_Y + FAQ_H + 80;
const SHIPPING_H = 240;
const STAGE_H = SHIPPING_Y + SHIPPING_H + 80;

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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Customer support ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eccontact-support',
    rect: { x: 0, y: 0, width: W, height: SUPPORT_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-eccontact-title',
    { x: 80, y: 60, width: 500, height: 50 },
    '고객 지원',
    1,
    '#ffffff',
    'left',
    'tpl-eccontact-support',
  ),
  createTextNode({
    id: 'tpl-eccontact-info',
    parentId: 'tpl-eccontact-support',
    rect: { x: 80, y: 130, width: 500, height: 100 },
    text: '전화: 02-1234-5678\n이메일: support@shop.co.kr\n운영시간: 평일 09:00 - 18:00',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.8,
  }),
  createButtonNode({
    id: 'tpl-eccontact-btn',
    parentId: 'tpl-eccontact-support',
    rect: { x: 80, y: 260, width: 200, height: 52 },
    label: '1:1 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── FAQ preview ────────────────────────────────────────── */
  heading(
    'tpl-eccontact-faq-title',
    { x: 80, y: FAQ_Y, width: 400, height: 50 },
    '자주 묻는 질문',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-eccontact-faq-1',
    rect: { x: 80, y: FAQ_Y + 70, width: W - 160, height: 80 },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 20,
  }),
  createTextNode({
    id: 'tpl-eccontact-faq-1-q',
    parentId: 'tpl-eccontact-faq-1',
    rect: { x: 20, y: 12, width: 800, height: 24 },
    text: 'Q. 주문 후 배송까지 얼마나 걸리나요?',
    fontSize: 15,
    color: '#123b63',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-eccontact-faq-1-a',
    parentId: 'tpl-eccontact-faq-1',
    rect: { x: 20, y: 42, width: 800, height: 24 },
    text: 'A. 결제 완료 후 1~3 영업일 내 출고됩니다.',
    fontSize: 14,
    color: '#1f2937',
  }),
  createContainerNode({
    id: 'tpl-eccontact-faq-2',
    rect: { x: 80, y: FAQ_Y + 170, width: W - 160, height: 80 },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 20,
  }),
  createTextNode({
    id: 'tpl-eccontact-faq-2-q',
    parentId: 'tpl-eccontact-faq-2',
    rect: { x: 20, y: 12, width: 800, height: 24 },
    text: 'Q. 교환/반품은 어떻게 하나요?',
    fontSize: 15,
    color: '#123b63',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-eccontact-faq-2-a',
    parentId: 'tpl-eccontact-faq-2',
    rect: { x: 20, y: 42, width: 800, height: 24 },
    text: 'A. 수령일로부터 7일 이내 1:1 문의를 통해 신청해 주세요.',
    fontSize: 14,
    color: '#1f2937',
  }),
  createContainerNode({
    id: 'tpl-eccontact-faq-3',
    rect: { x: 80, y: FAQ_Y + 270, width: W - 160, height: 80 },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 20,
  }),
  createTextNode({
    id: 'tpl-eccontact-faq-3-q',
    parentId: 'tpl-eccontact-faq-3',
    rect: { x: 20, y: 12, width: 800, height: 24 },
    text: 'Q. 결제 수단은 무엇이 있나요?',
    fontSize: 15,
    color: '#123b63',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-eccontact-faq-3-a',
    parentId: 'tpl-eccontact-faq-3',
    rect: { x: 20, y: 42, width: 800, height: 24 },
    text: 'A. 신용카드, 계좌이체, 간편결제(카카오페이, 네이버페이) 등을 지원합니다.',
    fontSize: 14,
    color: '#1f2937',
  }),

  /* ── Shipping info ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eccontact-ship',
    rect: { x: 0, y: SHIPPING_Y, width: W, height: SHIPPING_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-eccontact-ship-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '배송 안내',
    2,
    '#123b63',
    'left',
    'tpl-eccontact-ship',
  ),
  createTextNode({
    id: 'tpl-eccontact-ship-text',
    parentId: 'tpl-eccontact-ship',
    rect: { x: 80, y: 110, width: 800, height: 80 },
    text: '• 5만원 이상 구매 시 무료 배송\n• 제주/도서산간 지역 추가 배송비 3,000원\n• 평일 오후 2시 이전 주문 시 당일 출고',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
]);

export const ecommerceContactTemplate: PageTemplate = {
  id: 'ecommerce-contact',
  name: '온라인 쇼핑몰 고객센터',
  category: 'ecommerce',
  subcategory: 'contact',
  description: '고객 지원 영역 + FAQ + 배송 안내',
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
