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
const FOUNDER_Y = HERO_H + 80;
const FOUNDER_H = 360;
const VALUES_Y = FOUNDER_Y + FOUNDER_H + 80;
const VALUES_H = 300;
const STAGE_H = VALUES_Y + VALUES_H + 80;

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
  /* ── Brand story hero ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecabout-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecabout-hero-title',
    { x: 80, y: 100, width: 600, height: 60 },
    '우리의 이야기',
    1,
    '#ffffff',
    'left',
    'tpl-ecabout-hero',
  ),
  createTextNode({
    id: 'tpl-ecabout-hero-desc',
    parentId: 'tpl-ecabout-hero',
    rect: { x: 80, y: 180, width: 600, height: 120 },
    text: '2015년 작은 공방에서 시작된 우리 브랜드는 "좋은 품질, 합리적 가격"이라는 신념으로 성장해 왔습니다. 고객 한 분 한 분의 만족이 우리의 원동력입니다.',
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
  }),

  /* ── Founder section ────────────────────────────────────── */
  heading(
    'tpl-ecabout-founder-title',
    { x: 80, y: FOUNDER_Y, width: 400, height: 50 },
    '창업자 소개',
    2,
    '#123b63',
    'left',
  ),
  createImageNode({
    id: 'tpl-ecabout-founder-img',
    rect: { x: 80, y: FOUNDER_Y + 70, width: 300, height: 260 },
    src: '/images/placeholder-founder.jpg',
    alt: '창업자 프로필 사진',
    style: { borderRadius: 12 },
  }),
  createTextNode({
    id: 'tpl-ecabout-founder-bio',
    rect: { x: 420, y: FOUNDER_Y + 70, width: 700, height: 260 },
    text: '김민수 대표는 패션 디자인을 전공하고, 글로벌 브랜드에서 10년간 경력을 쌓은 후 자신만의 브랜드를 시작했습니다. "모든 사람이 좋은 디자인을 누릴 수 있어야 합니다"라는 철학으로, 합리적인 가격에 고품질 제품을 만들어가고 있습니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Values ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-ecabout-values',
    rect: { x: 0, y: VALUES_Y, width: W, height: VALUES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-ecabout-values-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '브랜드 가치',
    2,
    '#123b63',
    'left',
    'tpl-ecabout-values',
  ),
  createContainerNode({
    id: 'tpl-ecabout-val-1',
    parentId: 'tpl-ecabout-values',
    rect: { x: 80, y: 110, width: 340, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-ecabout-val-1-title', { x: 24, y: 16, width: 292, height: 32 }, '품질 우선', 3, '#123b63', 'left', 'tpl-ecabout-val-1'),
  createTextNode({
    id: 'tpl-ecabout-val-1-desc',
    parentId: 'tpl-ecabout-val-1',
    rect: { x: 24, y: 56, width: 292, height: 60 },
    text: '엄선된 소재와 꼼꼼한 품질 관리로 오래 사용할 수 있는 제품을 만듭니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-ecabout-val-2',
    parentId: 'tpl-ecabout-values',
    rect: { x: 460, y: 110, width: 340, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-ecabout-val-2-title', { x: 24, y: 16, width: 292, height: 32 }, '지속 가능성', 3, '#123b63', 'left', 'tpl-ecabout-val-2'),
  createTextNode({
    id: 'tpl-ecabout-val-2-desc',
    parentId: 'tpl-ecabout-val-2',
    rect: { x: 24, y: 56, width: 292, height: 60 },
    text: '친환경 포장재와 지속 가능한 생산 공정을 통해 환경을 생각합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-ecabout-val-3',
    parentId: 'tpl-ecabout-values',
    rect: { x: 840, y: 110, width: 340, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-ecabout-val-3-title', { x: 24, y: 16, width: 292, height: 32 }, '고객 중심', 3, '#123b63', 'left', 'tpl-ecabout-val-3'),
  createTextNode({
    id: 'tpl-ecabout-val-3-desc',
    parentId: 'tpl-ecabout-val-3',
    rect: { x: 24, y: 56, width: 292, height: 60 },
    text: '고객의 피드백을 반영하여 끊임없이 발전하는 브랜드를 지향합니다.',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.5,
  }),
]);

export const ecommerceAboutTemplate: PageTemplate = {
  id: 'ecommerce-about',
  name: '온라인 쇼핑몰 소개',
  category: 'ecommerce',
  subcategory: 'about',
  description: '브랜드 스토리 + 창업자 소개 + 브랜드 가치',
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
