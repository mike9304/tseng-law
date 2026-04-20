import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
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
const INTRO_Y = HEADER_H + 40;
const INTRO_H = 120;
const POSITIONS_Y = INTRO_Y + INTRO_H + 80;
const POSITION_H = 140;
const GAP = 16;
const CONTENT_W = W - MARGIN * 2;

interface Position {
  key: string;
  title: string;
  type: string;
  desc: string;
}

const positions: Position[] = [
  { key: 'head-chef', title: '헤드 셰프', type: '정규직', desc: '5년 이상 경력의 파인 다이닝 경험자를 모십니다. 메뉴 개발 및 주방 총괄.' },
  { key: 'sous-chef', title: '수셰프', type: '정규직', desc: '3년 이상 경력. 헤드 셰프를 보조하며 메인 요리 섹션을 담당합니다.' },
  { key: 'sommelier', title: '소믈리에', type: '정규직', desc: '와인 자격증 보유자. 와인 리스트 관리 및 고객 페어링 추천.' },
  { key: 'server', title: '홀 매니저', type: '정규직', desc: '파인 다이닝 서비스 경험 2년 이상. 고객 응대 및 홀 관리 총괄.' },
];

function buildPositionCard(pos: Position, idx: number): BuilderCanvasNode[] {
  const y = POSITIONS_Y + idx * (POSITION_H + GAP);
  const cid = `tpl-restcareers-pos-${pos.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: POSITION_H },
      background: '#ffffff',
      borderRadius: 10,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    heading(`${cid}-title`, { x: 24, y: 16, width: 400, height: 32 }, pos.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-type`,
      parentId: cid,
      rect: { x: 24, y: 52, width: 120, height: 24 },
      text: pos.type,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 82, width: CONTENT_W - 80, height: 40 },
      text: pos.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const CTA_Y = POSITIONS_Y + positions.length * (POSITION_H + GAP) + 60;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restcareers-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '채용 안내',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restcareers-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '열정 있는 분들과 함께 성장하고 싶습니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Intro ───────────────────────────────────────────────── */
  createTextNode({
    id: 'tpl-restcareers-intro',
    rect: { x: MARGIN, y: INTRO_Y, width: 800, height: INTRO_H },
    text: '우리 레스토랑은 최고의 요리와 서비스를 위해 열정을 가진 인재를 찾고 있습니다. 함께 성장하며 미식의 세계를 만들어 갈 팀원을 기다립니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Open positions ──────────────────────────────────────── */
  heading(
    'tpl-restcareers-positions-title',
    { x: MARGIN, y: POSITIONS_Y - 50, width: 400, height: 40 },
    '모집 중인 포지션',
    2,
    '#123b63',
  ),
  ...positions.flatMap((pos, i) => buildPositionCard(pos, i)),

  /* ── Apply CTA ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcareers-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-restcareers-cta-text',
    parentId: 'tpl-restcareers-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '이력서와 자기소개서를 보내주세요. 함께할 날을 기대합니다.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-restcareers-cta-btn',
    parentId: 'tpl-restcareers-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '지원하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const restaurantCareersTemplate: PageTemplate = {
  id: 'restaurant-careers',
  name: '레스토랑 채용',
  category: 'restaurant',
  subcategory: 'careers',
  description: '채용 소개 + 모집 포지션 목록 + 지원 CTA',
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
