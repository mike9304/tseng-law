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
const TIERS_Y = HERO_H + 80;
const TIERS_H = 480;
const COMPARE_Y = TIERS_Y + TIERS_H + 80;
const COMPARE_H = 300;
const STAGE_H = COMPARE_Y + COMPARE_H + 80;

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

const tiers = [
  { name: 'Free', price: '무료', desc: '개인 사용자, 기본 기능\n사용자 1명\n프로젝트 3개\n기본 분석', cta: '무료 시작' },
  { name: 'Pro', price: '월 49,000원', desc: '성장하는 팀을 위한 플랜\n사용자 10명\n무제한 프로젝트\n고급 분석 + API', cta: '무료 체험' },
  { name: 'Enterprise', price: '맞춤 견적', desc: '대규모 조직 전용\n무제한 사용자\n전용 서버\nSSO + 감사 로그 + 전담 지원', cta: '문의하기' },
];

const tierW = 360;
const gapX = 30;

const tierCards: BuilderCanvasNode[] = tiers.flatMap((t, i) => {
  const x = 80 + i * (tierW + gapX);
  const prefix = `tpl-stupprc-tier-${i + 1}`;
  const bg = i === 1 ? '#123b63' : '#f3f4f6';
  const textColor = i === 1 ? '#ffffff' : '#1f2937';
  const titleColor = i === 1 ? '#ffffff' : '#123b63';
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: TIERS_Y + 70, width: tierW, height: 380 },
      background: bg,
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 312, height: 36 }, t.name, 3, titleColor, 'center', prefix),
    createTextNode({
      id: `${prefix}-price`,
      parentId: prefix,
      rect: { x: 24, y: 76, width: 312, height: 40 },
      text: t.price,
      fontSize: 22,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `${prefix}-desc`,
      parentId: prefix,
      rect: { x: 24, y: 130, width: 312, height: 130 },
      text: t.desc,
      fontSize: 14,
      color: textColor,
      lineHeight: 1.6,
      align: 'center',
    }),
    createButtonNode({
      id: `${prefix}-btn`,
      parentId: prefix,
      rect: { x: 80, y: 300, width: 200, height: 48 },
      label: t.cta,
      href: '#',
      variant: i === 1 ? 'secondary' : 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupprc-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupprc-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '요금제', 1, '#ffffff', 'left', 'tpl-stupprc-hero'),
  createTextNode({
    id: 'tpl-stupprc-hero-sub',
    parentId: 'tpl-stupprc-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '팀 규모와 니즈에 맞는 요금제를 선택하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stupprc-tiers-title', { x: 80, y: TIERS_Y, width: 400, height: 50 }, '플랜 비교', 2, '#123b63', 'left'),
  ...tierCards,

  /* ── Feature comparison ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupprc-compare',
    rect: { x: 0, y: COMPARE_Y, width: W, height: COMPARE_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupprc-compare-title', { x: 80, y: 40, width: 400, height: 50 }, '기능 비교표', 2, '#123b63', 'left', 'tpl-stupprc-compare'),
  createTextNode({
    id: 'tpl-stupprc-compare-desc',
    parentId: 'tpl-stupprc-compare',
    rect: { x: 80, y: 100, width: 1000, height: 160 },
    text: '기본 분석: Free / Pro / Enterprise\nAPI 연동: - / Pro / Enterprise\nSSO: - / - / Enterprise\n전담 지원: - / - / Enterprise\n워크플로우 자동화: 3개 / 무제한 / 무제한\n사용자 수: 1명 / 10명 / 무제한',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.7,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-startuppricing-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-proof-label', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-proof-title', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'startup pricing 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-proof-copy', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-metric-1', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-1-value', parentId: 'tpl-startuppricing-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-1-label', parentId: 'tpl-startuppricing-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-metric-2', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-2-value', parentId: 'tpl-startuppricing-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-2-label', parentId: 'tpl-startuppricing-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-metric-3', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-3-value', parentId: 'tpl-startuppricing-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-3-label', parentId: 'tpl-startuppricing-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-metric-4', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-4-value', parentId: 'tpl-startuppricing-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-metric-4-label', parentId: 'tpl-startuppricing-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-label', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-title', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-copy', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-showcase-visual', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-visual-title', parentId: 'tpl-startuppricing-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-visual-copy', parentId: 'tpl-startuppricing-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-showcase-card-1', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-card-1-title', parentId: 'tpl-startuppricing-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-card-1-copy', parentId: 'tpl-startuppricing-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-showcase-card-2', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-card-2-title', parentId: 'tpl-startuppricing-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-card-2-copy', parentId: 'tpl-startuppricing-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-showcase-card-3', parentId: 'tpl-startuppricing-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-card-3-title', parentId: 'tpl-startuppricing-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-showcase-card-3-copy', parentId: 'tpl-startuppricing-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startuppricing-wix-quote', parentId: 'tpl-startuppricing-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-quote-mark', parentId: 'tpl-startuppricing-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-quote-body', parentId: 'tpl-startuppricing-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-quote-role', parentId: 'tpl-startuppricing-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-cta-label', parentId: 'tpl-startuppricing-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-cta-title', parentId: 'tpl-startuppricing-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-cta-copy', parentId: 'tpl-startuppricing-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-startuppricing-wix-cta-primary', parentId: 'tpl-startuppricing-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-startuppricing-wix-cta-secondary', parentId: 'tpl-startuppricing-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-startuppricing-wix-cta-note', parentId: 'tpl-startuppricing-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
]);

export const startupPricingTemplate: PageTemplate = {
  id: 'startup-pricing',
  name: '스타트업 요금제',
  category: 'startup',
  subcategory: 'pricing',
  description: 'SaaS 요금(3단계): Free/Pro/Enterprise + 기능 비교표',
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
