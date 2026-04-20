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
    stageHeight: STAGE_H,
    nodes,
  },
};
