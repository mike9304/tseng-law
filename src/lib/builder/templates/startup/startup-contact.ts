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
const HERO_H = 300;
const DEMO_Y = HERO_H + 80;
const DEMO_H = 360;
const SUPPORT_Y = DEMO_Y + DEMO_H + 80;
const SUPPORT_H = 200;
const STAGE_H = SUPPORT_Y + SUPPORT_H + 80;

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
  createContainerNode({
    id: 'tpl-stupcon-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupcon-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '문의하기', 1, '#ffffff', 'left', 'tpl-stupcon-hero'),
  createTextNode({
    id: 'tpl-stupcon-hero-sub',
    parentId: 'tpl-stupcon-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '데모 요청이나 궁금한 점이 있으면 연락주세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Demo request ───────────────────────────────────────── */
  heading('tpl-stupcon-demo-title', { x: 80, y: DEMO_Y, width: 400, height: 50 }, '데모 요청', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-stupcon-demo-form',
    rect: { x: 80, y: DEMO_Y + 60, width: 600, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-stupcon-demo-desc',
    parentId: 'tpl-stupcon-demo-form',
    rect: { x: 24, y: 24, width: 552, height: 80 },
    text: '이름, 이메일, 회사명, 팀 규모를 입력해 주세요. 전담 매니저가 맞춤 데모를 준비해 드립니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-stupcon-demo-btn',
    parentId: 'tpl-stupcon-demo-form',
    rect: { x: 24, y: 180, width: 180, height: 48 },
    label: '데모 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Support channels ───────────────────────────────────── */
  createTextNode({
    id: 'tpl-stupcon-email',
    rect: { x: 740, y: DEMO_Y + 60, width: 400, height: 40 },
    text: '이메일: hello@startup.co.kr',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-stupcon-chat',
    rect: { x: 740, y: DEMO_Y + 110, width: 400, height: 40 },
    text: '라이브 채팅: 평일 09:00-18:00',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-stupcon-docs',
    rect: { x: 740, y: DEMO_Y + 160, width: 400, height: 40 },
    text: '개발자 문서: docs.startup.co.kr',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),

  /* ── Office ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupcon-office',
    rect: { x: 0, y: SUPPORT_Y, width: W, height: SUPPORT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupcon-office-title', { x: 80, y: 40, width: 400, height: 50 }, '오피스', 2, '#123b63', 'left', 'tpl-stupcon-office'),
  createTextNode({
    id: 'tpl-stupcon-office-desc',
    parentId: 'tpl-stupcon-office',
    rect: { x: 80, y: 100, width: 600, height: 60 },
    text: '서울시 강남구 역삼로 234 스타트업캠퍼스 7층\n방문 미팅은 사전 예약 부탁드립니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
]);

export const startupContactTemplate: PageTemplate = {
  id: 'startup-contact',
  name: '스타트업 문의',
  category: 'startup',
  subcategory: 'contact',
  description: '데모 요청 영역 + 지원 채널 + 오피스',
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
