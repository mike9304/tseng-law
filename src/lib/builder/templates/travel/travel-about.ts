import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 400;
const STORY_Y = HERO_H + 80;
const STORY_H = 260;
const TEAM_Y = STORY_Y + STORY_H + 80;
const TEAM_H = 300;
const STAGE_H = TEAM_Y + TEAM_H + 80;

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
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelabout-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-travelabout-hero-img',
    parentId: 'tpl-travelabout-hero',
    rect: { x: 640, y: 0, width: 640, height: HERO_H },
    src: '/images/placeholder-travel-office.jpg',
    alt: '여행사 사무실',
    style: { opacity: 60, borderRadius: 0 },
  }),
  heading(
    'tpl-travelabout-hero-title',
    { x: 80, y: 140, width: 520, height: 70 },
    '여행사 소개',
    1,
    '#ffffff',
    'left',
    'tpl-travelabout-hero',
  ),
  createTextNode({
    id: 'tpl-travelabout-hero-sub',
    parentId: 'tpl-travelabout-hero',
    rect: { x: 80, y: 230, width: 480, height: 50 },
    text: '15년간 10만 명의 여행자와 함께한 신뢰의 여행 파트너.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    lineHeight: 1.5,
  }),

  /* ── Agency story ────────────────────────────────────────── */
  heading(
    'tpl-travelabout-story-title',
    { x: 80, y: STORY_Y, width: 400, height: 50 },
    '우리의 이야기',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelabout-story-p1',
    rect: { x: 80, y: STORY_Y + 60, width: 1120, height: 80 },
    text: '2010년 설립 이래, 단순한 패키지 여행이 아닌 고객 한 분 한 분의 이야기가 담긴 맞춤 여행을 설계해 왔습니다. KATA(한국여행업협회) 정회원으로 신뢰할 수 있는 서비스를 제공합니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),
  createTextNode({
    id: 'tpl-travelabout-story-p2',
    rect: { x: 80, y: STORY_Y + 160, width: 1120, height: 60 },
    text: '전 세계 50개국 이상의 현지 파트너 네트워크를 보유하고 있으며, 24시간 긴급 지원 시스템을 운영합니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Team & certifications ───────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelabout-team',
    rect: { x: 0, y: TEAM_Y, width: W, height: TEAM_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-travelabout-team-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '팀 & 인증',
    2,
    '#123b63',
    'left',
    'tpl-travelabout-team',
  ),
  createContainerNode({
    id: 'tpl-travelabout-cert-1',
    parentId: 'tpl-travelabout-team',
    rect: { x: 80, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelabout-cert-1-title', { x: 24, y: 20, width: 302, height: 36 }, '전문 플래너팀', 3, '#123b63', 'left', 'tpl-travelabout-cert-1'),
  createTextNode({
    id: 'tpl-travelabout-cert-1-desc',
    parentId: 'tpl-travelabout-cert-1',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '각 지역 전문 여행 플래너 15명이 최적의 일정을 설계합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelabout-cert-2',
    parentId: 'tpl-travelabout-team',
    rect: { x: 460, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelabout-cert-2-title', { x: 24, y: 20, width: 302, height: 36 }, '공인 인증', 3, '#123b63', 'left', 'tpl-travelabout-cert-2'),
  createTextNode({
    id: 'tpl-travelabout-cert-2-desc',
    parentId: 'tpl-travelabout-cert-2',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: 'KATA 정회원, IATA 공인, 여행보증보험 5억원 가입.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelabout-cert-3',
    parentId: 'tpl-travelabout-team',
    rect: { x: 840, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelabout-cert-3-title', { x: 24, y: 20, width: 302, height: 36 }, '현지 파트너', 3, '#123b63', 'left', 'tpl-travelabout-cert-3'),
  createTextNode({
    id: 'tpl-travelabout-cert-3-desc',
    parentId: 'tpl-travelabout-cert-3',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '50개국 200개 이상의 검증된 현지 파트너와 협력합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-proof-label', parentId: 'tpl-travelabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-proof-title', parentId: 'tpl-travelabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'travel about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-proof-copy', parentId: 'tpl-travelabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-metric-1', parentId: 'tpl-travelabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-1-value', parentId: 'tpl-travelabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-1-label', parentId: 'tpl-travelabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-metric-2', parentId: 'tpl-travelabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-2-value', parentId: 'tpl-travelabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-2-label', parentId: 'tpl-travelabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-metric-3', parentId: 'tpl-travelabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-3-value', parentId: 'tpl-travelabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-3-label', parentId: 'tpl-travelabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-metric-4', parentId: 'tpl-travelabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-4-value', parentId: 'tpl-travelabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-metric-4-label', parentId: 'tpl-travelabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-label', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-title', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-copy', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-showcase-visual', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-visual-title', parentId: 'tpl-travelabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-visual-copy', parentId: 'tpl-travelabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-showcase-card-1', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-card-1-title', parentId: 'tpl-travelabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-card-1-copy', parentId: 'tpl-travelabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-showcase-card-2', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-card-2-title', parentId: 'tpl-travelabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-card-2-copy', parentId: 'tpl-travelabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-showcase-card-3', parentId: 'tpl-travelabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-card-3-title', parentId: 'tpl-travelabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-showcase-card-3-copy', parentId: 'tpl-travelabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelabout-wix-quote', parentId: 'tpl-travelabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-quote-mark', parentId: 'tpl-travelabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-quote-body', parentId: 'tpl-travelabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-travelabout-wix-quote-role', parentId: 'tpl-travelabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
]);

export const travelAboutTemplate: PageTemplate = {
  id: 'travel-about',
  name: '여행사 소개',
  category: 'travel',
  subcategory: 'about',
  description: '히어로 이미지 + 여행사 이야기 + 팀/인증 카드(3개)',
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
