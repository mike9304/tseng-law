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
const OFFICES_Y = FORM_Y + FORM_H + 80;
const OFFICES_H = 280;
const STAGE_H = OFFICES_Y + OFFICES_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-recontact-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '문의하기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-recontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '매물 문의나 상담 요청을 남겨주세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Inquiry form area ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-recontact-form',
    rect: { x: MARGIN, y: FORM_Y, width: 600, height: FORM_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-recontact-form-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '상담 신청',
    2,
    '#123b63',
    'left',
    'tpl-recontact-form',
  ),
  createTextNode({
    id: 'tpl-recontact-form-desc',
    parentId: 'tpl-recontact-form',
    rect: { x: 32, y: 80, width: 500, height: 100 },
    text: '관심 있는 매물이나 지역, 예산 등을 알려주시면 맞춤 매물을 추천해 드립니다. 무료 상담이며, 빠른 시간 내에 연락드리겠습니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-recontact-form-btn',
    parentId: 'tpl-recontact-form',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '상담 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Contact info ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-recontact-info',
    rect: { x: 720, y: FORM_Y, width: 480, height: FORM_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-recontact-info-title',
    { x: 32, y: 24, width: 400, height: 40 },
    '연락처',
    2,
    '#ffffff',
    'left',
    'tpl-recontact-info',
  ),
  createTextNode({
    id: 'tpl-recontact-phone',
    parentId: 'tpl-recontact-info',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '대표전화: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-recontact-email',
    parentId: 'tpl-recontact-info',
    rect: { x: 32, y: 130, width: 400, height: 30 },
    text: '이메일: info@realestate-example.kr',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  }),
  createTextNode({
    id: 'tpl-recontact-hours',
    parentId: 'tpl-recontact-info',
    rect: { x: 32, y: 180, width: 400, height: 60 },
    text: '상담시간\n평일: 09:00 - 18:00\n토요일: 10:00 - 15:00',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.6,
  }),

  /* ── Office locations ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-recontact-offices',
    rect: { x: 0, y: OFFICES_Y, width: W, height: OFFICES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-recontact-offices-title',
    { x: MARGIN, y: 40, width: 300, height: 44 },
    '사무소 위치',
    2,
    '#123b63',
    'left',
    'tpl-recontact-offices',
  ),
  createContainerNode({
    id: 'tpl-recontact-office-1',
    parentId: 'tpl-recontact-offices',
    rect: { x: MARGIN, y: 100, width: 480, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 24,
  }),
  heading('tpl-recontact-office-1-title', { x: 24, y: 16, width: 300, height: 28 }, '강남 본점', 3, '#123b63', 'left', 'tpl-recontact-office-1'),
  createTextNode({
    id: 'tpl-recontact-office-1-addr',
    parentId: 'tpl-recontact-office-1',
    rect: { x: 24, y: 52, width: 400, height: 60 },
    text: '서울시 강남구 테헤란로 456\n02-1234-5678',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-recontact-office-2',
    parentId: 'tpl-recontact-offices',
    rect: { x: 600, y: 100, width: 480, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 24,
  }),
  heading('tpl-recontact-office-2-title', { x: 24, y: 16, width: 300, height: 28 }, '여의도 지점', 3, '#123b63', 'left', 'tpl-recontact-office-2'),
  createTextNode({
    id: 'tpl-recontact-office-2-addr',
    parentId: 'tpl-recontact-office-2',
    rect: { x: 24, y: 52, width: 400, height: 60 },
    text: '서울시 영등포구 여의대로 789\n02-9876-5432',
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 1.5,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-realestatecontact-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-proof-label', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-proof-title', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'realestate contact 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-proof-copy', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-metric-1', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-1-value', parentId: 'tpl-realestatecontact-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-1-label', parentId: 'tpl-realestatecontact-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-metric-2', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-2-value', parentId: 'tpl-realestatecontact-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-2-label', parentId: 'tpl-realestatecontact-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-metric-3', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-3-value', parentId: 'tpl-realestatecontact-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-3-label', parentId: 'tpl-realestatecontact-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-metric-4', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-4-value', parentId: 'tpl-realestatecontact-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-metric-4-label', parentId: 'tpl-realestatecontact-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-label', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-title', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-copy', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-showcase-visual', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-visual-title', parentId: 'tpl-realestatecontact-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-visual-copy', parentId: 'tpl-realestatecontact-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-showcase-card-1', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-card-1-title', parentId: 'tpl-realestatecontact-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-card-1-copy', parentId: 'tpl-realestatecontact-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-showcase-card-2', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-card-2-title', parentId: 'tpl-realestatecontact-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-card-2-copy', parentId: 'tpl-realestatecontact-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-showcase-card-3', parentId: 'tpl-realestatecontact-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-card-3-title', parentId: 'tpl-realestatecontact-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-showcase-card-3-copy', parentId: 'tpl-realestatecontact-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatecontact-wix-quote', parentId: 'tpl-realestatecontact-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-quote-mark', parentId: 'tpl-realestatecontact-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatecontact-wix-quote-body', parentId: 'tpl-realestatecontact-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
]);

export const realestateContactTemplate: PageTemplate = {
  id: 'realestate-contact',
  name: '부동산 문의',
  category: 'realestate',
  subcategory: 'contact',
  description: '상담 신청 폼 + 사무소 위치 + 연락처',
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
