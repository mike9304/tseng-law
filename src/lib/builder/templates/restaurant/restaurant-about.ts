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
const CHEF_Y = HEADER_H + 40;
const CHEF_H = 400;
const HISTORY_Y = CHEF_Y + CHEF_H + 80;
const HISTORY_H = 300;
const PHILOSOPHY_Y = HISTORY_Y + HISTORY_H + 80;
const PHILOSOPHY_H = 280;
const STAGE_H = PHILOSOPHY_Y + PHILOSOPHY_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restabout-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '레스토랑 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '최고의 맛과 서비스를 약속하는 우리의 이야기를 들려드립니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Chef story ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restabout-chef',
    rect: { x: 0, y: CHEF_Y, width: W, height: CHEF_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-restabout-chef-img',
    parentId: 'tpl-restabout-chef',
    rect: { x: MARGIN, y: 40, width: 400, height: 320 },
    src: '/images/placeholder-chef.jpg',
    alt: '셰프 프로필 사진',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-restabout-chef-title',
    { x: 540, y: 40, width: 400, height: 44 },
    '셰프 소개',
    2,
    '#123b63',
    'left',
    'tpl-restabout-chef',
  ),
  createTextNode({
    id: 'tpl-restabout-chef-desc',
    parentId: 'tpl-restabout-chef',
    rect: { x: 540, y: 100, width: 500, height: 200 },
    text: '프랑스 르 코르동 블루 출신의 김OO 셰프는 20년 이상의 경력을 바탕으로 한식과 양식의 조화를 추구합니다. 미쉐린 가이드 추천 레스토랑에서의 경험을 살려, 최상의 재료로 정성을 담은 요리를 선보입니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Restaurant history ──────────────────────────────────── */
  heading(
    'tpl-restabout-history-title',
    { x: MARGIN, y: HISTORY_Y, width: 500, height: 50 },
    '우리의 역사',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restabout-history-desc',
    rect: { x: MARGIN, y: HISTORY_Y + 70, width: 700, height: 180 },
    text: '2010년 작은 비스트로에서 시작한 우리 레스토랑은 15년간 한결같은 맛과 서비스로 사랑받아 왔습니다. 처음에는 20석 규모의 아담한 공간이었지만, 고객님들의 성원에 힘입어 현재 100석 규모의 파인 다이닝 레스토랑으로 성장했습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Philosophy ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restabout-philosophy',
    rect: { x: 0, y: PHILOSOPHY_Y, width: W, height: PHILOSOPHY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-restabout-philosophy-title',
    { x: MARGIN, y: 40, width: 500, height: 50 },
    '요리 철학',
    2,
    '#ffffff',
    'left',
    'tpl-restabout-philosophy',
  ),
  createTextNode({
    id: 'tpl-restabout-philosophy-desc',
    parentId: 'tpl-restabout-philosophy',
    rect: { x: MARGIN, y: 110, width: 800, height: 120 },
    text: '우리는 "제철 재료, 정직한 요리"라는 철학 아래, 매일 산지에서 직송한 신선한 재료만을 사용합니다. 인공 첨가물 없이 재료 본연의 맛을 살리는 것이 우리의 약속입니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
]);

export const restaurantAboutTemplate: PageTemplate = {
  id: 'restaurant-about',
  name: '레스토랑 소개',
  category: 'restaurant',
  subcategory: 'about',
  description: '셰프 스토리 + 레스토랑 역사 + 요리 철학 섹션',
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
