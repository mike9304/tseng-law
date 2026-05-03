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
const HERO_H = 600;
const SERVICES_Y = HERO_H + 80;
const SERVICES_H = 520;
const EMERGENCY_Y = SERVICES_Y + SERVICES_H + 80;
const EMERGENCY_H = 200;
const TESTIMONIALS_Y = EMERGENCY_Y + EMERGENCY_H + 80;
const TESTIMONIALS_H = 300;
const STAGE_H = TESTIMONIALS_Y + TESTIMONIALS_H + 80;

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
  /* ── Hero section ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-pethome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-pethome-hero-bg',
    parentId: 'tpl-pethome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-pet-hero.jpg',
    alt: '행복한 반려동물 이미지',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-pethome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '사랑하는 반려동물의 건강 파트너',
    1,
    '#ffffff',
    'left',
    'tpl-pethome-hero',
  ),
  createTextNode({
    id: 'tpl-pethome-hero-tagline',
    parentId: 'tpl-pethome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '전문 수의사가 반려동물의 건강을 책임집니다. 24시간 응급 진료 가능.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-pethome-hero-cta',
    parentId: 'tpl-pethome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '예약하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Services (4 cards) ─────────────────────────────────── */
  heading('tpl-pethome-svc-title', { x: 80, y: SERVICES_Y, width: 400, height: 50 }, '진료 서비스', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-pethome-card-1',
    rect: { x: 80, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-pethome-card-1-t', { x: 24, y: 24, width: 212, height: 36 }, '건강 검진', 3, '#123b63', 'left', 'tpl-pethome-card-1'),
  createTextNode({
    id: 'tpl-pethome-card-1-d',
    parentId: 'tpl-pethome-card-1',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '정기 건강검진으로 반려동물의 건강 상태를 종합적으로 점검합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-pethome-card-2',
    rect: { x: 370, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-pethome-card-2-t', { x: 24, y: 24, width: 212, height: 36 }, '예방접종', 3, '#123b63', 'left', 'tpl-pethome-card-2'),
  createTextNode({
    id: 'tpl-pethome-card-2-d',
    parentId: 'tpl-pethome-card-2',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '연령별 맞춤 백신 프로그램으로 질병을 예방합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-pethome-card-3',
    rect: { x: 660, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-pethome-card-3-t', { x: 24, y: 24, width: 212, height: 36 }, '외과 수술', 3, '#123b63', 'left', 'tpl-pethome-card-3'),
  createTextNode({
    id: 'tpl-pethome-card-3-d',
    parentId: 'tpl-pethome-card-3',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '최신 장비와 숙련된 전문의가 안전한 수술을 진행합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-pethome-card-4',
    rect: { x: 950, y: SERVICES_Y + 70, width: 260, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-pethome-card-4-t', { x: 24, y: 24, width: 212, height: 36 }, '치과 진료', 3, '#123b63', 'left', 'tpl-pethome-card-4'),
  createTextNode({
    id: 'tpl-pethome-card-4-d',
    parentId: 'tpl-pethome-card-4',
    rect: { x: 24, y: 70, width: 212, height: 80 },
    text: '스케일링, 발치 등 반려동물 치과 전문 진료를 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Emergency CTA ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-pethome-emergency',
    rect: { x: 0, y: EMERGENCY_Y, width: W, height: EMERGENCY_H },
    background: '#e8a838',
    borderRadius: 0,
  }),
  heading('tpl-pethome-emerg-title', { x: 80, y: 40, width: 600, height: 50 }, '24시간 응급 진료', 2, '#ffffff', 'left', 'tpl-pethome-emergency'),
  createTextNode({
    id: 'tpl-pethome-emerg-desc',
    parentId: 'tpl-pethome-emergency',
    rect: { x: 80, y: 100, width: 600, height: 40 },
    text: '긴급 상황 시 언제든 연락하세요. 응급전화: 02-9999-1234',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    lineHeight: 1.4,
  }),

  /* ── Testimonials ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-pethome-testi',
    rect: { x: 0, y: TESTIMONIALS_Y, width: W, height: TESTIMONIALS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-pethome-testi-title', { x: 80, y: 40, width: 400, height: 50 }, '보호자 후기', 2, '#123b63', 'left', 'tpl-pethome-testi'),
  createContainerNode({
    id: 'tpl-pethome-testi-card',
    parentId: 'tpl-pethome-testi',
    rect: { x: 80, y: 110, width: 500, height: 150 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-pethome-testi-quote',
    parentId: 'tpl-pethome-testi-card',
    rect: { x: 24, y: 24, width: 452, height: 60 },
    text: '"우리 강아지 수술을 정말 잘 해주셨어요. 세심한 케어에 감동받았습니다."',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createTextNode({
    id: 'tpl-pethome-testi-name',
    parentId: 'tpl-pethome-testi-card',
    rect: { x: 24, y: 100, width: 200, height: 32 },
    text: '— 김OO, 말티즈 보호자',
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 'medium',
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-pethome-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-proof-label', parentId: 'tpl-pethome-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-proof-title', parentId: 'tpl-pethome-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'pet home 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-proof-copy', parentId: 'tpl-pethome-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-metric-1', parentId: 'tpl-pethome-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-1-value', parentId: 'tpl-pethome-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-1-label', parentId: 'tpl-pethome-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-metric-2', parentId: 'tpl-pethome-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-2-value', parentId: 'tpl-pethome-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-2-label', parentId: 'tpl-pethome-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-metric-3', parentId: 'tpl-pethome-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-3-value', parentId: 'tpl-pethome-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-3-label', parentId: 'tpl-pethome-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-metric-4', parentId: 'tpl-pethome-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-4-value', parentId: 'tpl-pethome-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-metric-4-label', parentId: 'tpl-pethome-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-label', parentId: 'tpl-pethome-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-title', parentId: 'tpl-pethome-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-copy', parentId: 'tpl-pethome-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-showcase-visual', parentId: 'tpl-pethome-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-visual-title', parentId: 'tpl-pethome-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-visual-copy', parentId: 'tpl-pethome-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-showcase-card-1', parentId: 'tpl-pethome-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-card-1-title', parentId: 'tpl-pethome-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-card-1-copy', parentId: 'tpl-pethome-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-pethome-wix-showcase-card-2', parentId: 'tpl-pethome-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-pethome-wix-showcase-card-2-title', parentId: 'tpl-pethome-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
]);

export const petHomeTemplate: PageTemplate = {
  id: 'pet-home',
  name: '동물병원 홈',
  category: 'pet',
  subcategory: 'homepage',
  description: '친근한 히어로 + 서비스(4개 카드) + 응급 CTA + 보호자 후기',
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
