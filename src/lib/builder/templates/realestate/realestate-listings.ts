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
const MARGIN = 80;

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

const HEADER_H = 140;
const FILTER_Y = HEADER_H + 40;
const FILTER_H = 60;
const CARD_W = 350;
const CARD_H = 380;
const GAP = 24;
const COLS = 3;
const CARDS_Y = FILTER_Y + FILTER_H + 40;

interface Property {
  key: string;
  title: string;
  price: string;
  beds: string;
  baths: string;
  area: string;
}

const properties: Property[] = [
  { key: 'apt-gangnam', title: '강남 센트럴 아파트', price: '매매 18억원', beds: '4룸', baths: '2화장실', area: '135m²' },
  { key: 'villa-seocho', title: '서초 빌라', price: '전세 5억원', beds: '3룸', baths: '1화장실', area: '85m²' },
  { key: 'officetel-yeouido', title: '여의도 오피스텔', price: '월세 150만원', beds: '1룸', baths: '1화장실', area: '33m²' },
  { key: 'house-pangyo', title: '판교 단독주택', price: '매매 25억원', beds: '5룸', baths: '3화장실', area: '250m²' },
  { key: 'apt-songpa', title: '송파 래미안', price: '매매 12억원', beds: '3룸', baths: '2화장실', area: '100m²' },
  { key: 'studio-hongdae', title: '홍대 원룸', price: '월세 80만원', beds: '1룸', baths: '1화장실', area: '26m²' },
];

function buildPropertyCard(prop: Property, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = CARDS_Y + row * (CARD_H + GAP);
  const cid = `tpl-relistings-card-${prop.key}`;

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
      rect: { x: 0, y: 0, width: CARD_W, height: 200 },
      src: `/images/placeholder-${prop.key}.jpg`,
      alt: `${prop.title} 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 20, y: 212, width: 310, height: 36 }, prop.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 20, y: 254, width: 200, height: 28 },
      text: prop.price,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-details`,
      parentId: cid,
      rect: { x: 20, y: 290, width: 310, height: 28 },
      text: `${prop.beds} / ${prop.baths} / ${prop.area}`,
      fontSize: 14,
      color: '#6b7280',
      lineHeight: 1.4,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 20, y: 330, width: 120, height: 36 },
      label: '상세 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const ROWS = Math.ceil(properties.length / COLS);
const STAGE_H = CARDS_Y + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-relistings-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '매물 목록',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-relistings-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '다양한 지역의 매물을 검색하고 비교해 보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Filter placeholder ──────────────────────────────────── */
  createContainerNode({
    id: 'tpl-relistings-filter',
    rect: { x: MARGIN, y: FILTER_Y, width: W - MARGIN * 2, height: FILTER_H },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 16,
  }),
  createTextNode({
    id: 'tpl-relistings-filter-text',
    parentId: 'tpl-relistings-filter',
    rect: { x: 16, y: 16, width: 600, height: 28 },
    text: '필터: 지역 | 매물 유형 | 가격대 | 방 수',
    fontSize: 14,
    color: '#6b7280',
  }),

  /* ── Property cards ──────────────────────────────────────── */
  ...properties.flatMap((p, i) => buildPropertyCard(p, i)),
]);

export const realestateListingsTemplate: PageTemplate = {
  id: 'realestate-listings',
  name: '매물 목록',
  category: 'realestate',
  subcategory: 'listings',
  description: '매물 그리드(6개) + 필터 + 가격/방/화장실 정보',
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
