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
const SIGNUP_H = 400;
const ISSUES_Y = SIGNUP_H + 80;
const ISSUES_H = 320;
const STAGE_H = ISSUES_Y + ISSUES_H + 80;

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

const issues = [
  { title: '#52 · 봄맞이 인테리어 트렌드', date: '2026.04.07' },
  { title: '#51 · 디지털 노마드 가이드', date: '2026.03.31' },
  { title: '#50 · 2026 독서 리스트', date: '2026.03.24' },
];

function issueCard(n: number): BuilderCanvasNode[] {
  const x = 80 + (n - 1) * 390;
  const cId = `tpl-blognews-issue-${n}`;
  const issue = issues[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y: ISSUES_Y + 70, width: 360, height: 220 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${cId}-title`, { x: 24, y: 16, width: 312, height: 36 }, issue.title, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-date`,
      parentId: cId,
      rect: { x: 24, y: 60, width: 200, height: 24 },
      text: issue.date,
      fontSize: 13,
      color: '#6b7280',
    }),
    createTextNode({
      id: `${cId}-preview`,
      parentId: cId,
      rect: { x: 24, y: 96, width: 312, height: 60 },
      text: '이번 호에서는 다양한 주제의 엄선된 콘텐츠를 준비했습니다. 지난 뉴스레터를 확인해 보세요.',
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 24, y: 168, width: 120, height: 36 },
      label: '읽어보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Newsletter signup ──────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blognews-signup',
    rect: { x: 0, y: 0, width: W, height: SIGNUP_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blognews-title',
    { x: 80, y: 80, width: 700, height: 60 },
    '뉴스레터 구독',
    1,
    '#ffffff',
    'left',
    'tpl-blognews-signup',
  ),
  createTextNode({
    id: 'tpl-blognews-desc',
    parentId: 'tpl-blognews-signup',
    rect: { x: 80, y: 160, width: 600, height: 80 },
    text: '매주 월요일, 엄선된 라이프스타일 콘텐츠를 이메일로 받아보세요.\n10만 명 이상의 독자가 구독하는 뉴스레터입니다.',
    fontSize: 17,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
  }),
  createContainerNode({
    id: 'tpl-blognews-form',
    parentId: 'tpl-blognews-signup',
    rect: { x: 80, y: 270, width: 500, height: 60 },
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
  }),
  createTextNode({
    id: 'tpl-blognews-form-placeholder',
    parentId: 'tpl-blognews-form',
    rect: { x: 16, y: 16, width: 300, height: 28 },
    text: '이메일 주소를 입력하세요',
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
  }),
  createButtonNode({
    id: 'tpl-blognews-form-btn',
    parentId: 'tpl-blognews-signup',
    rect: { x: 600, y: 274, width: 140, height: 52 },
    label: '구독하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Past issues (3 cards) ──────────────────────────────── */
  heading(
    'tpl-blognews-issues-title',
    { x: 80, y: ISSUES_Y, width: 400, height: 50 },
    '지난 뉴스레터',
    2,
    '#123b63',
    'left',
  ),
  ...issueCard(1),
  ...issueCard(2),
  ...issueCard(3),
]);

export const blogNewsletterTemplate: PageTemplate = {
  id: 'blog-newsletter',
  name: '블로그 뉴스레터',
  category: 'blog',
  subcategory: 'newsletter',
  description: '뉴스레터 구독 랜딩 + 지난 호 프리뷰(3개)',
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
