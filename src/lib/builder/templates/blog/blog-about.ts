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
const BIO_H = 400;
const STORY_Y = BIO_H + 80;
const STORY_H = 260;
const TEAM_Y = STORY_Y + STORY_H + 80;
const TEAM_H = 300;
const STAGE_H = TEAM_Y + TEAM_H + 80;

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
  /* ── Author bio ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogabout-bio',
    rect: { x: 0, y: 0, width: W, height: BIO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-blogabout-photo',
    parentId: 'tpl-blogabout-bio',
    rect: { x: 80, y: 60, width: 280, height: 280 },
    src: '/images/placeholder-author.jpg',
    alt: '에디터 프로필 사진',
    style: { borderRadius: 140 },
  }),
  heading(
    'tpl-blogabout-name',
    { x: 420, y: 80, width: 700, height: 50 },
    '김민지',
    1,
    '#ffffff',
    'left',
    'tpl-blogabout-bio',
  ),
  createTextNode({
    id: 'tpl-blogabout-role',
    parentId: 'tpl-blogabout-bio',
    rect: { x: 420, y: 140, width: 300, height: 28 },
    text: '편집장 · 라이프스타일 칼럼니스트',
    fontSize: 16,
    color: '#e8a838',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-blogabout-intro',
    parentId: 'tpl-blogabout-bio',
    rect: { x: 420, y: 190, width: 700, height: 120 },
    text: '10년간 라이프스타일 매거진에서 활동하며, 일상 속 영감과 트렌드를 글로 전하고 있습니다. "작은 변화가 큰 행복을 만든다"는 신념으로 독자들과 소통합니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
  }),

  /* ── Publication story ──────────────────────────────────── */
  heading(
    'tpl-blogabout-story-title',
    { x: 80, y: STORY_Y, width: 400, height: 50 },
    '매거진 이야기',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-blogabout-story-text',
    rect: { x: 80, y: STORY_Y + 60, width: W - 160, height: 160 },
    text: '2020년에 시작된 우리 매거진은 "더 나은 일상을 위한 영감"을 모토로 라이프스타일, 문화, 테크, 여행 등 다양한 분야의 콘텐츠를 제공하고 있습니다.\n\n매주 5개 이상의 오리지널 콘텐츠를 발행하며, 10만 명 이상의 독자가 뉴스레터를 구독하고 있습니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Editorial team ─────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogabout-team',
    rect: { x: 0, y: TEAM_Y, width: W, height: TEAM_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogabout-team-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '편집팀',
    2,
    '#123b63',
    'left',
    'tpl-blogabout-team',
  ),
  createContainerNode({
    id: 'tpl-blogabout-team-1',
    parentId: 'tpl-blogabout-team',
    rect: { x: 80, y: 110, width: 340, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-blogabout-team-1-name', { x: 24, y: 12, width: 200, height: 28 }, '이수진', 3, '#123b63', 'left', 'tpl-blogabout-team-1'),
  createTextNode({
    id: 'tpl-blogabout-team-1-role',
    parentId: 'tpl-blogabout-team-1',
    rect: { x: 24, y: 46, width: 292, height: 24 },
    text: '테크·디지털 에디터',
    fontSize: 14,
    color: '#6b7280',
  }),
  createTextNode({
    id: 'tpl-blogabout-team-1-bio',
    parentId: 'tpl-blogabout-team-1',
    rect: { x: 24, y: 78, width: 292, height: 40 },
    text: 'IT 전문 기자 출신, 기술이 바꾸는 일상을 글로 전합니다.',
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 1.4,
  }),
  createContainerNode({
    id: 'tpl-blogabout-team-2',
    parentId: 'tpl-blogabout-team',
    rect: { x: 460, y: 110, width: 340, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-blogabout-team-2-name', { x: 24, y: 12, width: 200, height: 28 }, '박준영', 3, '#123b63', 'left', 'tpl-blogabout-team-2'),
  createTextNode({
    id: 'tpl-blogabout-team-2-role',
    parentId: 'tpl-blogabout-team-2',
    rect: { x: 24, y: 46, width: 292, height: 24 },
    text: '문화·여행 에디터',
    fontSize: 14,
    color: '#6b7280',
  }),
  createTextNode({
    id: 'tpl-blogabout-team-2-bio',
    parentId: 'tpl-blogabout-team-2',
    rect: { x: 24, y: 78, width: 292, height: 40 },
    text: '30개국 이상을 여행하며 문화와 여행의 매력을 전합니다.',
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 1.4,
  }),
  createContainerNode({
    id: 'tpl-blogabout-team-3',
    parentId: 'tpl-blogabout-team',
    rect: { x: 840, y: 110, width: 340, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-blogabout-team-3-name', { x: 24, y: 12, width: 200, height: 28 }, '최하나', 3, '#123b63', 'left', 'tpl-blogabout-team-3'),
  createTextNode({
    id: 'tpl-blogabout-team-3-role',
    parentId: 'tpl-blogabout-team-3',
    rect: { x: 24, y: 46, width: 292, height: 24 },
    text: '건강·웰니스 에디터',
    fontSize: 14,
    color: '#6b7280',
  }),
  createTextNode({
    id: 'tpl-blogabout-team-3-bio',
    parentId: 'tpl-blogabout-team-3',
    rect: { x: 24, y: 78, width: 292, height: 40 },
    text: '건강 전문가로서 웰니스 라이프를 위한 정보를 나눕니다.',
    fontSize: 13,
    color: '#1f2937',
    lineHeight: 1.4,
  }),
]);

export const blogAboutTemplate: PageTemplate = {
  id: 'blog-about',
  name: '블로그 소개',
  category: 'blog',
  subcategory: 'about',
  description: '저자 바이오 + 매거진 이야기 + 편집팀 소개',
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
