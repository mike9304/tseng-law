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
const WRITE_H = 360;
const EDITORIAL_Y = WRITE_H + 80;
const EDITORIAL_H = 240;
const SOCIAL_Y = EDITORIAL_Y + EDITORIAL_H + 80;
const SOCIAL_H = 160;
const STAGE_H = SOCIAL_Y + SOCIAL_H + 80;

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
  /* ── Write for us ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogcontact-write',
    rect: { x: 0, y: 0, width: W, height: WRITE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogcontact-title',
    { x: 80, y: 60, width: 500, height: 50 },
    '기고 안내',
    1,
    '#ffffff',
    'left',
    'tpl-blogcontact-write',
  ),
  createTextNode({
    id: 'tpl-blogcontact-write-desc',
    parentId: 'tpl-blogcontact-write',
    rect: { x: 80, y: 130, width: 700, height: 100 },
    text: '우리 매거진에 글을 기고하고 싶으신가요? 라이프스타일, 테크, 여행, 문화 등\n다양한 분야의 기고를 환영합니다. 아래 이메일로 주제와 간단한 소개를 보내주세요.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.8,
  }),
  createTextNode({
    id: 'tpl-blogcontact-write-email',
    parentId: 'tpl-blogcontact-write',
    rect: { x: 80, y: 250, width: 400, height: 32 },
    text: 'contribute@magazine.co.kr',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'bold',
  }),
  createButtonNode({
    id: 'tpl-blogcontact-write-btn',
    parentId: 'tpl-blogcontact-write',
    rect: { x: 80, y: 296, width: 180, height: 44 },
    label: '기고 신청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Editorial contact ──────────────────────────────────── */
  heading(
    'tpl-blogcontact-edit-title',
    { x: 80, y: EDITORIAL_Y, width: 400, height: 50 },
    '편집부 연락처',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-blogcontact-edit',
    rect: { x: 80, y: EDITORIAL_Y + 70, width: W - 160, height: 140 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-blogcontact-edit-info',
    parentId: 'tpl-blogcontact-edit',
    rect: { x: 24, y: 16, width: 600, height: 100 },
    text: '일반 문의: hello@magazine.co.kr\n광고/협찬: ad@magazine.co.kr\n전화: 02-333-4567\n운영시간: 평일 10:00 - 18:00',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Social links ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-blogcontact-social',
    rect: { x: 0, y: SOCIAL_Y, width: W, height: SOCIAL_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-blogcontact-social-title',
    { x: 80, y: 30, width: 400, height: 40 },
    '소셜 미디어',
    2,
    '#123b63',
    'left',
    'tpl-blogcontact-social',
  ),
  createTextNode({
    id: 'tpl-blogcontact-social-links',
    parentId: 'tpl-blogcontact-social',
    rect: { x: 80, y: 80, width: 600, height: 32 },
    text: 'Instagram · Twitter · Facebook · YouTube · LinkedIn',
    fontSize: 16,
    color: '#e8a838',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-blogcontact-social-handle',
    parentId: 'tpl-blogcontact-social',
    rect: { x: 80, y: 120, width: 300, height: 24 },
    text: '@magazine_kr',
    fontSize: 14,
    color: '#6b7280',
  }),
]);

export const blogContactTemplate: PageTemplate = {
  id: 'blog-contact',
  name: '블로그 연락처',
  category: 'blog',
  subcategory: 'contact',
  description: '기고 안내 + 편집부 연락처 + 소셜 미디어 링크',
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
