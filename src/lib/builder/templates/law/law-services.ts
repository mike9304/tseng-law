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

/* ── Layout constants ────────────────────────────────────────── */
const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 300;
const GAP = 24;
const MARGIN = 80;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface ServiceDef {
  key: string;
  icon: string;
  title: string;
  desc: string;
}

const services: ServiceDef[] = [
  { key: 'corp', icon: 'placeholder-corporate.jpg', title: '기업법 자문', desc: '법인 설립, 정관 작성, 주주 계약, M&A 등 기업 운영에 필요한 모든 법률 서비스를 제공합니다.' },
  { key: 'realestate', icon: 'placeholder-realestate.jpg', title: '부동산 거래', desc: '매매 계약, 임대차, 등기, 개발 인허가 등 부동산 관련 전문 법률 자문을 수행합니다.' },
  { key: 'immigration', icon: 'placeholder-immigration.jpg', title: '이민 · 비자', desc: '취업 비자, 투자 비자, 거류증 연장, 영주권 및 귀화 절차를 전문적으로 지원합니다.' },
  { key: 'family', icon: 'placeholder-family.jpg', title: '가족법', desc: '이혼, 양육권, 재산 분할, 상속, 유언장 작성 등 가족 관련 법률 문제를 처리합니다.' },
  { key: 'labor', icon: 'placeholder-labor.jpg', title: '노동법', desc: '근로 계약, 부당 해고, 산업 재해, 퇴직금 분쟁 등 노동 관련 법률 서비스를 제공합니다.' },
  { key: 'ip', icon: 'placeholder-ip.jpg', title: '지적재산권', desc: '상표 등록, 특허 출원, 저작권 보호, 기술 이전 계약 등 IP 관련 자문을 합니다.' },
];

function buildServiceCard(s: ServiceDef, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-svc-card-${s.key}`;

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
    createImageNode({
      id: `${cid}-icon`,
      parentId: cid,
      rect: { x: 24, y: 24, width: 48, height: 48 },
      src: `/images/${s.icon}`,
      alt: `${s.title} 아이콘`,
      style: { borderRadius: 8 },
    }),
    heading(`${cid}-title`, { x: 24, y: 88, width: 322, height: 36 }, s.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 136, width: 322, height: 80 },
      text: s.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 24, y: 232, width: 130, height: 40 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-svc-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '업무 분야',
    1,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-svc-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '각 분야 전문 변호사가 최적의 법률 솔루션을 제공합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...services.flatMap((s, i) => buildServiceCard(s, i)),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-lawservices-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-proof-label', parentId: 'tpl-lawservices-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-proof-title', parentId: 'tpl-lawservices-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'law services 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-proof-copy', parentId: 'tpl-lawservices-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-metric-1', parentId: 'tpl-lawservices-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-1-value', parentId: 'tpl-lawservices-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-1-label', parentId: 'tpl-lawservices-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-metric-2', parentId: 'tpl-lawservices-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-2-value', parentId: 'tpl-lawservices-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-2-label', parentId: 'tpl-lawservices-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-metric-3', parentId: 'tpl-lawservices-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-3-value', parentId: 'tpl-lawservices-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-3-label', parentId: 'tpl-lawservices-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-metric-4', parentId: 'tpl-lawservices-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-4-value', parentId: 'tpl-lawservices-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-metric-4-label', parentId: 'tpl-lawservices-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-label', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-title', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-copy', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-showcase-visual', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-visual-title', parentId: 'tpl-lawservices-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-visual-copy', parentId: 'tpl-lawservices-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-showcase-card-1', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-card-1-title', parentId: 'tpl-lawservices-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-card-1-copy', parentId: 'tpl-lawservices-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-showcase-card-2', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-card-2-title', parentId: 'tpl-lawservices-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-card-2-copy', parentId: 'tpl-lawservices-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-showcase-card-3', parentId: 'tpl-lawservices-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-card-3-title', parentId: 'tpl-lawservices-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-showcase-card-3-copy', parentId: 'tpl-lawservices-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-lawservices-wix-quote', parentId: 'tpl-lawservices-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-quote-mark', parentId: 'tpl-lawservices-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-quote-body', parentId: 'tpl-lawservices-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-quote-role', parentId: 'tpl-lawservices-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-lawservices-wix-cta-label', parentId: 'tpl-lawservices-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
]);

export const lawServicesTemplate: PageTemplate = {
  id: 'law-services',
  name: '업무 분야',
  category: 'law',
  subcategory: 'services',
  description: '섹션 제목 + 6개 서비스 카드(아이콘 + 제목 + 설명 + 버튼)',
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
