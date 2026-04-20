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
const STORY_Y = HERO_H + 80;
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
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelabout-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-travelabout-hero-img',
    parentId: 'tpl-travelabout-hero',
    rect: { x: 640, y: 0, width: 640, height: HERO_H },
    src: '/images/placeholder-travel-office.jpg',
    alt: '여행사 사무실',
    style: { opacity: 60, borderRadius: 0 },
  }),
  heading(
    'tpl-travelabout-hero-title',
    { x: 80, y: 140, width: 520, height: 70 },
    '여행사 소개',
    1,
    '#ffffff',
    'left',
    'tpl-travelabout-hero',
  ),
  createTextNode({
    id: 'tpl-travelabout-hero-sub',
    parentId: 'tpl-travelabout-hero',
    rect: { x: 80, y: 230, width: 480, height: 50 },
    text: '15년간 10만 명의 여행자와 함께한 신뢰의 여행 파트너.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    lineHeight: 1.5,
  }),

  /* ── Agency story ────────────────────────────────────────── */
  heading(
    'tpl-travelabout-story-title',
    { x: 80, y: STORY_Y, width: 400, height: 50 },
    '우리의 이야기',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelabout-story-p1',
    rect: { x: 80, y: STORY_Y + 60, width: 1120, height: 80 },
    text: '2010년 설립 이래, 단순한 패키지 여행이 아닌 고객 한 분 한 분의 이야기가 담긴 맞춤 여행을 설계해 왔습니다. KATA(한국여행업협회) 정회원으로 신뢰할 수 있는 서비스를 제공합니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),
  createTextNode({
    id: 'tpl-travelabout-story-p2',
    rect: { x: 80, y: STORY_Y + 160, width: 1120, height: 60 },
    text: '전 세계 50개국 이상의 현지 파트너 네트워크를 보유하고 있으며, 24시간 긴급 지원 시스템을 운영합니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Team & certifications ───────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelabout-team',
    rect: { x: 0, y: TEAM_Y, width: W, height: TEAM_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-travelabout-team-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '팀 & 인증',
    2,
    '#123b63',
    'left',
    'tpl-travelabout-team',
  ),
  createContainerNode({
    id: 'tpl-travelabout-cert-1',
    parentId: 'tpl-travelabout-team',
    rect: { x: 80, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelabout-cert-1-title', { x: 24, y: 20, width: 302, height: 36 }, '전문 플래너팀', 3, '#123b63', 'left', 'tpl-travelabout-cert-1'),
  createTextNode({
    id: 'tpl-travelabout-cert-1-desc',
    parentId: 'tpl-travelabout-cert-1',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '각 지역 전문 여행 플래너 15명이 최적의 일정을 설계합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelabout-cert-2',
    parentId: 'tpl-travelabout-team',
    rect: { x: 460, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelabout-cert-2-title', { x: 24, y: 20, width: 302, height: 36 }, '공인 인증', 3, '#123b63', 'left', 'tpl-travelabout-cert-2'),
  createTextNode({
    id: 'tpl-travelabout-cert-2-desc',
    parentId: 'tpl-travelabout-cert-2',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: 'KATA 정회원, IATA 공인, 여행보증보험 5억원 가입.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-travelabout-cert-3',
    parentId: 'tpl-travelabout-team',
    rect: { x: 840, y: 110, width: 350, height: 140 },
    background: '#ffffff',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-travelabout-cert-3-title', { x: 24, y: 20, width: 302, height: 36 }, '현지 파트너', 3, '#123b63', 'left', 'tpl-travelabout-cert-3'),
  createTextNode({
    id: 'tpl-travelabout-cert-3-desc',
    parentId: 'tpl-travelabout-cert-3',
    rect: { x: 24, y: 64, width: 302, height: 50 },
    text: '50개국 200개 이상의 검증된 현지 파트너와 협력합니다.',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
]);

export const travelAboutTemplate: PageTemplate = {
  id: 'travel-about',
  name: '여행사 소개',
  category: 'travel',
  subcategory: 'about',
  description: '히어로 이미지 + 여행사 이야기 + 팀/인증 카드(3개)',
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
