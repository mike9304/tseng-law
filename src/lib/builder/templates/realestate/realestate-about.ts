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
const EXPERTISE_Y = STORY_Y + STORY_H + 80;
const EXPERTISE_H = 240;
const AWARDS_Y = EXPERTISE_Y + EXPERTISE_H + 80;
const AWARDS_H = 200;
const STAGE_H = AWARDS_Y + AWARDS_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-reabout-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '회사 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-reabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '신뢰와 전문성으로 부동산 거래를 이끄는 우리 회사를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Agency story ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reabout-story',
    rect: { x: 0, y: STORY_Y, width: W, height: STORY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-reabout-story-img',
    parentId: 'tpl-reabout-story',
    rect: { x: MARGIN, y: 40, width: 450, height: 280 },
    src: '/images/placeholder-realestate-office.jpg',
    alt: '부동산 사무실 내부',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-reabout-story-title',
    { x: 580, y: 40, width: 400, height: 44 },
    '우리의 이야기',
    2,
    '#123b63',
    'left',
    'tpl-reabout-story',
  ),
  createTextNode({
    id: 'tpl-reabout-story-desc',
    parentId: 'tpl-reabout-story',
    rect: { x: 580, y: 100, width: 500, height: 200 },
    text: '2008년 설립 이래, 서울 주요 지역의 부동산 거래를 전문으로 해왔습니다. 1,200건 이상의 성공적인 거래를 통해 고객의 신뢰를 쌓아왔으며, 투명하고 정직한 거래를 최우선으로 합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Market expertise ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reabout-expertise',
    rect: { x: 0, y: EXPERTISE_Y, width: W, height: EXPERTISE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-reabout-expertise-title',
    { x: MARGIN, y: 40, width: 500, height: 44 },
    '시장 전문성',
    2,
    '#ffffff',
    'left',
    'tpl-reabout-expertise',
  ),
  createTextNode({
    id: 'tpl-reabout-expertise-desc',
    parentId: 'tpl-reabout-expertise',
    rect: { x: MARGIN, y: 100, width: 800, height: 100 },
    text: '강남, 서초, 송파, 여의도 등 서울 핵심 지역의 시세 동향을 실시간으로 분석합니다. 빅데이터 기반의 시장 분석과 전문 중개사의 현장 경험을 결합하여 최적의 투자 전략을 제안합니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),

  /* ── Awards ──────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-reabout-awards',
    rect: { x: 0, y: AWARDS_Y, width: W, height: AWARDS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-reabout-awards-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '수상 및 인증',
    2,
    '#123b63',
    'left',
    'tpl-reabout-awards',
  ),
  createTextNode({
    id: 'tpl-reabout-awards-desc',
    parentId: 'tpl-reabout-awards',
    rect: { x: MARGIN, y: 100, width: 800, height: 60 },
    text: '2024 우수 공인중개사무소 선정 | 한국부동산협회 공로상 | 고객만족도 1위 (3년 연속) | ISO 9001 인증',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
]);

export const realestateAboutTemplate: PageTemplate = {
  id: 'realestate-about',
  name: '부동산 회사 소개',
  category: 'realestate',
  subcategory: 'about',
  description: '에이전시 스토리 + 시장 전문성 + 수상 내역',
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
