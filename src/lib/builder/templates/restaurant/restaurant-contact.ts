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
const FORM_Y = HEADER_H + 40;
const FORM_H = 400;
const MAP_Y = FORM_Y + FORM_H + 80;
const MAP_H = 360;
const INFO_Y = MAP_Y + MAP_H + 80;
const INFO_H = 200;
const STAGE_H = INFO_Y + INFO_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restcontact-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '예약 및 문의',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restcontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '예약이나 문의사항이 있으시면 언제든지 연락해 주세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Reservation form area ───────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-form',
    rect: { x: MARGIN, y: FORM_Y, width: 600, height: FORM_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-restcontact-form-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '예약 신청',
    2,
    '#123b63',
    'left',
    'tpl-restcontact-form',
  ),
  createTextNode({
    id: 'tpl-restcontact-form-desc',
    parentId: 'tpl-restcontact-form',
    rect: { x: 32, y: 80, width: 500, height: 80 },
    text: '날짜, 시간, 인원 수를 알려주시면 빠르게 예약을 확인해 드립니다. 특별 요청사항이 있으시면 메시지란에 남겨 주세요.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-restcontact-form-btn',
    parentId: 'tpl-restcontact-form',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '예약 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Side info ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-info',
    rect: { x: 720, y: FORM_Y, width: 480, height: FORM_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-restcontact-info-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '연락처 정보',
    2,
    '#ffffff',
    'left',
    'tpl-restcontact-info',
  ),
  createTextNode({
    id: 'tpl-restcontact-phone',
    parentId: 'tpl-restcontact-info',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '전화: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-restcontact-hours',
    parentId: 'tpl-restcontact-info',
    rect: { x: 32, y: 140, width: 400, height: 60 },
    text: '영업시간\n월~토: 11:30 - 22:00\n일: 12:00 - 21:00',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-restcontact-address',
    parentId: 'tpl-restcontact-info',
    rect: { x: 32, y: 230, width: 400, height: 40 },
    text: '서울시 강남구 테헤란로 123 레스토랑빌딩 1층',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.4,
  }),

  /* ── Map ──────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-map',
    rect: { x: MARGIN, y: MAP_Y, width: W - MARGIN * 2, height: MAP_H },
    background: '#e2e8f0',
    borderRadius: 12,
  }),
  createImageNode({
    id: 'tpl-restcontact-map-img',
    parentId: 'tpl-restcontact-map',
    rect: { x: 0, y: 0, width: W - MARGIN * 2, height: MAP_H },
    src: '/images/placeholder-map.jpg',
    alt: '레스토랑 위치 지도',
    style: { borderRadius: 12 },
  }),

  /* ── Hours strip ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcontact-strip',
    rect: { x: 0, y: INFO_Y, width: W, height: INFO_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-restcontact-strip-text',
    parentId: 'tpl-restcontact-strip',
    rect: { x: MARGIN, y: 60, width: 600, height: 60 },
    text: '특별한 날의 프라이빗 다이닝도 예약 가능합니다. 전화로 문의해 주세요.',
    fontSize: 18,
    color: '#123b63',
    fontWeight: 'medium',
    lineHeight: 1.5,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-proof-label', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-proof-title', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'restaurant contact 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-proof-copy', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-metric-1', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-1-value', parentId: 'tpl-restaurantcontact-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-1-label', parentId: 'tpl-restaurantcontact-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-metric-2', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-2-value', parentId: 'tpl-restaurantcontact-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-2-label', parentId: 'tpl-restaurantcontact-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-metric-3', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-3-value', parentId: 'tpl-restaurantcontact-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-3-label', parentId: 'tpl-restaurantcontact-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-metric-4', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-4-value', parentId: 'tpl-restaurantcontact-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-metric-4-label', parentId: 'tpl-restaurantcontact-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-label', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-title', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-copy', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-showcase-visual', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-visual-title', parentId: 'tpl-restaurantcontact-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-visual-copy', parentId: 'tpl-restaurantcontact-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-1', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-1-title', parentId: 'tpl-restaurantcontact-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-1-copy', parentId: 'tpl-restaurantcontact-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-2', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-2-title', parentId: 'tpl-restaurantcontact-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-2-copy', parentId: 'tpl-restaurantcontact-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-3', parentId: 'tpl-restaurantcontact-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-3-title', parentId: 'tpl-restaurantcontact-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-showcase-card-3-copy', parentId: 'tpl-restaurantcontact-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantcontact-wix-quote', parentId: 'tpl-restaurantcontact-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-quote-mark', parentId: 'tpl-restaurantcontact-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-quote-body', parentId: 'tpl-restaurantcontact-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-quote-role', parentId: 'tpl-restaurantcontact-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-cta-label', parentId: 'tpl-restaurantcontact-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-cta-title', parentId: 'tpl-restaurantcontact-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantcontact-wix-cta-copy', parentId: 'tpl-restaurantcontact-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
]);

export const restaurantContactTemplate: PageTemplate = {
  id: 'restaurant-contact',
  name: '레스토랑 예약/문의',
  category: 'restaurant',
  subcategory: 'contact',
  description: '예약 폼 영역 + 지도 + 영업시간 + 전화번호',
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
