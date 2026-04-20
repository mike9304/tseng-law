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
const INQUIRY_H = 400;
const CALENDAR_Y = INQUIRY_H + 80;
const CALENDAR_H = 300;
const LOCATION_Y = CALENDAR_Y + CALENDAR_H + 80;
const LOCATION_H = 240;
const STAGE_H = LOCATION_Y + LOCATION_H + 80;

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
  /* ── Session inquiry ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photocontact-inquiry',
    rect: { x: 0, y: 0, width: W, height: INQUIRY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photocontact-title',
    { x: 80, y: 60, width: 500, height: 50 },
    '촬영 문의',
    1,
    '#ffffff',
    'left',
    'tpl-photocontact-inquiry',
  ),
  createTextNode({
    id: 'tpl-photocontact-desc',
    parentId: 'tpl-photocontact-inquiry',
    rect: { x: 80, y: 130, width: 600, height: 80 },
    text: '원하시는 촬영에 대해 알려주세요. 24시간 이내에 답변 드리겠습니다.\n이메일: photo@studio.co.kr\n전화: 02-555-1234',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.8,
  }),
  createContainerNode({
    id: 'tpl-photocontact-form',
    parentId: 'tpl-photocontact-inquiry',
    rect: { x: 80, y: 240, width: 500, height: 120 },
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-photocontact-form-text',
    parentId: 'tpl-photocontact-form',
    rect: { x: 24, y: 16, width: 452, height: 40 },
    text: '이름 / 연락처 / 촬영 유형 / 희망 날짜',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.5,
  }),
  createButtonNode({
    id: 'tpl-photocontact-form-btn',
    parentId: 'tpl-photocontact-form',
    rect: { x: 24, y: 66, width: 160, height: 44 },
    label: '문의 보내기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Calendar placeholder ───────────────────────────────── */
  heading(
    'tpl-photocontact-cal-title',
    { x: 80, y: CALENDAR_Y, width: 400, height: 50 },
    '촬영 일정',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-photocontact-cal',
    rect: { x: 80, y: CALENDAR_Y + 70, width: W - 160, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-photocontact-cal-text',
    parentId: 'tpl-photocontact-cal',
    rect: { x: 24, y: 60, width: 600, height: 40 },
    text: '캘린더 위젯 영역 — 원하시는 날짜를 선택하세요',
    fontSize: 16,
    color: '#6b7280',
    align: 'center',
  }),

  /* ── Studio location ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photocontact-loc',
    rect: { x: 0, y: LOCATION_Y, width: W, height: LOCATION_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photocontact-loc-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '스튜디오 위치',
    2,
    '#123b63',
    'left',
    'tpl-photocontact-loc',
  ),
  createTextNode({
    id: 'tpl-photocontact-loc-addr',
    parentId: 'tpl-photocontact-loc',
    rect: { x: 80, y: 110, width: 500, height: 80 },
    text: '서울시 마포구 연남로 45 스튜디오빌딩 3층\n지하철 2호선 홍대입구역 3번 출구 도보 5분\n주차 가능 (빌딩 내 지하주차장)',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
]);

export const photographyContactTemplate: PageTemplate = {
  id: 'photography-contact',
  name: '사진 스튜디오 문의',
  category: 'photography',
  subcategory: 'contact',
  description: '촬영 문의 영역 + 캘린더 플레이스홀더 + 스튜디오 위치',
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
