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
const HERO_H = 300;
const PROGRAM_Y = HERO_H + 80;
const PROGRAM_H = 300;
const TIERS_Y = PROGRAM_Y + PROGRAM_H + 80;
const TIERS_H = 380;
const CTA_Y = TIERS_Y + TIERS_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

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

const tiers = [
  { name: '브론즈', condition: '가입 즉시', benefits: '음료 10잔 구매 시 1잔 무료\n생일 음료 50% 할인\n신메뉴 우선 시음' },
  { name: '실버', condition: '월 15잔 이상', benefits: '음료 8잔 구매 시 1잔 무료\n전 메뉴 10% 할인\n케이터링 추가 할인' },
  { name: '골드', condition: '월 30잔 이상', benefits: '음료 5잔 구매 시 1잔 무료\n전 메뉴 15% 할인\n월 1회 무료 디저트\n이벤트 VIP 초대' },
];

const tierW = 360;
const gapX = 30;

const tierCards: BuilderCanvasNode[] = tiers.flatMap((t, i) => {
  const x = 80 + i * (tierW + gapX);
  const prefix = `tpl-cafeloy-tier-${i + 1}`;
  const bg = i === 2 ? '#123b63' : '#f3f4f6';
  const textColor = i === 2 ? '#ffffff' : '#1f2937';
  const titleColor = i === 2 ? '#e8a838' : '#123b63';
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: TIERS_Y + 70, width: tierW, height: 280 },
      background: bg,
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 312, height: 36 }, t.name, 3, titleColor, 'center', prefix),
    createTextNode({
      id: `${prefix}-cond`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 312, height: 30 },
      text: t.condition,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      align: 'center',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-ben`,
      parentId: prefix,
      rect: { x: 24, y: 110, width: 312, height: 140 },
      text: t.benefits,
      fontSize: 14,
      color: textColor,
      lineHeight: 1.6,
      align: 'center',
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafeloy-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafeloy-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '멤버십 프로그램', 1, '#ffffff', 'left', 'tpl-cafeloy-hero'),
  createTextNode({
    id: 'tpl-cafeloy-hero-sub',
    parentId: 'tpl-cafeloy-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '자주 올수록 더 많은 혜택을 드립니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Program explanation ────────────────────────────────── */
  heading('tpl-cafeloy-prog-title', { x: 80, y: PROGRAM_Y, width: 400, height: 50 }, '로열티 프로그램 안내', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-cafeloy-prog-desc',
    rect: { x: 80, y: PROGRAM_Y + 60, width: 800, height: 180 },
    text: '카페 멤버십에 가입하면 구매 금액에 따라 포인트가 적립됩니다. 적립된 포인트로 음료와 디저트를 무료로 교환할 수 있으며, 등급이 올라갈수록 더 많은 할인과 특별 혜택을 받으실 수 있습니다. 앱 또는 매장에서 간편하게 가입하세요.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Reward tiers ───────────────────────────────────────── */
  heading('tpl-cafeloy-tiers-title', { x: 80, y: TIERS_Y, width: 400, height: 50 }, '등급별 혜택', 2, '#123b63', 'left'),
  ...tierCards,

  /* ── Signup CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-cafeloy-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-cafeloy-cta-text',
    parentId: 'tpl-cafeloy-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '지금 바로 멤버십에 가입하고 혜택을 누리세요!',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-cafeloy-cta-btn',
    parentId: 'tpl-cafeloy-cta',
    rect: { x: 80, y: 110, width: 180, height: 48 },
    label: '가입하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const cafeLoyaltyTemplate: PageTemplate = {
  id: 'cafe-loyalty',
  name: '카페 멤버십',
  category: 'cafe',
  subcategory: 'loyalty',
  description: '로열티 프로그램 설명 + 등급별 혜택 + 가입 CTA',
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
