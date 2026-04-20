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

interface MenuItem {
  key: string;
  name: string;
  price: string;
  desc: string;
}

interface MenuCategory {
  key: string;
  title: string;
  items: MenuItem[];
}

const categories: MenuCategory[] = [
  {
    key: 'appetizer',
    title: '에피타이저',
    items: [
      { key: 'bruschetta', name: '브루스케타', price: '15,000원', desc: '신선한 토마토와 바질을 올린 바게트' },
      { key: 'soup', name: '오늘의 수프', price: '12,000원', desc: '셰프가 매일 준비하는 계절 수프' },
      { key: 'salad', name: '시저 샐러드', price: '14,000원', desc: '로메인 상추와 파르메산 치즈 드레싱' },
    ],
  },
  {
    key: 'main',
    title: '메인 요리',
    items: [
      { key: 'steak', name: '한우 스테이크', price: '65,000원', desc: '최상급 한우 등심 그릴 스테이크' },
      { key: 'pasta', name: '트러플 파스타', price: '32,000원', desc: '블랙 트러플과 수제 탈리아텔레' },
      { key: 'fish', name: '그릴드 시배스', price: '38,000원', desc: '허브 마리네이드 지중해식 생선 요리' },
    ],
  },
  {
    key: 'dessert',
    title: '디저트',
    items: [
      { key: 'tiramisu', name: '티라미수', price: '12,000원', desc: '이탈리안 정통 마스카르포네 티라미수' },
      { key: 'creme', name: '크렘 브륄레', price: '11,000원', desc: '바닐라빈 크렘 브륄레' },
    ],
  },
  {
    key: 'drinks',
    title: '음료',
    items: [
      { key: 'wine', name: '하우스 와인', price: '9,000원', desc: '소믈리에가 엄선한 레드/화이트 와인' },
      { key: 'cocktail', name: '시그니처 칵테일', price: '15,000원', desc: '바텐더의 특별한 레시피 칵테일' },
    ],
  },
];

const ITEM_H = 80;
const ITEM_GAP = 12;
const CATEGORY_TITLE_H = 50;
const CATEGORY_GAP = 60;

function buildCategory(cat: MenuCategory, startY: number): { nodes: BuilderCanvasNode[]; endY: number } {
  const result: BuilderCanvasNode[] = [];
  const cid = `tpl-menu-cat-${cat.key}`;

  result.push(
    heading(cid, { x: MARGIN, y: startY, width: 400, height: CATEGORY_TITLE_H }, cat.title, 2, '#123b63'),
  );

  let itemY = startY + CATEGORY_TITLE_H + 16;
  cat.items.forEach((item) => {
    const itemId = `tpl-menu-item-${item.key}`;
    result.push(
      createContainerNode({
        id: itemId,
        rect: { x: MARGIN, y: itemY, width: CONTENT_W, height: ITEM_H },
        background: '#ffffff',
        borderRadius: 8,
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 16,
      }),
    );
    result.push(
      createTextNode({
        id: `${itemId}-name`,
        parentId: itemId,
        rect: { x: 16, y: 12, width: 300, height: 28 },
        text: item.name,
        fontSize: 18,
        color: '#123b63',
        fontWeight: 'bold',
      }),
    );
    result.push(
      createTextNode({
        id: `${itemId}-price`,
        parentId: itemId,
        rect: { x: 800, y: 12, width: 200, height: 28 },
        text: item.price,
        fontSize: 18,
        color: '#e8a838',
        fontWeight: 'bold',
        align: 'right',
      }),
    );
    result.push(
      createTextNode({
        id: `${itemId}-desc`,
        parentId: itemId,
        rect: { x: 16, y: 44, width: 600, height: 24 },
        text: item.desc,
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 1.4,
      }),
    );
    itemY += ITEM_H + ITEM_GAP;
  });

  return { nodes: result, endY: itemY };
}

let currentY = HEADER_H + 40;
const allCategoryNodes: BuilderCanvasNode[] = [];

categories.forEach((cat) => {
  const { nodes: catNodes, endY } = buildCategory(cat, currentY);
  allCategoryNodes.push(...catNodes);
  currentY = endY + CATEGORY_GAP;
});

const STAGE_H = currentY + 40;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-menu-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '메뉴',
    1,
    '#123b63',
    'center',
  ),
  createTextNode({
    id: 'tpl-menu-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '셰프가 엄선한 재료로 정성껏 준비한 메뉴를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...allCategoryNodes,
]);

export const restaurantMenuTemplate: PageTemplate = {
  id: 'restaurant-menu',
  name: '레스토랑 메뉴',
  category: 'restaurant',
  subcategory: 'menu',
  description: '메뉴 카테고리(에피타이저/메인/디저트/음료) + 아이템별 이름, 가격, 설명',
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
