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
const HISTORY_Y = HEADER_H + 40;
const HISTORY_H = 360;
const MISSION_Y = HISTORY_Y + HISTORY_H + 80;
const MISSION_H = 240;
const FACILITIES_Y = MISSION_Y + MISSION_H + 80;
const FACILITIES_H = 300;
const STAGE_H = FACILITIES_Y + FACILITIES_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-eduabout-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '학교 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-eduabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '미래를 선도하는 교육 기관, 우리 학교를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── History ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eduabout-history',
    rect: { x: 0, y: HISTORY_Y, width: W, height: HISTORY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-eduabout-history-img',
    parentId: 'tpl-eduabout-history',
    rect: { x: MARGIN, y: 40, width: 450, height: 280 },
    src: '/images/placeholder-campus.jpg',
    alt: '캠퍼스 건물 사진',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-eduabout-history-title',
    { x: 580, y: 40, width: 400, height: 44 },
    '학교 역사',
    2,
    '#123b63',
    'left',
    'tpl-eduabout-history',
  ),
  createTextNode({
    id: 'tpl-eduabout-history-desc',
    parentId: 'tpl-eduabout-history',
    rect: { x: 580, y: 100, width: 500, height: 200 },
    text: '1990년 설립된 우리 학교는 35년간 실무 중심 교육을 통해 10만 명 이상의 졸업생을 배출해 왔습니다. 산학 협력과 글로벌 교류를 통해 학생들의 취업 경쟁력을 강화하고 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Mission ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-eduabout-mission',
    rect: { x: 0, y: MISSION_Y, width: W, height: MISSION_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-eduabout-mission-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '교육 이념',
    2,
    '#ffffff',
    'left',
    'tpl-eduabout-mission',
  ),
  createTextNode({
    id: 'tpl-eduabout-mission-desc',
    parentId: 'tpl-eduabout-mission',
    rect: { x: MARGIN, y: 100, width: 800, height: 100 },
    text: '창의적 사고와 실무 능력을 겸비한 글로벌 인재를 양성합니다. 인성 교육과 전문 교육의 균형을 통해 사회에 기여하는 인재를 키워냅니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),

  /* ── Facilities ──────────────────────────────────────────── */
  heading(
    'tpl-eduabout-facilities-title',
    { x: MARGIN, y: FACILITIES_Y, width: 400, height: 50 },
    '시설 안내',
    2,
    '#123b63',
  ),
  createContainerNode({
    id: 'tpl-eduabout-fac-1',
    rect: { x: MARGIN, y: FACILITIES_Y + 70, width: 350, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduabout-fac-1-title', { x: 24, y: 20, width: 300, height: 32 }, '최신 강의실', 3, '#123b63', 'left', 'tpl-eduabout-fac-1'),
  createTextNode({
    id: 'tpl-eduabout-fac-1-desc',
    parentId: 'tpl-eduabout-fac-1',
    rect: { x: 24, y: 60, width: 300, height: 100 },
    text: '스마트 교실, 멀티미디어 강의실 등 최첨단 교육 환경을 갖추고 있습니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-eduabout-fac-2',
    rect: { x: 460, y: FACILITIES_Y + 70, width: 350, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduabout-fac-2-title', { x: 24, y: 20, width: 300, height: 32 }, '도서관', 3, '#123b63', 'left', 'tpl-eduabout-fac-2'),
  createTextNode({
    id: 'tpl-eduabout-fac-2-desc',
    parentId: 'tpl-eduabout-fac-2',
    rect: { x: 24, y: 60, width: 300, height: 100 },
    text: '10만 권 이상의 장서와 전자 자료를 보유한 학술 도서관입니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-eduabout-fac-3',
    rect: { x: 840, y: FACILITIES_Y + 70, width: 350, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-eduabout-fac-3-title', { x: 24, y: 20, width: 300, height: 32 }, '실습실', 3, '#123b63', 'left', 'tpl-eduabout-fac-3'),
  createTextNode({
    id: 'tpl-eduabout-fac-3-desc',
    parentId: 'tpl-eduabout-fac-3',
    rect: { x: 24, y: 60, width: 300, height: 100 },
    text: '각 학과별 전문 실습실을 운영하여 실무 역량을 강화합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
]);

export const educationAboutTemplate: PageTemplate = {
  id: 'education-about',
  name: '학교 소개',
  category: 'education',
  subcategory: 'about',
  description: '학교 역사 + 교육 이념 + 시설 안내',
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
