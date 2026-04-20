import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const INFO_Y = HERO_H + 80;
const INFO_H = 400;
const STAGE_H = INFO_Y + INFO_H + 80;

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
    id: 'tpl-cafecon-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafecon-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '오시는 길', 1, '#ffffff', 'left', 'tpl-cafecon-hero'),
  createTextNode({
    id: 'tpl-cafecon-hero-sub',
    parentId: 'tpl-cafecon-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '언제든 편하게 방문해 주세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Info cards ─────────────────────────────────────────── */
  heading('tpl-cafecon-info-title', { x: 80, y: INFO_Y, width: 400, height: 50 }, '방문 정보', 2, '#123b63', 'left'),

  createContainerNode({
    id: 'tpl-cafecon-location',
    rect: { x: 80, y: INFO_Y + 70, width: 360, height: 280 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-cafecon-loc-t', { x: 24, y: 24, width: 312, height: 36 }, '위치 & 지도', 3, '#123b63', 'left', 'tpl-cafecon-location'),
  createTextNode({
    id: 'tpl-cafecon-loc-d',
    parentId: 'tpl-cafecon-location',
    rect: { x: 24, y: 70, width: 312, height: 60 },
    text: '서울시 마포구 연남로 45 1층\n지하철 홍대입구역 3번 출구 도보 5분',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.6,
  }),

  createContainerNode({
    id: 'tpl-cafecon-hours',
    rect: { x: 470, y: INFO_Y + 70, width: 360, height: 280 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-cafecon-hours-t', { x: 24, y: 24, width: 312, height: 36 }, '영업시간', 3, '#123b63', 'left', 'tpl-cafecon-hours'),
  createTextNode({
    id: 'tpl-cafecon-hours-d',
    parentId: 'tpl-cafecon-hours',
    rect: { x: 24, y: 70, width: 312, height: 100 },
    text: '월~금: 07:00 - 22:00\n토요일: 08:00 - 22:00\n일요일: 09:00 - 21:00\n공휴일: 09:00 - 20:00',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.6,
  }),

  createContainerNode({
    id: 'tpl-cafecon-extra',
    rect: { x: 860, y: INFO_Y + 70, width: 360, height: 280 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-cafecon-extra-t', { x: 24, y: 24, width: 312, height: 36 }, '편의시설', 3, '#123b63', 'left', 'tpl-cafecon-extra'),
  createTextNode({
    id: 'tpl-cafecon-extra-d',
    parentId: 'tpl-cafecon-extra',
    rect: { x: 24, y: 70, width: 312, height: 100 },
    text: 'WiFi: 무료 제공 (비밀번호 매장 내 안내)\n주차: 건물 지하 1시간 무료\n반려동물: 소형견 동반 가능\n콘센트: 전 좌석 이용 가능',
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
]);

export const cafeContactTemplate: PageTemplate = {
  id: 'cafe-contact',
  name: '카페 연락처',
  category: 'cafe',
  subcategory: 'contact',
  description: '방문 안내 + 지도 + 영업시간 + WiFi/주차 정보',
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
