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
const STORY_H = 300;
const PHILOSOPHY_Y = STORY_Y + STORY_H + 80;
const PHILOSOPHY_H = 300;
const AWARDS_Y = PHILOSOPHY_Y + PHILOSOPHY_H + 80;
const AWARDS_H = 200;
const STAGE_H = AWARDS_Y + AWARDS_H + 80;

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
    id: 'tpl-beautyabout-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-beautyabout-hero-img',
    parentId: 'tpl-beautyabout-hero',
    rect: { x: 640, y: 0, width: 640, height: HERO_H },
    src: '/images/placeholder-salon-interior.jpg',
    alt: '살롱 인테리어 전경',
    style: { opacity: 60, borderRadius: 0 },
  }),
  heading(
    'tpl-beautyabout-hero-title',
    { x: 80, y: 140, width: 520, height: 70 },
    '살롱 소개',
    1,
    '#ffffff',
    'left',
    'tpl-beautyabout-hero',
  ),
  createTextNode({
    id: 'tpl-beautyabout-hero-sub',
    parentId: 'tpl-beautyabout-hero',
    rect: { x: 80, y: 230, width: 480, height: 50 },
    text: '아름다움에 대한 열정으로 10년간 고객과 함께해 왔습니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    lineHeight: 1.5,
  }),

  /* ── Salon story ─────────────────────────────────────────── */
  heading(
    'tpl-beautyabout-story-title',
    { x: 80, y: STORY_Y, width: 400, height: 50 },
    '살롱 이야기',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautyabout-story-p1',
    rect: { x: 80, y: STORY_Y + 60, width: 1120, height: 80 },
    text: '저희 살롱은 2015년 오픈 이래, 트렌디하면서도 개인의 개성을 살리는 뷰티 서비스를 제공해 왔습니다. 최신 기술과 프리미엄 제품을 사용하여 고객 한 분 한 분에게 최상의 결과를 선사합니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),
  createTextNode({
    id: 'tpl-beautyabout-story-p2',
    rect: { x: 80, y: STORY_Y + 160, width: 1120, height: 80 },
    text: '헤어, 네일, 피부 관리, 메이크업 등 원스톱 뷰티 서비스를 통해 바쁜 현대인들이 한 곳에서 편리하게 관리받을 수 있도록 노력하고 있습니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Team philosophy ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-beautyabout-philosophy',
    rect: { x: 0, y: PHILOSOPHY_Y, width: W, height: PHILOSOPHY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-beautyabout-philosophy-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '팀 철학',
    2,
    '#123b63',
    'left',
    'tpl-beautyabout-philosophy',
  ),
  createContainerNode({
    id: 'tpl-beautyabout-val-1',
    parentId: 'tpl-beautyabout-philosophy',
    rect: { x: 80, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-beautyabout-val-1-title', { x: 24, y: 20, width: 302, height: 36 }, '고객 맞춤 케어', 3, '#123b63', 'left', 'tpl-beautyabout-val-1'),
  createTextNode({
    id: 'tpl-beautyabout-val-1-desc',
    parentId: 'tpl-beautyabout-val-1',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '개인의 얼굴형, 피부톤, 라이프스타일에 맞는 맞춤 서비스를 제공합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-beautyabout-val-2',
    parentId: 'tpl-beautyabout-philosophy',
    rect: { x: 460, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-beautyabout-val-2-title', { x: 24, y: 20, width: 302, height: 36 }, '지속적인 교육', 3, '#123b63', 'left', 'tpl-beautyabout-val-2'),
  createTextNode({
    id: 'tpl-beautyabout-val-2-desc',
    parentId: 'tpl-beautyabout-val-2',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '해외 세미나와 정기 교육을 통해 최신 트렌드를 항상 업데이트합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-beautyabout-val-3',
    parentId: 'tpl-beautyabout-philosophy',
    rect: { x: 840, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-beautyabout-val-3-title', { x: 24, y: 20, width: 302, height: 36 }, '프리미엄 제품', 3, '#123b63', 'left', 'tpl-beautyabout-val-3'),
  createTextNode({
    id: 'tpl-beautyabout-val-3-desc',
    parentId: 'tpl-beautyabout-val-3',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '검증된 프리미엄 제품만을 사용하여 모발과 피부 건강을 지킵니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),

  /* ── Awards ──────────────────────────────────────────────── */
  heading(
    'tpl-beautyabout-awards-title',
    { x: 80, y: AWARDS_Y, width: 400, height: 50 },
    '수상 및 인증',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautyabout-awards-desc',
    rect: { x: 80, y: AWARDS_Y + 60, width: 1120, height: 80 },
    text: '2022 서울 뷰티 어워드 Best Salon 수상 | 2023 아시아 헤어 디자인 대회 금상 | ISO 9001 서비스 품질 인증 | 대한미용사회 공인 교육기관',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const beautyAboutTemplate: PageTemplate = {
  id: 'beauty-about',
  name: '살롱 소개',
  category: 'beauty',
  subcategory: 'about',
  description: '히어로 이미지 + 살롱 이야기 + 팀 철학(3 카드) + 수상 내역',
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
