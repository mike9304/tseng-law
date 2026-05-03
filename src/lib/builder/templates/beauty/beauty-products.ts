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
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-beautyproducts-wix-proof',
    rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 },
    background: '#f8fafc',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-showcase',
    rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 },
    background: '#ffffff',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-cta',
    rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 },
    background: '#123b63',
    borderColor: '#123b63',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-proof-label',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 56, y: 48, width: 260, height: 28 },
    text: 'Wix-grade proof system',
    fontSize: 13,
    color: '#1e5a96',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-proof-title',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 56, y: 92, width: 560, height: 82 },
    text: 'beauty products 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다',
    fontSize: 36,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.16,
    className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-proof-copy',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 56, y: 190, width: 540, height: 64 },
    text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.',
    fontSize: 17,
    color: '#475569',
    lineHeight: 1.55,
    className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-metric-1',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 56, y: 310, width: 230, height: 130 },
    background: '#ffffff',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 18,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-1-value',
    parentId: 'tpl-beautyproducts-wix-metric-1',
    rect: { x: 22, y: 22, width: 120, height: 42 },
    text: '4.9',
    fontSize: 34,
    color: '#123b63',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-1-label',
    parentId: 'tpl-beautyproducts-wix-metric-1',
    rect: { x: 22, y: 76, width: 168, height: 38 },
    text: '고객 평가와 재방문 신뢰 지표',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-metric-2',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 310, y: 310, width: 230, height: 130 },
    background: '#ffffff',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 18,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-2-value',
    parentId: 'tpl-beautyproducts-wix-metric-2',
    rect: { x: 22, y: 22, width: 140, height: 42 },
    text: '24h',
    fontSize: 34,
    color: '#1e5a96',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-2-label',
    parentId: 'tpl-beautyproducts-wix-metric-2',
    rect: { x: 22, y: 76, width: 168, height: 38 },
    text: '초기 문의와 예약 흐름을 빠르게 연결',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-metric-3',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 650, y: 70, width: 210, height: 150 },
    background: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 22,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-3-value',
    parentId: 'tpl-beautyproducts-wix-metric-3',
    rect: { x: 24, y: 28, width: 140, height: 42 },
    text: '6+',
    fontSize: 34,
    color: '#123b63',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-3-label',
    parentId: 'tpl-beautyproducts-wix-metric-3',
    rect: { x: 24, y: 82, width: 150, height: 42 },
    text: '섹션 단위 정보 구조로 풍부도 강화',
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-metric-4',
    parentId: 'tpl-beautyproducts-wix-proof',
    rect: { x: 884, y: 70, width: 210, height: 150 },
    background: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 22,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-4-value',
    parentId: 'tpl-beautyproducts-wix-metric-4',
    rect: { x: 24, y: 28, width: 140, height: 42 },
    text: '3x',
    fontSize: 34,
    color: '#e8a838',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-metric-4-label',
    parentId: 'tpl-beautyproducts-wix-metric-4',
    rect: { x: 24, y: 82, width: 150, height: 42 },
    text: 'CTA, proof, showcase 접점을 반복 배치',
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-showcase-label',
    parentId: 'tpl-beautyproducts-wix-showcase',
    rect: { x: 56, y: 48, width: 240, height: 28 },
    text: 'Showcase module',
    fontSize: 13,
    color: '#1e5a96',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-showcase-title',
    parentId: 'tpl-beautyproducts-wix-showcase',
    rect: { x: 56, y: 88, width: 540, height: 78 },
    text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다',
    fontSize: 34,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.18,
    className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-showcase-copy',
    parentId: 'tpl-beautyproducts-wix-showcase',
    rect: { x: 56, y: 178, width: 520, height: 58 },
    text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.',
    fontSize: 16,
    color: '#475569',
    lineHeight: 1.5,
    className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-showcase-visual',
    parentId: 'tpl-beautyproducts-wix-showcase',
    rect: { x: 640, y: 54, width: 430, height: 208 },
    background: '#e0f2fe',
    borderColor: '#bae6fd',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-showcase-visual-title',
    parentId: 'tpl-beautyproducts-wix-showcase-visual',
    rect: { x: 32, y: 36, width: 300, height: 40 },
    text: 'Visual proof area',
    fontSize: 24,
    color: '#123b63',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-showcase-visual-copy',
    parentId: 'tpl-beautyproducts-wix-showcase-visual',
    rect: { x: 32, y: 94, width: 330, height: 54 },
    text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.',
    fontSize: 15,
    color: '#475569',
    lineHeight: 1.42,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-beautyproducts-wix-showcase-card-1',
    parentId: 'tpl-beautyproducts-wix-showcase',
    rect: { x: 56, y: 310, width: 320, height: 170 },
    background: '#f8fafc',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 18,
    padding: 0,
    className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-beautyproducts-wix-showcase-card-1-title',
    parentId: 'tpl-beautyproducts-wix-showcase-card-1',
    rect: { x: 24, y: 26, width: 250, height: 34 },
    text: '핵심 가치',
    fontSize: 22,
    color: '#123b63',
    fontWeight: 'bold',
    className: 'card-title',
  }),
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
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
