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
const CARD_H = 220;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface Testimonial {
  key: string;
  quote: string;
  name: string;
  stars: string;
}

const testimonials: Testimonial[] = [
  { key: 'client-1', quote: '대만에서 법인을 설립할 때 정말 큰 도움을 받았습니다. 복잡한 절차를 친절하게 안내해 주셔서 감사합니다.', name: '김OO (기업 고객)', stars: '★★★★★' },
  { key: 'client-2', quote: '이민 비자 문제로 고민이 많았는데, 전문적인 상담 덕분에 빠르게 해결할 수 있었습니다. 정말 추천합니다.', name: '이OO (이민 고객)', stars: '★★★★★' },
  { key: 'client-3', quote: '부동산 매매 과정에서 발생한 분쟁을 원만하게 해결해 주셨습니다. 세심한 법률 자문에 감사드립니다.', name: '박OO (부동산 고객)', stars: '★★★★★' },
  { key: 'client-4', quote: '국제 이혼 소송에서 양육권을 확보할 수 있도록 도와주셔서 감사합니다. 어려운 시기에 큰 힘이 되었습니다.', name: '최OO (가족법 고객)', stars: '★★★★★' },
  { key: 'client-5', quote: '한국어로 상담받을 수 있어서 정말 편했습니다. 법률 용어도 쉽게 설명해 주셔서 상황을 잘 이해할 수 있었어요.', name: '정OO (개인 고객)', stars: '★★★★☆' },
  { key: 'client-6', quote: '노동법 관련 분쟁에서 좋은 결과를 얻을 수 있었습니다. 전문적이고 신속한 대응에 매우 만족합니다.', name: '한OO (노동법 고객)', stars: '★★★★★' },
];

function buildTestimonialCard(t: Testimonial, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-testi-card-${t.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    createTextNode({
      id: `${cid}-stars`,
      parentId: cid,
      rect: { x: 24, y: 20, width: 120, height: 24 },
      text: t.stars,
      fontSize: 18,
      color: '#e8a838',
      fontWeight: 'regular',
    }),
    createTextNode({
      id: `${cid}-quote`,
      parentId: cid,
      rect: { x: 24, y: 54, width: 322, height: 100 },
      text: `"${t.quote}"`,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-name`,
      parentId: cid,
      rect: { x: 24, y: 168, width: 200, height: 28 },
      text: `— ${t.name}`,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-testi-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '고객 후기',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-testi-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '저희 법률사무소를 이용하신 고객님들의 생생한 후기입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...testimonials.flatMap((t, i) => buildTestimonialCard(t, i)),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-proof-label', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-proof-title', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'law testimonials 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-proof-copy', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-metric-1', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-1-value', parentId: 'tpl-lawtestimonials-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-1-label', parentId: 'tpl-lawtestimonials-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-metric-2', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-2-value', parentId: 'tpl-lawtestimonials-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-2-label', parentId: 'tpl-lawtestimonials-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-metric-3', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-3-value', parentId: 'tpl-lawtestimonials-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-3-label', parentId: 'tpl-lawtestimonials-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-metric-4', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-4-value', parentId: 'tpl-lawtestimonials-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-metric-4-label', parentId: 'tpl-lawtestimonials-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-label', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-title', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-copy', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-showcase-visual', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-visual-title', parentId: 'tpl-lawtestimonials-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-visual-copy', parentId: 'tpl-lawtestimonials-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-1', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-1-title', parentId: 'tpl-lawtestimonials-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-1-copy', parentId: 'tpl-lawtestimonials-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-2', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-2-title', parentId: 'tpl-lawtestimonials-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-2-copy', parentId: 'tpl-lawtestimonials-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-3', parentId: 'tpl-lawtestimonials-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-3-title', parentId: 'tpl-lawtestimonials-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-showcase-card-3-copy', parentId: 'tpl-lawtestimonials-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-quote', parentId: 'tpl-lawtestimonials-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-quote-mark', parentId: 'tpl-lawtestimonials-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-quote-body', parentId: 'tpl-lawtestimonials-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-quote-role', parentId: 'tpl-lawtestimonials-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-cta-label', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-cta-title', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-cta-copy', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-lawtestimonials-wix-cta-primary', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-lawtestimonials-wix-cta-secondary', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-lawtestimonials-wix-cta-note', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawtestimonials-wix-timeline', parentId: 'tpl-lawtestimonials-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
]);

export const lawTestimonialsTemplate: PageTemplate = {
  id: 'law-testimonials',
  name: '고객 후기',
  category: 'law',
  subcategory: 'testimonials',
  description: '섹션 제목 + 6개 후기 카드(별점 + 인용문 + 고객명)',
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
