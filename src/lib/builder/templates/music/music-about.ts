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
const BIO_H = 400;
const MEMBERS_Y = BIO_H + 80;
const MEMBERS_H = 400;
const INFLUENCES_Y = MEMBERS_Y + MEMBERS_H + 80;
const INFLUENCES_H = 200;
const STAGE_H = INFLUENCES_Y + INFLUENCES_H + 80;

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

const members = [
  { name: '김준호', role: '보컬 / 기타' },
  { name: '이서연', role: '키보드 / 신디사이저' },
  { name: '박민수', role: '베이스' },
  { name: '최지원', role: '드럼' },
];

function memberCard(n: number): BuilderCanvasNode[] {
  const x = 80 + (n - 1) * 290;
  const cId = `tpl-musabout-member-${n}`;
  const m = members[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y: MEMBERS_Y + 70, width: 260, height: 300 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 260, height: 200 },
      src: `/images/placeholder-member-${n}.jpg`,
      alt: `${m.name} 프로필 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 16, y: 212, width: 228, height: 32 }, m.name, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-role`,
      parentId: cId,
      rect: { x: 16, y: 250, width: 228, height: 24 },
      text: m.role,
      fontSize: 14,
      color: '#6b7280',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Artist bio ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musabout-bio',
    rect: { x: 0, y: 0, width: W, height: BIO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-musabout-title',
    { x: 80, y: 60, width: 500, height: 60 },
    '블루 하모니',
    1,
    '#ffffff',
    'left',
    'tpl-musabout-bio',
  ),
  createTextNode({
    id: 'tpl-musabout-bio-text',
    parentId: 'tpl-musabout-bio',
    rect: { x: 80, y: 140, width: 700, height: 200 },
    text: '2020년 서울에서 결성된 4인조 얼터너티브 록 밴드입니다. 독창적인 사운드와 시적인 가사로 음악 씬에서 주목받고 있으며, 데뷔 앨범 "첫 번째 여행"으로 한국대중음악상 신인상을 수상했습니다.\n\n현대인의 감성과 일상의 이야기를 음악으로 풀어내는 것을 추구하며, 라이브 공연에서 특히 강한 에너지를 보여줍니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
  }),

  /* ── Band members (4 cards) ─────────────────────────────── */
  heading(
    'tpl-musabout-members-title',
    { x: 80, y: MEMBERS_Y, width: 400, height: 50 },
    '멤버 소개',
    2,
    '#123b63',
    'left',
  ),
  ...memberCard(1),
  ...memberCard(2),
  ...memberCard(3),
  ...memberCard(4),

  /* ── Influences ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musabout-infl',
    rect: { x: 0, y: INFLUENCES_Y, width: W, height: INFLUENCES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-musabout-infl-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '음악적 영향',
    2,
    '#123b63',
    'left',
    'tpl-musabout-infl',
  ),
  createTextNode({
    id: 'tpl-musabout-infl-text',
    parentId: 'tpl-musabout-infl',
    rect: { x: 80, y: 100, width: 800, height: 60 },
    text: 'Radiohead · Arctic Monkeys · 장기하와 얼굴들 · 혁오 · The National · Sigur Rós',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
    lineHeight: 1.6,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musicabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-proof-label', parentId: 'tpl-musicabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-proof-title', parentId: 'tpl-musicabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'music about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-proof-copy', parentId: 'tpl-musicabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-metric-1', parentId: 'tpl-musicabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-1-value', parentId: 'tpl-musicabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-1-label', parentId: 'tpl-musicabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-metric-2', parentId: 'tpl-musicabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-2-value', parentId: 'tpl-musicabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-2-label', parentId: 'tpl-musicabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-metric-3', parentId: 'tpl-musicabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-3-value', parentId: 'tpl-musicabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-3-label', parentId: 'tpl-musicabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-metric-4', parentId: 'tpl-musicabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-4-value', parentId: 'tpl-musicabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-metric-4-label', parentId: 'tpl-musicabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-label', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-title', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-copy', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-showcase-visual', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-visual-title', parentId: 'tpl-musicabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-visual-copy', parentId: 'tpl-musicabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-showcase-card-1', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-card-1-title', parentId: 'tpl-musicabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-card-1-copy', parentId: 'tpl-musicabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-showcase-card-2', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-card-2-title', parentId: 'tpl-musicabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-card-2-copy', parentId: 'tpl-musicabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-showcase-card-3', parentId: 'tpl-musicabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-card-3-title', parentId: 'tpl-musicabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-showcase-card-3-copy', parentId: 'tpl-musicabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-quote', parentId: 'tpl-musicabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-quote-mark', parentId: 'tpl-musicabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-quote-body', parentId: 'tpl-musicabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-quote-role', parentId: 'tpl-musicabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-cta-label', parentId: 'tpl-musicabout-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-cta-title', parentId: 'tpl-musicabout-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-cta-copy', parentId: 'tpl-musicabout-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-musicabout-wix-cta-primary', parentId: 'tpl-musicabout-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-musicabout-wix-cta-secondary', parentId: 'tpl-musicabout-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-musicabout-wix-cta-note', parentId: 'tpl-musicabout-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicabout-wix-timeline', parentId: 'tpl-musicabout-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
]);

export const musicAboutTemplate: PageTemplate = {
  id: 'music-about',
  name: '뮤직 아티스트 소개',
  category: 'music',
  subcategory: 'about',
  description: '아티스트 바이오 + 밴드 멤버(4명) + 음악적 영향',
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
