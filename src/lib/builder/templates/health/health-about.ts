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
const STORY_Y = HEADER_H + 40;
const STORY_H = 360;
const MISSION_Y = STORY_Y + STORY_H + 80;
const MISSION_H = 300;
const ACCRED_Y = MISSION_Y + MISSION_H + 80;
const ACCRED_H = 200;
const STAGE_H = ACCRED_Y + ACCRED_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthabout-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '병원 소개',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthabout-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '환자 중심의 의료 서비스를 실현하는 우리 병원을 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Facility story ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthabout-story',
    rect: { x: 0, y: STORY_Y, width: W, height: STORY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-healthabout-story-img',
    parentId: 'tpl-healthabout-story',
    rect: { x: MARGIN, y: 40, width: 450, height: 280 },
    src: '/images/placeholder-hospital.jpg',
    alt: '병원 건물 외관',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-healthabout-story-title',
    { x: 580, y: 40, width: 400, height: 44 },
    '우리의 이야기',
    2,
    '#123b63',
    'left',
    'tpl-healthabout-story',
  ),
  createTextNode({
    id: 'tpl-healthabout-story-desc',
    parentId: 'tpl-healthabout-story',
    rect: { x: 580, y: 100, width: 500, height: 200 },
    text: '2005년 개원 이래 20년간 지역 사회의 건강을 책임져 왔습니다. 최신 의료 장비와 전문 의료진을 갖추고, 환자 한 분 한 분에게 최선의 진료를 제공하고 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Mission / Vision ────────────────────────────────────── */
  heading(
    'tpl-healthabout-mission-title',
    { x: MARGIN, y: MISSION_Y, width: 500, height: 50 },
    '미션 & 비전',
    2,
    '#123b63',
  ),
  createContainerNode({
    id: 'tpl-healthabout-mission-box',
    rect: { x: MARGIN, y: MISSION_Y + 70, width: 500, height: 200 },
    background: '#123b63',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-healthabout-mission-label',
    { x: 32, y: 20, width: 200, height: 36 },
    '미션',
    3,
    '#e8a838',
    'left',
    'tpl-healthabout-mission-box',
  ),
  createTextNode({
    id: 'tpl-healthabout-mission-text',
    parentId: 'tpl-healthabout-mission-box',
    rect: { x: 32, y: 64, width: 436, height: 100 },
    text: '모든 환자에게 최고 수준의 의료 서비스를 제공하며, 건강한 사회를 만드는 데 기여합니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
  createContainerNode({
    id: 'tpl-healthabout-vision-box',
    rect: { x: 620, y: MISSION_Y + 70, width: 500, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 32,
  }),
  heading(
    'tpl-healthabout-vision-label',
    { x: 32, y: 20, width: 200, height: 36 },
    '비전',
    3,
    '#123b63',
    'left',
    'tpl-healthabout-vision-box',
  ),
  createTextNode({
    id: 'tpl-healthabout-vision-text',
    parentId: 'tpl-healthabout-vision-box',
    rect: { x: 32, y: 64, width: 436, height: 100 },
    text: '최첨단 의료 기술과 따뜻한 돌봄으로 지역 사회에서 가장 신뢰받는 병원이 되겠습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Accreditations ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthabout-accred',
    rect: { x: 0, y: ACCRED_Y, width: W, height: ACCRED_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-healthabout-accred-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '인증 및 수상',
    2,
    '#123b63',
    'left',
    'tpl-healthabout-accred',
  ),
  createTextNode({
    id: 'tpl-healthabout-accred-desc',
    parentId: 'tpl-healthabout-accred',
    rect: { x: MARGIN, y: 100, width: 800, height: 60 },
    text: '보건복지부 의료기관 인증 | JCI 국제 의료기관 인증 | 환자안전 우수기관 선정 | 지역사회 봉사 공헌상',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
]);

export const healthAboutTemplate: PageTemplate = {
  id: 'health-about',
  name: '병원 소개',
  category: 'health',
  subcategory: 'about',
  description: '시설 스토리 + 미션/비전 + 인증 및 수상 내역',
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
