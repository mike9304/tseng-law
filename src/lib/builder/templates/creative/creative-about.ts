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
const MARGIN = 80;

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

const HEADER_H = 140;
const STORY_Y = HEADER_H + 40;
const STORY_H = 360;
const PHILOSOPHY_Y = STORY_Y + STORY_H + 80;
const PHILOSOPHY_H = 240;
const AWARDS_Y = PHILOSOPHY_Y + PHILOSOPHY_H + 80;
const AWARDS_H = 240;
const STAGE_H = AWARDS_Y + AWARDS_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativeabout-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '에이전시 소개', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativeabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '크리에이티브로 세상을 바꾸는 우리를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Team story ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-creativeabout-story',
    rect: { x: 0, y: STORY_Y, width: W, height: STORY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-creativeabout-story-img',
    parentId: 'tpl-creativeabout-story',
    rect: { x: MARGIN, y: 40, width: 450, height: 280 },
    src: '/images/placeholder-creative-team.jpg',
    alt: '팀 사진',
    style: { borderRadius: 12 },
  }),
  heading('tpl-creativeabout-story-title', { x: 580, y: 40, width: 400, height: 44 }, '우리의 이야기', 2, '#123b63', 'left', 'tpl-creativeabout-story'),
  createTextNode({
    id: 'tpl-creativeabout-story-desc',
    parentId: 'tpl-creativeabout-story',
    rect: { x: 580, y: 100, width: 500, height: 200 },
    text: '2015년 디자이너 3명이 시작한 작은 스튜디오에서, 현재 30명 이상의 크리에이터가 함께하는 종합 에이전시로 성장했습니다. 200개 이상의 프로젝트를 성공적으로 수행하며 클라이언트와 함께 성장해 왔습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Creative philosophy ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-creativeabout-philosophy',
    rect: { x: 0, y: PHILOSOPHY_Y, width: W, height: PHILOSOPHY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-creativeabout-philosophy-title', { x: MARGIN, y: 40, width: 400, height: 44 }, '크리에이티브 철학', 2, '#ffffff', 'left', 'tpl-creativeabout-philosophy'),
  createTextNode({
    id: 'tpl-creativeabout-philosophy-desc',
    parentId: 'tpl-creativeabout-philosophy',
    rect: { x: MARGIN, y: 100, width: 800, height: 100 },
    text: '우리는 "좋은 디자인은 비즈니스를 변화시킨다"는 믿음으로 일합니다. 단순한 시각적 아름다움을 넘어, 비즈니스 목표를 달성하는 전략적 크리에이티브를 추구합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),

  /* ── Awards ──────────────────────────────────────────────── */
  heading('tpl-creativeabout-awards-title', { x: MARGIN, y: AWARDS_Y, width: 400, height: 50 }, '수상 및 인정', 2, '#123b63'),
  createContainerNode({
    id: 'tpl-creativeabout-awards-box',
    rect: { x: MARGIN, y: AWARDS_Y + 70, width: W - MARGIN * 2, height: 140 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  createTextNode({
    id: 'tpl-creativeabout-awards-list',
    parentId: 'tpl-creativeabout-awards-box',
    rect: { x: 32, y: 32, width: 900, height: 80 },
    text: '레드닷 디자인 어워드 2024 | IF 디자인 어워드 | 대한민국 디자인 대상 | 웹어워드 코리아 대상 | 아시아 크리에이티브 어워드',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.8,
    align: 'center',
  }),
]);

export const creativeAboutTemplate: PageTemplate = {
  id: 'creative-about',
  name: '에이전시 소개',
  category: 'creative',
  subcategory: 'about',
  description: '팀 스토리 + 크리에이티브 철학 + 수상/인정',
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
