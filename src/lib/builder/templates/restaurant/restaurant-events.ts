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
const INTRO_Y = HEADER_H + 40;
const INTRO_H = 200;
const CARDS_Y = INTRO_Y + INTRO_H + 80;
const CARD_W = 260;
const CARD_H = 320;
const GAP = 24;
const CTA_Y = CARDS_Y + CARD_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

interface EventType {
  key: string;
  title: string;
  desc: string;
  img: string;
}

const eventTypes: EventType[] = [
  { key: 'wedding', title: '웨딩 리셉션', desc: '아름다운 공간에서 잊지 못할 결혼 피로연을 준비해 드립니다.', img: 'placeholder-event-wedding.jpg' },
  { key: 'corporate', title: '기업 행사', desc: '비즈니스 미팅, 회식, 워크숍 등 기업 행사를 전문적으로 지원합니다.', img: 'placeholder-event-corporate.jpg' },
  { key: 'birthday', title: '생일 파티', desc: '특별한 생일을 위한 맞춤 파티 서비스를 제공합니다.', img: 'placeholder-event-birthday.jpg' },
  { key: 'private', title: '프라이빗 디너', desc: '소규모 모임을 위한 프라이빗 다이닝 룸을 운영합니다.', img: 'placeholder-event-private.jpg' },
];

function buildEventCard(event: EventType, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (CARD_W + GAP);
  const cid = `tpl-restevents-card-${event.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: CARDS_Y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 160 },
      src: `/images/${event.img}`,
      alt: `${event.title} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 16, y: 172, width: CARD_W - 32, height: 36 }, event.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 16, y: 216, width: CARD_W - 32, height: 80 },
      text: event.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restevents-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '이벤트 & 행사',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restevents-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '특별한 날을 더욱 빛나게 만들어 드립니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Intro ───────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restevents-intro',
    rect: { x: MARGIN, y: INTRO_Y, width: W - MARGIN * 2, height: INTRO_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  createTextNode({
    id: 'tpl-restevents-intro-text',
    parentId: 'tpl-restevents-intro',
    rect: { x: 32, y: 32, width: 800, height: 120 },
    text: '우리 레스토랑은 다양한 행사를 위한 맞춤 서비스를 제공합니다. 최대 80명까지 수용 가능한 넓은 공간과 전문 이벤트 코디네이터가 여러분의 행사를 완벽하게 준비해 드립니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Event type cards ────────────────────────────────────── */
  ...eventTypes.flatMap((event, i) => buildEventCard(event, i)),

  /* ── Inquiry CTA ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restevents-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-restevents-cta-text',
    parentId: 'tpl-restevents-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '이벤트에 대해 문의하시면 맞춤 견적을 안내해 드립니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-restevents-cta-btn',
    parentId: 'tpl-restevents-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '행사 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restaurantevents-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-proof-label', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-proof-title', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'restaurant events 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-proof-copy', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-metric-1', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-1-value', parentId: 'tpl-restaurantevents-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-1-label', parentId: 'tpl-restaurantevents-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-metric-2', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-2-value', parentId: 'tpl-restaurantevents-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-2-label', parentId: 'tpl-restaurantevents-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-metric-3', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-3-value', parentId: 'tpl-restaurantevents-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-3-label', parentId: 'tpl-restaurantevents-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-metric-4', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-4-value', parentId: 'tpl-restaurantevents-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-metric-4-label', parentId: 'tpl-restaurantevents-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-label', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-title', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-copy', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-showcase-visual', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-visual-title', parentId: 'tpl-restaurantevents-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-visual-copy', parentId: 'tpl-restaurantevents-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-showcase-card-1', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-card-1-title', parentId: 'tpl-restaurantevents-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-card-1-copy', parentId: 'tpl-restaurantevents-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-showcase-card-2', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-card-2-title', parentId: 'tpl-restaurantevents-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-card-2-copy', parentId: 'tpl-restaurantevents-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-showcase-card-3', parentId: 'tpl-restaurantevents-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-card-3-title', parentId: 'tpl-restaurantevents-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-showcase-card-3-copy', parentId: 'tpl-restaurantevents-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-quote', parentId: 'tpl-restaurantevents-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-quote-mark', parentId: 'tpl-restaurantevents-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-quote-body', parentId: 'tpl-restaurantevents-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-quote-role', parentId: 'tpl-restaurantevents-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-cta-label', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-cta-title', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-cta-copy', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-restaurantevents-wix-cta-primary', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-restaurantevents-wix-cta-secondary', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-restaurantevents-wix-cta-note', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-restaurantevents-wix-timeline', parentId: 'tpl-restaurantevents-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
]);

export const restaurantEventsTemplate: PageTemplate = {
  id: 'restaurant-events',
  name: '레스토랑 이벤트',
  category: 'restaurant',
  subcategory: 'events',
  description: '이벤트 소개 + 4종 이벤트 카드 + 문의 CTA',
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
