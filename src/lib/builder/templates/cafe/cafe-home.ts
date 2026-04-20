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
const SPECIALS_Y = HERO_H + 80;
const SPECIALS_H = 380;
const GALLERY_Y = SPECIALS_Y + SPECIALS_H + 80;
const GALLERY_H = 300;
const CTA_Y = GALLERY_Y + GALLERY_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

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
    id: 'tpl-cafehome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-cafehome-hero-bg',
    parentId: 'tpl-cafehome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-cafe-hero.jpg',
    alt: '카페 인테리어 히어로 이미지',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-cafehome-hero-title',
    { x: 80, y: 160, width: 600, height: 100 },
    '한 잔의 여유, 매일의 행복',
    1,
    '#ffffff',
    'left',
    'tpl-cafehome-hero',
  ),
  createTextNode({
    id: 'tpl-cafehome-hero-tagline',
    parentId: 'tpl-cafehome-hero',
    rect: { x: 80, y: 280, width: 500, height: 60 },
    text: '직접 로스팅한 스페셜티 커피와 수제 베이커리를 만나보세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    align: 'left',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-cafehome-hero-cta',
    parentId: 'tpl-cafehome-hero',
    rect: { x: 80, y: 370, width: 200, height: 52 },
    label: '메뉴 보기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Today's specials (3 cards) ─────────────────────────── */
  heading(
    'tpl-cafehome-special-title',
    { x: 80, y: SPECIALS_Y, width: 400, height: 50 },
    '오늘의 추천',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-cafehome-spec-1',
    rect: { x: 80, y: SPECIALS_Y + 70, width: 360, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-cafehome-spec-1-img',
    parentId: 'tpl-cafehome-spec-1',
    rect: { x: 0, y: 0, width: 360, height: 140 },
    src: '/images/placeholder-coffee-1.jpg',
    alt: '시그니처 라떼',
    style: { borderRadius: 0 },
  }),
  heading('tpl-cafehome-spec-1-t', { x: 16, y: 152, width: 328, height: 36 }, '시그니처 라떼', 3, '#123b63', 'left', 'tpl-cafehome-spec-1'),
  createTextNode({
    id: 'tpl-cafehome-spec-1-d',
    parentId: 'tpl-cafehome-spec-1',
    rect: { x: 16, y: 196, width: 328, height: 50 },
    text: '에티오피아 예가체프 원두로 만든 부드러운 라떼',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-cafehome-spec-2',
    rect: { x: 470, y: SPECIALS_Y + 70, width: 360, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-cafehome-spec-2-img',
    parentId: 'tpl-cafehome-spec-2',
    rect: { x: 0, y: 0, width: 360, height: 140 },
    src: '/images/placeholder-pastry-1.jpg',
    alt: '크루아상',
    style: { borderRadius: 0 },
  }),
  heading('tpl-cafehome-spec-2-t', { x: 16, y: 152, width: 328, height: 36 }, '버터 크루아상', 3, '#123b63', 'left', 'tpl-cafehome-spec-2'),
  createTextNode({
    id: 'tpl-cafehome-spec-2-d',
    parentId: 'tpl-cafehome-spec-2',
    rect: { x: 16, y: 196, width: 328, height: 50 },
    text: '프랑스산 버터로 만든 바삭한 수제 크루아상',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-cafehome-spec-3',
    rect: { x: 860, y: SPECIALS_Y + 70, width: 360, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-cafehome-spec-3-img',
    parentId: 'tpl-cafehome-spec-3',
    rect: { x: 0, y: 0, width: 360, height: 140 },
    src: '/images/placeholder-smoothie-1.jpg',
    alt: '베리 스무디',
    style: { borderRadius: 0 },
  }),
  heading('tpl-cafehome-spec-3-t', { x: 16, y: 152, width: 328, height: 36 }, '베리 스무디', 3, '#123b63', 'left', 'tpl-cafehome-spec-3'),
  createTextNode({
    id: 'tpl-cafehome-spec-3-d',
    parentId: 'tpl-cafehome-spec-3',
    rect: { x: 16, y: 196, width: 328, height: 50 },
    text: '신선한 블루베리와 딸기로 만든 건강한 스무디',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Atmosphere gallery ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-cafehome-gallery',
    rect: { x: 0, y: GALLERY_Y, width: W, height: GALLERY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-cafehome-gallery-title', { x: 80, y: 40, width: 400, height: 50 }, '카페 분위기', 2, '#123b63', 'left', 'tpl-cafehome-gallery'),
  createImageNode({
    id: 'tpl-cafehome-gallery-img-1',
    parentId: 'tpl-cafehome-gallery',
    rect: { x: 80, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-cafe-interior-1.jpg',
    alt: '카페 내부 전경',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-cafehome-gallery-img-2',
    parentId: 'tpl-cafehome-gallery',
    rect: { x: 460, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-cafe-interior-2.jpg',
    alt: '카페 좌석',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-cafehome-gallery-img-3',
    parentId: 'tpl-cafehome-gallery',
    rect: { x: 840, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-cafe-interior-3.jpg',
    alt: '카페 테라스',
    style: { borderRadius: 8 },
  }),

  /* ── Visit CTA ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-cafehome-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-cafehome-cta-text',
    parentId: 'tpl-cafehome-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '오늘 한 잔의 여유를 즐기러 오세요. 매일 아침 7시부터 영업합니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-cafehome-cta-btn',
    parentId: 'tpl-cafehome-cta',
    rect: { x: 80, y: 110, width: 180, height: 48 },
    label: '위치 보기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const cafeHomeTemplate: PageTemplate = {
  id: 'cafe-home',
  name: '카페 홈',
  category: 'cafe',
  subcategory: 'homepage',
  description: '따뜻한 히어로 + 오늘의 추천(3개 카드) + 분위기 갤러리 + 방문 CTA',
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
