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
const META_Y = HERO_H + 40;
const META_H = 60;
const BODY_Y = META_Y + META_H + 40;
const BODY_H = 600;
const SHARE_Y = BODY_Y + BODY_H + 60;
const SHARE_H = 100;
const STAGE_H = SHARE_Y + SHARE_H + 80;

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
  /* ── Article hero ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogart-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-blogart-hero-img',
    parentId: 'tpl-blogart-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-article-hero.jpg',
    alt: '기사 히어로 이미지',
    style: { opacity: 40, borderRadius: 0 },
  }),
  heading(
    'tpl-blogart-title',
    { x: 160, y: 140, width: 960, height: 100 },
    '2026년을 이끌어갈 10가지 라이프스타일 트렌드',
    1,
    '#ffffff',
    'center',
    'tpl-blogart-hero',
  ),

  /* ── Author & date ──────────────────────────────────────── */
  createTextNode({
    id: 'tpl-blogart-author',
    rect: { x: 160, y: META_Y, width: 400, height: 28 },
    text: '김민지 · 편집장',
    fontSize: 16,
    color: '#123b63',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-blogart-date',
    rect: { x: 160, y: META_Y + 30, width: 200, height: 24 },
    text: '2026년 4월 10일 · 8분 읽기',
    fontSize: 14,
    color: '#6b7280',
  }),

  /* ── Article body ───────────────────────────────────────── */
  createTextNode({
    id: 'tpl-blogart-body-1',
    rect: { x: 160, y: BODY_Y, width: 760, height: 180 },
    text: '2026년은 기존의 생활 방식에 큰 변화를 가져올 한 해입니다. 디지털 기술의 발전과 함께 우리의 일상도 빠르게 변화하고 있으며, 새로운 트렌드들이 등장하고 있습니다.\n\n이번 기사에서는 올해 가장 주목해야 할 10가지 라이프스타일 트렌드를 소개합니다. 각 트렌드가 우리의 삶에 어떤 영향을 미칠지 함께 살펴보겠습니다.',
    fontSize: 17,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
  heading(
    'tpl-blogart-h2-1',
    { x: 160, y: BODY_Y + 200, width: 760, height: 40 },
    '1. 지속 가능한 소비',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-blogart-body-2',
    rect: { x: 160, y: BODY_Y + 260, width: 760, height: 140 },
    text: '환경에 대한 인식이 높아지면서 소비자들은 지속 가능한 제품과 서비스를 선택하는 경향이 강해지고 있습니다. 재활용 소재, 로컬 생산, 최소 포장 등이 주요 키워드로 떠오르고 있습니다.',
    fontSize: 17,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
  heading(
    'tpl-blogart-h2-2',
    { x: 160, y: BODY_Y + 420, width: 760, height: 40 },
    '2. 디지털 디톡스',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-blogart-body-3',
    rect: { x: 160, y: BODY_Y + 480, width: 760, height: 100 },
    text: '항상 연결되어 있는 현대 사회에서 의도적으로 디지털 기기와 거리를 두는 시간을 갖는 것이 새로운 트렌드로 자리 잡고 있습니다.',
    fontSize: 17,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Share buttons ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogart-share',
    rect: { x: 160, y: SHARE_Y, width: 760, height: SHARE_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-blogart-share-label',
    parentId: 'tpl-blogart-share',
    rect: { x: 24, y: 24, width: 100, height: 24 },
    text: '공유하기',
    fontSize: 14,
    color: '#123b63',
    fontWeight: 'bold',
  }),
  createTextNode({
    id: 'tpl-blogart-share-links',
    parentId: 'tpl-blogart-share',
    rect: { x: 24, y: 56, width: 400, height: 24 },
    text: 'Facebook · Twitter · LinkedIn · 링크 복사',
    fontSize: 14,
    color: '#e8a838',
    fontWeight: 'medium',
  }),
]);

export const blogArticleTemplate: PageTemplate = {
  id: 'blog-article',
  name: '블로그 기사',
  category: 'blog',
  subcategory: 'article',
  description: '기사 레이아웃: 제목, 저자, 날짜, 히어로 이미지, 본문, 공유 버튼',
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
