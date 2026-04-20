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
const HERO_H = 300;
const STORY_Y = HERO_H + 80;
const STORY_H = 300;
const FACILITY_Y = STORY_Y + STORY_H + 80;
const FACILITY_H = 300;
const MISSION_Y = FACILITY_Y + FACILITY_H + 80;
const MISSION_H = 240;
const STAGE_H = MISSION_Y + MISSION_H + 80;

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
    id: 'tpl-petabt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petabt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '병원 소개', 1, '#ffffff', 'left', 'tpl-petabt-hero'),
  createTextNode({
    id: 'tpl-petabt-hero-sub',
    parentId: 'tpl-petabt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '반려동물과 보호자를 위한 최선의 진료를 약속합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Clinic story ───────────────────────────────────────── */
  heading('tpl-petabt-story-title', { x: 80, y: STORY_Y, width: 400, height: 50 }, '병원 이야기', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-petabt-story-desc',
    rect: { x: 80, y: STORY_Y + 60, width: 600, height: 180 },
    text: '2010년 개원 이래 15,000마리 이상의 반려동물을 진료해 왔습니다. 내과, 외과, 치과, 피부과 등 각 분야 전문 수의사가 상주하며, 최신 의료 장비로 정확한 진단과 치료를 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
  createImageNode({
    id: 'tpl-petabt-story-img',
    rect: { x: 740, y: STORY_Y + 60, width: 460, height: 200 },
    src: '/images/placeholder-vet-clinic.jpg',
    alt: '동물병원 외관',
    style: { borderRadius: 12 },
  }),

  /* ── Facility tour ──────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-petabt-facility',
    rect: { x: 0, y: FACILITY_Y, width: W, height: FACILITY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-petabt-fac-title', { x: 80, y: 40, width: 400, height: 50 }, '시설 안내', 2, '#123b63', 'left', 'tpl-petabt-facility'),
  createImageNode({
    id: 'tpl-petabt-fac-img-1',
    parentId: 'tpl-petabt-facility',
    rect: { x: 80, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-vet-surgery.jpg',
    alt: '수술실',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-petabt-fac-img-2',
    parentId: 'tpl-petabt-facility',
    rect: { x: 460, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-vet-ward.jpg',
    alt: '입원실',
    style: { borderRadius: 8 },
  }),
  createImageNode({
    id: 'tpl-petabt-fac-img-3',
    parentId: 'tpl-petabt-facility',
    rect: { x: 840, y: 110, width: 350, height: 160 },
    src: '/images/placeholder-vet-waiting.jpg',
    alt: '대기실',
    style: { borderRadius: 8 },
  }),

  /* ── Mission ────────────────────────────────────────────── */
  heading('tpl-petabt-mission-title', { x: 80, y: MISSION_Y, width: 400, height: 50 }, '우리의 사명', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-petabt-mission-desc',
    rect: { x: 80, y: MISSION_Y + 60, width: 800, height: 120 },
    text: '모든 반려동물이 건강하고 행복한 삶을 누릴 수 있도록 최선의 의료 서비스를 제공합니다. 보호자와의 소통을 최우선으로 생각하며, 투명한 진료와 합리적인 비용으로 신뢰받는 병원이 되겠습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const petAboutTemplate: PageTemplate = {
  id: 'pet-about',
  name: '동물병원 소개',
  category: 'pet',
  subcategory: 'about',
  description: '병원 이야기 + 시설 투어 + 사명',
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
