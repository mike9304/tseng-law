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
const FORM_Y = HEADER_H + 40;
const FORM_H = 400;
const SOCIAL_Y = FORM_Y + FORM_H + 80;
const SOCIAL_H = 200;
const STAGE_H = SOCIAL_Y + SOCIAL_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativecontact-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '프로젝트 문의', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativecontact-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '다음 프로젝트에 대해 이야기해 주세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  createContainerNode({
    id: 'tpl-creativecontact-form',
    rect: { x: MARGIN, y: FORM_Y, width: 600, height: FORM_H },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading('tpl-creativecontact-form-title', { x: 32, y: 24, width: 400, height: 40 }, '프로젝트 의뢰', 2, '#123b63', 'left', 'tpl-creativecontact-form'),
  createTextNode({
    id: 'tpl-creativecontact-form-desc',
    parentId: 'tpl-creativecontact-form',
    rect: { x: 32, y: 80, width: 500, height: 100 },
    text: '프로젝트 유형, 예산, 일정 등을 알려주시면 맞춤 제안서를 준비해 드립니다. 초기 상담은 무료입니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-creativecontact-form-btn',
    parentId: 'tpl-creativecontact-form',
    rect: { x: 32, y: 320, width: 180, height: 48 },
    label: '의뢰하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  createContainerNode({
    id: 'tpl-creativecontact-info',
    rect: { x: 720, y: FORM_Y, width: 480, height: FORM_H },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading('tpl-creativecontact-info-title', { x: 32, y: 24, width: 400, height: 40 }, '연락처', 2, '#ffffff', 'left', 'tpl-creativecontact-info'),
  createTextNode({
    id: 'tpl-creativecontact-phone',
    parentId: 'tpl-creativecontact-info',
    rect: { x: 32, y: 90, width: 400, height: 30 },
    text: '전화: 02-1234-5678',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-creativecontact-email',
    parentId: 'tpl-creativecontact-info',
    rect: { x: 32, y: 130, width: 400, height: 30 },
    text: '이메일: hello@creative-example.kr',
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  }),
  createTextNode({
    id: 'tpl-creativecontact-address',
    parentId: 'tpl-creativecontact-info',
    rect: { x: 32, y: 180, width: 400, height: 40 },
    text: '서울시 성수동 크리에이티브 빌딩 5층',
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  }),

  /* ── Social links ────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-creativecontact-social',
    rect: { x: 0, y: SOCIAL_Y, width: W, height: SOCIAL_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-creativecontact-social-title', { x: MARGIN, y: 40, width: 300, height: 40 }, 'SNS', 2, '#123b63', 'left', 'tpl-creativecontact-social'),
  createTextNode({
    id: 'tpl-creativecontact-social-links',
    parentId: 'tpl-creativecontact-social',
    rect: { x: MARGIN, y: 100, width: 600, height: 40 },
    text: 'Instagram | Behance | Dribbble | LinkedIn | YouTube',
    fontSize: 16,
    color: '#123b63',
    fontWeight: 'medium',
    lineHeight: 1.5,
  }),
]);

export const creativeContactTemplate: PageTemplate = {
  id: 'creative-contact',
  name: '프로젝트 문의',
  category: 'creative',
  subcategory: 'contact',
  description: '프로젝트 의뢰 폼 + 스튜디오 위치 + SNS 링크',
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
