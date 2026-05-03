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
const INQUIRY_H = 400;
const CALENDAR_Y = INQUIRY_H + 80;
const CALENDAR_H = 300;
const LOCATION_Y = CALENDAR_Y + CALENDAR_H + 80;
const LOCATION_H = 240;
const STAGE_H = LOCATION_Y + LOCATION_H + 80;

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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Session inquiry ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photocontact-inquiry',
    rect: { x: 0, y: 0, width: W, height: INQUIRY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photocontact-title',
    { x: 80, y: 60, width: 500, height: 50 },
    '촬영 문의',
    1,
    '#ffffff',
    'left',
    'tpl-photocontact-inquiry',
  ),
  createTextNode({
    id: 'tpl-photocontact-desc',
    parentId: 'tpl-photocontact-inquiry',
    rect: { x: 80, y: 130, width: 600, height: 80 },
    text: '원하시는 촬영에 대해 알려주세요. 24시간 이내에 답변 드리겠습니다.\n이메일: photo@studio.co.kr\n전화: 02-555-1234',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.8,
  }),
  createContainerNode({
    id: 'tpl-photocontact-form',
    parentId: 'tpl-photocontact-inquiry',
    rect: { x: 80, y: 240, width: 500, height: 120 },
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-photocontact-form-text',
    parentId: 'tpl-photocontact-form',
    rect: { x: 24, y: 16, width: 452, height: 40 },
    text: '이름 / 연락처 / 촬영 유형 / 희망 날짜',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
  }),
  createButtonNode({
    id: 'tpl-photocontact-form-btn',
    parentId: 'tpl-photocontact-form',
    rect: { x: 24, y: 66, width: 160, height: 44 },
    label: '문의 보내기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Calendar placeholder ───────────────────────────────── */
  heading(
    'tpl-photocontact-cal-title',
    { x: 80, y: CALENDAR_Y, width: 400, height: 50 },
    '촬영 일정',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-photocontact-cal',
    rect: { x: 80, y: CALENDAR_Y + 70, width: W - 160, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-photocontact-cal-text',
    parentId: 'tpl-photocontact-cal',
    rect: { x: 24, y: 60, width: 600, height: 40 },
    text: '캘린더 위젯 영역 — 원하시는 날짜를 선택하세요',
    fontSize: 16,
    color: '#6b7280',
    align: 'center',
  }),

  /* ── Studio location ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photocontact-loc',
    rect: { x: 0, y: LOCATION_Y, width: W, height: LOCATION_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photocontact-loc-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '스튜디오 위치',
    2,
    '#123b63',
    'left',
    'tpl-photocontact-loc',
  ),
  createTextNode({
    id: 'tpl-photocontact-loc-addr',
    parentId: 'tpl-photocontact-loc',
    rect: { x: 80, y: 110, width: 500, height: 80 },
    text: '서울시 마포구 연남로 45 스튜디오빌딩 3층\n지하철 2호선 홍대입구역 3번 출구 도보 5분\n주차 가능 (빌딩 내 지하주차장)',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photographycontact-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-proof-label', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-proof-title', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'photography contact 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-proof-copy', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-metric-1', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-1-value', parentId: 'tpl-photographycontact-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-1-label', parentId: 'tpl-photographycontact-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-metric-2', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-2-value', parentId: 'tpl-photographycontact-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-2-label', parentId: 'tpl-photographycontact-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-metric-3', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-3-value', parentId: 'tpl-photographycontact-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-3-label', parentId: 'tpl-photographycontact-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-metric-4', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-4-value', parentId: 'tpl-photographycontact-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-metric-4-label', parentId: 'tpl-photographycontact-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-label', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-title', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-copy', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-showcase-visual', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-visual-title', parentId: 'tpl-photographycontact-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-visual-copy', parentId: 'tpl-photographycontact-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-showcase-card-1', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-card-1-title', parentId: 'tpl-photographycontact-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-card-1-copy', parentId: 'tpl-photographycontact-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-showcase-card-2', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-card-2-title', parentId: 'tpl-photographycontact-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-card-2-copy', parentId: 'tpl-photographycontact-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-showcase-card-3', parentId: 'tpl-photographycontact-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-card-3-title', parentId: 'tpl-photographycontact-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-showcase-card-3-copy', parentId: 'tpl-photographycontact-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographycontact-wix-quote', parentId: 'tpl-photographycontact-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-quote-mark', parentId: 'tpl-photographycontact-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-quote-body', parentId: 'tpl-photographycontact-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-quote-role', parentId: 'tpl-photographycontact-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-cta-label', parentId: 'tpl-photographycontact-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-cta-title', parentId: 'tpl-photographycontact-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-cta-copy', parentId: 'tpl-photographycontact-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-photographycontact-wix-cta-primary', parentId: 'tpl-photographycontact-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-photographycontact-wix-cta-secondary', parentId: 'tpl-photographycontact-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-photographycontact-wix-cta-note', parentId: 'tpl-photographycontact-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
]);

export const photographyContactTemplate: PageTemplate = {
  id: 'photography-contact',
  name: '사진 스튜디오 문의',
  category: 'photography',
  subcategory: 'contact',
  description: '촬영 문의 영역 + 캘린더 플레이스홀더 + 스튜디오 위치',
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
