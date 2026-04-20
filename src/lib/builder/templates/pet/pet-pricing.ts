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
const PRICES_Y = HERO_H + 80;
const PRICES_H = 400;
const PACKAGES_Y = PRICES_Y + PRICES_H + 80;
const PACKAGES_H = 480;
const STAGE_H = PACKAGES_Y + PACKAGES_H + 80;

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

const priceItems = [
  { service: '기본 진료비', price: '30,000원' },
  { service: '종합 건강검진', price: '150,000원~' },
  { service: '예방접종 (종합)', price: '50,000원~' },
  { service: '스케일링', price: '100,000원~' },
  { service: '중성화 수술', price: '200,000원~' },
  { service: '미용/목욕', price: '40,000원~' },
];

const priceNodes: BuilderCanvasNode[] = priceItems.flatMap((p, i) => {
  const y = PRICES_Y + 70 + i * 50;
  return [
    createTextNode({
      id: `tpl-petprc-item-${i + 1}-name`,
      rect: { x: 80, y, width: 300, height: 36 },
      text: p.service,
      fontSize: 16,
      color: '#1f2937',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `tpl-petprc-item-${i + 1}-price`,
      rect: { x: 400, y, width: 200, height: 36 },
      text: p.price,
      fontSize: 16,
      color: '#e8a838',
      fontWeight: 'bold',
      lineHeight: 1.4,
    }),
  ];
});

const packages = [
  { name: '기본 웰니스', price: '월 39,000원', desc: '연 2회 건강검진 + 기본 예방접종 + 진료비 10% 할인' },
  { name: '프리미엄 케어', price: '월 69,000원', desc: '연 4회 건강검진 + 전체 예방접종 + 스케일링 1회 + 진료비 20% 할인' },
  { name: 'VIP 플랜', price: '월 99,000원', desc: '무제한 건강검진 + 전체 예방접종 + 스케일링 + 미용 월 1회 + 진료비 30% 할인' },
];

const pkgW = 360;
const gapX = 30;

const pkgCards: BuilderCanvasNode[] = packages.flatMap((pkg, i) => {
  const x = 80 + i * (pkgW + gapX);
  const prefix = `tpl-petprc-pkg-${i + 1}`;
  const bg = i === 2 ? '#123b63' : '#f3f4f6';
  const textColor = i === 2 ? '#ffffff' : '#1f2937';
  const titleColor = i === 2 ? '#ffffff' : '#123b63';
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: PACKAGES_Y + 70, width: pkgW, height: 380 },
      background: bg,
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 312, height: 36 }, pkg.name, 3, titleColor, 'center', prefix),
    createTextNode({
      id: `${prefix}-price`,
      parentId: prefix,
      rect: { x: 24, y: 76, width: 312, height: 40 },
      text: pkg.price,
      fontSize: 22,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `${prefix}-desc`,
      parentId: prefix,
      rect: { x: 24, y: 140, width: 312, height: 120 },
      text: pkg.desc,
      fontSize: 14,
      color: textColor,
      lineHeight: 1.6,
      align: 'center',
    }),
    createButtonNode({
      id: `${prefix}-btn`,
      parentId: prefix,
      rect: { x: 80, y: 300, width: 200, height: 48 },
      label: '가입하기',
      href: '#',
      variant: i === 2 ? 'secondary' : 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-petprc-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petprc-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '진료비 안내', 1, '#ffffff', 'left', 'tpl-petprc-hero'),
  createTextNode({
    id: 'tpl-petprc-hero-sub',
    parentId: 'tpl-petprc-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '투명한 진료비와 합리적인 웰니스 패키지를 제공합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  heading('tpl-petprc-list-title', { x: 80, y: PRICES_Y, width: 400, height: 50 }, '서비스별 진료비', 2, '#123b63', 'left'),
  ...priceNodes,

  heading('tpl-petprc-pkg-title', { x: 80, y: PACKAGES_Y, width: 400, height: 50 }, '웰니스 패키지', 2, '#123b63', 'left'),
  ...pkgCards,
]);

export const petPricingTemplate: PageTemplate = {
  id: 'pet-pricing',
  name: '동물병원 진료비',
  category: 'pet',
  subcategory: 'pricing',
  description: '서비스 가격표 + 웰니스 패키지(3단계)',
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
