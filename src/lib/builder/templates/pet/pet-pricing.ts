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
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-petpricing-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-proof-label', parentId: 'tpl-petpricing-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-proof-title', parentId: 'tpl-petpricing-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'pet pricing 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-proof-copy', parentId: 'tpl-petpricing-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-metric-1', parentId: 'tpl-petpricing-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-1-value', parentId: 'tpl-petpricing-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-1-label', parentId: 'tpl-petpricing-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-metric-2', parentId: 'tpl-petpricing-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-2-value', parentId: 'tpl-petpricing-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-2-label', parentId: 'tpl-petpricing-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-metric-3', parentId: 'tpl-petpricing-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-3-value', parentId: 'tpl-petpricing-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-3-label', parentId: 'tpl-petpricing-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-metric-4', parentId: 'tpl-petpricing-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-4-value', parentId: 'tpl-petpricing-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-metric-4-label', parentId: 'tpl-petpricing-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-label', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-title', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-copy', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-showcase-visual', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-visual-title', parentId: 'tpl-petpricing-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-visual-copy', parentId: 'tpl-petpricing-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-showcase-card-1', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-card-1-title', parentId: 'tpl-petpricing-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-card-1-copy', parentId: 'tpl-petpricing-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-showcase-card-2', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-card-2-title', parentId: 'tpl-petpricing-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-card-2-copy', parentId: 'tpl-petpricing-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-showcase-card-3', parentId: 'tpl-petpricing-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-card-3-title', parentId: 'tpl-petpricing-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-showcase-card-3-copy', parentId: 'tpl-petpricing-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petpricing-wix-quote', parentId: 'tpl-petpricing-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-quote-mark', parentId: 'tpl-petpricing-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-quote-body', parentId: 'tpl-petpricing-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-quote-role', parentId: 'tpl-petpricing-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petpricing-wix-cta-label', parentId: 'tpl-petpricing-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
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
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
