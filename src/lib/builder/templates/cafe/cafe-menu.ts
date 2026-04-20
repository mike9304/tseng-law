import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const DRINKS_Y = HERO_H + 80;
const DRINKS_H = 400;
const FOOD_Y = DRINKS_Y + DRINKS_H + 80;
const FOOD_H = 400;
const STAGE_H = FOOD_Y + FOOD_H + 80;

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

const drinks = [
  { name: '에스프레소', items: '아메리카노 4,500원 / 라떼 5,500원 / 카푸치노 5,500원 / 마끼아또 5,000원' },
  { name: '티', items: '얼그레이 5,000원 / 캐모마일 5,000원 / 자스민 5,000원 / 페퍼민트 5,000원' },
  { name: '스무디', items: '베리 스무디 6,500원 / 망고 스무디 6,500원 / 그린 스무디 6,500원' },
];

const foods = [
  { name: '페이스트리', items: '크루아상 4,000원 / 스콘 3,500원 / 머핀 4,000원 / 시나몬롤 4,500원' },
  { name: '샌드위치', items: '클럽 샌드위치 8,500원 / BLT 7,500원 / 에그 샌드위치 7,000원' },
  { name: '샐러드', items: '시저 샐러드 9,000원 / 콥 샐러드 9,500원 / 그린 샐러드 8,000원' },
];

const cardW = 360;
const cardH = 160;
const gapX = 30;

const drinkCards: BuilderCanvasNode[] = drinks.flatMap((d, i) => {
  const x = 80 + i * (cardW + gapX);
  const prefix = `tpl-cafemenu-drink-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: DRINKS_Y + 70, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, d.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-items`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 312, height: 70 },
      text: d.items,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.6,
    }),
  ];
});

const foodCards: BuilderCanvasNode[] = foods.flatMap((f, i) => {
  const x = 80 + i * (cardW + gapX);
  const prefix = `tpl-cafemenu-food-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: FOOD_Y + 70, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, f.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-items`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 312, height: 70 },
      text: f.items,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.6,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafemenu-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafemenu-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '메뉴', 1, '#ffffff', 'left', 'tpl-cafemenu-hero'),
  createTextNode({
    id: 'tpl-cafemenu-hero-sub',
    parentId: 'tpl-cafemenu-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '엄선된 원두와 신선한 재료로 만드는 다양한 메뉴를 소개합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Drinks ─────────────────────────────────────────────── */
  heading('tpl-cafemenu-drinks-title', { x: 80, y: DRINKS_Y, width: 400, height: 50 }, '음료 메뉴', 2, '#123b63', 'left'),
  ...drinkCards,

  /* ── Food ────────────────────────────────────────────────── */
  heading('tpl-cafemenu-food-title', { x: 80, y: FOOD_Y, width: 400, height: 50 }, '푸드 메뉴', 2, '#123b63', 'left'),
  ...foodCards,
]);

export const cafeMenuTemplate: PageTemplate = {
  id: 'cafe-menu',
  name: '카페 메뉴',
  category: 'cafe',
  subcategory: 'menu',
  description: '음료 메뉴(에스프레소/티/스무디) + 푸드 메뉴(페이스트리/샌드위치/샐러드) + 가격표',
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
