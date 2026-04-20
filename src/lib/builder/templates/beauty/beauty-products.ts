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

const MARGIN = 80;
const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 380;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface Product {
  key: string;
  name: string;
  brand: string;
  price: string;
  desc: string;
}

const products: Product[] = [
  { key: 'shampoo', name: '프리미엄 헤어 샴푸', brand: 'Olaplex', price: '₩42,000', desc: '손상된 모발을 복구하고 윤기를 더해주는 프리미엄 샴푸입니다.' },
  { key: 'treatment', name: '딥 트리트먼트 마스크', brand: 'Moroccanoil', price: '₩38,000', desc: '아르간 오일 함유 딥 트리트먼트로 집중 모발 케어를 경험하세요.' },
  { key: 'serum', name: '페이셜 리페어 세럼', brand: 'Dermalogica', price: '₩65,000', desc: '피부 장벽 강화와 보습에 효과적인 고농축 세럼입니다.' },
  { key: 'oil', name: '헤어 에센스 오일', brand: 'Kérastase', price: '₩48,000', desc: '모발 끝까지 영양을 공급하는 가벼운 텍스처의 헤어 오일입니다.' },
  { key: 'sunscreen', name: '톤업 선크림 SPF50+', brand: 'Sulwhasoo', price: '₩35,000', desc: '자연스러운 톤업 효과와 강력한 자외선 차단을 동시에 제공합니다.' },
  { key: 'nail-care', name: '네일 강화 베이스 코트', brand: 'OPI', price: '₩18,000', desc: '약해진 손톱을 강화하고 보호하는 네일 베이스 코트입니다.' },
];

function buildProductCard(product: Product, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-beautyprod-card-${product.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 180 },
      src: `/images/placeholder-product-${product.key}.jpg`,
      alt: `${product.name} 제품 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 196, width: 330, height: 36 }, product.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-brand`,
      parentId: cid,
      rect: { x: 20, y: 236, width: 200, height: 22 },
      text: product.brand,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 250, y: 236, width: 100, height: 22 },
      text: product.price,
      fontSize: 14,
      color: '#123b63',
      fontWeight: 'bold',
      align: 'right',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 20, y: 268, width: 330, height: 60 },
      text: product.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 20, y: 340, width: 110, height: 32 },
      label: '구매하기',
      href: '#',
      variant: 'link',
      style: { borderRadius: 4 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-beautyprod-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '추천 제품',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautyprod-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '전문가가 엄선한 프리미엄 뷰티 제품을 만나보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...products.flatMap((p, i) => buildProductCard(p, i)),
]);

export const beautyProductsTemplate: PageTemplate = {
  id: 'beauty-products',
  name: '추천 제품',
  category: 'beauty',
  subcategory: 'products',
  description: '제품 제목 + 6개 제품 카드(이미지 + 이름 + 브랜드 + 가격 + 설명)',
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
