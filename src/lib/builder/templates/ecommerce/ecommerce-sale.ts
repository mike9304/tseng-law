import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 400;
const COUNTDOWN_Y = HERO_H + 60;
const COUNTDOWN_H = 120;
const DEALS_Y = COUNTDOWN_Y + COUNTDOWN_H + 60;
const DEALS_H = 900;
const STAGE_H = DEALS_Y + DEALS_H + 80;

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

function dealCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = DEALS_Y + row * 440;
  const cId = `tpl-ecsale-deal-${n}`;
  const names = ['여름 원피스', '리넨 셔츠', '데님 팬츠', '캔버스 백', '선글라스', '스트랩 샌들'];
  const prices = ['₩39,000', '₩29,000', '₩49,000', '₩19,000', '₩25,000', '₩35,000'];
  const originals = ['₩79,000', '₩59,000', '₩89,000', '₩39,000', '₩55,000', '₩69,000'];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 360, height: 420 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 360, height: 220 },
      src: `/images/placeholder-sale-${n}.jpg`,
      alt: `${names[n - 1]} 세일 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 16, y: 232, width: 328, height: 36 }, names[n - 1], 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-orig`,
      parentId: cId,
      rect: { x: 16, y: 276, width: 100, height: 24 },
      text: originals[n - 1],
      fontSize: 14,
      color: '#9ca3af',
    }),
    createTextNode({
      id: `${cId}-price`,
      parentId: cId,
      rect: { x: 130, y: 274, width: 120, height: 28 },
      text: prices[n - 1],
      fontSize: 20,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 16, y: 320, width: 140, height: 44 },
      label: '구매하기',
      href: '#',
      variant: 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Sale hero ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecsale-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecsale-hero-title',
    { x: 80, y: 100, width: 700, height: 80 },
    '시즌 오프 세일 최대 50% 할인',
    1,
    '#e8a838',
    'left',
    'tpl-ecsale-hero',
  ),
  createTextNode({
    id: 'tpl-ecsale-hero-sub',
    parentId: 'tpl-ecsale-hero',
    rect: { x: 80, y: 200, width: 500, height: 60 },
    text: '놓치면 후회할 특가 상품을 지금 만나보세요!',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-ecsale-hero-cta',
    parentId: 'tpl-ecsale-hero',
    rect: { x: 80, y: 290, width: 200, height: 52 },
    label: '세일 상품 보기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Countdown area ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecsale-countdown',
    rect: { x: 0, y: COUNTDOWN_Y, width: W, height: COUNTDOWN_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecsale-countdown-title',
    { x: 80, y: 20, width: 600, height: 40 },
    '세일 종료까지',
    2,
    '#123b63',
    'left',
    'tpl-ecsale-countdown',
  ),
  createTextNode({
    id: 'tpl-ecsale-countdown-timer',
    parentId: 'tpl-ecsale-countdown',
    rect: { x: 80, y: 66, width: 400, height: 36 },
    text: '3일 12시간 45분 30초',
    fontSize: 28,
    color: '#e8a838',
    fontWeight: 'bold',
  }),

  /* ── Featured deals (6 cards) ───────────────────────────── */
  ...dealCard(1, 0, 0),
  ...dealCard(2, 1, 0),
  ...dealCard(3, 2, 0),
  ...dealCard(4, 0, 1),
  ...dealCard(5, 1, 1),
  ...dealCard(6, 2, 1),
]);

export const ecommerceSaleTemplate: PageTemplate = {
  id: 'ecommerce-sale',
  name: '온라인 쇼핑몰 세일',
  category: 'ecommerce',
  subcategory: 'sale',
  description: '세일 랜딩 페이지 + 카운트다운 영역 + 특가 상품(6개)',
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
