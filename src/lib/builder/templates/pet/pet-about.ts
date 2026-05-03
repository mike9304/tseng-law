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
const HERO_H = 300;
const STORY_Y = HERO_H + 80;
const STORY_H = 300;
const FACILITY_Y = STORY_Y + STORY_H + 80;
const FACILITY_H = 300;
const MISSION_Y = FACILITY_Y + FACILITY_H + 80;
const MISSION_H = 240;
const STAGE_H = MISSION_Y + MISSION_H + 80;

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
  createContainerNode({
    id: 'tpl-petabt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petabt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '병원 소개', 1, '#ffffff', 'left', 'tpl-petabt-hero'),
  createTextNode({
    id: 'tpl-petabt-hero-sub',
    parentId: 'tpl-petabt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '반려동물과 보호자를 위한 최선의 진료를 약속합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Clinic story ───────────────────────────────────────── */
  heading('tpl-petabt-story-title', { x: 80, y: STORY_Y, width: 400, height: 50 }, '병원 이야기', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-petabt-story-desc',
    rect: { x: 80, y: STORY_Y + 60, width: 600, height: 180 },
    text: '2010년 개원 이래 15,000마리 이상의 반려동물을 진료해 왔습니다. 내과, 외과, 치과, 피부과 등 각 분야 전문 수의사가 상주하며, 최신 의료 장비로 정확한 진단과 치료를 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
  createImageNode({
    id: 'tpl-petabt-story-img',
    rect: { x: 740, y: STORY_Y + 60, width: 460, height: 200 },
    src: '/images/placeholder-vet-clinic.jpg',
    alt: '동물병원 외관',
    style: { borderRadius: 12 },
  }),

  /* ── Facility tour ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-petabt-facility',
    rect: { x: 0, y: FACILITY_Y, width: W, height: FACILITY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-petabt-fac-title', { x: 80, y: 40, width: 400, height: 50 }, '시설 안내', 2, '#123b63', 'left', 'tpl-petabt-facility'),
  createImageNode({
    id: 'tpl-petabt-fac-img-1',
    parentId: 'tpl-petabt-facility',
    rect: { x: 80, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-vet-surgery.jpg',
    alt: '수술실',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-petabt-fac-img-2',
    parentId: 'tpl-petabt-facility',
    rect: { x: 460, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-vet-ward.jpg',
    alt: '입원실',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-petabt-fac-img-3',
    parentId: 'tpl-petabt-facility',
    rect: { x: 840, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-vet-waiting.jpg',
    alt: '대기실',
    style: { borderRadius: 8 },
  }),

  /* ── Mission ────────────────────────────────────────────── */
  heading('tpl-petabt-mission-title', { x: 80, y: MISSION_Y, width: 400, height: 50 }, '우리의 사명', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-petabt-mission-desc',
    rect: { x: 80, y: MISSION_Y + 60, width: 800, height: 120 },
    text: '모든 반려동물이 건강하고 행복한 삶을 누릴 수 있도록 최선의 의료 서비스를 제공합니다. 보호자와의 소통을 최우선으로 생각하며, 투명한 진료와 합리적인 비용으로 신뢰받는 병원이 되겠습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-petabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-proof-label', parentId: 'tpl-petabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-proof-title', parentId: 'tpl-petabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'pet about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-proof-copy', parentId: 'tpl-petabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-metric-1', parentId: 'tpl-petabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-1-value', parentId: 'tpl-petabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-1-label', parentId: 'tpl-petabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-metric-2', parentId: 'tpl-petabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-2-value', parentId: 'tpl-petabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-2-label', parentId: 'tpl-petabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-metric-3', parentId: 'tpl-petabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-3-value', parentId: 'tpl-petabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-3-label', parentId: 'tpl-petabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-metric-4', parentId: 'tpl-petabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-4-value', parentId: 'tpl-petabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-metric-4-label', parentId: 'tpl-petabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-label', parentId: 'tpl-petabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-title', parentId: 'tpl-petabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-copy', parentId: 'tpl-petabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-showcase-visual', parentId: 'tpl-petabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-visual-title', parentId: 'tpl-petabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-visual-copy', parentId: 'tpl-petabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-showcase-card-1', parentId: 'tpl-petabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-card-1-title', parentId: 'tpl-petabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-card-1-copy', parentId: 'tpl-petabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-showcase-card-2', parentId: 'tpl-petabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-card-2-title', parentId: 'tpl-petabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-card-2-copy', parentId: 'tpl-petabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-showcase-card-3', parentId: 'tpl-petabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-card-3-title', parentId: 'tpl-petabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-showcase-card-3-copy', parentId: 'tpl-petabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petabout-wix-quote', parentId: 'tpl-petabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-quote-mark', parentId: 'tpl-petabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-quote-body', parentId: 'tpl-petabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-quote-role', parentId: 'tpl-petabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-cta-label', parentId: 'tpl-petabout-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-cta-title', parentId: 'tpl-petabout-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petabout-wix-cta-copy', parentId: 'tpl-petabout-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-petabout-wix-cta-primary', parentId: 'tpl-petabout-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-petabout-wix-cta-secondary', parentId: 'tpl-petabout-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
]);

export const petAboutTemplate: PageTemplate = {
  id: 'pet-about',
  name: '동물병원 소개',
  category: 'pet',
  subcategory: 'about',
  description: '병원 이야기 + 시설 투어 + 사명',
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
