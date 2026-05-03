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
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-realestatelistings-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-proof-label', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-proof-title', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'realestate listings 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-proof-copy', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-metric-1', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-1-value', parentId: 'tpl-realestatelistings-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-1-label', parentId: 'tpl-realestatelistings-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-metric-2', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-2-value', parentId: 'tpl-realestatelistings-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-2-label', parentId: 'tpl-realestatelistings-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-metric-3', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-3-value', parentId: 'tpl-realestatelistings-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-3-label', parentId: 'tpl-realestatelistings-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-metric-4', parentId: 'tpl-realestatelistings-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-4-value', parentId: 'tpl-realestatelistings-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-metric-4-label', parentId: 'tpl-realestatelistings-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-label', parentId: 'tpl-realestatelistings-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-title', parentId: 'tpl-realestatelistings-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-copy', parentId: 'tpl-realestatelistings-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-showcase-visual', parentId: 'tpl-realestatelistings-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-visual-title', parentId: 'tpl-realestatelistings-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-visual-copy', parentId: 'tpl-realestatelistings-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-showcase-card-1', parentId: 'tpl-realestatelistings-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-card-1-title', parentId: 'tpl-realestatelistings-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-card-1-copy', parentId: 'tpl-realestatelistings-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatelistings-wix-showcase-card-2', parentId: 'tpl-realestatelistings-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-card-2-title', parentId: 'tpl-realestatelistings-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatelistings-wix-showcase-card-2-copy', parentId: 'tpl-realestatelistings-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
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
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
