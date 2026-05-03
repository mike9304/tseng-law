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
const STORY_H = 500;
const EQUIPMENT_Y = STORY_H + 80;
const EQUIPMENT_H = 300;
const AWARDS_Y = EQUIPMENT_Y + EQUIPMENT_H + 80;
const AWARDS_H = 260;
const PHILOSOPHY_Y = AWARDS_Y + AWARDS_H + 80;
const PHILOSOPHY_H = 240;
const STAGE_H = PHILOSOPHY_Y + PHILOSOPHY_H + 80;

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
  /* ── Photographer story ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoabout-story',
    rect: { x: 0, y: 0, width: W, height: STORY_H },
    background: '#ffffff',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-photoabout-portrait',
    parentId: 'tpl-photoabout-story',
    rect: { x: 80, y: 60, width: 400, height: 380 },
    src: '/images/placeholder-photographer.jpg',
    alt: '포토그래퍼 프로필 사진',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-photoabout-name',
    { x: 540, y: 80, width: 600, height: 50 },
    '김영진 포토그래퍼',
    1,
    '#123b63',
    'left',
    'tpl-photoabout-story',
  ),
  createTextNode({
    id: 'tpl-photoabout-bio',
    parentId: 'tpl-photoabout-story',
    rect: { x: 540, y: 150, width: 620, height: 260 },
    text: '서울예술대학교 사진학과를 졸업하고, 12년간 다양한 분야에서 활동해 왔습니다. 자연광을 활용한 따뜻하고 감성적인 촬영 스타일을 추구하며, 한 장의 사진에 이야기를 담아내는 것을 목표로 합니다.\n\n국내외 다수의 전시회에 참여하였으며, 웨딩, 인물, 기업 촬영 등 폭넓은 경험을 보유하고 있습니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Equipment ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoabout-equip',
    rect: { x: 0, y: EQUIPMENT_Y, width: W, height: EQUIPMENT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoabout-equip-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '촬영 장비',
    2,
    '#123b63',
    'left',
    'tpl-photoabout-equip',
  ),
  createTextNode({
    id: 'tpl-photoabout-equip-list',
    parentId: 'tpl-photoabout-equip',
    rect: { x: 80, y: 110, width: 800, height: 140 },
    text: '• 카메라: Canon EOS R5, Sony A7 IV\n• 렌즈: 24-70mm f/2.8, 85mm f/1.4, 70-200mm f/2.8\n• 조명: Profoto B10, Godox AD600\n• 드론: DJI Mavic 3 Pro',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Awards ─────────────────────────────────────────────── */
  heading(
    'tpl-photoabout-awards-title',
    { x: 80, y: AWARDS_Y, width: 400, height: 50 },
    '수상 경력',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-photoabout-awards-list',
    rect: { x: 80, y: AWARDS_Y + 60, width: 800, height: 160 },
    text: '• 2025 한국사진작가협회 올해의 작가상\n• 2024 서울국제사진전 금상\n• 2023 아시아 웨딩포토그래피 어워드 대상\n• 2022 내셔널지오그래픽 한국대회 입선',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Philosophy ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoabout-phil',
    rect: { x: 0, y: PHILOSOPHY_Y, width: W, height: PHILOSOPHY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoabout-phil-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '촬영 철학',
    2,
    '#ffffff',
    'left',
    'tpl-photoabout-phil',
  ),
  createTextNode({
    id: 'tpl-photoabout-phil-text',
    parentId: 'tpl-photoabout-phil',
    rect: { x: 80, y: 110, width: 800, height: 80 },
    text: '"좋은 사진은 기술이 아닌 마음에서 나옵니다. 피사체와의 교감을 통해 가장 자연스럽고 아름다운 순간을 포착하는 것이 저의 사진 철학입니다."',
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photographyabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-proof-label', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-proof-title', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'photography about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-proof-copy', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-metric-1', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-1-value', parentId: 'tpl-photographyabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-1-label', parentId: 'tpl-photographyabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-metric-2', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-2-value', parentId: 'tpl-photographyabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-2-label', parentId: 'tpl-photographyabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-metric-3', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-3-value', parentId: 'tpl-photographyabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-3-label', parentId: 'tpl-photographyabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-metric-4', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-4-value', parentId: 'tpl-photographyabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-metric-4-label', parentId: 'tpl-photographyabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-label', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-title', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-copy', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-showcase-visual', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-visual-title', parentId: 'tpl-photographyabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-visual-copy', parentId: 'tpl-photographyabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-showcase-card-1', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-card-1-title', parentId: 'tpl-photographyabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-card-1-copy', parentId: 'tpl-photographyabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-showcase-card-2', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-card-2-title', parentId: 'tpl-photographyabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-card-2-copy', parentId: 'tpl-photographyabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-showcase-card-3', parentId: 'tpl-photographyabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-card-3-title', parentId: 'tpl-photographyabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-showcase-card-3-copy', parentId: 'tpl-photographyabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-photographyabout-wix-quote', parentId: 'tpl-photographyabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-quote-mark', parentId: 'tpl-photographyabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-quote-body', parentId: 'tpl-photographyabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-quote-role', parentId: 'tpl-photographyabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-cta-label', parentId: 'tpl-photographyabout-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-cta-title', parentId: 'tpl-photographyabout-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-cta-copy', parentId: 'tpl-photographyabout-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-photographyabout-wix-cta-primary', parentId: 'tpl-photographyabout-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-photographyabout-wix-cta-secondary', parentId: 'tpl-photographyabout-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-photographyabout-wix-cta-note', parentId: 'tpl-photographyabout-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
]);

export const photographyAboutTemplate: PageTemplate = {
  id: 'photography-about',
  name: '사진작가 소개',
  category: 'photography',
  subcategory: 'about',
  description: '포토그래퍼 스토리 + 장비 + 수상 경력 + 촬영 철학',
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
