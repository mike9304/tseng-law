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
const HEADER_H = 120;
const PACKAGES_Y = HEADER_H + 60;
const PACKAGES_H = 500;
const ADDONS_Y = PACKAGES_Y + PACKAGES_H + 80;
const ADDONS_H = 260;
const STAGE_H = ADDONS_Y + ADDONS_H + 80;

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

const packages = [
  {
    name: '베이직',
    price: '₩300,000',
    items: '• 1시간 촬영\n• 보정본 30장\n• 온라인 갤러리 제공\n• 1벌 의상 변경',
  },
  {
    name: '스탠다드',
    price: '₩500,000',
    items: '• 2시간 촬영\n• 보정본 60장\n• 온라인 갤러리 + USB 제공\n• 2벌 의상 변경\n• 야외 로케이션 포함',
  },
  {
    name: '프리미엄',
    price: '₩800,000',
    items: '• 3시간 촬영\n• 보정본 100장\n• 포토북 1권 제작\n• 3벌 의상 변경\n• 헤어/메이크업 포함\n• 액자 2개 제작',
  },
];

function packageCard(n: number): BuilderCanvasNode[] {
  const x = 80 + (n - 1) * 390;
  const cId = `tpl-photoprice-pkg-${n}`;
  const p = packages[n - 1];
  const bg = n === 2 ? '#123b63' : '#f3f4f6';
  const textColor = n === 2 ? '#ffffff' : '#1f2937';
  const titleColor = n === 2 ? '#e8a838' : '#123b63';
  return [
    createContainerNode({
      id: cId,
      rect: { x, y: PACKAGES_Y, width: 360, height: PACKAGES_H },
      background: bg,
      borderRadius: 12,
      padding: 32,
    }),
    heading(`${cId}-name`, { x: 32, y: 24, width: 296, height: 40 }, p.name, 2, titleColor, 'center', cId),
    createTextNode({
      id: `${cId}-price`,
      parentId: cId,
      rect: { x: 32, y: 80, width: 296, height: 44 },
      text: p.price,
      fontSize: 32,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cId}-items`,
      parentId: cId,
      rect: { x: 32, y: 146, width: 296, height: 240 },
      text: p.items,
      fontSize: 14,
      color: textColor,
      lineHeight: 1.8,
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 80, y: 420, width: 200, height: 48 },
      label: '예약하기',
      href: '#',
      variant: 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-photoprice-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoprice-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '촬영 패키지',
    1,
    '#ffffff',
    'left',
    'tpl-photoprice-header',
  ),

  ...packageCard(1),
  ...packageCard(2),
  ...packageCard(3),

  /* ── Add-ons ────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoprice-addons',
    rect: { x: 0, y: ADDONS_Y, width: W, height: ADDONS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoprice-addons-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '추가 옵션',
    2,
    '#123b63',
    'left',
    'tpl-photoprice-addons',
  ),
  createTextNode({
    id: 'tpl-photoprice-addons-list',
    parentId: 'tpl-photoprice-addons',
    rect: { x: 80, y: 110, width: 800, height: 120 },
    text: '• 추가 보정본 (장당): ₩5,000\n• 헤어/메이크업 추가: ₩150,000\n• 야외 로케이션 추가: ₩100,000\n• 포토북 추가 1권: ₩80,000\n• 액자 추가 (A4): ₩30,000',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
]);

export const photographyPricingTemplate: PageTemplate = {
  id: 'photography-pricing',
  name: '촬영 가격표',
  category: 'photography',
  subcategory: 'pricing',
  description: '3가지 촬영 패키지 + 제공 내역 + 추가 옵션',
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
