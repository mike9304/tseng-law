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
const STORY_H = 500;
const EQUIPMENT_Y = STORY_H + 80;
const EQUIPMENT_H = 300;
const AWARDS_Y = EQUIPMENT_Y + EQUIPMENT_H + 80;
const AWARDS_H = 260;
const PHILOSOPHY_Y = AWARDS_Y + AWARDS_H + 80;
const PHILOSOPHY_H = 240;
const STAGE_H = PHILOSOPHY_Y + PHILOSOPHY_H + 80;

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
  /* ── Photographer story ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoabout-story',
    rect: { x: 0, y: 0, width: W, height: STORY_H },
    background: '#ffffff',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-photoabout-portrait',
    parentId: 'tpl-photoabout-story',
    rect: { x: 80, y: 60, width: 400, height: 380 },
    src: '/images/placeholder-photographer.jpg',
    alt: '포토그래퍼 프로필 사진',
    style: { borderRadius: 12 },
  }),
  heading(
    'tpl-photoabout-name',
    { x: 540, y: 80, width: 600, height: 50 },
    '김영진 포토그래퍼',
    1,
    '#123b63',
    'left',
    'tpl-photoabout-story',
  ),
  createTextNode({
    id: 'tpl-photoabout-bio',
    parentId: 'tpl-photoabout-story',
    rect: { x: 540, y: 150, width: 620, height: 260 },
    text: '서울예술대학교 사진학과를 졸업하고, 12년간 다양한 분야에서 활동해 왔습니다. 자연광을 활용한 따뜻하고 감성적인 촬영 스타일을 추구하며, 한 장의 사진에 이야기를 담아내는 것을 목표로 합니다.\n\n국내외 다수의 전시회에 참여하였으며, 웨딩, 인물, 기업 촬영 등 폭넓은 경험을 보유하고 있습니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Equipment ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoabout-equip',
    rect: { x: 0, y: EQUIPMENT_Y, width: W, height: EQUIPMENT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoabout-equip-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '촬영 장비',
    2,
    '#123b63',
    'left',
    'tpl-photoabout-equip',
  ),
  createTextNode({
    id: 'tpl-photoabout-equip-list',
    parentId: 'tpl-photoabout-equip',
    rect: { x: 80, y: 110, width: 800, height: 140 },
    text: '• 카메라: Canon EOS R5, Sony A7 IV\n• 렌즈: 24-70mm f/2.8, 85mm f/1.4, 70-200mm f/2.8\n• 조명: Profoto B10, Godox AD600\n• 드론: DJI Mavic 3 Pro',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Awards ─────────────────────────────────────────────── */
  heading(
    'tpl-photoabout-awards-title',
    { x: 80, y: AWARDS_Y, width: 400, height: 50 },
    '수상 경력',
    2,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-photoabout-awards-list',
    rect: { x: 80, y: AWARDS_Y + 60, width: 800, height: 160 },
    text: '• 2025 한국사진작가협회 올해의 작가상\n• 2024 서울국제사진전 금상\n• 2023 아시아 웨딩포토그래피 어워드 대상\n• 2022 내셔널지오그래픽 한국대회 입선',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),

  /* ── Philosophy ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-photoabout-phil',
    rect: { x: 0, y: PHILOSOPHY_Y, width: W, height: PHILOSOPHY_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photoabout-phil-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '촬영 철학',
    2,
    '#ffffff',
    'left',
    'tpl-photoabout-phil',
  ),
  createTextNode({
    id: 'tpl-photoabout-phil-text',
    parentId: 'tpl-photoabout-phil',
    rect: { x: 80, y: 110, width: 800, height: 80 },
    text: '"좋은 사진은 기술이 아닌 마음에서 나옵니다. 피사체와의 교감을 통해 가장 자연스럽고 아름다운 순간을 포착하는 것이 저의 사진 철학입니다."',
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
]);

export const photographyAboutTemplate: PageTemplate = {
  id: 'photography-about',
  name: '사진작가 소개',
  category: 'photography',
  subcategory: 'about',
  description: '포토그래퍼 스토리 + 장비 + 수상 경력 + 촬영 철학',
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
