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
const CONTENT_W = W - MARGIN * 2;

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
const STEP_H = 120;
const STEP_GAP = 16;

interface Step {
  key: string;
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  { key: 'budget', num: '01', title: '예산 설정', desc: '자금 계획을 세우고, 대출 가능 금액을 확인합니다.' },
  { key: 'search', num: '02', title: '매물 검색', desc: '원하는 지역, 유형, 조건에 맞는 매물을 검색합니다.' },
  { key: 'visit', num: '03', title: '현장 방문', desc: '관심 매물을 직접 방문하여 상태를 확인합니다.' },
  { key: 'contract', num: '04', title: '계약 체결', desc: '계약 조건을 협의하고, 매매 계약서를 작성합니다.' },
  { key: 'loan', num: '05', title: '대출 실행', desc: '주택담보대출 등 필요한 자금을 마련합니다.' },
  { key: 'transfer', num: '06', title: '소유권 이전', desc: '잔금을 지급하고, 등기를 통해 소유권을 이전합니다.' },
];

function buildStepCard(step: Step, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (STEP_H + STEP_GAP);
  const cid = `tpl-rebuying-step-${step.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: STEP_H },
      background: idx % 2 === 0 ? '#f3f4f6' : '#ffffff',
      borderRadius: 10,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    createTextNode({
      id: `${cid}-num`,
      parentId: cid,
      rect: { x: 24, y: 20, width: 60, height: 40 },
      text: step.num,
      fontSize: 32,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    heading(`${cid}-title`, { x: 100, y: 20, width: 300, height: 32 }, step.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 100, y: 60, width: CONTENT_W - 160, height: 40 },
      text: step.desc,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const MORTGAGE_Y = HEADER_H + 40 + steps.length * (STEP_H + STEP_GAP) + 60;
const MORTGAGE_H = 280;
const STAGE_H = MORTGAGE_Y + MORTGAGE_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-rebuying-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '매수 가이드',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-rebuying-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '처음 집을 구매하시는 분을 위한 단계별 안내입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  ...steps.flatMap((s, i) => buildStepCard(s, i)),

  /* ── Mortgage info ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-rebuying-mortgage',
    rect: { x: 0, y: MORTGAGE_Y, width: W, height: MORTGAGE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-rebuying-mortgage-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '대출 정보',
    2,
    '#ffffff',
    'left',
    'tpl-rebuying-mortgage',
  ),
  createTextNode({
    id: 'tpl-rebuying-mortgage-desc',
    parentId: 'tpl-rebuying-mortgage',
    rect: { x: MARGIN, y: 100, width: 800, height: 80 },
    text: '주택담보대출, 전세자금대출 등 다양한 대출 상품을 비교해 드립니다. 금리, 한도, 상환 방식 등을 종합적으로 분석하여 최적의 대출 전략을 제안합니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
  createButtonNode({
    id: 'tpl-rebuying-mortgage-btn',
    parentId: 'tpl-rebuying-mortgage',
    rect: { x: MARGIN, y: 210, width: 180, height: 48 },
    label: '대출 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-realestatebuying-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-proof-label', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-proof-title', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'realestate buying 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-proof-copy', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-metric-1', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-1-value', parentId: 'tpl-realestatebuying-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-1-label', parentId: 'tpl-realestatebuying-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-metric-2', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-2-value', parentId: 'tpl-realestatebuying-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-2-label', parentId: 'tpl-realestatebuying-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-metric-3', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-3-value', parentId: 'tpl-realestatebuying-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-3-label', parentId: 'tpl-realestatebuying-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-metric-4', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-4-value', parentId: 'tpl-realestatebuying-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-metric-4-label', parentId: 'tpl-realestatebuying-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-label', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-title', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-copy', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-showcase-visual', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-visual-title', parentId: 'tpl-realestatebuying-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-visual-copy', parentId: 'tpl-realestatebuying-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-showcase-card-1', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-card-1-title', parentId: 'tpl-realestatebuying-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-card-1-copy', parentId: 'tpl-realestatebuying-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-showcase-card-2', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-card-2-title', parentId: 'tpl-realestatebuying-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-card-2-copy', parentId: 'tpl-realestatebuying-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-showcase-card-3', parentId: 'tpl-realestatebuying-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-card-3-title', parentId: 'tpl-realestatebuying-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-showcase-card-3-copy', parentId: 'tpl-realestatebuying-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-realestatebuying-wix-quote', parentId: 'tpl-realestatebuying-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-quote-mark', parentId: 'tpl-realestatebuying-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-quote-body', parentId: 'tpl-realestatebuying-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-quote-role', parentId: 'tpl-realestatebuying-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-cta-label', parentId: 'tpl-realestatebuying-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-cta-title', parentId: 'tpl-realestatebuying-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-realestatebuying-wix-cta-copy', parentId: 'tpl-realestatebuying-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
]);

export const realestateBuyingTemplate: PageTemplate = {
  id: 'realestate-buying',
  name: '매수 가이드',
  category: 'realestate',
  subcategory: 'buying',
  description: '매수 6단계 프로세스 + 대출 정보',
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
