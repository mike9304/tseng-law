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
const HERO_H = 300;
const STORY_Y = HERO_H + 80;
const STORY_H = 300;
const SOURCING_Y = STORY_Y + STORY_H + 80;
const SOURCING_H = 300;
const PHILOSOPHY_Y = SOURCING_Y + SOURCING_H + 80;
const PHILOSOPHY_H = 280;
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
  createContainerNode({
    id: 'tpl-cafeabt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafeabt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '우리 이야기', 1, '#ffffff', 'left', 'tpl-cafeabt-hero'),
  createTextNode({
    id: 'tpl-cafeabt-hero-sub',
    parentId: 'tpl-cafeabt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '한 잔의 커피에 담긴 정성과 철학을 소개합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Cafe story ─────────────────────────────────────────── */
  heading('tpl-cafeabt-story-title', { x: 80, y: STORY_Y, width: 400, height: 50 }, '카페 이야기', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-cafeabt-story-desc',
    rect: { x: 80, y: STORY_Y + 60, width: 600, height: 180 },
    text: '2018년 작은 골목에서 시작한 저희 카페는 "좋은 커피 한 잔이 하루를 바꾼다"는 믿음으로 운영되고 있습니다. 직접 산지를 방문하여 엄선한 원두를 매장에서 로스팅하며, 매일 새벽 구운 빵과 함께 정성 가득한 한 잔을 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
  createImageNode({
    id: 'tpl-cafeabt-story-img',
    rect: { x: 740, y: STORY_Y + 60, width: 460, height: 200 },
    src: '/images/placeholder-cafe-story.jpg',
    alt: '카페 창업자 이야기',
    style: { borderRadius: 12 },
  }),

  /* ── Coffee sourcing ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-cafeabt-sourcing',
    rect: { x: 0, y: SOURCING_Y, width: W, height: SOURCING_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-cafeabt-sourcing-title', { x: 80, y: 40, width: 400, height: 50 }, '원두 소싱', 2, '#123b63', 'left', 'tpl-cafeabt-sourcing'),
  createTextNode({
    id: 'tpl-cafeabt-sourcing-desc',
    parentId: 'tpl-cafeabt-sourcing',
    rect: { x: 80, y: 100, width: 800, height: 140 },
    text: '에티오피아, 콜롬비아, 과테말라, 케냐 등 세계 유명 커피 산지에서 직접 생두를 수급합니다. 공정무역 인증 농장과 직거래 관계를 유지하며, 최상의 품질을 보장합니다. 매 시즌 새로운 싱글 오리진을 소개합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Roasting philosophy ────────────────────────────────── */
  heading('tpl-cafeabt-roast-title', { x: 80, y: PHILOSOPHY_Y, width: 400, height: 50 }, '로스팅 철학', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-cafeabt-roast-desc',
    rect: { x: 80, y: PHILOSOPHY_Y + 60, width: 800, height: 160 },
    text: '각 원두의 개성을 살리는 프로파일 로스팅을 추구합니다. 라이트부터 다크까지 원두 특성에 맞는 최적의 로스팅 포인트를 찾아 풍부한 향미를 끌어냅니다. 매주 소량씩 로스팅하여 항상 신선한 커피를 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const cafeAboutTemplate: PageTemplate = {
  id: 'cafe-about',
  name: '카페 소개',
  category: 'cafe',
  subcategory: 'about',
  description: '카페 이야기 + 원두 소싱 + 로스팅 철학',
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
