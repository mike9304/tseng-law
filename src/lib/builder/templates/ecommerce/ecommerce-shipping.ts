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
const POLICY_Y = HEADER_H + 60;
const POLICY_H = 300;
const ZONES_Y = POLICY_Y + POLICY_H + 60;
const ZONES_H = 280;
const TRACKING_Y = ZONES_Y + ZONES_H + 60;
const TRACKING_H = 200;
const STAGE_H = TRACKING_Y + TRACKING_H + 80;

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
  /* ── Header ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecship-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecship-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '배송 정책',
    1,
    '#ffffff',
    'left',
    'tpl-ecship-header',
  ),

  /* ── Shipping policy ────────────────────────────────────── */
  heading(
    'tpl-ecship-policy-title',
    { x: 80, y: POLICY_Y, width: 400, height: 50 },
    '배송 안내',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-ecship-policy-text',
    rect: { x: 80, y: POLICY_Y + 60, width: W - 160, height: 220 },
    text: '• 5만원 이상 구매 시 무료 배송 (미만 시 배송비 3,000원)\n• 평일 오후 2시 이전 주문 시 당일 출고\n• 출고 후 1~2영업일 이내 배송 완료\n• CJ대한통운 택배를 통해 안전하게 배송됩니다\n• 주말/공휴일에는 출고되지 않으며, 다음 영업일에 순차 출고됩니다\n• 대량 주문의 경우 별도 상담 후 배송 일정이 안내됩니다',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Delivery zones ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecship-zones',
    rect: { x: 0, y: ZONES_Y, width: W, height: ZONES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecship-zones-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '배송 지역별 안내',
    2,
    '#123b63',
    'left',
    'tpl-ecship-zones',
  ),
  createContainerNode({
    id: 'tpl-ecship-zone-1',
    parentId: 'tpl-ecship-zones',
    rect: { x: 80, y: 110, width: 340, height: 120 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-ecship-zone-1-title', { x: 24, y: 12, width: 292, height: 30 }, '수도권', 3, '#123b63', 'left', 'tpl-ecship-zone-1'),
  createTextNode({
    id: 'tpl-ecship-zone-1-desc',
    parentId: 'tpl-ecship-zone-1',
    rect: { x: 24, y: 50, width: 292, height: 50 },
    text: '출고 후 1일 이내 배송\n추가 배송비 없음',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-ecship-zone-2',
    parentId: 'tpl-ecship-zones',
    rect: { x: 460, y: 110, width: 340, height: 120 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-ecship-zone-2-title', { x: 24, y: 12, width: 292, height: 30 }, '지방', 3, '#123b63', 'left', 'tpl-ecship-zone-2'),
  createTextNode({
    id: 'tpl-ecship-zone-2-desc',
    parentId: 'tpl-ecship-zone-2',
    rect: { x: 24, y: 50, width: 292, height: 50 },
    text: '출고 후 1~2일 이내 배송\n추가 배송비 없음',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-ecship-zone-3',
    parentId: 'tpl-ecship-zones',
    rect: { x: 840, y: 110, width: 340, height: 120 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-ecship-zone-3-title', { x: 24, y: 12, width: 292, height: 30 }, '제주/도서산간', 3, '#123b63', 'left', 'tpl-ecship-zone-3'),
  createTextNode({
    id: 'tpl-ecship-zone-3-desc',
    parentId: 'tpl-ecship-zone-3',
    rect: { x: 24, y: 50, width: 292, height: 50 },
    text: '출고 후 2~3일 이내 배송\n추가 배송비 3,000원',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Tracking info ──────────────────────────────────────── */
  heading(
    'tpl-ecship-track-title',
    { x: 80, y: TRACKING_Y, width: 400, height: 50 },
    '배송 조회',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-ecship-track-text',
    rect: { x: 80, y: TRACKING_Y + 60, width: W - 160, height: 100 },
    text: '주문 완료 후 발송 시 문자/카카오톡으로 운송장 번호가 발송됩니다.\n마이페이지 > 주문 내역에서도 배송 상태를 실시간으로 확인하실 수 있습니다.',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
]);

export const ecommerceShippingTemplate: PageTemplate = {
  id: 'ecommerce-shipping',
  name: '온라인 쇼핑몰 배송 정책',
  category: 'ecommerce',
  subcategory: 'shipping',
  description: '배송 정책 + 지역별 배송 안내 + 배송 조회 정보',
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
